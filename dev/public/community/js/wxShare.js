function wxShare(eventCode,eventId){   
    var curUrl = window.location.href;//分享链接  默认是当前url   
    //如果有微信加的标识则去掉
    if(curUrl.indexOf("isappinstalled") != -1){
        curUrl = delParam(curUrl,"isappinstalled");
        window.location.href = curUrl;
    }                 
    var ajaxUrl = "/activity-center/api/v1/share/info?eventCode="+eventCode+"&eventId="+eventId;
    $.ajax({
        url:ajaxUrl,
        type:'GET',
        dataType: 'json',
        success: function (res) {
            if(res.returnCode==0){
                var shareInfoWX=res.body.shareInfoList[2];
                shareByWxConfig(shareInfoWX.shareTitle,shareInfoWX.shareContent,shareInfoWX.sharePicUrl,curUrl)                                                              
            }else{
                console.log(res.returnMsg);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

}
function delParam(url,paramKey) {
    var beforeUrl = url.substr(0, url.indexOf("?"));   //页面主地址（参数之前地址）
    var urlParam = url.substr(url.indexOf("?")+1);   //页面参数
    var nextUrl = "";
    var newUrl = "";

    var arr = new Array();
    if (urlParam != "") {
        var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
        for (var i = 0; i < urlParamArr.length; i++) {            
            (urlParamArr[i].indexOf(paramKey)&&arr.push(urlParamArr[i]));
        }
    }
    if (arr.length > 0) {
        nextUrl = "?" + arr.join("&");
    }
    newUrl = beforeUrl + nextUrl;
    return newUrl;
}

function shareByWxConfig(title,content,icon,curUrl){

    if(!curUrl){
        var curUrl = window.location.href;//分享链接  默认是当前url   
        //如果有微信加的标识则去掉
        if(curUrl.indexOf("isappinstalled") != -1){
            curUrl = curUrl.split("?")[0];
            window.location.href = curUrl;
        }   
    }
    //微信设置
    var curHttp = window.location.origin;

    var ajaxUrl = curHttp+"/activity-center/api/v1/weixin/weixin-jsapi-sign?system=1&currentUrl="+curUrl;

    // ajax请求后台接口，获取微信签名
    $.ajax({
        url: ajaxUrl,
        data:{
            url: curUrl
        },
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            if(res.returnCode==0){
                
                wx.config({
                    // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.body.appId, // 必填，换成你公众号里的appid
                    timestamp: res.body.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.body.nonceStr, // 必填，生成签名的随机串
                    signature: res.body.signature,// 必填，签名
                    jsApiList: ['checkJsApi','updateTimelineShareData','hideOptionMenu','updateAppMessageShareData'] // 必填，需要使用的JS接口列表
                });

                wx.ready(function(){

                    //wx.hideOptionMenu();/***隐藏分享菜单****/   
                    wx.checkJsApi({  
                        jsApiList: [  
                            'getLocation',  
                            'updateTimelineShareData',  
                            'updateAppMessageShareData'  
                        ],  
                        success: function (res) {  
                            //alert(res.errMsg);  
                        }  
                    });  

                    wx.updateAppMessageShareData({//分享给好友接口自定义数据  标题和内容描述可以自定义修改
                        title: title, // 分享标题
                        desc: content, // 分享描述
                        link: curUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: icon, // 分享图标
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                            console.log('用户点击了分享');
                        }
                    });

                    wx.updateTimelineShareData({//分享到朋友圈接口自定义数据 标题和内容描述可以自定义修改
                        title: title, // 分享标题
                        desc: content, // 分享描述
                        link: curUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: icon, // 分享图标
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                            console.log('用户点击了分享');
                        }
                    });

                });
                wx.error(function(res){
                    console.log('wx jsapi fail');
                });

            }else{
                console.log(res.returnMsg);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
