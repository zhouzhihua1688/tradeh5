
$(function(){
    $(".rules").click(function(){
        $(".chose-icon").toggleClass("current");
    });
    App.bind("#login_btn", "tap", login);
    App.bind("#register_btn", "tap", function(){window.location = "./reg_step1.html";});
    App.bind(".auth-code-pic", "tap", getAuthCode);
	
	var openId = App.getUrlParam("openId");
	var openUid = App.getUrlParam("openUid");
    openId && (App.setSession("__openId",openId ));
    openUid && (App.setSession("__openUid",openUid));
	
	openId = App.getSession("__openId");
    openUid = App.getSession("__openUid");

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
		var openId = App.getSession("__openId");
		var openUid = App.getSession("__openUid");
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
				// var url = "/mobile-bff/v1/login/login-wap";
		        // var data = {"accountName":phone,"password":pwd,"loginFrom": "W"};
				validateToken && (data.slideAuthCode=validateToken);

		        var channelCode = App.getCookie("channel_code");
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
                    //20220509 神策记录用户id
                    var custNo = result.body.custNo;
                    try {
                        if(custNo && sensors){
                            sensors.setProfile({ec_custno:custNo});
                            sensors.login(custNo);
                        }
                    } catch (e) {
                        console.log('神策记录用户id报错，e=', e)
                    }
		            var referUrl = App.getUrlParam("referUrl");
		            // if(App.isEmpty(referUrl)){
		            //     window.location = "../wezhan/service.html?d=" + (new Date()).getTime();
		            // }else{
		            //     window.location = referUrl;
		            // }
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
		        });
	    	}
			
        }else{//不需要验证码
	        App.unbind("#login_btn", "tap", login);
	        var phone = $(".phone").val();
	        var pwd = $(".pwd").val();

	        var url = App.projectNm + "/account/login_web";
	        var data = {"loginFrom":"W","certNum":phone,"password":pwd,"version":"5.6"};
			// var url = "/mobile-bff/v1/login/login-wap";
			// var data = {"accountName":phone,"password":pwd, "loginFrom": "W"};

	        var channelCode = App.getCookie("channel_code");
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
                //20220509 神策记录用户id
                var custNo = result.body.custNo;
                try {
                    if(custNo && sensors){
                        sensors.setProfile({ec_custno:custNo});
                        sensors.login(custNo);
                    }
                } catch (e) {
                    console.log('神策记录用户id报错，e=', e)
                }
	            //加cookie 区分公众号登录入口
	            var entryChannel = App.getCookie("entryChannel");
	            if(entryChannel != "" && entryChannel != undefined){
	            	App.setCookie("loginChannel",entryChannel);
	            }
	            var referUrl = App.getUrlParam("referUrl");
	            // if(App.isEmpty(referUrl)){
	            //     window.location = "../wezhan/service.html?d=" + (new Date()).getTime();
	            // }else{
	            //     window.location = referUrl;
	            // }
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
	        });
        }

	}
}
