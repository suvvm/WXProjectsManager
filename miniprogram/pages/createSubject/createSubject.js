// pages/createSubject/createSubject.js
const app =  getApp();

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: app.globalData.openid,
    department: ['无'],
    myDepartment: '',
    schoolName: getApp().globalData.schoolName,
    bgdates: '1999-08-07',
    bgtimes: '12:00',
    eddates: '2019-07-26',
    edtimes: '12:00',
    sname: '',
    introduce: '',
    sponsor: '',
    maxNum: 0,
    nowNum: 0,
    price: '',
    type: '',
    AreaList: app.globalData.AreaList,
    location: {},
    images: [],
    fileIds: []
  },
  onDepartmentChange: function (e){
    this.setData({
      myDepartment: e.detail.value
    })
  },
    //  点击开始时间组件确定事件  
  bgbindTimeChange: function (e) {
    console.log("肥豪肥")
    this.setData({
      bgtimes: e.detail.value
    })
  },
  //  点击开始日期组件确定事件  
  bgbindDateChange: function (e) {
     console.log(e.detail.value)
    this.setData({
      bgdates: e.detail.value
    })
  },
   //  点击结束时间组件确定事件  
   edbindTimeChange: function (e) {
    console.log("瘦豪瘦")
    this.setData({
      edtimes: e.detail.value
    })
  },
  //  点击结束日期组件确定事件  
  edbindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      eddates: e.detail.value
    })
  },
  //  点击地区组件确认事件
  onAddrConfirm: function (e) {
    console.log(e.detail.values)
    this.setData({
      location: e.detail.values
    })
  },
  //  项目名称变更
  onSnameChange: function (e) {
    this.setData({
      sname: e.detail
    })
  },
  //  项目介绍变更
  onIntroduceChange: function (e) {
    this.setData({
      introduce: e.detail
    })
  },
  //  项目主办方变更
  onSponsorChange: function (e) {
    this.setData({
      sponsor: e.detail
    })
  },
  //  最大人数变更
  onMaxNumChange: function (e) {
    this.setData({
      maxNum: e.detail
    })
  },
  //  费用变更
  onPriceChange: function (e){
    this.setData({
      price: e.detail
    })
  },
  //  类型变更
  onTypeChange: function (e) {
    this.setData({
      type: e.detail
    })
  },
  //  上传图片
  uploadImg: function (e) {
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        const tempFilePaths = result.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 提交
  submit: function (e) {
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
    for(let i = 0; i < this.data.images.length; i++){ //上传项目相关图片
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];
        wx.cloud.uploadFile({
          cloudPath: 'subjectImgs'+ '/' + new Date().getTime() + suffix,
          filePath: item,
          success: (result) => {
            console.log(result.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(result.fileID)
            });
            reslove();
          },
          fail: ()=>{console.error}
        });
      }));
    }
    Promise.all(promiseArr).then(res => {
      db.collection('subjectInf').add({ //将项目信息加入数据库
        data: {
          schoolName: this.data.schoolName,
          bgdates: this.data.bgdates,
          bgtimes: this.data.bgtimes,
          eddates: this.data.eddates,
          edtimes: this.data.edtimes,
          sname: this.data.sname,
          introduce: this.data.introduce,
          sponsor: this.data.sponsor,
          maxNum: this.data.maxNum,
          nowNum: this.data.nowNum,
          price: this.data.price,
          type: this.data.type,
          location: this.data.location,
          fileIds: this.data.fileIds,
          department: this.data.myDepartment
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
    let promiseArr = [];
    promiseArr.push(new Promise((reslove, reject) => {  //先行获取openid
      this.setData({
        openid: app.globalData.openid
        
      })
      if(this.data.openid == ''){
        wx.cloud.callFunction({
          name:'login'
        }).then(res=>{
          this.setData({
            openid: res.result.openid
          })
          reslove();
          app.globalData.openid = res.result.openid
        }).catch(err=>{
          console.error(err);
        });
      }
    }));
    Promise.all(promiseArr).then(res => { //根据openid查找学校信息
      db.collection('schoolinf').where({
        _openid: this.data.openid
      }).get().then(res2 => {
        console.log(res2);
        this.setData({
          schoolName: res2.data[0].schoolName
        })
        for(let i = 0; i < res2.data[0].department.length; i++){
          this.setData({
            department: this.data.department.concat(res2.data[0].department[i]),
          })
        }
      }).catch(err2=>{
        console.error(err2);
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