var myFund = App.getSession(App.myFund);

function init() {
    if (myFund == null || myFund.length == 0) {
        queryMyFund();
        myFund = App.getSession(App.myFund)
    }
};
init();
$(function() {
    if (myFund != null) showFund(myFund);
    App.bind(".item", "tap", fundDetailInfo)
});

function queryMyFund() {
    var url = App.projectNm + "/fund/holding_fund_assets";
    App.get(url, null, function(result) {
        App.setSession(App.myFund, result.body);
        showFund(result.body)
    })
};

function fundDetailInfo() {
    var data = $(event.target).attr("data");
    var fundtp = $(event.target).attr("fundtp");
    if (data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 10; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break
        }
    };
    if (fundtp == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 10; i++) {
            target = target.parent();
            fundtp = target.attr("fundtp");
            if (fundtp != undefined) break
        }
    };
    window.location = "./myfund_detail.html?fundid=" + data + "&fundtp=" + fundtp
};

function showFund(datas) {
    var f_profit = 0;
    var data = datas['fundOwn'];
    for (var index in data) {
        var funditem = data[index];
        $(".fund_list").append('<div class="item" data="' + funditem.fund.fundId + '" fundtp="' + funditem.fund.fundTp + '">' + '<div class="leftbox">' + '<div class="title f16 f-black">' + funditem.fund.fundNm + '</div>' + '<div class="content f12">基金净值:<span class="f-orange">' + funditem.fund.nav + '</span></div>' + '<div class="content f12">基金市值:<span class="f-orange">' + App.numberFormat(funditem.fundValue) + '</span></div>' + '<div class="content f12">累计盈亏:<span class="' + showProfitCss(funditem.profit) + '">' + App.numberFormat(funditem.profit) + '</span></div>' + '</div>' + '<div class="rightbox">' + '<div class="chart" ><div style="30%"><canvas id="' + funditem.fund.fundId + '" height="72" width="78"></canvas></div></div>' + '</div>' + '</div>' + '<div class="line"></div>');
        f_profit = Number(f_profit) + Number(funditem.profit)
    };
    $("#f_profit").html(showProfit(f_profit));
    $("#f_value").html(App.numberFormat(datas.fundValue));
    App.bind(".item", "tap", fundDetailInfo)
}