var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //setData()等同于把数据都放到了data里面
    this.setData({ postList: postsData.postList })

  },
  onPostTap: function (event) {//event是指默认事件  dataset所有自定义事件的集合  currentTarget是指当前点击的事件
    var postId = event.currentTarget.dataset.postid;//会自动转为小写
    //console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onready")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onshow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  //  console.log("onhide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   // console.log("onunload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   // console.log("onpullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  // onsole.log("onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   // onsole.log("onshareAppMessage")
  }
})