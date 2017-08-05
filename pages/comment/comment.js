// dynamic_comment.js
let app = getApp()
Page({

  data: {
    comment_id: 0,
    moment_id: 0,
    comments_left: 200,
    content: null
  },

  onLoad(options) {
    const that = this
    that.setData({
      comment_id: options.comment_id || 0,
      moment_id: options.moment_id
    })
  },

  //用户评论获取
  getComments(e) {
    const that = this
    let comment_content = e.detail.value
    that.setData({
      content: comment_content,
      comments_left: 200 - comment_content.length
    })
  },

  //评论提交
  commentPost() {
    const that = this
    if (that.data.content) {
      wx.request({
        url: app.globalData.host + 'moment/comment/add',
        method: 'POST',
        data: {
          moment_id: that.data.moment_id,
          comment_id: that.data.comment_id,
          _token: app.globalData._token,
          content: that.data.content
        },
        success: res => {
          if(200 == res.data.code){
            wx.showToast({
              title: '评论成功',
              complete: () => {
                wx.navigateBack()
              }
            })
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
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写评论',
        showCancel: false
      })
    }
  },
})