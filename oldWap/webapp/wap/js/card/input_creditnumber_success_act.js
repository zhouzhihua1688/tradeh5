$(function() {
    App.queryCard();
    App.queryCreditCard();
    App.queryUserInfo();
    var si = App.getSession(App.successInfo);
    $("#successInfo").html("&nbsp;&nbsp;&nbsp;&nbsp;绑卡成功！" + si);
    App.bind("#cancel", "tap", App.cancel_alert);
    App.bind("#confirm", "tap", inputTradePwd);
    App.bind("#redpacket_btn", "tap", function() {
        App.show_alert()
    })
});

function inputTradePwd() {
    App.unbind("#confirm", "tap", inputTradePwd);
    var pwd = $("#pwd").val();
    App.tradePwd(pwd, function() {
        App.bind("#confirm", "tap", inputTradePwd)
    }, function(result) {
        App.cancel_alert();
        App.setSession(App.successInfo, result.body.successInfo);
        window.location = "./binding_card_receiveBonus_success.html"
    })
}