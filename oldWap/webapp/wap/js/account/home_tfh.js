$(function() {
    function setPanel(assets) {
        if (assets != null || assets != undefined) {
            $("#panel_totalVal").html(App.numberFormat(assets.totalValue));
            $("#panel_balance").html(App.numberFormat(assets.balance));
            $("#panel_regularVal").html(App.numberFormat(assets.regularValue));
            $("#panel_fundVal").html(App.numberFormat(assets.fundAddTrdVal));
            $("#panel_vipVal").html(App.numberFormat(assets.vipAsset))
        }
    };

    function init() {
        var actHomePageInfo = App.getSession(App.accountHomePageInfo);
        if (actHomePageInfo == null || actHomePageInfo == undefined) {
            App.queryHomePageInfo(function() {
                var acInfo = App.getSession(App.accountHomePageInfo);
                setPanel(acInfo.assets)
            })
        } else {
            setPanel(actHomePageInfo.assets)
        };

        App.bind(".my_top_asstes", "tap", function() {
            window.location = "./gaoduan.html" ;
        });
        $("#querySwitchBtn").attr("href", "../common/querySwitch_set_tfh.html?flag=0");
        queryBanner()
    };
    init()
});

function queryBanner() {
    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wxHomeBanner&date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        if (result.returnCode == 0 && result.body != undefined && result.body != null) {
            var layoutList = result.body.layout;
            for (index in layoutList) {
                var layout = layoutList[index];
                if (layout != undefined && layout != null) {
                    var dataUrl = App.projectNm + layout.requestUrl.substr(8);
                    App.get(dataUrl, null, function(res) {
                        if (res.returnCode == 0 && res.body != undefined && res.body != null) {
                            var themeList = res.body.theme;
                            for (i in themeList) {
                                var theme = themeList[i];
                                var themeDataList = theme.object;
                                for (j in themeDataList) {
                                    themeData = themeDataList[j];
                                    $(".five-g").append("<a href='" + themeData.url + "'><img src='" + themeData.imageUrl + "'/></a>")
                                }
                            }
                        }
                    })
                }
            }
        }
    })
}