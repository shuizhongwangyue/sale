// pages/confirm/confirm.js
const app = getApp();
import { Req, apiList } from './../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: {},
        eventInfo: app.globalData.eventInfo
    },
    goToPay: function(id){
        wx.redirectTo({
            url: `/pages/paywaiting/paywaiting?id=${id}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '确认订单'
        })
        wx.getStorage({
            key: 'orderData',
            success: (res) => {
                this.setData({
                    data: res.data
                })
            }
        })
    },
    placeOrder: function(){
        Req({
            url: apiList.addOrder,
            type: 'POST',
            data: this.data.data,
            success: res => {
                if (res.code == '200') {
                    this.goToPay(res.data.id);
                } else {
                    wx.showToast({
                        title: res.errorMessage,
                        icon: 'none'
                    })
                }
            },
            error: error => {
                wx.showToast({
                    title: '下单失败！',
                    icon: 'none'
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