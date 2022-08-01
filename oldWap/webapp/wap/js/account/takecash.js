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
        App.bind("#next_btn", "tap", confirmTakeBack);
        App.bind("#card_div_btn", "tap", function() {
            $("#takecash_panel").hide();
            $("#selected_card_panel").show();
        });
        App.bind("#takebackType_btn", "tap", function() {
            $("#takecash_panel").hide();
            $("#seleted_type_panel").show();
        });
        var cards = App.getSession(App.cards);
        if (cards == null) {
            App.queryCard(function() {
                setFirstUsingCard();
                initCardList()
            })
        } else {
            setFirstUsingCard();
            initCardList()
        };
        var url = App.projectNm + "/etrading/get_take_back_date?date=" + (new Date()).getTime();
        App.get(url, null, function(result) {
            $("#next_date").html(result.body.info)
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
    $("#card_list_bankNm").html(card.bankName);
    $("#card_list_displayAcco").html(card.bankAccoDisplay);
    App.setSession(App.selectedCard, card);
    selectType(1)
};

function getCard(bankNo, bankAcco) {
    var card = App.getCard(bankNo, bankAcco);
    if (card != null) {
        $("#card_list_bankNm").html(card.bankName);
        $("#card_list_displayAcco").html(card.bankAccoDisplay);
        selectType(App.getSession(App.takeBackType).val);
    }
};

function howToCalc() {
    var card = App.getSession(App.selectedCard);
    var takebackType = App.getSession(App.takeBackType).val;
    var url = "../../common/calculateTakeback.jsp?takebackType=" + takebackType + "&bankNo=" + card.bankNo + "&bankAcco=" + card.bankAcco;
    $("#howToCalc").hammer().bind("tap", function() {
        window.location = url
    });
    $("#takeRule").hammer().bind("tap", function() {
        window.location = "../../common/ruleDescription.html"
    })
};

function confirmTakeBack() {
    var amount = $("#amount").val();
    if (App.isEmpty(amount)) {
        alert("请输入金额");
        return false
    } else if (Number(amount) <= 0) {
        alert("取现金额要不少于0.01元");
        return false
    } else if (Number(App.getSession(App.card_limit_val)) < Number(amount)) {
        alert("超出了本卡可取金额");
        return false
    };
    App.unbind("#next_btn", "tap", confirmTakeBack);
    var card = App.getSession(App.selectedCard);
    if (card != null) {
        var url = App.projectNm + "/etrading/ec_takeback";
        var takebackType = App.getSession(App.takeBackType).val;
        var data = JSON.stringify({
            "realTime": takebackType,
            "bankAcco": card.bankAcco,
            "bankNo": card.bankNo,
            "subAmt": amount
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
        alert("请您先选择银行卡")
    }
};

function inputTradePwd() {
    App.unbind("#confirm", "tap", inputTradePwd);
    var pwd = $("#pwd").val();
    App.tradePwd(pwd, function() {
        App.bind("#confirm", "tap", inputTradePwd)
    }, function(result) {
        App.cancel_alert();
        App.setSession(App.successInfo, result.body.successInfo);
        window.location = "./takecashsuccess.html"
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
        $("#cards_panel").append("<div class='card-list1' data='" + index + "," + card.bankNo + "," + card.bankAcco + "," + card.realLimit + "," + card.bankName + "," + card.bankAccoDisplay + "," + card.limit + "," + card.cashBalance + "'>" + "<div class='left1'>" + "<div class='f16 f-black'>" + card.bankName + "</div>" + "<div class='f11' style='margin-top: 4px'>储蓄卡&nbsp;&nbsp;" + card.bankAccoDisplay + "</div>" + "</div>" + "<div class='right1'><input type='radio' name='card'" + (bool ? "checked='checked'" : "") + "></div>" + "</div>")
    };
    App.bind(".card-list1", "tap", handlerCard)
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
    var card = {
        "bankNo": array[1],
        "bankAcco": array[2],
        "realLimit": array[3],
        "bankName": array[4],
        "bankAccoDisplay": array[5],
        "limit": array[6],
        "cashBalance": array[7]
    };
    App.setSession(App.selectedCard, card);
    $("#card_list_bankNm").html(card.bankName);
    $("#card_list_displayAcco").html(card.bankAccoDisplay);
    setLimitPanel(card, App.getSession(App.takeBackType).val);
    $("#takecash_panel").show();
    $("#selected_card_panel").hide()
};

function selectType(val) {
    var takeType = {};
    if (val == 1) {
        takeType.title = "快速取现";
        takeType.text = "当天无收益";
        takeType.val = "1";
        $("#takeTp_nextDate").html("预计当日到账")
    } else {
        takeType.title = "普通取现";
        takeType.text = "当天有收益";
        takeType.val = "0";
        $("#takeTp_nextDate").html($("#next_date").html())
    };
    App.setSession(App.takeBackType, takeType);
    $("#takeTp_title").html(takeType.title);
    $("#takeTp_text").html(takeType.text);
    $("#takecash_panel").show();
    $("#seleted_type_panel").hide();
    setLimitPanel(App.getSession(App.selectedCard), val)
};

function setLimitPanel(card, takeTp) {
    console.log("limitPanel:", card);
    if (1 == takeTp) {
        $("#limit_text").html(App.numberFormat(card.realLimit));
        App.setSession(App.card_limit_val, Number(card.realLimit))
    } else {
        if (Number(card.limit) < Number(card.cashBalance)) {
            $("#limit_text").html(App.numberFormat(card.limit));
            App.setSession(App.card_limit_val, Number(card.limit))
        } else {
            $("#limit_text").html(App.numberFormat(card.cashBalance));
            App.setSession(App.card_limit_val, Number(card.cashBalance))
        }
    };
    if (Number(card.realLimit) == 0) {
        $("#next_btn").addClass("button-background");
        $("#next_btn").removeClass("button-orange");
        App.unbind("#next_btn", "tap", confirmTakeBack)
    } else {
        $("#next_btn").addClass("button-orange");
        $("#next_btn").removeClass("button-background");
        App.bind("#next_btn", "tap", confirmTakeBack)
    }
}