$(function(){
    queryDetails();
    queryCustomerInfo();
    queryYLInfo();
});

function queryDetails() {
    var cno = App.getUrlParam("cNo");
    App.get("/ats-ng/v1/manage/contract-query/common-contractno?contractNo=" + cno, null, function (result) {
        if (result.body != undefined && result.body != null) {
            var info = result.body;
            $("#planName").html(info.contractDesc);
            $("#fundNm").html(info.fundName);
            $("#fundId").html(info.productId);
            $("#shareType").html(info.shareType == 'A' ? '前端收费' : '后端收费');
            if(info.payType == 'F'){
                $("#payType").html(info.sourceFundName + info.sourceFundId);
            } else {
                $("#payType").html(info.payType == 'V' ? '现金宝' : '银行卡');
            }
            $("#cycle").html(info.cycle == 'MM' ? '每月购买' : '单次购买');
            $("#payDate").html(info.cycle == 'MM' ? '每月' + Number(info.payDate) + '日' : App.formatDateStr(info.nextPayDate, 'yyyyMMdd'));
            $("#depositAmt").html(info.agreementId == '21' ? '自动足额购买' : info.payAmtDisplay);
            if(info.contractStatus == 'N'){
                $("#status").html('正常');
                $(".affirm").click(function () {pausePlan()});
            } else if(info.contractStatus == 'C'){
                $("#status").html('已终止');
            } else if(info.contractStatus == 'P'){
                $(".affirm").html('恢复计划');
                $(".affirm").click(function () {resumePlan()});
                $("#status").html('已暂停');
            } else if(info.contractStatus == 'A'){
                $("#status").html('已失效');
            }

        }
    });
}
function queryYLInfo() {
    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            if (result.body.isOpenPITD == 'Y'){
                var pitdInvestAcct = result.body.pitdInvestAcct;
                if (App.isNotNull(pitdInvestAcct)){
                    $("#purType").html(pitdInvestAcct.investAcct);
                }
            }
        }
    });
}
function queryCustomerInfo() {
    App.get("/mobile-bff/v1/customerInfo/basic-customer-info", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            var custInfo = result.body;
            if(App.isNotNull(custInfo)){
                var basicUserInfo = custInfo.buserInfo;
                if(App.isNotNull(basicUserInfo)){
                    if(App.isNotEmpty(basicUserInfo.mobileno)){
                        $("#mobile").html(basicUserInfo.mobileno.substr(0,3) + '****' + basicUserInfo.mobileno.substr(basicUserInfo.mobileno.length - 4, 4));
                    }
                }
            }

        }
    });
}
function dateFormat(date) {
    if(App.isEmpty(date)) return '';
    return date.substr(4,2) + '月' + date.substr(6,2) + '日';
}

$(".cancel").click(function () {
    cancelPlan();
});
function cancelPlan() {
    var data = {};
    data.contractNo = App.getUrlParam("cNo");
    var url = App.projectNm + "/fund/tax_pension_auto_pur_plan_cancel";
    App.post(url, JSON.stringify(data), null, function (result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../taxExtension/autoDepositPlanCancelSuccessfully.html");

        window.location.href = "../common/setPassword.html";
    });
}
function pausePlan() {
    var data = {};
    data.contractNo = App.getUrlParam("cNo");
    var url = App.projectNm + "/fund/tax_pension_auto_pur_plan_pause";
    App.post(url, JSON.stringify(data), null, function (result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../taxExtension/autoDepositPlanPauseSuccessfully.html");

        window.location.href = "../common/setPassword.html";
    });
}
function resumePlan() {
    var data = {};
    data.contractNo = App.getUrlParam("cNo");
    var url = App.projectNm + "/fund/tax_pension_auto_pur_plan_resume";
    App.post(url, JSON.stringify(data), null, function (result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../taxExtension/autoDepositPlanResumeSuccessfully.html");

        window.location.href = "../common/setPassword.html";
    });
}