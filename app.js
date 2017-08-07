//app.js
App({
  onLaunch: function () {
  },

  globalData: {
    userInfo: null,
    host: 'http://119.23.202.220/api/v1/',
    app_id: 'wxfec807d3f372360b',
    _token: ''
  },

  getToken(cb){
    const that = this
    wx.request({
      url: that.globalData.host + 'token',
      data: {
        app_id: that.globalData.app_id
      },
      success: res => {
        that.globalData._token = res.data.data
        typeof cb == "function" && cb()
      }
    })
  },

  //获取用户设置
  getSetting(cb) {
    let that = this
    wx.getSystemInfo({
      success: res => {
        if (res.SDKVersion.replace(/\./g, '') < 125) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，部分功能可能无法使用，请升级到最新微信版本。',
            showCancel: false
          })
        }
      }
    })
    wx.getSetting({
      success: setting => {
        if (setting.authSetting["scope.userInfo"]) {
          wx.showLoading({
            title: '登录中',
          })
          //调用登录接口
          wx.login({
            withCredentials: true,
            success: rs => {
              wx.getUserInfo({
                success: res => {
                  that.globalData.userInfo = res.userInfo
                  wx.request({
                    url: that.globalData.host + 'login',
                    method: 'POST',
                    data: {
                      code: rs.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      app_id: that.globalData.app_id,
                      _token: that.globalData._token
                    },
                    success: e => {
                      wx.hideLoading()
                      if (200 != e.data.code) {
                        wx.showToast({
                          title: '登录失败',
                        })
                        that.globalData.userInfo = null
                      } else {
                        wx.showToast({
                          title: '登录成功',
                        })
                      }
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                }
              })
            }
          })
        } else if (setting.authSetting["scope.userInfo"] === false) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '您之前拒绝了授权，现在是否开启？',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: rs => {
                    if (rs.authSetting["scope.userInfo"]) {
                      that.getSetting(cb)
                    }
                  }
                })
              } else {
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            }
          })
        } else {
          wx.hideLoading()
          wx.getUserInfo({
            success: res => {
              that.getSetting(cb)
            },
            fail: () => {
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      }
    })
  },

  //如果已授权，直接登录，否则，不做操作
  nowLogin(cb) {
    const that = this
    wx.getSetting({
      success: setting => {
        if (setting.authSetting["scope.userInfo"]) {
          wx.showLoading({
            title: '登录中',
            mask: true
          })
          wx.login({
            withCredentials: true,
            success: rs => {
              wx.getUserInfo({
                success: res => {
                  that.globalData.userInfo = res.userInfo
                  wx.request({
                    url: that.globalData.host + 'login',
                    method: 'POST',
                    data: {
                      code: rs.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      app_id: that.globalData.app_id,
                      _token: that.globalData._token
                    },
                    success: e => {
                      wx.hideLoading()
                      if (200 != e.data.code) {
                        wx.showToast({
                          title: '登录失败',
                        })
                        that.globalData.userInfo = null
                      } else {
                        wx.showToast({
                          title: '登录成功',
                        })
                      }
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                }
              })
            }
          })
        } else {
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      }
    })
  },

  //登录询问
  ifLogin(cb){
    const that = this
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success: res => {
        if(res.confirm){
          that.getSetting(cb)
        }
      }
    })
  }
})
