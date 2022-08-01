//从亲情宝跳来的购买
var arAcct = utils.getSession("_selectArAcct");//选择其他产品购买
$(function () {
//问号提示
    $(".icon-question-coupon").click(function (event) {
        event.stopPropagation();
        $(".Bomb-box2").show();
    });
    $(".icon-question-transfer").click(function (event) {
        event.stopPropagation();
        $(".Bomb-box1").show();
    });
    $(".Bomb-box-ok").click(function () {
        $(this).parent().parent().hide();
    });

    //勾选
    $(".rules").click(function () {
        $(".chose-icon").toggleClass("current");
    });
    //调仓方式
    $(".select-transfer-type").click(function () {
        $(".transfer_type_list").show();
    });
    $(".transfer_type_list").click(function(event) {
        var li = $(event.target).parents("li");
        if (li.length == 0) {
            $(".transfer_type_list").hide();
            return
        };
        if (!li.hasClass("on")) {
            li.addClass("on").siblings("li").removeClass("on");

        };
        $(".transfer_type_list").hide();
        $(".select-transfer-type").html(li.find("div").text());
        $(".select-transfer-type").attr("data-flag", li.attr("data-flag"));
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
    //选择银行卡
    $(".select-bank-card").click(function () {
        $("#bankCardList").show();
    });
    $("#purchaseAmt").on("keyup", queryFee);
    var groupId = App.getUrlParam("groupId");
    queryAccount();
    queryCard();
    requestGroupFundDetail(groupId);
    queryTradeInfo(groupId);
    queryTips();
    App.bind('#continue_pur', "tap",continuePurchase);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=" + encodeURIComponent(location.href));
    $('#go_to_recharge').on('click',function(){
        window.location.href = '../account/topup.html?forwardUrl=' + encodeURIComponent(location.href);
    });

    if(arAcct){
        
        utils.get('/sfs/v1/accounts/assets/plans/share?arAcct='+arAcct,null,function(result){
            if(result.returnCode == 0){
                if(result.body.planName){
                    $("#planName").html(result.body.planName);

                }
            }
        });
        $("#familyAcc").show();
    }
});
var couponList = [];
var sBankNo = "";
var sBankAcco = "";
var sBankName = "";
var sBankDisplayCard = "";
var selectedCoupon = "";
var groupName = "";
var groupType = "";
var fee = 0;
var balance = 0;
var cardsCount = 0;
var riskInfo = {code: '0000', msg: ''};
var isShowToBindCard = false;
var couponTxt = "";
var cardsCount = 0;
var initLimitAmount = 0;
var sBankSerialId = "";
function showSmTip() {
    var groupId = App.getUrlParam("groupId");
    // var url = App.projectNm + "/common/check_union_risk_level?productId=" + groupId;
    var url = "/mobile-bff/v1/common/check-union-risk-level?productId=" + groupId;

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
        }
    });
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

            if(isSetPwd != "1"){      console.log(cardsCount)          
				if(cardsCount > 0){
					$("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
					$("#go_to_bind_card").html("去设置");
					$(".bind_card_tip").show();
					$("#go_to_bind_card").attr("href", "../card/bindCardInputPassword_1.html?referUrl=" + encodeURIComponent(document.URL));
				}else{
					isShowToBindCard = true;
					$(".bind_card_tip").show();
					$("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
				}
                return;
            }else if(cardsCount == 0){
                isShowToBindCard = true;
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }
            showSmTip();
        }
    });
}
function continuePurchase() {
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }else{
		purchase();
	}
    $(".tip").hide();
    $(".tip2").hide();
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
    }else{
		purchase();
	}
}

function queryTips() {
    App.get(App.projectNm + "/adviser/query_transfer_tips?t=" + new Date().getTime(), null, function(result){
        if(result.body != undefined && result.body != null){
            $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(result.body.transferTips);
        }
    });
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
            $("#xjb_remark").html(xjbRemark);
        }
    });

}

function queryTradeInfo(groupId) {
    var url = App.projectNm + "/adviser/get_group_trade_info?groupId="+ groupId +"&tradeTp=P&r=" + (Math.random() * 10000).toFixed(0);

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var tradingInfo = result.body.remark;
            if(App.isNotEmpty(tradingInfo)){
                $(".trading_instructions_remark").html(tradingInfo);
            }
        }
    });
}

$("#purchaseAmt").on("input", function () {
 var contractLength = $(".contract-div").children("p").length;
    var chkCnt = 0;
    $(".contract-div").children("p").each(function(){
    	if($(this).children("span").hasClass("current")){
    		chkCnt+=1;
    	}
    });
    if(Number($("#purchaseAmt").val()) > 0 ){
    	if(contractLength == chkCnt){
	    	$("#btn-submit").css({'background-color':'#fd7e23'});

			App.unbind('#btn-submit', "tap",purchaseCheck);
	    	App.bind('#btn-submit', "tap",purchaseCheck);
    	}else{
	    	App.unbind('#btn-submit', "tap",purchaseCheck);
	    	$("#btn-submit").css({'background-color':'#ddd6d6'});
    	}
    }else{
    	App.unbind('#btn-submit', "tap",purchaseCheck);
    	$("#btn-submit").css({'background-color':'#ddd6d6'});
    }
});

function purchase() {
    if(isShowToBindCard){
        $(".bind_card_tip").show();
        return;
    }
    var purchaseAmt = $("#purchaseAmt").val();
    var transferType = $(".select-transfer-type").attr("data-flag");
    if (App.isEmpty(purchaseAmt)){
        alertTips("投资金额不能为空");
        return;
    }
	if(Number(purchaseAmt) < Number(initLimitAmount)){
        alertTips("金额不能低于最低申购金额");
        return;	
	}


    var purchaseObj = {};
    purchaseObj.groupId = App.getUrlParam("groupId");
    purchaseObj.groupName = groupName;
    purchaseObj.groupType = groupType;
    purchaseObj.amt = purchaseAmt;
    purchaseObj.handleType = "P";
    purchaseObj.tradeTp = "P";
    purchaseObj.shareType = "A";
    purchaseObj.bankNo = sBankNo;
    purchaseObj.bankAcco = sBankAcco;
    purchaseObj.bankName = sBankName;
    purchaseObj.displayCard = sBankDisplayCard;
    purchaseObj.bankSerialId = sBankSerialId;
    purchaseObj.selectedCoupon = selectedCoupon;
    purchaseObj.transferType = transferType;
    purchaseObj.fee = fee;
    if (App.isEmpty(sBankAcco)){
        purchaseObj.purType = "";
        purchaseObj.cashFrm = "V";
        if(Number(balance) < Number(purchaseAmt)){
            $(".recharge_tip").show()
            return;
        }
    } else {
        purchaseObj.purType = "B";
        purchaseObj.cashFrm = "B";
    }
    if(arAcct){
        purchaseObj.arAcct = arAcct;
    }
    // console.log(purchaseObj);
    App.setSession(App.fundGroupObj, purchaseObj);
    var forwardUrl = App.getUrlParam("forwardUrl");
    if(App.isNotEmpty(forwardUrl)){
    	window.location.href = "confirm.html?forwardUrl="+forwardUrl;
    }else{
    	window.location.href = "confirm.html";
	}
}

function alertTips(tips) {
    $(".Bomb-box .Bomb-box-main .Bomb-box-content p").html(tips);
    $(".Bomb-box").show();
}

function queryCard() {
    // var url = App.projectNm + "/account/card?r=" + (Math.random() * 10000).toFixed(0);
    var groupId = App.getUrlParam("groupId");
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=" + groupId + "&tradeType=00&tradeScene=12" ;
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            var payCards = result.body.bankInfos;
            var cards = payCards.filter(function(item){
                return item.bankGrpName != '现金宝';
            });
            if(cards != undefined && cards != null && cards.length > 0){
				cardsCount = cards.length;
                var cardsHtml = "";
                cards.forEach(function (item) {
                    var card = item;
                    var signStyle,signTxt;
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
                    if(true || card.signWay == "7" || card.signWay == "1"){//wap只需支持快捷和招行一网通 20210705全放开
                    cardsHtml += "<li class=\"grid-list-item heigth-130 bottom-border\" onclick=\"selectedCard('"+ item.bankNo +"', '"+ item.bankAcco +"', '"+ item.bankGrpName +"', '"+ item.bankAccoDisplay +"', '"+ item.bankCardSerialid +"')\">\n" +
                        "                <div class=\"row\">\n" +
                        "                    <div class=\"lh-130\">\n" +
                        '   <img src="/mobileEC/images/bank/'+card.bankNo+'.png" class="bank-logo-new"/>                      \n' +
                        "                    </div>\n" +
                        "                    <div class=\"col-1\">\n" +
                        "                        <div class=\"list-title\">\n" +
                        "                            <p class=\"bank-name\">"+ item.bankGrpName +" [ " + item.bankAccoDisplay + " ]</p>\n" +
                        "                            <p class=\"bank-id\">"+ item.limitRemark +"</p>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"lh-130 "+ signStyle +"\">\n" +
                        '            <a class="icon icon-'+ signStyle +'">'+ signTxt +'</a>' +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </li>";
                    }
                });

                $("#bankCardList ul").append(cardsHtml);
                showSmTip();
            } 

            isSetTradePassword();
            
        }
    });
}



function requestGroupFundDetail(groupId){
    App.get("/mobile-bff/v1/fund-group/detailInfo?groupId="  + groupId, null, function(resultStr){

        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
        if(result.body != undefined && result.body != null){
            var detailInfo = result.body;
            if(detailInfo != undefined && detailInfo != ""){
                groupName = detailInfo.groupname;
                groupType = detailInfo.grouptype;
                $(".group-name").html(groupName);
				initLimitAmount = detailInfo.initLimitAmount;
                $("#purchaseAmt").attr("placeholder", App.formatMoney(detailInfo.initLimitAmount) + "元起投");
                queryCouponList(detailInfo.groupid, detailInfo.fundGroupType);
				
				
				var html0 = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead0" class="chose-icon "></span>&nbsp;&nbsp;我已阅读并了解<a href="mip_contract.html?groupId='+groupId+'">各基金产品资料概要</a>&nbsp;</p>'+
				'<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead" class="chose-icon "></span>&nbsp;&nbsp;我已同意<a href="http://static.99fund.com/mobile/agreement/funds_group_agreement.html">《汇添富组合产品服务协议》</a>&nbsp;</p>';

				$(".contract-div").append(html0);
				$("#isRead0").click(function(){
					if(!$("#isRead0").hasClass("current")){
						$("#isRead0").addClass("current")
						var contractLength = $(".contract-div").children("p").length;
						var chkCnt = 0;
						$(".contract-div").children("p").each(function(){
							if($(this).children("span").hasClass("current")){
								chkCnt+=1;
							}
						});
						if(Number($("#purchaseAmt").val()) > 0  && (contractLength == chkCnt)){
							$("#btn-submit").css({'background-color':'#fd7e23'});

							App.unbind('#btn-submit', "tap",purchaseCheck);
							App.bind('#btn-submit', "tap",purchaseCheck);
						}else{
							App.unbind('#btn-submit', "tap",purchaseCheck);
							$("#btn-submit").css({'background-color':'#ddd6d6'});
						}
					}else{
						App.unbind('#btn-submit', "tap",purchaseCheck);
						$("#btn-submit").css({'background-color':'#ddd6d6'});
						$("#isRead0").removeClass("current")
					}
				});
				$("#isRead").click(function(){
					if(!$("#isRead").hasClass("current")){
						$("#isRead").addClass("current")
						var contractLength = $(".contract-div").children("p").length;
						var chkCnt = 0;
						$(".contract-div").children("p").each(function(){
							if($(this).children("span").hasClass("current")){
								chkCnt+=1;
							}
						});
						if(Number($("#purchaseAmt").val()) > 0  && (contractLength == chkCnt)){
							$("#btn-submit").css({'background-color':'#fd7e23'});

							App.unbind('#btn-submit', "tap",purchaseCheck);
							App.bind('#btn-submit', "tap",purchaseCheck);
						}else{
							App.unbind('#btn-submit', "tap",purchaseCheck);
							$("#btn-submit").css({'background-color':'#ddd6d6'});
						}
					}else{
						App.unbind('#btn-submit', "tap",purchaseCheck);
						$("#btn-submit").css({'background-color':'#ddd6d6'});
						$("#isRead").removeClass("current")
					}
				});
            }
        }
    });
}

function selectedCard(bankNo, bankAcco, bankName, displayCard, bankCardSerialid) {
    sBankNo = bankNo;
    sBankAcco = bankAcco;
    sBankName = bankName;
    sBankDisplayCard = displayCard;
    sBankSerialId = bankCardSerialid;
    if (App.isEmpty(bankNo)) {
        $("#payWay").html("现金宝");
    } else {
        $("#payWay").html(bankName + " [ "+ displayCard +" ]");
    }
    if(checkInputAmtOverXJB()){
        // alertTips("购买金额超过现金宝可用余额");
        $('.recharge_tip').show();
    }
}

function queryCouponList(fundGroupId, fundGroupTp) {

    var url = App.projectNm + "/coupon/query_usable_coupon_list?handleTp=4&productTp=" + fundGroupTp + "&productId=" + fundGroupId;

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var list = result.body.list;
            couponTxt = "有" + result.body.list.length + "张礼券可使用";
            $("#my_selected_coupon").html(couponTxt);
            list.push({title: "", couponSerialNo: "", couponDesc: "不使用礼券", fullInfo: {minAmt: 0, maxAmt: 0}});
            couponList = list.sort(compare);
            var couponHtml = "";
            list.forEach(function (item) {
                couponHtml += "<li onclick='selectCoupon(\""+ item.fullInfo.minAmt +"\",\""+ item.fullInfo.maxAmt +"\",\""+ item.couponSerialNo +"\",\""+ item.title +"\")'>" +
                    "               <span class=\"left "+ (App.isEmpty(item.couponSerialNo) ? "red" : "") +"\">"+ item.couponDesc +"</span>" +
                    "               <span class=\"right circle "+ (App.isEmpty(item.couponSerialNo) ? "activeChose" : "leaveChose") +"\"></span>" +
                    "</li>";
            });
            $("#couponList ul").html(couponHtml);
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

function checkInputAmtOverXJB() {
    if(!sBankNo){ // 选择的是现金宝，银行卡不作限制
        var purAmt = Number($("#purchaseAmt").val());
        if(App.isNotEmpty(purAmt) && !isNaN(purAmt)){
            return balance < purAmt;
        }
    }
    return false;
}

function queryFee() {
    var purAmt = $("#purchaseAmt").val();
    if (App.isNotEmpty(purAmt)) {
        if(checkInputAmtOverXJB()){
            // alertTips("购买金额超过现金宝可用余额");
            $('.recharge_tip').show();
            return false;
        }
        var groupId = App.getUrlParam("groupId");
        selectCouponByAmt(purAmt);

        var data = {"subAmt": purAmt, "groupId": groupId, "cashFrm": "V", "purType":"B", "shareType": "A", "bankNo" : sBankNo, "branchCode" : "247"};
        if (App.isEmpty(sBankNo)){
            data.cashFrm = "V";
        } else {
            data.cashFrm = "B";
        }

        // var url = App.projectNm + "/adviser/get_fund_group_fee";
        var url = "/mobile-bff/v1/fund-group/fundgroup-fee";
        App.post(url, JSON.stringify(data), null, function (result) {
            // console.log(result);
            fee = Number(result.body.dispalyFee);
            $("#display_fee").html(result.body.dispalyFee);
            $("#discount_fee").html(result.body.discountFee);
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

function selectCoupon (minAmt,maxAmt,couponSerialNo,title) {
    // console.log(couponInfo);
    var purAmt = $("#purchaseAmt").val();
    if(App.isEmpty(purAmt)){
        alertTips("请先输入金额！");
        return;
    }

    if (Number(purAmt) >= Number(minAmt)
        && (Number(maxAmt) == 0 || Number(purAmt) <= Number(maxAmt))) {
        selectedCoupon = couponSerialNo;
        $("#my_selected_coupon").html(App.isEmpty(title) ? couponTxt : title);

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

$(".close_tip").click(function () {
    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});