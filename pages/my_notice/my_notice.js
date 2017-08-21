// my_notice.js
const app = getApp()
Page({

  data: {
    news: [],
    page: 1,
    close: false,
    flag: false
  },

  onLoad(options) {
    const that = this
    this.firstRequest(1, data => {
      that.setData({
        news: data
      })
    })
  },

  firstRequest(page, cb) {
    wx.request({
      url: app.globalData.host_v2 + 'my/notify/comments',
      data: {
        page: page,
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          typeof cb === 'function' && cb(res.data.data)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },

  //跳转评论
  goToComment(e) {
    wx.request({
      url: app.globalData.host_v2 + 'notify/read/' + e.currentTarget.dataset.real_id,
      data: {
        _token: app.globalData._token
      },
      success: res => {
        if (200 != res.data.code) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
    wx.navigateTo({
      url: '/pages/all_comments/all_comments?id=' + e.currentTarget.dataset.id,
    })
  },

  //跳转动态
  goToArticle(e) {
    wx.navigateTo({
      url: '/pages/single_info/single_info?id=' + e.currentTarget.dataset.id,
    })
  },

  //上拉刷新
  onPullDownRefresh() {
    const that = this
    that.firstRequest(1, data => {
      that.setData({
        news: data,
        close: false,
        page: 1
      })
      wx.stopPullDownRefresh()
    })
  },

  //触底刷新
  onReachBottom() {
    const that = this
    let page = that.data.page
    let flag = that.data.flag
    let close = that.data.close

    console.log(flag, close)
    //阻止重复触发和主动关闭
    if (flag || close) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      flag: true
    })
    that.firstRequest(page + 1, data => {
      if (data.length) {
        that.setData({
          news: [...that.data.news, ...data],
          flag: false,
          page: page + 1
        })
      } else {
        that.setData({
          close: true,
          flag: false
        })
      }
      wx.hideLoading()
    })
  },

})