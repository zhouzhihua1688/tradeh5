var fundInfo = App.getSession(App.fundInfo + fundid);
var myFund = App.getSession(App.myFund);
var fundfit = App.getSession(App.fundInfo + fundid + "fit");

function init() {
    if (fundInfo == null || fundInfo.length == 0) {
        queryFundInfo();
        fundInfo = App.getSession(App.fundInfo + fundid)
    };
    if (myFund == null || myFund.length == 0) {
        queryMyFund();
        myFund = App.getSession(App.myFund)
    } else {
        if (myFund) {
            var data = myFund['fundOwn'];
            for (var index in data) {
                var funditem = data[index];
                if (funditem.fund.fundId == fundid) {
                    $("#f_total").html(funditem.fundValue);
                    $("#f_hold").html(funditem.balance);
                    $("#f_use").html(funditem.avaliable);
                    $("#f_profit").html(funditem.profit);
                    var fits = "";
                    if (funditem.melonmd == 0) {
                        fits = "红利再投"
                    } else if(funditem.melonmd == "-1"){
                        fits = "请至代销机构处查询";
                    } else {
                        fits = "现金分红"
                    };
                    $("#f_fits").html(fits);
                    if (funditem.canConvert) {
                        $("#change").show()
                    } else {
                        $("#change").parent().remove()
                    };
                    if (funditem.fund.canPurchase) {
                        $("#purchase").show()
                    } else {
                        $("#purchase").parent().remove()
                    };
                    if (funditem.canRedeem) {
                        $("#back").show()
                    } else {
                        $("#back").parent().remove()
                    }
                }
            }
        }
    }
};
$("#purchase").hide();
$("#back").hide();
$("#change").hide();
init();
$(function() {
    $("#url").attr("href", "detail.html?fundid=" + fundid + "&fundtp=" + fundtp);
    if (fundInfo) {
        $("#f_title").html(fundInfo.fundNm);
        $('#f_nav').html(fundInfo.nav);
        $('#f_rate').html(fundInfo.nav);
        $('#f_rate').html(App.numberFormat(fundInfo.yield) + "%")
    };
    App.bind("#purchase", "tap", function() {
        window.location = "./purchase.html?fundid=" + fundid + "&fundtp=" + fundtp
    });
    App.bind("#back", "tap", function() {
        window.location = "./back.html?fundid=" + fundid + "&fundtp=" + fundtp
    });
    App.bind("#change", "tap", function() {
        window.location = "./changelist.html?fundid=" + fundid + "&fundtp=" + fundtp
    });
    App.bind(".card-list1", "tap", handlerFit);
    App.bind("#fit_btn", "tap", function() {
        $("#mf_panel").hide();
        $("#selected_fit_panel").show()
    });
    if (fundfit != null) {
        $("#f_fits").html(fundfit)
    }
});

function handlerFit() {
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
    App.setSession(App.fundInfo + fundid + "fit", array[1]);
    $("#f_fits").html(array[1]);
    $("#mf_panel").show();
    $("#selected_fit_panel").hide()
};

function queryMyFund() {
    var url = App.projectNm + "/fund/holding_fund_assets";
    App.get(url, null, function(result) {
        App.setSession(App.myFund, result.body);
        var myFunds = result.body;
        if (myFunds) {
            var data = myFunds['fundOwn'];
            for (var index in data) {
                var funditem = data[index];
                if (funditem.fund.fundId == fundid) {
                    $("#f_total").html(funditem.fundValue);
                    $("#f_hold").html(funditem.balance);
                    $("#f_use").html(funditem.avaliable);
                    $("#f_profit").html(funditem.profit);
                    var fits = "";
                    if (funditem.melonmd == 0) {
                        fits = "红利再投"
                    } else if(funditem.melonmd == "-1"){
                        fits = "请至代销机构处查询";
                    } else {
                        fits = "现金分红"
                    };
                    $("#f_fits").html(fits);
                    if (funditem.canConvert) {
                        $("#change").show()
                    } else {
                        $("#change").parent().remove()
                    };
                    if (funditem.fund.canPurchase) {
                        $("#purchase").show()
                    } else {
                        $("#purchase").parent().remove()
                    };
                    if (funditem.canRedeem) {
                        $("#back").show()
                    } else {
                        $("#back").parent().remove()
                    }
                }
            }
        }
    })
};

function queryFundInfo() {
    var url = App.projectNm + "/fund/fund_detail_info?fundId=" + fundid;
    App.get(url, null, function(result) {
        App.setSession(App.fundInfo + fundid, result.body);
        $("#f_title").html(result.body.fundNm);
        $("#f_title1").html(result.body.fundNm);
        $('#f_nav').html(result.body.nav);
        $('#f_rate').html(App.numberFormat(result.body.yield) + "%")
    })
};
if ($(".bottom_bar").children('div').length == 1) {
    $(".bottom_bar").css({
        'margin-left': '43%'
    })
} else if ($(".bottom_bar").children('div').length == 2) {
    $(".bottom_bar").css({
        'margin-left': '25%'
    })
} else if ($(".bottom_bar").children('div').length == 3) {
    $(".bottom_bar").css({
        'margin-left': ''
    })
}