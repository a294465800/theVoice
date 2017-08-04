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

    comments_left: 200,

    //预览图片
    urls: [],

    //待发送信息
    message: {
      content: null,
      anonymous: 0,
      images: [],
      type: 1,
      _token: app.globalData._token
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
    let left = 200 - value.length

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
    wx.chooseImage({
      count: 9,
      success: res => {
        saveImgs = []
        saveBaseUrl = []
        wx.showLoading({
          title: '加载中',
        })
        that.uploadImgs(res.tempFilePaths, 0)
      },
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

  //发布
  publish() {
    const that = this
    if (!that.data.message.content) {
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
            if(2 == that.data.message.type){
              console.log(res.data.data)
              wx.request({
                url: app.globalData.host + 'pay',
                method: 'POST',
                data: res.data.data,
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