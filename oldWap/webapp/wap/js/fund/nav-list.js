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
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多'
            }
        },
        onScrollMove: function() {
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
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
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
    var fundid = App.getUrlParam("fundid");
    var url = App.projectNm + "/fund/query_yield_page?fundId=" + fundid + "&pageNo=" + page_No + "&date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        eval(execFun).call(this, result.body.yield)
    })
};

function addStart(navList) {
    var fundid = App.getUrlParam("fundid");
    App.setSession(App.navList + fundid, navList);
    var html = getHtml(navList);
    $("#thelist").empty();
    myScroll.refresh();
    $("#thelist").prepend(html)
};

function addEnd(navList) {
    var fundid = App.getUrlParam("fundid");
    App.setSession(App.navList + fundid, $.merge(App.getSession(App.navList + fundid), navList));
    var html = getHtml(navList);
    $("#thelist").append(html)
};

function getHtml(dataList) {
    var html = "";
    for (var i in dataList) {
        html += showNavInfo(dataList[i])
    };
    return html
};

function showNavInfo(obj) {
    var date = obj.changeDateFat;
    var nav = obj.nav;
    var yeid = 0;
    var fundtp = App.getUrlParam("fundtp");
    if (fundtp == 0) {
        yeid = obj.changeIncomeUnit
    } else {
        yeid = obj.yield
    };
    var html = "" + "<li class='trade_li_info'>" + "<div class='card-list1'>" + "<div class='left f-black f12'>" + date + "</div>" + "<div class='f12 f-red mid'>" + App.numberFormat(nav) + "</div>" + "<div class='rights " + showProfitCss(yeid) + "'>" + App.numberFormat(yeid) + "%</div>" + "</div>" + "</li>";
    return html
}