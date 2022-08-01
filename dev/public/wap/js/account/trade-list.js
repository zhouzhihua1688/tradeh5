var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset = 0;

function pullDownAction() {
    setTimeout(function() {
        pageUp();
        myScroll.refresh()
    }, 1000)
};

function pullUpAction() {
    setTimeout(function() {
        pageDown();
        myScroll.refresh()
    }, 1000)
};

function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        onRefresh: function() {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新'
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多'
            }
        },
        onScrollMove: function() {
            console.log(this.maxScrollY);
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '放开刷新';
                this.minScrollY = 0
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
                this.minScrollY = -pullDownOffset
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip') && this.y < -50) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '放开刷新';
                this.maxScrollY = this.maxScrollY
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载更多';
                this.maxScrollY = pullUpOffset
            }
        },
        onScrollEnd: function() {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                pullUpAction();
            }
        }
    });
    pageUp();
    myScroll.refresh();
    setTimeout(function() {
        document.getElementById('wrapper').style.left = '0'
    }, 800)
};
document.addEventListener('touchmove', function(e) {
    e.preventDefault()
}, false);
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loaded, 200)
}, false);
var pageNo = 1;

function pageUp() {
    pageNo = 1;
    queryTradeList(addStart, 1)
};

function pageDown() {
    pageNo = pageNo + 1;
    queryTradeList(addEnd, pageNo)
};

function queryTradeList(execFun, page_No) {
    var url = App.projectNm + "/query/ec_query?tradeSt=&changeSt=&order=&pageNo=" + page_No + "&date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        eval(execFun).call(this, result.body.ecTrade);
        App.bind(".trade_li_info", "tap", tradeDetailInfo)
    })
};

function addStart(tradeList) {
    App.setSession(App.tradeInfoList, tradeList);
    var html = getHtml(tradeList);
    $("#thelist").empty();
    myScroll.refresh();
    $("#thelist").prepend(html)
};

function addEnd(tradeList) {
    App.setSession(App.tradeInfoList, $.merge(App.getSession(App.tradeInfoList), tradeList));
    var html = getHtml(tradeList);
    $("#thelist").append(html)
};

function getHtml(dataList) {
    var html = "";
    for (var i in dataList) {
        html += showTradeInfo(dataList[i])
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

function showTradeRowInfo(apKind, serialNo, apKindName, tradeSt, subQuty, subAmt, tradeDate, apKind_list) {
    var subAmtTxt = TradeTools.getAmt(subQuty, subAmt, apKind, apKind_list);
    var html = "<li class='trade_li_info' data='" + serialNo + "-" + tradeDate + "'>" + "<div class='card-list1'>" + "<div class='left'>" + "<div style='margin-left: 5px'>" + "<div class='f-black f12'>" + apKindName + "</div>" + "<div class='f12'>" + tradeDate + "</div>" + "</div>" + "</div>" + "<div class='right'>" + "<div>" + "<div class='f-black f12'>" + subAmtTxt + "</div>" + "<div class='f12' " + (tradeSt.indexOf("处理中") > -1 ? "style='color:red'" : "") + " >" + tradeSt + "</div>" + "</div>" + "<div style='margin-left: 10px'><img src='../images/common/tips.png'></div>" + "</div>" + "</div>" + "</li>";
    return html
};

function tradeDetailInfo() {
    var data = $(event.target).attr("data");
    if (data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 10; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break
        }
    };
    window.location = "./trade_detail.html?sid=" + data
}