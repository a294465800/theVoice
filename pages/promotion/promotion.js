// promotion.js
const app = getApp()
let startY = 0, endY = 0
Page({

  data: {

    like: {
      'ok': '/images/icon/like_r.png',
      'no': '/images/icon/like.png'
    },

    nobody: '/images/icon/nobody.png',

    //发布动画
    animationPublish: {},

    //触底提示
    flag: false,
    close: false,
    page: 1,

    //接口数据
    infos: null,

  },


  onLoad(options) {
    const that = this
    that.firstRequest(1, data => {
      wx.request({
        url: app.globalData.host + 'moments/top',
        data: {
          type: 2,
          _token: app.globalData._token
        },
        success: res => {
          if (200 == res.data.code) {
            that.setData({
              infos: [...res.data.data, ...data]
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
    })
  },

  //初次请求封装
  firstRequest(page, cb) {
    const that = this
    wx.request({
      url: app.globalData.host + 'moments',
      data: {
        page: page,
        type: 2,
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
          })
        }
      }
    })
  },

  //点赞
  likePunch(e) {
    const that = this
    if (!app.globalData.userInfo) {
      app.ifLogin((userInfo) => {
        that.setData({
          userInfo: userInfo
        })
      })
      return false
    }
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    let tmp1 = 'infos[' + index + '].isLike'
    let tmp2 = 'infos[' + index + '].likes'
    if (that.data.infos[index].isLike) {
      that.setData({
        [tmp1]: 0,
        [tmp2]: that.data.infos[index].likes - 1
      })
    } else {
      that.setData({
        [tmp1]: 1,
        [tmp2]: that.data.infos[index].likes + 1
      })
    }
  },

  //单条内容跳转
  goToSingle(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/single_info/single_info?id=' + id,
    })
  },

  //获取触摸初始位置
  touchStart(e) {
    startY = e.changedTouches[0].clientY
  },

  //获取结束位置
  touchEnd(e) {
    endY = e.changedTouches[0].clientY
    let diff = endY - startY
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    if (diff > 0) {
      animation.bottom('20rpx').step()
    } else {
      animation.bottom('-70px').step()
    }
    this.setData({
      animationPublish: animation.export()
    })
  },

  //  图片预览
  preImage(e) {
    const that = this
    let index = e.currentTarget.dataset.index
    let father_index = e.currentTarget.dataset.father_index
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: that.data.infos[father_index].img,
    })
  },

  //发布评论
  goToPublish() {
    if (!app.globalData.userInfo) {
      app.ifLogin((userInfo) => {
        that.setData({
          userInfo: userInfo
        })
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/publish/publish?type=2',
    })
  },

  //触底刷新
  onReachBottom() {
    const that = this
    let flag = that.data.flag
    let close = that.data.close
    //阻止重复刷新，或者触底主动关闭
    if (flag || close) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    let page = that.data.page
    that.firstRequest(page + 1, data => {
      wx.hideLoading()
      if (data.length) {
        let old_data = that.data.infos
        that.setData({
          infos: [...old_data, ...data],
          page: page + 1,
          flag: false
        })
      } else {
        that.setData({
          close: true,
          flag: false
        })
      }
    })
    that.setData({
      flag: true,
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    const that = this
    that.firstRequest(1, data => {
      wx.request({
        url: app.globalData.host + 'moments/top',
        data: {
          type: 2,
          _token: app.globalData._token
        },
        success: res => {
          if (200 == res.data.code) {
            that.setData({
              infos: [...res.data.data, ...data],
              close: false
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
          wx.stopPullDownRefresh()
        }
      })
    })
  }

})