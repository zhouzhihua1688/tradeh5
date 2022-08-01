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
    $(".Bomb-box-ok").click(function () {
        $(".Bomb-box").hide();
    });
    $(".btn-password").on("click",function () {
        var myPassword=$(".pwd-area input").val();
        if (myPassword.length!==6){
            alertTips('密码错误');
            return;
        }else {
            App.setSession(App.cardBindCardpwd_1_Info, myPassword);
            var referUrl = App.getUrlParam("referUrl");
            var fromBindCard = utils.getUrlParam("fromBindCard");
            window.location.href = "bindCardInputPassword_2.html" + (App.isEmpty(referUrl) ? "?fromBindCard=" + fromBindCard : "?referUrl=" + encodeURIComponent(referUrl)+"&fromBindCard="+ fromBindCard);
        }

    })

});