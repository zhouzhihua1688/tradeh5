$(function(){
    // var url = App.projectNm + "/customer_info/query_basic_customer_info";
    var url = "/mobile-bff/v1/customerInfo/basic-customer-info";

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var custInfo = result.body;
            if(App.isNotNull(custInfo)){
                var basicUserInfo = custInfo.buserInfo;
                if(App.isNotNull(basicUserInfo)){
                    $("#name").html(basicUserInfo.invnm);
                    var idnoTxt;
                    if (App.isNotEmpty(basicUserInfo.idno)){
                        idnoTxt = basicUserInfo.idno.substr(0,3) + '****' + basicUserInfo.idno.substr(basicUserInfo.idno.length - 4, 4);
                        if(basicUserInfo.idtp == 'M'){
                            idnoTxt = '未认证';
                            isOpen = true;
                        }else if(basicUserInfo.idtp == '0'){
                            idnoTxt += '(身份证)';
                        }else if (basicUserInfo.idtp == '1'){
                            idnoTxt += '(护照)';
                        }else if (basicUserInfo.idtp == '2'){
                            idnoTxt += '(军官证)';
                        }else if (basicUserInfo.idtp == '3'){
                            idnoTxt += '(士兵证)';
                        }else if (basicUserInfo.idtp == '4'){
                            idnoTxt += '(港澳居民来往内地通行证)';
                        }else if (basicUserInfo.idtp == '5'){
                            idnoTxt += '(户口本)';
                        }else if (basicUserInfo.idtp == '6' || basicUserInfo.idtp == 'B'){
                            idnoTxt += '(外国人永久居留证)';
                        }else if (basicUserInfo.idtp == '7'){
                            idnoTxt += '(其他类型)';
                        }else if (basicUserInfo.idtp == '8'){
                            idnoTxt += '(文职证)';
                        }else if (basicUserInfo.idtp == '9'){
                            idnoTxt += '(警官证)';
                        }else if (basicUserInfo.idtp == 'A'){
                            idnoTxt += '(台胞证)';
                        }else if (basicUserInfo.idtp == 'F'){
                            idnoTxt += '(基金账号)';
                        }
                    }
                    if(App.isNotEmpty(basicUserInfo.availabledate)){
                        setIdnoValidDate = false;
                        $("#idnoValidDate").removeClass("red");
                        if(basicUserInfo.availabledate.indexOf("9999") > -1 || basicUserInfo.availabledate.indexOf("2099") > -1){
                            $("#idnoValidDate").html("长期有效");
                        }else {
                            $("#idnoValidDate").html(App.formatDateStr(basicUserInfo.availabledate));
                        }
                    }
                    $("#idno").html(idnoTxt);
                    if(App.isNotEmpty(basicUserInfo.mobileno)){
                        $("#mobile").html(basicUserInfo.mobileno.substr(0,3) + '****' + basicUserInfo.mobileno.substr(basicUserInfo.mobileno.length - 4, 4));
                    }
                }
            }

        }
    });

    App.get('/mobile-bff/v1/config/biz-config', null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            queryTimes = result.body.icifiPidtAccountOpenQueryTimes;
            queryInterval = result.body.icifPidtAccountOpenQueryInterval;
        }
    });
    queryCardCount();

    //查询是否开户
    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var isOpenPITD = result.body.isOpenPITD;
            if(isOpenPITD == 'N'){
                isOpen = true;
            } else {
                $(".open-btn").hide();
            }

        }
    });

    $(".open-btn").click(function () {
        // console.log(isOpen);
        if (isOpen) {
            if(!$(".chose-icon").hasClass("current")){
                alertTips('<div style="line-height: 1.5;">请先阅读风险揭示书</div>');
                return;
            }
            openAccount();
        }
    });
});
var isOpen = false;
var queryTimes = 1;
var queryInterval = 1000;
var tempTimes = 0;
var eId;
var setIdnoValidDate = true;
var bindingCardFlag = false;
var serialNo = '';

function queryCardCount() {

    var url = App.projectNm + "/account/bank_card_count?r=" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            if(result.body.bankCardCount == 0){
                bindingCardFlag = true;
            }
        }
    });
}

function openAccount() {
    if(bindingCardFlag){
        $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
        $(".bind_card_tip").show();
        return;
    }
    if(setIdnoValidDate){
        alertTips('<div style="line-height: 1.5;">请您先填写身份证有效期</div>');
        return;
    }
    var url = '/icif/v1/pitdaccts';
    var accptMd ="WAP";
    if(isApp()){
        accptMd="MOBILE";
    }
    var data = {"accptMd":accptMd, "branchCode":"247"};
    App.post(url, JSON.stringify(data), null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            tempTimes = queryTimes;
            serialNo = result.body;
            queryStatus();
        }
    });
}

function queryStatus() {
    if (tempTimes > 0){
        App.get('/icif/v1/pitdaccts/app-status?serialNo=' + serialNo, null, function (result) {
            if (result.body != undefined && result.body != null) {
                // console.log(result);
                var openPITDStatus = result.body.openPITDStatus;
                var openPITDErrorCode = result.body.openPITDErrorCode;
                if(openPITDStatus == 'Y'){
                    tempTimes = 0;
                    alertTips3('税延养老开户','<div style="line-height: 1.5;">您的税延养老账户已开通成功</div>', '确定', function () {
                        window.location.href = '../fund/my_tax_extension.html';
                    });
                    if(eId != undefined && eId != null) {
                        window.clearTimeout(eId);
                    }
                } else if(openPITDStatus == 'F') {
                    if(openPITDErrorCode == '1010'){
                        //跳到账户界面完善信息
                        alertTips('<div style="line-height: 1.5;">'+ result.body.openPITDErrorMsg +'</div>', '完善个人信息', function () {
                            window.location.href = 'userInfo.html';
                        });

                    }else {
                        alertTips3('税延养老开户失败','<div style="line-height: 1.5;">'+ result.body.openPITDErrorMsg +'</div>', '确定');
                        if(eId != undefined && eId != null) {
                            window.clearTimeout(eId);
                        }
                    }
                } else {
                    if(tempTimes == 1){
                        alertTips3('税延养老开户失败','<div style="line-height: 1.5;">网络超时，请稍后重试</div>', '确定');
                        if(eId != undefined && eId != null) {
                            window.clearTimeout(eId);
                        }
                    } else {
                        tempTimes--;
                        eId = setTimeout(queryStatus, queryInterval);
                    }
                }
            }
        });
    }else {
        if(eId != undefined && eId != null) {
            window.clearTimeout(eId);
        }
    }
}

$(".rules").click(function(){
    $(".chose-icon").toggleClass("current");
});
$(".close_tip").click(function () {
    $(this).parents(".risk_confirm_tip").hide();
    $(this).parents(".tip2").hide();
    $(this).parents(".tip3").hide();
});