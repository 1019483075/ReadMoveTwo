//此文件用于存放公共的文件  星星逻辑组件
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array;
}
//设置公共的请求方式
function http(url, callBack,method) {
  wx.request({
    url: url,
    method: method,
    header:{
      "Content-Type": "json"
    },
    success:function(res){
      callBack(res.data)
    },
    fail:function(error){
      console.log(error)
    }
  })
}
//导出
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http
}
