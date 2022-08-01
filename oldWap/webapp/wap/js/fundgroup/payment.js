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
    $("#continue_pur").on("click", continuePurchase);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=../fundgroup/payment.html?groupId=" + groupId);
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

function showSmTip() {

}

function continuePurchase() {
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }
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

function queryTips() {
    App.get(App.projectNm + "/adviser/query_transfer_tips?t=" + new Date().getTime(), null, function(result){
        if(result.body != undefined && result.body != null){
            $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(result.body.transferTips);
        }
    });
}

function queryAccount() {
    var url = App.projectNm + "/account/account?r=" + (Math.random() * 10000).toFixed(0);

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

$("#btn-submit").click(function () {
    purchaseCheck();
});

function purchase() {
    if(isShowToBindCard){
        $(".bind_card_tip").show();
        return;
    }
    var purchaseAmt = $("#purchaseAmt").val();
    var transferType = $(".select-transfer-type").attr("data-flag");
    if (App.isEmpty(purchaseAmt)){
        alertTips("每期投资金额不能为空");
        return;
    }
    if(!$("#isAgree").hasClass("current")){
        alertTips("请先阅读《汇添富智能投顾委托协议》");
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
    var url = App.projectNm + "/account/card?r=" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            var cards = result.body.card;
            if(cards != undefined && cards != null && cards.length > 0){
                var cardsHtml = "";
                cards.forEach(function (item) {
                    cardsHtml += "<li class=\"grid-list-item heigth-130 bottom-border\" onclick=\"selectedCard('"+ item.bankNo +"', '"+ item.bankAcco +"', '"+ item.bankGrpName +"', '"+ item.bankAccoDisplay +"')\">\n" +
                        "                <div class=\"row\">\n" +
                        "                    <div class=\"lh-130\">\n" +
                        "                        <i class=\"bank ico_"+ item.bankNo +" no-margin-left\"></i>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"col-1\">\n" +
                        "                        <div class=\"list-title\">\n" +
                        "                            <p class=\"bank-name\">"+ item.bankGrpName +" [ " + item.bankAccoDisplay + " ]</p>\n" +
                        "                            <p class=\"bank-id\">"+ item.limitRemark +"</p>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"lh-130 "+ (item.signWay == "1" ?"shorcut":(item.signWay == "2" ? "union":"E-bank")) +"\">\n" +
                        "                        <a class=\"icon icon-union\">银联通</a>\n" +
                        "                        <a class=\"icon icon-E-bank\">网银</a>\n" +
                        "                        <a class=\"icon icon-shorcut\">快捷</a>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </li>";
                });

                $("#bankCardList ul").append(cardsHtml);
                showSmTip();
            } else {
                if(cards !=undefined && cards != null){
                    cardsCount = cards.length;
                }
                isSetTradePassword();
            }
        }
    });
}

function isSetTradePassword() {

    var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("是否设置过交易密码："+ result.body.isSetPwd + " \n银行卡数量：" + cardsCount);
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }

            if(isSetPwd != "1"){
                isShowToBindCard = true;
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
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

function requestGroupFundDetail(groupId){
    App.get(App.projectNm + "/adviser/query_fundgroup_detail_info?groupId=" + groupId, null, function(result){

        if(result.body != undefined && result.body != null){
            var detailInfo = result.body.detailInfo;
            if(detailInfo != undefined && detailInfo != ""){
                groupName = detailInfo.groupname;
                groupType = detailInfo.grouptype;
                $(".group-name").html(groupName);
                $("#purchaseAmt").attr("placeholder", App.formatMoney(detailInfo.initLimitAmount) + "元起投");
                queryCouponList(detailInfo.groupid, detailInfo.fundGroupType);
            }
        }
    });
}

function selectedCard(bankNo, bankAcco, bankName, displayCard) {
    sBankNo = bankNo;
    sBankAcco = bankAcco;
    sBankName = bankName;
    sBankDisplayCard = displayCard;
    if (App.isEmpty(bankNo)) {
        $("#payWay").html("现金宝");
    } else {
        $("#payWay").html(bankName + " [ "+ displayCard +" ]");
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

function queryFee() {
    var purAmt = $("#purchaseAmt").val();
    if (App.isNotEmpty(purAmt)) {
        var groupId = App.getUrlParam("groupId");
        selectCouponByAmt(purAmt);

        var data = {"subAmt": purAmt, "groupId": groupId, "cashFrm": "V", "purType":"B", "shareType": "A", "bankNo" : sBankNo, "branchCode" : "247"};
        if (App.isEmpty(sBankNo)){
            data.cashFrm = "V";
        } else {
            data.cashFrm = "B";
        }

        var url = App.projectNm + "/adviser/get_fund_group_fee";
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