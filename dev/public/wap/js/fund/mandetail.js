$(function() {
    var fundInfo = App.getSession(App.fundInfo + fundid);

    function init() {
        if (fundInfo == null || fundInfo.length == 0) {
            queryFundInfo();
            fundInfo = App.getSession(App.fundInfo + fundid)
        }
    };
    if (fundInfo != null) showFundInfo(fundInfo);
    init()
});

function showNav() {
    window.location = "./nav_list.html?fundid=" + fundid + "&fundtp=" + fundtp
};

function queryFundInfo() {
    // var url = App.projectNm + "/fund/fund_detail_info?fundId=" + fundid;
    var url =  "/mobile-bff/v1/fund/detailInfo?r=" + (Math.random() * 10000).toFixed(0);
    var data = JSON.stringify({
        "fundId": fundid
    });
    App.post(url, data, function(result) {
        App.setSession(App.fundInfo + fundid, result.body);
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
        $("#resume").html(item.resume);
        $("#pic").html('<img src=' + item.picture + ' width="80" height="100" />')
    };
    if (data.canPurchase) {
        $("#purchase").show()
    };
    if (data.canMip) {
        $("#invest").show()
    }
};
var th = document.body.clientHeight + 220;
$("body").css({
    'height': th + 'px'
});