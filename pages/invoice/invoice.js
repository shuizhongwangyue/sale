// pages/invoice/invoice.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        invoiceType: 0,
        title: '',
        taxNumber: '',
        companyAddress: '',
        telephone: '',
        bankName: '',
        bankAccount: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.getStorage({
            key: 'invoiceData',
            success: (res) => {
                this.setData(res.data)
            }
        })
    },
    //获取微信绑定的发票抬头
    chooseInvoiceTitle() {
        let that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.invoiceTitle']) {
                    wx.openSetting({
                        success: (res) => { }
                    })
                } else {
                    wx.chooseInvoiceTitle({
                        success: (res) => {
                            console.log(res);
                            that.setData({
                                title: res.title,
                                taxNumber: res.taxNumber,
                                companuAddress: res.companyAddress,
                                telephone: res.telephone,
                                bankName: res.bankName,
                                bankAccount: res.bankAccount
                            })
                        },
                        fail: (err) => {
                        }
                    })
                }
            }
        })
    },
    //更改发票类型
    changeType: function ({ currentTarget}){
        let type = currentTarget.dataset.type;
        let data = { invoiceType: type }
        this.setData(data)
    },
    inputChange: function ({ currentTarget, detail}){
        this.setData({
            [currentTarget.dataset.key]: detail.value
        })
    },
    sureAction: function(){
        function showToast(title){
            wx.showToast({
                title,
                icon: 'none'
            })
        }
        if (this.data.invoiceType == 0) {
            if (!this.data.title) {
                showToast('名称不能为空')
                return;
            }
            if (!this.data.taxNumber) {
                showToast('税号不能为空')
                return;
            }
            if (!this.data.companuAddress) {
                showToast('单位地址不能为空')
                return;
            }
            if (!this.data.telephone) {
                showToast('电话号码不能为空')
                return;
            }
            if (!this.data.bankName) {
                showToast('开户银行不能为空')
                return;
            }
            if (!this.data.bankAccount) {
                showToast('银行账号不能为空')
                return;
            }
        }else{
            if (!this.data.personName){
                showToast('姓名不能为空')
                return ;
            }
        }
        let storageData = {};
        if (Number(this.data.invoiceType) === 1){
            storageData.personName = this.data.personName;
            storageData.invoiceType = this.data.invoiceType;
        }else{
            storageData = JSON.parse(JSON.stringify(this.data));
            delete storageData.personName;
        }
        wx.setStorage({
            key: 'invoiceData',
            data: storageData,
            complete: ()=>{
                wx.navigateBack({
                    delta: 1
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
    onShow: function() {

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