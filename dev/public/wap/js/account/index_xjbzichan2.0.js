$(function () {
    var themeStle = App.getUrlParam("themeStyle");
    /*if(themeStle == '2'){
        $(".banner").css("background-color", '#0757b2');
    } else if (themeStle == '3'){
        $(".banner").css("background-color", '#4f423d');
    } else {*/
        $(".banner").css("background-color", '#fe7e01');
    /*}*/

    var userAgent = navigator.userAgent;
    try{
        if (userAgent.indexOf("Android") > -1 || userAgent.indexOf("android") > -1) {
            if(typeof handler != 'undefined' && handler.needShowGuide){
                showNovice = handler.needShowGuide("xjbAssetsWeb", 1);
            }
        } else {
            if (typeof window.webkit != 'undefined'){
                window.webkit.messageHandlers.needShowGuide.postMessage({"name":"xjbAssetsWeb", "version": 1});
            }
        }
    } catch(err){
        $(".layers").hide();
        $(".active_content").show();
    }

    if(showNovice){
        $(".layers").show();
        $(".active_content").hide();
    } else {
        $(".layers").hide();
        $(".active_content").show();
    }
    $(".content_card_div_1").click(function() {
        window.location.href = "htffundxjb://action?type=as&subType=xjb";
    });



    $(".xjb_take_back").attr("href", "htffundxjb://action?type=tb");
    $(".xjb_recharge").attr("href", "htffundxjb://action?type=rc");
   // $(".xjj_take_back").attr("href", "../fundgroup/redeem.html?groupId=A0081&groupType=08");
    $(".xjj_recharge").attr("href", "htffundxjb://action?type=fg&subType=fgp&groupId=A0081");
    queryContractPay();
    queryQuickPass();
    queryCashProfit();

});
var showNovice = false;
var balance = 0;
var totalProfit = 0;
var dayIncome = 0;


function getIosStatus(st){
    showNovice = st;
    if(showNovice){
        $(".layers").show();
        $(".active_content").hide();
    } else {
        $(".layers").hide();
        $(".active_content").show();
    }
}

$(".layer-mask1").click(function () {
    $(".layer-mask1").hide();
    $(".layer-mask2").show();
});
$(".layer-mask2").click(function () {
    $(".layer-mask2").hide();
    $(".layer-mask3").show();
});
$(".layer-mask3").click(function () {
    $(".layers").hide();
    $(".active_content").show();
    var userAgent = navigator.userAgent;
    try{
        if (userAgent.indexOf("Android") > -1 || userAgent.indexOf("android") > -1) {
            if(typeof handler != 'undefined' && handler.updateGuide){
                handler.updateGuide("xjbAssetsWeb", 1);
            }
        } else {
            if (typeof window.webkit != 'undefined'){
                window.webkit.messageHandlers.updateGuide.postMessage({"name":"xjbAssetsWeb", "version": 1});
            }
        }
    } catch (err){
        $(".layers").hide();
        $(".active_content").show();
    }
});

var flag=true;
$(".question").click(function () {
    $(".mask").show();
});
$(".close").click(function () {
    $(".mask").hide();
});
$(".eyes").click(function () {
    if(flag){
        $(".eyes").css({"background": "url(../images/account/closeEyes.png) no-repeat no-repeat","background-size": "100% 100%"});
        $(".enshow").show();
        $(".isshow").hide();
        flag=false;
    }else{
        $(".eyes").css({"background": "url(../images/account/openEyes.png) no-repeat no-repeat", "background-size": "100% 100%"});
        $(".enshow").hide();
        $(".isshow").show();
        flag=true;
    }
});

function queryContractPay() {
    var url = "/ats-ng/v1/manage/contract-query/contract-pay-date";
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var info = result.body;
            //工资宝
            var list1 = new Array();
            if(App.isNotEmpty(info.lastMipDate)){
                var date = info.lastMipDate.substr(-4,2)+'-'+info.lastMipDate.substr(-2,2);
                list1.push({"date": date, "amt": App.formatMoney(info.lastMipAmt, 2), "status": getStDesc(info.lastMipSt)});
            }
            if(App.isNotEmpty(info.nextMipDate)){
                var date = info.nextMipDate.substr(-4,2)+'-'+info.nextMipDate.substr(-2,2);
                list1.push({"date": date, "amt": App.formatMoney(info.nextMipAmt, 2), "status": '将转'});
            }
            $(".func_list_1").append(getHtml('工资宝', 'htffundxjb://action?type=rca&subType=1','一次设置，工资定期转入，轻松赚取收益', list1));
            //还款专区
            var list2 = new Array();
            if(App.isNotEmpty(info.lastRepayDate)){
                var date = info.lastRepayDate.substr(-4,2)+'-'+info.lastRepayDate.substr(-2,2);
                list2.push({"date": date, "amt": App.formatMoney(info.lastRepayAmt, 2), "status": getStDesc(info.lastRepaySt)});
            }
            if(App.isNotEmpty(info.nextRepayDate)){
                var date = info.nextRepayDate.substr(-4,2)+'-'+info.nextRepayDate.substr(-2,2);
                list2.push({"date": date, "amt": App.formatMoney(info.nextRepayAmt, 2), "status": '将转'});
            }
            var title = '还款专区<span style="font-size: 0.6rem;">(还贷款/还信用卡)</span>';
            if(list2.length > 0){
                title = '还款专区';
            }
            $(".func_list_1").append(getHtml(title, 'htffundxjb://action?type=repay&subType=home','立即还款，实时到账；预约还款，月月安心', list2));
            //预约取现
            var list3 = new Array();
            if(App.isNotEmpty(info.lastRedDate)){
                var date = info.lastRedDate.substr(-4,2)+'-'+info.lastRedDate.substr(-2,2);
                list3.push({"date": date, "amt": App.formatMoney(info.lastRedAmt, 2), "status": getTakeBackStDesc(info.lastRedSt)});
            }
            if(App.isNotEmpty(info.nextRedDate)){
                var date = info.nextRedDate.substr(-4,2)+'-'+info.nextRedDate.substr(-2,2);
                list3.push({"date": date, "amt": App.formatMoney(info.nextRedAmt, 2), "status": '将取'});
            }
            $(".func_list_1").append(getHtml('预约取现', 'htffundxjb://action?type=tba&subType=1','定期取现，无额度限制，资金灵活安排', list3));
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
                list1.push({"date": date, "amt": App.formatMoney(result.amt, 2), "status": getShopName(result.shopName)});
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
    if(list != undefined && list != null){
        if(list.length == 2){
            var subHtml = '';
            list.forEach(function (txt, index) {
                var css = "";
                if(index > 0){
                    css = "color: #666666;";
                }
                subHtml += '<h4 class="black" style="'+ css +'"><span>'+ txt.date +'</span><span>'+ txt.amt +'元</span><span>'+ txt.status +'</span></h4>';
            });
            html = '<a href="'+ link +'" class="list list1">' +
                '                    <p class="black">'+ title +'</p>' +
                '                    <div class="middle">' +
                subHtml +
                '                    </div>' +
                '                </a>';
        } else if(list.length == 1){
            var subHtml = '';
            list.forEach(function (txt) {
                subHtml += '<span>'+ txt.date +'</span><span>'+ txt.amt +'元</span><span>'+ txt.status +'</span>';
            });
            html = '<a href="'+ link +'" class="list list1">' +
                '                    <p class="black">'+ title +'</p>' +
                '                    <div class="single black">' +
                subHtml +
                '                    </div>' +
                '                </a>';
        } else {
            html = '<a href="'+ link +'" class="list list1">' +
                '                    <div class="other">' +
                '                        <div class="other_title black">'+ title +'</div>' +
                '                        <div class="other_text gray">'+ remark +'</div>' +
                '                    </div>' +
                '                </a>';
        }
    }
    return html;
}

function queryCashProfit(){
    App.get("/assetcenter/v1/asset/cash-manager", null, function(result){
        if(result.body != undefined && result.body != null){
            var body = result.body;
            if(body != undefined && body != null){
                $(".total_balance").html(App.formatMoney(body.totalAmt, 2));
                $(".total_income").html(App.formatMoney(body.lastProfit, 2));
                $(".total_profit").html(App.formatMoney(body.totalProfit, 2));

                if(body.smacAsset != undefined && body.smacAsset != null){
                    var smacAsset = body.smacAsset;
                    $(".xjb_profit_title").html("七日年化");
                    //查询七日年化
                    //queryFundInfo();
	                var preffix = '';
	                if(String(smacAsset.yield).indexOf("-") > -1){
	                    $(".xjb_income").removeClass("red");
	                    $(".xjb_income").addClass("green");
	                } else {
	                    preffix = '+';
	                }

                    $(".xjb_income").html(preffix + App.formatMoney(100*smacAsset.yield,3) +"%");
                    if(smacAsset.totalAmt > 0){
                        $(".xjb_balance").html(App.formatMoney(smacAsset.totalAmt, 2));
                        var preffix = "";
                        if(Number(smacAsset.lastProfit) >= 0){
                            preffix = "+";
                        }
                        $(".xjb_day_yield").html(preffix + App.formatMoney(smacAsset.lastProfit, 2));
                    } else {
                        $(".xjb_take_back").hide();
                        $(".xjb_remark").html('<span>0.1折申购基金，快取额度6万</span>');
                    }
                }

                var version = App.getUrlParam("version");

                if(body.cashPlusAsset != undefined && body.cashPlusAsset != null){
                    var cashPlusAsset = body.cashPlusAsset;
                    var serialNo = cashPlusAsset.serialNo;
                    $(".xjj_profit_title").html("近一年收益率");
                    //近一年收益率
                    queryGroupFundDetail("2");
                    if(cashPlusAsset.totalAmt > 0){
                        $(".content_card_div_2").click(function() {
                            if(App.isNotEmpty(version) && Number(version) >= 5.7 && App.isNotEmpty(serialNo)){
                                window.location.href = "htffundxjb://action?type=fundGroup&subType=holdingDetail&groupId=A0081&balanceSerialNo="+serialNo;
                            }else{
                                window.location.href = "htffundxjb://action?type=as&subType=fg&groupType=08";
                            }
                            // window.location.href = "htffundxjb://action?type=as&subType=fg&groupType=08";
                        });
                        // $(".xjj_take_back").attr("href", "../fundgroup/redeem.html?groupId=A0081&groupType=08");
                        $(".xjj_balance").html(App.formatMoney(cashPlusAsset.totalAmt, 2));
                        var preffix = "";
                        if(Number(cashPlusAsset.lastProfit) >= 0){
                            preffix = "+";
                        } else {
                            $(".xjj_day_yield").removeClass("red");
                            $(".xjj_day_yield").addClass("green");
                        }
                        $(".xjj_day_yield").html(preffix + App.formatMoney(cashPlusAsset.lastProfit, 2));
                    } else {
                        $(".content_card_div_2").click(function() {
                            window.location.href = "htffundxjb://action?type=fg&subType=fgd&groupId=A0081";
                        });
                        $(".xjj_take_back").hide();
                        $(".xjj_remark").html('<span>优选货基与债基组合增强收益</span>');
                    }
                    if(App.isNotEmpty(version) && Number(version) > 5.5 && App.isNotEmpty(serialNo)){
                        $(".xjj_take_back").attr("href","htffundxjb://action?type=fg&subType=redeem&groupId=A0081&balanceSerialNo="+serialNo);
                    }else{
                        $(".xjj_take_back").attr("href","../fundgroup/redeem.html?groupId=A0081&groupType=08");
                    }
                }
            }
        }
    });
}

function queryGroupFundDetail(type){
    App.get("/mobile-bff/v1/fund-group/detailInfo?groupId=A0081", null, function(resultStr){
        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
        if(result.body != undefined && result.body != null){
            var detailInfo = result.body;
            if(detailInfo != undefined && detailInfo != ""){
                if(type == '1'){
                    var dayYield = 0;
                    if(App.isNotEmpty(detailInfo.dayYieldWap)){
                        dayYield = (Number(detailInfo.dayYieldWap) * 100).toFixed(4);
                    }
                    $(".xjj_income").html(App.formatMoney(dayYield, 4));
                }
                if(type == '2'){
                    var preffix = '';
                    if(Number(detailInfo.nearYearProfit) >= 0){
                        preffix = "+";
                    } else {
                        $(".xjj_income").removeClass("red");
                        $(".xjj_income").addClass("green");
                    }
                    $(".xjj_income").html(preffix + App.formatMoney(detailInfo.nearYearProfit, 3) + "%");
                }
            }
        }
    });
}

function queryFundInfo(){
    App.queryHomePageInfo(function () {
        var info = App.getSession(App.accountHomePageInfo);
        if(info != null || info != undefined){
            if(info.homeInfo != null || info.homeInfo != undefined){
                var preffix = '';
                if(info.homeInfo.yield.indexOf("-") > -1){
                    $(".xjb_income").removeClass("red");
                    $(".xjb_income").addClass("green");
                } else {
                    preffix = '+';
                }
                $(".xjb_income").html(preffix + info.homeInfo.yield);
            }
        }
    });
}