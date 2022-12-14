$(function(){
    $(".rules").click(function(){
        $(".chose-icon").toggleClass("current");
    });
	$('.clearInputTxt').click(function () {
		$('.phone').val('');
	});
	$('.changePwd').click(function () {
		if($('.pwd').attr('type') === 'password'){
			$('.pwd').attr('type','text');
			$('.changePwd>img').attr('src','img/eye.png');
		}
		else {
			$('.pwd').attr('type','password');
			$('.changePwd>img').attr('src','img/eyelash.png');
		}
	});
    utils.bind("#login_btn", "tap", login);
    // utils.bind("#register_btn", "tap", function(){window.location = "./reg_step1.html";});  //html页面已有href
    utils.bind(".auth-code-pic", "tap", getAuthCode);
	var openId = utils.getUrlParam("openId");
	var openUid = utils.getUrlParam("openUid");
	openId && (utils.setSession("__openId", openId));
	openUid && (utils.setSession("__openUid", openUid));
	
	openId && (utils.setCookie("__openId", openId));
	openUid && (utils.setCookie("__openUid", openUid));

	openId = utils.getSession("__openId");
	openUid = utils.getSession("__openUid");
	

    // utils.setSession("__openId", utils.getUrlParam("openId"));
    // utils.setSession("__openUid", utils.getUrlParam("openUid"));
    // utils.setCookie("__openId", utils.getUrlParam("openId"));
    // utils.setCookie("__openUid", utils.getUrlParam("openUid"));
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
});

// 20210817 跳转到短信登录页面，带上referUrl
function mobile_login(){
	var referUrl = utils.getUrlParam("referUrl");   // 已被decodeURIComponent处理过
	// console.log('mobile_login referUrl=', referUrl);
	window.location.href = "/tradeh5/newWap/auth/mobile_login.html" + (referUrl?"?referUrl="+encodeURIComponent(referUrl):"");
}
// 20210817 跳转到短信登录页面，带上referUrl

function getAuthCode(){
    $(".auth-code-pic").attr("src", utils.projectNm + "/login_auth_code?rd="+Math.random());
}

function alertTips(){
	if(arguments.length == 1){
		showTips("信息", arguments[0], "确定");
	}else if(arguments.length == 2){
		showTips("信息", arguments[0], arguments[1]);
	}else if(arguments.length == 3){
		showTips("信息", arguments[0], arguments[1]);
		var fun = arguments[2];
		$(".Bomb-box-ok").click(function () {
			eval(fun).call(this);
		});
	}
}

function showTips(tips, content, btnTxt){
//	console.log($(".Bomb-box").length);
	if($(".Bomb-box").length > 0){
		$(".Bomb-box-tips").html(tips);
		$(".Bomb-box-content p").html(content);
		$(".Bomb-box-content p").removeClass();
		$(".Bomb-box-content p").addClass("text-center");
		$(".Bomb-box-ok").html(btnTxt);
		$(".Bomb-box").show();
	}else{
		alert(content);
	}
}

function login(){
    if(valide()){
        if(!$(".chose-icon").hasClass("current")){
            alertTips('<div style="padding: 1rem 1rem;line-height: 1.5;">请同意《汇添富基金微信服务平台身份验证协议》</div>');
            return;
        }
        
        if($(".code").attr("disabled")!= "disabled"){//需要启用验证码
			//获取滑动验证码开始
			$.ajax({
			type: 'GET',
			url: '/cos/v1/identity/captcha/token?validateType=1',
			data: {},
			dataType: 'json',
			t: new Date(),
			beforeSend:function(req){
				if(utils.getCookie('traceCode')){
					req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
				}
			},
			success: function (result) {
				if(result.returnCode == 0){
					//渲染验证码
					_fmOpt.triggerCaptcha(result.body);
			    }else {
					alertTips('系统异常，请稍后再试!');
				}
			},
			error: function () {
				alertTips('系统异常，请稍后再试!');
			}
			});
			//获取滑动验证码结束 	
			
			// 验证成功回调，有效token由此传入
			_fmOpt.onSuccess = function (validateToken) {
				doLogin(validateToken);
	    	}
		}else{//不需要验证码
			doLogin();
        }
	}
}

function doLogin(slideAuthCode) {
	utils.unbind("#login_btn", "tap", login);
	var phone = $(".phone").val();
	var pwd = $(".pwd").val();

	// var url = "/mobileEC/services/account/login_web";
	// var data = {"loginFrom":"W","certNum":phone,"password":pwd,"version":"5.6"};

	var url = "/mobile-bff/v1/login/login-wap";
	var data = {"accountName":phone,"password":pwd, "loginFrom": "W"};

	slideAuthCode && (data.slideAuthCode=slideAuthCode);

	var openId = utils.getSession("__openId");
	var openUid = utils.getSession("__openUid");
	var channelCode = utils.getCookie("channelCode");
	openId && (data.openId = openId);
	openUid && (data.openUid = openUid);
	channelCode && (data.channelCode = channelCode);

	// 20210810 兼容拉新活动，登录接口参数添加活动相关信息 
	var actid = utils.getUrlParam("actid");
	var ic = utils.getUrlParam("ic");
	var voucherNo = utils.getUrlParam("voucherNo");
	var inviteCustNo = utils.getUrlParam("inviteCustNo");
	actid && (data.actid = actid);
	ic && (data.ic = ic);
	voucherNo && (data.voucherNo = voucherNo);
	inviteCustNo && (data.inviteCustNo = inviteCustNo);
	// 20210810 兼容拉新活动，登录接口参数添加活动相关信息 
	
	utils.ajax({
		url,
		method: 'POST',
		data: JSON.stringify(data),
		beforeSend:  function(req){
            // req.setRequestHeader("version", '6.8');
			req.setRequestHeader("version", '6.9');     // 20210810 单点登录改造，APP6.9开始
        },
		success: function(result){
			if(result.returnCode === 0){
				console.log(result.body.tradeVerify);
				utils.verifyTradeChain(result.body, successCallback);
			}
		},
		complete: function(result){
			utils.bind("#login_btn", "tap", login);
			// console.log("ErrCode:" + result.returnCode + "    ErrMsg:" + result.returnMsg);
			if(result.returnCode=="9300"){
		//	                $("#pic_code").show();
				$(".code").removeAttr("disabled");
		//	                $(".auth-code-pic").attr("src", utils.projectNm + "/login_auth_code?system=" + new Date().getTime());
			}else if(result.returnCode=="1008"){
		//	                $(".auth-code-pic").attr("src", utils.projectNm + "/login_auth_code?system=" + new Date().getTime());
			}
		
		}
	})
}

function successCallback(result){
	if(result.returnCode === 0){
		utils.clearSession();
		// utils.setSession(utils.userInfo, result.body);
		// 20210810 单点登录改造，APP6.9开始
		var custNo = '';
		if(result.body && result.body.execResult && result.body.execResult.extendFields){
			utils.setSession(utils.userInfo, result.body.execResult.extendFields.userLoginResult);
			custNo = result.body.execResult.extendFields.userLoginResult.custNo;
		} else {
			utils.setSession(utils.userInfo, result.body);
			custNo = result.body.custNo;
		}
		//20220509 神策记录用户id
		try {
			if(custNo && sensors){
				sensors.setProfile({ec_custno:custNo});
				sensors.login(custNo);
			}
		} catch (e) {
			console.log('神策记录用户id报错，e=', e)
		}
		// 20210810 单点登录改造，APP6.9开始
		var referUrl = utils.getUrlParam("referUrl");
		console.log('referUrl=', referUrl);
		if(!referUrl){
			window.location.href = "/mobileEC/wap/wezhan/service.html?d=" + (new Date()).getTime();
			// window.location.href = "/tradeh5/newWap/auth/unbind.html";
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
	} else {
		console.log('result.returnCode=', result.returnCode);
		console.log('result.returnMsg=', result.returnMsg);
		// alert('result.returnCode='+ result.returnCode);
		alertTips(result.returnMsg);
	}
}
