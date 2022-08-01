var myChart_1 = echarts.init(document.getElementById('myChart'));
$(function () {
    function setPanel(info){
        if(info != null || info != undefined){
            if(info.assets != null || info.assets != undefined){
                $("#panel_totalVal").html(App.numberFormat(info.assets.balance));
            }
            if(info.homeInfo != null || info.homeInfo != undefined){
                $("#panel_date").html(info.homeInfo.yieldDay);
                $("#panel_income").html(info.homeInfo.income);
                $("#panel_incomeDay").html(info.homeInfo.incomeDay);
            }
        }
    }

    function queryTotalProfit(){
        var url = App.projectNm + "/account/query_total_profit";
        App.get(url, null,function(result){
            if(result.body != null && result.body != undefined){
                if(result.body.totalProfit != null && result.body.totalProfit != undefined){
                    $("#panel_total_profit").html(App.numberFormat(result.body.totalProfit));
                }
            }
        });
    }

    function init(){
        var actHomePageInfo = App.getSession(App.accountHomePageInfo);
        if(actHomePageInfo == null || actHomePageInfo == undefined){
            App.queryHomePageInfo(function () {
                var acInfo = App.getSession(App.accountHomePageInfo);
                setPanel(acInfo);
            });
        }else {
            setPanel(actHomePageInfo);
        }

        queryTotalProfit();
        queryCashYield(7);

        App.bind("#index_rechange_btn", "tap", function(){
            window.location = "./topup.html";
        });
        App.bind("#index_takeback_btn", "tap", function(){
            window.location = "./takecash.html";
        });
    }
    init();
});

/**
 * 查询收益列表
 * @param count
 */
function queryCashYield(count){
    var url = App.projectNm + "/fund/query_cash_yield?count=" + count;
    myChart_1.showLoading();
    App.get(url, null,function(result){
        if(result.body != null && result.body != undefined){
            if(result.body.profit != null && result.body.profit != undefined){
                profit_list = result.body.profit;
                var xData = new Array(profit_list.length);
                var yData = new Array(profit_list.length);

                for(var i=0; i<profit_list.length; i++){
                    xData[i] = profit_list[i].changeDateFat.substr(5);
                    yData[i] = (profit_list[i].yield * 100).toFixed(3);
                }
                option.xAxis.data = xData;
                option.xAxis.axisLabel.interval = xData.length - 2;
                option.series.data = yData;
                myChart_1.setOption(option);
                myChart_1.hideLoading();
            }
        }
    });
}
/**
 * Created by LH on 2014/12/1.
 */

var option = {
    color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: { show:false, backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: '#fb5c5f'} }, lineStyle: { /*type: "dashed",*/color: "#1aa2e6" }
        },
//        position:["50%", "2%"],alwaysShowContent: true ,
        backgroundColor: "#fb5c5f", textStyle:{ color: "#fff"},
//        formatter: ' <div style="width: 100%;margin-left: -50%;font-size: 14px;"><span class="icon icon-1"></span> {a0}: {c0}% &nbsp;&nbsp; <span class="icon icon-3"> </span>{a1}: {c1}%</div>'
        formatter: '<div style="width: 4rem; text-align: center;">{c0}</div>'
    },
    grid: {left: '3%', right: '5%', bottom: '0%', top: "6%", containLabel: true },
    xAxis :
        {
            type : 'category',
            boundaryGap : false,
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
            axisLabel: {interval: 30, textStyle: {color: "#999999",fontWeight:"bolder",fontFamily:"Arial"}},
            data : []
        }
    ,
    yAxis : [
        {
            type : 'value',
            axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: {  show: true ,textStyle: {color: "#999999",fontWeight:"bolder",fontFamily:"Arial"}},
            axisPointer: { show: true, label: {show:true, backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: '#fb5c5f'} },lineStyle: {type: "solid",color: "#1aa2e6"} },
            scale:true
        }
    ],
    series :
        {
            symbol: "none", name:'七日年化收益率   ', type:'line', smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }], false)
                }
            },
            lineStyle: {normal: {color: "#fb5c5f"}},
            data: []
        }
};

$(".diagram ul li a").click(function(){
    if($(this).parent("li").hasClass("current")){ return ;}
    $(this).parent("li").addClass("current").siblings("li").removeClass("current");
    var btnText = $(this).html();
    var count = 0;
    if(btnText == "1个月"){
        count = 30;
    }else if(btnText == "2个月"){
        count = 60;
    }else{
        count = 7;
    }
    queryCashYield(count);
});