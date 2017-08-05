// checking.js
const app = getApp()
Page({

  data: {

    page: 1,
    flag: false,
    close: false,

    //接口数据
    publishs: null,
  },

  onLoad(options) {
    const that = this
    that.firstRequest(1, data => {
      that.setData({
        publishs: data
      })
    })
  },

  //初次请求
  firstRequest(page, cb) {
    const that = this
    wx.request({
      url: app.globalData.host + 'my/moments',
      data: {
        page: page,
        state: 1,
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: rs => {
              if (rs.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },

  //上拉刷新
  onPullDownRefresh() {
    const that = this
    that.firstRequest(1, data => {
      that.setData({
        publishs: data,
        close: false
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
          publishs: [...that.data.publishs, ...data],
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
  }

})