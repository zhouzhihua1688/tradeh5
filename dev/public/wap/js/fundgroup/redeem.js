$(function () {
    requestGroupFundDetail();
    queryFundGroupList();
    var upperLimit = '';
    $.each(redeemList, function (index, el) {
        upperLimit += '<li data-val=' + el.desc + '>' + el.desc + '</li>'
    });
    $('.upper-limit').append(upperLimit);
    $(".upper-limit").mobiscroll().treelist({
        theme: "ios",
        lang: "zh",
        group: true,
        display: 'bottom',
        onSet:function(val, inst) {
            if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                redeemList.forEach(function (item) {
                    if(val.valueText == item.desc){
                        largeFlg = item.code;
                    }
                });
            }
        }
    });
    $(".upper-limit-p input").val("放弃超额");
});

var redeemList = [{"code":"0", "desc": "放弃超额"}, {"code":"1", "desc": "继续赎回"}];

var minReserveAmount = 0;
var minRedeemAmount = 0;
var holdRedeemAsset = 0;
var supportRedeemType = "0";
var balanceSerialNo = '';
var redeemWay = 'MF';
var redeemWay2 = 'MF';
var recommendChangeType = false;
var submitIsShowTips = "0";
var redeemByRatioDateTimeTip = "";
var redeemMoneyFirstDateTimeTip = "";
var largeFlg = "0";

function requestGroupFundDetail(){
    var groupId = App.getUrlParam("groupId");
    App.get("/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId, null, function(resultStr){

        var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
        if(result.body != undefined && result.body != null){
            var detailInfo = result.body;
            if(detailInfo != undefined && detailInfo != ""){
                $(".fund-group-name").html(detailInfo.groupname);
            }
        }
    });
}

function queryFundGroupList() {
    var fundGroupType = App.getUrlParam("groupType");
    var url = App.projectNm + "/adviser/holding_fund_group_list?fundGroupType="+ fundGroupType +"&r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var body = result.body;
            if(body != undefined && body != null) {
                var holdFundGroups = result.body.holdFundGroups;
                if(holdFundGroups != undefined && holdFundGroups != null && holdFundGroups.length > 0) {
                    holdFundGroups.forEach(function (item) {
                        if(item.groupid == App.getUrlParam("groupId")){
                            balanceSerialNo = item.balanceSerialNo;
                        }
                    });
                    if(App.isNotEmpty(balanceSerialNo)){
                        queryHoldAsset(balanceSerialNo);
                    }
                }
            }
        }
    });
}

function queryHoldAsset(balanceSerialNo){
    var groupId = App.getUrlParam("groupId");
    App.get("/mobile-bff/v1/fund-group/hold/detailInfo?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo, null, function(data){
        if(data.body != undefined && data.body != null){

            holdRedeemAsset = data.body.holdRedeemAsset;
            minReserveAmount = data.body.minReserveAmount;
            minRedeemAmount = Math.ceil(Number(data.body.minRedeemAmount) * 100) / 100;
            supportRedeemType = data.body.supportRedeemType;
            $(".available-redeem-amt").html(App.formatMoney(holdRedeemAsset, 2));
            $(".redeem-amt").attr("placeholder", "最低可赎"+ App.formatMoney(minRedeemAmount) +"元");
            $(".fee-tip-content").html(data.body.feeTip);
            if(supportRedeemType == '1'){
                $(".redeem-way-txt").html("赎回方式");
                $(".redeem-way").show();
            } else {
                $(".redeem-way-txt").html("");
                $(".redeem-way").hide();
                getGroupTradeInfo();
            }
        }
    });
}
function getGroupTradeInfo(){
    var groupId = App.getUrlParam("groupId");
    App.get(App.projectNm + "/adviser/get_group_trade_info?groupId=" + groupId + "&tradeTp=CR", null, function(data){
        if(data.body != undefined && data.body != null){
            $(".redeem-remark-2").html(data.body.remark);
        }
    });
}

function queryRedeemFeeTips(){
    var groupId = App.getUrlParam("groupId");
    var redeemAmt = $(".redeem-amt").val();
    if(Number(redeemAmt) > Number(holdRedeemAsset)){
        //alertTips("赎回金额不能大于可赎回金额");
        return;
    }
    if(App.isNotEmpty(groupId) && Number(redeemAmt) > 0 && supportRedeemType == '1'){
        var url = "/mobile-bff/v1/fund-group/redeem-fee-tips?groupId=" + groupId
            + "&amount=" + redeemAmt
            + "&balanceSerialNo=" + balanceSerialNo
            + "&redeemStrategy=" + redeemWay
            + "&tradeAcco="
            + "&branchNo=";
        App.get(url, null, function(data){
            if(data.body != undefined && data.body != null){
                recommendChangeType = data.body.recommendChangeType;
                redeemByRatioDateTimeTip = data.body.redeemByRatioDatetimeTip;
                redeemMoneyFirstDateTimeTip = data.body.redeemMoneyFirstDatetimeTip;
                if(redeemWay == 'BR'){
                    $(".redeem-remark-1").html(data.body.redeemByRatioFeeTip);
                    $(".redeem-remark-2").html(data.body.redeemByRatioDatetimeTip);
                } else {
                    $(".redeem-remark-1").html(data.body.redeemMoneyFirstFeeTip);
                    $(".redeem-remark-2").html(data.body.redeemMoneyFirstDatetimeTip);
                }
                $(".tips-1-content").html(data.body.recommendChangeTypeAllRedeemTip);
                $(".fee-1").html(data.body.redeemByRatioFee);
                $(".fee-2").html(data.body.redeemMoneyFirstFee);
                if(Number(data.body.redeemMoneyFirstFee) >= Number(data.body.redeemByRatioFee)){
                    submitIsShowTips = "1";
                } else if(Number(data.body.redeemMoneyFirstFee) < Number(data.body.redeemByRatioFee)){
                    submitIsShowTips = "2";
                }
				$("#btn_ok").show();
				$("#btn_no").hide();
                if(redeemWay == "BR"){
                    $(".redeem-remark-3").html(redeemByRatioDateTimeTip);
                } else {
                    $(".redeem-remark-3").html(redeemMoneyFirstDateTimeTip);
                }
            }
        });
    }
}

function submitCheck() {
    var redeemAmt = $(".redeem-amt").val();
    if(App.isEmpty(balanceSerialNo)){
        alertTips("暂无本产品资产");
        return;
    }
    if(App.isEmpty(redeemAmt)){
        alertTips("请先填写赎回金额");
        return;
    }
    if($(".checkbox").hasClass("active")){
        if(Number(redeemAmt) > Number(holdRedeemAsset)){
            alertTips("赎回金额不能大于可赎回金额");
			$("#btn_ok").hide();
			$("#btn_no").show();
            return;
        }
        if(Number(redeemAmt) < Number(minRedeemAmount)){
            alertTips("赎回金额不可小于最小赎回金额");
			$("#btn_ok").hide();
			$("#btn_no").show();
            return;
        }
        if(Number(holdRedeemAsset) - Number(redeemAmt) < Number(minReserveAmount) && Number(holdRedeemAsset) - Number(redeemAmt) > 0){
            alertTips("赎回后您持有的金额小于最低持仓金额，建议全部赎回");
			$("#btn_ok").hide();
			$("#btn_no").show();
            return;
        }

        if(recommendChangeType){

            if(submitIsShowTips == "1"){
                $(".tip1").show();
                return;
            } else if(redeemWay == "BR" && Number(redeemAmt) != Number(holdRedeemAsset) && submitIsShowTips == "2"){
                redeemWay2 = redeemWay;
                $(".Bomb-list li").css('background-color', '#f4fcff');
                $(".Bomb-list li").eq(0).css('background-color', '#ffefef');
                $(".Bomb-list li").eq(0).find(".radio")
                    .addClass('active')
                    .attr('src', '../images/fundgroup/opt_radio.png')
                    .parents('li')
                    .siblings()
                    .find('img')
                    .removeClass('active')
                    .attr('src', '../images/fundgroup/radio.png');
                $(".redeem-remark-3").html(redeemByRatioDateTimeTip);
                $(".tip2").show();
                return;
            }
        }
        submit();

    } else {
        alertTips("请先同意《汇添富组合产品服务协议》");
        return;
    }
}

function submit(){
    var redeemAmt = $(".redeem-amt").val();
    var data = {
        "groupId":App.getUrlParam("groupId"),
        "amt":redeemAmt,
        "largeFlg":largeFlg,
        "currencyTp":"156",
        "balanceSerialNo":balanceSerialNo,
        "redeemStrategy":"MF",
        "promptCash":false
    };
    if(holdRedeemAsset == redeemAmt){
        data.allBalanceRedeem = "1";
    } else {
        data.allBalanceRedeem = "0";
    }
    App.post("/mobile-bff/v1/fund-group/fundgroup-redeem", JSON.stringify(data), null,function (result) {
        if(result.body != undefined && result.body != null){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
		    var forwardUrl = App.getUrlParam("forwardUrl");
		    var newForwardUrl = '';
		    if(App.isNotEmpty(forwardUrl)){
		    	newForwardUrl = "?forwardUrl="+forwardUrl;
		    }
            App.setSession(App.serialNo_forword_url, "../fundgroup/fund_group_redeem_successfully.html"+newForwardUrl);

            window.location.href = "../common/setPassword.html";
        }
    });
}

$(".continue-btn").click(function () {
    redeemWay = redeemWay2;
    submit();
    $(".Bomb").hide();
});

$("#btn_ok").click(function () {
    submitCheck();
});
$(".query-fee-tip-btn").click(function () {
    queryRedeemFeeTips();
});
function change(e) {
	queryRedeemFeeTips();
};

$(".all-redeem-btn").click(function () {
    $(".redeem-amt").val(holdRedeemAsset);
    queryRedeemFeeTips();
});

$('.border-bottom-radio').on('click', function (ele) {//单选
    if($(this).index() == 0){
        redeemWay = 'BR';
    } else {
        redeemWay = 'MF';
    }
    redeemWay2 = redeemWay;
    queryRedeemFeeTips();

    if (!$(this).find(".radio").hasClass('active')) {
        $(this).find(".radio")
            .addClass('active')
            .attr('src', '../images/fundgroup/opt_radio.png')
            .parents('li')
            .siblings()
            .find('img')
            .removeClass('active')
            .attr('src', '../images/fundgroup/radio.png');
    }
});

$('.border-bottom-radio-1').on('click', function (ele) {//单选
    $(".Bomb-list li").css('background-color', '#f4fcff');
    $(this).css('background-color', '#ffefef');
    if($(this).index() == 0){
        redeemWay2 = 'BR';
        $(".redeem-remark-3").html(redeemByRatioDateTimeTip);
    } else {
        redeemWay2 = 'MF';
        $(".redeem-remark-3").html(redeemMoneyFirstDateTimeTip);
    }

    if (!$(this).find(".radio").hasClass('active')) {
        $(this).find(".radio")
            .addClass('active')
            .attr('src', '../images/fundgroup/opt_radio.png')
            .parents('li')
            .siblings()
            .find('img')
            .removeClass('active')
            .attr('src', '../images/fundgroup/radio.png');
    }
});

$('.checkbox').on('click', function (ele) {//复选
    if (!$(this).hasClass('active')) {
        $(this)
            .toggleClass('active')
            .attr('src', '../images/fundgroup/opt_checkbox.png')
    } else {
        $(this)
            .toggleClass('active')
            .attr('src', '../images/fundgroup/checkbox.png')
    }
});
$(".fee-tip-btn").click(function () {
    $(".fee-tip").show();
});
$(".fee-tip-ok").click(function () {
    $(".Bomb").hide();
});
$(".Bomb-cancel").click(function () {
    redeemWay2 = redeemWay;
    $(".Bomb").hide();
});