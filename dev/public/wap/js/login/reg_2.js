var time = 59;
var timeOutId;
$(function() {
    function init() {
        $(".resend-text").hide();
        $(".resend").hide();
        var regInfo = App.getSession(App.registerInfo);
        if (regInfo == null) {
            alert("请您先填写手机号！");
            window.location = "./reg_step1.html"
        };
        $("#reg_mobileNo").html(regInfo.mobileNo.substring(0, 3) + "****" + regInfo.mobileNo.substring(7, 11))
    };
    init();
    App.bind("#register_next_btn", "tap", confrimRegister);
    App.bind("#resend_authCode", "tap", resendAuthCode);
    App.bind(".images", "tap", setWapRegAuthcode);
    timeOutId = setInterval(countDown, 1000)
});

function setWapRegAuthcode() {
    $(".images").attr("src", App.projectNm + "/wap_register_auth_code?system=" + new Date().getTime())
};

function confrimRegister() {
    App.unbind("#register_next_btn", "tap", confrimRegister);
    var regAuthCode = $("#reg_authCode").val();
    if (App.isNotEmpty(regAuthCode)) {
        if (App.verifySMSPwd(regAuthCode)) {
            var regInfo = App.getSession(App.registerInfo);
            var url = App.projectNm + "/account/register_confirm";
            var data = JSON.stringify({
                "serialNo": regInfo.serialNo,
                "authCode": regAuthCode
            });
            App.post(url, data, function() {
                setWapRegAuthcode();
                App.bind("#register_next_btn", "tap", confrimRegister)
            }, function(result) {
                var info = App.getSession(App.registerInfo);
                info.serialNo = result.body.serialNo;
                App.setSession(App.registerInfo, info);
                window.location = "./reg_step3.html"
            })
        } else {
            App.bind("#register_next_btn", "tap", confrimRegister)
        }
    } else {
        App.bind("#register_next_btn", "tap", confrimRegister);
        alert("请您输入验证码!")
    }
};

function resendAuthCode() {
    App.unbind("#resend_authCode", "tap", resendAuthCode);
    var url = App.projectNm + "/resend";
    var regInfo = App.getSession(App.registerInfo);
    var data = JSON.stringify({
        "serialNo": regInfo.serialNo
    });
    App.post(url, data, function() {
        App.bind("#resend_authCode", "tap", resendAuthCode)
    }, function() {
        timeOutId = setInterval(countDown, 1000)
    })
};

function countDown() {
    if (time > 0) {
        $("#resendTime").html(time);
        $(".resend-text").show();
        $(".resend").hide();
        time--
    } else {
        $(".resend-text").hide();
        $(".resend").show();
        clearInterval(timeOutId);
        time = 59
    }
}