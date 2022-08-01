
//微信登录修相关js
var HTF = {

    appId: 'wx7461ecb8486abddf',  // 生产 htfwx
	wxRedirectDispatch : 'https://wx.99fund.com/weixin/redirect_dispatch.html',
	wapRedirectDispatch : 'https://wx.99fund.com/mobileEC/wap/common/redirect_dispatch.html',
	next_jump : document.URL,
    sessionStorage : window.sessionStorage,
    setSession : function(key, value){
        if(value != null && value != undefined){
            var otype = Object.prototype.toString.call(value);
            if(otype == "[object Object]" || otype == "[object Array]") {
                HTF.sessionStorage.setItem(String(key), JSON.stringify(value));
            } else if (otype == "[object String]" || otype == "[object Number]" || otype == "[object Boolean]"){
                HTF.sessionStorage.setItem(String(key), value);
            } else{
                /** Function and Undefined and Null not save */
            }
        }
    },

    getSession : function(key){
        var valStr = HTF.sessionStorage.getItem(String(key));
        if (/^[\[]+(.)*[\]]+$/.test(valStr) || /^[\{]+(.)*[\}]+$/.test(valStr)){
            //Object,Array
            return JSON.parse(valStr);
        } else {
            return valStr;
        }
    },

    removeSession : function(key){
        HTF.sessionStorage.removeItem(key);
    },
    clearSession : function () {
        HTF.sessionStorage.clear();
    },

    isFunction : function (eventFn){
        if(eventFn != undefined && eventFn != null && typeof eventFn == "function"){
            return true;
        }else{
            return false;
        }
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

    isNotBlank : function (p){
        if(p == null || p == undefined){
            return false;
        } else if (p instanceof Array && p.length == 0){
            return false;
        } else if (typeof p == 'string' && (p == '' || p.trim() == '')){
            return false;
        }
        return true;
    },

    isBlank : function (p){
        if(p == null || p == undefined){
            return true;
        } else if (p instanceof Array && p.length == 0){
            return true;
        } else if (typeof p == 'string' && (p == '' || p.trim() == '')){
            return true;
        }
        return false;
    },

    /**
     * 获取URL参数
     * @returns {boolean}
     */
    getUrlParam: function (key) {
		
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			if(key == "referUrl" || key == "next_jump"){
				return decodeURIComponent(r[2]);
			}else{
				return r[2];
			}
		}
		
        return "";
    },

    /**
     * 是否为微信
     * @returns {boolean}
     */
    isWeixin: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },

    removeCodeFromUrl: function (url) {
        return String(url).replace(/&code=.*?(&|$)/ig, '$1').replace(/\?code=.*?&/ig, '?').replace(/\?code=.*?$/ig, '')
    },

    // 微信授权是否获取userInfo信息，如需要获取，请手动设置为
    // HTF.needUserInfo = true;
    needUserInfo: false,

    getCode: function () {
        if(HTF.needUserInfo){
            return HTF.getCodeUserInfo();
        } else {
            return HTF.getCodeBase();
        }
    },

    // 获取用户基本信息授权（不需要用户点击授权按钮）
    getCodeBase: function () {
		if(document.domain.indexOf("mdev") > -1) {//测试
			HTF.appId = 'wx2ec5e849c8928bc4';  // 
			HTF.wapRedirectDispatch = window.location.origin+'/mobileEC/wap/common/redirect_dispatch.html';
			if(App.getCookie("channelCode") == "tfhwx"){
				HTF.appId = 'wx7e98d96f6c96c017';  // 
			}
		}else{
			if(App.getCookie("channelCode") == "tfhwx"){
				HTF.appId = 'wx7489ca0639441abd'; //生产 tfhwx
			}
		}
        var channelCode = App.getCookie("channelCode");
        
        // var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + HTF.appId + "&redirect_uri="+ encodeURI(encodeURI(HTF.wapRedirectDispatch+"?channelCode="+channelCode+"&next_jump="+HTF.removeCodeFromUrl(HTF.next_jump)+"&code="+HTF.getUrlParam("code"))) +"&response_type=code&scope=snsapi_base&state=STATE";
        var nextJumpUrl = App.getUrlParam("next_jump");
        if(HTF.isNotBlank(nextJumpUrl)){
            HTF.next_jump = nextJumpUrl;
        }
        /*if(!HTF.next_jump){
            HTF.next_jump = App.getUrlParam("next_jump");
        }*/
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + HTF.appId + "&redirect_uri="+ encodeURIComponent(HTF.wapRedirectDispatch+"?channelCode="+channelCode+"&next_jump="+encodeURIComponent(HTF.removeCodeFromUrl(HTF.next_jump) )) +"&response_type=code&scope=snsapi_base&state=STATE";

        // alert('getCodeBase url=' + url)
        window.location = url;
    },

    // 获取用户信息含头像昵称授权（需要用户点击授权按钮）
    getCodeUserInfo: function () {
		if(document.domain.indexOf("mdev") > -1) {//测试
			HTF.appId = 'wx2ec5e849c8928bc4';  // 
			HTF.wapRedirectDispatch = window.location.origin+'/mobileEC/wap/common/redirect_dispatch.html';
			if(App.getCookie("channelCode") == "tfhwx"){
				HTF.appId = 'wx7e98d96f6c96c017';  // 
			}
		}else{
			if(App.getCookie("channelCode") == "tfhwx"){
				HTF.appId = 'wx7489ca0639441abd'; //生产 tfhwx
			}
		}
		var channelCode = App.getCookie("channelCode");

        // var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + HTF.appId + "&redirect_uri="+ encodeURI(encodeURI(HTF.wapRedirectDispatch+"?channelCode="+channelCode+"&next_jump="+HTF.removeCodeFromUrl(HTF.next_jump)+"&code="+HTF.getUrlParam("code")+"&channelCode="+channelCode)) +"&response_type=code&scope=snsapi_userinfo";
        var nextJumpUrl = App.getUrlParam("next_jump");
        if(HTF.isNotBlank(nextJumpUrl)){
            HTF.next_jump = nextJumpUrl;
        }
        /*if(!HTF.next_jump){
            HTF.next_jump = App.getUrlParam("next_jump");
        }*/
        var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + HTF.appId + "&redirect_uri="+ encodeURIComponent(HTF.wapRedirectDispatch+"?channelCode="+channelCode+"&next_jump="+encodeURIComponent(HTF.removeCodeFromUrl(HTF.next_jump))+"&channelCode="+channelCode) +"&response_type=code&scope=snsapi_userinfo";

        window.location = url;
    },

    // 是否正在通过code获取sso_cookie进行中
    codeLoginLoading: false,

    codeLoginRequest: function (code) {
        var nextJumpUrl = App.getUrlParam("next_jump");
        if(HTF.isNotBlank(nextJumpUrl)){
            HTF.next_jump = nextJumpUrl;
        }
        var htfChannelCode = App.getCookie("channelCode");

        var data = {authCode: code, htfChannelCode: App.getCookie("channelCode") };
        data = JSON.stringify(data);

        HTF.codeLoginLoading = true;
        // 通过url中的code登陆，获取sso_cookie
        $.ajax({
            url: '/uaa/v1/third-part/login',
            type: 'POST',
            contentType: 'application/json',
            data: data,
            beforeSend:function(req){
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            },
            success:function(result){
                HTF.codeLoginLoading = false;
                // 判断通过code获取到的openid和电商系统的custNo绑定情况
                switch(result.returnCode){
                    case 0:
                        // 用户已绑定，正常获取sso_cookie
                        var openId = "";
                        var openUid = "";
                        if(result.body && result.body.openId){
                            openId = result.body.openId;
                        }
                        if(result.body && result.body.openUid){
                            openUid = result.body.openUid;
                        }
                        App.setSession("__openId", openId);
                        App.setSession("__openUid", openUid);
                        App.setCookie("__openId", openId);
                        App.setCookie("__openUid", openUid);

                        App.setCookie("loginChannel",htfChannelCode);
						if(HTF.next_jump.indexOf('wx_login') > -1){
							window.location.href = '/mobileEC/wap/login/unbind.html?channelCode='+htfChannelCode;
						}else{
							window.location.href = HTF.next_jump;
						}
                        break;
                    case 9001:
                        // 用户已绑定，正常获取sso_cookie
                        App.setCookie("loginChannel",htfChannelCode);
                        window.location.href = HTF.next_jump;
                        break;
                    case 1003:
                        // 用户未绑定，跳转到登陆页面（登录成功后的url带着当前code？待确认）
                        // TODO
                        // 2019年7月1日09:32:10，使用随机数作为url参数，去掉url中的code
                        var openId = "";
                        var openUid = "";
                        if(result.body && result.body.openId){
                            openId = result.body.openId;
                        }
                        if(result.body && result.body.openUid){
                            openUid = result.body.openUid;
                        }
						App.setSession("__openId", openId);
						App.setSession("__openUid", openUid);
                        App.setCookie("__openId", openId);
                        App.setCookie("__openUid", openUid);
                        var referUrl = HTF.next_jump;
						
                        referUrl = referUrl + '&openId=' + openId + '&openUid=' + openUid;
                        referUrl = HTF.removeCodeFromUrl(referUrl);
                        // $('.mainwords h3').html(referUrl);
                        HTF.gotoLogin(App.getSession("__openUid"), App.getSession("__openId"));
                        break;
                    case 4103:
                        //20210823 4103，用户未关注官微，且未在交易流程时则引导其关注官微；用户未关注官微，且在交易流程时则跳转到登陆页面
                        //是否处于交易流程通过参数nonTrade判断                        
                        var referUrl = window.location.href;
                        // referUrl = utils.removeCodeFromUrl(referUrl);
                        // referUrl = utils.removeChannelCodeFromUrl(referUrl);

                        var nonTrade= App.getUrlParam('nonTrade');
                        if(!nonTrade && (App.getUrlParam('next_jump' || App.getUrlParam('referUrl') ))){
                            var curUrl= (referUrl.split('next_jump=')[1] || referUrl.split('referUrl=')[1]);
                            curUrl= decodeURIComponent(curUrl);
                            var reg = new RegExp("(/?|&)nonTrade=([^&]*)(&|$)", "i");
                            var r = curUrl.match(reg);
                            if(r != null)
                                nonTrade= decodeURIComponent(r[2]);
                        }

                        if(nonTrade == '1')
                            window.location.replace('/activity-center/act-resources/pages/FollowWechatAccount/index.html');
                        else{
                            if(HTF.getCookie('channelCode') === 'airstar'){
                                // window.location.href = '/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(referUrl);
                                window.location.replace('/tradeh5/newWap/auth/login_xiaomi.html?referUrl=' + encodeURIComponent(referUrl));
                            } else {
                                // window.location.href = '/tradeh5/newWap/auth/login_officalAccounts.html?referUrl=' + encodeURIComponent(referUrl);
                                window.location.replace('/tradeh5/newWap/auth/login_wap.html?referUrl=' + encodeURIComponent(referUrl));
                            }
                        }
                        break;
                    default:
                        // 9999或1000，未能通过code获取到openid
                        // alert('code值有误');//debug
                        // 更新原页面（去掉url中的code参数值）
                        HTF.gotoLogin();
                        break;
                }
            }, 
            dataType:"json", 
            error:function (e) {
                HTF.codeLoginLoading = false;
                // if(HTF.isFunction(errFun)){
                //     eval(errFun).call(this);
                // }
            },
            // async: isAsync
        })
    },

    ajax: function (settings) {
        // 参与业务接口，需要验证是否登录，调用HTF.ajax、HTF.get、HTF.post请求，
        // （不需要验证是否登录的情况，直接使用jquery的原生请求$.ajax、$.post、$.get调用后台数据）
        console.log('HTF request ajax settings=', settings);

        // 通过code登录正在进行中，暂停其他请求，等登录成功后再进行
        if(HTF.codeLoginLoading == true){
            return;
        }

        var code = HTF.getUrlParam("code");
        var ssoCookie = HTF.getCookie("sso_cookie");
        // 检查sso_cookie，未登录跳转去获取code并登录
        if (HTF.isBlank(ssoCookie)) {
            return HTF.getCode();
        }

        // TODO应该不需要每个ajax请求上再带有code
        // if(HTF.isWeixin() && code){
        //     settings.wxcode = code;
        // }

        // var beforeSend = setting.beforeSend;
        // settings.beforeSend = function(req){
        //     req.setRequestHeader("version", HTF.apiVersion);
        //     req.setRequestHeader("linksource", "WAP");
        //     beforeSend && beforeSend(req);
        // };

        var success = setting.success;
        settings.success = function(result,status,xhr){
            if(result.returnCode == 1000){
                // sso_cookie过期失效或者不存在情况
                return HTF.getCode();
                // window.location = HTF.gotoLogin();
            }
            success && success(result,status,xhr);
        };
        

        return $.ajax(settings);
    },

    // jQuery.get(url, [data], [success], [dataType])
    get: function (/*arguments*/) {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)); 
        // console.log(args);

        if ($.isPlainObject(args[0])){
            return HTF.ajax(args[0]);
        }

        var settings = prepareAjax(args);
        settings.type = 'GET';
        return HTF.ajax(settings);
    },

    // jQuery.post(url, [data], [success], [dataType])
    post: function (/*arguments*/) {
        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)); 
        // console.log(args);

        if ($.isPlainObject(args[0])){
            return HTF.ajax(args[0]);
        }

        var settings = prepareAjax(args);
        settings.type = 'POST';
        return HTF.ajax(settings);
    },

    prepareAjax: function (args) {
        var settings = {};
        settings.url = args[0];
        if(args[1]) {
            if($.isPlainObject(args[1])){
                settings.data = args[1];
            } 
            if(args[1] instanceof Function){
                settings.success = args[1];
            }
            if(typeof arg[1] == 'string'){
                settings.dataType = args[1];
            }
        }
        if(args[2]){
            if(args[2] instanceof Function){
                settings.success = args[2];
            }
            if(typeof arg[2] == 'string'){
                settings.dataType = args[2];
            }
        }
        if(args[3] && (typeof arg[3] == 'string') ){
            settings.dataType = args[3];
        }
        return settings;
    },

    /**
     * 跳登录页面
     */
    gotoLogin: function (openUid, openId) {
        console.log(openId,openUid);
        var referUrl = HTF.next_jump;
        if (App.isNotEmpty(referUrl) && referUrl.indexOf("service.html") > -1) {
            window.location.href = "/mobileEC/wap/wezhan/service.html?channelCode=" + App.getCookie("channelCode") + "&unbind=1" ;
        } else if(App.isWeixin() && App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
            if (referUrl.indexOf("wx_login") > -1) {
                window.location.href = "/mobileEC/wap/login/wx_login.html?channelCode=" + App.getCookie("channelCode") + "&unbind=1" + "&openUid=" + openUid + "&openId="+openId;
            } else {
                window.location.href = "/mobileEC/wap/login/wx_login.html?channelCode=" + App.getCookie("channelCode") + "&unbind=1" + "&openUid=" + openUid + "&openId="+openId + "&referUrl=" + encodeURIComponent(referUrl);
            }
        } else {
            window.location.href = App.loginPage + "?referUrl=" + encodeURIComponent(referUrl);
        }
        /*var url_prefix = '';
		if (App.isWeixin() && App.isNotEmpty(openId) && App.isNotEmpty(openUid)) {
			url_prefix = '/mobileEC/wap/login/wx_login.html?channelCode='+App.getCookie("channelCode")+'&unbind=1';
		} else {
			url_prefix = '/mobileEC/wap/login/login.html';
		}

        console.log(openId,openUid);
        if(App.isNotEmpty(openId) && App.isNotEmpty(openUid)){
            window.location.href = url_prefix + "&openUid=" + openUid + "&openId="+openId;
        } else {
			var referUrl = HTF.next_jump;
			referUrl = HTF.removeCodeFromUrl(referUrl);
			if(referUrl.indexOf('wx_login') > -1){
				referUrl = "/mobileEC/wap/wezhan/service.html";
			}
			//window.location.href = App.loginPage + "?referUrl=" + referUrl;
        }*/
    }
};

//完善个人信息弹窗
function showPerfectInfo(msg){
	
	alertTips4("信息",msg, "取消", "立即完善",
		function(){$(".Bomb-box").hide();},
		function(){window.location.href = "../userInfo/parfectInfo.html?forwardUrl=" + window.location.href;}
	);	
}
var App = {
		
    registerInfo : "__reg_info",
    applicationNm : "/mobileEC/",
    projectNm : "/mobileEC/services",
    loginPage : "/tradeh5/newWap/auth/login_wap.html",
    loginOfficalAccounts : "/tradeh5/newWap/auth/login_officalAccounts.html",   //20210929 服务端去掉redirect302处理
    wxLoginPage : "/mobileEC/wap/login/wx_login.html",                          //20210929 服务端去掉redirect302处理
    sessionStorage : window.sessionStorage,
    userInfo : "__userInfo",
    accountInfo : "__account_info",
    accountHomePageInfo : "__account_home_page_info",
    cardBindCardpwd_1_Info : "__cardt_bindcard_pwd_1_info",
    cardBindCardCreateCard_Info : "__cardt_bindcard_create_card_info",
    profitInfo : "__profit_info",
    perfectInfo : "__perfect_info",
    cards : "__card_list",
    autoTopUpList : "__autoTopUp_list",
    autoTopUpModifyInfo : "__autoTopUp_modify_info",
    creditCards : "__credit_card_list",
    selectedCard : "_selected_card",
    fundGroupObj : "___fund_group_obj",
    selectedCreditCard : "_selected_credit_card",
    selectedFund : "_selected_fund",
    serialNo : "___serialNo",
    serialNo_info : "___serialNo_trade_info",
    serialNo_forword_url : "___serialNo_trade_forword_url",
    serialNo_success_show_data : "__setUpsuccess_show_data__",
    serialNo_bindCard : "___serialNo_bindcard",
    successInfo : "__success_info",
    tradeResultInfo : "__trade_result_info",
    revenueDate : "__revenueDate",
    arrivalDate : "__arrivalDate",
    takeBackType : "__take_back_type",
    tradeInfoList : "___trade_info_list",
    bindCards : "__bind_card_list",
    bindSelectedCard : "_bind_selected_card",
    bindCreditCard : "__bind_creditcard_info",
    bindCreditCardChannels : "__bind_Credit_channel_list",
    card_limit_val : "__taskcash_card_limit_val",
    param : "__selected_param",
    rsource : "__req_source",
    forwardUrl : "__req_source_forward_url",
    availableProductList : "__available_Product_List",
    selectProFundId : "__selected_pro_fundId",
    isSM : "T",
    loadingListCount: 0,
	ecTradeSerialNo : "__ecTradeSerialNo",
    recomfundLists : "_recom_fund_lists",
    fundLists : "_fund_lists",
    bannerInfo : "_bannerInfo",
    fundInfo : "_fundInfo",
    myFund : "_myFund",
    navList : "_navList",
    setSession : function(key, value){
        if(value != null && value != undefined){
            var otype = Object.prototype.toString.call(value);
            if(otype == "[object Object]" || otype == "[object Array]") {
                App.sessionStorage.setItem(String(key), JSON.stringify(value));
            } else if (otype == "[object String]" || otype == "[object Number]" || otype == "[object Boolean]"){
                App.sessionStorage.setItem(String(key), value);
            } else{
                /** Function and Undefined and Null not save */
            }
        }
    },

    getSession : function(key){
        var valStr = App.sessionStorage.getItem(String(key));
        if (/^[\[]+(.)*[\]]+$/.test(valStr) || /^[\{]+(.)*[\}]+$/.test(valStr)){
            //Object,Array
            return JSON.parse(valStr);
        } else {
            return valStr;
        }
    },


    removeSession : function(key){
        App.sessionStorage.removeItem(key);
    },
    clearSession : function () {
        App.sessionStorage.clear();
    },

    bind : function (target, eventNm, eventFun) {
        $(target).hammer().bind(eventNm, eventFun);
    },

    unbind : function (target, eventNm, eventFun) {
        $(target).hammer().unbind(eventNm, eventFun);
    },

    unbindAll : function (target, eventNm) {
        $(target).hammer().unbind(eventNm);
    },
    uploadFile : function (url, data, fun, eventFn, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url,
            data:data,
            type:"POST",
            contentType: false,
            processData:false,
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            },
            success:function(result){
                App.isLoading(false);
                switch(result.returnCode){
                    case 0:
                        if(App.isFunction(fun)){
                            eval(fun).call(this,result);
                        }
                        break;
                    case 1000:
                        // alert(result.returnMsg);
                        window.location = App.loginPage;
                        break;
                    case 1005:
                        // 20210810 单点登录改造，APP6.9开始
                        // 三方登录/uaa/v1/third-part/login情况下的sso_cookie不受影响，不会有此返回值，只有账密登录情况才会有
                        console.log('sso_cookie不是最新，已在其他地方登录!')
                        App.clearSession();
                        App.setCookie('sso_cookie', '', new Date() );  // 清除sso_cookie值
                        var tipsObjLogin = {
                            content: result.returnMsg,
                            confirmText: '去登录',
                            complete: function () {
                                utils.authWap();
                            }
                        };
                        utils.showTips(tipsObjLogin);
                        break;
                    case 9999:
                        if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                            alertTips("网络连接错误！");
                        }else{
                            alertTips(result.returnMsg);
                        }
                        break;
                    default:
                        alertTips(result.returnMsg);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this,result);
                }
            }, dataType:"json", error: function(e){
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync});
    },

    post : function (url,data,eventFn,fun, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url, data:data,
            type:"POST",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            },
            success:function(result){
                App.isLoading(false);
                switch(result.returnCode){
                    case 0:
                        if(App.isFunction(fun)){
                            if(result.body != null && result.body != undefined){
                                var option = result.body.optional;
                                if(option == '0'){
                                    alertTips4("信息",result.body.optionalMsg, "立即完善", "暂不完善",
                                        function(){window.location.href = "../userInfo/parfectInfo.html?forwardUrl=" + window.location.href;},
                                        function(){eval(fun).call(this,result);}
                                    );
                                } else {
                                    eval(fun).call(this,result);
                                }
                            } else {
                                eval(fun).call(this,result);
                            }
                        }
                        break;
                    case 1000:
                        // alert(result.returnMsg);
                        // window.location = App.loginPage;
                        sessionExpireLogin();
                        break;
                    case 1005:
                        // 20210810 单点登录改造，APP6.9开始
                        // 三方登录/uaa/v1/third-part/login情况下的sso_cookie不受影响，不会有此返回值，只有账密登录情况才会有
                        console.log('sso_cookie不是最新，已在其他地方登录!')
                        App.clearSession();
                        App.setCookie('sso_cookie', '', new Date() );  // 清除sso_cookie值
                        var tipsObjLogin = {
                            content: result.returnMsg,
                            confirmText: '去登录',
                            complete: function () {
                                utils.authWap();
                            }
                        };
                        utils.showTips(tipsObjLogin);
                        break;
                    case 9999:
                        if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                            alertTips("网络连接错误！");
                        }else{
                            alertTips(result.returnMsg);
                        }
                        break;
                    case 4105:
                        showPerfectInfo(result.returnMsg);
                        break;
                    case 4106:
                        showPerfectInfo(result.returnMsg);
                        break;
                    case 4107:
                        showPerfectInfo(result.returnMsg);
                        break;
                    case 4108:
                        showPerfectInfo(result.returnMsg);
                        break;
                    case 4109:
                        showPerfectInfo(result.returnMsg);
                        break;
                    default:
                        alertTips(result.returnMsg);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this,result);
                }
            }, dataType:"json", error: function(e){
                // alert(e.status +" => "+ e.statusText);
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync});
    },

    postNoJump : function (url,data,eventFn,fun, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url, data:data,
            type:"POST",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            },
            success:function(result){
                App.isLoading(false);
                switch(result.returnCode){
                    case 0:
                        if(App.isFunction(fun)){
                            if(result.body != null && result.body != undefined){
                                var option = result.body.optional;
                                if(option == '0'){
                                    alertTips4("信息",result.body.optionalMsg, "立即完善", "暂不完善",
                                        function(){window.location.href = "../userInfo/parfectInfo.html?forwardUrl=" + window.location.href;},
                                        function(){eval(fun).call(this,result);}
                                    );
                                } else {
                                    eval(fun).call(this,result);
                                }
                            } else {
                                eval(fun).call(this,result);
                            }
                        }
                        break;
                    case 1000:
                        if(App.isFunction(fun)){
                            if(result.body != null && result.body != undefined){
                                var option = result.body.optional;
                                if(option == '0'){
                                    alertTips4("信息",result.body.optionalMsg, "立即完善", "暂不完善",
                                        function(){window.location.href = "../userInfo/parfectInfo.html?forwardUrl=" + window.location.href;},
                                        function(){eval(fun).call(this,result);}
                                    );
                                } else {
                                    eval(fun).call(this,result);
                                }
                            } else {
                                eval(fun).call(this,result);
                            }
                        }
                        break;
                    case 1005:
                        // 20210810 单点登录改造，APP6.9开始
                        // 三方登录/uaa/v1/third-part/login情况下的sso_cookie不受影响，不会有此返回值，只有账密登录情况才会有
                        console.log('sso_cookie不是最新，已在其他地方登录!')
                        App.clearSession();
                        App.setCookie('sso_cookie', '', new Date() );  // 清除sso_cookie值
                        var tipsObjLogin = {
                            content: result.returnMsg,
                            confirmText: '去登录',
                            complete: function () {
                                utils.authWap();
                            }
                        };
                        utils.showTips(tipsObjLogin);
                        break;
                    case 9999:
                        if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                            alertTips("网络连接错误！");
                        }else{
                            alertTips(result.returnMsg);
                        }
                        break;
                    case 4106:
                        alertTips4("信息",result.returnMsg, "取消", "立即完善",
                            function(){$(".Bomb-box").hide();},
                            function(){window.location.href = "../userInfo/parfectInfo.html";}
                        );
                        break;
                    case 4108:
                        alertTips4("信息",result.returnMsg, "取消", "立即完善",
                            function(){$(".Bomb-box").hide();},
                            function(){window.location.href = "../userInfo/parfectInfo.html";}
                        );
                        break;
                    case 4109:
                        alertTips4("信息",result.returnMsg, "取消", "立即完善",
                            function(){$(".Bomb-box").hide();},
                            function(){window.location.href = "../userInfo/parfectInfo.html";}
                        );
                        break;
                    default:
                        alertTips(result.returnMsg);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this,result);
                }
            }, dataType:"json", error: function(e){
                // alert(e.status +" => "+ e.statusText);
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync});
    },

    put : function (url,data,eventFn,fun, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url, data:data,
            type:"PUT",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            },
            success:function(result){
                App.isLoading(false);
                switch(result.returnCode){
                    case 0:
                        if(App.isFunction(fun)){
                            eval(fun).call(this,result);
                        }
                        break;
                    case 1000:
                        // alert(result.returnMsg);
                        // window.location = App.loginPage;
                        sessionExpireLogin();
                        break;
                    case 1005:
                        // 20210810 单点登录改造，APP6.9开始
                        // 三方登录/uaa/v1/third-part/login情况下的sso_cookie不受影响，不会有此返回值，只有账密登录情况才会有
                        console.log('sso_cookie不是最新，已在其他地方登录!')
                        App.clearSession();
                        App.setCookie('sso_cookie', '', new Date() );  // 清除sso_cookie值
                        var tipsObjLogin = {
                            content: result.returnMsg,
                            confirmText: '去登录',
                            complete: function () {
                                utils.authWap();
                            }
                        };
                        utils.showTips(tipsObjLogin);
                        break;
                    case 9999:
                        if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                            alertTips("网络连接错误！");
                        }else{
                            alertTips(result.returnMsg);
                        }
                        break;
                    default:
                        alertTips(result.returnMsg);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this,result);
                }
            }, dataType:"json", error: function(e){
                App.isLoading(false);
                // alert(e.status +" => "+ e.statusText);
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync});
    },

    get : function (url,eventFn,fun, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url,
            type:"GET",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            }, success:function(result){
                App.isLoading(false);
                switch(result.returnCode){
                    case 0:
                        if(App.isFunction(fun)){
                            eval(fun).call(this,result);
                        }
                        break;
                    case 1000:
                        // alert(result.returnMsg);
                        // window.location = App.loginPage;
                        sessionExpireLogin();
                        break;
                    case 1005:
                        // 20210810 单点登录改造，APP6.9开始
                        // 三方登录/uaa/v1/third-part/login情况下的sso_cookie不受影响，不会有此返回值，只有账密登录情况才会有
                        console.log('sso_cookie不是最新，已在其他地方登录!')
                        App.clearSession();
                        App.setCookie('sso_cookie', '', new Date() );  // 清除sso_cookie值
                        var tipsObjLogin = {
                            content: result.returnMsg,
                            confirmText: '去登录',
                            complete: function () {
                                utils.authWap();
                            }
                        };
                        utils.showTips(tipsObjLogin);
                        break;
                    case 9999:
                        
                        if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                            alertTips("网络连接错误！");
                        }else{
                            alertTips(result.returnMsg);
                        }
                        break;
                    default:
                        alertTips(result.returnMsg);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            }, dataType:"json", error:function (e) {
                App.isLoading(false);
//             alert(e.status +" => "+ e.statusText);
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync})
    },

    getNoJump : function (url,eventFn,fun, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url,
            type:"GET",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            }, success:function(result){
                App.isLoading(false);
                switch(result.returnCode){
                    case 0:
                        if(App.isFunction(fun)){
                            eval(fun).call(this,result);
                        }
                        break;
                    case 1000:
                        if(App.isFunction(fun)){
                            eval(fun).call(this,result);
                        }
                        break;
                    case 1005:
                        // 20210810 单点登录改造，APP6.9开始
                        // 三方登录/uaa/v1/third-part/login情况下的sso_cookie不受影响，不会有此返回值，只有账密登录情况才会有
                        console.log('sso_cookie不是最新，已在其他地方登录!')
                        App.clearSession();
                        App.setCookie('sso_cookie', '', new Date() );  // 清除sso_cookie值
                        if(App.isFunction(fun)){
                            eval(fun).call(this,result);
                        }
                        break;
                    case 9999:
                        if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                            alertTips("网络连接错误！");
                        }else{
                            alertTips(result.returnMsg);
                        }
                        break;
                    default:
                        alertTips(result.returnMsg);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            }, dataType:"json", error:function (e) {
                App.isLoading(false);
//             alert(e.status +" => "+ e.statusText);
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync})
    },

    getDoNotProcessResult : function (url,eventFn,fun, async){
        App.isLoading(true);
        var isAsync = true;
        if(async != undefined && async != null){
            isAsync = async;
        }
        $.ajax({url:url,
            type:"GET",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");
                if(App.getCookie('traceCode')){
                    req.setRequestHeader("X-TraceCode", App.getCookie('traceCode'));
                }
            }, success:function(result){
                App.isLoading(false);
                if(App.isFunction(fun)){
                    eval(fun).call(this,result);
                }
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            }, dataType:"json", error:function (e) {
                App.isLoading(false);
                if(App.isFunction(eventFn)){
                    eval(eventFn).call(this);
                }
            },async:isAsync})
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

    firstUsingCard : function(successFun){
        var cards = App.getSession(App.cards);
        if(cards == null || (cards != null && cards.length == 0)){
            App.queryTradeCard(successFun);
        }else{
            if(cards.length > 0){
                for(var index in cards){
                    var card = cards[index];
                    if("1" == card.tradeFlag){
                        return card;
                    }
                }
            }else{
                alertTips("请先绑定一张银行卡！");
                window.location = "../card/manage_card.html";
            }
        }
        return null;
    },

    getCard : function(bankNo, bankAcco){
        var cards = App.getSession(App.cards);
        for(var index in cards){
            var card = cards[index];
            if(card.bankNo == bankNo && card.bankAcco == bankAcco){
                return card;
            }
        }
        return null;
    },

    getBankName : function(bankNo){
        var cards = App.getSession(App.cards);
        for(var index in cards){
            var card = cards[index];
            if(card.bankNo == bankNo){
                return card;
            }
        }
        return null;
    },

    getDisplayAcco : function (bankAcco) {
        return "尾号" + bankAcco.substr(bankAcco.length - 4, bankAcco.length);
    },

    getDisplayMob : function (mobileNo) {
        return mobileNo.substr(0, 3) + "****" + mobileNo.substr(mobileNo.length - 4, mobileNo.length);
    },

    isNotEmpty : function (str){
        if(str == null || str == undefined || str == "" || String(str).trim() == "" || str == "null"){
            return false;
        }
        return true;
    },

    isEmpty : function (str){
        if(str == null || str == undefined || str == "" || String(str).trim() == "" || str == "null"){
            return true;
        }
        return false;
    },

    isNotNull : function (str){
        if(str == null || str == undefined){
            return false;
        }
        return true;
    },

    isNull : function (str){
        if(str == null || str == undefined){
            return true;
        }
        return false;
    },

    isFunction : function (eventFn){
        if(eventFn != undefined && eventFn != null && typeof eventFn == "function"){
            return true;
        }else{
            return false;
        }
    },
    isNumber : function (value) {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        if (patrn.exec(value) == null || value == "") {
            return false
        } else {
            return true
        }
    },
    cancel_alert:function(){
        $("#pwd").val("");
        $("#setpwd").val("");
        $("#setpwdconfirm").val("");
        $("#alert-password-div").hide();
        $("#alert-password-div1").hide();
        $("#alert-password-div2").hide();
    },
    show_alert:function(){
        $("#alert-password-div").show();
        $("#pwd").focus();
    },

    numberFormat: function numberFormat(s){
        s = String(s).replace(/,/g, '');  //如果有添加过 英文逗号","  则先去掉 20220221
        var h='';
        if(s.charAt(0)=='-'){
            h='-';
            s=s.slice(1);
        }
        if(/[^0-9\.]/.test(s)) return "invalid value";
        s=s.replace(/^(\d*)$/,"$1.");
        s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
        s=s.replace(".",",");
        var re=/(\d)(\d{3},)/;
        while(re.test(s))
            s=s.replace(re,"$1,$2");
        s=s.replace(/,(\d\d)$/,".$1");
        return h + s.replace(/^\./,"0.");
    },

    getUrlParam: function (key) {
        
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			if(key == "referUrl" || key == "next_jump"){
				return decodeURIComponent(r[2]);
			}else{
				return r[2];
			}
		}

        return "";
    },
    /**
     * 切换颜色
     * @param fieldNm
     * @param removeColor
     * @param addColor
     */
    transferColor: function (fieldNm, removeColor, addColor) {
        $(fieldNm).removeClass(removeColor);
        $(fieldNm).addClass(addColor);
    },
    /**
     * 格式化货币
     * @param fieldNm
     * @param removeColor
     * @param addColor
     */
    formatMoney: function (num, scaleNum) {
        if(App.isEmpty(num)){
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
    },
    formatNumber: function (num, len) {
        return App.formatMoney(Number(num).toFixed(len));
    },
    formatDateStr: function (date, format) {
        if (App.isEmpty(date)){
            return "";
        }
        if (date.length == 8){
            var year = date.substring(0, 4);
            var month = date.substring(4, 6);
            var day = date.substring(6);
            if(App.isNotEmpty(format)){
                return format.replace('yyyy', year).replace('MM', month).replace('dd', day);
            } else {
                return year + "-" + month + "-" + day;
            }

        } else if(date.length == 14){
            var year = date.substring(0, 4);
            var month = date.substring(4, 6);
            var day = date.substring(6, 8);
            var hour = date.substring(8, 10);
            var minute = date.substring(10, 12);
            var second = date.substring(12);
            if(App.isNotEmpty(format)){
                return format.replace('yyyy', year).replace('MM', month).replace('dd', day).replace('hh', hour).replace('mm', minute).replace('ss', second);
            } else {
                return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            }

        } else {
            return date;
        }
    },
    formatDateMD:function (type, date) {
        var showDate = type == 'MM' ? '每月' + Number(date) + '日' : App.formatDateStr(date);
        return showDate;
    },
    formatTargetDateStr:function(formate,date) {
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(formate))
            formate=formate.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(formate))
                formate = formate.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return formate;
    },

    //yyyyMMdd to date
    strToDate:function(dateStr){
        var pattern = /(\d{4})(\d{2})(\d{2})/;
        var formatedDate = dateStr.replace(pattern, "$1/$2/$3");
        return new Date(formatedDate);
    },
    dateCalculation:function (interval, number, date) {
        switch (interval) {
            case "y": {
                date.setFullYear(date.getFullYear() + number);
                return date;
                break;
            }
            case "q": {
                date.setMonth(date.getMonth() + number * 3);
                return date;
                break;
            }
            case "M": {
                date.setMonth(date.getMonth() + number);
                return date;
                break;
            }
            case "w": {
                date.setDate(date.getDate() + number * 7);
                return date;
                break;
            }
            case "d": {
                date.setDate(date.getDate() + number);
                return date;
                break;
            }
            case "h": {
                date.setHours(date.getHours() + number);
                return date;
                break;
            }
            case "m": {
                date.setMinutes(date.getMinutes() + number);
                return date;
                break;
            }
            case "s": {
                date.setSeconds(date.getSeconds() + number);
                return date;
                break;
            }
            default: {
                date.setDate(d.getDate() + number);
                return date;
                break;
            }
        }
    },
    tradePwd : function (pwd, eventFn, fun){
        var serialNo = App.getSession(App.serialNo);
        var url = App.projectNm + "/confirm_web";
        var data = {"serialNo": serialNo, "tradePwd": pwd};

        var tradeParam = App.getSession(App.serialNo_success_show_data);
        if(tradeParam != undefined && tradeParam != null && App.isNotEmpty(tradeParam.couponSerialNo)) {
            data.couponSerialNo = tradeParam.couponSerialNo;
        }

        App.post(url,JSON.stringify(data),eventFn, fun);
    },
    /* mobile-bff 交易密码接口 */
    tradeBffPwd : function (pwd, eventFn, fun){
        var serialNo = App.getSession(App.serialNo);
        var url = "/mobile-bff/v1/verify/verifyPasswordWeb";
        var data = {"serialNo": serialNo, "tradePwd": pwd};

        var tradeParam = App.getSession(App.serialNo_success_show_data);
        if(tradeParam != undefined && tradeParam != null && App.isNotEmpty(tradeParam.couponSerialNo)) {
            data.couponSerialNo = tradeParam.couponSerialNo;
        }

        App.post(url,JSON.stringify(data),eventFn, fun);
    },
    /**
     * 查询账户信息
     */
    queryAccountInfo: function (successFun) {
        var url = App.projectNm + "/account/account?date=" + (new Date()).getTime();
        App.get(url, null, function (result) {
            App.setSession(App.accountInfo, result.body);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },
    queryHomePageInfo: function (successFun) {
        var url = App.projectNm + "/account/query_home_page_info?date=" + (new Date()).getTime();
        App.get(url, null, function (result) {
            App.setSession(App.accountHomePageInfo, result.body);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },

    /**
     *  查询现金宝收益信息
     */
    queryLastProfit : function (successFun){
        var url = App.projectNm + "/last_profit?date="+ (new Date()).getTime();
        App.get(url,null,function(result){
            App.setSession(App.profitInfo, result.body);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },

    /**
     * 查询银行卡列表
     */
     queryCard: function (successFun) {
        // var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
        var url = "/mobile-bff/v1/account/card";
        App.get(url, null, function (result) {
            var cards = result.body;
            App.setSession(App.cards, cards);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },

    /**
     * 查询可交易银行卡列表
     */
     queryTradeCard: function (successFun) {
        // var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
        var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=07&tradeScene=13" ;
        App.get(url, null, function (result) {
            var payCards = result.body.bankInfos;
            var cards = payCards.filter(function(item){
                return item.bankGrpName != '现金宝';
            });
            App.setSession(App.cards, cards);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },    

    /**
     * 查询WAP取现银行卡列表
     */
    queryWapCard: function (successFun) {
        var url = "/mobile-bff/v1/fund/queryBnkCardListUsedByWap?currencyType=156&acceptMode=4&date=" + (new Date()).getTime();
        App.get(url, null, function (result) {
            var cards = result.body.bankInfos;
            App.setSession(App.cards, cards);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },

    /**
     * 查询信用卡列表
     */
    queryCreditCard: function (successFun) {
        var url = App.projectNm + "/credit/credit?date=" + (new Date()).getTime();
        App.get(url, null, function (result) {
            App.setSession(App.creditCards, result.body.card);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },


    /**
     * 查询用户信息
     */
    queryUserInfo: function (successFun) {
        var url = App.projectNm + "/account/query_user_info_wap?date=" + (new Date()).getTime();
        App.get(url, null, function (result) {
            App.setSession(App.userInfo, result.body);
            if(App.isFunction(successFun)){
                eval(successFun).call(this);
            }
        });
    },

    /**
     * 信用卡还款
     */
    creditCardSelected: function () {
        var data = $(event.target).attr("data");
        if (data == null || data == undefined) {
            var target = $(event.target);
            for (var i = 0; i < 5; i++) {
                target = target.parent();
                data = target.attr("data");
                if (data != undefined) break;
            }
        }
        var creditCardList = App.getSession(App.creditCards);
        for (var i in creditCardList) {
            var card = creditCardList[i];
            if (card.id == data) {
                App.setSession(App.selectedCreditCard, card);
            }
        }
        window.location = "./creditcard_step2.html"
    },

    /**
     * 查询是否设置过交易密码
     */
    queryHasSetTradePassword: function (callback) {
        var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);
        $.ajax({url:url, data:null,
            type:"GET",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "6.1");

            },
            success:function(result){
		            if(App.isFunction(callback)){
		                eval(callback).call(this, result);
		            }
            }
        });
        // App.get(url, null, function (result) {
        //     if(App.isFunction(callback)){
        //         eval(callback).call(this, result);
        //     }
        // });

    },

    /**
     * 退出
     */
    logout: function () {
        var url = App.projectNm + "/account/logout";
        App.post(url, "", null, function (result) {
            App.clearSession();
            window.location = "/tradeh5/newWap/auth/login_wap.html";
        });
    },

    /**
     * 成功页面的按钮
     */
    confirmBtnEvent: function (fun) {
        if(App.isWeixin()){
            App.unbindAll("#confirm_btn", "tap");
            App.bind("#confirm_btn", "tap", function () {
                if (App.isWeixin && typeof WeixinJSBridge != "undefined"){
                    WeixinJSBridge.invoke('closeWindow',{},function(res){
                        //alert(res.err_msg);
                    });
                }
            });
        }else{
            if(App.isFunction(fun)){
                eval(fun).call(this);
            }
        }
    },

    /**
     * 验证短信验证码的合法性
     */
    verifySMSPwd: function (pwd){
        if(/^\w{6}$/.test(pwd)){
            return true;
        }
        alert("短信确认码必须是六个数字或字母组成！");
        return false;
    },

    /**
     * 验证登录密码的合法性
     */
    verifyLoginPwd: function (pwd){
        if(/^\w{4,16}$/.test(pwd)){
            return true;
        }
        alert("您输入的登录密码不合规！");
        return false;
    },

    /**
     * 验证交易密码的合法性
     */
    verifyTradePwd: function (pwd){
        if(/^\d{6}$/.test(pwd)){
            return true;
        }
        alert("交易密码必须是六个数字组成！");
        return false;
    },

    /**
     * 验证银行卡号的合法性
     */
    verifyBankAcco: function (bankAcco){
        if(/^\w{15,19}$/.test(bankAcco)){
            return true;
        }
        alert("请填写正确的银行卡卡号");
        return false;
    },

    /**
     * 验证身份证号的合法性
     */
    verifyIdNo: function (idno){
        if(/(^\d{18}$)|(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(idno)){
            return true;
        }
        alert("请填写正确的证件号");
        return false;
    },

    /**
     * 是否loading
     * @returns {boolean}
     */
    isLoading: function (bool) {
        if(App.loadingList(bool)){
            $("#over").show();
            $("#layout").show();
        }else{
            $("#over").hide();
            $("#layout").hide();
        }
    },

    /*
     * 增加loading统计
     *
     */

    loadingList :function (bool){
        if(bool){
            App.loadingListCount = App.loadingListCount+1;
        }else{
            App.loadingListCount = App.loadingListCount-1;
        }

//        console.log("loadingListCount:"+App.loadingListCount);

        if(App.loadingListCount < 1){
            return false;
        }else{
            return true;
        }
    },

    getIdTpDesc :function (code){
        if(code == '0') {
            return '身份证';
        } else if(code == '1'){
            return '护照';
        } else if(code == '2'){
            return '军官证';
        } else if(code == '3'){
            return '士兵证';
        } else if(code == '4'){
            return '港澳居民来往内地通行证';
        } else if(code == '5'){
            return '户口本';
        } else if(code == '6'){
            return '外籍护照';
        } else if(code == '8'){
            return '文职证';
        } else if(code == '9'){
            return '警官证';
        } else if(code == 'A'){
            return '台胞证';
        } else if(code == '1'){
            return '外国人永久居住证';
        }else{
            return '其它';
        }
    },

    /**
     * 替换字符串
     * @param val
     * @param queryVal
     * @param repVal
     */
    replaceTxt :function (val,queryVal,repVal){
        var reVal = val;
        if(String(val).indexOf(queryVal) > -1){
            reVal = String(val).replace(queryVal, repVal);
        }
        return reVal;
    },

    /**
     * 是否为微信
     * @returns {boolean}
     */
    isWeixin: function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 字符串截取加"..."
     */
    subString: function (str, maxLen, suffix) {
        if(str.length > maxLen){
            return str.substring(0, maxLen) + suffix;
        }
        return str;
    }
};

Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
//--公共的初始方法---------------------------------------------------------------
$(function(){

    var source = App.getUrlParam("fu");
    if(source != undefined && source != null && "" != source){
        App.setSession(App.rsource, source);
        App.get(App.projectNm + "/get_forward_url?rsource=" + source,null,function(result){
            var url = result.body.url;
            if(App.isNotEmpty(url)){
                App.setSession(App.forwardUrl, url);
            }
        });
    }

    var referUrl = App.getUrlParam("referUrl");
    if(App.isNotEmpty(referUrl)){
        App.setSession("referUrl", referUrl);
        App.setCookie("referUrl", referUrl);
    }
    var channel = App.getUrlParam("channel");
    if(App.isNotEmpty(channel)){
        App.setSession("channel", channel);
        App.setCookie("channel", channel);
    }
    var recommendNo = App.getUrlParam("rcmdNo");
    if(App.isNotEmpty(recommendNo)){
        App.setSession("recommendNo", recommendNo);
        App.setCookie("recommendNo", recommendNo);
    }
    var loadingImagePath = "..";

    if(window.location.pathname.indexOf('wezhan') > -1 &&
        (
            window.location.pathname.indexOf('wezhan/service.html') == -1
            && window.location.pathname.indexOf('wezhan/viewPoint.html') == -1
            && window.location.pathname.indexOf('wezhan/welfare.html') == -1
            && window.location.pathname.indexOf('wezhan/mine.html') == -1
        )
        ||
    (
        // App.getCookie("channelCode") === 'airstar' &&
        (
            ~window.location.pathname.indexOf('/wap/fund/fundPurchaseSuccessfully.html')
            || ~window.location.pathname.indexOf('/wap/fundgroup/fund_group_purchase_successfully.html')
            || ~window.location.pathname.indexOf('/wap/fundgroup/pursuccess.html')
            || ~window.location.pathname.indexOf('/wap/common/result.html')
            || ~window.location.pathname.indexOf('/wap/fund/steadyCombination.html') // 基金详情
            || ~window.location.pathname.indexOf('/wap/fundgroup/my_mip.html') // 我的定投
            || ~window.location.pathname.indexOf('/wap/trade/tradeList.html')  // 交易记录
        )
    )){
        $(document.body).append("<a href='javascript:;' class='go_home'>回首页</a>");
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

    if(window.location.pathname.indexOf('wapWeb') == -1){
        $(document.body).append("<div id='over' class='over'></div>"
            +"<div id='layout' class='layout' style='display:none'><div class='loading-img'><img src='"+ loadingImagePath +"/img/loadingHUD.png' /></div><div class='f12 f-white'>加载中..</div></div>");
    }
    if(App.isWeixin()){
		/*
        $(".top-bar").hide();
        $("#wrapper").removeClass("wrapper-top_show");
        $("#wrapper").addClass("wrapper-top_hide");
        //$("#confirm_btn").hide();

        function onBridgeReady(){
            WeixinJSBridge.call('hideOptionMenu');
        }

        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
		*/
    }else{
        $("#wrapper").addClass("wrapper-top_show");
        $("#wrapper").removeClass("wrapper-top_hide");
    }
});
/**
 * Created by lh on 14-11-24.
 */

function replaceTxt2Html(val){
	return App.replaceTxt(val, "如何提升限额？", "<a href='https://app.99fund.com/mobileEC/common/bankCardUpDesc.html'>如何提升限额？</a>");
}

/* 显示基金列表信息 */
function showFundList(fundLists){ var i =0;
    var fundid = App.getUrlParam("fundid");
    var fundtp = App.getUrlParam("fundtp");
    for(var index in fundLists){
        var funditem = fundLists[index];
        if(arguments.length==2 && arguments[1]!=''){
            if(arguments[1]!=funditem.fundTp){
                continue;
            }
            if(fundid==funditem.fundId){
                continue;
            }
        }

        //搜索判断
        if(arguments.length==3 && arguments[1]!='' && arguments[2]!=''){
            //代码
            if(!isNaN(arguments[2])){
                if(funditem.fundId.indexOf(arguments[2])=='-1'){
                    continue;
                }
            }else{
                if(funditem.fundNm.indexOf(arguments[2])=='-1'){
                    continue;
                }
            }
            //文字
        }
        $(".fund_list").append('<div class="item" data="'+funditem.fundId+'" fundtp="'+funditem.fundTp+'">' +
                '<div class="leftbox">' +
                '<div class="title f16 f-black">'+funditem.fundNm+'</div>' +
                '<div class="content f12">最近三月收益率:<span class="'+showProfitCss(funditem.thrMonthProfit)+'">' +App.numberFormat(funditem.thrMonthProfit)+'%</span></div>' +
                '<div class="content f12">最近一年收益率:<span class="'+showProfitCss(funditem.yearProfit)+'">'+App.numberFormat(funditem.yearProfit)+'%</span></div>' +
                '<div class="content f12">申购费率:<span class="line-del">'+funditem.stdRate+'%</span><span class="f-orange">'+funditem.curRate+'%</span></div>' +
                '</div>' +
                '<div class="rightbox">' +
                '<div class="chart" style="height: 25px;"></div>' +
                '<div class="chart_desc">净值:<span class="f-orange">' +funditem.nav.toFixed(3)+'</span><br/><span class="f8 '+showProfitCss(funditem.yield)+'">('+App.numberFormat(funditem.yield.toFixed(2))+'%)</span></div>'+
                '</div>' +
                '</div>' +
                '<div class="line"></div>'
        );

        if(fundid){
            App.bind(".item", "tap", fundChange);
        }else{
            App.bind(".item", "tap", fundDetailInfo);
        }

    }
}
/*详细信息*/
function fundDetailInfo(){
    var data = $(event.target).attr("data");
    var fundtp = $(event.target).attr("fundtp");
    if(data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 10; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break;
        }
    }
    if(fundtp == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 10; i++) {
            target = target.parent();
            fundtp = target.attr("fundtp");
            if (fundtp != undefined) break;
        }
    }
    window.location = "./detail.html?fundid="+data+"&fundtp="+fundtp;
}
//转换基金
function fundChange(){
    var fundid = App.getUrlParam("fundid");
    var data = $(event.target).attr("data");
    var fundtp = $(event.target).attr("fundtp");
    if(data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 10; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break;
        }
    }
    window.location = "./change.html?newfundid="+data+"&fundid="+fundid;
}
//显示累计收益
function showProfit(s){
    s = String(s);
    var h='+';
    if(s.charAt(0)=='-'){
        h='-';
        s=s.slice(1);
    }
    if(/[^0-9\.]/.test(s)) return "invalid value";
    s=s.replace(/^(\d*)$/,"$1.");
    s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
    s=s.replace(".",",");
    var re=/(\d)(\d{3},)/;
    while(re.test(s))
        s=s.replace(re,"$1,$2");
    s=s.replace(/,(\d\d)$/,".$1");
    return h + s.replace(/^\./,"0.");
}
//显示累计收益样式
function showProfitCss(s){
    s = String(s);
    var h='';
    if(s.charAt(0)=='-'){
        return "f-green";
    }
    return "f-red";
}
//显示基金类型
function showFundType(t){
    var Type = "股票型";
    switch (t){
        case 1:
            Type = "货币型";
            break;
        case 2:
            Type = "债券型";
            break;
        case 3:
            Type = "混合型";
            break;
        case 4:
            Type = "海外股型";
            break;
        case 6:
            Type = "指数";
            break;
        case 8:
            Type = "理财基金";
            break;
    }
    return Type;
}
//基金显示走势图
function showCharts(){
    $("canvas").each(function(){
        var labelArr = new Array();
        var datastr = '';
        var fid = $(this).attr('id');
        var url = App.projectNm + "/fund/query_fund_yields?count=30&fundIds="+fid;
        App.get(url, null, function (result) {
            var out = result.body.fundYields;
            for(var idindex in out) {
                var iditem = out[idindex];
                datastr = iditem.income;
                var dataArr = new Array();
                dataArr = datastr.split(",");
                if (dataArr.length>1) {
                    for (i = 0; i < dataArr.length; i++) {
                        labelArr.push(i);
                    }
                }
            }
            if(dataArr.length<=0) {
                labelArr = [1];
                dataArr = [1];

            }
            var lineChartData = {
                labels: labelArr,
                datasets: [
                    {
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "#ff8203",
                        data: dataArr
                    }
                ]
            };
            var ctx = document.getElementById(fid).getContext("2d");
            window.myLine = new Chart(ctx).Line(lineChartData, {

            });
        })
    });
}

/**
 * 去登录
 */

$(".goto_login").click(function () {
    window.location.href = "/tradeh5/newWap/auth/login_wap.html?referUrl=" + encodeURIComponent(document.URL);
});

/**
 * Created by ... on 2017/7/27.
 */

$(".Bomb-box-ok").click(function () {
    $(".Bomb-box").hide();
});

// 选择银行卡
$(".selectBankCard").click(function(){
    $("#bankCardList").show();
});
// 选择银行卡
$(".selectBuysType").click(function(){
    $("#bankCardList").show();
});
//选择礼券
$(".selectGift").click(function(){
    $("#couponList").show();
    $(".mask").show();
});

$(".giftlist ul li").on("click",function(event){
    $(".giftlist ul li .right").each(function(){
		$(this).removeClass('activeChose').addClass("leaveChose")
    })
    $(this).children(".right").addClass("activeChose").removeClass("leaveChose");
})
// 银行卡,列表
$("#bankCardList").click(function(){
    $("#bankCard").html($(this).find(".bank-name").html()).removeClass("gray");
    $("#bankCardList").hide();
});

// 清楚input框
$(".clearInput").click(function(){
    $(this).parent(".row").find("input").val("");
});

// 清楚input框
$(".clearInputTxt").click(function(){
    $(this).siblings("input").val("").trigger("input");
});
$(".close_button").click(function(){ 
    $("#couponList").hide();
    $(".mask").hide();
});
// 清楚input框
$(".clearInput").click(function(){
    $(this).siblings("input").val("").trigger("input");
});

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

function alertTips(){
	if(arguments.length == 1){
		showTips("信息", arguments[0], "确定");
	}else if(arguments.length == 2){
		showTips("信息", arguments[0], arguments[1]);
	}else if(arguments.length == 3){
		showTips("信息", arguments[0], arguments[1]);
		var fun = arguments[2];
		$(".Bomb-box-ok").click(function () {
			eval(fun).call(this);
		});
	}
}
function alertTips4(){
    $(".Bomb-box-ok").hide();

    if(arguments.length == 6) {
        var btnHtml =
            "<div style='display: flex;'>" +
            "<a class='Bomb-box-ok Bomb-box-1' href='javascript:;' style='width: 50%;border-right: solid 1px #eeeeee;'>"+ arguments[2] +"</a>" +
            "<a class='Bomb-box-ok Bomb-box-2' href='javascript:;' style='width: 50%;'>"+ arguments[3] +"</a>" +
            "</div>";

        $(".Bomb-box-main").append(btnHtml);
        var fun1 = arguments[4];
        $(".Bomb-box-1").click(function () {
            eval(fun1).call(this);
        });
        var fun2 = arguments[5];
        $(".Bomb-box-2").click(function () {
            eval(fun2).call(this);
        });

        if($(".Bomb-box").length > 0){
            $(".Bomb-box-tips").html(arguments[0]);
            $(".Bomb-box-content p").html(arguments[1]);
            $(".Bomb-box-content p").removeClass();
            $(".Bomb-box-content p").addClass("text-center");
            $(".Bomb-box").show();
        }
    } else {
        alertTips3();
    }
}
function alertTips3(){
    if(arguments.length == 1) {
        showTips("信息", arguments[0], "确定");
    }else if(arguments.length == 2){
        showTips(arguments[0], arguments[1], "确定");
    }else if(arguments.length == 3){
        showTips(arguments[0], arguments[1], arguments[2]);
    }else if(arguments.length == 4){
        showTips(arguments[0], arguments[1], arguments[2]);
        var fun = arguments[3];
        if(App.isFunction(fun)){
            $(".Bomb-box-ok").click(function () {
                eval(fun).call(this);
            });
        }
    }
}
function alertTips2(){
	if(arguments.length == 2){
		if($(".Bomb-box").length > 0){
		    $(".Bomb-box-tips").html("信息");
		    $(".Bomb-box-content p").html(arguments[0]);
		    $(".Bomb-box-content p").removeClass();
		    $(".Bomb-box-content p").addClass(arguments[0]);
		    $(".Bomb-box-ok").html("确定");
		    $(".Bomb-box").show();
		}else{
			alert(content);
		}
	}
}
function alertTipsOne(){
	if(arguments.length == 2){
		if($(".Bomb-box").length > 0){
		    $(".Bomb-box-tips").html("信息");
		    $(".Bomb-box-content p").html(arguments[0]);
		    $(".Bomb-box-content p").removeClass();
		    $(".Bomb-box-content p").addClass(arguments[0]);
		    $(".Bomb-box-ok").html("确定");
		    $(".Bomb-box").show();
            var fun = arguments[1];
            if(App.isFunction(fun)){
                $(".Bomb-box-ok").click(function () {
                    eval(fun).call(this);
                });
            }
		}else{
			alert(content);
		}
	}
}
function showTips(tips, content, btnTxt){
//	console.log($(".Bomb-box").length);
	if($(".Bomb-box").length > 0){
	    $(".Bomb-box-tips").html(tips);
	    $(".Bomb-box-content p").html(content);
	    $(".Bomb-box-content p").removeClass();
	    $(".Bomb-box-content p").addClass("text-center");
	    $(".Bomb-box-ok").html(btnTxt);
	    $(".Bomb-box").show();
	}else{
		alert(content);
	}
}

//计时器脚本
//elemenId：button的id，maxtime：计时时间
function createCosTimer(elemenId,maxtime){
    var o = {
        elemenId : elemenId,
        maxtime:maxtime,
        time : null,
        timeElement : null,

        t:null,
        cosTimer : function(){
            if(time>0){
                time = time - 1;
            }

            if(timeElement.is('button')){
                timeElement.html(time+"秒后重发");
            }
            if(timeElement.is('input')){
                timeElement.attr("value",time+"秒后重发");
            }

            if(time==0){
                timeElement.attr("disabled",null);

                if(timeElement.is('button')){
                    timeElement.html("重新发送");
                }
                if(timeElement.is('input')){
                    timeElement.attr("value","重新发送");
                }

                clearInterval(t);
            }

        },
        start : function(){
            time = maxtime;
            //获取保存dom对象
            timeElement = $("#"+elemenId);
            timeElement.attr("disabled","disabled");
            if(timeElement.is('button')){
                timeElement.html(time+"秒后重发");
            }
            if(timeElement.is('input')){
                timeElement.attr("value",time+"秒后重发");
            }
            clearInterval(this.t);
            t = setInterval(this.cosTimer,1000);
            this.t = t;
        }
    };
    return o;
}


function checkIsIdno(idcard){

    var Errors=new Array( "SUCCESS",
        "身份证号码位数不对！",
        "身份证号码出生日期超出范围或含有非法字符！",
        "身份证号码校验错误！",
        "身份证地区非法！" );

    var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
    var idcard,Y,JYM;
    var S,M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");

    //地区检验
    if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
    //身份号码位数及格式检验
    switch(idcard.length)
    {

        case 15:
            if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
            } else {
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
            }
            if(ereg.test(idcard)){
                return Errors[0];
            }else{
                return Errors[2];
            }
            break;
        case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){
                ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
            } else {
                ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
            }
            if(ereg.test(idcard)){//测试出生日期的合法性
                //计算校验位
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                    + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                    + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                    + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                    + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                    + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                    + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                    + parseInt(idcard_array[7]) * 1
                    + parseInt(idcard_array[8]) * 6
                    + parseInt(idcard_array[9]) * 3 ;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y,1);//判断校验位

                if(M == 'X' && (idcard_array[17] == 'X' || idcard_array[17] == 'x')){
                    return Errors[0];
                }
                if(M == idcard_array[17]){
                    return Errors[0]; //检测ID的校验位
                }else{
                    return Errors[3];
                }
            }else{
                return Errors[2];
            }
            break;
        default:
            return Errors[1];
            break;
    }
    return 'SUCCESS';
}

function tranMipCycle(mipCycle){

    if (mipCycle == "MM"){
    	return '每月';
    }else if (mipCycle == "2W"){
    	return '每双周';
    }else if (mipCycle == "WW"){
    	return '每周';
    }else{
        return "请选择";
    }
}

function tranMipBuyday(mipCycle, mipBuyday){

    if (mipCycle == "MM"){
    	return Number(mipBuyday) + "号";
    }else {

        if (mipBuyday == 1){
        	return '周一';
        }else if (mipBuyday == 2){
        	return '周二';
        }else if (mipBuyday == 3){
        	return '周三';
        }else if (mipBuyday == 4){
        	return '周四';
        }else if (mipBuyday == 5){
        	return '周五';
        }else{
        	return '请选择';
        }
    }
}

function isApp() {
    if (navigator.userAgent.indexOf("htfxjb") > -1) {
        return true;
    } else {
        return false;
    }
}

function isAndroidApp() {
    if (isApp()) {
        if (navigator.userAgent.indexOf("Android") > -1
            || navigator.userAgent.indexOf("android") > -1
            || navigator.userAgent.indexOf('Adr') > -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isIosApp() {
    if (isApp()) {
        if (navigator.userAgent.indexOf("Android") > -1
            || navigator.userAgent.indexOf("android") > -1
            || navigator.userAgent.indexOf('Adr') > -1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}


function sessionExpireLogin() {
	if(App.getCookie("channelCode") === 'airstar'){//小米金融
		return utils.jumpLoginByChannelCode();
	}
    var code = App.getUrlParam("code");
    if (HTF.isWeixin()) {
        if(HTF.isNotBlank(code)) {
            HTF.codeLoginRequest(code);
        }else{
            HTF.getCode();
        }
    } else {
        var jumpUrl = App.loginPage + "?referUrl=" + encodeURIComponent(document.URL);
        if(isAndroidApp()) {
            if(typeof handler != 'undefined' && handler.appLogin){
                handler.appLogin("");
            } else {
                window.location.replace(jumpUrl);
            }
        } else if(isIosApp()) {
            if (typeof window.webkit != 'undefined'){
                window.webkit.messageHandlers.appLogin.postMessage("");
            } else {
                window.location.replace(jumpUrl);
            }
        } else {
            window.location.replace(jumpUrl);
        }
    }


}
    //根据访问域名判断环境修改跳转地址前缀
	var prefix = "https://app.99fund.com";
    var domain = document.domain;
    if(domain.indexOf("sit") >= 0){//sit
    	prefix = "http://appsit.99fund.com.cn:7081";
    }else if(domain.indexOf("uat") >= 0){//uat
    	prefix = "http://appuat.99fund.com.cn:7081";
    }else if(domain.indexOf("mdev") >= 0){//uat
    	prefix = "http://mdev.99fund.com:7081";
    }
    //输入金额转成中文
    function changeNumMoneyToChinese(money) {
        var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
        var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
        var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
        var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
        var cnInteger = "整"; //整数金额时后面跟的字符
        var cnIntLast = "元"; //整型完以后的单位
        var maxNum = 999999999999999.9999; //最大处理的数字
        var IntegerNum; //金额整数部分
        var DecimalNum; //金额小数部分
        var ChineseStr = ""; //输出的中文金额字符串
        var parts; //分离金额后用的数组，预定义    
        var Symbol = "";//正负值标记
        if (money == "") {
            return "";
        }

        money = parseFloat(money);
        if (money >= maxNum) {
            // alert('超出最大处理数字');
            return "";
        }
        if (money == 0) {
            ChineseStr = cnNums[0] + cnIntLast + cnInteger;
            return ChineseStr;
        }
        if (money < 0) {
            money = -money;
            Symbol = "负 ";
        }
        money = money.toString(); //转换为字符串
        if (money.indexOf(".") == -1) {
            IntegerNum = money;
            DecimalNum = '';
        } else {
            parts = money.split(".");
            IntegerNum = parts[0];
            DecimalNum = parts[1].substr(0, 4);
        }
        if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
            var zeroCount = 0;
            var IntLen = IntegerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = IntegerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == "0") {
                    zeroCount++;
                }
                else {
                    if (zeroCount > 0) {
                        ChineseStr += cnNums[0];
                    }
                    zeroCount = 0; //归零
                    ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    ChineseStr += cnIntUnits[q];
                }
            }
            ChineseStr += cnIntLast;
            //整型部分处理完毕
        }
        if (DecimalNum != '') { //小数部分
            var decLen = DecimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = DecimalNum.substr(i, 1);
                if (n != '0') {
                    ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (ChineseStr == '') {
            ChineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (DecimalNum == '') {
            ChineseStr += cnInteger;
        }
        ChineseStr = Symbol + ChineseStr;

        return ChineseStr;
    }
	/* 格式化基金名称 */
	function fmtName(v){
		if(String(v).length > 14){
			return String(v).substr(0,11)+"...";
		}else{
			return v;
		}
	}
	
//处理channelCode

if(App.isNotEmpty(App.getUrlParam("channelCode"))){
	App.setCookie("channelCode",App.getUrlParam("channelCode"))
}else{
	if(App.isWeixin()){
		if(App.isEmpty(App.getCookie("channelCode"))){
			App.setCookie("channelCode","htfwx");
		}
	}
}

// S 20210301 小米金融，去掉页面底部引导条 下载现金宝APP
if(App.getCookie("channelCode")==='airstar' && $('.bottom .logo').siblings('a').attr('href') === 'https://www.99fund.com/m.htm'){
    $('.bottom .logo').siblings('a').parent('.bottom').hide();
} else {
    $('.bottom .logo').siblings('a').parent('.bottom').show();
}
// E 20210301 小米金融，去掉页面底部引导条 下载现金宝APP
