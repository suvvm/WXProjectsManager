// pages/chooseSchool/chooseSchool.js
const db = wx.cloud.database();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school: ['无'],
    schoolid: ['null'],
    mySchoolName: '',
    department: ['无'],
    myDepartment: '',
    openid: '',
    studentId: '',
    studentName: ''
  },
  onSchoolNameChange: function (e) {  //监听校名的改变对学院进行改变
    this.setData({
      mySchoolName: e.detail.value
    })
    console.log(e.detail.value);
    let sid = 0;  //记录当前学校记录对应id（多此一举有时间再优化，没时间就不干了）
    for (let i = 0; i < this.data.school.length; i++) {
      if (this.data.school[i] == this.data.mySchoolName) {
        sid = i;
      }
    }
    console.log(sid);
    console.log(this.data.schoolid[sid]);
    // 在schoolinf中找到对应学校信息并对学院数组进行赋值
    db.collection('schoolinf').doc(this.data.schoolid[sid]).get().then(res => {
      console.log(res);
      this.setData({
        department: ['无']
      })
      // 没有对myDepartment初值进行配置 有空再搞
      this.setData({
        department: this.data.department.concat(res.data.department)
      })
    }).catch(err => {
      console.error(err);
    });

  },
  onDepartmentChange: function (e) {  //根据选择的学院对myDepartment进行赋值
    this.setData({
      myDepartment: e.detail.value
    })
  },
  onStudentNameChange: function (e) {
    console.log(e.detail);
    this.setData({
      studentName: e.detail
    })
  },
  onStudentIdChange: function (e) {
    console.log(e.detail);
    this.setData({
      studentId: e.detail
    })
  },
  submit: function () { //提交
    wx.showLoading({
      title: '提交中',
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    console.log(this.data);
    db.collection('studentinf').add({ //向studentInf中提交信息
      data: {
        studentName: this.data.studentName,
        studentId: this.data.studentId,
        schoolName: this.data.mySchoolName,
        myDepartment: this.data.myDepartment,
      }
    }).then(res => {
      console.log(res);
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
      wx.showToast({
        title: '提交失败',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('schoolinf').get().then(res => {  //获取学校信息
      console.log(res);
      for (let i = 0; i < res.data.length; i++) {
        this.setData({
          school: this.data.school.concat(res.data[i].schoolName),
          schoolid: this.data.schoolid.concat(res.data[i]._id)
        })
      }
    }).catch(err => {
      console.error(err);
    });
    if (this.data.openid == '') {
      wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        this.setData({
          openid: res.result.openid
        })
        app.globalData.openid = res.result.openid
      }).catch(err => {
        console.error(err);
      });
    }
    this.setData({
      mySchoolName: this.data.school[0],
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