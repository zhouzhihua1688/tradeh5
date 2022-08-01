$(function(){

    var ic = utils.getSession('ic') || '';
    var actId = utils.getSession('actId') || '1003';
    utils.setSession("ic", ic);
    utils.setSession("actId", actId);

    var code = utils.getSession('__code');
    var channelCode = utils.getCookie('channelCode');
    var data = {authCode: code, htfChannelCode: channelCode };
    data = JSON.stringify(data);
   
    $.ajax({
        url: '/uaa/v1/third-part/login',
        type: 'POST',
        contentType: 'application/json',
        data: data,
        dataType:"json", 
        success:function(result){
            console.log('codeLoginRequest success result=', result);
            utils.codeLoginLoading = false;
            // 判断通过code获取到的openId和电商系统的custNo绑定情况
            switch(result.returnCode){
                case 0:
                    // 用户已绑定，正常获取到sso_cookie
                    utils.removeSession(utils.userInfo);
                    // 保存openId，openUid等参数，绑卡页面获取小米端银行卡号时使用
                    if(result.body && result.body.openId){
                        utils.setSession("__openId", result.body.openId);
                        utils.setCookie("__openId", result.body.openId);
                    }
                    if(result.body && result.body.openUid){
                        utils.setSession("__openUid", result.body.openUid);
                        utils.setCookie("__openUid", result.body.openUid);
                    }
                    if(result.body && result.body.userSalt){ // 小米金融使用，userSalt
                        utils.setSession("__userSalt", result.body.userSalt);
                    }
                    if(result.body && result.body.custInfo){ // 小米金融使用，custInfo
                        utils.setSession("__custInfo", result.body.custInfo);
                    }

                    var referUrl = utils.getUrlParam('referUrl');
                    // referUrl存在：    当前是login页面，跳转到referUrl页面
                    // referUrl不存在：1.当前是login页面，跳转到unbind.html页面（微信）or跳转到主页/wezhan/service.html
                    // referUrl不存在：2.当前具体业务页面，重新刷新当前页面
                    if(!referUrl){
                        if(/login([^\/]*)?.html$/.test(window.location.pathname)){
                            if(utils.isWeixin()){
                                referUrl = '/tradeh5/newWap/auth/unbind.html';
                            } else {
                                // referUrl = '/tradeh5/newWap/myAssets/index.html';   // 我的资产首页，暂时做测试
                                referUrl = '/mobileEC/wap/wezhan/service.html';
                            }
                        } else {
                            referUrl = window.location.href;
                        }
                    }

                    // referUrl = utils.removeCodeFromUrl(referUrl);
                    // referUrl = utils.removeChannelCodeFromUrl(referUrl);

                    // alert('0 jump referUrl=' + referUrl);
                    // window.location.href = referUrl;

                    //window.location.replace(referUrl);
                    var activityUrl = '/activity-center/api/v1/user/query/get-take-part-list?actId=' + actId;
                    $.get(activityUrl,function(result){
                        console.log(result.body);
                        if(result.returnCode ==0 && channelCode === 'airstar'){
                            if(result.body != undefined && result.body != null && result.body.length != 0) {
                                $(".content").html("您已参与活动，如您未完善信息，</br>请立即完善后查看奖励");
                                $(".back").html('查看奖励');
                                $(".view-hot-fund").html('立即完善');
                            }
                            else{
                                $(".content").html("您已注册过汇添富账户，</br>不可参与活动，感谢您的关注！");
                                $(".back").html('返回');
                                $(".view-hot-fund").html('查看热门好基');
                            }
                            $(".picture").show();
                            $(".content").show();
                            $(".btn-group").show();
                        }else{
                            console.log('result.returnMsg=', result.returnMsg);  
                            utils.showTips('网络开小差了，请稍后再试');  
                        }
                    })
                    break;
                case 1003:
                    // 用户未绑定，跳转到登陆页面
                    // 保存openId，openUid等参数，登录绑定页面使用
                    if(result.body && result.body.openId){
                        utils.setSession("__openId", result.body.openId);
                        utils.setCookie("__openId", result.body.openId);
                    }
                    if(result.body && result.body.openUid){
                        utils.setSession("__openUid", result.body.openUid);
                        utils.setCookie("__openUid", result.body.openUid);
                    }
                    if(result.body && result.body.userSalt){ // 小米金融使用，userSalt
                        utils.setSession("__userSalt", result.body.userSalt);
                    }
                    if(result.body && result.body.custInfo){ // 小米金融使用，custInfo
                        utils.setSession("__custInfo", result.body.custInfo);
                    }
                    
                    if(/login([^\/]*)?.html$/.test(window.location.pathname)){
                        // 当前是登录/绑定页面，不需要再跳转
                        break;
                    }
                    
                    var referUrl = window.location.href;
                    referUrl = utils.removeCodeFromUrl(referUrl);
                    referUrl = utils.removeChannelCodeFromUrl(referUrl);

                    // alert('1003 jump referUrl=' + referUrl);

                    // if(channelCode === 'airstar'){
                    //     // window.location.href = '/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(referUrl);
                    //     window.location.replace('/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(referUrl));
                    // } else {
                    //     // window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl);
                    //     window.location.replace('/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl));
                    // }

                    var activityUrl = '/activity-center/api/v1/user/query/get-take-part-list?actId=' + actId;
                    $.get(activityUrl,function(result){
                        console.log(result.body);
                        if(result.returnCode ==0 && channelCode === 'airstar'){
                            if(result.body != undefined && result.body != null && result.body.length != 0) {
                                $(".content").html("您已参与活动，如您未完善信息，</br>请立即完善后查看奖励");
                                $(".back").html('查看奖励');
                                $(".view-hot-fund").html('立即完善');
                            }
                            else{
                                $(".content").html("您已注册过汇添富账户，</br>不可参与活动，感谢您的关注！");
                                $(".back").html('返回');
                                $(".view-hot-fund").html('查看热门好基');
                            }
                            $(".picture").show();
                            $(".content").show();
                            $(".btn-group").show();
                        }else{
                            console.log('result.returnMsg=', result.returnMsg);  
                            utils.showTips('网络开小差了，请稍后再试');                         
                        }
                    })
                    break;
                case 1004:
                    // 1004，未绑定，且在电商平台未注册，跳转到注册页面
                    // 保存openId，openUid等参数，登录绑定页面使用
                    if(result.body && result.body.openId){
                        utils.setSession("__openId", result.body.openId);
                        utils.setCookie("__openId", result.body.openId);
                    }
                    if(result.body && result.body.openUid){
                        utils.setSession("__openUid", result.body.openUid);
                        utils.setCookie("__openUid", result.body.openUid);
                    }
                    if(result.body && result.body.userSalt){ // 小米金融使用，userSalt
                        utils.setSession("__userSalt", result.body.userSalt);
                    }
                    
                    var referUrl = window.location.href;
                    referUrl = utils.removeCodeFromUrl(referUrl);
                    referUrl = utils.removeChannelCodeFromUrl(referUrl);

                    // alert('1004 jump referUrl=' + referUrl);
                    if(channelCode === 'airstar'){
                        window.location.href = "/tradeh5/newWap/realNameRegister/openAccount.html";

                        // window.location.replace('/tradeh5/newWap/realNameRegister/openAccount.html?referUrl=' + encodeURIComponent(referUrl));
                        // window.location.href = '/tradeh5/newWap/realNameRegister/openAccount.html?referUrl=' + encodeURIComponent(referUrl);
                    // } else {
                    //     window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl);
                    }
                    break;
                case 9000:
                    // 小米金融code校验失败，未能正常获取openUid
                    console.log('小米金融code校验失败，未能正常获取openUid');
                    console.log('result.returnMsg=', result.returnMsg);
                    utils.showTips('网络开小差了，请稍后再试');  
                    break;
                default:
                    // 9999或1000，未能通过code获取到openid
                    // alert('code值有误，codeLoginRequest result=' + result);
                    console.log('codeLoginRequest switch default，returnCode有误');
                    console.log('codeLoginRequest result=', result);
                    utils.showTips('网络开小差了，请稍后再试');  
                    break;
            }
        }, 
        error: function (e) {
            console.log('codeLoginRequest error e=', e);
            utils.codeLoginLoading = false;
        }
    })

});

function alertTips(text){
    $(".Bomb-box-tips").html(text);
    $(".Bomb-box-content p").html("");
	$(".Bomb-box-content").hide();
    $(".Bomb-box").show();
}

$(".Bomb-box-ok").click(function () {
	$(".Bomb-box").hide();
});

$('.back').on('click', function () {
    // window.location.href = '/mobileEC/wap/wezhan/service.html';
    if($(".back").html() == '返回'){
        window.location.href = 'https://m.jr.mi.com/activity/generate/page?aid=b9b5b7c5967540b3&from=generate&t=1628063234228#!/';
    }
    if($(".back").html() == '查看奖励'){
        window.location.href = '/mobileEC/wap/wezhan/redEnvelopes.html?channelCode=airstar';
    }
});
$('.view-hot-fund').on('click', function () {
    if($('.view-hot-fund').html() == '查看热门好基'){
        window.location.href = '/mobileEC/wap/fund/all_funds.html?channelCode=airstar';
    }
    if($('.view-hot-fund').html() == '立即完善'){
        window.location.href = '/mobileEC/wap/card/bindCardInputCardInfo.html?channelCode=airstar';
    }
});

