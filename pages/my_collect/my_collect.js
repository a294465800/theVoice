// my_collect.js
const app = getApp()
Page({

  data: {

    page: 1,
    flag: false,
    close: false,
    nobody: '/images/icon/nobody.png',

    //接口数据
    collects: null,
  },

  onLoad(options) {
    const that = this
    that.firstRequest(1, data => {
      that.setData({
        collects: data
      })
    })
  },

  //初次请求
  firstRequest(page, cb) {
    const that = this
    wx.request({
      url: app.globalData.host + 'my/moments/collect',
      data: {
        page: page,
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

  //取消收藏
  cancelCollect(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定取消收藏吗？',
      success: rs => {
        if (rs.confirm) {
          wx.request({
            url: app.globalData.host + 'moment/collect/' + id,
            method: 'POST',
            data: {
              _token: app.globalData._token,
            },
            success: res => {
              if (200 == res.data.code) {
                wx.showToast({
                  title: '已取消',
                  complete: () => {
                    wx.redirectTo({
                      url: '/pages/my_collect/my_collect',
                    })
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: e => {
                    if (e.confirm) {
                      wx.redirectTo({
                        url: '/pages/my_collect/my_collect',
                      })
                    }
                  }
                })
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
        collects: data,
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
          collects: [...that.data.collects, ...data],
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

  //信息跳转
  goToInfo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/single_info/single_info?id=' + id,
    })
  }

})