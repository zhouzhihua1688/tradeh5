$(function () {
    setDate();
    setNations();
    setTaxCountry();
    queryInfo();

});
var birthDay = '';
var countryCode = '';
var provinceCode = '';
var cityCode = '';
function setDate() {
    var now = new Date();

    $('.controller-birth-date').mobiscroll().date({
        theme: 'ios',
        lang: 'zh',
        display: 'bottom',
        dateFormat: 'yyyy-mm-dd',
        endYear: 2099,
        onSet: function (val, inst) {
            if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                birthDay = val.valueText.substring(0,4)+val.valueText.substring(5,7)+val.valueText.substring(8,10);
            }
        }
    });
}

function setNations() {

    var li = '';
    $.each(nations, function (index, el) {
        li += '<li data-val="' + el.nationName + '">' + el.nationName +
            '</li>'
    })
    $('.controller-country').append(li)

    $(".controller-country").mobiscroll().treelist({
        theme: "ios",
        lang: "zh",
        group: true,
        placeholder: '请选择出生地',
        display: 'bottom',

        onSet: function (val) {
            $('.survey_ .twoJi').removeClass('twoJi')
            var China = '';
            var Hongkong = '';
            var Macao = '';
            var Taiwan = '';
            console.log(val)
            if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                nations.forEach(function (o) {
                    if(o.nationName == val.valueText){
                        countryCode = o.nationCode;
                    }
                });
            }
            $.each(city, function (index, el) {
                if (el.provinceName == '澳门特别行政区') {
                    Macao += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                        '<ul class="citys" data-value=' + el.provinceCode + '></ul></li>'
                } else if (el.provinceName == '香港特别行政区') {
                    Hongkong += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                        '<ul class="citys" data-value=' + el.provinceCode + '></ul></li>'
                } else if (el.provinceName == '台湾省') {
                    Taiwan += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                        '<ul class="citys" data-value=' + el.provinceCode + '></ul></li>'
                } else {
                    China += '<li data-val=' + el.provinceName + '>' + el.provinceName +
                        '<ul class="citys" data-value=' + el.provinceCode + '></ul></li>'
                }

            })
            if (val.valueText == '中国') {
                $('.controller-province').html(China);
            } else if (val.valueText == '中国香港') {
                $('.controller-province').html(Hongkong);
            } else if (val.valueText == '中国澳门') {
                $('.controller-province').html(Macao);
            } else if (val.valueText == '中国台湾') {
                $('.controller-province').html(Taiwan);
            } else {
                $('.controller-province').html('<li data-val=""> </li> ');
            }
            $.each(city, function (index, el) {
                $(el).each(function (itemindex, item) {
                    $('.citys').each(function (inindex, inel) {
                        if (inel.dataset.value == item.provinceCode) {
                            var cityLi = '';
                            $.each(item.citys, function (citysindex, citysitem) {
                                cityLi += '<li data-val=' + citysitem.cityName + '>' + citysitem.cityName + '<ul>'
                                var district = '';
                                // $(citysitem.areas).each(
                                //     function (disindex, districtval) {
                                //         district += '<li data-val=' + districtval.areaName + '>' + districtval.areaName + '</li>'
                                //     });
                                cityLi += district + '</ul></li>';
                            });
                            $(inel).append(cityLi);
                        }

                    })

                })
            })
            $(".controller-province").mobiscroll().treelist({
                theme: "ios",
                lang: "zh",
                group: true,
                placeholder: '请选择所在地',
                display: 'bottom',
                onSet: function (val) {
                    if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                        var strings = val.valueText.split(' ');
                        city.forEach(function (result) {
                            if(result.provinceName == strings[0]){
                                provinceCode = result.provinceCode;
                                result.citys.forEach(function (c) {
                                    if(c.cityName == strings[1]){
                                        cityCode = c.cityCode;
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
}

function setTaxCountry() {
    var li = '';
    $.each(nations, function (index, el) {
        li += '<li data-val="' + el.nationName + '">' + el.nationName +
            '</li>'
    })
    $('.controller-tax-country').append(li)

    $(".controller-tax-country").mobiscroll().treelist({
        theme: "ios",
        lang: "zh",
        group: true,
        placeholder: '请选择税收居民国(地区)',
        display: 'bottom',
    });
}

$('.survey_textLeft p').on('click', function () {
    $(this).addClass('selected').siblings().removeClass('selected')
    if ($(this).hasClass('only')) {
        $('.isnot').css('display', 'none')
    } else {
        $('.isnot').css('display', 'block')

    }
})

$('.content_1 ul li').click(function(event) {
    // event.preventDefault();
    $(this).addClass('current').siblings().removeClass('current');
    if($(this).index() == 0){
        $(".content_2").hide();
        $(".content_3").hide();
    } else {
        $(".content_2").show();
        $(".content_3").show();
    }
});
$('.content_1 ul li i').click(function(event) {
    // event.preventDefault();
    $(this).siblings('input').prop('checked', true);
    $(this).parents('li').addClass('current').siblings().removeClass('current');
    if($(this).parents('li').index() == 0){
        $(".content_2").hide();
        $(".content_3").hide();
    } else {
        $(".content_2").show();
        $(".content_3").show();
    }
});
var addCount = 0;
$(".add").click(function () {
    if(addCount < 2){
        addMoreReason();
        addCount++;
    } else {
        $(".add").css("color", "#bbbbbb");
    }
});

function addMoreReason() {
    var html =
        '        <div class="more-reason">\n' +
        '        <div class="gap"></div>\n' +
        '            <ul class="grid-list" style="padding:0 0 0 .75rem ">\n' +
        '                <li class="grid-list-item heigth-100">\n' +
        '                    <div class="row">\n' +
        '                        <div class="flex">\n' +
        '                            <p>税收居民国(地区)<span class="red">*</span></p>\n' +
        '                            <input type="text" class="controller-tax-country" placeholder="请选择税收居民国(地区)"/>\n' +
        '                        </div>\n' +
        '                        <div class="lh-100 margin-r75">\n' +
        '                            <a class=" iconi icon-arrow-right"></a>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '                <li class="grid-list-item heigth-100">\n' +
        '                    <div class="row">\n' +
        '                        <div class="flex">\n' +
        '                            <p>纳税人识别号</p>\n' +
        '                            <input type="text" class="controller-tax-number" placeholder="请输入纳税人识别号"/>\n' +
        '                        </div>\n' +
        '                        <div class="lh-100 margin-r75">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '                <li class="grid-list-item heigth-100">\n' +
        '                    <div class="row">\n' +
        '                        <div class="flex">\n' +
        '                            <p>不能提供纳税人识别号的原因</p>\n' +
        '                            <input type="text" style="width: 30%;" class="controller-tax-remark" placeholder="请输入原因"/>\n' +
        '                        </div>\n' +
        '                        <div class="lh-100 margin-r75">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '                <li class="grid-list-item heigth-100">\n' +
        '                    <div class="row">\n' +
        '                        <span class="del">删除</span>\n' +
        '                    </div>\n' +
        '                </li>\n' +
        '            </ul>\n' +
        '            </div>';
    $(".content_3").append(html);
    setDate();
    setTaxCountry();
    $(".del").click(function () {
        $(this).parents(".more-reason").remove();
        addCount--;
        $(".add").css("color", "#0070fa");
    });
}


function queryInfo() {
    var url = App.projectNm + "/customer_info/query_cust_tax_info?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var custTaxInfos = result.body.custTaxInfos;
            //1:仅是中国税收居民、0：不仅是中国税收居民、2：不是中国税收居民
            if(custTaxInfos != undefined && custTaxInfos != null) {
                $(".taxResident li").removeClass("current");
                if(custTaxInfos.taxResident == '1' || custTaxInfos.taxResident == ''){
                    $(".taxResident li").eq(0).addClass("current");
                } else {
                    $(".content_2").show();
                    $(".content_3").show();
                    if(custTaxInfos.taxResident == '2'){
                        $(".taxResident li").eq(1).addClass("current");
                    } else {
                        $(".taxResident li").eq(2).addClass("current");
                    }
                    birthDay = custTaxInfos.birthDay;
                    var displayBirthDay = custTaxInfos.birthDay.substr(0,4)
                        +'-'+custTaxInfos.birthDay.substr(-4,2)
                        +'-'+custTaxInfos.birthDay.substr(-2,2);
                    $(".controller-birth-date").val(displayBirthDay);

                    countryCode = custTaxInfos.countryCode;
                    nations.forEach(function (o) {
                        if(o.nationCode == custTaxInfos.countryCode){
                            $(".li-country input").val(o.nationName);
                        }
                    });
                    provinceCode = custTaxInfos.provinceCode;
                    cityCode = custTaxInfos.cityCode;
                    var displayTxt = '';
                    city.forEach(function (result) {
                        if(result.provinceCode == provinceCode){
                            displayTxt += result.provinceName + " ";
                            result.citys.forEach(function (c) {
                                if(c.cityCode == cityCode){
                                    displayTxt += c.cityName + " ";
                                }
                            });
                        }
                    });
                    $(".li-province input").val(displayTxt);

                    var custTaxDetailInfos = custTaxInfos.custTaxDetailInfos;
                    if(custTaxDetailInfos != undefined && custTaxDetailInfos != null && custTaxDetailInfos.length > 0){
                        for(var index=0; index < custTaxDetailInfos.length - 1; index++){
                            addMoreReason();
                        }
                        custTaxDetailInfos.forEach(function (result, index) {
                            nations.forEach(function (o) {
                                if(o.nationCode == result.taxCountryCode){
                                    $(".content_3 ul").eq(index).find(".li-tax-country input").val(o.nationName);
                                }
                            });
                            $(".content_3 ul").eq(index).find(".controller-tax-number").val(result.taxNumber);
                            $(".content_3 ul").eq(index).find(".controller-tax-remark").val(result.noTaxNumReason);
                        });
                    }
                }
            }
        }
    });
}

$("#btn-submit").click(function () {
    saveInfo();
});
function saveInfo() {
    var taxResident = '';
    var index = $(".taxResident").find(".current").index();
    //1:仅是中国税收居民、0：不仅是中国税收居民、2：不是中国税收居民
    if(index == 0){
        taxResident = '1';
    } else if(index == 1){
        taxResident = '2';
    } else {
        taxResident = '0';
    }

    var data = { "onlyChinaTaxResident":taxResident };
    if (taxResident != '1'){
        if(App.isEmpty(birthDay)){
            alertTips("请先选择出生日期");
            return;
        }
        if(App.isEmpty(countryCode)){
            alertTips("请先选择出生地");
            return;
        }
        data.birthDay = birthDay;
        data.countryCode = countryCode;
        data.provinceCode = provinceCode;
        data.cityCode = cityCode;
        var custTaxDetailInfos = new Array();

        var isAlertTips = false;
        $(".content_3 ul").each(function () {
            var taxCountryName = $(this).find(".controller-tax-country").val();
            if(App.isNotEmpty(taxCountryName)){
                var taxCountryCode = '';
                nations.forEach(function (o) {
                    if(o.nationName == taxCountryName){
                        taxCountryCode = o.nationCode;
                    }
                });
                if(App.isNotEmpty(taxCountryCode)){
                    var taxNumber = $(this).find(".controller-tax-number").val();
                    var noTaxNumReason = $(this).find(".controller-tax-remark").val();
                    if(App.isEmpty(taxNumber) && App.isEmpty(noTaxNumReason)){
                        alertTips("纳税人识别号、不能提供纳税人识别号的原因，两个至少填写一项");
                        isAlertTips = true;
                        return;
                    }
                    var sub = {"taxCountryCode": taxCountryCode,
                        "taxNumber": taxNumber,
                        "noTaxNumReason": noTaxNumReason};
                    custTaxDetailInfos.push(sub);
                }
            }
        });
        if(isAlertTips) return;

        if(custTaxDetailInfos.length == 0){
            alertTips("请先选择税收居民国(地区)");
            return;
        }
        data.custTaxDetailInfos = custTaxDetailInfos;
    }

    // console.log(data);
    var url = App.projectNm + "/customer_info/add_cust_tax_info";
    App.post(url, JSON.stringify(data), null, function (result) {
        window.location.href = "./parfectInfo.html";
    });
}