var fundId = App.getUrlParam("fundId");

$(function () {
    
    renderingPage();

});

function queryYieldTrendInfo(type, btn_index) {
    var selectedTimePeriod = "m1";
    if(btn_index == 0){
        selectedTimePeriod = "m1";
    } else if(btn_index == 1){
        selectedTimePeriod = "m3";
    } else if(btn_index == 2){
        selectedTimePeriod = "m6";
    } else if(btn_index == 3){
        selectedTimePeriod = "m12";
    }else {
        selectedTimePeriod = "all";
    }

	var branchNo = App.getSession("branchCode_"+fundId);			
	var tradeAcco = App.getSession("tradeAcco_"+fundId);
	var url = App.projectNm + "/fund/query_yield_trend_info_new?branchNo="+ branchNo +"&r=" + (Math.random()*10000).toFixed(0) + "&periodType=" + selectedTimePeriod;
	if(App.isNotEmpty(fundId)){
		url += "&fundId=" + fundId;
	}
	if(App.isNotEmpty(tradeAcco)){
		url += "&tradeAcco=" + tradeAcco;
	}
    
}

function renderingPage() {
    var item = App.getSession(App.selectedFund);
    if(item != undefined && item != null) {

        queryFundDetail();
        		
		App.get(item.api,null,function(result){
			var item2 = result.body;

            $(".transfer").parent("li").css('background', '#c6c6c6');
            $(".transfer").parent("li").css('border-right', 'none');
            $(".transfer").css('color','#fff');
            $(".transfer").unbind("click");

			if(item2.isDirect == "0"){
				$(".redeem").parent("li").css('background', '#c6c6c6');
				$(".redeem").parent("li").css('border-right', 'none');
				$(".redeem").css('color','#fff');
				$(".redeem").unbind("click");
			}else{
                if(item2.canRedeemAble == "N"){
                    $(".redeem").parent("li").css('background', '#c6c6c6');
                    $(".redeem").parent("li").css('border-right', 'none');
                    $(".redeem").css('color','#fff');
                    $(".redeem").unbind("click");
                }else{
                    $(".redeem").attr("href", "../fund/financial_fund_redeem.html?fundId=" + fundId);
                }
				
			}

            $(".get-fund-information").click(function () {

                //window.location.href = "../trade/tradeList.html?productId="+fundId+"&tradeAcco="+item2.tradeAcco;
                window.location.href = "../fund/steadyCombination.html?fundId="+fundId
            });

            $(".query-current-profit").click(function () {

                window.location.href = "../fund/currentProfitList.html?productId="+fundId+"&tradeAcco="+item2.tradeAcco;
            });

			
            $(".query-product-trade-record").click(function () {

                window.location.href = "../trade/tradeList.html?productId="+fundId+"&tradeAcco="+item2.tradeAcco;
            });

            $(".setRedeem").click(function () {

                // window.location.href = "../trade/tradeList.html?productId="+fundId+"&tradeAcco="+item2.tradeAcco;
                // '/mobileEC/wap/fund/financial_fund_holding_detail.html?fundId='+productId;
                window.location.href = "../fund/financial_fund_redeem.html?fundId="+fundId;
            });

            //问号提示
            $(".icon-question1").click(function () {
                $.get("/mobile-bff/v1/financial/redeem-type-tips",function(result){
                    popWords = result.body["redeemTypeTips"];
                    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(popWords)
                    $(".Bomb-box1").show();  
                });
              
            })
			
			// $("title").html(item2.fundName);
			App.setSession("branchCode_"+item2.fundId,item2.branchCode);
			App.setSession("tradeAcco_"+item2.fundId,item2.tradeAcco);

			if(item2.navDate && item2.navDate.length == 8){
                $("#navDt").html(item2.navDate.substring(0, 4) + "." + item2.navDate.substring(4, 6) +"." + item2.navDate.substring(6, 8));
				// $("#navDt").html(item2.navDate.substring(4, 6) + "-" + item2.navDate.substring(6, 8));
			}
			if(item2.navDt && item2.navDt.length == 8){
				$("#navDt").html(item2.navDt.substring(4, 6) + "." + item2.navDt.substring(6, 8));
			}			
			if(item2.yieldDate && item2.yieldDate.length == 8){
				$("#navDt").html(item2.yieldDate.substring(4, 6) + "." + item2.yieldDate.substring(6, 8));
			}

            if(item2.carryDate == null){
                $("#carryDate").html('--');
            }else{
                $("#carryDate").html(item2.carryDate.substring(0,4)+'.'+item2.carryDate.substring(4,6)+'.'+item2.carryDate.substring(6,8));
            }

            if(item2.financialDesc == null){
                $("#prompt1").html('--');
            }else{
                $("#prompt1").html(item2.financialDesc);
            }
           
			setVal("#unionBalance", item2.marketValue  == 0 ? "0.00" : item2.marketValue );
			setVal("#avaliable", item2.availableQuty  == 0 ? "0.00" : item2.availableQuty );
            //setVal("#carryDate", item2.carryDate  == 0 ? "0.00" : item2.carryDate);
            //setVal("#carryDate", item2.carryDate  == 0 ? "0.00" : item2.carryDate );
            setVal("#carryTotalProfit", item2.carryTotalProfit  == 0 ? "0.00" : item2.carryTotalProfit );


			if(item2.melonMd  == "0"){
				$("#melonmd").html("红利再投");
			} else if(item2.melonMd  == "-1"){
				$("#melonmd").html("请至代销机构处查询");
			} else {
				$("#melonmd").html("现金分红");
			}


			var partRedeemQuty4AR= item2.partRedeemQuty4AR;
			if(item2.redeemType   == "AUTO_HOLD"){
				$("#redeemType").html("自动续期");
			} else if(item2.redeemType  == "AUTO_REDEEM"){
				// $("#redeemType").html("自动赎回("+partRedeemQuty4AR+"份)");
                $("#redeemType").html("自动赎回"+ (partRedeemQuty4AR>0 ?"("+partRedeemQuty4AR+"份)":''));

			} else {
				$("#redeemType").html("未设置");
			}
			
			queryYieldTrendInfo($(".tab1 li.active").index(), $(".tab2 li.active").index());
		});
		

    }
}

function queryFundDetail() {
 
    // var url = App.projectNm + "/fund/fund_detail_info?r=" + (Math.random()*10000).toFixed(0);
    // if(App.isNotEmpty(fundId)){
    //     url += "&fundId=" + fundId;
    // }
    var url =  "/mobile-bff/v1/fund/detailInfo";
    var data = JSON.stringify({
        "fundId": fundId
    });

    App.post(url,data,function(result){
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var fundInfo = result.body;
            var fundName = fundInfo.fundNm;
            var fundId = fundInfo.fundId;
			$("#nav").html(fundInfo.nav);
			App.transferColor("#nav", "color_green", "color_red");

            $(".currency-type").html(fundInfo.currencyTypeUnit);
            $("#view_fundNmId").html("<span id= 'fundName'>"+fundName + " </span>"+fundId);

            if(fundInfo.canPurchase == '0'){
                $(".buy").parent("li").css('background', '#c6c6c6');
                $(".buy").unbind("click");

            } else if(fundInfo.canMip == '0'){
				if(fundInfo.canPurchase == '1'){
					$(".buy").attr("href", "../fund/financialPayment.html?fundId=" + fundId);
				}
            } else {
                $(".buy").attr("href", "../fund/financialPayment.html?fundId=" + fundId);
            }
            if(fundInfo.canPurchase == '0'){
                $(".buy").parent("li").css('background', '#c6c6c6');
                $(".buy").unbind("click");

            }
			if(fundInfo.isDirect == "0"){
				$(".redeem").parent("li").css('background', '#c6c6c6');
				$(".redeem").parent("li").css('border-right', 'none');
				$(".redeem").css('color','#fff');
				$(".redeem").unbind("click");
			}else{
                if(fundInfo.canRedeemAble == "N"){
                    $(".redeem").parent("li").css('background', '#c6c6c6');
                    $(".redeem").parent("li").css('border-right', 'none');
                    $(".redeem").css('color','#fff');
                    $(".redeem").unbind("click");
                }else{
                    $(".redeem").attr("href", "../fund/financial_fund_redeem.html?fundId=" + fundId);
                }
				
			}
        }
    });
}

function setVal(field, val, unit) {
    $(field).html(App.formatMoney(val) + (unit == undefined || unit == null ? "" : unit));
}


$(".Bomb-box-ok").click(function () {
    $(this).parent().parent().hide();
})



