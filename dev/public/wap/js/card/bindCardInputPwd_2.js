var fromBindCard = utils.getUrlParam("fromBindCard");
$(function () {

    var flag = false;
    var ul = $(".pwd-area ul");
    var li = $(".pwd-area li");
    var pnt = $(".pwd-area li i");
    var pwd = $(".pwd-area input");
    checkHasCompleteInfo();
    checkCardNumber();
    ul.on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if(flag){
            flag = false;
        } else {
            flag = true;
            pwd.focus();
        }
        return;
    });
    var bind_name="input";//定义所要绑定的事件名称
    if(navigator.userAgent.indexOf("MSIE")!=-1){
        bind_name="propertychange";//判断是否为IE内核 IE内核的事件名称要改为propertychange
    }
    pwd.on(bind_name, function (event) {
        var value = pwd.val().match(/\d{0,6}/g)[0];
        pwd.val("");
        value !== "" && pwd.val(value);
        var len = value.length;
        for (var i = 0; i < 6; i++) {
            i < len ? pnt.eq(i).css({"display": "block"}) : pnt.eq(i).hide();
        };
        return;
    });
    $(".Bomb-box-ok").click(function () {
        $(".Bomb-box").hide();
    });
    $(".btn-password").on("click",function () {
        var myPassword=$(".pwd-area input").val();
        if (myPassword.length!==6){
            alertTips('密码错误');
            return;
        }else if(!equalsPwd(myPassword)){
            //alertTips('密码不一致');
			alertTips4("信息",'密码不一致', "重新设置", "重新输入",
				function(){window.location.href = "bindCardInputPassword_1.html" + location.search;},
				function(){window.location.href = "bindCardInputPassword_2.html" + location.search;}
			);
            return;
        }else {
            /**
             * 保存交易密码
             */
            // var url = App.projectNm + "/account/set_trade_pwd";
            var url = "/mobile-bff/v1/account/set-trade-pwd-new";
            var data = JSON.stringify({"tradePwd":myPassword,"code":(fromBindCard == '1' ? 'BIND_CARD': 'NOT_BIND_CARD'),"source":"wap"});
            var referUrl = decodeURIComponent(App.getUrlParam("referUrl"));
            utils.post(url,data, null, function (result) {
                if((App.getSession("only_set_trade_pwd") == 1) || (bindCard && App.getSession("only_set_trade_pwd") != 0)){  // 已经绑卡了 只是设置交易密码
                    if(hasCompleteInfo){ // 已完善个人信息
                        if(referUrl){
                            utils.setSession(utils.serialNo_forword_url, referUrl);
                        }
                        else {
                            utils.setSession(utils.serialNo_forword_url, '/mobileEC/wap/card/setTradePwdSuccess.html');

                        }
                    }
                    else { // 未完善个人信息
                        if(referUrl){
                            utils.setSession(utils.serialNo_forword_url, '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=1&referUrl=' + encodeURIComponent(referUrl));
                        }
                        else {
                            utils.setSession(utils.serialNo_forword_url, '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=1');
                        }
                    }
                }
                else{  // 走绑卡流程
                    if(hasCompleteInfo){ // 已完善个人信息
                        if(referUrl){
                            utils.setSession(utils.serialNo_forword_url,referUrl);
                        }
                        else {
                            utils.setSession(utils.serialNo_forword_url,'/mobileEC/wap/card/bindCardSuccess.html');
                        }
                    }
                    else { // 未完善个人信息
                        if(referUrl){
                            utils.setSession(utils.serialNo_forword_url,'/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=2&referUrl=' + encodeURIComponent(referUrl));
                        }
                        else {
                            utils.setSession(utils.serialNo_forword_url,'/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=2');
                        }
                    }
                }
                utils.verifyTradeChain(result.body, successCallback);
            });
        }
    })
});

function successCallback(result) {
    var content = "设置成功";
    if(result.body && result.body.successInfo){
        content = result.body.successInfo;
    }
    var tipsObjLogin = {
        content: content,
        complete: function () {
            goToNextLink();
        }.bind(this)
    };
    utils.showTips(tipsObjLogin);
}

function goToNextLink(){
    var referUrl = decodeURIComponent(App.getUrlParam("referUrl"));
    //20220601 优化页面跳转逻辑
    if((App.getSession("only_set_trade_pwd") == 1) || (bindCard && App.getSession("only_set_trade_pwd") != 0)){  // 已经绑卡了 只是设置交易密码
        if(hasCompleteInfo){ // 已完善个人信息
            if(referUrl){
                window.location.href = referUrl;
            }
            else {
                window.location.href = '/mobileEC/wap/card/setTradePwdSuccess.html';

            }
        }
        else { // 未完善个人信息
            if(referUrl){
                window.location.href = '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=1&referUrl=' + encodeURIComponent(referUrl);
            }
            else {
                window.location.href = '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=1';
            }
        }
    }
    else{  // 走绑卡流程
        if(hasCompleteInfo){ // 已完善个人信息
            if(referUrl){
                window.location.href = referUrl;
            }
            else {
                window.location.href = '/mobileEC/wap/card/bindCardSuccess.html';
            }
        }
        else { // 未完善个人信息
            if(referUrl){
                window.location.href = '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=2&referUrl=' + encodeURIComponent(referUrl);
            }
            else {
                window.location.href = '/mobileEC/wap/userInfo/parfectInfo.html?bindCardToCompleteInfo=2';
            }
        }
    }

}


var hasCompleteInfo = false; // 是否已经完善个人信息
function checkHasCompleteInfo(){
    App.get('/icif/v1/custs/get-simple-by-cust-no' , null, function(result){
        if(result.returnCode == 0){
            hasCompleteInfo = result.body.infoIsComplete;
        }
    });
}
function equalsPwd(pwd_2){
    var pwd_1 = App.getSession(App.cardBindCardpwd_1_Info);
    if(pwd_1 == pwd_2){
        return true;
    }
    return false;
}
var bindCard = false;
function checkCardNumber(){
    var url = "/mobile-bff/v1/account/card";
    App.get(url, null, function (result) {
        var cards = result.body;
        if (cards != null && cards.length != 0){
            bindCard = true;
        }
    });
}