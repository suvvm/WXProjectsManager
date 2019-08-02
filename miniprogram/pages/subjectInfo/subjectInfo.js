// pages/subjectInfo/subjectInfo.js
var util = require('../../utils/util.js');
const db = wx.cloud.database();

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: '',
    subject: {},
    isSchoolManager: false,
    couldApply: true
  },
  apply: function () {
    wx.navigateTo({
      url: `../applySubject/applySubject?subjectid=${this.data.sid}`,
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
    this.setData({
      sid: options.subjectid,
      isSchoolManager: app.globalData.isSchoolManager
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    db.collection('subjectInf').doc(
      options.subjectid
    ).get().then(res => {
      console.log(res)
      this.setData({
        subject: res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.subject.nowNum >= this.data.subject.maxNum){
      this.setData({
        couldApply : false
      })
    }else if(util.formatTime(new Date()) >= this.data.subject.bgdates + ' ' + this.data.subject.bgtimes){
      this.setData({
        couldApply : false
      })
    }
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