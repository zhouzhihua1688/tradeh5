var branchNo = '247';
var tradeAcco = '';

//赋值
function queryFundDetail() {
    var item = App.getSession(App.selectedFund);
	App.get(item.api,null,function(result){
		var item2 = result.body;

		if(item2 != undefined && item2 != null) {
			branchNo = item2.branchCode;
			document.title = item2.fundName;
			$("#fundId").val(item2.fundId);
			$("#title").html(item2.fundName);
			$("#shareType").val( item2.shareType);
			$("#currencyType").val(item2.currencyType);
			tradeAcco = item2.tradeAcco;
			$("#unionBalance").html(item2.marketValue == 0 ? "0.00" : App.formatMoney(item2.marketValue));
			$("#balance").html(item2.balanceQuty == 0 ? "0.00" : App.formatMoney(item2.balanceQuty));
			$("#avaliable").html(item2.availableQuty == 0 ? "0.00" : App.formatMoney(item2.availableQuty));
		}
	});
}
queryFundDetail();
queryDate();

//查询到账日期
function queryDate(){
	var url = "/mobile-bff/v1/fund/fund-redeem-date?cashFrm=V&fundId="+App.getUrlParam("fundId");
	App.get(url,null,function(result){
		if (result.body != undefined && result.body != null){
			$("#date").html(result.body.remark);
			$("#date").children("font").removeAttr("size");
		}
	});	
}
$(function(){
	$("#tradeRule").attr("href","https://www.99fund.com/main/products/pofund/"+App.getUrlParam("fundId")+"/h5traderule.shtml");
    var windowHeight = $(window).height(),
        footerHeight = $(".footer-tips").height(),
        contentHeight = $(".content").height();
    if(contentHeight > windowHeight -60){
        $(".footer-tips").css({
            "marginTop": "1rem",
            "opacity": 1
        })
    }else{
        $(".footer-tips").css({
            "position": "absolute",
            "top":  windowHeight- footerHeight,
            "marginTop": "0",
            "opacity": 1
        })
    }
	

	$("#fast").click(function(){
		$("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "")-10));
		$(".first").hide();
	});
	$(".two").click(function(){console.log($("#avaliable").html());
		$("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "")/2));
		$(".first").hide();
	});
	$(".third").click(function(){console.log($("#avaliable").html());
		$("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "")/3));
		$(".first").hide();
	});
	

});

$(".Bomb-box-ok").click(function () {
    $(".Bomb-box").hide();
});



$(".giftlist a").on("click",function(event){
	$("#tl").html($(this).children(".title").html());
	$("#largeRedeemFlag").val($(this).children(".title").attr('data'));
    $("#myGift1").hide();
    $(".mask").hide();
})


$(".close_button").click(function(){ 
    $("#myGift").hide();
    $(".mask").hide();
});
// 清楚input框
$(".clearInput").click(function(){
    $(this).siblings("input").val("").trigger("input");
});

function valide(isAlert){
    var inputs = $("input");
    for(var i=0; i<inputs.length; i++){
        var input = inputs.eq(i);
        if(input.val() == ""){
            var msg = input.attr("data-rquire-msg");
            if(msg == undefined){continue;}
            isAlert == "needless" || alertTips(input.attr("data-rquire-msg"));
            return false;
        }
    }
    return true;
}

$("#subQuty").on("input", function () {
	var amt = $("#subQuty").val().replace(/[,A-z]/g, '');
	
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
	if(Number($("#avaliable").html().replace(/,/g, "")) < Number(amt)){
		alertTips("不能最大赎回金额"+$("#avaliable").html().replace(/,/g, "")+"元");
		return;	
	}
});
function alertTips(text){
    $(".Bomb-box-tips").html(text);
    $(".Bomb-box-content p").html("");
    $(".Bomb-box").show();
}

    $("#selectGift1").click(function(){
        $("#myGift1").show();
        $(".mask").show();
    })
    $("#close").click(function(){
        $("#myGift1").hide();
        $(".mask").hide();
    })
    //提交赎回按钮事件
    $("#submit_btn").click(function(){
		if(Number($("#subQuty").val().replace(/,/g,"")) == 0){
			alertTips("赎回金额应大于0");
			return;
		}

		// var url = App.projectNm + "/fund/fund_redeem";
		var url = '/mobile-bff/v1/fund/fund-redeem';
		var data = {"fundId":$("#fundId").val(),"shareType":$("#shareType").val(),
	    "cashFrm":"V","subQuty":$("#subQuty").val().replace(/,/g,""),"largeRedeemFlag":$("#largeRedeemFlag").val(),
	    "currencyType":$("#currencyType").val(),"branchNo":branchNo,"bankNo":"","bankAcco":"","tradeAcco":tradeAcco};
		utils.post(url,JSON.stringify(data), null, function (result) {
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/redeemsuccess.html");
	    	// window.location.href = "../common/setPassword.html";
			utils.verifyTradeChain(result.body);
	    });
    });
    $("#all").click(function(){
    	$("#subQuty").val($("#avaliable").html());
		if(Number($("#avaliable").html().replace(/,/g, "")-10) > 0){
			$(".first").show();
		}
    });

     $("#close").click(function(){  //删值
	   $('.bifen div').each(function () {   //切换
			if ($(this).hasClass("active")) {
				$(this).removeClass('active');
			}
		   
		});
        $("#subQuty").val("");
     })

   $('.bifen div').click(function () {   //切换
        if ($(this).hasClass("active")) {
            return;
        }
        $(this).addClass("active").siblings().removeClass('active');
       
    });
    $('.tips span').eq(0).on('click', function () {//关闭弹窗
        $('.tips').hide()

    })
    $(".icon").click(function(){
    	$('.tips').show()
	})
	queryTips()
	function queryTips(){
	    var url = "/mobile-bff/v1/smac/tradeTips?sceneCode=02&r=" + (new Date()).getTime();
	    App.get(url, null, function(result) {
	        var body = result.body;
	        if (body != null && body != undefined) {
	        	if(App.isNotEmpty(body.tradeRules)){
		        	$(".tips_text").html(body.tradeRules);
		            App.bind("#viewMore", "tap", function() {
		                window.location.href = body.smacH5UpgradeJumpUrl;
		            })
		       	}else{
		       		$(".icon").hide();
		        	$(".tips").hide();
		       	}
	        } else {
	        	$(".icon").hide();
                $(".tips").hide();
            }
	    });
	}

function save(){
    $.ajax({
        url: '/mobile-bff/v1/financial/set-redeem-type',
        data: {
            fundId: fundId
        },
        method: 'POST',
		beforeSend:function(req){
			if(utils.getCookie('traceCode')){
				req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
			}
		},
        success: function (res) {
            var fundInfo = res.body;
            fundType = fundInfo.filterFundTp;
            callback(fundType);
        },
        finally: function(error){
            console.log(error)
        }
    }) 	
}