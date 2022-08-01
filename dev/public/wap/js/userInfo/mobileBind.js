var _fmOpt = {
    display: 'popup',
    partner: "huitianfu",
    appName: "huitianfu_h5",
    fmb: true,
    initialTime: new Date().getTime(),
    token: "huitianfu" + "-" + new Date().getTime() + "-" + Math.random().toString(16).substr(2),
    getinfo: function () {
        return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
    },
    env: 1
};

var vm = new Vue({
    el: '#app',
    data() {
        this._fmOpt = _fmOpt; //滑动验证相关
        this.timer = null; //倒计时相关
        this.verifiedMobileNo = '';
        this.serialNo = '';
        this.slideAuthCode = '';
        return {
            mobileNo:'',
            countDownStatus: false, //倒计时相关
            countNum: 60, //倒计时相关
            verifyCode: '',
            tipsText: '',
            tipsTextStatus: false,
            tipsTextStatusTime: null,
            flag: false,
            hasPhone:false   //用于判断input框能否输入
        }
    },
    created: function () {
        this.create_fmOptTag()
        var telePhone=utils.getUrlParam("telePhone")?utils.getUrlParam("telePhone"):'';
        console.log(telePhone);
        this.mobileNo=utils.getUrlParam("telePhone")?telePhone.substr(0, 3) + '****' + telePhone.substr(-4, 4):'';
        if(utils.getUrlParam("telePhone")){//用于判断input框能否输入
          this.hasPhone=true;
        }
    },
    computed: {
    },
    watch: {
        verifyCode:function(){
            if(this.verifyCode&&this.mobileNo){  //当输入框都有值才让确认按钮变颜色，可以点击
                return this.flag=true;
            }else{
                return this.flag=false;
            }
        },
        mobileNo:function(){
            if(this.verifyCode&&this.mobileNo){  //当输入框都有值才让确认按钮变颜色，可以点击
                return this.flag=true;
            }else{
                return this.flag=false;
            }
        }
    },
    methods: {
        showTips: function (params) {
            // var args = Array.prototype.slice.apply(arguments);
            var Profile = Vue.extend({
                template: `
                            <div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 1000;background: rgba(0, 0, 0, 0.7);display: flex;justify-content: center;align-items: center;font-size:calc(100vw/20);" v-show="show">
                                <div style="width: 15em;background-color: #fff;border-radius: 0.3em;">
                                    <header style="text-align: center;color: #333;font-size: 0.8em;padding: 1em 0;">{{ title }}</header>
                                    <div style="text-align: center;color: #666;font-size: 0.7em;padding: 0 1.5em 2em;" v-html='content'></div>
                                    <div style="display: flex;justify-content: space-evenly;padding:.5em 0; align-items: center; margin: 0 0.75em;border-top: solid 1px #eeeeee;">
                                        <button  style="width: 100%;padding: .3em 0;font-size: 0.75em;color:#0070fa;border: none;background-color: transparent;outline: none;border-radius: 0;line-height: inherit;" @click="complete">
                                            {{ confirmText }}
                                        </button>
                                        <button v-if="showCancel" @click="cancel" style="border-left: solid 1px #eeeeee;color:#0070fa;width: 100%;padding: .3em 0;font-size: 0.75em;background-color: transparent;outline: none;border-radius: 0;line-height: inherit;">{{cancelText}}</button>
                                    </div>
                                </div>
                            </div>
                `,
                data: function () {
                    return {
                        show: false,
                        title: "",
                        content: "",
                        confirmText: "确定",
                        cancelText: "",
                        showCancel: false
                    }
                },
                methods: {
                    plug(params) {
                        this.title = params.title ? params.title : "";
                        this.content = params.content ? params.content : "";
                        this.cancelText = params.cancelText;
                        this.confirmText = params.confirmText;
                        this.showCancel = params.cancelText ? true : false;
                        this.show = true;
                        Object.prototype.toString.call(params.complete) === "[object Function]" && this.$once("completeEvent", params.complete);
                        Object.prototype.toString.call(params.cancel) === "[object Function]" && this.$once("cancelEvent", params.cancel);
                    },
                    complete(ele) {
                        this.$emit("completeEvent", ele);
                        this.show = false;
                        this.$off("cancelEvent")
                    },
                    cancel(ele) {
                        this.$emit("cancelEvent", ele);
                        this.show = false;
                        this.$off("completeEvent")
                    },
                },
            })

            const init = new Profile()
            const element = init.$mount(document.createElement('div'))
            document.body.appendChild(element.$el)
            init.plug(params)
            this.showTips = init.plug.bind(init);

            // this.showTips({
            //     title: '信息', //标题
            //     content: '哈哈哈哈', //内容
            //     // cancelText: '取消', //取消按钮文字，默认不展示
            //     // confirmText: '确定', //确认按钮文字，默认确定
            //     // complete: function() { //需使用bind()
            //     // }.bind(this),
            //     // cancel: function() { //需使用bind()
            //     // }.bind(this)
            // })
        },
        isEmpty(str) {
            if (str == null || str == undefined || str == "" || String(str).trim() == "" || str == "null") {
                return true;
            }
            return false;
        },
        showBlackTips(text) {
            this.tipsText = text;
            this.tipsTextStatus = true;
            clearTimeout(this.tipsTextStatusTime)
            this.tipsTextStatusTime = setTimeout(() => {
                this.tipsTextStatus = false;
            }, 2000)
        },
        create_fmOptTag() {
            var fm = document.createElement('script');
            fm.type = 'text/javascript';
            fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.tongdun.net/captcha/main/tdc.js?ver=1.0&t=' + (new Date().getTime() / 600000).toFixed(0);
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(fm, s);
        },
        verify() { //滑动验证
            var callPhone=utils.getUrlParam("telePhone");
            if(utils.getUrlParam("telePhone")){
                if (!/^1[0-9]{10}$/.test(callPhone)) {
                    this.showBlackTips('您输入的手机号有误，请重新输入')
                    return;
                };
            }else{
                if (!/^1[0-9]{10}$/.test(this.mobileNo)) {
                    this.showBlackTips('您输入的手机号有误，请重新输入')
                    return;
                };
            }

            //获取滑动验证码开始
            utils.ajax({
                type: 'GET',
                url: '/cos/v1/identity/captcha/token?validateType=1',
                data: {},
                dataType: 'json',
                t: new Date(),
                success: function (result) {
                    if (result.returnCode == 0) {
                        //渲染验证码
                        console.log(result.body);
                        this._fmOpt.triggerCaptcha(result.body);
                    } else {
                        this.showBlackTips('系统异常，请稍后再试')
                    }
                }.bind(this),
                error: function () {
                    this.showBlackTips('系统异常，请稍后再试')
                }.bind(this)
            });
            //获取滑动验证码结束 	
            // 验证成功回调，有效token由此传入
            this._fmOpt.onSuccess = this.onSuccess
        },
        onSuccess(validateToken) {
            console.log("validateToken=",validateToken);
            this.slideAuthCode = validateToken;
            var mobileNo = utils.getUrlParam("telePhone")?utils.getUrlParam("telePhone"):this.mobileNo;
            // 20211026对应，替换mobile-bff新接口
            var data = JSON.stringify({
                "mobileNo": mobileNo,
                // "deviceId": "string",
                "slideAuthCode": this.slideAuthCode
            });
            console.log('mobileNo',mobileNo)
            this.verifyCode = ''; //清空已填写的验证码
            utils.ajax({
                type: 'POST',
                // url: '/mobileEC/services/account/login_sms_check',
                url: '/mobile-bff/v1/login/login-sms-check',
                data,
                dataType: 'json',
                t: new Date(),
                success: function (result) {
                    if (result.returnCode == 0) {
                        this.verifiedMobileNo = mobileNo;
                        this.serialNo = result.body.serialNo;
                        this.showBlackTips('发送验证码成功');
                        this.countDown() //倒计时
                    } else {
                        this.showTips({
                            content: result.returnMsg,
                            confirmText: '确定', //确认按钮文字
                        })
                    }
                }.bind(this),
                error: function () {
                    this.showBlackTips('系统异常，请稍后再试')
                }.bind(this)
            });
        },
        //倒计时
        countDown() {
            if (this.timer) return;
            var NUM = 60;
            this.countNum = NUM;
            this.countDownStatus = true;
            this.timer = setInterval(() => {
                if (this.countNum > 1 && this.countNum <= NUM) {
                    this.countNum--;
                } else {
                    this.countDownStatus = false;
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }, 1000)
        },
        verifySMSPwd: function (pwd) {
            if (/^\w{6}$/.test(pwd)) {
                return true;
            }
            this.showBlackTips('短信验证码必须是六个数字或字母组成！')
            return false;
        },
        loginAndBind() { //登录并绑定手机号
            if(this.flag==false){
                return;
            }
            if (!this.verifiedMobileNo) {
                return this.showTips({
                    title: '信息',
                    content: '请输入手机号并验证',
                    confirmText: '确定', //确认按钮文字
                })
            }
            if (!this.verifyCode) {
                return this.showTips({
                    title: '信息',
                    content: '请输入验证码',
                    confirmText: '确定', //确认按钮文字
                })
            }
            if (!this.verifySMSPwd(this.verifyCode)) {
                return;
            }
            // 20211026对应，替换mobile-bff新接口
            // let data = {
            //     proccessNo: this.serialNo,
            //     authCode: this.verifyCode,
            //     certNum: this.verifiedMobileNo,
            //     slideAuthCode: this.slideAuthCode
            // }
            let data = {
                "authCode": this.verifyCode,
                // "certificateConst": "string",
                // "deviceId": "string",
                // "fingerPrint": "string",
                // "imei": "string",
                // "imsi": "string",
                "mobileNo": this.verifiedMobileNo,
                "serialNo": this.serialNo,
                // "uuid": "string"
              }
            utils.ajax({
                type: 'POST',
                async: true,
                // url: `/mobileEC/services/account/login_sms_confirm`,
                url: `/mobile-bff/v1/login/login-sms-confirm`,    
                data: JSON.stringify(data),
                dataType: 'json',
                t: new Date(),
                success: (result) => {
                    var rescode = result.returnCode;
                    var resmsg = result.returnMsg;
                    if (rescode != "0") {
                        if (rescode == 1008) { //验证码错误
                            return this.showTips({
                                content: resmsg, //内容
                                cancelText: '找回密码', //取消按钮文字，默认不展示
                                confirmText: '取消', //确认按钮文字，默认确定
                                cancel: () => { //需跳转找回密码页面
                                    window.location = '/tradeh5/newWap/findPwd/IDcheck.html';
                                }
                            })
                        }
                        return this.showTips({
                            content: resmsg,
                            confirmText: '确定',
                        })
                    } else if (rescode == "0") {
                        // 20211026对应，替换mobile-bff新接口，添加安全链路，获取对应userInfo并set到sessionStorage中

                        utils.verifyTradeChain(result.body, successCallback.bind(this));
                        function successCallback(result){
                            utils.clearSession();
                            // utils.setSession(utils.userInfo, result.body);
                            // 20210810 单点登录改造，APP6.9开始，20211026对应
                            if(result.body && result.body.execResult && result.body.execResult.extendFields){
                                utils.setSession(utils.userInfo, result.body.execResult.extendFields.userLoginResult);
                            } else {
                                utils.setSession(utils.userInfo, result.body);
                            }
                            // 20210810 单点登录改造，APP6.9开始，20211026对应
                            var referUrl = utils.getUrlParam("referUrl");  // 已被decodeURIComponent处理过

                            if(!referUrl){
                                // window.location.href = "/mobileEC/wap/wezhan/service.html?d=" + (new Date()).getTime();
                                window.location.href = "/mobileEC/wap/userInfo/mobileBindSuccess.html";

                            }else{
                                var decodeReferUrl = decodeURIComponent(referUrl);
                                var reg = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/;
                                if(reg.test(decodeReferUrl) && reg.exec(decodeReferUrl) && reg.exec(decodeReferUrl)[1] && reg.exec(decodeReferUrl)[1].indexOf('99fund.com') === -1){ // 不包含生产和测试环境域名
                                    if(confirm('即将跳转至:' + decodeReferUrl)){
                                        window.location.href = decodeReferUrl;
                                    }
                                }
                                else {
                                    window.location.href = decodeReferUrl;
                                }
                            }
                        }

                    }
                }
            })
        },
        // 收不到验证码
        codeTips() {
            this.showTips({
                content: `
                <p style='text-align:left;margin-bottom:.5rem'>1、确认手机号填写无误，若手机号正确，请查看短信是否被手机安全软件拦截;</p>
                <p style='text-align:left;margin-bottom:.5rem'>2、请确认您的手机处于正常通讯状态且信号良好，否则建议您稍后重试;</p>
                <p style='text-align:left;'>3、其他异常情况，请联系在线客服协助解决。</p>
                `, //内容
                confirmText: '我知道了', //确认按钮文字
            })
        },
        back(){
            window.location.href="/tradeh5/newWap/auth/login_wap.html"
        }
    }
})