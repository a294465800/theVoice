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
    page: 1,
    close: false,

    //数据
    info_id: 0,

    //接口数据
    info: null,

  },

  onLoad(options) {
    const that = this
    const id = options.id
    that.firstRequset(id)
  },

  onShow() {
    const that = this
    if (that.data.info_id) {
      that.firstRequset(that.data.info_id)
      that.setData({
        close: false
      })
    }
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
            info: res.data.data,
            info_id: id
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
  loveFunc(str, id, index) {
    const that = this
    let tmp1 = 'info.' + str + '[' + index + '].isLike'
    let tmp2 = 'info.' + str + '[' + index + '].like'
    let tmp_isLike = that.data.info[str][index].isLike

    if (tmp_isLike) {
      wx.showToast({
        title: '已点赞过',
      })
      return false
    }
    wx.request({
      url: app.globalData.host + 'comment/like/' + id,
      data: {
        _token: app.globalData._token,
      },
      success: res => {
        if (200 == res.data.code) {
          let tmp_like_num = that.data.info[str][index].like
          that.setData({
            [tmp1]: 1,
            [tmp2]: tmp_like_num + 1
          })
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

  hotLove(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    that.loveFunc('hotComments', id, index)
  },

  commentsLike(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.loveFunc('newComments', id, index)
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

    wx.request({
      url: app.globalData.host + 'moment/like/' + id,
      method: 'POST',
      data: {
        _token: app.globalData._token,
      },
      success: res => {

      }
    })
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
    let tmp = 'info.isCollect'

    wx.request({
      url: app.globalData.host + 'moment/collect/' + id,
      method: 'POST',
      data: {
        _token: app.globalData._token,
      },
      success: res => {
        if (200 == res.data.code) {
          if (1 == res.data.data) {
            wx.showToast({
              title: '收藏成功',
            })
          } else {
            wx.showToast({
              title: '取消收藏',
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: rs => {
            }
          })
        }
      }
    })
    if (that.data.info.isCollect) {
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
    if (that.data.flag || that.data.close) {
      return false
    }
    let tmp = that.data.info.newComments
    let page = that.data.page
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host + 'comments/' + that.data.info.id,
      data: {
        page: page + 1,
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          let tmp_data = res.data.data
          if (tmp_data.length) {
            that.setData({
              'info.newComments': [...tmp, ...tmp_data],
              flag: false,
              page: page + 1
            })
          } else {
            that.setData({
              flag: false,
              close: true
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: rs => {
              if (rs.confirm) {
                that.setData({
                  close: true
                })
              }
            }
          })
        }
        wx.hideLoading()
      }
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
  },

  //回复评论
  replayComment(e) {
    const comment_id = e.currentTarget.dataset.comment_id
    const moment_id = e.currentTarget.dataset.moment_id
    wx.navigateTo({
      url: '/pages/comment/comment?comment_id=' + comment_id + '&moment_id=' + moment_id,
    })
  },

  //查看所有评论
  goToAllComments(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/all_comments/all_comments?id=' + id,
    })
  }
})