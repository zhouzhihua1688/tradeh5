

function setChart(fundList, hs300List) {

    var myChart_1 = echarts.init(document.getElementById('pie1'));
    setOption(option_1, fundList, hs300List);
    draw(myChart_1, option_1);

}

function warnAlert(){
    $(".dialog-content").html("收益率走势不包含理财型基金，明细列表中，理财型基金收益率按照产品收益率展示。");
    $(".dialog").show();
}

var option_1 = {

    color: ['#fb5c5f', '#fecb01', '#89acd8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    tooltip: {
        /*triggerOn: 'none',*/
        show: true, trigger: 'axis',
        axisPointer: {
            type: 'cross', label: { backgroundColor: 'rgba(0,0,0,0)', textStyle: { color: "#666" } }, lineStyle: { type: "dashed", color: "#1aa2e6" }
        },
        position: ["15%", "2%"], alwaysShowContent: true, backgroundColor: "rgba(0,0,0,0)", textStyle: { color: "#333" },
        formatter: function (params) {
            var isNoData = $(".noData").css("display") == "block";
            var arr = [];
            arr.push('<div style="width: 10rem;font-size: 12px; text-align: center; font-family: Arial;">')
            for (var i = 0; i < params.length; i++) {
                switch (params[i].seriesName) {
                    case "收益率":
                        arr.push('<span class="icon icon-1"></span>'); break;
                    case "沪深300":
                        arr.push('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="icon icon-3"></span>'); break;
                }
                if (isNoData) {
                    var data = "--"
                } else {
                    var data ='(' + params[i].data + "%)";
                }
                arr.push(params[i].seriesName + ": " + data);
                if(params[i].seriesName == "收益率"){
                    arr.push('<i class="warn-img" onclick="warnAlert()"></i>');
                }
            }
            arr.push("</div>");
            return arr.join("");
        }
        //			' <div style="width: 100%;font-size: 14px;"><span class="icon icon-1"></span> {a0}: {c0}%' +
        //            '<br/> <span class="icon icon-4"> </span>{a1}: {c1}%' +
        //            '<br/><span class="icon icon-3"> </span>{a2}: {c2}%</div></div>'
    },
    grid: { left: '5%', right: '5%', bottom: '0%', top: "15%", containLabel: true },
    xAxis: [
        {
            type: 'category', boundaryGap: false,
            axisTick: { show: false },
            splitLine: { show: true, lineStyle: { color: "#f1f1f1" } },
            axisLine: { show: true, lineStyle: { color: "#666" } },
            axisLabel: {
                interval: 30, formatter: function (value, index) {
                    if (index == 0) { return "     " + value; }
                    return value + "      ";
                }
            },
            data: [],
        }
    ],
    yAxis:
        {
            type: 'value',
            axisLine: { show: true, lineStyle: { color: "f1f1f1" } },
            axisTick: { show: false },
            splitLine: { show: true, lineStyle: { color: "#f1f1f1" } },
            axisLabel: { show: true, formatter: function (value, index) { return toDecimal(value); }, textStyle: { color: "#999999", fontWeight: "bolder", fontFamily: "Arial" } },
            axisPointer: { show: false, label: { show: false }, lineStyle: {/*type: "solid",*/color: "#1aa2e6" } }
        },
    series: [
        {
            symbol: "none", name: '收益率', type: 'line', smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3'
                    }, { offset: 1, color: '#fff' }], false)
                }
            },
            lineStyle: { normal: { color: "#fb5c5f" } },
            data: [],
            z: 1
        },

        {
            symbol: "none", name: '沪深300', type: 'line', smooth: true,
            areaStyle: {
                normal: {
                    color: 'none'
                    // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //     offset: 0, color: '#d0deef'
                    // }, { offset: 1, color: '#fff' }], false)
                }
            },
            lineStyle: { normal: { color: "#89acd8" } },
            data: [],
            z: 2
        }
    ]
};





function setOption(option, incomes1, incomes2, incomes3) {
    var result1 = formattingIncomes(incomes1);
    var result2 = formattingIncomes(incomes2);
    // var result3 = formattingIncomes(incomes3);
    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].axisLabel.interval = result1.xArr.length - 2;

    option.xAxis[0].data = result2.xArr;
    option.xAxis[0].axisLabel.interval = result2.xArr.length - 2;

    // option.xAxis[0].data = result3.xArr;
    // option.xAxis[0].axisLabel.interval = result3.xArr.length - 2;

    option.series[0].data = result1.yArr;
    option.series[1].data = result2.yArr;
    // option.series[2].data = result3.yArr;

}

function draw(myChart, option) {
    if (!((option.series[0].data && option.series[0].data.length > 0) || (option.series[1].data && option.series[1].data.length > 0))) {
        option.series[0].data = ["0", "0"];
        option.series[0].z = 4;
        option.series[1].data = ["0", "0"];
        option.series[2].data = ["0", "0"];
        option.xAxis[0].data = ["", ""];
        option.yAxis.axisLabel.formatter = function (value, index) {
            if (index == 0) { return value + ".00"; }
            return "";
        }
        $(".noData").show();
        //            return;
    } else {
        $(".noData").hide();
        option.series[0].z = 1;
        option.yAxis.axisLabel.formatter = function (value, index) { return toDecimal(value); };
    }
    myChart.setOption(option);
    setTimeout(function () {
        /*var num = parseInt(option.series[0].data.length / 3);*/
        myChart.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex: option.series[0].data.length - 1 });
        //            myChart.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:1000 });
        setTimeout(function () {
            myChart.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex: -1 });
        }, 100);
    }, 0);
}

function formattingIncomes(incomes) {
    var xArr = [], yArr = [];
    var len = incomes.length;
    for (var i = 0; i < len; i++) {
        var chartDt = incomes[i].chartDt;
        xArr.push(chartDt.substr(-6, 2) + "-" + chartDt.substr(-4, 2) + "-" + chartDt.substr(-2, 2));
        yArr.push(Number(incomes[i].chartNum).toFixed(2));
    }
    return { xArr: xArr, yArr: yArr };
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
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

