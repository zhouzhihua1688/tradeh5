$(function () {
//问号提示
    $(".icon-question-coupon").click(function (event) {
        event.stopPropagation();
        $(".Bomb-box2").show();
    });
    $(".icon-question-transfer").click(function (event) {
        event.stopPropagation();
        $(".Bomb-box1").show();
    });
    $(".Bomb-box-ok").click(function () {
        $(this).parent().parent().hide();
    });
    $(".Bomb-box-2").click(function () {
        $(this).parent().parent().parent().hide();
    });
    //勾选
    $(".rules").click(function () {
        $(".chose-icon").toggleClass("current");
    });
    //调仓方式
    $(".select-transfer-type").click(function () {
        $(".transfer_type_list").show();
    });
    $(".transfer_type_list").click(function(event) {
        var li = $(event.target).parents("li");
        if (li.length == 0) {
            $(".transfer_type_list").hide();
            return
        };
        if (!li.hasClass("on")) {
            li.addClass("on").siblings("li").removeClass("on");

        };
        $(".transfer_type_list").hide();
        $(".select-transfer-type").html(li.find("div").text());
        $(".select-transfer-type").attr("data-flag", li.attr("data-flag"));
    });
    //选择礼券
    $(".my-coupon").click(function () {
        $("#couponList").show();
        $(".mask").show();
    });
    //礼券列表关闭
    $(".close_button").click(function () {
        $("#couponList").hide();
        $(".mask").hide();
    });
    //选择银行卡
    $(".select-bank-card").click(function () {
        $("#bankCardList").show();
    });
    $("#purchaseAmt").on("keyup", queryGroupFee($("#purchaseAmt").val()));
    var groupId = App.getUrlParam("groupId");
    queryAccount();
    queryCard();
    requestGroupFundDetail(groupId);
    queryTradeInfo(groupId);
    queryTips();
    $("#continue_pur").on("click", continuePurchase);
    $("#go_to_risk_test").attr("href", "../common/riskTest.html?forwardUrl=../fundgroup/payment.html?groupId=" + groupId);
});
var custNo = App.getCookie("sso_cookie_ext_dp");
var couponList = [];
var sBankNo = "";
var sBankAcco = "";
var sBankName = "";
var sBankDisplayCard = "";
var selectedCoupon = "";
var groupName = "";
var groupType = "";
var fee = 0;
var balance = 0;
var cardsCount = 0;
var riskInfo = {code: '0000', msg: ''};
var isShowToBindCard = false;
var couponTxt = "";
var dataIndex="";
//根据参数显示配比数据
    var groupId = App.getUrlParam("groupId");
    var fundIds = App.getUrlParam("fundIds");
    var percents = App.getUrlParam("percents");
	if(App.isEmpty(fundIds)){
		
		fundIds = '519066,519069,006113,000083,000696,008063,006308,001668';
	}
	if(App.isEmpty(percents)){
		percents = '15,15,15,15,10,10,10,10';
		
	}
    if(fundIds != ""){
    	queryFundInfo(fundIds);
    }
    //处理数据
    var arr1 = fundIds.split(",");
    var arr2 = percents.split(",");
    var list = [];

    for(var i = 0; i < arr1.length; i++){
        var map = {};
    	map['fundId'] = arr1[i];
    	list.push(map);
    }
	var total_per = 0;
    for(var j = 0; j < list.length; j++){
    	list[j]['fundPercent'] = arr2[j];
    	total_per+= parseInt(arr2[j]);
    }
	$("#select_cnt").html(arr1.length);
	$("#select_per").html(App.formatMoney(total_per + '') +"%")
    //批量查询基金信息
    function queryFundInfo(fundIds){
        App.get(App.projectNm + "/fund/get_fund_pack_pur_info?fundIds="+fundIds+"&t=" + new Date().getTime(),null, function(result){
        	if (result.body != undefined && result.body != null){
                var fundPackPurInfoList = result.body.fundPackPurInfoList;
                if(fundPackPurInfoList.length > 0){
                	var htm = '';
                	
                	for(var k in fundPackPurInfoList){
                		var item = fundPackPurInfoList[k];
                		var percent = '';
                		for(var m = 0; m < list.length; m++){
                			
                			if(list[m]['fundId'] == item.fundId){
                				percent = list[m]['fundPercent'];
                				list[m]['fundNm'] = item.fundName;
                			}
                		}
                		htm+='<div class="group clearfix">'
                			+'<p class="col-6 text-left">'+item.fundName+'</p><p class="col-4 text-right">0.00</p><p class="col-2 text-right"><span class="margin-R30">'+percent+'%</span></p>'
            				+'</div>';

                	}
                	$(".box1").html(htm);
                	
                }
            }
            
        });
    }
    //批量查询基金信息
    function queryGroupFee(amt){
	    var fundsList = [];

	    for(var i = 0; i < arr1.length; i++){
	        var map1 = {};
	    	map1["fundId"] = arr1[i];
	    	fundsList.push(map1);
	    }
	    for(var j = 0; j < list.length; j++){
	    	fundsList[j]["amt"] = (list[j]["fundPercent"]*amt)/100;
	    }
    	var data = {"custNo":custNo,"product":groupId,"shareType":"A","funds":fundsList,"tradeType":"00","tradeAmt":amt};
        App.post("/mobile-bff/v1/fund-group/queryGroupDiscount",JSON.stringify(data),null ,function(result){
            if(result.returnCode == 0){
				var discountList = result.body.discountList;
				if(discountList.length > 0){
					var htm2 = '';
					for(var k in discountList){
						var item = discountList[k];
                		var percent = '';
                		for(var m = 0; m < list.length; m++){
                			if(list[m]['fundId'] == item.fundId){
                				percent = list[m]['fundPercent'];
                				fundName = list[m]['fundNm'];
                			}
                		}
                		htm2+='<div class="group ">'
			                +'<div class="group-content clearfix">'
			                    +'<p class="col-6 text-left">'+fundName+'</p><p class="col-4 text-right">'+App.formatMoney((percent*amt)/100)+'</p><p class="col-2 text-right"><span class="margin-R30 modifyData" onclick="modify(this)" id="'+item.fundId+'"">'+percent+'%</span></p>'
			                +'</div>'
			                +'<div class="group-desc">'
			                    +'<p class="col-6 text-left"><span>费率：</span><span>'+item.staRatioDisplay+'</span>&nbsp;&nbsp;<span>'+item.curRatioDisplay+'</span><span>('+item.discountFee+'元 省了'+item.feeDiscountStr+'元)</span></p>'
			                +'</div>'
			            +'</div>';
					}

					$(".box2").html(htm2);
					if(amt > 0){
						$(".box2").show();
						$(".box1").hide();
					}
					$("#display_fee").html(result.body.discountFee);
					$("#discount_fee").html(result.body.groupfeeDiscountStr);
				}
            }
        });
    }
    
    //输入框
    // 修改数据
 $(".modify-input input").on('input',function(){
     if($(this).val()>100){
        $(".modify-input input").val(100);
     }
 }) 
 function modify(v){
 	 $("#modify").attr("data",$(v).attr("id"));
 	 $(".modify-input input").val($(v).text().replace('%',''))
 	 $("#modify").show();
 	 $(".mask").show();
 }
 var dataIndex='';
 $('.modifyData').on('click',function(){
     dataIndex=$(this).attr('data-index');
     $(".modify-input input").val($(this).text().replace('%',''))
     $("#modify").show();
    $(".mask").show();
 })
 $("#modify a").on("click",function(){
 	 	var data = $(this).parent().parent("div").attr("data");
        $("#modify").hide();
        $(".mask").hide();
        //重置比例
		for(var m = 0; m < list.length; m++){
			if(list[m]['fundId'] == data){
				list[m]['fundPercent'] = $(".modify-input input").val();
			}
		}
        queryGroupFee($("#purchaseAmt").val());
		var total_per = 0;
	    for(var j = 0; j < list.length; j++){
	    	total_per+= parseInt(list[j]['fundPercent']);
	    }
		$("#select_per").html(App.formatMoney(total_per + '') +"%")
        $('#'+data).text($(".modify-input input").val()+'%');

 })
    
    
    $("#isAgree").click(function(){
    	if($(this).attr("class").indexOf("current") > -1){
    		$(this).removeClass("current");
    	}else{
    		$(this).addClass("current");
    	}
    });
    $("#btn-submit").click(function(event){
    	if($("#isAgree").attr("class").indexOf("current") > -1){
	        if(!valide()){
	            return;
	        }
		    if(parseInt($("#select_per").html().replace('%','')) < 100){
		        alertTips("配比不足100%");
		        return;
		    }
		    if(parseInt($("#select_per").html().replace('%','')) > 100){
		        alertTips("配比已超过100%");
		        return;
		    }
	        $(".tip").show();
        }else{
	        event.stopPropagation();
	        $("#msg").html("请先勾选协议");
	        $(".Bomb-box1").show();
        }
    });
    $(".close_tip").click(function(){
       
        $(this).parents(".tip").hide();
        $(this).parents(".tip2").hide();
    })
    $(".rules").click(function () {
        $(".chose-icon").toggleClass("current");
    });
    $(".select-transfer-type").click(function () {
        $(".transfer_type_list").show();
    });
    $(".transfer_type_list").click(function(event) {
        var li = $(event.target).parents("li");
        if (li.length == 0) {
            $(".transfer_type_list").hide();
            return
        };
        if (!li.hasClass("on")) {
            li.addClass("on").siblings("li").removeClass("on");

        };
        $(".transfer_type_list").hide();
        $(".select-transfer-type").html(li.find("div").text());
        $(".select-transfer-type").attr("data-flag", li.attr("data-flag"));
    });
    $(".icon-question-coupon").click(function (event) {
        event.stopPropagation();
        $(".Bomb-box2").show();
    });
    $(".icon-question-transfer").click(function (event) {
        event.stopPropagation();
        $("#msg").html("由于净值波动或者标准组合调仓导致您的持仓与标准组合持仓发生一定偏离时可跟随标准组合进行调仓.手动调仓:打不过客户持仓与标准组合偏离度大于等于5%时可登录App手动发起一键调仓;自动调仓:在标准组合调仓的当个交易日,如客户持仓的偏离度大于等于5%,系统将对客户持仓发起自动调仓");
        $(".Bomb-box1").show();
    });
    $(".Bomb-box-ok").click(function () {
        $(this).parent().parent().hide();
    });
    $(".Bomb-box-2").click(function () {
    	$(this).parent().parent().hide();
        $(this).parent().parent().parent().hide();
    });
    $(".clear").click(function(){
        $('.input-container input').val('')
        $(".box1").show();
        $(".box2").hide();
        $('.input-translate').hide()
    })
    $(".input-container input").on({
        blur:function(){
            if($(this).val()!==''){
                $(".box2").show();
                $(".box1").hide();
            }else{
                $(".box1").show();
                $(".box2").hide();
            }
        }
    })
    $(".input-container input").on('input',function(){
        if($(this).val()!=''){
        	//显示数据
        	queryGroupFee($(this).val());
            $('.input-translate').show()
            $('.input-translate span').text(changeNumMoneyToChinese($(this).val()))
        }else{
            $('.input-translate').hide()
        }
    })


$(".close_button").click(function(){ 
    $("#myGift").hide();
    $(".mask").hide();
});
$(".giftlist ul li").on("click",function(event){
    $(".giftlist ul li .right").each(function(){
		$(this).removeClass('activeChose').addClass("leaveChose")
    })
    $(this).children(".right").addClass("activeChose").removeClass("leaveChose");
})

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
        }
    });
}

function continuePurchase() {

    if (riskInfo.code != '0000' && App.isNotEmpty(riskInfo.threeMsg)) {
        $("#risk_tip").html(riskInfo.threeMsg);
        $(".tip").show();
        return;
    }
    $(".tip").hide();
    $(".tip2").hide();
    purchase();
}

function purchaseCheck() {
    if (riskInfo.code != '0000') {
        if (riskInfo.code == '9990' || riskInfo.code == '9991' || riskInfo.code == '9993') {
            $("#evaluation_tip").html(riskInfo.msg);
            $(".evaluation_risk_tip").show();
            return;
        } else if (riskInfo.code == '9992' && App.isNotEmpty(riskInfo.subMsg)) {
            $("#risk_tip").html(riskInfo.subMsg);
            $(".tip").show();
            return;
        }
    }
    purchase();
}


function purchase() {
    if(isShowToBindCard){
        $(".bind_card_tip").show();
        return;
    }

    var purchaseAmt = $("#purchaseAmt").val();
    var transferType = $(".select-transfer-type").attr("data-flag");
    if (App.isEmpty(purchaseAmt)){
        alertTips("投资金额不能为空");
        return;
    }
    if(!$("#isAgree").hasClass("current")){
        alertTips("请先阅读《汇添富智能投顾委托协议》");
        return;
    }

    /*
    var purchaseObj = {};
    purchaseObj.groupId = App.getUrlParam("groupId");
    purchaseObj.groupName = groupName;
    purchaseObj.groupType = groupType;
    purchaseObj.amt = purchaseAmt;
    purchaseObj.handleType = "P";
    purchaseObj.tradeTp = "P";
    purchaseObj.shareType = "A";
    purchaseObj.bankNo = sBankNo;
    purchaseObj.bankAcco = sBankAcco;
    purchaseObj.bankName = sBankName;
    purchaseObj.displayCard = sBankDisplayCard;
    purchaseObj.selectedCoupon = selectedCoupon;
    purchaseObj.transferType = transferType;
    purchaseObj.fee = fee;*/
    if (App.isEmpty(sBankAcco)){

        cashFrm = "V";
        if(Number(balance) < Number(purchaseAmt)){
            $(".recharge_tip").show()
            return;
        }
    } else {
        cashFrm = "B";
    }

    var url = App.projectNm + "/adviser/purchase_fund_group";
    var data = JSON.stringify({
        "groupId": groupId,
        "shareType": "A",
        "cashFrm": cashFrm,
        "bankAcco": sBankAcco,
        "bankNo": sBankNo,
        "amt": purchaseAmt,
        "purType": "B",
        "transferType":transferType,
        "fundList":list,
    });
    App.post(url, data, function() {
    $(".Bomb-box-2").click(function () {
        $(this).parent().parent().parent().hide();
    });
    
    }, function(result) {
    	window.scrollTo(0,0);
        App.show_alert();
        $("#alert_info").html(result.body.info);
        App.setSession(App.serialNo, result.body.serialNo)
    })
    
    // console.log(purchaseObj);
//    App.setSession(App.fundGroupObj, purchaseObj);
    var forwardUrl = App.getUrlParam("forwardUrl");
    if(App.isNotEmpty(forwardUrl)){
    //	window.location.href = "confirm.html?forwardUrl="+forwardUrl;
    }else{
    //	window.location.href = "confirm.html";
	}
}

function alertTips(tips) {
    $(".Bomb-box .Bomb-box-main .Bomb-box-content p").html(tips);
    $(".Bomb-box").show();
}

function queryAccount() {
    var url = App.projectNm + "/account/account?r=" + (Math.random() * 10000).toFixed(0);

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            balance = result.body.balance;
            xjbRemark = "现金宝可用余额" + App.formatMoney(balance + '') + "元";
            $(".buy-tip").html(xjbRemark);
            $("#xjb_remark").html(xjbRemark);
        }
    });
}
function queryCard() {
    var url = App.projectNm + "/account/card?r=" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            var cards = result.body.card;
            if(cards != undefined && cards != null && cards.length > 0){
                var cardsHtml = "";
                cards.forEach(function (item) {
                    cardsHtml += "<li class=\"grid-list-item heigth-130 bottom-border\" onclick=\"selectedCard('"+ item.bankNo +"', '"+ item.bankAcco +"', '"+ item.bankGrpName +"', '"+ item.bankAccoDisplay +"')\">\n" +
                        "                <div class=\"row\">\n" +
                        "                    <div class=\"lh-130\">\n" +
                        "                        <i class=\"bank ico_"+ item.bankNo +" no-margin-left\"></i>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"col-1\">\n" +
                        "                        <div class=\"list-title\">\n" +
                        "                            <p class=\"bank-name\">"+ item.bankGrpName +" [ " + item.bankAccoDisplay + " ]</p>\n" +
                        "                            <p class=\"bank-id\">"+ item.limitRemark +"</p>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"lh-130 "+ (item.signWay == "1" ?"shorcut":(item.signWay == "2" ? "union":"E-bank")) +"\">\n" +
                        "                        <a class=\"icon icon-union\">银联通</a>\n" +
                        "                        <a class=\"icon icon-E-bank\">网银</a>\n" +
                        "                        <a class=\"icon icon-shorcut\">快捷</a>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </li>";
                });

                $("#bankCardList ul").append(cardsHtml);
                showSmTip();
            } else {
                if(cards !=undefined && cards != null){
                    cardsCount = cards.length;
                }
                isSetTradePassword();
            }
        }
    });
}

function isSetTradePassword() {

    var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("是否设置过交易密码："+ result.body.isSetPwd + " \n银行卡数量：" + cardsCount);
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }

            if(isSetPwd != "1"){
            	$("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
            	$("#go_to_bind_card").html("去设置");
                isShowToBindCard = true;
                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
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

function requestGroupFundDetail(groupId){
    App.get(App.projectNm + "/adviser/query_fundgroup_detail_info?groupId=" + groupId, null, function(result){

        if(result.body != undefined && result.body != null){
            var detailInfo = result.body.detailInfo;
            if(detailInfo != undefined && detailInfo != ""){
                groupName = detailInfo.groupname;
                groupType = detailInfo.grouptype;
                $(".group-name").html(groupName);
                $("#purchaseAmt").attr("placeholder", App.formatMoney(detailInfo.initLimitAmount) + "元起投");
                queryCouponList(detailInfo.groupid, detailInfo.fundGroupType);
            }
        }
    });
}

function selectedCard(bankNo, bankAcco, bankName, displayCard) {
    sBankNo = bankNo;
    sBankAcco = bankAcco;
    sBankName = bankName;
    sBankDisplayCard = displayCard;
    if (App.isEmpty(bankNo)) {
        $("#payWay").html("现金宝");
    } else {
        $("#payWay").html(bankName + " [ "+ displayCard +" ]");
    }
}

function queryCouponList(fundGroupId, fundGroupTp) {

    var url = App.projectNm + "/coupon/query_usable_coupon_list?handleTp=4&productTp=" + fundGroupTp + "&productId=" + fundGroupId;

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var list = result.body.list;
            couponTxt = "有" + result.body.list.length + "张礼券可使用";
            $("#my_selected_coupon").html(couponTxt);
            if(result.body.list.length == 0){
            	$("#my_selected_coupon").parent("p").html("无可用礼券");
        	}
            list.push({title: "", couponSerialNo: "", couponDesc: "不使用礼券", fullInfo: {minAmt: 0, maxAmt: 0}});
            couponList = list.sort(compare);
            var couponHtml = "";
            list.forEach(function (item) {
                couponHtml += "<li onclick='selectCoupon(\""+ item.fullInfo.minAmt +"\",\""+ item.fullInfo.maxAmt +"\",\""+ item.couponSerialNo +"\",\""+ item.title +"\")'>" +
                    "               <span class=\"left "+ (App.isEmpty(item.couponSerialNo) ? "red" : "") +"\">"+ item.couponDesc +"</span>" +
                    "               <span class=\"right circle "+ (App.isEmpty(item.couponSerialNo) ? "activeChose" : "leaveChose") +"\"></span>" +
                    "</li>";
            });
            $("#couponList ul").html(couponHtml);
        }
    });
}
var compare = function (x, y) {
    var flag = 0;

    if(x == undefined || x == null){
        return 1;
    }
    if(y == undefined || y == null){
        return -1;
    }

    var coupon0 = x.fullInfo;
    var coupon1 = y.fullInfo;
    /**
     * 不支持的放到后面
     */
    if("1,2,3".indexOf(coupon0.couponType) > -1){
        if("1,2,3".indexOf(coupon1.couponType) > -1){
            flag =  coupon0.couponType - coupon1.couponType;
        }else{
            flag = -1;
        }
    }else if("1,2,3".indexOf(coupon1.couponType) > -1){
        return 1;
    }else {
        return 0;
    }

    /**
     * 1:加息、2：翻倍、3：学习（满减）
     */
    flag = 0;
    switch (coupon0.couponType){
        case 1:
            flag = -Number(coupon0.addYieldValue * coupon0.addYieldDays - coupon1.addYieldValue * coupon1.addYieldDays);
            break;
        case 2:
            flag = -Number(coupon0.appProfitPower * coupon0.appProfitDays - coupon1.appProfitPower * coupon1.appProfitDays);
            break;
        case 3:
            flag = -Number(coupon0.minusAmt - coupon1.minusAmt);
            break;
        default:
            flag = 0;
            break;
    }
    return flag;
}

function selectCouponByAmt(purAmt) {

    $(".giftlist ul li .right").each(function () {
        $(this).removeClass('activeChose').addClass('leaveChose');
    });

    for(var index in couponList){
        var item = couponList[index];
        if (Number(purAmt) >= Number(item.fullInfo.limitAmt)
            && (Number(item.fullInfo.maxAmt) == 0 || Number(purAmt) <= Number(item.fullInfo.maxAmt))) {
            selectedCoupon = item.couponSerialNo;
            $("#my_selected_coupon").html(App.isEmpty(item.title) ? "无可用礼券" : item.title);

            if(App.isNotEmpty(selectedCoupon)){
                $('.'+selectedCoupon).children('.right').addClass('activeChose').removeClass('leaveChose');
            }else {
                $('.coupon-ul li:last').children('.right').addClass('activeChose').removeClass('leaveChose');
            }
            break;
        }
    }
}

function selectCoupon (minAmt,maxAmt,couponSerialNo,title) {
    // console.log(couponInfo);
    var purAmt = $("#purchaseAmt").val();
    if(App.isEmpty(purAmt)){
        alertTips("请先输入金额！");
        return;
    }

    if (Number(purAmt) >= Number(minAmt)
        && (Number(maxAmt) == 0 || Number(purAmt) <= Number(maxAmt))) {
        selectedCoupon = couponSerialNo;
        $("#my_selected_coupon").html(App.isEmpty(title) ? couponTxt : title);

        var target = event.target;
        $(".giftlist ul li .right").each(function () {
            $(this).removeClass('activeChose').addClass('leaveChose');
        });
        if ($(target).hasClass("right")) {
            $(target).addClass('activeChose').removeClass('leaveChose');
        } else if (target.tagName == 'LI') {
            $(target).children('.right').addClass('activeChose').removeClass('leaveChose');
        } else if (target.tagName == 'SPAN') {
            $(target).next('.right').addClass('activeChose').removeClass('leaveChose');
        }
    }
}

$(".close_tip").click(function () {
    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});
function queryTips() {
    App.get(App.projectNm + "/adviser/query_transfer_tips?t=" + new Date().getTime(), null, function(result){
        if(result.body != undefined && result.body != null){
            $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html(result.body.transferTips);
        }
    });
}

function queryTradeInfo(groupId) {
    var url = App.projectNm + "/adviser/get_group_trade_info?groupId="+ groupId +"&tradeTp=P&r=" + (Math.random() * 10000).toFixed(0);

    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var tradingInfo = result.body.remark;
            if(App.isNotEmpty(tradingInfo)){
                $(".trading_instructions_remark").html(tradingInfo);
            }
        }
    });
}
    App.bind("#cancel", "tap", App.cancel_alert);
    App.bind("#confirm", "tap", inputTradePwd)
function inputTradePwd() {
    App.unbind("#confirm", "tap", inputTradePwd);
    var pwd = $("#pwd").val();
    App.tradePwd(pwd, function() {
        App.bind("#confirm", "tap", inputTradePwd)
    }, function(result) {
        App.cancel_alert();
        App.setSession(App.successInfo, result.body.successInfo);
        window.location = "./pursuccess.html"
    })
};