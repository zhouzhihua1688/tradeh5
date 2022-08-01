var page=utils.getUrlParam('page');
$(function () {
    // queryBasicCustomerInfo();
    getListAndCustomerInfo();
});
var provinceCode = '';
var cityName = '';
var area = '';
var cityCode = '';
var areaCode = '';
var city = [];
var nations = [];

$("#btn-submit").click(function () {
    saveContactAddress();
});
function saveContactAddress() {
    var address = $(".detail-address").val();
    if (App.isNotEmpty(provinceCode)){

        if(App.isEmpty(address)){
            alertTips("请输入详细地址");
            return;
        }

        var data = {"provincecode": provinceCode, "cityname": cityCode, "area": areaCode, "addr": address}; //新接口都要传代码
        // var url = App.projectNm + "/customer_info/modify_contact_address";
        $.ajax({
            url:"/mobile-bff/v1/customerInfo/modify-contact-address",
            type:"POST",
            data:JSON.stringify(data),
            dataType: "json",
            contentType: 'application/json',
            beforeSend:function(req){
                req.setRequestHeader("version", "7.40");  //20220525使用反洗钱用户信息code,必须传7.40版本号
            },
            success:function(result){
    
                if (result.returnCode == 0 && result.body != undefined && result.body != null){
                    // window.location.href = "./parfectInfo.html";
                    if(page){  //20220720判断是否从tradeH5新页面跳转
                        window.location.href = "/tradeh5/newWap/myArea/personalInfo/index.html";
                    }else{
                        window.location.href = "./parfectInfo.html";
                    }
                } else if(result.returnCode == 1000){
                    console.log('sso_cookie过期失效或者不存在情况!')
                    return utils.jumpLoginByChannelCode();
                } else if(result.returnCode == 9999){
                    if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                        utils.showTips("网络连接错误！");
                    }else{
                        utils.showTips(result.returnMsg);
                    }
                }
            },
            error:function(result) {
                alertTips('当前服务或网络异常，请稍后重试')
            }
        })
    
    } else {
        alertTips("请先选择地区");
        return;
    }
}

function getListAndCustomerInfo(){
    $.ajax({
        url:"/mobile-bff/v1/customerInfo/basic-customer-info?r=t" + (Math.random() * 10000).toFixed(0),
        type:"GET",
        dataType: "json",
        contentType: 'application/json',
        beforeSend:function(req){
            req.setRequestHeader("version", "7.40");  //20220525使用反洗钱用户信息code,必须传7.40版本号
        },
        success:function(result){

            if (result.returnCode == 0 && result.body != undefined && result.body != null){
                var basicUserInfo = result.body.buserInfo;
                if(basicUserInfo != undefined &&　basicUserInfo != null){
                    idTp = basicUserInfo.idtp;
                    Promise.all([queryNationList(idTp), queryProvinceList(idTp)]).then(function(results) {
                        nations = results[0];
                        city = results[1]
                        queryBasicCustomerInfo(nations,city);
                        
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
                            // $(el).each(function (itemindex, item) {
                                $('.citys').each(function (inindex, inel) {
                                    if (inel.dataset.value == el.provinceCode) {
                                        var cityLi = '';
                                        $.each(el.subParas, function (citysindex, citysitem) {
                                            cityLi += '<li data-val=' + citysitem.pmNm + '>' + citysitem.pmNm + '<ul>'
                                            var district = '';
                                            $(citysitem.subParas).each(function (disindex, districtval) {
                                                district += '<li data-val=' + districtval.pmNm + '>' + districtval.pmNm + '</li>'
                                            })
                                            cityLi += district + '</ul></li>'
                                        })
                                        $(inel).append(cityLi)
                                    }
                    
                                })
                    
                            // })
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
                                            var citys = result.subParas;
                                            citys.forEach(function(item){
                                                if (item.pmNm == cityName){
                                                    cityCode = item.pmCo;
                                                }
                                                var areas = item.subParas;
                                                areas.forEach(function(areaItem){
                                                    if(areaItem.pmNm == area){
                                                        areaCode = areaItem.pmCo;
                                                    }
                                                })
                                            })
                    
                                        }
                                    });               
                                }
                            }
                        });
                    
                        

                    }).catch(error=>{
                        console.log(error);
                    })
                }
            } else if(result.returnCode == 1000){
                console.log('sso_cookie过期失效或者不存在情况!')
                return utils.jumpLoginByChannelCode();
            } else if(result.returnCode == 9999){
                if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                    utils.showTips("网络连接错误！");
                }else{
                    utils.showTips(result.returnMsg);
                }
            }
        },
        error:function(result) {
            alertTips('当前服务或网络异常，请稍后重试')
        }
    })

}

//查询国家地区列表
function queryNationList(idTp){
    return new Promise((resolve, reject) => {        

        var url = "/icif/v1/paras?paraKey=NATION&idTp="+ idTp;
        utils.get(url, null, function(result){
            if (result.body != undefined && result.body != null){
                var paras = result.body.paras;
                paras.forEach(function(item){
                    nations.push({"nationCode": item.pmCo,"nationName":item.pmNm})
                });
                resolve(nations);
            }
        })
    })
}

//查询中国省市区地区列表
function queryProvinceList(idTp){
    return new Promise((resolve, reject) => {        

        var url = "/icif/v1/paras?paraKey=PROVINCE&idTp="+ idTp;
        utils.get(url, null, function(result){
            if (result.body != undefined && result.body != null){
                var paras = result.body.paras;
                paras.forEach(function(item){
                    city.push({"subParas":item.subParas,"provinceCode":item.pmCo,"provinceName":item.pmNm})
                });
                resolve(city);
            }
        })
    })
}


function queryBasicCustomerInfo() {
    $.ajax({
        url:"/mobile-bff/v1/customerInfo/basic-customer-info?r=t" + (Math.random() * 10000).toFixed(0),
        type:"GET",
        dataType: "json",
        contentType: 'application/json',
        beforeSend:function(req){
            req.setRequestHeader("version", "7.40");  //20220525使用反洗钱用户信息code,必须传7.40版本号
        },
        success:function(result){

            if (result.returnCode == 0 && result.body != undefined && result.body != null){
                var basicUserInfo = result.body.buserInfo;
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
                        provinceCode = '310000';
                        cityName = '上海市';
                        cityCode = '310000';
                        areaCode = "310115";
                    } else {
                        provinceCode = basicUserInfo.provincecode;
                        cityName = basicUserInfo.cityname;
                        area = basicUserInfo.area;
                        cityCode = basicUserInfo.cityCode;
                        areaCode = basicUserInfo.areaCode;
                        var address = provinceName + ' ' + (basicUserInfo.cityname ? basicUserInfo.cityname : '') + ' ' + (basicUserInfo.area ? basicUserInfo.area : '');
                        if(App.isNotEmpty(provinceName)){
                            $(".li-contact-addr input").val(address);
                        }
                    }
                    if(App.isEmpty(basicUserInfo.addr) && App.isEmpty(provinceName) && App.isEmpty(basicUserInfo.cityname) && App.isEmpty(basicUserInfo.area)){
                        $(".detail-address").val("上海市 浦东新区");
                    } else {
                        $(".detail-address").val(basicUserInfo.addr);
                    }
                }
    
            }
            else if(result.returnCode == 1000){
                console.log('sso_cookie过期失效或者不存在情况!')
                return utils.jumpLoginByChannelCode();
            } 
            else if(result.returnCode == 9999){
                if(result.returnMsg.indexOf('系统错误') > -1 || result.returnMsg.indexOf('服务器错误') > -1){
                    utils.showTips("网络连接错误！");
                }else{
                    utils.showTips(result.returnMsg);
                }
            }
        },
        error:function(result) {
            alertTips('当前服务或网络异常，请稍后重试')
        }
    })

}