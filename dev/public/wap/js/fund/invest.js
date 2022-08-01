var p_type = "invest_";
var fundid = App.getUrlParam("fundid");
var invest_crilist = App.getSession(App.fundInfo + fundid + "investlist");
var invest_cri = App.getSession(App.fundInfo + fundid + "invest");
var invests = App.getSession(App.fundInfo + fundid + "invests");
$(".cirlist").html(invest_crilist);
var htmlin = "";
for (var i = 1; i < 29; i++) {
    var j = i - 1;
    htmlin += '        <div class="card-list4" data="' + j + ',' + i + '号" ><div class="left1"><div class="f16 f-black">' + i + '号</div><div class="f11" style="margin-top: 4px"></div></div><div class="right1"><input type="radio" name="card" checked="checked"></div></div>     '
};
$("#ssub_cir_panel").html(htmlin);
$("#invest_str").html(invests);
var card = App.getSession(p_type + App.selectedCard);
var fundInfo = App.getSession(App.fundInfo + fundid);
var cards = App.getSession(App.cards);

function setSelectedCard() {
    if (card == null) {
        setFirstUsingCard()
    } else {
        $(".card_list_bankNm").html(card.bankName);
        $(".card_list_displayAcco").html(card.bankAccoDisplay)
    }
};

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
    App.bind("#confirm", "tap", inputTradePwd);

    function setStrategy() {
        $(".card-list22").each(function() {
            var data = $(this).attr("data");
            var array = String(data).split(",");
            if (array[1] == invests) $(this)(":radio[name='card']")[array[0]].checked = true
        })
    };

    function setCirls() {}
};
init();
$(function() {
    App.bind(".button-width-big", "tap", purchaseleft);
    App.bind("#invest_left", "tap", function() {
        $("#invest_1").show();
        $("#invest_2").hide();
        $(this).addClass("background-orange f-white");
        $("#invest_right").addClass("background-white f-orange");
        $("#invest_right").removeClass("background-orange f-white");
        App.unbind(".button-width-big", "tap", purchaseright);
        App.bind(".button-width-big", "tap", purchaseleft)
    });
    App.bind("#invest_right", "tap", function() {
        $("#invest_1").hide();
        $("#invest_2").show();
        $(this).addClass("background-orange f-white");
        $(this).removeClass("background-white f-orange");
        $("#invest_left").removeClass("background-orange f-white");
        App.unbind(".button-width-big", "tap", purchaseleft);
        App.bind(".button-width-big", "tap", purchaseright)
    });
    $("#f_title").html(fundInfo.fundNm);
    $("#f_title1").html(fundInfo.fundNm);
    $("#purchase_panel").show();
    $("#selected_card_panel").hide();
    App.bind(".card_div_btn", "tap", function() {
        $("#purchase_panel").hide();
        $("#selected_card_panel").show()
    });
    App.bind(".circl", "tap", function() {
        $("#select_cir_panel").show();
        $("#purchase_panel").hide()
    });
    App.bind("#invests", "tap", function() {
        $("#select_invests_panel").show();
        $("#purchase_panel").hide()
    });
    App.bind(".card-list2", "tap", handlerCir);
    App.bind(".card-list4", "tap", handlerCirlist);
    App.bind(".card-list33", "tap", handlerCirlist);
    App.bind(".card-list22", "tap", handlerInvest);
    if (card == null || card == '') {
        $(".bef").css({
            'padding-left': '60%'
        });
        $(".card_list_bankNm").html("现金宝");
        $(".card_list_displayAcco").html('')
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
        $(".bef").css({
            'padding-left': '60%'
        });
        App.setSession(p_type + App.selectedCard, '');
        $(".card_list_bankNm").html(array[1]);
        $(".card_list_displayAcco").html('')
    } else {
        $(".bef").css({
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
        $(".card_list_bankNm").html(card.bankName);
        $(".card_list_displayAcco").html(card.bankAccoDisplay)
    };
    $("#purchase_panel").show();
    $("#selected_card_panel").hide()
};

function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=" + fundid + "&tradeType=05&tradeScene=11" ;
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

function initCardList() {
    var selectedCard = App.getSession(p_type + App.selectedCard);
    var cards = App.getSession(App.cards);
    var chk = '';
    if (selectedCard == null || selectedCard == '') {
        chk = "checked='checked'"
    };
    $("#cards_panel").append("<div class='card-list1'  data='0,现金宝'>" + "<div class='left1'>" + "<div class='f16 f-black'>现金宝</div>" + "<div class='f11' style='margin-top: 4px'></div>" + "</div>" + "<div class='right1'>" + "<input type='radio' name='card' " + chk + ">" + "</div>" + "</div>");
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
            $(".bef").css({
                'padding-left': '60%'
            });
            $(".card_list_bankNm").html("现金宝");
            $(".card_list_displayAcco").html('')
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
        $(".bef").css({
            'padding-left': '60%'
        });
        $(".card_list_displayAcco").html('')
    } else {
        $(".bef").css({
            'padding-left': ''
        });
        $(".card_list_displayAcco").html(card.bankAccoDisplay)
    };
    $(".card_list_bankNm").html(card.bankName);
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
        window.location = "./investsuccess.html"
    })
};

function handlerCir() {
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
    App.setSession(App.fundInfo + fundid + "invest", array[1]);
    if (array[1] == '每月') {
        $("#select_ssub_cir_panel").show()
    } else {
        $("#select_sub_cir_panel").show()
    };
    $("#select_cir_panel").hide()
};

function handlerCirlist() {
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
    invest_cri = App.getSession(App.fundInfo + fundid + "invest");
    App.setSession(App.fundInfo + fundid + "investlist", invest_cri + array[1]);
    $("#select_ssub_cir_panel").hide();
    $("#select_sub_cir_panel").hide();
    $("#purchase_panel").show();
    $(".cirlist").html(invest_cri + array[1])
};

function handlerInvest() {
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
    App.setSession(App.fundInfo + fundid + "invests", array[1]);
    $("#invest_str").html(array[1]);
    $("#purchase_panel").show();
    $("#select_invests_panel").hide()
};

function purchaseleft() {
    console.log("l" + $("#nums").val());
    if ($("#nums").val() == '') {
        alert("请输入金额");
        return false
    } else {
        var cashfrom = "V";
        if ($(".card_list_bankNm") == "现金宝") {
            cashfrom = "B"
        };
        var url = App.projectNm + "/fund/fund_mip_create";
        var card = App.getSession(p_type + App.selectedCard);
        var data = JSON.stringify({
            "fundId": fundid,
            "shareType": "A",
            "cashFrm": cashfrom,
            "bankAcco": card.bankAcco,
            "bankNo": card.bankNo,
            "mipbuyamt": $("#nums").val(),
            "status": "B"
        });
        App.post(url, data, function() {}, function(result) {
            App.show_alert();
            $("#alert_info").html(result.body.info);
            App.setSession(App.serialNo, result.body.serialNo)
        })
    }
};

function purchaseright() {
    console.log("r" + $("#nums1").val());
    if ($("#nums1").val() == '') {
        alert("请输入金额");
        return false
    } else {
        var cashfrom = "V";
        if ($(".card_list_bankNm") == "现金宝") {
            cashfrom = "B"
        };
        var url = App.projectNm + "/fund/fund_mip_create";
        var card = App.getSession(p_type + App.selectedCard);
        var data = JSON.stringify({
            "fundId": fundid,
            "shareType": "A",
            "cashFrm": cashfrom,
            "bankAcco": card.bankAcco,
            "bankNo": card.bankNo,
            "mipbuyamt": $("#nums1").val(),
            "status": "B"
        });
        App.post(url, data, function() {}, function(result) {
            App.show_alert();
            $("#alert_info").html(result.body.info);
            App.setSession(App.serialNo, result.body.serialNo)
        })
    }
};
var th = document.body.scrollHeight;
if (th > 700) {
    $(".zftype").css({
        'margin-left': '20%'
    })
} else if (th > 600) {
    $(".zftype").css({
        'margin-left': '10%'
    })
};
$(".fund_list").css({
    'max-height': (th - 200) + 'px',
    'overflow-y': 'scroll',
    'overflow-x': 'hidden'
});