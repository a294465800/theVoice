// all_comments.js
const app = getApp()

Page({

  data: {
    love: {
      'ok': '/images/icon/good_g.png',
      'no': '/images/icon/good.png'
    },

    comment_id: null,

    //接口数据
    comments: null,

  },

  onLoad(options) {
    const that = this
    const id = options.id
    that.firstRequest(id)
  },

  onShow() {
    const that = this
    if (that.data.comment_id) {
      that.firstRequest(that.data.comment_id)
    }
  },

  //初次请求
  firstRequest(id) {
    const that = this
    wx.request({
      url: app.globalData.host + 'comment/' + id,
      data: {
        _token: app.globalData._token,
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            comments: res.data.data,
            comment_id: id
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

  //点赞评论
  loveFunc(str, id, index) {
    const that = this
    let tmp1, tmp2, tmp_isLike, tmp_like_num
    if (index != null) {
      tmp1 = 'comments.' + str + '[' + index + '].isLike'
      tmp2 = 'comments.' + str + '[' + index + '].like'
      tmp_isLike = that.data.comments[str][index].isLike
      tmp_like_num = that.data.comments[str][index].like
    } else {
      tmp1 = 'comments.' + str + '.isLike'
      tmp2 = 'comments.' + str + '.like'
      tmp_isLike = that.data.comments[str].isLike
      tmp_like_num = that.data.comments[str].like
    }

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

  topLove(e) {
    const id = e.currentTarget.dataset.id
    this.loveFunc('comment', id, null)
  },
  commentsLike(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.loveFunc('converse', id, index)
  },

  //回复当前评论
  replayCurrentComment(e) {
    const comment_id = e.currentTarget.dataset.comment_id
    const moment_id = e.currentTarget.dataset.moment_id
    wx.navigateTo({
      url: '/pages/comment/comment?comment_id=' + comment_id + '&moment_id=' + moment_id,
    })
  },

  //回复评论
  replayComment(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + id,
    })
  },

  //查看所有评论
  goToAllComments(e) {
    const id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: '/pages/all_comments/all_comments?id=' + id,
    })
  }

})