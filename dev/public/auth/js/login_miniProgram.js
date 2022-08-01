/**
 * @date: 2021-01-18 17:43:57
 * @desc: 微信小程序登录/绑定页面
 */

$(function(){
    // 必须在微信浏览器中执行
    if(utils.isWeixin()){
        var ssoCookie = utils.getCookie("sso_cookie");
        if (ssoCookie) {//有登录态
            // S 20201230 微信小程序处理
            if (window.__wxjs_environment === 'miniprogram' ) { // 微信兼容性处理
                var referUrl = utils.getUrlParam("referUrl");
                wx.miniProgram.navigateTo({
                    url: '/pages/index/index?cookie=' + escape(document.cookie)
                         + '&referUrl=' + encodeURIComponent(referUrl)
                });
                return;
            }
            // E 20201230 微信小程序处理
        }else{
            var openId = utils.getUrlParam("__openId");
            var openUid = utils.getUrlParam("__openUid");

            openId && utils.setSession("__openId", openId);
            openUid && utils.setSession("__openUid", openUid);

        }
    }

    // 
    $(".rules").on('click', function(){
        $(".chose-icon").toggleClass("current");
    });
    utils.bind("#login_btn", "tap", login);
    utils.bind("#register_btn", "tap", function(){window.location = "./reg_step1.html";});

});


function login(){
    if(valide()){
        if(!$(".chose-icon").hasClass("current")){
            alertTips('<div style="padding: 1rem 1rem;line-height: 1.5;">请同意《汇添富基金微信服务平台身份验证协议》</div>');
            return;
        }
        
        //不需要验证码--滑动验证码
        utils.unbind("#login_btn", "tap", login);
        var phone = $(".phone").val();
        var pwd = $(".pwd").val();

        // var url = "/mobileEC/services/account/login_web";
        // var data = {"loginFrom":"W","certNum":phone,"password":pwd,"version":"5.6"};
        
        var url = "/mobile-bff/v1/login/login-wap";
        var data = {"accountName":phone,"password":pwd, "loginFrom": "W"};

        var openId = utils.getSession("__openId");
        var openUid = utils.getSession("__openUid");
        var channelCode = utils.getCookie("channelCode");
        channelCode && (data.channelCode = channelCode);
        openId && (data.openId = openId);
        openUid && (data.openUid = openUid);

        utils.post({
            url: url,
            data: JSON.stringify(data),
            beforeSend:  function(req){
                req.setRequestHeader("version", '6.8');
            },
            complete: function(result){
                utils.bind("#login_btn", "tap", login);
            },
            success: function(result){
                if(result.returnCode === 0){
                    console.log(result.body.tradeVerify);
                    utils.verifyTradeChain(result.body, successCallback);
                }
            }
        })

    }
}

function successCallback(result) {
    var referUrl = utils.getUrlParam("referUrl");
    // S 20201230 微信小程序处理
    if (window.__wxjs_environment === 'miniprogram' ) { // 微信兼容性处理
        wx.miniProgram.navigateTo({
            url: '/pages/index/index?cookie=' + escape(document.cookie) 
                + '&referUrl=' + encodeURIComponent(referUrl)
        });
        return;
    }
    // E 20201230 微信小程序处理
}