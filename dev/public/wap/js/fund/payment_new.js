$(function () {
    var windowHeight = $(window).height(),
        footerHeight = $(".footer-tips").height(),
        contentHeight = $(".content").height();
    if (contentHeight > windowHeight - 60) {
        $(".footer-tips").css({
            "marginTop": "1rem",
            "opacity": 1
        })
    } else {
        $(".footer-tips").css({
            "position": "absolute",
            "top": windowHeight - footerHeight,
            "marginTop": "0",
            "opacity": 1
        })
    }
    $(".chose-icon").click(function(){
        $(this).toggleClass("current");
    });
    queryFundPurchaseInfo();
    // queryAccount();

    $("#purchaseAmt").on("keyup", queryFee);
    //$("#btn-submit").on("click", purchaseCheck);
    $("#continue_pur").on("click", continuePurchase);
    // $("#payWay_xjb").on("click", selectPayWay);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=" + encodeURIComponent(location.href));

});
var isHasPro = false;
var selectedBankNo = '';
var selectedBankAcco = '';
var selectedBankSerialId = '';
var couponList = [];
var selectedCoupon = '';
var isSetPwd = 'N';
var cardsCount = 0;
var currencyType = '156';
var fundIdOut = '';
var tip = "";
var tipExt = "";
var couponTxt = "";

var view = new Vue({
    el: '#view',
    data: {
        fundInfo: {
            dayLimitAmt: '0.00'
        },
        cards: [],
        coupons: [],
        noUseCoupon: {couponSerialNo: "", couponDesc: "不使用礼券", fullInfo: {minAmt: 0, maxAmt: 0}}
    },
    mounted: function () {
        var _this = this;
        queryFundDetail(_this);
    },
    methods: {
        selectBankCard: function (card) {
            // console.log(card.bankNo+":" + card.bankAcco);
            selectPayWay(card);
        },
        selectCoupon: function (couponInfo) {
            // console.log(couponInfo);
            var purAmt = $("#purchaseAmt").val();
            if(App.isEmpty(purAmt)){
                alertTips("请先输入金额！");
                return;
            }

            if (Number(purAmt) >= Number(couponInfo.fullInfo.minAmt)
                && (Number(couponInfo.fullInfo.maxAmt) == 0 || Number(purAmt) <= Number(couponInfo.fullInfo.maxAmt))) {
                selectedCoupon = couponInfo.couponSerialNo;
                $("#my_selected_coupon").html(App.isEmpty(couponInfo.title) ? couponTxt : couponInfo.title);

                var target = event.target;
                $(".giftlist ul li .right").each(function () {
                    $(this).removeClass('activeChose').addClass('leaveChose');
                });
                if ($(target).hasClass("right")) {
                    $(target).addClass('activeChose').removeClass('leaveChose');
                } else if (target.tagName == 'LI') {
                    $(target).children('.right').addClass('activeChose').removeClass('leaveChose');
                } else if (target.tagName == 'SPAN') {
                    $(target).next('.right').addClass('activeChose').removeClass('leaveChose');
                }
            }
        }
    }
});

var riskInfo = {code: '0000', msg: ''};

function showSmTip() {
    var fundId = App.getUrlParam("fundId");
    // var url = App.projectNm + "/common/check_union_risk_level?productId=" + fundId;
    var url = "/mobile-bff/v1/common/check-union-risk-level?productId=" + fundId;

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            riskInfo = result.body;
            if (result.body.code == '9990' || result.body.code == '9991' || result.body.code == '9993') {
                $("#evaluation_tip").html(result.body.msg);
                $(".evaluation_risk_tip").show();
            } else if (result.body.code == '9992') {
                $(".sm_tip p").html(result.body.msg ? result.body.msg : '该产品风险等级超过您的风险承受等级');
                $(".sm_tip").show();
                setTimeout(function () {
                    $(".sm_tip").hide()
                }, 1000);
            }
            
            if (result.body.code == '9992'){
            	App.setSession("reminderType",0)
            }else if (result.body.code == '9994'){
            	App.setSession("reminderType",1)
            }else{
            	App.setSession("reminderType",2)
            }
        }
    });
}

var balance = '0.00';
var xjbRemark = '';

function selectPayWay(card) {

    if (card != undefined && card != null && card.tradeFlag == "1") {
        selectedBankNo = card.bankNo;
        selectedBankAcco = card.bankAcco;
        selectedBankSerialId = card.bankCardSerialid;
        if(card.bankGrpName.indexOf("现金宝") > -1){
            $("#payWay").html(card.bankGrpName);
        } else {
            $("#payWay").html(card.bankGrpName + " [ " + card.bankAccoDisplay + " ]");
        }
        if(currencyType == "840"){
            $(".remark_tip p").html(tip);
            $(".remark_tip img").show();
        }else {
        	if(card.bankGrpName.indexOf("现金宝") > -1){
	            $(".remark_tip p").html(card.limitRemark);
	            $(".remark_tip img").hide();
				queryTips();
        	}else{
        		$(".remark_tip p").html(card.limitRemark);
        		$(".remark_tip img").hide();
        	}
        }
    /*} else {
        selectedBankNo = '';
        selectedBankAcco = '';
        $("#payWay").html("现金宝");
        $(".remark_tip p").html(xjbRemark);*/
    } else {
        selectedBankNo = "";
        selectedBankAcco = "";
        selectedBankSerialId = "";
        $("#payWay").html("");
    }
}

function queryAccount() {
    // var url = App.projectNm + "/account/account?r=" + (Math.random() * 10000).toFixed(0);
    var url = "/smac/v1/asset/balance-with-smac"

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            balance = result.body.balance;
            xjbRemark = "现金宝可用余额" + App.formatMoney(balance + '') + "元";
            $(".remark_tip p").html(xjbRemark);
            queryTips();
            $("#xjb_remark").html(xjbRemark);
        }
    });
}
var fundTp = '0';
var fundSt = '';

function continuePurchase() {

	//关掉提示弹窗
    $(".tip").hide();
	/*
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }*/
    purchase();
}

function purchaseCheck() {
    if (riskInfo.code != '0000') {
        if (riskInfo.code == '9990' || riskInfo.code == '9991' || riskInfo.code == '9993') {
            $("#evaluation_tip").html(riskInfo.msg);
            $(".evaluation_risk_tip").show();
            return;
        } else if (riskInfo.code == '9992' && App.isNotEmpty(riskInfo.subMsg)) {
            $("#risk_tip").html(riskInfo.subMsg);
            $(".tip").show();
            return;
        }
    }
    purchase();
}

function showQuestion() {
    $("#bind_card_tip_1").html(tipExt);
    $(".bind_card_tip_1").show();
    $("#bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
}

function purchase() {
    if(isHasPro && !$(".chose-icon").hasClass("current")){
        alertTips('<div style="padding: 1rem 1rem;line-height: 1.5;">请先阅读相关基金协议</div>');
        return;
    }
    if($("#payWay").html() == ""){
        if(currencyType == "840"){
            $("#bind_card_tip_1").html(tipExt);
        } else {
            $("#bind_card_tip_1").html("当前无可用支付方式，请绑定支持的银行卡或联系客服");
        }
        $(".bind_card_tip_1").show();
        $("#bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
        return;
    }
    if (!valide()) {
        return;
    }

    var recommendNo = App.getSession("recommendNo");
    var fundId = App.getUrlParam("fundId");
    var purAmt = $("#purchaseAmt").val();
    var cashFrm = 'V';
    var channel = App.getCookie("channel");
    var arAcct = utils.getSession("_selectArAcct");//选择其他产品购买
    if (App.isNotEmpty(selectedBankNo) || App.isNotEmpty(selectedBankAcco)) {
        cashFrm = 'B';
    }
    if (cashFrm == "V" && Number(balance) > Number(purAmt)){
        $(".recharge_tip").show();
        return;
    }
    if (App.isNotEmpty(purAmt)) {
        // var url = App.projectNm + "/fund/fund_purchase";
        var url = '/mobile-bff/v1/fund/fund-purchase';
        if(fundTp == "8"){//理财用专属接口
            url = '/mobile-bff/v1/financial/financial-purchase';
        }
        var data = {
            "subAmt": purAmt,
            "fundId": fundId,
            "cashFrm": cashFrm,
            "shareType": "A",
            // "bankNo": selectedBankNo,
            // "bankAcco": selectedBankAcco,
            "couponSerialNo": selectedCoupon,
            "status": '',
            "currencyType": currencyType,
            'loginFrom': 'W',
        };
        if(App.isNotEmpty(utils.getUrlParam('sfc') == 1)){
			data["status"] = 'SFC_PURCHASE';
		}
        if (App.isNotEmpty(channel)){
            data["channel"] = channel;
        }
        if (App.isNotEmpty(recommendNo)){
            data["recommendNo"] = recommendNo;
        }
        if (cashFrm == 'B'){
            data["bankNo"] = selectedBankNo;
            data["bankAcco"] = selectedBankAcco;
            data["bankSerialId"] = selectedBankSerialId;
        }
        if(arAcct){
            data["arAcct"] = arAcct;
        }
        if(utils.getSession("selectedTeamId")){
            data["teamId"] = utils.getSession("selectedTeamId");
        }
        if ($("#redeemType").html() == '自动续期'){
            data["redeemType"]= 'AH'
        }
        if ($("#redeemType").html() == '自动赎回'){
            data["redeemType"]= 'AR'
        }
        utils.post(url, JSON.stringify(data), null, function (result) {
            utils.removeSession("_selectArAcct");
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            if(fundSt == '1'){
                App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/fundSubscriptionSuccessfully.html");
            }else{
                App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/fundPurchaseSuccessfully.html");
            }
            // window.location.href = "../common/setPassword.html";

            utils.verifyTradeChain(result.body);
            
            // App.setSession(App.serialNo_forword_url, "../fund/fundPurchaseSuccessfully_new.html");
            // window.location.href = "../common/setPassword.html";
        });
    }else{
        alertTips('<div style="padding: 1rem 1rem;line-height: 1.5;">请输入申购金额</div>');
        return;
    }
}

function queryFundDetail(data) {
    var fundId = App.getUrlParam("fundId");
    var url = "/mobile-bff/v1/fund/detailInfo";

    App.post(url, JSON.stringify({"fundId": fundId}), function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var fundInfo = result.body;
            if (fundInfo.fundSt == '1') {
                $("#purchaseAmt").attr("placeholder", App.formatMoney(Number(fundInfo.minSubAmt).toFixed(2)) + "元起");
                $("#minPurAmt").val(fundInfo.minSubAmt);
                $("title").html("基金认购");
            } else {
                $("#purchaseAmt").attr("placeholder", App.formatMoney(Number(fundInfo.minBidAmt).toFixed(2)) + "元起");
                $("#minPurAmt").val(fundInfo.minBidAmt);
                $("title").html("基金申购");
            }
			$("#minSubAmt").val(fundInfo.minSubAmt);
            var readTxt = "";
            var fundContractList = result.body.fundContractList;
            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){
                var html = "";
                //根据类型处理数据
                var listKey = new Array();//拼分组数组
                fundContractList.forEach(function (item, index) {
                	if(listKey.indexOf(item.contractCategory) == -1){
                		listKey.push(item.contractCategory);
                	}
                });
                if(listKey.length > 0){
                //存到session
                App.setSession("buy_agreementIds",listKey.join(','))
            	}
				listKey.forEach(function (item0, index0) {
					if(item0 == "KFS"){
						html = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead'+index0+'" class="chose-icon"></span>我已阅读并确认已知悉';
					}else{
						html = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead'+index0+'" class="chose-icon"></span>我已同意';
					}
	                fundContractList.forEach(function (item, index) {
	            		if(item0 == item.contractCategory){
		                    html += "<a href=\""+ item.url +"\">《"+ item.title +"》</a>";
		           
		                    if((index + 1) < fundContractList.length) {
		                        html += "&nbsp;";
		                      
		                    }
	                	}
	                });
	                html += '</p>';
                	$("#risk_list").append(html);
                	
					App.bind("#isRead"+index0,"tap",function(){
						if(!$("#isRead"+index0).hasClass("current")){
							$("#isRead"+index0).addClass("current")
							var contractLength = $("#risk_list").children("p").length;
							var chkCnt = 0;
							$("#risk_list").children("p").each(function(){
								if($(this).children("span").hasClass("current")){
									chkCnt+=1;
								}
							});
					        if(Number($("#purchaseAmt").val()) > 0  && (contractLength == chkCnt)){
					        	$("#btn-submit").css({'background-color':'#fd7e23'});
								App.unbind('#btn-submit', "tap",purchaseCheck);
					        	App.bind('#btn-submit', "tap",purchaseCheck);
					        	$("#btn-submit2").css({'background-color':'#fd7e23'});
								App.unbind('#btn-submit2', "tap",purchaseCheckNew);
					        	App.bind('#btn-submit2', "tap",purchaseCheckNew);
					        }else{
					        	App.unbind('#btn-submit', "tap",purchaseCheck);
					        	$("#btn-submit").css({'background-color':'#ddd6d6'});
					        	App.unbind('#btn-submit2', "tap",purchaseCheckNew);
					        	$("#btn-submit2").css({'background-color':'#ddd6d6'});
					        }
						}else{
				        	App.unbind('#btn-submit', "tap",purchaseCheck);
				        	$("#btn-submit").css({'background-color':'#ddd6d6'});
				        	App.unbind('#btn-submit2', "tap",purchaseCheckNew);
				        	$("#btn-submit2").css({'background-color':'#ddd6d6'});
					    	$("#isRead"+index0).removeClass("current")
					   	}
					});
                	
                });

            }
			if(fundInfo.fundContractList.length > 0){
				$("#risk_list").show();
				isHasPro = true;
			}else{
				$("#risk_list").hide();
			}
            //币种（156人民币、840美元）
            if(fundInfo.currencyType == "156"){
                $(".currencyTp-unit").html("元");
                $("#purchaseAmt").attr("placeholder", App.formatMoney(Number(fundInfo.minBidAmt).toFixed(2)) + "元起");
                currencyType = fundInfo.currencyType;
            }else if (fundInfo.currencyType == "840") {
                $(".currencyTp-unit").html("美元");
                $("#purchaseAmt").attr("placeholder", App.formatMoney(Number(fundInfo.minBidAmt).toFixed(2)) + "美元起");
                currencyType = fundInfo.currencyType;
            }
            fundIdOut = fundInfo.fundId;
            queryCard(data);
            queryCouponList(data, fundInfo.fundTp);
            data.fundInfo = fundInfo;
            fundTp = fundInfo.fundTp;
            fundSt = fundInfo.fundSt;
            App.setSession("fundRiskLevel",fundInfo.fundRiskLevel);
            if(fundInfo.fundRiskLevel == "4"){
            	$("#high_risk_tip").show()
            }else{
            	$("#high_risk_tip").hide()
            }
        }
    });
}

var compare = function (x, y) {
    var flag = 0;

    if(x == undefined || x == null){
        return 1;
    }
    if(y == undefined || y == null){
        return -1;
    }

    var coupon0 = x.fullInfo;
    var coupon1 = y.fullInfo;
    /**
     * 不支持的放到后面
     */
    if("1,2,3".indexOf(coupon0.couponType) > -1){
        if("1,2,3".indexOf(coupon1.couponType) > -1){
            flag =  coupon0.couponType - coupon1.couponType;
        }else{
            flag = -1;
        }
    }else if("1,2,3".indexOf(coupon1.couponType) > -1){
        return 1;
    }else {
        return 0;
    }

    /**
     * 1:加息、2：翻倍、3：学习（满减）
     */
    flag = 0;
    switch (coupon0.couponType){
        case 1:
            flag = -Number(coupon0.addYieldValue * coupon0.addYieldDays - coupon1.addYieldValue * coupon1.addYieldDays);
            break;
        case 2:
            flag = -Number(coupon0.appProfitPower * coupon0.appProfitDays - coupon1.appProfitPower * coupon1.appProfitDays);
            break;
        case 3:
            flag = -Number(coupon0.minusAmt - coupon1.minusAmt);
            break;
        default:
            flag = 0;
            break;
    }
    return flag;
}

function queryCouponList(data, fundTp) {
    var fundId = App.getUrlParam("fundId");

    var url = App.projectNm + "/coupon/query_usable_coupon_list?handleTp=2&productTp=" + fundTp + "&productId=" + fundId;

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var list = result.body.list;
            couponTxt = "有" + result.body.list.length + "张礼券可使用";
            $("#my_selected_coupon").html(couponTxt);
            list.push(data.noUseCoupon);
            data.coupons = list;
            couponList = list.sort(compare);
        }
    });
}

function queryCard(data) {

    // var url = App.projectNm + "/account/card?r=" + (Math.random() * 10000).toFixed(0);
    //当前wap只有基金申购，tradeType=00表示申购，后续有其他基金交易时，需要修改tradeType
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=" +currencyType + "&fundId=" + fundIdOut + "&tradeType=00&tradeScene=11" ;
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("银行卡数量："+ result.body.card.length);
            // data.cards = result.body.card;
            tip = result.body.tip;
            tipExt = result.body.tipExt;
            if(currencyType == "840"){
                $(".remark_tip p").html(tip);
                $(".remark_tip img").show();
            }
            data.cards = result.body.bankInfos;
            if(result.body.bankInfos != undefined && result.body.bankInfos != null && result.body.bankInfos.length > 0){
                var channel = App.getCookie("channel");
                if (App.isNotEmpty(channel)){
                    if (data.cards.length > 1){
                        selectPayWay(data.cards[1]);
                    } else {
                        selectPayWay(data.cards[0]);
                    }
                } else {
                    selectPayWay(data.cards[0]);
                }
                // console.log(1);
                showSmTip();
            }else{
                // console.log(2);
                if(result.body.bankInfos !=undefined && result.body.bankInfos != null){
                    cardsCount = result.body.bankInfos.length;
                }
                isSetTradePassword();
            }
        }
    }, false);
}

function isSetTradePassword() {

    // var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);
    var url = "/mobile-bff/v1/account/has-set-trade-pwd";

    App.post(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("是否设置过交易密码："+ result.body.isSetPwd + " \n银行卡数量：" + cardsCount);
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }

            if(isSetPwd != "1"){//没设置交易密码
            	$("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }else if(cardsCount == 0){//没绑卡
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }
        }
    });
}

function queryFundPurchaseInfo() {
    var fundId = App.getUrlParam("fundId");
    // var url = App.projectNm + "/fund/get_fund_purchase_info?r=" + (Math.random() * 10000).toFixed(0);
    var url = "/mobile-bff/v1/fund/get-fund-purchase-info?r=" + (Math.random() * 10000).toFixed(0);
    if (App.isNotEmpty(fundId)) {
        url += "&fundId=" + fundId;
    }

    utils.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            $("#purTip").html(result.body.remark.replace(/size=14/g, ""));
            if(App.isNotEmpty(result.body.subscribeRemark)){
            	$("#subscribeRemark").html(result.body.subscribeRemark);
        	}
        }
    });
}

function queryFee() {
    var fundId = App.getUrlParam("fundId");
    var purAmt = $("#purchaseAmt").val();
    var payWay = $("#payWay").html();
    if (App.isNotEmpty(purAmt) && fundTp != '1' && App.isNotEmpty(payWay)) {

        selectCouponByAmt(purAmt);

        // var url = App.projectNm + "/fund/fund_fee";
        // var data = {"subAmt": purAmt, "fundId": fundId, "cashFrm": "V", "shareType": "A", "bankNo": ""};
        var url = "/mobile-bff/v1/fund/fund-fee?subAmt="+ purAmt + "&fundId="+ fundId + "&cashFrm=V&bankNo=''&shareType=A"

        utils.get(url, null, function (result) {
            // console.log(result);
            $("#fee").html(result.body.fee);
            $("#discountFee").html(result.body.discountFee);
            $("#rate").html(result.body.rate);
            $("#uRate").html(result.body.uRate);
            $("#fee_view").show();
        });
    }
}

function selectCouponByAmt(purAmt) {

    $(".giftlist ul li .right").each(function () {
        $(this).removeClass('activeChose').addClass('leaveChose');
    });

    for(var index in couponList){
        var item = couponList[index];
        if (Number(purAmt) >= Number(item.fullInfo.limitAmt)
            && (Number(item.fullInfo.maxAmt) == 0 || Number(purAmt) <= Number(item.fullInfo.maxAmt))) {
            selectedCoupon = item.couponSerialNo;
            $("#my_selected_coupon").html(App.isEmpty(item.title) ? "无可用礼券" : item.title);

            if(App.isNotEmpty(selectedCoupon)){
                $('.'+selectedCoupon).children('.right').addClass('activeChose').removeClass('leaveChose');
            }else {
                $('.coupon-ul li:last').children('.right').addClass('activeChose').removeClass('leaveChose');
            }
            break;
        }
    }
}

$(".selectBankCard").click(function () {
    $("#bankCardList").show();
});

// 银行卡,列表
$("#bankCardList").click(function () {
    $("#bankCard").html($(this).find(".bank-name").html()).removeClass("gray");
    $("#bankCardList").hide();
});

//选择礼券
$(".my-coupon").click(function () {
    $("#couponList").show();
    $(".mask").show();
});
//礼券列表关闭
$(".close_button").click(function () {
    $("#couponList").hide();
    $(".mask").hide();
});

$(".close_tip").click(function () {

    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});


    $('.money .del').on('click', function () {//清空input
        $('.money input').val('')
        $('.chineseText span').text(changeNumMoneyToChinese(''))

    })
    $('.money .del').on('click', function () {//清空input
        $('.money input').val('')
        $('.chineseText span').text(changeNumMoneyToChinese(''))

    })
    $('.money input').on('input', function () {//格式化input
        var val = $(this).val().replace(/[,A-z]/g, '');
        // var arr = val.split(/[.]/);
        // var reg = /(?=(\B)(\d{3})+$)/g;
        // $(this).val(str)
        $('.chineseText span').text(changeNumMoneyToChinese(val))
    })
    
	function queryTips(){
	    var url = "/mobile-bff/v1/smac/tradeTips?sceneCode=00&r=" + (new Date()).getTime();
	    App.get(url, null, function(result) {
	        var body = result.body;
	        if (body != null && body != undefined) {
	        	if(App.isNotEmpty(body.tradeRules)){
		        	$("#otherType").html(body.tradeRules);
		            App.bind("#go_to_otherType", "tap", function() {
		                window.location.href = body.smacH5UpgradeJumpUrl;
		            })
		            $(".remark_tip p").html($(".remark_tip p").html() + '&nbsp;<i class="icon-i other" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">i</i>');
		            App.bind(".other", "tap", function() {
		                $(".otherType").show();
		            })
		       	}else{
		       		$(".icon-i").hide();
		        	$(".otherType").hide();
		       	}
	        } else {
	        	$(".icon-i").hide();
                $(".otherType").hide();
            }
	    });
	}
	
	
	
$("#purchaseAmt").on("input", function () {
	var contractLength = $("#risk_list").children("p").length;
	var chkCnt = 0;
	$("#risk_list").children("p").each(function(){
		if($(this).children("span").hasClass("current")){
			chkCnt+=1;
		}
	});
    if(Number($("#purchaseAmt").val()) > 0  && (contractLength == chkCnt)){
    	$("#btn-submit").css({'background-color':'#fd7e23'});
		App.unbind('#btn-submit', "tap",purchaseCheck);
    	App.bind('#btn-submit', "tap",purchaseCheck);
    	$("#btn-submit2").css({'background-color':'#fd7e23'});
		App.unbind('#btn-submit2', "tap",purchaseCheckNew);
    	App.bind('#btn-submit2', "tap",purchaseCheckNew);
    }else{
    	App.unbind('#btn-submit', "tap",purchaseCheck);
    	$("#btn-submit").css({'background-color':'#ddd6d6'});
    	App.unbind('#btn-submit2', "tap",purchaseCheckNew);
    	$("#btn-submit2").css({'background-color':'#ddd6d6'});
    }
})

function purchaseCheckNew(){
	if($("#minSubAmt").val() > $("#purchaseAmt").val()){		
		alertTips("申购金额不得少于"+$("#minSubAmt").val()+"元");
		return;
	}
	purchaseNew();
	
}
function purchaseNew(){
	

	var url0 = '/cts/v1/workdate-query/current-work-day';
    App.get(url0, null, function (result) {
        if (result.body != undefined && result.body != null) {
			
			App.get('/cts/v1/workdate-query/next-work-day?workday='+result.body+'&next=1', null, function (result) {
			if (result.body != undefined && result.body != null) {
				var fundId = App.getUrlParam("fundId");
				var purAmt = $("#purchaseAmt").val();
				if (App.isNotEmpty(purAmt)) {
					// var url = App.projectNm + "/fund/fund_preorder_purchase";
					var url = '/mobile-bff/v1/fund/fund-preorder-purchase';
					var data = {
						"subAmt": purAmt,
						"fundId": fundId,
						"cashFrm": "V",
						"shareType": "A",
						"couponSerialNo": "",
						"status": 'B',
						"preorderDt": result.body,
						"currencyType": "156"
					};


					utils.post(url, JSON.stringify(data), null, function (result) {
						App.setSession(App.serialNo_info, result.body.info);
						App.setSession(App.serialNo, result.body.serialNo);
						App.setSession(App.serialNo_success_show_data, data);

						
						App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/fundPurchaseSuccessfully_new.html");
						
                        utils.verifyTradeChain(result.body);
						// window.location.href = "../common/setPassword.html";
					});
				}else{
					alertTips('<div style="padding: 1rem 1rem;line-height: 1.5;">请输入申购金额</div>');
					return;
				}
			}
			})
		}
	})
	
}
$("#btn-submit").css({'background-color':'#ddd6d6'});
$("#btn-submit2").css({'background-color':'#ddd6d6'});
$("#btn-submit2").click(function(){
	purchaseCheckNew()
	
});