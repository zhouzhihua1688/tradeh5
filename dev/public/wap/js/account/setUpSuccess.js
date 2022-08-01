$(function() {
	if(utils.getCookie('channelCode') != 'airstar' || utils.getCookie('channelCode') != 'zhengtong'){
		$('.text-center').show();
	}
    var data = App.getSession(App.serialNo_success_show_data);
    if (data.contractno != undefined) {
        $(document).attr("title", "修改成功");
        $("#successTxt").html("修改成功")
    } else {
        $(document).attr("title", "设置成功");
        $("#successTxt").html("设置成功")
    };
    var cards = App.getSession(App.cards);
    for (var index in cards) {
        var card = cards[index];
        if (data.bankNo == card.bankNo && data.bankAcco == card.bankAcco) {
            $("#bankCardInfo").html(card.bankName + "(" + card.bankAccoDisplay + ")");
            break
        }
    };
    $("#date").html(tranMipCycle(data.mipCycle) + tranMipBuyday(data.mipCycle, data.mipBuyday));
    $("#amt").html(App.numberFormat(data.mipBuyAmt));
    $("#successInfo").html(App.getSession(App.successInfo))
    	
    	
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
		dataMap["reminderType"] = reminderType;
		dataMap["fundIdToFundRiskLevelMap"]= dataMap2;
		dataMap["agreementIds"] = App.getSession("auto_agreementIds");
	    // var url = "/mobileEC/services/common/customer_risk_leave_mark";
		var url = "/mobile-bff/v1/common/customer-risk-leave-mark"
	    App.post(url,JSON.stringify(dataMap), null, function(result) {
	        var body = result.body;
	        if (body != null && body != undefined) {

	        }
	    });
	}
	queryTips();
    	
});