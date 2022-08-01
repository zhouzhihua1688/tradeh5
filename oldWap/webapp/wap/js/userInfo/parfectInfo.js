$(function () {
    var vocCodeList = [{"code":"00", "desc": "党政机关/事业单位"},
        {"code":"21", "desc": "企业单位"},
        {"code":"04", "desc": "金融"},
        {"code":"19", "desc": "个体户/自由职业"},
        {"code":"18", "desc": "学生"},
        {"code":"22", "desc": "军人"},
        {"code":"23", "desc": "退休人员"}];
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
                if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
                    saveData.dbaseInfo.vocCode = vCode;
                }
            }
        }
    });

    var now = new Date();
    $('.idCardValidDate').mobiscroll().date({
        theme: 'ios',
        lang: 'zh',
        display: 'bottom',
        buttons: [
            'set',
            {
                text: '长期有效',
                handler: function (event, inst) {
                    isValidDate = true;
                    $(".gap").html("");
                    if(age < 46){
                        $(".gap").html("不满46周岁证件有效期不可设置为长期有效，请修改");
                    }
                    if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
                        saveData.dbaseInfo.idVailDate = '20991231';
                    }
                    inst.setVal(new Date(2099, 12, 30), true, true, false, 1000);
                    inst.hide();
                }
            },
            'cancel'
        ],
        dateFormat: 'yyyy年mm月dd日',
        min: now,
        endYear: 2099,
        onSet: function (val, inst) {
            if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                isValidDate = true;
                $(".gap").html("");
                 var idNoValiDate = val.valueText.substring(0,4)+val.valueText.substring(5,7)+val.valueText.substring(8,10);
                if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
                    saveData.dbaseInfo.idVailDate = idNoValiDate;
                }
            }
        }
    });
    queryCustInfo();
    queryBasicCustomerInfo();
    queryApplicaDetailInfo();
});
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
    if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
        saveData.dbaseInfo.sex = $(event.target).attr("data-value");
    }
});
$("#careerOptions li").click(function(event) {
    $(".career").html($(event.target).html());
    $(".career").attr("data-value", $(event.target).attr("data-value"));
    $(".career").removeClass("red");
    $(".mask").hide();
    $(".layer").hide();
    if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
        saveData.dbaseInfo.vocCode = $(event.target).attr("data-value");
    }
});

function queryBasicCustomerInfo() {
    var url = App.projectNm + "/customer_info/query_basic_customer_info?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var basicUserInfo = result.body.basicUserInfo;
            if(basicUserInfo != undefined &&　basicUserInfo != null){
                invTp = basicUserInfo.invtp;
                invNm = basicUserInfo.invnm;
                idTp = basicUserInfo.idtp;
                idNo = basicUserInfo.idno;
                if(idTp != '0' && idTp != '5'){
                    var sexList = [{"code":"0", "desc": "女"}, {"code":"1", "desc": "男"}];
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
                                if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
                                    sexList.forEach(function (item) {
                                        if(val.valueText == item.desc){
                                            saveData.dbaseInfo.sex = item.code;
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
                    sex = '0';
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
                    $(".idno-pic-st").html("立即上传");
                    $(".upload-idno-arrow").show();
                    $(".upload-idno-pic").click(function (){
                        if(navigator.userAgent.indexOf('htfxjb') > -1){
                            if(idTp == '0'){
                                window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto";
                            } else {
                                window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhotoOther&idTp=" + idTp;
                            }
                        } else {
                            window.location.href = "./idCardUpdate.html";
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
                    nation = '156';
                    $(".li-nationality-region input").val("中国");
                }
				
                if(basicUserInfo.nationalityModifiable){
                    initNation(basicUserInfo.nation);
                } else {
                    $(".survey_nations").attr("readonly", true);
                    $(".nation_arrow").hide();
                }

                $(".idCard").html(displayIdNo);
                var availabledate = basicUserInfo.availabledate;
                var idNoValiDate = availabledate;
                if(App.isEmpty(availabledate)) {
                    idNoValiDate = getDate();
                    availabledate = idNoValiDate.substr(0, 4) + '年' + idNoValiDate.substr(-4, 2) + '月' + idNoValiDate.substr(-2, 2) + '日';
                } else if (availabledate.indexOf("永久") > -1 || availabledate.indexOf("长期") > -1){
                    idNoValiDate = "20991231"
                    availabledate = availabledate;
                } else if (App.isNotEmpty(availabledate)){
                    if(availabledate.indexOf("2099") > -1 || availabledate.indexOf("9999") > -1){
                        availabledate = '长期有效';
                    }else{
                        availabledate = availabledate.substr(0,4) + '年' + availabledate.substr(-4,2) + '月' + availabledate.substr(-2,2) + '日';
                    }
                }
                var sDate = new Date(idNoValiDate.substr(0,4),idNoValiDate.substr(-4,2) - 1,idNoValiDate.substr(-2,2));
                var eDate = new Date(new Date().toLocaleDateString());
                if(sDate.getTime() < eDate.getTime()){
                    $(".gap").html("证件有效期过期，请修改");
                    isValidDate = false;
                }

                if(App.isNotEmpty(basicUserInfo.idno) && (basicUserInfo.idtp == '0' || basicUserInfo.idtp == '5')){
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
                var address = provinceName + ' ' + basicUserInfo.cityname + ' ' + basicUserInfo.area;
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

                var dbaseInfo = {"idVailDate": idNoValiDate, "branchCode": "247", "accpMd":"4",
                    "vocCode": App.isEmpty(basicUserInfo.voccode) ? "21" : basicUserInfo.voccode,"nation":nation,
                    "nationality":nation,"invTp":invTp,"invNm":invNm,"idTp":idTp,"idNo":idNo, "sex": App.isEmpty(sex) ? "1" : sex};

                if(App.isEmpty(provinceName)){
                    dbaseInfo.provinceCode = '31';
                    dbaseInfo.cityName = '上海市';
                    dbaseInfo.deliverAddr = '上海市 浦东新区';
                }
                if(App.isEmpty(basicUserInfo.addr)){
                    if(App.isNotEmpty(basicUserInfo.area)){
                        dbaseInfo.deliverAddr = basicUserInfo.area;
                    } else {
                        dbaseInfo.deliverAddr = '市区';
                    }
                }
                saveData.dbaseInfo = dbaseInfo;
                if(App.isEmpty(taxIdentityDesc)){
                    var taxInfo = {"onlyChinaTaxResident": true};
                    saveData.taxInfo = taxInfo;
                }

            }

        }
    });
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
                        if(saveData.dbaseInfo != undefined && saveData.dbaseInfo != null){
                            saveData.dbaseInfo.nation = o.nationCode;
							saveData.dbaseInfo.nationality = o.nationCode;
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
    var url = App.projectNm + "/customer_info/query_sales_applica_detail?r=t" + (Math.random() * 10000).toFixed(0);
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

            saveData.fxqInfo = txqInfo;
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
    var dbaseInfo = saveData.dbaseInfo;
    if(dbaseInfo != undefined && dbaseInfo != null){

        if(App.isEmpty(dbaseInfo.nation)){
            alertTips("请先选择国籍");
            return;
        }
        if(!isValidDate){
            alertTips("证件有效期过期，请修改");
            return;
        }

        if(age < 46 &&
            (dbaseInfo.idVailDate == '20991231' || dbaseInfo.idVailDate == '99991231'|| dbaseInfo.idVailDate == "永久" || dbaseInfo.idVailDate == "长期")){
            $(".gap").html("不满46周岁证件有效期不可设置为长期有效，请修改");
            alertTips("不满46周岁证件有效期不可设置为长期有效，请修改");
            return;
        }

        if (App.isEmpty(dbaseInfo.idVailDate)){
            alertTips("请先选择证件有效期");
            return;
        }
        if (App.isEmpty(dbaseInfo.vocCode)){
            alertTips("请先选择职业");
            return;
        }
    } else {
        alertTips("基础信息填写不完善");
        return;
    }

    var url = App.projectNm + "/customer_info/query_basic_customer_info?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var basicUserInfo = result.body.basicUserInfo;
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
                    alertTips("请上传证件照片", "上传证件", function(){
                        if(navigator.userAgent.indexOf('htfxjb') > -1){
                            window.location.href = "htffundxjb://action?type=accountDetail&subType=uploadPhoto";
                        } else {
                            window.location.href = "./idCardUpdate.html";
                        }
                    });
                    return;
                }
				var diligence = $(".due-diligence").html();
				if(diligence == "中国税收居民"){
					var data = { "onlyChinaTaxResident":"1" };
					var url = App.projectNm + "/customer_info/add_cust_tax_info";
					App.post(url, JSON.stringify(data), null, function (result) {
						
					});
				}


                var url_confirm = "/icif/v1/blacks/aml-cleans/confirm";
                var confirm_data = {"accptMd":"MOBILE","branchCode":"247"};
                App.post(url_confirm, JSON.stringify(confirm_data), null, function (result1) {

                    var url = "/icif/v1/pcusts/modify-pcust-counter";
                    App.put(url, JSON.stringify(saveData), function (result3) {
                        // add by MZ 20200203 S
                        $("div.row p,div.row input").css('color','#666');
                        if(result3.returnCode == 9998){
                            if(result3.returnMsg.indexOf('证件有效期不') > -1 ){
                                $(".idCardValidDate.mbsc-comp").css('color', 'red');
                                $(".idCardValidDate.mbsc-comp").siblings('p').css('color','red');
                            }
                        }
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
                            var forwardUrl = App.getUrlParam("forwardUrl");
                            if(App.isEmpty(forwardUrl)){
                                window.location.href = "../wezhan/service.html";
                            } else {
                                window.location.href = forwardUrl;
                            }
                        }
                    });
                });
            }

        }
    });

	
	
}