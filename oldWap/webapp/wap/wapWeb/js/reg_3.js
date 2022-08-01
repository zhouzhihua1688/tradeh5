$(function() {
    var bind_name = "input";
    if (navigator.userAgent.indexOf("MSIE") != -1) {
        bind_name = "propertychange";
    }
    $(".pure-form .pure-group input").on(bind_name, function() {
        $(this).siblings('.error').css("display", "block");
        if ($(this).val() == "") {
            $(this).next().css("display", "none");
        }
    });
    $(".pure-form .pure-group .error").on("click", function() {
        $(this).css("display", "none").siblings('input').val('').focus();
    });
    var regInfo = App.getSession(App.registerInfo);
    if (regInfo == null || regInfo.mobileNo == null || regInfo.mobileNo == undefined) {
        alert("请您先填写手机号！");
        window.location = "./registerPhoneNum.html";
    }
    App.bind("#register_pwd_confrim_btn", "tap", registerPwd);
});

function registerPwd() {
    App.unbind("#register_pwd_confrim_btn", "tap", registerPwd);
    var pwd = $(".setpwd").val();
    var pwd_confirm = $(".setagain").val();
    if (checkPwd(pwd, pwd_confirm)) {
        var regInfo = App.getSession(App.registerInfo);
        var url = App.projectNm + "/account/register_loginpwd_web";
        var ic = App.getSession("ic");
        var actid = App.getSession("actid");
        var termNum = App.getSession("termNum");
        var voucherNo = App.getSession("voucherNo");
        var mtp = App.getSession("mtp");
        var recommendNo = App.getSession("recommendNo");
        var data = JSON.stringify({
            "serialNo": regInfo.serialNo,
            "password": pwd_confirm,
            "inviteCode": ic,
            "actid": actid,
            "mtp": mtp,
            "termNum": termNum,
            "voucherNo": voucherNo
        });
        if (App.isNotEmpty(recommendNo)){
            data["recommendNo"] = recommendNo;
        }
        App.post(url, data, function() {
            App.bind("#register_pwd_confrim_btn", "tap", registerPwd);
        }, function(result) {
            var loginUrl = App.projectNm + "/account/login_web";
            var data = JSON.stringify({
                "loginFrom": "W",
                "certNum": regInfo.mobileNo,
                "password": pwd_confirm
            });
            var forwardUrl = result.body.forwardUrl;
            App.post(loginUrl, data, null, function(result) {
                var rsource = App.getSession(App.rsource);
                var referUrl = App.getCookie("referUrl");
                App.clearSession();
                App.setSession(App.userInfo, result.body);
                if (App.isNotEmpty(referUrl)) {
                    window.location = referUrl;
                } else {
                    if (App.isNotEmpty(forwardUrl)) {
                        window.location = "./" + forwardUrl;
                    } else {
                        if (rsource == undefined || rsource == null || "" == rsource) {
                            window.location = "./registerSuccess.html";
                        } else {
                            window.location = App.getSession(App.forwardUrl);
                        }
                    }
                }

            })
        })
    } else {
        App.bind("#register_pwd_confrim_btn", "tap", registerPwd);
    }
}

function checkPwd(pwd, pwdConfirm) {
    if (!App.isNotEmpty(pwd)) {
        alert("请您输入登录密码！");
        return false;
    } else if (!App.isNotEmpty(pwdConfirm)) {
        alert("请您确认登录密码！");
        return false;
    } else if (pwd != pwdConfirm) {
        alert("您输入的登录密码不一致！");
        return false;
    } else {
        if (App.verifyLoginPwd(pwd)) {
            return true;
        } else {
            return false;
        }
    }
}
