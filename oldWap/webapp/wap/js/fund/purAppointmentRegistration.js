$(function () {
    var fundId = App.getUrlParam("fundId");
    var fundName = App.getUrlParam("fundName");
    if(App.isEmpty(fundId) && App.isEmpty(fundName)){
        $(".fundName-li").hide();
    }
    showSmTip();
    queryFundDetail();
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

    $("#continue_pur").on("click", continuePur);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=../fund/purAppointmentRegistration.html?fundId=" + App.getUrlParam("fundId"));

});

var selectedBankNo = '';
var selectedBankAcco = '';
var selectedCoupon = '';
var isSetPwd = 'N';
var currencyType = '156';
var tip = "";
var tipExt = "";

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
        queryCard(_this);
    },
    methods: {
        selectBankCard: function (card) {
            // console.log(card.bankNo+":" + card.bankAcco);
            selectPayWay(card);
        }
    }
});

var riskInfo = {code: '0000', msg: ''};
var balance = '0.00';
var xjbRemark = '';
var openDt = '';

function selectPayWay(card) {

    if (card != undefined && card != null && card.tradeFlag == "1") {
        selectedBankNo = card.bankNo;
        selectedBankAcco = card.bankAcco;
        if(card.bankGrpName.indexOf("现金宝") > -1){
            $("#payWay").html(card.bankGrpName);
        } else {
            $("#payWay").html(card.bankGrpName + " [ " + card.bankAccoDisplay + " ]");
        }
        if(currencyType == "840"){
            $(".remark_tip p").html(tip);
            $(".remark_tip img").show();
        }else {
            $(".remark_tip p").html(card.limitRemark);
            $(".remark_tip img").hide();
        }
    } else {
        selectedBankNo = "";
        selectedBankAcco = "";
        $("#payWay").html("");
    }
}

var fundTp = '0';
var fundSt = '';


function showQuestion() {
    $("#bind_card_tip_1").html(tipExt);
    $(".bind_card_tip_1").show();
    $("#bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
}

function purchase() {
    if($("#payWay").html() == ""){
        $(".bind_card_tip_1").show();
        $("#bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
        return;
    }
    var fundId = App.getUrlParam("fundId");
    if(App.isEmpty(fundId)){
        fundId = '999999';
    }
    var purAmt = $("#purchaseAmt").val();
    var cashFrm = 'V';
    if (App.isNotEmpty(selectedBankNo) || App.isNotEmpty(selectedBankAcco)) {
        cashFrm = 'B';
    }
    if (!App.isNumber(purAmt) || Number(purAmt) <= 0){
        alertTips('金额格式不正确，请重新输入');
        return;
    }
    var curtime = new Date();
    var endtime = new Date(2019,10,8,15);//截止日期2019-11-08 15点
    if (curtime >= endtime){
        alertTips3('温馨提示', '当前预约登记已结束，请自行去现金宝app购买');
        return;
    }
    if (cashFrm == "V" && Number(balance) > Number(purAmt)){
        $(".recharge_tip").show();
        return;
    }
    if (App.isNotEmpty(purAmt)) {
        var url = App.projectNm + "/fund/fund_preorder_purchase";
        var data = {
            "subAmt": purAmt,
            "fundId": fundId,
            "cashFrm": cashFrm,
            "shareType": "A",
            "couponSerialNo": selectedCoupon,
            "status": 'R',
            "preorderDt": '20991231',
            "currencyType": currencyType
        };
        if (cashFrm == 'B'){
            data["bankNo"] = selectedBankNo;
            data["bankAcco"] = selectedBankAcco;
        }

        App.post(url, JSON.stringify(data), null, function (result) {
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);

            App.setSession(App.serialNo_forword_url, "../fund/fundReservationSubSuccessfully.html");

            window.location.href = "../common/setPassword.html";
        });
    }
}

function queryFundDetail() {
    var fundId = App.getUrlParam("fundId");

    if (App.isNotEmpty(fundId)) {
        var url = App.projectNm + "/fund/fund_detail_info?r=" + (Math.random() * 10000).toFixed(0);
        url += "&fundId=" + fundId;
        App.get(url, null, function (result) {
            if (result.body != undefined && result.body != null) {
                // console.log(result);
                var fundInfo = result.body;
                $("#fundNm").html(fundInfo.fundNm);
            }
        });
    } else {
        var fundName = getUrlParamDeCodeURI("fundName");
        if(App.isNotEmpty(fundName)){
            $("#fundNm").html(fundName);
        }
    }

}

function showSmTip() {
    var fundId = App.getUrlParam("fundId");
    var url = App.projectNm + "/common/check_union_risk_level?productId=" + fundId;

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            riskInfo = result.body;
            if (result.body.code == '9990' || result.body.code == '9991' || result.body.code == '9993') {
                $("#evaluation_tip").html(result.body.msg);
                $(".evaluation_risk_tip").show();
            } else if (result.body.code == '9992') {
                $(".sm_tip").show();
                setTimeout(function () {
                    $(".sm_tip").hide()
                }, 2000);
            }
        }
    });
}

$(".btn-orange").click(function () {
    purCheck();
});

function continuePur() {
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }
    purchase();
}

function purCheck() {
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
    purchase();
}

function getUrlParamDeCodeURI(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return "";
}

function queryCard(data) {
    var url = "/mobile-bff/v1/fund/queryBnkCardList?currencyType=" +currencyType + "&r=" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result.body.card);
            tip = result.body.tip;
            tipExt = result.body.tipExt;
            if(currencyType == "840"){
                $(".remark_tip p").html(tip);
                $(".remark_tip img").show();
            }
            data.cards = result.body.bankInfos;
            if(result.body.bankInfos != undefined && result.body.bankInfos != null && result.body.bankInfos.length > 0){
                selectPayWay(data.cards[0]);
            }
        }
    });
}

$(".selectBankCard").click(function () {
    $("#bankCardList").show();
});

// 银行卡,列表
$("#bankCardList").click(function () {
    $("#bankCard").html($(this).find(".bank-name").html()).removeClass("gray");
    $("#bankCardList").hide();
});

$(".close_tip").click(function () {

    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});