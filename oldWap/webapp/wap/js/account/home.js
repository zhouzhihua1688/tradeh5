$(function () {
    function setPanel(assets){
        if(assets != null || assets != undefined){
            $("#panel_totalVal").html(App.numberFormat(assets.totalValue));
            $("#panel_balance").html(App.numberFormat(assets.balance));
            $("#panel_regularVal").html(App.numberFormat(assets.regularValue));
            $("#panel_fundVal").html(App.numberFormat(assets.fundAddTrdVal));
            $("#panel_vipVal").html(App.numberFormat(assets.vipAsset));
        }
    }
    function init(){
        // var actHomePageInfo = App.getSession(App.accountHomePageInfo);
        // if(actHomePageInfo == null || actHomePageInfo == undefined){
            App.queryHomePageInfo(function () {
                var acInfo = App.getSession(App.accountHomePageInfo);
                setPanel(acInfo.assets);
            });
        // }else {
        //     setPanel(actHomePageInfo.assets);
        // }
    }
    App.bind(".xjb_item_btn", "tap", function(){
        window.location = "./xjb_index.html";
    });
    App.bind(".topup_btn", "tap", function(){
        window.location = "./topup.html";
    });
    App.bind(".gongzibao_btn", "tap", function(){
        window.location = "./gongzibao.html";
    });
    init();
    queryAutoTopUpList();
});

function queryAutoTopUpList(){
    var url = App.projectNm + "/etrading/auto_recharge_query?date=" + (new Date()).getTime();
    App.get(url, null, function(result){
        var list = result.body.list;
        if(list.length > 0){
            App.unbindAll(".gongzibao_btn", "tap");
            App.bind(".gongzibao_btn", "tap", function(){
                window.location.href = "./autoTopUpList.html";
            });
        }
    });
}

/**
 * Created by LH on 2014/12/1.
 */
