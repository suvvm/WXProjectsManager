// pages/areaSubject/areaSubject.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AreaList: app.globalData.AreaList,
    openid: app.globalData.openid,
    schoolName: app.globalData.schoolName,
    subject: [],
    nowSubject: [],
    isSchoolManager: app.globalData.isSchoolManage,
    location: {},
    activeNames: ['1']
  },
  onCollapseChange(event) { //折叠栏点击
    this.setData({
      activeNames: event.detail
    });
  },
  onAddrConfirm: function (e) { //确认地区
    this.setData({
      location: e.detail.values
    })
    console.log('地区信息');
    console.log(e.detail.values);
    db.collection('subjectInf').where({ //确认是查找并加载对应项目数据
      location: e.detail.values
    }).get().then(res => {
      console.log(res)
      this.setData({
        nowSubject: res.data
      })
    }).catch(err => {
      console.error(err)
    })
  },
  gotoinfo: function (e) {  //根据subjectid打开对应项目的详情页
    wx.navigateTo({
      url: `../subjectInfo/subjectInfo?subjectid=${e.target.dataset.subjectid}`,
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
    let promiseArr = [];
    //异步处理
    promiseArr.push(new Promise((reslove, reject) => {
      this.setData({
        openid: app.globalData.openid
      })
      if (this.data.openid == '') {
        wx.cloud.callFunction({ //调用登录云函数获取openid
          name: 'login'
        }).then(res => {
          console.log('获取登陆数据完成');
          this.setData({
            openid: res.result.openid
          })
          reslove();
          app.globalData.openid = res.result.openid
        }).catch(err => {
          console.log('获取登陆数据失败');
          console.error(err);
        });
      } else {
        reslove();
      }

    }));
    Promise.all(promiseArr).then(res => { //获取openid后执行
      db.collection('schoolinf').where({  //在数据库scho对应openidolinf中查找
        _openid: this.data.openid
      }).get().then(res2 => {
        console.log('获取管理员信息');
        console.log(res2);
        this.setData({
          schoolName: res2.data[0].schoolName,
        })
        console.log('管理员为true');
        if (app.globalData.isSchoolManager != true) {
          app.globalData.isSchoolManager = true
        }
        if (app.globalData.schoolName == '') {
          app.globalData.schoolName = res2.data[0].schoolName
        }

        this.setData({
          isSchoolManager: true
        })
        db.collection('subjectInf').where({ //根据从schoolinf中查找到的学校名去subjectInf中寻找对应项目
          schoolName: res2.data[0].schoolName
        }).get().then(res4 => {
          console.log("获取项目信息");
          this.setData({
            subject: res4.data
          })
          wx.hideLoading();
        }).catch(err4 => {
          console.error("获取项目信息失败");
          console.error(err4);
          wx.hideLoading();
        })

      }).catch(err2 => {
        console.log("获取管理员信息失败");
        console.log(err2);
        db.collection('studentinf').where({ //查询学生信息
          _openid: this.data.openid
        }).get().then(res3 => {
          console.log('获取学生信息');
          console.log('res3');
          this.setData({
            schoolName: res3.data[0].schoolName
          })
          app.globalData.isSchoolManager = false
          app.globalData.schoolName = res3.data[0].schoolName
          db.collection('subjectInf').where({ //根据从studentinf中查找到的学校名去subjectInf中寻找对应项目
            schoolName: res3.data[0].schoolName
          }).get().then(res5 => {
            console.log("获取项目信息");
            this.setData({
              subject: res5.data
            })
            wx.hideLoading();
          }).catch(err5 => {
            console.error("获取项目信息失败");
            wx.hideLoading();
            console.error(err5);
          })
        }).catch(err3 => {
          console.error("获取学生信息失败");
          wx.hideLoading();
          console.error(err3);
        })
        wx.hideLoading();
      });
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