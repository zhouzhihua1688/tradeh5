
$(".cash_type").hide();
function canNextBtn() {
	var amount = $("#amount").val();
	if(Number(amount) > 0){ // 输入金额大于0
		if($('.c_type.selected').attr('data') == '1' && $(".checkBox").attr("src") == "../images/checked.png"){ // 快取需要勾选协议
			if (Number(amount) > Number(App.getSession("quickBackDayAvailableAmt"))) { // 快速取现
				$("#next_btn").addClass("button-background");
				$("#next_btn").removeClass("button-orange");
				App.unbind("#next_btn", "tap", confirmTakeBack)
			}
			else {
				$("#next_btn").removeClass("button-background");
				$("#next_btn").addClass("button-orange");
				App.bind("#next_btn", "tap", confirmTakeBack)
			}
		}
		else if($('.c_type.selected').attr('data') == '0'){
			if(Number(amount) > Number(App.getSession(App.card_limit_val))){ // 普通取现
					$("#next_btn").addClass("button-background");
					$("#next_btn").removeClass("button-orange");
					App.unbind("#next_btn", "tap", confirmTakeBack)
				}
			else {
				$("#next_btn").removeClass("button-background");
				$("#next_btn").addClass("button-orange");
				App.bind("#next_btn", "tap", confirmTakeBack)
			}
		}
	}
	else{
		$("#next_btn").addClass("button-background");
		$("#next_btn").removeClass("button-orange");
		App.unbind("#next_btn", "tap", confirmTakeBack)
	}
}

$(function() {
	function setSelectedCard() {
		var card = App.getSession(App.selectedCard);
		if (card == null) {
			setFirstUsingCard()
		} else {
			getCard(card.bankNo, card.bankAcco);
			howToCalc()
		}
	};

	function init() {
		$("#takecash_panel").show();
		$("#selected_card_panel").hide();
		$("#seleted_type_panel").hide();
		App.bind("#cancel", "tap", App.cancel_alert);
		App.bind("#confirm", "tap", inputTradePwd);
//		App.bind("#next_btn", "tap", confirmTakeBack);
		App.bind("#card_div_btn", "tap", function() {
			$("#takecash_panel").hide();
			$("#selected_card_panel").show();
		});
		//初始化取现银行卡列表
		queryCard(function() {
			setFirstUsingCard();
			initCardList()
		})

		// var url = App.projectNm + "/etrading/get_take_back_date?date=" + (new Date()).getTime();
		var url = "/mobile-bff/v1/etrading/get-take-back-date";
		App.get(url, null, function(result) {
			$("#next_date2").html("预计"+result.body.info+",当日有收益");
			$("#next_date").val(result.body.info);
			$("#date_txt").val(result.body.normalEncashTip)
			$("#cashBalance").val(result.body.takeBackInfo.vaccoBalance);
		});
		App.bind("#cashType_1", "tap", function() {
			selectType(0)
		});
		App.bind("#cashType_2", "tap", function() {
			selectType(1)
		})
	};
	init()
});

function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=02&tradeScene=13" ;
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


function setFirstUsingCard() {
	var card = firstUsingCard(function() {
		var cards = App.getSession(App.cards);
		for (var index in cards) {
			var card = cards[index];
			if ("1" == card.tradeFlag) {
				showFirstCard(card);
				return
			}
		};
		howToCalc()
	});
	if (card != null) {
		showFirstCard(card);
		howToCalc()
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

function showFirstCard(card) {
	$("#card_list_bankIco").attr('src',"/mobileEC/images/bank/"+card.bankNo+".png");
	$("#card_list_bankNm").html(card.bankGrpName);
	$("#card_list_displayAcco").html(card.bankAccoDisplay);
	App.setSession(App.selectedCard, card);
	selectType(1)
};

function getCard(bankNo, bankAcco) {
	var card = App.getCard(bankNo, bankAcco);
	if (card != null) {
		$("#card_list_bankIco").attr('src',"/mobileEC/images/bank/"+card.bankNo+".png");
		$("#card_list_bankNm").html(card.bankGrpName);
		$("#card_list_displayAcco").html(card.bankAccoDisplay);
		selectType(App.getSession(App.takeBackType).val);
	}
};

function howToCalc() {
	var card = App.getSession(App.selectedCard);
	var takebackType = App.getSession(App.takeBackType);
	if (card != null) {
		var url = "../../common/calculateTakeback.jsp?takebackType=" + takebackType + "&bankNo=" + card.bankNo + "&bankAcco=" + card.bankAcco;
		$("#howToCalc").hammer().bind("tap", function() {
			window.location = url
		});
	}
	$("#takeRule").hammer().bind("tap", function() {
		window.location = "../../common/ruleDescription.html"
	})
};

$("#amount").on("input", function () {
	App.unbind("#next_btn", "tap", confirmTakeBack);
	canNextBtn();
});
var custNo = App.getCookie("sso_cookie_ext_dp");
function confirmTakeBack() {
	var amount = $("#amount").val();
	if (App.isEmpty(amount)) {
		$("#common_msg").html("请输入金额");
		$("#lottery1").show();
		return false
	} else if (Number(amount) <= 0) {
		$("#common_msg").html("取现金额要不少于0.01元");
		$("#lottery1").show();
		return false
	} else if (Number(App.getSession(App.card_limit_val)) < Number(amount)) {
		$("#common_msg").html("超出了本卡可取金额");
		$("#lottery1").show();
		return false
	};
    var data1 = $('.checkBox').attr("src").indexOf("checked");
	var takebackType = App.getSession(App.takeBackType);
    if (takebackType =="1" && data1 == -1) {
		$("#common_msg").html("请勾选同意《快速取现服务协议》");
		$("#lottery1").show();
		return false
    };
    if(((Number($("#limit_text").html().replace(/,/g, "")) == Number(amount)) && (takebackType == "0")) || ((Number($("#cashBalance").val()) == Number(amount)) && (takebackType == "1"))){//全部取出时校验
		//取现预校验
	    var url = "/mobile-bff/v1/smac/encash/validate?custNo="+custNo+"&balance="+amount+"&t=" + (new Date()).getTime();
	    App.get(url, null, function(result) {
	        var body = result.body;
	        if (body != null && body != undefined) {
	        	if(body.showDialog == true){
		        	$("#conf_msg").html(body.dialogMessage);
		        	$("#take").html(body.takeBackButtonName);
		        	$("#viewMore").html(body.changeAmountButtonName);
		        	$("#viewMore").attr('jumpUrl',"");
		        	$('#conf_alert').show()
		            App.bind("#take", "tap", function() {
						App.unbind("#next_btn", "tap", confirmTakeBack);
						var card = App.getSession(App.selectedCard);
						if (card != null) {
							// var url = App.projectNm + "/etrading/ec_takeback";
							var url = '/mobile-bff/v1/etrading/ec-take-back';

							var data = JSON.stringify({
								"realTime": takebackType,
								"bankAcco": card.bankAcco,
								"bankNo": card.bankNo,
								"subAmt": amount,
								"acceptMode":"4",
								"bankSerialId": card.bankCardSerialid
							});
							utils.post(url, data, function(result) {
								// App.bind("#next_btn", "tap", confirmTakeBack)
								var forwardUrl = App.getUrlParam("forwardUrl");
								if(App.isNotEmpty(forwardUrl)){
									App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/cashSuccessful.html?forwardUrl="+ forwardUrl);
								}else{
									App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/cashSuccessful.html");
								}
								utils.verifyTradeChain(result.body);
							}, function(result) {
								// App.show_alert();
								$("#alert_info").html(result.body.info);
								App.setSession(App.serialNo, result.body.serialNo)
							})
						} else {
							App.bind("#next_btn", "tap", confirmTakeBack);
							$("#common_msg").html("请您先选择银行卡");
							$("#lottery1").show();
						}
		            })
		            App.bind("#viewMore", "tap", function() {
		            	$('.tips').hide()
		            });
	            }else{
					App.unbind("#next_btn", "tap", confirmTakeBack);
					var card = App.getSession(App.selectedCard);
					if (card != null) {
						// var url = App.projectNm + "/etrading/ec_takeback";
						var url = '/mobile-bff/v1/etrading/ec-take-back';

						var data = JSON.stringify({
							"realTime": takebackType,
							"bankAcco": card.bankAcco,
							"bankNo": card.bankNo,
							"subAmt": amount,
							"acceptMode":"4",
							"bankSerialId": card.bankCardSerialid
						});
						utils.post(url, data, function(result) {
							// App.bind("#next_btn", "tap", confirmTakeBack)
							var forwardUrl = App.getUrlParam("forwardUrl");
							if(App.isNotEmpty(forwardUrl)){
								App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/cashSuccessful.html?forwardUrl="+ forwardUrl);
							}else{
								App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/cashSuccessful.html");
							}
							utils.verifyTradeChain(result.body);
						}, function(result) {
							// App.show_alert();
							$("#alert_info").html(result.body.info);
							App.setSession(App.serialNo, result.body.serialNo)
						})
					} else {
						App.bind("#next_btn", "tap", confirmTakeBack);
						$("#common_msg").html("请您先选择银行卡");
						$("#lottery1").show();
					}
	            }
	        }
	    });
	}else{

		App.unbind("#next_btn", "tap", confirmTakeBack);
		var card = App.getSession(App.selectedCard);
		if (card != null) {
			// var url = App.projectNm + "/etrading/ec_takeback";
			var url = '/mobile-bff/v1/etrading/ec-take-back';

			var data = JSON.stringify({
				"realTime": takebackType,
				"bankAcco": card.bankAcco,
				"bankNo": card.bankNo,
				"subAmt": amount,
				"acceptMode":"4",
				"bankSerialId": card.bankCardSerialid
			});
			utils.post(url, data, function(result) {
				// App.bind("#next_btn", "tap", confirmTakeBack)
				var forwardUrl = App.getUrlParam("forwardUrl");
				if(App.isNotEmpty(forwardUrl)){
					App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/cashSuccessful.html?forwardUrl="+ forwardUrl);
				}else{
					App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/cashSuccessful.html");
				}
				utils.verifyTradeChain(result.body);
			}, function(result) {
				// App.show_alert();
				$("#alert_info").html(result.body.info);
				App.setSession(App.serialNo, result.body.serialNo)
			})
		} else {
			App.bind("#next_btn", "tap", confirmTakeBack);
			$("#common_msg").html("请您先选择银行卡");
			$("#lottery1").show();
		}

	}
};

function inputTradePwd() {
	App.unbind("#confirm", "tap", inputTradePwd);
	var pwd = $("#pwd").val();
	App.tradeBffPwd(pwd, function() {
		App.bind("#confirm", "tap", inputTradePwd)
	}, function(result) {
		App.cancel_alert();
		App.setSession(App.ecTradeSerialNo,result.body.ecTradeSerialNo);
		App.setSession(App.successInfo, result.body.successInfo);
		var forwardUrl = App.getUrlParam("forwardUrl");
        if(App.isNotEmpty(forwardUrl)){
        	window.location = "/mobileEC/wap/account/cashSuccessful.html?forwardUrl="+ forwardUrl;
        }else{
			window.location = "/mobileEC/wap/account/cashSuccessful.html";
		}
	})
};

function initCardList() {
	var selectedCard = App.getSession(App.selectedCard);
	var cards = App.getSession(App.cards);
	for (var index in cards) {
		var bool = false;
		var card = cards[index];
		if (selectedCard != null && selectedCard.bankNo == card.bankNo && selectedCard.bankAcco == card.bankAcco) {
			bool = true
		};
        var signTxt = ""; /** 1 快捷 2 银联通 3 网银 5 不显示*/
        var signStyle = "";
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
		$("#cards_panel").append("<div class='bankitems clearfix " + (bool ? "active" : "") + "' data='" + index + "," + card.bankNo + "," + card.bankAcco + "," + card.promptCashLimit + "," + card.bankGrpName + "," + card.bankAccoDisplay + "," + card.normalCashLimit + "," + card.bankName+ "," + card.bankCardSerialid + "," + card.limit+ "'>" + "<div class='bankcontent clearfix'><div class='pic left'>"
		+'<img src="/mobileEC/images/bank/'+card.bankNo+'.png" />'
		+"</div><div class='c_bank_info left'><h3>" + card.bankGrpName +"[" + card.bankAccoDisplay +  "]</h3><p> "+card.limitRemark
		+"</p></div>"
		+'                    <div class=\"lh-130 '+ signStyle +'\">\n' 
		+'            <a class="icon icon-'+ signStyle +'">'+ signTxt +'</a>' 
		+'                    </div>\n' +
		"</div>" );
		}
	};
	App.bind(".bankitems", "tap", handlerCard)
};

function handlerCard() {
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
	$(".bankitems").removeClass("active").eq(array[0]).addClass("active");
	var card = {
		"bankNo": array[1],
		"bankAcco": array[2],
		"promptCashLimit": array[3],
		"bankGrpName": array[4],
		"bankAccoDisplay": array[5],
		"normalCashLimit": array[6],
		"cashBalance": $("#cashBalance").val(),
		"bankName": array[7],
		"bankCardSerialid": array[8],
		"limit":array[9]
	};
	App.setSession(App.selectedCard, card);
	$('#amount').val('');
	canNextBtn();
	$("#card_list_bankIco").attr('src',"/mobileEC/images/bank/"+card.bankNo+".png");
	$("#card_list_bankNm").html(card.bankGrpName);
	$("#card_list_displayAcco").html(card.bankAccoDisplay);
	setLimitPanel(card, App.getSession(App.takeBackType));
	$("#selected_card_panel").toggle("slow");
	$("#takecash_panel").show();
};

function selectType(val) {
	$("#amount").val('');
	$("#next_btn").addClass("button-background");
	$("#next_btn").removeClass("button-orange");
	App.unbind("#next_btn", "tap", confirmTakeBack)
	var takeType = {};
	// var url = App.projectNm + "/etrading/get_take_back_date?date=" + (new Date()).getTime();
	var url = "/mobile-bff/v1/etrading/get-take-back-date";
	App.get(url, null, function(result) {
		takeBackInfo = result.body.takeBackInfo;
		takeType.title = "普通取现";
		takeType.text = "当日有收益";
		takeType.val = "0";
		$("#next_date2").html("预计"+result.body.info+",<span color='red'>当日有收益</span>");
		$("#cashBalance").val(takeBackInfo.vaccoBalance);
//		$("#date_txt").html($("#next_date").val()+","+takeType.text);
		if (val == 1) {
			takeType.title = "快速取现";
			takeType.text = "";
			takeType.val = "1";
			$(".dim").show();
			$("#takeTp_nextDate").html("实时到账,今日剩余可取<span color='red'>"+App.numberFormat(takeBackInfo.quickBackDayAvailableAmt)+"</span>元,<span color='red'>"+takeBackInfo.quickDayAvailableTimes+"</span>次");
//		$("#date_txt").html("预计"+","+takeType.text);
		}else{ 
			$(".dim").hide();
		}
		$(".cash_type").show();
		App.setSession("quickBackDayAvailableAmt",takeBackInfo.quickBackDayAvailableAmt);
		App.setSession(App.takeBackType, takeType.val);
	});



	$("#takeTp_title").html(takeType.title);
	$("#takeTp_text").html(takeType.text);
	
	$("#seleted_type_panel").hide();$("#takecash_panel").show();
	setLimitPanel(App.getSession(App.selectedCard), val)
};
    $('.checkBox').on('click', function () {
        if ($(this).attr('src') === '../images/checkBox.png') {
            $(this).attr('src', '../images/checked.png');
			canNextBtn();
        } else {
            $(this).attr('src', '../images/checkBox.png')
			$("#next_btn").addClass("button-background");
			$("#next_btn").removeClass("button-orange");
			App.unbind("#next_btn", "tap", confirmTakeBack);
        }
    })
function setLimitPanel(card, takeTp) {
	// if (1 == takeTp) {
	// 	$("#limit_text").html(App.numberFormat(card.promptCashLimit));
	// 	App.setSession(App.card_limit_val, Number(card.promptCashLimit))
	// } else {
	// 	card.cashBalance = $("#cashBalance").val();
	// 	if (Number(card.normalCashLimit) < Number(card.cashBalance)) {
	// 		$("#limit_text").html(App.numberFormat(card.normalCashLimit));
	// 		App.setSession(App.card_limit_val, Number(card.normalCashLimit))
	// 	} else {
	// 		$("#limit_text").html(App.numberFormat(card.cashBalance));
	// 		App.setSession(App.card_limit_val, Number(card.cashBalance))
	// }
	// };
	if(1 != takeTp){
		card.cashBalance = $("#cashBalance").val();
	}
	$("#limit_text").html(App.numberFormat(card.limit));
	App.setSession(App.card_limit_val, Number(card.limit));
	/*
	if (Number(card.promptCashLimit) == 0) {
		$("#next_btn").addClass("button-background");
		$("#next_btn").removeClass("button-orange");
		App.unbind("#next_btn", "tap", confirmTakeBack)
	} else {
		$("#next_btn").addClass("button-orange");
		$("#next_btn").removeClass("button-background");
		App.bind("#next_btn", "tap", confirmTakeBack)
	}*/
}
    $('.tips span').eq(0).on('click', function () {//关闭弹窗
        $('.tips').hide()

    })
    $(".icon").click(function(){
    	queryTips()
    	$('#tips_alert').show()
	})
	queryTips()
	function queryTips(){
	    var url = "/mobile-bff/v1/smac/tradeTips?sceneCode=04&r=" + (new Date()).getTime();
	    App.get(url, null, function(result) {
	        var body = result.body;
	        if (body != null && body != undefined) {
	        	if(App.isNotEmpty(body.tradeRules)){
		        	$("#tips_msg").html(body.tradeRules);
		        	$("#viewMore2").attr('jumpUrl',body.smacH5UpgradeJumpUrl);
		            App.bind("#viewMore2", "tap", function() {
		            	if($("#viewMore2").attr('jumpUrl') != ""){
		                	window.location.href = $("#viewMore2").attr('jumpUrl');
		            	}
		            })
		            App.bind("#take2", "tap", function() {
		            	$("#tips_alert").hide();
		            })
	        	} else {
		        	$(".icon").hide();
	                $("#otherType").hide();
            	}
	        } else {
	        	$(".icon").hide();
                $("#otherType").hide();
            }
	    });
	}
