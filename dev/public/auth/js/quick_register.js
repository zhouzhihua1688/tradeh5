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
        this.forwardUrl = "__req_source_forward_url"
        return {
            mobileNo: '',
            countDownStatus: false, //倒计时相关
            countNum: 60, //倒计时相关
            verifyCode: '',
            passwordStatus: true,
            password: '',
            serveClause: false
        }
    },
    created: function () {
        this.create_fmOptTag()
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
        },
        isEmpty(str) {
            if (str == null || str == undefined || str == "" || String(str).trim() == "" || str == "null") {
                return true;
            }
            return false;
        },
        create_fmOptTag() {
            var fm = document.createElement('script');
            fm.type = 'text/javascript';
            fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.tongdun.net/captcha/main/tdc.js?ver=1.0&t=' + (new Date().getTime() / 600000).toFixed(0);
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(fm, s);
        },
        verify() { //滑动验证
            if (!/^1[0-9]{10}$/.test(this.mobileNo)) {
                this.showTips({
                    content: '请您输入正确的手机号码',
                    confirmText: '确定'
                })
                return;
            };
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
                        this._fmOpt.triggerCaptcha(result.body);
                    } else {
                        this.showTips({
                            content: '系统异常，请稍后再试',
                            confirmText: '确定'
                        })
                    }
                }.bind(this),
                error: function () {
                    this.showTips({
                        content: '系统异常，请稍后再试',
                        confirmText: '确定'
                    })
                }.bind(this)
            });
            //获取滑动验证码结束 	
            // 验证成功回调，有效token由此传入
            this._fmOpt.onSuccess = this.onSuccess
        },
        onSuccess(validateToken) {
            var mobileNo = this.mobileNo
            var data = {
                "mobileNo": mobileNo,
                "slideAuthCode": validateToken,
            };
            if(utils.getUrlParam("platformId")){
                data["platformId"] = utils.getUrlParam("platformId");
            }
            this.verifyCode = ''; //清空已填写的验证码

            data.openId = utils.getSession("__openId") || utils.getCookie("__openId");
            data.openUid = utils.getSession("__openUid") || utils.getCookie("__openUid");
            data.channelCode = utils.getCookie("channelCode");
            if(utils.getUrlParam("custMgrId")){
                data.custMgrId=utils.getUrlParam("custMgrId");  //2021112获取添加custMgrId;
            }
            /*    var recommendNo = utils.getSession("recommendNo");
               if (!this.isEmpty(recommendNo)) {
                   data["recommendNo"] = recommendNo;
               } */
            utils.ajax({
                type: 'POST',
                url: '/mobile-bff/v1/account/register',
                data: JSON.stringify(data),
                dataType: 'json',
                t: new Date(),
                success: function (result) {
                    if (result.returnCode == 0) {
                        this.verifiedMobileNo = mobileNo;
                        this.serialNo = result.body.serialNo;
                        this.countDown() //倒计时
                    } else {
                        this.showTips({
                            content: result.returnMsg,
                            confirmText: '确定'
                        })
                    }
                }.bind(this),
                error: function () {
                    this.showTips({
                        content: '系统异常，请稍后再试',
                        confirmText: '确定'
                    })
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
            this.showTips({
                content: '短信确认码必须是六个数字或字母组成！',
                confirmText: '确定'
            })
            return false;
        },
        confrimRegister() {
            if (this.verifySMSPwd(this.verifyCode)) {
                var data = JSON.stringify({
                    "serialNo": this.serialNo,
                    "smsCode": this.verifyCode
                });

                utils.ajax({
                    type: 'POST',
                    url: '/mobile-bff/v1/account/registerConfirm',
                    data,
                    dataType: 'json',
                    t: new Date(),
                    success: function (result) {
                        if (result.returnCode == 0) {
                            this.serialNo = result.body.serialNo;
                            this.registerPwd()
                        } else {
                            this.showTips({
                                content: result.returnMsg,
                                confirmText: '确定'
                            })
                        }
                    }.bind(this),
                    error: function () {
                        this.showTips({
                            content: '系统异常，请稍后再试',
                            confirmText: '确定'
                        })
                    }.bind(this)
                });

            }
        },

        register() { //注册
            if (this.verifiedMobileNo === '') {
                return this.showTips({
                    content: '请填写手机号并验证',
                    confirmText: '确定'
                });
            }
            if (this.verifyCode === '') {
                return this.showTips({
                    content: '请填写验证码并设置登录密码',
                    confirmText: '确定'
                })
            }
            if (this.password === '') {
                return this.showTips({
                    content: '请设置登录密码',
                    confirmText: '确定'
                })
            }
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![,.@~`!#$%^&*]+$)[\w,.@~`!#$%^&*]{6,14}$/
            if (!reg.test(this.password)) {
                return this.showTips({
                    content: '密码需包含英文字母(区分大小写)，数字、符号(除空格)的任意两种',
                    confirmText: '确定'
                })
            }
            if (!this.serveClause) {
                return this.showTips({
                    content: '请同意服务条款',
                    confirmText: '确定'
                })
            }
            this.confrimRegister()
        },
        registerPwd() { //注册
            var data = {
                "serialNo": this.serialNo,
                "password": this.password,
                "inviteCode": "",
                "actid": ""
            };

            utils.ajax({
                type: 'POST',
                url: '/mobile-bff/v1/account/registerSetLoginPwd',
                data,
                dataType: 'json',
                t: new Date(),
                success: function (result) {
                    if (result.returnCode == 0) {
                        this.login()
                    } else {
                        this.showTips({
                            content: result.returnMsg,
                            confirmText: '确定'
                        })
                    }
                }.bind(this),
                error: function () {
                    this.showTips({
                        content: '系统异常，请稍后再试',
                        confirmText: '确定'
                    })
                }.bind(this)
            });
        },
        login() { //登录
            var data = {
                // "loginFrom": "W",
                "accountName": this.verifiedMobileNo,
                "password": this.password
            }
            data.openId = utils.getSession("__openId") || utils.getCookie("__openId");
            data.openUid = utils.getSession("__openUid") || utils.getCookie("__openUid");
            data.channelCode = utils.getCookie("channelCode");
            utils.ajax({
                type: 'POST',
                url: '/mobile-bff/v1/login/login-wap',
                beforeSend: function (req) {
                    req.setRequestHeader("version", '6.8');
                },
                data: JSON.stringify(data),
                dataType: 'json',
                t: new Date(),
                success: function (result) {
                    utils.verifyTradeChain(result.body, function () {
                        var rsource = utils.getSession('__req_source');
                        window.sessionStorage.clear();
                        utils.setSession(utils.userInfo, result.body);
                        //加cookie 区分公众号登录入口
                        var entryChannel = utils.getCookie("entryChannel");
                        if (entryChannel != "" && entryChannel != undefined) {
                            utils.setCookie("loginChannel", entryChannel);
                        }
                        var referUrl = utils.getCookie("referUrl");
                        if (!this.isEmpty(referUrl)) {
                            window.location = referUrl;
                        } else {
                            if (rsource == undefined || rsource == null || "" == rsource) {
                                window.location = "/mobileEC/wap/login/reg_success.html"
                            } else {
                                var forwardUrl = utils.getSession(this.forwardUrl)
                                if (forwardUrl) {
                                    window.location = utils.getSession(this.forwardUrl)
                                } else {
                                    window.location = "/mobileEC/wap/login/reg_success.html"
                                }
                            }
                        }
                    }.bind(this));
                }.bind(this)
            })
        }
    }
})