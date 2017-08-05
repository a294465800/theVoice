// single_info.js
const app = getApp()
Page({

  data: {

    //点赞和收藏图标
    like: {
      'ok': '/images/icon/like_r.png',
      'no': '/images/icon/like.png'
    },
    collect: {
      'ok': '/images/icon/collect_c.png',
      'no': '/images/icon/collect.png'
    },
    love: {
      'ok': '/images/icon/good_g.png',
      'no': '/images/icon/good.png'
    },
    nobody: '/images/icon/nobody.png',

    //提示
    tips_all: false,

    //防止重复触发
    flag: false,

    //数据
    info_id: 0,

    //接口数据
    info: null,

  },

  onLoad(options) {
    const that = this
    const id = options.id
    that.firstRequset(id)
    that.setData({
      info_id: id
    })
  },

  //初次请求
  firstRequset(id) {
    const that = this
    wx.request({
      url: app.globalData.host + 'moment/' + id,
      data: {
        type: 1,
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            info: res.data.data
          })
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

  //分享
  onShareAppMessage() {
    return {
      title: '区广告',
      path: '/pages/single_info/single_info?id=' + id,
    }
  },

  //点赞评论
  loveFunc(arr, id, index) {
    const that = this
    let tmp1 = arr + '[' + index + '].isLike'
    let tmp2 = arr + '[' + index + '].like'

    if (that.data[arr][index].isLike) {
      that.setData({
        [tmp1]: 0,
        [tmp2]: that.data[arr][index].like - 1
      })
    } else {
      that.setData({
        [tmp1]: 1,
        [tmp2]: that.data[arr][index].like + 1
      })
    }
  },

  hotLove(e) {
    // const that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.loveFunc('hot_comments', id, index)
  },

  commentsLike(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.loveFunc('comments', id, index)
  },

  //  图片预览
  preImage(e) {
    const that = this
    let url = e.currentTarget.dataset.url
    let urls = that.data.info.images
    let tmp = []
    for (let i in urls) {
      tmp.push(urls[i].url)
    }
    wx.previewImage({
      current: url,
      urls: tmp,
    })
  },

  //广告点赞
  AdLove(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    let tmp = 'info.isLike'
    if (that.data.info.isLike) {
      that.setData({
        [tmp]: 0
      })
    } else {
      that.setData({
        [tmp]: 1
      })
    }
  },

  //收藏
  adCollect(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    let tmp = 'info.collect'
    if (that.data.info.collect) {
      that.setData({
        [tmp]: 0
      })
    } else {
      that.setData({
        [tmp]: 1
      })
    }
  },

  //评论
  goToComment(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?moment_id=' + that.data.info.id,
    })
  },


  //触底刷新
  toBottom() {
    const that = this
    if (that.data.flag) {
      return false
    }
    let tmp = that.data.comments
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(() => {
      wx.hideLoading()
      that.setData({
        tips_all: true,
        comments: [...tmp, ...tmp],
        flag: false
      })
    }, 1000)

    that.setData({
      flag: true
    })
  }
})