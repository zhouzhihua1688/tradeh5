//从亲情宝跳来的购买
var arAcct = utils.getSession("_selectArAcct");//选择其他产品购买
var lowYield = "10.00";
var highYield = "0.50";
var high = minMipAmt;
var low = minMipAmt;
var weekdayArr1=[];
var weekdayArr2=[];
var alertHtml = '';
var cardsCount = 0;
var isChange = false;//是否调整过加码、减码金额
var isAlert = false;//是否弹过提示框
var contractno = App.getUrlParam("contractno"); //定投协议号
var redeemType = 0; //目标盈支持的止盈方式 
var targetAgreement = false;
getHtml();
$("#btn_sub").css({'background-color':'#ddd6d6'});
function getHtml(){
    var url = "/mobile-bff/v1/unification/query?keys=benefitPlaningStopTips";
    utils.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
        	alertHtml = result.body.benefitPlaningStopTips.unificationValue;
        }
    });
	
}


function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
	var fundId = App.getUrlParam("fundId");
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=" + fundId + "&tradeType=05&tradeScene=11" ;
	utils.get(url, null, function (result) {
		var payCards = result.body.bankInfos;
		var cards = payCards.filter(function(item){
			return item.bankGrpName != '现金宝';
		});
		App.setSession(App.cards, cards);
		if(App.isFunction(successFun)){
			eval(successFun).call(this);
		}
	});
}

function getCardList(){
    var cards = App.getSession(App.cards);

    var cardsHtml = "";
	
    if(cards != undefined && cards != null && cards.length > 0) {
		 cardsCount = cards.length;
        showSmTip();
    } 
    isSetTradePassword();
    
}
function isSetTradePassword() {

    // var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);
	var url = "/mobile-bff/v1/account/has-set-trade-pwd";

    utils.post(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("是否设置过交易密码："+ result.body.isSetPwd + " \n银行卡数量：" + cardsCount);
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }

            if(isSetPwd != "1"){                
				if(cardsCount > 0){
					$("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
					$("#go_to_bind_card").html("去设置");
					$(".bind_card_tip").show();
					$("#go_to_bind_card").attr("href", "../card/bindCardInputPassword_1.html?referUrl=" + encodeURIComponent(document.URL));
				}else{
					isShowToBindCard = true;
					$(".bind_card_tip").show();
					$("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
				}
                return;
            }else if(cardsCount == 0){
                isShowToBindCard = true;
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }
            showSmTip();
        }
    });
}

$(function () {
	setTimeout(function () {
		checkInput()
	}, 500); 
	//均线策略
	queryStrategy(3);
	//成本策略
	queryStrategy(0);
    $(".mip_name_jd").attr("placeholder", "定投计划" + new Date().format("yyyyMMdd"));
    $(".mip_name_zh").attr("placeholder", "定投计划" + new Date().format("yyyyMMdd"));
    $(".fund-name").click(function () {
        window.location.href = "./steadyCombination.html?fundId=" + App.getUrlParam("fundId");
    });
    var txt = "目标收益设置是在普通定投基础上新增止盈策略，当定投收益率达到您设置的目标收益率时，定投计划即可止盈赎回。";
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(txt)
		
    queryFundDetail();
    // queryTips();
    queryAccount();
    queryCard(function () {
        initCardList();
    });
	queryRedeemType(); //查询目标盈支持的止盈方式
    mip.fundId = App.getUrlParam("fundId");
    queryAutoRechargePageInfo();
    showSmTip();
    $("#continue_pur").on("click", continueMip);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=" + encodeURIComponent(location.href));
    
    //根据链接带的参数初始化数据
	setTimeout(function () {
		var fm_mipName = decodeURI(App.getUrlParam("fm_mipName"));//定投名称
		if(App.isNotEmpty(fm_mipName)){
			$(".mip_name_zh").val(fm_mipName);
			mip.mipDesc = fm_mipName.replace(/[ ]/g,"");
		}
		var fm_mipAmt = App.getUrlParam("fm_mipAmt");//定投金额
		if(Number(fm_mipAmt) > 0){
			$(".mipbuyamt_zh").val(fm_mipAmt);
			mip.mipbuyamt = fm_mipAmt;
		}
		var fm_mipCycle = App.getUrlParam("fm_mipCycle");//定投周期
		var fm_mipBuyDay = App.getUrlParam("fm_mipBuyDay");//定投扣款日
		var isOrderImmediately = App.getUrlParam("isOrderImmediately")?App.getUrlParam("isOrderImmediately"):'0';//是否立即扣款
		mip.isOrderImmediately = isOrderImmediately;
		var fm_mipBuyDay_key = Number(fm_mipBuyDay)-1;
		if(fm_mipCycle == "MM"){//每月
			mip.mipcycle = fm_mipCycle;
			mip.mipbuyday = fm_mipBuyDay;
			$(".appDate").html("每月"+fm_mipBuyDay+"日");
			//下一次扣款日
			queryAutoRechargePageInfo();
		}else if(fm_mipCycle == "2W"){//每双周
			mip.mipcycle = fm_mipCycle;
			mip.mipbuyday = fm_mipBuyDay;
			$(".appDate").html("每双周"+chooseTime[fm_mipCycle][fm_mipBuyDay_key]);
			//下一次扣款日
			queryAutoRechargePageInfo();
		}else if(fm_mipCycle == "WW"){//每周
			mip.mipcycle = fm_mipCycle;
			mip.mipbuyday = fm_mipBuyDay;
			$(".appDate").html("每周"+chooseTime[fm_mipCycle][fm_mipBuyDay_key]);
			//下一次扣款日
			queryAutoRechargePageInfo();
		}else if(fm_mipCycle == "ED"||fm_mipCycle == "DD"){//每天
			mip.mipcycle = fm_mipCycle;
			$(".appDate").html("每日");
			//下一次扣款日
			queryAutoRechargePageInfo();
		}
		var fm_mipRate = App.getUrlParam("fm_mipRate");//目标收益率
		if(Number(fm_mipRate) > 0){
			mip.isOpenTargetProfit = "Y";
			$(".setting_target_rate_on_off").children('img').attr('src','../images/fund/on.png');
			$("#targetAgreement").show();
			$('#targetEm').show();
			targetAgreement = true;
			$(".target-rate-1").removeClass("clr");
			if(Number(fm_mipRate) == 6){
				$(".target-rate-1:first").addClass("clr")
			}if(Number(fm_mipRate) == 10){
				$(".aim").children("span:odd").addClass("clr")
			}if(Number(fm_mipRate) == 15){
				$(".target-rate-1:last").addClass("clr")
			}else{
				$(".target-rate-0").addClass("clr")
				$("#targetProfit").val(fm_mipRate);
				$(".target-rate-view-customize").show();
			}
			mip.targetProfit = Number(fm_mipRate) / 100;
			$("#target_profit").html(fm_mipRate+"%");
			$(".target-rate-view").show();
		}else{
			$('.hide_color').show();
		}

		var fm_periodNumber = App.getUrlParam("fm_periodNumber");//自定义期数
		if(App.isNotEmpty(fm_periodNumber) && Number(fm_periodNumber) < 2){
			fm_periodNumber = 2;
		}
		if(App.isNumber(fm_periodNumber) && Number(fm_periodNumber) > 0){
			mip.periodNumber = fm_periodNumber;
			//展示自定义期数
			$("#fm_periodNumber").show();
			$(".fm_periodNumber").val(fm_periodNumber);
		}
		
		
		var fm_strategy = App.getUrlParam("fm_strategy");//定投策略
		if(fm_strategy == "0"){//成本
			mip.isSupportStrategy = 1;
			$("#average").removeClass("active");
			$("#cost").addClass("active");
			$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/on.png');
			$("#strategy_txt").html("成本策略");
			$(".display-cost").show()
			$(".display-average").hide()
			mip.mipsetup = "0";
			var fm_addRate = App.getUrlParam("fm_addRate");//加码比例
			$("#below_ratio").val(fm_addRate);
			var fm_addAmt = App.getUrlParam("fm_addAmt");//加码金额
			$("#below_deduction_amt").val(fm_addAmt);
			var fm_lowRate = App.getUrlParam("fm_lowRate");//减码比例
			$("#above_ratio").val(fm_lowRate);
			var fm_lowAmt = App.getUrlParam("fm_lowAmt");//减码金额
			$("#above_deduction_amt").val(fm_lowAmt);
			mip.dcrIndex = fm_lowRate;
			mip.hMipAmt = fm_addAmt;
			mip.icIndex = fm_addRate;
			mip.lMipAmt = fm_lowAmt;
			$("#strategy_line").html("实际每期扣款金额为"+mip.lMipAmt+"-"+mip.hMipAmt+"元，");
			$(".target-rate-view2").show();
		}else if(fm_strategy == "3"){//均线
			mip.isSupportStrategy = 1;
			$("#cost").removeClass("active");
			$("#average").addClass("active");
			$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/on.png');
			$("#strategy_txt").html("均线策略");
			$(".display-cost").hide()
			$(".display-average").show()
			mip.mipsetup = "3";
			var fm_index = decodeURI(App.getUrlParam("fm_index"));//参考指数
			$("#trigger").html(fm_index);
			var fm_line = decodeURI(App.getUrlParam("fm_line"));//参考均线
			$("#trigger2").html(fm_line);
			
			var url = "/ats-ng/v1/agreement/config/query/strategy-info?strategyTypeList=3";
			utils.get(url, null, function(result){
				if (result.body != undefined && result.body != null){
					var referIndexInfo = result.body[0].referIndexInfo;
					var referAverageInfo = result.body[0].referAverageInfo;

					for(var k in referIndexInfo){
						if(fm_index == referIndexInfo[k].referIndexName){
							mip.referIndexCode = referIndexInfo[k].referIndexCode;//参考指数
						}
					}
					
					for(var m in referAverageInfo){
						if(fm_line == referAverageInfo[m].referIndexName){
							mip.referAverageCode = referAverageInfo[m].referIndexCode;//参考均线
						}
					}
				}
			});


			high = App.formatMoney(fm_mipAmt*0.6,2);
			low = App.formatMoney(fm_mipAmt*2.1,2);
			mip.lMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
			mip.dcrIndex = 0.6;// 减码指标码
			mip.hMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
			mip.icIndex = 2.1;// 加码指标
			$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+fm_index+"</span>，参考均线：<span  style='color:#FB5C5F'>"+fm_line+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
			$(".target-rate-view2").show();
		}else{
			$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/off.png');
		}
		
		var contractLength = $(".contract-div").children("p").length;
		var chkCnt = 0;
		var chkTarCnt = 0;

		$(".contract-div").children("p").each(function(){
			if($(this).children("span").hasClass("current")){
				chkCnt+=1;
			}
		});

		// if($("#isReadTarget").hasClass("current")){
		// 	chkTarCnt = 1;
		// }

		if(Number($(".mipbuyamt_zh").val()) > 0 ){
			if(contractLength == chkCnt ){
				$("#btn_sub").css({'background-color':'#fd7e23'});
				App.unbind('#btn_sub', "tap",mipCheck);
				App.bind('#btn_sub', "tap",mipCheck);
			}else{
				App.unbind('#btn_sub', "tap",mipCheck);
				$("#btn_sub").css({'background-color':'#ddd6d6'});
			}
		}else{
			App.unbind('#btn_sub', "tap",mipCheck);
			$("#btn_sub").css({'background-color':'#ddd6d6'});
		}
		queryContractnoDetail();
	}, 800); 

    if(arAcct){
        
        utils.get('/sfs/v1/accounts/assets/plans/share?arAcct='+arAcct,null,function(result){
            if(result.returnCode == 0){
                if(result.body.planName){
                    $("#planName").html(result.body.planName);

                }
            }
        });
        $("#familyAcc").show();
		$(".dqcl").hide();
		$(".mbsy").hide();
    }
});
var is_super_xjb = false;
var minMipAmt = 0;
var readTxt = "";
var riskInfo = {code: '0000', msg: ''};
var mip = {
    "mipKind":"1",
    "cashFrm":"V",
    "shareType":"A",
    "mipcycle":"MM",
    "mipbuyday":"1",
    "autoRenewal":"1",
    "isOrderImmediately":"0",//是否立刻定投一笔 0:否 1:是
    "isOpenTargetProfit":"N", //是否开启目标收益率设置 Y:是 N:否
    "isSupportStrategy":"0",//是否支持策略 0:否 1:是
    "mipbuyamt":0,
    "mipsetup":"",
    "dcrIndex":"",//减码比例
    "hMipAmt": "",//加码金额
    "icIndex": "",//加码比例
    "lMipAmt": "",//减码金额
    "isContinueHold":1,
    "referIndexCode":"000001",//参考指数
    "referAverageCode":"000060"//参考均线
};

function showSmTip() {
    var fundId = App.getUrlParam("fundId");
    // var url = App.projectNm + "/common/check_union_risk_level?productId=" + fundId;
	var url = "/mobile-bff/v1/common/check-union-risk-level?productId=" + fundId;
    utils.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            riskInfo = result.body;
            if (result.body.code == '9990' || result.body.code == '9991' || result.body.code == '9993') {
                $("#evaluation_tip").html(result.body.msg);
                $(".evaluation_risk_tip").show();
            } else if (result.body.code == '9992') {
				$(".sm_tip p").html(result.body.msg ? result.body.msg : '该产品风险等级超过您的风险承受等级');
                $(".sm_tip").show();
                setTimeout(function () {
                    $(".sm_tip").hide()
                }, 1000);
            }
            
            if (result.body.code == '9992'){
            	App.setSession("reminderType",0)
            }else if (result.body.code == '9994'){
            	App.setSession("reminderType",1)
            }else{
            	App.setSession("reminderType",2)
            }
            
        }
    });
}

$(".close_tip").click(function () {

    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});
function setMipTp(type) {
    mip.mipKind = type;
}
$('.togggle').on('click', function tag() {
    if (!$(this).parent('li').hasClass('cur')) {
        $('.fund').toggleClass('hide')
        $('.togggle').parent('li').toggleClass('cur')
    }
})
$(".mip_name_zh").on("keyup", function () {
    mip.mipDesc = $(".mip_name_zh").val().replace(/[ ]/g,"");
});
$("#below_deduction_amt").on("input", function () {	 
	var amt = $("#below_deduction_amt").val();
	isChange = false;
	isAlert = false;
	if(amt.indexOf('.') > -1){//带小数
		if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number($("#below_deduction_amt").val()))){
			mip.hMipAmt = amt;
			
		}else{
			$("#below_deduction_amt").val(amt.substr(0,amt.indexOf('.')+3));
		}
		
	}else if(/^[0-9]+?$/.test(String(amt))){		
		mip.hMipAmt = amt;
	}else{
		$("#below_deduction_amt").val('');
		
	}
});
$("#above_deduction_amt").on("input", function () {	 
	var amt = $("#above_deduction_amt").val();
	isChange = false;
	isAlert = false;
	if(amt.indexOf('.') > -1){//带小数
		if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number($("#above_deduction_amt").val()))){
			mip.lMipAmt = amt;
		}else{
			$("#above_deduction_amt").val(amt.substr(0,amt.indexOf('.')+3));
		}
		
	}else if(/^[0-9]+?$/.test(String(amt))){		
		mip.lMipAmt = amt;
	}else{
		$("#above_deduction_amt").val('');
		
	}
});

$("#below_ratio").on("input", function () {	 
	var amt = $("#below_ratio").val();

	if(amt.indexOf('.') > -1){//带小数
		if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number($("#below_ratio").val()))){
			mip.lowYield = amt;
		}else{
			$("#below_ratio").val(amt.substr(0,amt.indexOf('.')+3));
		}
		
	}else if(/^[0-9]+?$/.test(String(amt))){		
		mip.lowYield = amt;
	}else{
		$("#below_ratio").val('');
		
	}
});

$("#above_ratio").on("input", function () {	 
	var amt = $("#above_ratio").val();

	if(amt.indexOf('.') > -1){//带小数
		if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number($("#above_ratio").val()))){
			mip.highYield = amt;
		}else{
			$("#above_ratio").val(amt.substr(0,amt.indexOf('.')+3));
		}
		
	}else if(/^[0-9]+?$/.test(String(amt))){		
		mip.highYield = amt;
	}else{
		$("#above_ratio").val('');
		
	}
});

$(".mipbuyamt_zh").on("input", function () {	 
	checkInput()
    
});
//检查输入框 更新按钮状态
function checkInput(){
	var amt = $(".mipbuyamt_zh").val();
	isChange = false;
	isAlert = false;
	if(amt.indexOf('.') > -1){//带小数
		if(/^[0-9]+(.[0-9]{1,2})?$/.test(Number($(".mipbuyamt_zh").val()))){
			mip.mipbuyamt = amt;
		}else{
			$(".mipbuyamt_zh").val(amt.substr(0,amt.indexOf('.')+3));
		}
		
	}else if(/^[0-9]+?$/.test(String(amt))){		
		mip.mipbuyamt = amt;
	}else{
		$(".mipbuyamt_zh").val('');
		
	}
    var strategyFlag = $("#strategy_txt").attr("data-flag");
    $(".target-rate-view2").hide();
    $(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/off.png')
    if (mip.mipKind == 1) {
        //strategyCalculation(strategyFlag, mip.mipbuyamt);
    }
    var contractLength = $(".contract-div").children("p").length;
    var chkCnt = 0;
	var chkTarCnt = 0;

    $(".contract-div").children("p").each(function(){
    	if($(this).children("span").hasClass("current")){
    		chkCnt+=1;
    	}
    });

	// if($("#isReadTarget").hasClass("current")){
	// 	chkTarCnt = 1;
	// }

    if(Number($(".mipbuyamt_zh").val()) > 0 ){
		if(contractLength == chkCnt && (!targetAgreement || (targetAgreement && chkTarCnt))){
	    	$("#btn_sub").css({'background-color':'#fd7e23'});
			App.unbind('#btn_sub', "tap",mipCheck);
	    	App.bind('#btn_sub', "tap",mipCheck);
    	}else{
	    	App.unbind('#btn_sub', "tap",mipCheck);
	    	$("#btn_sub").css({'background-color':'#ddd6d6'});
    	}
    }else{
    	App.unbind('#btn_sub', "tap",mipCheck);
    	$("#btn_sub").css({'background-color':'#ddd6d6'});
    }
} 
//问号提示
$(".icon-point").click(function () {
	if($(this).attr("data") == 1){
		$("#alert4").html("定期不定额定投会根据您选择的参考策略，来确定每个周期的投资金额，从而实现低位多投，高位少投，降低投资成本，分散投资风险。");
    	$(".Bomb-box").show();
	}else{
	    var txt = "目标收益设置是在普通定投基础上新增止盈策略，当定投收益率达到您设置的目标收益率时，定投计划即可止盈赎回。";
	    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(txt)
		$(".Bomb-box1").show();
	}
})
$(".cls").click(function(){
	$(".tips").hide();
});
$(".Bomb-box-ok").click(function () {
    $(this).parent().parent().hide();
})

function alertTips(tips) {
	$(".Bomb-box-ok").show();
	$(".Bomb-box-ok").next("div").hide();
    $(".Bomb-box2 .Bomb-box-main .Bomb-box-content p").html(tips);
    $(".Bomb-box2").show();
}


//勾选
$(".rules").click(function () {
    $(".chose-icon").toggleClass("current");
});


$('.setting_automatic_renewal_on_off').on('click',function(){
    // console.log($("#setting_target_rate").attr("data-flag"));
    if( $(this).children('img').attr('src')=='../images/fund/off.png'){
        $(".setting_automatic_renewal_tips").html("自动续期开启时，达到目标收益并自动赎回份额到现金宝后，继续发起新的目标收益计划");
        $(this).children('img').attr('src','../images/fund/on.png');
        mip.autoRenewal = "1";
    }else{
        $(".setting_automatic_renewal_tips").html("自动续期关闭时，达到目标收益并自动赎回份额到现金宝后定投计划将终止");
        $(this).children('img').attr('src','../images/fund/off.png');
        mip.autoRenewal = "0";
    }
});
$('.setting_deduction_cycle_on_off').on('click',function(){
    // console.log($("#setting_target_rate").attr("data-flag"));
    var setting_deduction_cycle = $("#setting_deduction_cycle").attr("data-flag");
    if (setting_deduction_cycle == "0") {
        $("#setting_deduction_cycle").attr("data-flag", 1);
        $(".deduction_cycle_type").show();
    } else {
        $("#setting_deduction_cycle").attr("data-flag", 0);
        $(".deduction_cycle_type").hide();
    }
    if(  $(this).children('img').attr('src')=='../images/fund/off.png'){
        $(this).children('img').attr('src','../images/fund/on.png')
    }else{
        $(this).children('img').attr('src','../images/fund/off.png')

    }
});

function initCardList(){
    var cards = App.getSession(App.cards);
    // var cards = [{"adLimit":"0","bankAcco":"6228486466646997646","bankAccoDisplay":"尾号7646","bankFlag":"N","bankGrpName":"农业银行","bankName":"农行快易付","bankNo":"603","bgrp":"A07","branchNm":"","branchNo":"","cashBalance":56004.12,"certNum":"210101198001012255","color":"1","dayThreashHold":5000000,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"71534.28","limitRemark":"单笔、日累计500万","mainFlg":"Y","mobileNo":"","promotionBtnTxt":"","promotionFlag":"","promotionUrl":"","protocolNo":"6228486466646997646","realLimit":"10000.0","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔、日累计500万","restLimit":"0","signWay":"1","singleThreashHold":5000000,"tradeFlag":"1"},{"adLimit":"0","bankAcco":"6222020000001111001","bankAccoDisplay":"尾号1001","bankFlag":"N","bankGrpName":"工商银行","bankName":"工行快易付","bankNo":"202","bgrp":"A01","branchNm":"","branchNo":"","cashBalance":56004.12,"certNum":"210101198001012255","color":"5","dayThreashHold":1.0E10,"fastrealtimeFlag":"1","fastrealtimeRemark":"","hasDel":"0","limit":"49423.28","limitRemark":"单笔10亿、日累计100亿","mainFlg":"N","mobileNo":"","promotionBtnTxt":"","promotionFlag":"","promotionUrl":"","protocolNo":"2017112116850359","realLimit":"10000.0","realtimeFlag":"1","realtimeRemark":"","rechargeFlag":"1","rechargeRemark":"","remark":"默认充值限额：单笔10亿、日累计100亿","restLimit":"0","signWay":"1","singleThreashHold":1.0E9,"tradeFlag":"1"}];
    // App.setSession(App.cards, cards);
    var html = "";

    for(var index in cards){
        var card = cards[index];
        if(card.tradeFlag != "1") continue;

        var signStyle,signTxt;
		if(card.signWay == "1"){
			signStyle = "shorcut";
			signTxt = "快捷";
		}else if(card.signWay == "2"){
			signStyle = "union";
			signTxt = "银联通";
		}else if(card.signWay == "3"){
			signStyle = "E-bank";
			signTxt = "网银";
		}else if(card.signWay == "4"){
			signStyle = "E-bank";
			signTxt = "通联";
		}else if(card.signWay == "6"){
			signStyle = "E-bank";
			signTxt = "云闪付";
		}else if(card.signWay == "7"){
			signStyle = "E-bank";
			signTxt = "一网通";
		}else{
			signStyle = "";
			signTxt = "";
		}
        if(true || card.signWay == "7" || card.signWay == "1"){//wap只需支持快捷和招行一网通 20210705全放开
        html += "<li class=\"grid-list-item heigth-130 bottom-border bank-card-option\" data=\""+ card.bankNo +","+ card.bankAcco +"\">\n" +
            "                <div class=\"row\">\n" +
            "                    <div class=\"lh-130 first\">\n" +
            '   <img src="/mobileEC/images/bank/'+card.bankNo+'.png" class="bank-logo-new"/>                      \n' +
            "                    </div>\n" +
            "                    <div class=\"col-1\">\n" +
            "                        <div class=\"list-title\">\n" +
            "                            <p class=\"bank-name\">" + card.bankName + " [ " + card.bankAccoDisplay + " ]</p>\n" +
            "                            <p class=\"bank-id\" id=\"xjb_remark\">"+ card.limitRemark + "</p>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                    <div class=\"lh-130 "+ signStyle +"\">\n" +
			'            <a class="icon icon-'+ signStyle +'">'+ signTxt +'</a>' +
            "                    </div>\n" +
            "                </div>\n" +
			"            </li>";
		}
    }
    $(".bankCardList-div").html(html);
    $(".bank-card-option").on("click", handlerCard);
	getCardList()
}
function handlerCard(){
    var data = $(this).attr("data");
    var array = String(data).split(",");
    var bankNo = array[0];
    var bankAcco = array[1];

    var cards = App.getSession(App.cards);
    for(var index in cards){
        var card = cards[index];
        if(card.bankNo == bankNo && card.bankAcco == bankAcco){
            App.setSession(App.selectedCard, card);
            setCard(card);
        }
    }
}

function setCard(card){
    $(".bank_selected").html(card.bankName + " [" + card.bankAccoDisplay + "]");
    mip.cashFrm = "B";
    mip.bankNo = card.bankNo;
    mip.bankAcco = card.bankAcco;
}

function queryAccount() {
    // var url = App.projectNm + "/account/account?r=" + (Math.random() * 10000).toFixed(0);
	var url = "/smac/v1/asset/balance-with-smac"

    utils.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            balance = result.body.balance;
            $(".xjb-balance").html("现金宝可用余额" + App.formatMoney(balance + '') + "元");
        }
    });
}

function queryRedeemType() {
	var url = "/ats-ng/v1/agreement/config/query/target-profit?agreementType=1&productId="+  utils.getUrlParam("fundId")

    utils.get(url, null, function (result) {
        if (result.returnCode == 0 &&  result.body) {
            redeemType = result.body.redeemType;

			var fm_isHold = App.getUrlParam("fm_isHold");//是否继续持有
			var fm_isContinue = App.getUrlParam("fm_isContinue");//是否续期
			if(fm_isContinue == 1){
				mip.autoRenewal = 1;
				$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/on.png');
			}else if(fm_isContinue == '0'){
				mip.autoRenewal = 0;
				$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/off.png')
			}
			if(redeemType!=1){
				if(fm_isHold == '1'){
					mip.isContinueHold = 1;
					$("#trigger3").html("继续持有")
					var weekdayArr3=[{        "id": "1",        "value": "继续持有"    }];
					$("#holdArrow").hide();
					$("#trigger3").css('pointerEvents','none')
				}else if(fm_isHold == '0'){
					mip.isContinueHold = 0;
					$("#trigger3").html("自动止盈");
					var weekdayArr3=[ {        "id": "0",        "value": "自动止盈"    },    {        "id": "1",        "value": "继续持有"    }];
				}else{
					mip.isContinueHold = 1;
					$("#trigger3").html("继续持有");
					var weekdayArr3=[ {        "id": "1",        "value": "继续持有"    },    {        "id": "0",        "value": "自动止盈"    }];
				}
			}else{
				mip.isContinueHold = 1;
				$("#trigger3").html("继续持有");
				var weekdayArr3=[    {        "id": "1",        "value": "继续持有"    }];
				$("#holdArrow").hide();
				$("#trigger3").css('pointerEvents','none')
			}
		
			if($(".setting_target_rate_on_off3").children('img').attr('src')=='../images/fund/on.png'){
				if($("#trigger3").html() == "自动止盈"){
					$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
				}else{
					$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
				}
			}else{
				if($("#trigger3").html() == "自动止盈"){
					$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
				}else{
					$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
				}
			}
		
			var mobileSelect3 = new MobileSelect({
				trigger: '#trigger3', 
				title: '',  
				wheels: [
							{data:weekdayArr3}
						],
				position:[0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
				transitionEnd:function(indexArr, data){
				},
				callback:function(indexArr, data){
		
					mipDit = indexArr;
					// that.setDate=data[0];
					$("#trigger3").html(data[0].value)
		
					if($(".setting_target_rate_on_off3").children('img').attr('src')=='../images/fund/on.png'){
						mip.autoRenewal = 1;
						if($("#trigger3").html() == "自动止盈"){
							$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
						}else{
							$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
						}
					}else{
						mip.autoRenewal = 0;
						if($("#trigger3").html() == "自动止盈"){
							$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
						}else{
							$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
						}
					}
					mip.isContinueHold = data[0].id;
				}
			}); 

        }
    });


}

function gotoUrl(a){
	
	window.location.href=a;
}
$(".xjb_pay").click(function () {
    if(is_super_xjb){
        $(".bank_selected").html("超级现金宝");
    } else {
        $(".bank_selected").html("现金宝");
    }
    mip.cashFrm = "V";
    delete mip.bankNo;
    delete mip.bankAcco;
});

function queryFundDetail() {
    var fundId = App.getUrlParam("fundId");
    var url = "/mobile-bff/v1/fund/detailInfo";

    utils.post(url,JSON.stringify({"fundId": fundId}),function(result){
        if (result.body != undefined && result.body != null){
            var fundInfo = result.body;
            App.setSession("fundRiskLevel",fundInfo.fundRiskLevel);
            $(".currency-unit").html(fundInfo.currencyTypeUnit);
            $(".fund-name").html(fmtName(fundInfo.fundNm));
            minMipAmt = fundInfo.minMipAmt;
            $(".mipbuyamt_zh").attr("placeholder", minMipAmt + fundInfo.currencyTypeUnit + "起投");
            $(".mipbuyamt_jd").attr("placeholder", minMipAmt + fundInfo.currencyTypeUnit + "起投");
            var fundContractList = result.body.fundContractList;
            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){
                var html = "";
				// var targethtml = "";
				// if (utils.isProdEnv()) {
				// 	targethtml = '<p class="rules" id="targetAgreement" style="display:none; font-size:0.635rem;margin-left: .75rem;"><span id="isReadTarget" class="chose-icon "></span><em style="width: 15rem;display: block;    float: right;    padding-right: 1.2rem;">我已同意<em style="color:#3295e8" onclick="gotoUrl(\'https://static.99fund.com/mobile/agreement/target_return_plan_agreement.html\')">《汇添富基金管理有限公司目标收益计划业务规则》</em>&nbsp;</em></p>';
				// } else{
				// 	targethtml = '<p class="rules" id="targetAgreement" style="display:none; font-size:0.635rem;margin-left: .75rem;"><span id="isReadTarget" class="chose-icon "></span><em style="width: 15rem;display: block;    float: right;    padding-right: 1.2rem;">我已同意<em style="color:#3295e8" onclick="gotoUrl(\'http://10.50.115.48/mobile/agreement/target_return_plan_agreement.html\')">《汇添富基金管理有限公司目标收益计划业务规则》</em>&nbsp;</em></p>';
				// }
				// $(".targetcontract-div").append(targethtml);
				// App.bind("#isReadTarget","tap",function(){
				// 	if(!$("#isReadTarget").hasClass("current")){
				// 		$("#isReadTarget").addClass("current")
				// 		var contractLength = $(".contract-div").children("p").length;
				// 		var chkCnt = 0;
				// 		var chkTarCnt = 0;

				// 		$(".contract-div").children("p").each(function(){
				// 			if($(this).children("span").hasClass("current")){
				// 				chkCnt+=1;
				// 			}
				// 		});
						
				// 		if($("#isReadTarget").hasClass("current")){
				// 			chkTarCnt = 1;
				// 		};

				// 		if(Number($(".mipbuyamt_zh").val()) > 0  && (contractLength == chkCnt) && (!targetAgreement || (targetAgreement && chkTarCnt))){
				// 			$("#btn_sub").css({'background-color':'#fd7e23'});
				// 			App.unbind('#btn_sub', "tap",mipCheck);
				// 			App.bind('#btn_sub', "tap",mipCheck);
				// 		}else{
				// 			App.unbind('#btn_sub', "tap",mipCheck);
				// 			$("#btn_sub").css({'background-color':'#ddd6d6'});
				// 		}
				// 	}else{
				// 		App.unbind('#btn_sub', "tap",mipCheck);
				// 		$("#btn_sub").css({'background-color':'#ddd6d6'});
				// 		$("#isReadTarget").removeClass("current")
				// 	}
				// });
				// isReadEm
				var html0 ;
				if (utils.isProdEnv()) {
					html0 = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead" class="chose-icon "></span><em style="width: 15rem;display: block;    float: right;    padding-right: 1.2rem;">我已同意<em style="color:#3295e8" onclick="gotoUrl(\'https://static.99fund.com/mobile/agreement/zhihuidingtou_agreement.html\')">《汇添富基金管理股份有限公司定投业务协议》</em><em id="targetEm" style="color:#3295e8;display:none" onclick="gotoUrl(\'https://static.99fund.com/mobile/agreement/target_return_plan_agreement.html\')">、《汇添富基金管理股份有限公司目标收益定投计划服务协议》</em>&nbsp;</em></p>';
					
				} else{
					html0 = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead" class="chose-icon "></span><em style="width: 15rem;display: block;    float: right;    padding-right: 1.2rem;">我已同意<em style="color:#3295e8" onclick="gotoUrl(\'http://10.50.115.48/mobile/agreement/zhihuidingtou_agreement.html\')">《汇添富基金管理股份有限公司定投业务协议》</em><em id="targetEm" style="color:#3295e8;display:none" onclick="gotoUrl(\'http://10.50.115.48/agreement/target_return_plan_agreement.html\')">、《汇添富基金管理股份有限公司目标收益定投计划服务协议》</em>&nbsp;</em></p>';
				}
				

				$(".contract-div").append(html0);
				App.bind("#isRead","tap",function(){
					if(!$("#isRead").hasClass("current")){
						$("#isRead").addClass("current")
						var contractLength = $(".contract-div").children("p").length;
						var chkCnt = 0;
						var chkTarCnt = 0;

						$(".contract-div").children("p").each(function(){
							if($(this).children("span").hasClass("current")){
								chkCnt+=1;
							}
						});
						// if($("#isReadTarget").hasClass("current")){
						// 	chkTarCnt = 1;
						// };
				
						if(Number($(".mipbuyamt_zh").val()) > 0  && (contractLength == chkCnt) ){
							$("#btn_sub").css({'background-color':'#fd7e23'});
							App.unbind('#btn_sub', "tap",mipCheck);
							App.bind('#btn_sub', "tap",mipCheck);
						}else{
							App.unbind('#btn_sub', "tap",mipCheck);
							$("#btn_sub").css({'background-color':'#ddd6d6'});
						}
					}else{
						App.unbind('#btn_sub', "tap",mipCheck);
						$("#btn_sub").css({'background-color':'#ddd6d6'});
						$("#isRead").removeClass("current")
					}
				});
                //根据类型处理数据
                var listKey = new Array();//拼分组数组
                fundContractList.forEach(function (item, index) {
                	if(listKey.indexOf(item.contractCategory) == -1){
                		listKey.push(item.contractCategory);
                	}
                });
                if(listKey.length > 0){
                //存到session
                App.setSession("mip_agreementIds",listKey.join(','))
            	}
				listKey.forEach(function (item0, index0) {
					var htm_ms = '';
					if(item0 == "KFS"){
						html = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead'+index0+'" class="chose-icon"></span><em style="width: 15rem;display: block;    float: right;    padding-right: 1.2rem;">我已阅读并确认已知悉';
					}else{
						html = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead'+index0+'" class="chose-icon"></span><em style="width: 15rem;display: block;    float: right;    padding-right: 1.2rem;">我已同意';
					}
	            	
	                fundContractList.forEach(function (item, index) {

	            		if(item0 == item.contractCategory){

		                    html += "<em style='color:#3295e8' onclick=\"gotoUrl('"+  item.url +"')\" >《"+ item.title +"》</em>";

		                    if((index + 1) < fundContractList.length) {
		                        html += "&nbsp;";
		                    }
	                	}
	                });

                	html += '</em></p>';
                	$(".contract-div").append(html);
					App.bind("#isRead"+index0,"tap",function(){
						if(!$("#isRead"+index0).hasClass("current")){
							$("#isRead"+index0).addClass("current")
							var contractLength = $(".contract-div").children("p").length;
							var chkCnt = 0;
							var chkTarCnt = 0;

							$(".contract-div").children("p").each(function(){
								if($(this).children("span").hasClass("current")){
									chkCnt+=1;
								}
							});
							// if($("#isReadTarget").hasClass("current")){
							// 	chkTarCnt = 1;
							// };

							if(Number($(".mipbuyamt_zh").val()) > 0  && (contractLength == chkCnt) ){
					        	$("#btn_sub").css({'background-color':'#fd7e23'});
								App.unbind('#btn_sub', "tap",mipCheck);
					        	App.bind('#btn_sub', "tap",mipCheck);
					        }else{
					        	App.unbind('#btn_sub', "tap",mipCheck);
					        	$("#btn_sub").css({'background-color':'#ddd6d6'});
					        }
						}else{
				        	App.unbind('#btn_sub', "tap",mipCheck);
				        	$("#btn_sub").css({'background-color':'#ddd6d6'});
					    	$("#isRead"+index0).removeClass("current")
					   	}
					});

                });
                
            }
            if (fundInfo.mipType == "1"){//
                mip.mipKind = "0";
                $(".mbsy").hide();
            } else {
                mip.mipKind = "1";
				if(App.getUrlParam("fm_mipRate") && Number(App.getUrlParam("fm_mipRate")) == 0){//特殊处理 没有入参就不展示20210322
					$(".mbsy").hide();
				}else{
					if(arAcct){
						$(".mbsy").hide();
					}else{
						$(".mbsy").show();
					}
				}
            }
            
            
        }
    });
}
//通过定投协议号获取定投信息
function queryContractnoDetail(){
	if(contractno){
		var url = "/mobile-bff/v1/fund/queryContractDetail?contractNo="+contractno;
		utils.get(url, null, function (result){
			if(result.body!= undefined && result.body != null && result.returnCode == 0){
				var result = result.body;
				var con_mipName = result.contractDesc; //定投名称
				if(App.isNotEmpty(con_mipName)){
					$(".mip_name_zh").val(con_mipName);
					mip.mipDesc = con_mipName.replace(/[ ]/g,"");
				}

				var con_mipAmt = result.payAmt; //定投金额
				if(Number(con_mipAmt) > 0){
					$(".mipbuyamt_zh").val(con_mipAmt);
					mip.mipbuyamt = con_mipAmt;
				}

				var con_mipCycle = result.cycle;//定投周期
				var con_mipBuyDay = Number(result.payDate);//定投扣款日
				var con_mipBuyDay_key = Number(con_mipBuyDay)-1;
				if(con_mipCycle == "MM"){//每月
					mip.mipcycle = con_mipCycle;
					mip.mipbuyday = con_mipBuyDay;
					$(".appDate").html("每月"+con_mipBuyDay+"日");
					//下一次扣款日
					queryAutoRechargePageInfo();
				}else if(con_mipCycle == "2W"){//每双周
					mip.mipcycle = con_mipCycle;
					mip.mipbuyday = con_mipBuyDay;
					$(".appDate").html("每双周"+chooseTime[con_mipCycle][con_mipBuyDay_key]);
					//下一次扣款日
					queryAutoRechargePageInfo();
				}else if(con_mipCycle == "WW"){//每周
					mip.mipcycle = con_mipCycle;
					mip.mipbuyday = con_mipBuyDay;
					$(".appDate").html("每周"+chooseTime[con_mipCycle][con_mipBuyDay_key]);
					//下一次扣款日
					queryAutoRechargePageInfo();
				}else if(con_mipCycle == "ED"||con_mipCycle == "DD"){//每天
					mip.mipcycle = con_mipCycle;
					$(".appDate").html("每日");
					//下一次扣款日
					queryAutoRechargePageInfo();
				}
				
				var con_cashFrm = result.payType;
				if(con_cashFrm == 'V'){
					if(is_super_xjb){
						$(".bank_selected").html("超级现金宝");
					} else {
						$(".bank_selected").html("现金宝");
					}
					mip.cashFrm = "V";
					delete mip.bankNo;
					delete mip.bankAcco;
				}else if(con_cashFrm == 'B'){
					var con_bankName = result.bankGrpName;
					var con_bankAccoDisplay= result.bankAccoDisplay;
					$(".bank_selected").html(con_bankName + " [尾号" + con_bankAccoDisplay + "]");
					mip.cashFrm = "B";
					mip.bankNo = result.bankNo;
					mip.bankAcco = result.bankAcco;
				}
				
				var con_isTargetProfit  = result.isTargetProfit ;//是否设置目标收益
				if(con_isTargetProfit == '0'){
					$(".setting_target_rate_on_off").children('img').attr('src','../images/fund/off.png');
					$("#targetAgreement").hide();
					targetAgreement = false;
					// if($("#isReadTarget").hasClass("current")){
					// 	$("#isReadTarget").removeClass("current");
					// }
					$(".target-rate-view").hide();
					mip.isOpenTargetProfit = "N";
					$("#setting_target_rate").attr("data-flag", "0");
					// $(".hide_color").show()					
					delete mip.targetProfit;
				}else if(con_isTargetProfit == '1'){
					var con_mipRate = result.targetProfit*100;//目标收益率
					if(Number(con_mipRate) > 0){
						mip.isOpenTargetProfit = "Y";
						// $(".setting_target_rate_on_off").children('img').attr('src','../images/fund/on.png')
						$(".target-rate-1").removeClass("clr");
						if(Number(con_mipRate) == 6){
							$(".target-rate-1:first").addClass("clr")
						}else if(Number(con_mipRate) == 10){
							$(".aim").children('span').eq(1).addClass("clr")
						}else if(Number(con_mipRate) == 15){
							$(".target-rate-1:last").addClass("clr")
						}else{
							$(".target-rate-0").addClass("clr")
							$("#targetProfit").val(con_mipRate);
							$(".target-rate-view-customize").show();
						}
						mip.targetProfit = Number(con_mipRate) / 100;
						$("#target_profit").html(con_mipRate+"%");
						// $(".target-rate-view").show();
					}
					var con_isHold = result.isContinueHold;//是否继续持有
					if(con_isHold == 1 || con_isHold == '1'){
						mip.isContinueHold = 1;
						$("#trigger3").html("继续持有");
					}else if(con_isHold == 0 || con_isHold == '0'){
						mip.isContinueHold = 0;
						$("#trigger3").html("自动止盈");
					}

					var con_isContinue = result.isAutoContinue;//是否续期
					if(con_isContinue == 1|| con_isContinue == '1'){
						mip.autoRenewal = 1;
						// $("#setting_target_rate").attr("data-flag", 0);
						$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/on.png');
						if($("#trigger3").html() == "自动止盈"){
							$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
						}else{
							$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
						}
					}else if(con_isContinue == 0 || con_isContinue == '0'){
						mip.autoRenewal = 0;
						// $("#setting_target_rate").attr("data-flag", 1);
						setTimeout(function(){
							$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/off.png');
						},0)
						
						if($("#trigger3").html() == "自动止盈"){
							$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
						}else{
							$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
						}
					}
		
					var con_periodNumber = result.periodNumber;//自定义期数
					if(App.isNotEmpty(con_periodNumber) && Number(con_periodNumber) < 2){
						con_periodNumber = 2;
					}
					if(App.isNumber(con_periodNumber) && Number(con_periodNumber) > 0){
						mip.periodNumber = con_periodNumber;
						//展示自定义期数
						$("#fm_periodNumber").show();
						$(".fm_periodNumber").val(con_periodNumber);
					}

					$(".setting_target_rate_on_off").children('img').attr('src','../images/fund/on.png');
					$("#targetAgreement").show();
					$('#targetEm').show();
					targetAgreement = true;
					// $("#down_mubiao").hide();
					// $(".next_text,.jihua").show();
					$(".target-rate-view").show();
					$(".hide_color").hide()	
					$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/on.png')
					mip.isOpenTargetProfit = "Y";
				}

				var con_isSupportStrategy  = result.isSupportStrategy ;//是否设置定投策略
				if(con_isSupportStrategy == '0'){
					$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/off.png');
					mip.isSupportStrategy = "0";
					$(".target-rate-view2").hide();
				}else if(con_isSupportStrategy == '1'){
					$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/on.png');
					mip.isSupportStrategy = "1";

					var con_strategy = result.strategyType;//定投策略
					if(con_strategy == "0"){//成本
						mip.isSupportStrategy = "1";
						$("#average").removeClass("active");
						$("#cost").addClass("active");
						// $(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/on.png');
						$("#strategy_txt").html("成本策略");
						$(".display-cost").show()
						$(".display-average").hide()
						mip.mipsetup = "0";
						var con_addRate = result.increaseIndex;//加码比例
						$("#below_ratio").val(con_addRate);
						var con_addAmt = result.increaseAmt;//加码金额
						$("#below_deduction_amt").val(con_addAmt);
						var con_lowRate = result.decreaseIndex;//减码比例
						$("#above_ratio").val(con_lowRate);
						var con_lowAmt = result.decreaseAmt;//减码金额
						$("#above_deduction_amt").val(con_lowAmt);
						mip.dcrIndex = con_lowRate.toFixed(2).toString();
						mip.hMipAmt = con_addAmt.toFixed(2).toString();
						mip.icIndex = con_addRate.toFixed(2).toString();
						mip.lMipAmt = con_lowAmt.toFixed(2).toString();
						$("#strategy_line").html("实际每期扣款金额为"+mip.lMipAmt+"-"+mip.hMipAmt+"元，");
						$(".target-rate-view2").show();
					}else if(con_strategy == "3"){//均线
						mip.isSupportStrategy = "1";
						$("#cost").removeClass("active");
						$("#average").addClass("active");
						// $(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/on.png');
						$("#strategy_txt").html("均线策略");
						$(".display-cost").hide()
						$(".display-average").show()
						mip.mipsetup = "3";
						var con_index = result.referIndexName;//参考指数
						$("#trigger").html(con_index);
						var con_line = result.referAverageName;//参考均线
						$("#trigger2").html(con_line);
						
						var url = "/ats-ng/v1/agreement/config/query/strategy-info?strategyTypeList=3";
						utils.get(url, null, function(result){
							if (result.body != undefined && result.body != null){
								var referIndexInfo = result.body[0].referIndexInfo;
								var referAverageInfo = result.body[0].referAverageInfo;
			
								for(var k in referIndexInfo){
									if(con_index == referIndexInfo[k].referIndexName){
										mip.referIndexCode = referIndexInfo[k].referIndexCode;//参考指数
									}
								}
								
								for(var m in referAverageInfo){
									if(con_line == referAverageInfo[m].referIndexName){
										mip.referAverageCode = referAverageInfo[m].referIndexCode;//参考均线
									}
								}
							}
						});
	
						high = App.formatMoney(con_mipAmt*0.6,2);
						low = App.formatMoney(con_mipAmt*2.1,2);
						mip.lMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
						mip.dcrIndex = '0.6';// 减码指标码
						mip.hMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
						mip.icIndex = '2.1';// 加码指标
						$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+con_index+"</span>，参考均线：<span  style='color:#FB5C5F'>"+con_line+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
						$(".target-rate-view2").show();
					}else{
						$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/off.png');
					}
				}



				var contractLength = $(".contract-div").children("p").length;
				var chkCnt = 0;
				var chkTarCnt = 0;
		
				$(".contract-div").children("p").each(function(){
					if($(this).children("span").hasClass("current")){
						chkCnt+=1;
					}
				});
				// if($("#isReadTarget").hasClass("current")){
				// 	chkTarCnt = 1;
				// };
		

				if(Number($(".mipbuyamt_zh").val()) > 0 ){
					if(contractLength == chkCnt){
						$("#btn_sub").css({'background-color':'#fd7e23'});
						App.unbind('#btn_sub', "tap",mipCheck);
						App.bind('#btn_sub', "tap",mipCheck);
					}else{
						App.unbind('#btn_sub', "tap",mipCheck);
						$("#btn_sub").css({'background-color':'#ddd6d6'});
					}
				}else{
					App.unbind('#btn_sub', "tap",mipCheck);
					$("#btn_sub").css({'background-color':'#ddd6d6'});
				}
			}
		})
	}
}

var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": [],    
	"DD": []
};
$(".selected-deduction-cycle").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $(".appDate").blur();
    return false
});
$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    var time = chooseTime[li.attr("data-choose-time")],
        str = "";
    setMipCycle(li.attr("data-choose-time"));
    li.addClass("on").siblings("li").removeClass("on");
    if(time.length == 0){
        $(".choose-time").hide();
        $(".appDate").attr("data-time", li.find("div").text());
        $(".appDate").html(li.find("div").text());
        mip.mipcycle = "ED";
        delete mip.mipbuyday;
        queryAutoRechargePageInfo();
        return;
    }else {
        if (!li.hasClass("on")) {
            for (var i = 0; i < time.length; i++) {
                str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
            };
            $(".choose-time2 ul").html(str);
            $(".appDate").attr("data-time", li.find("div").text())
        } else {
            for (var i = 0; i < time.length; i++) {
                str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
            };
            $(".choose-time2 ul").html(str);
            $(".appDate").attr("data-time", li.find("div").text())
        }
        $(".choose-time").hide();
        $(".choose-time2").show()
    }
});
$(".choose-time2").click(function() {
    var li = $(event.target).parents("li");
    setMipBuyday(li.attr("data-choose-time"));
    if (li.length == 0) {
        return
    };
    $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
    queryAutoRechargePageInfo();
    $(this).hide()
});
function getMipCycle() {
    return mip.mipcycle;
};
function setMipCycle(mipCycle) {
    mip.mipcycle = mipCycle;
};
function getMipBuyday() {
    return mip.mipbuyday;
};
function setMipBuyday(mipBuyday) {
    mip.mipbuyday = mipBuyday;
};
function queryAutoRechargePageInfo() {

    // var url = App.projectNm + "/fund/query_fund_mip_last_period_dt?date=" + (new Date()).getTime() + "&mipCycle=" + getMipCycle();
	var url = "/mobile-bff/v1/fund/fund-mip-last-period-date?date=" + (new Date()).getTime() + "&mipCycle=" + getMipCycle();

    var mipBuyday = getMipBuyday();
    if (mipBuyday != undefined && mipBuyday != null){
        url += "&mipDt=" + mipBuyday;
    }

    utils.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {
            $(".kkDate").html("下次扣款日期：<span style=\"color: #f66\">" + body.nextMipDate + '</span>，遇非交易日顺延');
        }
    });
}
$(".selected_deduction_cycle_type").click(function () {
    $(".deduction_cycle_type_list").show();
});

$(".deduction_cycle_type_list").click(function(event) {
    var li = $(event.target).parents("li");
    var attr = li.attr("data-cycle-type");
    var text = li.find("div").text();
    if (li.length == 0) {
        $(".deduction_cycle_type_list").hide();
        return
    };
    if (!li.hasClass("on")) {
        li.addClass("on").siblings("li").removeClass("on");

    };
    if(attr == "0"){
        $(".deduction_cycle_num").show();
    } else {
        $(".deduction_cycle_num").hide();
        var deductionCycleFlag = $("#setting_deduction_cycle").attr("data-flag");
        if(deductionCycleFlag == "1"){
            mip.periodNumber = attr;
        }
    }
    $(".deduction_cycle_type_list").hide();
    $(".selected_deduction_cycle_type").html(text);
    $(".selected_deduction_cycle_type").attr("data-flag", attr);
});

$(".selected-strategy").click(function () {
    $("#mip_strategy").show();
});


function openSaveBtn() {
    var below_ratio = $("#below_ratio").val();
    var below_deduction_amt = $("#below_deduction_amt").val();
    var above_ratio = $("#above_ratio").val();
    var above_deduction_amt = $("#above_deduction_amt").val();
    if (App.isNotEmpty(below_ratio) &&
        App.isNotEmpty(below_deduction_amt) &&
        App.isNotEmpty(above_ratio) &&
        App.isNotEmpty(above_deduction_amt)) {
        $("#save_customize_strategy").removeClass("btn-orange-disabled").addClass("btn-orange-enabled");
        $("#save_customize_strategy").removeAttr("disabled");
    } else {
        $("#save_customize_strategy").addClass("btn-orange-disabled").removeClass("btn-orange-enabled");
        $("#save_customize_strategy").attr("disabled","disabled");
    }
}
function queryTips() {
    var url = "/smac/v1/config/is-open?r=" + (Math.random()*10000).toFixed(0);

    utils.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var txt = "1.在达到设定的目标收益率前，通过定投计划购买的基金份额不可赎回，达到目标收益后份额自动赎回至现金宝，计划进入下一期或自动终止<br>2.达到目标收益率前如需发起赎回，可手动终止该定投计划，份额将自动赎回";
            if(eval(result.body) == true) {
                is_super_xjb = true;
                $(".xjb-name").html("超级现金宝");
                txt = "1.在达到设定的目标收益率前，通过定投计划购买的基金份额不可赎回，达到目标收益后份额自动赎回至超级现金宝，计划进入下一期或自动终止<br>2.达到目标收益率前如需发起赎回，可手动终止该定投计划，份额将自动赎回";
            }
            $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(txt)
        }
    });
}

$(".target-rate-1").click(function () {
    $(".target-rate-view-customize").hide();
    var targetRate = $(this).attr("data-flag");
    $(".selected-target-rate").attr("data-flag", targetRate);
    mip.targetProfit = Number(targetRate) / 100;
});
$(".target-rate-0").click(function () {
    $(".target-rate-view-customize").show();
    var targetRate = $(this).attr("data-flag");
    $(".selected-target-rate").attr("data-flag", targetRate);
});

function strategyCalculation(strategyTp, mipBuyAmt) {
    //1:进取、2:稳健 0:成本 3:均线
    var lowYield = "0.00";
    var highYield = "0.00";
    var high = minMipAmt;
    var low = minMipAmt;
    if (App.isNumber(mipBuyAmt)){
        if(strategyTp == "1"){
            if (Number(mipBuyAmt) >= Number(minMipAmt)){
                high = Number(mipBuyAmt) * 2;
                if(Number(mipBuyAmt) * 0.2 >= Number(minMipAmt)){
                    low = Number(mipBuyAmt) * 0.2;
                }
            }
            lowYield = "0.50";
            highYield = "4.00";
        } else if(strategyTp == "2"){
            if (Number(mipBuyAmt) >= Number(minMipAmt)){
                high = Number(mipBuyAmt) * 1.9;
                if(Number(mipBuyAmt) * 0.2 >= Number(minMipAmt)){
                    low = Number(mipBuyAmt) * 0.2;
                }
            }
            lowYield = "14.50";
            highYield = "0.50";
        }else{
        	lowYield = $("#below_ratio").val();
        	highYield = $("#above_ratio").val();
        	high = $("#below_deduction_amt").val();
        	low = $("#above_deduction_amt").val()
        }
    } else {
        if(strategyTp == "1"){
            lowYield = "0.50";
            highYield = "4.00";
        } else if(strategyTp == "2"){
            lowYield = "14.50";
            highYield = "0.50";
        }else{
        	lowYield = $("#below_ratio").val();
        	highYield = $("#above_ratio").val();
        }
    }
    mip.hMipAmt = high;// 加码金额
    mip.dcrIndex = lowYield;// 加码指标
    mip.lMipAmt = low;// 减码金额
    mip.icIndex = highYield;// 减码指标
    $(".h-mip-amt").html(App.formatNumber(high, 2));
    $(".l-mip-amt").html(App.formatNumber(low, 2));
    $(".h-mip-yield").html(App.formatNumber(lowYield, 2));
    $(".l-mip-yield").html(App.formatNumber(highYield, 2));
    queryFee("H", high);
    queryFee("L", low);
}

function queryFee(type,purAmt) {
    var fundId = App.getUrlParam("fundId");

    // var url = App.projectNm + "/fund/fund_fee";
    var bankNo = App.isEmpty(mip.bankNo) ? "" : mip.bankNo;
    // var data = {"subAmt": purAmt, "fundId": fundId, "cashFrm": mip.cashFrm, "shareType": "A", "bankNo": bankNo};
	var url = "/mobile-bff/v1/fund/fund-fee?subAmt="+ purAmt + "&fundId="+ fundId + "&cashFrm=" + mip.cashFrm +"&bankNo=" + bankNo +"&shareType=A"

    utils.get(url, null, function (result) {
        // console.log(result);
        if (type == "H"){
            $(".h-fee").html(App.formatMoney(result.body.fee));
        } else if(type == "L") {
            $(".l-fee").html(App.formatMoney(result.body.fee));
        } else {
            $("#fee").html(App.formatMoney(result.body.fee));
            $("#discountFee").html(App.formatMoney(result.body.discountFee));
            $("#rate").html(result.body.rate);
            $("#uRate").html(result.body.uRate);
        }
    });
}

function continueMip() {
	//关掉提示弹窗
    $(".tip").hide();
	/*
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }*/
    fundMip();
}

function mipCheck() {
	
    //20210322 特殊处理 提示调整金额 
	
	if(mip.isSupportStrategy == "1"){
		if(!isChange && Number(mip.hMipAmt) > 0 && Number(mip.lMipAmt) > 0 &&  Number(mip.hMipAmt) < Number(mip.lMipAmt)){
			if(!isAlert){
				alertTips4("提示","低于单位成本时的扣款金额，一般大于，高于单位成本时的扣款金额。是否需要帮您调整", "调整","取消",

					function(){
						var hMipAmt_ = mip.hMipAmt;
						var lMipAmt_ = mip.lMipAmt;
						mip.hMipAmt = lMipAmt_;
						mip.lMipAmt = hMipAmt_;
						$(".Bomb-box").hide();
						isChange = true;
						isAlert = true;
					},
					function(){
						var hMipAmt_ = mip.hMipAmt;
						var lMipAmt_ = mip.lMipAmt;
						mip.hMipAmt = hMipAmt_;
						mip.lMipAmt = lMipAmt_;
						$(".Bomb-box").hide();
						isChange = false;
						isAlert = true;

					}
				);
				return;
			}
		}
	}
	
    if (riskInfo.code != '0000') {
        if (riskInfo.code == '9990' || riskInfo.code == '9991' || riskInfo.code == '9993') {
            $("#evaluation_tip").html(riskInfo.msg);
            $(".evaluation_risk_tip").show();
            return false;
        } else if (riskInfo.code == '9992' && App.isNotEmpty(riskInfo.subMsg)) {
            $("#risk_tip").html(riskInfo.subMsg);
            $(".tip").show();
            return false;
        }
    }
    fundMip();
}

function fundMip() {
	mip.mipDesc = $(".mip_name_zh").val().replace(/[ ]/g,"");
	mip.mipbuyamt = $(".mipbuyamt_zh").val();

    if (App.isEmpty(mip.mipDesc)) {
        mip.mipDesc = "定投计划" + new Date().format("yyyyMMdd");
    }
	var preName = '';
	if(arAcct){
		preName = '亲情宝-';
	}
	mip.mipDesc = preName + mip.mipDesc;
    if (App.isEmpty(mip.mipbuyamt)){
        alertTips("每期投资金额不能为空");
        return;
    } else if(Number(mip.mipbuyamt) < minMipAmt) {
        if(mip.mipKind == "1"){
            alertTips("最低" + $(".mipbuyamt_zh").attr("placeholder"));
        } else {
            alertTips("最低" + $(".mipbuyamt_jd").attr("placeholder"));
        }
        return;
    }


	//定投期数 如果有传入才获取输入框内容

	var periodNumber = $(".fm_periodNumber").val();
	if(App.isNotEmpty(periodNumber) && Number(periodNumber) >0){
		mip.periodNumber = periodNumber;
		mip.isSupportPeriod = 1;
	}else{
		mip.isSupportPeriod = 0;
	}


    var contractLength = $(".contract-div").children("p").length;
    var chkCnt = 0;
    $(".contract-div").children("p").each(function(){
    	if($(this).children("span").hasClass("current")){
    		chkCnt+=1;
    	}
    });
    if(!(contractLength == chkCnt) && App.isNotEmpty(readTxt)){
        alertTips("请先阅读" + readTxt);
        return;
    }

    var fundId = App.getUrlParam("fundId");
    if(App.isEmpty(fundId)){
        alertTips("请先选择基金");
        return;
    }else{
        mip.fundId = fundId;
    }

    mipIntelligent();

}

function mipIntelligent() {
	if(Number(mip.periodNumber) > 0 && (mip.periodNumber.indexOf('.') > -1 || mip.periodNumber.indexOf('-') > -1 )){
		alertTips("定投期数要为正整数");
	}else{
		// var url = App.projectNm + "/fund/interlligent_mip_apply";
		var data = mip;
		var url = '/mobile-bff/v1/fund/fund-mip-create';
		var forword_url = "/mobileEC/wap/fund/fund_mip_successfully.html";
        if(arAcct){
            data.arAcct = arAcct;
        }
		if(contractno){
			url = '/mobile-bff/v1/fund/fund-mip-edit';
			forword_url = "/mobileEC/wap/fund/fund_mip_edit_successfully.html";
			data.contractNo = contractno;
		} 

		utils.post(url, JSON.stringify(data), null, function (result) {
			// console.log(result);
			if (result.body != undefined && result.body != null){
				App.setSession(App.serialNo_info, result.body.info);
				App.setSession(App.serialNo, result.body.serialNo);
				App.setSession(App.serialNo_success_show_data, data);
				App.setSession(App.serialNo_forword_url, forword_url);
				utils.verifyTradeChain(result.body);
				// window.location.href = "../common/setPassword.html";
			}
		});
	}
}
function mipClassic() {
    // var url = App.projectNm + "/fund/fund_mip_create";
    var url = '/mobile-bff/v1/fund/fund-mip-create';
    mip.mipsetup="";
    var data = mip;

    utils.post(url, JSON.stringify(data), null, function (result) {
        // console.log(result);
        if (result.body != undefined && result.body != null){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/fund_mip_successfully.html");
            // window.location.href = "../common/setPassword.html";
            utils.verifyTradeChain(result.body);
        }
    });
}

    // 扣款周期
    var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": [],
	"DD": []
};
$(".selected-deduction-cycle").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $(".appDate").blur();
    return false
});
$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    var time = chooseTime[li.attr("data-choose-time")],
        str = "";
    setMipCycle(li.attr("data-choose-time"));
    li.addClass("on").siblings("li").removeClass("on");
    if(time.length == 0){
        $(".choose-time").hide();
        $(".appDate").attr("data-time", li.find("div").text());
        $(".appDate").html(li.find("div").text());
        mip.mipcycle = "ED";
        delete mip.mipbuyday;
        queryAutoRechargePageInfo();
        return;
    }else {
        if (!li.hasClass("on")) {
            for (var i = 0; i < time.length; i++) {
                str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
            };
            $(".choose-time2 ul").html(str);
            $(".appDate").attr("data-time", li.find("div").text())
        } else {
            for (var i = 0; i < time.length; i++) {
                str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
            };
            $(".choose-time2 ul").html(str);
            $(".appDate").attr("data-time", li.find("div").text())
        }
        $(".choose-time").hide();
        $(".choose-time2").show()
    }
});
    $(".choose-time2").click(function() {
		 var li = $(event.target).parents("li");
		 setMipBuyday(li.attr("data-choose-time"));
		 if (li.length == 0) {
		     return
		 };
		 $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
		 queryAutoRechargePageInfo();
		 $(this).hide()
	});

//开关  目标收益率设置开关
	$('.setting_target_rate_on_off').on('click',function(e){
		
		if(mip.autoRenewal=='1'){
			setTimeout(()=>{
				$('.setting_target_rate_on_off3 .setting_target_rate_on_off3_img').attr('src','../images/fund/on.png');
				if($("#trigger3").html() == "自动止盈"){
					$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
				}else{
					$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
				}
			},10)
		}else{
			setTimeout(()=>{
				$('.setting_target_rate_on_off3 .setting_target_rate_on_off3_img').attr('src','../images/fund/off.png');
				if($("#trigger3").html() == "自动止盈"){
					$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
				}else{
					$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
				}
			},10)
			
		}
	    if($(this).children('img').attr('src')=='../images/fund/off.png'){
			$("#setting_target_rate").attr("data-flag", "0");
	        $(this).children('img').attr('src','../images/fund/on.png');
			if($("#trigger3").html() == "自动止盈"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
			}
			$('#targetEm').show();
			$(".hide_color").hide()

			
			// targetAgreement = true;
	        $("#down_mubiao").show();
	        $(".next_text,.jihua").show();
	        $(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/on.png')
			mip.isOpenTargetProfit = "Y";
	    }else{
			$("#setting_target_rate").attr("data-flag", "1");
			if($("#trigger3").html() == "自动止盈"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
			}
			$('#targetEm').hide();
			$(".hide_color").show()
			$(".target-rate-view").hide();
			$("#targetAgreement").hide();
			targetAgreement = false;
			// if($("#isReadTarget").hasClass("current")){
			// 	$("#isReadTarget").removeClass("current");
			// }
			mip.isOpenTargetProfit = "N";
	        $(this).children('img').attr('src','../images/fund/off.png')
	    }
	    var setting_target_rate = $("#setting_target_rate").attr("data-flag");
	    if (setting_target_rate == "0") {
	        $("#setting_target_rate").attr("data-flag", "1");
	        
	        mip.targetProfit = '0.06';
	        $(".next_text,.jihua").show();
	    } else {
	        $("#setting_target_rate").attr("data-flag", "0");
	        $(".target-rate-view").hide();
	        
	        delete mip.targetProfit;
	    }
	});
	$(".setProfit1").click(function(){
		$("#down_mubiao").show();
	});
	//开关 策略定期不定额策略设置
	$('.setting_target_rate_on_off2').on('click',function(){
		mip.mipsetup = "3";
		var setting_target_rate2 = $("#setting_target_rate2").attr("data-flag");
		if($(this).children('img').attr('src')=='../images/fund/off.png'){
			if(App.numberFormat($(".mipbuyamt_zh").val()) <= 0){
				alertTips("请填写每期投资金额");
			}else{
				$(this).children('img').attr('src','../images/fund/on.png')
				$("#down_dinqi").show();
			}
			mip.isSupportStrategy = "1";
		}else{
			mip.isSupportStrategy = "0";
			$(".target-rate-view2").hide();
		    $(this).children('img').attr('src','../images/fund/off.png')
		}
		if (setting_target_rate2 == "0") {
		    
			$("#setting_target_rate2").attr("data-flag", "1");
			if(App.numberFormat($(".mipbuyamt_zh").val()) <= 0){
				alertTips("请填写每期投资金额");
			}else{
				high = App.formatMoney($(".mipbuyamt_zh").val()*0.6,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*2.1,2);
				mip.hMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
				mip.dcrIndex = 0.6;// 加码指标
				mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.icIndex = 2.1;// 减码指标码金额
				$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+$("#trigger").html()+"</span>，参考均线：<span  style='color:#FB5C5F'>"+$("#trigger2").html()+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
		    	lowYield = 2;
		    	highYield = 0.5;
				high = App.formatMoney($(".mipbuyamt_zh").val()*highYield,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*lowYield,2);
		    	$("#below_deduction_amt").val(low.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,''));
		    	$("#above_deduction_amt").val(high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,''));
			}
		} else {
		    $("#setting_target_rate2").attr("data-flag", "0");
		   $(".target-rate-view2").hide();
		   
		}
	});

	$(".setProfit2").click(function(){
		
		if(App.numberFormat($(".mipbuyamt_zh").val()) <= 0){
			alertTips("请填写每期投资金额");
		}else{
			if($("#strategy_txt").html() == "均线策略"){
				mip.mipsetup = "3";
				high = App.formatMoney($(".mipbuyamt_zh").val()*0.6,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*2.1,2);
				mip.hMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
				mip.dcrIndex = 0.6;// 加码指标
				mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.icIndex = 2.1;// 减码指标码金额
				$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+$("#trigger").html()+"</span>，参考均线：<span  style='color:#FB5C5F'>"+$("#trigger2").html()+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
			}else{
		    	lowYield = 2;
		    	highYield = 0.5;
				high = App.formatMoney($(".mipbuyamt_zh").val()*highYield,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*lowYield,2);
		    	$("#below_deduction_amt").val($("#below_deduction_amt").val()< minMipAmt ? App.formatMoney(minMipAmt,2) : $("#below_deduction_amt").val());
		    	$("#above_deduction_amt").val($("#above_deduction_amt").val()< minMipAmt ? App.formatMoney(minMipAmt,2) : $("#above_deduction_amt").val());
				mip.mipsetup = "0";
			}
			$("#down_dinqi").show();
		}
	});
	//勾选
	$(".rules").click(function () {
	    $(".chose-icon").toggleClass("current");
	});


// 以下是二个下滑窗
 //目标收益率设置JS
        // 切换样式
    $('.aim span').on('click', function () {
        $(this).addClass('clr').siblings().removeClass('clr');
        $("#target_profit").html($(this).attr("data-flag")+"%");
        if($(this).attr("data-flag") != "自定义"){
			mip.targetProfit = Number($(this).attr("data-flag")) / 100;
		}
    })
    // 显示隐藏
    $(".target-rate-1").click(function () {
        $(".target-rate-view-customize").hide();
     })
    $(".target-rate-0").click(function () {
        $(".target-rate-view-customize").show();
    });

    //开关 
    $('.setting_target_rate_on_off3 .setting_target_rate_on_off3_img').on('click',function(){
         var setting_target_rate = $("#setting_target_rate").attr("data-flag");
        if (setting_target_rate == "0") {
			$("#setting_target_rate").attr("data-flag", "1");

            mip.autoRenewal = "0";
        } else {
            $("#setting_target_rate").attr("data-flag", "0");

			mip.autoRenewal = "1";
        }

        if(  $(this).attr('src')=='../images/fund/off.png'){
			if($("#trigger3").html() == "自动止盈"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
			}
            $(this).attr('src','../images/fund/on.png')
        }else{
			if($("#trigger3").html() == "自动止盈"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
			}
            $(this).attr('src','../images/fund/off.png')
        }
    });
// 关闭目标收益率
    $("#mubiao").click(function(){//写数据到页面并展示
		mip.isOpenTargetProfit = "Y";
		mip.isContinueHold = 1;
    	$(".target-rate-view").show();
		$('.hide_color').hide();
    	$("#target_profit_txt").html($("#next_txt").html());
    	if($("#target_profit").html() == "0%" || App.isEmpty($("#target_profit").html()) || $(".target-rate-0").hasClass("clr")){
    		var targetProfit = $("#targetProfit").val();
    		$("#target_profit").html(targetProfit);
            if(App.isEmpty(targetProfit)){
                alertTips("自定义收益率不能为空");
                return;
            }else if(Number(targetProfit) < 5){
                alertTips("自定义收益率不能小于5");
                return;
            }
            $("#target_profit").html(targetProfit+"%");
            mip.targetProfit = Number(targetProfit) / 100;
    	}
		
        if($(".setting_target_rate_on_off3").children('img').attr('src')=='../images/fund/on.png'){

			mip.autoRenewal = 1;
			if($("#trigger3").html() == "自动止盈"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
				mip.isContinueHold = 0;
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
			}
        }else{
			mip.autoRenewal = 0;
			if($("#trigger3").html() == "自动止盈"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
				mip.isContinueHold = 0;
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
			}
        }
		
    	//弹窗提示
    	if($("#trigger3").html() == "自动止盈"){
    		$("#alert4").css({"height":"10rem","overflow-x":"hidden","overflow-y":"visible"});
			alertTips4("达标赎回须知",alertHtml, "取消", "已知悉",
                    function(){
	                	$(".Bomb-box").hide();
	                	$(".Bomb-box-ok").show();
	                	$(".Bomb-box-ok").next("div").remove();
                		$("#alert4").removeClass("cls");
                		$("#alert4").css({"height":"auto","overflow-x":"hidden","overflow-y":"visible"});
                		},
                    function(){
                		$(".Bomb-box").hide();
                		$("#down_mubiao").hide();
                		$(".Bomb-box-ok").show();
                		$(".Bomb-box-ok").next("div").remove();
                		$("#alert4").removeClass("cls");
                		$("#alert4").css({"height":"auto","overflow-x":"hidden","overflow-y":"hidden"});
                		}
                );
			return ;
    	}else{
        	$("#down_mubiao").hide()
    	}
    })

// 定期不定额策略js
   //开关切换
        $('.left').on('click',function(){  
         if ($(this).hasClass("active")) {
                return;
            }
            $(this).addClass("active").parents().siblings().find(".left").removeClass('active');      
        });
   // 显示隐藏成本策略和均线策略
    $("#cost").click(function(){
    	mip.mipsetup = "0";
    	$("#strategy_txt").html("成本策略");
        $(".display-cost").show()
        $(".display-average").hide()
    	lowYield = 2;
    	highYield = 0.5;
		high = App.formatMoney($(".mipbuyamt_zh").val()*highYield,2);
		low = App.formatMoney($(".mipbuyamt_zh").val()*lowYield,2);
		
    	$("#below_deduction_amt").val(low.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,''));
    	$("#above_deduction_amt").val(high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,''));
    })
    $("#average").click(function(){
    	mip.mipsetup = "3";
    	$("#strategy_txt").html("均线策略");
        $(".display-cost").hide()
        $(".display-average").show()
    })
    //初始化数据
    // 关闭定期不定额策略下滑
        $("#dinqi").click(function(){
        	if($("#strategy_txt").html() == "均线策略"){
				high = App.formatMoney($(".mipbuyamt_zh").val()*0.6,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*2.1,2);
				mip.lMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
				mip.dcrIndex = 0.6;// 加码指标
				mip.hMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.icIndex = 2.1;// 减码指标码金额
        		$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+$("#trigger").html()+"</span>，参考均线：<span  style='color:#FB5C5F'>"+$("#trigger2").html()+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
				mip.isSupportStrategy = "1";
				$(".target-rate-view2").show();
				$("#down_dinqi").hide()
			}else{
				lowYield = $("#below_ratio").val();
				highYield = $("#above_ratio").val();
				low = App.formatMoney($(".mipbuyamt_zh").val()*2,2);
				high = App.formatMoney($(".mipbuyamt_zh").val()*0.5,2);
				
				mip.lMipAmt = $("#above_deduction_amt").val() < minMipAmt ? App.formatMoney(minMipAmt,2) : $("#above_deduction_amt").val();// 加码金额
				mip.icIndex = lowYield;// 加码指标
				mip.hMipAmt = $("#below_deduction_amt").val() < minMipAmt ? App.formatMoney(minMipAmt,2) : $("#below_deduction_amt").val();// 减码金额
				mip.dcrIndex = highYield;// 减码指标码金额
        		$("#strategy_line").html("实际每期扣款金额为"+ App.formatMoney(mip.lMipAmt,2) +"-"+App.formatMoney(mip.hMipAmt,2)+"元，");
				var is_ok = false;
				//校验扣款金额
				var below_deduction_amt = $("#below_deduction_amt").val();
				if(below_deduction_amt < minMipAmt){
					alertTips("定投金额不得少于"+minMipAmt+"元")
					is_ok = true;
				}

				var above_deduction_amt = $("#above_deduction_amt").val();
				if(above_deduction_amt < minMipAmt){
					alertTips("定投金额不得少于"+minMipAmt+"元")
					is_ok = true;
				}
				if(!is_ok){
					$(".target-rate-view2").show();
					$("#down_dinqi").hide();
				}
				mip.isSupportStrategy = "1";
        	}

        })

   // 均线策略和成本策略删除金额
    $("#low").click(function(event) {
        $(".low").val("")
    });
    $("#high").click(function(event) {
        $(".high").val("")
    });



function queryStrategy(t) {
    var url = "/ats-ng/v1/agreement/config/query/strategy-info?strategyTypeList="+t;
    utils.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
    		var htm = result.body[0].strategyDesc;
    		if(App.isNotEmpty(result.body[0].strategyUrl)){
    			htm+='&nbsp;&nbsp;<a href="'+result.body[0].strategyUrl+'" style="color:#148CE6">查看详情</a>';
    		}
    		var dis = result.body[0].strategyNameDis;
        	if(t == 0){
	            $("#strategyDesc1").html(htm);
	            $("#strategyNameDis1").html(dis);
        	}else{
	            $("#strategyDesc").html(htm);
	            $("#strategyNameDis").html(dis);
	            var referIndexInfo = result.body[0].referIndexInfo;
	            var referAverageInfo = result.body[0].referAverageInfo;
	            
	            for(var k in referIndexInfo){
	            	var data1 = {};
	            	data1.id = referIndexInfo[k].referIndexCode;
	            	data1.value = referIndexInfo[k].referIndexName;
	            	weekdayArr1.push(data1);
	            }
	            
	            for(var m in referAverageInfo){
	            	var data2 = {};
	            	data2.id = referAverageInfo[m].referIndexCode;
	            	data2.value = referAverageInfo[m].referIndexName;
	            	weekdayArr2.push(data2);
	            }
	            //初始化数据
	            if(App.isEmpty(App.getUrlParam("fm_index"))){
	            	$("#trigger").html(weekdayArr1[0].value);
	        	}
	        	if(App.isEmpty(App.getUrlParam("fm_line"))){
	            	$("#trigger2").html(weekdayArr2[0].value);
	        	}
	            
		   // 参考指数和参考均线底部下滑框

		        var mobileSelect2 = new MobileSelect({
		            trigger: '#trigger', 
		            title: '',  
		            wheels: [
		                        {data:weekdayArr1}
		                    ],
		            position:[0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
		            transitionEnd:function(indexArr, data){

		            },
		            callback:function(indexArr, data){

		                mipDit = indexArr;
		                // that.setDate=data[0];
		                $("#trigger").html(data[0].value)
						mip.referIndexCode = data[0].id;
		            }
		        });

		        var mobileSelect3 = new MobileSelect({
		            trigger: '#trigger2', 
		            title: '',  
		            wheels: [
		                        {data:weekdayArr2}
		                    ],
		            position:[0], //初始化定位 打开时默认选中的哪个 如果不填默认为0
		            transitionEnd:function(indexArr, data){

		            },
		            callback:function(indexArr, data){

		                mipDit = indexArr;
						mip.referAverageCode = data[0].id;
		                $("#trigger2").html(data[0].value)
		            }
		        });  
	            
	        }
        }
    });
}

function showTips(t){
	$("#tips"+t).show();
}

