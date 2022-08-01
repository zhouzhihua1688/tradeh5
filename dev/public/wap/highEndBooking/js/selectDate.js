/*
	名称：手势拖动选择日期-移动端
    邮箱：helang.love@qq.com
    作者：helang
*/

;$.extend({
    /* 年月日版 */
    selectDate: function (el, info, cbFn) {
        var createDateData = function (start, end) {
            var dateData = [{data: []}];
            var returnDayLen = function (year, month) {
                if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                    return 31
                } else if (month == 2) {
                    if (year % 4 == 0 && year % 100 != 0) {
                        return 29
                    } else if (year % 400 == 0) {
                        return 29
                    } else {
                        return 28
                    }
                } else {
                    return 30
                }
            };
            for (var x = start; x <= end; x++) {
                var data = {id: x, value: x + "年", childs: []};
                for (var y = 1; y <= 12; y++) {
                    var dayArr = [];
                    var len = returnDayLen(x, y);
                    for (var z = 1; z <= len; z++) {
                        dayArr.push({id: z, value: z + "日"})
                    }
                    data.childs.push({id: y, value: y + "月", childs: dayArr})
                }
                dateData[0].data.push(data)
            }
            return dateData
        };
        var infoData = {}, now = new Date();
        if (!info.start || !info.end || info.end < info.start) {
            infoData.start = now.getFullYear() - 60;
            infoData.end = now.getFullYear()
        } else {
            infoData.start = info.start;
            infoData.end = info.end
        }
        if (!info.select || info.select.length != 3) {
            infoData.select = [infoData.end - infoData.start, now.getMonth(), now.getDate() - 1]
        } else {
            infoData.select = [info.select[0] - infoData.start, info.select[1] - 1, info.select[2] - 1]
        }
        // 设置当前日期和未来日期-不显示过去日期
        function getTimes() {
            var _data = []
            var myDate = new Date()
            myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            myDate.getMonth(); //获取当前月份(0-11,0代表1月)
            myDate.getDate();
            for (i = myDate.getFullYear(); i < 2050; i++) {
                //年
                var obj = {};
                var yer = i;
                obj.value = i;
                var _data2 = [];
                if (i == myDate.getFullYear()) {
                    var Mon = myDate.getMonth() + 1
                } else {
                    var Mon = 1;
                }
                for (n = Mon; n <= 12; n++) {
                    //月
                    var obj2 = {};
                    obj2.value = ('0' + n).slice(-2)
                    var _data3 = [];
                    if (n == 2) {
                        var cond1 = yer % 4 == 0; //条件1：年份必须要能被4整除
                        var cond2 = yer % 100 != 0; //条件2：年份不能是整百数
                        var cond3 = yer % 400 == 0;
                        var cond = cond1 && cond2 || cond3;
                        //闰年
                        if (cond) {
                            if (i == myDate.getFullYear() && n == myDate.getMonth() + 1) {
                                var Das = myDate.getDate()
                            } else {
                                var Das = 1
                            }
                            for (y = Das; y <= 29; y++) {
                                //日
                                var obj3 = {};
                                obj3.value = ('0' + y).slice(-2)
                                _data3.push(obj3)
                            }
                        } else {
                            if (i == myDate.getFullYear() && n == myDate.getMonth() + 1) {
                                var Das = myDate.getDate()
                            } else {
                                var Das = 1
                            }
                            for (y = Das; y <= 28; y++) {
                                //日
                                var obj3 = {};
                                obj3.value = ('0' + y).slice(-2)
                                _data3.push(obj3)
                            }
                        }
                    } else if (n == 1 || n == 3 || n == 5 || n == 7 || n == 8 || n == 10 || n == 12) {
                        if (i == myDate.getFullYear() && n == myDate.getMonth() + 1) {
                            var Das = myDate.getDate()
                        } else {
                            var Das = 1
                        }
                        for (y = Das; y <= 31; y++) {
                            //日
                            var obj3 = {};
                            obj3.value = ('0' + y).slice(-2);
                            _data3.push(obj3)
                        }
                    } else {
                        if (i == myDate.getFullYear() && n == myDate.getMonth() + 1) {
                            var Das = myDate.getDate()
                        } else {
                            var Das = 1
                        }
                        for (y = Das; y <= 30; y++) {
                            //日
                            var obj3 = {};
                            obj3.value = ('0' + y).slice(-2)
                            _data3.push(obj3)
                        }
                    }
                    obj2.childs = _data3;
                    _data2.push(obj2);
                }
                obj.childs = _data2;
                _data.push(obj)
            }
            return _data
        }

        var selectDate = new MobileSelect({
            trigger: el,
            title: info.title || '手势拖动选择日期',
            triggerDisplayData:false,
            wheels: [{
                data: getTimes()
            }],

            callback: function (item, data) {
                console.log(item,data);
                var dateInfo = {year: data[0].value, month: data[1].value, day: data[2].value};
                cbFn && cbFn(dateInfo)
            }
        });
        return selectDate;
    },
    /* 年月版 */
    selectDateSimple: function (el, info, cbFn) {
        var createDateData = function (start, end) {
            var dateData = [{data: []}, {data: []}];
            for (var i = start; i <= end; i++) {
                dateData[0].data.push({id: i, value: i + "年"})
            }
            for (var j = 1; j <= 12; j++) {
                dateData[1].data.push({id: j, value: j + "月"})
            }
            return dateData
        };
        var infoData = {}, now = new Date();
        if (!info.start || !info.end || info.end < info.start) {
            infoData.start = now.getFullYear() - 60;
            infoData.end = now.getFullYear()
        } else {
            infoData.start = info.start;
            infoData.end = info.end
        }
        if (!info.select || info.select.length != 2) {
            infoData.select = [infoData.end - infoData.start, now.getMonth(), now.getDate() - 1]
        } else {
            infoData.select = [info.select[0] - infoData.start, info.select[1] - 1]
        }
        var selectDate = new MobileSelect({
            trigger: el,
            title: info.title || '手势拖动选择日期',
            triggerDisplayData:false,
            wheels: createDateData(infoData.start, infoData.end),
            position: infoData.select,
            callback: function (item, data) {
                var dateInfo = {year: data[0].id, month: data[1].id,};
                cbFn && cbFn(dateInfo)
            }
        });
        return selectDate;
    }
});