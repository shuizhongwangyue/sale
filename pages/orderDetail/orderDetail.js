// pages/orderDetail/orderDetail.js
import { Req, apiList } from './../../utils/request.js';
import { formatTime } from './../../utils/util.js';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        eventInfo: app.globalData.eventInfo
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id
        }, this.getDetail)
    },
    getDetail: function(){
        Req({
            url: apiList.orderDetail + `?id=${this.data.id}`,
            type: "GET",
            success: res=>{
                console.log(res)
                if(res.success){
                    let data = res.message;
                    switch (data.order_status){
                        case -1:
                            data.order_statuss = '已失效';
                            break;
                        case 0:
                            data.order_statuss = '未支付';
                            break;
                        case 1:
                            data.order_statuss = '未取票';
                            break;
                        case 2:
                            data.order_statuss = '已取票';
                            break;
                    }
                    data.create_time = formatTime(new Date(data.create_time));
                    this.setData({
                        data: data,
                        invoiceInfo: data.invoice || {}
                    })
                }else{
                    wx.showToast({
                        title: '获取订单详情失败',
                        icon: none
                    })
                }
            },
            error: err => {
                wx.showToast({
                    title: '获取订单详情失败',
                    icon: none
                })
            }
        })
    },
    goToPay: function(){
        wx.redirectTo({
            url: `/pages/paywaiting/paywaiting?id=${this.data.id}`,
        })
    },
    callUser: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.eventInfo.concatPhone
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