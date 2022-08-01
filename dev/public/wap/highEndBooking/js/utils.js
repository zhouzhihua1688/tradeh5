/**
 * @date: 2021-01-18 01:38:31
 * @desc: 常用工具类function，配置项list，不含有业务逻辑处理
 */


window.utils = {
    // 数据字典
    // 路径前缀
    prefix: '/tradeh5/newWap',
    applicationNm: '/mobileEC/',
    prefix_mobile: '/mobileEC/services',
    apiVersion: '5.6',
    loadingCount: 0, // 用于loading状态的计数
    loginFrom: 'W',
    
    // 命名空间，跨多页面使用的变量，set/get到sessionStorage中
    // 多页面使用的变量注册到这里，建议非强制
    userInfo: "__userInfo",
    openId: '__openId',
    openUid: '__openUid',
    userSalt: '__userSalt',     // 小米金融使用
    code: '__code',     // 小米金融使用，保存url中的token
    tradeChain: '__verifyTradeChain',     // 验证交易链路使用
    tradeAsyncQueryTimes: 3,                 // 默认交易链路结果轮询次数
    tradeAsyncQueryInterval: 800,            // 默认交易链路结果轮询间隔
    tradeAsyncQueryTimesSession: '__tradeAsyncQueryTimes',
    tradeAsyncQueryIntervalSession: '__tradeAsyncQueryInterval',
    serialNo_forword_url : '___serialNo_trade_forword_url',
    successInfo : '__success_info',


    sessionStorage: window.sessionStorage,
    setSession: function(key, value){
        if(value != null && value != undefined){
            var otype = Object.prototype.toString.call(value);
            if(otype == "[object Object]" || otype == "[object Array]") {
                utils.sessionStorage.setItem(String(key), JSON.stringify(value));
            } else if (otype == "[object String]" || otype == "[object Number]" || otype == "[object Boolean]"){
                utils.sessionStorage.setItem(String(key), value);
            } else{
                /** Function and Undefined and Null not save */
            }
        }
    },

    getSession: function(key){
        var valStr = utils.sessionStorage.getItem(String(key));
        if (/^[\[]+(.)*[\]]+$/.test(valStr) || /^[\{]+(.)*[\}]+$/.test(valStr)){
            //Object,Array
            return JSON.parse(valStr);
        } else {
            return valStr;
        }
    },

    removeSession: function(key){
        utils.sessionStorage.removeItem(key);
    },
    clearSession: function () {
        utils.sessionStorage.clear();
    },
    bind: function (target, eventNm, eventFun) {
        $(target).hammer().bind(eventNm, eventFun);
    },
    unbind: function (target, eventNm, eventFun) {
        $(target).hammer().unbind(eventNm, eventFun);
    },
    unbindAll: function (target, eventNm) {
        $(target).hammer().unbind(eventNm);
    },

    isFunction: function (eventFn){
        if(eventFn != undefined && eventFn != null && typeof eventFn == "function"){
            return true;
        }else{
            return false;
        }
    },

    // 获取url中的参数
    getUrlParam: function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			// if(key == "referUrl" || key == "next_jump"){
			// 	return decodeURIComponent(r[2]);
			// }else{
			// 	return r[2];
            // }
            return decodeURIComponent(r[2]);
		}
        return "";
    },

    //获取设置cookie
    getCookie: function (name){
        //注意对键编码
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;
        //找到cookie键
        if (cookieStart > -1){
            //键后面第一个分号位置
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            //cookie值解码
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    //设置cookie
    setCookie: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        //失效时间，GMT时间格式
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        } else {
            cookieText += "; path=/";
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        } else {
            cookieText += "; domain=" + window.location.hostname.replace(/(.*?)\.99fund\.com/ig, '.99fund.com');
        }
        if (secure) {
            cookieText += "; secure";
        }

        document.cookie = cookieText;
    },

    // 动态添加JavaScript文件到head标签
    addScript: function(url){
        var script = document.createElement('script');
        script.setAttribute('type','text/javascript');
        script.setAttribute('src',url);
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    removeCodeFromUrl: function (url) {
        // return String(url).replace(/&code=.*?(&|$)/ig, '$1').replace(/\?code=.*?&/ig, '?').replace(/\?code=.*?$/ig, '')
        // return String(url).replace(/(\?|\&)(code=.*?)(&|$)/ig, '$3');
        return String(url).replace(/(\?|\&)code=.*?\&/ig, '$1').replace(/(\?|\&)code=.*?$/ig, '');
    },

    removeChannelCodeFromUrl: function (url) {
        // return String(url).replace(/&code=.*?(&|$)/ig, '$1').replace(/\?code=.*?&/ig, '?').replace(/\?code=.*?$/ig, '')
        // return String(url).replace(/(\?|\&)(code=.*?)(&|$)/ig, '$3');
        return String(url).replace(/(\?|\&)channelCode=.*?\&/ig, '$1').replace(/(\?|\&)channelCode=.*?$/ig, '');
    },

    removeTokenFromUrl: function (url) {
        // return String(url).replace(/&code=.*?(&|$)/ig, '$1').replace(/\?code=.*?&/ig, '?').replace(/\?code=.*?$/ig, '')
        // return String(url).replace(/(\?|\&)(code=.*?)(&|$)/ig, '$3');
        return String(url).replace(/(\?|\&)token=.*?\&/ig, '$1').replace(/(\?|\&)token=.*?$/ig, '');
    },

    // isWeixin
    isWeixin: function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    // isXiaomi
    isXiaomi: function(){
        return false;
    },

    // isProdEnv
    isProdEnv: function(){
        var href = document.location.href;
        if((/^https:\/\/[^\/]*?99fund\.com\//.test(href) && href.indexOf('https://wxappdev.99fund.com/') !==0) || href.indexOf('https://m.99fund.com:8099/') ==0){
            return true;
        } else {
            return false;
        }
    },

    // 跳转到对应的login页面，不做登陆尝试
    jumpLoginPage: function(){
        var channelCode = utils.getCookie('channelCode');
        switch(channelCode){
            case 'htfwx_test':
                window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?channelCode=' + channelCode;
                break;
            case 'htfwx':
                window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?channelCode=' + channelCode;
                break;
            case 'tfhwx':
                window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?channelCode=' + channelCode;
                break;
            case 'airstar':   // 小米金融
                window.location.href = '/tradeh5/newWap/auth/login_xiaomi.html?channelCode=' + channelCode;
                break;
            case 'miniProgram':
                // TODO 20210205
                window.location.href = '/tradeh5/newWap/auth/login_miniProgram.html?channelCode=' + channelCode;
                break;
            case 'WAP':
                window.location.href = '/tradeh5/newWap/auth/login_wap.html?channelCode=' + channelCode;
                break;
            default:
                window.location.href = '/tradeh5/newWap/auth/login_wap.html?channelCode=' + channelCode;
                break;
        }
    },

    // 静默登录，页面初始化不需要登录态，url中有code/token等可以用来登录的第三方凭据
    silentLogin: function(callback){
        var sso_cookie = utils.getCookie('sso_cookie');
        if(sso_cookie){
            console.log('有登录态，silentLogin不做处理')
            return;
        }

        // 当前只针对小米金融渠道
        var channelCode = utils.getCookie('channelCode');
        var code = utils.getSession('__code');
        var appId = '';
        if(channelCode !== 'airstar' || !code){
            console.log('silentLogin不做处理')
            return;
        }

        // 小米金融默认appId
        if(utils.isProdEnv()){
            channelCode == 'airstar' && (appId = 'F2021011500001');
        } else {
            // 当前测试环境，appId可以被替换
            channelCode == 'airstar' && (appId = '200007');
            // var code = utils.getUrlParam('token');
            // code && utils.codeLoginRequest(code, appId);
        }

        var data = {authCode: code, htfChannelCode: channelCode };
        data = JSON.stringify(data);
        // 通过url中的code登陆，获取sso_cookie
        $.ajax({
            url: '/uaa/v1/third-part/login',
            type: 'POST',
            contentType: 'application/json',
            data: data,
            dataType:"json", 
            success:function(result){
                console.log('silentLogin success result=', result);
                utils.codeLoginLoading = false;
                // 判断通过code获取到的openId和电商系统的custNo绑定情况
                switch(result.returnCode){
                    case 0:
                        // 用户已绑定，正常获取到sso_cookie
                        // 静默登录，不做跳转或刷新页面处理
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
                        break;
                    default:
                        // 静默登录不成功，不做跳转，保存可能使用到的返回参数
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
                        break;
                }
                (typeof callback == 'function') && callback(result);
            }, 
            error: function (e) {
                console.log('silentLogin error e=', e);
                (typeof callback == 'function') && callback();
            }
        })
    },


    // ---------------------------------------------------------
    // 按渠道跳转，默认channelCode已经在页面init的时候设置到cookie中
    // 获取登录态
    jumpLoginByChannelCode: function(){
        // 通过code登录正在进行中，暂停其他请求，等登录成功后再进行
        if(utils.codeLoginLoading == true){
            return;
        }
        var channelCode = utils.getCookie('channelCode');
        switch(channelCode){
            case 'htfwx_test':
                utils.authWeixinOfficalAccounts('htfwx_test');
                break;
            case 'htfwx':
                utils.authWeixinOfficalAccounts('htfwx');
                break;
            case 'tfhwx':
                utils.authWeixinOfficalAccounts('tfhwx');
                break;
            case 'airstar':   // 小米金融
                utils.authXiaomi();
                break;
            case 'miniProgram':
                utils.authMiniProgram();
                break;
            case 'WAP':
                utils.authWap();
                break;
            default:
                utils.authWap();
                break;
        }
    },

    // 
    authWap: function(){
        window.location.href = '/tradeh5/newWap/auth/login_wap.html?referUrl=' + encodeURIComponent(utils.removeChannelCodeFromUrl(document.location.href));
    },

    // 
    authMiniProgram: function(){
        // TODO
        window.location.href = '/tradeh5/newWap/auth/login_miniProgram.html?referUrl=' + encodeURIComponent(utils.removeChannelCodeFromUrl(document.location.href));
    },

    // 
    authXiaomi: function(){
        // appId: 'F2021011500001',  // 生产 airstar
        var appId = '';
        var channelCode = utils.getCookie('channelCode');
        if(utils.isProdEnv()){
            channelCode == 'airstar' && (appId = 'F2021011500001');
        } else {
            // 当前测试环境，appId可以被替换
            channelCode == 'airstar' && (appId = '200007');
        }

        // var code = utils.getUrlParam('token');
        var code = utils.getSession('__code');
        if(code){
            // 有code参数
            console.log('有code参数');
            utils.codeLoginRequest(code, appId);
        } else {
            // 没有code参数
            console.log('没有code参数');
            // utils.getCode(appId);
            window.location.href = '/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(utils.removeChannelCodeFromUrl(document.location.href));
        }
        
    },

    // 
    authWeixinOfficalAccounts: function(channelCode){
        // appId: 'wx7461ecb8486abddf',  // 生产 htfwx
        // appId: 'wx7489ca0639441abd';  // 生产 tfhwx
        var appId = '';
        if(utils.isProdEnv()){
            channelCode == 'htfwx' && (appId = 'wx7461ecb8486abddf');
            channelCode == 'tfhwx' && (appId = 'wx7489ca0639441abd');
        } else {
            // 当前测试环境，appId可以被替换
            channelCode == 'htfwx' && (appId = 'wx2ec5e849c8928bc4');
            channelCode == 'tfhwx' && (appId = 'wx7e98d96f6c96c017');
            
            // appId = 'wxe81fab131159c23d';  // mz，小程序
            // appId = 'wx3247b2af2a0f443a';  // mz，测试公众号，channelCode:'htfwx_test';
            channelCode == 'htfwx_test' && (appId = 'wx3247b2af2a0f443a');
        }

        var code = utils.getUrlParam('code');
        if(code){
            // 有code参数
            console.log('有code参数');
            utils.codeLoginRequest(code, appId);
        } else {
            // 没有code参数
            console.log('没有code参数');
            utils.getCode(appId);
        }
    },

    // 微信授权是否获取userInfo信息，如需要获取，请手动设置为true
    // 20210126设置为false时，scope=snsapi_base，codeLoginRequest登录接口/uaa/v1/third-part/login会报7006使用当前accessToken获取用户信息失败
    needUserInfo: true,
    getCode: function (appId) {
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId +
        // '&redirect_uri=' + encodeURIComponent('https://wx.99fund.com/' + location.pathname + location.search) + 
            '&redirect_uri=' + encodeURIComponent(location.href) + 
            '&response_type=code&scope=' + (utils.needUserInfo === true ? 'snsapi_userinfo' : 'snsapi_base') + 
            '&state=STATE#wechat_redirect';

        console.log('getCode url=', url);
        window.location.href = url;
    },

    codeLoginLoading: false,   // 通过code静默登录时，block住其他ajax请求
    codeLoginRequest: function (code) {
        var channelCode = utils.getCookie('channelCode');
        console.log('codeLoginRequest code=', code);
        console.log('codeLoginRequest channelCode=', channelCode);
        // return;
        // if(!utils.isProdEnv()){
        //     // 测试环境处理
        //     if( channelCode==='htfwx' || channelCode==='tfhwx' ){
        //         console.log('测试环境处理，重新设置channelCode=htfwx_test');
        //         channelCode = 'htfwx_test';
        //         utils.setCookie('channelCode', channelCode);
        //     }
        // }

        var data = {authCode: code, htfChannelCode: channelCode };
        data = JSON.stringify(data);

        utils.codeLoginLoading = true;
        // 通过url中的code登陆，获取sso_cookie
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
                        window.location.replace(referUrl);
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
                        if(channelCode === 'airstar'){
                            // window.location.href = '/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(referUrl);
                            window.location.replace('/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(referUrl));
                        } else {
                            // window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl);
                            window.location.replace('/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl));
                        }
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
                            window.location.replace('/tradeh5/newWap/realNameRegister/openAccount.html?referUrl=' + encodeURIComponent(referUrl));
                            // window.location.href = '/tradeh5/newWap/realNameRegister/openAccount.html?referUrl=' + encodeURIComponent(referUrl);
                        // } else {
                        //     window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl);
                        }
                        break;
                    case 9000:
                        // 小米金融code校验失败，未能正常获取openUid
                        console.log('小米金融code校验失败，未能正常获取openUid');
                        console.log('result.returnMsg=', result.returnMsg);
                        break;
                    default:
                        // 9999或1000，未能通过code获取到openid
                        // alert('code值有误，codeLoginRequest result=' + result);
                        console.log('codeLoginRequest switch default，returnCode有误');
                        console.log('codeLoginRequest result=', result);
                        break;
                }
            }, 
            error: function (e) {
                console.log('codeLoginRequest error e=', e);
                utils.codeLoginLoading = false;
            }
        })
    },
    loadingShow: function(){
        if(!$('#loadingOver').length && !$('#loadingLayout').length){ // 用于loading的html元素不存在
            var style = document.createElement('style');
            var cssStr = '#loadingOver {display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #f5f5f5;opacity: 0.1;z-index: 1000;}';
            cssStr += '#loadingLayout {display: none;position: fixed;top: 40%;left: 40%;width: 70px;height: 70px;z-index: 1001;text-align: center;border-radius: 5px;background: url(/tradeh5/newWap/base/img/background-70.png);}';
            cssStr += '#loadingLayout div {margin-top: 10px;}';
            cssStr += '@-webkit-keyframes loading {from { -webkit-transform:rotate(0deg) translateZ(0); } to { -webkit-transform:rotate(360deg) translateZ(0); }}';
            cssStr += '#loadingLayout .loading-img {margin-left: 20px;width: 30px;height: 30px;-webkit-transform: rotate(0deg) translateZ(0);-webkit-transition-duration: 0ms;-webkit-animation-name: loading;-webkit-animation-duration: 0.7s;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: linear;}';
            style.innerHTML = cssStr;
            document.getElementsByTagName('head')[0].append(style);
            var loadingHTML = '<div id="loadingOver" style="display: none;"></div>';
            loadingHTML +=  '<div id="loadingLayout" style="display: none;">' +
                '<div class="loading-img">' +
                '<img src="/tradeh5/newWap/base/img/hook/loadingHUD.png">' +
                '</div>' +
                '<div style="font-size: 12px;color: #ffffff;">加载中..</div>' +
                '</div>';
            $(document.body).append(loadingHTML);
        }
        this.loadingCount++;
        $('#loadingOver').show();
        $('#loadingLayout').show();
    },
    loadingHide: function(){
        if($('#loadingOver').length && $('#loadingLayout').length){ // 用于loading的html元素存在
            this.loadingCount = Math.max(this.loadingCount - 1, 0);
            if(this.loadingCount <= 0){
                $('#loadingOver').hide();
                $('#loadingLayout').hide();
            }
        }
    },
    getBizConfig: function(){
        $.ajax({
            url: '/mobile-bff/v1/config/biz-config',
            contentType: 'application/json',
            dataType: 'json',
            success: function (bizResult) {
                if (bizResult.returnCode == 0) {
                    utils.setSession(utils.tradeAsyncQueryTimesSession, Number(bizResult.body.tradeAsyncQueryTimes));
                    utils.setSession(utils.tradeAsyncQueryIntervalSession, Number(bizResult.body.tradeAsyncQueryInterval));
                }
            }
        });
    },
    verifyTradeChain: function(body,callback){
        if(!body){
            return;
        }
        this.setSession(this.tradeChain, body)
        if(!body.tradeVerify){ // tradeVerify如果为空默认交易密码验证
            window.location.href = '/tradeh5/newWap/cos/tradeChain/tradePwdAuth.html';
            return;
        }
        switch (body.tradeVerify.verifyType) {
            case 'S000':    // 验证二维码
                window.location.href = '/tradeh5/newWap/cos/tradeChain/codeAuth.html';
                break;
            case 'S001':    // 验证身份信息
                window.location.href = '/tradeh5/newWap/cos/tradeChain/idInfoComplete.html';
                break;
            case 'S002':    // ​验证短信
                window.location.href = '/tradeh5/newWap/cos/tradeChain/smsCode.html';
                break;
            case 'S003':    // 验证交易密码
                window.location.href = '/tradeh5/newWap/cos/tradeChain/tradePwdAuth.html';
                break;
            case 'S004':    // 验证指纹
                break;
            case 'S005':    // 人脸识别
                break;
            case 'S007':    // 人脸识别(无源比对)
                break;
            case 'S008':    // 人脸识别(有源比对)
                break;
            case 'S009':    // 验证证件号码
                window.location.href = '/tradeh5/newWap/cos/tradeChain/idCardAuth.html';
                break;
            case 'S010':    // 验证图片暗号
                break;
            case 'S011':    // 银行卡核身方式验证
                break;
            case 'S012':    // 手机号快速验证
                break;
            default:
                this.ajax({
                    url: '/mobile-bff/v1/verify/verifyNotVerify',
                    type: 'POST',
                    data: {
                        serialNo: body.serialNo
                    },
                    success: function (result) {
                        if(!callback && result.body && result.body.successInfo){
                            utils.showTips(result.body.successInfo);
                        } else {
                            callback && callback(result);
                        }
                    }
                });
        }
    },
    // S ajax请求

    // jQuery.get(url, [data], [success], [dataType])
    get: function (/*arguments*/) {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)); 
        // console.log(args);
        if ($.isPlainObject(args[0])){
            args[0].type = 'GET';
            return utils.ajax(args[0]);
        }
        var settings = utils.prepareAjax(args);
        settings.type = 'GET';
        settings.contentType = 'application/json';
        // console.log('utils request get settings=', settings);
        return utils.ajax(settings);
    },

    // jQuery.post(url, [data], [success], [dataType])
    post: function (/*arguments*/) {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)); 
        // console.log(args);
        if ($.isPlainObject(args[0])){
            args[0].type = 'POST';
            return utils.ajax(args[0]);
        }
        var settings = utils.prepareAjax(args);
        settings.type = 'POST';
        // console.log('utils request post settings=', settings);
        return utils.ajax(settings);
    },

    ajax: function (settings) {
        // 参与业务接口，需要验证是否登录，调用utils.ajax、utils.get、utils.post请求，
        // （不需要验证是否登录的情况，直接使用jquery的原生请求$.ajax、$.post、$.get调用后台数据）
        console.log('utils request ajax settings=', settings);

        // 通过code登录正在进行中，暂停其他请求，等登录成功后再进行
        if(utils.codeLoginLoading == true){
            return;
        }

        // var code = utils.getUrlParam("code");
        // var ssoCookie = utils.getCookie("sso_cookie");
        // 检查sso_cookie，未登录跳转去获取code并登录
        // if (utils.isBlank(ssoCookie)) {
        //     return utils.getCode();
        // }

        // TODO应该不需要每个ajax请求上再带有code
        // if(utils.isWeixin() && code){
        //     settings.wxcode = code;
        // }

        var beforeSend = settings.beforeSend;
        settings.beforeSend = function(req){
            req.setRequestHeader("version", utils.apiVersion);   // 当前20210125设定为6.1
            req.setRequestHeader("linksource", "WAP");
            beforeSend && beforeSend(req);
        };
        
        var success = settings.success;
        settings.success = function(result,status,xhr){
            var tipsObj = {
                content: result.returnMsg,
                confirmText: '去完善',
                complete: function () {
                    window.location.href = '../userInfo/parfectInfo.html?forwardUrl=' + encodeURIComponent(location.href);
                }
            };
            if(result.returnCode == 1000){
                // sso_cookie过期失效或者不存在情况
                console.log('sso_cookie过期失效或者不存在情况!')
                return utils.jumpLoginByChannelCode();
                // window.location = utils.gotoLogin();
            }
            else if(result.returnCode == 9999){
                if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                    utils.showTips("网络连接错误！");
                }else{
                    utils.showTips(result.returnMsg);
                }
            }
            else if(result.returnCode == 4105) {
                utils.showTips(tipsObj);
            }
            else if(result.returnCode == 4106){
                utils.showTips(tipsObj);
            }
            else if(result.returnCode == 4107){
                utils.showTips(tipsObj);
            }
            else if(result.returnCode == 4108){
                utils.showTips(tipsObj);
            }
            else if(result.returnCode == 4109){
                utils.showTips(tipsObj);
            }
            else if(result.returnCode == 0){
                success && success(result,status,xhr);
            }
            else {
                utils.showTips(result.returnMsg);
            }
        };
        var complete = settings.complete;
        settings.complete = function(XMLHttpRequest, textStatus){
            utils.loadingHide();
            if(complete){
                if(textStatus == 'success' && XMLHttpRequest.status == 200 && XMLHttpRequest.responseJSON){
                    complete(XMLHttpRequest.responseJSON)
                }
                else {
                    complete(XMLHttpRequest, textStatus)
                }
            }
        }

        !settings.dataType && (settings.dataType = 'json');
        !settings.contentType && (settings.contentType = 'application/json');
        if(settings.data && settings.type == 'POST'){
            if(typeof settings.data === 'string'){
                settings.data = JSON.parse(settings.data);
            }
            !settings.data.loginFrom && (settings.data.loginFrom = this.loginFrom);
            settings.data = JSON.stringify(settings.data);
        }

        // 处理setting.data，支持GET和POST两种情况
        // !settings.type && (settings.type = 'GET');
        // if(settings.data) {
        //     if(typeof settings.data === 'string'){
        //         settings.data = JSON.parse(settings.data);
        //     }
        //     !settings.data.loginFrom && (settings.data.loginFrom = utils.loginFrom);
        // } else {
        //     settings.data = { loginFrom: utils.loginFrom };
        // }
        // (settings.type == 'POST') && (settings.data = JSON.stringify(settings.data));

        utils.loadingShow();
        return $.ajax(settings);
    },

    // jQuery源码写法，get,post
    // jQuery.each( [ "get", "post" ], function( _i, method ) {
    //     jQuery[ method ] = function( url, data, callback, type ) {
    //         // Shift arguments if data argument was omitted
    //         if ( isFunction( data ) ) {
    //             type = type || callback;
    //             callback = data;
    //             data = undefined;
    //         }
    //         // The url can be an options object (which then must have .url)
    //         return jQuery.ajax( jQuery.extend( {
    //             url: url,
    //             type: method,
    //             dataType: type,
    //             data: data,
    //             success: callback
    //         }, jQuery.isPlainObject( url ) && url ) );
    //     };
    // } );

    // jQuery.get/post(url, [data], [success], [dataType])
    prepareAjax: function (args) {
        var settings = {};
        settings.url = args[0];
        // 保持对oldWap兼容，
        // App.post(url, data, eventFn, fun, async){}
        // App.get(url, eventFn, fun, async){}
        if(args[1] && typeof args[1] === "function"){
            // 没有传递参数data，此位置为callback回调函数，主要是GET的情况
            // jQuery.post/get( url, callback, type )
            settings.success = args[1];
            (typeof args[2] === 'string') && (settings.dataType = args[2]);

            // S oldWap 兼容，判断后一位置为function，则认为是App.post/get(url, eventFn, fun, async){}
            if(
                // (args[1] && typeof args[1] === "function") || 
                (args[2] && typeof args[2] === "function")
            ){
                args[1] && (settings.complete = args[1]);
                args[2] && (settings.success = args[2]);
                (typeof args[3] === 'boolean') && (settings.async = args[3]);
            }
            // E oldWap 兼容  App.post/get(url, eventFn, fun, async){}
        } else {
            // 正常传递参数data，参数位置不变，主要是POST的情况
            // jQuery.post/get(url, [data], [success], [dataType])
            settings.data = args[1];
            (typeof args[2] === 'function') && (settings.success = args[2]);
            (typeof args[3] === 'string') && (settings.dataType = args[3]);

            // S oldWap 兼容，判断后一位置为function，则认为是App.post/get(url, data, eventFn, fun, async){}
            if(
                // (args[2] && typeof args[2] === "function") || 
                (args[3] && typeof args[3] === "function")
            ){
                args[2] && (settings.complete = args[2]);
                args[3] && (settings.success = args[3]);
                (typeof args[4] === 'boolean') && (settings.async = args[4]);
            }
            // E oldWap 兼容  App.post/get(url, data, eventFn, fun, async){}
        }
        return settings;
    },
    _tipsTemplate: function (params) {
        var template = $(`
            <div id='_showTips_' style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 1000;background: rgba(0, 0, 0, 0.7);display: flex;justify-content: center;align-items: center;font-size:calc(100vw/20);" >
                <div style="width: 15em;background-color: #fff;border-radius: 0.3em;">
                    <header style="text-align: center;color: #333;font-size: 0.8em;padding: 1em 0;">${params.title?params.title:'信息'}</header>
                    <p class="_showTips_content" style="text-align: center;color: #666;font-size: 0.65em;padding: 0 1.5em 0.75em;">${params.content?params.content:''}</p>
                    <div style="display: flex;justify-content: space-evenly;padding:.5em 0; align-items: center; margin: 0 0.75em;border-top: solid 1px #eeeeee;">
                        <button class='_showTips_confirm' style="width: 100%;padding: .3em 0;font-size: 0.75em;color:#0070fa;border: none;background-color: transparent;outline: none;border-radius: 0;line-height: inherit;">
                            ${params.confirmText?params.confirmText:'确认'}
                        </button>
                    </div>
                </div>
            </div>
            `)

        params.showCancel && template.find('._showTips_confirm').after('<button class="_showTips_cancel"  style="border-left: solid 1px #eeeeee;color:#0070fa;width: 100%;padding: .3em 0;font-size: 0.75em;border: none;background-color: transparent;outline: none;border-radius: 0;line-height: inherit;">取消</button>')

        template.find('._showTips_confirm')[0].onclick = function (ele) {
            Object.prototype.toString.call(params.complete) === "[object Function]" && params.complete(ele);
            $('#_showTips_').hide()
        }

        params.showCancel && (template.find('._showTips_cancel')[0].onclick = function () {
            $('#_showTips_').hide()
        })
        $(document.body).append(template);
    },
    showTips: function (params) {
        var _params = typeof params === 'string' ? {content: params}: params;
        if (!$('#_showTips_').length) { // 用于_showTips_的html元素不存在
            return this._tipsTemplate(_params );
        }
        if (_params.showCancel) {
            $('#_showTips_ ._showTips_cancel').remove()
            $('#_showTips_ ._showTips_confirm').after('<button class="_showTips_cancel"  style="border-left: solid 1px #eeeeee;color:#0070fa;width: 100%;padding: .3em 0;font-size: 0.75em;border: none;background-color: transparent;outline: none;border-radius: 0;line-height: inherit;">取消</button>')
            $('#_showTips_ ._showTips_cancel')[0].onclick = function () {
                $('#_showTips_').hide()
            }
        } else {
            $('#_showTips_ ._showTips_cancel').remove()
        }

        _params.title && $('#_showTips_ header').html(_params.title);
        _params.confirmText && $('#_showTips_ ._showTips_confirm').html(_params.confirmText);
        _params.content && $('#_showTips_ ._showTips_content').html(_params.content);
        $('#_showTips_ ._showTips_confirm')[0].onclick = function (ele) {
            Object.prototype.toString.call(_params.complete) === "[object Function]" && _params.complete(ele);
            $('#_showTips_').hide()
        }
        $('#_showTips_').show()
        // this.showTips({
        //     title: '信息', //标题
        //     content: '哈哈哈哈', //内容
        //     showCancel: true, //是否显示取消按钮，默认false
        //     confirmText: '确定', //确认按钮文字，默认确定
        //     complete: function() { //需使用bind()
        //     }.bind(this)
        // })
    },
}



// functions list
function valide(isAlert){
    var inputs = $("input");
    for(var i=0; i<inputs.length; i++){
        var input = inputs.eq(i);
        if(input.attr("data-rquire") == "false") continue;
        if(input.val() == ""){
            var msg = input.attr("data-rquire-msg");
            if(msg == undefined){continue;}
            isAlert == "needless" || alertTips(input.attr("data-rquire-msg"));
            return false;
        }
    }
    return true;
}
/**
 * 格式化货币
 * @param fieldNm
 * @param removeColor
 * @param addColor
 */
 function formatMoney(num, scaleNum) {
	if(!num){
		return "0.00";
	} else if (num == "--" || num == "-"){
		return "--";
	}
	if(scaleNum == undefined || scaleNum == null){
		scaleNum = 2;
	}
	var numberStr = String(num).replace(/,/g, "");
	//金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
	var str = Number(numberStr).toFixed(scaleNum) + '';
	var intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
	var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
	var ret = intSum + dot;
	return ret;
}

//根据正负显示对应颜色
function showColor(val){
    if(val && Number(val) < 0){
        return '#159848';
    }
    return '#FB5C5F';
}
/**
 * @description: 方法说明 
 * @method 方法名 
 * @param { String } 参数名 参数说明
 * @return { Boolean } 返回值说明
 */
function addGoHomeCircle() {
    $(document.body).append("<a href='#' class='go_home'>回首页</a>");
    // 回首页拖动事件
    var contW = $(".go_home").width();
    var contH = $(".go_home").height();
    var startX, startY, sX, sY, moveX, moveY;
    var winW = $(window).width();
    var winH = $(window).height();
    $(".go_home").on({ //绑定事件
        touchstart: function(e) {
            startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标
            startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
            sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
            sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
            leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
            rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
            topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
            bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置
        },
        touchmove: function(e) {
            e.preventDefault();
            //移动过程中XY轴的坐标要减去margin的距离
            moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
            moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标
            //判断的时候要计算加上padding的距离
            if(moveX < leftX) {
                moveX = leftX;
            }
            if(moveX > rightX) {
                moveX = rightX;
            }
            if(moveY < topY) {
                moveY = topY;
            }
            if(moveY > bottomY) {
                moveY = bottomY;
            }
            $(this).css({
                "left": moveX + sX - startX,
                "top": moveY + sY - startY,
            })
        },
        click: function () {
            window.location.href = "/mobileEC/wap/wezhan/service.html";
        }
    });
}

