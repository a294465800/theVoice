// mine.js
Page({

  data: {

  },

  onLoad: function (options) {

  },

  //我发布的
  goToMyPublish() {
    wx.navigateTo({
      url: '/pages/my_publish/my_publish',
    })
  },

  //我的收藏
  goToMyCollect() {
    wx.navigateTo({
      url: '/pages/my_collect/my_collect',
    })
  }
})