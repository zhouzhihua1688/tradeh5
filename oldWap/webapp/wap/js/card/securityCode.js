$(function(){

    var data = App.getSession(App.cardBindCardCreateCard_Info);

    if(data != null && data != undefined){
        $("#mobileNo").html(displayMobileNo(data.mobileNo));
    }

    App.bind("#btn-submit", "tap", confirm);
});
function displayMobileNo(mob){
    if(mob != "" && mob.length == 11){
        return mob.substring(0,3) + '****' + mob.substr(7);
    }
    return "";
}
function confirm(){
    if(! valide()){
        alertTips("请填写校验码");
        return;
    }

    // var url = App.projectNm + "/account/binding_confirm_web";
    var url = App.projectNm + "/bank_manager/rapid_create_card_confirm";
    var data = JSON.stringify({
        "serialNo": App.getSession(App.serialNo_bindCard),
        "authCode"  : $(".authCode").val()
    });
    App.unbind("#btn-submit", "tap");
    App.post(url,data, function(){
        App.bind("#btn-submit", "tap", confirm);
    }, function(result){
        App.setSession(App.successInfo,result.body.channelLimitInfo);
        var rsource = App.getSession(App.rsource);
        App.setSession(App.serialNo, result.body.serialNo);

        var referUrl = App.getUrlParam("referUrl");
        if(App.isNotEmpty(referUrl)){
            if(App.getSession("has_set_trade_pwd") == 1){
            	window.location = referUrl;
        	}else{
        		window.location = "./bindCardInputPassword_1.html?referUrl="+encodeURIComponent(referUrl);
        	}
        }else{
            if(rsource == undefined || rsource == null || "" == rsource){
                if(App.isNotEmpty(result.body.forwardUrl)){
                	if(App.getSession("has_set_trade_pwd") == 1){
                    	window.location = "./" + result.body.forwardUrl;
                	}else{
                		window.location = "./bindCardInputPassword_1.html";
                	}
                }else if("" == result.body.serialNo){
                	if(App.getSession("has_set_trade_pwd") == 1){
                    	window.location = "./bindCardSuccess.html";
                	}else{
                		window.location = "./bindCardInputPassword_1.html";
                	}
                }else{
                    window.location = "./binding_card_success_act.html";
                }
            }else{
            	if(App.getSession("has_set_trade_pwd") == 1){
                	window.location = App.getSession(App.forwardUrl);
            	}else{
            		window.location = "./bindCardInputPassword_1.html";
            	}
            }
        }
    });

}

var timer = new createCosTimer("btnSendCode",60);
timer.start();

//  发送验证码
$("#btnSendCode").click(function(){
    timer.start();
    var url = App.projectNm + '/account/create_card_web';
    var data = App.getSession(App.cardBindCardCreateCard_Info);
    App.post(url,data, null, function(result){
        serialNo = result.body.serialNo;
        App.setSession(App.serialNo_bindCard, serialNo);
    });
});

/**
 * 提交
 */
function bindingConfirm(){
    var authCode = $("#authCode").val();
    if(App.isEmpty(authCode)){
        alert("请填写校验码");
        return false;
    }else if(!App.verifySMSPwd(authCode)){
        return false;
    }
    if(App.isEmpty(serialNo)){
        alert("请先获取动态码");
        return false;
    }
}