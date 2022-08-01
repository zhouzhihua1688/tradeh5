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
            $("#payType").html(info.payType == 'V' ? '现金宝' : '银行卡');
            $("#cycle").html(info.cycle == 'MM' ? '每月购买' : '单次购买');
            $("#payDate").html(info.cycle == 'MM' ? '每月' + Number(info.payDate) + '日' : dateFormat(info.payDate));
            $("#depositAmt").html(info.agreementId == '21' ? '自动足额购买' : info.payAmtDisplay);
            if(info.contractStatus == 'N'){
                $("#status").html('正常');
            } else if(info.contractStatus == 'C'){
                $("#status").html('已终止');
            } else if(info.contractStatus == 'P'){
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
            queryPurchaseInfo(result.body.isOpenPITD)
        }
    });
}
function queryCustomerInfo() {
    App.get(App.projectNm + "/customer_info/query_basic_customer_info", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            var custInfo = result.body;
            if(App.isNotNull(custInfo)){
                var basicUserInfo = custInfo.basicUserInfo;
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