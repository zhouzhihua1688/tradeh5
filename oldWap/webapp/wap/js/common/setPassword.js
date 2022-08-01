$(function () {

    var flag = false;
    var ul = $(".pwd-area ul");
    var li = $(".pwd-area li");
    var pnt = $(".pwd-area li i");
    var pwd = $(".pwd-area input");
    ul.on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if(flag){
            flag = false;
        } else {
            flag = true;
            pwd.focus();
        }
        return;
    });
    var bind_name="input";//定义所要绑定的事件名称
    if(navigator.userAgent.indexOf("MSIE")!=-1){
        bind_name="propertychange";//判断是否为IE内核 IE内核的事件名称要改为propertychange
    }
    pwd.on(bind_name, function (event) {
        var value = pwd.val().match(/\d{0,6}/g)[0];
        pwd.val("");
        value !== "" && pwd.val(value);
        var len = value.length;
        for (var i = 0; i < 6; i++) {
            i < len ? pnt.eq(i).css({"display": "block"}) : pnt.eq(i).hide();
        };
        return;
    });
    App.bind(".btn-password", "tap", tradeConfirm);

});

function tradeConfirm(){

    var myPassword=$(".pwd-area input").val();
    if (myPassword.length!==6){
        alertTips('密码错误');
        return;
    }else {
        App.unbind(".btn-password", "tap", tradeConfirm);
        App.tradePwd(myPassword, function(){
            App.bind(".btn-password", "tap", tradeConfirm);
            $(".pwd-area li i").hide();
            $(".pwd-area input").val('');
        }, function(result){
            App.setSession(App.successInfo, result.body.successInfo);
            App.setSession(App.tradeResultInfo, result);
            window.location = App.getSession(App.serialNo_forword_url);
        });
    }


}