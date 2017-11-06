// pages/movies/movie-detail/movie-detail.js
//引用封装公共的requirest请求
var util = require("../../../utils/util.js")
//引用全局的app.jd
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id;
    console.log(movieId)
    //获取电影详情页面的接口数据
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData, 'GET')
  },
  //此处是获取成功数据的处理  筛选需要的数据  重点处理数据为空的处理
  processDoubanData: function (data) {
    if(!data){
      return;
    }
    var director = {//处理director
      avatar: "data.images",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {//判断是否有没获取到值
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    //获取存储需要的值
    var movie = {
      movieImg: data.images ? data.images.large : "",//电影图片
      country: data.countries[0],//国家
      title: data.title,//标题
      originalTitle: data.original_title,//电影的原始别名
      wishCount: data.wish_count,//多少人喜欢
      commentCount: data.comments_count,//多少人评论
      year: data.year,
      generes: data.genres.join("、"),//电影的类型用字符串表示
      stars: util.convertToStarsArray(data.rating.stars),//星星个数处理
      score: data.rating.average,//电影评分
      director: director,//处理的js对象
      casts: util.convertToCastString(data.casts),//影人信息
      castsInfo: util.convertToCastInfos(data.casts),//作品介绍
      summary: data.summary//剧情的简介
    }
    //将处理好的数据填充到data  里面的movie里面
    this.setData({
      movie: movie
    })
  },
  //查看图片显示的点击事件
  viewMoviePostImg:function(e){
    var src=e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],//当前图片的链接地址
      current:src//当前url数组下的图片
    })
  },
  /**
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