var queryTp = 0;
var queryDt = "03";//01:一月、02：三月、03：六月、04：今年以来、05：一年、08：成产以来
var queryDt_old = "2";
var groupId = "";
var establishDateStr = "";
$(function () {
    groupId = App.getUrlParam("groupId");
    $(".fund_group_detail_list").click(function () {
        window.location.href = "./group_fund_details_list.html?groupId=" + groupId;
    });
    $(".fund_group_detail_list a").attr("href", "./group_fund_details_list.html?groupId=" + groupId);
    requestGroupFundDetail(groupId);
    // queryYieldLatest(groupId);
    getTransferTimes(groupId);
    getFundGroupInfo(groupId);
	queryRecommendInfo();
    // query90Charts(groupId, queryDt);
    $(".btn_mip a").attr("href", "create_mip.html?groupId=" + groupId);
    $(".buy_btn_li a").attr("href", "payment.html?groupId=" + groupId);
});

/*$('.switch_b li').click(function(){
    $(this).addClass('active').siblings('li').removeClass('active');
    queryTp = $(this).index();
    if(queryTp == 0){
        query90Charts(groupId, queryDt);
    } else {
        getChartData(groupId, queryDt_old, establishDateStr);
    }
});*/
$('.switchtab li').click(function(){
    $(this).addClass('active').siblings('li').removeClass('active');
    if($(this).index() == 0){//01:一月
        queryDt = "01";
        queryDt_old = "1";
    } else if ($(this).index() == 1){//02：三月
        queryDt = "02";
        queryDt_old = "9";
    } else if ($(this).index() == 2){//03：六月
        queryDt = "03";
        queryDt_old = "2";
    } else if ($(this).index() == 3){//05：一年
        queryDt = "05";
        queryDt_old = "3";
    } else if ($(this).index() == 4){//08：成产以来
        queryDt = "08";
        queryDt_old = "4";
    }
    // if(queryTp == 0){
    //     query90Charts(groupId, queryDt);
    // } else {
        getChartData(groupId, queryDt_old, establishDateStr);
    // }
});
$('.text_word .btn').click(function(){
    if ($(this).text()=='展开更多'){
        $(this).text('收起');
    }else{
        $(this).text('展开更多');
    }
    $(this).siblings('h6').toggleClass('all');
})
$('.togglebtn').click(function(){
    if ($(this).text()=="展开更多") {
        $(this).text('收起');
        $('.ques').show();
    }else{
        $(this).text('展开更多');
        $('.ques').hide();
        $('.ques').eq(0).show();
    }
})
$('.target .t-tips').click(function(){
    $('.more-pop1').show();
})
$('.target .t-tips1').click(function(){
    $('.more-pop2').show();
})
$('.target .t-tips2').click(function(){
    $('.more-pop3').show();
})
$('.iKnow').click(function(){
    $('.more-pop').hide();
})

var option_1 = {
    color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
        },
        position:["20%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
        formatter: function(params){
            var arr = [];
            arr.push('<div style="width: 100%;font-size: 14px;">')
            for(var i=0; i< params.length; i++){
                //console.log(params[i].seriesName);
                switch (params[i].seriesName){
                    case "本组合":
                        arr.push('<span class="icon icon-1"></span>'); break;
                    case "现金宝":
                        arr.push('&nbsp; <span class="icon icon-4"></span>'); break;
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
                    return value + "          ";
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
            symbol: "none", name:'本组合', type:'line', smooth: true,
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
            name:'现金宝',
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

var option_2 = {
    color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
        },
        position:["10%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
        formatter: function(params){
            var arr = [];
            arr.push('<div style="width: 100%;font-size: 14px;">')
            for(var i=0; i< params.length; i++){
                //console.log(params[i].seriesName);
                switch (params[i].seriesName){
                    case "本组合":
                        arr.push('<span class="icon icon-1"></span>'); break;
                    case "中证货币指数":
                        arr.push('&nbsp; <span class="icon icon-4"></span>'); break;
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
                    if(index ==0){ return "  " + value; }
                    return value + "          ";
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
            symbol: "none", name:'本组合', type:'line', smooth: true,
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
            name:'中证货币指数',
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

function setOption(option, incomes1, incomes2){
    var result1 =  formattingIncomes(incomes1);
    var result2 =  formattingIncomes(incomes2);
    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].axisLabel.interval = result1.xArr.length-2;
    option.series[0].data = result1.yArr;
    option.series[1].data = result2.yArr;

}
function setOption_new(option, incomes1){
    var result1 =  formattingIncomes(incomes1, "fundGroup");
    var result2 =  formattingIncomes(incomes1, "fund");
    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].axisLabel.interval = result1.xArr.length-2;
    option.series[0].data = result1.yArr;
    option.series[1].data = result2.yArr;

}
function draw(myChart, option){
    if( !((option.series[0].data && option.series[0].data.length>0) ||  (option.series[1].data && option.series[1].data.length>0))){
        option.xAxis[0].data = ["",""];
        option.xAxis[0].axisLabel.interval = ["",""].length-2;
        $(".noData").show();
    }else{
        $(".noData").hide();
    }
    myChart.setOption(option);
    /* setTimeout(function(){
        myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: 10 });
    },0); */
}

function formattingIncomes(incomes, type){
    var xArr = [], yArr = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        if(type == undefined || type == null || type == ''){
            var chartDt = incomes[i].chartDt;
            xArr.push(chartDt.substr(0,4) + "-" + chartDt.substr(-4,2) + "-" + chartDt.substr(-2,2));
        } else {
            xArr.push(incomes[i].navDate);
        }
        if(type == "fundGroup"){
            yArr.push(incomes[i].groupDailyGrowthRate);
        } else if (type == "fund"){
            yArr.push(incomes[i].fundDailyGrowthRate);
        } else if (type == "yield"){
            yArr.push(incomes[i].sumOfYield);
        } else {
            yArr.push(incomes[i].chartNum);
        }
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
    App.get("/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId, null, function(resultStr){
        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
        if(result.body != undefined && result.body != null){
            var detailInfo = result.body;
            if(detailInfo != undefined && detailInfo != ""){
                var dayYield = 0;
                if(App.isNotEmpty(detailInfo.dayYield)){
                    dayYield = (Number(detailInfo.dayYieldWap) * 100).toFixed(4);
                }
                $(".group_daily_growth_rate").html(App.formatMoney(detailInfo.nearYearProfit, 3) + "%");
                $(".day_yield").html(dayYield);
                $(".draw_down").html(Number(detailInfo.drawdown).toFixed(4) + "%");
                $(".fund_group_advise").html(detailInfo.fundgroupDesc);
                $("title").html(detailInfo.groupname);
                establishDateStr = detailInfo.establishDateStr;
                var diffDays = dateDiff(establishDateStr);
                var showEstablishDateStr = establishDateStr.substr(0,4)+'年'+establishDateStr.substr(5,2)+'月'+establishDateStr.substr(-2,2)+'日';
                $(".establish_date_str").html(showEstablishDateStr);
                $(".diff_days").html(diffDays);
                createtimeStr = detailInfo.createtimeStr;

                getChartData(groupId, queryDt_old, establishDateStr);
            }
        }
    });
}

function dateDiff(sDate) {
    var firstDate = new Date(sDate);
    var secondDate = new Date();
    var diff = Math.abs(firstDate.getTime() - secondDate.getTime());
    var result = parseInt(diff / (1000 * 60 * 60 * 24));
    if(result != undefined && result != null && result != '' && !isNaN(result)){
        return result;
    } else {
        return 0;
    }
}

// function queryYieldLatest(groupId){
//     App.get("/productcenter/v1/new/compose/fundgroups/single/yield/latest?groupId=" + groupId, null, function(result){
//         if(result.body != undefined && result.body != null){
//             var body = result.body;
//             if(body != undefined && body != null && body != ""){
//                 $(".group_daily_growth_rate").html(body.groupDailyGrowthRate + "%");
//             }
//         }
//     });
// }

function getTransferTimes(groupId){
    App.get(App.projectNm + "/adviser/query_fund_group_change_date?groupId=" + groupId, null, function(result){
        if(result.body != undefined && result.body != null){
            var dateList = result.body.dateList;
            if(dateList != undefined && dateList != null){
                lastChangeDateStr = dateList[0];
                var dataSize = dateList.length;
                $(".transferTimes").html(dataSize);
                // if(dataSize <= 0){
                //     $(".transferCount_a").attr("href", "javascript:void();");
                // }else{
                //     transferNum = dataSize;
                //     $(".transferCount_a").attr("href", "htffundxjb://action?type=fg&subType=fgtd&groupId="+ App.getUrlParam("groupId") + "&date=" + lastChangeDateStr);
                // }

            }
        }
    });
}

function getChartData(groupId, queryTp, createDt){
    var url = "/mobile-bff/v1/fund-group/fundgroup-yields?groupId=" + groupId + "&chartTp=0,4&queryTp=" + queryTp + "&createDt=" + createDt + "&t=" + new Date().getTime();
    App.get(url, null, function(resultStr){
        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
        if(result.body != undefined && result.body != null){

            var chartDatas = result.body;
            var syList = chartDatas.syList;
            var mixList = chartDatas.mixList;
            myChart_1 = echarts.init(document.getElementById('pie1'));
            setOption(option_2, syList, mixList);
            draw(myChart_1,option_2);
            var seriesIndex = 0;
            var num = 1;
            if(syList.length > 0){
                seriesIndex = 0;
                num = syList.length - 1;
            }
            myChart_1.dispatchAction({ type: 'showTip', seriesIndex: seriesIndex, dataIndex:num });
            myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:-1 });
        }
    });
}

function getFundGroupInfo(groupId){
    var url = "/productcenter/v1/old/info/fundgroup/probatility/growth/collections?groupId=" + groupId + "&t=" + new Date().getTime();
    App.get(url, null, function(result){
        if(result.body != undefined && result.body != null){
            var list = result.body;
            if(list != undefined && list != null){
                list.forEach(function (item) {
                    if(item.probabilityType == "1D"){
                        $("#oneDay").html(item.probabilityValuePercentage + "%");
                    } else if(item.probabilityType == "7D"){
                        $("#sevenDay").html(item.probabilityValuePercentage + "%");
                    } else if(item.probabilityType == "1M"){
                        $("#oneMonth").html(item.probabilityValuePercentage + "%");
                    }
                });
            }
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