var view = new Vue({
    el: '#fund_content',
    data: {
        totalFundValue: '',
        totalHoldProfit: '',
        totalDollarFundValue: '',
        totalDollarHoldProfit: '',
        totalYesterdayProfit: '',
        totalProfit: '',
        myfunds:[],
        ownPlans:[]
    },
    mounted: function () {
        var _this = this;
        isOpenAccount(_this);
    },
    methods:{
        gotoPlanDetails : function(item) {
            App.setSession('_selected_tax_extension_plan', item);
            window.location.href = './my_tax_extension_plan_detail.html?cNo=' + item.contractNo;
        },
        gotoFundDetailPage : function (item) {
            if(item != undefined && item != null){
                App.setSession(App.selectedFund, item);
                if(item.fund.fundTp === '1') {
                    if(App.isEmpty(item.seatNo) || item.seatNo == "247"){
                        window.location.href = "./fund_holding_currency_detail.html?fundId=" + item.fund.fundId;
                    } else {
                        window.location.href = "./fund_holding_agent_currency_detail.html?fundId=" + item.fund.fundId;
                    }
                }else {
                    if(App.isEmpty(item.seatNo) || item.seatNo == "247"){
                        window.location.href = "./fund_holding_detail.html?fundId=" + item.fund.fundId;
                    } else {
                        window.location.href = "./fund_holding_agent_detail.html?fundId=" + item.fund.fundId;
                    }
                }
            }
        }
    }
});
$(function () {

    intervalObj1 = setInterval(loadLayout1, 500);
    intervalObj2 = setInterval(loadLayout2, 500);

    App.getDoNotProcessResult("/ags/v1/funds/query-info?tradeType=0&fundId=" + App.getUrlParam("fundId"), null, function (result) {
        $(".available-amount-panel").hide();
        $("#available-amount").html('0.00');
        $("#available-amount").attr("data-available-amt", 0);
        // console.log(result);
        if(result.returnCode == 0){
            if (result.body != undefined && result.body != null) {
                var info = result.body;
                availableAmountTips = info.availableAmountTips;
                if(App.isNotEmpty(info.availableAmount)){
                    $("#available-amount").html(App.formatMoney(info.availableAmount));
                    $("#available-amount").attr("data-available-amt", info.availableAmount);
                }
            }
            $(".available-amount-panel").show();
        }
    });

});
var availableAmountTips = '';
var intervalObj1,intervalObj2;
function loadLayout1() {
    if($('#panel').length > 0){
        clearInterval(intervalObj1);
        var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wap_tax_index_open&r=" + (Math.random()*10000).toFixed(0);
        App.get(url,null,function(result){
            // console.log("layout:", result);
            if (result.body.layout != undefined && result.body.layout != null){
                var layoutList = result.body.layout;
                var isAddLine = false;
                var size = layoutList.length;
                for (var index in layoutList) {
                    if (index == size - 1) {
                        isAddLine = false;
                    }
                    Layout.drawingLayout('#panel', layoutList[index], index, isAddLine);
                }
            }
        });
    }
}
function loadLayout2() {
    if($('#panel_1').length > 0){
        clearInterval(intervalObj2);
        var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wap_tax_idx_advice&r=" + (Math.random()*10000).toFixed(0);
        App.get(url,null,function(result){
            // console.log("layout:", result);
            if (result.body.layout != undefined && result.body.layout != null){
                var layoutList = result.body.layout;
                var isAddLine = false;
                var size = layoutList.length;
                for (var index in layoutList) {
                    if (index == size - 1) {
                        isAddLine = false;
                    }
                    Layout.drawingLayout('#panel_1', layoutList[index], index, isAddLine);
                }
            }
        });
    }
}

function isOpenAccount(data) {

    //查询是否开户
    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var isOpenPITD = result.body.isOpenPITD;
            if(isOpenPITD == 'N'){
                window.location.href = '../taxExtension/taxExtensionList.html';
            } else {
                //产品
                var url = App.projectNm + "/fund/tax_pension_fund_holding_list_asset?currencyType=156&r=" + (Math.random()*10000).toFixed(0);
                App.get(url,null,function(result){
                    if (result.body != undefined && result.body != null){
                        // console.log(result.body);
                        data.totalFundValue = result.body.totalTaxPensionValueDisplay;
                        data.totalHoldProfit = result.body.totalTaxPensionCurrentHoldProfitDisplay;
                        data.totalYesterdayProfit = result.body.totalTaxPensionYesterdayProfitDisplay;
                        data.totalProfit = result.body.totalTaxPensionHistoryProfitDisplay;
                        data.myfunds = result.body.directInvestHoldAssetInfoList;
                        data.ownPlans = result.body.contractHoldAssetInfoList;
                    }
                });
            }
        }
    });
}

function layerShow() {
    $(".tip2").show();
}

$("#got_it").click(function () {
    $(".tip2").hide();
});

$('#payable-amt-btn-problem').click(function () {
    alertTips('<div style="line-height: 1.5;">'+ availableAmountTips +'</div>');
    return;
});

// 更多
$('.upfold').click(function(){
    $(this).prev().toggleClass('ellipsis');
    $(this).toggleClass('pack-up');
});

$('.tab3 li').click(function(){
    if($(this).hasClass("active")) {
        return;
    }
    $(this).addClass("active").siblings().removeClass('active');
    // $(this).parent().next("qiehuan").hide().eq($(this).index()).show();
    $(this).parent().siblings().hide().eq($(this).index()).show()

});
$(".second").click(function(){
    window.location.href="asset.html";
});
$(".open_yl_plan_btn").click(function () {
    window.location.href = "../taxExtension/autodepositIndex.html";
});