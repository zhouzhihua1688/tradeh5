var view = new Vue({
    el: '#fund_content',
    data: {
        totalFundValue: '',
        totalHoldProfit: '',
        totalDollarFundValue: '',
        totalDollarHoldProfit: '',
        totalYesterdayProfit: '',
        totalProfit: '',
        ownFund:{
            totalMarketValueStr:'',
            totalBalanceProfitStr:''
        },
        ownFundGroup:{
            totalMarketValueStr:'',
            totalBalanceProfitStr:''
        },
        ownDollarFund: {}
    },
    mounted: function () {
        var _this = this;
        //RMB
        var url = App.projectNm + "/fund/holding_own_fund_asset_with_trade_acco?currencyType=156&r=" + (Math.random()*10000).toFixed(0);
        App.get(url,null,function(result){
            if (result.body != undefined && result.body != null){
                // console.log(result.body);
                _this.totalFundValue = result.body.totalFundValueStr;
                _this.totalHoldProfit = result.body.totalHoldProfitStr;
                _this.totalYesterdayProfit = result.body.totalYesterdayProfit;
                _this.totalProfit = result.body.totalProfit;
                _this.ownFund = result.body.ownFundAsset;
                _this.ownFundGroup = result.body.ownFundGroupAsset;
            }
        });
        //USD
        var url = App.projectNm + "/fund/holding_own_fund_asset_with_trade_acco?currencyType=840&r=" + (Math.random()*10000).toFixed(0);
        App.get(url,null,function(result){
            if (result.body != undefined && result.body != null){
                // console.log(result.body);
                _this.totalDollarFundValue = result.body.totalFundValueStr;
                _this.totalDollarHoldProfit = result.body.totalHoldProfitStr;
                _this.ownDollarFund = result.body.ownFundAsset;
            }
        });

    },
    methods:{
        gotoFundGroupAssetPage : function(groupType) {
            window.location.href = "../fundgroup/my_investment.html?fundGroupType=" + groupType;
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

// 新增加头部按钮
$('#ul li').click(function(){
    //0：RMB、1：USD
    var currencyType = $(this).index();
    if (currencyType == 0){
        $(".content1_1").show();
        $(".content2_2").hide();
    }else if (currencyType == 1){
        $(".content1_1").hide();
        $(".content2_2").show();
    }
    if($(this).hasClass("active")) {
        return;
    }
    $(this).addClass("bg-color1").siblings().removeClass('bg-color1');
    // $(this).parent().next("qiehuan").hide().eq($(this).index()).show();
    $(this).parent().siblings().hide().eq($(this).index()).show()

});


function layerShow() {
    $(".tip2").show();
}

$("#got_it").click(function () {
    $(".tip2").hide();
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