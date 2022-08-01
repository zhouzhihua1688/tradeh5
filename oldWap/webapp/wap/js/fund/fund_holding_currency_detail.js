$(function () {
    queryYieldTrendInfo($(".tab1 li.active").index(), $(".tab2 li.active").index());
    renderingPage();
    $(".tab1 li").click(function(event){
        if($(this).hasClass("active")) { return;}
        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');
        $(".diagram>div").hide().eq($(this).index()).show();
        queryYieldTrendInfo($(this).index(), $(".tab2 li.active").index());
    });
    $(".tab2 li").click(function(){
        if($(this).hasClass("active")) { return;}
        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');

        queryYieldTrendInfo($(".tab1 li.active").index(), $(this).index());
    });
    $(".investment").attr("href", "../fund/fund_mip.html?fundId=" + App.getUrlParam("fundId"));
    $(".buy").attr("href", "../fund/payment.html?fundId=" + App.getUrlParam("fundId"));
});

function queryYieldTrendInfo(type, btn_index) {
    var selectedTimePeriod = "30";
    if(btn_index == 0){
        selectedTimePeriod = "30";
    } else if(btn_index == 1){
        selectedTimePeriod = "90";
    } else if(btn_index == 2){
        selectedTimePeriod = "180";
    } else if(btn_index == 3){
        selectedTimePeriod = "365";
    }else {
        selectedTimePeriod = "NY";
    }
    var item = App.getSession(App.selectedFund);
    if(item != undefined && item != null) {
        var fundId = item.fund.fundId;
        var url = App.projectNm + "/fund/query_fund_yields_renew?fundId="+ fundId +"&count=" + selectedTimePeriod;
        if(App.isNotEmpty(fundId)){
            url += "&fundId=" + fundId;
        }
        App.get(url,null,function(result){
            var incomes = [];
            if (result.body != undefined && result.body != null){
                // console.log(result);
                var yields = result.body.fundYieldList;
                if(yields != null && yields != undefined){
                    yields.forEach(function(value){
                        if(value != null && value != undefined) {
                            var yield = {};
                            yield.chartDt = value.navDate;
                            //type=1：七日年化、0：万份收益
                            if (type == "1"){
                                yield.chartNum = value.yield;
                            } else {
                                yield.chartNum = value.incomeunit;
                            }
                            incomes.push(yield);
                        }
                    });
                }
                //type=1：七日年化、0：万份收益
                if(incomes.length > 0){
                    if (type == "1"){
                        myChart_2 = echarts.init(document.getElementById('pie2'));
                        setOption(option_2, incomes);
                        draw(myChart_2,option_2);
                        myChart_2.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: incomes.length - 1 });
                    } else {
                        myChart_1 = echarts.init(document.getElementById('pie1'));
                        setOption(option_1, incomes);
                        draw(myChart_1,option_1);
                        myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: incomes.length - 1 });
                    }
                }
            }
        });
    }
}

function renderingPage() {
    var item = App.getSession(App.selectedFund);
    if(item != undefined && item != null) {

        queryFundDetail();

        $("title").html(item.fund.fundNm);
        setVal("#unionBalance", item.unionBalance == 0 ? "0.00" : App.formatMoney(item.unionBalance));
        setVal("#yesterdayProfit", App.isEmpty(item.yesterdayProfitStr) ? "0.00" : item.yesterdayProfitStr);
        setVal("#totalProfit", App.isEmpty(item.totalProfitStr)? "0.00" : item.totalProfitStr);
        if (item.isDirect == '1' && Number(item.mipFlagNum) > 0){
            $("#isMip").html("有");
        }
        if(item.melonmd == "0"){
            $("#melonmd").html("红利再投");
        } else if(item.melonmd == "-1"){
            $("#melonmd").html("请至代销机构处查询");
        } else {
            $("#melonmd").html("现金分红");
        }
    }
}

function queryFundDetail() {
    var item = App.getSession(App.selectedFund);
    var fundId = item.fund.fundId;
    var url = App.projectNm + "/fund/fund_detail_info?r=" + (Math.random()*10000).toFixed(0);
    if(App.isNotEmpty(fundId)){
        url += "&fundId=" + fundId;
    }

    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var fundInfo = result.body;
            var txt = "";
            if(fundInfo.fundSt == "1"){
                $(".buy").html("认购");
                txt += "认购费率：";
            }else{
                txt += "申购费率：";
            }
            $(".currency-type").html(fundInfo.currencyTypeUnit);
            txt += '<span style="text-decoration: line-through">'
                + Number(fundInfo.stdRate).toFixed(2)+'%</span> &nbsp;<span>'
                + Number(fundInfo.curRate).toFixed(2) + '%</span>&nbsp;&nbsp;&nbsp;';
            switch (fundInfo.fundSt) {
                case "0":
                case "2":
                    txt += "开放申购 开放赎回";
                    break;
                case "1":
                    txt += "开放认购（发行中）";
                    break;
                case "4":
                    txt += "暂停交易";
                    break;
                case "5":
                    txt += "暂停申购 开放赎回";
                    break;
                case "6":
                    txt += "开放申购 暂停赎回";
                    break;
                case "7":
                    txt += "开放认购";
                    break;
                case "8":
                    txt += "暂停交易（募集结束）";
                    break;
                case "9":
                    txt += "暂停交易（基金封闭）";
                    break;
            }

            if(fundInfo.canPurchase == '0' || fundInfo.fundSt == '4' || fundInfo.fundSt == '5'){
                $(".buy").html("暂停交易");
                $(".buy").parent("li").css('background', '#c6c6c6');
                $(".buy").unbind("click");
                $(".investment").parent("li").hide();
                $(".investment").unbind("click");
            } else if(fundInfo.canMip == '0'){
                $(".investment").parent("li").hide();
                $(".investment").unbind("click");
            } else {
                $("#view_feeRate").html(txt + '<br/>' + fundInfo.fundStShowDateDesc);
                $("#view_feeRate").show();
            }
        }
    });
}

function setVal(field, val, unit) {
    $(field).html(App.formatMoney(val) + (unit == undefined || unit == null ? "" : unit));
    if(Number(val) < 0){
        App.transferColor(field, "color_red", "color_green");
    } else {
        App.transferColor(field, "color_green", "color_red");
    }
}

var myChart_1, myChart_2;

var option_1 = {
    color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'line', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: { color: "#1aa2e6"}
        },
        position:["50%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
        //    formatter: ' <div style="width: 100%;margin-left: -50%;font-size: 14px;">{a0}: <span style="color:#f4333c">{c0}%</span></div>'
        formatter: function(itme){
            var itmeday=itme[0].name;
            var itmedata=itme[0].data;
            return ' <div style="width: 100%;margin-left: -50%;font-size: 14px;">'+ itmeday +'万份收益：'+'<span style="color:#f4333c">'+itmedata+'<span>'+'</div>'
        }
    },
    grid: {left: '3%', right: '4%', bottom: '10%', top: "20%", containLabel: true },
    xAxis : [
        {
            type : 'category', boundaryGap : false, axisTick: {show: false},
            splitLine:{
                show: true,
                lineStyle: { color: "#f1f1f1"}
            },
            axisLine:{
                show: true,
                lineStyle:{color:"#A1A1A1"}
            },
            axisLabel: {interval: 30, textStyle: {color: "#999",fontWeight:"bolder",fontFamily:"Arial"}},
            // splitNumber:5,
            // minInterval:1,
            data : [],
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            splitNumber: 4,
            axisLine:{show: true, lineStyle:{color:"#A1A1A1"}},
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: {formatter: function(value){return toDecimal(value);}},
            axisPointer: { label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} }
        }
    ],
    series : [
        {
            symbol: "emptyCircle", name:'本基金', type:'line', smooth: true,
            symbolSize: 6,
            showSymbol: false,
            hoverAnimation: false,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }], false)
                }
            },
            lineStyle: {
                normal: {
                    color: "#fb5c5f",
                    width:1
                }
            },
            data:[]
        }
    ]
};
var option_2 =  {
    color: ['#fb5c5f','#fe7e01', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: { color: "#1aa2e6" }
        },
        position:["50%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)",
        textStyle:{ color: "#333"},
        formatter: function(itme){
            var itmeday=itme[0].name;
            var itmedata=itme[0].data+'%';
            return '<div style="width: 100%;margin-left: -50%;font-size: 14px;">'+itmeday+'  七日年化：'+'<span style="color:#f4333c">'+itmedata+'<span>'+'</div>'

        }
    },
    grid: {left: '3%', right: '4%', bottom: '10%', top: "20%", containLabel: true },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLine:{show: true, lineStyle:{color:"#A1A1A1"}},
            axisLabel: {interval: 30, textStyle: {color: "#999",fontWeight:"bolder",fontFamily:"Arial"}},
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            splitNumber: 4,
            axisLine:{show: true, lineStyle:{color:"#A1A1A1"}},
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: {formatter: function(value){return toDecimal(value);}},
            axisPointer: { label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} }
        }
    ],
    series : [
        {
            symbol: "none", name:'本基金', type:'line', smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }], false)
                }
            },
            lineStyle: {normal: {	color: "#fb5c5f",width:1}},
            data:[]
        }
    ]
};
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
function setOption(option,incomes1, incomes2){
    var result1 =  formattingIncomes(incomes1);

    option.xAxis[0].data = result1.xArr;
    // option.xAxis[0].axisLabel.interval = result1.xArr.length-2;
    option.series[0].data = result1.yArr;

}
function draw(myChart, option){
    if( !((option.series[0].data && option.series[0].data.length>0) ||  (option.series[1].data && option.series[1].data.length>0))){
        option.xAxis[0].data = ["",""];
        // option.xAxis[0].axisLabel.interval = ["",""].length-2;
        $(".noData").show();
    }else{
        $(".noData").hide();
    }
    myChart.setOption(option);
    setTimeout(function(){
        myChart.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:10 });
    },0);
}

function formattingIncomes(incomes){
    var xArr = [], yArr = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var chartDt = incomes[i].chartDt;
        xArr.push("      "+ chartDt + "                ");
        yArr.push(incomes[i].chartNum);
    }
    return {xArr: xArr, yArr: yArr};
}

//问号提示
$(".icon-question1").click(function () {
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html("该基金持仓收益与投入本金的比值")
    $(".Bomb-box1").show();
})
$(".icon-question2").click(function () {
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html("目前持有的基金份额对应的盈亏，不包括现金分红，现金分红计入已实现盈亏")
    $(".Bomb-box1").show();
})
$(".icon-question3").click(function () {
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html("该基金历史以来累积持有份额产生的累积收益，包含已经赎回、转出的份额所产生的收益（包括现金分红）")
    $(".Bomb-box1").show();
})

$(".Bomb-box-ok").click(function () {
    $(this).parent().parent().hide();
})