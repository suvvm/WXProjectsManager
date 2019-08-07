// pages/modifySchool/modifySchool.js
var app = getApp();

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataid: '',
    schoolName: app.globalData.schoolName,
    introduce: '',
    schoolBadge: [],
    certificate: [],
    badgefileIds: [],
    certificatefileIds: [],
    department: [],
    openid: app.globalData.openid,
    addDepartment: '',
    isaddDepartmentShow: false
  },
  //显示添加学院弹出层
  addDepartmentShow: function () {
    this.setData({
      isaddDepartmentShow: true
    })
  },
  //关闭添加学院弹出层
  onaddDepartmentClose: function () {
    this.setData({
      isaddDepartmentShow: false
    })
  },
  //学院信息改变
  addDepartmentChange: function (e) {
    this.setData({
      addDepartment: e.detail,
      //isaddDepartmentShow: false
    })
  },
  //提交学院
  addDepartmentSubmit: function () {
    this.setData({
      department: this.data.department.concat(this.data.addDepartment)
    })
  },
  //校名改变
  onSchoolNameChange: function (e) {
    console.log(e.detail);
    this.setData({
      schoolName: e.detail
    })
  },
  //简介改变
  onIntroduceChange: function (e) {
    console.log(e.detail);
    this.setData({
      introduce: e.detail
    })
  },
  //上传校徽
  uploadSchoolBadge: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        const tempFilePaths = result.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          schoolBadge: tempFilePaths
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },
  submit: function (e) {  //提交
    wx.showLoading({
      title: '提交中',
      mask: true,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
    console.log(this.data);
    if (this.data.schoolBadge == this.data.badgefileIds) {  //判断之前的校徽与当前校徽是否相等（有些多余）
      db.collection('schoolinf').doc(this.data.dataid).update({
        data: {
          schoolName: this.data.schoolName,
          introduce: this.data.introduce,
          department: this.data.department
        }
      }).then(res => {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '修改成功',
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
          title: '修改失败',
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
    } else {
      console.log("不同")
      wx.cloud.deleteFile({ //删除原有校徽
        fileList: this.data.badgefileIds,
        success: res => {
          // handle success
          console.log(res.fileList)
        },
        fail: console.error
      })
      let promiseArr = [];
      for (let i = 0; i < this.data.schoolBadge.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.schoolBadge[i];
          let suffix = /\.\w+$/.exec(item)[0];
          wx.cloud.uploadFile({ //上传新校徽
            cloudPath: 'schoolBadge' + '/' + new Date().getTime() + suffix,
            filePath: item,
            success: (result) => {
              console.log(result.fileID)
              this.setData({
                badgefileIds: new Array(result.fileID)
              });
              reslove();
            },
            fail: () => { console.error }
          });
        }));
      }
      Promise.all(promiseArr).then(res => { //更新数据库信息
        db.collection('schoolinf').doc(this.data.dataid).update({
          data: {
            schoolName: this.data.schoolName,
            introduce: this.data.introduce,
            badgefileIds: this.data.badgefileIds,
            department: this.data.department
          }
        }).then(res => {
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });
          wx.redirectTo({
            url: ' ../profile/profile'
          });
        }).catch(err => {
          console.error(err);
          wx.hideLoading();
          wx.showToast({
            title: '修改失败',
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
      });
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.cloud.callFunction({ //获取openid
      name: 'login'
    }).then(res => {
      this.setData({
        openid: res.result.openid
      })
      app.globalData.openid = res.result.openid
      db.collection('schoolinf').where({  //查询学校信息
        _openid: this.data.openid
      }).get().then(res2 => {
        console.log(res2);
        this.setData({
          schoolName: res2.data[0].schoolName,
          introduce: res2.data[0].introduce,
          schoolBadge: res2.data[0].badgefileIds,
          badgefileIds: res2.data[0].badgefileIds,
          certificate: res2.data[0].certificatefileIds,
          certificatefileIds: res2.data[0].certificatefileIds,
          department: res2.data[0].department,
          dataid: res2.data[0]._id
        })
        app.globalData.schoolName = this.data.schoolName
      }).catch(err2 => {
        console.error(err2);
      })
    }).catch(err => {
      console.error(err);
    });
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