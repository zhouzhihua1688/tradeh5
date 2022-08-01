
var referUrl = App.getUrlParam("referUrl");
var actid = App.getUrlParam("actid");
var ic = App.getUrlParam("ic");
var voucherNo = App.getUrlParam("voucherNo");
var inviteCustNo = App.getUrlParam("inviteCustNo");
if(App.isEmpty(actid)){
	actid = referUrl.substr(referUrl.indexOf("=")+1);
	if(Number(actid) > 0){
		
	}else{
		actid = "";
	}
}
if (App.isEmpty(actid)) {
    actid = App.getSession("actid")
};
if (App.isEmpty(ic)) {
	ic = App.getSession("ic")
};
if (App.isEmpty(voucherNo)) {
    voucherNo = App.getSession("voucherNo")
};

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
    App.bind("#bind", "tap", login);
    App.bind("#register", "tap", function() {
        var registUrl = "./registerPhoneNum.html";
        if (App.isNotEmpty(actid)) {
            registUrl = registUrl + "?actid=" + actid;
        };
        if (App.isNotEmpty(ic)) {
            registUrl = registUrl + "&ic=" + ic;
        };
        if (App.isNotEmpty(inviteCustNo)) {
            registUrl = registUrl + "&inviteCustNo=" + inviteCustNo;
        };
        window.location = registUrl;
    });
    App.queryLastProfit(function() {
        $("#yield").html(App.getSession(App.profitInfo).yield);
        var year = new Date().getFullYear();
        var dateDay = App.getSession(App.profitInfo).date;
        dateDay = dateDay.replace('月', '.').replace('日', '');
        $("#yieldDate").html(year + "." + dateDay)
    });
    App.bind("#lAuthCodeImg", "tap", getAuthCode);
    getAuthCode()
    	
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

function getAuthCode() {
    $("#lAuthCodeImg").attr("src", App.projectNm + "/login_wap_auth_code?rd=" + Math.random())
};

function login() {
    var loginName = $("#login-name").val();
    var loginPwd = $("#login-pwd").val();
    var authCode = $("#authCode").val();
    if (App.isEmpty(loginName)) {
        alert("请输入用户名!");
        return
    };
    if (App.isEmpty(loginPwd)) {
        alert("请输入登录密码!");
        return
    };
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
    
	// 验证成功回调，有效token由此传入
	_fmOpt.onSuccess = function (validateToken) {
	    App.unbind("#bind", "tap", login);
	    var url = App.projectNm + "/account/login_wap";
	    var data = JSON.stringify({
	        "loginFrom": "W",
	        "certNum": loginName,
	        "password": loginPwd,
//	        "authCode": authCode,
	        "voucherNo": voucherNo,
	        "actid": actid,
	        "slideAuthCode":validateToken
	    });
	    App.post(url, data, function(result) {
	        var needGoback = App.getUrlParam("needGoback");
	        if(result != undefined && result != null && result.returnCode == '1037'
	            && App.isNotEmpty(needGoback) && needGoback == '1'){
	            $(".Bomb-box-content p").html("您未开通现金宝，请返回重新注册。");
	            $(".Bomb-box-ok").click(function () {
	                window.history.back(-1);
	            });
	        }
	        App.bind("#bind", "tap", login);
//	        getAuthCode()
	    }, function(result) {
	        var forwardUrl = result.body.forwardUrl;
	        if (App.isNotEmpty(referUrl)) {
	        	var nextUrl = referUrl;
                if (App.isNotEmpty(actid) && (nextUrl.indexOf("actid")< 0)) {
                    if(nextUrl.indexOf('?') < 0){
                        nextUrl = nextUrl + "?actid=" + actid;
                    }else {
                        nextUrl = nextUrl + "&actid=" + actid;
                    }

                };
		        if (App.isNotEmpty(ic)) {
		            nextUrl = nextUrl + "&ic=" + ic;
		        };
                if (App.isNotEmpty(inviteCustNo)) {
                    nextUrl = nextUrl + "&inviteCustNo=" + inviteCustNo;
                };
		        window.location = nextUrl;
	        } else if (App.isNotEmpty(forwardUrl)) {
	            window.location = forwardUrl
	        } else {
	            App.clearSession();
	            App.setSession(App.userInfo, result.body);
	            window.location = "../wezhan/service.html?d=" + (new Date()).getTime()
	        }
	    })
	
	}// 验证成功回调结束

}