// dynamic_comment.js
let app = getApp()
Page({

  data: {
    comment_id: 0,
    moment_id: 0,
    comments_left: 200,
    user_comments: null
  },

  onLoad(options) {
    const that = this
    that.setData({
      comment_id: options.comment_id,
      moment_id: options.moment_id
    })
  },

  //用户评论获取
  getComments(e) {
    const that = this
    let comment_content = e.detail.value
    that.setData({
      user_comments: comment_content,
      comments_left: 200 - comment_content.length
    })
  },

  //评论提交
  commentPost() {
    const that = this
    if (that.data.user_comments) {
      wx.request({
        url: app.globalData.host + 'moment/reply',
        method: 'POST',
        data: {
          moment_id: that.data.moment_id,
          id: that.data.comment_id,
          content: that.data.user_comments
        },
        header: app.globalData.header,
        success: res => {
          if(200 == res.data.code){
            wx.showToast({
              title: '评论成功',
            })
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写评论',
        showCancel: false
      })
    }
  },
})