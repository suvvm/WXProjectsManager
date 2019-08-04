// pages/applyInfo/applyInfo.js
const app =  getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyid: '',
    subject: {},
    subjectId: '',
    schoolName: '',
    department: '',
    studentName: '',
    studentId: '',
    departmentApplyFile: [],
    departmentApplyFileId: [],
    schoolApplyFile: [],
    schoolApplyFileId: [],
    isDepartmentAccept: false,
    isSchoolAccepted: false,
    isbegining: false
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
      applyid: options.applyid,
    })
    db.collection('applyinf').doc(
      options.applyid
    ).get().then(res => {
      this.setData({
        department: res.data.department,
        schoolApplyFile: res.data.schoolApplyFileId,
        schoolApplyFileId: res.data.schoolApplyFileId,
        departmentApplyFileId: res.data.departmentApplyFileId,
        departmentApplyFile: res.data.departmentApplyFileId,
        schoolName: res.data.schoolName,
        studentId: res.data.studentId,
        studentName: res.data.studentName,
      })
      db.collection('subjectInf').doc(
        res.data.subjectId
      ).get().then(res2 => {
        console.log('查找项目信息成功')
        this.setData({
          subject: res2.data
        })
        db.collection('isApproval').where({
          applyid: options.applyid
        }).get().then(res3 => {
          console.log('查找审核信息成功')
          console.log(res3)
          console.log(options.applyid)
          if(res3.data.length != 0){
            this.setData({
              isbegining: true,
              isDepartmentAccept: res3.data[0].isDepartmentAccept,
              isSchoolAccepted: res3.data[0].isSchoolAccepted
            })
          }
          wx.hideLoading();
        }).catch(err3 => {
          console.error(err3);
          wx.hideLoading();
        })
      }).catch(err2 => {
        console.error(err2);
        wx.hideLoading();
      })    
    }).catch(err => {
      console.error(err);
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