// mine.js
const app = getApp()

Page({

  data: {
    userInfo: null
  },

  onLoad(options) {

  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  //登录
  login() {
    const that = this
    app.getSetting((userInfo) => {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  //退出
  logout() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: res => {
        if (res.confirm) {
          that.setData({
            userInfo: null
          })
          app.globalData.userInfo = null
          wx.showToast({
            title: '退出成功',
          })
        }
      }
    })
  },

  //我发布的
  goToMyPublish() {
    wx.navigateTo({
      url: '/pages/my_publish/my_publish',
    })
  },

  //审核中
  goToChecking() {
    wx.navigateTo({
      url: '/pages/checking/checking',
    })
  },

  //我的收藏
  goToMyCollect() {
    wx.navigateTo({
      url: '/pages/my_collect/my_collect',
    })
  },

  //关于我们
  goToUs() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }
})