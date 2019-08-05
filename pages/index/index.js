//index.js
//获取应用实例
const app = getApp();
import { Req, apiList } from "./../../utils/request";


Page({
    data: {
        id: 0,
        eventInfo: app.globalData.eventInfo
    },
    onLoad: function () {
        this.getDescHeight();
        this.getList();
    },
    getList: function(){
        Req({
            url: apiList.eventList,
            type: 'GET',
            success: res=>{
                if (res.code === '200') {
                    this.setData({
                        id: res.data && res.data[0] && res.data[0].id,
                        data: res.data && res.data[0] && res.data[0]
                    })
                }else{
                    wx.showToast({
                        title: res.errorMessage,
                        icon: none
                    })
                }
            },
            error: error=>{
                console.log(error)
            }
        })
    },
    callUser: function () {
        wx.makePhoneCall({
            phoneNumber: "18018035251"
        })
    },
    goToBook: function(){
        wx.navigateTo({
            url: `/pages/tickets/tickets?id=${this.data.id}`,
        })
    },
    openLocation: function() {
        wx.openLocation({
            longitude: 118.72500,
            latitude: 32.00844,
            scale: 13,
            name: "南京奥体中心体育场"
        })
    },
    previewImage: function (e) {
        let url = e.currentTarget.dataset && e.currentTarget.dataset.src;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url]
        })
    },
    expandDesc: function () {
        this.setData({
            expand: !this.data.expand
        })
    },
    getDescHeight: function () {
        let that = this;
        let query = wx.createSelectorQuery();
        //选择id
        query.select('#description').boundingClientRect()
        query.exec(function (res) {
            that.setData({
                height: res && res[0] && res[0].height
            });
        })
    },
})