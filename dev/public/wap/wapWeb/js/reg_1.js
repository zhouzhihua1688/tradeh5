$(function() {
    App.bind("#register", "tap", register);
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
    var recomCode = App.getUrlParam("ic");
    if (App.isNotEmpty(recomCode)) {
        App.setSession("ic", recomCode)
    };
    var actid = App.getUrlParam("actid");
    if (App.isNotEmpty(actid)) {
        App.setSession("actid", actid)
    };
    //兼容
    var actId = App.getUrlParam("actId");
    if (App.isNotEmpty(actId)) {
        App.setSession("actid", actId)
    };
    var termNum = App.getUrlParam("termNum");
    if (App.isNotEmpty(termNum)) {
        App.setSession("termNum", termNum)
    };
    var mtp = App.getUrlParam("mtp");
    if (App.isNotEmpty(mtp)) {
        App.setSession("mtp", mtp)
    };
    var voucherNo = App.getUrlParam("voucherNo");
    if (App.isNotEmpty(voucherNo)) {
        App.setSession("voucherNo", voucherNo)
    };
//    App.bind("#pure-img-authcode", "tap", setWapRegAuthcode);
//    setWapRegAuthcode()
    //滑动验证码初始化
    _fmOpt = {
        display: 'popup',
        partner: "huitianfu",
        appName: "huitianfu_h5",
        fmb: true,
        initialTime: new Date().getTime(),
        token: "huitianfu" + "-" + new Date().getTime() + "-" + Math.random().toString(16).substr(2),
        getinfo: function () {
            return "e3Y6ICIyLjUuMCIsIG9zOiAid2ViIiwgczogMTk5LCBlOiAianMgbm90IGRvd25sb2FkIn0=";
        },
        env:1
    };
    var fm = document.createElement('script');
    fm.type = 'text/javascript';

    fm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'static.tongdun.net/captcha/main/tdc.js?ver=1.0&t=' + (new Date().getTime() / 600000).toFixed(0);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fm, s);
    //滑动验证码初始化
});

function setWapRegAuthcode() {
    $("#pure-img-authcode").attr("src", App.projectNm + "/wap_register_auth_code?system=" + new Date().getTime())
};

function register() {
	
	//获取滑动验证码开始
	$.ajax({
	type: 'GET',
	url: '/cos/v1/identity/captcha/token?validateType=1',
	data: {},
	dataType: 'json',
	t: new Date(),
	success: function (result) {
		if(result.returnCode == 0){
            //渲染验证码
            _fmOpt.triggerCaptcha(result.body);

	    }else {
		        alert('系统异常，请稍后再试!');
		}
	},
	error: function () {

	    alert('系统异常，请稍后再试!');
	}
	});
	//获取滑动验证码结束 	
	
    var mobileNo = $("#phonenum").val();

	// 验证成功回调，有效token由此传入
	_fmOpt.onSuccess = function (validateToken) {
	    App.unbind("#register", "tap", register);
	    if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(mobileNo)) {
	        var url = App.projectNm + "/account/register_web";
	        var data = JSON.stringify({
	            "mobileNo": mobileNo,
	            "slideAuthCode":validateToken
	        });
	        App.post(url, data, function(result) {
	            var needGoback = App.getUrlParam("needGoback");
	            if(result != undefined && result != null && result.returnCode == '2504'
	                && App.isNotEmpty(needGoback) && needGoback == '1'){
	                $(".Bomb-box-content p").html("您已是现金宝用户，请返回重新登录。");
	                $(".Bomb-box-ok").click(function () {
	                    window.history.back(-1);
	                });
	            }
//	            setWapRegAuthcode();
	            App.bind("#register", "tap", register)
	        }, function(result) {
	            App.setSession(App.registerInfo, {
	                "mobileNo": mobileNo,
	                "serialNo": result.body.serialNo
	            });
	            window.location = "./verifyPhoneNum.html"
	        })
	    } else {
	        App.bind("#register", "tap", register);
	        alert("请您输入正确的手机号码!")
	    }

	}
	// 验证成功回调结束

}