var fundid = App.getUrlParam("fundid");
var fundtp = App.getUrlParam("fundtp");
$(function() {
    var fundInfo = App.getSession(App.fundInfo + fundid);

    function init() {
        if (fundInfo == null || fundInfo.length == 0) {
            queryFundInfo();
            fundInfo = App.getSession(App.fundInfo + fundid)
        }
    };
    if (fundInfo != null) showFundInfo(fundInfo);
    init();
    App.bind("#invest", "tap", fundInvest);
    App.bind("#purchase", "tap", fundPurchase);
    App.bind("#chart_div", "tap", showNav);
});

function showNav() {
    window.location = "./nav_list.html?fundid=" + fundid + "&fundtp=" + fundtp + "&1421412"
};

function queryFundInfo() {
    // var url = App.projectNm + "/fund/fund_detail_info?fundId=" + fundid;
    var url =  "/mobile-bff/v1/fund/detailInfo";
    var data = JSON.stringify({
        "fundId": fundid
    });
    App.post(url, data, function(result) {
        App.setSession(App.fundInfo + fundid, result.body);
        fundtp = result.body.fundTp;
        showFundInfo(result.body);
        getFundFee();
    })
};

function getFundFee() {
    var url = "/mobile-bff/v1/fund/getFundInfoPage?productId="+fundid;

    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
			if(result.body.rateTip != ""){	
                var str = result.body.rateTip;
                $("#f_rate").html(str.substring(str.indexOf("：")+1,str.indexOf("，")));
			}
        }
    });
}

function showFundInfo(data) {
    $("#f_title").html(data.fundNm);
    $("#f_no").html(data.fundId + " " + showFundType(data.filterFundTp));
    $("#f_create").html(data.establishDate);
    $("#f_rate").html(data.curRate + "%");
    $("#f_ache").html(data.achievementData);
    $("#f_detail").html(data.detailInfo);
    $("#f_year").html(data.yearProfit.toFixed(2) + "%");
    $("#f_nav").html(data.nav);
    $("#f_date").html(data.navDtFat);
    $("#f_3mon").html(data.thrMonthProfit.toFixed(2) + "%");
    $("#f_mon").html(data.monthProfit.toFixed(2) + "%");
    $("#f_since").html(data.sinceProfit.toFixed(2) + "%");
    var Manainfo = data.fundManageInfos;
    for (var k in Manainfo) {
        var item = Manainfo[k];
        $("#entranceDate").html(item.entranceDate);
        $("#m_name").html(item.name);
        $("#resume").html(item.resume.substr(0, 60));
        $("#pic").html('<img src=' + item.picture + ' width="80" height="100" />')
    };
    if (data.canPurchase) {
        $("#purchase").show()
    };
    if (data.canMip) {
        $("#invest").show()
    }
};

function showChart(t) {
    $("canvas").attr("id", fundid);
    $("canvas").each(function() {
        var labelArr = new Array();
        var datastr = '';
        var fid = fundid;
        var cnt = 30;
        if (t == 'two') {
            cnt = 90
        } else if (t == 'three') {
            cnt = 360
        };
        var url = App.projectNm + "/fund/query_fund_yields?count=" + cnt + "&fundIds=" + fid;
        App.get(url, null, function(result) {
            var out = result.body.fundYields;
            for (var idindex in out) {
                var iditem = out[idindex];
                datastr = iditem.income;
                var dataArr = new Array();
                dataArr = datastr.split(",");
                if (dataArr.length > 1) {
                    for (i = 0; i < dataArr.length; i++) {
                        labelArr.push(i)
                    }
                }
            };
            if (dataArr.length <= 0) {
                labelArr = [1];
                dataArr = [1]
            };
            var lineChartData = {
                labels: labelArr,
                datasets: [{
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "#ff8203",
                    data: dataArr
                }]
            };
            if (dataArr.length <= 0) {
                labelArr = [1];
                dataArr = [1]
            };
            var lineChartData = {
                labels: labelArr,
                datasets: [{
                    fillColor: "rgba(220,220,220,0.4)",
                    strokeColor: "#ff8203",
                    data: dataArr
                }]
            };
            var maxV = Math.max.apply(null, dataArr) + 0.5;
            var minV = Math.min.apply(null, dataArr) > 0.5 ? Math.min.apply(null, dataArr) - 0.4 : 0.2;
            var stepw = ((maxV - minV) / 4);
            var ctx = document.getElementById(fid).getContext("2d");
            window.myLine = new Chart(ctx).Line(lineChartData, {
                showScale: true,
                scaleShowLabels: true,
                scaleOverride: true,
                scaleSteps: 4,
                scaleStepWidth: stepw,
                scaleStartValue: minV
            })
        })
    });
    App.bind("#chart_div", "tap", showNav)
};

function fundInvest() {
    window.location = "./invest.html?fundid=" + fundid + "&fundtp=" + fundtp
};

function fundPurchase() {
    window.location = "./purchase.html?fundid=" + fundid + "&fundtp=" + fundtp
};

function showchartBytype() {
    var type = $(this).attr("id");
    $(".tu-type").children("div").each(function() {
        $(this).removeClass("f-grey");
        $(this).removeClass("background-orange");
        if (type == $(this).attr("id")) {
            $(this).addClass("background-orange");
            $(this).addClass("f-white")
        } else {
            $(this).addClass("f-grey");
            $(this).removeClass("f-white")
        }
    });
    $("#chart_div").html('<canvas></canvas>');
};
var th = document.body.scrollHeight + 250;
$("body").css({
    'height': th - 150 + 'px'
});
$(".con-sec").click(function() {
    window.location = "./mandetail.html?fundid=" + fundid + "&fundtp=" + fundtp
});