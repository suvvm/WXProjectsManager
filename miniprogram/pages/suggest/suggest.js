// pages/suggest/suggest.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
  },
  onChange: function (e){
    this.setData({
      info: e.detail
    })
  },
  submit: function (){
    wx.showLoading({
      title: '提交中',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    db.collection('suggestinf').add({
      date:{
        info: this.data.info
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})