// pages/judgeDepartment/judgeDepartment.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyid: '',
    apply: {},
    isDepartmentAccept: false,
    isSchoolAccepted: false
  },
  accepted: function () { //批准
    wx.showLoading({
      title: '处理中',
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    db.collection('isApproval').where({ //根据applyid查找对应审核信息
      applyid: this.data.applyid
    }).get().then(res => {
      console.log(res);
      if (res.data.length == 0) {
        db.collection('isApproval').add({   //若无信息则添加审核记录
          data: {
            applyid: this.data.applyid,
            isDepartmentAccept: true,
            isSchoolAccepted: false
          }
        }).then(res2 => {
          console.log("添加审核信息成功")
          wx.navigateBack({ //返回上一页
            delta: 1
          });
          wx.hideLoading();
        }).catch(err2 => {
          console.log("添加审核信息败亡")
          wx.hideLoading();
          console.log(err2);
        })
      } else {
        db.collection('isApproval').doc(  //更新现有记录
          res.data[0]._id).update({
            data: {
              isDepartmentAccept: true,
            }
          }).then(res3 => {
            this.setData({
              isDepartmentAccept: true
            })
            console.log("修改审核信息成功")
            if (this.data.isSchoolAccepted && this.data.isDepartmentAccept) { //更新项目报名人数
              db.collection('applyinf').doc(
                this.data.applyid
              ).get().then(res2 => {
                db.collection('subjectInf').doc(
                  res2.data.subjectId
                ).get().then(res3 => {
                  console.log(res3);
                  var temp = parseInt(res3.data.nowNum);
                  db.collection('subjectInf').doc(
                    res2.data.subjectId
                  ).update({
                    data: {
                      nowNum: (temp + 1).toString()
                    }
                  }).then(res4 => {
                    wx.navigateBack({
                      delta: 1
                    });
                    wx.hideLoading();
                  }).catch(err4 => {
                    console.log(err4)
                    wx.hideLoading();
                  })
                }).catch(err3 => {
                  console.error(err3)
                  wx.hideLoading();
                })
              }).catch(err2 => {
                console.error(err2);
                wx.hideLoading();
              })
            } else {
              wx.navigateBack({
                delta: 1
              });
              wx.hideLoading();
            }
          }).catch(err3 => {
            console.log("添加审核信息败亡")
            console.error(err3);
            wx.hideLoading();
          })
      }
    }).catch(err => {
      console.log("查找时出现错误");
      console.error(err);
      wx.hideLoading();
    })
  },

  denied: function () { //驳回
    wx.showLoading({
      title: '处理中',
      mask: true,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
    db.collection('isApproval').where({ //基础操作同上
      applyid: this.data.applyid
    }).get().then(res => {
      console.log(res);
      if (res.data.length == 0) {
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
      } else {
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
      db.collection('isApproval').where({
        applyid: res.data.applyid
      }).get().then(res2 => {
        console.log('初始化审批信息成功');
        console.log(res2)
        this.setData({
          isDepartmentAccept: res2.data[0].isDepartmentAccept,
          isSchoolAccepted: res2.data[0].isSchoolAccepted
        })
        wx.hideLoading();
      }).catch(err2 => {
        console.error(err2);
        wx.hideLoading();
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