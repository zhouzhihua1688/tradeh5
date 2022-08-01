$(function(){
    var cards = App.getSession(App.cards);
    if(cards == null || cards.length == 0){
        App.queryCard(function () {
            var cards = App.getSession(App.cards);
            if(cards.length > 0){
                queryAutoTopUpList();
            }else{
                alertTips("请先添加银行卡", "确定", function(){
                    window.location = "../card/manage_card.html";
                });
            }
        });
    }else{
        queryAutoTopUpList();
    }

    setFont();
    window.onresize = function(){
        setFont();
    };
    function setFont(){
        var windowWidth =  $(window).width();
        windowWidth = windowWidth> 750 ? 750 : windowWidth;
        $("html").css({"fontSize": windowWidth/(750/40) });
    }

});

function queryAutoTopUpList(){
    var url = App.projectNm + "/etrading/auto_recharge_query?date=" + (new Date()).getTime();
    App.get(url, null, function(result){
        var list = result.body.list;
        if(list.length > 0){
            window.location.href = "./autoTopUpList.html";
        }
    });
}