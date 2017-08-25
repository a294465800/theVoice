// publish.js
const app = getApp()
let saveImgs = []
let saveBaseUrl = []
Page({

  data: {
    nobody: {
      ok: '/images/icon/publish_nobody_true.png',
      no: '/images/icon/publish_nobody.png'
    },

    comments_left: 500,

    //预览图片
    urls: [],
    video: '',

    //待发送信息
    message: {
      content: null,
      anonymous: 0,
      images: [],
      type: 1,
      _token: app.globalData._token,
      movies: []
    },
  },

  onLoad(options) {
    this.setData({
      'message._token': app.globalData._token,
      'message.type': options.type
    })
  },

  //获取文本
  getTextarea(e) {
    let value = e.detail.value
    let left = 500 - value.length

    this.setData({
      'message.content': value,
      comments_left: left > 0 ? left : 0
    })
  },

  //图片递归上传
  uploadImgs(imgs, i) {
    const that = this
    if (imgs[i]) {
      wx.uploadFile({
        url: app.globalData.host + 'upload',
        filePath: imgs[i],
        name: 'image',
        success: res => {
          let data = JSON.parse(res.data)
          saveBaseUrl.push(data.baseurl)
          saveImgs.push(data.url)
          that.uploadImgs(imgs, i + 1)
        }
      })
    } else {
      let preBaseUrls = that.data.message.images
      let preUrls = that.data.urls
      let urls = [...preUrls, ...saveImgs]
      let baseurls = [...preBaseUrls, ...saveBaseUrl]
      if (urls.length > 9) {
        urls.length = 9
        baseurls.length = 9
      }
      that.setData({
        urls: urls,
        'message.images': baseurls
      })
      wx.hideLoading()
    }
  },

  //添加图片
  addImg() {
    const that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.chooseImage({
      count: 9,
      success: res => {
        wx.hideLoading()
        saveImgs = []
        saveBaseUrl = []
        that.uploadImgs(res.tempFilePaths, 0)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  //取消图片
  cancelImg(e) {
    let url = e.currentTarget.dataset.url
    let preUrls = this.data.urls
    let index = preUrls.indexOf(url)
    preUrls.splice(index, 1)
    this.setData({
      urls: preUrls
    })

  },

  //匿名
  nobodyFunc() {
    const that = this
    if (that.data.message.anonymous) {
      that.setData({
        'message.anonymous': 0
      })
    } else {
      that.setData({
        'message.anonymous': 1
      })
    }
  },

  //选择视频
  chooseVideo() {
    const that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 10,
      success: res => {
        if (res.size > 4194304) {
          wx.showModal({
            title: '提示',
            content: '请选择小于4M的视频',
            showCancel: false
          })
        } else {
          wx.showLoading({
            title: '获取中',
            mask: true
          })
          wx.uploadFile({
            url: app.globalData.host + 'upload',
            filePath: res.tempFilePath,
            name: 'image',
            success: rs => {
              let data = JSON.parse(rs.data)
              if (200 == rs.statusCode) {
                that.setData({
                  'message.movies': [data.baseurl],
                  video: [res.tempFilePath]
                })
              }else {
                wx.showModal({
                  title: '提示',
                  content: '上传出错',
                  showCancel: false
                })
              }
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

  //发布
  publish(e) {
    const that = this

    that.setData({
      'message.formID': e.detail.formId
    })
    if (!e.detail.value.content) {
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false
      })
    } else {
      wx.request({
        url: app.globalData.host + 'moment/add',
        method: 'POST',
        data: that.data.message,
        success: res => {
          if (200 == res.data.code) {
            if (2 == that.data.message.type) {
              let tmp_data = res.data.data
              tmp_data._token = app.globalData._token
              wx.request({
                url: app.globalData.host + 'pay',
                method: 'POST',
                data: tmp_data,
                success: rs => {
                  wx.requestPayment({
                    timeStamp: rs.data.data.timeStamp,
                    nonceStr: rs.data.data.nonceStr,
                    package: rs.data.data.package,
                    signType: rs.data.data.signType,
                    paySign: rs.data.data.paySign,
                    success: e => {
                      wx.showModal({
                        title: '提示',
                        content: '发布成功，请耐心等待审核通过',
                        showCancel: false,
                        success: rs => {
                          if (rs.confirm) {
                            wx.navigateBack()
                          }
                        }
                      })
                    }
                  })
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '发布成功，请耐心等待审核通过',
                showCancel: false,
                success: rs => {
                  if (rs.confirm) {
                    wx.navigateBack()
                  }
                }
              })
            }
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
    }
  }
})