// mine.js
const app = getApp()

Page({

  data: {
    userInfo: null,
    news: 0
  },

  onLoad(options) {

  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.userInfo) {
      this.getNewNews()
    }
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

  //获取消息通知
  getNewNews() {
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'my/notify/comments',
      data: {
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            news: res.data.data.length
          })
          app.globalData.news = res.data.data
        }
      }
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

  //消息通知
  goToMyNews() {
    wx.navigateTo({
      url: '/pages/my_notice/my_notice',
    })
  },

  //关于我们
  goToUs() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  }
})