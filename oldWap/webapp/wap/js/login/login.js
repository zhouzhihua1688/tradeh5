$(function() {
    App.bind("#login_btn", "tap", login);
    App.bind("#register_btn", "tap", function() {
        window.location = "./reg_step1.html"
    })
});

function login() {
    App.unbind("#login_btn", "tap", login);
    var loginName = $("#username").val();
    var loginPwd = $("#password").val();
    var url = App.projectNm + "/account/login_web";
    var data = JSON.stringify({
        "loginFrom": "4",
        "certNum": loginName,
        "password": loginPwd
    });
    App.post(url, data, function() {
        App.bind("#login_btn", "tap", login)
    }, function(result) {
        App.clearSession();
        App.setSession(App.userInfo, result.body);
        //加cookie 区分公众号登录入口
        var entryChannel = App.getCookie("entryChannel");
        if(entryChannel != "" && entryChannel != undefined){
        	App.setCookie("loginChannel",entryChannel);
        }
        window.location = "../index/index.html?d=" + (new Date()).getTime()
    })
}