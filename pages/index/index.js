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

    userInfo: {},
    interval: 4000,

    //发布动画
    animationPublish: {},

    //触底提示
    tips_flag: false,
    tips_all: false,

    //模拟数据
    ad_imgs: [
      'https://www.sosomarketing.com/wp-content/uploads/2016/05/YOUTUBE%E5%BD%B1%E7%89%87%E5%BB%A3%E5%91%8A.jpg',
      'http://www.damndigital.com/wp-content/uploads/2013/03/damndigital_advertising-creative_2013-03_01.jpg'
    ],

    infos: [
      {
        id: 1,
        store_name: '匿名游客',
        createtime: '2017-05-22',
        content: '小程序的广告都打到附近的小程序中来~',
        img: [
          'http://www.onead.com.tw/wp-content/uploads/2017/06/shutterstock_291472427-2.jpg'
        ],
        store_cover: '/images/icon/nobody.png',
        likes: 22,
        comment: 12,
        isLike: 1,
      },
      {
        id: 1,
        store_name: '匿名游客',
        createtime: '2017-05-22',
        content: '小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来小程序的广告都打到附近的小程序中来~',
        img: [
          'http://www.onead.com.tw/wp-content/uploads/2017/06/shutterstock_291472427-2.jpg',
          'http://yuxuange.com/show/img/20/12L260C3964P-1PK.jpg',
          'https://img.technews.tw/wp-content/uploads/2015/09/Gmail_Transparent_Wide-590x303.jpg'
        ],
        store_cover: '/images/icon/nobody.png',
        likes: 10,
        comment: 323,
        isLike: 0,
      }
    ]
  },

  onLoad() {

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

  //发布
  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish',
    })
  },

  //触底刷新
  onReachBottom() {
    const that = this
    that.setData({
      tips_flag: true,
    })
  },

  //下拉刷新
  onPullDownRefresh(){
    wx.stopPullDownRefresh()
  }
})
