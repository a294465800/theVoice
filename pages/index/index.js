//index.js
//获取应用实例
const app = getApp()
Page({
  data: {

    userInfo: {},
    interval: 4000,

    //模拟数据
    ad_imgs: [
      'https://www.sosomarketing.com/wp-content/uploads/2016/05/YOUTUBE%E5%BD%B1%E7%89%87%E5%BB%A3%E5%91%8A.jpg',
      'https://i.ytimg.com/vi/xWyZsm17n5M/maxresdefault.jpg'
    ],

    infos: [
      {
        id: 1,
        store_name: '匿名游客',
        createtime: '2017-05-22',
        content: '小程序的广告都打到附近的小程序中来~',
        img: [
          'http://www.onead.com.tw/wp-content/uploads/2017/06/shutterstock_291472427-2.jpg',
          'http://yuxuange.com/show/img/20/12L260C3964P-1PK.jpg',
          'https://img.technews.tw/wp-content/uploads/2015/09/Gmail_Transparent_Wide-590x303.jpg'
        ],
        store_cover: '/images/icon/nobody.png',
        isLike: 1,
        comments: [
          {
            id: 1,
            name: '小红',
            content: '不知道哇，很厉害的样子！'
          },
          {
            id: 2,
            name: '小黑',
            content: '我就是不讲'
          },
          {
            id: 3,
            name: '小红',
            content: '不知道哇，很厉害的样子！'
          },
          {
            id: 4,
            name: '小黑',
            content: '我就是不讲'
          },
          {
            id: 5,
            name: '小红',
            content: '不知道哇，很厉害的样子！'
          },
          {
            id: 6,
            name: '小黑',
            content: '我就是不讲'
          }
        ],
        likes: ['小红', '小黑', '小白', '小猪', '小崽'],
        limit: 5
      },
      {
        id: 1,
        store_name: '匿名游客',
        createtime: '2017-05-22',
        content: '小程序的广告都打到附近的小程序中来~',
        img: [
          'http://www.onead.com.tw/wp-content/uploads/2017/06/shutterstock_291472427-2.jpg',
          'http://yuxuange.com/show/img/20/12L260C3964P-1PK.jpg',
          'https://img.technews.tw/wp-content/uploads/2015/09/Gmail_Transparent_Wide-590x303.jpg'
        ],
        store_cover: '/images/icon/nobody.png',
        isLike: 0,
        comments: [
          {
            id: 1,
            name: '小红',
            content: '不知道哇，很厉害的样子！hhhhhhhhhhhhhhhhhhhhhhhhhhh'
          },
          {
            id: 2,
            name: '小黑',
            content: '啦啦啦啦啦啦啦啦啦啦啦啦啦'
          }
        ],
        likes: ['小红', '小黑', '小白', '小猪', '小崽'],
        limit: 5
      }
    ]
  },

  onLoad() {

  },

  //展开更多评论
  getMoreComment(e) {
    const that = this
    let index = e.currentTarget.dataset.index
    let temp = 'infos[' + index + '].limit'
    let limit = that.data.infos[index].limit
    let length = that.data.infos[index].comments.length
    if (limit > length) {
      wx.showToast({
        title: '没有了',
      })
      return false
    }
    that.setData({
      [temp]: limit + 5
    })
  },

  //收起更多评论
  hideMoreComment(e) {
    const that = this
    let index = e.currentTarget.dataset.index
    let temp = 'infos[' + index + '].limit'
    that.setData({
      [temp]: 5
    })
  },

  //评论
  goToComment(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + id,
    })
  }
})
