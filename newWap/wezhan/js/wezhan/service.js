$(function () {
    
    $('#testUrl p').html(window.location.href);


    //进入该页面授权登录
    var ssoCookie = utils.getCookie("sso_cookie");
    var unbind = utils.getUrlParam("unbind");
    var formatMoney = function(num, scaleNum) {
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
    if(utils.isWeixin() && !ssoCookie && !unbind){
        // ssoCookie不存在，未登录状态
        utils.getCode();
    } else {
        var channelCode = utils.getCookie('channelCode');
        var code = utils.getUrlParam('token');

        console.log('channelCode=', channelCode);
        console.log('code=', code);
        console.log(channelCode === 'airstar' && !ssoCookie && code);
        if(channelCode === 'airstar' && !ssoCookie && code){
            // 小米金融未登录，使用url中的code获取登录
            utils.jumpLoginByChannelCode();
        }

        
        queryLayout();
        var url = utils.prefix_mobile + "/account/query_home_page_info?date=" + (new Date()).getTime();
        $.ajax({
            url: url,
            success: function (result) {
                if(result && typeof result === 'string' && /^{.*}$/.test(result)){
                    result = JSON.parse(result);
                }
                if (result.returnCode == 0){
                    $(".header").on('click', function () {
                        window.location.href = '/tradeh5/newWap/myAssets/index.html';
                    });
                    $(".login-header").show();
                    var acInfo = result.body;
                    $(".totalAmt").html(formatMoney(acInfo.assets.totalValue, 2));
                    $(".balance").html(formatMoney(acInfo.assets.balance, 2));
                    if (isNaN(acInfo.homeInfo.income)){
                        $(".income").html(acInfo.homeInfo.income);
                    } else {
                        $(".income").html(formatMoney(acInfo.homeInfo.income < 0 ? '-' + acInfo.homeInfo.income : '+' + acInfo.homeInfo.income));
                    }
                    $(".service_sub").show();
                    querySubCategory();
                } else {
                    //会话失效sso-cookie失效
                    if(utils.isWeixin() && !unbind){
                        utils.getCode();
                    }
                    $(".no-login-header").show();
                    $(".login-a").attr("href", "/tradeh5/newWap/auth/login_xiaomi.html?referUrl="+encodeURIComponent(window.location.href));
                    $(".register-a").attr("href", "/tradeh5/newWap/auth/login_xiaomi.html?referUrl="+encodeURIComponent(window.location.href));
                }
            }
        });
        // $.get(url, null, function (result) {
        //     console.log('dsafdsafdsafdasfdasfasdfads8f8dsa90f8ds90af890asd',result);
        //     if (result.returnCode == 0){
        //         $(".header").on('click', function () {
        //             window.location.href = '/tradeh5/newWap/myAssets/index.html';
        //         });
        //         $(".login-header").show();
        //         var acInfo = result.body;
        //         $(".totalAmt").html(formatMoney(acInfo.assets.totalValue, 2));
        //         $(".balance").html(formatMoney(acInfo.assets.balance, 2));
        //         if (isNaN(acInfo.homeInfo.income)){
        //             $(".income").html(acInfo.homeInfo.income);
        //         } else {
        //             $(".income").html(formatMoney(acInfo.homeInfo.income < 0 ? '-' + acInfo.homeInfo.income : '+' + acInfo.homeInfo.income));
        //         }
        //         $(".service_sub").show();
        //         querySubCategory();
        //     } else {
        //         //会话失效sso-cookie失效
        //         if(utils.isWeixin() && !unbind){
        //             utils.getCode();
        //         }
        //         $(".no-login-header").show();
        //         $(".login-a").attr("href", "/tradeh5/newWap/auth/login_xiaomi.html?referUrl="+encodeURIComponent(window.location.href));
        //         $(".register-a").attr("href", "/tradeh5/newWap/auth/login_xiaomi.html?referUrl="+encodeURIComponent(window.location.href));
        //     }
        // });
    }
});
// 开启关闭眼睛
var flag = true;
$(".question").click(function () {
    $(".mask").show();
});
$(".close").click(function () {
    $(".mask").hide();
});
$(".eyes").click(function (e) {
    if (flag) {
        $(".eyes").css({
            "background": "url(../img/wezhan/closeEyes.png) no-repeat no-repeat",
            "background-size": "100% 100%"
        });
        $(".enshow").show();
        $(".isshow").hide();
        flag = false;
    } else {
        $(".eyes").css({
            "background": "url(../img/wezhan/openEyes.png) no-repeat no-repeat",
            "background-size": "100% 100%"
        });
        $(".enshow").hide();
        $(".isshow").show();
        flag = true;
    }
    e.stopPropagation();
});

var LayoutFramework = {
    wap_func_button: {
        base_frame:"<div class='fc_btn wap_func_button_{index}' ></div>",
        data_frame:"<a href='{url}'><img src='{imageUrl}'><p>{funcBtnName}</p></a>"
    },
    wap_banner: {
        base_frame:"<div class='swiper-container banner swiper-banner'>" +
        "<div class='swiper-wrapper wap_banner_{index}'></div>" +
        "<div class='swiper-pagination'></div>" +
        "</div>",
        data_frame:"<a href='{url}' class='swiper_img swiper-slide'><img src='{imageUrl}'></a>"
    },
    wap_func_button_ml: {
        base_frame:"<div class='practical'>" +
        "<div class='btn_title wap_func_button_ml_{index}_title'></div>" +
        "<div class='practical_btn wap_func_button_ml_{index}'></div>" +
        "</div>",
        data_frame:"<a href='{url}'>" +
        "<img src='{imageUrl}' >" +
        "<p>{funcBtnName}</p>" +
        "</a>"
    },
    wap_homepage_notice: {
        base_frame:"<div class='radio_play'>" +
        // "<div style='width: 100%;height: 0.5rem;background-color: #f6f6f6;'></div>" +
        "<ul class='wrap wap_homepage_notice_{index}'></ul>" +
        "</div>",
        data_frame:"<li class='jingzhi div-jump list' style='margin-top: 0.01rem;'>" +
        "<a href='{url}'><p><img src='./img/wezhan/laba.png' style='margin-right: .45rem;'>" +
        "<span id='soundHoldNotice3'>{notice}</span></p></a>" +
        "</li>"
    },
    wap_fund_recommend:{
        base_frame:"<div class='content'>" +
        "<div class='content-header'>" +
        "<img src='./img/wezhan/icon_1.png'>&nbsp;&nbsp;" +
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
	floatingImage:{
        base_frame:"<div class='side-right floatingImage_{index}' ></div>",
        data_frame:"<a href='{btnUrl}'><img src='{imageUrl}'>{btnName}</a>"
	},
    wap_line:"<div style='height: .2rem;'><!--<img src='../img/account/huixian.png'>--></div>"
}

function queryLayout() {
    var url = utils.prefix_mobile + "/app_func/query_cust_layout?layoutId=wap_service_xiaomi&r=" + (Math.random()*10000).toFixed(0);

    utils.get(url,null,function(result){
        console.log('result-------------------',result);
        if (result.body.layout != undefined && result.body.layout != null){
            var layoutList = result.body.layout;
            var isAddLine = true;
            for (var index in layoutList) {
                var layoutObj = layoutList[index];
                Layout.drawingLayoutNew('#panel', layoutObj, index, LayoutFramework[layoutObj.temId], isAddLine);
            }
        }
    });
}

function querySubCategory() {
    var url = "/message-center-api/v1/app/services/sub-category";

    utils.get(url,null,function(result){
        var categoryList = result.body;
        if(categoryList  != undefined &&categoryList != null) {
            var html = '';
            categoryList.forEach(function (item) {
                html += "<div class=\"switch\">" +
                    "    <div class='switch_content switch1'>" +
                    "        <div class='content_l'>" +
                    "            <p>"+ item.categorySubName +"</p>" +
                    "            <p>"+ item.categoryRemark +"</p>" +
                    "        </div>" +
                    "        <div class='content_r' onclick=\"handerCategorySwitch('"+ item.categorySubId +"')\">" +
                    "            <a href='javascript:;' class='"+ (item.status == '1' ? 'switch_open' : 'switch_close') +"'></a>" +
                    "        </div>" +
                    "    </div>" +
                    "</div>";
            });
            $(".category_panel").append(html);
            if(categoryList.length == 0){
                $(".service_sub").hide();
            }
        } else {
            $(".service_sub").hide();
        }
    });
}

function handerCategorySwitch(categorySubId){
    var eventTarget = $(event.target);
    var openSt = "1";
    if(eventTarget[0].tagName == "A"){
        if ($(event.target).hasClass("switch_open")) {
            $(event.target).removeClass("switch_open").addClass('switch_close');
            openSt = 0;
        } else {
            $(event.target).removeClass("switch_close").addClass('switch_open');
            openSt = 1;
        }
    } else {
        if ($(event.target).find("a").hasClass("switch_open")) {
            $(event.target).find("a").removeClass("switch_open").addClass('switch_close');
            openSt = 0;
        } else {
            $(event.target).find("a").removeClass("switch_close").addClass('switch_open');
            openSt = 1;
        }
    }
    var url = "/message-center-api/v1/app/services/sub-category/subscribe";
    var data = {"categorySubId":categorySubId,"openStatus":openSt};
    utils.post(url, JSON.stringify(data), null, function (result) {
        // console.log("result:" + result);
    });
}
