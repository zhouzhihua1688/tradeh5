/**
 * @date: 2021-01-18 01:36:05
 * @desc: 此文件直接添加进html页面的head标签里，非必须不添加code
 */



// S 20210118
// phone-size.js
// 相对字体大小设置
var oHtml = document.documentElement;
getFont();
window.onresize = function(){
    getFont();
}
function getFont(){
    var screenWidth = oHtml.clientWidth;
    if(screenWidth <= 320){
        oHtml.style.fontSize = '17.06px';
    }else if(screenWidth >= 750){
        oHtml.style.fontSize = '40px';
    }else{
        oHtml.style.fontSize = screenWidth/(750/40)+'px';
    }
}

// 设置url中的channelCode到cookie
var channelCode = getUrlParam('channelCode');
if(channelCode){
	setCookie('channelCode', channelCode);
}else{
    if(!getCookie('channelCode')){
        // cookie中没有channelCode，
        // 如果在微信浏览器中，设置为 汇添富公众号，其余设置为WAP
        if(isWeixin()){
            setCookie('channelCode', 'htfwx');
        }else{
            setCookie('channelCode', 'WAP');
        }
        // TODO
        // 小米金融等环境暂不确定如何判断
        // 第三方APP内浏览器不需要判断，没有channelCode，即做wap处理
    }
}

// 小米金融渠道，设置url中的token（如有）到sessionStorage中
if(getCookie('channelCode') === 'airstar'){
    getUrlParam('token') && setSession('__code', getUrlParam('token'));
}


// 设置邦盛指纹，当没有cookie的时候，引入对应js文件
// （https页面，浏览器会自动升级发出的http请求为https请求，测试环境为https页面的时候可能会报错）
if(!getCookie('BSFIT_DEVICEID')){
    var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true;
    var curUrl = window.location.href;
    if((/^https:\/\/[^\/]*?99fund\.com\//.test(curUrl) && curUrl.indexOf('https://wxappdev.99fund.com/') !==0) || curUrl.indexOf('https://m.99fund.com:8099/') ==0){
        fm.src = 'https://dfp.99fund.com/public/downloads/frms-fingerprint.js?custID=htf&serviceUrl=https://dfp.99fund.com/public/generate/jsonp&channel=WEB&loadSource=script';
    }else{
        fm.src = 'http://10.50.16.71:9080/public/downloads/frms-fingerprint.js?custID=htf&serviceUrl=http://10.50.16.71:9080/public/generate/jsonp&channel=WEB&loadSource=script';
    }
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);
}

// 设置神策埋点，代码片段来自https://static.99fund.com/js/stat/stat_new.js
//神策数据脚本 2018.12.20 add by sunchanghong | changed 20190506 
var server_urls = "";
var sdk_urls = "";
var heatmap_urls = "";
if(document.domain.slice(-10) == '99fund.com'  ){//生产
    server_urls = 'https://sensor.htffund.com:8106/sa?project=production';
	sdk_urls= '//static.99fund.com/js/stat/sensorsdata.min.js';
	heatmap_urls= "//static.99fund.com/js/stat/heatmap.min.js";
}else{
    server_urls = 'http://10.50.18.1:8106/sa?project=default';
	sdk_urls= 'http://10.50.115.48/js/stat/sensorsdata.min.js';
	heatmap_urls= "http://10.50.115.48/js/stat/heatmap.min.js";
}

(function(para) {

    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
    if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
        return false;
    }
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
    var ifs = ['track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
    for (var i = 0; i < ifs.length; i++) {
        w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
        x = d.createElement(s), y = d.getElementsByTagName(s)[0];
        x.async = 1;
        x.src = p;
        x.setAttribute('charset','UTF-8');
        y.parentNode.insertBefore(x, y);
        w[n].para = para;
    }
})({
	sdk_url: sdk_urls,
	heatmap_url: heatmap_urls,
    name: 'sensors',
    use_app_track: true,  //配置打通 App 与 H5 的参数
    server_url: server_urls,
    heatmap:{}
});
sensors.quick('autoTrack');
//神策数据脚本 2018.12.20 add by sunchanghong | changed 20190506 


// // functions
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    // if (r != null) return unescape(r[2]);
    if (r != null) return decodeURIComponent(r[2]);
    return '';
}

function setSession(key, value){
    if(value != null && value != undefined){
        var otype = Object.prototype.toString.call(value);
        if(otype == "[object Object]" || otype == "[object Array]") {
            window.sessionStorage.setItem(String(key), JSON.stringify(value));
        } else if (otype == "[object String]" || otype == "[object Number]" || otype == "[object Boolean]"){
            window.sessionStorage.setItem(String(key), value);
        } else{
            /** Function and Undefined and Null not save */
        }
    }
}

function getCookie(name){
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
}

function setCookie(name, value, expires, path, domain, secure) {
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
}

function isWeixin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

// isProdEnv 判断是否是生产环境
function isProdEnv(){
    var href = document.location.href;
    if(/^https:\/\/[^\/]*?99fund\.com\//.test(href) && href.indexOf('https://wxappdev.99fund.com/') !==0 ){
        return true;
    } else {
        return false;
    }
}








// E 20210118