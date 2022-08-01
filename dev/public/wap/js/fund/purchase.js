var p_type = "purchase_";
var card = App.getSession(p_type + App.selectedCard);
var cards = App.getSession(App.cards);
var fundid = App.getUrlParam("fundid");

function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=" + fundid + "&tradeType=00&tradeScene=11" ;
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

function setSelectedCard() {
    if (card == null) {
        setFirstUsingCard()
    } else {
        $("#card_list_bankNm").html(card.bankName);
        $("#card_list_displayAcco").html(card.bankAccoDisplay)
    }
};
var fundInfo = App.getSession(App.fundInfo + fundid);

function init() {
    if (fundInfo == null || fundInfo.length == 0) {
        queryFundInfo();
        fundInfo = App.getSession(App.fundInfo + fundid)
    };
    queryCard(function() {
        setSelectedCard();
        initCardList()
    })
    App.bind("#cancel", "tap", App.cancel_alert);
    App.bind("#confirm", "tap", inputTradePwd)
};
init();
App.bind("#invest_left", "tap", function() {
    $("#invest_1").show();
    $("#invest_2").hide();
    $(this).addClass("background-orange f-white");
    $("#invest_right").addClass("background-white f-orange");
    $("#invest_right").removeClass("background-orange f-white")
});
App.bind("#invest_right", "tap", function() {
    $("#invest_1").hide();
    $("#invest_2").show();
    $(this).addClass("background-orange f-white");
    $(this).removeClass("background-white f-orange");
    $("#invest_left").removeClass("background-orange f-white")
});
$("#f_title").html(fundInfo.fundNm);
$("#purchase_panel").show();
$("#selected_card_panel").hide();
App.bind("#card_div_btn", "tap", function() {
    $("#purchase_panel").hide();
    $("#selected_card_panel").show()
});
if (card == null || card == '') {
    $("#bef").css({
        'padding-left': '60%'
    });
    $("#card_list_bankNm").html("现金宝");
    $("#card_list_displayAcco").html('')
};
$("#ch_rate").click(function() {
    var amt = $("#nums").val();
    if (Number(amt) < 1) {
        alert("请输入金额");
        return
    } else {
        // var url = App.projectNm + "/fund/fund_fee";
        var card = App.getSession(p_type + App.selectedCard);
        // var data = JSON.stringify({
        //     "fundId": fundid,
        //     "shareType": "A",
        //     "cashFrm": "B",
        //     "bankNo": card.bankNo,
        //     "subAmt": $("#nums").val()
        // });
        var url = "/mobile-bff/v1/fund/fund-fee?subAmt="+ $("#nums").val() + "&fundId="+ fundid + "&cashFrm=B&bankNo=" + card.bankNo +"&shareType=A"
        App.get(url, function() {}, function(result) {
            $("#ch_rate").html(result.body.fee)
        })
    }
});

function queryFundInfo() {
    // var url = App.projectNm + "/fund/fund_detail_info?fundId=" + fundid;
    var url =  "/mobile-bff/v1/fund/detailInfo";
    var data = JSON.stringify({
        "fundId": fundid
    });
    App.post(url, data, function(result) {
        App.setSession(App.fundInfo + fundid, result.body)
    })
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
    $(":radio[name='card']")[array[0]].checked = true;
    if (array[1] == '现金宝') {
        App.setSession(p_type + App.selectedCard, '');
        $("#bef").css({
            'padding-left': '60%'
        });
        $("#card_list_bankNm").html(array[1]);
        $("#card_list_displayAcco").html('');
        $("#topup_txt").html('');
        $(":radio[name='card']")[array[0]].checked = true
    } else {
        $("#bef").css({
            'padding-left': ''
        });
        var card = {
            "bankNo": array[1],
            "bankAcco": array[2],
            "realLimit": array[3],
            "bankName": array[4],
            "bankAccoDisplay": array[5],
            "remark": array[6]
        };
        App.setSession(p_type + App.selectedCard, card);
        $("#card_list_bankNm").html(card.bankName);
        $("#card_list_displayAcco").html(card.bankAccoDisplay);
        $("#topup_txt").html(replaceTxt2Html(card.remark))
    };
    $("#purchase_panel").show();
    $("#selected_card_panel").hide()
};

function initCardList() {
    var selectedCard = App.getSession(p_type + App.selectedCard);
    var cards = App.getSession(App.cards);
    var chk = '';
    if (selectedCard == null || selectedCard == '') {
        chk = "checked='checked'"
    };
    $("#cards_panel").append("<div class='card-list1' data='0,现金宝'>" + "<div class='left1'>" + "<div class='f16 f-black'>现金宝</div>" + "<div class='f11' style='margin-top: 4px'></div>" + "</div>" + "<div class='right1'>" + "<input type='radio' name='card' " + chk + ">" + "</div>" + "</div>");
    for (var index in cards) {
        var bool = false;
        var card = cards[index];
        if (selectedCard != null && selectedCard.bankNo == card.bankNo && selectedCard.bankAcco == card.bankAcco) {
            bool = true
        };
        $("#cards_panel").append("<div class='" + (card.tradeFlag == "1" ? "card-list1" : "card-list3") + "' data='" + (Number(index) + Number(1)) + "," + card.bankNo + "," + card.bankAcco + "," + card.realLimit + "," + card.bankName + "," + card.bankAccoDisplay + "," + card.remark + "'>" + "<div class='left1'>" + "<div class='f16 f-black'>" + card.bankName + "</div>" + "<div class='f11' style='margin-top: 4px'>储蓄卡&nbsp;&nbsp;" + card.bankAccoDisplay + "</div>" + "</div>" + "<div class='right1'>" + (card.tradeFlag == "1" ? "<input type='radio' name='card'" + (bool ? "checked='checked'" : "") + ">" : "移动端暂不支持") + "</div>" + "</div>")
    };
    App.bind(".card-list1", "tap", handlerCard)
};
App.bind("#purchase", "tap", function() {
    var url = App.projectNm + "/fund/fund_purchase";
    var card = App.getSession(p_type + App.selectedCard);
    var cashfrom = "V";
    if ($("#card_list_bankNm") == "现金宝") {
        cashfrom = "B"
    };
    var data = JSON.stringify({
        "fundId": fundid,
        "shareType": "A",
        "cashFrm": cashfrom,
        "bankAcco": card.bankAcco,
        "bankNo": card.bankNo,
        "subAmt": $("#nums").val(),
        "status": "B"
    });
    App.post(url, data, function() {}, function(result) {
        App.show_alert();
        $("#alert_info").html(result.body.info);
        App.setSession(App.serialNo, result.body.serialNo)
    })
});

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
            $("#bef").css({
                'padding-left': '60%'
            });
            $("#card_list_bankNm").html("现金宝");
            $("#card_list_displayAcco").html('')
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


function showFirstCard(card) {
    if (card.bankName == '现金宝') {
        $("#bef").css({
            'padding-left': '60%'
        });
        $("#card_list_displayAcco").html('')
    } else {
        $("#bef").css({
            'padding-left': ''
        });
        $("#card_list_displayAcco").html(card.bankAccoDisplay)
    };
    $("#card_list_bankNm").html(card.bankName);
    $("#topup_txt").html(replaceTxt2Html(card.remark));
    var selectedCard = {
        "bankNo": card.bankNo,
        "bankAcco": card.bankAcco,
        "realLimit": card.realLimit,
        "bankName": card.bankName,
        "bankAccoDisplay": card.bankAccoDisplay,
        "remark": card.remark
    };
    App.setSession(p_type + App.selectedCard, selectedCard)
};

function replaceTxt2Html(val) {
    return App.replaceTxt(val, "如何提升限额？", "<a href='http://app.99fund.com/mobileEC/common/bankCardUpDesc.html'>如何提升限额？</a>")
};

function inputTradePwd() {
    App.unbind("#confirm", "tap", inputTradePwd);
    var pwd = $("#pwd").val();
    App.tradeBffPwd(pwd, function() {
        App.bind("#confirm", "tap", inputTradePwd)
    }, function(result) {
        App.cancel_alert();
        App.setSession(App.successInfo, result.body.successInfo);
        window.location = "./pursuccess.html"
    })
};
var th = document.body.scrollHeight;
if (th > 700) {
    $("#zftype").css({
        'margin-left': '20%'
    })
} else if (th > 600) {
    $("#zftype").css({
        'margin-left': '10%'
    })
}