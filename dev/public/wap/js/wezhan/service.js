
window.isLoginFlag = false;     //页面是否登录flag
window.stashList = [];              //等待处理的list   [{'func':xxx, 'args':xxx}]
function triggerStashFunc() {
    while(stashList.length>0){
        var stashItem = stashList.pop();
        stashItem['func'](stashItem['args']);
    }
}

$(function () {
    // App.queryHomePageInfo(function () {
    //     var acInfo = App.getSession(App.accountHomePageInfo);
    //     $(".totalAmt").html(App.formatMoney(acInfo.assets.totalValue, 2));
    //     $(".balance").html(App.formatMoney(acInfo.assets.balance, 2));
    //     if (isNaN(acInfo.homeInfo.income)){
    //         $(".income").html(acInfo.homeInfo.income);
    //     } else {
    //         $(".income").html(App.formatMoney(acInfo.homeInfo.income < 0 ? '-' + acInfo.homeInfo.income : '+' + acInfo.homeInfo.income));
    //     }
    // });

    var categoryList = [];
    $('#testUrl p').html(window.location.href).hide();

    var channelCode = utils.getUrlParam('channelCode');
    var code = utils.getUrlParam('token');
    // alert('channelCode info:', JSON.stringify({channelCode:channelCode,code:code,token:token}));

    //进入该页面授权登录
    var ssoCookie = HTF.getCookie("sso_cookie");
    var unbind = HTF.getUrlParam("unbind");
    if(HTF.isWeixin() && HTF.isBlank(ssoCookie) && App.isEmpty(unbind)){
        // ssoCookie不存在，未登录状态
        HTF.getCode();
    } else {
        var channelCode = utils.getCookie('channelCode');
        var code = utils.getSession('__code');

        console.log('channelCode=', channelCode);
        console.log('code=', code);
        console.log(channelCode === 'airstar' && !ssoCookie && code);
        console.log(channelCode === 'zhengtong' && !ssoCookie && code);
        if(channelCode === 'airstar' || channelCode === 'zhengtong'){
            $('.footer_btn').hide();
            $('.container').css('padding-bottom', 0);

            if(!ssoCookie && code){
                // // 小米金融未登录，使用url中的code获取登录
                // utils.jumpLoginByChannelCode();

                // 小米金融未登录，尝试静默登录
                // utils.silentLogin();

                $(".no-login-header").children().hide();
                utils.silentLogin(function(result){
                    if(result.returnCode == 0){
                        window.location.reload();
                    } else {
                        $(".no-login-header").children().show();
                    }
                });
            }
        }


        queryLayout();
        // var url = App.projectNm + "/account/query_home_page_info?date=" + (new Date()).getTime();
        var url = "/mobile-bff/v1/account/home-page-info";
        App.getNoJump(url, null, function (result) {
            if (result.returnCode == 0){
                // 已登录
                window.isLoginFlag = true;
                triggerStashFunc();
                $(".header").on('click', function () {
                    window.location.href = '/tradeh5/newWap/myAssets/index.html';
                });
                $(".login-header").show();
                var acInfo = result.body;
                $(".totalAmt").html(App.isNumber(acInfo.assets.totalValue) ? App.formatMoney(acInfo.assets.totalValue, 2) : acInfo.assets.totalValue);
                $(".balance").html(App.formatMoney(acInfo.assets.balance, 2));
                if (isNaN(acInfo.homeInfo.income)){
                    $(".income").html(acInfo.homeInfo.income);
                } else {
                    $(".income").html(App.formatMoney(acInfo.homeInfo.income < 0 ? '-' + acInfo.homeInfo.income : '+' + acInfo.homeInfo.income));
                }
                $(".service_sub").show();
                querySubCategory();
            } else {
                window.isLoginFlag = false;
                //会话失效sso-cookie失效
                if(HTF.isWeixin() && App.isEmpty(unbind)){
                    HTF.getCode();
                }

                $(".no-login-header").show();
                if(channelCode === 'airstar'){
                    $(".login-a").attr("href", "/tradeh5/newWap/auth/login_xiaomi.html?referUrl="+encodeURIComponent(window.location.href));
                    $(".register-a").attr("href", "/tradeh5/newWap/auth/login_xiaomi.html?referUrl="+encodeURIComponent(window.location.href));    
                }else if(channelCode === 'zhengtong'){
                    $(".login-a").attr("href", "/tradeh5/newWap/auth/login_zhengtong.html?referUrl="+encodeURIComponent(window.location.href));
                    $(".register-a").attr("href", "/tradeh5/newWap/auth/login_zhengtong.html?referUrl="+encodeURIComponent(window.location.href));    
                }else {
                    $(".login-a").attr("href", "/tradeh5/newWap/auth/login_wap.html?referUrl="+encodeURIComponent(window.location.href));
                    $(".register-a").attr("href", "/tradeh5/newWap/auth/login_wap.html?referUrl="+encodeURIComponent(window.location.href));
                }
            }
        });
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
            "background": "url(../images/wezhan/closeEyes.png) no-repeat no-repeat",
            "background-size": "100% 100%"
        });
        $(".enshow").show();
        $(".isshow").hide();
        flag = false;
    } else {
        $(".eyes").css({
            "background": "url(../images/wezhan/openEyes.png) no-repeat no-repeat",
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
        "<a href='{url}'><p><img src='../images/wezhan/laba.png' style='margin-right: .45rem;'>" +
        "<span id='soundHoldNotice3'>{notice}</span></p></a>" +
        "</li>"
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
	floatingImage:{
        base_frame:"<div class='side-right floatingImage_{index}' ></div>",
        data_frame:"<a href='{btnUrl}'><img src='{imageUrl}'>{btnName}</a>"
	},
    wap_line:"<div style='height: .2rem;'><!--<img src='../images/account/huixian.png'>--></div>",
}

// 是否展示升级弹窗
function isUpgrade() {
    var url = "/smac/v1/config/base-account/prompt-upgrade?branchCode=247&r=" + (Math.random()*10000).toFixed(0);
    var cookieVal=utils.getCookie("sso_cookie_ext_dp");
    var financialUpgrade = utils.getSession("financialUpgrade");
    App.getNoJump(url,null,function(result){
        if(result.body){
            $(".init_box").show();
            var upgradeVal=utils.getCookie('sso_cookie_ext_dp');
            utils.setSession("upgradeVal",upgradeVal);
        }
        else if ((!financialUpgrade)||(financialUpgrade!=cookieVal)){
            $(".financial_box").show();
            utils.setSession("financialUpgrade",cookieVal);
        }
    });
}
// 20210621新加
// 升级收益
function getFundDetails() {
    utils.get('/smac/v1/asset/base-account/fund/info?branchCode=247', null, function (result) {
        if (result.returnCode == 0) {  
            // teamId = result.body.teamId
            console.log("===",result)
            $(".profit").text(result.body.custBaseFundYieldDisplay+'%');
            $(".yieldLeft").text(result.body.custBaseFundYieldDisplay+'%');
            $(".profitRight").text(result.body.targetBaseFundYieldDisplay);
            $(".textLeft").text(result.body.custBaseFundName);
            $(".productLeft").text(result.body.custBaseFundName);
            $(".textRight").text(result.body.targetBaseFundName); 
            $(".name1").text(result.body.custBaseFundName);
            $(".name2").text(result.body.targetBaseFundName);
            $(".dateText").text(result.body.navDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3")); 

            var targetFundId = result.body.targetBaseFundId;
            utils.post('/mobile-bff/v1/fund/detailInfo',JSON.stringify({"fundId": targetFundId}),function(result){
                if(result.returnCode == 0){
                    var fundDetail = result.body;
                    var fundContractList = fundDetail.fundContractList;
                    fundContractList.forEach(function (item) {
                        if(item.title.indexOf("基金合同") > -1 && item.title.indexOf("招募说明书") == -1 ){
                            $('#contractLinks a:nth-of-type(1)').attr("href",item.url);
                        }
                        if(item.title.indexOf("招募说明书") > -1){
                            $('#contractLinks a:nth-of-type(2)').attr("href",item.url);
                        }                        
                        if(item.title.indexOf("产品资料概要") > -1){
                            $('#contractLinks a:nth-of-type(3)').attr("href",item.url);
                        }
					})

                }
            });

            utils.post('/mobile-bff/v1/fund/detailInfo',JSON.stringify({"fundId": "006893"}),function(result){
                if(result.returnCode == 0){
                    var fundDetail = result.body;
                    $(".yieldRight").text(fundDetail.yearProfitStr+'%');
                }
            });
        }
    });
}

$(".financial_close").click(function(){
    $(".financial_box").hide();
})

$(".financial_update").click(function(){
    if(utils.isProdEnv()){
        window.location.href="https://activity.99fund.com/activity-center/act-resources/pages/fengliduanzhaichiying202203/share.html";
    }else{
        window.location.href="http://appuat.99fund.com.cn:7081/activity-center/act-resources/pages/fengliduanzhaichiying202203/share.html"
    }
})

//份额
function assetDetails() {
    utils.get('/mobile-bff/v1/smac/assetDetail', null, function (result) {
        if (result.returnCode == 0) {  
            console.log("===",result)
            if(result.body.availableBalance!=""){
                $(".init_text").show();
                $(".init_text2").hide();
                $(".init_number").text(Number(result.body.availableBalance).toFixed(2));
            }else{
                $(".init_text2").show();
                $(".init_text").hide();
            }
        }
    });
}
// 20210705 显示现金宝升级弹窗
function showImagePopup(layoutObj){
    getFundDetails();   // 升级收益
    assetDetails();     //份额

    utils.get('/res/v1/app-func-layout/theme-infos-app?layoutId=' + layoutObj.layoutId + '&funcModId=' + layoutObj.funcmodId,null,function(result){
        if(result && result.body && result.body.length>0){
            // alert(result.body[0].object[0].imageUrl);
            // $(".init_box img").attr('src',result.body[0].object[0].imageUrl).css("display", "block");
            $(".init_box img").css("display", "block");
                // 现金宝升级
            $(".init_close").click(function(){
                $(".init_box").hide();
            })
            $(".init_protocol").click(function(){
                if(utils.isProdEnv()){
                    window.location.href="https://app.99fund.com/tradeh5/newWap/tradeProcess/cash/xjb_upgrade_agreement.html"
                }else{
                    window.location.href="http://appuat.99fund.com.cn:7081/tradeh5/newWap/tradeProcess/cash/xjb_upgrade_agreement.html"
                }
            })
            $(".init_box .init_text a").click(function(){
                utils.setSession("upgradeVal", "");
            })
            var sessionVal=utils.getSession("upgradeVal");
            var cookieVal=utils.getCookie("sso_cookie_ext_dp");
            var financialUpgrade = utils.getSession("financialUpgrade");
            if((!sessionVal)&&(sessionVal!=cookieVal)){
                isUpgrade();
            }else if ((!financialUpgrade)||(financialUpgrade!=cookieVal)){
                $(".financial_box").show();
                utils.setSession("financialUpgrade",cookieVal);
            };
            var params={
                acceptMode: "M",
                apkind: "985",
                branchCode: "247",
                subApkind: "MAC001"
            };
            $(".init_update").click(params,function(e){
                utils.ajax({
                    url: '/mobile-bff/v1/smac/fund/convert',
                    type: 'POST',
                    data: e.data,
                    success: function (result) {
                        if (result.returnCode === 0) {
                            riskMark();
                            $(".init_box").hide();
                            alertTips3('升级成功','您的现金宝钱包已升级！','去查看',jumpuri);
                            $(".Bomb-box-tips").css({"font-size":".75rem","color":"#000","padding-top":".9rem"});
                            $(".Bomb-box-content").css({"font-size":".7rem","color":"#666","padding":".8rem","padding-top":".6rem"});
                            $(".Bomb-box-ok").css({"font-size":".75rem","color":"#006bfe"});
                        } 
                    }.bind(this)
                })
            })
        }
        
    })
}

function queryLayout() {
    var layoutId = App.getCookie('channelCode') === 'airstar' ? 'wap_service_xiaomi' : 'wap_service';
    // var url = App.projectNm + "/app_func/query_cust_layout?layoutId=" + layoutId + "&r=" + (Math.random()*10000).toFixed(0);
    var url = "/res/v1/app-func-layout/location-info?layoutId=" + layoutId + "&r=" + (Math.random()*10000).toFixed(0);

    App.get(url,null,function(result){
        if (result.body.appLayoutFuncInfoList != undefined && result.body.appLayoutFuncInfoList != null){
        // if (result.body.layout != undefined && result.body.layout != null){
            // var layoutList = result.body.layout;
            var layoutList = result.body.appLayoutFuncInfoList;
            var isAddLine = true;
            for (var index in layoutList) {
                var layoutObj = layoutList[index];
                if(layoutObj.temId=='imagePopup'){
                    if(window.isLoginFlag == true){
                        showImagePopup(layoutObj)
                    } else {
                        window.stashList.push({'func': showImagePopup, 'args': layoutObj});
                    }
                }else{
                    Layout.drawingLayoutNew('#panel', layoutObj, index, LayoutFramework[layoutObj.temId], isAddLine);
                }
            }
        }
    });
}
function jumpuri(){
    window.location.href="/tradeh5/newWap/myAssets/asset.html"
}
// 留痕
function riskMark(){
    var params={
        accptMd: "WAP",
        agrements: [
          {
            agreement: "MAC_UPGRADE"
          }
        ]
      }
    utils.ajax({
        url: '/icif/v1/agreements/add',
        type: 'POST',
        data: params,
        success: function (result) {
            if (result.returnCode === 0) {
                console.log(result);
            } 
        }.bind(this)
    })
}
function querySubCategory() {
    if(utils.getCookie('channelCode') === 'airstar'||utils.getCookie('channelCode') === 'zhengtong'){
        $(".service_sub").hide();
        console.log('小米金融或者政通渠道，服务订阅不需要展示')
        return;
    }
    var url = "/message-center-api/v1/app/services/sub-category";

    App.get(url,null,function(result){
        categoryList = result.body;
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
            $(".category_panel").html(html);
            if(categoryList.length == 0){
                $(".service_sub").hide();
            }
        } else {
            $(".service_sub").hide();
        }
    });
}

function handerCategorySwitch(categorySubId){
    // var eventTarget = $(event.target);
    // var openSt = "1";
    // if(eventTarget[0].tagName == "A"){
    //     if ($(event.target).hasClass("switch_open")) {
    //         $(event.target).removeClass("switch_open").addClass('switch_close');
    //         openSt = 0;
    //     } else {
    //         $(event.target).removeClass("switch_close").addClass('switch_open');
    //         openSt = 1;
    //     }
    // } else {
    //     if ($(event.target).find("a").hasClass("switch_open")) {
    //         $(event.target).find("a").removeClass("switch_open").addClass('switch_close');
    //         openSt = 0;
    //     } else {
    //         $(event.target).find("a").removeClass("switch_close").addClass('switch_open');
    //         openSt = 1;
    //     }
    // }
    var openSt = categoryList.filter(function(item){
        return item.categorySubId == categorySubId;
    })[0].status;
    var url = "/message-center-api/v1/app/services/sub-category/subscribe";
    var data = {"categorySubId":categorySubId,"openStatus":openSt == 1 ? 0 : 1 };
    App.post(url, JSON.stringify(data), null, function (result) {
        // console.log("result:" + result);
        querySubCategory();
    });
}
