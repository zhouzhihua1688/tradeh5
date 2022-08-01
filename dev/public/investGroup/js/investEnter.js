var vm = new Vue({
  el: '#app',
  data() {
    return {
      inputValue: '', //输入的值
      chinese: '', //金额转显示中文
      amount: [ //选择默认金额
        {
          a: 2000,
          value: '2000'
        }, {
          a: 5000,
          value: '5000'
        }, {
          a: 10000,
          value: '10000'
        },
      ],
      number: '', //切换选择金额样式索引
      bgIndex: 0, //勾选协议小图标用 0不勾选，1勾选
      showAccount: false, //隐藏选择已有账户用
      showDue: false, //隐藏选择到期处理方式
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
      // check自定义账户名
      checkCompliance:null,
      forwardUrl: encodeURIComponent(window.location.href),
      iKnow: false,
      localCountDown: 8,
      agreeTimer: null,
      //推荐码
      recommendNo: '',
      dueType: '01',//01默认续期，00赎回
	  dueList:[],  
	  isShowBecomeDue:false,
	  //统一文案信息
	  tipsInfo:{}    
    };

  },
  created() {
    this.queryParams.groupId = utils.getUrlParam('groupId');
    this.queryParams.arAccts = utils.getUrlParam('arAccts');
    this.getGroupInfo(this.queryParams.groupId);
    this.getProductRiskLevel(this.queryParams.groupId);
    this.getBankList(this.queryParams.groupId);
    this.getXjbBalance();
	this.getTipsInfo();
    if (this.queryParams.arAccts) {
      // 追加情况
      this.getAcctInfo(this.queryParams.arAccts);
    } else {
      this.getDefaultName(this.queryParams.groupId);
      this.getAcctList();
    }
    // 合规
    this.checkCompliance = this.debounce(this.checkInvestName,2000)
  },
  mounted: function () {
    this.showInviteCode();
  },
  computed: {
    acctMode() {
      // 展示账户的两种模式 
      // 1.追加模式 2.非追加模式
      if (this.queryParams.arAccts) {
        return 1
      } else {
        return 2
      }
    },
    currentAcctType() {
      return typeof this.currentAcct
    },
    // 底部按钮显示的交互
    footerActvie(){
      if(this.bgIndex==1&&this.inputValue){
        return true
      }else{
        return false
      }
    },
    countDownBlock() {
      return this.iKnow ? '我知道了' : '我知道了' + this.localCountDown + 's';
    },
    toggleGroupType(){
      return Object.keys(this.groupInfo).length>0?this.groupInfo.investType:''
    },
	dueName(){
		var obj = this.dueList.find((item)=>{
			return item.operation == this.dueType
		})
		if(obj){
			return  obj.title
		}
	},
	investTypeTips() {
		if(this.groupInfo.investType == 'M'&&this.tipsInfo.adviserAutoAdjustTips){
			return this.tipsInfo.adviserAutoAdjustTips.unificationValue
		}else if(this.groupInfo.investType == 'G'&&this.tipsInfo.adviserManualAdjustTips){
			return this.tipsInfo.adviserManualAdjustTips.unificationValue
		}else{
			return ''
		}
	},
  },
  watch: {
    inputValue(newval, oldval) {
      var val = newval;
      if(val.toString().indexOf(".") > 0 && Number(val.toString().split(".")[1].length) > 2){
        console.log('123123123');
        val = Math.floor(val * 100)/100; 
        this.inputValue = Math.floor(val * 100)/100; 
      } 
      this.chinese = this.changeNumMoneyToChinese(val); //转换成中文金额大写格式  
      if(this.number!=='' && this.amount[this.number].value!==newval){
        this.number = '';   // 2000元,5000元,10000元的标签选中状态重置
      }
    },
    currentAcct(newval, oldval) {
      if (typeof newval === 'string') {
        this.currentAcctName = newval;
      } else {
        this.currentAcctName = newval.arAcctName ? newval.arAcctName : newval.arAcctNm;
      }
    },
    currentAcctName(newval,oldval){
      // 可编辑状态
      if(this.currentAcctType==='string'){
        this.checkCompliance(newval);
      }
    },
  },
  methods: {
    // 获取投顾详情
    getGroupInfo(groupId) {
      utils.ajax({
        url: '/mobile-bff/v1/fund-group/detailInfo?groupId=' + groupId,
        success: function (result) {
          console.log(result);
          //投顾组合详情 
          this.groupInfo = result.body;
          // 底部协议列表
          this.adviserContractList = result.body.adviserContractList;
          this.pdfInfo = this.adviserContractList.filter((item) => {
            return item.displayMode == '1'
          })[0];
		  if(result.body.isTargetProfit=='1'){
			this.isShowBecomeDue = true;
			this.dueList = result.body.fundgroupTargetDetailVO.endOptionOperationList;
			this.dueType = result.body.fundgroupTargetDetailVO.endDefaultOperation;
		  }
          // 调用预检查申购接口
          this.prePurchase();
        }.bind(this)
      })
    },
    //获取银行卡列表
    getBankList(groupId) {
      utils.ajax({
        url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=' + groupId + '&tradeType=00&tradeScene=12',
        success: function (result) {
          // console.log(result);
          this.payAllInfo = result.body;
          this.bankList = result.body.bankInfos;
          this.currentPayInfo = result.body.bankInfos.filter((item) => {
            // 默认选择现金宝
            return item.cashFrom == 'V';
          })[0];
        }.bind(this)
      })
    },
	// 统一文案查询入口
	getTipsInfo(){
		utils.ajax({
			url: '/mobile-bff/v1/unification/query?keys=adviserTradeRuleTips,adviserManualAdjustTips,adviserAutoAdjustTips',
			success: function (result) {
				this.tipsInfo = result.body;
			}.bind(this)
		})
	},
	// 显示调仓方式文案
	showInvestTypeTips(){
		$(".Bomb-box .Bomb-box-main .Bomb-box-content p").html(this.investTypeTips)
		$(".Bomb-box").show();         
	},
    //邀请码相关文案
    showRecommenderTip(){
      var url = "/mobile-bff/v1/unification/query?keys=recommenderTip"
      utils.get(url,null,function(result){
          if(result.body && result.body.recommenderTip){
              var recommenderTip = result.body.recommenderTip;
              var unificationValue = recommenderTip.unificationValue ? recommenderTip.unificationValue: '';
              $(".Bomb-box .Bomb-box-main .Bomb-box-content p").html(unificationValue)
              $(".Bomb-box").show();            
          }
      }) 
    },
    //是否展示邀请码
    showInviteCode(){
      var rcmdNo = utils.getUrlParam('rcmdNo'); //20220524 补充页面入参推荐人
      this.recommendNo = rcmdNo;

      var url = "/res/v1/app-func-layout/layout/theme-infos-config-app?layoutId=adviserPurchaseRecommenderSwitch&objectId=";
      var fundId = utils.getUrlParam("groupId");
      url += fundId;
      utils.get(url,null,function(result){
          if(result.body && result.body[0] && result.body[0].object.length > 0){
              $('#invitationCode').show();
          }
      })
    },
    //隐藏弹窗
    hideBomb(){
      $(".Bomb-box").hide();
    },
    // 底部协议点击留痕
    adviserContractMark(groupId) {
      let params = {};
      let agreementIds = this.adviserContractList.map((item) => {
        return item.contractCategory;
      }).join(',');
      params.reminderType = '';
      params.agreementIds = agreementIds;
      params.agreementStatus = this.bgIndex;
      params.confirmStatus = this.bgIndex;
      params.fundIdToFundRiskLevelMap = {};
      params.fundIdToFundRiskLevelMap[groupId] = this.productLevel;
      utils.ajax({
        url: '/mobile-bff/v1/common/customer-risk-leave-mark',
        type: 'POST',
        data: params,
        success: function (result) {
          // console.log(result);

        }.bind(this)
      })
    },
    // 获取产品风险等级
    getProductRiskLevel(productId) {
      utils.ajax({
        url: '/mobile-bff/v1/common/check-union-risk-level?productId=' + productId,
        success: function (result) {
          this.productLevel = result.body.productLevel;
        }.bind(this)
      })
    },
    // 投顾申购预检查
    prePurchase(callback) {
      let groupId = this.queryParams.groupId;
      let _this = this;
      let jumpUrl = '/mobileEC/wap/common/riskTest.html?forwardUrl='+this.forwardUrl;
      utils.ajax({
        url: '/mobile-bff/v1/fund-group/pre-investment-purchase?groupId=' + groupId,
        success: function (result) {
          let res = result.body;
          if (res.code == '9990') {
            // 未作测评
            return utils.showTips({
              title: '您还未完成风险测评',
              content: res.msg,
              confirmText: '我知道了',
              complete: function () {
                // 跳转风险测评
                _this.alertContractMark();
                setTimeout(() => {
                  window.location.href = jumpUrl;
                }, 1000)
              }
            })
          }
          if (res.code == '9991') {
            // 测评过期
            return utils.showTips({
              title: '请重新完成风险测评',
              content: res.msg,
              confirmText: '我知道了',
              complete: function () {
                // 跳转风险测评
                _this.alertContractMark();
                setTimeout(() => {
                  window.location.href = jumpUrl;
                }, 1000)
              }
            })
          }
          if (res.code == '9993') {
            // 风险等级不匹配
            return utils.showTips({
              content: res.msg,
              confirmText: '我知道了',
              complete: function () {
                // 跳转风险测评
                _this.alertContractMark();
                setTimeout(() => {
                  window.location.href = jumpUrl;
                }, 1000)
              }
            })
          }
          // 完全匹配则强制弹窗（倒计时psd弹窗）
          if (res.serialNo) {
            this.verifySerialNo = res.serialNo;
            if(typeof callback == 'function'){
              return callback();
            }
            this.protocolShow = true;
            this.localCountDown = 8;
            this.agreeTimer = setInterval(() => {
              this.localCountDown--;
              if (this.localCountDown == 0) {
                clearInterval(this.agreeTimer);
                this.iKnow = true;
              }
            }, 1000);
          }
        }.bind(this)
      })
    },
    agreementClose() {
      this.protocolShow = false;
      this.agreeTimer && clearInterval(this.agreeTimer);
    },
    // 投顾风险确认风险留痕(弹窗确定按钮留痕)
    alertContractMark() {
      utils.ajax({
        url: '/mobile-bff/v1/confirm/cannot-buy-highrisk-products',
        type: 'POST',
        success: function (result) {
          // 不做处理
        }.bind(this)
      })
    },
    // 强弹窗关闭
    pdfConfirm() {
      if (!this.iKnow) return false;
      this.protocolShow = false;
      this.alertContractMark();
    },
    // 默认账户名称
    getDefaultName(productId) {
      utils.ajax({
        url: '/ias/v1/acct/default-name?productId=' + productId,
        success: function (result) {
          this.currentAcct = result.body;
          this.defaultName = result.body;
        }.bind(this)
      })
    },
    // 根据合约账号查询账户详情(追加情况)
    getAcctInfo(arAcct) {
      utils.ajax({
        url: '/icif/v1/ar-accts/query-by-ar-acct?arAcct=' + arAcct,
        success: function (result) {
          this.currentAcct = result.body;
        }.bind(this)
      })
    },
    // 查询用户已有投顾账户
    getAcctList() {
      utils.ajax({
        url: '/ias/v1/ar-accts/info/base?planType=2',
        success: function (result) {
          // console.log(result);
          this.arAcctList = result.body.arAcctList;
        }.bind(this)
      })
    },
    // 选择账户
    selectArAcct(val) {
      if (val !== 'create') {
        this.currentAcct = this.arAcctList[val];
      }else{
        this.currentAcct = this.defaultName?this.defaultName:''
      }
      this.showAccount = false;
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
     // 检查投顾自定义名称是否合规
     checkInvestName(name){
      let url = '/ias/v1/acct/name/validate?acctName=' + name ;
      utils.ajax({
        url,
        success: function (result) {
          console.log(result);
          if(!result.body){
            this.currentAcctName = ''
          }
        }.bind(this)
      })
    },
    // 投顾下单
    fundgroupPurchase() {
      let params = {};
      params.amt = this.inputValue;
      if (this.currentAcctType == 'string') {
        params.arAcct = '';
        params.arAcctName = this.currentAcctName;
      } else {
        params.arAcct = this.currentAcct.arAcct;
        params.arAcctName = this.currentAcct.arAcctName ? this.currentAcct.arAcctName : this.currentAcct.arAcctNm;
      }
      if (this.currentPayInfo.cashFrom == 'B') {
        params.bankAcco = this.currentPayInfo.bankAcco;
        params.bankNo = this.currentPayInfo.bankNo;
        params.bankSerialId = this.currentPayInfo.bankCardSerialid
      }
      params.cashFrm = this.currentPayInfo.cashFrom;
      params.groupId = this.queryParams.groupId;
      params.investType = this.groupInfo.investType;
      params.isInvestment = this.groupInfo.isInvestment;
      params.verifySerialNo = this.verifySerialNo;
      params.purType = "B"; //B申购R认购
      params.shareType = "A";
      params.recommendNo = this.recommendNo;
	  this.isShowBecomeDue&&(params.dueType = this.dueType);//止盈或过期处理方式只在目标盈的情况下传值
      // console.log(params);
      utils.ajax({
        url: '/mobile-bff/v1/fund-group/fundgroup-purchase',
        type: 'POST',
        data: params,
        success: function (result) {
          // console.log(result);
          utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/investGroup/result.html?type=sg')
          utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
          utils.verifyTradeChain(result.body);
        }.bind(this)
      })
    },
    buy() {
      // 如果底部按钮不亮
      if(!this.footerActvie){
        return;
      }
      if(this.currentAcctType=='string'){
        if(this.currentAcctName==''){
          utils.showTips('账户名称不能为空');
          return;
        }
      }else{
        if(Object.keys(this.currentAcct).length===0){
          utils.showTips('账户名称不能为空');
          return;
        }
      }
      if(Number(this.inputValue)<Number(this.groupInfo.initLimitAmount)){
        utils.showTips('金额不得低于最低申购金额'+this.groupInfo.initLimitAmount+'元');
        return;
      }
      if(this.currentPayInfo.cashFrom == 'V' && Number(this.inputValue)>Number(this.xjbBalance)){
        utils.showTips({
          content: '现金宝余额不足，请立即充值',
          showCancel: true, //是否显示取消按钮，默认false
          confirmText: '去充值', //确认按钮文字，默认确定
          complete: function() { //需使用bind()
            window.location.href='/mobileEC/wap/account/topup.html?forwardUrl='+this.forwardUrl;
          }.bind(this)
        });
        return;
      }
      // 下单前，必须使用最新的verifySerialNo
      this.prePurchase(this.fundgroupPurchase);
    },

    // 公共方法
    // 防抖
    debounce(fn, delay){
      var timer = null; // 声明计时器
      return function() {
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

    // 选择已有账户浮框
    chooseAccount: function () {
      this.showAccount = true
    },
    // 关闭选择账户的浮框
    closeAccount: function () {
      this.showAccount = false
    },
    // 选择支付方式
    choosePay: function (index) {
      this.currentPayInfo = this.bankList[index];
      this.showCard = false;
    },
    //勾选同意协议的小图标用
    checkBox: function (index) {
      if (this.bgIndex == 1) {
        this.bgIndex = 0;
      } else {
        this.bgIndex = 1;
      }
      this.adviserContractMark(this.queryParams.groupId);
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

    // 协议跳转
    openAgreementLink(item) {
      if (!item) {
          return false;
      }
      let itemUrl = item.agreementLinkUrl;
      let linkType = item.agreementLinkType;
      itemUrl = String(itemUrl).replace(/^\/\//, window.location.protocol + '//');
      if (isApp()) {
          if (itemUrl.slice(0, 13) == 'htffundxjb://') {
              window.location.href = itemUrl;
          } else {
              if (linkType == 'pdf') {
                  window.location.href = 'htffundxjb://action?type=url&linkType=pdf&link=' + btoa(itemUrl);
              } else {
                  window.location.href = 'htffundxjb://action?type=url&link=' + btoa(itemUrl);
              }
          }
      } else {
          window.location.href = itemUrl;
      }
    },
  },
  filters: {
    // 调仓方式
    investTypeTransfer(val) {
      if (val == 'M') {
        val = '自动调仓'
      } else if (val == 'G') {
        val = '手动调仓'
      }
      return val;
    },
  }
})