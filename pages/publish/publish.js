// publish.js
const app = getApp()
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
      nobody: 0,
      imgs: []
    },
  },

  onLoad(options) {
  },

  //获取文本
  getTextarea(e) {
    let value = e.detail.value
    console.log(value)
    let left = 200 - value.length

    this.setData({
      'message.content': value,
      comments_left: left > 0 ? left : 0
    })
  },

  //添加图片
  addImg() {
    const that = this
    let urls = that.data.urls
    wx.chooseImage({
      count: 9,
      success: res => {
        let preUrls = that.data.urls
        let urls = [...preUrls, ...res.tempFilePaths]
        if (urls.length > 9) {
          urls.length = 9
        }
        that.setData({
          urls: urls
        })
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
    if (that.data.message.nobody) {
      that.setData({
        'message.nobody': 0
      })
    } else {
      that.setData({
        'message.nobody': 1
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
    }
  }
})