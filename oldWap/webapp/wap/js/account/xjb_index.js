$(function () {
    var option_2 = {
        color: ['#fb5c5f', '#fe7e01', '#f11', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a',
            '#6e7074', '#546570', '#c4ccd3'
        ],
        tooltip: {
            show: true,
            showContent: true,
            trigger: 'axis',
            formatter: function (item) {
                return '<div >'+ item[0].data +'</div>';
            },
            backgroundColor: '#fe5a5b',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: '#fb5c5f'}

                },
                lineStyle: {
                    color: "#1aa2e6"
                }
            },
        },
        grid: {
            left: '0%',
            right: '4%',
            bottom: '0%',
            top: "10%",
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
                    color: "#f1f1f1"
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "f1f1f1"
                }
            },
            axisLabel: {
                interval: 30
            },
            data: []
        }],
        yAxis: [{
            type: 'value',
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
                    color: "#f1f1f1"
                }
            },
            axisLabel: {
                show: true,
                formatter: function(value, index){
                        return App.formatMoney(value,3);
                    },
                textStyle: {
                    color: "#999999",
                    fontWeight: "bolder",
                    fontFamily: "Arial"
                }
            },
            axisPointer: {
                label: {
                    show: false
                },
                lineStyle: {
                    type: "solid",
                    color: "#1aa2e6"
                }
            }
        }],
        series: [{
            symbol: "emptyCircle",
            // name: '本基金',
            type: 'line',
            smooth: true,
            symbolSize: 6,
            itemStyle: {
                normal: {
                    // color:'red',
                    borderColor: '#000', //拐点边框颜色
                }
            },
            showSymbol: false,
            hoverAnimation: false,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#fb5c5f' // 0% 处的颜色
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
    function draw(myChart, option) {
        if (!((option.series[0].data && option.series[0].data.length > 0) || (option.series[1].data &&
                option.series[1].data.length > 0) || (option.series[2].data &&
                option.series[2].data.length > 0))) {
            option.xAxis[0].data = ["", "", "", ""];
            option.xAxis[0].axisLabel.interval = ["", ""].length - 4;
            $(".noData").show();
        } else {
            $(".noData").hide();
        }
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
        var xArrs = [],
            yArrs = [];
        var len = incomes.length;
        for (var i = 0; i < len; i++) {
            var chartDt = incomes[i].navDt;
            xArrs.push(chartDt.substr(-4, 2) + "-" + chartDt.substr(-2, 2));
            yArrs.push(App.formatMoney(incomes[i].yield,3));
        }
        return {
            xArrs: xArrs,
            yArrs: yArrs
        };
    }
    function setOption(option, incomes1, incomes2, incomes3) {
        var result1 = formattingIncomes(incomes1);
        if (incomes2 && incomes3) {
            var result2 = formattingIncomes(incomes2);
            var result3 = formattingIncomes(incomes3);
        }
        echartInitValue = [result1, result2, result3];
        option.xAxis[0].data = result1.xArrs;
        option.xAxis[0].axisLabel.interval = result1.xArrs.length - 3;
        option.series[0].data = result1.yArrs;
        if (incomes2 && incomes3) {
            option.series[1].data = result2.yArrs;
            option.series[2].data = result3.yArrs;
        }
    }

    var count = 7;
    var selectedProductId = "";
    var holdingDetails;
    function queryXJBAssetInfo() {

        App.get("/mobile-bff/v1/smac/assetDetail", null, function (result) {
            if (result.body != undefined && result.body != null) {
                var body = result.body;
                var profitDay = '-';
                if(body.profitDay != undefined && body.profitDay != null && body.profitDay != "") {
                    profitDay = body.profitDay.substr(-4, 2) + "-" + body.profitDay.substr(-2, 2);
                }
                $(".totalBalance").html(App.formatMoney(body.totalBalance, 2));
                $("#lastDayProfit").html(App.formatMoney(body.lastDayProfit, 2));
                $(".profitDay").html(profitDay);
                $(".totalProfit").html(App.formatMoney(body.totalProfit, 2));

                var upgradeFundVo = body.upgradeFundVo;
                if(upgradeFundVo != undefined && upgradeFundVo != null) {
                    if(upgradeFundVo.canUpgrade || upgradeFundVo.canConvert){
                        $(".tips a").html(upgradeFundVo.buttonName);
                        $(".tips").show();
                    }
                }

                holdingDetails = body.holdDetails;
                var tagHtml = "";
                if(holdingDetails != undefined && holdingDetails != null) {
                    holdingDetails.forEach(function (item, index) {
                        tagHtml += "<span class='"+ (index == 0 ? 'active' : '') +"'>"+ item.productShortName +"</span>";
                        if(index == 0) {
                            $(".balanceDisplay").html(App.formatMoney(item.balanceDisplay, 2));
                            $(".fundIncomeUnitDisplay").html(App.formatMoney(item.fundIncomeUnitDisplay, 4));
                            $(".lastDayProfit").html(App.formatMoney(item.lastDayProfit, 2));
                            $(".detailTitle").html(item.productName + "&nbsp;" + item.productId);
                            $(".visitProductDetail").attr("href", "../fund/steadyCombination.html?fundId=" + item.productId + "&f=xjb");

                            queryChartInfo(item.productId, 7);
                            selectedProductId = item.productId;
                        }
                    });
                    if(holdingDetails.length == 1){
                    	$(".tag").hide();
                    }
                }
                //tagHtml += "<img src='../images/account/point.png' alt=''>";
                $(".tag").append(tagHtml);
                $(".tag span").on("click", chartInfoSwitch);
            }
        });
    }

    $(".takeBack").click(function () {
        window.location.href = "cash.html";
    });
    $(".autoRecharge").click(function () {
        window.location.href = "autoTopUpCM.html?handTp=C";
    });
    $(".recharge").click(function () {
        window.location.href = "topup.html";
    });
    queryXJBAssetInfo();

    var myChart_2 = echarts.init(document.getElementById('pie2'));

    function queryChartInfo(fundId, count) {
        var url = "/smac/v1/asset/yields?count=" + count + "&fundId=" + fundId;
        myChart_2.showLoading();
        App.get(url, null,function(result){
            if(result.body != null && result.body != undefined){
                //var incomes1=[{"chartDt":"20170103","chartNum":"0.0165"},{"chartDt":"20170104","chartNum":"0.0522"},{"chartDt":"20170105","chartNum":"0.0317"},{"chartDt":"20170106","chartNum":"0.0898"},{"chartDt":"20170109","chartNum":"0.0104"},{"chartDt":"20170110","chartNum":"0.0145"},{"chartDt":"20170111","chartNum":"0.0791"},{"chartDt":"20170112","chartNum":"0.0640"},{"chartDt":"20170113","chartNum":"0.0437"},{"chartDt":"20170116","chartNum":"0.0754"},{"chartDt":"20170117","chartNum":"0.0877"},{"chartDt":"20170118","chartNum":"0.0214"},{"chartDt":"20170119","chartNum":"0.0752"},{"chartDt":"20170120","chartNum":"0.0463"},{"chartDt":"20170123","chartNum":"0.0428"},{"chartDt":"20170124","chartNum":"0.0091"},{"chartDt":"20170125","chartNum":"0.0654"},{"chartDt":"20170126","chartNum":"0.0536"},{"chartDt":"20170203","chartNum":"0.0933"},{"chartDt":"20170206","chartNum":"0.0259"},{"chartDt":"20170207","chartNum":"0.0156"},{"chartDt":"20170208","chartNum":"0.0354"},{"chartDt":"20170209","chartNum":"0.0421"},{"chartDt":"20170210","chartNum":"0.0379"},{"chartDt":"20170213","chartNum":"0.0404"},{"chartDt":"20170214","chartNum":"0.0412"},{"chartDt":"20170215","chartNum":"0.0320"},{"chartDt":"20170216","chartNum":"0.0693"},{"chartDt":"20170217","chartNum":"0.1003"},{"chartDt":"20170220","chartNum":"0.0927"},{"chartDt":"20170221","chartNum":"0.1269"},{"chartDt":"20170222","chartNum":"0.0947"},{"chartDt":"20170223","chartNum":"0.0882"},{"chartDt":"20170224","chartNum":"0.0542"},{"chartDt":"20170227","chartNum":"0.0674"},{"chartDt":"20170228","chartNum":"0.1038"},{"chartDt":"20170301","chartNum":"0.1236"},{"chartDt":"20170302","chartNum":"0.1140"},{"chartDt":"20170303","chartNum":"0.0598"},{"chartDt":"20170306","chartNum":"0.0373"},{"chartDt":"20170307","chartNum":"0.1048"},{"chartDt":"20170308","chartNum":"0.1033"},{"chartDt":"20170309","chartNum":"0.0405"},{"chartDt":"20170310","chartNum":"0.0801"},{"chartDt":"20170313","chartNum":"0.0705"},{"chartDt":"20170314","chartNum":"0.0767"},{"chartDt":"20170315","chartNum":"0.1059"},{"chartDt":"20170316","chartNum":"0.0961"},{"chartDt":"20170317","chartNum":"0.0364"},{"chartDt":"20170320","chartNum":"0.1219"},{"chartDt":"20170321","chartNum":"0.0828"},{"chartDt":"20170322","chartNum":"0.1002"},{"chartDt":"20170323","chartNum":"0.0439"},{"chartDt":"20170324","chartNum":"0.1099"},{"chartDt":"20170327","chartNum":"0.1161"},{"chartDt":"20170328","chartNum":"0.0711"},{"chartDt":"20170329","chartNum":"0.0775"},{"chartDt":"20170330","chartNum":"0.1179"},{"chartDt":"20170331","chartNum":"0.0716"},{"chartDt":"20170405","chartNum":"0.0682"}];

                setOption(option_2, result.body);
                draw(myChart_2, option_2);
            }
            myChart_2.hideLoading();
        });
    }

    $(".time p").click(function () {
        count = $(this).index() == 0 ? 7 : $(this).index() == 1 ? 30 : 60;
        queryChartInfo(selectedProductId, count);
        if ($(this).hasClass("active")) {
            return;
        }
        $(this).addClass("active").siblings().removeClass('active');
    });

    function chartInfoSwitch() {
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass('active');
        if(holdingDetails != undefined && holdingDetails != null) {
            var holdingDetail = holdingDetails[index];
            $(".balanceDisplay").html(App.formatMoney(holdingDetail.balanceDisplay, 2));
            $(".fundIncomeUnitDisplay").html(App.formatMoney(holdingDetail.fundIncomeUnitDisplay, 4));
            $(".lastDayProfit").html(App.formatMoney(holdingDetail.lastDayProfit, 2));
            $(".detailTitle").html(holdingDetail.productName + "&nbsp;" + holdingDetail.productId);
            $(".visitProductDetail").attr("href", "../fund/steadyCombination.html?fundId=" + holdingDetail.productId);

            queryChartInfo(holdingDetail.productId, count);
            selectedProductId = holdingDetail.productId;
        }
    }

});
