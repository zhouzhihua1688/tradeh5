/*弹框*/
/*关闭弹框*/
$('.layer .layer-wrap button').on("click",function () {
    $('.layer').hide();
    $(document.body).css({  "overflow":"auto"});
});
function layerShow(){
    $("#display_yield_desc").html("偏离度是反映您的组合与标准组合差异的指数，基金净值波动、投资经理调整组合都会产生偏离度。当偏离度大于一定阈值允许一键调整。");
    $(document.body).css({ "overflow-x":"hidden","overflow-y":"hidden"});
    $('.layer').show();
}
function layerShowTransfer(){
    var url = App.projectNm + "/adviser/query_transfer_tips?dt=" + Math.random();
    $.get(url, function(result){
        var data = JSON.parse(result);
        //console.log("result:", data);
        if(data.returnCode == 0){
            $("#display_yield_desc").html(data.body.transferTips);
            $(document.body).css({ "overflow-x":"hidden","overflow-y":"hidden"});
            $('.layer').show();
        }
    });
}

var myChart_1, myChart_2;
var fundGroupCreateDate = "";

$(function(){
    // 组合
    var incomes1 = [];
    // 业绩基准
    var incomes2 = [];
    // 沪深300
    var incomes3 = [];
    myChart_1 = echarts.init(document.getElementById('pie1'));
    setOption(option_1, incomes1, incomes2,incomes3);
    draw(myChart_1,option_1);

    option_2.series[0].data = [0, 0, 0, 0];  //现有组合
    option_2.series[1].data = [0, 0, 0, 0];  //标准组合
    if( !((option_2.series[0].data && option_2.series[0].data.length>0) ||  (option_2.series[1].data && option_2.series[1].data.length>0))){
        $(".noData2").show();
    }
    myChart_2 = echarts.init(document.getElementById('bar'));
    myChart_2.setOption(option_2);

    $(".tab2 li").click(function (){
        if($(this).hasClass("active")) { return;}
        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');
        queryCharts($(this).val());
    });

    queryYields();
    queryCharts("1");
	queryRecommendInfo();
});

var option_1 = {
    color: ['#fb5c5f','#fecb01', '#89acd8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
        },
        position:["10%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
        formatter: function(params){
            var arr = [];
            var isNoData =  $(".noData").css("display") == "block";
            arr.push('<div style="width: 100%;font-size: 14px;">')
            for(var i=0; i< params.length; i++){
                switch (params[i].seriesName){
                    case "我的组合":
                        arr.push('<span class="icon icon-1"></span>'); break;
                    case "标准组合":
                        arr.push('<br/><span class="icon icon-4"></span>'); break;
                    case "沪深300":
                        arr.push('<br/><span class="icon icon-3"></span>'); break;
                }
                if(isNoData){
                    var data = "--"
                }else{
                    var data = params[i].data + "%";
                }
                arr.push(params[i].seriesName + ": " + data);
            }
            arr.push("</div>");
            return arr.join("");
        }
    },
    grid: { left: '5%', right: '5%', bottom: '0%', top: "96", containLabel: true  },
    xAxis : [
        {
            type : 'category', boundaryGap : false,
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLine:{show: true, lineStyle:{color:"#a5a5a5"}},
            axisLabel: {interval:30},
            data :[],
        }
    ],
    yAxis :
        {
            type : 'value',
            axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: {  show: true,    formatter: function(value){return toDecimal(value);} ,textStyle: {color: "#999999", fontWeight:"bolder",fontFamily:"Arial"}},
            axisPointer: { show:false/* , label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} */ },
        } ,
    series : [
        {
            symbol: "none", name:'我的组合',  type:'line', smooth: true,
            areaStyle: { normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' }, { offset: 1, color: '#fff' }], false)
                } },
            lineStyle: { normal: { color: "#fb5c5f",width: 1 } },
            data:[],
            z: 1
        },
        {
            symbol: "none",  name:'标准组合', type:'line',  smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fff3d0'  }, { offset: 1, color: '#fff' }], false)
                } },
            lineStyle: { normal: { color: "#fecb01" ,width: 1}},
            data:[],
            z: 3
        },
        {
            symbol: "none",  name:'沪深300', type:'line',  smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#d0deef'  }, { offset: 1, color: '#fff' }], false)
                } },
            lineStyle: { normal: { color: "#89acd8",width: 1 }},
            data: [],
            z:2
        }
    ]
};

var option_2 = {
    tooltip : { trigger: 'axis',axisPointer : { type : 'shadow' },
        formatter: function(param){
            var str = param[0].axisValue;
            for(var i = 0; i < param.length; i++){
                str += '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ' + param[i].color + ';" ></span>' + param[i].seriesName +': ' + param[i].value + '%';
            }
            return str;
        }
    },
    legend: { bottom: 0, data:['现有组合','标准组合'], itemWidth: 14 },
    grid: {left: '3%', right: '3%', bottom: '15%', top: "15%", containLabel: true  },
    xAxis : [
        {  type : 'category',
            data : ['权益类','固收类','现金类','其他类'],
            axisTick: { show: false }
        }
    ],
    yAxis : {
        name: "单位(%)",
        type : 'value', axisLabel: {formatter: function(value){return toDecimal(value);}}, axisTick: { show: false },
        axisLine: { lineStyle:{color: "#000"} },
        splitLine: {lineStyle: { type: "dashed"}}, max:100,
//            interval: 20
    },
    series : [
        {
            name:'现有组合',
            type:'bar',
            barWidth:"20px",
            barGap:"60%",
            barCategoryGap: "50%",
            itemStyle: { normal: { color: "#FF8C69" } },
            label: { normal: { show: true, formatter: '{c}', position: 'top', offset:[0, 5] , textStyle:{color:"#999"}  } },
            data:[]
        },
        {
            name:'标准组合',
            type:'bar',
            barWidth:"20px",
            barGap:"60%",
            barCategoryGap: "50%",
            itemStyle: { normal: { color: "#fb5c5f" } },
            label: {  normal: { show: true, formatter: '{c}', position: 'top', offset:[0, 5] , textStyle:{color:"#999"} } },
            data:[]
        }
    ]
};

function setOption(option,incomes1, incomes2, incomes3){
    var result1 =  formattingIncomes(incomes1);
    var result2 =  formattingIncomes(incomes2);
    var result3 =  formattingIncomes(incomes3);
    if(result1.xArr.length > 0){
        option.xAxis[0].data = result1.xArr;
    }else if(result2.xArr.length > 0){
        option.xAxis[0].data = result2.xArr;
    }else{
        option.xAxis[0].data = result3.xArr
    }
    option.xAxis[0].axisLabel.interval = option.xAxis[0].data.length-2;
    option.series[0].data = result1.yArr;
    option.series[1].data = result2.yArr;
    option.series[2].data = result3.yArr;

}

function draw(myChart, option){
    if( !((option.series[0].data && option.series[0].data.length>0) ||  (option.series[1].data && option.series[1].data.length>0))){
        option.series[0].data = ["0","0"];
        option.series[0].z = 4;
        option.series[1].data = ["0","0"];
        option.series[2].data = ["0","0"];
        option.xAxis[0].data = ["",""];
        option.yAxis.axisLabel.formatter = function(value, index){
            if(index ==0){  return value + ".00"; }
            return "";
        }
        $(".noData").show();
        /*  option.xAxis[0].data = ["",""];
         option.xAxis[0].axisLabel.interval = ["",""].length-2;
         $(".noData").show();
         return; */
    }else{
        $(".noData").hide();
        option.series[0].z = 1;
        option.yAxis.axisLabel.formatter = function(value){return toDecimal(value);} ;
    }
    myChart.setOption(option);
    /* setTimeout(function(){
        var num = parseInt(option.series[0].data.length/3);
        myChart.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:num });
    },0); */
}

function formattingIncomes(incomes){
    var xArr = [], yArr = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var chartDt = incomes[i].chartDt;
        //console.log(chartDt);
        xArr.push("      "+chartDt.substr(2,2) + "-" + chartDt.substr(-4,2) + "-" + chartDt.substr(-2,2) + "                ");
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

// 更多
var onoff=true;

var version = App.getUrlParam("version");

function queryYields(){
    var groupId = App.getUrlParam("groupId");
    var balanceSerialNo = App.getUrlParam("balanceSerialNo");
    App.get(App.projectNm + "/adviser/hold_group_fund_info?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo, null, function(data){
        //console.log(data);
        //alert("测试组合持有页面显示有时为空白问题，请不要提BUG： returnCode>>" + data.returnCode);
        if(data.body != undefined && data.body != null){

            $("#transfer_count_a").html(data.body.transFerType);

            if ("05" != data.body.fundGroupType){
                $("#transfer_sestion").show();
            }

            /*if (WAP.isNotEmpty(version) && Number(version) >= 4.3){
                if(Number(data.body.isHasMip) > 0){
                    $("#mip_sestion").show();
                    if(Number(data.body.isHasMip) > 1){
                        //跳到定投列表
                        $("#mip_sestion").on("click", function(){
                            window.location.href = "htffundxjb://action?type=fg&subType=transferMode&groupId=" + holdGroupInfo.groupid});
                    }else {
                        //跳到定投详情
                        $("#mip_sestion").on("click", function(){
                            window.location.href = "htffundxjb://action?type=fg&subType=transferMode&contractNo=" + data.body.mipContractNo; });
                    }
                }
            }*/


            var holdGroupInfo = data.body.holdGroupInfo;
            $("#marketValue").html(holdGroupInfo.holdingAsset);
            $("#holdingYield").html(holdGroupInfo.holdingYield);
            $("#totalProfit").html(holdGroupInfo.totalProfit);
            $("#holdingCost").html(holdGroupInfo.holdingCost);
            $("#income").html(holdGroupInfo.income);
            $("#income_dt").html( holdGroupInfo.incomeDate.substr(-4,2) + '.' +  holdGroupInfo.incomeDate.substr(-2,2));
            if(App.isNotEmpty(data.body.profitUpdating)){
                $("#income_title").html(data.body.profitUpdating);
            }
            $("#holdingProfit").html(holdGroupInfo.holdingProfit);
            var holdingAsset = holdGroupInfo.holdingAsset.replace(/,/g, '');
            if(Number(holdingAsset) < 0) {
                $("#marketValue").removeClass("red");
                $("#marketValue").addClass("green");
            }
            var hYield = holdGroupInfo.holdingYield.replace('%', '');
            if(Number(hYield) < 0) {
                $("#holdingYield").removeClass("red");
                $("#holdingYield").addClass("green");
            }
            var tProfit = holdGroupInfo.totalProfit.replace(/,/g, '');
            if(Number(tProfit) < 0) {
                $("#totalProfit").removeClass("red");
                $("#totalProfit").addClass("green");
            }
            var income = holdGroupInfo.income.replace(/,/g, '');
            if(Number(income) < 0) {
                $("#income").removeClass("red");
                $("#income").addClass("green");
            }
            var holdingCost = holdGroupInfo.holdingCost.replace(',', '');
            if(Number(holdingCost) < 0) {
                $("#holdingCost").removeClass("red");
                $("#holdingCost").addClass("green");
            }
            var holdingProfit = holdGroupInfo.holdingProfit.replace(/,/g, '');
            if(Number(holdingProfit) < 0) {
                $("#holdingProfit").removeClass("red");
                $("#holdingProfit").addClass("green");
            }

            var bool = false;
            var fundGDetails = holdGroupInfo.fundGroupDetails;
            if(fundGDetails != null && fundGDetails != undefined){
                for(var i=0; i<fundGDetails.length; i++){
                    var fundGInfo = fundGDetails[i];

                    var listHtml = "<tr onclick='forwardFundDetailPage(\"" + fundGInfo.fundId + "\")' " + ((i >= 3) ? " style='display: none' class='open' " : "") + "  >"
                        +"<td><a>"+ fundGInfo.fundName +"</a>&nbsp;"+ fundGInfo.fundId
                        +"<br> <span class='font-arial'></span><em>"+ fundGInfo.fundGroupTpNm +"</em> "
                        + (fundGInfo.fundStatus == "0" ? "" : "<i class='deal'>"+ fundGInfo.fundStatusName +"</i>")
                        + (fundGInfo.fundTradeStName == "" ? "" : "<i class='deal'>" + fundGInfo.fundTradeStName + "</i>")
                        +"</td>"
                        +"<td class='font-arial'>"+ fundGInfo.percent +"<span class='sign'>%</span></td>"
                        +"<td class='font-arial'>"+ fundGInfo.marketvalue +"<br/>(" + fundGInfo.holdBalance + ")</td>"
                        +"</tr>";
                    $("#fundGroupList").append(listHtml);
                    if(fundGInfo.fundTradeStName == "处理中" || Number(fundGInfo.dividendCount) > 0) bool = true;
                }
                if(fundGDetails.length > 3){
                    var moreHtml = "<tr class='more'>" +
                        "<td colspan='3' style='text-align:center; padding-top:0.1rem;padding-bottom: 0.1rem;height: 1.5rem;'>" +
                        "<a href='javascript:void(0)' style='color:#009bff; font-size:0.7rem;opacity: 0.7'>查看更多↓</a>" +
                        "</td>" +
                        "</tr>";
                    $("#fundGroupList").append(moreHtml);
                    $(".more").click(function () {
                        if (onoff) {
                            $(".open").show();
                            $(".more a").html("收起↑");
                            onoff = false;
                        } else {
                            $(".open").hide();
                            $(".more a").html("查看更多↓");
                            onoff = true;

                        }
                    });
                }
                if(fundGDetails.length == 0) bool = true;
            }
            var irrelevance = holdGroupInfo.irrelevance;
            var irrelevanceThreshold = holdGroupInfo.irrelevanceThreshold;
            if(Number(irrelevance) - Number(irrelevanceThreshold) < 0){
                $("#isIrrelevance").html("");
            }else{
                $("#isIrrelevance").html("组合已偏离");
            }
            if(bool){
                $("#custIrrelevance").html("--");
            }else{
                $("#custIrrelevance").html(irrelevance + "%");
            }
            fundGroupCreateDate = data.body.creataDate;
            if(data.body.unConfirmedCount > 0){
                $("#trade_count").html(data.body.unConfirmedCount);
            }else{
                $("#trade_count_a").hide();
            }
            var custBar = data.body.custBar;
            var normalBar = data.body.normalBar;
            if(custBar != null && custBar != undefined && normalBar != null && normalBar != undefined){
                if(bool){
                    $("#isIrrelevance").html("");
                    $("#custIrrelevance").html("--");
                    $(".noData2").show();
                    $(".noData2").children("p").html("组合基金全部确认后将显示大类资产对比图");
                    $(".noData2").children("p").addClass("red");
                }else{
                    var title = ['权益类','固收类','现金类','其他类'];
                    var newTitle = new Array();
                    var newCustB = new Array();
                    var newNormalB = new Array();
                    var index = 0;
                    for(var i=0; i<custBar.length; i++){
                        if(custBar[i] == 0 && normalBar[i] == 0) continue;
                        newTitle[index] = title[i];
                        newCustB[index] = custBar[i];
                        newNormalB[index] = normalBar[i];
                        index++;
                    }
                    option_2.series[0].data = newCustB;//;  //现有组合
                    option_2.series[1].data = newNormalB;//;  //标准组合
                    option_2.xAxis[0].data = newTitle;
                    myChart_2.setOption(option_2);
                }
            }
        }
    });
}

function queryCharts(queryTp){
    var url = App.projectNm + "/adviser/query_fund_group_yields?groupId="+ App.getUrlParam("groupId") +"&queryTp="+ queryTp +"&chartTp=1,3,4&createDt="+ fundGroupCreateDate;
    App.get(url, null, function(data){
        if(data.body != undefined && data.body != null){

            //var incomes1 = [{"chartDt":"20170103","chartNum":"0.0518"},{"chartDt":"20170104","chartNum":"0.1114"},{"chartDt":"20170105","chartNum":"0.1545"},{"chartDt":"20170106","chartNum":"0.0669"},{"chartDt":"20170109","chartNum":"0.0476"},{"chartDt":"20170110","chartNum":"0.1499"},{"chartDt":"20170111","chartNum":"0.1623"},{"chartDt":"20170112","chartNum":"0.0126"},{"chartDt":"20170113","chartNum":"0.1620"},{"chartDt":"20170116","chartNum":"0.1213"},{"chartDt":"20170117","chartNum":"0.1540"},{"chartDt":"20170118","chartNum":"0.0953"},{"chartDt":"20170119","chartNum":"0.1449"},{"chartDt":"20170120","chartNum":"0.0403"},{"chartDt":"20170123","chartNum":"0.1466"},{"chartDt":"20170124","chartNum":"0.1376"},{"chartDt":"20170125","chartNum":"0.1444"},{"chartDt":"20170126","chartNum":"0.0498"},{"chartDt":"20170203","chartNum":"0.0998"},{"chartDt":"20170206","chartNum":"0.1896"},{"chartDt":"20170207","chartNum":"0.1792"},{"chartDt":"20170208","chartNum":"0.0748"},{"chartDt":"20170209","chartNum":"0.0206"},{"chartDt":"20170210","chartNum":"0.0941"},{"chartDt":"20170213","chartNum":"0.1183"},{"chartDt":"20170214","chartNum":"0.0594"},{"chartDt":"20170215","chartNum":"0.0637"},{"chartDt":"20170216","chartNum":"0.1232"},{"chartDt":"20170217","chartNum":"0.1574"},{"chartDt":"20170220","chartNum":"0.2372"},{"chartDt":"20170221","chartNum":"0.2305"},{"chartDt":"20170222","chartNum":"0.1472"},{"chartDt":"20170223","chartNum":"0.0812"},{"chartDt":"20170224","chartNum":"0.1406"},{"chartDt":"20170227","chartNum":"0.1905"},{"chartDt":"20170228","chartNum":"0.0497"},{"chartDt":"20170301","chartNum":"0.2266"},{"chartDt":"20170302","chartNum":"0.0667"},{"chartDt":"20170303","chartNum":"0.0757"},{"chartDt":"20170306","chartNum":"0.2225"},{"chartDt":"20170307","chartNum":"0.1885"},{"chartDt":"20170308","chartNum":"0.1488"},{"chartDt":"20170309","chartNum":"0.1065"},{"chartDt":"20170310","chartNum":"0.0376"},{"chartDt":"20170313","chartNum":"0.1828"},{"chartDt":"20170314","chartNum":"0.2341"},{"chartDt":"20170315","chartNum":"0.2110"},{"chartDt":"20170316","chartNum":"0.1444"},{"chartDt":"20170317","chartNum":"0.2116"},{"chartDt":"20170320","chartNum":"0.1534"},{"chartDt":"20170321","chartNum":"0.1735"},{"chartDt":"20170322","chartNum":"0.2192"},{"chartDt":"20170323","chartNum":"0.1409"},{"chartDt":"20170324","chartNum":"0.1033"},{"chartDt":"20170327","chartNum":"0.1646"},{"chartDt":"20170328","chartNum":"0.0731"},{"chartDt":"20170329","chartNum":"0.1844"},{"chartDt":"20170330","chartNum":"0.0530"},{"chartDt":"20170331","chartNum":"0.1964"},{"chartDt":"20170405","chartNum":"0.1484"}]
            //var incomes2 = [{"chartDt": "20170103", "chartNum": "0.0000"}, {"chartDt": "20170104", "chartNum": "0.0078"}, {"chartDt": "20170105", "chartNum": "0.0076"}, {"chartDt": "20170106", "chartNum": "0.0016"}, {"chartDt": "20170109", "chartNum": "0.0065"}, {"chartDt": "20170110", "chartNum": "0.0048"}, {"chartDt": "20170111", "chartNum": "-0.0023"}, {"chartDt": "20170112", "chartNum": "-0.0074"}, {"chartDt": "20170113", "chartNum": "-0.0067"}, {"chartDt": "20170116", "chartNum": "-0.0068"}, {"chartDt": "20170117", "chartNum": "-0.0047"}, {"chartDt": "20170118", "chartNum": "-0.0009"}, {"chartDt": "20170119", "chartNum": "-0.0039"}, {"chartDt": "20170120", "chartNum": "0.0038"}, {"chartDt": "20170123", "chartNum": "0.0065"}, {"chartDt": "20170124", "chartNum": "0.0066"}, {"chartDt": "20170125", "chartNum": "0.0101"}, {"chartDt": "20170126", "chartNum": "0.0137"}, {"chartDt": "20170203", "chartNum": "0.0067"}, {"chartDt": "20170206", "chartNum": "0.0093"}, {"chartDt": "20170207", "chartNum": "0.0070"}, {"chartDt": "20170208", "chartNum": "0.0123"}, {"chartDt": "20170209", "chartNum": "0.0162"}, {"chartDt": "20170210", "chartNum": "0.0213"}, {"chartDt": "20170213", "chartNum": "0.0281"}, {"chartDt": "20170214", "chartNum": "0.0280"}, {"chartDt": "20170215", "chartNum": "0.0238"}, {"chartDt": "20170216", "chartNum": "0.0295"}, {"chartDt": "20170217", "chartNum": "0.0237"}, {"chartDt": "20170220", "chartNum": "0.0386"}, {"chartDt": "20170221", "chartNum": "0.0421"}, {"chartDt": "20170222", "chartNum": "0.0441"}, {"chartDt": "20170223", "chartNum": "0.0392"}, {"chartDt": "20170224", "chartNum": "0.0394"}, {"chartDt": "20170227", "chartNum": "0.0311"}, {"chartDt": "20170228", "chartNum": "0.0331"}, {"chartDt": "20170301", "chartNum": "0.0348"}, {"chartDt": "20170302", "chartNum": "0.0278"}, {"chartDt": "20170303", "chartNum": "0.0256"}, {"chartDt": "20170306", "chartNum": "0.0312"}, {"chartDt": "20170307", "chartNum": "0.0334"}, {"chartDt": "20170308", "chartNum": "0.0319"}, {"chartDt": "20170309", "chartNum": "0.0253"}, {"chartDt": "20170310", "chartNum": "0.0256"}, {"chartDt": "20170313", "chartNum": "0.0347"}, {"chartDt": "20170314", "chartNum": "0.0342"}, {"chartDt": "20170315", "chartNum": "0.0363"}, {"chartDt": "20170316", "chartNum": "0.0417"}, {"chartDt": "20170317", "chartNum": "0.0310"}, {"chartDt": "20170320", "chartNum": "0.0321"}, {"chartDt": "20170321", "chartNum": "0.0371"}, {"chartDt": "20170322", "chartNum": "0.0323"}, {"chartDt": "20170323", "chartNum": "0.0358"}, {"chartDt": "20170324", "chartNum": "0.0441"}, {"chartDt": "20170327", "chartNum": "0.0406"}, {"chartDt": "20170328", "chartNum": "0.0382"}, {"chartDt": "20170329", "chartNum": "0.0368"}, {"chartDt": "20170330", "chartNum": "0.0283"}, {"chartDt": "20170331", "chartNum": "0.0341"}, {"chartDt": "20170405", "chartNum": "0.0484"}];
            //var incomes3 = [{"chartDt":"20170103","chartNum":"0.0165"},{"chartDt":"20170104","chartNum":"0.0522"},{"chartDt":"20170105","chartNum":"0.0317"},{"chartDt":"20170106","chartNum":"0.0898"},{"chartDt":"20170109","chartNum":"0.0104"},{"chartDt":"20170110","chartNum":"0.0145"},{"chartDt":"20170111","chartNum":"0.0791"},{"chartDt":"20170112","chartNum":"0.0640"},{"chartDt":"20170113","chartNum":"0.0437"},{"chartDt":"20170116","chartNum":"0.0754"},{"chartDt":"20170117","chartNum":"0.0877"},{"chartDt":"20170118","chartNum":"0.0214"},{"chartDt":"20170119","chartNum":"0.0752"},{"chartDt":"20170120","chartNum":"0.0463"},{"chartDt":"20170123","chartNum":"0.0428"},{"chartDt":"20170124","chartNum":"0.0091"},{"chartDt":"20170125","chartNum":"0.0654"},{"chartDt":"20170126","chartNum":"0.0536"},{"chartDt":"20170203","chartNum":"0.0933"},{"chartDt":"20170206","chartNum":"0.0259"},{"chartDt":"20170207","chartNum":"0.0156"},{"chartDt":"20170208","chartNum":"0.0354"},{"chartDt":"20170209","chartNum":"0.0421"},{"chartDt":"20170210","chartNum":"0.0379"},{"chartDt":"20170213","chartNum":"0.0404"},{"chartDt":"20170214","chartNum":"0.0412"},{"chartDt":"20170215","chartNum":"0.0320"},{"chartDt":"20170216","chartNum":"0.0693"},{"chartDt":"20170217","chartNum":"0.1003"},{"chartDt":"20170220","chartNum":"0.0927"},{"chartDt":"20170221","chartNum":"0.1269"},{"chartDt":"20170222","chartNum":"0.0947"},{"chartDt":"20170223","chartNum":"0.0882"},{"chartDt":"20170224","chartNum":"0.0542"},{"chartDt":"20170227","chartNum":"0.0674"},{"chartDt":"20170228","chartNum":"0.1038"},{"chartDt":"20170301","chartNum":"0.1236"},{"chartDt":"20170302","chartNum":"0.1140"},{"chartDt":"20170303","chartNum":"0.0598"},{"chartDt":"20170306","chartNum":"0.0373"},{"chartDt":"20170307","chartNum":"0.1048"},{"chartDt":"20170308","chartNum":"0.1033"},{"chartDt":"20170309","chartNum":"0.0405"},{"chartDt":"20170310","chartNum":"0.0801"},{"chartDt":"20170313","chartNum":"0.0705"},{"chartDt":"20170314","chartNum":"0.0767"},{"chartDt":"20170315","chartNum":"0.1059"},{"chartDt":"20170316","chartNum":"0.0961"},{"chartDt":"20170317","chartNum":"0.0364"},{"chartDt":"20170320","chartNum":"0.1219"},{"chartDt":"20170321","chartNum":"0.0828"},{"chartDt":"20170322","chartNum":"0.1002"},{"chartDt":"20170323","chartNum":"0.0439"},{"chartDt":"20170324","chartNum":"0.1099"},{"chartDt":"20170327","chartNum":"0.1161"},{"chartDt":"20170328","chartNum":"0.0711"},{"chartDt":"20170329","chartNum":"0.0775"},{"chartDt":"20170330","chartNum":"0.1179"},{"chartDt":"20170331","chartNum":"0.0716"},{"chartDt":"20170405","chartNum":"0.0682"}]

            // 我的组合
            var incomes1 = data.body.holdIncomeList;
            // 标准组合
            var incomes2 = data.body.syList;
            // 沪深300
            var incomes3 = data.body.hs300List;

            incomes2.length = incomes1.length;
            incomes3.length = incomes1.length;

            if(incomes1.length > 0){
                $("#profitChart").show();
                myChart_1 = echarts.init(document.getElementById('pie1'));
                setOption(option_1, incomes1, incomes2,incomes3);
                draw(myChart_1,option_1);
                //setTimeout(function(){
                var seriesIndex = 0;
                var num = 1;
                if(incomes1.length > 0){
                    seriesIndex = 0;
                    num = incomes1.length - 1;
                }else if(incomes2.length > 0){
                    seriesIndex = 1;
                    num = incomes2.length - 1;
                }else if(incomes3.length > 0){
                    seriesIndex = 2;
                    num = incomes3.length - 1;
                }
                myChart_1.dispatchAction({ type: 'showTip', seriesIndex: seriesIndex, dataIndex:num });
                myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:-1 });
                /* } else{
                    alert(data.returnMsg); */
            } else {
                $("#profitChart").hide();
            }
        }
    });
};

function forwardFundDetailPage(fundId) {
    /*if(fundId == "000330"){
        window.location.href = "htffundxjb://action?type=as&subType=xjb";
    }else{
        window.location.href = "htffundxjb://action?type=fd&fundId=" + fundId;
    }*/
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