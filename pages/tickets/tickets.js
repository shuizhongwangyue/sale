// pages/tickets/tickets.js
import { Req, apiList } from './../../utils/request.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: {
            order_type: 1,
            num: 1,
            piece_type: '',
            openId: '',
            payment: 0
        },
        ticketType: [],
        restTickets: {},
        name: "",
        numsArray: [null] //票数长度 方便循环
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '选择票档'
        })
        wx.getStorage({
            key: 'openId',
            success: (res) => {
                this.setData({
                    ['data.openId']: res.data
                })
            }
        })
        wx.getStorage({
            key: 'userInfo',
            success: (res={}) => {
                let data = { ...this.data.data, ...{ phone: res.data.phone} };
                this.setData({
                    data
                })
            }
        })
        this.setData({
            id: options.id
        }, ()=>{
            this.getTicketType();
            this.getRestTicket();
        })
    },
    getTicketType: function(){
        Req({
            url: `${apiList.ticketsType}?eventId=${this.data.id}`,
            type: "GET",
            hideLoading: true,
            success: res=>{
                if(res.success){
                    let list = res.message && res.message.cartList || [];
                    this.setData({
                        ticketType: list,
                        name: list[0] && list[0].events_name,
                        ["data.event_name"]: list[0] && list[0].events_name,
                        ["data.eventId"]: list[0] && list[0].events_id
                    })
                }else{
                    wx.showToast({
                        title: '获取票类失败',
                        icon: none
                    })
                }
            },
            error: error => {
                wx.showToast({
                    title: '获取票类失败',
                    icon: none
                })
            }
        })
    },
    getRestTicket: function () {
        Req({
            url: `${apiList.resTickets}?eventId=${this.data.id}`,
            type: "GET",
            success: res => {
                this.setData({
                    restTickets: res.message
                })
            },
            error: error => {
                console.log(error)
            }
        })
    },
    placeOrder: function () {
        console.log(this.data);
        if (this.checkData()) {
            wx.navigateTo({
                url: '/pages/confirm/confirm',
            })
        }
    },
    checkData: function(){
        let { data, numsArray } = this.data;
        if (!data.piece_type) {
            wx.showToast({
                title: '请选择要买的票',
                icon: 'none'
            });
            return false;
        }
        for (let index = 0; index < numsArray.length; index++) {
            if (!data[`idName${index + 1}`] || !data[`idNumber${index + 1}`]) {
                wx.showToast({
                    title: '请填写用户实名信息',
                    icon: 'none'
                });
                return false;
            }
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.test(data[`idNumber${index + 1}`])) {
                wx.showToast({
                    title: '身份证输入不合法',
                    icon: 'none'
                });
                return false;
            }
        }
        if(!data.phone){
            wx.showToast({
                title: '请填写联系电话',
                icon: 'none'
            });
            return false;
        }

        let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (reg.test(data.phone || "")) {
        } else {
            wx.showToast({
                title: '手机格式错误！',
                icon: 'none'
            })
            return false;
        }
        
        if (data.order_type == 2 && !data.address) {
            wx.showToast({
                title: '请填写邮寄地址',
                icon: 'none'
            });
            return false;
        }
        if (data.order_type == 1){
            this.setData({
                ['data.address']: ""
            })
        }
        
        wx.setStorage({
            key: 'userInfo',
            data: {
                phone: data.phone
            },
        })
        wx.setStorage({
            key: 'orderData',
            data: this.data.data,
        })
        return true;
    },
    setNums: function ({ currentTarget }) {
        let { restTickets, data } = this.data;
        let num = currentTarget.dataset.nums;
        if (!restTickets[data.piece_type] || (restTickets[data.piece_type] < num)) {
            wx.showToast({
                title: '该类型票余票不足',
                icon: 'none'
            })
            return;
        }
        let _data = Object.assign({}, this.data.data, {num});
        if(num < 6){
            delete _data.idName6;
            delete _data.idNumber6;
        }
        if (num < 5) {
            delete _data.idName5;
            delete _data.idNumber5;
        }
        if (num < 4) {
            delete _data.idName4;
            delete _data.idNumber4;
        }
        if (num < 3) {
            delete _data.idName3;
            delete _data.idNumber3;
        }
        if (num < 2) {
            delete _data.idName2;
            delete _data.idNumber2;
        }
        this.setData({
            data: _data,
            numsArray: new Array(Number(num))
        }, () => {
            this.calculatePrice()
        })
    },
    setTicketType: function ({ currentTarget }) {
        let { restTickets, data, ticketType } = this.data;
        let type = currentTarget.dataset.type;
        if (!restTickets[type] || (restTickets[type] <= 0)){
            wx.showToast({
                title: '该类型票已经售罄',
                icon: 'none'
            })
            return ;
        }
        let item = ticketType.find(val => { return val.piece_type == type }) || {};
        this.setData({
            ['data.piece_type']: type,
            ['data.price']: item.price
        }, ()=>{
            this.calculatePrice()
        })
    },
    setType: function ({ currentTarget }) {
        this.setData({
            ['data.order_type']: currentTarget.dataset.value
        }, () => {
            this.calculatePrice()
        })
    },
    inputChange: function ({ currentTarget, detail }) {
        this.setData({
            [`data.${currentTarget.dataset.key}`]: detail.value
        }, ()=>{
            console.log(this.data);
        })
    },
    calculatePrice: function(){
        let total = 0;
        let { data, ticketType=[] } = this.data;
        let item = ticketType.find(val => { return val.piece_type == data.piece_type }) || {};
        if(!data.piece_type){
            return ;
        }
        total += item.price * data.num;
        if(data.order_type == 2){
            total += 15;
        }
        this.setData({
            ['data.payment']: total.toFixed(2)
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: "http://img3.sportscv.cn/Fs29niuusr_tyVZuUYbQOA3IyX4A", // 当前显示图片的http链接
            urls: ["http://img3.sportscv.cn/Fs29niuusr_tyVZuUYbQOA3IyX4A"]
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