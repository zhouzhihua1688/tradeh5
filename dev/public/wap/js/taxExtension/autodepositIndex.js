$(function(){
    fundId = App.getUrlParam("fundId");
    fundSelected(fundId);
    queryAvailableFundList(fundId);
    queryYLInfo();

    $("#mipNm").attr("placeholder", getMipName());
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=" + encodeURIComponent(location.href));
    $("#go_to_recharge").attr("href", "../account/topup.html?forwardUrl=../taxExtension/autodepositIndex.html?fundId=" + fundId);
});
var fundId;
var sBankNo;
var sBankAcco;
var sBankName;
var sBankDisplayCard;
var sCashFrom;
var currencyType = '156';
var balance = 0;
var fundTp = '';
var commitData = {};
var nextMipDate;
var taxPurchaseNowSupport = true;
var sumFee = 0;
var sumDiscountFee = 0;

function fundSelected(selectedId) {
    if(App.isNotEmpty(selectedId)){
        fundId = selectedId;
        showSmTip();
        queryAGSInfo();
        queryPurchaseInfo();
    }
}

function queryAvailableFundList(productId){
    var data = {
        'condition':{'funcType': ['taxPension']},
        'sortInfos':[{'orderFiled':'dailyGrowthRate','orderType':'DESC'}],
        'branchCode':'247',
        'pageNo':'1',
        'rows':'20'};
    App.post("/ess/v1/fund/fund-filter-new", JSON.stringify(data), null, function (result) {
    // var result = {"returnCode":0,"returnMsg":"","body":{"errcode":"0000","errmsg":" success ","itemSum":"3","fundAllInfos":[{"fundId":"666667","fundName":"汇添富养老2030三年持有混合（FOF）","nav":1,"dailyGrowthRate":0,"monthlyReturn":-41.1072,"quarterReturn":0,"halfYearReturn":null,"yearReturn":null,"fromYearReturn":0,"fromBuildReturn":0,"fundIncomeUnit":null,"yield":null,"fundState":"6","fundType":"F","fundRiskLevel":"2","establishDate":"20181213","nvTotal":0,"createDateTime":"2019-05-20 17:20:09,863","tags":["666666","666669","customizedList","taxExtendedPension","taxExtendedPensionTransfer","白马龙头","基金评级","五星基金","重仓持股"],"tagsShow":["白马龙头","五星基金"],"managers":[],"currencyType":"156","displayNav":"1.0000","specialImgUrl":null,"issueDateTime":{"nano":0,"hour":15,"minute":0,"second":0,"year":2018,"month":"NOVEMBER","dayOfMonth":1,"dayOfWeek":"THURSDAY","dayOfYear":305,"monthValue":11,"chronology":{"calendarType":"iso8601","id":"ISO"}},"dsSubEndDateTime":{"nano":0,"hour":15,"minute":0,"second":0,"year":2018,"month":"DECEMBER","dayOfMonth":12,"dayOfWeek":"WEDNESDAY","dayOfYear":346,"monthValue":12,"chronology":{"calendarType":"iso8601","id":"ISO"}},"isTop":"0","isTaxExtendPension":"Y","onSaleFlag":"1","navDate":null},{"fundId":"666668","fundName":"养老2号","nav":1,"dailyGrowthRate":0,"monthlyReturn":37.1742,"quarterReturn":0,"halfYearReturn":null,"yearReturn":null,"fromYearReturn":0,"fromBuildReturn":0,"fundIncomeUnit":null,"yield":null,"fundState":"6","fundType":"F","fundRiskLevel":"2","establishDate":"20181213","nvTotal":0,"createDateTime":"2019-05-20 17:20:09,911","tags":["666666","666669","customizedList","taxExtendedPensionOnly","taxExtendedPensionTransfer"],"tagsShow":[],"managers":[],"currencyType":"156","displayNav":"1.0000","specialImgUrl":null,"issueDateTime":{"nano":0,"hour":15,"minute":0,"second":0,"year":2018,"month":"NOVEMBER","dayOfMonth":1,"dayOfWeek":"THURSDAY","dayOfYear":305,"monthValue":11,"chronology":{"calendarType":"iso8601","id":"ISO"}},"dsSubEndDateTime":{"nano":0,"hour":15,"minute":0,"second":0,"year":2018,"month":"DECEMBER","dayOfMonth":12,"dayOfWeek":"WEDNESDAY","dayOfYear":346,"monthValue":12,"chronology":{"calendarType":"iso8601","id":"ISO"}},"isTop":"0","isTaxExtendPension":"Y","onSaleFlag":"1","navDate":null},{"fundId":"006763","fundName":"养老3号","nav":1,"dailyGrowthRate":0,"monthlyReturn":0,"quarterReturn":25,"halfYearReturn":null,"yearReturn":null,"fromYearReturn":25,"fromBuildReturn":0,"fundIncomeUnit":null,"yield":null,"fundState":"0","fundType":"F","fundRiskLevel":"2","establishDate":"20181217","nvTotal":0,"createDateTime":"2019-05-20 17:20:03,876","tags":["customizedList","taxExtendedPension"],"tagsShow":[],"managers":[],"currencyType":"156","displayNav":"1.0000","specialImgUrl":null,"issueDateTime":{"nano":0,"hour":15,"minute":0,"second":0,"year":2018,"month":"NOVEMBER","dayOfMonth":1,"dayOfWeek":"THURSDAY","dayOfYear":305,"monthValue":11,"chronology":{"calendarType":"iso8601","id":"ISO"}},"dsSubEndDateTime":{"nano":0,"hour":15,"minute":0,"second":0,"year":2018,"month":"DECEMBER","dayOfMonth":14,"dayOfWeek":"FRIDAY","dayOfYear":348,"monthValue":12,"chronology":{"calendarType":"iso8601","id":"ISO"}},"isTop":"0","isTaxExtendPension":"Y","onSaleFlag":"1","navDate":null}]}};
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var info = result.body;
            if(App.isNotNull(info)){
                fundList = info.fundAllInfos;
                if(App.isNotNull(fundList)){
                    var listHtml = '';
                    fundList.forEach(function (item, index) {
                        if(item.fundId == productId || index == 0){
                            fundId = item.fundId;
                        }
                        listHtml += '<li data-fundId="'+ item.fundId +'" style="border-bottom:1px solid #eeeeee;height:3.5rem!important;line-height:3.5rem!important">' +
                                    '        <div class="left"  style="color:#000;line-height:1rem;width:60%">' +
                                    '        <div class="double" style="margin-top:0.5rem">'+ App.subString(item.fundName, 12, '...') +'</div>' +
                                    '        <div class="double" style="font-size:0.55rem;margin-top:0.5rem">费率:' +
                                    '            <span style="text-decoration:line-through;margin-right: 0.25rem" class="rate">0.00%</span>' +
                                                '<span style="color:#f4333c" class="uRate">0.00%</span><span class="feeTxt"></span>' +
                                    '        </div>' +
                                    '    </div>' +
                                    '    <span class="center fund-amt" style="color:#000;width:20%">0.00</span>' +
                                    '    <span style="float:right;margin-top:0rem!important;">' +
                                    (item.fundId == productId || index == 0 ? getSelect(100) : getSelect(0)) +
                                    '    </span>' +
                                    '</li>';
                    });

                    queryCard("156");

                    $(".productList ul").append(listHtml);
                    $(".select-ratio").change(function () {
                        selectRatio();
                    });
                }
            }
        }
    });
}
function selectRatio() {
    var amt = $("#purchaseAmt").val();
    if(App.isNumber(amt)){
        queryFee();
    } else {
        alertTips("请输入正确的金额");
        $(".product-panel").hide();
        $(".mask").hide();
    }
}

function getSelect(val){
    var select =
        '<select class="select-ratio">\n' +
        '    <option value="100" '+ (val == 100 ? 'selected' : '') +'>100%</option>\n' +
        '    <option value="95" '+ (val == 95 ? 'selected' : '') +'>95%</option>\n' +
        '    <option value="90" '+ (val == 90 ? 'selected' : '') +'>90%</option>\n' +
        '    <option value="85" '+ (val == 85 ? 'selected' : '') +'>85%</option>\n' +
        '    <option value="80" '+ (val == 80 ? 'selected' : '') +'>80%</option>\n' +
        '    <option value="75" '+ (val == 75 ? 'selected' : '') +'>75%</option>\n' +
        '    <option value="70" '+ (val == 70 ? 'selected' : '') +'>70%</option>\n' +
        '    <option value="65" '+ (val == 65 ? 'selected' : '') +'>65%</option>\n' +
        '    <option value="60" '+ (val == 60 ? 'selected' : '') +'>60%</option>\n' +
        '    <option value="55" '+ (val == 55 ? 'selected' : '') +'>55%</option>\n' +
        '    <option value="50" '+ (val == 50 ? 'selected' : '') +'>50%</option>\n' +
        '    <option value="45" '+ (val == 45 ? 'selected' : '') +'>45%</option>\n' +
        '    <option value="40" '+ (val == 40 ? 'selected' : '') +'>40%</option>\n' +
        '    <option value="35" '+ (val == 35 ? 'selected' : '') +'>35%</option>\n' +
        '    <option value="30" '+ (val == 30 ? 'selected' : '') +'>30%</option>\n' +
        '    <option value="25" '+ (val == 25 ? 'selected' : '') +'>25%</option>\n' +
        '    <option value="20" '+ (val == 20 ? 'selected' : '') +'>20%</option>\n' +
        '    <option value="15" '+ (val == 15 ? 'selected' : '') +'>15%</option>\n' +
        '    <option value="10" '+ (val == 10 ? 'selected' : '') +'>10%</option>\n' +
        '    <option value="5" '+ (val == 5 ? 'selected' : '') +'>5%</option>\n' +
        '    <option value="0" '+ (val == 0 ? 'selected' : '') +'>0%</option>\n' +
        '</select>';
    return select;
}

function queryAGSInfo() {
    App.getDoNotProcessResult("/ags/v1/funds/query-info?tradeType=0&fundId=" + fundId, null, function (result) {
        // console.log(result);
        $("#available-amount").html('0.00 元');
        $("#available-amount").attr("data-available-amt", 0);
        if(result.returnCode == 0) {
            if (result.body != undefined && result.body != null) {
                var info = result.body;
                if (App.isNotEmpty(info.availableAmount)) {
                    $("#available-amount").html(App.formatMoney(info.availableAmount) + ' 元');
                    $("#available-amount").attr("data-available-amt", info.availableAmount);
                }
                if (App.isNotEmpty(info.availableAmountTips)) {
                    $("#btn-problem-1").click(function () {
                        alertTips('<div style="line-height: 1.5;">' + info.availableAmountTips + '</div>', '确定');
                    });
                }
            }
        }
    });
}
function queryCard(currencyTp) {
    //当前wap只有基金申购，tradeType=00表示申购，后续有其他基金交易时，需要修改tradeType
    var url = "/mobile-bff/v1/fund/queryBnkCardList?currencyType=" + currencyTp + "&fundId=" + fundId + "&tradeType=00" + "&r=" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function (result) {
            // var result = {"body":{"tip":"","tipExt":"","bankInfos":[{"adLimit":"0","bankAcco":"6228487455655264154","bankAccoDisplay":"尾号4154","bankFlag":"N","bankGrpName":"农业银行","bankName":"农行快易付","bankNo":"603","bgrp":"A07","branchNm":"","branchNo":"","cashBalance":17109.51,"certNum":"44010119940101015X","color":"7","dayThreashHold":5000000,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"450731.30","limitRemark":"单笔、日累计500万","mainFlg":"N","mobileNo":"","promotionBtnTxt":"","promotionFlag":"","promotionUrl":"","protocolNo":"6228487455655264154","realLimit":"17109.51","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔、日累计500万","restLimit":"0","signWay":"1","singleThreashHold":5000000,"tradeFlag":"1"},{"adLimit":"0","bankAcco":"6214831646546456","bankAccoDisplay":"尾号6456","bankFlag":"N","bankGrpName":"招商银行","bankName":"招行快易付","bankNo":"607","bgrp":"A13","branchNm":"","branchNo":"","cashBalance":17109.51,"certNum":"44010119940101015X","color":"4","dayThreashHold":9.0E8,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"484918.29","limitRemark":"单笔1亿、日累计9亿","mainFlg":"Y","mobileNo":"","promotionBtnTxt":"如何提额？","promotionFlag":"1","promotionUrl":"app_inner/CMB-romote/index.html","protocolNo":"CM201806111758625956","realLimit":"17109.51","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔1亿、日累计9亿","restLimit":"0","signWay":"1","singleThreashHold":1.0E8,"tradeFlag":"1"},{"adLimit":"0","bankAcco":"6222022565855888526","bankAccoDisplay":"尾号8526","bankFlag":"N","bankGrpName":"工商银行","bankName":"工行快易付","bankNo":"202","bgrp":"A01","branchNm":"","branchNo":"","cashBalance":17109.51,"certNum":"44010119940101015X","color":"4","dayThreashHold":1.0E10,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"436553.29","limitRemark":"单笔10亿、日累计100亿","mainFlg":"N","mobileNo":"","promotionBtnTxt":"","promotionFlag":"","promotionUrl":"","protocolNo":"2019040918444105","realLimit":"17109.51","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔10亿、日累计100亿","restLimit":"0","signWay":"1","singleThreashHold":1.0E9,"tradeFlag":"1"}]},"returnCode":0,"returnMsg":"","successMsg":""};
        if (result.body != undefined && result.body != null) {
            // alert("银行卡数量："+ result.body.card.length);
            // data.cards = result.body.card;
            tip = result.body.tip;
            tipExt = result.body.tipExt;
            var cards = result.body.bankInfos;
            var cardsHtml = "";
            if(cards != undefined && cards != null && cards.length > 0){
                cards.forEach(function (item, index) {
                    if(item.cashFrom != 'F'){
                        if (index == 0){
                            selectedCard(item.bankNo, item.bankAcco, item.bankGrpName, item.bankAccoDisplay, item.cashFrom, item.availablePayBalance, item.limitRemark);
                        }
                        cardsHtml += '<li class="grid-list-item heigth-130 bottom-border"' +
                            ' onclick="selectedCard(\''+ item.bankNo +'\', \''
                            + item.bankAcco +'\', \''
                            + item.bankGrpName +'\', \''
                            + item.bankAccoDisplay +'\',\''
                            + item.cashFrom +'\',\''
                            + item.availablePayBalance + '\',\''
                            + item.limitRemark +'\')">\n' +
                            '            <div class="row">\n' +
                            (App.isEmpty(item.bankNo) ?
                                '<div class="lh-130"><img src="../images/fund/icon_05.png" alt="" style="width: 1rem; height: 1rem; margin-left: 0.3rem; margin-right: 17px;"></div>'
                                :
                                '                <div class="lh-130">\n' +
                                '                    <i class="bank ico_'+ item.bankNo +' no-margin-left"></i>\n' +
                                '                </div>\n')
                            +
                            '                <div class="col-1">\n' +
                            '                    <div class="list-title">\n' +
                            (App.isEmpty(item.bankAccoDisplay) ?
                                '                        <p class="bank-name">'+ item.bankGrpName + ' </p>\n'
                                :
                                '                        <p class="bank-name">'+ item.bankGrpName +' [ ' + item.bankAccoDisplay + ' ]</p>\n')
                            +
                            '                        <p class="bank-id">'+ item.limitRemark +'</p>\n' +
                            '                    </div>\n' +
                            '                </div>\n'
                            +
                            (App.isEmpty(item.signWay) ? '' :
                                '                <div class="lh-130 '+ (item.signWay == "1" ?"shorcut":(item.signWay == "2" ? "union":"E-bank")) +'">\n' +
                                '                    <a class="icon icon-union">银联通</a>\n' +
                                '                    <a class="icon icon-E-bank">网银</a>\n' +
                                '                    <a class="icon icon-shorcut">快捷</a>\n' +
                                '                </div>\n' +
                                '            </div>\n')
                            +
                            '        </li>';
                    }
                });

                $("#bankCardList ul").html(cardsHtml);
            }else {
                if(cards !=undefined && cards != null){
                    cardsCount = cards.length;
                }
                isSetTradePassword();
            }

        }
    }, false);
}
function selectedCard(bankNo, bankAcco, bankName, displayCard, cashFrom, availablePayBalance, limitRemark) {
    sBankNo = bankNo;
    sBankAcco = bankAcco;
    sBankName = bankName;
    sBankDisplayCard = displayCard;
    sCashFrom = cashFrom;
    if (bankNo == 'null' || bankNo == null) {
        $("#payWay").html(sBankName);
        balance = availablePayBalance;
    } else if(displayCard == 'null' || App.isEmpty(displayCard)){
        $("#payWay").html(bankName);
    } else {
        $("#payWay").html(bankName + " [ "+ displayCard +" ]");
    }
    if(limitRemark != 'null' && App.isNotEmpty(limitRemark)){
        $(".xjb-usable").html(limitRemark);
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
            	$("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
            	$("#go_to_bind_card").html("去设置");
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }else if(cardsCount == 0){
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }
        }
    });
}

function queryYLInfo() {
    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            if (result.body.isOpenPITD == 'Y'){
                var pitdInvestAcct = result.body.pitdInvestAcct;
                if (App.isNotNull(pitdInvestAcct)){
                    $("#purType").html(pitdInvestAcct.investAcct);
                }
            }
        }
    });
}
function queryPurchaseInfo() {
    var mipCycle = "MM";
    var mipBuyDay = $(".appDate").attr("data-time");
    var data = {
        "agreementId":"20,21",
        "cycle": mipCycle,
        "fundId": fundId,
        "operaType": "0",
        "payDate": mipBuyDay,
        "tradeType": "0",
        "contractOperType": "0"
    };
    if(App.isNotEmpty(fundId)){
        App.post("/mobile-bff/v1/fund-pension/trade/purchase-info", JSON.stringify(data), null, function (result) {
            if (result.body != undefined && result.body != null) {
                // console.log(result);
                var info = result.body;
                $("#purchaseTip").html(info.taxPurchaseTip);
                $(".deposit-next-date-txt").html(App.formatDateStr(info.nextMipDate));
                nextMipDate = info.nextMipDate;
                taxPurchaseNowSupport = info.taxPurchaseNowSupport;
                if(info.taxPurchaseNowSupport) {
                    $(".available-amount-panel").show();
                } else {
                    $(".available-amount-panel").hide();
                }
            }
        });
    }
}

function queryFee() {
    var purAmt = $("#purchaseAmt").val();
    var payWay = $("#payWay").html();
    if (App.isNotEmpty(purAmt) && fundTp != '1' && App.isNotEmpty(payWay)) {
        sumFee = 0;
        sumDiscountFee = 0;

        $(".productList ul").find("li").each(function(index, item){
            var ratio = $(item).find("select").val() / 100;
            var tempAmt = purAmt * ratio;
            $(item).find(".fund-amt").html(App.formatMoney(tempAmt, 2));
            $(item).attr("data-amt", tempAmt);
            var fundId = $(item).attr("data-fundId");
            // var url = App.projectNm + "/fund/fund_fee";
            // var data = {"subAmt": tempAmt, "fundId": fundId, "cashFrm": "V", "shareType": "A", "bankNo": ""};
            var url = "/mobile-bff/v1/fund/fund-fee?subAmt="+ tempAmt + "&fundId="+ fundId + "&cashFrm=V&bankNo=''&shareType=A"

            utils.get(url, null, function (result) {
                $(item).find(".rate").html(result.body.rate);
                $(item).find(".uRate").html(result.body.uRate);
                $(item).find(".feeTxt").html('('+ result.body.feeStr +'元 省了'+ result.body.discountFee +'元)');
                sumFee += Number(result.body.fee);
                sumDiscountFee += Number(result.body.discountFee.replace(/,/g, ''));
                $("#sumFee").html(App.formatMoney(sumFee, 2));
                $("#sumDiscountFee").html(App.formatMoney(sumDiscountFee, 2));
            });
        });
    }
}

var riskInfo = {code: '0000', msg: ''};

function showSmTip() {
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
        }
    });
}

function getMipName(){
    return "税延养老投资计划" + new Date().format("yyyyMMdd");
}

function getData() {
    var purAmt = $("#purchaseAmt").val();
    var mipName = $("#mipNm").val();
    if(App.isEmpty(mipName)){
        mipName = getMipName();
    }
    $(".mip-name").html(mipName);
    var date = $(".appDate").attr("data-time");
    if(App.isEmpty(purAmt)) {
        alertTips('<div style="line-height: 1.5;">购买金额不能为空</div>');
        return;
    }
    /*if(taxPurchaseNowSupport){
        var availableAmount = $("#available-amount").attr("data-available-amt");
        if(Number(purAmt) > Number(availableAmount)){
            alertTips('<div style="line-height: 1.5;">当前剩余税延余额不足。</div>');
            return;
        }
    }*/
    var cashFrm = 'V';
    var channel = App.getCookie("channel");
    if (App.isNotEmpty(sCashFrom)){
        cashFrm = sCashFrom;
    }

    if (cashFrm == "V" && Number(balance) < Number(purAmt)){
        $(".recharge_tip").show();
        return;
    }
    var funds = [];
    var temp = 0;
    $(".productList ul").find("li").each(function(index, item){
        var ratio = $(item).find("select").val() / 100;
        temp += Number(ratio);
        if(ratio > 0){
            var obj = {'shareType':'A','cashFrom':cashFrm,'currencyType':currencyType,'isFullAmt':'0'};
            obj.bankNo = App.isNull(sBankNo) ? '' : sBankNo;
            obj.bankAcco = App.isNull(sBankAcco) ? '' : sBankAcco;
            obj.fundId = $(item).attr("data-fundId");
            obj.mipBuyAmt = purAmt * ratio;
            funds.push(obj);
        }
    });
    if(temp > 1){
        alertTips("配比不能超过100%");
        return;
    } else if(temp < 1){
        alertTips("配比不能低于100%");
        return;
    }
    if(App.isNull(funds) || funds.length == 0){
        alertTips('<div style="line-height: 1.5;">请先选择一只产品</div>');
        return;
    }

    var data = {
        "mipName": mipName,
        "mipCycle": "MM",
        "mipBuyDay": date,
        "taxPensionBatchAutoPurFunds": funds
    };
    if (App.isNotEmpty(channel)){
        data["channel"] = channel;
    }
    return data;
}

$("#purchaseAmt").on("keyup", queryFee);

$("#btn-submit").click(function () {
    purchaseCheck();
});
$(".confirm-mip-btn").click(function () {
    if(commitData.mipCycle == 'SS'){
        $(".deposit-next-date").hide();
        $(".deposit-date").html(App.formatDateStr(nextMipDate));
    }else {
        $(".deposit-next-date").show();
        $(".deposit-date").html('每月' + (Number(commitData.mipBuyDay) < 10 ? '0'+commitData.mipBuyDay : commitData.mipBuyDay) + '日');
    }
    if(commitData.isFullAmt == '1'){
        $(".is-full-amt").html('自动足额购买');
    }else {
        $(".is-full-amt").html(App.formatMoney(commitData.mipBuyAmt) + '元');
    }
    $(".tip3").hide();
    $(".confirm_deposit_info").show();
});
$("#continue_pur").click(function () {
    continuePurchase();
});
$(".confirm-btn").click(function () {
    purchase();
});
function purchaseCheck() {
    if(!valide()){
        return;
    }
    if(!$(".chose-icon").hasClass("current")){
        alertTips('<div style="line-height: 1.5;">请先阅读风险揭示书</div>');
        return;
    }
    if (riskInfo.code != '0000') {
        if (riskInfo.code == '9990' || riskInfo.code == '9991' || riskInfo.code == '9993') {
            $("#evaluation_tip").html(riskInfo.msg);
            $(".evaluation_risk_tip").show();
            return;
        } else if (riskInfo.code == '9992' && App.isNotEmpty(riskInfo.subMsg)) {
            $("#risk_tip").html(riskInfo.subMsg);
            $(".risk_confirm_tip").show();
            return;
        }
    }
    commitData = getData();
    if(App.isNotNull(commitData)){
        $(".tip3").show();
    }
}
function continuePurchase(){
    $(".tip").hide();
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }
    commitData = getData();
    if(App.isNotNull(commitData)){
        $(".tip3").show();
    }
}
function purchase() {
    // console.log(commitData);
    var url = App.projectNm + "/fund/tax_pension_fund_batch_auto_pur_create_with_try_buy";
    App.post(url, JSON.stringify(commitData), null, function (result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, commitData);
        App.setSession(App.serialNo_forword_url, "../taxExtension/depositPlanSuccessfully.html");

        window.location.href = "../common/setPassword.html";
    });
}

$("#btn-problem-2").click(function(){
    alertTips('<div style="line-height: 1.5;">单次购买说明：购买计划在指定日期执行一次。每月购买说明：购买计划在每月的指定日期周期性执行。</div>', '确定');
});
$(".choose-icon-agreement").click(function(){
    $(".chose-icon").toggleClass("current");
});

$(".choose-time-monthly").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $(".appDate").blur();
    return false
});

$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    $(".appDate").attr("data-time", li.attr("data-choose-time"));
    $(".appDate").html(li.find("div").text());
    $(".choose-time").hide();
    queryPurchaseInfo();
});
$(".close_tip").click(function () {
    $(this).parents(".risk_confirm_tip").hide();
    $(this).parents(".tip2").hide();
    $(this).parents(".tip3").hide();
});