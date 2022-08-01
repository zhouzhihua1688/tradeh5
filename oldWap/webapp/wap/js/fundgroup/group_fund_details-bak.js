﻿$('.layer .layer-wrap button').on("click",function () {
    $('.layer').hide();
});
function layerShow(){
    $('.layer').show();
}
var is_set_pwd_show_tip_err_code = '0';
var facheGroup = false;
//var mychart_gp_1;
var createtimeStr = "";
var lastChangeDateStr = "";
var establishDateStr = "";
var transferNum = 0;
var groupId = "";
$(function(){
    // 更多
    $('.upfold').click(function(){
        $(this).prev().toggleClass('ellipsis');
        $(this).toggleClass('pack-up');
    });
    // 日涨跌幅下拉
    $(".historical-detail").click(function(){
        $(this).find('.down,.up').toggleClass('down up');
        $('.content1 table').toggleClass('hide');
    });

    //组合详情数据加载
    groupId = App.getUrlParam("groupId");
    requestGroupFundDetail(groupId);
    getTransferTimes(groupId);
    queryRecommendInfo();
    $(".btn_mip a").click(function(){
        buttonJump('MIP');
    });
    $(".buy_btn_li a").click(function(){
        buttonJump('BUY');
    });
//特殊处理 weixin登录态
    function buttonJump(type) {

        if(HTF.isWeixin()){
            var code = HTF.getUrlParam("code");
            var ssoCookie = HTF.getCookie("sso_cookie");

            if (HTF.isNotBlank(ssoCookie)) {
                entryChannel = App.getCookie("entryChannel");
                loginChannel = App.getCookie("loginChannel");
                if((loginChannel != "" && entryChannel != "" && loginChannel != entryChannel) || (loginChannel == "" && entryChannel != "" )){
                    //以当前登录的为主
                    if(HTF.isNotBlank(code)) {
                        // code存在，发送codeLoginRequest.ajax请求，使用code登陆并获取sso_cookie
                        HTF.codeLoginRequest(code);
                    } else {
                        if (type == 'MIP'){
                            HTF.next_jump = prefix + "/mobileEC/wap/fundgroup/create_mip.html?groupId=" + App.getUrlParam("groupId");
                        }else if (type == 'BUY'){
                            HTF.next_jump = prefix + "/mobileEC/wap/fundgroup/payment.html?groupId" + App.getUrlParam("groupId");
                        }
                        // code不存在，需要登录信息的业务逻辑触发时，再去获取code
                        HTF.getCode();
                    }
                }
                // ssoCookie存在，已登录状态，无需处理code
                // 业务逻辑ajax请求正常处理对应（带着sso_cookie）
                if(is_set_pwd_show_tip_err_code == "2"){
                    $(".tip2").show();
                    $("#add_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + document.URL);
                    return;
                }else if (type == 'MIP'){
                    window.location.href = "create_mip.html?groupId=" + App.getUrlParam("groupId");
                }else if (type == 'BUY'){
                    window.location.href = "payment.html?groupId=" + App.getUrlParam("groupId");
                }
            } else {
                // ssoCookie不存在，未登录状态
                if(HTF.isNotBlank(code)) {
                    // code存在，发送codeLoginRequest.ajax请求，使用code登陆并获取sso_cookie
                    HTF.codeLoginRequest(code);
                } else {
                    if (type == 'MIP'){
                        HTF.next_jump = prefix + "/mobileEC/wap/fundgroup/create_mip.html?groupId=" + App.getUrlParam("groupId");
                    }else if (type == 'BUY'){
                        HTF.next_jump = prefix + "/mobileEC/wap/fundgroup/payment.html?groupId" + App.getUrlParam("groupId");
                    }
                    // code不存在，需要登录信息的业务逻辑触发时，再去获取code
                    HTF.getCode();
                }
            }
        }else{
            if(is_set_pwd_show_tip_err_code == "1"){
                $(".login_tip").show();
                return;
            }else if(is_set_pwd_show_tip_err_code == "2"){
                $(".tip2").show();
                $("#add_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + document.URL);
                return;
            }else if (type == 'MIP'){
                window.location.href = "create_mip.html?groupId=" + App.getUrlParam("groupId");
            }else if (type == 'BUY'){
                window.location.href = "payment.html?groupId=" + App.getUrlParam("groupId");
            }
        }
    }

    //业绩基准1月
    var standardIncomes1 = null;

    $(".tab2 li").click(function(){	//1个月、 6个月、 1年 、全部
        if($(this).hasClass("active")) { return;}
        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');

        var index = $(this).index();
        switch(index)
        {
            case 0:
                getChartData(groupId, "0,1,4", 1, establishDateStr);
                break;
            case 1:
                getChartData(groupId, "0,1,4", 2, establishDateStr);
                break;
            case 2:
                getChartData(groupId, "0,1,4", 3, establishDateStr);
                break;
            case 3:
                getChartData(groupId, "0,1,4", 4, establishDateStr);
                break;

        }
    });
});

var option_1 = {
    color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
        },
        position:["50%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
        formatter: function(params){
            var arr = [];
            arr.push('<div style="width: 100%;margin-left: -50%;font-size: 14px;">')
            for(var i=0; i< params.length; i++){
                //console.log(params[i].seriesName);
                switch (params[i].seriesName){
                    case "组合收益率":
                        arr.push('<span class="icon icon-1"></span>'); break;
                    case "沪深300":
                        arr.push(' &nbsp;&nbsp; <span class="icon icon-3"></span>'); break;
                    case "业绩基准":
                        arr.push(' &nbsp;&nbsp; <span class="icon icon-4"></span>'); break;
                }
                arr.push(params[i].seriesName + ": " +params[i].data + "%");
            }
            arr.push("</div>");
            return arr.join("");
        }
        //' <div style="width: 100%;margin-left: -50%;font-size: 14px;"><span class="icon icon-1"></span> {a0}: {c0}% &nbsp;&nbsp; <span class="icon icon-3"> </span>{a1}: {c1}%</div>'
    },
    grid: {left: '5%', right: '5%', bottom: '0%', top: "20%", containLabel: true },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLine:{show: true, lineStyle:{color:"#a5a5a5"}},
            axisLabel: {interval: 30, formatter: function(value, index){
                    if(index ==0){ return "   " + value; }
                    return value + "      ";
                }
            },
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: {  show: true,    formatter: function(value){return toDecimal(value);} ,textStyle: {color: "#999999",fontWeight:"bolder",fontFamily:"Arial"}},
            axisPointer: {show:false/*  , label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} */ },
        }
    ],
    series : [
        {
            symbol: "none", name:'组合收益率', type:'line', smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }], false)
                }
            },
            lineStyle: {normal: {color: "#fb5c5f", width: 1}},
            data: []
        },
        {
            symbol: "none",
            name:'业绩基准',
            type:'line',
            smooth: true,
            /*  areaStyle: {
                 normal: {
                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                       offset: 0, color: '#d0deef' // 0% 处的颜色
                     }, {
                       offset: 1, color: '#fff' // 100% 处的颜色
                     }], false)
                 }
             }, */
            lineStyle: { normal: { color: "#fecb01", width: 1} },
            data: []
        }
    ]
};
var option_2 =  {
    color: ['#fb5c5f','#fe7e01', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
        },
        position:["50%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)",
        textStyle:{ color: "#333"},
        formatter: function(params){
            var arr = [];
            arr.push('<div style="width: 100%;margin-left: -50%;font-size: 14px;">')
            for(var i=0; i< params.length; i++){
                //console.log(params[i].seriesName);
                switch (params[i].seriesName){
                    case "组合收益率":
                        arr.push('<span class="icon icon-1"></span>'); break;
                    case "沪深300":
                        arr.push(' &nbsp;&nbsp; <span class="icon icon-3"></span>'); break;
                    case "业绩基准":
                        arr.push(' &nbsp;&nbsp; <span class="icon icon-4"></span>'); break;
                }
                arr.push(params[i].seriesName + ": " +params[i].data + "%");
            }
            arr.push("</div>");
            return arr.join("");
        }
        //' <div style="width: 100%;margin-left: -50%;font-size: 14px;"><span class="icon icon-1"></span> {a0}: {c0}% &nbsp;&nbsp; <span class="icon icon-4"> </span>{a1}: {c1}%</div>'
    },
    grid: {left: '5%', right: '5%', bottom: '0%', top: "20%", containLabel: true },
    xAxis : [
        {
            type : 'category', boundaryGap : false, axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLine:{show: true, lineStyle:{color:"#a5a5a5"}},
            axisLabel: {interval: 30,formatter: function(value, index){
                    if(index ==0){ return "   " + value; }
                    return value + "      ";
                }
            },
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',  axisTick: {show: false},
            axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: {  show: true,    formatter: function(value){return toDecimal(value);} ,textStyle: {color: "#999999",fontWeight:"bolder",fontFamily:"Arial"}},
            axisPointer: {show:false/*  , label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"}  */}
        }
    ],
    series : [
        {
            symbol: "none",  name:'组合收益率',  type:'line',smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }], false)
                }
            },
            lineStyle: {normal: { color: "#fb5c5f", width: 1} },
            // label: {normal: {formatter:"{c}%" },
            data: []
        },
        {
            symbol: "none", name:'沪深300', type:'line', smooth: true,
            /*             areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                  offset: 0, color: '#fff3d0' // 0% 处的颜色
                                }, {
                                  offset: 1, color: '#fff' // 100% 处的颜色
                                }], false)
                            }
                        },
             */            lineStyle: { normal: { color: "#89acd8", width: 1} },
            data: []
        }
    ]
};

function setOption(option,incomes1, incomes2){
    var result1 =  formattingIncomes(incomes1);
    var result2 =  formattingIncomes(incomes2);
    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].axisLabel.interval = result1.xArr.length-2;
    option.series[0].data = result1.yArr;
    option.series[1].data = result2.yArr;

}
function draw(myChart, option){
    if( !((option.series[0].data && option.series[0].data.length>0) ||  (option.series[1].data && option.series[1].data.length>0))){
        option.xAxis[0].data = ["",""];
        option.xAxis[0].axisLabel.interval = ["",""].length-2;
        //隐掉
        $(".content2").hide();
        //$(".noData").show();
    }else{
        $(".noData").hide();
    }
    myChart.setOption(option);
    /* setTimeout(function(){
        myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: 10 });
    },0); */
}

function formattingIncomes(incomes){
    var xArr = [], yArr = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var chartDt = incomes[i].chartDt;
        xArr.push(chartDt.substr(2,2) + "-" + chartDt.substr(-4,2) + "-" + chartDt.substr(-2,2));
        yArr.push(incomes[i].chartNum);
    }
    return {xArr: xArr, yArr: yArr};
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function requestGroupFundDetail(groupId){
    App.get(App.projectNm + "/adviser/query_fundgroup_detail_info?groupId=" + groupId, null, function(result){

        if(result.body != undefined && result.body != null){
            var detailInfo = result.body.detailInfo;
            if(detailInfo != undefined && detailInfo != ""){
                var dayYield = detailInfo.dayYieldWap;
                $("#dayYield").html(Number(dayYield).toFixed(4));
                if(dayYield < 0){
                    $("#dayYield_p").removeClass("red");
                    $("#dayYield_p").addClass("green");
                }
                $("#profit_one").html(detailInfo.oneMonthProfit + "%");
                $("#profit_three").html(detailInfo.threeMonthProfit + "%");
                $("#profit_year").html(detailInfo.nearYearProfit + "%");

                if("1" == detailInfo.isShowOnlineData){
                    $("#profit_since_title").html("上线以来");
                    $("#profit_since").html(detailInfo.onlineProfit + "%");
                    if(detailInfo.onlineProfit < 0){
                        $("#profit_since").css("color","#009944");
                    } else if (Number(detailInfo.onlineProfit) == 0){
                        $("#profit_since").html("--");
                    }
                }else{
                    $("#profit_since_title").html("成立以来");
                    $("#profit_since").html(detailInfo.sinceProfit + "%");
                    if(detailInfo.sinceProfit < 0){
                        $("#profit_since").css("color","#009944");
                    } else if (Number(detailInfo.sinceProfit) == 0){
                        $("#profit_since").html("--");
                    }
                }

                if(detailInfo.oneMonthProfit < 0){
                    $("#profit_one").css("color","#009944");
                } else if (Number(detailInfo.oneMonthProfit) == 0){
                    $("#profit_one").html("--");
                }
                if(detailInfo.threeMonthProfit < 0){
                    $("#profit_three").css("color","#009944");
                } else if (Number(detailInfo.threeMonthProfit) == 0){
                    $("#profit_three").html("--");
                }
                if(detailInfo.nearYearProfit < 0){
                    $("#profit_year").css("color","#009944");
                } else if (Number(detailInfo.nearYearProfit) == 0){
                    $("#profit_year").html("--");
                }

                if(detailInfo.dayYieldDt == "" || detailInfo.dayYieldDt == null){
                    $("#dayYieldDt").html("--");
                    $("#dayYield").html("--");
                }else{
                    $("#dayYieldDt").html(detailInfo.dayYieldDt);
                    $("#dayYield").html(detailInfo.dayYield+ "%");
                }

                $("#display_yield_desc").html(detailInfo.displayYieldDesc);
                $("#yearYield_title").html(detailInfo.displayYieldTypeNm);
                if(detailInfo.displayYield == "--"){
                    $("#yearYield").html("--");
                }else if(detailInfo.displayYield < 0){
                    $("#yearYield_p").removeClass("red");
                    $("#yearYield_p").addClass("green");
                    $("#yearYield").html(detailInfo.displayYield + "%");
                }else{
                    $("#yearYield").html(detailInfo.displayYield + "%");
                }
                var fgaDesc = detailInfo.fundgroupDesc;
                var fundgroupDesc = "";
                if(fgaDesc.length > 60){
                    fundgroupDesc = fgaDesc.substr(0,60) + "<span class='ellipsis-surplus'>" + fgaDesc.substring(60) + "</span>"
                }else{
                    $('.upfold').prev().toggleClass('ellipsis');
                    $('.upfold').toggleClass('pack-up');
                    fundgroupDesc = fgaDesc;
                }
                $("#fundgroupAdvise").html(fundgroupDesc);
                $("#changeAdvise").html(detailInfo.changeAdvise);

                var groupDetails = detailInfo.groupDetails;
                var groupName = detailInfo.groupname;
                createtimeStr = detailInfo.createtimeStr;
                establishDateStr = detailInfo.establishDateStr;
                $("title").html(groupName);
                $(".subGroupFundList").empty();
                var subListHtml = "";
                for(var i in groupDetails){
                    var subgroup = groupDetails[i];
                    var percent = subgroup.percent;
                    var classifyName = subgroup.classifyName;
                    var subFunds = subgroup.subList;
                    var color = subgroup.color;
                    if(subFunds.length == 0)
                        continue;
                    subListHtml = subListHtml + "<tbody><tr>"
                        + "<td><i style='background-color: "+ color +"'></i>" + classifyName
                        + "</td><td class='font-arial red'>"+ percent + "<span class='sign'>%</span>"
                        + "</td></tr>";

                    for(var j in subFunds){
                        var fund = subFunds[j];
                        var fundId = fund.fundId;
                        var fundNm = fund.fundNm;
                        var fundPercent = fund.percent;
                        var canApply = fund.canApply;
                        var stopTrade = fund.stopTrade;
                        var canRedeem = fund.canRedeem;
                        var fundStName = fund.fundStName;
                        var fundRiskLevel = fund.fundRiskLevel;
                        var fundRiskDesc = "";
                        if (fundRiskLevel != undefined && fundRiskLevel != null) {
                            fundRiskLevel = Number(fundRiskLevel) + 1;
                            fundRiskDesc = fund.fundRiskLevelNm+"风险（R" + fundRiskLevel + "）";
                        }

                        subListHtml = subListHtml + "<tr onclick='javascript: window.location.href = \""+ fund.jumpUrl +"\"'><td>" + fundNm
                            + "<span class='font-arial'>"+ fundId + "</span>";
                        if(canApply == "0" || stopTrade == "1" || canRedeem == "0"){
                            subListHtml = subListHtml + "<br><i class='deal'>" + fundRiskDesc + "</i>" + "<i class='deal'>" + fundStName + "</i>";
                        } else {
                            subListHtml = subListHtml + "<br><i class='deal'>" + fundRiskDesc + "</i>";
                        }

                        subListHtml = subListHtml + "</td><td class='font-arial'>" + fundPercent + "<span class='sign'>%</span>"
                            +"</td></tr>";
                    }
                    subListHtml = subListHtml + "</tbody>";
                }
                $(".subGroupFundList").html(subListHtml);
                //发车组合
                var fundGroupType = detailInfo.fundGroupType;
                if(fundGroupType == "12"){
                    facheGroup = true;
                    $(".btn_mip").hide();
                    $("#groupDetailTitle").html("申购基金明细");
                    $("#facheRiskTips").show();
                }else{
                    $(".tab1 li").click(function(event){
                        if($(this).hasClass("active")) { return;}
                        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');

                        var index = $(".tab2 li.active").index();
                        switch(index)
                        {
                            case 0:
                                getChartData(groupId, "0,1,4", 1, establishDateStr);
                                break;
                            case 1:
                                getChartData(groupId, "0,1,4", 2, establishDateStr);
                                break;
                            case 2:
                                getChartData(groupId, "0,1,4", 3, establishDateStr);
                                break;
                            case 3:
                                getChartData(groupId, "0,1,4", 4, establishDateStr);
                                break;

                        }
                    });
                    $(".up").show();
                    $("#tabs").show();
                    $(".btn_mip").show();
                }
                getChartData(groupId, "0,1,4", 1, establishDateStr);
                $(".buy_btn_li").show();
            }

        }
    });
}

//发车特殊处理
function getNewChartData(groupId, chartTp, queryTp, createDt){
    //console.log(chartTp);
    $.get(App.projectNm  + "/adviser/query_fund_group_yields_wap?groupId=" + groupId + "&chartTp=" + chartTp + "&queryTp=" + queryTp + "&createDt=" + createDt + "&t=" + new Date().getTime(), function(resultStr){
        //console.log(resultStr);
        var result = JSON.parse(resultStr);
        if(result.returnCode == 0){
            var chartDatas = result.body;
            var syList = chartDatas.syList;
            var hs300List = chartDatas.hs300List;
            var mixList = chartDatas.mixList;
            hs300List.length = syList.length;
            mixList.length = syList.length;

            var index = $(".tab1 li.active").index();
            //console.log(index);
            mychart_gp_1 = echarts.init(document.getElementById('pie1'));
            if(index == 0){
                setOption(option_1, syList, mixList);
                draw(mychart_gp_1,option_1);
            }else{
                setOption(option_2, syList, hs300List);
                draw(mychart_gp_1,option_2);
            }

            var indexx = syList.length - 1 ;
            mychart_gp_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: indexx});
            mychart_gp_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: -1});

            /* } else {
                alert(result.returnMsg); */
        }
    });
}

function getTransferTimes(groupId){
    App.get(App.projectNm + "/adviser/query_fund_group_change_date?groupId=" + groupId, null, function(result){
        if(result.body != undefined && result.body != null){
            var dateList = result.body.dateList;
            if(dateList != undefined && dateList != null){
                lastChangeDateStr = dateList[0];
                var dataSize = dateList.length;
                $("#transferCount").html(dataSize);
                if(dataSize <= 0){
                    $(".content4").hide();
                    $("#transferCount_a").attr("href", "javascript:void();");
                }else{
                    transferNum = dataSize;
                    $("#transferCount_a").attr("href", "htffundxjb://action?type=fg&subType=fgtd&groupId="+ App.getUrlParam("groupId") + "&date=" + lastChangeDateStr);
                }

            }
        }
    });
}

function getChartData(groupId, chartTp, queryTp, createDt){
    if (facheGroup) {
        return;
    }
    App.get(App.projectNm + "/adviser/query_fund_group_yields?groupId=" + groupId + "&chartTp=" + chartTp + "&queryTp=" + queryTp + "&createDt=" + createDt + "&t=" + new Date().getTime(), null, function(result){

        if(result.body != undefined && result.body != null){
            var chartDatas = result.body;
            var syList = chartDatas.syList;
            var hs300List = chartDatas.hs300List;
            var mixList = chartDatas.mixList;
            // var syList = [{"chartDt":"20181216","chartNum":"0.00"},{"chartDt":"20181217","chartNum":"0.00"},{"chartDt":"20181218","chartNum":"0.00"},{"chartDt":"20181219","chartNum":"0.00"},{"chartDt":"20181220","chartNum":"0.00"},{"chartDt":"20181221","chartNum":"0.00"},{"chartDt":"20181222","chartNum":"0.00"},{"chartDt":"20181223","chartNum":"0.00"},{"chartDt":"20181224","chartNum":"0.00"},{"chartDt":"20181225","chartNum":"0.00"},{"chartDt":"20181226","chartNum":"0.00"},{"chartDt":"20181227","chartNum":"0.00"},{"chartDt":"20181228","chartNum":"0.00"},{"chartDt":"20181229","chartNum":"0.00"},{"chartDt":"20181230","chartNum":"0.00"},{"chartDt":"20181231","chartNum":"0.00"},{"chartDt":"20190101","chartNum":"0.00"},{"chartDt":"20190102","chartNum":"0.00"},{"chartDt":"20190103","chartNum":"0.00"},{"chartDt":"20190104","chartNum":"0.00"},{"chartDt":"20190105","chartNum":"0.00"},{"chartDt":"20190106","chartNum":"0.00"},{"chartDt":"20190107","chartNum":"0.00"},{"chartDt":"20190108","chartNum":"0.00"},{"chartDt":"20190109","chartNum":"0.00"},{"chartDt":"20190110","chartNum":"0.00"},{"chartDt":"20190111","chartNum":"0.00"},{"chartDt":"20190112","chartNum":"0.00"},{"chartDt":"20190113","chartNum":"0.00"},{"chartDt":"20190114","chartNum":"0.00"},{"chartDt":"20190115","chartNum":"0.00"}];
            // var hs300List = [{"chartDt":"20181216","chartNum":"0.00"},{"chartDt":"20181217","chartNum":"0.00"},{"chartDt":"20181218","chartNum":"0.00"},{"chartDt":"20181219","chartNum":"0.00"},{"chartDt":"20181220","chartNum":"0.00"},{"chartDt":"20181221","chartNum":"0.00"},{"chartDt":"20181222","chartNum":"0.00"},{"chartDt":"20181223","chartNum":"0.00"},{"chartDt":"20181224","chartNum":"0.00"},{"chartDt":"20181225","chartNum":"0.00"},{"chartDt":"20181226","chartNum":"0.00"},{"chartDt":"20181227","chartNum":"0.00"},{"chartDt":"20181228","chartNum":"0.00"},{"chartDt":"20181229","chartNum":"0.00"},{"chartDt":"20181230","chartNum":"0.00"},{"chartDt":"20181231","chartNum":"0.00"},{"chartDt":"20190101","chartNum":"0.00"},{"chartDt":"20190102","chartNum":"0.00"},{"chartDt":"20190103","chartNum":"0.00"},{"chartDt":"20190104","chartNum":"0.00"},{"chartDt":"20190105","chartNum":"0.00"},{"chartDt":"20190106","chartNum":"0.00"},{"chartDt":"20190107","chartNum":"0.00"},{"chartDt":"20190108","chartNum":"0.00"},{"chartDt":"20190109","chartNum":"0.00"},{"chartDt":"20190110","chartNum":"0.00"},{"chartDt":"20190111","chartNum":"0.00"},{"chartDt":"20190112","chartNum":"0.00"},{"chartDt":"20190113","chartNum":"0.00"},{"chartDt":"20190114","chartNum":"0.00"},{"chartDt":"20190115","chartNum":"0.00"}];
            // var mixList = [{"chartDt":"20181216","chartNum":"0.00"},{"chartDt":"20181217","chartNum":"0.00"},{"chartDt":"20181218","chartNum":"0.00"},{"chartDt":"20181219","chartNum":"0.00"},{"chartDt":"20181220","chartNum":"0.00"},{"chartDt":"20181221","chartNum":"0.00"},{"chartDt":"20181222","chartNum":"0.00"},{"chartDt":"20181223","chartNum":"0.00"},{"chartDt":"20181224","chartNum":"0.00"},{"chartDt":"20181225","chartNum":"0.00"},{"chartDt":"20181226","chartNum":"0.00"},{"chartDt":"20181227","chartNum":"0.00"},{"chartDt":"20181228","chartNum":"0.00"},{"chartDt":"20181229","chartNum":"0.00"},{"chartDt":"20181230","chartNum":"0.00"},{"chartDt":"20181231","chartNum":"0.00"},{"chartDt":"20190101","chartNum":"0.00"},{"chartDt":"20190102","chartNum":"0.00"},{"chartDt":"20190103","chartNum":"0.00"},{"chartDt":"20190104","chartNum":"0.00"},{"chartDt":"20190105","chartNum":"0.00"},{"chartDt":"20190106","chartNum":"0.00"},{"chartDt":"20190107","chartNum":"0.00"},{"chartDt":"20190108","chartNum":"0.00"},{"chartDt":"20190109","chartNum":"0.00"},{"chartDt":"20190110","chartNum":"0.00"},{"chartDt":"20190111","chartNum":"0.00"},{"chartDt":"20190112","chartNum":"0.00"},{"chartDt":"20190113","chartNum":"0.00"},{"chartDt":"20190114","chartNum":"0.00"},{"chartDt":"20190115","chartNum":"0.00"}];
            hs300List.length = syList.length;
            mixList.length = syList.length;

            var index = $(".tab1 li.active").index();
            //console.log(index);
            mychart_gp_1 = echarts.init(document.getElementById('pie1'));
            if(index == 0){
                setOption(option_1, syList, mixList);
                draw(mychart_gp_1,option_1);
            }else{
                setOption(option_2, syList, hs300List);
                draw(mychart_gp_1,option_2);
            }

            var indexx = syList.length - 1 ;
            mychart_gp_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: indexx});
            mychart_gp_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: -1});
            $(".content2").show();
        }
    });
}
function queryRecommendInfo(){
    var url = "/mobile-bff/v1/fund/getFundRecommendInfo?productType=1&fundIds="+App.getUrlParam("groupId");

    App.get(url, null, function(result){
            if(result.body != undefined && result.body != null){
                var html = '';
                result.body[App.getUrlParam("groupId")].forEach(function(item){
                    var infoTitle = item.infoTitle.length > 20 ? item.infoTitle.substr(0,20) + '...' : item.infoTitle;
                    html += '<li class="jingzhi div-jump list" style=" margin-top: 0.01rem;" onclick="visit(\''+item.infoJumpUrl+'\')">'
                        +'	<p><img src="../images/fundgroup/sound.png" alt="" style="margin-right: .45rem;"><span >'+infoTitle+'</span></p>'
                        +'	<img class="right_1" src="../images/fundgroup/icon02.png">'
                        +'</li>';
                });
                $(".content0 .wrap").html(html);
                if(html.length > 0){
                    $(".content0").show();
                    if($('.content0 .wrap .list').length>1){
                        scroll();
                    }
                }
            }
        }
    );

}

function visit(url){
    window.location.href = url;
}

function scroll() {
    $(".content0 .wrap .list:eq(0)").animate({ "margin-top": "-2.5rem" },1000, function () {
        $(".content0 .wrap .list:eq(0)").appendTo($(".content0 .wrap"));
        $(".content0 .wrap .list:last").css({ "margin-top": '0' });
    })
    setTimeout(scroll, 4000)
}
