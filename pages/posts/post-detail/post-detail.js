var postsData = require('../../../data/posts-data.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    //拿到全局app.js存储的globalData的值
    var globalData = app.globalData;
    //console.log(globalData)
    var postId = option.id;//此处的id是对应post点击事件传递的id值
    this.data.currentPostId = postId//给data添加currentPostId属性，改属性就是索引值
    var postData = postsData.postList[postId]//获取点击页面对应索引值的信息
    this.setData({//将点击的信息存储到data
      postData: postData
    })


    var postsCollected = wx.getStorageSync('posts_Collected')//获取本地存储的posts_Collected默认false
    //console.log(postsCollected)
    if (postsCollected) {//如果获取的posts_Collected为真就执行一下操作
      var postCollected = postsCollected[postId]//判断为true还是false
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected)
    }

    //在onload中不是异步的去执行一个数据绑定，则不需要使用this.setData()方法
    // this.data.postData = postData//此处的this.data类似于setData都是讲获取的数据存放到data里面[]
    if (app.globalData.g_isPlayingMusic){//如果我全局绑定的变量为真就去改变我本地的变量
     // this.data.isPlayingMusic=true
      this.setData({
        isPlayingMusic:true
      })
    }
    this.setMusicMonitor()
  },
  setMusicMonitor: function () {
    //监听音乐开启状态
    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      //改变全局开关变量
      app.globalData.g_isPlayingMusic=true
    })
    //监听暂停状态
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      //改变全局开关变量
      app.globalData.g_isPlayingMusic = false
    })
  },
  onColletionTap: function (event) {//给收藏图片添加的点击事件
    // var postsCollected = wx.getStorageSync('posts_Collected')
    // var postCollected = postsCollected[this.data.currentPostId]
    // //收藏编程笨收藏
    // postCollected = !postCollected
    // postsCollected[this.data.currentPostId] = postCollected
    // //更新文章是否收藏的缓存值
    // /// wx.setStorageSync('posts_Collected', postsCollected)
    // //更新数据绑定变量
    // // this.setData({
    // //   collected: postCollected
    // // })
    // this.showToast(postsCollected, postCollected)
    this.getPostsCollectedSyc();
    //this.getPostsCollectedAsy();
  },
  getPostsCollectedAsy: function () {//异步的封装方法
    var that = this;
    wx.getStorage({
      key: "posts_Collected",
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  getPostsCollectedSyc: function () {//同步的封装方法
    var postsCollected = wx.getStorageSync('posts_Collected')
    var postCollected = postsCollected[this.data.currentPostId]
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected
    this.showToast(postsCollected, postCollected)
  },
  showModal: function (postsCollected, postCollected) {
    var that = this;//this的意义在于函数上下文的调用关系
    //显示模态弹窗
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确定',
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected) {//自定义函数
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_Collected', postsCollected)
    //更新数据绑定变量
    this.setData({
      collected: postCollected
    })
    //用showtoast提示用户已经更新成功
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: 'success',
      success: function () { },
      fail: function () { }
    })
  },
  onShareTap: function (event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到扣扣',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    })
  },
  //一下是点击音乐时的逻辑处理  对不同的列表的音乐播放相对于的音乐
  onMusicTap: function (event) {
    var isPlayingMusic = this.data.isPlayingMusic;//拿到音乐播放状态
    var currentPostId = this.data.currentPostId//点击当前文章的索引值
    var postData = postsData.postList[currentPostId]//提取下当前点击音乐在列表中对应的索引值
    console.log(currentPostId)
    if (isPlayingMusic) {//给音乐一个开关按钮判断是开启还是暂停  判断isPlayingMusic为true的时候执行里面的任务
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  /**
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})