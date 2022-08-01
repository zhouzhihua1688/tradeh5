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
            // defaultName: '', //账户名称
            // 当前账户名
            // currentAcctName: '',
            // 当前选中账户currentAcct可能是string也可能是object（为了区分新增时是用的老账户，还是新账户）
            // currentAcct: '',
            // arAcctList: [ //已有账户列表

            // ],
            // 获取url上的query参数
            queryParams: {
                groupId: '',
                arAccts: ''
            },
            // 基金详情
            groupInfo: {},
            // 底部协议列表
            // adviserContractList: [],
            // pdf弹窗内容
            // pdfInfo: {},
            // protocolShow: false,
            // 产品风险等级
            // productLevel: '',
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
            forName: '',   //为谁投资
            planTypeName: '',  //零花钱类型名称
            planTypeId: '',     //零花钱类型ID
            orderNum: '',        //顺序编号，按升序排列 ,判断是不是自定义--99自定义
            customName: '',     //自定义零花钱输入框的值
            // 零花钱弹窗数据
            pocketTypeList: [], //零花钱类型
            radioIndex: 0,  //零花钱弹窗里做索引样式
            checkIndex: '',   //自定义零花钱用
            memberId: '',     //成员代码
            teamId: '',       //亲情宝代码
            accountId:'',       //亲情宝计划代码
            arAcct: '',        //合约账号
            check: false,      //用来判断有没有选择一个零花钱类型
            memberList:[],      // 家庭成员列表

            handleFlag_bankList: false,
            handleFlag_memberList: false,
        };
    },
    created() {
        // this.queryParams.groupId = utils.getUrlParam('groupId');

        // this.queryParams.arAccts = utils.getUrlParam('arAccts');
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

        // this.checkCompliance = this.debounce(this.checkInvestName,2000)
        // 温馨提示
        this.getNotes();
        this.getPocketType() //获取零花钱去哪是那种类型
        // this.getTeamId()//获取teamId

        // 获取亲情账户成员列表
        this.getMemberList();

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
                this.number = '';   // 50元,100元,200元的标签选中状态重置
            }
        },
    },
    methods: {
        // 处理 亲情账户列表为1个（只有自己）的弹窗 和 去实名绑卡的弹窗
        handleTips(){
            if(this.handleFlag_bankList && this.handleFlag_memberList){

                if(this.bankList.length == 0){
                    utils.showTips({
                        content: '当前您绑定的银行卡不可用于支付，请前往银行卡列表变更签约方式或绑定支持的银行卡',
                        showCancel: true, //是否显示取消按钮，默认false
                        confirmText: '确定', //确认按钮文字，默认确定
                        complete: function () { //需使用bind()
                            window.location.href = '/mobileEC/wap/card/bindCardInputCardInfo.html';
                        }.bind(this),
                        nextComplete: function () { //需使用bind()
                            if (this.memberList.length == 1) {  //如果只有一个成员只是自己,提示去添加成员
                                setTimeout(()=>{
                                    this.showInviteDlg();
                                }, 0)
                            }
                        }.bind(this),
                    });
                } else if(this.memberList.length == 1) {
                    this.showInviteDlg();
                }else {
                    // 无需弹窗
                }
            }
        },
        // 显示邀请其他家庭成员弹窗
        showInviteDlg(){
            utils.showTips({
                content: '您还未添加其他家庭成员，请前往添加',
                showCancel: true, //是否显示取消按钮，默认false
                confirmText: '添加新成员', //确认按钮文字，默认确定
                complete: function () { //需使用bind()
                    setTimeout(()=>{
                        this.showInviteDlg();
                        window.location.href = '/tradeh5/newWap/familyAccount/inviteMemList.html';
                    }, 0)
                }.bind(this)
            });
        },
        // 获取亲情账户成员列表
        getMemberList() {
            //依据teamId亲情宝代码--获取家庭成员列表信息，并且判断有没有添加过家庭成员     
            utils.ajax({
                url: '/sfs/v1/accounts/member/list?teamId=' + this.teamId,  //210524113026CIGJ  21122117223V7MTU
                // url: '/sfs/v1/accounts/member/list?teamId='+teamId,
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log("成员列表信息:", result);
                        this.memberList=result.body;
                        this.handleFlag_memberList = true;
                        this.handleTips();
                        result.body.sort((a, b) => {   //先按创建时间排序，把最新创建角色放最前面,用于下面取数组第一个
                        return b.createTime - a.createTime
                        })
                        console.log("成员排序后列表信息:", result);
                        // this.forName = result.body[0].memberNameDisplay + '(' + result.body[0].memberRoleName + ')'
                        if(utils.getUrlParam('type')||this.arAcct){   //type判断是不是选择成员角色页面链接过来，有type则选择，否则就取值最新创建角色的
                        for (var i = 0; i < result.body.length; i++) {
                            if (this.memberId === result.body[i].memberId) {
                                this.forName = result.body[i].memberNameDisplay + '(' + result.body[i].memberRoleName + ')'
                            }
                        }
                        }else{
                        this.forName = result.body[0].memberNameDisplay + '(' + result.body[0].memberRoleName + ')';  //获取名称
                        this.memberId=result.body[0].memberId;   //获取memberId
                        }
                        console.log(this.forName);
                        this.getBaseDetial(this.forName,this.memberList);//零花钱基本信息
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        //获取银行卡列表
        getBankList() {
            utils.ajax({
                // url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=00&tradeScene=15', //tradeType=00，tradeScene=15 为零花钱存入，
                url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=00&tradeScene=15&arAcct=' + this.arAcct, //tradeType=00，tradeScene=15 为零花钱存入，
                success: function (result) {
                    console.log("银行卡列表:", result);
                    if (result.returnCode === 0) {
                        if (result.body.bankInfos.length > 0) {
                            this.payAllInfo = result.body;
                            this.bankList = result.body.bankInfos;
                            this.currentPayInfo = result.body.bankInfos.filter((item) => {
                                // 默认选择现金宝
                                return item.cashFrom == 'V';
                            })[0];
                        }
                        this.handleFlag_bankList = true;
                        this.handleTips();
                    } else {
                        // utils.showTips('请求超时，请稍后重试');
                        utils.showTips({
                            content: '请求超时，请稍后重试',
                            showCancel: false, //是否显示取消按钮，默认false
                            confirmText:true, //确认按钮文字，默认确定
                            complete: function () { //需使用bind()
                            }.bind(this)
                        });
                    }
                }.bind(this)
            })
        },

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
// 获取teamId亲情宝代码  
        // getTeamId:function(){
        //     utils.ajax({
        //       url: '/sfs/v1/accounts/admin/query/is-open',
        //       success: function (result) {
        //         if (result.returnCode === 0) {
        //             console.log('teamId:',result);
        //             // this.teamId=result.body.teamId;
        //           } else {
        //             utils.showTips('请求超时，请稍后重试');
        //           }
        //       }.bind(this)
        //     })
        // },

        // 检查投顾自定义名称是否合规
        checkInvestName(name) {
            let url = '/ias/v1/acct/name/validate?acctName=' + name;
            utils.ajax({
                url,
                success: function (result) {
                    console.log(result);
                    if (!result.body) {
                        this.currentAcctName = ''
                    }
                }.bind(this)
            })
        },

//查询取零花钱基本信息--看是否有合约账号等信息
        getBaseDetial(planName,memberList) {
            let params = {}
            // 以下参数必需有一个：
            // 1.memberId被记录的成员
            // 2.arAcct合约账号
            console.log("memberId:",this.memberId);
            params.memberId = this.memberId;
            // if (this.arAcct) {
            //     params.arAcct = this.arAcct;
            // }
            utils.ajax({
                url: '/sfs/v1/accounts/plans/base',
                type: 'GET',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log('零花钱基本信息:', result);
                        if (result.body && result.body.arAcct) {
                            this.arAcct = result.body.arAcct;
                            this.accountId = result.body.accountId;
                        }
                    } else {
                        // utils.showTips('请求超时，请稍后重试');
                        utils.showTips({
                            content: '请求超时，请稍后重试',
                            showCancel: false, //是否显示取消按钮，默认false
                            confirmText:true, //确认按钮文字，默认确定
                            complete: function () { //需使用bind()
                            }.bind(this)
                        });
                    }
                }.bind(this)
            })
        },

//如果存入零花钱的人还没有创建计划，和没有合约账号arAcct （去创建零花钱计划）  
        createPlan: function (planName) {
            let params = {}
            var accptMd ="WAP";
            if(isApp()){
                accptMd="MOBILE";
            }
            params.acceptMode = accptMd;
            params.branchCode = '247';
            params.accountType = 4;
            params.memberId = this.memberId;
            params.teamId = this.teamId;
            params.planName = planName + '的零花钱';
            $.ajax({
                url: '/sfs/v1/accounts/plans',
                type: 'POST',
                contentType:"application/json",
                data: JSON.stringify(params),
                success: function (result) {
                    console.log(result);

                    if (result.returnCode === 0) {
                        console.log('创建零花钱计划成功数据:', result);
                        this.arAcct = result.body.arAcct;
                        this.accountId = result.body.accountId;
                        // 立即存入零花钱
                        this.doPocketMoneyPush();
                    } else if (result.returnCode == 1000) {
                        return utils.jumpLoginByChannelCode();
                    } else {
                        // utils.showTips('请求超时，请稍后重试');
                        utils.showTips({
                            content: '请求超时，请稍后重试',
                            showCancel: false, //是否显示取消按钮，默认false
                            confirmText:true, //确认按钮文字，默认确定
                            complete: function () { //需使用bind()
                            }.bind(this)
                        });
                    }
                }.bind(this)
            })
        },

// 立即存入按钮   
        pocketMoneyPush() {
            if (this.planTypeName == '') {
                utils.showTips({
                    content: '请选择零花钱类型',
                    showCancel: false, //是否显示取消按钮，默认false
                    confirmText: '确定', //确认按钮文字，默认确定
                    complete: function () { //需使用bind()
                    }.bind(this)
                });
                return;
            }
            if (this.inputValue == '' || this.inputValue <= 0) {
                // utils.showTips('存入金额不能为空且不能小于等于0');
                utils.showTips({
                    content: '存入金额不能为空且不能小于等于0',
                    showCancel: false, //是否显示取消按钮，默认false
                    confirmText: '确定', //确认按钮文字，默认确定
                    complete: function () { //需使用bind()
                    }.bind(this)
                });
                return;
            }

            if (this.currentPayInfo.cashFrom == 'V' && Number(this.inputValue) > Number(this.xjbBalance)) {
                utils.showTips({
                    content: '现金宝余额不足，请立即充值',
                    showCancel: true, //是否显示取消按钮，默认false
                    confirmText: '去充值', //确认按钮文字，默认确定
                    complete: function () { //需使用bind()
                        window.location.href = '/mobileEC/wap/account/topup.html?forwardUrl=' + this.forwardUrl;
                    }.bind(this)
                });
                return;
            }
            if (this.bankList.length <= 0) {
                utils.showTips({
                    content: '当前您绑定的银行卡不可用于支付，请前往银行卡列表变更签约方式或绑定支持的银行卡',
                    showCancel: true, //是否显示取消按钮，默认false
                    confirmText: '确定', //确认按钮文字，默认确定
                    complete: function () { //需使用bind()
                        window.location.href = '/mobileEC/wap/card/bindCardInputCardInfo.html';
                    }.bind(this)
                });
                return;
            }

            if(this.arAcct && this.accountId){
                // 立即存入零花钱
                this.doPocketMoneyPush(); 
            } else {
                this.createPlan(this.forName);   //去创建零花钱计划
            }
            
        },

        // 立即存入零花钱
        doPocketMoneyPush() {
            let params = {}
            params.teamId = this.teamId;     //亲情宝代码
            params.accountId = this.accountId;  //亲情宝计划代码
            params.arAcct = this.arAcct;    //合约账号(必传)

            if (this.currentPayInfo.cashFrom == 'B') {
                params.bankSerialId = this.currentPayInfo.bankCardSerialid; //支付账号（cashFrom=B时需要赋值）
            }
            params.cashFrom = this.currentPayInfo.cashFrom;    //支付方式

            params.memberId = this.memberId;//成员代码
            params.remarksId = this.planTypeId;    //存入的备注ID（传推荐计划名称的planTypeId）
            params.remarksTips = '';  //备注文案
            params.subAmt = Number(this.inputValue);          //金额
            console.log(params);

            utils.ajax({
                url: '/mobile-bff/v1/etrading/money-box-saving',
                type: 'POST',
                data: params,
                success: function (result) {
                    utils.setSession('successMoney', this.inputValue);
                    // console.log(result);
                    utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/familyAccount/pocketPushSuccess.html')
                    utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
                    utils.verifyTradeChain(result.body);
                }.bind(this)
            })
        },

        // 交易规则---
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

// 2021/12/23
// 底部温馨提示接口 
        getNotes() {
            utils.ajax({
                url: '/mobile-bff/v1/etrading/save-money-tips',
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log('温馨提示:', result);
                        // this.notes=result.body;
                        var html = result.body;
                        $(".notes-text").html('<p style="line-height:0.95rem">' + html + '</p>');
                    } else {
                        utils.showTips({
                            content: '请求超时，请稍后重试',
                            showCancel: false, //是否显示取消按钮，默认false
                            confirmText:true, //确认按钮文字，默认确定
                            complete: function () { //需使用bind()
                            }.bind(this)
                        });
                    }
                }.bind(this)
            })
        },
// 为谁投资   
        forWhom: function () {
            window.location.href = '/tradeh5/newWap/familyAccount/selectMember.html?type=push';
        },
// 计划名称列表--零花钱相关类型 
        getPocketType() {
            utils.ajax({
                url: '/sfs/v1/accounts/plans/recommend-types?accountType=4',  //4存入零花钱、5取出零花钱
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log('零花钱类型:', result);
                        this.pocketTypeList = result.body;
                        this.planTypeName = this.pocketTypeList[0].planTypeName; //默认选择第一个零花钱类型
                        this.planTypeId = this.pocketTypeList[0].planTypeId;////默认选择第一个零花钱类型planTypeId

                        for (var i = 0; i < this.pocketTypeList.length; i++) {
                            if (this.pocketTypeList[i].orderNum == 99) {//零花钱类型里orderNum=99-属于自定义
                                this.pocketTypeList[i].planTypeName = '自定义';
                            }
                        }
                        this.pocketTypeList.map(function (item) {
                            return item.check = false;
                        });

                    } else {
                        utils.showTips({
                            content: '请求超时，请稍后重试',
                            showCancel: false, //是否显示取消按钮，默认false
                            confirmText:true, //确认按钮文字，默认确定
                            complete: function () { //需使用bind()
                            }.bind(this)
                        });
                    }
                }.bind(this)
            })
        },

// 零花钱弹窗
        showLayer: function () {
            $(".layer").show();
        },
        closeLayer: function () {
            $(".layer").hide();
        },
        // 零花钱弹窗-选择列
        checkRadio: function (index, item) {
            console.log(item)
            this.radioIndex = index; // 点击时，切换选中索引

            this.planTypeId = item.planTypeId;
            this.orderNum = item.orderNum;

            for (var i = 0; i < this.pocketTypeList.length; i++) {
                if (item.planTypeId == this.pocketTypeList[i].planTypeId) {
                    item.check = true
                } else {
                    this.pocketTypeList[i].check = false;
                }
            }

            this.check = true; //用来判断有没有选择一个零花钱类型
            this.checkIndex = ''; //让自定义选中状态变成，不选中
        },
        checkCustom: function (num) {   //自定义零花钱样式切换
            this.checkIndex = num;

            this.radioIndex = '';   //让选中状态变成，不选中
        },
        confirmPocketType: function () {   //点击确认获取零花钱类型
            console.log(this.planTypeId);

            if (this.check) {   //有没有勾选一个类型
                if (this.orderNum == 99 && this.customName == '') {  //orderNum=99-属于自定义
                    utils.showTips('请输入自定义类型名称');
                } else {
                    $(".layer").hide();
                }
            } else {
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
            // let aa = this.pocketTypeList.filter(item=>item.planTypeId ===this.planTypeId);
            // this.planTypeName=aa;
        },
        // 公共方法
        // 防抖
        debounce(fn, delay) {
            var timer = null; // 声明计时器
            return function () {
                var context = this;
                var args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },
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