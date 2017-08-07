// all_comments.js
const app = getApp()

Page({

  data: {
    love: {
      'ok': '/images/icon/good_g.png',
      'no': '/images/icon/good.png'
    },

    close: true,

    //模拟数据
    top_comment: {
      id: 2,
      userName: '诗永',
      content: '阿斯打扫打扫大',
      updated_at: '2017-04-11',
      avatar: '/images/icon/nobody.png',
      like: 22
    },

    comments: [
      {
        id: 1,
        userName: '诗永',
        content: '阿斯打扫打扫大',
        updated_at: '2017-04-11',
        avatar: '/images/icon/nobody.png',
        like: 22,
        isReplay: 0,
      },
      {
        id: 2,
        userName: '诗永',
        content: '阿斯打扫打扫大',
        updated_at: '2017-04-11',
        avatar: '/images/icon/nobody.png',
        like: 2,
        isReplay: 1,
        target: 'aa'
      },
      {
        id: 3,
        userName: 'aa',
        content: '我不知道说些啥',
        updated_at: '2017-04-11',
        avatar: '/images/icon/nobody.png',
        like: 212,
        isReplay: 0,
      },
      {
        id: 4,
        userName: '诗永',
        content: '阿斯打扫打扫大',
        updated_at: '2017-04-11',
        avatar: '/images/icon/nobody.png',
        like: 2,
        isReplay: 1,
        target: '诗永'
      },
    ]
  },

  onLoad(options) {
    const that = this
    const id = options.id
    that.firstRequest(id)
  },

  firstRequest(id){
    wx.request({
      url: app.globalData.host + 'comment/' + id,
      data: {
        _token: app.globalData._token,
      },
      success: res => {
        if(200 == res.data.code){

        }else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: rs => {
              if(rs.confirm){
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },

  //回复当前评论
  replayCurrentComment(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + id,
    })
  },

  //回复评论
  replayComment(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + id,
    })
  }

})