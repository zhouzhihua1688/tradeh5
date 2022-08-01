$(function () {
    var themeStle = App.getUrlParam("themeStyle");
    if(themeStle == '2'){
        $(".headerBar").css("background-color", '#0757b2');
        $(".theme_background").css("background-color", '#0757b2');
        $(".theme_font_1").css("color", '#0757b2');
    } else if (themeStle == '3'){
        $(".headerBar").css("background-color", '#4f423d');
        $(".theme_background").css("background-color", '#4f423d');
        $(".theme_font_1").css("color", '#4f423d');
    } else {
        $(".headerBar").css("background-color", '#fe7e01');
        $(".theme_background").css("background-color", '#fe7e01');
        $(".theme_font_1").css("color", '#fe7e01');
    }
    $(".theme_font").css("color", "#ffffff");

    $("#takeback").click(function () {
        window.location.href = "htffundxjb://action?type=tb";
    });
    $("#recharge").click(function () {
        window.location.href = "htffundxjb://action?type=rc";
    });
    $(".group_btn").attr("href", "htffundxjb://action?type=fg&subType=fgd&groupId=A0081");
    $(".group_panel").click(function () {
        window.location.href = "htffundxjb://action?type=fg&subType=fgd&groupId=A0081";
    });

    queryTotalProfit();
    queryContractPay();
    queryCashProfit();
    queryQuickPass();
    requestGroupFundDetail('A0081');
    // queryYieldLatest('A0081');
    App.queryHomePageInfo(function () {
        var info = App.getSession(App.accountHomePageInfo);
        if(info != null || info != undefined){
            if(info.assets != null || info.assets != undefined){
                $("#panel_totalVal").html(App.numberFormat(info.assets.balance));
            }
            if(info.homeInfo != null || info.homeInfo != undefined){
                $("#panel_income").html(info.homeInfo.income);
                $("#panel_yield").html(info.homeInfo.yield);
            }
        }
    });
});

function queryTotalProfit(){
    var url = App.projectNm + "/account/query_total_profit";
    App.get(url, null,function(result){
        if(result.body != null && result.body != undefined){
            if(result.body.totalProfit != null && result.body.totalProfit != undefined){
                $("#panel_total_profit").html(App.numberFormat(result.body.totalProfit));
            }
        }
    });
}

function queryLayout() {

    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wap_index_xjbzichan&r=" + (Math.random()*10000).toFixed(0);

    App.get(url,null,function(result){
        // console.log("layout:", result);
        if (result.body.layout != undefined && result.body.layout != null){
            var layoutList = result.body.layout;
            var isAddLine = true;
            var size = layoutList.length;
            for (var index in layoutList) {
                if (index == size - 1) {
                    isAddLine = false;
                }
                Layout.drawingLayout('#panel', layoutList[index], index, isAddLine);
            }
        }
    });

}

function queryCashProfit(){
    App.get("/assetcenter/v1/asset/cash-manager", null, function(result){
        if(result.body != undefined && result.body != null){
            var body = result.body;
            if(body != undefined && body != null){

                if(body.cashPlusAsset != undefined && body.cashPlusAsset != null){
                    var cashPlusAsset = body.cashPlusAsset;
                    if(cashPlusAsset.totalAmt > 0){
                        $(".group_btn").attr("href", "htffundxjb://action?type=fg&subType=fgp&groupId=A0081");
                        $(".group_panel").click(function () {
                            window.location.href = "htffundxjb://action?type=as&subType=fg&groupType=08";
                        });
                    }
                }
            }
        }
    });
}

function queryContractPay() {
    var url = "/ats-ng/v1/manage/contract-query/contract-pay-date";
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var info = result.body;
            //工资宝
            var list1 = new Array();
            if(App.isNotEmpty(info.lastMipDate)){
                var date = info.lastMipDate.substr(-4,2)+'-'+info.lastMipDate.substr(-2,2);
                list1.push(date + '&nbsp;' + App.formatMoney(info.lastMipAmt, 2) + '元' + '&nbsp;' + getStDesc(info.lastMipSt));
            }
            if(App.isNotEmpty(info.nextMipDate)){
                var date = info.nextMipDate.substr(-4,2)+'-'+info.nextMipDate.substr(-2,2);
                list1.push(date + '&nbsp;' + App.formatMoney(info.nextMipAmt, 2) + '元' + '&nbsp;将转');
            }
            $(".func_list_1").append(getHtml('工资宝', 'htffundxjb://action?type=rca&subType=1','一次设置，工资定期转入，轻松赚取收益', list1));
            //还款专区
            var list2 = new Array();
            if(App.isNotEmpty(info.lastRepayDate)){
                var date = info.lastRepayDate.substr(-4,2)+'-'+info.lastRepayDate.substr(-2,2);
                list2.push(date + '&nbsp;' + App.formatMoney(info.lastRepayAmt, 2) + '元' + '&nbsp;' + getStDesc(info.lastRepaySt));
            }
            if(App.isNotEmpty(info.nextRepayDate)){
                var date = info.nextRepayDate.substr(-4,2)+'-'+info.nextRepayDate.substr(-2,2);
                list2.push(date + '&nbsp;' + App.formatMoney(info.nextRepayAmt, 2) + '元' + '&nbsp;将转');
            }
            var title = '还款专区<span style="font-size: 0.2rem;">(还贷款/还信用卡)</span>';
            if(list2.length > 0){
                title = '还款专区';
            }
            $(".func_list_1").append(getHtml(title, 'htffundxjb://action?type=repay&subType=home','立即还款，实时到账；预约还款，月月安心', list2));
            //预约取现
            // var list3 = new Array();
            // if(App.isNotEmpty(info.lastRedDate)){
            //     var date = info.lastRedDate.substr(-4,2)+'-'+info.lastRedDate.substr(-2,2);
            //     list3.push(date + '&nbsp;' + App.formatMoney(info.lastRedAmt, 2) + '元' + '&nbsp;' + getTakeBackStDesc(info.lastRedSt));
            // }
            // if(App.isNotEmpty(info.nextRedDate)){
            //     var date = info.nextRedDate.substr(-4,2)+'-'+info.nextRedDate.substr(-2,2);
            //     list3.push(date + '&nbsp;' + App.formatMoney(info.nextRedAmt, 2) + '元' + '&nbsp;将取');
            // }
            // $(".func_list_1").append(getHtml('预约取现', 'htffundxjb://action?type=tba&subType=1','定期取现，无额度限制，资金灵活安排', list3));
        }
    });
}

function getMonthFirstDay() {
    var date = new Date();
    var year = date.getFullYear() + '';
    var month = (date.getMonth() + 1) + '';
    if(month < 10){
        month = '0' + month;
    }
    return year + '' + month + '' + '01';
}
function getMonthLastDay() {
    var date = new Date();
    var year = date.getFullYear() + '';
    var month = (date.getMonth() + 1) + '';
    var lastDateOffCurrentMonth = new Date(year, month, 0);
    if(month < 10){
        month = '0' + month;
    }
    return year + '' + month + '' + lastDateOffCurrentMonth.getDate();
}

function queryQuickPass() {
    var sDt = getMonthFirstDay();
    var eDt = getMonthLastDay();
    var url = "/ess/v1/trade/tradeinfos/quickpass?startDt="+sDt+"&endDt="+eDt+"&size=2";
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var infos = result.body;
            //汇添付
            var list1 = new Array();
            infos.forEach(function (result) {
                var date = result.apdt.substr(-4,2)+'-'+result.apdt.substr(-2,2);
                list1.push(date + '&nbsp;' + App.formatMoney(result.amt, 2) + '元' + '&nbsp;' + getShopName(result.shopName));
            });
            $(".func_list_2").append(getHtml('汇添付', 'htffundxjb://action?type=xp&subType=wb','微信支付绑定现金宝，理财消费两不误', list1));
        }
    });
}

function getShopName(shopName){
    if(shopName.length > 6){
        return shopName.substr(0, 6) + "...";
    } else {
        return shopName;
    }
}

function getTakeBackStDesc(key) {
    if(key == 'Y'){
        return '已取';
    } else if(key == 'F'){
        return '失败';
    } else {
        return '';
    }
}

function getStDesc(key) {
    if(key == 'Y'){
        return '已转';
    } else if(key == 'F'){
        return '失败';
    } else {
        return '';
    }
}

function getFSFStDesc(key) {
    if(key == '交易成功' || key == '受理成功'){
        return '已取';
    } else {
        return '将取';
    }
}

function getHtml(title, link, remark, list) {
    var html = '';
    var border = '';
    if(title == '汇添付'){
        border = "border-bottom: 0;";
    }
    if(list != undefined && list != null){
        if(list.length == 2){
            var subHtml = '';
            list.forEach(function (txt) {
                subHtml += '<p class="font-number">' + txt + '</p>';
            });
            html = '<div class="input_text " style="'+ border +'" onclick="jumlUrl(\''+ link +'\')">' +
                '                    <div class="clearfix">' +
                '                        <div class="left_xjbzichan">' +
                '                            <h4 class="font-chinese">'+ title +'</h4>' +
                '                        </div>' +
                '                        <div class="right line2">' +
                 subHtml +
                '                        </div>' +
                '                    </div>' +
                '                </div>';
        } else if(list.length == 1){
            var subHtml = '';
            list.forEach(function (txt) {
                subHtml += '<p class="font-number">' + txt + '</p>';
            });
            html = '<div class="input_text " style="'+ border +'" onclick="jumlUrl(\''+ link +'\')">' +
                '                    <div class="clearfix">' +
                '                        <div class="left_xjbzichan">' +
                '                            <h4 class="font-chinese">'+ title +'</h4>' +
                '                        </div>' +
                '                        <div class="right">' +
                subHtml +
                '                        </div>' +
                '                    </div>' +
                '                </div>';
        } else {
            html = '<div class="input_text " style="'+ border +'" onclick="jumlUrl(\''+ link +'\')">' +
                '                    <div class="clearfix">' +
                '                        <div class="">' +
                '                            <h4 class="font-chinese">'+ title +'</h4>' +
                '                            <p class="font-chinese" style="font-size: .28rem;">'+ remark +'</p>' +
                '                        </div>' +
                '                    </div>' +
                '                </div>';
        }
    }
    return html;
}

function jumlUrl(url){
    window.location.href = url;
}

function requestGroupFundDetail(groupId){
    App.get("/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId, null, function(resultStr){
        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
        if(result.body != undefined && result.body != null){
            var detailInfo = result.body;
            if(detailInfo != undefined && detailInfo != ""){
                // $(".group_title").html(detailInfo.groupname);
                $(".group_daily_growth_rate").html(detailInfo.nearYearProfit);
            }
        }
    });
}

// function queryYieldLatest(groupId){
//     App.get("/productcenter/v1/new/compose/fundgroups/single/yield/latest?groupId=" + groupId, null, function(result){
//         if(result.body != undefined && result.body != null){
//             var body = result.body;
//             if(body != undefined && body != null && body != ""){
//                 $(".group_daily_growth_rate").html(body.groupDailyGrowthRate);
//             }
//         }
//     });
// }