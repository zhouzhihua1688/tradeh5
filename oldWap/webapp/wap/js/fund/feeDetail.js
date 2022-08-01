$(function() {
    var balanceSerialno = App.getUrlParam('balanceSerialNo');
    var queryType = App.getUrlParam('queryType');
    var oProductId = App.getUrlParam('oProductId');
    var quty = App.getUrlParam('quty');
    var jumpFrom = App.getUrlParam('jumpFrom');
    if(queryType == 'T'){
        $("title").html('转换费率');
        $(".name").html('估算转换费用');
    } else {
        $("title").html('赎回费率');
        $(".name").html('估算赎回费用');
        $(".content3").hide();
        $(".remark_1").hide();
        $(".redeem-fee-amt").hide();
    }
    if (quty == null || quty == undefined || quty == 0) {
        quty = 0;
        $(".sum-fee-amt").hide();
        $(".redeem-fee-amt").hide();
        $(".li-4").hide();
        $(".li-3").addClass("th-right");
    }
    if(queryType == 'T' && App.isEmpty(oProductId)){
        $("title").html('赎回费率');
        $(".content3").hide();
        $(".remark_1").hide();
    }

    if (App.isNotEmpty(jumpFrom) && jumpFrom == 'fundHold') {
        $("#bottomTips").hide();
    }
    calculateFee(balanceSerialno, queryType, quty,oProductId);
});

function calculateFee(serialNo,queryType,quty,oProductId) {
    var url = '/fts/v1/trades/fee/detail';
    //queryType：T转换B购买R赎回
    var data = {'balanceSerialNo':serialNo,'accepteMode':'M','tradeType':queryType,'redQuty':quty,'ofundId':oProductId};
    App.post(url, JSON.stringify(data), null, function (result) {
        var info = result.body;
        if(info != undefined && info != null){

            $(".sum-feeAmount").html((info.redeemFeeAmount + info.subDiscountFeeAmount).toFixed(2));
            $(".feeAmount").html(info.redeemFeeAmount);
            if(info.redeemFundFeeClassList != undefined && info.redeemFundFeeClassList != null){
                var html = '';
                info.redeemFundFeeClassList.forEach(function (item, index) {
                    var nextRedeemConf = item.fundFeeRedeemConfig;
                    var expires;
                    if(index == 0) {
                        var maxExpires = calculateHoldExpires(nextRedeemConf.maxHoldDays);
                        expires = 'T &lt;' + maxExpires;
                    } else if (index ==  info.redeemFundFeeClassList.length - 1){
                        var minExpires = calculateHoldExpires(nextRedeemConf.minHoldDays);
                        expires = 'T &ge;' + minExpires;
                    } else {
                        if(nextRedeemConf.minHoldDays > 0 && nextRedeemConf.maxHoldDays > 0){
                            var maxExpires = calculateHoldExpires(nextRedeemConf.maxHoldDays);
                            var minExpires = calculateHoldExpires(nextRedeemConf.minHoldDays);
                            expires = minExpires + '&le; T &lt;' + maxExpires;
                        } else if(nextRedeemConf.minHoldDays > 0 && nextRedeemConf.maxHoldDays <= 0){
                            var minExpires = calculateHoldExpires(nextRedeemConf.minHoldDays);
                            expires = minExpires + '&le; T';
                        } else if(nextRedeemConf.minHoldDays <= 0 && nextRedeemConf.maxHoldDays > 0){
                            var maxExpires = calculateHoldExpires(nextRedeemConf.maxHoldDays);
                            expires = 'T &ge;' + maxExpires;
                        }
                    }

                    var subHtml = '';
                    var redeemFundDetailList = item.redeemFundDetailList;
                    if(redeemFundDetailList != undefined && redeemFundDetailList != null && redeemFundDetailList.length > 0){
                        redeemFundDetailList.forEach(function (subItem) {
                            if(quty == 0){
                                subHtml += '<li><span class="tb-span-w20">'+ subItem.holdDays +'天</span><span class="tb-span-w80">'+ subItem.holdQuty +'</span></li>';
                            } else {
                                subHtml += '<li><span class="tb-span-w20">'+ subItem.holdDays +'天</span><span class="tb-span-w40">'+ subItem.holdQuty +'</span><span class="tb-span-w40">'+ subItem.redeemQuty +'</span></li>';
                            }
                        });
                    } else {
                        if(quty == 0){
                            subHtml += '<li><span class="tb-span-w20">无</span><span class="tb-span-w80">无</span></li>';
                        } else {
                            subHtml += '<li><span class="tb-span-w20">无</span><span class="tb-span-w40">无</span><span class="tb-span-w40">无</span></li>';
                        }
                    }

                    html  +=
                        '<tr>' +
                        '   <td>'+ nextRedeemConf.feeRate +'%</td>' +
                        '   <td>'+ expires +'</td>' +
                        (quty == 0 ? '   <td>'+ item.holdQuty +'&nbsp;<i class="down"></i></td>' : '   <td>'+ item.holdQuty + '</td>' ) +
                        (quty == 0 ? '' : '   <td>'+ item.redeemQuty + '&nbsp;<i class="down"></i></td>' ) +
                        '  </tr>' +
                        '  <tr class="tablebox ">' +
                        '   <td colspan="4">' +
                        '    <div class="box-container">' +
                        '     <img src="../images/fund/sanjiao.png" alt="">' +
                        '     <ul>' +
                        '      <li class="color666">' +
                        '<span class="tb-span-w20">持有天数</span>' +
                        '<span class="'+ (quty == 0 ? 'tb-span-w80' : 'tb-span-w40') +'">当前持有份额</span>' +
                        (quty == 0 ? '' : '<span class="tb-span-w40">本次申请份额</span>') +
                        '</li>' +
                        subHtml +
                        '     </ul>' +
                        '    </div>' +
                        '   </td>' +
                        '  </tr>';

                });
                $('.redeem-fee-body').html(html);

                var flag=true;  //第一次点击箭头
                $("i").on('click',function(e){
                    $("i").each(function(){
                        $(this).removeClass("up").addClass("down");
                    })
                    // console.log($("i"));
                    if(flag){
                        $(this).removeClass("down").addClass("up");
                        flag=false;
                    }else{
                        $(this).removeClass("up").addClass("down");
                        flag=true;
                    }
                    $(".tablebox").each(function(){
                        if($(this).prev().find('i').hasClass('up')){
                            $(this).show();
                            $(this).prev().find('td').css("border-bottom","none")
                        }else{
                            $(this).hide();
                            $(this).prev().find('td').css("border-bottom","1px #e7e7e7 solid")
                        }

                    })
                });
            }

            $(".fundName").html(fmtName(info.fundName));
            $(".ofundName").html(fmtName(info.ofundName));
            $(".fundFeeRate").html(((info.fundFeeRate == null || info.fundFeeRate == 0) ? 0 : info.fundFeeRate + '%'));
            $(".ofundFeeRate").html(((info.ofundFeeRate == null || info.ofundFeeRate == 0) ? 0 : info.ofundFeeRate + '%'));
            $(".subDiffRate").html(((info.subDiffRate == null || info.subDiffRate == 0) ? 0 : info.subDiffRate + '%'));
            $(".feeRate").html(((info.discountFeeRate == null || info.discountFeeRate == 0) ? 0 : info.discountFeeRate + '%'));
            $(".subFeeAmount").html(info.subDiscountFeeAmount);
        }
        $("body").show();
    });
}

function calculateHoldExpires(num){
    if(num >= 365){
        var year = num / 365;
        return year + '年';
    } else if(num < 365 && num >30){
        var month = num / 30;
        return month + '月';
    } else {
        return num + '天';
    }
}