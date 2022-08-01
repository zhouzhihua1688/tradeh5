﻿$(function() {
    App.queryCard();
    App.queryUserInfo()
    var referUrl = App.getUrlParam("referUrl");
    if(App.isNotEmpty(referUrl)){
    	window.location = referUrl;
    }
});
    $(function () {
        var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wapBankCardSuccess&r=" + (Math.random()*10000).toFixed(0);

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
                    Layout.drawingLayout('#swiper1', layoutList[index], index, isAddLine);
                }
            }
        });
    });


    var Layout = {
        wap_fund_recommend: {
            base_frame:" <div class='swiper-wrapper wap_fund_recommend_{index}'> </div><div class='swiper-pagination'></div>"

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
                    App.get(url, function () {
                        if(layout.temId == "wap_fund_recommend"){

                        }
                    }, function (result) {
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

            if(layout.temId == "wap_fund_recommend" ){
                contentHtml = Layout.drawingWelfareList(frame, theme);
            }
            if(App.isNotEmpty(contentHtml)){
                $(blankClass).append(contentHtml);
            }
            // swiper轮播图
            var mySwiper = new Swiper('#swiper1', {
                direction: 'horizontal',
                loop: true,
                autoplay: {
                    disableOnInteraction: false
                },
                // spaceBetween: 50,
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    type: 'custom',
                    renderCustom: function (swiper, current, total) {
                        var _html = '';
                        for (var i = 1; i <= total; i++) {
                            if (current == i) {
                                _html +=
                                    '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                            } else {
                                _html += '<span class="swiper-pagination-customs"></span>';
                            }
                        }
                        return _html; //返回所有的页码html
                    }
                }

            })
        },

        /***
         * 活动列表模块
         */
        drawingWelfareList:function (frame, theme) {
            var html = "";
            if (theme != undefined && theme != null && theme.length > 0) {
                $("#theme").html(""+theme[0].themeTitle+""+"<span>"+theme[0].themesubTitle+"</span>");
                theme[0].object.forEach(function (item,index) {
                    if(index == 0 || index %2 ==0) {
                        html +=" <div class='content swiper-slide clearfix'>";

                        var theme2 = theme[0].object[index+1] ;
                        var theme1 = theme[0].object[index];
                        html+="<a  class='fl' href="+theme1.url+">" +
                            "                       <h2>"+theme1.fundTitle+"</h2>" +
                            "                        <h4>"+theme1.fundsubTitle+"</h4>" +
                            "                       <p>"+theme1.recomelementRemark+"</p>" +
                            "                        <span>"+theme1.riskRemark+"</span>" +
                            "                    </a>";
                        if(theme2!=null) {
                            html +=
                                "<a  class='fr' href="+theme2.url+" >" +
                                "                       <h2>" + theme2.fundTitle + "</h2>" +
                                "                        <h4>" + theme2.fundsubTitle + "</h4>" +
                                "                       <p>" + theme2.recomelementRemark + "</p>" +
                                "                        <span>" + theme2.riskRemark + "</span>" +
                                "                    </a>";
                        }
                        html+= "</div>";
                    }

                });
            }
            return html;
        }
    };