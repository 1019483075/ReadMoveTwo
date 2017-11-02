var app = getApp()//引入app.js
var util = require("../../../utils/util.js")//引入公共的js
// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: "",
    movies: {},
    totalCount: 0,
    requestUrl: '',
    isEmpty: true//是指指代当前的数据是否为空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;//拿到点击更多的类型
    this.data.navigateTitle = category;
    var dataUrl = ""
    switch (category) {//判断点击更多的选项 调用对应的接口
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDoubanData, 'GET')
  },
  //movie-gride滚动事件   上拉加载技术
  onScrollLower: function (event) {
    //此处要判断每次加载的信息数量
    var nexturl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    //此处的目的是为了上拉的时候加载数据
    util.http(nexturl, this.processDoubanData, 'GET')
    //当上拉刷新的时候给一个loading的效果
    wx.showNavigationBarLoading()
  },
  //下拉刷新技术
  onPullDownRefresh:function(event){
    var refreshUrl = this.data.requestUrl +"?start=0&count=20";
    this.data.movies={}
    this.data.isEmpty=true
    util.http(refreshUrl, this.processDoubanData, 'GET')
    wx.showNavigationBarLoading()
  },
  //调用request返回成功的处理
  processDoubanData: function (moviesDouBan) {
    //console.log(moviesDouBan);
    var movies = []
    for (var idx in moviesDouBan.subjects) {
      var subject = moviesDouBan.subjects[idx];
      var title = subject.title;
      if (title.length >= 7) {
        title = title.substring(0, 7) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),//星星评分
        title: title,//列表名称
        average: subject.rating.average,//评分
        coverageUrl: subject.images.large,//图片路由
        movieId: subject.id//方便跳转到电影详情页面
      }
      //存储处理后的数据
      movies.push(temp)
    }
    var totalMovies = {}
    //判断数据是否为空  不为空就加载数据 为空就初始化  
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);//数组合并
    } else {
      totalMovies = movies;
      this.data.isEmpty = false
    }
    //将数据存放到data
    this.setData({
      //movies: movies
      movies: totalMovies
    })
    //每次在数据加载之前去加20
    this.data.totalCount += 20;
    //当刷新成功的时候隐藏loading效果aqaq'a'q'a
    wx.hideNavigationBarLoading()
    //停止刷新
    wx.stopPullDownRefresh()
  },
  /*生命周期函数--监听页面初次渲染完成  当页面准备完毕在渲染*/
  onReady: function () {
    //动态设置当前导航条的title
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,//如何拿到onready生命周期的值
      success: function (res) { }
    })
  }

})