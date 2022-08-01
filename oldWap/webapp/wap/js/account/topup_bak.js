$(function(){

    function setSelectedCard(){
        setFirstUsingCard();
        // var card = App.getSession(App.selectedCard);
        // if(card == null){
        //     setFirstUsingCard();
        // }else{
        //     setCard(card);
        // }
    }

    function init() {
        App.queryCard(function () {
            setSelectedCard();
            initCardList();
        });

        // var cards = App.getSession(App.cards);
        // if(cards == null){
        //     App.queryCard(function () {
        //         setSelectedCard();
        //         initCardList();
        //     });
        // }else{
        //     setSelectedCard();
        //     initCardList();
        // }
        queryRechargeDate();

        var availPro = App.getSession(App.availableProductList);
        if(availPro == null){
            queryAvailableProduct();
        }else{
            showAvailableProduct(availPro);
        }
    }
    init();

});

/**
 * 确认充值
 */
function confirmRecharge(){
    if(!valide()){
        return;
    }
    var subAmt = $("#rechargeAmount").val();
    if(App.isEmpty(subAmt)){
        alertTips("请输入金额");
        return;
    }else if(Number(subAmt) < 0.01){
        alertTips("充值金额要不少于0.01元");
        return;
    }
    App.unbind("#topup", "tap", confirmRecharge);
    var card = App.getSession(App.selectedCard);
    var selectedFundId = App.getSession(App.selectProFundId);
    var acceptMode = "4";
    if(card != null || card != undefined){
        var url = App.projectNm + "/etrading/ec_recharge";
        var data = JSON.stringify({"bankAcco":card.bankAcco,"bankNo":card.bankNo,"subAmt":subAmt,"baseAccountCode":selectedFundId,"acceptMode":acceptMode});
//        console.log(data);
        App.post(url, data, function(){
            App.bind("#topup", "tap", confirmRecharge);
        },function(result){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            var forwardUrl = App.getUrlParam("forwardUrl");
            if(App.isNotEmpty(forwardUrl)){
                App.setSession(App.serialNo_forword_url, "../account/topupsuccess.html?forwardUrl=" + forwardUrl);
            } else {
                App.setSession(App.serialNo_forword_url, "../account/topupsuccess.html");
            }
            window.location.href = "../common/setPassword.html";
        });
    }else{
        App.bind("#topup", "tap", confirmRecharge);
        alertTips("请您先选择银行卡...");
    }
}

/**
 * 初始显示第一张可以使用的银行卡
 */
function setFirstUsingCard(){
    var card = App.firstUsingCard(function () {
        var cards = App.getSession(App.cards);
        if(cards.length > 0){
            for(var index in cards){
                var card = cards[index];
                if("1" == card.tradeFlag){
                    showFirstCard(card);
                    return;
                }
            }
        }else{
            alertTips("请先添加银行卡再充值", "确定", function(){
                window.location = "../card/manage_card.html";
            });
        }
    });
    if(card != null){
        showFirstCard(card);
    }
}

function showFirstCard(card){
    setCard(card);
    App.setSession(App.selectedCard, card);
}

/**
 * 查询开始计息日期，与到账日期
 */
function queryRechargeDate(){
    var url = App.projectNm + "/etrading/get_ec_recharge?date="+ (new Date()).getTime();
    App.get(url,null,function(result){
        App.setSession(App.revenueDate, result.body.revenueDate);
        App.setSession(App.arrivalDate, result.body.arrivalDate);
        var revnueDate = result.body.revenueDate;
        var arrivalDate = result.body.arrivalDate;
        revnueDate = revnueDate.substring(5, 7) + "月" + revnueDate.substring(8) + "日";
        arrivalDate = arrivalDate.substring(5, 7) + "月" + arrivalDate.substring(8) + "日";
        $("#revenueDate").html(revnueDate);
        $("#arrivalDate").html(arrivalDate);
    });
}

function queryAvailableProduct(){
    var url = App.projectNm + "/etrading/query_list_available_acco_code?date="+ (new Date()).getTime();
    App.get(url,null,function(result){
        var list = result.body.list;
        if(list != null && list != undefined && list.length > 0){
            App.setSession(App.availableProductList, list);
            showAvailableProduct(list);
        }
    });
}

function showAvailableProduct(productList){
    var arr = [];
    if(productList != null && productList != undefined && productList.length > 0){
        //默认选择收益最大的
        /*var maxYield = 0;
        var defaultFundId = "";
        for(var index in productList){
            var pro = productList[index];
            if(pro.yield > maxYield){
                defaultFundId = pro.fundId;
            }
        }*/
        for(var index in productList){
            var pro = productList[index];

            if("000330" != pro.fundId) continue;

            var date = pro.navdt.substring(4,6) + "-" + pro.navdt.substring(6);
            arr.push('<li class="clearfix ' + ("000330" == pro.fundId ? 'current' : '') + '" onclick="selectedProFundId(\'' + pro.fundId + '\')">');
            arr.push('<i></i>');
            arr.push('<div>');
            arr.push('    <p>' + pro.fundName + pro.fundId +'</p>');
            arr.push('    <span class="gray">七日年化(' + date + ')</span><span class="red">' + (pro.yield * 100).toFixed(3) + '%</span>');
            arr.push('</div>');
            arr.push('</li>');
            if(pro.fundId == "000330"){
                setPro(pro);
            }
        }
        $("#rechargeProduct ul").html(arr.join(""));

        $(".section1 ul li").on("click",function () {
            $(this).addClass("current").siblings().removeClass("current");
        });
    }

}

function selectedProFundId(fundId){
    var productList = App.getSession(App.availableProductList);
    if(productList != null && productList != undefined){
        for(var index in productList){
            var pro = productList[index];
            if(pro.fundId == fundId){
                setPro(pro);
            }
        }
    }
}
function setPro(pro){
    var date = pro.navdt.substring(4,6) + "-" + pro.navdt.substring(6);
    App.setSession(App.selectProFundId, pro.fundId);
    $("#proFundNm").html(pro.fundName);
    $("#proFundId").html(pro.fundId);
    $("#proNavStr").html('七日年化(' + date + ')&nbsp;&nbsp;<span class="red">' + (pro.yield * 100).toFixed(3) + '%</span>' );
}

function initCardList(){
    var cards = App.getSession(App.cards);
    var arr = [];
    for(var index in cards){
        var card = cards[index];
//        console.log(card);
        if(card.tradeFlag != "1") continue;

        var signStyle;
        if(card.signWay == "1"){
            signStyle = "shorcut";
        }else if(card.signWay == "2"){
            signStyle = "union";
        }else if(card.signWay == "3"){
            signStyle = "E-bank";
        }else if(card.signWay == "5"){
            continue;
        }

        arr.push('<li class="grid-list-item heigth-130 bottom-border bank-card-option" data="'+ card.bankNo +','+ card.bankAcco +'">');
        arr.push('<div class="row">');
        arr.push('    <div class="lh-130">');
        arr.push('        <i class="bank bank-panel2 ico_' + card.bankNo + ' no-margin-left"></i>');
        arr.push('   </div>');
        arr.push('    <div class="col-1">');
        arr.push('        <div class="list-title">');
        arr.push('            <p class="bank-name">' + card.bankName +  '</p>');
        arr.push('              <p class="bank-id">' + card.bankAccoDisplay + '</p>');
        arr.push('         </div>');
        arr.push('     </div>');
        arr.push('      <div class="lh-130 ' + signStyle +  '">');
        arr.push('       <a class="icon icon-union">银联通</a>');
        arr.push('       <a class="icon icon-E-bank">网银</a>');
        arr.push('       <a class="icon icon-shorcut">快捷</a>');
        arr.push('    </div>');
        arr.push(' </div>');
        arr.push('</li>');
    }
    $("#bankCardList ul").html(arr.join(""));
    App.bind(".bank-card-option", "tap", handlerCard);
}

// 选择充值产品
/*$(".selectRechargeProduct").click(function(){
    $("#rechargeProduct").show();
});*/

// 充值产品,列表
$(".ok").click(function(){
    $("#rechargeProduct").hide();
});

// 清楚input框
$(".clearInput").click(function(){
    $(this).siblings("input").val("").trigger("input");
});

$("#rechargeAmount").on("input", function(){
    if(!!this.value){
        $("#btn-submit").addClass("btn-pass");
        App.unbind("#btn-submit", "tap");
        App.bind("#btn-submit", "tap", confirmRecharge);
    }else{
        $("#btn-submit").removeClass("btn-pass");
        App.unbind("#btn-submit", "tap", confirmRecharge);
    }
});

function handlerCard(){
    var data = $(event.target).attr("data");
    if(data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 4; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break;
        }
    }
    var array = String(data).split(",");
    var bankNo = array[0];
    var bankAcco = array[1];

    var cards = App.getSession(App.cards);
    for(var index in cards){
        var card = cards[index];
        if(card.bankNo == bankNo && card.bankAcco == bankAcco){
            App.setSession(App.selectedCard, card);
            setCard(card);
        }
    }
}

function setCard(card){
    $(".bank_selected").html('<i class="bank bank-panel1 ico_' + card.bankNo + '"></i><span>' + card.bankName + '</span><span class="tail-number">' + card.bankAccoDisplay + '</span>');
    if(card.remark != "" && card.remark != null){
    	$("#topup_txt").html('<p>' + replaceTxt2Html(card.remark) + '</p>');
	}
    if (card.rechargeRemark != "" && card.rechargeRemark != null) {
        $("#rechargeRemark").show();
        $("#rechargeRemark").html('<p class="red">' + card.rechargeRemark +'</p>');
    } else{
        $("#rechargeRemark").hide();
    }
}

/**
 * Created by zeng on 14-11-24.
 */
