// pages/createSchool/createSchool.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '',
    introduce: '',
    schoolBadge: [],
    certificate: [],
    badgefileIds: [],
    certificatefileIds: []
  },
  onSchoolNameChange: function (e) {  //根据校名的改变对schoolName进行赋值
    console.log(e.detail);
    this.setData({
      schoolName: e.detail
    })
  },
  onIntroduceChange: function (e) { // 根据简介的改变对 introduce进行改变
    console.log(e.detail);
    this.setData({
      introduce: e.detail
    })
  },
  uploadSchoolBadge: function (e) { //点击上传校徽获取图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        const tempFilePaths = result.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          schoolBadge: this.data.schoolBadge.concat(tempFilePaths)
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  uploadCertificate: function (e) { //点击上传凭证获取图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        const tempFilePaths = result.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          certificate: this.data.certificate.concat(tempFilePaths)
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  submit: function (e) {  //提交
    wx.showLoading({
      title: '提交中',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    console.log(this.data);
    let promiseArr = [];
    for(let i = 0; i < this.data.schoolBadge.length; i++){
      promiseArr.push(new Promise((reslove, reject) => {  //异步处理 先对图片进行上传 之后根据返回的图片路径 将信息存储到数据库中
        let item = this.data.schoolBadge[i];
        let suffix = /\.\w+$/.exec(item)[0];
        //获取后缀名
        wx.cloud.uploadFile({ //上传校徽
          cloudPath: 'schoolBadge'+ '/' + new Date().getTime() + suffix,
          filePath: item,
          success: (result) => {
            console.log(result.fileID)
            this.setData({
              badgefileIds: this.data.badgefileIds.concat(result.fileID)
            });
            reslove();
          },
          fail: ()=>{console.error}
        });
      }));
    }
    for(let i = 0; i < this.data.certificate.length; i++){
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.certificate[i];
        let suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({ //上传凭证
          cloudPath: 'schoolCertificate'+ '/' + new Date().getTime() + suffix,
          filePath: item,
          success: (result) => {
            console.log(result.fileID)
            this.setData({
              certificatefileIds: this.data.certificatefileIds.concat(result.fileID)
            });
            reslove();
          },
          fail: ()=>{console.error}
        });
      }));
    }
    Promise.all(promiseArr).then(res => { //图片上传完成后执行
      db.collection('schoolinf').add({  //将对应学校信息加入数据库中
        data: {
          schoolName: this.data.schoolName,
          introduce: this.data.introduce,
          badgefileIds: this.data.badgefileIds,
          certificatefileIds: this.data.certificatefileIds,
          department: []
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
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        wx.redirectTo({  //提交成功后重定向至个人信息页
          url:' ../profile/profile'  
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
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      })
    });
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