var time = 59;
$(function() {
    var bind_name = "input";
    if (navigator.userAgent.indexOf("MSIE") != -1) {
        bind_name = "propertychange";
    };
    $(".pure-form .pure-group input").on(bind_name, function() {
        $(this).siblings('.error').css("display", "block");
        if ($(this).val() == "") {
            $(this).next().css("display", "none")
        }
    });
    $(".pure-form .pure-group .error").on("click", function() {
        $(this).css("display", "none").siblings('input').val('').focus()
    });

    function init() {
        $(".resend-text").hide();
        $(".resend").hide();
        var regInfo = App.getSession(App.registerInfo);
        if (regInfo == null) {
            alert("请您先填写手机号！");
            window.location = "./registerPhoneNum.html"
        } else {
            var mobileNo = regInfo.mobileNo;
            $("#mobileNo").html(mobileNo.substr(0, 3) + "****" + mobileNo.substr(mobileNo.length - 4, mobileNo.length))
        };
        $("#reg_mobileNo").html(regInfo.mobileNo.substring(0, 3) + "****" + regInfo.mobileNo.substring(7, 11))
    };
    init();
    App.bind("#register_next_btn", "tap", confrimRegister);
    App.bind(".btn-setcode", "click", resendAuthCode);
    App.bind("#pure-img-authcode", "tap", setWapRegAuthcode);
    countDown();
    setWapRegAuthcode()
});

function setWapRegAuthcode() {
    $("#pure-img-authcode").attr("src", App.projectNm + "/wap_register_auth_code?system=" + new Date().getTime())
};

function confrimRegister() {
    App.unbind("#register_next_btn", "tap", confrimRegister);
    var regAuthCode = $(".phone-viri").val();
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
                window.location = "./setLoginPassword.html"
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
    App.unbind(".btn-setcode", "click", resendAuthCode);
    var url = App.projectNm + "/resend";
    var regInfo = App.getSession(App.registerInfo);
    var data = JSON.stringify({
        "serialNo": regInfo.serialNo
    });
    App.post(url, data, function() {
        App.bind(".btn-setcode", "click", resendAuthCode)
    }, function() {
        countDown()
    })
};

function countDown() {
    $(".btn-setcode").prop("disabled", true);
    $(".btn-setcode").html('<span id="num">' + 60 + '</span>' + '秒后重发');
    startpao()
};

function startpao() {
    var start = $("#num").text();
    var t = setInterval(function() {
        start--;
        $("#num").text(start);
        if (start == 0) {
            clearInterval(t);
            $(".btn-setcode").prop("disabled", false);
            $(".btn-setcode").text("重新获取")
        }
    }, 1000)
}