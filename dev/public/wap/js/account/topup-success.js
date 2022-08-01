$(function() {
    App.queryHomePageInfo();
    $("#upgrade").click(function () {
        $("#fundBox").hide()
    });
    var data = App.getSession(App.serialNo_success_show_data);
    if (data == undefined || data == null) {
        $("#rechargeAmt").html("0.00")
    } else {
        $("#rechargeAmt").html(App.numberFormat(data.subAmt))
    };
    $("#revenueDate").html(App.getSession(App.revenueDate));
    $("#arrivalDate").html(App.getSession(App.arrivalDate));
    App.confirmBtnEvent(function () {
        App.bind(".back_btn", "tap", function () {
            var forwardUrl = App.getUrlParam("forwardUrl");
            if (App.isNotEmpty(forwardUrl)) {
                window.location = decodeURIComponent(forwardUrl);
            } else {
                window.location.href = '/tradeh5/newWap/myAssets/index.html';
            }
        })
    });
    queryUpgrade();
});

function queryUpgrade(){

    App.get("/mobile-bff/v1/smac/assetDetail", null, function (result) {
        if (result.body != undefined && result.body != null) {
            var upgradeFundVo = result.body.upgradeFundVo;
			if(upgradeFundVo){
				$(".dialogTitle").html(upgradeFundVo.dialogTitle);
				$(".dialogMessage").html(upgradeFundVo.dialogMessage);
				$(".dialogMessageJumpUrl").attr('href', upgradeFundVo.dialogMessageJumpUrl);
				$(".buttonName a").html(upgradeFundVo.buttonName);
				$(".buttonName a").attr('href', '../fund/convert.html');

				$(".holdingProductName").html(upgradeFundVo.holdingProductName);
				$(".holdYield").html(upgradeFundVo.holdYield + '%');
				$(".targetProductName").html(upgradeFundVo.targetProductName);
				$(".targetYield").html(upgradeFundVo.targetYield + '%');

				if(upgradeFundVo.canConvert || upgradeFundVo.canUpgrade){
					$("#fundBox").show();
				}
			}
        }
    });
}


//风险留痕
function queryTips(){
	var show_data = App.getSession(App.serialNo_success_show_data);
	var fundRiskLevel = App.getSession("fundRiskLevel");
	var fundId = App.getSession("risk_fundId");
	var reminderType = App.getSession("reminderType");
	var fundIdToFundRiskLevelMap = '{"'+fundId+'":"'+fundRiskLevel+'"}';
	var dataMap = {};
	var dataMap2 = {};
	dataMap2[fundId] = fundRiskLevel;
	dataMap["confirmStatus"]= 1;
	dataMap["agreementStatus"]= 1;
	dataMap["fundIdToFundRiskLevelMap"]= dataMap2;
	dataMap["reminderType"] = reminderType;
	dataMap["agreementIds"] = App.getSession("topup_agreementIds");
    // var url = "/mobileEC/services/common/customer_risk_leave_mark";
    var url = "/mobile-bff/v1/common/customer-risk-leave-mark"
    App.post(url,JSON.stringify(dataMap), null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {

        }
    });
}
queryTips();