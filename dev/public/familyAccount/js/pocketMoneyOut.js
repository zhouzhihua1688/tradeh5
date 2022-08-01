var vm = new Vue({
    el: '#app',
    data() {
        return {
            inputValue: '', //输入的值
            chinese: '', //金额转显示中文
            amount: [ //选择默认金额
                {
                    a: 50,
                    value: '50'
                }, {
                    a: 5000,
                    value: '100'
                }, {
                    a: 10000,
                    value: '200'
                },
            ],
            number: '', //切换选择金额样式索引
            bgIndex: 0, //勾选协议小图标用 0不勾选，1勾选
            showAccount: false, //隐藏选择已有账户用
            showCard: false, //隐藏选择支付方式用
            // 账户详情
            defaultName: '', //账户名称
            // 当前账户名
            currentAcctName: '',
            // 当前选中账户currentAcct可能是string也可能是object（为了区分新增时是用的老账户，还是新账户）
            currentAcct: '',
            arAcctList: [ //已有账户列表

            ],
            // 获取url上的query参数
            queryParams: {
                groupId: '',
                arAccts: ''
            },
            // 基金详情
            groupInfo: {},
            // 底部协议列表
            adviserContractList: [],
            // pdf弹窗内容
            pdfInfo: {},
            protocolShow: false,
            // 产品风险等级
            productLevel: '',
            // 支付方式所有信息
            payAllInfo: {},
            // 支付方式列表
            bankList: [],
            // 当前选中的支付方式
            currentPayInfo: {},
            // 预检查流水号
            verifySerialNo: '',
            // xjb余额
            xjbBalance: '',
           
            // 20211223
            // 零花钱弹窗数据
            pocketTypeList: [],//取出零花钱类型
            orderNum:'' ,        //顺序编号，按升序排列 ,判断是不是自定义--99自定义 
            customName: '',     //自定义零花钱输入框的值
            cashIndex:1,    //选择取现方式,(0-普取,1-快取)
            radioIndex: 0,    //选择取现方式
            checkIndex: 1,   //勾选协议 当1不勾选，0勾选
            forName: '',      //取出谁的
            totalTakeBackInfo: '',   ////现金宝总可取金额
            planTypeName: '',  //零花钱类型名称
            planTypeId: '',   //零花钱类型ID
            memberId: '',     //成员代码
            accountId:'',       //亲情宝计划代码
            teamId: '',       //亲情宝代码
            flag: false,
            check: false      //用来判断有没有选择一个零花钱类型
        };

    },
    created() {
        // this.queryParams.groupId = utils.getUrlParam('groupId');
        // this.queryParams.arAccts = utils.getUrlParam('arAccts');
        // this.getGroupInfo(this.queryParams.groupId);
        // this.forName = utils.getSession('_member');  //获取为谁投资

        this.memberId = utils.getUrlParam('memberId');
        this.teamId = utils.getUrlParam('teamId');
        this.arAcct = utils.getUrlParam('arAcct');
        console.log("memberId", this.memberId);
        console.log("teamId", this.teamId);
        console.log("arAcct", this.arAcct);

        // this.getBankList(this.queryParams.groupId);
        this.getBankList();
        this.getXjbBalance();

        this.getNotes();// 快取和普通取现的
        this.getPocketType();  //取出零花钱类型
        this.getBaseDetial();  //获取零花钱信息 

//依据teamId亲情宝代码--获取家庭成员列表信息，并且判断有没有添加过家庭成员     
        utils.ajax({
            url: '/sfs/v1/accounts/member/list?teamId=' + this.teamId,
            // url: '/sfs/v1/accounts/member/list?teamId='+teamId,
            success: function (result) {
                if (result.returnCode === 0) {
                    console.log("成员列表信息:", result);
                    for (var i = 0; i < result.body.length; i++) {
                        if (this.memberId === result.body[i].memberId) {
                            this.forName = result.body[i].memberNameDisplay + '(' + result.body[i].memberRoleName + ')'
                        }
                    }
                } else {
                    utils.showTips('请求超时，请稍后重试');
                }
            }.bind(this)
        })

        /**
         * 查询开始计息日期，与到账日期
         */
        utils.ajax({
            url: '/mobile-bff/v1/etrading/get-ec-recharge',
            success: function (result) {
                if (result.returnCode === 0) {
                    console.log("查询到账等时间信息:", result);
                    utils.setSession('revenueDate', result.body.revenueDate);
                    utils.setSession('arrivalDate', result.body.arrivalDate);

                } else {
                    utils.showTips('请求超时，请稍后重试');
                }
            }.bind(this)
        })

    },
    computed: {},
    watch: {
        inputValue(newval, oldval) {
            var val = newval;
            if (val.toString().indexOf(".") > 0 && Number(val.toString().split(".")[1].length) > 2) {
                console.log('123123123');
                val = Math.floor(val * 100) / 100;
                this.inputValue = Math.floor(val * 100) / 100;
            }
            this.chinese = this.changeNumMoneyToChinese(val); //转换成中文金额大写格式
            if (this.number !== '' && this.amount[this.number].value !== newval) {
                this.number = '';   // 2000元,5000元,10000元的标签选中状态重置
            }
        },
        // currentAcct(newval, oldval) {
        //   if (typeof newval === 'string') {
        //     this.currentAcctName = newval;
        //   } else {
        //     this.currentAcctName = newval.arAcctName ? newval.arAcctName : newval.arAcctNm;
        //   }
        // },
        // currentAcctName(newval, oldval) {
        //     // 可编辑状态
        //     if (this.currentAcctType === 'string') {
        //         this.checkCompliance(newval);
        //     }
        // },
    },
    methods: {
        //获取银行卡列表
        getBankList() {
            utils.ajax({
                // url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=02&tradeScene=15',  //tradeType=02，tradeScene=15 为零花钱取出。
                url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=02&tradeScene=15&arAcct=' + this.arAcct,  //tradeType=02，tradeScene=15 为零花钱取出。
                success: function (result) {
                    console.log("银行卡信息", result);
                    this.payAllInfo = result.body;
                    this.bankList = result.body.bankInfos;
                    this.currentPayInfo = result.body.bankInfos[0];  //默认选一个银行卡
                    // this.currentPayInfo = result.body.bankInfos.filter((item) => {
                    //   // 默认选择现金宝
                    //   return item.cashFrom == 'V';
                    // })[0];
                }.bind(this)
            })
        },


        // 根据合约账号查询账户详情(追加情况)
        // getAcctInfo(arAcct) {
        //     utils.ajax({
        //         url: '/icif/v1/ar-accts/query-by-ar-acct?arAcct=' + arAcct,
        //         success: function (result) {
        //             this.currentAcct = result.body;
        //         }.bind(this)
        //     })
        // },

        // 查询现金宝余额
        getXjbBalance() {
            utils.ajax({
                url: '/smac/v1/asset/balance-with-smac',
                success: function (result) {
                    this.xjbBalance = result.body.balance;
                }.bind(this)
            })
        },
        // 选择支付方式
        choosePay: function (index) {
            this.currentPayInfo = this.bankList[index];
            this.showCard = false;
        },
//取出界面提示--快速取现和普通取现的信息
        getNotes() {
            utils.ajax({
                // url: '/mobile-bff/v1/etrading/get-take-back-date',
                url: '/mobile-bff/v1/etrading/get-take-back-date?arAcct=' + this.arAcct,
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log('提示信息:', result);

                        var fasthtml = result.body.fastTakeBackInfo;//快速取现信息
                        var cashhtml = result.body.normalTakeBackInfo;//普通取现信息
                        this.totalTakeBackInfo = Number(result.body.takeBackInfo.balanceDisplay);//总可取金额

                        $(".fast-notes").html('<span>' + fasthtml + '</span>');  //快速取现信息
                        $(".cash-notes").html('<span>' + cashhtml + '</span>');  //普通取现信息

                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
// 点击取出全部
        putAll: function () {
            this.inputValue = this.totalTakeBackInfo;
        },
// 取出谁的
        // forOut: function () {
        //     window.location.href = '/tradeh5/newWap/familyAccount/selectMember.html?type=out';
        // },
// 计划名称列表--获取零花钱相关类型 
        getPocketType() {
            utils.ajax({
                url: '/sfs/v1/accounts/plans/recommend-types?accountType=5',  //5存入零花钱、5取出零花钱
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log('取零花钱类型:', result);
                        this.pocketTypeList = result.body;
                        this.planTypeName = this.pocketTypeList[0].planTypeName; //默认选择第一个零花钱类型
                        this.planTypeId = this.pocketTypeList[0].planTypeId;////默认选择第一个零花钱类型planTypeId
                         for (var i = 0; i < this.pocketTypeList.length; i++) {
                            if (this.pocketTypeList[i].orderNum ==99) {//零花钱类型里orderNum=99-属于自定义
                                this.pocketTypeList[i].planTypeName = '自定义';
                            }
                        }
                        this.pocketTypeList.map(function (item) {
                            return item.check = false;
                        });

                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
//查询取零花钱基本信息--获取accountId
        getBaseDetial() {
            let params = {}
            // 以下参数必需有一个：
            // 1.memberId被记录的成员
            // 2.arAcct合约账号
            params.memberId = this.memberId;
            if (this.arAcct) {
                params.arAcct = this.arAcct;
            }
            utils.ajax({
                url: '/sfs/v1/accounts/plans/base',
                type: 'GET',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log('零花钱基本信息:', result);                 
                        this.accountId = result.body.accountId;
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },        
// 2021/12/23
        // 零花钱弹窗
        showLayer: function () {
            $(".layer").show();
        },
        closeLayer: function () {
            $(".layer").hide();
        },
        cashRadio: function (index) {
            this.cashIndex = index // 点击时，切换选中取现方式

        },
        checkMoneyOut: function (index, item) {   //勾选取出零花钱类型
            this.radioIndex = index; // 点击时，切换选中索引

            this.planTypeId = item.planTypeId;
            this.orderNum=item.orderNum;
            this.check = true; //用来判断有没有选择一个零花钱类型
        },
        checkRadio: function (index) {// 点击时，勾选协议
            // this.checkIndex = index // 点击时，勾选协议
            if (index != this.checkIndex) {
                this.checkIndex = index;
            } else {
                this.checkIndex = 1;
            }

            if (this.checkIndex == 0) {
                this.flag = true;       //用作判断有勾选服务协议
            } else {
                this.flag = false;    //用作判断没有勾选服务协议
            }
        },

// 选择取出零花钱类型确认按钮  
        confirmPocketType: function () {

           if (this.check) {   //有没有勾选一个类型
                if (this.orderNum == 99 && this.customName == '') {  //orderNum=99-属于自定义
                    utils.showTips('请输入自定义类型名称');
                } else {
                    $(".layer").hide();
                }
            }else{
               $(".layer").hide();
            }

            for (var i = 0; i < this.pocketTypeList.length; i++) {
                if (this.planTypeId == this.pocketTypeList[i].planTypeId) {
                    this.planTypeName = this.pocketTypeList[i].planTypeName;
                }
            }
            if (this.orderNum == 99) {
                this.planTypeName = this.customName;
            }

            // $(".layer").hide();
        },
        //取现协议跳转
        jumpAgreement:function(){
           var jumpUrl='https://static.99fund.com/mobile/agreement/realcash_agreement_card.html';
           if(isApp()){   
              window.location.href = "htffundxjb://action?type=url&link=" + btoa(jumpUrl); 
            }else{
              window.location.href = jumpUrl;  
            }
        },

//取出零花钱按钮   
        pocketMoneyOut() {

            // 如果底部按钮不亮
            if (this.flag == false&&this.cashIndex==1) {
                utils.showTips('请确认勾选服务协议再确认');
                return;
            }

            if (this.inputValue == '' || this.inputValue<= 0) {
                utils.showTips('请输入取现金额且不能小于等于0');
                return;
            }

            if (this.planTypeName == '') {
                utils.showTips('请选择零花钱类型');
                return;
            }

            if (this.inputValue > this.totalTakeBackInfo) {
                utils.showTips('取现金额大于本卡可取金额');
                return;
            }
            // if (this.currentPayInfo.cashFrom == 'V' && Number(this.inputValue) > Number(this.xjbBalance)) {
            //     utils.showTips({
            //         content: '现金宝余额不足，请立即充值',
            //         showCancel: true, //是否显示取消按钮，默认false
            //         confirmText: '去充值', //确认按钮文字，默认确定
            //         complete: function () { //需使用bind()
            //             window.location.href = '/mobileEC/wap/account/topup.html?forwardUrl=' + this.forwardUrl;
            //         }.bind(this)
            //     });
            //     return;
            // }

            let params = {}

            params.teamId = this.teamId;        //亲情宝代码
            params.arAcct = this.arAcct;        //合约账号(必传)
            params.accountId = this.accountId;  //亲情宝计划代码
            if (this.currentPayInfo.cashFrom == 'B') {
                params.bankSerialId = this.currentPayInfo.bankCardSerialid; //支付账号（cashFrom=B时需要赋值）
            }
            params.cashFrom = this.currentPayInfo.cashFrom;    //支付方式
            params.memberId = this.memberId;
            params.realTime = this.cashIndex;                 //取现标志(0-普取,1-快取) ,
            params.remarksId = this.planTypeId;    //存入的备注ID（传推荐计划名称的planTypeId）
            params.subAmt = Number(this.inputValue);  //金额

            params.remarksTips = "";//备注文案

            console.log(params)

            let detail = {}  //设置到账信息-用于取现成功页面展示
            detail.successMoney = this.inputValue;
            detail.realTime = params.realTime;
            detail.bankAccoDisplay = this.currentPayInfo.bankAccoDisplay + '的' + this.currentPayInfo.bankGrpName;

            utils.ajax({
                url: '/mobile-bff/v1/etrading/money-box-taking',
                type: 'POST',
                data: params,
                success: function (result) {
                    // console.log(result);
                    utils.setSession('detail', detail);

                    utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/familyAccount/pocketOutSuccess.html')
                    utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
                    utils.verifyTradeChain(result.body);
                }.bind(this)
            })

        },

        // 公共方法
        // 防抖
        // debounce(fn, delay){
        //   var timer = null; // 声明计时器
        //   return function() {
        //     var context = this;
        //     var args = arguments;
        //     clearTimeout(timer);
        //     timer = setTimeout(function () {
        //       fn.apply(context, args);
        //     }, delay);
        //   };
        // },

        //切换金额样式
        changeMoney: function (index, item) {
            this.inputValue = this.amount[index].value; //选择默认的金额填入输入框
            this.number = index; //默认金额样式的切换

            let money = this.inputValue.replace(/[,A-z]/g, '');
            this.chinese = this.changeNumMoneyToChinese(money); //转换成中文金额大写格式
        },
        // 清除input输入框和中文显示的值
        close: function () {
            this.inputValue = '';
            this.chinese = '';
        },
        // 交易规则
        ruleBtn: function () {
            let targetUrl = "https://static.99fund.com/mobile/app_inner/rules/fundGroupInvestRule/index.html";
            let targetUrl_test = "https://static.99fund.com/mobile/app_inner/rules/fundGroupInvestRule/index.html";
            if (isApp()) { // 生产
                if (utils.isProdEnv()) {
                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl);
                } else { //测试
                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl_test);
                }
            } else {
                if (utils.isProdEnv()) {
                    window.location.href = targetUrl;
                } else { //测试
                    window.location.href = targetUrl_test;
                }
            }
        },
        // 金额对应转换成中文
        changeNumMoneyToChinese: function (money) {
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
            var Symbol = ""; //正负值标记
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
                    } else {
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
        numFormat(val) {
            if (val || val === 0) {
                val = val.toFixed(2);
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                return '';
            }
        },
        // 银行卡signWay翻译
        signWayTransfer(val) {
            let signWay = {}
            switch (val) {
                case '1':
                    signWay.text = '快捷';
                    signWay.class = '.icon-shorcut';
                    break;
                case '2':
                    signWay.text = '银联通';
                    signWay.class = '.icon-union';
                    break;
                case '3':
                    signWay.text = '网银';
                    signWay.class = '.icon-E-bank';
                    break;
                case '4':
                    signWay.text = '通联';
                    signWay.class = '.icon-E-bank';
                    break;
                case '6':
                    signWay.text = '云闪付';
                    signWay.class = '.icon-E-bank';
                    break;
                case '7':
                    signWay.text = '一网通';
                    signWay.class = '.icon-E-bank';
                    break;
                default:
                    signWay = {}
            }
            return signWay
        },
    },

})