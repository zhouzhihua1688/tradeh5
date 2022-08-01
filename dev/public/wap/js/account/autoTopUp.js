var productId = '';
var productType = '';
$(function() {
    queryCard(function() {
        setSelectedCard();
        initCardList()
    });
    queryCanRechargeProductList();
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

function queryCanRechargeProductList(){
    var url = "/mobile-bff/v1/fund/auto-recharge-can-transfer-product-list?date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined && body.length > 0) {
            productId = body[0].productId;
            productType = body[0].productType;           
        }
    })
}


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
        mipBuyAmt: myMoney,
        cashFrom: 'B',
        productId: productId,
        newProductId: '',
        productType: productType,
        mipDesc: remark,
        shareType: 'A'
    });
    utils.post(url, data, function() {
        App.bind(".btn-sure", "tap", submitCreate)
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
    $("#topup_txt").html(replaceTxt2Html(card.limitRemark));
    $("#bank_icon_div").html('<i class="bank ico_' + card.bankNo + ' no-margin-left"></i>');
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
            alertTips("请先绑定一张银行卡", "确定", function() {
                window.location = "../card/manage_card.html"
            })
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
        arr.push('</li>');
        }
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