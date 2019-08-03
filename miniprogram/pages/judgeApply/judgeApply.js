// pages/judgeApply/judgeApply.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    applys: []
  },
  
  judgeDepartmentFile: function (e) {
    wx.navigateTo({
      url: `../judgeDepartment/judgeDepartment?applyid=${e.target.dataset.applyid}`,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },

  judgeSchoolFile: function (e) {
    wx.navigateTo({
      url: `../judgeSchool/judgeSchool?applyid=${e.target.dataset.applyid}`,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    this.setData({
      openid: app.globalData.openid,
    })
    db.collection('applyinf').get().then(res => {
      this.setData({
        applys: res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.err(err);
      wx.hideLoading();
    })
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