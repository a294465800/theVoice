//index.js
//获取应用实例
const app = getApp()
let startY = 0, endY = 0
Page({
  data: {

    like: {
      'ok': '/images/icon/like_r.png',
      'no': '/images/icon/like.png'
    },

    nobody: '/images/icon/nobody.png',

    userInfo: {},
    interval: 4000,

    //发布动画
    animationPublish: {},

    //触底提示
    flag: false,
    tips_all: false,
    close: false,
    page: 1,

    //接口数据
    infos: null,
    ad_imgs: null,

  },

  onLoad() {
    const that = this
    app.getToken(() => {
      app.nowLogin((userInfo) => {
        that.setData({
          userInfo: userInfo
        })
        that.firstRequest()
      })
    })
  },

  onShow() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  //分享
  onShareAppMessage() {
    return {
      title: '第一声 - 潮汕人自己的发声平台',
      path: '/pages/index/index',
    }
  },

  //初次请求封装
  firstRequest() {
    const that = this
    wx.request({
      url: app.globalData.host + 'moments',
      data: {
        type: 1,
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            infos: res.data.data,
            close: false
          })
        }
      }
    })
    wx.request({
      url: app.globalData.host + 'adverts',
      data: {
        app_id: app.globalData.app_id,
        _token: app.globalData._token
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            ad_imgs: res.data.data
          })
        }
      }
    })
  },

  //广告跳转
  goToAd(e) {
    const link = e.currentTarget.dataset.link
    wx.navigateTo({
      url: '/pages/ad_page/ad_page?link=' + link,
    })
  },

  //单条内容跳转
  goToSingle(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/single_info/single_info?id=' + id,
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
    let tmp2 = 'infos[' + index + '].likeCount'

    wx.request({
      url: app.globalData.host + 'moment/like/' + id,
      method: 'POST',
      data: {
        _token: app.globalData._token,
      },
      success: res => {

      }
    })
    if (that.data.infos[index].isLike) {
      that.setData({
        [tmp1]: 0,
        [tmp2]: that.data.infos[index].likeCount - 1
      })
    } else {
      that.setData({
        [tmp1]: 1,
        [tmp2]: that.data.infos[index].likeCount + 1
      })
    }
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
    let tmp = that.data.infos[father_index].images
    let urls = []
    for (let i in tmp) {
      urls.push(tmp[i].url)
    }
    
    wx.previewImage({
      current: url,
      urls: urls,
    })
  },

  //发布
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
      url: '/pages/publish/publish?type=1',
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
      mask: true
    })
    let page = that.data.page
    wx.request({
      url: app.globalData.host + 'moments?page=' + (page + 1),
      data: {
        type: 1,
        _token: app.globalData._token
      },
      success: res => {
        wx.hideLoading()
        if (200 == res.data.code) {
          let tmp_data = res.data.data
          if (tmp_data.length) {
            let old_data = that.data.infos
            that.setData({
              infos: [...old_data, ...tmp_data],
              page: page + 1,
              flag: false
            })
          } else {
            that.setData({
              close: true,
              flag: false
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: rs => {
              if(rs.confirm){
                that.setData({
                  close: true
                })
              }
            }
          })
        }
      }
    })
    that.setData({
      flag: true,
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    this.firstRequest()
    wx.stopPullDownRefresh()
  },

  //用于视频
  stopTouch(){
    return false
  },
})
