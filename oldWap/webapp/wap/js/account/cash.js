
$(".cash_type").hide();
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
		App.queryWapCard(function() {
			setFirstUsingCard();
			initCardList()
		})

		var url = App.projectNm + "/etrading/get_take_back_date?date=" + (new Date()).getTime();
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

function setFirstUsingCard() {
	var card = App.firstUsingCard(function() {
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

function showFirstCard(card) {
	$("#card_list_bankIco").addClass("bank no-margin-left ico_"+card.bankNo);
	$("#card_list_bankNm").html(card.bankGrpName);
	$("#card_list_displayAcco").html(card.bankAccoDisplay);
	App.setSession(App.selectedCard, card);
	selectType(1)
};

function getCard(bankNo, bankAcco) {
	var card = App.getCard(bankNo, bankAcco);
	if (card != null) {
		$("#card_list_bankIco").addClass("bank no-margin-left ico_"+card.bankNo);
		$("#card_list_bankNm").html(card.bankGrpName);
		$("#card_list_displayAcco").html(card.bankAccoDisplay);
		selectType(App.getSession(App.takeBackType).val);
	}
};

function howToCalc() {
	var card = App.getSession(App.selectedCard);
	var takebackType = App.getSession(App.takeBackType);
	var url = "../../common/calculateTakeback.jsp?takebackType=" + takebackType + "&bankNo=" + card.bankNo + "&bankAcco=" + card.bankAcco;
	$("#howToCalc").hammer().bind("tap", function() {
		window.location = url
	});
	$("#takeRule").hammer().bind("tap", function() {
		window.location = "../../common/ruleDescription.html"
	})
};
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
							var url = App.projectNm + "/etrading/ec_takeback";

							var data = JSON.stringify({
								"realTime": takebackType,
								"bankAcco": card.bankAcco,
								"bankNo": card.bankNo,
								"subAmt": amount,
								"acceptMode":"4"
							});
							App.post(url, data, function() {
								App.bind("#next_btn", "tap", confirmTakeBack)
							}, function(result) {
								App.show_alert();
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
						var url = App.projectNm + "/etrading/ec_takeback";

						var data = JSON.stringify({
							"realTime": takebackType,
							"bankAcco": card.bankAcco,
							"bankNo": card.bankNo,
							"subAmt": amount,
							"acceptMode":"4"
						});
						App.post(url, data, function() {
							App.bind("#next_btn", "tap", confirmTakeBack)
						}, function(result) {
							App.show_alert();
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
			var url = App.projectNm + "/etrading/ec_takeback";

			var data = JSON.stringify({
				"realTime": takebackType,
				"bankAcco": card.bankAcco,
				"bankNo": card.bankNo,
				"subAmt": amount,
				"acceptMode":"4"
			});
			App.post(url, data, function() {
				App.bind("#next_btn", "tap", confirmTakeBack)
			}, function(result) {
				App.show_alert();
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
	App.tradePwd(pwd, function() {
		App.bind("#confirm", "tap", inputTradePwd)
	}, function(result) {
		App.cancel_alert();
		App.setSession(App.ecTradeSerialNo,result.body.ecTradeSerialNo);
		App.setSession(App.successInfo, result.body.successInfo);
		var forwardUrl = App.getUrlParam("forwardUrl");
        if(App.isNotEmpty(forwardUrl)){
        	window.location = "./cashSuccessful.html?forwardUrl="+ forwardUrl;
        }else{
			window.location = "./cashSuccessful.html";
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
		$("#cards_panel").append("<div class='bankitems clearfix " + (bool ? "active" : "") + "' data='" + index + "," + card.bankNo + "," + card.bankAcco + "," + card.promptCashLimit + "," + card.bankGrpName + "," + card.bankAccoDisplay + "," + card.normalCashLimit + "," + card.bankName+ "'>" + "<div class='bankcontent clearfix'><div class='pic left'><i class='bank no-margin-left ico_"+card.bankNo+"'></i></div><div class='c_bank_info left'><h3>" + card.bankGrpName +"[" + card.bankAccoDisplay +  "]</h3><p> "+card.limitRemark+"</p></div><a href='' class='red blue'>快捷</a></div>" + "</div>" );
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
	};
	App.setSession(App.selectedCard, card);
	$("#card_list_bankIco").removeClass().addClass("bank no-margin-left ico_"+card.bankNo);
	$("#card_list_bankNm").html(card.bankGrpName);
	$("#card_list_displayAcco").html(card.bankAccoDisplay);
	setLimitPanel(card, App.getSession(App.takeBackType));
	$("#selected_card_panel").toggle("slow");
	$("#takecash_panel").show();
};

function selectType(val) {
	$("#amount").val("");
	var takeType = {};
	var url = App.projectNm + "/etrading/get_take_back_date?date=" + (new Date()).getTime();
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
		App.setSession(App.takeBackType, takeType.val);
	});



	$("#takeTp_title").html(takeType.title);
	$("#takeTp_text").html(takeType.text);
	
	$("#seleted_type_panel").hide();$("#takecash_panel").show();
	setLimitPanel(App.getSession(App.selectedCard), val)
};
    $('.checkBox').on('click', function () {
        if ($(this).attr('src') === '../images/checkBox.png') {
            $(this).attr('src', '../images/checked.png')
        } else {
            $(this).attr('src', '../images/checkBox.png')
        }
    })
function setLimitPanel(card, takeTp) {
	if (1 == takeTp) {
		$("#limit_text").html(App.numberFormat(card.promptCashLimit));
		App.setSession(App.card_limit_val, Number(card.promptCashLimit))
	} else {
		card.cashBalance = $("#cashBalance").val();
		if (Number(card.normalCashLimit) < Number(card.cashBalance)) {
			$("#limit_text").html(App.numberFormat(card.normalCashLimit));
			App.setSession(App.card_limit_val, Number(card.normalCashLimit))
		} else {
			$("#limit_text").html(App.numberFormat(card.cashBalance));
			App.setSession(App.card_limit_val, Number(card.cashBalance))
	}
	};
	if (Number(card.promptCashLimit) == 0) {
		$("#next_btn").addClass("button-background");
		$("#next_btn").removeClass("button-orange");
		App.unbind("#next_btn", "tap", confirmTakeBack)
	} else {
		$("#next_btn").addClass("button-orange");
		$("#next_btn").removeClass("button-background");
		App.bind("#next_btn", "tap", confirmTakeBack)
	}
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
