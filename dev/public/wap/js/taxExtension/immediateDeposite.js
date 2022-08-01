$(function(){
    queryAvailableFundList();
    queryYLInfo();
    queryAGSInfo();
    $(".auto-deposit-btn").attr("href", "autodepositIndex.html?fundId=" + App.getUrlParam("fundId"));
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=" + encodeURIComponent(location.href));
});
var sBankNo = "";
var sBankAcco = "";
var sBankName = "";
var sBankDisplayCard = "";
var sCashFrom = "";
var currencyType = '156';
var problemTips = '';
var availableAmount = 0;
var balance = 0;
var fundId = '';
var fundTp = '';
var sumFee = 0;
var sumDiscountFee = 0;


function queryAvailableFundList(){
    var productId = App.getUrlParam("fundId");
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


function queryCard(currencyTp) {
    //当前wap只有基金申购，tradeType=00表示申购，后续有其他基金交易时，需要修改tradeType
    var url = "/mobile-bff/v1/fund/queryBnkCardList?currencyType=" + currencyTp + "&fundId=" + fundId + "&tradeType=00" + "&r=" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("银行卡数量："+ result.body.card.length);
            // data.cards = result.body.card;
            tip = result.body.tip;
            tipExt = result.body.tipExt;
            var cards = result.body.bankInfos;
            var cardsHtml = "";
            if(cards != undefined && cards != null && cards.length > 0){
                cards.forEach(function (item, index) {
                    if (index == 0){
                        selectedCard(item.bankNo, item.bankAcco, item.bankGrpName, item.bankAccoDisplay, item.cashFrom, item.availablePayBalance, item.limitRemark);
                    }
                    var card = item;
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
                        '                <div class="lh-130 ">\n' +
                        '                    <a class="icon icon-'+ signStyle +'">'+signTxt+'</a>\n' +
                            '                </div>\n' +
                            '            </div>\n')
                        +
                        '        </li>';

                });

                $("#bankCardList ul").append(cardsHtml);
                showSmTip();
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
        $(".xjb-usable").html(limitRemark);
    } else if(displayCard == 'null' || App.isEmpty(displayCard)){
        $("#payWay").html(bankName);
    } else {
        $("#payWay").html(bankName + " [ "+ displayCard +" ]");
    }
}
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
            console.log(result);
            if (result.body.isOpenPITD == 'Y'){
                var pitdInvestAcct = result.body.pitdInvestAcct;
                if (App.isNotNull(pitdInvestAcct)){
                    $("#purType").html(pitdInvestAcct.investAcct);
                }
            }
        }
    });
}

function queryAGSInfo() {
    App.get("/ags/v1/funds/query-info?tradeType=0&fundId=" + App.getUrlParam("fundId"), null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            var info = result.body;
            if(App.isNotEmpty(info.availableAmount)){
                $("#available-amount").html(App.formatMoney(info.availableAmount) + ' 元');
                availableAmount = info.availableAmount;
            } else {
                $("#available-amount").html('0.00 元');
            }
        }
    });
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

$("#purchaseAmt").on("keyup", queryFee);

$("#btn-problem").click(function(){
    alertTips('<div style="line-height: 1.5;">'+ problemTips +'</div>', '知道了');
});
$("#btn-submit").click(function(){
    purchaseCheck();
});

$("#continue_pur").click(function () {
    continuePurchase();
});

$(".confirm-purchase-btn").click(function () {
    purchase();
});

function purchaseCheck() {
    if(!valide()){
        return;
    }
    var purAmt = $("#purchaseAmt").val();
    if(App.isEmpty(purAmt)){
        alertTips('<div style="line-height: 1.5;">购买金额不能为空</div>');
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
            $(".tip").show();
            return;
        }
    }
    $(".tip3").show();
}

function continuePurchase(){
    $(".tip").hide();
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }
    $(".tip3").show();
}

function purchase() {
    var data = getData();
    if(data != null && data != undefined){
        var url = App.projectNm + "/fund/tax_pension_fund_batch_purchase";
        App.post(url, JSON.stringify(data), null, function (result) {
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            App.setSession(App.serialNo_forword_url, "../taxExtension/depositPlanSuccessfully.html");

            window.location.href = "../common/setPassword.html";
        });
    }
}

function getData() {
    var cashFrm = 'V';
    var channel = App.getCookie("channel");
    var purAmt = $("#purchaseAmt").val();
    if(App.isEmpty(purAmt)){
        alertTips('<div style="line-height: 1.5;">购买金额不能为空</div>');
        return;
    }
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
            var obj = {'shareType':'A','cashFrom':cashFrm,'currencyType':currencyType};
            obj.bankNo = App.isNull(sBankNo) ? '' : sBankNo;
            obj.bankAcco = App.isNull(sBankAcco) ? '' : sBankAcco;
            obj.fundId = $(item).attr("data-fundId");
            obj.subAmt = purAmt * ratio;
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
        "taxPensionBatchFunds": funds
    };
    if (App.isNotEmpty(channel)){
        data["channel"] = channel;
    }
    return data;
}

$(".close_tip").click(function(){
    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
    $(this).parents(".tip3").hide();
})

$(".rules").click(function(){
    $(".chose-icon").toggleClass("current");
});