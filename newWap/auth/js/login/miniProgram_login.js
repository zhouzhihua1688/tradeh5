	var channelCode = App.getCookie("channelCode");
$(function(){
	
	if(HTF.isWeixin()){
		if(App.isNotEmpty(App.getUrlParam("unbind"))){
			var openId = App.isNotEmpty(App.getCookie("__openId")) ? App.getCookie("__openId") : App.getUrlParam("openId");
			var openUid = App.isNotEmpty(App.getCookie("__openUid")) ? App.getCookie("__openUid") : App.getUrlParam("openUid");
			
			if(App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
				App.setSession("__openId", openId);
				App.setSession("__openUid", openUid);
				App.setCookie("__openId", openId);
				App.setCookie("__openUid", openUid);
			}else{
				var code = HTF.getUrlParam("code");

				// ssoCookie不存在，未登录状态
				if(HTF.isNotBlank(code)) {
					// code存在，发送codeLoginRequest.ajax请求，使用code登陆并获取sso_cookie
					HTF.codeLoginRequest(code);
				} else {
					// code不存在，需要登录信息的业务逻辑触发时，再去获取code
					 HTF.getCode();
				}
			}
			
		}else{
			var ssoCookie = HTF.getCookie("sso_cookie");

			if (HTF.isNotBlank(ssoCookie)) {//有登录态

				// S 20201230 微信小程序处理
				if (window.__wxjs_environment === 'miniprogram' ) { // 微信兼容性处理
					var referUrl = App.getUrlParam("referUrl");
					wx.miniProgram.navigateTo({
						url: '/pages/index/index?cookie=' + escape(document
							.cookie) + '&referUrl=' + encodeURIComponent(
							referUrl)
					});
					return;
				}
				return;
				// E 20201230 微信小程序处理

				var sys = "1";
				if(App.getCookie("channelCode") == "tfhwx"){
					sys = "2";
				}
				var url = "/mobile-bff/v1/weixin/queryBindStatus?system="+sys;
				App.get(url, null, function(result){
					if (result.body != undefined && result.body != null){
						if(result.body.bindStatus == "1"){//已绑定
							window.location.href = '/mobileEC/wap/login/unbind.html?channelCode='+channelCode;
						}else{
							var code = HTF.getUrlParam("code");

							// ssoCookie不存在，未登录状态
							if(HTF.isNotBlank(code)) {
								// code存在，发送codeLoginRequest.ajax请求，使用code登陆并获取sso_cookie
								HTF.codeLoginRequest(code);
							} else {
								// code不存在，需要登录信息的业务逻辑触发时，再去获取code
								 HTF.getCode();
							}
						}
					}
				});
				
			}else{
				var openId = App.getSession("__openId");
				var openUid = App.getSession("__openUid");

				// S 20201230 微信小程序处理
				if(App.isEmpty(openId) && App.isEmpty(openUid)){
					openId = App.getUrlParam('openId');
					openUid = App.getUrlParam('openUid');

					App.setSession("__openId", openId);
					App.setSession("__openUid", openUid);
				}
				// if (window.__wxjs_environment === 'miniprogram' ) { // 微信兼容性处理
				// 	return;
				// }
				// E 20201230 微信小程序处理
				
				if(App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
					
				}else{
					var code = HTF.getUrlParam("code");

					// ssoCookie不存在，未登录状态
					if(HTF.isNotBlank(code)) {
						// code存在，发送codeLoginRequest.ajax请求，使用code登陆并获取sso_cookie
						HTF.codeLoginRequest(code);
					} else {
						// code不存在，需要登录信息的业务逻辑触发时，再去获取code
						 HTF.getCode();
					}
				}
			}
		}
	}

    $(".rules").click(function(){
        $(".chose-icon").toggleClass("current");
    });
    App.bind("#login_btn", "tap", login);
    App.bind("#register_btn", "tap", function(){window.location = "./reg_step1.html";});
    App.bind(".auth-code-pic", "tap", getAuthCode);

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
    $(".auth-code-pic").attr("src", App.projectNm + "/login_auth_code?rd="+Math.random());
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
		        App.unbind("#login_btn", "tap", login);
		        var phone = $(".phone").val();
		        var pwd = $(".pwd").val();

		        var url = App.projectNm + "/account/login_web";
		        var data = {"loginFrom":"W","certNum":phone,"password":pwd,"version":"5.6","slideAuthCode":validateToken};

		        var openId = App.getSession("__openId");
		        var openUid = App.getSession("__openUid");
		        var channelCode = App.getCookie("channelCode");
		        if(App.isNotEmpty(channelCode)){
		            data.channelCode = channelCode;
		        }
		        if(App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
		            data.openId = openId;
		            data.openUid = openUid;
		        }
		        App.post(url,JSON.stringify(data),function(result){
		            App.bind("#login_btn", "tap", login);

		            // console.log("ErrCode:" + result.returnCode + "    ErrMsg:" + result.returnMsg);
		            if(result.returnCode=="9300"){
	//	                $("#pic_code").show();
		                $(".code").removeAttr("disabled");
	//	                $(".auth-code-pic").attr("src", App.projectNm + "/login_auth_code?system=" + new Date().getTime());
		            }else if(result.returnCode=="1008"){
	//	                $(".auth-code-pic").attr("src", App.projectNm + "/login_auth_code?system=" + new Date().getTime());
		            }

		        },function(result){
		            App.clearSession();
		            App.setSession(App.userInfo, result.body);
					var referUrl = App.getUrlParam("referUrl");
					
					// S 20201230 微信小程序处理
					if (window.__wxjs_environment === 'miniprogram' ) { // 微信兼容性处理
						wx.miniProgram.navigateTo({
							url: '/pages/index/index?cookie=' + escape(document
								.cookie) + '&referUrl=' + encodeURIComponent(
								referUrl)
						});
						return;
					}
					// E 20201230 微信小程序处理
					
		            if(App.isEmpty(referUrl)){
		                window.location = "../login/bindSuccessfully.html?d=" + (new Date()).getTime();
		            }else{
		                window.location = referUrl;
		            }
		        });
	    	}
			
        }else{//不需要验证码
	        App.unbind("#login_btn", "tap", login);
	        var phone = $(".phone").val();
	        var pwd = $(".pwd").val();

	        var url = App.projectNm + "/account/login_web";
	        var data = {"loginFrom":"W","certNum":phone,"password":pwd,"version":"5.6"};

            var openId = App.getSession("__openId");
            var openUid = App.getSession("__openUid");
	        var channelCode = App.getCookie("channelCode");
	        if(App.isNotEmpty(channelCode)){
	            data.channelCode = channelCode;
	        }
	        if(App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
	            data.openId = openId;
	            data.openUid = openUid;
	        }
	        App.post(url,JSON.stringify(data),function(result){
	            App.bind("#login_btn", "tap", login);

	            // console.log("ErrCode:" + result.returnCode + "    ErrMsg:" + result.returnMsg);
	            if(result.returnCode=="9300"){
//	                $("#pic_code").show();
	                $(".code").removeAttr("disabled");
//	                $(".auth-code-pic").attr("src", App.projectNm + "/login_auth_code?system=" + new Date().getTime());
	            }else if(result.returnCode=="1008"){
//	                $(".auth-code-pic").attr("src", App.projectNm + "/login_auth_code?system=" + new Date().getTime());
	            }

	        },function(result){
	            App.clearSession();
	            App.setSession(App.userInfo, result.body);
	            //加cookie 区分公众号登录入口
	            var entryChannel = App.getCookie("entryChannel");
	            if(entryChannel != "" && entryChannel != undefined){
	            	App.setCookie("loginChannel",entryChannel);
	            }
				var referUrl = App.getUrlParam("referUrl");
				
				// S 20201230 微信小程序处理
				if (window.__wxjs_environment === 'miniprogram' ) { // 微信兼容性处理
					wx.miniProgram.navigateTo({
						url: '/pages/index/index?cookie=' + escape(document
							.cookie) + '&referUrl=' + encodeURIComponent(
							referUrl)
					});
					return;
				}
				// E 20201230 微信小程序处理

	            if(App.isEmpty(referUrl)){
	                window.location = "../login/bindSuccessfully.html?d=" + (new Date()).getTime();
	            }else{
	                window.location = referUrl;
	            }
	        });
        }

	}
}
