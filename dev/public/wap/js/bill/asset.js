function setMyChart(data){
    var option = {
        color: ['#ffdc7f','#ffb415','#ff8100','#ff5a00'],
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
        	selectedMode: false,
            orient: 'vertical',
            right: '1%',
            top: '22%',
            bottom: 20,
            itemWidth: 14,
            data: data.map(function (item, index, self) {
                return item.name
            }),
            formatter: function(name){
                var item = data.filter(function(item,index,self){
                    if(item.name == name){
                        return true;
                    }
                    return false;
                })
                return item[0].name + '  ' + item[0].showVal + '  ' + item[0].percent
            }
        },
        series: [
            {
            	silent: true,
                name: '月度账单',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['24%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '18',
                            // fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:  data.map(function (item, index, self) {
                    return {value:item.value, name: item.name}
                })

            }
        ]
    };
    var myChart = echarts.init(document.getElementById('pie3'));
    myChart.setOption(option);
}