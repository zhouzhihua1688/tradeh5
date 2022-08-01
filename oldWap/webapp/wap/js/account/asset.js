$(function () {
    queryAssetAnalysis();
    var index = 0;
    $('.asset li').click(function(){
        //number 0:RMB、1:USD
        var number = $(this).index();
        if (number == 0){
            index = Math.abs(index - 1) % 2;
        } else if (number == 1){
            index = Math.abs(index + 1) % 2;
        }

        if (index == 0){
            $(".content3").show();
            $(".content4").hide();
        } else if (index == 1){
            $(".content3").hide();
            $(".content4").show();
        }
        $(this).parent().siblings().hide().eq(index).show()
    });
});

function queryAssetAnalysis() {
    var url = App.projectNm + "/account/query_asset_analysis?r=" + (Math.random()*10000).toFixed(0);
    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
            $("#totalAssetAmt_RMB").html(result.body.totalAssetAmt);
            $("#totalAssetAmt_USD").html("0.00");
            if (result.body.totalDollarAmt != '') {
                $("#totalAssetAmt_USD").html(result.body.totalDollarAmt);
                // $(".dollar_amt_panel").show();
            }
            var html = "";
            var color = [];
            var data = [];
            result.body.assetAnalysis.forEach(function (item) {
                color[color.length] = item.color;
                data[data.length] = {value:item.rate,name:item.name};
                console.log(item.name);
                if(item.name.indexOf("基金") > -1) {
                    html += "<tr onclick='window.location.href=\"../fund/my_fund.html\"'>";
                }else if(item.name.indexOf("现金宝") > -1){
                    html += "<tr onclick='window.location.href=\"xjb_index.html?r="+(Math.random()*10000).toFixed(0)+"\"'>";
                }else{
                    html += "<tr>";
                }
                html += "<td>" +
                        "<i style='background-color: "+item.color+"'></i>" +
                        "<span>"+item.name+" ("+item.percentage+")</span>" +
                        "</td>" +
                        "<td><span class='sign'>"+item.amt+"</span></td>" +
                        "</tr>";
            });
            $("#assetAnalysis_RMB").html(html);
            html = "";
            result.body.assetDollerAnalysis.forEach(function (item) {
                color[color.length] = item.color;
                data[data.length] = {value:item.rate,name:item.name};
                console.log(item.name);
                if(item.name.indexOf("基金") > -1) {
                    html += "<tr onclick='window.location.href=\"/tradeh5/newWap/myAssets/index.html\"'>";
                }else if(item.name.indexOf("现金宝") > -1){
                    html += "<tr onclick='window.location.href=\"xjb_index.html\"'>";
                }else{
                    html += "<tr>";
                }
                html += "<td>" +
                    "<i style='background-color: "+item.color+"'></i>" +
                    "<span>"+item.name+" ("+item.percentage+")</span>" +
                    "</td>" +
                    "<td><span class='sign'>"+item.amt+"</span></td>" +
                    "</tr>";
            });
            $("#assetAnalysis_USD").html(html);
            if(data.length == 0){
                data[0] = {value: 1, name: ''};
                color[0] = "#eee";
            }
            setCircle(data, color);
        }
    });
}

function setCircle(data, color) {
// 图标配置
    var myChart = echarts.init(document.getElementById('circle'));
    var option = {
        color: color,
        series: [
            {
                silent: true,
                name:'访问来源',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'inner'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:data
            }
        ]
    };
    myChart.setOption(option);
}