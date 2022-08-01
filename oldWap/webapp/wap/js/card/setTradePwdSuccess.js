$(function() {
	App.setSession("only_set_trade_pwd",0);
    App.queryCard();
    App.queryUserInfo()
    var referUrl = App.getUrlParam("referUrl");
    if(App.isNotEmpty(referUrl)){
    	window.location = referUrl;
    }
});