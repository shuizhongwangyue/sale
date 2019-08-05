//app.js
import { Req, apiList } from './utils/request.js';
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
          console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        Req({
            url: apiList.login + `?code=${res.code}`,
            type: "POST",
            hideLoading: true,
            data: {
                code: res.code
            },
            success: (res)=>{
                console.log(res)
                if(res.success){
                    wx.setStorage({
                        key: 'openId',
                        data: res.message && res.message.open_id,
                    })
                }
            },
            error: error=>{
                console.log(error)
            }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    eventInfo: {
        eventAddress: '南京奥体中心体育场(南京市建邺区江东中路222号)',
        ticketAddress: '南京市建邺区扬子江大道226号南京体育双创基地',
        enterTime: '2019年7月24日19:30',
        ticketTime: '7月11号和12号 10:00到18:00',
        concatName: '时超',
        concatPhone: '18018035251'
    }
  }
})