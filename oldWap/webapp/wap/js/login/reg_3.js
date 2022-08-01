$(function() {
    var regInfo = App.getSession(App.registerInfo);
    if (regInfo == null || regInfo.mobileNo == null || regInfo.mobileNo == undefined) {
        alert("请您先填写手机号！");
        window.location = "./reg_step1.html"
    };
    App.bind("#register_pwd_confrim_btn", "tap", registerPwd)
});

function registerPwd() {
    App.unbind("#register_pwd_confrim_btn", "tap", registerPwd);
    var pwd = $("#pwd").val();
    var pwd_confirm = $("#pwd_confirm").val();
    var recommendNo = App.getSession("recommendNo");
    var openId = App.getSession("__openId");
    if (App.isEmpty(openId)){
        openId = App.getCookie("__openId");
    }
    var openUid = App.getSession("__openUid");
    if (App.isEmpty(openUid)){
        openUid = App.getCookie("__openUid");
    }
    var channelCode = App.getCookie("channelCode");
    if (checkPwd(pwd, pwd_confirm)) {
        var regInfo = App.getSession(App.registerInfo);
        var url = App.projectNm + "/account/register_loginpwd_web";
        var data = {
            "serialNo": regInfo.serialNo,
            "password": pwd_confirm,
            "inviteCode": "",
            "actid": ""
        };
        if(App.isNotEmpty(channelCode)){
            data.channelCode = channelCode;
        }
        if(App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
            data.openId = openId;
            data.openUid = openUid;
        }
        if (App.isNotEmpty(recommendNo)){
            data["recommendNo"] = recommendNo;
        }
        App.post(url, JSON.stringify(data), function() {
            App.bind("#register_pwd_confrim_btn", "tap", registerPwd)
        }, function(result) {
            var loginUrl = App.projectNm + "/account/login_web";
            var data = JSON.stringify({
                "loginFrom": "W",
                "certNum": regInfo.mobileNo,
                "password": pwd_confirm
            });
            App.post(loginUrl, data, null, function(result) {
                var rsource = App.getSession(App.rsource);
                App.clearSession();
                App.setSession(App.userInfo, result.body);

                var channel = App.getCookie("channel");
                var referUrl = App.getCookie("referUrl");
	            //加cookie 区分公众号登录入口
	            var entryChannel = App.getCookie("entryChannel");
	            if(entryChannel != "" && entryChannel != undefined){
	            	App.setCookie("loginChannel",entryChannel);
	            }
                if (App.isNotEmpty(referUrl)){
                    window.location = referUrl;
                } else {
                    if (rsource == undefined || rsource == null || "" == rsource) {
                        window.location = "./reg_success.html"
                    } else {
                        window.location = App.getSession(App.forwardUrl)
                    }
                }
            })
        })
    } else {
        App.bind("#register_pwd_confrim_btn", "tap", registerPwd)
    }
};

function checkPwd(pwd, pwdConfirm) {
    if (!App.isNotEmpty(pwd)) {
        alert("请您输入登录密码！");
        return false
    } else if (!App.isNotEmpty(pwdConfirm)) {
        alert("请您确认登录密码！");
        return false
    } else if (pwd != pwdConfirm) {
        alert("您输入的登录密码不一致！");
        return false
    } else {
        if (App.verifyLoginPwd(pwd)) {
            return true
        } else {
            return false
        }
    }
}