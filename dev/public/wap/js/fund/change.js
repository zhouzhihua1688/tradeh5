var fundInfo = App.getSession(App.fundInfo + fundid);
var newsfundid = App.getUrlParam("newfundid");
var newfundInfo = App.getSession(App.fundInfo + newsfundid);
var myFund = App.getSession(App.myFund);
var limit = App.getSession(App.fundInfo + newsfundid + fundid + "limit");

function init() {
    if (fundInfo == null || fundInfo.length == 0) {
        queryFundInfo(fundid);
        fundInfo = App.getSession(App.fundInfo + fundid)
    };
    if (myFund == null || myFund.length == 0) {
        queryMyFund();
        myFund = App.getSession(App.myFund)
    };
    if (newfundInfo == null || newfundInfo.length == 0) {
        queryFundInfo(newsfundid);
        newfundInfo = App.getSession(App.fundInfo + newsfundid)
    }
};
init();
$(function() {
    App.bind("#change", "tap", function() {
        if ($("#nums").val() == '') {
            alert("转换份数不能为空");
            return
        };
        var url = App.projectNm + "/fund/fund_convert";
        var data = JSON.stringify({
            "fundId": fundid,
            "toFundId": newsfundid,
            "shareType": "A",
            "subQuty": $("#nums").val(),
            "largeRedeemFlag": "0"
        });
        App.post(url, data, function() {}, function(result) {
            App.show_alert();
            $("#alert_info").html(result.body.info);
            App.setSession(App.serialNo, result.body.serialNo)
        })
    });
    if (myFund) {
        var data = myFund['fundOwn'];
        for (var index in data) {
            var funditem = data[index];
            if (funditem.fund.fundId == fundid) {
                $("#f_hold").html(funditem.balance);
                $("#f_use").html(funditem.avaliable);
                $("#f_name").html(funditem.fund.fundNm)
            }
        }
    };
    if (newfundInfo) {
        if (newfundInfo.fundId == newsfundid) {
            $("#f_nname").html(newfundInfo.fundNm)
        }
    };
    App.bind(".card-list1", "tap", handlerLimit);
    App.bind("#limit_div_btn", "tap", function() {
        $("#ch_panel").hide();
        $("#selected_limit_panel").show()
    });
    if (limit != null) {
        $("#b_limit").html(limit)
    } else {
        $("#b_limit").html("放弃超限")
    };
    App.bind("#newfund", "tap", function() {
        window.location = "./search.html?fundid=" + fundid + "&fundtp=" + fundtp
    });
    App.bind("#cancel", "tap", App.cancel_alert);
    App.bind("#confirm", "tap", inputTradePwd)
});

function queryFundInfo(fid) {
    // var url = App.projectNm + "/fund/fund_detail_info?fundId=" + fid;
    var url =  "/mobile-bff/v1/fund/detailInfo";
    var data = JSON.stringify({
        "fundId": fid
    });
    App.post(url, data, function(result) {
        App.setSession(App.fundInfo + fid, result.body);
        $("#f_nname").html(result.body.fundNm)
    })
};

function handlerLimit() {
    var data = $(event.target).attr("data");
    if (data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 4; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break
        }
    };
    var array = String(data).split(",");
    $(":radio[name='card']")[array[0]].checked = true;
    App.setSession(App.fundInfo + newsfundid + fundid + "limit", array[1]);
    $("#b_limit").html(array[1]);
    $("#ch_panel").show();
    $("#selected_limit_panel").hide()
};

function inputTradePwd() {
    App.unbind("#confirm", "tap", inputTradePwd);
    var pwd = $("#pwd").val();
    App.tradeBffPwd(pwd, function() {
        App.bind("#confirm", "tap", inputTradePwd)
    }, function(result) {
        App.cancel_alert();
        App.setSession(App.successInfo, result.body.successInfo);
        window.location = "./changesuccess.html"
    })
};
var th = document.body.scrollHeight;
if (th > 700) {
    $("#zftype").css({
        'margin-left': '20%'
    })
} else if (th > 600) {
    $("#zftype").css({
        'margin-left': '10%'
    })
}