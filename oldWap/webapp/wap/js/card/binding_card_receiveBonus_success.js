$(function() {
    App.bind("#confirm_btn", "tap", function() {
        var url = App.projectNm + "/send_msg?date=" + (new Date()).getTime();
        App.get(url, null, function(result) {});
        if (App.isWeixin && typeof WeixinJSBridge != "undefined") {
            WeixinJSBridge.invoke('closeWindow', {}, function(res) {})
        }
    })
});