App.setSession("only_set_trade_pwd",0);
$(function(){
    
    if(utils.getUrlParam('fromSource') == 'bcm'){
        formBCM();
    }

    App.removeSession(App.bindSelectedCard);

    var userInfo = App.getSession(App.userInfo);
    if(userInfo == null){
        App.queryUserInfo(function (){
            userInfo = App.getSession(App.userInfo);
            userInfoSessionReadyFun();
        });
    }else{
        userInfoSessionReadyFun();
    }

    App.bind(".icon-question", "tap", function(){
        alertTips("该手机号为您的银行预留手机号，是您在开户资料上填写的号码，如您后续有变更，以变更后为准。", "我知道了");
    });

	//是否设置过交易密码
	App.queryHasSetTradePassword(function (data) {
		var data = (typeof data === 'string' ? JSON.parse(data): data);
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

    App.bind("#btn-submit", "tap", createCard);

    App.bind("#protocolUrl", "click", function(){
        var paro = $("#protocolUrl").attr("href");
        if(paro == 'javascript:;' || paro == ''){
            alertTips("请选择银行卡");
        }
    });

    $(".selectBankCard-bind").click(function(){
        var userInfo = App.getSession(App.userInfo);
        var acco = $(".bankCardNo").val().replace(/\s+/g, "");
        if(App.isEmpty(acco)){
            $("#bankCardList").show();
        }else{
            // var url = App.projectNm + "/get_bank_list_web";
            // App.post(url,JSON.stringify({'bankAcco': acco}),null, function (result) {
            var idTp = userInfo.idTp;
            // 20220709紧急上线，idTp修改为0，非实名场景
            (App.isSM == App.getSession(App.userInfo).loginFlag) && (idTp = '0')
            var url = "/mobile-bff/v1/bankengine/bank-list?bankAcco=" + (acco?acco:"\"\"")+'&idTp='+idTp;
            App.get(url, null, function (result) {
                var clist = result.body.channel;
                var bankChannel;
                if(result.body.channel[0].bankNo == '707'){//招行一网通
                    bankChannel = result.body.channel[0];
                }else{
                    // S 当前只支持快捷，signWay=="1" 
                    clist = clist.filter((item)=>{
                        return item.signWay === '1';
                    })
                    // E 当前只支持快捷，signWay=="1"
                    // 20220324 和App保持一致 接口返回多条时，取第一条可用
                    if(clist.length >= 1 && acco){
                        bankChannel = clist[0];
                    }
                }
                if(bankChannel){
                    var card = {"bankNo":bankChannel.bankNo,"bankNm":bankChannel.accoName,"protocolUrl":bankChannel.protocolUrl,"fakeBank":bankChannel.fakeBank};

                    if(bankChannel.fakeBank == '1'){
                        $("#phone-panel").hide();
                    } else {
                        $("#phone-panel").show();
                    }
                    if(bankChannel.bankNo == '707'){//招行一网通
                        $("#zsywt-panel").show();
                        $("#phone-panel").hide();
                    }else{
                        $("#zsywt-panel").hide();
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

function userInfoSessionReadyFun(){
    var userInfo = App.getSession(App.userInfo);
    if(userInfo.idtp && !userInfo.idTp){
        userInfo.idTp = userInfo.idtp;
    }
    App.setSession(App.userInfo, userInfo);

    checkIsSM(userInfo);
    $(".phone").val(userInfo.mobileNo);

    var cards = App.getSession(App.bindCards);
    if(cards == null || cards.length == 0){
        queryBankList('',userInfo.idTp);
    }else{
        showBankList(cards);
    }

    $(".bankCardNo").on("input", loadBank);
    if($('.bankCardNo').val()){
        loadBank();
    }

    App.queryCard(function(){
        var cards = App.getSession(App.cards);
        if(!cards || cards.length == 0){
            // 小米渠道自动填充银行卡号
            var openUid = utils.getCookie(utils.openUid) || utils.getSession(utils.openUid);
            if(App.getCookie('channelCode') == 'airstar' && openUid){
                utils.ajax({
                    url: '/uaa/v1/airstar/third-user-info',
                    contentType: 'application/json',
                    data: {
                        partyNo: openUid
                    },
                    dataType: 'json',
                    success: function (result) {
                        if (result.returnCode === 0 && result.body) {
                            $('.bankCardNo').val(result.body.bankCard);
                            $('.bankCardNo').keyup();
                            loadBank();
                        }
                    }
                });
            }
        }
    });
}



/**
 * 根据卡bin选择银行通道
 */
var hisBankBin = '';
function loadBank(){
    var userInfo = App.getSession(App.userInfo);
    var bankAcco = $(".bankCardNo").val().replace(/\s+/g, "");
    //20220324 和App保持一致，输入10位数字开始识别卡bin
    if(bankAcco.length >= 10){
        var newBankBin = bankAcco.substring(0,10);
        if(hisBankBin != newBankBin&&userInfo.idTp){
            hisBankBin = newBankBin;
            queryBankList(bankAcco,userInfo.idTp);
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
        $(".invNm").val(userInfo.invnm || userInfo.invNm);
        $(".idCard").val(userInfo.idno || userInfo.idNo);
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
        var signWay;
		if(card.signWay == "1"){
			signStyle = "icon-shorcut";
			signWay = "快捷";
		}else if(card.signWay == "2"){
			signStyle = "icon-union";
			signWay = "银联通";
		}else if(card.signWay == "3"){
			signStyle = "icon-E-bank";
			signWay = "网银";
		}else if(card.signWay == "4"){
			signStyle = "icon-E-bank";
			signWay = "通联";
		}else if(card.signWay == "6"){
			signStyle = "icon-E-bank";
			signWay = "云闪付";
		}else if(card.signWay == "7"){
			signStyle = "icon-E-bank";
			signWay = "一网通";
        }

        if(card.bankGrpName.indexOf('招行') > -1 && card.signWay != '7') continue;

        if((true || card.signWay == "7" || card.signWay == "1")&&card.bindCardFlag=="1"){//wap只需支持快捷和招行一网通 20210705全放开,bindCardFlag: "1"来展示是可以在wap绑卡
            arr.push('<li class="list-group-item bottom-border lh-100 bank_card_option" data="'+ card.bankNo +',' + card.accoName + ','+ card.protocolUrl+ ','+ card.fakeBank +'">');
            arr.push('    <div class="row">');
            arr.push('        <div class="">');
            arr.push('            <img src="/mobileEC/images/bank/'+card.bankNo+'.png" class="bank-logo-new" style="margin-top:10px !important" />');
            arr.push('        </div>');
            arr.push('        <div class="col-1">');
            arr.push('            <p class="bank-name font-28">' + card.accoName +  '</p>');
            arr.push('        </div>');
            arr.push('        <div class="">');
            arr.push('            <a class="icon ' + signStyle + '">'+signWay+'</a>');
            arr.push('        </div>');
            arr.push('    </div>');
            arr.push('</li>');

        }
    }
    $("#bankCardList ul").html(arr.join(""));
    App.bind(".bank_card_option", "tap", selectedCard);
}

/**
 * 获取可用银行渠道
 */
function queryBankList(acco,idTp){
    // 20220709紧急上线，idTp修改为0，非实名场景
    (App.isSM == App.getSession(App.userInfo).loginFlag) && (idTp = '0')
    var url = "/mobile-bff/v1/bankengine/bank-list?bankAcco=" + (acco?acco:"\"\"")+'&idTp='+idTp;
    App.get(url, null, function (result) {
        if(App.isEmpty(acco)){
            App.setSession(App.bindCards, result.body.channel);
            showBankList(result.body.channel);
        }else{
            var clist = result.body.channel;
            var bankChannel;
            if(result.body.channel[0].bankNo == '707'){//招行一网通
                bankChannel = result.body.channel[0];
            }else{
                // S 当前只支持快捷，signWay=="1" 
                clist = clist.filter((item)=>{
                    return item.signWay === '1';
                })
                // E 当前只支持快捷，signWay=="1"
                // 20220324 和App保持一致 接口返回多条时，取第一条可用
                if(clist.length >= 1 && acco){
                    bankChannel = clist[0];
                }
            }
             
            if(bankChannel){   
                var card = {"bankNo":bankChannel.bankNo,"bankNm":bankChannel.accoName,"protocolUrl":bankChannel.protocolUrl,"fakeBank":bankChannel.fakeBank};

                if(bankChannel.fakeBank == '1'){
                    $("#phone-panel").hide();
                }else{
                    $("#phone-panel").show();
                }
                if(bankChannel.bankNo == '707'){//招行一网通
                    $("#zsywt-panel").show();
                    $("#phone-panel").hide();
                }else{
                    $("#zsywt-panel").hide();
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
    if(array[0] == '707'){//招行一网通
        $("#zsywt-panel").show();
        $("#phone-panel").hide();
    }else{
        $("#zsywt-panel").hide();
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
        if(card.bankNo == '707' ){
            card.bankNm = '招行一网通';
        }
        $("#bank_name_panel").html(card.bankNm);
        $("#protocolUrl").attr("href", card.protocolUrl);
    }
}

$(".chose-icon").click(function(){
    $(".chose-icon").toggleClass("current");
});

// $('.chose-icon2').click(function(){
//     if($(this).hasClass('current')){
//         $('.idCardValidDate').val('');
//         $(this).removeClass('current');
//     }
//     else {
//         $('.idCardValidDate').val('长期有效');
//         $(this).addClass('current');
//     }
// });

function createCard(){

    var bankAcco = $(".bankCardNo").val().replace(/\s+/g, "");
    var mobileNo = $(".phone").val();
    var invNm = $(".invNm").val();
    var idNo = $(".idCard").val();
    // var idNoValidDate = $('.chose-icon2').hasClass('current') ? '20991231' : $(".idCardValidDate").val().replace(/-/g,'');
    var card = App.getSession(App.bindSelectedCard);
    if(!$(".chose-icon").hasClass("current")){
        alertTips("请同意充值服务协议");
        return;
    }

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
        // if(App.isEmpty(idNoValidDate)){
        //     alertTips("请填证件有效期");
        //     return;
        // }
    }

    if(card.bankNo == '707'){//跳去招行一网通
        var url = "/mobile-bff/v1/bankengine/bcm-create-card";
        // var returnUrl = location.origin + '/mobileEC/wap/card/manage_card.html';
        // var returnUrl = location.origin + '/mobileEC/wap/card/bindCardInputCardInfo.html?fromSource=bcm';
        var returnUrl = location.href + (location.search?'&':'?') + 'fromSource=bcm';
        

        var data = JSON.stringify({
            "bankAcco": bankAcco,
            "bankNo"  : card.bankNo,
            "bankSerialId":card.bankSerialId,
            "invNm"   : invNm,
            "idNo"    : idNo,
            "idTp"    : 0, // 0:身份证
            "mobileNo": mobileNo,
            // "certValidDate": idNoValidDate,
            "hasBankApp":"0",
            "handleFlag":'',
            "returnUrl":returnUrl,
            "loginFrom": "W",
        });
        App.setSession(App.cardBindCardCreateCard_Info, data);
        App.unbind("#btn-submit", "tap");
        App.post(url,data, function(result){
            if(result.returnCode=="20124"){      //20210820添加的--证件已注册过汇添富现金宝账户，建议您找回密码后重新登录--start
                var htm='<i class="close" style="margin-left:2rem;border-left:2px solid #eee;padding-left:1rem;display:none">我知道了</i>'
                $(".Bomb-box").show();
                $(".Bomb-box .Bomb-box-ok").html("<i class='findPw'>找回密码</i>"+htm);
                $(".Bomb-box .close").show();
                $(".Bomb-box .Bomb-box-ok .findPw").click(function(){
                    window.location.href="/tradeh5/newWap/findPwd/IDcheck.html";
                })
             } 
             //20210820添加的end  

            App.bind("#btn-submit", "tap", createCard);
        }, function(result){
            App.setSession(App.serialNo_bindCard, result.body.serialNo);
            //20210825，避免招行报错（NP1122.无效订单：签名验证失败）
            // App.setSession("formData", result.body.formData);
            App.setSession("formData", String(result.body.formData).replace(/\"returnUrl\":\"(.*?)\"/g, '\"returnUrl\":\"'+encodeURIComponent(returnUrl)+'\"'));

            window.location.href = "./bcmCard.html"
            // var referUrl = App.getUrlParam("referUrl");
            // window.location.href = "./bcmCard.html" + (App.isEmpty(referUrl) ? "" : "?referUrl=" + encodeURIComponent(referUrl));
        });
    }else{
        var url = "/mobile-bff/v1/bankengine/rapid-create-card";
        var data = JSON.stringify({
            "bankAcco": bankAcco,
            "bankNo"  : card.bankNo,
            "invNm"   : invNm,
            "idNo"    : idNo,
            "idTp"    : 0, // 0:身份证
            "mobileNo": mobileNo,
            "loginFrom": "W",
            // "certValidDate": idNoValidDate
        });
        App.setSession(App.cardBindCardCreateCard_Info, data);
        App.unbind("#btn-submit", "tap");
        App.post(url,data, function(result){

             if(result.returnCode=="20124"){      //20210820添加的--证件已注册过汇添富现金宝账户，建议您找回密码后重新登录--start
                var htm='<i class="close" style="margin-left:2rem;border-left:2px solid #eee;padding-left:1rem;display:none">我知道了</i>'
                $(".Bomb-box").show();
                $(".Bomb-box .Bomb-box-ok").html("<i class='findPw'>找回密码</i>"+htm);
                $(".Bomb-box .close").show();
                $(".Bomb-box .Bomb-box-ok .findPw").click(function(){
                    window.location.href="/tradeh5/newWap/findPwd/IDcheck.html";
                })
             } 
             //20210820添加的end  

            App.bind("#btn-submit", "tap", createCard);
        }, function(result){
            App.setSession(App.serialNo_bindCard, result.body.serialNo);
            var referUrl = decodeURIComponent(App.getUrlParam("referUrl"));
            //20220323 fromBindCard是设置交易密码接口的场景码，区分是否绑卡后设置的密码
            window.location.href = "./securityCode.html?fromBindCard=1" + (App.isEmpty(referUrl) ? "" : "&referUrl=" + encodeURIComponent(referUrl));
        });
    }

}

//    时间插件
// var calendarym = new LCalendar();
// calendarym.init({
//     'trigger': '.idCardValidDate',
//     'type': 'date',
//     'maxDate':'2099-12-30'//最大日期 注意：该值会覆盖标签内定义的日期范围
// });
// $(document).on('touchstart','.lcalendar_finish', function () {
//     $('.chose-icon2').removeClass('current');
// });



// 20210720 招行一网通返回处理
function formBCM() {
    utils.loadingShow();
    bcmResultCircleQuery(utils.getSession(utils.tradeAsyncQueryTimesSession) || utils.tradeAsyncQueryTimes, 
                         utils.getSession(utils.tradeAsyncQueryIntervalSession) || utils.tradeAsyncQueryInterval);
}
function bcmResultCircleQuery(countLimit, queryInterval) {
    var count = 1;
    var ajaxHasDone = 0;
    var errorMsg = '';
    var setIntervalID = setInterval(function () {
        if (count >= countLimit) { // 轮询结束
            clearInterval(setIntervalID);
        }
        count++;
        var url = "/mobile-bff/v1/bankengine/bcm-create-card-confirm";
        var data = JSON.stringify({
            "serialNo": App.getSession(App.serialNo_bindCard),
            "loginFrom": "W"
        });

        $.ajax({
            url: url,
            data: data,
            contentType: 'application/json',
            dataType: 'json',
            method: 'POST',
            beforeSend: function(req) {
                if(utils.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
                }
            },
            success: function (queryResult) {
                console.log('bcm success!')
                // if (queryResult.returnCode == 0 && queryResult.body.status == '0000') { // 轮询结束
                if (queryResult.returnCode == 0 && queryResult.body.createCardResult && queryResult.body.createCardResult.result) { // 轮询结束
                    queryResult.body.userLoginResult && utils.setSession(utils.userInfo, queryResult.body.userLoginResult);
                    utils.loadingHide();
                    clearInterval(setIntervalID);
                    var referUrl = decodeURIComponent(utils.getUrlParam(referUrl));
                    if (!referUrl) {
                        referUrl = '/mobileEC/wap/card/manage_card.html'
                    }
                    console.log('referUrl=', referUrl);
                    window.location.href = referUrl;
                }
                else {
                    ajaxHasDone++;
                    errorMsg = queryResult.body.remark;
                }
            },
            error: function(){
                ajaxHasDone++;
            },
            complete: function () {
                if (ajaxHasDone >= countLimit) { // 轮询失败
                    utils.loadingHide();
                    clearInterval(setIntervalID);
                    // utils.showTips(errorMsg ? errorMsg :'交易处理中，请稍后查询交易结果');
                    utils.showTips({
                        // title: '信息', //标题
                        content: errorMsg ? errorMsg :'交易处理中，请稍后查询交易结果', //内容
                        showCancel: true, //是否显示取消按钮，默认false
                        confirmText: '确定', //确认按钮文字，默认确定
                        complete: function() { //需使用bind()
                            var referUrl = decodeURIComponent(utils.getUrlParam(referUrl));
                            if (!referUrl) {
                                referUrl = '/mobileEC/wap/card/manage_card.html'
                            }
                            console.log('referUrl=', referUrl);
                            window.location.href = referUrl;
                        }.bind(this)
                    })
                }
            }
        });
        
        
    }, queryInterval);
    
    
}