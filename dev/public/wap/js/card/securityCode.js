$(function(){

    var data = App.getSession(App.cardBindCardCreateCard_Info);

    if(data != null && data != undefined){
        $("#mobileNo").html(displayMobileNo(data.mobileNo));
    }
    checkHasCompleteInfo();
    isSetTradePassword();
    App.bind("#btn-submit", "tap", confirm);
});
var hasCompleteInfo = false; // 是否已经完善个人信息
var isSetPwd = 'N'; // 是否设置交易密码

function checkHasCompleteInfo(){
    App.get('/icif/v1/custs/get-simple-by-cust-no' , null, function(result){
        if(result.returnCode == 0){
            hasCompleteInfo = result.body.infoIsComplete;
        }
    });
}

function isSetTradePassword() {
    var url = "/mobile-bff/v1/account/has-set-trade-pwd";
    utils.post(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }
        }
    });
}

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
    // var url = App.projectNm + "/bank_manager/rapid_create_card_confirm";
    var url = "/mobile-bff/v1/bankengine/rapid-create-card-confirm";
    var data = JSON.stringify({
        "serialNo": App.getSession(App.serialNo_bindCard),
        "authCode"  : $(".authCode").val(),
        "loginFrom": 'W'
    });
    App.unbind("#btn-submit", "tap");
    App.post(url,data, function(){
        App.bind("#btn-submit", "tap", confirm);
    }, function(result){
        if(result.returnCode === 0){
            var referUrl = decodeURIComponent(App.getUrlParam("referUrl"));
            var jumpUrl = (result.body.createCardResult? result.body.createCardResult.jumpUrl : "");

            //var setTradePwdFlag = App.getSession("has_set_trade_pwd");
            if(isSetPwd == '1'){   // 已设置过交易密码

                if(hasCompleteInfo){ // 用户信息已经完善
                    if(referUrl){
                        window.location = referUrl;
                    }else if(jumpUrl){
                        window.location = './' + jumpUrl;
                    }else{
                        window.location = "./bindCardSuccess.html";
                    }
                } else {    // 用户信息未完善，跳转信息完善页面
                    if(referUrl){
                        window.location.href = '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=2&referUrl=' + encodeURIComponent(referUrl);
                    }
                    else{
                        window.location.href = '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=2';
                    }
                }
            } else {    // 未设置过交易密码
                var fromBindCard = App.getUrlParam("fromBindCard");
            
                if(referUrl){
                    window.location = './bindCardInputPassword_1.html?referUrl='+encodeURIComponent(referUrl)+'&fromBindCard='+fromBindCard;
                }else{
                    window.location = './bindCardInputPassword_1.html?fromBindCard='+fromBindCard;
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
    // var url = App.projectNm + '/account/create_card_web';
    // var url = '/mobile-bff/v1/bankengine/ylt-resend-sms';
    var url = "/mobile-bff/v1/bankengine/rapid-create-card";
    var data = App.getSession(App.cardBindCardCreateCard_Info);
    App.post(url, JSON.stringify(data), null, function(result){
        serialNo = result.body.protocolNo;
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