// pages/index/index.js
const app = getApp();

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: '1999-08-07',
    times: '12:00',
    areaShow: false,
    AreaList: app.globalData.AreaList,
    location: {},
    timesShow: false,
    openid: app.globalData.openid,
    isSchoolManager: app.globalData.isSchoolManager

  },
  //  关闭地区选择器弹出层
  onAreaClose: function () {
    this.setData({ areaShow: false });
  },
  //  显示地区选择器弹出层
  popupAreaChooser: function () {
    this.setData({ areaShow: true });
  },
  //  地区选择器确认点击事件
  onAddrConfirm: function (e) {
    console.log(e.detail.values);
    this.setData({
      location: e.detail.values
    })
  },
  //  关闭事件选择器弹出层
  onTimeClose: function () {
    this.setData({ timesShow: false });
  },
  //  弹出时间选择器弹出层
  popupTimesChooser: function () {
    this.setData({ timesShow: true });
  },
  //  时间选择组件确认事件
  bindTimeChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      times: e.detail.value
    })
  },
  //  日期选择组件确认事件
  bindDateChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      dates: e.detail.value
    })
  },
  gotoShowAllSubject: function () {
    wx.navigateTo({
      url: '../allSubject/allSubject',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },
  gotoShowTypeSubject: function () {
    console.log('前往种类查询')
    wx.navigateTo({
      url: '../typeSubject/typeSubject',
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  gotoShowAreaSubject: function () {
    console.log('前往地区查询')
    wx.navigateTo({
      url: '../areaSubject/areaSubject',
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  gotoShowTimeSubject: function () {
    console.log('前往时间查询')
    wx.navigateTo({
      url: '../timeSubject/timeSubject',
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  gotoShowSponsorSubject: function () {
    console.log('前往时间查询')
    wx.navigateTo({
      url: '../sponsorSubject/sponsorSubject',
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  gotoSuggest: function () {
    console.log('前往意见反馈')
    wx.navigateTo({
      url: '../suggest/suggest',
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  appreciateDevelopers: function () {
    console.log('打赏')
    wx.navigateTo({
      url: '../appreciate/appreciate',
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
      title: '续命中',
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    let promiseArr = [];
    promiseArr.push(new Promise((reslove, reject) => {
      wx.cloud.callFunction({ //调用云函数login获取用户openid
        name: 'login'
      }).then(res => {
        this.setData({
          openid: res.result.openid
        })
        app.globalData.openid = res.result.openid //设置全局变量
        db.collection('schoolinf').where({  //查找数据库schoolinf判断用户是否为学校管理者
          _openid: res.result.openid
        }).get().then(res2 => {
          console.log(res2);
          this.setData({
            schoolName: res2.data[0].schoolName,
            isSchoolManager: true
          })
          reslove();
          wx.hideLoading();
          app.globalData.isSchoolManager = true
          app.globalData.schoolName = this.data.schoolName
        }).catch(err2 => {
          reslove();
          wx.hideLoading();
          console.log(err2);
          app.globalData.isSchoolManager = false
        })
      }).catch(err => {
        wx.hideLoading();
        console.error(err);
      });
    }));
    Promise.all(promiseArr).then(res => { //不是管理者则查找对应学生信息
      if (!this.data.isSchoolManager) {
        db.collection('studentinf').where({
          _openid: this.data.openid
        }).get().then(res => {
          this.setData({
            schoolName: res.data[0].schoolName
          })
          wx.hideLoading();
        }).catch(err => {
          wx.hideLoading();
          console.error(err);
        })
      }
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