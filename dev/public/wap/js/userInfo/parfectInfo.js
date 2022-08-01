$(function () {
    var now = new Date();
    // $('.idCardValidDate').mobiscroll().date({
    //     theme: 'ios',
    //     lang: 'zh',
    //     display: 'bottom',
    //     buttons: [
    //         'set',
    //         {
    //             text: '长期有效',
    //             handler: function (event, inst) {
    //                 isValidDate = true;
    //                 $(".gap").html("");
    //                 if(age < 46){
    //                     $(".gap").html("不满46周岁证件有效期不可设置为长期有效，请修改");
    //                 }
    //                 if(saveData.baseInfo != undefined && saveData.baseInfo != null){
    //                     saveData.baseInfo.idVailDate = '99991231';
    //                 }
    //                 inst.setVal(new Date(2099, 12, 30), true, true, false, 1000);
    //                 inst.hide();
    //             }
    //         },
    //         'cancel'
    //     ],
    //     dateFormat: 'yyyy年mm月dd日',
    //     min: now,
    //     endYear: 2099,
    //     onSet: function (val, inst) {
    //         if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
    //             isValidDate = true;
    //             $(".gap").html("");
    //              var idNoValiDate = val.valueText.substring(0,4)+val.valueText.substring(5,7)+val.valueText.substring(8,10);
    //             if(saveData.baseInfo != undefined && saveData.baseInfo != null){
    //                 saveData.baseInfo.idVailDate = idNoValiDate;
    //             }
    //         }
    //     }
    // });

    $('#go_to_bind_card').attr('href', isApp() ? 'htffundxjb://action?type=accountSecurity&subType=verifyIdentify&taskType=bankCard' : '/mobileEC/wap/card/bindCardInputCardInfo.html');

    var url = '/icif/v1/custs/get-simple-by-cust-no';
    utils.get(url, null, function(result){
        if(result.returnCode == 0){
            if(result.body && result.body.custTp === 'NRN'){ // 客户类型，RN-实名客户，NRN-非实名客户
                $('.bind_card_tip').show();
            }
            if(result.body&&result.body.mobile){
                // 有手机号已经绑定
                if(result.body.mobileBdSt=='Y'){  //有手机号且绑定了(手机号码绑定状态，Y/N )
                    var phoneNumber=result.body.mobile;
                    phoneNumber = phoneNumber.substr(0, 3) + '****' + phoneNumber.substr(-4, 4);
                    $(".phone-number").html(phoneNumber);
                    $(".phone-arrow").hide();
                }
                //有手机号未绑定未验证
                if(result.body.mobileBdSt=='N'){  //有手机号未绑定(手机号码绑定状态，Y/N )
                    var phoneNumber=result.body.mobile;
                    phoneNumber = phoneNumber.substr(0, 3) + '****' + phoneNumber.substr(-4, 4);
                    $(".phone-number").html(phoneNumber+'<span style="color:#fb5c5f;margin-left:0.35rem">未验证</span>');
                    $(".phone-arrow").show();
                    $(".li-phone-number").click(function(){
                        jumpToBind(result.body.mobile);
                    })
                }
            }else{
                //没有手机号未绑定
                if(result.body.mobileBdSt=='N'){  //没有手机号未绑定
                    // var phoneNumber=result.body.mobile;
                    // phoneNumber = phoneNumber.substr(0, 3) + '****' + phoneNumber.substr(-4, 4);
                    $(".phone-number").html('<span style="color:#fb5c5f">去绑定</span>');
                    $(".phone-arrow").show();
                    $(".li-phone-number").click(function(){
                        jumpToBind(result.body.mobile);
                    })
                }
            }
        }
    });


    queryCustInfo();
    getListAndCustomerInfo();
    queryApplicaDetailInfo();
});
//20220124完善信息页增加手机号--S
function jumpToBind(telePhone){
    // 20220208 临时注释，等APP7.2上线后再更新，当前先区分APP和h5页面打开环境，做提醒跳转
    // var url=telePhone?"./mobileBind.html?telePhone="+telePhone:"./mobileBind.html";
    // window.location.href =url;
    if(isApp()){
        // 20220215 跟APP7.2一起上线，跳转到 绑定手机 原生页面
        // window.location.href = 'htffundxjb://action?type=accountDetail&subType=bindMobile';
        utils.showTips({
            title: '',
            content: '为了您的账户安全，请前往账户信息页完成验证。',
            textAlign: 'left',
            confirmText: '立即前往',
            complete: function() {
                // 跳转到账户信息原生页面
                window.location.href = 'htffundxjb://action?type=accountDetail';
            }.bind(this),
            showCancel: true,
            nextText: '取消', 
            cancelButtonFirst: true,
        })
    } else {
        utils.showTips({
            title: '',
            content: '为了您的账户安全，请打开现金宝App的账户信息页完成验证。',
            textAlign: 'left',
            confirmText: '打开现金宝App',
            complete: function() {
                // 跳转到现金宝APP下载页面
                window.location.href = 'https://www.99fund.com/m.htm';
            }.bind(this),
            showCancel: true,
            nextText: '取消', 
            cancelButtonFirst: true,
        })
    }
}
//20220124完善信息页增加手机号--E
var idCardPicNotUpload = true;
var custInfoCompleteOpen = "0";
var isNewCust = "0";
var invTp = '';
var invNm = '';
var idTp = '';
var idNo = '';
var saveData = {};
var isValidDate = true;
var age = 0;
var nations = [];
var city = [];

$(".li-address").click(function () {
    window.location.href = "./contactAddress.html";
});
$(".li-actual-Controller").click(function () {
    window.location.href = "./actualAccountController.html";
});
$(".li-actual-beneficiary").click(function () {
    window.location.href = "./actualAccountBeneficiary.html";
});
$(".li-due-diligence").click(function () {
    window.location.href = "./dueDiligence.html";
});
$(".li-integrity-problem").click(function () {
    window.location.href = "./isExistsIntegrityProblem.html";
});
$("#btn-submit").click(function () {
    saveInfo();
});
$(".mask").click(function () {
    $(".mask").hide();
    $(".layer").hide();
});
$("#sexOptions li").click(function(event) {
    $(".sex").html($(event.target).html());
    $(".sex").attr("data-value", $(event.target).attr("data-value"));
    $(".mask").hide();
    $(".layer").hide();
    if(saveData.baseInfo != undefined && saveData.baseInfo != null){
        saveData.baseInfo.sex = $(event.target).attr("data-value");
    }
});
$("#careerOptions li").click(function(event) {
    $(".career").html($(event.target).html());
    $(".career").attr("data-value", $(event.target).attr("data-value"));
    $(".career").removeClass("red");
    $(".mask").hide();
    $(".layer").hide();
    if(saveData.baseInfo != undefined && saveData.baseInfo != null){
        saveData.baseInfo.vocCode = $(event.target).attr("data-value");
    }
});

$(".idCardValidDate").click(function(){
    // utils.showTips("请先上传证件照片，有效期会自动更新");
    utils.showTips({
        title: '', //标题
        content: '请先上传证件照片，有效期会自动更新', //内容
        confirmText: '去上传', //确认按钮文字，默认确定
        complete: function() { //需使用bind()
            if(navigator.userAgent.indexOf('htfxjb') > -1){
                // 20210826 ios上传身份证件bug修改，去掉subType传值  ------ 20220616，app的bug已修复，修改为原来处理逻辑
                if(idTp == '0'){
                    window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto&idTp=0";
                } else {
                    window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhotoOther&idTp=" + idTp;
                }
                // if(idTp == '0'){
                //     window.location.href = "htffundxjb://action?type=accountDetail";
                // } else {
                //     window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhotoOther&idTp=" + idTp;
                // }
                // 20210826 ios上传身份证件bug修改，去掉subType传值  ------ 20220616，app的bug已修复，修改为原来处理逻辑
            } else {
                if(idTp == '0'){
                    window.location.href = "./idCardUpdate.html" + location.search;
                }else{
                    window.location.href = "./noIdCardUpdate.html?idTp="+idTp + location.search;   //非身份证
                }
            }
        }.bind(this),
        showCancel: true, //是否显示取消按钮，默认false
        nextText: '取消',  // 取消按钮文案，默认取消
        cancelButtonFirst: true, //是否取消按钮位置在前（取消-确认），默认false，（确认-取消）
    })
});



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
                    queryVocationList(idTp)
                    Promise.all([queryNationList(idTp), queryProvinceList(idTp)]).then(function(results) {
                        nations = results[0];
                        city = results[1]
                        queryBasicCustomerInfo(nations,city);            
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

//查询职业列表
function queryVocationList(idTp){
    
    var vocCodeList = [];
    var url = "/icif/v1/paras?paraKey=VOCATION&idTp="+ idTp;
    utils.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var paras = result.body.paras;
            paras.forEach(function(item){
                vocCodeList.push({"code": item.pmCo,"desc":item.pmNm})
            });

            var vocCode = '';
            $.each(vocCodeList, function (index, el) {
                vocCode += '<li data-val=' + el.desc + '>' + el.desc + '</li>'
            });
            $('.career').append(vocCode);

            $(".career").mobiscroll().treelist({
                theme: "ios",
                lang: "zh",
                group: true,
                placeholder: '请选择职业',
                display: 'bottom',
                onSet:function(val, inst) {
                    if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                        var vCode = '00';
                        vocCodeList.forEach(function (item) {
                            if(val.valueText == item.desc){
                                vCode = item.code;
                            }
                        });
                        if(saveData.baseInfo != undefined && saveData.baseInfo != null){
                            saveData.baseInfo.vocCode = vCode;
                        }
                    }
                }
            });
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
                    city.push({"citys":item.subParas,"provinceCode":item.pmCo,"provinceName":item.pmNm})
                });
                resolve(city);
            }
        })
    })
}

function queryBasicCustomerInfo(nations,city) {
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
                    invTp = basicUserInfo.invtp;
                    invNm = basicUserInfo.invnm;
                    idTp = basicUserInfo.idtp;
                    idNo = basicUserInfo.idno;
                    if(idTp != '0' && idTp != '5'){
                        var sexList = [{"code":"2", "desc": "女"}, {"code":"1", "desc": "男"}];
                        var sexHtml = '';
                        $.each(sexList, function (index, el) {
                            sexHtml += '<li data-val=' + el.desc + '>' + el.desc + '</li>'
                        });
                        $('.sex').append(sexHtml);
    
                        $(".sex").mobiscroll().treelist({
                            theme: "ios",
                            lang: "zh",
                            group: true,
                            placeholder: '请选择性别',
                            display: 'bottom',
                            onSet:function(val, inst) {
                                if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                                    if(saveData.baseInfo != undefined && saveData.baseInfo != null){
                                        sexList.forEach(function (item) {
                                            if(val.valueText == item.desc){
                                                saveData.baseInfo.sex = item.code;
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        $(".sex").attr("readonly", true);
                        $(".sex_arrow").hide();
                    }
                    var sex = basicUserInfo.sex;
                    if(sex == '1'){
                        $(".li-sex input").val("男");
                    } else {
                        sex = '2';
                        $(".li-sex input").val("女");
                    }
                    var displayIdNo = basicUserInfo.idno;
                    if(App.isNotEmpty(displayIdNo)){
                        displayIdNo = displayIdNo.substr(0, 3) + '****' + displayIdNo.substr(-2, 2) + "(" + App.getIdTpDesc(idTp) + ")";
                    }
                    var certPicUploadState = basicUserInfo.certPicUploadState;
                    if(certPicUploadState == "2"){
                        $(".idno-pic-st").html("已上传");
                        $(".upload-idno-arrow").hide();
                        idCardPicNotUpload = false;
                    } else if(certPicUploadState == "1"){
                        $(".idno-pic-st").html("审核中");
                        $(".upload-idno-arrow").hide();
                        idCardPicNotUpload = false;
                    } else {
                        $(".idno-pic-st").html("立即上传").css('color','#fb5c5f');
                        $(".upload-idno-arrow").show();
                        $(".upload-idno-pic").click(function (){
                            if(navigator.userAgent.indexOf('htfxjb') > -1){
                                // 20210826 ios上传身份证件bug修改，去掉subType传值
                                // if(idTp == '0'){
                                //     window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto";
                                // } else {
                                //     window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhotoOther&idTp=" + idTp;
                                // }
                                if(idTp == '0'){
                                    window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto&idTp=0";
                                } else {
                                    window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhotoOther&idTp=" + idTp;
                                }
                                // 20210826 ios上传身份证件bug修改，去掉subType传值
                            } else {
                                if(idTp == '0'){
                                    window.location.href = "./idCardUpdate.html" + location.search;
                                }else{
                                    window.location.href = "./noIdCardUpdate.html?idTp="+idTp + location.search;   //非身份证
                                }
                            }
                        });
                    }
                    var nation = basicUserInfo.nation;
                    if(App.isNotEmpty(nation)){
                        nations.forEach(function (o) {
                            if(o.nationCode == nation){
                                $(".li-nationality-region input").val(o.nationName);
                            }
                        });
                    }else{
                        //中国
                        nation = 'CN';
                        $(".li-nationality-region input").val("中国");
                    }
                    
                    if(basicUserInfo.nationalityModifiable){
                        initNation(basicUserInfo.nation);
                    } else {
                        $(".survey_nations").attr("readonly", true);
                        $(".nation_arrow").hide();
                    }
    
                    $(".idCard").html(displayIdNo);
                    var availabledate = basicUserInfo.availabledate; //有效期对应文字
                    var idNoValiDate = availabledate; //有效期日期
                    if(App.isEmpty(availabledate)) {
                        availabledate = '';
                        // idNoValiDate = getDate();
                        // availabledate = idNoValiDate.substr(0, 4) + '年' + idNoValiDate.substr(-4, 2) + '月' + idNoValiDate.substr(-2, 2) + '日';
                    } else if (availabledate.indexOf("永久") > -1 || availabledate.indexOf("长期") > -1){
                        idNoValiDate = "99991231"
                        availabledate = availabledate;
                    } else if (App.isNotEmpty(availabledate)){
                        if(availabledate.indexOf("2099") > -1 || availabledate.indexOf("9999") > -1){
                            availabledate = '长期有效';
                        }else{
                            availabledate = availabledate.substr(0,4) + '年' + availabledate.substr(-4,2) + '月' + availabledate.substr(-2,2) + '日';
                        }
                    }
                    if(App.isNotEmpty(idNoValiDate)){
                        var sDate = new Date(idNoValiDate.substr(0,4),idNoValiDate.substr(-4,2) - 1,idNoValiDate.substr(-2,2));
                        var eDate = new Date(new Date().toLocaleDateString());
                        if(sDate.getTime() < eDate.getTime()){
                            $(".gap").html("证件有效期过期，请修改");
                            isValidDate = false;
                        }
                    }

    
                    if(App.isNotEmpty(basicUserInfo.idno) && (basicUserInfo.idtp == '0' || basicUserInfo.idtp == '5') && App.isNotEmpty(idNoValiDate)){
                        age = getAge(basicUserInfo.idno.substr(6, 8));
                        if(age < 46 && (idNoValiDate.indexOf("2099") > -1 || idNoValiDate.indexOf("9999") > -1 || idNoValiDate.indexOf("永久") > -1 || idNoValiDate.indexOf("长期") > -1)){
                            $(".gap").html("不满46周岁证件有效期不可设置为长期有效，请修改");
                        }
                    }
    
                    $(".idCardValidDate").attr("value", availabledate);
                    if(App.isNotEmpty(basicUserInfo.vocation)){
                        $(".li-career input").val(basicUserInfo.vocation);
                    } else {
                        $(".li-career input").val("企业单位");
                    }
                    var provinceName = '';
                    if (App.isNotEmpty(basicUserInfo.provincecode)){
                        city.forEach(function (o) {
                            if(o.provinceCode == basicUserInfo.provincecode){
                                provinceName = o.provinceName;
                            }
                        });
                    }
                    var address = provinceName + ' ' + (basicUserInfo.cityname ? basicUserInfo.cityname : '') + ' ' + (basicUserInfo.area ? basicUserInfo.area : '');
                    //有省市的情况下展示地址
                    if(provinceName && basicUserInfo.cityname && basicUserInfo.addr){
                        address +=  ' ' + basicUserInfo.addr;
                    }
                    if(App.isEmpty(provinceName)){
                        $(".address").html("上海市 上海市 浦东新区");
                        $(".address").attr("data-value","1");
                    } else {
                        $(".address").html(address);
                    }
                    var taxIdentityDesc = basicUserInfo.taxIdentityDesc;
                    if(App.isEmpty(taxIdentityDesc)){
                        $(".due-diligence").html("中国税收居民");
                        $(".due-diligence").attr("data-value", "1");
                    } else {
                        $(".due-diligence").html(taxIdentityDesc);
                    }
                    
                    var accptMd ="WAP";

                    if(isApp()){
                        accptMd="MOBILE";
                    }

                    var baseInfo = {"idVailDate": idNoValiDate, "branchCode": "247", "accptMd":accptMd,
                        "vocCode": App.isEmpty(basicUserInfo.voccode) ? "21" : basicUserInfo.voccode,"nation":nation,
                        "nationality":nation, "sex": App.isEmpty(sex) ? "1" : sex,
                        "cityName":App.isEmpty(basicUserInfo.cityCode) ? "310000" : basicUserInfo.cityCode,
                        "provinceCode":App.isEmpty(basicUserInfo.provincecode) ? "310000" : basicUserInfo.provincecode};
    
                    if(App.isEmpty(provinceName)){
                        baseInfo.provinceCode = '310000';
                        baseInfo.cityName = '310000'; //20220525改传cityCode
                        baseInfo.addr = '上海市 浦东新区';
                    }
                    // if(App.isEmpty(basicUserInfo.addr)){
                        if(App.isNotEmpty(basicUserInfo.addr)){
                            baseInfo.addr = basicUserInfo.addr;
                        } else {
                            baseInfo.addr = '市区';
                        }
                    // }
                    saveData.baseInfo = baseInfo;
                    if(App.isEmpty(taxIdentityDesc)){
                        var taxInfo = {"onlyChinaTaxResident": true};
                        saveData.taxInfo = taxInfo;
                    }

                    saveData.accptMd = accptMd;
                    saveData.branchCode = "247";
                    
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
function getAge(birAge) {
    if (birAge == null) {
        return 0;
    };
    var birYear = birAge.substr(0,4);
    var birMonth = birAge.substr(-4,2);
    var birDay = birAge.substr(-2,2);

    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();
    var returnAge = 0;
    var d = new Date(birYear, birMonth - 1, birDay);
    if (d.getFullYear() == birYear && (d.getMonth() + 1) == birMonth && d.getDate() == birDay) {
        if (nowYear == birYear) {
            returnAge = 0;
        } else {
            var ageDiff = nowYear - birYear;
            if (ageDiff > 0) {
                if (nowMonth == birMonth) {
                    var dayDiff = nowDay - birDay;
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                } else {
                    var monthDiff = nowMonth - birMonth;
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    } else {
                        returnAge = ageDiff;
                    }
                }
            }
        }
    }
    return returnAge;
}

function initNation(n) {
	var placeholder = '请选择国籍(地区)';

    var li = '';
    $.each(nations, function (index, el) {
        li += '<li data-val="' + el.nationName + '">' + el.nationName +
            '</li>'
		if(App.isNotEmpty(n) && el.nationCode == n){
			placeholder = el.nationName;
			
		}
    });
    $('.survey_nations').append(li);
    $(".survey_nations").mobiscroll().treelist({
        theme: "ios",
        lang: "zh",
        group: true,
        placeholder: placeholder,
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
                        if(saveData.baseInfo != undefined && saveData.baseInfo != null){
                            saveData.baseInfo.nation = o.nationCode;
							saveData.baseInfo.nationality = o.nationCode;
                        }
                    }
                });
            }
        }
    });
}

function getDate(){
    var date = new Date();
    var year = date.getFullYear();
    year += 5;
    var month = date.getMonth()+1;
    if(month < 10){
        month = "0" + month;
    }
    var date = date.getDate();
    if(date < 10){
        date = "0" + date;
    }
    return year+''+month+''+date;
}

function queryApplicaDetailInfo() {
    // var url = App.projectNm + "/customer_info/query_sales_applica_detail?r=t" + (Math.random() * 10000).toFixed(0);
    var url = "/mobile-bff/v1/customerInfo/sales-applica-detail?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var holdingname = result.body.holdingname;
            var txqInfo = {};
            if(App.isEmpty(holdingname)){
                txqInfo.isHolding = "Y";
                $(".actual-Controller").html("本人");
            } else {
                $(".actual-Controller").html(holdingname);
            }
            var beneficiary = result.body.beneficiary;
            if(App.isEmpty(beneficiary)){
                txqInfo.isBeneficiary = "Y";
                $(".actual-beneficiary").html("本人");
            } else {
                $(".actual-beneficiary").html(beneficiary);
            }
            var isCreditRecord = result.body.isCreditRecord;
            if(App.isEmpty(isCreditRecord)){
                txqInfo.isCreditRecord = "N";
                $(".integrity-problem").html("无诚信问题");
            } else {
                if(isCreditRecord == "Y"){
                    $(".integrity-problem").html("有诚信问题");
                } else {
                    $(".integrity-problem").html("无诚信问题");
                }
            }

            saveData.amlInfo = txqInfo;
        }
    });
}

function queryCustInfo() {
    var url = App.projectNm + "/check_cust_info?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            custInfoCompleteOpen = result.body.custInfoCompleteOpen;
            isNewCust = result.body.isNewCust;
        }
    });
}

function saveInfo() {
    var baseInfo = saveData.baseInfo;
    if(baseInfo != undefined && baseInfo != null){

        if(App.isEmpty(baseInfo.nation)){
            alertTips("请先选择国籍");
            return;
        }
        if(!isValidDate){
            alertTips("证件有效期过期，请修改");
            return;
        }

        if(age < 46 &&
            (baseInfo.idVailDate == '20991231' || baseInfo.idVailDate == '99991231'|| baseInfo.idVailDate == "永久" || baseInfo.idVailDate == "长期")){
            $(".gap").html("不满46周岁证件有效期不可设置为长期有效，请修改");
            alertTips("不满46周岁证件有效期不可设置为长期有效，请修改");
            return;
        }

        // if (App.isEmpty(baseInfo.idVailDate)){
        //     alertTips("请先选择证件有效期");
        //     return;
        // }
        if (App.isEmpty(baseInfo.vocCode)){
            alertTips("请先选择职业");
            return;
        }
    } else {
        alertTips("基础信息填写不完善");
        return;
    }

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
    
                    var certPicUploadState = basicUserInfo.certPicUploadState;
                    if(certPicUploadState == "2"){
                        idCardPicNotUpload = false;
                    } else if(certPicUploadState == "1"){
                        idCardPicNotUpload = false;
                    }
    
                    if(custInfoCompleteOpen == "1"
                        && isNewCust == "1"
                        && idCardPicNotUpload){
                            utils.showTips({
                                title: '',
                                content: '请上传证件照片',
                                confirmText: '立即上传',
                                nextComplete: function () {
                                    uploadInformation();
                                },
                                complete: function () {
                                    if(navigator.userAgent.indexOf('htfxjb') > -1){
                                        // 20210826 ios上传身份证件bug修改，去掉subType传值
                                        // window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto";
                                        // window.location.href = "htffundxjb://action?type=accountDetail";
                                        // 20210826 ios上传身份证件bug修改，去掉subType传值
                                        if(idTp == '0'){
                                            window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto&idTp=0";
                                        } else {
                                            window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhotoOther&idTp=" + idTp;
                                        }
                                    } else {
                                        if(idTp == '0'){
                                            window.location.href = "./idCardUpdate.html" + location.search;
                                        }else{
                                            window.location.href = "./noIdCardUpdate.html" + location.search;   //非身份证
                                        }
                                    }
                                },
                                showCancel: true,
                                nextText: '跳过，暂不上传',
                                cancelButtonFirst: true,    // 取消button在前
                            })
                    }else{
                        uploadInformation();
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

function uploadInformation(){
    var diligence = $(".due-diligence").html();
    if(diligence == "中国税收居民"){
        var data = { "onlyChinaTaxResident":"1" };
        // var url = App.projectNm + "/customer_info/add_cust_tax_info";
        var url = "/mobile-bff/v1/customerInfo/add-cust-tax-info"
        App.post(url, JSON.stringify(data), null, function (result) {
            
        });
    }


    var url_confirm = "/icif/v1/blacks/aml-cleans/confirm";
    var confirm_data = {"accptMd":"MOBILE","branchCode":"247"};
    App.post(url_confirm, JSON.stringify(confirm_data), null, function (result1) {

        // var url = "/icif/v1/pcusts/modify-pcust-counter"; 
        var url = "/icif/v1/pcusts/full-modify";
        App.put(url, JSON.stringify(saveData), function (result3) {
            // add by MZ 20200203 S
            $("div.row p,div.row input").css('color','#666');
            // if(result3.returnCode == 9998){
            //     if(result3.returnMsg.indexOf('证件有效期不') > -1 ){
            //         $(".idCardValidDate.mbsc-comp").css('color', 'red');
            //         $(".idCardValidDate.mbsc-comp").siblings('p').css('color','red');
            //     }
            // }
            // add by MZ 20200203 E
        }, function (result3) {

            if(navigator.userAgent.indexOf('htfxjb') > -1){
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                if(isAndroid){
                    handler.goBack(true);
                } else {
                    window.location.href = "http://www.99fund.com?pageforward=1";
                }
            } else {
                var forwardUrl = decodeURIComponent(App.getUrlParam("forwardUrl"));
                var referUrl = decodeURIComponent(App.getUrlParam("referUrl"));
                var bindCardToCompleteInfo = App.getUrlParam("bindCardToCompleteInfo");
                if(bindCardToCompleteInfo == 1){ // 只设置交易密码，未完善信息，跳转至交易密码设置成功页面
                    if(referUrl){
                        window.location.href = '../card/setTradePwdSuccess.html?referUrl=' + encodeURIComponent(referUrl);
                    }
                    else if(forwardUrl){
                        window.location.href = '../card/setTradePwdSuccess.html?forwardUrl=' + encodeURIComponent(forwardUrl);
                    }
                    else {
                        window.location.href = '../card/setTradePwdSuccess.html';
                    }
                }
                else if(bindCardToCompleteInfo == 2){ // 绑卡成功，未完善信息，跳转至绑卡成功页面
                    if(referUrl){
                        window.location.href = '../card/bindCardSuccess.html?referUrl=' + encodeURIComponent(referUrl);
                    }
                    else if(forwardUrl){
                        window.location.href = '../card/bindCardSuccess.html?forwardUrl=' + encodeURIComponent(forwardUrl);
                    }
                    else {
                        window.location.href = '../card/bindCardSuccess.html';
                    }
                }
                else { // bindCardToCompleteInfo不合法，跳转referUrl页面
                    if(!forwardUrl && !referUrl){ // forwardUrl和referUrl都不存在，跳转至首页
                        window.location.href = "../wezhan/service.html";
                    }
                    else if(forwardUrl){ // forwardUrl存在，跳转至forwardUrl页面,暂定forwardUrl优先级大于referUrl
                        window.location.href = forwardUrl;
                    }
                    else {
                        window.location.href = referUrl ? referUrl : '../wezhan/service.html';
                    }
                }
            }
        });
    });
}