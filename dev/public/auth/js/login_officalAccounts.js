/**
 * @date: 2021-02-05 17:07:02
 * @desc: 微信公众号登录/绑定页面
 */

$(function(){
    $(".rules").click(function(){
        $(".chose-icon").toggleClass("current");
    });
    utils.bind("#login_btn", "tap", login);
    utils.bind("#register_btn", "tap", function(){window.location = "./reg_step1.html";});
	utils.bind(".auth-code-pic", "tap", getAuthCode);
	var openId = utils.getUrlParam("openId");
	var openUid = utils.getUrlParam("openUid");
	openId && (utils.setSession("__openId", openId));
	openUid && (utils.setSession("__openUid", openUid));

	openId = utils.getSession("__openId");
	openUid = utils.getSession("__openUid");

	if(!openId && !openUid){
		// 公众号登录/绑定页面，没有openId和openUid，跳转去获取
		// console.log('公众号登录/绑定页面，没有openId和openUid，跳转去获取');
		utils.jumpLoginByChannelCode();
	}
	
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

function getAuthCode(){
    $(".auth-code-pic").attr("src", utils.projectNm + "/login_auth_code?rd="+Math.random());
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

	if(!openId && !openUid){
		alert('openId和openUid不存在！');
		return;
	}
	
	utils.ajax({
		url,
		method: 'POST',
		data: JSON.stringify(data),
		beforeSend:  function(req){
            req.setRequestHeader("version", '6.8');
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

function successCallback(result) {
	if(result.returnCode === 0){
		var openId = utils.getSession("__openId");
		var openUid = utils.getSession("__openUid");
		utils.clearSession();  // 保留openId和openUid，unbind.html回来的时候，login_xxx.html页面要使用
		openId && utils.setSession("__openId", openId);
		openUid && utils.setSession("__openUid", openUid);

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
		// return;
		if(!referUrl){
			// window.location = "/tradeh5/newWap/wap/wezhan/service.html?d=" + (new Date()).getTime();
			window.location.href = "/tradeh5/newWap/auth/unbind.html";
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
		alert('result.returnCode='+ result.returnCode);
	}
}