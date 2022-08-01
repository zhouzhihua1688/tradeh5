var lowYield = "10.00";
var highYield = "0.50";
var high = minMipAmt;
var low = minMipAmt;
var weekdayArr1=[];
var weekdayArr2=[];
var alertHtml = '';

getHtml();
$("#btn_sub").css({'background-color':'#ddd6d6'});
function getHtml(){
    var url = "/mobile-bff/v1/unification/query?keys=benefitPlaningStopTips";
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
        	alertHtml = result.body.benefitPlaningStopTips.unificationValue;
        }
    });
	
}
$(function () {

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
    App.queryCard(function () {
        initCardList();
    });
    mip.fundId = App.getUrlParam("fundId");
    queryAutoRechargePageInfo();
    showSmTip();
    $("#continue_pur").on("click", continueMip);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=../fund/payment.html?fundId=" + App.getUrlParam("fundId"));
    
    //根据链接带的参数初始化数据
    
    var fm_mipName = decodeURI(decodeURI(App.getUrlParam("fm_mipName")));//定投名称
    if(App.isNotEmpty(fm_mipName)){
    	$(".mip_name_zh").val(fm_mipName);
    	mip.mipDesc = fm_mipName;
    }
    var fm_mipAmt = App.getUrlParam("fm_mipAmt");//定投金额
    if(Number(fm_mipAmt) > 0){
    	$(".mipbuyamt_zh").val(fm_mipAmt);
    	mip.mipbuyamt = fm_mipAmt;
    }
    var fm_mipCycle = App.getUrlParam("fm_mipCycle");//定投周期
    var fm_mipBuyDay = App.getUrlParam("fm_mipBuyDay");//定投扣款日
    if(fm_mipCycle == "MM"){//每月
    	mip.mipcycle = fm_mipCycle;
    	mip.mipbuyday = fm_mipBuyDay;
    	$(".appDate").html("每月"+fm_mipBuyDay+"日");
    	//下一次扣款日
		queryAutoRechargePageInfo();
    }else if(fm_mipCycle == "2W"){//每双周
    	mip.mipcycle = fm_mipCycle;
    	mip.mipbuyday = fm_mipBuyDay;
    	$(".appDate").html("每双周"+chooseTime[fm_mipCycle][fm_mipBuyDay]);
    	//下一次扣款日
		queryAutoRechargePageInfo();
    }else if(fm_mipCycle == "WW"){//每周
    	mip.mipcycle = fm_mipCycle;
    	mip.mipbuyday = fm_mipBuyDay;
    	$(".appDate").html("每周"+chooseTime[fm_mipCycle][fm_mipBuyDay]);
    	//下一次扣款日
		queryAutoRechargePageInfo();
    }else if(fm_mipCycle == "ED"){//每天
    	mip.mipcycle = fm_mipCycle;
    	$(".appDate").html("每日");
    	//下一次扣款日
		queryAutoRechargePageInfo();
    }
    var fm_mipRate = App.getUrlParam("fm_mipRate");//目标收益率
    if(Number(fm_mipRate) > 0){
    	$(".setting_target_rate_on_off").children('img').attr('src','../images/fund/on.png')
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
    }
    var fm_isContinue = App.getUrlParam("fm_isContinue");//是否续期
    if(fm_isContinue == 1){
    	mip.autoRenewal = 1;
    	$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/on.png')
	}else if(fm_isContinue == 0){
		mip.autoRenewal = 0;
		$(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/off.png')
	}
    var fm_isHold = App.getUrlParam("fm_isHold");//是否继续持有
    if(fm_isHold == 1){
    	mip.isContinueHold = 1;
    	$("#trigger3").html("继续持有");
    }else if(fm_isHold == 0){
	//	mip.isContinueHold = 0;
    //	$("#trigger3").html("全部赎回");
    }

    var fm_strategy = App.getUrlParam("fm_strategy");//定投策略
    if(fm_strategy == "0"){//成本
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
		mip.hMipAmt = fm_lowAmt;
		mip.icIndex = fm_addRate;
		mip.lMipAmt = fm_addAmt;
		$("#strategy_line").html("实际每期扣款金额为"+mip.hMipAmt+"-"+mip.lMipAmt+"元，");
		$(".target-rate-view2").show();
	}else if(fm_strategy == "3"){//均线
    	$("#cost").removeClass("active");
    	$("#average").addClass("active");
		$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/on.png');
		$("#strategy_txt").html("均线策略");
		$(".display-cost").hide()
		$(".display-average").show()
		mip.mipsetup = "3";
		var fm_index = decodeURI(decodeURI(App.getUrlParam("fm_index")));//参考指数
		$("#trigger").html(fm_index);
		var fm_line = decodeURI(decodeURI(App.getUrlParam("fm_line")));//参考均线
		$("#trigger2").html(fm_line);
		
	    var url = "/ats-ng/v1/agreement/config/query/strategy-info?strategyTypeList=3";
	    App.get(url, null, function(result){
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
		mip.hMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
		mip.icIndex = 0.6;// 加码指标
		mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
		mip.dcrIndex = 2.1;// 减码指标码金额
    	$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+fm_index+"</span>，参考均线：<span  style='color:#FB5C5F'>"+fm_line+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
    	$(".target-rate-view2").show();
    }else{
		$(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/off.png');
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
    "autoRenewal":"0",
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
    var url = App.projectNm + "/common/check_union_risk_level?productId=" + fundId;
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            riskInfo = result.body;
            if (result.body.code == '9990' || result.body.code == '9991' || result.body.code == '9993') {
                $("#evaluation_tip").html(result.body.msg);
                $(".evaluation_risk_tip").show();
            } else if (result.body.code == '9992') {
                $(".sm_tip").show();
                setTimeout(function () {
                    $(".sm_tip").hide()
                }, 2000);
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
    mip.mipDesc = $(".mip_name_zh").val();
});

$(".mipbuyamt_zh").on("input", function () {
    mip.mipbuyamt = $(".mipbuyamt_zh").val();
    var strategyFlag = $("#strategy_txt").attr("data-flag");
    $(".target-rate-view2").hide();
    $(".setting_target_rate_on_off2").children('img').attr('src','../images/fund/off.png')
    if (mip.mipKind == 1) {
        //strategyCalculation(strategyFlag, mip.mipbuyamt);
    }
    var contractLength = $(".contract-div").children("p").length;
    var chkCnt = 0;
    $(".contract-div").children("p").each(function(){
    	if($(this).children("span").hasClass("current")){
    		chkCnt+=1;
    	}
    });
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
    
});

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

        var signStyle;
        if(card.signWay == "1"){
            signStyle = "shorcut";
        }else if(card.signWay == "2"){
            signStyle = "union";
        }else if(card.signWay == "3"){
            signStyle = "E-bank";
        }else if(card.signWay == "5"){
            continue;
        }

        html += "<li class=\"grid-list-item heigth-130 bottom-border bank-card-option\" data=\""+ card.bankNo +","+ card.bankAcco +"\">\n" +
            "                <div class=\"row\">\n" +
            "                    <div class=\"lh-130 first\">\n" +
            "                        <i class=\"bank ico_" + card.bankNo + " no-margin-left\"></i> \n" +
            "                    </div>\n" +
            "                    <div class=\"col-1\">\n" +
            "                        <div class=\"list-title\">\n" +
            "                            <p class=\"bank-name\">" + card.bankName + " [ " + card.bankAccoDisplay + " ]</p>\n" +
            "                            <p class=\"bank-id\" id=\"xjb_remark\">"+ card.limitRemark + "</p>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                    <div class=\"lh-130 "+ signStyle +"\">\n" +
            "                        <a class=\"icon icon-union\">银联通</a>\n" +
            "                        <a class=\"icon icon-E-bank\">网银</a>\n" +
            "                        <a class=\"icon icon-shorcut\">快捷</a>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </li>";
    }
    $(".bankCardList-div").html(html);
    $(".bank-card-option").on("click", handlerCard);
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
    var url = App.projectNm + "/account/account?r=" + (Math.random() * 10000).toFixed(0);

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            balance = result.body.balance;
            $(".xjb-balance").html("现金宝可用余额" + App.formatMoney(balance + '') + "元");
        }
    });
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

    App.post(url,JSON.stringify({"fundId": fundId}),function(result){
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
				var html0 = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead" class="chose-icon "></span>我已同意<a href="http://static.99fund.com/mobile/agreement/zhihuidingtou_agreement.html">《汇添富基金管理股份有限公司定投业务协议》</a>&nbsp;</p>';

				$(".contract-div").append(html0);
				App.bind("#isRead","tap",function(){
					if(!$("#isRead").hasClass("current")){
						$("#isRead").addClass("current")
						var contractLength = $(".contract-div").children("p").length;
						var chkCnt = 0;
						$(".contract-div").children("p").each(function(){
							if($(this).children("span").hasClass("current")){
								chkCnt+=1;
							}
						});
						if(Number($(".mipbuyamt_zh").val()) > 0  && (contractLength == chkCnt)){
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

					if(item0 == "KFS"){
						html = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead'+index0+'" class="chose-icon"></span>我已阅读并确认已知悉';
					}else{
						html = '<p class="rules" style="font-size:0.635rem;margin-left: .75rem;"><span id="isRead'+index0+'" class="chose-icon"></span>我已同意';
					}
	            	
	                fundContractList.forEach(function (item, index) {

	            		if(item0 == item.contractCategory){
		                    html += "<a href=\""+ item.url +"\">《"+ item.title +"》</a>";
		                    readTxt += "《" + item.title + "》";
		                    if((index + 1) < fundContractList.length) {
		                        html += "&nbsp;";
		                    }
	                	}
	                });
                	html += '</p>';
                	$(".contract-div").append(html);
					App.bind("#isRead"+index0,"tap",function(){
						if(!$("#isRead"+index0).hasClass("current")){
							$("#isRead"+index0).addClass("current")
							var contractLength = $(".contract-div").children("p").length;
							var chkCnt = 0;
							$(".contract-div").children("p").each(function(){
								if($(this).children("span").hasClass("current")){
									chkCnt+=1;
								}
							});
					        if(Number($(".mipbuyamt_zh").val()) > 0  && (contractLength == chkCnt)){
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
            }
            
            
        }
    });
}

var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": []
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

    var url = App.projectNm + "/fund/query_fund_mip_last_period_dt?date=" + (new Date()).getTime() + "&mipCycle=" + getMipCycle();

    var mipBuyday = getMipBuyday();
    if (mipBuyday != undefined && mipBuyday != null){
        url += "&mipDt=" + mipBuyday;
    }

    App.get(url, null, function(result) {
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

    App.get(url, null, function(result){
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
    mip.icIndex = lowYield;// 加码指标
    mip.lMipAmt = low;// 减码金额
    mip.dcrIndex = highYield;// 减码指标
    $(".h-mip-amt").html(App.formatNumber(high, 2));
    $(".l-mip-amt").html(App.formatNumber(low, 2));
    $(".h-mip-yield").html(App.formatNumber(lowYield, 2));
    $(".l-mip-yield").html(App.formatNumber(highYield, 2));
    queryFee("H", high);
    queryFee("L", low);
}

function queryFee(type,purAmt) {
    var fundId = App.getUrlParam("fundId");

    var url = App.projectNm + "/fund/fund_fee";
    var bankNo = App.isEmpty(mip.bankNo) ? "" : mip.bankNo;
    var data = {"subAmt": purAmt, "fundId": fundId, "cashFrm": mip.cashFrm, "shareType": "A", "bankNo": bankNo};

    App.post(url, JSON.stringify(data), null, function (result) {
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
	/*
    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }*/
    fundMip();
}

function mipCheck() {
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
    if (App.isEmpty(mip.mipDesc)) {
        mip.mipDesc = "定投计划" + new Date().format("yyyyMMdd");
    }
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
    var setting_target_rate = $("#setting_target_rate").attr("data-flag");
    if(mip.mipKind == "1" && setting_target_rate == "1"){
        mip.isOpenTargetProfit = "Y";
        var selected_target_rate = $(".selected-target-rate").attr("data-flag");
        if(selected_target_rate == "0"){

        } else {
            
        }
    } else {
        mip.isOpenTargetProfit = "N";
    }

    var deductionCycleFlag = $("#setting_deduction_cycle").attr("data-flag");
//    mip.isSupportPeriod = deductionCycleFlag;
    if(deductionCycleFlag == "1"){
        var deductionCycleTypeFlag = $(".selected_deduction_cycle_type").attr("data-flag");
        mip.periodNumber = Number(deductionCycleTypeFlag);
        if (deductionCycleTypeFlag == "0"){
            var periodNumber = $("#periodNumber").val();
            if(App.isEmpty(periodNumber)){
                alertTips("自定义期数不能为空");
                return;
            }
            mip.periodNumber = periodNumber;
        }
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
   
    if(mip.mipKind == "1"){
        mipIntelligent();
    } else {
        mipClassic();
    }
}

function mipIntelligent() {
    var url = App.projectNm + "/fund/interlligent_mip_apply";
    var data = mip;

    App.post(url, JSON.stringify(data), null, function (result) {
        // console.log(result);
        if (result.body != undefined && result.body != null){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            App.setSession(App.serialNo_forword_url, "../fund/fund_mip_successfully.html");
            window.location.href = "../common/setPassword.html";
        }
    });
}
function mipClassic() {
    var url = App.projectNm + "/fund/fund_mip_create";
    mip.mipsetup="";
    var data = mip;

    App.post(url, JSON.stringify(data), null, function (result) {
        // console.log(result);
        if (result.body != undefined && result.body != null){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            App.setSession(App.serialNo_forword_url, "../fund/fund_mip_successfully.html");
            window.location.href = "../common/setPassword.html";
        }
    });
}

    // 扣款周期
    var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": []
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
	$('.setting_target_rate_on_off').on('click',function(){
	    if($(this).children('img').attr('src')=='../images/fund/off.png'){
	        $(this).children('img').attr('src','../images/fund/on.png')
	        $("#down_mubiao").show();
	        $(".next_text,.jihua").show();
	        $(".setting_target_rate_on_off3").children('img').attr('src','../images/fund/on.png')
	    }else{
	        $(this).children('img').attr('src','../images/fund/off.png')
	    }
	    var setting_target_rate = $("#setting_target_rate").attr("data-flag");
	    if (setting_target_rate == "0") {
	        $("#setting_target_rate").attr("data-flag", 1);
	        $(".hide_color").hide()
	        mip.isOpenTargetProfit = "1";
	        mip.targetProfit = '0.06';
	        $(".next_text,.jihua").show();
	    } else {
	        $("#setting_target_rate").attr("data-flag", 0);
	        $(".target-rate-view").hide();
	        $(".hide_color").show()
	        mip.isOpenTargetProfit = "0";
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
		}else{
			$(".target-rate-view2").hide();
		    $(this).children('img').attr('src','../images/fund/off.png')
		}
		if (setting_target_rate2 == "0") {
		    $("#setting_target_rate2").attr("data-flag", 1);
		    mip.isSupportStrategy = "1";
			if(App.numberFormat($(".mipbuyamt_zh").val()) <= 0){
				alertTips("请填写每期投资金额");
			}else{
				high = App.formatMoney($(".mipbuyamt_zh").val()*0.6,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*2.1,2);
				mip.hMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
				mip.icIndex = 0.6;// 加码指标
				mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.dcrIndex = 2.1;// 减码指标码金额
				$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+$("#trigger").html()+"</span>，参考均线：<span  style='color:#FB5C5F'>"+$("#trigger2").html()+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
		    	lowYield = 2;
		    	highYield = 0.5;
				high = App.formatMoney($(".mipbuyamt_zh").val()*highYield,2);
				low = App.formatMoney($(".mipbuyamt_zh").val()*lowYield,2);
		    	$("#below_deduction_amt").val(low.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,''));
		    	$("#above_deduction_amt").val(high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,''));
			}
		} else {
		    $("#setting_target_rate2").attr("data-flag", 0);
		   $(".target-rate-view2").hide();
		   mip.isSupportStrategy = "0";
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
				mip.icIndex = 0.6;// 加码指标
				mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.dcrIndex = 2.1;// 减码指标码金额
				$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+$("#trigger").html()+"</span>，参考均线：<span  style='color:#FB5C5F'>"+$("#trigger2").html()+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
			}else{
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
    $('.setting_target_rate_on_off3').on('click',function(){
         var setting_target_rate = $("#setting_target_rate").attr("data-flag");
        if (setting_target_rate == "0") {
			$("#setting_target_rate").attr("data-flag", 1);

           mip.autoRenewal = "0";
        } else {
            $("#setting_target_rate").attr("data-flag", 0);

			mip.autoRenewal = "1";
        }

        if(  $(this).children('img').attr('src')=='../images/fund/off.png'){
			if($("#trigger3").html() == "全部赎回"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以择时自行赎回，同时该计划将继续进入下一期。');
			}
            $(this).children('img').attr('src','../images/fund/on.png')
        }else{
			if($("#trigger3").html() == "全部赎回"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
			}
            $(this).children('img').attr('src','../images/fund/off.png')
        }
    });
// 关闭目标收益率
    $("#mubiao").click(function(){//写数据到页面并展示
    	$(".target-rate-view").show();
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
    	//弹窗提示
    	if($("#trigger3").html() == "全部赎回"){
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
				mip.hMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');// 加码金额
				mip.icIndex = 0.6;// 加码指标
				mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.dcrIndex = 2.1;// 减码指标码金额
        		$("#strategy_line").html("参考指数：<span  style='color:#FB5C5F'>"+$("#trigger").html()+"</span>，参考均线：<span  style='color:#FB5C5F'>"+$("#trigger2").html()+"</span>，实际每期扣款金额为"+high.replace(/,/g,'')+"-"+low.replace(/,/g,'')+"元，");
        	}else{
				lowYield = $("#below_ratio").val();
				highYield = $("#above_ratio").val();
				low = App.formatMoney($(".mipbuyamt_zh").val()*2,2);
				high = App.formatMoney($(".mipbuyamt_zh").val()*0.5,2);
				$("#below_deduction_amt").val(low);
				$("#above_deduction_amt").val(high);
				mip.hMipAmt = high.replace(/,/g,'')< minMipAmt ? App.formatMoney(minMipAmt,2) : high.replace(/,/g,'');;// 加码金额
				mip.icIndex = lowYield;// 加码指标
				mip.lMipAmt = low.replace(/,/g,'') < minMipAmt ? App.formatMoney(minMipAmt,2) : low.replace(/,/g,'');// 减码金额
				mip.dcrIndex = highYield;// 减码指标码金额
        		$("#strategy_line").html("实际每期扣款金额为"+mip.hMipAmt+"-"+mip.lMipAmt+"元，");
        	}
            $(".target-rate-view2").show();
            $("#down_dinqi").hide()
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
    App.get(url, null, function(result){
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

//生产只有一种
var weekdayArr3=[    {        "id": "1",        "value": "继续持有"    }];
//测试2种
//var weekdayArr3=[ {        "id": "0",        "value": "全部赎回"    },    {        "id": "1",        "value": "继续持有"    }];
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
			if($("#trigger3").html() == "全部赎回"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将继续进入下一期。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，您可以选择自行赎回，同时该计划将继续进入下一期。');
			}
        }else{
			if($("#trigger3").html() == "全部赎回"){
				$(".trigger3_txt").html('达到目标收益后，计划内份额将<span style="color:#FB5C5F" >自动赎回</span>至现金宝账户，同时该计划将终止。');
			}else{
				$(".trigger3_txt").html('达到目标收益后，您将<span style="color:#FB5C5F" >继续持有</span>计划内份额，同时该计划将终止。');
			}
        }
        mip.isContinueHold = data[0].id;
    }
});  


