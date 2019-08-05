// pages/personal/personal.js
import { Req, apiList } from './../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openId: "",
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '我的订单'
        })
        wx.getStorage({
            key: 'openId',
            success: (res) => {
                this.setData({
                    ['openId']: res.data
                })
            },
            complete: ()=>{
                this.getList();
            }
        })
    },
    getList: function(){
        Req({
            url: `${apiList.orderList}?openId=${this.data.openId}`,
            type: "GET",
            success: res => {
                if(res.success){
                    this.setData({
                        list: res.message && res.message.ordersList || []
                    })
                }
            },
            error: error => {
                console.log(error)
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