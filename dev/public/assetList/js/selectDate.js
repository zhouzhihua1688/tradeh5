/**
 * Created by plx on 2019-01-16
 * Email:1689422585@qq.com
 * 年月选择
 */

$.extend({
	//年月日
	selectYY_MM_DD: function(g, a, k) {
        var d, e, b  ;
        b = new Date;
        var starYear = b.getFullYear() -22 ;//最小选项
        var maxYear = b.getFullYear();//最大的选项
        d = starYear; e = maxYear;
        b = [10,0,0];
        var nowDate = new Date;
        var dateVal = $(g).val(); //获取输入框的值
        if( dateVal != undefined && dateVal != ""){ 
            dateVal = dateVal.split("-");
            //设置默认选择的项
            dateVal && 3 == dateVal.length ? b = [dateVal[0] -  starYear , dateVal[1] -1 , dateVal[2] -1 ] : b = b; 
        } else{
            b=[nowDate.getFullYear()-starYear,nowDate.getMonth(),nowDate.getDate()-1]
        }
        new MobileSelect({
            trigger: g, 
            title: '选择时间',
            wheels: function(a, b) {
                for (var d = [{ data: []  }]; a <= b; a++) {
                    // for (var e = { id: a, value: a , childs: [] }, c = 1; 12 >= c; c++) {
                    //     // for (var h = [], g = (1 == c || 3 == c || 5 == c || 7 == c || 8 == c || 10 == c || 12 == c) ? 31 : 2 == c ? 0 == a % 4 && 0 != a % 100 ? 29 : 0 == a % 400 ? 29 : 28 : 30, f = 1; f <= g; f++)//满月日期
                    //     // 20211203计算截止到今天的日期
                    //     for (var h = [], g = (1 == c || 3 == c || 5 == c || 7 == c || 8 == c || 10 == c || 12 == c) ? (c==nowDate.getMonth()+1&&e.value==nowDate.getFullYear()? 31-(31-nowDate.getDate()):31) : 2 == c ? 0 == a % 4 && 0 != a % 100 ? (c==nowDate.getMonth()+1&&e.value==nowDate.getFullYear()? 29-(29-nowDate.getDate()):29) : 0 == a % 400 ?  (c==nowDate.getMonth()+1&&e.value==nowDate.getFullYear()? 29-(29-nowDate.getDate()):29) : (c==nowDate.getMonth()+1&&e.value==nowDate.getFullYear()? 28-(28-nowDate.getDate()):28) : (c==nowDate.getMonth()&&e.value==nowDate.getFullYear()? 30-(30-nowDate.getDate()):30), f = 1; f <= g; f++)

                    //     	h.push({ id: f < 10 ? '0' + f : f,  value: f < 10 ? '0' + f : f  });

                    //         e.childs.push({  id: c < 10 ? '0' + c : c,  value: c < 10 ? '0' + c : c , childs: h < 10 ? '0' + h :h })
                    // }
                    for (var e = { id: a, value: a , childs: [] }, c = 1; 12 >= c; c++) {
                        if( a == b && c == nowDate.getMonth()+1){  // 当前月份
                            for (var h = [], g = nowDate.getDate(), f = 1; f <= g; f++){
                                h.push({ id: ('0'+f).slice(-2),  value: ('0'+f).slice(-2)  });
                            }
                            e.childs.push({  id: ('0'+c).slice(-2),  value: ('0'+c).slice(-2) , childs: h })
                            // 当前日期，跳出循环
                            break;
                        } else {
                            for (var h = [], g = (1 == c || 3 == c || 5 == c || 7 == c || 8 == c || 10 == c || 12 == c) ? 31 : 2 == c ? 0 == a % 4 && 0 != a % 100 ? 29 : 0 == a % 400 ? 29 : 28 : 30, f = 1; f <= g; f++){
                                h.push({ id: ('0'+f).slice(-2),  value: ('0'+f).slice(-2)  });
                            }
                            e.childs.push({  id: ('0'+c).slice(-2),  value: ('0'+c).slice(-2) , childs: h })
                        }
                    }

                    d[0].data.push(e)

                }
                return d
            }(d, e),
            position: b,
            callback: function(a, b) {

            	if(k != undefined){
            		k({
                        year: b[0].id,
                        month: b[1].id,
                        day: b[2].id
                    })
            	} 
            }
        })
    }

});