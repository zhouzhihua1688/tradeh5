// $(function(){function setCookie(a,b){var c=new Date,d=30*3600*24*1e3;c.setTime(c.getTime()+d),document.cookie=a+"="+escape(b)+(null==d?"":";expires="+c.toGMTString())+";path=/;domain=.99fund.com"}function gotoURL(a){window.location=a}var f="99fund",weblog_url="//weblog.99fund.com/stat.php",now=new Date,v1=now.getFullYear()+""+(now.getMonth()+1)+now.getDate(),c_value=v1+Math.ceil(1e8*Math.random()),v=getCookie("99FUNDUVID");""==v&&setCookie("99FUNDUVID",c_value);var refer_url=document.referrer;setCookie("99FUNDREFER",refer_url);function TrackerProxy(){return{push:apply}}function isString(a){return"string"==typeof a||a instanceof String}function apply(){var i,f,parameterArray;for(i=0;i<arguments.length;i+=1)parameterArray=arguments[i],f=parameterArray.shift(),eval(f+"('"+parameterArray+"')")}function applyMethodsInOrder(a,b){var c,d,e={};for(c=0;c<b.length;c++){var f=b[c];for(e[f]=1,d=0;d<a.length;d++)if(a[d]&&a[d][0]){var g=a[d][0];f===g&&(apply(a[d]),delete a[d],e[g]>1&&void 0!==console&&console&&console.error&&console.error("The method "+g+' is registered more than once in "paq" variable. Only the last call has an effect. Please have a look at the multiple Piwik trackers documentation: http://developer.piwik.org/guides/tracking-javascript-guide#multiple-piwik-trackers'),e[g]++)}}return a}function clickEvent(a){jQuery.ajax({type:"GET",url:weblog_url+"?k="+encodeURIComponent(a)+"&f="+encodeURIComponent(f),dataType:"jsonp",success:function(){},error:function(){}})}function trackPageView(a){jQuery.ajax({type:"GET",url:weblog_url+"?u="+encodeURIComponent(a)+"&f="+encodeURIComponent(f),dataType:"jsonp",success:function(){},error:function(){}})}"object"!=typeof _fndstat&&(_fndstat=[]);var trackerUrls=document.title;_fndstat.push(["trackPageView",trackerUrls]);var applyFirst=["clickEvent","trackPageView"];for(_fndstat=applyMethodsInOrder(_fndstat,applyFirst),iterator=0;iterator<_fndstat.length;iterator++)_fndstat[iterator]&&apply(_fndstat[iterator]);_fndstat=new TrackerProxy});
// function getCookie(a){return document.cookie.length>0&&(c_start=document.cookie.indexOf(a+"="),-1!=c_start)?(c_start=c_start+a.length+1,c_end=document.cookie.indexOf(";",c_start),-1==c_end&&(c_end=document.cookie.length),unescape(document.cookie.substring(c_start,c_end))):""}
//  var domain = document.domain;
//  var server_urls = "";
// if(domain.indexOf("app.") >= 0 ){//生产
// 	server_urls = 'https://sensor.htffund.com:8106/sa?project=production';
// }else{
// 	server_urls = 'http://10.50.18.1:8106/sa?project=default';
// }
// (function(para) {
//     var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
//     if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
//         return false;
//     }
//     w['sensorsDataAnalytic201505'] = n;
//     w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
//     var ifs = ['track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus'];
//     for (var i = 0; i < ifs.length; i++) {
//         w[n][ifs[i]] = w[n].call(null, ifs[i]);
//     }
//     if (!w[n]._t) {
//         x = d.createElement(s), y = d.getElementsByTagName(s)[0];
//         x.async = 1;
//         x.src = p;
//         x.setAttribute('charset','UTF-8');
//         y.parentNode.insertBefore(x, y);
//         w[n].para = para;
//     }
    

// })({

	
//     sdk_url: '../js/lib/sensorsdata.min.js',
//     heatmap_url: '../js/lib/heatmap.min.js',
//     name: 'sensors',
//     use_app_track: true,  //配置打通 App 与 H5 的参数
//     server_url: server_urls,
//     heatmap:{}
// });
// sensors.quick('autoTrack');
// //从cookie取custno
// var custno = getCookie("sso_cookie_ext_dp");
// if(custno != ""){
// 	sensors.login(custno);
// }
