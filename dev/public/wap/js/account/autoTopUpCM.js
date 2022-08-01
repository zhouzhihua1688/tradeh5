var handTp = App.getUrlParam("handTp");
var chkStat = 'checkBox';
//初始化数据
$(".btn").css({'background-color':'#ddd6d6'});
App.setSession("reminderType",2)
App.setSession("fundRiskLevel",0);
var productId = '';
var productType = ''; //1-现金宝,4-指数基金，2,5-组合
var productList = [];
var cardsCount = 0;
setMipBuyday("1");
setMipCycle("MM");
queryCanRechargeProductList();

// 20210827系统异常，获取银行卡SerialId为空；系统异常,获得参数为空！--可能的错误处理，清掉session里缓存的card信息
App.removeSession(App.cards);
App.removeSession(App.selectedCard);
// 20210827系统异常，获取银行卡SerialId为空；系统异常,获得参数为空！--可能的错误处理，清掉session里缓存的card信息

$(function() {
    queryCard(function() {
        isSetTradePassword();
        initCardList();
    });


   
    if (handTp == "C") { // 新增计划
        //App.bind("#btn-submit", "tap", submitCreate);
        var cards = App.getSession(App.cards);
        queryCard(function() {
            setSelectedCard();
            initCardList()
        })
        showTime()
    } else {
        $(".selectBankCard").unbind("click");
        $(".btn").css({'background-color':'#fd7e23'});
		App.bind("#btn-submit", "tap", submitCreate);
        var plan = App.getSession(App.autoTopUpModifyInfo);
        if (plan == null || plan == undefined || plan == '') {
            window.location.href = "./autoTopUpList.html"
        } else {
            var cards = App.getSession(App.cards);
            setCardPanel(plan.bankNo, plan.bankAcco, cards)
            $(".inputMoney input").val(plan.payAmtDisplay || plan.amtNF);
            setMipCycle(plan.cycle || plan.mipCycle);
            setMipBuyday(Number(plan.payDate || plan.mipBuyDay));
            $("#appDate .bank span").text(tranMipCycle(plan.cycle || plan.mipCycle) + tranMipBuyday(plan.cycle || plan.mipCycle, Number(plan.payDate || plan.mipBuyDay)));
            $(".autoTopUpRemark").val(plan.mipDesc || plan.contractDesc);
        }
    }

});

function getMipCycle() {
    return App.getSession("__auto_topup_mipCycle")
};

function setMipCycle(mipCycle) {
    App.setSession("__auto_topup_mipCycle", mipCycle)
};

function getMipBuyday() {
    return App.getSession("__auto_topup_mipBuyday")
};

function setMipBuyday(mipBuyday) {
    App.setSession("__auto_topup_mipBuyday", mipBuyday)
};

function showTime() {
    var mydate = new Date();
    var str = "" + mydate.getFullYear();
    var month = (mydate.getMonth() + 1);
    var monthDay = mydate.getDate();
    str += month < 10 ? ("0" + month) : month;
    str += monthDay < 10 ? ("0" + monthDay) : monthDay;
    $(".autoTopUpRemark").attr("placeholder", "工资宝" + str + "")
};

function setSelectedCard(plan) {

    var cards = App.getSession(App.cards);
    console.log(cards);
    if (cards == null || cards.length == 0) {
        queryCard(function() {
            var cards = App.getSession(App.cards);
            setCardPanel(plan.bankNo, plan.bankAcco, cards)
        })
    } else {
        setCardPanel(plan.bankNo, plan.bankAcco, cards)
    }
};

function setCardPanel(bankNo, bankAcco, card_list) {
    var card = searchCard(bankNo, bankAcco, card_list);
    if (card == null) {
        setFirstUsingCard()
    } else {
        App.setSession(App.selectedCard, card);
        setCard(card)
    }
};

function searchCard(bankNo, bankAcco, cards) {
    for (var index in cards) {
        var card = cards[index];
        if (card.bankAcco == bankAcco && card.bankNo == bankNo) {
            return card
        }
    };
    return null
};

function setSelectedCard() {
    var card = App.getSession(App.selectedCard);
    if (card == null) {
        setFirstUsingCard()
    } else {
        setCard(card)
    }
};

function setFirstUsingCard() {
    var card = firstUsingCard(function() {
        var cards = App.getSession(App.cards);
        if (cards.length > 0) {
            for (var index in cards) {
                var card = cards[index];
                if ("1" == card.tradeFlag) {
                    showFirstCard(card);
                    return
                }
            }
        } else {
            /*alertTips("请先绑定一张银行卡", "确定", function() {
                window.location = "../card/manage_card.html"
            })*/
        }
    });
    if (card != null) {
        showFirstCard(card)
    }
};

function firstUsingCard(successFun){
    var cards = App.getSession(App.cards);
    if(cards == null || (cards != null && cards.length == 0)){
        queryCard(successFun);
    }else{
        if(cards.length > 0){
            for(var index in cards){
                var card = cards[index];
                if("1" == card.tradeFlag){
                    return card;
                }
            }
        }else{
            alertTips("请先绑定一张银行卡！");
            window.location = "../card/manage_card.html";
        }
    }
    return null;
};

$(".close_tip").click(function () {

    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});
function showFirstCard(card) {
    setCard(card);
    App.setSession(App.selectedCard, card)
};

function setCard(card) {
    $(".selectedBankCard").html('<img src="/mobileEC/images/bank/'+card.bankNo+'.png" style="width:25px;height:25px;margin-right:0;top:.4rem;"/><span class="ml10 black">' + card.bankName + '</span><span class="ml10">' + card.bankAccoDisplay + '</span><img class="ml10" src="../images/arr.png">');
    if(card.remark != "" && card.remark != null){
    	$("#topup_txt").html('<p>' + replaceTxt2Html(card.remark) + '</p>');
	}
    if (card.rechargeRemark != "" && card.rechargeRemark != null) {
        $("#rechargeRemark_ul").show();
        $("#rechargeRemark").html('<p class="red">' + card.rechargeRemark + '</p>')
    } else {
        $("#rechargeRemark_ul").hide()
    }
};

function initCardList() {
    var cards = App.getSession(App.cards);
    var arr = [];
    for (var index in cards) {
        var card = cards[index];
        if (card.tradeFlag != "1") continue;
        var signStyle;
        var signWay;
		if(card.signWay == "1"){
			signStyle = "icon-shorcut";
			signWay = "快捷";
		}else if(card.signWay == "2"){
			signStyle = "icon-union";
			signWay = "银联通";
		}else if(card.signWay == "3"){
			signStyle = "icon-E-bank";
			signWay = "网银";
		}else if(card.signWay == "4"){
			signStyle = "icon-E-bank";
			signWay = "通联";
		}else if(card.signWay == "6"){
			signStyle = "icon-E-bank";
			signWay = "云闪付";
		}else if(card.signWay == "7"){
			signStyle = "icon-E-bank";
			signWay = "一网通";
        }
        if(true || card.signWay == "7" || card.signWay == "1"){//wap只需支持快捷和招行一网通 20210705全放开
        arr.push('<li class="grid-list-item heigth-130 bottom-border bank-card-option item_'+card.bankAcco+'" style="padding:0 .5rem;" data="' + card.bankNo + ',' + card.bankAcco+ ',' + card.bankCardSerialid + '">');
        arr.push('<div class="row">');
        arr.push('    <div class="lh-130">');
        arr.push('       <img src="/mobileEC/images/bank/'+card.bankNo+'.png" class="bank-logo-new"/> ');
        arr.push('   </div>');
        arr.push('    <div class="col-1">');
        arr.push('        <div class="list-title">');
        arr.push('            <p class="bank-name">' + card.bankName + '</p>');
        arr.push('              <p class="bank-id">' + card.bankAccoDisplay + '</p>');
        arr.push('         </div>');
        arr.push('     </div>');
        arr.push('      <div class="lh-130">');
        arr.push('       <a class="icon ' + signStyle + '">' + signWay + '</a>');
        arr.push('    </div>');
        arr.push(' </div>');
        arr.push('</li>');
        }
    };
    $("#bankCardList ul").html(arr.join(""));

    var selectItem = App.getSession(App.selectedCard);
    if(selectItem){
        //银行卡选中状态
        $(".item_"+selectItem.bankAcco).addClass("bank-selected-new");
    }


    App.bind(".bank-card-option", "tap", handlerCard)
};

function handlerCard(event) {
    var data = $(event.target).attr("data");
    if (data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 4; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break
        }
    };
    var array = String(data).split(",");
    var bankNo = array[0];
    var bankAcco = array[1];
    var bankCardSerialid = array[2];
    var cards = App.getSession(App.cards);
    for (var index in cards) {
        var card = cards[index];
        if (card.bankNo == bankNo && card.bankAcco == bankAcco && card.bankCardSerialid == bankCardSerialid) {
            App.setSession(App.selectedCard, card);
            setCard(card)
            $("#bankCardList ul li").each(function(){
                $(this).removeClass("bank-selected-new")
            });
            $(".item_"+card.bankAcco).addClass("bank-selected-new")
        }
    }
};
var chooseTime = {
    "MM": ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"]
};
$("#appDate").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $("#appDate").blur();
    return false
});
$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    setMipCycle(li.attr("data-choose-time"));
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    if (!li.hasClass("on")) {
        li.addClass("on").siblings("li").removeClass("on");
        var time = chooseTime[li.attr("data-choose-time")],
            str = "";
        for (var i = 0; i < time.length; i++) {
            str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
        };
        $(".choose-time2 ul").html(str);
        $("#appDate").attr("data-time", li.find("div").text())
    };
    $(".choose-time").hide();
    $(".choose-time2").show()
});
$(".choose-time2").click(function() {
    var li = $(event.target).parents("li");
    setMipBuyday(li.attr("data-choose-time"));
    if (li.length == 0) {
        return
    };
    $("#appDate").val($("#appDate").attr("data-time") + li.find("div").text());
    queryAutoRechargePageInfo();
    $(this).hide()
});

function submitCreate() {
	var handTp = App.getUrlParam("handTp");
	if(handTp == "M") { // 修改计划
		submitModify();
	}else{
		var myMoney = $(".inputMoney input").val();

		var choose_time = getMipCycle();
		var choose_time2 = getMipBuyday();
		var card = App.getSession(App.selectedCard);
		if (!valide()) {
			return
		};
		if (card == null) {
			alertTips('请选择银行卡');
			return
		};
		if (myMoney == '') {
			alertTips('请输入金额');
			return
		};
		if (choose_time == '' || choose_time2 == '') {
			alertTips('请选择扣款日期');
			return
		};

		App.unbind("#btn-submit", "tap", submitCreate);
		var remark = $(".autoTopUpRemark").val();
		var mipCycle = choose_time;
		var mipBuyday = (Array(2).join(0) + choose_time2).slice(-2);
		// var url = App.projectNm + "/etrading/auto_recharge_create";
        var url = '/mobile-bff/v1/etrading/auto-recharge-create';
		var data = JSON.stringify({
            acceptMode: 'M',
			bankAcco: card.bankAcco,
			bankNo: card.bankNo,
            bankSerialId: card.bankCardSerialid,
			mipApkind: '00',
			mipCycle: mipCycle,
			mipBuyday: mipBuyday,
			mipBuyAmt: Number(myMoney),
            cashFrom: 'B',
            productId: productId,
            newProductId: '',
            productType: productType,
			mipDesc: remark,
            shareType: 'A'
		});
		utils.post(url, data, function() {
			App.bind("#btn-submit", "tap", submitCreate)
		}, function(result) {
			App.setSession(App.serialNo_info, result.body.info);
			App.setSession(App.serialNo, result.body.serialNo);
			App.setSession(App.serialNo_success_show_data, data);
			App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/setUpSuccess.html");
			App.setSession("risk_fundId",productId);
			if(productType == "2" || productType == "5"){ // 产品类型为组合的情况下默认写01
				App.setSession("fundRiskLevel","01");
                utils.verifyTradeChain(result.body);
            }
			else {
                utils.ajax({
                    url: '/mobile-bff/v1/fund/detailInfo',
                    type: 'POST',
                    data: {
                        fundId: productId
                    },
                    success: function (result) {
                        if (result.returnCode === 0) {
                            App.setSession("fundRiskLevel",result.body.fundRiskLevel);
                        }
                    },
                    complete: function () {
                        utils.verifyTradeChain(result.body);
                    }
                });
            }
		})
	}
}

function submitModify() {
    var myMoney = $(".inputMoney input").val();

    var choose_time = getMipCycle();
    var choose_time2 = getMipBuyday();
    var card = App.getSession(App.selectedCard);
	
    if (card == null) {
        alertTips('请选择银行卡');
        return
    };
    if (myMoney == '') {
        alertTips('请输入金额');
        return
    };
    if (choose_time == '' || choose_time2 == '') {
        alertTips('请选择充值日期');
        return
    };

    App.unbind("#btn-submit", "tap", submitModify);
    var remark = $(".autoTopUpRemark").val();
    var mipCycle = choose_time;
    var mipBuyday = (Array(2).join(0) + choose_time2).slice(-2);
    var autoTopUp = App.getSession(App.autoTopUpModifyInfo);
    var url = "/mobile-bff/v1/etrading/auto-recharge-modify";
    var data = JSON.stringify({
        contractNo: autoTopUp.contractNo,
        acceptMode: 'M',
        bankAcco: card.bankAcco,
        bankNo: card.bankNo,
        bankSerialId: card.bankCardSerialid,
        mipApkind: '00',
        mipCycle: mipCycle,
        mipBuyday: mipBuyday,
        mipBuyAmt: Number(myMoney),
        cashFrom: 'B',
        productId: autoTopUp.productId,
        newProductId: productId,
        productType: productType,
        mipDesc: remark,
        shareType: 'A'
    });

    utils.post(url, data, function() {
        App.bind("#btn-submit", "tap", submitModify)
    }, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/setUpSuccess.html");
        App.setSession("risk_fundId",productId);
        if(productType == "2" || productType == "5"){ // 产品类型为组合的情况下默认写01
            App.setSession("fundRiskLevel","01");
            utils.verifyTradeChain(result.body);
        }
        else {
            utils.ajax({
                url: '/mobile-bff/v1/fund/detailInfo',
                type: 'POST',
                data: {
                    fundId: productId
                },
                success: function (result) {
                    if (result.returnCode === 0) {
                        App.setSession("fundRiskLevel",result.body.fundRiskLevel);
                    }
                },
                complete: function () {
                    utils.verifyTradeChain(result.body);
                }
            });
        }
    })
};

function queryAutoRechargePageInfo() {
    // var data = JSON.stringify({
    //     mipcycle: getMipCycle(),
    //     mipbuyday: getMipBuyday(),
    // });
    var mipCycle = getMipCycle();
    var mipBuyDay = getMipBuyday();
    // var url = App.projectNm + "/etrading/auto_recharge_page_info?date=" + (new Date()).getTime();
    var url = "/mobile-bff/v1/etrading/auto-recharge-page-info?mipCycle="+ mipCycle + "&mipBuyDay=" + mipBuyDay;
    App.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {
            $("#kkDate").html(body.shortRemark + '&nbsp;&nbsp;<img class="nextDates" style="vertical-align: middle;margin-top: -.1rem;"src="../images/point.png" alt="">');
            $("#nextRechargeDate").html(body.nextRechargeDate);
            App.bind(".nextDates", "tap", function() {
                alertTips2(body.redRemark, "text-left")
            })
        }
    })
}

function queryPayTreasureTips(amt){
    if(!amt){
        return false;
    }
    var url = "/mobile-bff/v1/fund/pay_treasure_tips?productId="+productId+"&amount="+amt+"&period="+getMipCycle()+"&r=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        var body = result.body;
		
        if (body != null && body != undefined) {
        	$("#dim").html(body.profitRemark+'&nbsp;<img style="vertical-align: middle;margin-top: -.1rem;" class="icon-i" src="../images/point.png" alt="">');
            App.bind(".icon-i", "tap", function() {
                alertTips2(body.supportRemark, "text-left")
            })
        }else{
			$("#dim").html('');
		}
    });
}

function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId="+ productId +"&tradeType=07&tradeScene=13" ;
	App.get(url, null, function (result) {
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

function isSetTradePassword() {

    // var url = App.projectNm + "/account/has_set_trade_pwd?r=" + (Math.random() * 10000).toFixed(0);
    var url = "/mobile-bff/v1/account/has-set-trade-pwd";

    App.post(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            // alert("是否设置过交易密码："+ result.body.isSetPwd + " \n银行卡数量：" + cardsCount);
            if(App.isNotEmpty(result.body.isSetPwd)){
                isSetPwd = result.body.isSetPwd;
            }
			var cards = App.getSession(App.cards);
			cardsCount = cards.length;
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

                $(".bind_card_tip").show();
                $("#go_to_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
                return;
            }
            
        }
    });
}


function queryCanRechargeProductList(){
    var url = "/mobile-bff/v1/fund/auto-recharge-can-transfer-product-list?date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined && body.length > 0) {
            productList = result.body;
            var htm = '<li class="title">'
            +'<span class="blue cancel">取消</span>'
            +'<span>选择转入产品</span>'
            +'<span class="blue done">完成</span>'
            +'</li>';
            for(var k in body){
                var item = body[k];
                var itemId = '';
                var url = '';
                if(item.productType == '1' || item.productType == '4'){     //基金
                    itemId = (item.jumpUrl).substr((item.jumpUrl).indexOf("fundId=") + 7); // 基金详情以jumpUrl中fundId为准
                    url = '../fund/steadyCombination.html?fundId=' + itemId;
                }
                else {  //组合
                    itemId = item.productId;
                    url = '../fundgroup/group_fund_details.html?groupId=' + itemId;
                }
                var img = "../images/radio.png";
                htm+='<li class="fund">'
                +'<div class="chk" pid="'+ item.productId +'" ptp="'+item.productType+'" pnm="'+item.productName+'">'
                    +'<img src="'+img+'" alt="">'
                    +'<div>'
                        +'<p>'+item.productName+'</p>'
                        +'<p class="pt5" style="color: #666;">'+item.productDesc+'</p>'
                    +'</div>'
                +'</div>'
                +'<span class="blue" class="detail" onclick="window.location=\''+url+'\'">'+item.jumpName+'</span>'
            +'</li>';
            }
            $("#fund").html(htm);
            App.bind(".chk", "tap", function() {
                $(this).find('img')
                    .attr('src', '../images/active.png')
                    .parents('.fund')
                    .siblings()
                    .find('img')
                    .attr('src', '../images/radio.png');
            });
            App.bind(".done","tap",function(){
                $("#fund").children("li").each(function(){
                    if($(this).find("img").attr("src") != undefined && $(this).find("img").attr("src").indexOf("active") > -1){
                        if($(this).children("div").attr("pid") === productId){  // 选择同一支产品
                            $('.fundList').fadeOut("slow");
                            return false;
                        }
                        productId = $(this).children("div").attr("pid");
                        productType = $(this).children("div").attr("ptp");
                        $("#productName").html($(this).children("div").attr("pnm"));
                        var val =$('.inputMoney input').val();
                        if(val != ""){
                            queryPayTreasureTips(val);
                        }
                        var fundContractList = productList.filter(function(filterItem){
                            return filterItem.productId === productId;
                        })[0].fundContractList;
                        printFundContractList(fundContractList);
                        checkBottomBtn();
                    }
                });
                $('.fundList').fadeOut("slow");
            });
            App.bind(".cancel","tap",function(){
                $('.fundList').fadeOut("slow")
            });
            // 新增默认选中第一支产品
            if(!handTp || handTp === 'C'){
                productId = body[0].productId;
                productType = body[0].productType;
                $('#productName').text(body[0].productName);
                $('.fund .chk>img').attr('src', '../images/radio.png').eq(0).attr('src', '../images/active.png');
                printFundContractList(body[0].fundContractList);
            }
            else {
                var plan = utils.getSession(App.autoTopUpModifyInfo);
                productId = plan.productId;
                var productObj = productList.filter(function(filterItem){
                    return filterItem.productId == plan.productId;
                })[0];
                productType = productObj.productType;
                queryPayTreasureTips($(".inputMoney input").val());
                $('#productName').text(productObj.productName);
                $('.fund .chk>img').attr('src', '../images/radio.png');
                $('.fund .chk[pid=' + productId + ']').find('img').attr('src', '../images/active.png');
                printFundContractList(productObj.fundContractList);
                //选中所有协议
                chkStat = 'checked';
                $("#risk_list").children("p").each(function(){
                    $(this).find("img").attr('src', '../images/checked.png');
                });
                checkBottomBtn();
            }
        }
    })
}
function printFundContractList(fundContractList) {
    if (fundContractList){ // fundContractList存在,产品类型为基金,固定拼接工资宝服务协议
        $("#risk_list").html("");
        var html0 = '<p class="dim rules" ><img class="checkBox" id="isRead" src="../images/'+chkStat+'.png" alt="">我已同意';
        html0 += '<a href="http://static.99fund.com/mobile/agreement/auto_investment_agreement.html">《工资宝服务协议》</a></p>';
        $("#risk_list").html(html0);
        App.bind("#isRead","tap",function(){
            if ($(this).attr('src') === '../images/checkBox.png') {
                $(this).attr('src', '../images/checked.png')

                var contractLength = $("#risk_list").children("p").length;
                var chkCnt = 0;
                $("#risk_list").children("p").each(function(){
                    if($(this).children("img").attr('src') == '../images/checked.png'){
                        chkCnt+=1;
                    }
                });

                if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
                    $(".btn").css({'background-color':'#fd7e23'});
                    App.unbind('.btn', "tap",submitCreate);
                    App.bind('.btn', "tap",submitCreate);
                }else{
                    App.unbind('.btn', "tap",submitCreate);
                    $(".btn").css({'background-color':'#ddd6d6'});
                }
            } else {
                $(this).attr('src', '../images/checkBox.png')
                App.unbind('.btn', "tap",submitCreate);
                $(".btn").css({'background-color':'#ddd6d6'});
            }
        });
        var listKey = [];
        fundContractList.forEach(function(item){
            if(listKey.indexOf(item.contractCategory) === -1){
                listKey.push(item.contractCategory);
            }
        });
        listKey.length > 0 && App.setSession("auto_agreementIds",listKey.join(','));
        var html = '';
        fundContractList.forEach(function (item0, index0) {
            if(item0.contractCategory === 'KFS'){
                html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/'+chkStat+'.png" alt="">我已阅读并确认已知悉';
            }else{
                html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/'+chkStat+'.png" alt="">我已同意';
            }
            html += "<a href=\""+ item0.url +"\">《"+ item0.title +"》</a></p>";
            $("#risk_list").append(html);
            App.bind("#isRead"+index0,"tap",function(){
                if ($(this).attr('src') === '../images/checkBox.png') {
                    $(this).attr('src', '../images/checked.png')

                    var contractLength = $("#risk_list").children("p").length;
                    var chkCnt = 0;
                    $("#risk_list").children("p").each(function(){
                        if($(this).children("img").attr('src') == '../images/checked.png'){
                            chkCnt+=1;
                        }
                    });

                    if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
                        $(".btn").css({'background-color':'#fd7e23'});
                        App.unbind('.btn', "tap",submitCreate);
                        App.bind('.btn', "tap",submitCreate);
                    }else{
                        App.unbind('.btn', "tap",submitCreate);
                        $(".btn").css({'background-color':'#ddd6d6'});
                    }
                } else {
                    $(this).attr('src', '../images/checkBox.png')
                    App.unbind('.btn', "tap",submitCreate);
                    $(".btn").css({'background-color':'#ddd6d6'});
                }
            })
        });
    }
    else {   //协议为空的时候
        $("#risk_list").html("");
        var html0 = '<p class="dim rules" ><img class="checkBox" id="isRead" src="../images/'+chkStat+'.png" alt="">我已同意';
        html0 += '<a href="http://static.99fund.com/mobile/agreement/funds_group_agreement.html">《汇添富组合产品服务协议》</a></p>';
        $("#risk_list").html(html0);
        App.bind("#isRead","tap",function(){
            if ($(this).attr('src') === '../images/checkBox.png') {
                $(this).attr('src', '../images/checked.png')

                var contractLength = $("#risk_list").children("p").length;
                var chkCnt = 0;
                $("#risk_list").children("p").each(function(){
                    if($(this).children("img").attr('src') == '../images/checked.png'){
                        chkCnt+=1;
                    }
                });

                if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
                    $(".btn").css({'background-color':'#fd7e23'});
                    App.unbind('.btn', "tap",submitCreate);
                    App.bind('.btn', "tap",submitCreate);
                }else{
                    App.unbind('.btn', "tap",submitCreate);
                    $(".btn").css({'background-color':'#ddd6d6'});
                }
            } else {
                $(this).attr('src', '../images/checkBox.png')
                App.unbind('.btn', "tap",submitCreate);
                $(".btn").css({'background-color':'#ddd6d6'});
            }
        })
        var contractLength = $("#risk_list").children("p").length;
        var chkCnt = 0;
        $("#risk_list").children("p").each(function(){
            if($(this).children("img").attr('src') == '../images/checked.png'){
                chkCnt+=1;
            }
        });

        if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
            $(".btn").css({'background-color':'#fd7e23'});
            App.unbind('.btn', "tap",submitCreate);
            App.bind('.btn', "tap",submitCreate);
        }else{
            App.unbind('.btn', "tap",submitCreate);
            $(".btn").css({'background-color':'#ddd6d6'});
        }
    }
}
function checkBottomBtn() {
    var contractLength = $("#risk_list").children("p").length;
    var chkCnt = 0;
    $("#risk_list").children("p").each(function(){
        if($(this).children("img").attr('src') == '../images/checked.png'){
            chkCnt+=1;
        }
    });

    if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
        $(".btn").css({'background-color':'#fd7e23'});
        App.unbind('.btn', "tap",submitCreate);
        App.bind('.btn', "tap",submitCreate);
    }else{
        App.unbind('.btn', "tap",submitCreate);
        $(".btn").css({'background-color':'#ddd6d6'});
    }
}
var chooseTime = {
    "MM": ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"]
};
$("#appDate").click(function (event) {
    event.preventDefault();
    $(".choose-time").show();
    return false
});
$(".choose-time").click(function (event) {
    var li = $(event.target).parents("li");
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    if (!li.hasClass("on")) {
        li.addClass("on").siblings("li").removeClass("on");
        var time = chooseTime[li.attr("data-choose-time")],
            str = "";
        for (var i = 0; i < time.length; i++) {
            str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
        };
        $(".choose-time2 ul").html(str);
        $("#appDate").attr("data-time", li.find("div").text())
    };
    $(".choose-time").hide();
    $(".choose-time2").show()
});
$(".choose-time2").click(function () {
    var li = $(event.target).parents("li");
    if (li.length == 0) {
        return
    };
    $("#appDate .date").text($("#appDate").attr("data-time") + li.find("div").text());
    $(this).hide()
});



$('.checkBox').on('click', function () {
    if ($(this).attr('src') === '../images/checkBox.png') {
        $(this).attr('src', '../images/checked.png')
        if(Number($(".inputMoney input").val()) > 0 ){
        	$(".btn").css({'background-color':'#fd7e23'});
			App.unbind('.btn', "tap",submitCreate);
        	App.bind('.btn', "tap",submitCreate);
        }else{
        	App.unbind('.btn', "tap",submitCreate);
        	$(".btn").css({'background-color':'#ddd6d6'});
        }
    } else {
        $(this).attr('src', '../images/checkBox.png')
    	App.unbind('.btn', "tap",submitCreate);
    	$(".btn").css({'background-color':'#ddd6d6'});
    }
})
    $('.content .funds').on('click', function () {//弹窗
        $('.fund .chk>img').attr('src', '../images/radio.png');
        $('.fund .chk[pid=' + productId + ']').find('img').attr('src', '../images/active.png');
        $('.fundList').css('display', 'block')
    })
    $('.fundList .cancel').on('click', function () {//取消弹窗
        $('.fundList').css('display', 'none')
    })
	$('.fundList .done').on('click', function () {//取消弹窗
        $('.fundList').css('display', 'none')
    })
    $('.fundList .fund>div').on('click', function () {//选择基金
        $(this).find('img')
            .attr('src', '../images/active.png')
            .parents('.fund')
            .siblings()
            .find('img')
            .attr('src', '../images/radio.png')
    })
    $('.inputMoney .del').on('click', function () {//清空input
        $('.money input').val('')
        $('.chineseText span').text(changeNumMoneyToChinese(''))
    	App.unbind('.btn', "tap",submitCreate);
    	$(".btn").css({'background-color':'#ddd6d6'});
    })
    $('.inputMoney input').on('input', function () {//格式化input
        var val = $(this).val().replace(/[,A-z]/g, '');
        // var arr = val.split(/[.]/);
        // var reg = /(?=(\B)(\d{3})+$)/g;
        // $(this).val(str)
        $('.chineseText span').text(changeNumMoneyToChinese(val))

		var contractLength = $("#risk_list").children("p").length;
		var chkCnt = 0;
		$("#risk_list").children("p").each(function(){
			if($(this).children("img").attr('src') == '../images/checked.png'){
				chkCnt+=1;
			}
		});

	    if(val > 0 && (contractLength == chkCnt)){
	    	$(".btn").css({'background-color':'#fd7e23'});
			App.unbind('.btn', "tap",submitCreate);
	    	App.bind('.btn', "tap",submitCreate);
	    }else{
	    	App.unbind('.btn', "tap",submitCreate);
	    	$(".btn").css({'background-color':'#ddd6d6'});
	    }
        queryPayTreasureTips(val);
    })
queryAutoRechargePageInfo();

