var util=require('../../utils/util.js')
var app = getApp()//是指获取app.js的调用方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters :{},//正在热映
    comingSoon:{},//即将上映
    top250:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.获取数据url
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";//豆瓣电影
    //console.log(top250Url)
    this.getMovieListData(inTheatersUrl,"inTheaters")//传递关键字用于区分电影类型
    this.getMovieListData(comingSoonUrl,"comingSoon")
    this.getMovieListData(top250Url,"top250")
  },
  //2.封装函数获取接口请求
  getMovieListData: function (url, settedKey) {//settedKey是指区分电影类中参数
    var that=this
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        //3.请求成功对数据进行处理
        that.processDoubanData(res.data, settedKey)
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },
  //4.封装处理数据的函数
  processDoubanData: function (moviesDouBan, settedKey){
    var movies=[]
    for (var idx in moviesDouBan.subjects ){
      var subject = moviesDouBan.subjects[idx];
      var title=subject.title;
      if(title.length>=9){
        title = title.substring(0,9)+"...";
      }
      var temp={
        stars: util.convertToStarsArray(subject.rating.stars),//星星评分
        title: title,//列表名称
        average: subject.rating.average,//评分
        coverageUrl: subject.images.large,//图片路由
        movieId: subject.id//方便跳转到电影详情页面
      }
      //存储处理后的数据
      movies.push(temp)
    }
    //区分存储的数据
    var readyData={}
    readyData[settedKey]={
      movies: movies
    }
    console.log(readyData)
    //将数据存放到data
    this.setData(readyData)
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