// checking.js
Page({

  data: {

    //模拟数据
    publishs: [
      {
        id: 1,
        content: '大二的时候，天气很差，不知道给说些啥。',
        like: 2,
        comments: 0,
        time: '10天前'
      },
      {
        id: 2,
        content: '黑客可能盗不了你手机里的内容，但可以使用ss7信令漏洞强制对你手机账户进行劫持，拦截你的一切通话和短信，强行开通国际漫游，拨打高额吸费电话。另外，现在很多山寨老人机虽然表面上什么功能都没有，但是还是会盗取你的通讯录等资料，偷跑流量。',
        like: 12,
        comments: 22,
        time: '1个月前'
      },
      {
        id: 3,
        content: '想上天~',
        like: 0,
        comment: 0,
        time: '2小时前'
      }
    ]
  },

  onLoad: function (options) {
  
  },

})