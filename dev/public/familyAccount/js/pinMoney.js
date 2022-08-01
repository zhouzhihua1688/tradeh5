var vm = new Vue({
    el: '#app',
    data() {
        return {
            // 36414 【UAT环境】WAP端：零花钱详情页存入按钮样式有误
            saveBtn: true,
            takeBtn: false,
            distSaveBtn: true,
            baseInfoData: {},
            memberInfo: {},
            distInfoData: [],
            plansList: [],
            userInfo: utils.getSession(utils.userInfo),
            memberId: utils.getUrlParam('memberId'),
            teamId: utils.getUrlParam('teamId'),
            arAcct: '',
        }
    },

    mounted() {},
    computed: {},
    watch: {},
    created() {
        this.getInfo()
        this.getDistInfo(`1`)
    },
    methods: {
        getInfo() {
            $.ajax({
                url: `/sfs/v1/accounts/assets/plans/base/detail?memberId=${this.memberId}`,
                contentType: 'application/json',
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.arAcct = result.body.arAcct
                        this.baseInfoData = result.body
                        this.plansList = result.body.plansList
                        this.memberInfo = result.body.memberInfo
                        console.log(this.baseInfoData)
                    } else {
                        this.tipInfo = '网络错误';
                        utils.showTips(result.returnMsg);
                    }
                }.bind(this)
            })
        },
        //跳转存取页面 
        access(operation) {
            // operation == 'take' ? this.saveBtn = false : this.saveBtn = true
            if (operation == 'take' && this.memberId && this.teamId) {
                this.takeBtn = true
                this.saveBtn = false

                window.location.href = `./pocketMoneyOut.html?memberId=${this.memberId}&teamId=${this.teamId}&arAcct=${this.arAcct}`;
            } else if (operation == 'save' && this.memberId && this.teamId) {
                this.saveBtn = true
                window.location.href = `./pocketMoneyPush.html?memberId=${this.memberId}&arAcct=${this.arAcct}&teamId=${this.teamId}`;
            }
        },
        // 存取分布
        distribution(tradeType) {
            tradeType == '1' ? this.distSaveBtn = true : this.distSaveBtn = false
            this.getDistInfo(tradeType)
        },
        getDistInfo(tradeType) {
            $.ajax({
                url: `/sfs/v1/accounts/trade/pocket/distribution?memberId=${this.memberId}&tradeType=${tradeType}`,
                contentType: 'application/json',
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.distInfoData = result.body
                    } else {
                        this.tipInfo = '网络错误';
                        utils.showTips(result.returnMsg);
                    }
                }.bind(this)
            })
        },
        // 邀请家人 跳转
        jumpTo(url) {
            // let url = 'inviteMember.html'
            let toUrl = btoa(url);
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + toUrl;
            } else {
                window.location.href = url;
            }
        },
        // 36392 【UAT环境】WAP端：零花钱详情页面金额展示样式
        /**
         * @params {Number} money 金额
         * @params {Number} decimals 保留小数点后位数
         * @params {String} symbol 前置符号
         */
        formatToFixed(money, decimals = 2) {
            return (
              Math.round((parseFloat(money) + Number.EPSILON) * Math.pow(10, decimals)) /
              Math.pow(10, decimals)
            ).toFixed(decimals);
          },
        formatMoneyNew(money, symbol = "", decimals = 2) {
            money = parseFloat(money)
           return this.formatToFixed(money, decimals).replace(/\B(?=(\d{3})+\b)/g, ",").replace(/^/, `${symbol}`);
        }
    },
    updated() {
      
    }
})