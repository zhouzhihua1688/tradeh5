var has_pwd = true;
$(function () {
    function init(){
        showBankCard();

        var userInfo = App.getSession(App.userInfo);
        if(userInfo == null){
            App.queryUserInfo();
        }

    }
    init();
});

/**
 * 添加银行卡
 */
function additionCard(card_list){
    var url;
    url = "./bindCardInputCardInfo.html?fr=add";
    if(card_list == null || card_list.length == 0){
        window.location = url;
    }else {
        App.bind(".add_card_btn", "tap", function(){
            window.location = url;
        });
    }

    App.queryHasSetTradePassword(function (data) {
		var data = (typeof data === 'string' ? JSON.parse(data): data);
        if(data.body != undefined && data.body != null){
            if(data.body.isSetPwd != "1"){
                App.setSession("has_set_trade_pwd",0);
            }else{
                App.setSession("has_set_trade_pwd",1);
            }
        }else{
            sessionExpireLogin()
        }
    });

}

/**
 * 查询银行卡列表
 */
function queryCard (successFun) {
    // isCounterCard 是否包含柜台卡
    var url = "/mobile-bff/v1/account/card?isCounterCard=1"
    App.get(url, null, function (result) {
        var cards = result.body;
        App.setSession(App.cards, cards);
        if(App.isFunction(successFun)){
            eval(successFun).call(this);
        }
    });
}

/**
 * 显示银行卡列表
 */
function showBankCard(){
    var card_list = App.getSession(App.cards);
    // if(card_list == null || card_list.length == 0){
        queryCard(function(){
            var cards = App.getSession(App.cards);
            setBankCardPanel(cards);
            additionCard(cards);
        });
    // }else{
    //     setBankCardPanel(card_list);
    //     additionCard(card_list);
    // }
}

function setBankCardPanel(cards){
//	console.log(cards);
    $("#card_list_panel").empty();
    for(var i in cards){
        var card = cards[i];

        var signTxt = ""; /** 1 快捷 2 银联通 3 网银 5 不显示*/
        var signStyle = "";
		if(card.signWay == "1"){
			signStyle = "shorcut";
			signTxt = "快捷";
		}else if(card.signWay == "2"){
			signStyle = "union";
			signTxt = "银联通";
		}else if(card.signWay == "3"){
			signStyle = "E-bank";
			signTxt = "网银";
		}else if(card.signWay == "4"){
			signStyle = "E-bank";
			signTxt = "通联";
		}else if(card.signWay == "6"){
			signStyle = "E-bank";
			signTxt = "云闪付";
		}else if(card.signWay == "7"){
			signStyle = "E-bank";
			signTxt = "一网通";
		}else{
			signStyle = "";
			signTxt = "";
		}

        $("#panal_card_list").append(
            '<li class="grid-list-item bottom-border card_body" data=' + card.bankCardSerialid +  '>'
            +'<div class="row" >'
            +'    <div class="lh-130">'
            +'        <img src="/mobileEC/images/bank/'+card.bankNo+'.png" class="bank-logo-new"/>'
            +'    </div>'
            +'    <div class="col-1">'
            +'        <div class="list-title">'
            +'            <p class="bank-name">' + card.bankGrpName + ' '+(card.mainFlag == "Y" ? '<span class="mainFlg">主卡</span>' :'')+'</p>'
            +'            <p class="bank-id">' + card.bankAccoDisplay + '</p>'
            +'        </div>'
            +'    </div>'
            +'                    <div class=\"lh-130 '+ signStyle +'\">\n' 
			+'            <a class="icon icon-'+ signStyle +'">'+ signTxt +'</a>' 
            +'                    </div>\n' 
            +'    <div class="lh-130 heigth-130">'
            +'        <i class="icon icon-arrow-right"></i>'
            +'    </div>'
            +'</div>'
            +'</li>');
    }
    App.bind(".card_body", "tap", function(){toDetail()});
}

function toDetail(){
    var data = $(event.target).attr("data");
    if(data == null || data == undefined){
        var target = $(event.target);
        for (var i = 0; i < 5; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break;
        }
    }
    if(data != undefined && data != null){
        App.setSession(App.param, String(data));
        window.location = "./card_detail.html";
    }
}

/**
 * 保存交易密码
 */
function saveTradePwd(targetUrl){
    var pwd = $("#setpwd").val();
    var pwdConfirm = $("#setpwdconfirm").val();

    if(!App.isNotEmpty(pwd)){
        alert("请您输入交易密码！");
        return false;
    }else if(!App.isNotEmpty(pwdConfirm)){
        alert("请您确认交易密码！");
        return false;
    }else if(pwd != pwdConfirm){
        alert("您输入的交易密码不一致！");
        return false;
    }else{
        if(!App.verifyTradePwd(pwd)){
            return false;
        }
    }
    App.cancel_alert();
    var url = App.projectNm + "/account/trade_pwd_web";
    var data = JSON.stringify({"tradePwd":pwd});
    App.post(url,data, null, function (result) {
        window.location = targetUrl;
    });
}

/**
 * Created by lh on 14-11-25.
 */
