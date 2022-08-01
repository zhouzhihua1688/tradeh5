var vm =new Vue({
    el: '#app',
    data() {
        return {
            groupId: utils.getUrlParam('groupId'),
            balanceSerialNo: utils.getUrlParam('balanceSerialNo'),  //资产流水号
            groupName: '',
            investType: '',     // 一般型："G"; 管理型："M"
            holdGroupInfo: {},  // 持有信息，从持有详情接口中获取
            arAcct: '',         // 合约账户，从持有详情接口中获取
            tradeAcco: '',         // 交易账号，从持有详情接口中获取
            holdRedeemAsset: '',    // 可转出金融，从持有详情接口中获取
            minRedeemAmount: '',    // 最低可转出金融，从持有详情接口中获取
            minReserveAmount: '',    // 最低持有金额，从持有详情接口中获取

            largeFlg: '0',          // 放弃超额0、继续转出1

            estimateResultBody: {}, // 赎回费用提示接口，返回内容，下一步按钮需要check
            employeeLimitFlag: true,        //  员工持基检查结果，false为不通过，存在不可用员工持基份额，默认为true
            employeeLimitResultBody: {},    //  员工持基检查结果，不通过时的返回值，最后一步接口需要使用
            
            // holdGroupInfo.holdRedeemAsset：可赎回额度
            // holdGroupInfo.holdingAsset：总市值（持有+在途）
            // holdGroupInfo.minReserveAmount: 最低保留额度
            // holdGroupInfo.minRedeemAmount:最低赎回额度

            remark: '',     // 基金组合赎回提示文案，输入金额框下部


            inputValue:'', //输入的值
            chinese:'',    //金额转显示中文
            billie:[       //比例
               {
                a:1,
                value:'1/3'
               },
               {
                a:2,
                value:'1/2'
               },
               {
                a:'ALL',
                value:'全部'
               },

            ],
            number:'',   //切换样式索引
            giveUp:'放弃超额',     //如遇上限
        };

    },
    created() {
        // 获取组合详情
        this.getFundGroupDetail(this.groupId);
        // 获取组合持有详情
        this.getFundGroupHoldDetail(this.groupId, this.balanceSerialNo);
       
    },
    mounted() {
    },
    computed: {
        inputMoneyPlaceHolder(){
            // if(this.holdRedeemAsset){
            //     return '最多可转出' + this.holdRedeemAsset + '元'
            // } else {
            //     return '';
            // }
            return '';
        }
    },
    watch: {
        inputValue: function (newVal, oldVal) {
            console.log('inputMoney newVal=', newVal);
            // console.log('inputMoney oldVal=', oldVal);
            // 赎回费用提示接口
            this.getFeeTipsEstimate();
        }
    },
    methods: {
        // 获取组合详情
        getFundGroupDetail(){
            let data = {
                groupId: this.groupId,
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/detailInfo',
                type: 'GET',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.groupName = result.body.groupname;
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        // 获取组合持有详情
        getFundGroupHoldDetail(){
            let data = {
                groupId: this.groupId,
                balanceSerialNo: this.balanceSerialNo,
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/hold/detailInfo',
                type: 'GET',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.arAcct = result.body.arAcct;
                        this.holdGroupInfo = result.body.holdGroupInfo;
                        this.holdRedeemAsset = result.body.holdRedeemAsset;
                        this.minRedeemAmount = this.minRedeemAmount;
                        this.minReserveAmount = this.minReserveAmount;
                        this.getTradeInfoRemark();  // 获取基金组合赎回提示文案
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },

        // 获取基金组合赎回提示文案
        // groupId，
        // tradeTp传"ICR",
        // fundGroupType传空
        // balanceSerialNo资产流水号，
        // isInvestment传Y，
        // arAcct传持有详情接口arAcct字段
        // 返回字段remark
        getTradeInfoRemark(){
            let data = {
                groupId: this.groupId,
                balanceSerialNo: this.balanceSerialNo,
                isInvestment: 'Y',
                tradeTp: 'ICR',
                arAcct: this.arAcct,
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/trade-info',
                type: 'GET',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.remark = result.body.remark;
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        // 赎回费用估算提示接口
        getFeeTipsEstimate(){
//             mobile-bff/v1/fund-group/redeem-fee-tips/estimate	"赎回费用提示接口
// 每次输入金额变动时调用该接口"	"amount：输入金额
// groupId，balanceSerialNo，
// accepteMode：固定传""M""，
// cashFrom：固定传""V"",
// isInvestment:固定传""Y"",
// arAcct:传持有详情接口arAcct字段"
            let data = {
                groupId: this.groupId,
                balanceSerialNo: this.balanceSerialNo,
                amount: this.inputValue,
                accepteMode: 'M',
                cashFrom: 'V',
                arAcct: this.arAcct,
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/redeem-fee-tips/estimate',
                type: 'POST',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.estimateResultBody = result.body;
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        // 组合赎回预校验接口
        getPreCommitData(){
            // 输入金额简单check
            if(!this.inputValue){
                return utils.showTips('金额不能为空');
            }
            if(Number(this.inputValue) > this.holdRedeemAsset){
                return utils.showTips('赎回金额必须小于可用金额');
            }
            if(Number(this.inputValue) < this.minRedeemAmount){
                return utils.showTips('赎回金额必须大于最小转出金额');
            }
            if(Number(this.holdRedeemAsset) - Number(this.inputValue) < this.minReserveAmount){
                return utils.showTips('赎回后您持有的金额小于最低持有金额，建议全部赎回。');
            }
            // mobile-bff/v1/fund-group/pre-employee-base-redeem	
            // 组合赎回预校验接口	
            // "subAmt：赎回金额，
            // allBalanceRedeem：是否全部赎回，
            // groupId，accptMd，balanceSerialNo，
            // type：固定传""R"",
            // isInvestment传""Y"",
            // arAcct"
            let data = {
                groupId: this.groupId,
                balanceSerialNo: this.balanceSerialNo,
                subAmt: this.inputValue,
                allBalanceRedeem: (this.inputValue==this.holdRedeemAsset?1:0),
                accptMd: 'M',
                type: 'R',
                isInvestment: 'Y',
                arAcct: this.arAcct,
                branchCode: "247",      // 必填！已添加到utils.js中
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/pre-employee-base-redeem',
                type: 'POST',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        // result (boolean, optional): 员工持基检查结果，false为不通过，存在不可用员工持基份额 ,
                        if(result.body && result.body.result===false){
                            this.employeeLimitFlag = result.body.result;
                            this.employeeLimitResultBody = result.body;
                        }
                        // fundStatusValidateTips不为空的情况，显示确认框
                        if(result.body && result.body.fundStatusValidateTips){
                            utils.showTips({
                                title: '',
                                content: result.body.fundStatusValidateTips,
                                showCancel: true, //是否显示取消按钮，默认false
                                confirmText: '继续转出', //确认按钮文字，默认确定
                                complete: function() { //需使用bind()
                                    this.checkEmployeeLimit();
                                }.bind(this)
                            });
                        } else {
                            this.checkEmployeeLimit();
                        }
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        // 投顾转出接口
        redeemFundGroup(){
//             mobile-bff/v1/fund-group/fundgroup-redeem	
// 投顾转出接口	
// "groupId，
// largeFlg：放弃超额0、继续转出1
// currencyTp：传156
// balanceSerialNo，
// amt：转出金额，
// tradeAcco：交易账号，传接口1持有详情接口的  tradeAcco字段，
// bankNo，bankAcco都传空，
// cashFrom传“V”，
// isInvestment传""Y"",
// arAcct,
// （allBalanceRedeem和fundList只传其中一个）
// fundList：是员工持基时传，availableQuty字段保留两位小数
// allBalanceRedeem：全部赎回时传1，否则0"
            let data = {
                groupId: this.groupId,
                balanceSerialNo: this.balanceSerialNo,
                largeFlg: this.largeFlg,
                currencyTp: '156',
                amt: this.inputValue,
                tradeAcco: this.tradeAcco,
                bankNo: '',
                bankAcco: '',
                cashFrom: 'V',
                isInvestment: 'Y',
                arAcct: this.arAcct,
            }
            if(this.employeeLimitFlag){
                // 员工持基限制检查通过
                data.allBalanceRedeem = (this.inputValue==this.holdRedeemAsset?1:0);
            } else {
                // 存在不可用员工持基份额，employeeLimitResultBody.avlEmpBalanceList 
                // PreEmployeeBaseRedeemRes {
                // avlEmpBalanceList (Array[AvailableEmpBalanceRes], optional): 可赎回员工持基份额明细列表 ,
                // fundStatusValidateTips (string, optional): 基金状态校验结果提示文案 ,
                // result (boolean, optional): 员工持基检查结果，false为不通过，存在不可用员工持基份额 ,
                // subTip (string, optional): 持基文案 ,
                // totalAvlAmt (number, optional): 可赎回金额
                // }
                // AvailableEmpBalanceRes {
                // availableAmt (number, optional): 可用金额 ,
                // availableQuty (number, optional): 可用份额 ,
                // fundId (string, optional): 基金ID ,
                // fundName (string, optional): 基金名称
                // }
                data.fundList = [];
                if(Array.isArray(this.employeeLimitResultBody.avlEmpBalanceList)){
                    data.fundList = this.employeeLimitResultBody.avlEmpBalanceList.map(item=>{
                        item.availableQuty = Math.floor(item.availableQuty*100)/100;
                        return item;
                    });
                }
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/fundgroup-redeem',
                type: 'POST',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        var resultUrl = location.href.replace(/(.*\/).*$/ig, '$1result.html?type=so');
                        utils.setSession(utils.serialNo_forword_url, resultUrl);
                        utils.verifyTradeChain(result.body);
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },

        // 判断是否员工持基
        checkEmployeeLimit(){
            if(!this.employeeLimitFlag){
                $('.detailOut').show();
            } else {
                this.redeemFundGroup();
            }
        },
        // 员工持基弹窗确认，一键转出
        confirmEmployeeLimit(){
            // 将avlEmpBalanceList列表中金额相加，更新到输入框的金额；
            // let sumValue = 0;
            // if(Array.isArray(this.employeeLimitResultBody.avlEmpBalanceList)){
            //     this.employeeLimitResultBody.avlEmpBalanceList.map(item=>{
            //         sumValue += Math.floor(item.availableAmt*100)/100;
            //     });
            //     this.inputValue = sumValue;
            // }
            this.inputValue = this.employeeLimitResultBody.totalAvlAmt;
            this.number = '';   // 1/3,1/2,全部的标签选中状态重置
            this.redeemFundGroup();
        },

        // 点击下一步
        nexStep(){
            console.log('nexStep');
            // estimateResultBody
            if(this.estimateResultBody.redeemInFirstFeeClassTips || this.estimateResultBody.redeemFeeDetailList){
                $('.checkOut').show();
            } else {
                this.getPreCommitData();    // 组合赎回预校验接口
            }
        },

        // 关闭弹窗且不继续操作 
        closeDialog(domId){
            $('.'+domId).hide();
        },
        // 关闭弹窗且继续操作
        continueStep(domId, callback){
            console.log(callback);
            $('.'+domId).hide();
            callback();
        },

        // 输入金额值
        inputMoney:function(){
            // 限制.号后面只能带两位小数
            if(this.inputValue.toString().indexOf(".") > 0 && Number(this.inputValue.toString().split(".")[1].length) > 2){
              this.inputValue = Math.floor(this.inputValue * 100)/100; 
               // var val =this.inputValue.replace(/[,A-z]/g, '');   
            } 
            this.chinese=this.changeNumMoneyToChinese( this.inputValue); 
            
        },
        // 占比切换样式
        changePro: function(index) {
           if(index==0){
            this.inputValue=(this.holdRedeemAsset/3).toFixed(2);  //取1/3的金额 
           }else if(index==1){
            this.inputValue=(this.holdRedeemAsset/2).toFixed(2);  //取1/2的金额
           }else if(index==2){
            this.inputValue=this.holdRedeemAsset;   //取全部的金额
           }
            var val =this.inputValue.replace(/[,A-z]/g, '');
            this.chinese=this.changeNumMoneyToChinese(val) 
            this.number= index;
         },
        // 清除input输入框和中文显示的值
        close:function(){
          this.inputValue='';
          this.chinese='';
        },
        // 显示浮层弹出Tips
        showTips:function(){
            $(".layer").show();
            $(".mask").show();
            $(".layer").css('height', '22rem');
        },
        // 选择浮窗内容
        showList:function(num){
           if(num==0){
            this.giveUp='放弃超额';
           }else{
            this.giveUp='继续转出';
           }
           this.largeFlg = num;
           $(".layer").hide();
           $(".mask").hide();
        },
        // 关闭浮层Tips
        closeBtn:function(){
           $(".layer").hide();
           $(".mask").hide(); 
        },

        // 交易规则
        ruleBtn:function(){
            let targetUrl = "https://static.99fund.com/mobile/app_inner/rules/fundGroupInvestRule/index.html";
            let targetUrl_test = "https://static.99fund.com/mobile/app_inner/rules/fundGroupInvestRule/index.html";
            if(isApp()){ // 生产
                if(utils.isProdEnv()){
                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl);
                }else{ //测试
                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl_test);
                }
            }else{
                if(utils.isProdEnv()){
                    window.location.href = targetUrl;
                }else{ //测试
                    window.location.href = targetUrl_test;
                }
            }
        },
        
        // 金额对应转换成中文
        changeNumMoneyToChinese:function(money) {
            var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
            var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
            var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
            var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
            var cnInteger = "整"; //整数金额时后面跟的字符
            var cnIntLast = "元"; //整型完以后的单位
            var maxNum = 999999999999999.9999; //最大处理的数字
            var IntegerNum; //金额整数部分
            var DecimalNum; //金额小数部分
            var ChineseStr = ""; //输出的中文金额字符串
            var parts; //分离金额后用的数组，预定义    
            var Symbol = "";//正负值标记
            if (money == "") {
                return "";
            }

            money = parseFloat(money);
            if (money >= maxNum) {
                // alert('超出最大处理数字');
                return "";
            }
            if (money == 0) {
                ChineseStr = cnNums[0] + cnIntLast + cnInteger;
                return ChineseStr;
            }
            if (money < 0) {
                money = -money;
                Symbol = "负 ";
            }
            money = money.toString(); //转换为字符串
            if (money.indexOf(".") == -1) {
                IntegerNum = money;
                DecimalNum = '';
            } else {
                parts = money.split(".");
                IntegerNum = parts[0];
                DecimalNum = parts[1].substr(0, 4);
            }
            if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
                var zeroCount = 0;
                var IntLen = IntegerNum.length;
                for (var i = 0; i < IntLen; i++) {
                    var n = IntegerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == "0") {
                        zeroCount++;
                    }
                    else {
                        if (zeroCount > 0) {
                            ChineseStr += cnNums[0];
                        }
                        zeroCount = 0; //归零
                        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        ChineseStr += cnIntUnits[q];
                    }
                }
                ChineseStr += cnIntLast;
                //整型部分处理完毕
            }
            if (DecimalNum != '') { //小数部分
                var decLen = DecimalNum.length;
                for (var i = 0; i < decLen; i++) {
                    var n = DecimalNum.substr(i, 1);
                    if (n != '0') {
                        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (ChineseStr == '') {
                ChineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (DecimalNum == '') {
                ChineseStr += cnInteger;
            }
            ChineseStr = Symbol + ChineseStr;

            return ChineseStr;
        },
        numFormat(val){
            if(val||val===0){
                val=val.toFixed(2);
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }else{
                return '';
            }
        },


    }
})