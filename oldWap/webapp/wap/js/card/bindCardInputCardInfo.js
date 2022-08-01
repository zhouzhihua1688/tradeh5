App.setSession("only_set_trade_pwd",0);
$(function(){

    App.removeSession(App.bindSelectedCard);

    var userInfo = App.getSession(App.userInfo);
    if(userInfo == null){
        App.queryUserInfo(function (){
            userInfo = App.getSession(App.userInfo);
            checkIsSM(userInfo);
            $(".phone").val(userInfo.mobileNo);
        });
    }else{
        checkIsSM(userInfo);
        $(".phone").val(userInfo.mobileNo);
    }

    App.bind(".icon-question", "tap", function(){
        alertTips("该手机号为您的银行预留手机号，是您在开户资料上填写的号码，如您后续有变更，以变更后为准。", "我知道了");
    });

    var cards = App.getSession(App.bindCards);
    if(cards == null || cards.length == 0){
        queryBankList('');
    }else{
        showBankList(cards);
    }
    
	//是否设置过交易密码
	App.queryHasSetTradePassword(function (data) {
		var data = JSON.parse(data);
	    if(data.body != undefined && data.body != null){

	        if(data.body.isSetPwd != "1"){
	            App.setSession("has_set_trade_pwd",0);
	        }else{
	            App.setSession("has_set_trade_pwd",1);
	        }
	    	if(App.getSession("has_set_trade_pwd") == 1){//设置过交易密码
	        	
	    	}else{//未设置交易密码
	    		var hascards = App.getSession(App.cards);
			    if(hascards == null || hascards.length == 0){//第一次绑卡
			        
			    }else{//已经绑卡了
			        if(App.getUrlParam("fr") == "add"){//绑卡操作
			        	
			        }else{//设置交易密码
			        	App.setSession("only_set_trade_pwd",1);
			        	window.location = "./bindCardInputPassword_1.html";
			        }
			    }
	    	}
	    }
	});
    
    $(".bankCardNo").on("input", loadBank);
    App.bind("#btn-submit", "tap", createCard);

    App.bind("#protocolUrl", "click", function(){
        var paro = $("#protocolUrl").attr("href");
        if(paro == 'javascript:;' || paro == ''){
            alertTips("请选择银行卡");
        }
    });

    $(".selectBankCard-bind").click(function(){

        var acco = $(".bankCardNo").val().replace(/\s+/g, "");
        if(App.isEmpty(acco)){
            $("#bankCardList").show();
        }else{
            var url = App.projectNm + "/get_bank_list_web";
            App.post(url,JSON.stringify({'bankAcco': acco}),null, function (result) {
                var clist = result.body.channel;
                if(clist.length == 1){
                    var bankChannel = clist[0];
                    var card = {"bankNo":bankChannel.bankNo,"bankNm":bankChannel.accoName,"protocolUrl":bankChannel.protocolUrl,"fakeBank":bankChannel.fakeBank};

                    if(bankChannel.fakeBank == '1'){
                        $("#phone-panel").hide();
                    } else {
                        $("#phone-panel").show();
                    }

                    App.setSession(App.bindSelectedCard, card);
                    changeCardInfo(card);
                    alertTips("卡号匹配成功！")
                }else{
                    $("#bank_name_panel").html("请选择");
                    $("#protocolUrl").attr("href", "javascript:void(0)");
                    $("#bankCardList").show();
                }
            });
        }

    });
});
/**
 * 根据卡bin选择银行通道
 */
var hisBankBin = '';
function loadBank(){
    var bankAcco = $(".bankCardNo").val().replace(/\s+/g, "");
    if(bankAcco.length >= 6){
        var newBankBin = bankAcco.substring(0,6);
        if(hisBankBin != newBankBin){
            hisBankBin = newBankBin;
            queryBankList(bankAcco);
        }
    }
}

/**
 * 查检是否为实名客户
 * @param userInfo
 */
function checkIsSM(userInfo){
    if(App.isSM == userInfo.loginFlag){
        $("#userInfo_panel").show();
    }else{
        $("#userInfo_panel").hide();
        $(".invNm").val(userInfo.invnm);
        $(".idCard").val(userInfo.idno);
    }
}

/**
 * 设置银行通道
 * @param cards
 */
function showBankList(cards){
    var arr = [];
    for(var index in cards){
        var card = cards[index];
        var signStyle;
        if(card.signWay == "1"){
            signStyle = "shorcut";
        }else if(card.signWay == "2"){
            signStyle = "union";
        }else if(card.signWay == "3"){
            signStyle = "E-bank";
        }else if(card.signWay == "5"){
            continue;
        }
        arr.push('<li class="list-group-item bottom-border lh-100 bank_card_option" data="'+ card.bankNo +',' + card.accoName + ','+ card.protocolUrl+ ','+ card.fakeBank +'">');
        arr.push('    <div class="row">');
        arr.push('        <div class="">');
        arr.push('            <i class="bank bank-panel1 ico_' + card.bankNo + ' no-margin-left"></i>');
        arr.push('        </div>');
        arr.push('        <div class="col-1">');
        arr.push('            <p class="bank-name font-28">' + card.accoName +  '</p>');
        arr.push('        </div>');
        arr.push('        <div class="' + signStyle + '">');
        arr.push('            <a class="icon icon-union">银联通</a>');
        arr.push('            <a class="icon icon-E-bank">网银</a>');
        arr.push('            <a class="icon icon-shorcut">快捷</a>');
        arr.push('        </div>');
        arr.push('    </div>');
        arr.push('</li>');
    }
    $("#bankCardList ul").html(arr.join(""));
    App.bind(".bank_card_option", "tap", selectedCard);
}

/**
 * 获取可用银行渠道
 */
function queryBankList(acco){
    var url = App.projectNm + "/get_bank_list_web";
    App.post(url,JSON.stringify({'bankAcco': acco}),null, function (result) {
        if(App.isEmpty(acco)){
            App.setSession(App.bindCards, result.body.channel);
            showBankList(result.body.channel);
        }else{
            var clist = result.body.channel;
            if(clist.length == 1){
                var bankChannel = clist[0];
                var card = {"bankNo":bankChannel.bankNo,"bankNm":bankChannel.accoName,"protocolUrl":bankChannel.protocolUrl,"fakeBank":bankChannel.fakeBank};

                if(bankChannel.fakeBank == '1'){
                    $("#phone-panel").hide();
                }else{
                    $("#phone-panel").show();
                }

                App.setSession(App.bindSelectedCard, card);
                changeCardInfo(card);
            }else{
                $("#bank_name_panel").html("请选择");
                $("#protocolUrl").attr("href", "javascript:void(0)");
            }
        }
    });
}
/**
 * 选择银行
 */
function selectedCard(){
    var data = $(event.target).attr("data");
    if(data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 4; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break;
        }
    }
    var array = String(data).split(",");
    var card = {"bankNo":array[0],"bankNm":array[1],"protocolUrl":array[2],"fakeBank":array[3]};

    if(array[3] == '1'){
        $("#phone-panel").hide();
    } else {
        $("#phone-panel").show();
    }

    changeCardInfo(card);
    $("#bank-list").hide();
    $("#bind-card-info").show();
    App.setSession(App.bindSelectedCard, card);
}

function changeCardInfo(card){
    if(card == null || card.length == 0){
        $("#bank_name_panel").html("请选择");
        $("#protocolUrl").attr("href", "javascript:void(0)");
    }else{
        $("#bank_name_panel").html(card.bankNm);
        $("#protocolUrl").attr("href", card.protocolUrl);
    }
}

$(".chose-icon").click(function(){
    $(".chose-icon").toggleClass("current");
});

function createCard(){

    var bankAcco = $(".bankCardNo").val().replace(/\s+/g, "");
    var mobileNo = $(".phone").val();
    var invNm = $(".invNm").val();
    var idNo = $(".idCard").val();
    var idNoValidDate = $(".idCardValidDate").val().replace(/-/g,'');
    var card = App.getSession(App.bindSelectedCard);
    if(!$(".chose-icon").hasClass("current")){
        alertTips("请同意充值服务协议");
        return;
    }
    console.log(bankAcco);
    console.log(bankAcco.length);
    console.log(isNaN(bankAcco));
    console.log(card);
    if(!/^\w{15,19}$/.test(bankAcco) || isNaN(bankAcco)){
        alertTips("请填写正确的银行卡卡号");
        return;
    }
    if(card == null || App.isEmpty(card.bankNo)){
        alertTips("请选择银行");
        return;
    }
    if(!/^1[0-9]{10}$/.test($(".phone").val())){
        alertTips("请输入正确的手机号码");
        return;
    }

    if(App.isSM == App.getSession(App.userInfo).loginFlag){
        if(App.isEmpty(invNm)){
            alertTips("请填写姓名");
            return;
        }
        if(checkIsIdno($(".idCard").val()) !== "SUCCESS"){
            alertTips("请输入正确的身份证号");
            return;
        }
        if(App.isEmpty(idNoValidDate)){
            alertTips("请填证件有效期");
            return;
        }
    }
    // var url = App.projectNm + "/account/create_card_web";
    var url = App.projectNm + "/bank_manager/rapid_create_card";
    var data = JSON.stringify({
        "bankAcco": bankAcco,
        "bankNo"  : card.bankNo,
        "invNm"   : invNm,
        "certNum" : idNo,
        "mobileNo": mobileNo,
        "certValidDate": idNoValidDate
    });
    App.setSession(App.cardBindCardCreateCard_Info, data);
    App.unbind("#btn-submit", "tap");
    App.post(url,data, function(){
        App.bind("#btn-submit", "tap", createCard);
    }, function(result){
        App.setSession(App.serialNo_bindCard, result.body.serialNo);
        var referUrl = App.getUrlParam("referUrl");
        window.location.href = "./securityCode.html" + (App.isEmpty(referUrl) ? "" : "?referUrl=" + encodeURIComponent(referUrl));
    });
}

//    时间插件
var calendarym = new LCalendar();
calendarym.init({
    'trigger': '.idCardValidDate',
    'type': 'date',
    'maxDate':'2099-12-30'//最大日期 注意：该值会覆盖标签内定义的日期范围
});