$(function(){
    App.bind("#register_btn", "tap", register);
//    App.bind(".images", "tap", setWapRegAuthcode);
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

function register(){
	
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
	    App.unbind("#register_btn", "tap", register);
	    var mobileNo = $("#mobileNo").val();
	    if(/^1[0-9]{10}$/.test(mobileNo)){
	        var url = App.projectNm + "/account/register_web";
		        var data = JSON.stringify({
		            "mobileNo": mobileNo,
		            "slideAuthCode":validateToken,
		            "platformId":App.getUrlParam("platformId")
		        });
	        App.post(url,data,function(){
	            App.bind("#register_btn", "tap", register);
	        }, function(result){

	            App.setSession(App.registerInfo, {"mobileNo":mobileNo, "serialNo":result.body.serialNo});
	            window.location = "./reg_step2.html";
	        });
	    }else{
	        App.bind("#register_btn", "tap", register);
	        alert("请您输入正确的手机号码!");
	    }
	}
}

function setWapRegAuthcode(){
    $(".images").attr("src", App.projectNm + "/wap_register_auth_code?system=" + new Date().getTime());
}

/**
 * Created by lh on 14-11-18.
 */