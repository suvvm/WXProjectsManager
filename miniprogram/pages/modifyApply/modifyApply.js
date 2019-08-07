// pages/modifyApply/modifyApply.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyid: '',
    subject: {},
    schoolName: '',
    department: '',
    studentName: '',
    studentId: '',
    departmentApplyFile: [],
    departmentApplyFileId: [],
    schoolApplyFile: [],
    schoolApplyFileId: []
  },
  //上传学院文件
  uploadDepartmentApplyFile: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        const tempFilePaths = result.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          departmentApplyFile: tempFilePaths
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },
  //上传学校文件
  uploadSchoolApplyFile: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        const tempFilePaths = result.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          schoolApplyFile: tempFilePaths
        })
      },
      fail: () => { },
      complete: () => { }
    });
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

    wx.cloud.deleteFile({ //删除原有学院文件
      fileList: this.data.departmentApplyFileId,
      success: res => {
        // handle success
        this.setData({
          departmentApplyFileId: [],
        })
        console.log(res.fileList)
      },
      fail: console.error
    })
    wx.cloud.deleteFile({ //删除原有学校文件
      fileList: this.data.schoolApplyFileId,
      success: res => {
        // handle success
        this.setData({
          schoolApplyFileId: [],
        })
        console.log(res.fileList)
      },
      fail: console.error
    })
    let promiseArr = [];
    this.setData({
      schoolApplyFileId: [],
      departmentApplyFileId: [],
    })
    for (let i = 0; i < this.data.departmentApplyFile.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {  //异步处理 先对图片进行上传 之后根据返回的图片路径 将信息存储到数据库中
        let item = this.data.departmentApplyFile[i];
        let suffix = /\.\w+$/.exec(item)[0];
        //获取后缀名
        wx.cloud.uploadFile({ //上传学院申请文件
          cloudPath: 'departmentApplyFiles' + '/' + new Date().getTime() + suffix,
          filePath: item,
          success: (result) => {
            console.log(result.fileID)
            this.setData({
              departmentApplyFileId: this.data.departmentApplyFileId.concat(result.fileID)
            });
            reslove();
          },
          fail: () => { console.error }
        });
      }));
    }
    for (let i = 0; i < this.data.schoolApplyFile.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.schoolApplyFile[i];
        let suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({ //上传学校申请文件
          cloudPath: 'schoolApplyFiles' + '/' + new Date().getTime() + suffix,
          filePath: item,
          success: (result) => {
            console.log(result.fileID)
            this.setData({
              schoolApplyFileId: this.data.schoolApplyFileId.concat(result.fileID)
            });
            reslove();
          },
          fail: () => { console.error }
        });
      }));
    }
    Promise.all(promiseArr).then(res => { //图片上传完成后执行
      db.collection('applyinf').doc(this.data.applyid).update({  //将对应申请信息加入数据库中
        data: {
          subjectId: this.data.sid,
          subject: this.data.subject,
          schoolName: this.data.schoolName,
          department: this.data.department,
          studentName: this.data.studentName,
          studentId: this.data.studentId,
          departmentApplyFileId: this.data.departmentApplyFileId,
          schoolApplyFileId: this.data.schoolApplyFileId
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
        wx.navigateBack({//提交成功后返回上页
          delta: 1
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
      applyid: options.applyid,
    })
    db.collection('applyinf').doc(  //获取申请信息
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
        subject: res.data.subject,
      })
      wx.hideLoading();
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