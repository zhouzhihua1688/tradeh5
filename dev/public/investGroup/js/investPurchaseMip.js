let vm=new Vue({
  el: '#app',
  data() {
    return {
      inputValue: '', //输入的值
      chinese: '', //金额转显示中文

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
      // 扣款周期
      mip:{},
      // 下次扣款日期
      nextMipDate:'',
      // check
      checkCompliance:null,
      forwardUrl: encodeURIComponent(window.location.href),
      iKnow: false,
      localCountDown: 8,
      agreeTimer: null,
    }
  },
  created() {
    this.queryParams.groupId = utils.getUrlParam('groupId');
    this.queryParams.arAccts = utils.getUrlParam('arAccts');
    this.getGroupInfo(this.queryParams.groupId);
    this.getProductRiskLevel(this.queryParams.groupId);
    this.getBankList(this.queryParams.groupId);
    this.getXjbBalance();
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
  mounted() {
    // 日期选择插件
    var _this = this;
    _this.mip = {
      "mipcycle": "MM",
      "mipbuyday": "1",
    };
    var chooseTime = {
      "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
      "2W": ["周一", "周二", "周三", "周四", "周五"],
      "WW": ["周一", "周二", "周三", "周四", "周五"],
      "ED": [],
      "DD": []
    };
    $(".selected-deduction-cycle").click(function (event) {
      event.preventDefault();
      $(".choose-time").show();
      $(".appDate").blur();
      return false
    });

    $(".choose-time").click(function (event) {
      var li = $(event.target).parents("li");
      if (li.length == 0) {
        $(".choose-time").hide();
        return
      };
      var time = chooseTime[li.attr("data-choose-time")],
        str = "";
      setMipCycle(li.attr("data-choose-time"));
      li.addClass("on").siblings("li").removeClass("on");
      if (time.length == 0) {
        $(".choose-time").hide();
        $(".appDate").attr("data-time", li.find("div").text());
        $(".appDate").html(li.find("div").text());
        _this.mip.mipcycle = "ED";
        delete _this.mip.mipbuyday;
        // queryAutoRechargePageInfo();
        return;
      } else {
        if (!li.hasClass("on")) {
          for (var i = 0; i < time.length; i++) {
            str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
          };
          $(".choose-time2 ul").html(str);
          $(".appDate").attr("data-time", li.find("div").text())
        } else {
          for (var i = 0; i < time.length; i++) {
            str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
          };
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
      };
      $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
      // queryAutoRechargePageInfo();
      $(this).hide()
    });
    function setMipCycle(mipCycle) {
      _this.mip.mipcycle = mipCycle;
    };
    function setMipBuyday(mipBuyday) {
      _this.mip.mipbuyday = mipBuyday;
    };

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
    }
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
    },
    currentAcct(newval, oldval) {
      if (typeof newval === 'string') {
        this.currentAcctName = newval;
      } else {
        this.currentAcctName = newval.arAcctName ? newval.arAcctName : newval.arAcctNm;
      }
    },
    mip:{
      handler:function(newval,oldval){
        console.log(newval);
        if(newval.mipbuyday){
          this.getNextDate(newval.mipcycle,newval.mipbuyday)
        }else{
          this.getNextDate(newval.mipcycle)
        }
      },
      deep:true
    },
    currentAcctName(newval,oldval){
      // 可编辑状态
      if(this.currentAcctType==='string'){
        this.checkCompliance(newval);
      }
    }
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
          // 调用预检查申购接口
          this.prePurchase();
        }.bind(this)
      })
    },
    //获取银行卡列表
    getBankList(groupId) {
      utils.ajax({
        url: '/mobile-bff/v1/pay/pay-bank-list?currencyType=156&fundId=' + groupId + '&tradeType=05&tradeScene=12',
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
      } else {
        this.currentAcct = this.defaultName ? this.defaultName : ''
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
    // 查询下次扣款日期
    getNextDate(mipCycle, mipDt) {
      // mobile-bff/v1/fund/fund-mip-last-period-date
      let url = '/mobile-bff/v1/fund/fund-mip-last-period-date?mipCycle=' + mipCycle ;
      if(mipDt){
        url+='&mipDt=' + mipDt
      }
      utils.ajax({
        url,
        success: function (result) {
          this.nextMipDate = result.body.nextMipDate
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
    // 投顾定投下单
    fundgroupPurchaseMip() {
      let params = {};
      params.mipbuyamt = this.inputValue;
      params.mipbuyday = this.mip.mipbuyday?this.mip.mipbuyday:'';
      params.mipcycle = this.mip.mipcycle;
      params.nextBuyDate = this.nextMipDate;
      params.arAcctType  = '01';//01投顾
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
      params.branchCode = "247";
      console.log(params);
      // return;
      utils.ajax({
        url: '/mobile-bff/v1/fund-group/fundgroup-mip-create',
        type: 'POST',
        data: params,
        success: function (result) {
          // console.log(result);
          utils.setSession(utils.serialNo_forword_url, '/tradeh5/newWap/investGroup/result.html?type=dt')
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
        utils.showTips('金额不得低于最低定投金额'+this.groupInfo.initLimitAmount+'元');
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
      this.prePurchase(this.fundgroupPurchaseMip);
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
    //勾选同意协议的小图标用
    checkBox: function (index) {
      if (this.bgIndex == 1) {
        this.bgIndex = 0;
      } else {
        this.bgIndex = 1;
      }
      this.adviserContractMark(this.queryParams.groupId);
    },
    // 清除input输入框和中文显示的值
    close: function () {
      this.inputValue = '';
      this.chinese = '';
    },
    // 显示支付方式的浮框
    choosePay: function (index) {
      this.currentPayInfo = this.bankList[index];
      this.showCard = false;
    },
    // 关闭支付方式的浮框
    closePay: function () {
      this.showCard = false
    },
    // 选择已有账户浮框
    chooseAccount: function () {
      this.showAccount = true
    },
    // 关闭选择账户的浮框
    closeAccount: function () {
      this.showAccount = false
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
  }
})