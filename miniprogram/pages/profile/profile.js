// pages/profile/profile.js
var app =  getApp();

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: app.globalData.schoolName,
    isSchoolManager: app.globalData.isSchoolManager,
    openid: app.globalData.openid
  },
  onGotUserInfo: function(event){
    console.log(event);
    
  },
  toCreateSchool: function(){
    wx.navigateTo({
      url: '../createSchool/createSchool'
    })
  },
  toChooseSchool: function(){
    wx.navigateTo({
      url: '../chooseSchool/chooseSchool'
    })
  },
  toModifySchool: function(){
    wx.navigateTo({
      url: '../modifySchool/modifySchool'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'login'
    }).then(res=>{
      this.setData({
        openid: res.result.openid
      })
      app.globalData.openid = res.result.openid
      db.collection('schoolinf').where({
        _openid: this.data.openid
        }).get().then(res2=>{
          console.log(res2);
          this.setData({
            schoolName: res2.data[0].schoolName,
            isSchoolManager: true
          })
          app.globalData.isSchoolManager = true
          app.globalData.schoolName = this.data.schoolName
        }).catch(err2=>{
          console.error(err2);
        })
    }).catch(err=>{
      console.error(err);
    });
    //未完成
    if(!this.data.isSchoolManager){
      
    }
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