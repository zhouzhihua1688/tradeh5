var vm = new Vue({
    el: '#app',
    data() {
        return {
            sceneNameList: [],
            textLen: 0,
            currentIndex: 0,
            // 一次投入 还是定投，一次ones,定投week
            inputMode: 'ones',
            isAgreement: false,
            isAgreement2: [],
            recommendData: [],
            currentRecomment: '',
            count: 0,
            recommentShow: true,
            // 基金类型 1为基金 2为组合
            prdType: '',
            // 选好的产品id和标题
            prdTitle: '',
            prdId: '',
            planTxt: '',
            buyAmt: '',
            teamId: '',
            member: '',
            memberId: '',
            canPurchase: '',
            canMip: '',
            canAutoInvested: '',
            // cycle payDate
            cycle: '',
            payDate: '',
            selectIndexArr: [],
            fundDetail: {},
            groupDetail: {},
            // 提示窗口
            tipInfo: '',
            // 校验金额
            checkMinNum: '',
            // 银行卡列表
            cardList: [],
            // 支付方式数据
            bankGrpName: '现金宝',
            cashFrom: 'V',
            bankNo: '',
            bankAcco: '',
            bankSerialId: '',

            initFlag: false,
            showWeek:false,
            weekText: '',
        }
    },

    mounted() {

        var formatMonthDay = [];
        for (var i = 1; i <= 28; i++) {
            formatMonthDay.push({
                id: i,
                value: i + '日'
            })
        }
        mobileSelect1 = new MobileSelect({
            trigger: '#select-week',
            // title: '地区选择-联动',
            wheels: [{
                data: [{
                        id: '1',
                        value: '每月',
                        childs: formatMonthDay
                    },
                    {
                        id: '2',
                        value: '每双周',
                        childs: [{
                                id: '1',
                                value: '周一'
                            },
                            {
                                id: '2',
                                value: '周二'
                            },
                            {
                                id: '3',
                                value: '周三'
                            },
                            {
                                id: '4',
                                value: '周四'
                            },
                            {
                                id: '5',
                                value: '周五'
                            }
                        ]
                    },
                    {
                        id: '3',
                        value: '每周',
                        childs: [{
                                id: '1',
                                value: '周一'
                            },
                            {
                                id: '2',
                                value: '周二'
                            },
                            {
                                id: '3',
                                value: '周三'
                            },
                            {
                                id: '4',
                                value: '周四'
                            },
                            {
                                id: '5',
                                value: '周五'
                            }
                        ]
                    },
                    {
                        id: '4',
                        value: '每日'
                    }
                ]
            }],
            // position: [2, 0],
            callback: (indexArr, data) => {
                this.selectIndexArr = indexArr;
                switch (data[0].id) {
                    case '1':
                        this.cycle = 'MM';
                        break;
                    case '2':
                        this.cycle = '2W';
                        break;
                    case '3':
                        this.cycle = 'WW';
                        break;
                    case '4':
                        this.cycle = 'DD';
                        break;
                }
                if (data[1]) {
                    this.payDate = data[1].id
                } else {
                    this.payDate = ''
                }
                if (this.inputMode == "ones") {
                    this.cycle = '';
                    this.payDate = '';
                }
                // console.log(data); //返回选中的json数据
            }
        });
        $('.ensure').click();
        this.getsceneNameList();
        this.getLayoutData();
        this.isOpen();

    },
    computed: {
        minNum: function () {
            if (this.prdType) {
                if (this.prdType == '1') {
                    // 如果一次性投入
                    if (this.inputMode == 'ones') {
                        this.checkMinNum = this.fundDetail.minSubAmt == 0 ? 0 : this.fundDetail.minSubAmt ? Number(this.fundDetail.minSubAmt) : 0;
                        return '最低' + this.formatMoney(this.fundDetail.minSubAmt) + '元';
                    }
                    // 如果周期投入（定投）
                    if (this.inputMode == 'week') {
                        this.checkMinNum = this.fundDetail.minMipAmt == 0 ? 0 : this.fundDetail.minMipAmt ? Number(this.fundDetail.minMipAmt) : 0;
                        return '最低' + this.formatMoney(this.fundDetail.minMipAmt) + '元';
                    }
                } else if (this.prdType == '2') {
                    this.checkMinNum = this.groupDetail.initLimitAmount == 0 ? 0 : this.groupDetail.initLimitAmount ? Number(this.groupDetail.initLimitAmount) : 0;
                    return '最低' + this.formatMoney(this.groupDetail.initLimitAmount) + '元';
                }
            } else {
                return '请输入投资金额'
            }
        },
        ruleList: function () {
            var that = this;
            console.log('this.fundDetail',this.fundDetail.fundContractList,this.currentRecomment)
            if (this.prdType) {
                if (this.prdType == '1') {
                    if (this.inputMode == 'ones') {
                        if (this.fundDetail.fundContractList) {
                            var arr = this.fundDetail.fundContractList;
                            console.log('arr', arr);
                            if (arr && Array.isArray(arr)) {
                                const res = new Map();
                                var brr = this.fundDetail.fundContractList.filter((item) => !res.has(
                                    item.contractCategory) && res.set(item
                                    .contractCategory, 1))
                            }
                            return brr;
                        }
                    }
                    if (this.inputMode == 'week') {
                        if (this.fundDetail.fundContractList && this.fundDetail.fundContractList.length > 0) {
                            return this.fundDetail.fundContractList;
                        } else {
                            return 'week';
                        }
                    }
                }
                if (this.prdType == '2') {
                    return [];
                }
            } else {
                if (this.inputMode == 'ones') {
                    return 'ones';
                } else if (this.inputMode == 'week') {
                    return 'week';
                }

            }
        }
    },
    watch: {
        currentIndex: {
            handler: function (newvalue, oldvalue) {
                // this.planTxt = this.sceneNameList[newvalue].planTypeName
                (!this.initFlag) && (this.planTxt = this.sceneNameList[newvalue].planTypeName);
                this.initFlag = false;  
                //每次切换的时候重新查询推荐的产品
                this.getInfo(newvalue)
                // this.getGroupDetail()

            }
        },
        planTxt: {
            handler: function (newvalue, oldvalue) {
                this.textLen = newvalue.length;
            }
        },
        prdType: {
            handler: function (newvalue, oldvalue) {
                (newvalue == '1') && (this.getFundDetail());
                (newvalue == '1') && (this.getInfo());
                (newvalue == '2') && (this.getGroupDetail());
                this.getCards(this.prdId, newvalue);
            }
        },
        inputMode: {
            handler: function (newvalue, oldvalue) {
                $('.ensure').click();
                if (newvalue == "ones") {
                    this.cycle = "";
                    this.payDate = '';
                    this.bankGrpName = '现金宝',
                        this.cashFrom = 'V',
                        this.bankNo = '',
                        this.bankAcco = ''
                }
                if ((!this.initFlag)) {
                    this.isAgreement = false;
                    this.isAgreement2 = []
                }
            }
        }

    },
    created() {
    },
    methods: {
        // init
        init: function (mySwiper) {
            if (utils.getSession('_createInit')) {
                this.initFlag = true;
                var params = utils.getSession('_createInit');
                console.log('111111',params)
                this.bankAcco = params.bankAcco;
                this.bankGrpName = params.bankGrpName;
                this.bankNo = params.bankNo;
                this.buyAmt = params.buyAmt;
                this.cashFrom = params.cashFrom;
                this.inputMode = params.inputMode;
                this.isAgreement = params.isAgreement;
                this.isAgreement2 = params.isAgreement2;
                this.member = params.member;
                this.memberId = params.memberId;
                this.planTxt = params.planTxt;
                this.prdId = params.prdId;
                // this.prdTitle = params.prdTitle;
                this.prdType = params.prdType;
                this.recommentShow = params.recommentShow;
                this.textLen = params.textLen;
                this.selectIndexArr = params.selectIndexArr;
                this.canPurchase = params.canPurchase;
                this.canMip = params.canMip;
                this.canAutoInvested = params.canAutoInvested;
                this.selectIndexArr.forEach(function (item, index) {
                    mobileSelect1.locatePosition(index, item);
                })
                $('.ensure').click();
                mySwiper.slideTo(params.currentIndex + 5);
            }
        },
        inputInitData: function (teamId) {
            var ssoCookieData = utils.getSession(utils.getCookie('sso_cookie_ext_dp'));
            if (ssoCookieData) {
                var url = '/sfs/v1/accounts/member/list?teamId=' + teamId;
                utils.get(url).then(function (body) {
                    var memberData = body.body.filter(function (item) {
                        return item.memberRole == 5;
                    })[0];
                    this.bankGrpName = '现金宝';
                    this.buyAmt = ssoCookieData.investPer;
                    this.cashFrom = 'V';
                    this.inputMode = 'week';
                    this.member = memberData.memberNameDisplay + '(' + memberData.memberRoleName + ')';
                    this.memberId = memberData.memberId;
                    this.planTxt = ssoCookieData.planName;
                    this.prdId = 'A0080';
                    this.prdTitle = '稳稳小确幸';
                    this.prdType = 2;
                    this.recommentShow = false;
                    this.canPurchase = '1';
                    this.canMip = '1';
                    this.canAutoInvested = 'Y';
                }.bind(this));
            }
        },
        // 数字format
        formatMoney,
        // 获取swiper数据
        getsceneNameList: function () {
            utils.ajax({
                url: '/sfs/v1/accounts/plans/recommend-types?accountType=1',
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.sceneNameList = result.body;
                         // 加载完成的时候第一次查询对应的产品信息
                        this.getInfo('0')
                    } else {
                        this.tipInfo = '网络错误';
                        this.toastShow();
                    }
                }.bind(this)
            })

        },

        // 是否开启亲情宝
        isOpen: function () {
            utils.ajax({
                url: '/sfs/v1/accounts/is-open?version=6.6',
                success: function (result) {
                    if (result.returnCode === 0) {
                        if (result.body.isOpen) {
                            this.teamId = result.body.teamId;
                            this.inputInitData(this.teamId);
                        } else {
                            window.location.href = "/tradeh5/newWap/familyAccount/open.html"
                        }
                    } else {
                        this.tipInfo = '网络错误';
                        this.toastShow();
                    }
                }.bind(this)
            })
        },
        // 获取布局数据
        getLayoutData: function () {
            utils.ajax({
                url: '/res/v1/app-func-layout/location-info?layoutId=familyWishRecommendProducts',
                success: function (result) {
                    if (result.returnCode === 0) {
                        if (result.body && result.body.appLayoutFuncInfoList && result
                            .body.appLayoutFuncInfoList.length > 0) {
                            result.body.appLayoutFuncInfoList.forEach(function (item) {
                                this.getRecommendData(item.layoutId, item
                                    .funcmodId);
                            }.bind(this))
                        }
                    } else {
                        this.tipInfo = '网络错误';
                        this.toastShow();
                    }
                }.bind(this)
            })
        },
        // 获取推荐数据
        getRecommendData: function (layoutId, funcModId) {
                utils.ajax({
                    url: '/res/v1/app-func-layout/theme-infos-app?layoutId=' + layoutId +
                        '&funcModId=' + funcModId,
                    success: function (result) {
                        if ((result.returnCode === 0) && result.body && result.body.length >
                            0) {
                            this.recommendData = (result.body[0].object);
                            this.currentRecomment = this.recommendData[this.count]
                            console.log( 'this.currentRecomment,this.recommendData[this.count]',this.currentRecomment,this.recommendData[this.count])
                        } else {
                            this.tipInfo = '网络错误';
                            this.toastShow();
                        }
                    }.bind(this)
                })
            },
            // 36381 【UAT环境】WAP端：创建计划下单页，选择计划名称，未默认填入UOP配置的产品参数信息
            getInfo(newvalue) {
                // newvalue 是监听的当前轮播图的索引值
                this.sceneNameList.forEach((item, index) => {
                    if (newvalue == index) {
                        let productId = item.productId
                        this.prdId = item.productId
                        this.prdType=item.productType
                        // this.canAutoInvested=item.canAutoInvested
                        // 查询基金详情// this.getFundDetail()
                        if (productId) {
                            $.ajax({
                                url: '/mobile-bff/v1/fund/detailInfo',
                                type: 'post',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    fundId: productId
                                }),
                                success: function (result) {
                                    if (result.returnCode === 0) {
                                        this.fundDetail = result.body;
                                        console.log(' this.fundDetail.fundContractList', this.fundDetail.fundContractList)
                                        this.canPurchase = result.body.canPurchase;
                                        this.canMip = result.body.canMip;
                                        this.prdTitle = result.body.fundNm;
                                        // 如果成功查询到产品信息，则不展示推荐卡片
                                        this.recommentShow = false;
                                    } else {
                                        // this.tipInfo = '网络错误';
                                        // this.toastShow();
                                        this.recommentShow = true
                                        // this.fundDetail = '';
                                        // this.canPurchase = '';
                                        // this.canMip = '';
                                        this.prdTitle = '';
                                    }
                                }.bind(this)
                            })
                        }else{
                            this.recommentShow = true
                            this.prdTitle = '';
                        }
                         // 每次切换的时候重新查询推荐的产品的存入方式  
                         this.inputMode = 'ones'
                         if(item.defaultCycle=='SS' ||item.defaultCycle==''){
                            this.inputMode = 'ones'
                        }else {
                            this.$nextTick(()=>{
                            this.inputMode = 'week'
                            this.cycle=item.defaultCycle
                            this.payDate=item.defaultDayOfCycle
                            console.log( this.inputMode, this.cycle, this.payDate)
                            let index1=''
                            switch (item.defaultCycle) {
                                case 'MM':
                                    index1 = '0';
                                    break;
                                case '2W':
                                    index1 = '1';
                                    break;
                                case 'WW':
                                    index1 = '2';
                                    break;
                                case 'DD':
                                    index1 = '3';
                                    break;
                            }
                            if (this.payDate !== '') {
                                mobileSelect1.initPosition = [index1, this.payDate - 1];
                            } else {
                                mobileSelect1.initPosition = [index1];
                                }
                                mobileSelect1.updateWheels(mobileSelect1.cascadeJsonData)
                                })
                                
                                }
                    }
                })
            },
        // /mobile-bff/v1/fund/detailInfo 获取基金或者组合的金额和协议
        getFundDetail: function () {
            console.log( 'watch',this.prdId)
            if(this.prdId){
                utils.ajax({
                url: '/mobile-bff/v1/fund/detailInfo',
                type: 'post',
                data: JSON.stringify({
                    fundId: this.prdId
                }),
                success: function (result) {
                    if (result.returnCode === 0) {
                        this.fundDetail = result.body;
                        this.canPurchase = result.body.canPurchase;
                        this.canMip = result.body.canMip;
                        this.prdTitle = result.body.fundNm;
                    } else {
                        this.tipInfo = '网络错误';
                        this.toastShow();
                    }
                }.bind(this)
            }) 
            }
           
        },
        getGroupDetail: function () {
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/detailInfo?groupId=' + this.prdId,
                success: function (result) {
                    console.log(result);
                    if (result.returnCode === 0) {
                        this.groupDetail = result.body;
                        this.canPurchase = result.body.canPurchase;
                        this.canAutoInvested = result.body.canAutoInvested;
                        this.prdTitle = result.body.groupname;
                        //动态拼接协议地址
                        $(".group_detail").attr("href", "/mobileEC/wap/fundgroup/mip_contract.html?groupId=" + this.prdId);
                    } else {
                        this.tipInfo = '网络错误';
                        this.toastShow();
                    }
                }.bind(this)
            })
        },
        // 获取现金宝银行卡列表
        getCards: function (prdId, prdType) {
            var tradeScene = '11';  //默认基金场景
            // 基金场景
            (prdType == '1') && (tradeScene = '11');
            // 组合场景
            (prdType == '2') && (tradeScene = '12');
            utils.ajax({
                url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&tradeType=00&fundId=' + prdId + '&tradeScene=' + tradeScene,
                success: function (result) {
                    console.log(result);
                    if ((result.returnCode === 0) && result.body && result.body.bankInfos && result.body.bankInfos.length > 0) {
                        this.cardList = result.body.bankInfos;
                    } else {
                        this.cardList = [];
                    }
                }.bind(this)
            })

        },
        // 选择支付方式
        selectBankCard: function (item) {
            this.bankGrpName = item.bankGrpName,
                this.cashFrom = item.cashFrom,
                this.bankNo = item.bankNo,
                this.bankAcco = item.bankAcco,
                this.bankSerialId = item.bankCardSerialid
        },
        // 打开支付列表
        selectPayWay: function () {
            if (!this.prdId) {
                this.tipInfo = '请选择转入产品';
                this.toastShow();
                return false;
            }
            $('#bankCardList').show();
            $("#bankCardList").click(function () {
                $("#bankCard").html($(this).find(".bank-name").html()).removeClass("gray");
                $("#bankCardList").hide();
            });
        },
        // setSessionData
        setSessionData: function () {
            var params = {
                textLen: this.textLen,
                currentIndex: this.currentIndex,
                inputMode: this.inputMode,
                isAgreement: this.isAgreement,
                isAgreement2: this.isAgreement2,
                recommentShow: this.recommentShow,
                prdType: this.prdType,
                prdTitle: this.prdTitle,
                prdId: this.prdId,
                planTxt: this.planTxt,
                buyAmt: this.buyAmt,
                member: this.member,
                memberId: this.memberId,
                bankGrpName: this.bankGrpName,
                cashFrom: this.cashFrom,
                bankNo: this.bankNo,
                bankAcco: this.bankAcco,
                selectIndexArr: this.selectIndexArr,
                canPurchase: this.canPurchase,
                canMip: this.canMip,
                canAutoInvested: this.canAutoInvested
            };
            utils.setSession('_createInit', JSON.stringify(params));
        },
        // 去allFund页面选取产品
        selectFund: function () {
            this.setSessionData();
            utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
            window.location.href = "/tradeh5/newWap/familyAccount/allFund.html"
        },
        // 选取成员
        selectMember: function () {
            this.setSessionData();
            utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
            window.location.href = "/tradeh5/newWap/familyAccount/selectMember.html"
            // console.log(object);
        },
        // 换一换推荐基金
        refresh: function () {
            var len = this.recommendData.length;
            this.count++;
            (this.count >= len) && (this.count = 0);

            this.currentRecomment = this.recommendData[this.count];
            console.log( '  this.currentRecomment ', this.currentRecomment )
        },
        // 选他
        chooseThis: function () {
            console.log(this.currentRecomment);
            this.prdId = this.currentRecomment.prdId;
            this.prdType = this.currentRecomment.prdType;
            // if(this.prdType=='1'){
            //     this.getFundDetail()
            // }else{
            //     this.getGroupDetail();
            // }

            this.recommentShow = false;

        },
        // tip弹窗我为谁投资
        tipState: function () {
            this.tipInfo =
                '选择一位成员：<br><span style="color:#000">为TA制定专属的投资计划。</span><br>您是这个计划的投资人，可以随时追加、调整投资计划；TA可以随时查看此计划的进展。其他家庭成员默认不可投资和查看此计划。您也可以在计划成功创建后，设置其他家庭成员的查看和投资权限。';
            $('.Bomb-box p').addClass('state');
            $('.Bomb-box').show();
        },
        // tip checkform检查表单格式
        toastShow: function () {
            $('.toast-box').show();
            setTimeout(function () {
                $('.toast-box').hide();
            }, 1800)
        },
        //开启检测
        checkForm: function () {
            if (!this.teamId) {
                this.tipInfo = '网络异常';
                this.toastShow();
                return false;
            }
            if (!(this.planTxt.trim())) {
                this.tipInfo = '请填写心愿计划名称';
                this.toastShow();
                return false;
            }
            if (!this.prdId) {
                console.log(this.prdId)
                this.tipInfo = '请先选择转入产品';
                this.toastShow();
                return false;
            }
            if ((!this.buyAmt) || (Number(this.buyAmt) < (this.checkMinNum))) {
                this.tipInfo = '您输入的购买金额小于最低购买额度';
                this.toastShow();
                return false;
            }
            if ((!this.member) && (!this.memberId)) {
                this.tipInfo = '请选择为哪个成员投资';
                this.toastShow();
                return false;
            }
            if (this.inputMode == "ones") {
                if (this.ruleList.length > 0) {
                    if (!(this.isAgreement2.length === this.ruleList.length)) {
                        this.tipInfo = '请阅读并勾选服务条款';
                        this.toastShow();
                        return false;
                    }
                } else {
                    if (!this.isAgreement) {
                        this.tipInfo = '请阅读并勾选服务条款';
                        this.toastShow();
                        return false;
                    }
                }
            } else {
                if (!this.isAgreement) {
                    this.tipInfo = '请阅读并勾选服务条款';
                    this.toastShow();
                    return false;
                }
            }
            if (this.prdType == '1') {
                if ((this.canMip != '1') && (this.inputMode == "week")) {
                    this.tipInfo = '当前产品状态不支持定投';
                    $('.Bomb-box p').removeClass('state');
                    $('.Bomb-box').show();
                    return false;
                }
                if (this.canPurchase != '1') {
                    this.tipInfo = '当前产品状态不支持购买';
                    $('.Bomb-box p').removeClass('state');
                    $('.Bomb-box').show();
                    return false;
                }
            } else {
                console.log('this.canAutoInvested',this.canAutoInvested,this.inputMode)
                if ((this.canAutoInvested != 'Y') && (this.inputMode == "week")) {
                    this.tipInfo = '当前产品状态不支持定投';
                    $('.Bomb-box p').removeClass('state');
                    $('.Bomb-box').show();
                    return false;
                }
                if (this.canPurchase != 'Y') {
                    this.tipInfo = '当前产品状态不支持购买';
                    $('.Bomb-box p').removeClass('state');
                    $('.Bomb-box').show();
                    return false;
                }
            }

            return true;
        },
        // 开启计划
        openPlan: function () {
            if (this.checkForm()) {
                console.log('通过了所有检查');
                // 基金申购
                if (this.prdType == '1' && this.inputMode == "ones") {
                    this.addPlan().then((result) => {
                        // return;
                        this.fundPurchase(result);
                    }).catch((error) => {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    })
                }
                // 组合申购
                if (this.prdType == '2' && this.inputMode == "ones") {
                    this.addPlan().then((result) => {
                        this.fundGroupPurchase(result);
                    }).catch((error) => {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    })
                }
                // 基金定投
                if (this.prdType == '1' && this.inputMode == "week") {
                    this.addPlan().then((result) => {
                        this.fundMipCreate(result);
                    }).catch((error) => {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    })
                }
                // 组合定投
                if (this.prdType == '2' && this.inputMode == "week") {
                    this.addPlan().then((result) => {
                        this.fundGroupMipCreate(result);
                    }).catch((error) => {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    })
                }

            }
        },
        // 开启计划接口
        addPlan: function () {
            return new Promise((resolve, reject) => {
                var accptMd ="WAP";
                if(isApp()){
                    accptMd="MOBILE";
                }
                var params = {
                    acceptMode: accptMd,
                    branchCode: "247",
                    cycle: this.cycle,
                    memberId: this.memberId,
                    payDate: this.payDate,
                    planName: this.planTxt,
                    teamId: this.teamId
                }
                if (this.inputMode == "ones") {
                    params.planAmount = this.buyAmt;
                }
                if (this.inputMode == "week") {
                    params.periodAmount = this.buyAmt;
                }
                utils.ajax({
                    url: '/sfs/v1/accounts/plans',
                    type: 'POST',
                    data: params,
                    success: function (result) {
                        // console.log(result);
                        if (result.returnCode === 0) {
                            utils.setSession('_setAccountId', result.body.accountId);
                            resolve(result.body);
                        } else {
                            reject(result);
                        }
                    }.bind(this)
                })
            })

        },
        // 基金申购
        fundPurchase: function (result) {
            var params = {
                bankAcco: this.bankAcco,
                bankNo: this.bankNo,
                cashFrm: this.cashFrom,
                currencyType: "156",
                fundId: this.prdId,
                shareType: "A",
                status: "",
                subAmt: this.buyAmt,
                teamId: this.teamId,
                arAcct: result.arAcct,
                bankSerialId: this.bankSerialId
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund/fund-purchase',
                type: 'POST',
                data: params,
                success: function (result) {
                    console.log(result, "这里是基金申购");
                    if (result.returnCode === 0) {
                        utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/familyAccount/planSuccess.html')
                        utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
                        utils.verifyTradeChain(result.body);
                    } else {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    }
                }.bind(this)
            })
        },
        // 组合申购
        fundGroupPurchase: function (result) {
            var params = {
                bankAcco: this.bankAcco,
                bankNo: this.bankNo,
                cashFrm: this.cashFrom,
                groupId: this.prdId,
                shareType: "A",
                tradeTp: "P",
                transferType: "M",
                purType: this.cashFrom == 'V' ? '' : 'B',
                amt: this.buyAmt,
                teamId: this.teamId,
                arAcct: result.arAcct,
                bankSerialId: this.bankSerialId
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/fundgroup-purchase',
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/familyAccount/planSuccess.html')
                        utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
                        utils.verifyTradeChain(result.body);
                    } else {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    }

                }.bind(this)
            })
        },
        // 基金定投
        fundMipCreate: function (result) {
            var params = {
                mipKind: "1",
                cashFrm: this.cashFrom,
                shareType: "A",
                mipcycle: this.cycle,
                mipbuyday: this.payDate,
                isOrderImmediately: "0", //是否立刻定投一笔 0:否 1:是
                isOpenTargetProfit: "N",
                isSupportStrategy: "0",
                bankAcco: this.bankAcco,
                bankNo: this.bankNo,
                currencyType: "156",
                fundId: this.prdId,
                mipbuyamt: this.buyAmt,
                teamId: this.teamId,
                arAcct: result.arAcct,
                mipDesc: result.planName,
                bankSerialId: this.bankSerialId
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund/fund-mip-create',
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/familyAccount/planSuccess.html')
                        utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
                        utils.verifyTradeChain(result.body);
                    } else {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    }
                }.bind(this)
            })
        },
        // 组合定投
        fundGroupMipCreate: function (result) {
            var params = {
                mipKind: "0",
                cashFrm: this.cashFrom,
                shareType: "A",
                mipcycle: this.cycle,
                mipbuyday: this.payDate,
                isOrderImmediately: "0", //是否立刻定投一笔 0:否 1:是
                isOpenTargetProfit: "N", //是否开启目标收益率设置 Y:是 N:否
                isSupportStrategy: "0",
                bankAcco: this.bankAcco,
                bankNo: this.bankNo,
                currencyType: "156",
                groupId: this.prdId,
                mipbuyamt: this.buyAmt,
                tradeTp: "P",
                teamId: this.teamId,
                arAcct: result.arAcct,
                mipDesc: result.planName,
                bankSerialId: this.bankSerialId
            }
            utils.ajax({
                url: '/mobile-bff/v1/fund-group/fundgroup-mip-create',
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/familyAccount/planSuccess.html');
                        utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
                        utils.verifyTradeChain(result.body);
                    } else {
                        this.tipInfo = '请求超时，请稍后重试';
                        $('.Bomb-box p').removeClass('state');
                        $('.Bomb-box').show();
                    }
                }.bind(this)
            })
        },

    },
    updated() {
        if (this.status) return;
        this.status = true;
        var that = this;
        var mySwiper = new Swiper('.rotate-box .swiper-container', {
            initialSlide: (utils.getSession(utils.getCookie('sso_cookie_ext_dp')) ? -1 : 0),
            effect: 'coverflow',
            loop: true,
            slidesPerView: 2.3,
            centeredSlides: true,
            spaceBetween: 16,
            coverflowEffect: {
                rotate: 0,
                stretch: 0, // slide左右距离
                depth: 100, // slide前后距离
                modifier: 1,
                slideShadows: false
            },
            loopedSlides: 5,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            on: {
                tap: function () {
                    if (this.realIndex === 0) {
                        that.planTxt = that.sceneNameList[0].planTypeName;

                    }
                },
                transitionEnd: function () {
                    that.currentIndex = this.realIndex;
                },
            },

        });
        this.init(mySwiper);
    }
})