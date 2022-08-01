$(function() {
    var oid = App.getUrlParam("oid");
    $("#querySwitchBtn").attr("href", "http://202.152.179.245/weixin/common/querySwitch_set_tfh.html?oid=" + oid + "&flag=0")
});
$(".grid-list li").click(function() {
    $(this).addClass("current").siblings().removeClass("current")
});
var myscroll = new iScroll("wrapper", {
    onScrollMove: function() {
        if (!$('.pull_icon').hasClass('loading')) {
            if (this.y < (this.maxScrollY)) {
                $('.pull_icon').addClass('flip');
                $('.pull_icon').removeClass('loading');
                $('.more span').text('释放加载...')
            } else {
                $('.pull_icon').removeClass('flip loading');
                $('.more span').text('上拉加载...')
            }
        };
        if (this.y > (this.minScrollY)) {}
    },
    onScrollEnd: function() {
        if (!$('.pull_icon').hasClass('loading')) {
            if ($('.pull_icon').hasClass('flip')) {
                $('.pull_icon').addClass('loading');
                $('.more span').text('加载中...');
                pullUpAction()
            }
        }
    },
    onRefresh: function() {
        $('.pull_icon').removeClass('flip loading');
        $('.more span').text('上拉加载...')
    }
});
var pageNo = 0;
loadData();

function loadData() {
    setTimeout(function() {
        pageDown();
        setTimeout(function() {
            myscroll.refresh()
        }, 50)
    }, 1000)
};

function pullUpAction() {
    loadData()
};

function addEnd(tradeList) {
    var html = getHtml(tradeList);
    $('.scroller ul').append(html)
};

function pageDown() {
    pageNo = pageNo + 1;
    queryTradeList(addEnd, pageNo)
};

function getHtml(dataList) {
    var html = "";
    for (var i in dataList) {
        // html += showTradeInfo(dataList[i])
        html += showTradeItem(dataList[i]);
    };
    return html
};

function showTradeInfo(obj) {
    var title = obj.title;
    var tradeSt = obj.tradeSt;
    var serialNo = obj.serialNo;
    var html = "";
    if (obj.accountTrade != null) {
        var apKind_list = "900,922,924,925,926,930,939,952,969";
        html = showTradeRowInfo(obj.apKind, serialNo, title, tradeSt, obj.accountTrade.subQuty, obj.accountTrade.subAmt, obj.accountTrade.tradeDate, apKind_list)
    } else if (obj.fundTrade != null) {
        var apKind_list = "020,021,022,023,039,049,920,940,949,950,043,142,143,024,951,036";
        html = showTradeRowInfo(obj.apKind, serialNo, title, tradeSt, obj.fundTrade.subQuty, obj.fundTrade.subAmt, obj.fundTrade.tradeDate, apKind_list)
    } else if (obj.financialTrade != null) {
        var apKind_list = "020,021,022,023,025,920,940,949,950,024,951";
        html = showTradeRowInfo(obj.apKind, serialNo, title, tradeSt, obj.financialTrade.subQuty, obj.financialTrade.subAmt, obj.financialTrade.tradeDate, apKind_list)
    } else if (obj.creditRepay != null) {
        var apKind_list = "8888,8889";
        html = showTradeRowInfo(obj.apKind, serialNo, title, tradeSt, obj.creditRepay.subQuty, obj.creditRepay.subAmt, obj.creditRepay.tradeDate, apKind_list)
    } else if (obj.mobileRecharge != null) {
        var apKind_list = "701,707,708";
        html = showTradeRowInfo(obj.apKind, serialNo, title, tradeSt, obj.mobileRecharge.subQuty, obj.mobileRecharge.subAmt, obj.mobileRecharge.tradeDate, apKind_list)
    };
    return html
};

function showTradeItem(item){
    var html = "<li class='trade_li_info clearfix' data='" + (item.serialNo ? item.serialNo : '') + "-" + (item.tradeDt ? item.tradeDt : '') + '&nbsp;' + (item.tradeTm ? item.tradeTm : '') + "'>" 
                + "<div class='fl'><p>" + (item.tradeTypeBriefName ? item.tradeTypeBriefName : '') + '&nbsp;' + (item.tradeName ? item.tradeName : '') + "</p>" 
                + "<span class='font-arial'>"+ (item.tradeDt ? item.tradeDt : '') + '&nbsp;' + (item.tradeTm ? item.tradeTm : '') + "</span>" 
                +"</div>" + "<div class='fr'>" 
                + "<p class='font-arial'>" + (item.tradeAmount? item.tradeAmount : '') + (item.tradeUnit ? item.tradeUnit : '') + "</p>" 
                + "<span " + ((item.tradeStatusName.indexOf("处理中") > -1) ? "class='leave'" : "") + " >" + (item.tradeStatusName ? item.tradeStatusName : '') + "</span>" + "</div>" + "</li>";
    return html;

}

function showTradeRowInfo(apKind, serialNo, apKindName, tradeSt, subQuty, subAmt, tradeDate, apKind_list) {
    var subAmtTxt = TradeTools.getAmt(subQuty, subAmt, apKind, apKind_list);
    var html = "<li class='trade_li_info clearfix' data='" + serialNo + "-" + tradeDate + "'>" + "<div class='fl'><p>" + apKindName + "</p>" + "<span class='font-arial'>" + tradeDate + "</span>" + "</div>" + "<div class='fr'>" + "<p class='font-arial'>" + subAmtTxt + "</p>" + "<span " + ((tradeSt.indexOf("处理中") > -1) ? "class='leave'" : "") + " >" + tradeSt + "</span>" + "</div>" + "</li>";
    return html
};

function queryTradeList(execFun, page_No) {
    //20210120 配合反腐others下线，替换新接口
    var pageSize = 10;
    var branchNo = '247';
    var url = '/ess/v1/trade/tradeinfos?'        
    + "&pageNo=" + page_No
    + "&pageSize=" + pageSize
    + "&branchNo="+ branchNo;
    App.get(url, null, function(result){
        if(result.returnCode == 0 && result.body){
            addEnd(result.body);
        }
    })
}