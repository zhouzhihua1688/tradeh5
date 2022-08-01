const vm = new Vue({
  el: '#app',
  data() {
    return {
      showAutomatic: true, //自动调仓
      programme: utils.getUrlParam('programme'), // 20211124新增url参数，01：稳健策略只选中第一个，02：稳健策略只选中第二个
      mockData: [],
      allData: [],
      // 投顾类型 G 一般型 M 管理型 默认管理型
      investType: 'M',
      showText: '展开',
      // 客户经理数据
      ManagerInfo: [],
      footerFixShow: false,
      // 底部其他数据
      tabDivBgd: '1',
      showUpgrading: false,
      upgradingData: [],
      noState: false,
      inputMode: 'ones',
      infTab: "汇添富投顾服务以客户为中心，在充分了解客户风险偏好与投资需求的基础上，提供一站式资产配置解决方案及全流程账户管理和客户陪伴服务。",
      showProtocolFund: '',
      protocolShow: false,
      pdfInfo: {},
      // // 需要的产品和用户的风险详情
      // productRiskInfo: [],   // 20211223 废弃，用各个产品的详情接口investRiskLevel判断
      // 需要留痕的产品列表
      riskfundList: [],
      iKnow: false,
      localCountDown: 8,
      agreeTimer: null,
      // 12.07新需求
      signAgreementShow: false,
      contractList: [], // 协议列表
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
          desc: '以债券基金主，适度配置混合类及权益类基金，力争获得稳健收益。',
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
          desc: '以债券基金为为主，适度配置混合类及权益类基金，力争获得稳健收益。',
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
    this.getPageData(this.investType);
    this.getManagerInfo();
    this.getRiskInfo();
  },
  watch: {
    // currentParams(newval, oldval) {
    //   if (newval && newval.length > 0) {
    //     this.riskfundList = newval.map(item => item.defaultToProduct);
    //     Promise.all(newval.map(item => this.getRiskInfoToFund(item.defaultToProduct))).then((reultArr) => {
    //       this.productRiskInfo = reultArr;
    //     })
    //   }
    // }
  },
  computed: {
    listOverHide() {
      let arr = [];
      this.mockData.forEach(item => {
        arr.push(3)
      });
      return arr
    },
    currentParams() {
      let params = [];
      this.mockData.forEach((item, index) => {
        let prop = {};
        prop.convertOutAssets = item.convertOutAssets;
        item.toProducts.forEach((citem, cindex) => {
          if (citem.defaultOption && citem.isCheckedAuto == 'Y') {
            prop.defaultToProduct = citem.defaultToProduct
          } else if (citem.defaultOption && citem.isCheckedAuto == 'N') {
            prop.defaultToProduct = citem.otherToProduct
          }
        })
        params.push(prop)
      })
      return params
    },
    // toggleGroupType: 'M',    //  选中的目标升级投顾组合类型，管理型M，一般型G，都包含为ALL
    toggleGroupType(){
      let typeFlag = '';
      this.mockData.forEach((item, index) => {
        item.toProducts.forEach((citem, cindex) => {
          if(typeFlag == 'ALL') return;
          if (citem.defaultOption && citem.isCheckedAuto == 'Y') {
            typeFlag = (typeFlag == 'G'?'ALL':'M');
          } else if (citem.defaultOption && citem.isCheckedAuto == 'N') {
            typeFlag = (typeFlag == 'M'?'ALL':'G');
          }
        })
      })
      return typeFlag;
    },
    countDownBlock() {
      return this.iKnow ? '我知道了' : '我知道了' + this.localCountDown + 's';
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
  methods: {

	


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
      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/mobile-bff/v1/common/check-union-risk-level?productId=' + productId,
          success: function (result) {
            result.body.productId = productId;
            return resolve(result.body);
          }.bind(this),
          error: function () {
            return resolve();
          }
        })
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
    riskTransfor(level, type) {
      let context = '';
      switch (level) {
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
    adviserContractMark(groupId, adviserContractList) {
      let params = {};
      let agreementIds = adviserContractList.map((item) => {
        return item.contractCategory;
      }).join(',');
      params.reminderType = '';
      params.agreementIds = agreementIds;
      params.agreementStatus = 1;
      params.confirmStatus = 1;
      params.fundIdToFundRiskLevelMap = {};
      // params.fundIdToFundRiskLevelMap[groupId] = this.productRiskInfo.find((item => item.productId === groupId)).productLevel;
      params.fundIdToFundRiskLevelMap[groupId] = this.allData[groupId].investRiskLevel;
      return new Promise((resolve, reject) => {
        $.ajax({
          contentType: 'application/json',
          url: '/mobile-bff/v1/common/customer-risk-leave-mark',
          type: 'POST',
          data: params,
          success: function (result) {
            // 无论成功失败都resolve
            return resolve();
          }.bind(this),
          error: function () {
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
    // 获取客户经理
    // /icif/v1/consultants/qry-by-cust-no
    getManagerInfo() {
      utils.ajax({
        url: '/icif/v1/consultants/qry-by-cust-no',
        // contentType: 'application/json',
        success: function (result) {
          this.ManagerInfo = result.body
        }.bind(this)
      })
    },
    // 获取页面主要信息
    getPageData(investType) {
      var _this = this;
      $.ajax({
        type: "get",
        url: "/fundgroup/v1/group/upgrade/to-investment/assets?investType=" + investType,
        contentType: 'application/json',
        success: function (res) {
          if (res.returnCode === 1000) {
            // console.log('sso_cookie过期失效或者不存在情况!')
            utils.jumpLoginByChannelCode();
          } else {
            // /* 9560 升级页活动包修改点 #5  */
            if(res.body.toCustomerUpgrade) {
              // 跳转到自定义升级
              console.log(res.body)
              _this.noState = true;
              _this.customBtn(_this.programme);
            }else{
              console.log('res.body.toCustomerUpgrade',res.body.toCustomerUpgrade)
              // 判断是否升级中
              if (!res.body.upgradingAssetDetails||res.body.upgradingAssetDetails.length===0) {
                // if(!res.body.upgradeAssetDetails){
                //   // 没有要升级的 也没有升级中的 
                //   _this.noState=true;
                //   return;
                // }
                if (!Array.isArray(res.body.upgradeAssetDetails) || res.body.upgradeAssetDetails.length == 0) {
                  // 去看看
                  utils.showTips({
                    title: '',
                    content: '您当前暂无可升级组合资产<br>添富投顾重磅上线，敬请关注',
                    confirmText: isApp() ? '去看看' : '我知道了',
                    complete: function () {
                      if (isApp()) {
                        // window.location.href = 'htffundxjb://action?type=adviserService&subType=home';
                        // window.location.href = 'https://activity.99fund.com/activity-center/act-resources/pages/investHtf/index.html';
                        window.location.href ='htffundxjb://action?type=url&link=' + btoa('https://activity.99fund.com/activity-center/act-resources/pages/investHtf/index.html');
                      } else {
                        window.location.href = '/mobileEC/wap/wezhan/service.html'; // h5页面跳转到微站首页
                      }
                    }.bind(this)
                  })
                  _this.noState = true;
                  return;
                }
                // 根据url上的programme参数，重新设定res.body.upgradeAssetDetails
                if (_this.programme && Array.isArray(res.body.upgradeAssetDetails)) {
                  // (_this.programme == '00') && (res.body.upgradeAssetDetails = res.body.upgradeAssetDetails.slice(0,1));
                  // (_this.programme == '01') && (res.body.upgradeAssetDetails = res.body.upgradeAssetDetails.slice(1,2));
                  res.body.upgradeAssetDetails.forEach((item, index) => {
                    if (Array.isArray(item.toProducts) && item.toProducts.length > 1) {
                      (_this.programme == '01') && (item.toProducts = item.toProducts.slice(0, 1));
                      (_this.programme == '02') && (item.toProducts = item.toProducts.slice(1, 2));
                    }
                  })
                }

                const list = res.body.upgradeAssetDetails.reduce((prev, cur) => {
                  for (let i = 0; i < cur.toProducts.length; i++) {
                    prev.push(cur.toProducts[i].defaultToProduct)
                    prev.push(cur.toProducts[i].otherToProduct)
                  }
                  return prev
                }, []);
                const realList = [...new Set(list)];
                realList && realList.length > 0 && (_this.showProtocolFund = realList[0]);
                _this.allData = res.body;
                Promise.all(realList.map(item => _this.getCardInfo(item))).then((detailList) => {
                  realList.forEach((item, index) => {
                    _this.allData[item] = detailList[index]
                  });
                  _this.pdfInfo = _this.allData[_this.showProtocolFund].adviserContractList.find((item) => {
                    return item.displayMode == '1'
                  });
                  _this.mockData = res.body.upgradeAssetDetails;
                  for (let i = 0; i < _this.mockData.length; i++) {
                    for (let j = 0; j < _this.mockData[i].toProducts.length; j++) {
                      // _this.mockData[i].toProducts[j]
                      _this.$set(_this.mockData[i].toProducts[j], 'isCheckedAuto', 'Y')
                      // 展示第二个时设置可以选择
                      if (_this.programme == '02') {
                        _this.$set(_this.mockData[i].toProducts[j], 'defaultOption', true)
                      }
                      // _this.$set(_this.mockData[i].toProducts[j], 'isCheckedList', true)
                    }
                  }
                }).catch((err) => {
                  utils.showTips(err);
                });
              } else {
                console.log('在升级中')
                _this.showUpgrading = true;
                _this.upgradingData = res.body.upgradingAssetDetails

                const list2 = []
                _this.upgradingData.forEach((item, index) => {
                  // upgradingData.defaultToProductType  M:自动调仓 G:手工调仓

                  if (item.defaultToProductType && item.defaultToProductType == 'M') {
                    _this.showAutomatic = true;
                    console.log('自动')

                  } else if (item.defaultToProductType && item.defaultToProductType == 'G') {
                    _this.showAutomatic = false;
                    console.log('手动')
                  }
                  list2.push(item.defaultToProduct)

                })
                let cardData = []
                Promise.all(list2.map(item => _this.getCardInfo(item))).then((detailList) => {
                  cardData = detailList;
                  cardData.forEach((card, index) => {
                    _this.upgradingData.forEach(item => {
                      if (card.groupid == item.defaultToProduct) {
                        _this.$nextTick(() => {
                          _this.$set(_this.upgradingData[index], 'cardGroupid', card.groupid)
                          _this.$set(_this.upgradingData[index], 'cardGroupname', card.groupname)
                        })
                      }
                    })
                  })
                }).catch((err) => {
                  utils.showTips(err);
                });
              }
            }
          }
        },
      });
    },
    toggleRadio(index, subIndex) {
      this.mockData[index].toProducts
      for (let i = 0; i < this.mockData[index].toProducts.length; i++) {
        this.$set(this.mockData[index].toProducts[i], 'defaultOption', false);
      }
      this.$set(this.mockData[index].toProducts[subIndex], 'defaultOption', true)
    },
    // 获取卡片信息
    getCardInfo(productId) {
      return new Promise((resolve, reject) => {
        // /mobile-bff/v1/fund-group/detailInfo?groupId=productId
        $.ajax({
          type: "get",
          url: "/mobile-bff/v1/fund-group/detailInfo?groupId=" + productId,
          contentType: '*/*',
          success: function (res) {
            if (res.returnCode === 1000) {
              // console.log('sso_cookie过期失效或者不存在情况!')
              utils.jumpLoginByChannelCode();
            } else if (res.returnCode === 0) {
              resolve(res.body);
            } else {
              resolve('')
            }
          }
        });
      })
    },
    //已有的资产list的展开与收起 
    showMore(index, length) {
      if (this.listOverHide[index] == length) {
        this.listOverHide.splice(index, 1, 3);
        this.showText = '展开'
      } else {
        this.listOverHide.splice(index, 1, length);
        this.showText = '收起'
      }
      this.$forceUpdate();
    },
    // dibu
    changTab(i) {
      if (i == 1) {
        this.tabDivBgd = 1
        this.infTab='汇添富投顾服务以客户为中心，在充分了解客户风险偏好与投资需求的基础上，提供一站式资产配置解决方案及全流程账户管理和客户陪伴服务。'
      } else {
        this.tabDivBgd = 2
        this.infTab = '汇添富将依托专业的投资研究能力和对底层资产的深度识别能力，以对客户需求的深刻理解、全方位的数据监测与业绩检视体系、全生命周期的客户陪伴服务能力为依托，以行业领先的IT自研能力为助力，力争为客户提供优质的投资顾问陪伴体验。'

      }
      console.log('tabDivBgd==', this.tabDivBgd)

    },

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
      //         str += `基金投顾组合策略【${this.allData[item.productId].groupname}】的风险等级为<span style="color:#f4333c">${this.riskTransfor(item.productLevel,'R')}</span>${index+1 < arr.length? '、':','}`
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
    // 升级流程
    upgrade() {
      // 先调用产品协议留痕
      Promise.all(this.currentParams.map(item => this.adviserContractMark(item.defaultToProduct, this.allData[item.defaultToProduct].adviserContractList))).then(() => {
        // 不做任何处理只是留痕
      })
      setTimeout(() => {
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
              // var resultUrl = location.href.replace(/(.*?)index.html/ig, '$1result.html');
              var resultUrl = location.href.replace(/(.*\/).*$/ig, '$1result.html');
              utils.setSession(utils.serialNo_forword_url, resultUrl);
              utils.removeSession(utils.getCookie('sso_cookie_ext_dp')); // 去掉已存的session,防止污染
              utils.verifyTradeChain(result.body);
            } else {
              utils.showTips('请求超时，请稍后重试');
            }
          }.bind(this)
        })
      }, 1000)
    },
    // pdfinit
    pdfInit() {
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
    agreementClose() {
      this.protocolShow = false;
      this.agreeTimer && clearInterval(this.agreeTimer);
    },
    pdfConfirm() {
      if (!this.iKnow) return false;
      let _this = this;
      this.protocolShow = false;


      // pdf弹窗关闭协议留痕
      this.alertContractMark();
      // utils.showTips({
      //   content: "<span>已阅读并同意</span><span style='color: #008ae9' id='pdfLink'>汇添富基金管理股份有限公司投资顾问服务协议、基金投资组合策略方案说明书、管理型投顾风险揭示书</span>",
      //   showCancel: true,
      //   confirmText: '放弃',
      //   nextText: '确认签署',
      //   nextComplete: function () {
      //     _this.upgrade();
      //   }
      // })
      // this.$nextTick(() => {
      //   $("#pdfLink").on('click', () => {
      //     this.gotoContractListPage()
      //   })
      // })

      // 12.07新需求 
      let groupIdList = [];
      this.mockData.forEach((item, index) => {
        let prop = {};
        prop.convertOutAssets = item.convertOutAssets;
        item.toProducts.forEach((citem, cindex) => {
          if (citem.defaultOption && citem.isCheckedAuto == 'Y') {
            prop.defaultToProduct = citem.defaultToProduct
          } else if (citem.defaultOption && citem.isCheckedAuto == 'N') {
            prop.defaultToProduct = citem.otherToProduct
          }
        })
        groupIdList.push(prop.defaultToProduct)
      })
      console.log('groupIdList', groupIdList)

      this.getContractList(groupIdList);
    },
    // 12.07新需求 
    // 打开协议链接
    openContract: function (item) {
      // agreementLinkType: "pdf"
      // agreementLinkUrl: "http://appuat.99fund.com.cn:7081/mobile-bff/v1/unification/obs-download-role-anonymous?filePath=%E4%BA%B2%E6%83%85%E6%97%A5%E8%AE%B0%E9%9C%80%E6%B1%820805.docx&downloadType=attachment&container=groupReport"
      // agreementName: "2"
      // contractCategory: "IA"
      // countDown: 10
      // displayMode: "0"
      // investAgreementType: null
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
    // 获取协议
    getContractList: function (groupIdList) {
      console.log('groupIdList', groupIdList)
      // groupIdList = ['A6104', 'A6106'];
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
          this.contractList = this.contractList.concat(item);

        })
        // 去重相同名称的协议
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
        if(next.agreementName && !hash[next.agreementName.trim()]){
          hash[next.agreementName.trim()] = true;
          item.push(next);
        }
        // hash[next.agreementName] ? '' : hash[next.agreementName] = true && item.push(next);  
        return item;
      }, []); 
      return objArray;
    },

    // 跳转到协议页面
    gotoContractListPage() {
      let params = [];
      this.mockData.forEach((item, index) => {
        let prop = {};
        prop.convertOutAssets = item.convertOutAssets;
        item.toProducts.forEach((citem, cindex) => {
          if (citem.defaultOption && citem.isCheckedAuto == 'Y') {
            prop.defaultToProduct = citem.defaultToProduct
          } else if (citem.defaultOption && citem.isCheckedAuto == 'N') {
            prop.defaultToProduct = citem.otherToProduct
          }
        })
        params.push(prop)
      })
      let groupIdList = params.map((item) => {
        return item.defaultToProduct;
      }).join(',');

      window.location.href = "./contractList.html?groupIdList=" + encodeURIComponent(groupIdList);
    },
    // 跳转到投顾组合详情页面
    gotoDetailsPage(groupId) {
      if (isApp()) {
        window.location.href = "htffundxjb://action?type=adviserService&subType=detail&groupId=" + groupId;
      } else {
        window.location.href = "/mobileEC/adviser/investGroupDetails.html?groupId=" + groupId;
      }
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
      }, (error) => {
        // 加载pdf文件失败
        let fixBtn = document.querySelector('.fixed-btn');
        let fixTop = document.querySelector('.fixed-top');
        let pdf = document.querySelector('.protocol-pdf');
        fixTop.style.display = 'block';
        fixBtn.style.display = 'block';
        pdf.style.width = '80%';
        pdf.style.background = "#fff"
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
        canvas.style.height = Math.floor(viewport.height) + "px";
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
          pdf.style.width = pdfWidth * scale + 'px';
          // 给最后一个和第一歌canvas添加paddingTop和bottom
          let canvasList = document.querySelectorAll('canvas');
          let canvasLen = canvasList ? canvasList.length : 0;
          canvasLen && (canvasList[0].style.paddingTop = '2rem');
          canvasLen && (canvasList[canvasLen - 1].style.paddingBottom = '2rem');
        }
      }
    },
    // /mobileEC/services/common/check_union_risk_level
    showTopTips() {
      // utils.showTips('有钱花')
      let str = '升级资产可享0投顾费，参与汇添富基金投顾体验官限时招募活动，送你“有钱花”，还有三重好礼等你来拿！';
      utils.showTips({
        content: '<span>' + str + '</span>',
        textAlign: 'left',
        showCancel: true,
        confirmText: '去看看',
        nextText: '我知道了',
        complete: function () {
          window.location.href = "https://activity.99fund.com/activity-center/act-resources/pages/tougutiyanguan20211124/index.html";
        },
        nextComplete: function () {
          utils.hideTips();
        }
      })
    },
    // 跳转到自定义升级页面
    customBtn(programme) {
      // window.location.href = `./combUpgrade.html?programme=${programme}`;
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
          }else{
            window.location.href = `./combUpgrade.html` + (programme?`?programme=${programme}`:'');
          }
        }.bind(this)
      })
    },
    // 20211130新加入小图标提示icon
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
    jumpUrl:function(url){
      let toUrl=btoa(url);
      if (isApp()) {
          window.location.href ='htffundxjb://action?type=url&link='+toUrl;
        } else {
          window.location.href =url;
        }
    },
    result_dialog: function () {
      // 受理成功
      utils.showTips({
        title: '受理成功',
        content: '升级申请受理成功，预计<span>xx</span>月<span>xx</span>日完成确认。',
        confirmText: '我知道了',
      })
      // //受理失败
      utils.showTips({
        title: '受理失败',
        content: '<div class="fail">升级申请受理失败，您的风险承受等级为<span>较低风险（C2</span>与投顾服务【汇添富跟我投】<span>中风险（R3）</span>不匹配，您可更新风险测评后再次尝试升级。</div>',
        confirmText: '<div class="footer_but"><div>联系客服</div><div>我知道了</div></div>',
      })
      //受理失败---系统繁忙
      utils.showTips({
        title: '<div>受理失败</div>',
        content: '<div class="failSys">系统繁忙，请稍后再试。</div>',
        confirmText: '<div class="footer_but"><div>联系客服</div><div>我知道了</div></div>',
      })
      // 立即测评
      utils.showTips({
        title: '<div></div>',
        content: '<div style="text-align:justify">您当前风险测评结果已过有效期，可重新进行风险测评后再尝试升级。</div>',
        confirmText: '<div>立即测评</div>',
      })
      // 去看看
      utils.showTips({
        title: '<div></div>',
        content: '<div style="text-align:center">您当前暂无可升级组合资产<br>添富投顾重磅上线，敬请关注</div>',
        confirmText: '<div>去看看</div>',
      })
      // 部分成功 
      utils.showTips({
        title: '升级申请部分受理成功！',
        content: '<div class="upgrade">' +
          '<div class="first">升级交易逐步确认，预计最晚于<span>xx</span>月<span>xx</span>日可全部完成确认。</div>' +
          '<div class="second">您的风险承受等级为<span>较低风险（C2）</span>与投顾服务【汇添富跟我投】<span>中风险（R3）</span>、【汇添富理财加】<span>中风险（R3）</span>不匹配，您可更新风险测评后再次尝试升级。</div>' +
          '<div class="third">您的升级申请受理结果如下：</div>' +
          '<div class="title">' +
          '<div>升级方案</div><div>金额</div><div>受理结果</div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="risk">风险等级不匹配</span></div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="risk">风险等级不匹配</span></div>' +
          '</div>' +
          '</div>',
        confirmText: '<div class="footer_but"><div>联系客服</div><div>更新风险测评</div></div>',
      })

      //电话确认预约信息
      utils.showTips({
        title: '确认预约信息',
        content: '<div class="order">' +
          '<div>回电时间：<span>11月18日</span> <span>09:00-12:00</span></div>' +
          '<div>接听手机：<span>18578920916</span></div>' +
          '</div>',
        confirmText: '<div class="footer_but"><div @click="lianxi()">取消</div><div>确认</div></div>',
      })

      //升级申请受理成功！ 
      utils.showTips({
        title: '升级申请受理成功！',
        content: '<div class="upgrade">' +
          '<div class="first">升级交易逐步确认，预计最晚于<span>xx</span>月<span>xx</span>日可全部完成确认。</div>' +
          // '<div class="second">您的风险承受等级为<span>较低风险（C2）</span>与投顾服务【汇添富跟我投】<span>中风险（R3）</span>、【汇添富理财加】<span>中风险（R3）</span>不匹配，您可更新风险测评后再次尝试升级。</div>'+
          '<div class="third">您的升级申请受理结果如下：</div>' +
          '<div class="title">' +
          '<div>升级方案</div><div>金额</div><div>受理结果</div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span style="color:#000">成功</span></div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span style="color:#000">成功</span></div>' +
          '</div>' +
          '</div>',
        confirmText: '我知道了',
      })

      // 升级申请受理失败
      utils.showTips({
        title: '升级申请受理失败',
        content: '<div class="upgrade">' +
          '<div class="first">持有组合成分基金不满足员工持有期限要求，暂不可升级。</div>' +
          // '<div class="second">您的风险承受等级为<span>较低风险（C2）</span>与投顾服务【汇添富跟我投】<span>中风险（R3）</span>、【汇添富理财加】<span>中风险（R3）</span>不匹配，您可更新风险测评后再次尝试升级。</div>'+
          '<div class="third">您的升级申请受理结果如下：</div>' +
          '<div class="title">' +
          '<div>升级方案</div><div>金额</div><div>受理结果</div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="limit">员工持基限制</span></div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="limit">员工持基限制</span></div>' +
          '</div>' +
          '</div>',
        confirmText: '<div class="footer_but"><div>联系客服</div><div>我知道了</div></div>',
      })

      // 升级申请受理失败-风险等级不匹配
      utils.showTips({
        title: '升级申请受理失败',
        content: '<div class="upgrade">' +
          // '<div class="first">持有组合成分基金不满足员工持有期限要求，暂不可升级。</div>'+
          '<div class="second">您的风险承受等级为<span>较低风险（C2）</span>与投顾服务【汇添富跟我投】<span>中风险（R3）</span>、【汇添富理财加】<span>中风险（R3）</span>不匹配，您更新风险测评后再次尝试升级。</div>' +
          '<div class="third">您的升级申请受理结果如下：</div>' +
          '<div class="title">' +
          '<div>升级方案</div><div>金额</div><div>受理结果</div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="limit">风险等级不匹配</span></div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="limit">风险等级不匹配</span></div>' +
          '</div>' +
          '</div>',
        confirmText: '<div class="footer_but"><div>联系客服</div><div>更新风险测评</div></div>',
      })

      // 升级申请受理失败---稍后再试
      utils.showTips({
        title: '升级申请受理失败',
        content: '<div class="upgrade">' +
          '<div class="first">系统打了个盹，您可稍后再试。</div>' +
          // '<div class="second">您的风险承受等级为<span>较低风险（C2）</span>与投顾服务【汇添富跟我投】<span>中风险（R3）</span>、【汇添富理财加】<span>中风险（R3）</span>不匹配，您可更新风险测评后再次尝试升级。</div>'+
          '<div class="third">您的升级申请受理结果如下：</div>' +
          '<div class="title">' +
          '<div>升级方案</div><div>金额</div><div>受理结果</div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="limit"></span></div>' +
          '</div>' +
          '<div class="list">' +
          '<div class="left"><span>稳稳小确幸</span><span>->汇添富跟我投</span></div>' +
          '<div>1500.00元</div>' +
          '<div class="right"><span>失败</span><span class="limit"></span></div>' +
          '</div>' +
          '</div>',
        confirmText: '<div class="footer_but"><div>联系客服</div><div>稍后再试</div></div>',
      })
    },
  }
})