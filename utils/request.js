const ENV = 'dev';  // dev 表示开发 test 表示测试 prod 表示正式

export const apiList = {
    login: '/appletUser/me/login', //授权
    eventList: '/events/list', //获取活动赛事列表
    ticketsType: '/cart/applet/ticketTypes', //票的种类
    resTickets: '/cart/applet/ticketTypes/count', //剩余票数
    addOrder: '/order/create',//添加订单
    orderList: '/order/applet/lists', //获取订单列表
    orderDetail: '/order/getOrderById',//獲取訂單詳情
    pay: '/pay/start', //支付接口
    getCode: "/pageExhibition/qrcode", //获取二维码
    addInvoice: "/order/addInvoiceMessage", //添加发票信息
}

//后台服务地址
const serverUrl = {
    dev: "https://ticketed.sportscv.cn/ticketed",
    test: "https://ticketed.sportscv.cn/ticketed",
    prod: "https://ticketed.sportscv.cn/ticketed"
}

/**
 * options {
 *    url: 地址
 *    type: 请求方式
 *    data: 请求数据
 *    hideLoading: bool 隐藏loading框
 *    loadingText: 加载文字提示
 *    success: func 成功回调
 *    error: func 失败回调
 * }
 */
export function Req(options) {
    let url = serverUrl[ENV];
    options.url = url + options.url;

    if (!options.hideLoading) {
        wx.showLoading({
            title: options.loadingText || '请求中...',
        })
    }

    wx.request({
        url: options.url,
        method: options.type,
        data: options.data,
        header: {
            token: wx.getStorageSync('token') || ''
        },
        success: (res) => {
            wx.hideLoading();
            if (res.data.code == '10001'){
                wx.showToast({
                    title: '登录失效,请重试',
                    icon: 'none'
                });
                userLogin();
                return ;
            }
            let data = res.data;
            options.success(data)
        },
        fail: error => {
            options.error && options.error(error)
        }
    })
}

export function userLogin({ hidenLoading, successFun, errorFun }) {
    wx.login({
        success: (response) => {
            wx.getUserInfo({
                success: (wxUser) => { 
                    Req({
                        url: apiList.userLogin,
                        type: "POST",
                        data: {
                            code: response.code,
                            encryptedData: wxUser.encryptedData,
                            iv: wxUser.iv
                        },
                        hideLoading: hidenLoading,
                        loadingText: "加载中...",
                        success: res => {
                            successFun(res);
                        },
                        error: error => {
                            errorFun(error);
                        }
                    })
                 }
            })
        }
    })
}