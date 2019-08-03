// pages/judgeDepartment/judgeDepartment.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyid: '',
    apply: {}
  },
  accepted: function () {
    wx.showLoading({
      title: '处理中',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    db.collection('isApproval').where({
      applyid: this.data.applyid
    }).get().then(res => {
      console.log(res);
      if(res.data.length == 0){
        db.collection('isApproval').add({  
          data: {
            applyid: this.data.applyid,
            isDepartmentAccept: true,
            isSchoolAccepted: false
          }
        }).then(res2 => {
          wx.hideLoading();
          console.log("添加审核信息成功")
          wx.navigateBack({
            delta: 1
          });
        }).catch(err2 => {
          console.log("添加审核信息败亡")
          wx.hideLoading();
          console.log(err2);
        })
      }else{
        db.collection('isApproval').doc(
          res.data[0]._id).update({
            data: {
              isDepartmentAccept: true,
            }
          }).then(res3 => {
            console.log("修改审核信息成功")
            wx.navigateBack({
              delta: 1
            });
            wx.hideLoading();
          }).catch(err3 => {
            console.log("添加审核信息败亡")
            console.error(err3);
            wx.hideLoading();
          })
      }
    }).catch(err => {
      console.log("查找时出现错误");
      console.error(err);
    })
  },

  denied: function () {
    wx.showLoading({
      title: '处理中',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    db.collection('isApproval').where({
      applyid: this.data.applyid
    }).get().then(res => {
      console.log(res);
      if(res.data.length == 0){
        db.collection('isApproval').add({  
          data: {
            applyid: this.data.applyid,
            isDepartmentAccept: false,
            isSchoolAccepted: false
          }
        }).then(res2 => {
          wx.hideLoading();
          console.log("添加审核信息成功")
          wx.navigateBack({
            delta: 1
          });
        }).catch(err2 => {
          console.log("添加审核信息败亡")
          wx.hideLoading();
          console.log(err2);
        })
      }else{
        db.collection('isApproval').doc(
          res.data[0]._id).update({
            data: {
              isDepartmentAccept: false,
            }
          }).then(res3 => {
            console.log("修改审核信息成功")
            wx.navigateBack({
              delta: 1
            });
            wx.hideLoading();
          }).catch(err3 => {
            console.log("添加审核信息败亡")
            console.error(err3);
            wx.hideLoading();
          })
      }
    }).catch(err => {
      console.log("查找时出现错误");
      console.error(err);
    })
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
      applyid: options.applyid
    });
    db.collection('applyinf').doc(
      options.applyid
    ).get().then(res => {
      this.setData({
        apply: res.data
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