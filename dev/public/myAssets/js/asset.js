// const e = require("express");

$(function () {
    // 默认调用
    getXjbList();
    echartList('7');
    var urlIndex = getUrlParam('index');
    var currencyFlag = false;
    var assetMode = '';
    var getAssetMode= utils.getSession('assetMode')|| assetMode;
    var liWidth=(1/5)*100;
    var lis=document.querySelectorAll('.tab1 li');
    var selectBtns=document.querySelectorAll('.title-select .select-btn1');
    lis.forEach(function (item) {  
        item.style.setProperty('--percent', liWidth);
    })
    // $('.tab1 li').each(function(index,item){
    //     $(item).css('--percent',liWidth)
    // })
    
    // tab切换执行代码
    $('.tab1 li').click(function () {
        var index = $(this).index();
        var assetMode=$('.content1').attr('data-mode');
        if ($(this).hasClass("active")) {
            return;
        }
        if (index || index === 0) {
            $('footer').each(function () {
                $(this).hide();
            });
            $('.footer' + index).show();
            getList(index,assetMode);
        }
        $(this).addClass("active").siblings().removeClass('active');
        $(this).parent().siblings().hide().eq($(this).index()).show();
    });
    // 顶部select交互
    // 头部现金宝，第三方直销的展示事件
    $('.title-btn').on('click', function () {
        if ($('.title-select').is(":hidden")) {
            $('.title-select').show();
            $('.mask').show();
        } else {
            $('.title-select').hide();
            $('.mask').hide();
        }
    });
    // 现金宝,第三方直销,全部的切换事件
    $('.select-btn1').on('click', function () {
        var currentText = $(this).text();
        if (currentText === '全部') {
            assetMode = '';
            liWidth=(1/5)*100;
            lis[0].style.setProperty('display', 'block');
        }
        if (currentText === '现金宝直销') {
            assetMode = '0';
            liWidth=(1/5)*100;
            lis[0].style.setProperty('display', 'block');
            
        }
        if (currentText === '第三方平台') {
            assetMode = '3';
            liWidth=(1/4)*100;
            lis[0].style.setProperty('display', 'none');
            lis.forEach(function (item,index) {
                if(($(item).hasClass('active'))&&(index===0)){
                    $(item).next().addClass("active").siblings().removeClass('active');
                    $(item).parent().siblings().hide().eq(index+1).show();
                }
            })
        }
        utils.setSession('assetMode',assetMode);
        $('.content1').attr('data-mode',assetMode);
        lis.forEach(function (item,index) {
            if(($(item).hasClass('active'))){
                getList(index,assetMode);
            }
        })
        lis.forEach(function (item) {  
            item.style.setProperty('--percent', liWidth);
        })
        $('.select-btn1').removeClass('active');
        $(this).addClass('active');
        $('.title-btn>span').text(currentText);
        $('.title-select').hide();
        $('.mask').hide();
    });
    if (urlIndex || urlIndex === 0) {
        $('.tab1 li').eq(urlIndex).addClass("active").siblings().removeClass('active');
        $('.tab1').siblings().hide().eq(urlIndex).show();
        $('footer').each(function () {
            $(this).hide();
        });
        $('.footer' + urlIndex).show();
        // console.log('object', urlIndex);
        // getList(urlIndex,getAssetMode);
        // console.log(getAssetMode);
        switch(getAssetMode){
            case '':
                selectBtns[0].click();
                break;
            case '0':
                selectBtns[1].click();
                break;
            case '3':
                selectBtns[2].click();
                break;
        }
    }
    // 排序select
    $(document).on('click', '.select-btn', function () {
        $('.mask').show();
        $('.select-box').addClass('box-active');
        $(this).children('img').addClass('btn-active');
    })
    $(document).on('click', '.select-box', function (e) {
        var tagName = e.target.tagName.toLowerCase();
        var className = e.target.className;
        if ($(e.target).hasClass('choose-active')) {
            return;
        }
        if (tagName == 'a') {
            $('.mask').hide();
            $('.select-box').removeClass('box-active');
            $('.select-btn img').removeClass('btn-active');
        }
        if (tagName == 'i') {
            $(e.target).addClass('choose-active').parent().siblings().find('i').removeClass('choose-active')
        }
        if (className == 'select-ok') {
            var type = '';
            $('.select-box i').each(function () {
                if ($(this).hasClass('choose-active')) {
                    type = $(this).parent().attr('data-choose')
                }
            });
            console.log(type);
            getMoreList('02', '156',assetMode,type);
        }
    })
    // tip弹窗
    $(document).on('click', '.card-tip', function () {
        console.log($(this).attr('data-tip'));
        $('.Bomb-box-content p').text($(this).attr('data-tip'));
        $('.Bomb-box').show();
    })
    // closeTip
    $('.Bomb-box-ok').click(function () {
        $('.Bomb-box').hide();
    })
    // 美元切换
    $(document).on('click', '.currency', function () {
        if (!currencyFlag) {
            $(this).addClass('currency-active');
            getMoreList('02', '840',assetMode);
            currencyFlag = true;
        } else {
            $(this).removeClass('currency-active');
            currencyFlag = false;
            getMoreList('02', '156',assetMode);
        }
    })
    // 交易查询跳转
    $(document).on('click','.transaction-query',function(){
        var type=$(this).attr('data-type');
        if(type==5){
            // 投顾的交易查询类型是6
            type = 6
        }
        window.location.href='/mobileEC/wap/trade/tradeList.html?productType='+type;
    })
    // 基金，组合，资管页面跳转

    $(document).on('click','.content-t',function(){
        var dataItem= decodeURIComponent($(this).attr('data-item'));
        // console.log(dataItem);
        // return;
        var type=$(this).attr('data-type');
        var productId=$(this).attr('data-id');
				var productName=$(this).attr('data-name');
        var balanceSerialNo=$(this).attr('data-balanceSerialNo');
        var api=$(this).attr('data-api');
        var storage=window.sessionStorage;

        if($(this).parent().parent().children()[0].textContent == '实盘组合'){
            $('.Bomb-box-content p').text('请前往APP查看');
            $('.Bomb-box-ok').text('确定');
            $('.Bomb-box').show();
        }else{
            console.log(api);
            if(balanceSerialNo&&!(balanceSerialNo=='null')){
                storage.setItem("_selected_fund", dataItem);
                switch(type){
                    case '02':
                        var jumpHoldDetail = function(fundType){
                            if(fundType == '8'){
                                //若基金类型为理财型则跳转理财产品详情页面
                                window.location.href='/mobileEC/wap/fund/financial_fund_holding_detail.html?fundId='+productId;
                                // window.location.href='/mobileEC/wap/fund/fund_holding_detail_new.html?fundId='+productId;
                            }else{
                                window.location.href='/mobileEC/wap/fund/fund_holding_detail_new.html?fundId='+productId+'&fundName='+productName;
                            }
                        }
                        getFundType(balanceSerialNo, jumpHoldDetail);                        
                        break;
                    case '03':                    
                        window.location.href='/mobileEC/wap/fundgroup/hold_group_fund_details.html?groupId='+productId+'&balanceSerialNo='+balanceSerialNo;
                        break;
                    case '04':
                        // window.location.href='/mobileEC/prdPagesNew/topFinancialDetail.html?productId='+productId+'&balanceSerialNo='+balanceSerialNo;
                        window.location.href='/mobileEC/prdPages/topFinancialDetail.html?productId='+productId+'&balanceSerialNo='+balanceSerialNo;
                        break;    
                }
            }else{
                window.location.href='subAsset.html?productId='+productId+'&classify='+type;
            }
        }
    
        // getFundType(balanceSerialNo, jumpHoldDetail);
      
    })

    // translate-table切换echart数据图;
    $('.translate-table li').click(function(){
        var count='';
        if($(this).hasClass('translate-active')){
            return;
        };
        $(this).addClass('translate-active').siblings().removeClass('translate-active');
        count=$(this).attr('data-day');
        echartList(count);
    })
})

// 获取echart图表数据
function echartList(count) {
    utils.ajax({
        url: '/smac/v1/asset/yields',
        data: {
            count: count,
            branchCode: '247'
            // fundId:'000330'
        },
        success: function (res) {
            var income = [];
            var myChart = echarts.init(document.getElementById('pie'));
            if (res.returnCode === 0) {
                income = res.body;
                setOption(option_1, income);
                draw(myChart, option_1);
            }
            else if(res.returnCode === 1000){
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                jumpLogin();
            } 
            else {
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                return false;
            }



        }
    })
}

//getFundType获取基金类型
function getFundType(balanceSerialno, callback){
    var param = {
        "balanceSerialno": balanceSerialno
    };
    utils.ajax({
        url: '/fts/v1/asset/detail/query-by-balance-serialno',
        data: param,
        method: 'GET',
        success: function (res) {
            if (res.returnCode === 0 && res.body!= null && res.body!= undefined) {
                var fundInfo = res.body;
                var fundType = fundInfo.fundType;
                callback(fundType);
            }
        },
        finally: function(error){
            console.log(error);

        }
    })    
    
}


// getXjbList获取现金宝数据
function getXjbList() {
    utils.ajax({
        url: '/mobile-bff/v1/smac/assetDetail',
        success: function (res) {
            console.log(res, 'xjb');
            if (res.returnCode === 0) {
                var result = res.body;
                var html = '';
                html += `
                <div class="card">
                <h4 class="title">现金宝资产(元)</h4>
                <h2 class="sum">${result.totalBalance==0?'0.00':symbolFormat(result.totalBalance)}</h2>
                <div class="desc">
                    <div class="text-left">
                        <p>万份收益(元)</p>
                        <p>${result.fundIncomeUnitDisplay}</p>
                    </div>
                    <div class="text-center">
                        <p>最新收益(元)</p>
                        <p>${result.lastDayProfit}(${formatDate(result.profitDay)})</p>
                    </div>
                    <div class="text-right">
                        <p>累计收益(元)</p>
                        <p>${result.totalProfit}</p>
                    </div>
                </div>
            </div>
            <div class="echart-title clearfix">
                <div class="text-l fl">
                    <p><span>${result.holdDetails[0].productName}</span>${result.holdDetails[0].productId}</p>
                    <p>七日年化收益率(％)</p>
                </div>
                <a href="/mobileEC/wap/fund/steadyCombination.html?fundId=${result.holdDetails[0].productId}" class="text-r fr">查看详情</a>
            </div>
                `;
                $('.cashCoin .content').html(html);
            }
            else if(res.returnCode === 1000){
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                jumpLogin();
            }  
            else {
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                return false;
            }

        }
    })
}
// getMoreList(获取基金组合资管数据)
function getMoreList(classifyCode, currencyType, assetMode,fundSortType) {
    var realFundSortType = '';
    if (fundSortType) {
        realFundSortType = fundSortType;
    } else {
        realFundSortType = 'FUNDTYPE'
    }
    utils.ajax({
        url: '/assetcenter/v1/view/list/product',
        data: {
            assetMode,
            classify: classifyCode,
            currencyType: currencyType,
            fundSortType: realFundSortType
        },
        success: function (res) {
            console.log(res, 'classifyCode=' + classifyCode);
            if (res.returnCode === 0) {
                var result = res.body;
                var groupList = res.body.groupList;
                var html = '';
                var flag = false;

                var tabClass = {
                    '02': '.fund',
                    '03': '.combination',
                    '04': '.asset',
                    '05': '.investment'
                };
                var selectData = {
                    MARKETVALUE: '按市值排序',
                    FUNDTYPE: '按类型排序',
                    LASTPROFIT: '按最新收益排序',
                    BALANCEPROFIT: '按持有收益排序'
                }
                html += `<div class="card">`;
                (classifyCode == '02') && (html += `<h4 class="title">基金资产</h4>`);
                if (classifyCode == '02' && result.currencyType == '156') {
                    html += '<i class="currency"></i>';
                    currencyFlag = false;
                } else if (classifyCode == '02' && result.currencyType == '840') {
                    html += '<i class="currency currency-active"></i>';
                    currencyFlag = true;
                }
                (classifyCode == '03') && (html += `<h4 class="title">组合资产</h4>`);
                (classifyCode == '04') && (html += `<h4 class="title">资管资产</h4>`);
                (classifyCode == '05') && (html += `<h4 class="title">投顾资产</h4>`);
                html += `<h2 class="sum">${result.totalBalance=='0'?'0.00':symbolFormat(result.totalBalance)}</h2>
                <div class="desc1">
                    <div class="text-left">
                        <p>${result.fields[0].title}</p>`
                if (result.fields[0].tip) {
                    html += `<img src="./img/icon-th.png" alt="" data-tip="${result.fields[0].tip}" class="card-tip" />`;
                }
                html += `<p>${result.fields[0].value}</p>
                    </div>
                    <div class="text-left">
                        <p>${result.fields[1].title}</p>
                        <p>${result.fields[1].value}</p>
                    </div>
                </div>`;
                // if ((classifyCode == '02') || (classifyCode == '04')) {
                    html += ` <div class="query-box">
                    <p class="transaction-query" data-type="${classifyCode=='02'?'1':classifyCode=='03'?'3':classifyCode=='04'?'4':'5'}"><span>${result.onWayCount=='0'?'交易查询':result.onWayCount+'笔交易确认中'}</span><img src="./img/arrow-white.png" alt=""></p>
                </div>`
                // }
                html += '</div>'
                if (classifyCode == '02' && result.currencyType == '156') {
                    html += `<div class="fund-sort clearfix">
                    <p class="fl">持有基金</p>
                    <div class="select-btn fr">
                        <span>${selectData[realFundSortType]}</span>
                        <img src="./img/select.png" alt="">
                    </div>
                </div>`
                }
                if (classifyCode == '02' && realFundSortType != 'FUNDTYPE') {
                    html += `<div class="view-list" style=" margin-top:.5rem">`;
                } else {
                    html += `<div class="view-list">`;
                }
                // 有列表数据
                if (groupList && groupList.length > 0) {
                    groupList.forEach(function (item, index) {
                        var holdArr=item.assetList.filter(function(subitem){
                            if(subitem.isHold=='Y'){
                                return subitem;
                            }
                        });
                        var holdLen=holdArr.length;
                        var assetLen=item.assetList.length;
                        console.log(holdLen,'holdLen','---',assetLen,'assetLen');
                        if(assetLen>0&&holdLen===0){
                            html += `
                                <div class="combination-list" data-show-f="N"> `;
                        }else if(assetLen>0&&holdLen>0){
                            html += `
                                <div class="combination-list" data-show-f="Y">`;
                        }else{
                            html += `
                                <div class="combination-list" data-show-f="Y">`;
                        }
                        
                        if (item.title) {
                            html += '<h4>';
                        }
                        if (item.icon) {
                            html += `<img src="${item.icon}">`;
                        }
                        if (item.title) {
                            html += `${item.title}</h4>`;
                        }
                        // html+=`
                        item.assetList.forEach(function (childItem, childIndex) {
                            html += `<div class="content" data-show="${childItem.isHold}">
                         <div class="content-t" data-type="${classifyCode}"  data-name="${childItem.productName}" data-id="${childItem.productId}" data-balanceSerialNo="${childItem.assetSerialNo}" data-api="${childItem.api}" data-item="${encodeURIComponent(JSON.stringify(childItem))}">
                             <div class="content-t-l">
                                 <p class="text1">${childItem.productName} `;
                            if(classifyCode =='05' && childItem.arAcct){
                                html+=`<span></span>`
                            }else{
                                html+=`<span>${childItem.productId}</span>`
                            }    
                            if (childItem.tags.length > 0) {
                                childItem.tags.forEach(function (tagItem) {
                                    html += `<i>${tagItem}</i>`;
                                })
                            }
                                html+='</p>';
                            if(childItem.subTitle){
                                html += `
                                <p class="text2">${childItem.subTitle}</p>`
                            }
                            html += `
                             
                             </div>
                             <img src="./img/arrow.png" alt="">
                         </div>
                         `;
                            if (childItem.profitUpdateTip) {
                                html += ` <div class="clearfix"><p class="status-blue">${childItem.profitUpdateTip}</p></div>
                    `;
                            }
                            html += `<div class="content-b">
                             <div class="text-left">
                                 <p>${childItem.fields[0].title}</p>
                                 <p class="black">${childItem.fields[0].value}</p>
                             </div>
                             <div class="text-center">
                                 <p>${childItem.fields[1].title}</p>
                                 <p  style="color:${childItem.fields[1].color}">${childItem.fields[1].value}</p>
                             </div>
                             <div class="text-right">
                             <p>${childItem.fields[2].title}</p>
                             <p  style="color:${childItem.fields[2].color}">${childItem.fields[2].value}</p>
                             </div>`;
                           
                            html += `</div>`;
                            if (childItem.feeReminder) {
                                html += `<div class="radio-box">
                            <p class="radio-content">
                                <img src="./img/horn.png" alt="">
                                <span>${childItem.feeReminder}</span>
                            </p>
                        </div>`
                            }
                            if (childItem.topRightTag) {
                                html += ` <p class="status status-red">${childItem.topRightTag}</p>
                        `;
                            }

                            html += '</div>'
                        })
                        html += '</div>'
                    });

                    $(tabClass[classifyCode]).html(html)
                    $(tabClass[classifyCode]).append('<a href="javascript:;" id="history-show">显示历史持有</a>');
                    $('.combination-list .content').each(function () {
                        // console.log($(this).attr('data-show'));
                        if ($(this).attr('data-show') == 'N') {
                            $(this).hide()
                        }
                    })
                    $('.view-list .combination-list').each(function () {
                        console.log($(this).attr('data-show-f'));
                        if ($(this).attr('data-show-f') == 'N') {
                            $(this).hide()
                        }
                    })
                    $(document).on('click', '#history-show', function () {
                        console.log('123');
                        if (!flag) {
                            $(this).prev().find('.content').each(function () {
                                // console.log($(this).attr('data-show'));
                                if ($(this).attr('data-show') == 'N') {
                                    $(this).show();
                                }
                            });
                            $(this).prev().find('.combination-list').each(function () {
                                // console.log($(this).attr('data-show'));
                                if ($(this).attr('data-show-f') == 'N') {
                                    $(this).show();
                                }
                            });
                            $(this).text('隐藏历史持有')
                            flag = true;
                        } else {
                            $(this).prev().find('.content').each(function () {
                                // console.log($(this).attr('data-show'));
                                if ($(this).attr('data-show') == 'N') {
                                    $(this).hide();
                                }
                            });
                            $(this).prev().find('.combination-list').each(function () {
                                // console.log($(this).attr('data-show'));
                                if ($(this).attr('data-show-f') == 'N') {
                                    $(this).hide();
                                }
                            });
                            $(this).text('显示历史持有')
                            flag = false;
                        }
                    })
                }
                // 无列表数据
                else {
                    if (currencyType == '156') {
                        html += `<div class="noData">
                        <img src="./img/lost.png" alt="" class="lost">
                        <p class="text">暂无人民币资产</p>
                    </div>`
                    } else {
                        html += `<div class="noData">
                        <img src="./img/lost.png" alt="" class="lost">
                        <p class="text">暂无美元资产</p>
                    </div>`
                    // 现金宝内部链接无法配置
                    // <a href=""><span>去看看美元基金</span><img src="./img/arrow-blue.png" alt=""></a>
                    }
                    html += '</div>'
                    $(tabClass[classifyCode]).html(html)
                }

            }
            else if(res.returnCode === 1000){
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                jumpLogin();
            }  
            else {
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                return false;
            }

        }
    })
}


// 公共方法
// 调用接口数据
function getList(index,assetMode) {
    var index = Number(index);
    switch (index) {
        case 0:
            getXjbList();
            echartList('7');
            break;
        case 1:
            getMoreList('02', '156',assetMode);
            break;
        case 2:
            getMoreList('03', '156',assetMode);
            break;
        case 4:
            getMoreList('04', '156',assetMode);
            break;
        case 3:
            getMoreList('05', '156',assetMode, 'ARACCT');
            break;
    }
}
// get queryParam
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return '';
}
// 千分符format
function symbolFormat(val) {
    if (val) {
        val = val.toString();
    }
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
// 日期format
function formatDate(val) {
    var value = val;
    if (value) {
        value = value.slice(4).split('')[0] + value.slice(4).split('')[1] + '-' + value.slice(4).split('')[2] + value.slice(4).split('')[3];
        return value;
    } else {
        return '--'
    }
}
// echart配置项
var option_1 = {
    color: ['#fb5c5f', '#89acd8', '#f11', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                show: false,
            },
            lineStyle: {
                color: "#1aa2e6"
            },
            snap: true
        },
        backgroundColor: '#fe5a5b',
        formatter: function (params) {
            var result = ''
            result = params[0].data
            return result
        }
    },
    grid: {
        left: '5%',
        right: '8%',
        bottom: '10%',
        top: "5%",
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "#f1f1f1",
                width: 1,
                type: 'dashed'
            }
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: "f1f1f1"
            }
        },
        axisLabel: {
            interval: 30
        },
        axisPointer: {
            type: 'line',
            label: {
                show: false
            },
            lineStyle: {
                type: "solid",
                color: "#1aa2e6"
            },
            snap: true,
            // triggerTooltip: true 
        },
        data: [],
    }],
    yAxis: [{
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
        axisLine: {
            show: true,
            lineStyle: {
                color: "f1f1f1"
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "#f1f1f1",
                width: 1,
                type: 'dashed'
            }
        },
        axisLabel: {
            show: true,
            formatter: function (value) {
                var text = value.toFixed(3);
                return text;
            },
            textStyle: {
                color: "#999999",
                fontWeight: "bolder",
                fontFamily: "Arial"
            }
        },
        axisPointer: {
            type:'line',
            label: {
                show: false
            },
            lineStyle: {
                type: "solid",
                color: "#1aa2e6"
            },
            snap:true,
        }
    }],
    series: [{
        type: 'line',
        smooth: true,
        symbolSize: 6,
        showSymbol: false,
        hoverAnimation: false,
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#fee6e3' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                }], false)
            }
        },
        lineStyle: {
            normal: {
                color: "#fb5c5f",
                width: 1
            }
        },
        data: []
    }]
};

function setOption(option, incomes1) {
    var result1 = formattingIncomes(incomes1);

    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].axisLabel.interval = result1.xArr.length - 2;
    option.series[0].data = result1.yArr;

}

function draw(myChart, option) {
    if (!((option.series[0].data && option.series[0].data.length > 0))) {
        option.xAxis[0].data = ["", ""];
        option.xAxis[0].axisLabel.interval = ["", ""].length - 2;
        // $(".noData").show();
        // $()
    }
    // else{
    //     // $(".noData").hide();
    // }
    myChart.setOption(option);
    setTimeout(function () {
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 1,
            dataIndex: 10
        });
    }, 0);
}

function formattingIncomes(incomes) {
    var xArr = [],
        yArr = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var navDt = incomes[i].navDt;
        xArr.push(navDt.substr(-4, 2) + "-" + navDt.substr(-2, 2));
        yArr.push((incomes[i].yieldDisplay));
    }
    return {
        xArr: xArr,
        yArr: yArr
    };
}

// 跳转登陆
function jumpLogin(){
    window.location.href="/tradeh5/newWap/auth/login_wap.html?referUrl=/tradeh5/newWap/myAssets/asset.html"
}