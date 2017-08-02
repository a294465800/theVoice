// single_info.js
Page({

  data: {

    //点赞和收藏图标
    like: {
      ok: '/images/icon/like.png',
      no: '/images/icon/like_r.png'
    },
    collect: {
      ok: '/images/icon/collect_c.png',
      no: '/images/icon/collect.png'
    },

    //提示
    tips_all: false,

    //防止重复触发
    flag: false,

    //数据
    info_id: 0,

    //模拟数据
    info:
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
      likes: ['小红', '小黑', '小白', '小猪', '小崽'],
      limit: 5
    },

    hot_comments: [
      {
        id: 1,
        name: '匿名游客',
        content: '不知道哇，很厉害的样子！',
        img: '/images/icon/nobody.png',
        time: '07-11',
        like: 11
      },
      {
        id: 2,
        name: '小黑',
        content: '我就是不讲',
        img: 'http://imgtu.5011.net/uploads/content/20170328/8293501490691071.jpg',
        time: '07-31',
        like: 110
      },
      {
        id: 3,
        name: '小红',
        content: '不知道哇，很厉害的样子！',
        img: 'http://rs3.sinahk.net/cap/3/2016/07/04/d/da3874dc60af05621f2dcc48d1ea2a61.jpg',
        time: '07-21',
        like: 11
      }
    ],

    comments: [
      {
        id: 1,
        name: '田园的菜籽',
        content: '哇，真的吗~',
        img: 'http://img.sc115.com/tx/ka/cpic/1509hlnfxn5uib1.jpg',
        time: '07-11',
        like: 121
      },
      {
        id: 2,
        name: '匿名游客',
        content: '我就是不讲',
        img: '/images/icon/nobody.png',
        time: '07-05',
        like: 31
      },
      {
        id: 3,
        name: 'lwlwlw',
        content: '人家把你当朋友，你却想。。。！',
        img: 'http://p3.wmpic.me/article/2015/03/18/1426649933_LmkapquY.jpeg',
        time: '07-11',
        like: 2
      },
      {
        id: 4,
        name: '白夜',
        content: '我就是不讲',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqRBdRwXnU2uKiNhp--Ji1mj6S3m3ycPU-_eFTheZuGXOGJ-7h',
        time: '07-11',
        like: 32
      },
      {
        id: 5,
        name: '匿名游客',
        content: '谢谢咯~',
        img: '/images/icon/nobody.png',
        time: '07-21',
        like: 5
      },
      {
        id: 6,
        name: '浮生若梦',
        content: '哈哈哈哈',
        img: 'http://img.171u.com/image/1605/1610360843167.jpeg',
        time: '08-01',
        like: 11
      }
    ],
  },

  onLoad(options) {
    const that = this
    const id = options.id
    that.setData({
      info_id: id
    })
  },

  onShareAppMessage() {
    return {
      title: '区广告',
      path: '/pages/single_info/single_info?id=' + id,
    }
  },


  //评论
  goToComment(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + that.data.info_id,
    })
  },

  //触底刷新
  toBottom() {
    const that = this
    if (that.data.flag){
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