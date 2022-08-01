const vm = new Vue({
  el: '#app',
  data() {
    return {
      toggleGroupId: '', // 选中的目标组合，用来更新协议的链接和展示
      toggleGroupType: 'M',    //  选中的目标升级投顾组合类型，管理型M，一般型G
      contractListObj: {}, // 存放groupId对应的协议内容 
      programme: utils.getUrlParam('programme'), // 20211126新增url参数，01：稳健策略只选中第一个，02：稳健策略只选中第二个
      marketValue: utils.getUrlParam('marketValue'), // 20211126新增url参数，01：稳健策略只选中第一个，02：稳健策略只选中第二个
      allData: [],
      groupInfo: {
        groupId: '',
        groupName: ''
      },
      protocolShow: false,
      // // 需要的产品和用户的风险详情
      // productRiskInfo: [],   // 20211223 废弃，用各个产品的详情接口investRiskLevel判断
      // 需要留痕的产品列表
      riskfundList:[],
      // 投顾类型 G 一般型 M 管理型 默认管理型
      iKnow:false,
      localCountDown:8,
      agreeTimer:null,
      // agreementUrl:.replace(/^http.*?99fund\.com.*?\//g, window.location.origin + '/')
   
      // 12.07新需求
      signAgreementShow: false,
      contractList: [],   // 协议列表
      // 产品信息列表
       // 9582--添加固定文案逻辑
       contentList: [
        // groups的第一个都是管理型M第二个都是G一般型
        {
          groups: ['A6101', 'A6109'],
          investTarget: '现金管理',
          title2: '债券资产占比',
          assetPostion: '0-60%',
          targetYearYield: '2.5%-3.5%',
          targetRetreat: '0.5%',
          RecommendedHoldingTime: '1个月以上',
          desc: '优质货币基金结合债券基金的配置策略，力争获得相比货币基金同期回报较高的超额收益水平。',
          label: ['低风险(R1)', '闲钱管理', '短期理财']
        },
        {
          groups: ['A6102', 'A6110'],
          investTarget: '理财升级',
          title2: '权益资产占比',
          assetPostion: '13%-23%',
          targetYearYield: '7%-9%',
          targetRetreat: '5%',
          RecommendedHoldingTime: '6个月以上',
          desc: '以债券基金为主，适度配置混合类及权益类基金，力争获得稳健收益。',
          label: ['中低风险(R2)', '精选债基', '追求稳健']
        },
        {
          groups: ['A6103', 'A6111'],
          investTarget: '追求高收益',
          title2: '权益资产占比',
          assetPostion: '90%-98%',
          targetYearYield: '18%-25%',
          targetRetreat: '25%',
          RecommendedHoldingTime: '2年以上',
          desc: '精选优秀基金经理和基金产品，运用均衡配置理念，力争获得长期稳健的权益投资回报。',
          label: ['中风险(R3)', '精选权益', '长期投资']
        },
        {
          groups: ['A6104', 'A6112'],
          investTarget: '低波稳健',
          title2: '权益资产占比',
          assetPostion: '13%-23%',
          targetYearYield: '7%-9%',
          targetRetreat: '5%',
          RecommendedHoldingTime: '长期持有',
          desc: '以债券基金为主，适度配置混合类及权益类基金，力争获得稳健收益。',
          label: ['中低风险(R2)', '教育主题', '长期投资']
        },
        {
          groups: ['A6105', 'A6113'],
          investTarget: '稳健增长',
          title2: '权益资产占比',
          assetPostion: '28%-38%',
          targetYearYield: '10%-14%',
          targetRetreat: '10%',
          RecommendedHoldingTime: '长期持有',
          desc: '精选优质基金达到风险收益的优化平衡，实现基金资产的长期增值。',
          label: ['中低风险(R2)', '养老主题', '45岁以上']
        },
        {
          groups: ['A6106', 'A6114'],
          investTarget: '稳健增长',
          title2: '权益资产占比',
          assetPostion: '53%-63%',
          targetYearYield: '12%-18%',
          targetRetreat: '12%',
          RecommendedHoldingTime: '长期持有',
          desc: '精选优质基金达到风险收益的优化平衡，实现基金资产的长期增值。',
          label: ['中风险(R3)', '养老主题', '35-45岁']
        },
        {
          groups: ['A6107', 'A6115'],
          investTarget: '稳健增长',
          title2: '权益资产占比',
          assetPostion: '68%-78%',
          targetYearYield: '15%-20%',
          targetRetreat: '18%',
          RecommendedHoldingTime: '长期持有',
          desc: '精选优质基金达到风险收益的优化平衡，实现基金资产的长期增值。',
          label: ['中风险(R3)', '养老主题', '35岁以下']
        },
        {
          groups: ['A6108', 'A6116'],
          investTarget: '理财升级',
          title2: '权益资产占比',
          assetPostion: '13%-23%',
          targetYearYield: '7%-9%',
          targetRetreat: '5%',
          RecommendedHoldingTime: '6个月以上',
          desc: '以债券基金为主，适度配置混合类及权益类基金，力争获得稳健收益。',
          label: ['中低风险(R2)', '精选债基', '追求稳健']
        },
        {
          groups: ['A6119', 'A6128'],
          investTarget: '理财升级',
          title2: '权益资产占比',
          assetPostion: '13%-23%',
          targetYearYield:'x%-xx%',
          targetRetreat:'xxx%',
          RecommendedHoldingTime: '6个月以上',
          desc: '精选全市场优秀基金经理和基金产品，在力争严控组合中期回撤水平、回撤最大回复天数的基础之上，力争获得具有市场竞争力的收益空间。',
          label: ['中低风险(R2)', '稳健严选']
        },
        {
          groups: ['A6120', 'A6129'],
          investTarget: '追求高收益',
          title2: '权益资产占比',
          assetPostion: '90%-98%',
          targetYearYield:'x%-xx%',
          targetRetreat:'xxx%',
          RecommendedHoldingTime: '2年以上',
          desc: '精选全市场优秀基金经理和基金产品，根据市场动态调整组合的beta暴露水平，力争在中长期维度上获取超额收益。',
          label: ['中风险(R3)', '权益严选']
        },
        
      ],
    }
  },
  created() {
    console.log(utils.getUrlParam('programme'));
    console.log(this.programme);
    this.groupInfo.groupId = utils.getUrlParam('groupId');
    this.groupInfo.groupName = utils.getUrlParam('groupName');
    this.getPageData(this.groupInfo.groupId);
    this.getRiskInfo();
   
    // 20211227 持有金额，如果没在url参数传递过来，根据groupId查询当前用户的持有金额
    !this.marketValue && this.getHoldingAmount(this.groupInfo.groupId);
  },
  
  computed: {
    // 默认数据
    firstData() {
      return this.allData.upgradeAssetDetail ? this.allData.upgradeAssetDetail.toProducts : []
    },
    // 备选数据
    otherData() {
      return this.allData.otherUpgradeTargetGroups ? this.allData.otherUpgradeTargetGroups : []
    },
    // 协议内容展示
    contractList() {
      // <a href="javascript:;">汇添富基金管理股份有限公司投资顾问服务协议</a>、
      // <a href="javascript:;">基金投资组合策略方案说明书</a>、<a href="javascript:;">管理型投顾风险揭示书</a>
      return this.contractListObj[this.toggleGroupId];
    },
    pdfInfo(){
      return this.firstData[0]&&this.allData[this.firstData[0].defaultToProduct]&&this.allData[this.firstData[0].defaultToProduct].adviserContractList.find((item)=>{
        return item.displayMode == '1'
      })
    },
    currentParams(){
      let params = [];
      let prop = {};
      prop.convertOutAssets = this.allData.upgradeAssetDetail?this.allData.upgradeAssetDetail.convertOutAssets:{};
      // return
      this.firstData.forEach((item) => {
        if (item.defaultOption === true && item.isCheckedAuto === 'Y') {
          prop.defaultToProduct = item.defaultToProduct
        } else if (item.defaultOption === true && item.isCheckedAuto === 'N') {
          prop.defaultToProduct = item.otherToProduct
        }
      })
      this.otherData.forEach((item) => {
        if (item.defaultOption === true && item.isCheckedAuto === 'Y') {
          prop.defaultToProduct = item.defaultToProduct
        } else if (item.defaultOption === true && item.isCheckedAuto === 'N') {
          prop.defaultToProduct = item.otherToProduct
        }
      })
      params.push(prop);
      return params
    },
    countDownBlock(){
      return this.iKnow?'我知道了':'我知道了'+this.localCountDown+'s';
    },
    // 20211211 注释掉，改为m/g/all共三个协议，按情况分别展示
    // iframeUrl(){
    //   // 同源策略限制，iframe内嵌网页访问失败，所以把协议页面放到当前包内
    //   return './invest_adviser_agreement_m.html';
    //   // if(utils.isProdEnv()){
    //   //   return 'https://static.99fund.com/mobile/agreement/invest_adviser_agreement_m.html';
    //   // }else{
    //   //   return 'http://10.50.115.48/mobile/agreement/invest_adviser_agreement_m.html';
    //   // }
    // }
  },
  watch: {
    // 监听选中的组合groupId，更新协议链接和展示
    toggleGroupId(newValue, oldValue) {
      console.log('oldValue=', oldValue);
      console.log('newValue=', newValue);
    },
    // currentParams(newval,oldval){
    //   if(newval&&newval.length>0){
    //     this.riskfundList = newval.map(item => item.defaultToProduct);
    //     Promise.all(newval.map(item=>this.getRiskInfoToFund(item.defaultToProduct))).then((reultArr)=>{
    //       this.productRiskInfo = reultArr;
    //     })
    //   }
    // }
  },
  methods: {
    // 20211227 持有金额，如果没在url参数传递过来，根据groupId查询当前用户的持有金额
    // 无直接接口，和后端确认后，取上个list页面的数据做filter
    getHoldingAmount(groupId) {
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
            //        ...
            //     ]
            // }
            let groupItem = result.body.find((item, index)=>{
              return (item.productId == groupId)
            });
            this.marketValue = groupItem?groupItem.marketValue:'';
        }.bind(this)
      })
    },
    
    // 产品信息（contentList固定文案展示）
    currentContext(groupId){
      let contentObj = this.contentList.find((item)=>{
        return item.groups.includes(groupId);
      })
      return contentObj?contentObj:{
        targetYearYield:'x%-xx%',
        targetRetreat:'xxx%',
        RecommendedHoldingTime:'',
        desc:'',
        label:[]
      };
    },
    // 查询所有的要升级的产品的风险等级详情
    getRiskInfoToFund(productId) {
      return new Promise((resolve,reject)=>{
        $.ajax({
          url: '/mobile-bff/v1/common/check-union-risk-level?productId='+productId,
          success: function (result) {
            result.body.productId = productId;
            return resolve(result.body);
          }.bind(this),
          error:function(){
            return resolve();
          }
        })
      })
    },
    // 风险等级是否需要更新
    getRiskInfo() {
      utils.ajax({
        url: '/mobile-bff/v1/common/check-union-risk-level',
        // contentType: 'application/json',
        success: function (result) {
          var code = result.body.code;
          if (code == "9991") {
            utils.showTips({
              title: '',
              content: '<span style="text-align:left;display:inline-block;">您当前风险测评结果已过有效期，可重新进行风险测评后再尝试升级。</span>',
              confirmText: '立即测评',
              complete: function () {
                window.location.href = '/mobileEC/wap/common/riskTest.html?forwardUrl=' + encodeURIComponent(window.location.href);
              }
            })
          }
        }.bind(this)
      })
    },
    // 20211223 查询个人风险等级，替换getRiskInfoToFund
    getRiskLevelByCustNo() {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/icif/v1/risks/risk-level',
          success: function (result) {
            if(result.returnCode == 0){
              // "body": null
              // "body": {
              //   "custNo": "1030941380",
              //   "evalDate": "20210219",
              //   "evalTime": "145913",
              //   "evalType": "T",
              //   "evalFormNo": "0003",
              //   "terminalInfo": null,
              //   "riskLevel": "6",
              //   "riskLevelZh": "积极型(C5)",
              //   "riskLevelMatches": "高风险、较高风险、中风险、较低风险、低风险",
              //   "score": 71.875,
              //   "status": "N",
              //   "investorType": "0",
              //   "investorTypeZh": "普通投资者"
              // }
              return resolve(result.body);
            } else {
              resolve();
            }
          }.bind(this),
          error: function () {
            return resolve();
          }
        })
      })
    },
    // 风险等级文字转换 level等级，type(user(C) or product(R))
    riskTransfor(level,type){
      let context = ''; 
      switch(level){
        case '1': 
          context = `极低风险(${type}${level-1})`;
          break;
        case '2': 
          context = `低风险(${type}${level-1})`;
          break;
        case '3': 
          context = `较低风险(${type}${level-1})`;
          break;
        case '4': 
          context = `中风险(${type}${level-1})`;
          break;
        case '5': 
          context = `较高风险(${type}${level-1})`;
          break;
        case '6': 
          context = `高风险(${type}${level-1})`;
          break;  
      }
      return context;
    },
    // 要升级的产品的留痕
    adviserContractMark(groupId,adviserContractList) {
      let params = {};
      let agreementIds = adviserContractList.map((item) => {
        return item.contractCategory;
      }).join(',');
      params.reminderType = '';
      params.agreementIds = agreementIds;
      params.agreementStatus = 1;
      params.confirmStatus = 1;
      params.fundIdToFundRiskLevelMap = {};
      // params.fundIdToFundRiskLevelMap[groupId] = this.productRiskInfo.find((item=> item.productId===groupId)).productLevel;
      params.fundIdToFundRiskLevelMap[groupId] = this.allData[groupId].investRiskLevel;
      return new Promise((resolve,reject)=>{
        $.ajax({
          contentType: 'application/json',
          url: '/mobile-bff/v1/common/customer-risk-leave-mark',
          type: 'POST',
          data: params,
          success: function (result) {
            // 无论成功失败都resolve
            return resolve();
          }.bind(this),
          error:function(){
            return resolve();
          }
        })
      })
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
    // 获取页面主要信息
    getPageData(groupId) {
      var _this = this;
      $.ajax({
        type: "get",
        url: "/fundgroup/v1/group/upgrade/to-investment/customize/asset?groupId=" + groupId,
        contentType: 'application/json',
        success: function (res) {
          if (res.returnCode === 1000) {
            // console.log('sso_cookie过期失效或者不存在情况!')
            utils.jumpLoginByChannelCode();
          } else {
            const data = res.body;
            if (!data.upgradeAssetDetail || !Array.isArray(data.upgradeAssetDetail.toProducts)) {
              console.log('upgradeAssetDetail.toProducts not valid!!!')
              utils.showTips('您当前暂无可升级组合资产');
              return;
            }
            // 根据url上的programme参数，重新设定res.body.upgradeAssetDetails
            if (_this.programme && Array.isArray(data.upgradeAssetDetail.toProducts)) {
              data.upgradeAssetDetail.toProducts.forEach((item, index) => {
                if (_this.programme == '01'&& data.upgradeAssetDetail.toProducts.length>1) {
                  data.upgradeAssetDetail.toProducts= data.upgradeAssetDetail.toProducts.slice(0, 1)
                } else if (_this.programme == '02'&& data.upgradeAssetDetail.toProducts.length>1) {
                  data.upgradeAssetDetail.toProducts = data.upgradeAssetDetail.toProducts.slice(1, 2)
                  // 推荐的第一个需要默认选中
                  data.upgradeAssetDetail.toProducts[0].defaultOption=true
                }
              })
            }
            console.log('data.upgradeAssetDetail', data.upgradeAssetDetail)

            // 默认值，选中的目标组合
            this.toggleGroupId = data.upgradeAssetDetail.toProducts[0].defaultToProduct;
            let list = data.upgradeAssetDetail.toProducts.reduce((prev, cur) => {
              prev.push(cur.defaultToProduct)
              prev.push(cur.otherToProduct)
              return prev
            }, []);
            list = data.otherUpgradeTargetGroups.reduce((prev, cur) => {
              prev.push(cur.defaultToProduct)
              prev.push(cur.otherToProduct)
              return prev
            }, list);
            const realList = [...new Set(list)];
            Promise.all(realList.map(item => this.getCardInfo(item))).then((detailList) => {
              this.allData = data;
              realList.forEach((item, index) => {
                this.$set(this.allData, item, detailList[index])
                // this.allData[item] = detailList[index]
              });
              for (let i = 0; i < this.allData.upgradeAssetDetail.toProducts.length; i++) {
                this.$set(this.allData.upgradeAssetDetail.toProducts[i], 'isCheckedAuto', 'Y')
              }
              for (let i = 0; i < this.allData.otherUpgradeTargetGroups.length; i++) {
                this.$set(this.allData.otherUpgradeTargetGroups[i], 'isCheckedAuto', 'Y')
              }
            }).catch((err) => {
              utils.showTips(err);
            });
          }
        }.bind(this),
      });
    },
    toggleSelect(index, type) {
      // type代表了两段数据 first为默认数据段 other为备选数据
      // this.mockData[index].toProducts
      for (let i = 0; i < this.firstData.length; i++) {
        this.$set(this.firstData[i], 'defaultOption', false);
      }
      for (let i = 0; i < this.otherData.length; i++) {
        this.$set(this.otherData[i], 'defaultOption', false);
      }
      let selectedItem = {};
      if (type == 'first') {
        this.$set(this.firstData[index], 'defaultOption', true);
        selectedItem = this.firstData[index];
      } else {
        this.$set(this.otherData[index], 'defaultOption', true);
        selectedItem = this.otherData[index];
      }
      // 选中的目标组合groupId
      this.toggleGroupId = (selectedItem.isCheckedAuto === 'Y' ? selectedItem.defaultToProduct : selectedItem.otherToProduct);
      this.toggleGroupType = (selectedItem.isCheckedAuto === 'Y' ? 'M' : 'G');    //  选中的目标升级投顾组合类型，管理型M，一般型G
    },
    radioChanged(selectedItem) {
      // console.log('radioChanged(selectedItem)=', selectedItem.isCheckedAuto);
      this.toggleGroupId = (selectedItem.isCheckedAuto === 'Y' ? selectedItem.defaultToProduct : selectedItem.otherToProduct);
      this.toggleGroupType = (selectedItem.isCheckedAuto === 'Y' ? 'M' : 'G');    //  选中的目标升级投顾组合类型，管理型M，一般型G
    },

    // 9560 升级页活动包修改点 #5 
    iconTips: function (type) {
      let html=''
      if (type == 'Manual') {
        html = '<span>手动调仓模式对应一般型投顾，即基金投顾机构接受客户委托，按照协议约定向客户提供基金投资组合策略建议，客户自行决策是否跟随策略建议调仓。</span> <br/><br/><span>调仓模式不支持修改，如选择手动调仓，升级后不可修改为自动调仓模式。</span>'
      } else if(type == 'automatic') {
        html = '<span>自动调仓对应管理型投顾，即基金投顾机构根据协议服务约定，代客户做出具体基金投资品种、数量及买卖时机的决策，并代客户执行基金产品申购、赎回、转换等交易申请。</span>'
      }
      utils.showTips({
        title: '',
        textAlign: 'left',
        // content: '<span>自动调仓模式对应为管理型投顾</span><br><span>手动调仓模式对应为一般型投顾</span>',
        content: html,
        confirmText: '我知道了',
      })
    },
    // 打开协议链接
    openContract: function (item) {
      if (isApp()) {
        if (item.agreementLinkType == 'pdf') {
          window.location.href = 'htffundxjb://action?type=url&linkType=pdf&link=' + btoa(item.agreementLinkUrl);
        } else {
          window.location.href = 'htffundxjb://action?type=url&link=' + btoa(item.agreementLinkUrl);
        }
      } else {
        window.location.href = item.agreementLinkUrl;
      }
    },
    // 跳转到投顾组合详情页面
    gotoDetailsPage(groupId) {
      if (isApp()) {
        window.location.href = "htffundxjb://action?type=adviserService&subType=detail&groupId=" + groupId;
      } else {
        window.location.href = "/mobileEC/adviser/investGroupDetails.html?groupId=" + groupId;
      }
    },
    // 获取卡片信息
    getCardInfo(productId) {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "get",
          url: "/mobile-bff/v1/fund-group/detailInfo?groupId=" + productId,
          contentType: '*/*',
          success: function (res) {
            if (res.returnCode === 1000) {
              // console.log('sso_cookie过期失效或者不存在情况!')
              utils.jumpLoginByChannelCode();
            } else if (res.returnCode === 0) {
              // 用groupId和adviserContractList做mapping关系
              this.contractListObj[res.body.groupid] = res.body.adviserContractList;
              resolve(res.body);
            } else {
              resolve('')
            }
          }.bind(this)
        });
      })
    },
    // iptModeToggle() {
    //   this.$nextTick(() => {
    //     this.inputMode = !this.inputMode
    //   })
    // },
    upgradeBtn() {
      // this.iKnow = false;
      utils.ajax({
        url: '/mobile-bff/v1/common/check-union-risk-level',
        // contentType: 'application/json',
        success: function (result) {
          var code = result.body.code;
          if (code == "9991") {
            utils.showTips({
              title: '',
              content: '<span style="text-align:left;display:inline-block;">您当前风险测评结果已过有效期，可重新进行风险测评后再尝试升级。</span>',
              confirmText: '立即测评',
              complete: function () {
                window.location.href = '/mobileEC/wap/common/riskTest.html?forwardUrl=' + encodeURIComponent(window.location.href);
              }
            })
          }
          else{
            // 20211223 用户重做风险测评后左上角返回当前页，点击升级，需要重新刷新用户风险等级
            this.getRiskLevelByCustNo().then((riskInfo)=>{
              // 判断是否有产品符合升级的风险条件
              if (riskInfo && this.currentParams.length > 0) {
                if (this.currentParams.some(item => Number(riskInfo.riskLevel) >= Number(this.allData[item.defaultToProduct].investRiskLevel))) {
                  // 只要有一个个人风险等级》=产品风险等级的就往下执行  跳出pdf协议弹窗
                  this.pdfInit();
                } else {
                  let str ='';
                  this.currentParams.forEach((item, index, arr) => {
                    str += `基金投顾组合策略【${this.allData[item.defaultToProduct].groupname}】的风险等级为<span style="color:#f4333c">${this.riskTransfor(this.allData[item.defaultToProduct].investRiskLevel,'R')}</span>${index+1 < arr.length? '、':','}`
                  });
                  str += '超出您的风险承受能力：<span style="color:#f4333c">' + riskInfo.riskLevelZh + '</span>,';
                  str += '根据汇添富基金投顾适当性政策，暂不支持您购买该策略。敬请理解。';
                  utils.showTips({
                    content: str,
                    showCancel: true,
                    confirmText: '联系客服',
                    nextText: '查看详情',
                    complete: function () {
                      window.location.href = "tel:4008889918";
                    },
                    nextComplete: function () {
                      if(isApp()){
                        window.location.href = 'htffundxjb://action?type=riskTest&subType=home';
                      }else{
                        window.location.href = '/mobileEC/wap/common/riskTest.html?forwardUrl=' + encodeURIComponent(window.location.href);
                      }
                    }
                  })
                }
              } else {
                this.pdfInit();
              }
            })
          }
        }.bind(this)
      })
      // Promise.all(this.currentParams.map(item=>this.getRiskInfoToFund(item.defaultToProduct))).then((reultArr)=>{
      //   this.productRiskInfo = reultArr;

      //   // 判断是否有产品符合升级的风险条件
      //   if (this.productRiskInfo.length > 0) {
      //     // if (this.productRiskInfo.some(item => Number(item.riskLevel) >= Number(item.productLevel))) {
      //     if (this.productRiskInfo.some(item => Number(item.riskLevel) >= Number(this.allData[item.productId].investRiskLevel))) {
      //       // 只要有一个个人风险等级》=产品风险等级的就往下执行  跳出pdf协议弹窗
      //       this.pdfInit();
      //     } else {
      //       let str ='';
      //       this.productRiskInfo.forEach((item, index, arr) => {
      //         // str += `基金投顾组合策略【${this.allData[item.productId].groupname}】的风险等级为<span style="color:#f4333c">${this.riskTransfor(item.productLevel,'R')}</span>${index+1 < arr.length? '、':','}`
      //         str += `基金投顾组合策略【${this.allData[item.productId].groupname}】的风险等级为<span style="color:#f4333c">${this.riskTransfor(this.allData[item.productId].investRiskLevel,'R')}</span>${index+1 < arr.length? '、':','}`
      //       });
      //       str += '超出您的风险承受能力：<span style="color:#f4333c">' + this.productRiskInfo[0].riskLevelName + '</span>,';
      //       str += '根据汇添富基金投顾适当性政策，暂不支持您购买该策略。敬请理解。';
      //       utils.showTips({
      //         content: str,
      //         showCancel: true,
      //         confirmText: '联系客服',
      //         nextText: '查看详情',
      //         complete: function () {
      //           window.location.href = "tel:4008889918";
      //         },
      //         nextComplete: function () {
      //           if(isApp()){
      //             window.location.href = 'htffundxjb://action?type=riskTest&subType=home';
      //           }else{
      //             window.location.href = '/mobileEC/wap/common/riskTest.html?forwardUrl=' + encodeURIComponent(window.location.href);
      //           }
      //         }
      //       })
      //     }
      //   } else {
      //     this.pdfInit();
      //   }

      // })

    },
    pdfInit(){
      this.protocolShow = true;
      // let realUrl = this.pdfInfo.agreementLinkUrl.replace(/^http.*?99fund\.com.*?\//g, window.location.origin + '/');
      // this.getPdf(realUrl);
      // // this.getPdf('http://10.50.115.48/uopStatic/publicConfig/alipayConfig/poster/aaaa.pdf');
      // let fixBtn = document.querySelector('.fixed-btn');
      // let fixTop = document.querySelector('.fixed-top');
      // let pdf = document.querySelector('.protocol-pdf');
      // fixTop.style.display = 'block';
      // fixBtn.style.display = 'block';
      // pdf.style.width='80%';
      // pdf.style.background="#fff"
      // this.protocolShow = false; //为调试设置，正常为true
      this.protocolShow = true;
      this.localCountDown = 8;
      this.agreeTimer = setInterval(() => {
        this.localCountDown--;
        if (this.localCountDown == 0) {
          clearInterval(this.agreeTimer);
          this.iKnow = true;
        }
      }, 1000);
    },
    agreementClose(){
      this.protocolShow = false;
      this.agreeTimer&&clearInterval(this.agreeTimer);
    },
    upgrade(){
      // 先调用产品协议留痕
      Promise.all(this.currentParams.map(item=>this.adviserContractMark(item.defaultToProduct,this.allData[item.defaultToProduct].adviserContractList))).then(()=>{
        // 不做任何处理只是留痕
      })
      setTimeout(()=>{
        utils.ajax({
          url: '/mobile-bff/v1/fund-group/fundgroup-upgrade-investment',
          type: 'POST',
          contentType: 'application/json',
          data: {
            'upgradeAssetDetails': this.currentParams
          },
          success: function (result) {
            console.log(result, "这里是升级");
            if (result.returnCode === 0) {
              var resultUrl = location.href.replace(/(.*\/).*$/ig, '$1result.html')
              utils.setSession(utils.serialNo_forword_url, resultUrl);
              // utils.setSession(utils.serialNo_forword_url, '/activity-center/act-resources/pages/investAdviser/result.html')
              utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
              utils.verifyTradeChain(result.body);
            } else {
              utils.showTips('请求超时，请稍后重试');
            }
          }.bind(this)
        })
      },1000)
      
      // console.log('upgradeBtn')
    },
    // 协议弹窗
    getPdf(url) {
      let currPage = 1; //Pages are 1-based not 0-based
      let numPages = 0;
      let thePDF = null;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "./js/pdf.worker.js";
      let loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(function (pdf) {
        thePDF = pdf;
        numPages = pdf.numPages;
        pdf.getPage(1).then(handlePages);
      },(error)=>{
        // 加载pdf文件失败
        let fixBtn = document.querySelector('.fixed-btn');
        let fixTop = document.querySelector('.fixed-top');
        let pdf = document.querySelector('.protocol-pdf');
        fixTop.style.display = 'block';
        fixBtn.style.display = 'block';
        pdf.style.width='80%';
        pdf.style.background="#fff"
      });

      function handlePages(page) {
        // pdf宽度
        let pdfWidth = page._pageInfo.view[2];
        // 左右边距px计算
        let marginWidth = 30;
        // 屏幕宽度
        let screenW = document.documentElement.clientWidth - marginWidth * 2;
        let scale = '';
        if (pdfWidth < screenW) {
          scale = (pdfWidth / screenW)
        } else {
          scale = (screenW / pdfWidth)
        }
        // 底部btn left距离
        let left = Math.abs(document.documentElement.clientWidth - pdfWidth * scale) / 2;
        let viewport = page.getViewport({
          scale
        });
        var outputScale = window.devicePixelRatio || 1;

        //We'll create a canvas for each page to draw it on
        let canvas = document.createElement("canvas");
        canvas.style.display = "block";
        let context = canvas.getContext('2d');
        // canvas.width = viewport.width;
        // canvas.height = viewport.height;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";
        var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        //Draw it on the canvas
        page.render({
          canvasContext: context,
          transform: transform,
          viewport: viewport
        });

        //Add it to the web page
        document.querySelector('.protocol-pdf').appendChild(canvas);
        // document.body
        //Move to next page
        currPage++;
        if (thePDF !== null && currPage <= numPages) {
          thePDF.getPage(currPage).then(handlePages);
        } else {
          let fixBtn = document.querySelector('.fixed-btn');
          let fixTop = document.querySelector('.fixed-top');
          fixBtn.style.width = pdfWidth * scale + 'px';
          fixBtn.style.left = left + 'px';
          fixBtn.style.display = 'block';
          fixTop.style.width = pdfWidth * scale + 'px';
          fixTop.style.left = left + 'px';
          fixTop.style.display = 'block';
          let pdf = document.querySelector('.protocol-pdf');
          pdf.style.width= pdfWidth * scale + 'px';
          // 给最后一个和第一歌canvas添加paddingTop和bottom
          let canvasList = document.querySelectorAll('canvas');
          let canvasLen = canvasList?canvasList.length:0;
          canvasLen&&(canvasList[0].style.paddingTop = '2rem');
          canvasLen&&(canvasList[canvasLen-1].style.paddingBottom = '2rem');
        }
      }
    },
    pdfConfirm(){
      if(!this.iKnow) return false;
      let _this = this;
      this.protocolShow = false;
      // pdf弹窗关闭协议留痕
      this.alertContractMark();
      // let content = '<span id="pdfLink">已阅读并同意';
      // this.contractList.forEach((item,index,arr)=>{
      //   content+=`<span style='color: #008ae9'>${item.agreementName}${index+1<arr.length?'、':''}</span>`
      // })
      // content+='</span>';
      // utils.showTips({
      //   content,
      //   showCancel:true,
      //   confirmText:'放弃',
      //   nextText:'确认签署',
      //   nextComplete:function(){
      //     _this.upgrade();
      //   }
      // })
      // this.$nextTick(()=>{
      //   $("#pdfLink").on('click',()=>{
      //     console.log('123123')
      //     window.location.href = "./contractList.html?groupIdList=" + encodeURIComponent(this.currentParams[0].defaultToProduct);
      //   })
      // })
      
       // 12.07新需求 
       let groupIdList = [];
      //  this.mockData.forEach((item, index) => {
      //    let prop = {};
      //    prop.convertOutAssets = item.convertOutAssets;
      //    item.toProducts.forEach((citem, cindex) => {
      //      if (citem.defaultOption && citem.isCheckedAuto == 'Y') {
      //        prop.defaultToProduct = citem.defaultToProduct
      //      } else if (citem.defaultOption && citem.isCheckedAuto == 'N') {
      //        prop.defaultToProduct = citem.otherToProduct
      //      }
      //    })
      //    groupIdList.push(prop.defaultToProduct)
      //  })
      //  console.log('groupIdList',groupIdList)
      this.currentParams.forEach((item, index) => {
        groupIdList.push(item.defaultToProduct)
      })
      this.getContractList(groupIdList);
    },
     // 12.07新需求 
    // 打开协议链接 openContract()
  
    // 获取协议
    getContractList: function (groupIdList) {
      console.log('groupIdList',groupIdList)
      if (!groupIdList || !Array.isArray(groupIdList)) {
        utils.showTips({
          content: '没有对应的组合协议',
          // complete: function(){
          //     window.location.href = './index.html';
          // }
        });
        return;
      }
      let detailList = groupIdList.map((groupId) => {
        return new Promise((resolve, reject) => {
          // 详情接口不需要登录态
          $.ajax({
            url: "/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId,
            type: 'GET',
            success: function (result) {
              if (result.returnCode === 0 && Array.isArray(result.body.adviserContractList)) {
                resolve(result.body.adviserContractList);
              } else {
                console.log('getContractListByGroupId error', result);
                resolve('');
              }
            }.bind(this)
          })
        })
      });

      Promise.all(detailList).then((items) => {
        // console.log('items=', items);
        items.forEach(item => {
          // 每个item为具体groupId对应的contractList
          console.log(item);
          this.contractList =this.contractList.concat(item);
          this.contractList = [].concat(item);
        })
         // 12.07去重相同名称的协议
        if(this.contractList&&this.contractList.length>1){
          this.contractList=  this.removalByNm(this.contractList)
        }
        if (this.contractList.length == 0) {
          utils.showTips({
            content: '没有对应的组合协议',
            // complete: function(){
            //     window.location.href = './index.html';
            // }
          });
        }else{
          this.signAgreementShow = true
        }
      });
    },
      // 去重
      removalByNm(objArray) {
        var hash = {};
        objArray = objArray.reduce(function (item, next) { 
          hash[next.agreementName] ? '' : hash[next.agreementName] = true && item.push(next);  
          return item;
        }, []); 
        return objArray;
      },
    // 20211201新加入小图标提示icon
    // iconTips:function(){
    //     utils.showTips({
    //         title: '',
    //         content: '<span>自动调仓模式对应为管理型投顾</span><br><span>手动调仓模式对应为一般型投顾</span>',
    //         confirmText: '我知道了',
    //     })
    // },
  }
})