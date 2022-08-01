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
        var data = App.getSession('_selected_tax_extension_plan');
        if (App.isNotNull(data)){
            _this.totalFundValue = data.contractMarketValueDisplay;
            _this.totalHoldProfit = data.contractCurrentHoldProfitDisplay;
            _this.totalYesterdayProfit = data.contractYesterdayProfitDisplay;
            _this.totalProfit = data.contractHistoryHoldProfitDisplay;
            _this.myfunds = data.contractDetailList;
        }
    },
    methods:{
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
    var data = App.getSession('_selected_tax_extension_plan');
    if(App.isNotNull(data)){
        $("title").html(data.contractName);
    }
});
$(".query_all_yl_plan_btn").click(function () {
    window.location.href = "../taxExtension/autoDepositPlanList.html";
});