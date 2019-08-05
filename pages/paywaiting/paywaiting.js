// pages/paywaiting/paywaiting.js
import {
    Req,
    apiList
} from './../../utils/request.js';
import {
    formatTime
} from './../../utils/util.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        invoice: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id || 17
        })

        wx.getStorage({
            key: 'openId',
            success: (res) => {
                this.setData({
                    ['openId']: res.data
                })
            }
        })
    },
    getDetail: function() {
        Req({
            url: apiList.orderDetail + `?id=${this.data.id}`,
            type: "GET",
            success: res => {
                console.log(res)
                if (res.success) {
                    let data = res.message;
                    switch (data.order_status) {
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
                    this.getRestTime(data.create_time);
                    data.create_time = formatTime(new Date(data.create_time));
                    let _data = {
                        data: data
                    }
                    this.setData(_data)
                } else {
                    wx.showToast({
                        title: '获取订单详情失败',
                        icon: "none"
                    })
                }
            },
            error: err => {
                wx.showToast({
                    title: '获取订单详情失败',
                    icon: "none"
                })
            }
        })
    },
    getRestTime: function(time) {
        let nowTime = new Date().getTime();
        let sec = 1800000 - (nowTime - time);
        this.setData({
            startTime: time,
            restTime: Math.floor(sec / 60000) + '分' + Math.floor(sec % 60000 / 1000) + '秒'
        })
        this.timer = setInterval(() => {
            let nowTime = new Date().getTime();
            let sec = 1800000 - (nowTime - time);
            this.setData({
                restTime: Math.floor(sec / 60000) + '分' + Math.floor(sec % 60000 / 1000) + '秒'
            })
        }, 1000)
    },
    addInvoice: function(){
        let params = [];
        let { invoiceData } = this.data;
        params.push(`id=${this.data.id}`)
        for (let key in invoiceData){
            if (key !== '__webviewId__')
                params.push(`${key}=${invoiceData[key]}`)
        }
        Req({
            url: apiList.addInvoice + '?' + params.join('&'),
            type: 'POST',
            success: res=>{
                if (res.success) {
                    this.payAction();
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: ""
                    })
                }
            },
            error: error=>{
                console.log(error);
                wx.showToast({
                    title: '添加发票信息失败',
                    icon: ""
                })
            }
        })
    },
    sureAction: function () {
        if (this.data.invoice) {
            this.addInvoice();
            return;
        }
        this.payAction();
    },
    payAction: function() {
        Req({
            url: apiList.pay + `?orderId=${this.data.id}&subOpenId=${this.data.openId}`,
            type: 'POST',
            success: res => {
                if (res.success) {
                    let data = res.message;
                    wx.requestPayment({
                        timeStamp: data.TimeStamp,
                        nonceStr: data.NonceStr,
                        package: `prepay_id=${data.PrepayId}`,
                        signType: data.SignType,
                        paySign: data.PaySign,
                        success: (res) => {
                            wx.redirectTo({
                                url: `/pages/orderDetail/orderDetail?id=${this.data.id}`,
                            })
                        },
                        fail(res) {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: "none"
                    })
                }
            },
            error(error) {
                wx.showToast({
                    title: '支付接口调用失败！',
                    icon: "none"
                })
            }
        })
        // wx.redirectTo({
        //     url: '/pages/personal/personal',
        // })
    },
    //是否开具发票
    toggleInvoice: function() {
        this.setData({
            invoice: !this.data.invoice
        }, () => {
            if (this.data.invoice) {
                wx.getStorage({
                    key: 'invoiceData',
                    success: (res) => {
                        this.setData({
                            invoiceData: res.data
                        })
                    }
                })
                wx.navigateTo({
                    url: '/pages/invoice/invoice',
                })
            } else {
                this.setData({
                    invoiceData: null
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(options) {
        this.getDetail();
        if (this.data.invoice) {
            wx.getStorage({
                key: 'invoiceData',
                success: (res) => {
                    this.setData({
                        invoiceData: res.data
                    })
                }
            })
        } else {
            this.setData({
                invoiceData: null
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        this.timer && clearInterval(this.timer)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})