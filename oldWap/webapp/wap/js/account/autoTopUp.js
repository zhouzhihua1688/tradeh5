$(function() {
    var cards = App.getSession(App.cards);
    if (cards == null) {
        App.queryCard(function() {
            setSelectedCard();
            initCardList()
        })
    } else {
        setSelectedCard();
        initCardList()
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
    App.bind(".btn-sure", "tap", submitCreate);
    showTime();

    function showTime() {
        var mydate = new Date();
        var str = "" + mydate.getFullYear();
        str += (mydate.getMonth() + 1);
        str += mydate.getDate();
        $(".notes .input-style").attr("placeholder", "工资宝" + str + "")
    }
});

function submitCreate() {
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
    var url = App.projectNm + "/etrading/auto_recharge_create";
    var data = JSON.stringify({
        bankAcco: card.bankAcco,
        bankNo: card.bankNo,
        mipApkind: '00',
        mipCycle: mipCycle,
        mipBuyday: mipBuyday,
        mipBuyAmt: myMoney,
        mipDesc: remark
    });
    App.post(url, data, function() {
        App.bind(".btn-sure", "tap", submitCreate)
    }, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../account/setUpSuccess.html");
        window.location.href = "../common/setPassword.html"
    })
};

function setSelectedCard() {
    var card = App.getSession(App.selectedCard);
    if (card == null) {
        setFirstUsingCard()
    } else {
        setCard(card)
    }
};

function setCard(card) {
    $(".bank_name_selected").html(card.bankName);
    $(".bank_id_selected").html(card.bankAccoDisplay);
    $("#topup_txt").html(replaceTxt2Html(card.remark));
    $("#bank_icon_div").html('<i class="bank ico_' + card.bankNo + ' no-margin-left"></i>');
};

function setFirstUsingCard() {
    var card = App.firstUsingCard(function() {
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
            alertTips("请先绑定一张银行卡", "确定", function() {
                window.location = "../card/manage_card.html"
            })
        }
    });
    if (card != null) {
        showFirstCard(card)
    }
};

function showFirstCard(card) {
    setCard(card);
    App.setSession(App.selectedCard, card)
};

function initCardList() {
    var cards = App.getSession(App.cards);
    var arr = [];
    for (var index in cards) {
        var card = cards[index];
        if (card.tradeFlag != "1") continue;
        var signStyle;
        var signWay;
        if (card.signWay == "1") {
            signStyle = "icon-shorcut";
            signWay = "快捷"
        } else if (card.signWay == "2") {
            signStyle = "icon-union";
            signWay = "银联通"
        } else if (card.signWay == "3") {
            signStyle = "icon-E-bank";
            signWay = "网银"
        } else if (card.signWay == "5") {
            continue
        };
        arr.push('<li class="grid-list-item heigth-130 bottom-border bank-card-option" data="' + card.bankNo + ',' + card.bankAcco + '">');
        arr.push('<div class="row">');
        arr.push('    <div class="lh-130">');
        arr.push('        <i class="bank ico_' + card.bankNo + ' no-margin-left"></i>');
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
        arr.push('</li>')
    };
    $("#bankCardList ul").html(arr.join(""));
    App.bind(".bank-card-option", "tap", handlerCard)
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
    var bankNo = array[0];
    var bankAcco = array[1];
    var cards = App.getSession(App.cards);
    for (var index in cards) {
        var card = cards[index];
        if (card.bankNo == bankNo && card.bankAcco == bankAcco) {
            App.setSession(App.selectedCard, card);
            setCard(card)
        }
    }
}