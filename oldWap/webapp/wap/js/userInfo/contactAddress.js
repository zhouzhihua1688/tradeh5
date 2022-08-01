$(function () {
    var li = '';
    var China = '';
    var Hongkong = '';
    var Macao = '';
    var Taiwan = '';
    $.each(city, function (index, el) {
        if (el.provinceName == '澳门特别行政区') {
            Macao += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                '<ul class="citys" data-value=' +
                el.provinceCode + '></ul></li>'
        } else if (el.provinceName == '香港特别行政区') {
            Hongkong += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                '<ul class="citys" data-value=' + el.provinceCode +
                '></ul></li>'
        } else if (el.provinceName == '台湾省') {
            Taiwan += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                '<ul class="citys" data-value=' +
                el.provinceCode + '></ul></li>'
        } else {
            China += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                '<ul class="citys" data-value=' +
                el.provinceCode + '></ul></li>'
        }

    })

    $('.survey_2').html(China);
    $.each(city, function (index, el) {
        $(el).each(function (itemindex, item) {
            $('.citys').each(function (inindex, inel) {
                if (inel.dataset.value == item.provinceCode) {
                    var cityLi = '';
                    $.each(item.citys, function (citysindex, citysitem) {
                        cityLi += '<li data-val=' + citysitem.cityName + '>' + citysitem.cityName + '<ul>'
                        var district = '';
                        $(citysitem.areas).each(function (disindex, districtval) {
                            district += '<li data-val=' + districtval.areaName + '>' + districtval.areaName + '</li>'
                        })
                        cityLi += district + '</ul></li>'
                    })
                    $(inel).append(cityLi)
                }

            })

        })
    });
    $(".survey_2").mobiscroll().treelist({
        theme: "ios",
        lang: "zh",
        group: true,
        placeholder: '请选择所在地',
        display: 'bottom',
        inputClass: 'survey_2',

        onSet: function (val) {
            if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                var strings = val.valueText.split(' ');
                cityName = strings[0];
                area = strings[2];
                city.forEach(function (result) {
                    if(result.provinceName == strings[0]){
                        provinceCode = result.provinceCode;
                    }
                });
            }
        }
    });

    queryBasicCustomerInfo();
});
var provinceCode = '';
var cityName = '';
var area = '';

$("#btn-submit").click(function () {
    saveContactAddress();
});
function saveContactAddress() {
    var address = $(".detail-address").val();
    if (App.isNotEmpty(provinceCode)){
        var data = {"provincecode": provinceCode, "cityname": cityName, "area": area, "addr": address};
        var url = App.projectNm + "/customer_info/modify_contact_address";
        App.post(url, JSON.stringify(data), null, function (result) {
            window.location.href = "./parfectInfo.html";
        });
    } else {
        alertTips("请先选择地区");
        return;
    }
}

function queryBasicCustomerInfo() {
    var url = App.projectNm + "/customer_info/query_basic_customer_info?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var basicUserInfo = result.body.basicUserInfo;
            if(basicUserInfo != undefined &&　basicUserInfo != null){
                var provinceName = '';
                if (App.isNotEmpty(basicUserInfo.provincecode)){
                    city.forEach(function (o) {
                        if(o.provinceCode == basicUserInfo.provincecode){
                            provinceName = o.provinceName;
                        }
                    });
                }
                if(App.isEmpty(provinceName)){
                    $(".li-contact-addr input").val("上海市 上海市 浦东新区");
                    provinceCode = '31';
                    cityName = '上海市';
                } else {
                    provinceCode = basicUserInfo.provincecode;
                    cityName = basicUserInfo.cityname;
                    area = basicUserInfo.area;
                    var address = provinceName + ' ' + basicUserInfo.cityname + ' ' + basicUserInfo.area;
                    if(App.isNotEmpty(provinceName)){
                        $(".li-contact-addr input").val(address);
                    }
                }
                if(App.isEmpty(basicUserInfo.addr)){
                    $(".detail-address").val("上海市 浦东新区");
                } else {
                    $(".detail-address").val(basicUserInfo.addr);
                }
            }

        }
    });
}