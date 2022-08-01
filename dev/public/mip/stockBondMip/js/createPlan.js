/*
* @Author: mazhuo
* @Date:   2022-07-19 17:35:34
* @Last Modified by:   mazhuo
* @Last Modified time: 2022-08-01 11:06:04
*/
Vue.config.productionTip = false
const vm = new Vue({
    el: '#app',
    data() {
        return {
            mip: {},
            chooseTime:{
                "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
                "2W": ["周一", "周二", "周三", "周四", "周五"],
                "WW": ["周一", "周二", "周三", "周四", "周五"],
                "DD": []
            },
            // 下次扣款日期
            nextMipDate: '',
            // 银行卡列表
            cardList:[],
            // 银行卡支付相关信息
            bankInfo:{
                bankGrpName:'现金宝',
                cashFrm:'V',
                bankNo:'',
                bankAcco:'',
                bankSerialId:''
            },
            //协议列表
            contractList:[],
            //基金产品列表
            fundList:[],
            fundIds:utils.getUrlParam('fundIds'),
            fundContractNoArray:[],
            riskCode:'',
        }
    },

    //vm事件和属性绑定完成
    created() {
        this.getCards();
        this.getUserRiskCode();

        if(utils.getUrlParam('contractNo')){
            document.title = '修改计划'
        }
    },

    //vm完成dom挂载后
    mounted() {
        // 日期选择插件
        var _this = this;
        _this.mip = {
            "mipbuyamt":'',
            "mipcycle": "WW",
            "mipbuyday": "1",
            "mipName":'股债定投宝'+ moment(new Date().getTime()).format('YYYYMMDD'),
            //策略加码
            "avgIncreaseIndex":'',
            //策略减码
            "avgDecreaseIndex":'',
            'contractNo':utils.getUrlParam('contractNo'),
            'strategyId':utils.getUrlParam('strategyId'),
            'agreementId':'52',
            'strategyType':'4',
        };

        $(".selected-deduction-cycle").click(function (event) {
            event.preventDefault();
            $(".choose-time").show();
            $(".appDate").blur();
            setTimeout(() => {
                $(".next-step").hide();
            }, 800);
            
            return false
        });

        $(".choose-time").click(function (event) {
            var li = $(event.target).parents("li");

            if (li.length == 0) {
                $(".choose-time").hide();
                $(".next-step").show();
                return
            }

            
            var time = _this.chooseTime[li.attr("data-choose-time")],
                str = "";
            setMipCycle(li.attr("data-choose-time"));
            li.addClass("on").siblings("li").removeClass("on");
            if (time.length == 0) {
                $(".choose-time").hide();
                $(".appDate").attr("data-time", li.find("div").text());
                $(".appDate").html(li.find("div").text());
                _this.mip.mipcycle = "DD";
                _this.mip.mipbuyday = "";
                $(".next-step").show();
                return;
            } else {
                if (!li.hasClass("on")) {
                    for (var i = 0; i < time.length; i++) {
                        str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
                    }
                    ;
                    $(".choose-time2 ul").html(str);
                    $(".appDate").attr("data-time", li.find("div").text())
                } else {
                    for (var i = 0; i < time.length; i++) {
                        str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
                    }
                    ;
                    $(".choose-time2 ul").html(str);
                   
                    $(".appDate").attr("data-time", li.find("div").text())
                }

                $(".choose-time").hide();
                $(".choose-time2").show()
                
            }
        });
        $(".choose-time2").click(function () {
            var li = $(event.target).parents("li");
            setMipBuyday(li.attr("data-choose-time"));
            if (li.length == 0) {
                return
            }
            ;
            $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
            $(this).hide()
            $(".next-step").show();
        });

        function setMipCycle(mipCycle) {
            _this.mip.mipcycle = mipCycle;
        };

        function setMipBuyday(mipBuyday) {
            _this.mip.mipbuyday = mipBuyday;
        };
    },

    computed: {
       //子计划金额展示
       childMipAmtDisplay(){
            if (this.mip.mipbuyamt.length) {
                return this.mip.mipbuyamt*this.mip.avgDecreaseIndex.toFixed(2)+'-'+(this.mip.mipbuyamt*this.mip.avgIncreaseIndex).toFixed(2)
            }
            return '--'
        },

        mipCycleDisplay(){
            if (this.mip.mipcycle === 'DD') {
                return '每日'                
            }
            else if(this.mip.mipbuyday !== undefined){
                if (this.mip.mipcycle === 'WW' || this.mip.mipcycle === '2W') {
                    return  (this.mip.mipcycle === 'WW'?'每周':'每双周') +  this.chooseTime[this.mip.mipcycle][parseInt(this.mip.mipbuyday)-1]
                }
                else{
                    
                    return '每月' + this.chooseTime[this.mip.mipcycle][parseInt(this.mip.mipbuyday)-1]
                }
            }            
        }
    },

    //处理数据监听
    watch: {
        'mip.mipcycle'(newValue){
            console.log(newValue)
            if ( newValue == 'DD') {
                this.getNextMipDate();
            }
        },

        'mip.mipbuyday'(){
            if (this.mip.mipcycle != 'DD') {
                this.getNextMipDate();
            }
        },
    },
    methods: {
         //子计划名称展示
         childMipNameDisplay(fund){
            return this.mip.mipName + ((fund.fundType == '2'||fund.fundType == '0')?(fund.fundType == '2'?'-债':'-股'):'')
        },

        //计划名称改变
        planNameChanged(e){
            this.mip.mipName = e.target.value
          },
        // 小图标清空计划名称
        clearMipName:function(){
        	this.mip.mipName ='';
        },
        //协议点击
        agreeClick(index){
            this.contractList[index]['ischeck'] = !this.contractList[index]['ischeck']
            this.$set(this.contractList, index, this.contractList[index])
        },

        // 打开支付列表
        selectPayWay() {
            $('#bankCardList').show();
            setTimeout(() => {
                $(".next-step").hide();
            }, 800);
            
            $("#bankCardList").click(function () {
                $("#bankCard").html($(this).find(".bank-name").html()).removeClass("gray");
                $("#bankCardList").hide();
                $(".next-step").show();
            });
        },
         // 选择支付方式
        selectBankCard (item) {
            this.bankInfo = {...this.bankInfo,...{
                bankGrpName:item.bankGrpName,
                cashFrm:item.cashFrom,
                bankNo:item.bankNo,
                bankAcco:item.bankAcco,
                bankSerialId:item.bankCardSerialid,
            }}
        },

        //获取支付方式
        getCards () {
            var tradeScene = '11';  //基金场景
            utils.ajax({
                url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=00&tradeScene=' + tradeScene,
                success: function (result) {
                    console.log(result);
                    if ((result.returnCode === 0) && result.body && result.body.bankInfos && result.body.bankInfos.length > 0) {
                        this.cardList = result.body.bankInfos;
                    } else {
                        this.cardList = [];
                    }

                    if (utils.getUrlParam('contractNo')) {
                        this.getPlanDetail(this.mip.contractNo)
                    }
                    else{
                        this.getStrategyInfo()
            
                    }
                }.bind(this)
            })
        },

        //获取扣款日期
        getNextMipDate(){
            console.log(this.mip)
            if (this.mip.mipcycle.length) {
                    utils.ajax({
                        url:'/mobile-bff/v1/fund/fund-mip-last-period-date?mipCycle='+this.mip.mipcycle+'&mipDt='+this.mip.mipbuyday,
                        success:function(result){
                            var dateString = result.body['nextMipDate']
                            this.nextMipDate = moment(new Date(dateString).getTime()).format('YYYY.MM.DD') 
                        }.bind(this)
                    })
            }
        },

        //获取股债配置策略信息
        getStrategyInfo(){
            utils.ajax({
                //4 表示是新策略
                url:'/ats-ng/v1/agreement/config/query/strategy-info?strategyTypeList=4',
                success:function(result){
                    if (result.returnCode == 0&&
                        result.body instanceof Array&&
                        result.body.length>0) {
                        console.log(result)
                        this.mip.avgDecreaseIndex =result.body[0]['avgDecreaseIndex']
                        this.mip.avgIncreaseIndex =result.body[0]['avgIncreaseIndex']
                        this.getBatchFundBriefInfo();
                    }
                }.bind(this)
            })
        },

        //批量获取基金信息
        getBatchFundBriefInfo(){
            utils.ajax({
                url:'/mobile-bff/v1/fund/batch-fund-info',
                data:{"fundIds":this.fundIds},
                success:function(result){
                    console.log('result'+result.result)
                    if (result.body &&
                        result.body['batchFundInfos'] instanceof Array&&
                        result.body['batchFundInfos'].length>0) {
                        this.fundList = result.body['batchFundInfos']
                        //处理协议
                        let tempContractObj = {}
                        let addDefaultProtocol = false
                        for(let i=0;i<this.fundList.length;i++){
                            let fund =this.fundList[i]
                             
                            for(let j=0;j<fund['fundContractList'].length;j++){
                                let contract = fund['fundContractList'][j]
                                let key = contract['contractCategory'];

                                if (tempContractObj[key] == undefined) {
                                    tempContractObj[key] = {'ischeck':false,'list':[]}
                                }

                                if (contract['contractCategory'].length>0&&
                                !addDefaultProtocol) {
                                    addDefaultProtocol = true
                                    tempContractObj[key]['list'].push({'title':"汇添富基金管理股份有限公司定投业务协议",
                                    "url":"https://www.99fund.com/upload/20181206/201812061544057805659.pdf",
                                    "contractCategory":"0",
                                    })
                                }

                                tempContractObj[key]['list'].push(fund['fundContractList'][j])
                            }
                        }

                        this.contractList = Object.values(tempContractObj)
                    }
                }.bind(this)
            })
        },

        //请求计划详情
        getPlanDetail(contractNo){
            utils.ajax({
                url:'/mobile-bff/v1/ats/stock-bond/detail?contractNo='+contractNo,
                success:function(result){
                    if (result.body['contractNo']) {
                        this.mip.strategyId = result.body['strategyId'];
                        this.mip.contractNo = result.body['contractNo'];
                        this.mip.strategyType = result.body['strategyType'];
                        this.mip.mipcycle = result.body['cycle'];
                        this.mip.mipbuyday = result.body['payDate'];
                        this.mip.mipbuyamt = String(result.body['payAmt']);
                        this.mip.mipName = result.body['contractDesc'];
                        this.mip.agreementId = result.body['agreementId'];
                        
                        for (bankCard of this.cardList){
                            if (bankCard.bankCardSerialid === result.body.bankSerialId) {
                                this.bankInfo = bankCard;
                                this.bankInfo.cashFrm =bankCard.cashFrom
                                this.bankInfo.bankSerialId = bankCard.bankCardSerialid
                                break;
                            }
                        }
                        for(fund of result.body.childContractInfoList){
                            this.fundIds = this.fundIds+(this.fundIds.length?',':'')+fund.productId
                            this.fundContractNoArray.push(fund.contractNo)
                            console.log('this.fundIds' + this.fundIds)

                        }

                        console.log('this.fundIds' + this.fundIds)
                        this.getStrategyInfo()
                    }
                }.bind(this)
            })
        },

        //获取用户风险code
        getUserRiskCode(){
            utils.ajax({
                url: "/mobile-bff/v1/common/check-union-risk-level",                
                success: function (result) {
                   this.riskCode = result.body.code 
                }.bind(this)
            });
        },
        
        //协议留痕
        agreementsLeaveMark(){
            let reminderType = '2';
            if (this.riskCode === '9994') {
                reminderType ='1'
            }
            else if(this.riskCode === '9992'){
                reminderType ='0'
            }

            let agreementIds = ''

            for(index in this.contractList)
            {
                for(contract of this.contractList[index].list){
                    agreementIds = agreementIds+agreementIds.length?',':''+contract.contractCategory.length?contract.contractCategory:''
                }
            }
            
            utils.ajax({
                url: "/mobile-bff/v1/common/customer-risk-leave-mark",
                type:'POST',
                data:{'confirmStatus':'1','agreementStatus':'1','reminderType':reminderType,'agreementIds':agreementIds},
                success: function (result) {
                   this.riskCode = result.body.code 
                }.bind(this)
            });
        },

        //计划操作
        planOpreate(){
            //金额校验
            if (!this.mip.mipbuyamt.length) {
                utils.showTips("请输入购买金额")
                return
            }

            //计划名称校验
            if (!this.mip.mipName.length) {
                utils.showTips("请输入计划名称")
                return
            }

            //协议勾选校验
            for (let index = 0; index < this.contractList.length; index++) {
                if (!this.contractList[index].ischeck) {
                    utils.showTips("请勾选协议")
                    return
                }
            }
            // this.contractList.forEach(element => {
            //     console.log('element'+element.ischeck)
            //     if (!element.ischeck) {
            //         utils.showTips("请勾选协议")
            //         return
            //     }
            // });

            let fundlistParaArray = []

            //for (index in this.fundList)
            for(let i=0;i<this.fundList.length;i++){
                let fund = this.fundList[i]
                console.log('fund123'+fund)
                fundlistParaArray.push({'productId':fund.fundId,
                    'productType':((fund.fundType == '2'||fund.fundType == '0')?(fund.fundType == '2'?'02':'01'):''),
                    'shareType':'A',
                    'childContractDesc':this.mip.mipName + ((fund.fundType == '2'||fund.fundType == '0')?(fund.fundType == '2'?'-债':'-股'):''),
                    'childContractNo':this.fundContractNoArray[i],
                })
            }
            console.log('this.mip.contractNo'+this.mip.contractNo)
            utils.ajax({
                url:!this.mip.contractNo.length?'/mobile-bff/v1/ats/stock-bond/apply':'/mobile-bff/v1/ats/stock-bond/modify',
                type:'POST',
                data:{
                       'strategyId':this.mip.strategyId,
                       'contractNo':this.mip.contractNo,
                       'strategyType':this.mip.strategyType,
                       'cycle':this.mip.mipcycle,
                       'payDate':this.mip.mipbuyday,
                       'payAmt':this.mip.mipbuyamt,
                       'payType':this.bankInfo.cashFrm,
                       'bankSerialId':this.bankInfo.bankSerialId,                       
                       'fundList':fundlistParaArray,
                       'contractDesc':this.mip.mipName,
                       'isSupportStrategy':'1',
                       "agreementId":this.mip.agreementId,
                       "acceptMode":"M",
                    },
                success:function(result){
                    this.agreementsLeaveMark()
                    //调用app startTradeVerify方法
                    if(isApp()) {
                        if (isAndroidApp()) {
                            
                            handler.startTradeVerify(JSON.stringify(result.body));
                        }
                        else if(isIosApp()){
                            window.webkit.messageHandlers.startTradeVerify.postMessage(result.body);
                        }
                    }

                }.bind(this)
            })
        },
    }
})

//结束安全验证
function finishTradeVerify(jsonString){
    //跳转成功页 同一个路径的页面无需前面的路径
    const itemUrl ="tradeResult.html?type="+(utils.getUrlParam('contractNo')?'1':'0');   //跳转到投顾资产页面

    // if(isApp()){
    //     window.location.href = 'htffundxjb://action?type=url&link='+btoa((utils.isProdEnv()?'https://www.99fund.com':'http://appuat.99fund.com.cn:7081')+'/tradeh5/newWap/mip/stockBondMip/'+itemUrl);
    // }else{
        window.location.href = itemUrl;
    // }
}