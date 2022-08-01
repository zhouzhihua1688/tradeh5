$(function () {
    // 占位符
    String.prototype.format = function() {
		if (arguments.length == 0){
            return this;
        }
		for (var s = this, i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
		return s;
    }
    String.prototype.formatArr=function(arr){
        var s=this;
        if(arr&&arr.length>0){
            s = s.replace('[arr]', arr.join('、'));
        }else{
            s=s.replace('[arr]', '');
        }
        return s;
    }
    // 文案映射
    var paperWorkMap={
        investBehaviorFrequentResult:[
            {title:'您交易基金的次数较多',content:'<p>过去一年，您申购权益类基金{0}次，赎回{1}次，赎回次数较多。高频次的交易会导致额外的交易成本，<span>建议您减少赎回操作，相信长期的力量！</span></p>'},
            {title:'您能在买入基金后，不频繁操作',content:'<p>过去一年，您申购权益类基金{0}次，赎回{1}次，避免频繁交易导致收益损失，要保持下去哦！</p>'},
            ''
        ],
        investBehaviorHoldResult:[
            {title:'您持有部分基金产品的时间过短',content:'<p>过去一年，您一共持有过{0}支基金，其中<em>[arr]</em>的持有天数较短，可能会导致您的收益降低。<span>建议您长期持有基金产品。</span></p>'},
            {title:'您不存在持有基金时间过短的现象',content:'<p>过去一年，您一共持有过{0}支基金，未发现持有时间过短的情况。</p>'},
            ''
        ],
        investBehaviorRegularResult:[
            '',
            {title:'您有周期性投资的好习惯',content:'<p>过去一年，您有进行周期性投资，均衡持仓成本，朝着获取长线稳健收益的目标奋进！</p>'},
            {title:'您还没有开始周期性投资',content:'<p>过去一年，您还没有进行周期性投资。<br>数据显示，坚持周期性投资的客户的收益要高于未能进行周期性投资的客户，赶快试试吧~ </p>'}
        ],
        investBehaviorChaseResult:[
            {title:'您有明显追涨杀跌的倾向',content:'<p>过去一年，您一共申购基金{0}次，赎回基金{1}次，发现您在申购时，存在追涨的倾向/赎回时，存在杀跌的倾向。</p>'},
            {title:'您没有明显追涨杀跌的倾向',content:'<p>过去一年，您一共申购基金{0}次，赎回基金{1}次，没有发现有追涨杀跌的倾向，棒棒哒！</p>'},
            ''
        ],
        investBehaviorConcentrationResult:[
            '',
            {title:'您不存在持仓集中度较高的问题',content:'<p>过去一年，您持有的基金不存在行业集中过高的情况，分散投资可以降低市场波动的风险，要继续保持哦~</p>'},
            {title:'您的持仓行业集中度较高',content:'<p>过去一年，您持有的基金投资于{0}行业的比例较高。分散投资可以降低市场波动的风险，建议您配置一些其他行业的产品，降低持仓集中度。加油哦</p>'}
        ]
    }
    getList(paperWorkMap);
})


// getList获取投资分析数据
function getList(paperWorkMap) {
    $.ajax({
        url: '/assetcenter/v1/analyze/invest-behavior/new',
        // data:{
        //     custNo:'1030912339'
        // },
        success: function (res) {
            // console.log(res, 'xjb');
            if (res.returnCode === 0) {
                var allData=res.body;
                var investBehaviorFrequentResult = res.body.investBehaviorFrequentResult;
                var investBehaviorHoldResult = res.body.investBehaviorHoldResult;
                var investBehaviorRegularResult = res.body.investBehaviorRegularResult;
                var investBehaviorChaseResult = res.body.investBehaviorChaseResult;
                var investBehaviorConcentrationResult = res.body.investBehaviorConcentrationResult;
                // 第一个柱状图
                var income1 = [];
                var income2 = [];
                var income3 = [];
                var myChart1 = echarts.init(document.getElementById('pie1'));
                var myChart2 = echarts.init(document.getElementById('pie2'));
                var myChart3 = echarts.init(document.getElementById('pie3'));
                // 频繁交易分析结果
                if(investBehaviorFrequentResult){
                    var result1=investBehaviorFrequentResult.result;
                    // 申购次数
                    var purchaseNum1=investBehaviorFrequentResult.purchaseNum;
                    // 赎回次数
                    var redeemNum1=investBehaviorFrequentResult.redeemNum;
                    // monthlyResultList
                    income1=investBehaviorFrequentResult.monthlyResultList;
                    var contentData1=paperWorkMap.investBehaviorFrequentResult[result1]?paperWorkMap.investBehaviorFrequentResult[result1]:''
                    if(contentData1){
                        $(".frequent-result .title").addClass('result-bg'+result1).children('i').addClass('icon-bg'+result1).next().text(contentData1.title);
                        $(".frequent-result .content").prepend(contentData1.content.format(purchaseNum1,redeemNum1));
                        setOption1(option1, income1);
                        draw(myChart1, option1);
                    }else{
                        alert('频繁交易分析结果数据错误')
                    }
                }
                //  持有时间分析结果 
                if(investBehaviorHoldResult){
                    var result2=investBehaviorHoldResult.result;
                    // 持有过基金个数
                    var holdFundNum2 =investBehaviorHoldResult.holdFundNum;
                    // 持有时间较短的基金数组
                    var fundList=investBehaviorHoldResult.fundList?investBehaviorHoldResult.fundList:'';
                    var contentData2=paperWorkMap.investBehaviorHoldResult[result2]?paperWorkMap.investBehaviorHoldResult[result2]:''
                    if(contentData2){
                        $(".hold-result .title").addClass('result-bg'+result2).children('i').addClass('icon-bg'+result2).next().text(contentData2.title);
                        if(result2=='0'){
                            $(".hold-result .content").prepend(contentData2.content.format(holdFundNum2).formatArr(fundList))
                        }else{
                            $(".hold-result .content").prepend(contentData2.content.format(holdFundNum2))
                        }
                    }else{
                        alert('持有时间分析结果数据错误')
                    }
                }
                //  周期性投资分析结果 
                if(investBehaviorRegularResult){
                    var result3=investBehaviorRegularResult.result;
                    // 定投次数
                    var regularNum3 =investBehaviorRegularResult.regularNum;
                    // 持有时间较短的基金数组
                    income2 =investBehaviorRegularResult.monthlyResultList?investBehaviorRegularResult.monthlyResultList:'';
                    var contentData3=paperWorkMap.investBehaviorRegularResult[result3]?paperWorkMap.investBehaviorRegularResult[result3]:''
                    if(contentData3){
                        $(".regular-result .title").addClass('result-bg'+result3).children('i').addClass('icon-bg'+result3).next().text(contentData3.title);
                        $(".regular-result .content").prepend(contentData3.content);
                        if(income2){
                            $(".regular-result .echart").show();
                            $(".regular-result .static-img").hide();
                            setOption1(option2, income2 ,true);
                            draw(myChart2, option2);
                        }else{
                            $(".regular-result .echart").hide();
                            $(".regular-result .static-img").show();
                        }
                    }else{
                        alert('周期性投资分析结果数据错误')
                    }
                }
                //  追涨杀跌分析结果  
                if(investBehaviorChaseResult ){
                    var result4=investBehaviorChaseResult.result;
                    // 申购次数
                    var purchaseNum4 =investBehaviorChaseResult .purchaseNum;
                    // 赎回次数
                    var redeemNum4 =investBehaviorChaseResult.redeemNum;
                    var contentData4=paperWorkMap.investBehaviorChaseResult [result4]?paperWorkMap.investBehaviorChaseResult [result4]:''
                    if(contentData4){
                        $(".chase-result .title").addClass('result-bg'+result4).children('i').addClass('icon-bg'+result4).next().text(contentData4.title);
                        $(".chase-result .content").prepend(contentData4.content.format(purchaseNum4,redeemNum4));
                    }else{
                        alert('追涨杀跌分析结果数据错误')
                    }
                }
                //  持仓集中分析结果  
                if(investBehaviorConcentrationResult ){
                    var result5=investBehaviorConcentrationResult.result;
                    // 占比较高行业
                    var industry =investBehaviorConcentrationResult.industry;
                    income3=investBehaviorConcentrationResult.industryList;
                    var contentData5=paperWorkMap.investBehaviorConcentrationResult[result5]?paperWorkMap.investBehaviorConcentrationResult[result5]:'';
                    var oldColor=['#68b0ea','#fcd465','#ee6f6f','#5c74cd','#fe7e01','#66d5d7','#fe7e02','#78b0ea','#fcd466','#ee7f6f','#4c74cd'];
                    var color=['#68b0ea','#fcd465','#ee6f6f','#5c74cd','#fe7e01','#66d5d7','#fe7e02','#78b0ea','#fcd466','#ee7f6f','#4c74cd'];
                    var len=income3.length;
                    while(color.length<len){
                        color.push(oldColor[Math.floor(Math.random() * (oldColor.length))]);
                    }
                    if(contentData5){
                        $(".concentration-result .title").addClass('result-bg'+result5).children('i').addClass('icon-bg'+result5).next().text(contentData5.title);
                        $(".concentration-result .content").prepend(contentData5.content.format(industry));
                        setOption2(option3, income3,color);
                        draw(myChart3, option3);
                        var str = '';
                        
                        income3.forEach(function (item,index) {
                    str += '<div class="list-item">' +
                               '<i style="background-color:' + color[index] + ';"></i>' +
                               '<span class="type">' + item.name + '</span>: ' +
                               '<span>' + (Number(item.percent).toFixed(2)) + '%</span>' +
                           '</div>';
                });
                $('.middle-content').find('.charts-list').html(str);
                // $('.middle-content').find('.charts-list .list-item:first-child').css('marginTop', ((140 - 20 * income3.length) / 40) + 'rem');
                    }else{
                        alert('追涨杀跌分析结果数据错误')
                    }
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

// 跳转登陆
function jumpLogin(){
    window.location.href="/mobileEC/wap/login/login.html?referUrl=/tradeh5/newWap/cos/investAnalysis/index.html"
}
// echart配置方法

// 柱状图1
var option1 = {
    color: ['#5eb8fc', '#fb5c5f'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid:{
        right:'5%',
        left:0,
        top:'5%',
        bottom:'30%',
        containLabel: true
    },
    legend: {
        itemWidth:nowSize(20),
        itemHeight:nowSize(20),
        itemGap:nowSize(40),
        bottom:'5%',
        data: ['申购', '赎回'],
        textStyle:{
            fontSize:nowSize(24)
        },
        // x:'center'
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        // feature: {
        //     mark: {show: true},
        //     dataView: {show: true, readOnly: false},
        //     magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        //     restore: {show: true},
        //     saveAsImage: {show: true}
        // }
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {show: false},
            data: [],
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#f1f1f1",
                    width: 1,
                    type: 'solid'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "f1f1f1"
                }
            },
            axisLabel: {
                interval:0,
                rotate:50,
                textStyle: {
                    color: '#999',  //更改坐标轴文字颜色
                    fontSize:nowSize(18)
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisTick: {show: false},
            axisLine: {
                show: false,
                lineStyle: {
                    color: "f1f1f1"
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#f1f1f1",
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel:{
                textStyle: {
                    color: '#999',  //更改坐标轴文字颜色
                }
            }
        }
    ],
    series: [
        {
            name: '申购',
            type: 'bar',
            barGap: 0,
            data: [320, 332, 301, 334]
        },
        {
            name: '赎回',
            type: 'bar',
            data: [220, 182, 191, 234, 290]
        }
    ]
};
// 柱状图2
var option2 = {
    color: ['#fb5c5f'],
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'shadow'
    //     }
    // },
    grid:{
        right:'5%',
        left:0,
        top:'5%',
        bottom:'15%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {show: false},
            data: [],
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#f1f1f1",
                    width: 1,
                    type: 'solid'
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "f1f1f1"
                }
            },
            axisLabel: {
                interval:0,
                rotate:50,
                textStyle: {
                    color: '#999',  //更改坐标轴文字颜色
                    fontSize:nowSize(18)
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisTick: {show: false},
            axisLine: {
                show: false,
                lineStyle: {
                    color: "f1f1f1"
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#f1f1f1",
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel:{
                textStyle: {
                    color: '#999',  //更改坐标轴文字颜色
                }
            }
        }
    ],
    series: [
        {
            name: '定投',
            type: 'bar',
            barGap: 0,
            barWidth : 10,
            data: []
        }
    ]
};
// 饼图
var option3 = {
    color:[],
    // grid:{
    //     right:'50%',
    //     left:0,
    //     top:'5%',
    //     bottom:'15%',
    //     containLabel: true
    // },
    
    series: [
        {
            name: '行业占比',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false
                }
            },
            silent: true,
            hoverOffset: 2,
            // emphasis: {
            //     label: {
            //         show: true,
            //         fontSize: '30',
            //         fontWeight: 'bold'
            //     }
            // },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                
            ]
        }
    ]
};
// 柱状图setoption
function setOption1(option, incomes1 ,flag) {
    var result1 = formattingIncomes(incomes1,flag);
    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].splitNumber = result1.xArr.length;
    // option.xAxis[0].axisLabel.interval = result1.xArr.length - 2;
    option.series[0].data = result1.yArr1;
    option.series[1]&&(option.series[1].data = result1.yArr2);
}
// 饼图setoption
function setOption2(option, incomes1,color) {
    var result1 = formattingIncomes1(incomes1);
    option.series[0].data = result1.seriesData;
    option.color=color
    console.log(option3);
}



function draw(myChart, option) {
    // if (!((option.series[0].data && option.series[0].data.length > 0))) {
    //     option.xAxis[0].data = ["", ""];
    //     option.xAxis[0].axisLabel.interval = ["", ""].length - 2;
    //     // $(".noData").show();
    //     // $()
    // }
    // else{
    //     // $(".noData").hide();
    // }
    myChart.setOption(option);
    // setTimeout(function () {
    //     myChart.dispatchAction({
    //         type: 'showTip',
    //         seriesIndex: 1,
    //         dataIndex: 10
    //     });
    // }, 0);
}
// 柱状图format
function formattingIncomes(incomes,flag) {
    var xArr = [],
        yArr1 = [],
        yArr2 = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var yearMon = incomes[i].yearMon;
        xArr.push(yearMon.substr(0, 4) + "." + yearMon.substr(4, 2));
        if(!flag){
            yArr1.push((incomes[i].purchaseNum));
            yArr2.push((incomes[i].redeemNum));
        }else{
            yArr1.push((incomes[i].regularNum));
        }
        
    }
    return {
        xArr: xArr,
        yArr1: yArr1,
        yArr2: yArr2
    };
}
// 饼图format
function formattingIncomes1(incomes) {
    seriesData = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var name = incomes[i].name;
        var percent = incomes[i].percent?Number(incomes[i].percent).toFixed(2):'0.00';
        seriesData.push({value:percent,name:name})
    }
    return {
        seriesData
    };
}
// echart字体图形大小换算方法
function nowSize(val){
    var nowClientWidth = document.body.clientWidth;
    return val * (nowClientWidth/720);
}