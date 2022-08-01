var WAP = {
	requestAddr : "/mobileEC/services",
	sessionStorage : window.sessionStorage,
	getUrlParam: function (key) {
	    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return "";
	},
	
	isEmpty : function (str){
	     if(str == null || str == undefined || str == "" || str.trim() == "" ){
	          return true;
	      }
	      return false;
	 },
	 
	isNotEmpty : function (str){
	     if(str == null || str == undefined || str == "" || str.trim() == "" ){
	         return false;
	     }
	     return true;
	},
	    
	setSession : function(key, value){
        if(value != null && value != undefined){
            var otype = Object.prototype.toString.call(value);
            if(otype == "[object Object]" || otype == "[object Array]") {
            	WAP.sessionStorage.setItem(String(key), JSON.stringify(value));
            } else if (otype == "[object String]" || otype == "[object Number]" || otype == "[object Boolean]"){
            	WAP.sessionStorage.setItem(String(key), value);
            } else{
                /** Function and Undefined and Null not save */
            }
        }
    },

    getSession : function(key){
        var valStr = WAP.sessionStorage.getItem(String(key));
        if (/^[\[]+(.)*[\]]+$/.test(valStr) || /^[\{]+(.)*[\}]+$/.test(valStr)){
            //Object,Array
            return JSON.parse(valStr);
        } else {
            return valStr;
        }
    },
    
    clearSession : function () {
    	WAP.sessionStorage.clear();
    },
    isFunction: function(eventFn) {
        if (eventFn != undefined && eventFn != null && typeof eventFn == "function") {
            return true
        } else {
            return false
        }
    },
    showDialog: function(text) {
        if ($('.dialog')) {
            $('.dialog').show();
            $('.dialog-content').html(text);
            $('section').css('visibility', 'hidden');
        } else {
            alert(text);
        }
    },
    post: function(url, data, eventFn, fun) {
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            beforeSend: function(req) {
                req.setRequestHeader("version", "4.00");

            },
            success: function(result) {
                switch (result.returnCode) {
                    case 0:
                        if (WAP.isFunction(fun)) {
                            eval(fun).call(this, result)
                        };
                        break;
                    case 1000:
                        WAP.showDialog(result.returnMsg);
                        break;
                    case 9999:
                        if (result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1) {
                            WAP.showDialog("网络连接错误！")
                        } else {
                            WAP.showDialog(result.returnMsg)
                        };
                        break;
                    default:
                        WAP.showDialog(result.returnMsg)
                };
                if (WAP.isFunction(eventFn)) {
                    eval(eventFn).call(this)
                }
            },
            dataType: "json",
            error: function(e) {
                if (WAP.isFunction(eventFn)) {
                    eval(eventFn).call(this)
                }
            }
        })
    },
    get: function(url, eventFn, fun) {
        $.ajax({
            url: url,
            type: "GET",
            beforeSend: function(req) {
                req.setRequestHeader("version", "4.00");
            },
            success: function(result) {
                switch (result.returnCode) {
                    case 0:
                        if (WAP.isFunction(fun)) {
                            eval(fun).call(this, result)
                        };
                        break;
                    case 1000:
                        WAP.showDialog(result.returnMsg);
                        break;
                    case 9990:
                        $("#risk_panel").hide();
                        $("#btn_buy").hide();
                        break;
                    case 9999:
                        if (result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1) {
                            WAP.showDialog("网络连接错误！")
                        } else {
                            WAP.showDialog(result.returnMsg)
                        };
                        break;
                    default:
                        WAP.showDialog(result.returnMsg)
                };
                if (WAP.isFunction(eventFn)) {
                    eval(eventFn).call(this)
                }
            },
            dataType: "json",
            error: function(e) {
                if (WAP.isFunction(eventFn)) {
                    eval(eventFn).call(this)
                }
            }
        })
    },
    /**
     * 格式化货币
     * @param fieldNm
     * @param removeColor
     * @param addColor
     */
    formatMoney: function (num, scaleNum) {
        if(WAP.isEmpty(num)){
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
};
 var domain = document.domain;
 var server_urls = "";
if(domain.slice(-10) == '99fund.com'  ){//生产
	server_urls = 'https://sensor.htffund.com:8106/sa?project=production';
}else{
	server_urls = 'http://10.50.18.1:8106/sa?project=default';
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
	sdk_url: '//static.99fund.com/js/stat/sensorsdata.min.js',
	heatmap_url: "//static.99fund.com/js/stat/heatmap.min.js",
    name: 'sensors',
    use_app_track: true,  //配置打通 App 与 H5 的参数
    server_url: server_urls,
    heatmap:{}
});
sensors.quick('autoTrack');
