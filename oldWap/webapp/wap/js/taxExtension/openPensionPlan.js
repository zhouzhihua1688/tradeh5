$(function(){
    productId = App.getUrlParam("productId");
    showSmTip();
    queryAvailableFundList();
    queryAutoPurFundList();
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=../taxExtension/openPensionPlan.html?productId=" + productId);
});
var productId = "";

$(".selectTime1").click(function(){
    $(".choose-time").unbind();
    if($(this).hasClass("selectTime1")){
        selectTime($(".selectTime1 span"));
    }
    var mipBuyDay = $(".appDate1").attr("data-time");
    var fundId = $("#product_1_Name").attr("data-fundId");
    queryPurchaseInfo(1, fundId, mipBuyDay);
    $(".choose-time").show();
});
$(".selectTime2").click(function(){
    $(".choose-time").unbind();
    if($(this).hasClass("selectTime2")){
        selectTime($(".selectTime2 span"));
    }
    var mipBuyDay = $(".appDate2").attr("data-time");
    var fundId = $("#product_2_Name").attr("data-fundId");
    queryPurchaseInfo(2, fundId, mipBuyDay);
    $(".choose-time").show();
});

function selectTime(btn) {
    $(".choose-time").click(function(event) {
        var li = $(event.target).parents("li");
        if (li.size() == 0) {
            $(".choose-time").hide();
            return;
        };
        $(btn).attr("data-time", li.attr("data-choose-time"));
        $(btn).html(li.find("div").text());
        $(".choose-time").hide();
    });
}

$("#selectProduct1").click(function(){
    var amt = $("#product1_amt").val();
    if(App.isNumber(amt)){
        $("#productList1 ul").find("li").each(function(index, item){
            var ratio = $(item).find("select").val();
            var temp = Number(amt) * Number(ratio) / 100;
            $(item).find(".fund-amt").html(App.formatMoney(temp, 2));
            $(item).find(".fund-amt").attr("data-amt", temp);
            queryFee(item);
        });
        $("#productList1").show();
        $(".mask").show();
    }else {
        alertTips("请输入正确的金额");
        return;
    }
});
$("#selectProduct2").click(function(){
    var amt = $("#product2_amt").val();
    if(App.isNumber(amt)){
        $("#productList2").show();
        $(".mask").show();
    }else {
        alertTips("请输入正确的金额");
        return;
    }
});
// 选择银行卡
$(".selectBankCard1").click(function(){
    $("#bankCardList1").show();
});
$(".selectBankCard2").click(function(){
    $("#bankCardList2").show();
});
// 银行卡,列表
$("#bankCardList1").click(function(){
    $("#bankCardList1").hide();
});
$("#bankCardList2").click(function(){
    $("#bankCardList2").hide();
});
$(".queding").click(function () {
    var temp = 0;
    var flag = 1;
    var fee = 0;
    var discountFee = 0;
    var amt = $("#product1_amt").val();
    if(App.isNumber(amt)){
        $("#productList1 ul").find("li").each(function(index, item){
            var tFee = $(item).attr("data-fee");
            var tDiscountFee = $(item).attr("data-discountFee");
            var ratio = $(item).find("select").val() / 100;
            fee += Number(tFee);
            discountFee += Number(tDiscountFee.replace(/,/g,''));
            temp += Number(ratio);
            if(ratio > 0){
                if(flag > 0){
                    $("#product_1_Name").html($(item).find(".fund-name").html());
                    flag--;
                }
            }
        });
        var productCount = $("#productList1 ul").find("li").length;
        if(productCount > 0){
            if(temp > 1){
                alertTips("配比不能超过100%");
                return;
            } else if(temp < 1){
                alertTips("配比不能低于100%");
                return;
            }
        }
        $("#sumFee1").html(App.formatMoney(fee, 2));
        $("#sumDiscountFee1").html(App.formatMoney(discountFee, 2));
        // console.log(data);
    }else {
        alertTips("请输入正确的金额");
    }
    $(".product-panel").hide();
    $(".mask").hide();
});

$(".queding1").click(function(){
    var selectedFundId = '';
    var selectedFundTp = '';
    var amt = $("#product2_amt").val();
    if(App.isNumber(amt)){
        $("#productList2 ul").find("li").each(function(index, item){
            if($(item).find("span").hasClass("activeChose")){
                selectedFundId = $(item).attr("data-fundId");
                selectedFundTp = $(item).attr("data-fundType");
                $("#product_2_Name").html($(item).attr("data-fundNm"));
                $("#product_2_Name").attr("data-fundId", $(item).attr("data-fundId"));
            }
        });
        var productCount = $("#productList2 ul").find("li").length;
        if(App.isNotEmpty(selectedFundId)){
            queryFee2(selectedFundId, selectedFundTp);
        } else if(productCount > 0) {
            alertTips("请先选择一只产品");
            return;
        }
    } else {
        alertTips("请输入正确的金额");
    }
    $(".product-panel").hide();
    $(".mask").hide();
});

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

function getMipName(str){
    return str + new Date().format("yyyyMMdd");
}

function queryAutoPurFundList(){
    if(App.isNotEmpty(productId)){
        App.get(App.projectNm + "/fund/query_can_mix_auto_pur_fund_list?productId=" + productId, null, function (result) {
            // var result = ;
            if (App.isNotNull(result.body)) {
                var fundList = result.body.fundMixAutoPurInfos;
                if(App.isNotNull(fundList)){
                    var listHtml = '';
                    var fundId = '';
                    fundList.forEach(function (item, index) {
                        if(index == 0){
                            $("#product_2_Name").html(App.subString(item.productName, 12, '...'));
                            $("#product_2_Name").attr("data-fundId", item.productId);
                            var mipBuyDay = $(".appDate2").attr("data-time");
                            fundId = item.productId;
                            queryPurchaseInfo(2, fundId, mipBuyDay);
                        }
                        var display = item.fromyearreturnDisplay;
                        if(Number(display) > 0){
                            display = '+' + display;
                        } else {
                            display = '-' + display;
                        }
                        listHtml +=
                            '<li style="border-bottom:1px solid #eeeeee" data-fundId="'+ item.productId +'" data-fundType="'+ item.productType +'" data-fundNm="'+ App.subString(item.productName, 12, '...') +'">' +
                            '   <div class="left"  style="color:#000;line-height:1rem">' +
                            '        <div class="double" style="">'+ App.subString(item.productName, 12, '...') +'<span style="font-size:0.65rem;color:#666;margin-left:0.5rem">'+ item.productId+'</span></div>' +
                            '   </div>' +
                            '   <span class="center" style="color:#f4333c">'+ display +'%</span>' +
                            '   <span class="right circle '+ (index == 0 ? 'activeChose':'leaveChose') +'"></span>' +
                            '</li>';
                    });
                    $("#productList2 ul").append(listHtml);

                    if(App.isNotEmpty(fundId)){
                        queryCard(fundId, 2, false);
                    }

                    $("#productList2 ul li").on("click",function(){
                        $("#productList2 ul li .right").each(function(){
                            $(this).removeClass('activeChose').addClass("leaveChose")
                        });
                        $(this).children(".right").addClass("activeChose").removeClass("leaveChose");
                    });
                }
            }
        });
    }
}

function queryAvailableFundList(){
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
                var fundList = info.fundAllInfos;
                if(App.isNotNull(fundList)){
                    var listHtml = '';
                    fundList.forEach(function (item, index) {
                        if(index == 0){
                            $("#product_1_Name").html(App.subString(item.fundName, 12, '...'));
                            $("#product_1_Name").attr("data-fundId", item.fundId);
                        }

                        listHtml += '<li style="border-bottom:1px solid #eeeeee;height:3.5rem!important;line-height:3.5rem!important" data-fundId="'+ item.fundId +'">' +
                        '               <div class="left"  style="color:#000;line-height:1rem;width:60%">' +
                        '                    <div class="double fund-name" style="margin-top:0.5rem">'+ App.subString(item.fundName, 12, '...') +'</div>' +
                        '                    <div class="double" style="font-size:0.55rem;margin-top:0.5rem">费率：&nbsp;&nbsp;' +
                            '<span style="text-decoration:line-through;margin-right: 0.25rem" class="rate">0.00%</span><span class="uRate" style="color:#f4333c">0.00%</span>' +
                        '                    </div>' +
                        '               </div>' +
                        '               <span class="center fund-amt" style="color:#000;width:20%">0.00</span>' +
                        '               <span style="float:right;margin-top:0rem!important;">' +
                            (index == 0 ? getSelect(100) : getSelect(0)) +
                        '               </span>' +
                        '            </li>';
                    });
                    $("#productList1 ul").append(listHtml);
                    var mipBuyDay = $(".appDate1").attr("data-time");
                    var fundId = $("#product_1_Name").attr("data-fundId");
                    queryPurchaseInfo(1, fundId, mipBuyDay);
                    queryCard(fundId, 1, true);

                    $(".select-ratio").change(function () {
                        selectRatio($(this));
                    });
                }
            }
        }
    });
}

function selectRatio(ele) {
    var ratio = $(ele).val();
    var amt = $("#product1_amt").val();
    if(App.isNumber(amt)){
        var span = $(ele).parents("li").find(".fund-amt");
        $(span).html(App.formatMoney(Number(amt) * Number(ratio) / 100), 100);
        queryFee($(ele).parents("li"));
    } else {
        alertTips("请输入正确的金额");
        $(".product-panel").hide();
        $(".mask").hide();
    }
}

function queryFee(li) {
    var fundId = $(li).attr("data-fundId");
    var purAmt = $(li).find(".fund-amt").attr("data-amt");
    if (App.isNotEmpty(purAmt)) {

        var cashFrom = $("#payWay1").attr("data-cashFrom");
        if(App.isEmpty(cashFrom)){
            cashFrom = "V";
        }
        var bankNo = $("#payWay1").attr("data-bankNo");
        var url = App.projectNm + "/fund/fund_fee";
        var data = {"subAmt": purAmt, "fundId": fundId, "cashFrm": cashFrom, "shareType": "A"};
        data.bankNo = bankNo == undefined || bankNo == 'null' ? '' : bankNo;

        App.post(url, JSON.stringify(data), null, function (result) {
            $(li).find(".rate").html(result.body.rate);
            $(li).find(".uRate").html(result.body.uRate);
            $(li).attr("data-fee", result.body.fee);
            $(li).attr("data-discountFee", result.body.discountFee);
        });
    }
}
function queryFee2(fundId, fundType) {
    var purAmt = $("#product2_amt").val();
    if (App.isNotEmpty(purAmt)) {

        var cashFrom = $("#payWay2").attr("data-cashFrom");
        if(App.isEmpty(cashFrom)){
            cashFrom = "V";
        }
        var bankNo = $("#payWay2").attr("data-bankNo");
        if(fundType == "F"){
            var url = App.projectNm + "/fund/fund_fee";
            var data = {"subAmt": purAmt, "fundId": fundId, "cashFrm": cashFrom, "shareType": "A"};
            data.bankNo = bankNo == undefined || bankNo == 'null' ? '' : bankNo;

            App.post(url, JSON.stringify(data), null, function (result) {
                $(".sumFee2").html(result.body.feeStr);
                $(".sumDiscountFee2").html(result.body.discountFee);
            });
        } else if(fundType == "G"){
            var data = {"subAmt": purAmt, "groupId": fundId, "cashFrm": cashFrom, "purType":"B", "shareType": "A", "branchCode" : "247"};
            data.bankNo = bankNo == undefined || bankNo == 'null' ? '' : bankNo;

            var url = App.projectNm + "/adviser/get_fund_group_fee";
            App.post(url, JSON.stringify(data), null, function (result) {
                $(".sumFee2").html(result.body.dispalyFee);
                $(".sumDiscountFee2").html(result.body.discountFee);
            });
        }
    }
}
function queryPurchaseInfo(index, fundId, mipBuyDay) {
    var data = {
        "agreementId":"20,21",
        "cycle": 'MM',
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
                    if(index == 1){
                        $(".next-date-txt-1").html(App.formatDateStr(info.nextMipDate));
                    } else {
                        $(".next-date-txt-2").html(App.formatDateStr(info.nextMipDate));
                    }
            }
        });
    }
}

function queryCard(fundId, panelIndex, bool) {
    //当前wap只有基金申购，tradeType=00表示申购，后续有其他基金交易时，需要修改tradeType
    var url = "/mobile-bff/v1/fund/queryBnkCardList?currencyType=156&tradeType=00&r=" + (Math.random() * 10000).toFixed(0);
    if(App.isNotEmpty(fundId)){
        url += "&fundId=" + fundId;
    }
    App.get(url, null, function (result) {
        // var result = {"body":{"tip":"","tipExt":"","bankInfos":[{"adLimit":"0","bankAcco":"6228487455655264154","bankAccoDisplay":"尾号4154","bankFlag":"N","bankGrpName":"农业银行","bankName":"农行快易付","bankNo":"603","bgrp":"A07","branchNm":"","branchNo":"","cashBalance":17109.51,"certNum":"44010119940101015X","color":"7","dayThreashHold":5000000,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"450731.30","limitRemark":"单笔、日累计500万","mainFlg":"N","mobileNo":"","promotionBtnTxt":"","promotionFlag":"","promotionUrl":"","protocolNo":"6228487455655264154","realLimit":"17109.51","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔、日累计500万","restLimit":"0","signWay":"1","singleThreashHold":5000000,"tradeFlag":"1"},{"adLimit":"0","bankAcco":"6214831646546456","bankAccoDisplay":"尾号6456","bankFlag":"N","bankGrpName":"招商银行","bankName":"招行快易付","bankNo":"607","bgrp":"A13","branchNm":"","branchNo":"","cashBalance":17109.51,"certNum":"44010119940101015X","color":"4","dayThreashHold":9.0E8,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"484918.29","limitRemark":"单笔1亿、日累计9亿","mainFlg":"Y","mobileNo":"","promotionBtnTxt":"如何提额？","promotionFlag":"1","promotionUrl":"app_inner/CMB-romote/index.html","protocolNo":"CM201806111758625956","realLimit":"17109.51","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔1亿、日累计9亿","restLimit":"0","signWay":"1","singleThreashHold":1.0E8,"tradeFlag":"1"},{"adLimit":"0","bankAcco":"6222022565855888526","bankAccoDisplay":"尾号8526","bankFlag":"N","bankGrpName":"工商银行","bankName":"工行快易付","bankNo":"202","bgrp":"A01","branchNm":"","branchNo":"","cashBalance":17109.51,"certNum":"44010119940101015X","color":"4","dayThreashHold":1.0E10,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"436553.29","limitRemark":"单笔10亿、日累计100亿","mainFlg":"N","mobileNo":"","promotionBtnTxt":"","promotionFlag":"","promotionUrl":"","protocolNo":"2019040918444105","realLimit":"17109.51","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔10亿、日累计100亿","restLimit":"0","signWay":"1","singleThreashHold":1.0E9,"tradeFlag":"1"}]},"returnCode":0,"returnMsg":"","successMsg":""};
        if (result.body != undefined && result.body != null) {
            tip = result.body.tip;
            tipExt = result.body.tipExt;
            var cards = result.body.bankInfos;
            var cardsHtml = "";
            if(cards != undefined && cards != null && cards.length > 0){
                cards.forEach(function (item, index) {
                    if(item.cashFrom != 'F'){
                        if (index == 0){
                            selectedCard(panelIndex, item.bankNo, item.bankAcco, item.bankGrpName, item.bankAccoDisplay, item.cashFrom, item.availablePayBalance, item.limitRemark);
                        }
                        cardsHtml += '<li class="grid-list-item heigth-130 bottom-border"' +
                            ' onclick="selectedCard(\''+ panelIndex +'\', \''+ item.bankNo +'\', \''
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

                $("#bankCardList" + panelIndex + " ul").html(cardsHtml);
            }else {
                if(cards !=undefined && cards != null){
                    cardsCount = cards.length;
                }
                if(bool){
                    isSetTradePassword();
                }
            }

        }
    }, false);
}
function selectedCard(panelIndex, bankNo, bankAcco, bankName, displayCard, cashFrom, availablePayBalance, limitRemark) {
    if (bankNo == 'null' || bankNo == null) {
        $("#payWay" + panelIndex).html(bankName);
    } else if(displayCard == 'null' || App.isEmpty(displayCard)){
        $("#payWay" + panelIndex).html(bankName);
    } else {
        $("#payWay" + panelIndex).html(bankName + " [ "+ displayCard +" ]");
    }
    $("#payWay" + panelIndex).attr("data-bankNo", bankNo == 'null' ? '' : bankNo);
    $("#payWay" + panelIndex).attr("data-bankAcco", bankAcco == 'null' ? '' : bankAcco);
    $("#payWay" + panelIndex).attr("data-bankName", bankName == 'null' ? '' : bankName);
    $("#payWay" + panelIndex).attr("data-displayCard", displayCard == 'null' ? '' : displayCard);
    $("#payWay" + panelIndex).attr("data-cashFrom", cashFrom == "undefined" ? "V" : cashFrom);
    $("#payWay" + panelIndex).attr("data-balance", availablePayBalance == "undefined" ? "" : availablePayBalance);
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

var riskInfo = {code: '0000', msg: ''};

function showSmTip() {
    var url = App.projectNm + "/common/check_union_risk_level?productId=" + productId;

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
$("#btn-submit").click(function () {
    purchaseCheck();
});
$("#continue_pur").click(function () {
    purchase();
});

function purchaseCheck() {
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
    purchase();
}

function purchase() {
    var amt1 = $("#product1_amt").val();
    var amt2 = $("#product2_amt").val();
    var batchDatas = [];

    if(App.isNotEmpty(amt1) && App.isNumber(amt1) && Number(amt1) > 0) {
        var temp = 0;
        var funds = [];
        var cashFrom = $("#payWay1").attr("data-cashFrom");
        if(App.isEmpty(cashFrom)){
            cashFrom = "V";
        }
        var bankNo = $("#payWay1").attr("data-bankNo");
        var bankAcco = $("#payWay1").attr("data-bankAcco");
        $("#productList1 ul").find("li").each(function (index, item) {
            var fundInfo = {'shareType': 'A', 'currencyType': '156', 'isFullAmt': '0', 'cashFrom': cashFrom};
            fundInfo.bankNo = bankNo == undefined || bankNo == 'null' ? '' : bankNo;
            fundInfo.bankAcco = bankAcco == undefined || bankAcco == 'null' ? '' : bankAcco;
            fundInfo.fundId = $(item).attr("data-fundId");
            var ratio = $(item).find("select").val() / 100;
            temp += Number(ratio);
            if (ratio > 0) {
                fundInfo.mipBuyAmt = Number(amt1) * Number(ratio);
                funds.push(fundInfo);
            }
        });
        var productCount = $("#productList1 ul").find("li").length;
        if (productCount > 0) {
            if (temp > 1) {
                alertTips("配比不能超过100%");
                return;
            } else if (temp < 1) {
                alertTips("配比不能低于100%");
                return;
            }
        }
        var obj = {'mipCycle':'MM', 'mipFundType':'T'};
        obj.mipName = getMipName('个税递延养老');
        obj.mipBuyDay = $(".appDate1").attr("data-time");
        obj.innerBatchAutoPurFunds = funds;
        batchDatas.push(obj);
    }

    if(App.isNotEmpty(amt2) && App.isNumber(amt2) && Number(amt2) > 0){
        var funds = [];
        var productType = '';
        var cashFrom = $("#payWay2").attr("data-cashFrom");
        if(App.isEmpty(cashFrom)){
            cashFrom = "V";
        }
        var bankNo = $("#payWay2").attr("data-bankNo");
        var bankAcco = $("#payWay2").attr("data-bankAcco");
        $("#productList2 ul").find("li").each(function(index, item){
            if($(item).find("span").hasClass("activeChose")){
                productType = $(item).attr("data-fundType");
                var fundInfo = {'shareType':'A','currencyType':'156','isFullAmt':'0','cashFrom':cashFrom};
                fundInfo.bankNo = bankNo == undefined || bankNo == 'null' ? '' : bankNo;
                fundInfo.bankAcco = bankAcco == undefined || bankAcco == 'null' ? '' : bankAcco;
                fundInfo.fundId = $(item).attr("data-fundId");
                fundInfo.mipBuyAmt = Number(amt2);
                funds.push(fundInfo);
            }
        });
        var productCount = $("#productList2 ul").find("li").length;
        if(productCount > 0){
            var obj = {'mipCycle':'MM'};
            obj.mipName = getMipName('补充购买养老产品');
            obj.mipBuyDay = $(".appDate2").attr("data-time");
            obj.mipFundType = productType;
            obj.innerBatchAutoPurFunds = funds;
            batchDatas.push(obj);
        }
    }

    if(App.isNull(batchDatas) || batchDatas.length == 0){
        alertTips("请至少选择一只产品");
        return;
    }

    var commitData = {'batchAutoPurFunds': batchDatas};
    var url = App.projectNm + "/fund/mix_type_fund_auto_pur_create";
    App.post(url, JSON.stringify(commitData), null, function (result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, commitData);
        App.setSession(App.serialNo_forword_url, "../taxExtension/depositPlanSuccessfully.html");

        window.location.href = "../common/setPassword.html";
    });
}