new Vue({
    el: '#app',
    data() {

        return {
            programme: utils.getUrlParam('programme'),    // 20211124新增url参数，01：稳健策略只选中第一个，02：稳健策略只选中第二个
            beforeDeadline:'2021年12月31日',
            list636GBk1N: [null, null, null, null],
            fundLists:[
                // {
                //     "productId": "A2029",
                //     "productName": "发车-2028",
                //     "currencyType": "156",
                //     "marketValue": 1877.48,
                //     "profitUpdateTip": null,
                //     "subTitle": "最新持仓涨跌(11.17) 0.00%",
                //     "balanceProfit": 677.48,
                //     "totalProfit": 677.48,
                //     "balanceYield": 0.5646,
                //     "lastProfit": 0,
                //     "yieldDate": "20211117"
                // },
            ]
        };

    },
    created() {
        console.log(utils.getUrlParam('programme'));
        console.log(this.programme);
        this.getGroupUpdateList();
    },
    mounted() {},
    computed: {

    },
    methods: {
        // 获取可升级列表list
        getGroupUpdateList(){
            utils.ajax({
                url: '/assetcenter/v1/view/list/group-update?currencyType=156',
                success: function (result) {
                    console.log(result);
                    // result = {
                    //     "returnCode": 0,
                    //     "returnMsg": "",
                    //     "body": [
                    //       {
                    //         "productId": "A0081",
                    //         "productName": "\"现金+\"尊享组合",
                    //         "currencyType": "156",
                    //         "marketValue": 5164.97,
                    //         "profitUpdateTip": null,
                    //         "subTitle": "最新持仓涨跌(11.17) 0.0016%",
                    //         "balanceProfit": 1074.15,
                    //         "totalProfit": 1312.85,
                    //         "balanceYield": 0.2626,
                    //         "lastProfit": 0.1,
                    //         "yieldDate": "20211117"
                    //       },
                    //       {
                    //         "productId": "A2029",
                    //         "productName": "发车-2028",
                    //         "currencyType": "156",
                    //         "marketValue": 1877.48,
                    //         "profitUpdateTip": null,
                    //         "subTitle": "最新持仓涨跌(11.17) 0.00%",
                    //         "balanceProfit": 677.48,
                    //         "totalProfit": 677.48,
                    //         "balanceYield": 0.5646,
                    //         "lastProfit": 0,
                    //         "yieldDate": "20211117"
                    //       },
                    //       {
                    //         "productId": "A2030",
                    //         "productName": "发车-A2030",
                    //         "currencyType": "156",
                    //         "marketValue": 0.03,
                    //         "profitUpdateTip": null,
                    //         "subTitle": "最新持仓涨跌(11.17) 0.00%",
                    //         "balanceProfit": -50.83,
                    //         "totalProfit": -56.4,
                    //         "balanceYield": -0.9994,
                    //         "lastProfit": 0,
                    //         "yieldDate": "20211117"
                    //       }
                    //     ]
                    // }
                    this.fundLists = result.body;
                }.bind(this)
            })
        },

        // 跳转到单个组合升级页面
        upgradeSingle(item,programme){
            // console.log(item.productId)
            // window.location.href='./singleUpgrade.html?groupId=' + item.productId+'&groupName='+item.productName+'?programme='+programme;
            window.location.href='./singleUpgrade.html'+'?groupId=' + item.productId+'&groupName='+item.productName
                + (programme?('&programme='+programme):'') +'&marketValue='+item.marketValue;
        }
    },
    filters:{
        dateFormat(value){
            if(value){
                value = value.slice(4,6)+'.'+value.slice(6,8)
            }
            return value
        }
    }
})