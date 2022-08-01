//理财赎回设置
var fundId = App.getUrlParam("fundId");
var redeemList = [{"code":"0", "desc": "自动续期"}, {"code":"1", "desc": "自动赎回"}];

var balanceSerialNo = '';
var largeFlg = "0";

var avaliableQuty= '0.00';
var fundId = '0';
var serialNo = '0';
var redeemQuty = '0.0';
var redeemType= ''
var carryDate = ''
var custNo = ''
var partRedeemQuty4AR = ''
var balanceQuty = 0;

function queryFundDetail() {
    var item = App.getSession(App.selectedFund);
	App.get(item.api,null,function(result){
		var item2 = result.body;

		if(item2 != undefined && item2 != null) {
			avaliableQuty = App.formatMoney(item2.availableQuty);
			fundId = item2.fundId;
			serialNo = item2.serialNo;
			carryDate= item2.carryDate;
			custNo = item2.custNo;
			partRedeemQuty4AR = item2.partRedeemQuty4AR.toString();
			balanceQuty = item2.balanceQuty;

			if(item2.redeemType   == "AUTO_HOLD"){
				redeemType = 'AH'
				$("#tl").html("自动续期");
				$("#prompt1").hide();
				$(".content2").hide();
			} else if(item2.redeemType  == "AUTO_REDEEM"){
				redeemType = 'AR'
				$("#tl").html("自动赎回");
				$("#subQuty").val(partRedeemQuty4AR);
				//20220413 赎回金额大于0时显示，小于0时隐藏
				if(item2.balanceQuty>0){
					$("#delete").show();
					$("#prompt1").show();
					$(".content2").show();
				}

			} else {
				$("#tl").html("未设置");
			}

            // if(item2.financialDesc == null){
            //     $("#prompt2").html('--');
            // }else{
            //     $("#prompt2").html(item2.financialDesc);
            // }

			if(carryDate == null)
			{
				if(item2.financialDesc == null){
					$("#prompt2").html('');
				}else{
					$("#prompt2").html(item2.financialDesc);
				}
			}

			var url = '/mobile-bff/v1/fund/financial-redeem-tips?fundSerialNo=' + serialNo;
			url += "&carryDate=" + carryDate;
			url += "&avaliableQuty=" + Number(avaliableQuty.replace(/,/g,""));
	
			$.get(url,function(result){
				console.log(result.body)
				autoRedeemTip = result.body["autoRedeemTip"];
				if(autoRedeemTip != null){
					$("#prompt1").html(autoRedeemTip);
				}
				dueDateTip = result.body["dueDateTip"];
				if(dueDateTip != null && carryDate != null){
					$("#prompt2").html(dueDateTip);
				}
			})
			
		}
	});
}

$(function () {    
    renderingPage();
});

function renderingPage() {
    var item = App.getSession(App.selectedFund);
    if(item != undefined && item != null) {
        queryFundDetail();
	}
}


function alertTips(text){
    $(".Bomb-box-tips").html(text);
    $(".Bomb-box-content p").html("");
	$(".Bomb-box-content").hide();
    $(".Bomb-box").show();
}

$("#selectGift1").click(function(){
	$("#myGift1").show();
	$(".mask").show();
})

$(".titleClose").click(function(){
	$("#myGift1").hide();
	$(".mask").hide();
})

$("#delete").click(function(){
	$("#subQuty").val("");
	$("#delete").hide();
})

$(".giftlist a").on("click",function(event){
		$("#tl").html($(this).children(".title").html());
		// $("#largeRedeemFlag").val($(this).children(".title").attr('data'));
	    $("#myGift1").hide();
	    $(".mask").hide();
		if($(this).children(".title").text() == '自动续期'){
			$("#prompt1").hide();
			$(".content2").hide();
		} else if($(this).children(".title").text() == '自动赎回' && balanceQuty>0){
			$("#prompt1").show();
			$(".content2").show();
		}
	})

//提交赎回按钮事件
$("#btn-submit").click(function(){
	
	if ($("#tl").html() == '自动续期')
	{
		redeemType = 'AH';
		// var url = '/mobile-bff/v1/financial/set-redeem-type?custNo=' + custNo;
		var url = '/mobile-bff/v1/financial/set-redeem-type';
		var data = {'avaliableQuty':avaliableQuty.replace(/,/g,""), 'fundId':fundId, 'fundSerialNo':serialNo, 'redeemQuty':redeemQuty.replace(/,/g,""), 'redeemType':redeemType};
		utils.post(url,JSON.stringify(data), null, function (result) {
			App.setSession(App.serialNo_info, result.body.info);
			App.setSession(App.serialNo, result.body.serialNo);
			App.setSession(App.serialNo_success_show_data, data);
			App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/redeemsuccess.html?type=set");
			// // window.location.href = "../common/setPassword.html";
			// utils.verifyTradeChain(result.body);
			console.log(result.body);
			utils.verifyTradeChain(result.body);
		});
	}

	if($("#tl").html() == '自动赎回')
	{
		
		var amt = $("#subQuty").val().replace(/[,A-z]/g, '')

		if(Number($("#subQuty").val().replace(/,/g,"")) <= 0 && balanceQuty>0){
			alertTips("赎回金额应大于0");
			return;		
		}

		if(Number(avaliableQuty.replace(/,/g, "")) < Number(amt)){
			alertTips("不能超过最大赎回"+avaliableQuty.replace(/,/g, "")+"份");
			return;	
		}

		if(amt.indexOf('.') > -1){//带小数
			if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number(amt))){
	
			}else{
				$("#subQuty").val(amt.substr(0,amt.indexOf('.')+3));
			}

		redeemType = 'AR';
		redeemQuty = $("#subQuty").val().replace(/,/g,"");
		var url = '/mobile-bff/v1/financial/set-redeem-type';
		avaliableQuty= avaliableQuty.replace(/,/g,"")
		var data = {'avaliableQuty':avaliableQuty, 'fundId':fundId, 'fundSerialNo':serialNo, 'redeemQuty':redeemQuty, 'redeemType':redeemType};
		utils.post(url,JSON.stringify(data), null, function (result) {
			App.setSession(App.serialNo_info, result.body.info);
			App.setSession(App.serialNo, result.body.serialNo);
			App.setSession(App.serialNo_success_show_data, data);
			App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/redeemsuccess.html?type=set");
			// window.location.href = "../common/setPassword.html";
			utils.verifyTradeChain(result.body);
		});

		}else if(/^[0-9]+?$/.test(String(amt)) || (amt == '' && balanceQuty == 0)){	
			redeemType = 'AR';
			redeemQuty = $("#subQuty").val().replace(/,/g,"");
			var url = '/mobile-bff/v1/financial/set-redeem-type';
			avaliableQuty= avaliableQuty.replace(/,/g,"")
			var data = {'avaliableQuty':avaliableQuty, 'fundId':fundId, 'fundSerialNo':serialNo, 'redeemQuty':redeemQuty, 'redeemType':redeemType};
			utils.post(url,JSON.stringify(data), null, function (result) {
				App.setSession(App.serialNo_info, result.body.info);
				App.setSession(App.serialNo, result.body.serialNo);
				App.setSession(App.serialNo_success_show_data, data);
				App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/redeemsuccess.html?type=set");
				// window.location.href = "../common/setPassword.html";
				utils.verifyTradeChain(result.body);
			});
			
		}
		
		else{
			alertTips("金额格式有误");
			return;
		}


		// redeemType = 'AR';
		// redeemQuty = Number($("#subQuty").val().replace(/,/g,""));
		// var url = '/mobile-bff/v1/financial/set-redeem-type';
		// var data = {'avaliableQuty':avaliableQuty, 'fundId':fundId, 'fundSerialNo':serialNo, 'redeemQuty':redeemQuty.toString(), 'redeemType':redeemType};
		// utils.post(url,JSON.stringify(data), null, function (result) {
		// 	App.setSession(App.serialNo_info, result.body.info);
		// 	App.setSession(App.serialNo, result.body.serialNo);
		// 	App.setSession(App.serialNo_success_show_data, data);
		// 	App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/redeemsuccess.html");
		// 	// window.location.href = "../common/setPassword.html";
		// 	utils.verifyTradeChain(result.body);
		// });
	}

});

$("#subQuty").on("input", function () {
	
	var amt = $("#subQuty").val().replace(/[,A-z]/g, '');
	$("#delete").show();
	if(amt.indexOf('.') > -1){//带小数
		if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number(amt))){

		}else{
			$("#subQuty").val(amt.substr(0,amt.indexOf('.')+3));
		}
		
	}else if(/^[0-9]+?$/.test(String(amt))){		
		
	}else{
		alertTips("金额格式有误");
		return;
	}
	if(Number(avaliableQuty.replace(/,/g, "")) < Number(amt)){
		// alertTips("不能超过最大赎回"+avaliableQuty.replace(/,/g, "")+"份");
		// return;	
	}
});


$("#all").click(function(){
	$("#subQuty").val(avaliableQuty);
	$("#delete").show();
});

	$("#close").click(function(){  //删值
	$("#subQuty").val("");
	})

$('.tips span').eq(0).on('click', function () {//关闭弹窗
	$('.tips').hide()

})

            
$(".Bomb-box-ok").click(function () {
	$(".Bomb-box").hide();
});


$(".close_button").click(function(){ 
    $("#myGift").hide();
    $(".mask").hide();
});
