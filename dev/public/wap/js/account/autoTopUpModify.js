$(function() {
    $(".selectBankCard").unbind("click");
    var plan = App.getSession(App.autoTopUpModifyInfo);
    if (plan == null || plan == undefined || plan == '') {
        window.location.href = "./autoTopUpList.html"
    } else {
        setSelectedCard(plan);
        $(".my-money").val(plan.mipBuyAmt);
        $(".my-time-1").html(tranMipCycle(plan.mipCycle));
        $(".my-time-1").attr("chose-data", plan.mipCycle);
        $(".my-time-2").html(tranMipBuyday(plan.mipCycle, plan.mipBuyday));
        $(".my-time-2").attr("chose-data", plan.mipBuyday);
        if (plan.mipDesc == "") {
            showTime()
        } else {
            $(".autoTopUpRemark").val(plan.mipDesc)
        }
    };
    $(".chose-icon").click(function() {
        var data1 = $('.rules i').attr("opt");
        if (data1 == "0") {
            $('.chose-icon').attr('opt', '1').removeClass("current")
        } else if (data1 == "1") {
            $('.chose-icon').attr('opt', '0').addClass("current")
        }
    });
    $(".Bomb-box-ok").click(function() {
        $(".Bomb-box").hide()
    });
    $(".error-icon").click(function() {
        $(this).parent().find('input').val('')
    });
    $(".time-01 li").click(function() {
        $(this).addClass('current').siblings().removeClass('current');
        $(".time-01").hide();
        var data = $(this).attr("data");
        $(".select-style span").attr('chose-data', data);
        var data2 = $(".select-style span").attr("chose-data");
        if (data2 == "MM") {
            $(".first-select span").html('每月')
        } else if (data2 == "2W") {
            $(".first-select span").html('每双周')
        } else if (data2 == "WW") {
            $(".first-select span").html('每周')
        };
        var myChose = $(".my-time-1").attr("chose-data");
        if (myChose == "MM" || myChose == "2W" || myChose == "WW") {
            $(".my-time-2").text('请选择')
        }
    });
    $(".second-select").on("click", function() {
        $(this).blur();
        var data2 = $(".select-style span").attr("chose-data");
        if (data2 == "2W" || data2 == "WW") {
            $(".time-02").show()
        } else if (data2 == "MM") {
            $(".time-03").show()
        }
    });
    $(".time-02 li").click(function() {
        $(this).addClass('current').siblings().removeClass('current');
        $(".time-02").hide();
        var choesData = $(this).find('span').text();
        $(".second-select span").html(choesData);
        var index = $(this).index() + 1;
        $(".second-select span").attr('chose-data', index)
    });
    $(".time-03 li").click(function() {
        $(this).addClass('current').siblings().removeClass('current');
        $(".time-03").hide();
        var choesData1 = $(this).find('span').text();
        $(".second-select span").html(choesData1);
        var index = $(this).index() + 1;
        $(".second-select span").attr('chose-data', index)
    });
    $(".first-select").on("click", function() {
        $(".time-01").show();
        $(this).blur()
    });
    App.bind(".btn-sure", "tap", submitModify);

    function showTime() {
        var mydate = new Date();
        var str = "" + mydate.getFullYear();
        str += (mydate.getMonth() + 1);
        str += mydate.getDate();
        $(".notes .input-style").attr("placeholder", "工资宝" + str + "")
    }
});

function submitModify() {
    var myMoney = $(".my-money").val();
    var myTime1 = $(".my-time-1").html();
    var myTime2 = $(".my-time-2").html();
    var data1 = $('.rules i').attr("opt");
    var card = App.getSession(App.selectedCard);
    if (card == null) {
        alertTips('请选择银行卡');
        return
    };
    if (myMoney == '') {
        alertTips('请输入金额');
        return
    };
    if (myTime1 == '请选择') {
        alertTips('请选择充值日期');
        return
    };
    if (myTime2 == '请选择') {
        alertTips('请选择充值日期');
        return
    };
    if (data1 == 1) {
        alertTips('请勾选同意《自动充值服务协议》');
        return
    };
    App.unbind(".btn-sure", "tap");
    var remark = $(".autoTopUpRemark").val();
    var mipCycle = $(".my-time-1").attr("chose-data");
    var mipBuyday = (Array(2).join(0) + $(".my-time-2").attr("chose-data")).slice(-2);
    var autoTopUp = App.getSession(App.autoTopUpModifyInfo);
    // var url = App.projectNm + "/etrading/auto_recharge_modify";
    var url = '/mobile-bff/v1/etrading/auto-recharge-modify';
    var data = JSON.stringify({
        contractno: autoTopUp.contractno,
        bankAcco: card.bankAcco,
        bankNo: card.bankNo,
        mipApkind: '00',
        mipCycle: mipCycle,
        mipBuyday: mipBuyday,
        mipBuyAmt: myMoney,
        mipDesc: remark
    });
    utils.post(url, data, function() {
        App.bind(".btn-sure", "tap", submitModify)
    }, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/setUpSuccess.html");
        // window.location.href = "../common/setPassword.html"
        utils.verifyTradeChain(result.body);
    })
};

function queryCard(successFun) {
	// var url = App.projectNm + "/account/card?date=" + (new Date()).getTime();
    var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=07&tradeScene=13" ;
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

function setSelectedCard(plan) {
    var cards = App.getSession(App.cards);
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

function setCard(card) {
    $(".bank-name").html(card.bankName);
    $(".bank-id").html(card.bankAccoDisplay);
    $("#topup_txt").html(replaceTxt2Html(card.remark));
    $("#bank_icon_div").html('<i class="bank ico_' + card.bankNo + ' no-margin-left"></i>')
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
            alertTips("请先绑定一张银行卡");
            window.location = "../card/manage_card.html"
        }
    });
    if (card != null) {
        showFirstCard(card)
    }
};

function showFirstCard(card) {
    setCard(card);
    App.setSession(App.selectedCard, card)
}