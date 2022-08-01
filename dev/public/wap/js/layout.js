var Layout = {
    wap_func_button: {
        base_frame:"<div class='nav wap_func_button_{index}' ></div>",
        data_frame:"<a href='{url}'><img src='{imageUrl}'>{funcBtnName}</a>"
    },
    wap_func_button_ml: {
        base_frame:"<div class='nav'>" +
                        "<div class='navlist wap_func_button_ml_{index}'>" +
                        "</div>" +
                    "</div>",
        data_frame:"<a href='{url}'>" +
                        "<img src='{imageUrl}' >" +
                        "<span>{funcBtnName}</span>" +
                    "</a>"
    },
    wap_banner: {
        base_frame:"<div class='swiper-container banner swiper-banner'>" +
                        "<div class='swiper-wrapper wap_banner_{index}'></div>" +
                        "<div class='swiper-pagination'></div>" +
                    "</div>",
        data_frame:"<div class='swiper-slide'>" +
                        "<a href='{url}'><img src='{imageUrl}' ></a>" +
                    "</div>"
    },
    wap_fund_recommend:{
        base_frame:"<div class='content'>" +
                        "<div class='content-header'>" +
                            "<img src='../images/icon_1.png'>&nbsp;&nbsp;" +
                            "<span style='font-weight: bold' class='wap_fund_recommend_{index}_title'></span>" +
                        "</div>" +
                        "<div class='content-list wap_fund_recommend_{index}'></div>" +
                    "</div>",
        data_frame:"<div class='listone' onclick='window.location.href=\"{url}\"'>" +
                        "<div class='lf'>" +
                            "<p style=''><span></span><em style='font-style: normal;'>{recomelementval}</em><span>{recomelementUnit}</span></p>" +
                            "<h4 >{recomelementnm}</h4>" +
                        "</div>" +
                        "<div class='rt'>" +
                            "<P>{fundTitle}</P>" +
                            "<p class='mid'>{fundsubTitle}</p>" +
                            "<div>{wap_fund_recommend_tag}</div>"+
                        "</div>" +
                    "</div>",
        data_sub_frame:"<h4>{tag}</h4>"
    },
    wap_product_recom:{
        base_frame:"<div class='content'>" +
                    "<div class='content-header'>" +
                        "<i></i>" +
                        "<span class='wap_product_recom_{index}_title'></span>" +
                        "<span class='wap_product_recom_{index}_subTitle'></span>" +
                    "</div>" +
                    "<div class='wap_product_recom_{index}'></div>" +
                "</div>",
        data_frame:"<div class='content-lists list-one'>" +
                        "<h2>{productName}</h2>" +
                        "<p>{tags}</p>" +
                        "<h4>{product}</h4>" +
                        "<div class='detail'>" +
                            "<span>精选<br>理由</span>" +
                            "<span>{recommendedContent}</span>" +
                        "</div>" +
                        "<a href='{url}' class='buy'>{buttonTxt}</a>" +
                    "</div>",
        data_sub_frame:"<span>{tag}</span>"
    },
    wap_deposit_records:{
        base_frame:"<div class='content'>" +
                        "<div class='content-header'><i></i>" +
                            "<span class='wap_deposit_records_{index}_title'></span>" +
                            "<span class='wap_deposit_records_{index}_subTitle'></span>" +
                            "<a href='javascript:void(0);' class='wap_deposit_records_{index}_moreTxt'></a>" +
                        "</div>" +
                        "<div class='content-list-title'>" +
                            "<p>购买产品</p>" +
                            "<p>购买金额</p>" +
                            "<p>购买日期</p>" +
                        "</div>" +
                        "<div class='content-list wap_deposit_records_{index}'>" +
                        "</div>" +
                    "</div>",
        data_frame:"<ul class='list'>" +
                        "<li class='zh'>" +
                            "<span>{productName}" +
                            "<span></span><span>{productId}</span>" +
                            "</span>" +
                        "</li>" +
                        "<li class='status'>" +
                            "<span >{amt}</span><br>" +
                            "<span class='{class}'>{status}</span>" +
                        "</li>" +
                        "<li><span>{time}</span><span>{tradeType}</span></li>" +
                    "</ul>"
    },
    wap_advice_list:{
        base_frame:"<div>" +
                        "<div class='more'>" +
                            "<div class='teach wap_advice_list_{index}_title'><span class='wap_advice_list_{index}_subTitle'></span></div>" +
                        "<div class='much wap_advice_list_{index}_moreTxt'></div>" +
                        "</div>" +
                        "<div class='wap_advice_list_{index}'>" +
                        "</div>" +
                    "</div>",
        data_frame:"<div class='img-list'> <a href='{url}'>" +
                        "<div class='font-list'>" +
                            "<div class='text'>{adviceTitle}</div>" +
                            "<div class='text1'>{adviceDesc}</div>" +
                            "<div class='text2'>{tag_panel}<span class='public-time'>{publicTimeStr}</span></div>" +
                        "</div>" +
                        "<div class='picture'>" +
                            "<img src='{imageUrl}' alt=''>" +
                        "</div>" +
                    "</a></div>",
        data_tag_frame:"<span class='tag'>{tag}</span>"
    },
    wap_line:"<div style='height: .4rem;'><!--<img src='../images/account/huixian.png'>--></div>",
	
    /***
     * 绘制布局
     */
    drawingLayout:function (panel, layout, index, isAddLine) {
        if(layout != undefined && layout != null){
            Layout.drawingLayoutNew(panel, layout, index, Layout[layout.temId], isAddLine);
        }
    },
    /***
     * 绘制布局 new method
     */
    drawingLayoutNew:function (panel, layout, index, frame, isAddLine){
        if(layout != undefined && layout != null && frame != undefined && frame != null){
            var panelHtml = frame.base_frame.replace(/\{index\}/g, index);
            $(panel).append(panelHtml);
            if (isAddLine) {
                $(panel).append(Layout.wap_line);
            }
            // console.log(layout);
            // var url = App.applicationNm + layout.requestUrl;
            var url = '/res/v1/app-func-layout/theme-infos-app?layoutId=' + layout.layoutId + '&funcModId=' + layout.funcmodId;
            if (layout.requestMethod == 'GET'){
                App.get(url, function () {
                    if(layout.temId == "wap_banner"){
                        var mySwiper = new Swiper ('.swiper-container', {
                            direction: 'horizontal',
                            loop: true,
                            autoplay:{disableOnInteraction: false},
							observer:true,
							observeParents:true,
							onSlideChangeEnd: function(swiper){
							　　　swiper.update();  
							　　　mySwiper.startAutoplay();
							　　  mySwiper.reLoop();  
							},
                            // 如果需要分页器
                            pagination: {
                                el: '.swiper-pagination',
                                type: 'custom',
                                renderCustom: function (swiper, current, total) {
                                    var _html = '';
                                    for (var i = 1; i <= total; i++) {
                                        if (current == i) {
                                            _html +=
                                                '<span style="width: .25rem;height:.25rem;display: inline-block;margin: 0 .25rem;border-radius: .125rem;background-color: #f85d63;"></span>';
                                        } else {
                                            _html += '<span style="width: .25rem;height:.25rem;border-radius: 50%;display: inline-block;background: #dddddd;margin: 0 .25rem;"></span>';
                                        }
                                    }
                                    return _html; //返回所有的页码html
                                }
                            }
                        });
                    } else if(layout.temId == "wap_homepage_notice"){
                        function scroll() {
                            $(".radio_play .wrap .list:eq(0)").animate({
                                "margin-top": "-2.5rem"
                            }, 1000, function () {
                                $(".radio_play .wrap .list:eq(0)").appendTo($(".radio_play .wrap"));
                                $(".radio_play .wrap .list:last").css({
                                    "margin-top": '0'
                                });
                            })
                            setTimeout(scroll, 4000)
                        }
                        if ($('.radio_play .wrap .list').length > 1) {
                            scroll();
                        }
                    }
                }, function (result) {
                    if (result.body != undefined && result.body != null) {
                        Layout.drawingLayoutContent(layout, index, frame, result.body);
                    }
                });
				
            }else {
                App.post(url, null, null, function (result) {
                    if (result.body != undefined && result.body != null) {
                        Layout.drawingLayoutContent(layout, index, frame, result.body);
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

        if(layout.temId == "wap_func_button" || layout.temId == "wap_func_button_ml"){
            contentHtml = Layout.drawingFuncButton(frame, theme);
        }else if(layout.temId == "wap_banner"){
            contentHtml = Layout.drawingBanner(frame, theme);
        }else if(layout.temId == "wap_fund_recommend"){
            contentHtml = Layout.drawingFundRecommend(frame, theme);
        }else if(layout.temId == "wap_product_recom") {
            contentHtml = Layout.drawingProductRecommend(frame, theme);
        }else if(layout.temId == "wap_deposit_records") {
            contentHtml = Layout.drawingDepositRecords(blankClass, frame, theme);
        }else if(layout.temId == "wap_advice_list"){
            contentHtml = Layout.drawingAdviceList(frame, theme);
        }else if(layout.temId == "wap_homepage_notice"){
            contentHtml = Layout.drawingNoticeList(frame, theme);
        }else if(layout.temId == "floatingImage"){
			if(theme[0].object[0] != null){
				$("#side-right").show().html("<a href='"+theme[0].object[0].btnUrl+"'>"+theme[0].object[0].btnName+"</a><div class='click_hide' ></div>");
				if(theme[0].object[0].imageUrl != ''){
					$("#side-right a").html("<img src='"+theme[0].object[0].imageUrl+"' style='width:"+theme[0].object[0].imgWidth+"'>")
				}
			}
			$(".click_hide").click(function(){
				$("#side-right").hide()
			});
        }
        if(App.isNotEmpty(contentHtml)){
            $(blankClass).append(contentHtml);
        }
    },
    /***
     * 功能按钮模块(单行、多行)
     */
    drawingFuncButton:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {
                html += frame.data_frame.replace("{url}", item.url)
                                        .replace("{imageUrl}", item.imageUrl)
                                        .replace("{funcBtnName}", item.funcBtnName);
            });
        }
        return html;
    },
    /***
     * 滚动图片模块
     */
    drawingBanner:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {
                var url = item.url == '' ? 'javascript:void(0);' : item.url;
                html += frame.data_frame.replace("{url}", url)
                                        .replace("{imageUrl}", item.imageUrl);
            });
        }
        return html;
    },
    /***
     * 基金推荐模块
     */
    drawingFundRecommend:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {
                var tag = "<h4>费率:<s>" + item.oldFee + "</s>&nbsp;&nbsp;" + item.nowFee + "</h4>";
                if (App.isNotEmpty(item.threshold)) {
                    tag += "<h4>" + (item.threshold + (App.isNotEmpty(item.thresholdUnit) ? item.thresholdUnit : "")) + "</h4>";
                }

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
                    .replace("{fundsubTitle}", item.fundsubTitle)
                    .replace("{wap_fund_recommend_tag}", tag)
                    .replace("{url}", item.url);

                html += panel;
            });
        }

        return html;
    },
    /***
     * 推荐模块（统一产品）
     */
    drawingProductRecommend:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {

                var tags = '';
                item.prdTagList.forEach(function (value) {
                    tags += frame.data_sub_frame.replace('{tag}', value);
                });

                var panel = frame.data_frame;
                panel = panel.replace("{buttonTxt}", item.prdBtnName)
                    .replace("{productName}", item.prdTitle)
                    .replace("{tags}", tags)
                    .replace("{product}", item.prdMarketContent)
                    .replace("{recommendedContent}", item.prdRecommendContent)
                    .replace("{url}", item.url);

                html += panel;
            });
        }
        return html;
    },
    /***
     * 税延购买记录
     */
    drawingDepositRecords:function (blankClass, frame, theme) {
        if (theme != undefined && theme != null && theme.length > 0) {
            queryDepositRecords(blankClass, frame, theme)
        }
        return '';
    },
    /***
     * 资讯模板
     */
    drawingAdviceList:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {
                var tag = '';
                if(App.isNotEmpty(item.tag)){
                    tag = frame.data_tag_frame.replace("{tag}",item.tag)
                }

                var panel = frame.data_frame;
                panel = panel.replace("{adviceTitle}", item.adviceTitle)
                    .replace("{adviceDesc}", item.adviceDesc)
                    .replace("{publicTimeStr}", item.publicTimeStr)
                    .replace("{tag_panel}", tag)
                    .replace("{imageUrl}", item.imageUrl)
                    .replace("{url}", item.url);

                html += panel;
            });
        }
        return html;
    },
    /***
     * 通知模板
     */
    drawingNoticeList:function (frame, theme) {
        var html = "";
        if (theme != undefined && theme != null && theme.length > 0) {
            theme[0].object.forEach(function (item) {
                var panel = frame.data_frame;
                panel = panel.replace("{notice}", item.noticeValue)
                    .replace("{url}", item.url);

                html += panel;
            });
        }
        return html;
    }
};

function queryDepositRecords(blankClass, frame, theme) {
    var curYear = new Date().getFullYear();
    var startTime = App.formatTargetDateStr("yyyyMMdd", new Date(curYear, 0,1));
    var endTime = App.formatTargetDateStr("yyyyMMdd", new Date(Number(curYear)+1, 0, 0));
    var url = "/ags/v1/funds/query-payrecord?startTime=" + startTime + "&endTime=" + endTime + "&pageNo=1&itemPerPage=20";
    App.get(url, null, function (result) {
        var returnCode = result.returnCode;
        var returnMsg = result.returnMsg;
        if (returnCode == 0) {
            var payTradeRecordList = result.body;
            if (payTradeRecordList != undefined && payTradeRecordList != null) {
                var html = '';
                payTradeRecordList.forEach(function (item) {
                    var currentAckDtFormat = '';
                    if(App.isNotEmpty(item.apdt)){
                        currentAckDtFormat = App.formatTargetDateStr("yyyy-MM-dd", App.strToDate(item.apdt));
                    }
                    var panel = frame.data_frame;
                    var amt = App.isEmpty(item.ackAmt) ? item.subAmt : item.ackAmt;
                    panel = panel.replace("{productName}", item.fundname)
                        .replace("{productId}", item.fundid)
                        .replace("{amt}", App.formatMoney(amt))
                        .replace("{time}", currentAckDtFormat)
                        .replace("{status}", item.tradeStatusDesc)
                        .replace("{tradeType}", item.tradeType);

                    if(item.moneyFlow == 'BUY'){
                        panel = panel.replace("{class}", 'red');
                    } else if (item.moneyFlow == 'SELL'){
                        panel = panel.replace("{class}", 'green');
                    } else {
                        panel = panel.replace("{class}", 'gray1');
                    }

                    html += panel;
                });
                $(blankClass).append(html);
            }
        } else {
            alertTips('<div style="line-height: 1.5;">'+ returnMsg +'</div>');
            return;
        }
    });
}