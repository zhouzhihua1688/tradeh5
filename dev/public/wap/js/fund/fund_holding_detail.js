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
    $(".query-product-trade-record").click(function () {
        var item = App.getSession(App.selectedFund);
        var fundId = item.fund.fundId;
        window.location.href = "../trade/tradeList.html?productId="+fundId;
    });
});

function queryYieldTrendInfo(type, btn_index) {
    var selectedTimePeriod = "m1";
    if(btn_index == 0){
        selectedTimePeriod = "m1";
    } else if(btn_index == 1){
        selectedTimePeriod = "m3";
    } else if(btn_index == 2){
        selectedTimePeriod = "m6";
    } else if(btn_index == 3){
        selectedTimePeriod = "m12";
    }else {
        selectedTimePeriod = "thisyear";
    }
    var item = App.getSession(App.selectedFund);
    if(item != undefined && item != null) {
        var fundId = item.fund.fundId;
        var branchNo = item.branchCode;
        var tradeAcco = item.tradeAcco;
        var url = App.projectNm + "/fund/query_yield_trend_info?branchNo="+ branchNo +"&r=" + (Math.random()*10000).toFixed(0) + "&periodType=" + selectedTimePeriod;
        if(App.isNotEmpty(fundId)){
            url += "&fundId=" + fundId;
        }
        if(App.isNotEmpty(tradeAcco)){
            url += "&tradeAcco=" + tradeAcco;
        }

        App.get(url,null,function(result){
            var incomes = [];
            if (result.body != undefined && result.body != null){
                console.log(result);
                var yields = result.body.yields;
                if(yields != null && yields != undefined){
                    var data = yields.data;
                    if (data != null){
                        data.forEach(function(value){
                            if(value != null && value != undefined) {
                                var yield = {};
                                yield.chartDt = value[0];
                                //type=1：收益率、0：盈亏
                                if (type == "1"){
                                    yield.chartNum = value[1];
                                } else {
                                    yield.chartNum = value[2];
                                }
                                incomes.push(yield);
                            }
                        });
                    }
                }
                //type=1：收益率、0：盈亏
                if(incomes.length > 0){
                    if (type == "1"){
                        myChart_2 = echarts.init(document.getElementById('pie2'));
                        setOption(option_2, incomes);
                        draw(myChart_2,option_2);
                    } else {
                        myChart_1 = echarts.init(document.getElementById('pie1'));
                        setOption(option_1, incomes);
                        draw(myChart_1,option_1);
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
        setVal("#yesterdayProfit", item.yesterdayProfit == 0 ? "0.00" : App.formatMoney(item.yesterdayProfit));
        setVal("#balanceProfit", item.balanceProfit == 0 ? "0.00" : App.formatMoney(item.balanceProfit));
        setVal("#balanceYield", item.balanceYield == 0 ? "0.00" : App.formatMoney(item.balanceYield), "%");
        setVal("#cost", item.cost == 0 ? "0.00" : App.formatMoney(item.cost));
        setVal("#totalProfit", item.totalProfit == 0 ? "0.00" : App.formatMoney(item.totalProfit));
        setVal("#balance", item.balance == 0 ? "0.00" : App.formatMoney(item.balance));
        setVal("#avaliable", item.avaliable == 0 ? "0.00" : App.formatMoney(item.avaliable));
        setVal("#unAvailableQuty", App.isEmpty(item.unAvailableQuty) ? "0.00": App.formatMoney(item.unAvailableQuty));
        $("#nav").html(App.formatMoney(item.fund.navStr, 3));
        App.transferColor("#nav", "color_green", "color_red");
        if(item.fund.navDt.length == 8){
            $("#navDt").html(item.fund.navDt.substring(4, 6) + "-" + item.fund.navDt.substring(6, 8));
        }
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

function getFundFee() {
    var item = App.getSession(App.selectedFund);
    var fundId = item.fund.fundId;
    var url = "/mobile-bff/v1/fund/getFundInfoPage?productId="+fundId;

    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
			if(result.body.rateTip != ""){	
				$("#view_feeRate").html(result.body.rateTip.replace(/，/g," "));
			}
        }
    });
}

function queryFundDetail() {
    var item = App.getSession(App.selectedFund);
    var fundId = item.fund.fundId;
    // var url = App.projectNm + "/fund/fund_detail_info?r=" + (Math.random()*10000).toFixed(0);
    // if(App.isNotEmpty(fundId)){
    //     url += "&fundId=" + fundId;
    // }
    var url =  "/mobile-bff/v1/fund/detailInfo";
    var data = JSON.stringify({
        "fundId": fundId
    });
    App.post(url,data,function(result){
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
			//赎回按钮显示控制 sunchanghong
			if(fundInfo.canRedeem == '0'){
				$(".redeem").parent("li").css('background', '#c6c6c6');
				$(".redeem").parent("li").css('border-right', 'none');
				$(".redeem").css('color','#fff');
				$(".redeem").unbind("click");
			}else{
				$(".redeem").attr("href", "../fund/redeem.html?fundId=" + App.getUrlParam("fundId"));
			}

            if(fundInfo.canPurchase == '0'){
                $(".buy").parent("li").css('background', '#c6c6c6');
                $(".buy").unbind("click");
                $(".investment").parent("li").css('background', '#c6c6c6');
                $(".investment").unbind("click");
            } else if(fundInfo.canMip == '0'){
                $(".investment").parent("li").css('background', '#c6c6c6');
                $(".investment").unbind("click");
            } else {
                // $("#view_feeRate").html(txt + '<br/>' + fundInfo.fundStShowDateDesc);
                getFundFee();
                $("#view_feeRate").show();
                $(".investment").attr("href", "../fund/fund_mip.html?fundId=" + App.getUrlParam("fundId"));
                $(".buy").attr("href", "../fund/payment.html?fundId=" + App.getUrlParam("fundId"));
            }/*
            if(fundInfo.isTaxExtendPension == '1' || fundInfo.isTaxExtendPension == '2'){
                $(".investment-li").hide();
                $(".buy-li").hide();
                $(".redeem-li").hide();
                // $(".investment").html("自动购买");
                // $(".investment").attr("href", '../taxExtension/autodepositIndex.html?fundId=' + App.getUrlParam("fundId"));
                // $(".buy").html("立即购买");
                // $(".buy").attr("href", '../taxExtension/immediateDeposite.html?fundId=' + App.getUrlParam("fundId"));
            } else {
                $(".investment").attr("href", "../fund/fund_mip.html?fundId=" + App.getUrlParam("fundId"));
                $(".buy").attr("href", "../fund/payment.html?fundId=" + App.getUrlParam("fundId"));
            }*/
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
            return ' <div style="width: 100%;margin-left: -50%;font-size: 14px;">累计盈亏：'+'<span style="color:#f4333c">'+itmedata+'<span>'+'</div>'
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
            var itmedata=Number(itme[0].data*100).toFixed(2)+'%';//收益率
            return '<div style="width: 100%;margin-left: -50%;font-size: 14px;">'+ itmeday +'收益率：'+'<span style="color:#f4333c">'+itmedata+'<span>'+'</div>'

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