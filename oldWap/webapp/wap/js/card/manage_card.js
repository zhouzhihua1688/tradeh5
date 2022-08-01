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
    	var data = JSON.parse(data);
        if(data.body != undefined && data.body != null){
            if(data.body.isSetPwd != "1"){
                App.setSession("has_set_trade_pwd",0);
            }else{
                App.setSession("has_set_trade_pwd",1);
            }
        }
    });

}

/**
 * 显示银行卡列表
 */
function showBankCard(){
    var card_list = App.getSession(App.cards);
    if(card_list == null || card_list.length == 0){
        App.queryCard(function(){
            var cards = App.getSession(App.cards);
            setBankCardPanel(cards);
            additionCard(cards);
        });
    }else{
        setBankCardPanel(card_list);
        additionCard(card_list);
    }
}

function setBankCardPanel(cards){
//	console.log(cards);
    $("#card_list_panel").empty();
    for(var i in cards){
        var card = cards[i];
        var invnm = App.getSession(App.userInfo) == null ? "" : App.getSession(App.userInfo).invnm;
        var signWay = ""; /** 1 快捷 2 银联通 3 网银 5 不显示*/
        var signStyle = "";
        if(card.signWay == "1"){
            signWay = "快捷";
            signStyle = "icon-shorcut";
        }else if(card.signWay == "2"){
            signWay = "银联通";
            signStyle = "icon-union";
        }else if(card.signWay == "3"){
            signWay = "网银";
            signStyle = "icon-E-bank";
        }

        $("#panal_card_list").append(
            '<li class="grid-list-item bottom-border card_body" data=' + card.bankNo + ',' + card.bankAcco + '>'
            +'<div class="row" >'
            +'    <div class="lh-130">'
            +'        <i class="bank bank-panel2 ico_' + card.bankNo + ' no-margin-left"></i>'
            +'    </div>'
            +'    <div class="col-1">'
            +'        <div class="list-title">'
            +'            <p class="bank-name">' + card.bankGrpName + '</p>'
            +'            <p class="bank-id">' + card.bankAccoDisplay + '</p>'
            +'        </div>'
            +'    </div>'
            +'    <div class="lh-130 heigth-130">'
            + ((card.signWay == "1" || card.signWay == "2" || card.signWay == "3")
            ? '        <i class="icon ' + signStyle + '">' + signWay + '</i>'
            : "")
            +'    </div>'
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
