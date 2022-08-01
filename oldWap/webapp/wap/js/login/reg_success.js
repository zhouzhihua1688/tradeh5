$(function() {
    App.queryCard();
    App.queryUserInfo()
    var referUrl = App.getUrlParam("referUrl");
    if(App.isNotEmpty(referUrl)){
        window.location = referUrl;
    }
});
$(function () {
    $(".xjb").click(function () {
        sendMsg();
        console.log(3)
    })
});

function sendMsg(){
    console.log(1)
    var url = App.projectNm  + "/wx_scene_template_message";
    App.post(url,JSON.stringify({'wxSceneCode': 'wx_actId_001'}),null,null,true);
    window.location = "../wezhan/service.html"
    console.log(2)
}

$(function () {
    $("#card").click(function () {
        window.location = "../card/manage_card.html";
    })
});
$(function () {
    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=registeredSuccess&r=" + (Math.random()*10000).toFixed(0);

    App.get(url,null,function(result){
        // console.log("layout:", result);
        if (result.body.layout != undefined && result.body.layout != null){
            var layoutList = result.body.layout;
            var isAddLine = true;
            var size = layoutList.length;
            for (var index in layoutList) {
                if (index == size - 1) {
                    isAddLine = false;
                }
                Layout.drawingLayout('#panel', layoutList[index], index, isAddLine);
            }
        }
    });
});


var Layout = {
    wap_fund_recommend:{
        base_frame:"<div class='tuijian wap_fund_recommend_{index}'>" +
            "</div>",
        data_frame: "<div class='biaoti'><span style='font-weight: bold'>{themeTitle}</span><span>{themesubTitle}</span></div>" +
            "<div class='content'>" +
            " <div class='box'>" +
            "<div class='title'>" +
            "<span class='text'>{fundTitle}</span>" +
            " <span class='hot'>{recomidentify}</span>" +
            " </div>" +
            "<div class='text2'>{fundsubTitle}</div>" +
            "<div class='text3'>{recomelementval}<span class='percent'>{recomelementUnit}</span></div>" +
            "<div class='text4'>{recomelementnm}</div>"+
            "<div class='buy' onclick='window.location.href=\"{url}\"'>{buttonRemark}</div>" +
            "</div>" +
            "</div>"
    },
    wap_banner: {
        base_frame:"<div  class='picture wap_banner_{index}'>" +
            "</div>",
        data_frame:"<a href='{url}' ><img src='{imageUrl}' style='width:375px;height:99px;'></a>"
    },
    /***
     * 绘制布局
     */
    drawingLayout:function (panel, layout, index, isAddLine) {
        if(layout != undefined && layout != null){
            var frame = Layout[layout.temId];

            var panelHtml = frame.base_frame.replace(/\{index\}/g, index);
            $(panel).append(panelHtml);
            if (isAddLine) {
                $(panel).append(Layout.wap_line);
            }
            var url = App.applicationNm + layout.requestUrl;
            if (layout.requestMethod == 'GET'){
                App.get(url,null, function (result) {
                    if (result.body != undefined && result.body != null) {
                        Layout.drawingLayoutContent(layout, index, frame, result.body.theme);
                    }
                });
            }else {
                App.post(url, null, null, function (result) {
                    if (result.body != undefined && result.body != null) {
                        Layout.drawingLayoutContent(layout, index, frame, result.body.theme);
                    }
                });
            }
        }
    },
    /***
     * 布局内容加载
     */
    drawingLayoutContent:function (layout, index, frame, theme) {
        var blankClass = "." + layout.temId + "_" + index;
        var contentHtml = "";
        var themeInfo = theme[0];
        if(App.isNotNull(themeInfo)){
            $(blankClass + '_title').html(themeInfo.themeTitle);
            $(blankClass + '_subTitle').html(themeInfo.themesubTitle);
            $(blankClass + '_moreTxt').html(themeInfo.viewmoreTitle);
            if(App.isNotEmpty(themeInfo.viewmoreUrl)){
                $(blankClass + '_moreTxt').attr('href', themeInfo.viewmoreUrl);
            }
        }


        if(layout.temId == "wap_banner" ){
            contentHtml = Layout.drawingBanners(frame, theme);
        }
        if(layout.temId == "wap_fund_recommend" ){
            contentHtml = Layout.drawingFundRecommend(frame, theme);
        }
        if(App.isNotEmpty(contentHtml)){
            $(blankClass).append(contentHtml);
        }
    },

    /***
     * 基金推荐模块
     */
    drawingFundRecommend:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {

            theme[0].object.forEach(function (item) {
                console.log(item)
                console.log(theme[0])
                /*var tag = "<h4>费率:<s>" + item.oldFee + "</s>&nbsp;&nbsp;" + item.nowFee + "</h4>";
                if (App.isNotEmpty(item.threshold)) {
                    tag += "<h4>" + (item.threshold + (App.isNotEmpty(item.thresholdUnit) ? item.thresholdUnit : "")) + "</h4>";
                }*/

                var panel = frame.data_frame;
                if(App.isEmpty(item.recomelementval) || item.recomelementval == "null"){
                    panel = panel.replace("{recomelementval}", item.recomelementRemark)
                        .replace("{recomelementUnit}", "");
                }else{
                    panel = panel.replace("{recomelementval}", item.recomelementval)
                        .replace("{recomelementUnit}", item.recomelementUnit);
                }
                panel = panel.replace("{recomelementnm}", item.recomelementnm)
                    .replace("{fundTitle}", item.fundTitle)
                    .replace("{themeTitle}",theme[0].themeTitle)
                    .replace("{themesubTitle}",theme[0].themesubTitle)
                    .replace("{fundsubTitle}", item.fundsubTitle)
                    .replace("{fundsubTitle1}",item.fundsubTitle1)
                    .replace("{buttonRemark}",item.buttonRemark)
                    .replace("{recomelementUnit}",item.recomelementUnit)
                    //.replace("{wap_fund_recommend_tag}", tag)
                    .replace("{recomidentify}",item.recomidentify)
                    .replace("{url}", item.url);

                html += panel;
            });
            $(".tuijian").show();
        }

        return html;
    },

    drawingBanners:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {
                var url = item.url == '' ? 'javascript:void(0);' : item.url;
                html += frame.data_frame.replace("{url}", url)
                    .replace("{imageUrl}", item.imageUrl);
            });
            $(".picture").show();
        }
        return html;
    }
};