$(function () {
    var groupId = App.getUrlParam("groupId");
    mip.groupId = groupId;
    requestGroupFundDetail(groupId);
    queryAccount();
    queryCard(function () {
        initCardList();
    });
    $("#continue_pur").on("click", continueMip);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=" + encodeURIComponent(location.href));
});
var cardsCount = 0;
var balance = '0.00';
var minMipbuyAmt = 0 ;
var xjbRemark = '';
var isShowToBindCard = false;
var riskInfo = {code: '0000', msg: ''};
var mip = {
    "mipKind":"0",
    "cashFrm":"V",
    "shareType":"A",
    "mipcycle":"MM",
    "mipbuyday":"1",
    "transferType":"M",
    "mipBuyAmt":0,
    "groupName" : "",
    "groupType" : "",
    "fee" : 0
};
function requestGroupFundDetail(groupId){
    App.get("/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId, null, function(resultStr){
        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;

        if(result.body != undefined && result.body != null){
            var detailInfo = result.body;
            if(detailInfo != undefined && detailInfo != ""){
                mip.groupName = detailInfo.groupname;
                mip.groupType = detailInfo.grouptype;
                $(".group-name").html(mip.groupName);
                if(App.isEmpty(detailInfo.initLimitAmount)){
                    minMipbuyAmt = 0;
                    var txt = "0.00元起";
                    $("#mipAmt").attr("placeholder", "0.00元起");
                } else {
                    minMipbuyAmt = Number(detailInfo.initLimitAmount);
                    var txt = detailInfo.initLimitAmount + "元起";
                    $("#mipAmt").attr("placeholder", detailInfo.initLimitAmount + "元起");
                }
            }
        }
    });
}
$("#mipAmt").on("keyup", function () {
    var mipAmt = $(this).val();
    if(App.isNotEmpty(mipAmt)){
        mip.mipBuyAmt = Number(mipAmt);
        $("#btn_next_step").removeClass("btn-orange-disabled").addClass("btn-orange-enabled");
        $("#btn_next_step").removeAttr("disabled");
        var groupId = App.getUrlParam("groupId");
        queryFee(groupId);
    } else {
        $("#btn_next_step").removeClass("btn-orange-enabled").addClass("btn-orange-disabled");
        $("#btn_next_step").attr("disabled","disabled");
    }
});

function queryFee(groupId) {
    var purAmt = mip.mipBuyAmt;
    if (App.isNotEmpty(purAmt)) {

        var url = "/fundgroup/v1/fund-group/fund-group-fee";
        var data = {"subAmt": purAmt, "groupId": groupId, "purType": "B", "cashFrm": "V", "shareType": "A", "bankNo": ""};

        if(App.isNotEmpty(mip.bankNo)){
            data.cashFrm = "B";
            data.bankNo = mip.bankNo;
        }

        App.post(url, JSON.stringify(data), null, function (result) {
            // console.log(result);
            mip.fee = Number(result.body.dispalyFee);
            $("#display_fee").html(result.body.dispalyFee);
            $("#discount_fee").html(result.body.discountFee);
            $("#fee_view").show();
        });
    }
}
$("#btn_next_step").click(function () {
    mipCheck();
});

function nextStep() {
    if(isShowToBindCard){
        $(".bind_card_tip").show();
        return;
    }
    if(!$("#isAgree").hasClass("current")){
        alertTips("请先阅读《汇添富智能投顾委托协议》");
        return;
    }
    if(mip.mipBuyAmt < minMipbuyAmt){
        alertTips("定投金额不得少于"+ App.formatMoney(minMipbuyAmt) +"元");
        return;
    }
    var groupId = App.getUrlParam("groupId");
    mip.groupId = groupId;
    var deductionCycleFlag = $("#setting_deduction_cycle").attr("data-flag");
    mip.isSupportPeriod = deductionCycleFlag;
    if(deductionCycleFlag == "1"){
        var deductionCycleTypeFlag = $(".selected_deduction_cycle_type").attr("data-flag");
        mip.periodNumber = Number(deductionCycleTypeFlag);
        if (deductionCycleTypeFlag == "0"){
            var periodNumber = $("#periodNumber").val();
            if(App.isEmpty(periodNumber)){
                alertTips("自定义期数不能为空");
                return;
            }
            mip.periodNumber = periodNumber;
        }
    }
    // console.log(mip);
    var purchaseObj = {};
    purchaseObj.groupId = mip.groupId;
    purchaseObj.groupName = mip.groupName;
    purchaseObj.groupType = mip.groupType;
    purchaseObj.amt = mip.mipBuyAmt;
    purchaseObj.handleType = "M";
    purchaseObj.tradeTp = "P";
    purchaseObj.shareType = "A";
    purchaseObj.transferType = mip.transferType;
    purchaseObj.fee = mip.fee;
    purchaseObj.isSupportPeriod = mip.isSupportPeriod;
    if (mip.isSupportPeriod == "1"){

    }
    purchaseObj.periodNumber = mip.periodNumber;
    purchaseObj.mipcycle = mip.mipcycle;
    purchaseObj.mipbuyday = mip.mipbuyday;
    if (App.isEmpty(mip.bankNo)){
        purchaseObj.purType = "";
        purchaseObj.cashFrm = "V";
    } else {
        purchaseObj.purType = "B";
        purchaseObj.cashFrm = "B";
        purchaseObj.bankNo = mip.bankNo;
        purchaseObj.bankAcco = mip.bankAcco;
        purchaseObj.bankName = mip.bankName;
        purchaseObj.displayCard = mip.bankDisplayCard;
    }
    // console.log(purchaseObj);
    App.setSession(App.fundGroupObj, purchaseObj);
    window.location.href = "confirm.html";
}

function queryAccount() {
    // var url = App.projectNm + "/account/account?r=" + (Math.random() * 10000).toFixed(0);
    var url = "/smac/v1/asset/balance-with-smac"

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            balance = result.body.balance;
            xjbRemark = "现金宝可用余额" + App.formatMoney(balance + '') + "元";
            $(".remark_tip").html(xjbRemark);
            $("#xjb_remark").html(xjbRemark);
        }
    });
}

function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
    var groupId = App.getUrlParam("groupId");
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=" + groupId + "&tradeType=05&tradeScene=12" ;
	App.get(url, null, function (result) {
		var payCards = result.body.bankInfos;
		var cards = payCards.filter(function(item){
			return item.bankGrpName != '现金宝';
		});
		App.setSession(App.cards, cards);
		if(App.isFunction(successFun)){
			eval(successFun).call(this);
		}
	});
}

function initCardList(){
    var cards = App.getSession(App.cards);

    var cardsHtml = "";
    if(cards != undefined && cards != null && cards.length > 0) {
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
function isSetTradePassword() {

    // var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);
    var url = "/mobile-bff/v1/account/has-set-trade-pwd";

    App.post(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("是否设置过交易密码："+ result.body.isSetPwd + " \n银行卡数量：" + cardsCount);
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }

            if(isSetPwd != "1"){
                isShowToBindCard = true;
                $("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
                $("#go_to_bind_card").html("去设置");
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

function selectedCard(bankNo, bankAcco, bankName, displayCard) {
    mip.bankNo = bankNo;
    mip.bankAcco = bankAcco;
    mip.bankName = bankName;
    mip.bankDisplayCard = displayCard;
    if (App.isEmpty(bankNo)) {
        $("#payWay").html("现金宝");
        mip.cashFrm = "V";
    } else {
        $("#payWay").html(bankName + " [ "+ displayCard +" ]");
        mip.cashFrm = "B";
    }
}

//勾选
$(".rules").click(function () {
    $(".chose-icon").toggleClass("current");
});

//开关
$('.setting_deduction_cycle_on_off').on('click',function(){
    // console.log($("#setting_target_rate").attr("data-flag"));
    var setting_deduction_cycle = $("#setting_deduction_cycle").attr("data-flag");
    if (setting_deduction_cycle == "0") {
        $("#setting_deduction_cycle").attr("data-flag", 1);
        $(".deduction_cycle_type").show();
    } else {
        $("#setting_deduction_cycle").attr("data-flag", 0);
        $(".deduction_cycle_type").hide();
    }
    if(  $(this).children('img').attr('src')=='../images/fundgroup/off.png'){
        $(this).children('img').attr('src','../images/fundgroup/on.png')
    }else{
        $(this).children('img').attr('src','../images/fundgroup/off.png')

    }
});
$(".selected_deduction_cycle_type").click(function () {
    $(".deduction_cycle_type_list").show();
});

$(".deduction_cycle_type_list").click(function(event) {
    var li = $(event.target).parents("li");
    var attr = li.attr("data-cycle-type");
    var text = li.find("div").text();
    if (li.length == 0) {
        $(".deduction_cycle_type_list").hide();
        return
    };
    if (!li.hasClass("on")) {
        li.addClass("on").siblings("li").removeClass("on");

    };
    if(attr == "0"){
        $(".deduction_cycle_num").show();
    } else {
        $(".deduction_cycle_num").hide();
        var deductionCycleFlag = $("#setting_deduction_cycle").attr("data-flag");
        if(deductionCycleFlag == "1"){
            mip.periodNumber = attr;
        }
    }
    $(".deduction_cycle_type_list").hide();
    $(".selected_deduction_cycle_type").html(text);
    $(".selected_deduction_cycle_type").attr("data-flag", attr);
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
var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": []
};
$(".selected-deduction-cycle").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $(".appDate").blur();
    return false
});
$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    setMipCycle(li.attr("data-choose-time"));
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    var time = chooseTime[li.attr("data-choose-time")],
        str = "";
    if(time.length == 0){
        $(".choose-time").hide();
        $(".appDate").attr("data-time", li.find("div").text());
        $(".appDate").html(li.find("div").text());
        delete mip.mipbuyday;
        return;
    }
    if (!li.hasClass("on")) {
        li.addClass("on").siblings("li").removeClass("on");
        for (var i = 0; i < time.length; i++) {
            str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
        };
        $(".choose-time2 ul").html(str);
        $(".appDate").attr("data-time", li.find("div").text())
    };
    $(".choose-time").hide();
    $(".choose-time2").show()
});
$(".choose-time2").click(function() {
    var li = $(event.target).parents("li");
    setMipBuyday(li.attr("data-choose-time"));
    if (li.length == 0) {
        return
    };
    $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
    queryAutoRechargePageInfo();
    $(this).hide()
});
function getMipCycle() {
    return mip.mipcycle;
};
function setMipCycle(mipCycle) {
    mip.mipcycle = mipCycle;
};
function getMipBuyday() {
    return mip.mipbuyday;
};
function setMipBuyday(mipBuyday) {
    mip.mipbuyday = mipBuyday;
};
function queryAutoRechargePageInfo() {
    // var url = App.projectNm + "/fund/query_fund_mip_last_period_dt?date=" + (new Date()).getTime() + "&mipCycle=" + getMipCycle();
	var url = "/mobile-bff/v1/fund/fund-mip-last-period-date?date=" + (new Date()).getTime() + "&mipCycle=" + getMipCycle();

    var mipBuyday = getMipBuyday();
    if (mipBuyday != undefined && mipBuyday != null){
        url += "&mipDt=" + mipBuyday;
    }

    App.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {
            $("#kkDate").html("下次扣款日期：<span style=\"color: #f66\">" + body.nextMipDate + '</span>，遇非交易日顺延');
        }
    });
}
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

function continueMip() {
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        $("#continue_pur").off('click');
        $("#continue_pur").on("click", nextStep);
        return;
    }
    nextStep();
}

function mipCheck() {
    if (riskInfo.code != '0000') {
        if (riskInfo.code == '9990' || riskInfo.code == '9991' || riskInfo.code == '9993') {
            $("#evaluation_tip").html(riskInfo.msg);
            $(".evaluation_risk_tip").show();
            return false;
        } else if (riskInfo.code == '9992' && App.isNotEmpty(riskInfo.subMsg)) {
            $("#risk_tip").html(riskInfo.subMsg);
            $(".tip").show();
            return false;
        }
    }
    nextStep();
}
$(".close_tip").click(function () {

    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});