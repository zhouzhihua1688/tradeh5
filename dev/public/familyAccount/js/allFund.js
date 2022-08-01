 new Vue({
     el: '#app',
     data: {
         keyword: '', //search
         //nav  title
         titleText: [{
             name: '基金',
             type: '1',
             class: 'fundTable',
             active: true,
             labels: [], //nav label
             yieldType: 'dailyGrowthRate',
             yieldTypeShow: true,
             yieldTypeList: [{
                 name: '日涨福',
                 key: 'dailyGrowthRate',
             }, {
                 name: '近一月',
                 key: 'monthlyReturn',
             }, {
                 name: '近三月',
                 key: 'quarterReturn',
             }, {
                 name: '近六月',
                 key: 'halfYearReturn',
             }, {
                 name: '近一年',
                 key: 'yearReturn',
             }, {
                 name: '今年以来',
                 key: 'fromYearReturn',
             }, {
                 name: '成立以来',
                 key: 'fromBuildReturn',
             }],
             productList: [], //列表
             url: '/ess/v1/fund/fund-by-scene',
             pageSize: 20,
             pageNo: 1,
             total: 0
         }, {
             name: '组合',
             type: '2',
             class: 'groupTable',
             active: false,
             labels: [], //nav label
             productList: [], //列表
             url: '/ess/v1/fund/group-by-scene',
             pageSize: 20,
             pageNo: 1,
             total: 0
         }],
         sceneCode: '01',
         from: '',
         rodOffsetLeft: 0,
     },
     created() {

         var from = this.from = utils.getUrlParam("from");
         if (from && from == 'mip') {
             this.sceneCode = '04';
         }
         this.titleText.forEach(item => {
             this.getLabel(item.type, '01', item.labels)
         })
     },
     watch: {
         keyword() {
             this.titleText.some(params => {
                 if (params.active) {
                     params.pageNo = 1;
                     params.total = 1;
                     params.labels.some(tag => {
                         if (tag.active) {
                             this.getAll(params, tag.value)
                             return true;
                         }
                     })
                 }
             })
         }
     },
     computed: {
         formatGroupDayYield() {
             return value => {
                 if (value === undefined || value === null) return '-';
                 var num = value.toFixed(2);
                 if (value >= 0) {
                     return `<aside style='display:inline-block;color:#f4333c;'>${num}</aside><i style='font-size:.7rem;color:#f4333c;'>%</i>`
                 } else {
                     return `<aside style='display:inline-block;color:#09aa1c;'>${num}</aside><i style='font-size:.7rem;color:#09aa1c;'>%</i>`
                 }
             }
         },
         formatYield() {
             return (type, value) => {
                 if (value === null || value === undefined) {
                     return '-';
                 }
                 if (value[type] === null || value[type] === undefined) {
                     return '-';
                 }
                 var num = value[type].toFixed(2);
                 if (value[type] >= 0) {
                     return `<span style='color:#f4333c;'>${num}%</span>`
                 } else {
                     return `<span style='color:#09aa1c;'>${num}%</span>`
                 }
             }
         }
     },
     methods: {
         changeYieldType(params, key) {
             if (params.yieldType == key) return;
             params.yieldType = key;
             params.pageNo = 1;
             params.total = 1;
             params.labels.some(tag => {
                 if (tag.active) {
                     this.getAll(params, tag.value)
                     return true;
                 }
             })
         },
         getAll(params, tag) {
             var insideParams = {
                 keyword: this.keyword,
                 pageSize: params.pageSize,
                 pageNo: params.pageNo,
                 sceneCode: this.sceneCode,
                 tag
             }
             if (params.type == 1) {
                 insideParams.sortInfo = {
                     orderFiled: params.yieldType,
                     orderType: 'DESC'
                 }
             } else {
                 insideParams.sortInfo = {
                     orderFiled: 'yearReturn',
                     orderType: 'DESC'
                 }
             }
             utils.post({
                 url: params.url,
                 data: insideParams,
                 success: function (result) {
                     if (result.returnCode === 0) {
                         params.total = Math.ceil(result.body.totalSize / insideParams.pageSize)
                         if (insideParams.pageNo == 1) {
                             params.productList = result.body.list
                         } else {
                             params.productList = params.productList.concat(result.body.list)
                         }
                     } else {
                         // alert(result.returnMsg)
                     }
                 }.bind(this)
             });
         },
         getLabel(type, sceneCode, targetArr) {
             utils.get({
                 url: '/ess/v1/fund/filter-by-scene',
                 data: {
                     type,
                     sceneCode
                 },
                 success: function (result) {
                     if (result.returnCode === 0) {
                         result.body && result.body.tagFilters.forEach((item, index) => {
                             if (index) {
                                 item.tag.active = false;
                             } else {
                                 item.tag.active = true;
                                 this.titleText.some(el => {
                                     if (el.type === type) {
                                         this.getAll(el, item.tag.value)
                                         return true;
                                     }
                                 })
                             }
                             targetArr.push(item.tag)
                         }, this)

                     } else {
                         // alert(result.returnMsg)
                     }
                 }.bind(this)
             });
         },
         toggleTitle(el, type) {
             this.rodOffsetLeft = `${el.target.offsetLeft}px`;
             this.titleText.forEach(item => {
                 if (item.type === type) {
                     item.active = true;
                 } else {
                     item.active = false;
                 }
             })
         },
         toggleTag(params, tag) {
             if (tag.active) {
                 return;
             }
             params.pageNo = 1;
             params.total = 1;
             params.labels.forEach(item => {
                 if (item.value === tag.value) {
                     item.active = true;
                     this.getAll(params, tag.value)
                 } else {
                     item.active = false;
                 }
             })
         },
         nextPage(el, params) {
             if (el.target.offsetHeight + el.target.scrollTop >= el.target.scrollHeight) {
                 params.labels.some(item => {
                     if (item.active) {
                         if (params.pageNo >= params.total) {
                             return true;
                         }
                         params.pageNo++
                         this.getAll(params, item.value)
                         return true;
                     }
                 })
             }
         },
         referCreate: function (item, prdType) {
             //  prdType 1为基金 2为组合
             var arAcct = utils.getUrlParam("arAcct");
             if (arAcct) {
                 utils.setSession("_selectArAcct", arAcct); //从选择其他产品购买 
                 if (this.from && this.from == 'mip') { //从新增定投按钮跳过来的
                     if (prdType == 1) { //基金 详情
                        window.location.href = '/mobileEC/wap/fund/fund_mip.html?fundId=' + item.fundId;
                     } else if (prdType == 2) { //组合详情 
                        window.location.href = '/mobileEC/wap/fundgroup/create_mip.html?groupId=' + item.groupId;
                     }
                 } else {
                     if (prdType == 1) { //基金 详情
                         window.location.href = '/mobileEC/wap/fund/steadyCombination.html?fundId=' + item.fundId;
                     } else if (prdType == 2) { //组合详情
                         if (item.groupId == 'A0069') { //特殊处理A0069跟我投
                             window.location.href = '/mobileEC/wap/fundgroup/follow_me_details.html?groupId=' + item.groupId;
                         } else {
                             window.location.href = '/mobileEC/wap/fundgroup/group_fund_details.html?groupId=' + item.groupId;
                         }
                     }
                 }

             } else {

                 var params = utils.getSession('_createInit');
                 params.prdType = prdType;
                 if (prdType == 1) {
                     params.prdId = item.fundId;
                     params.prdTitle = item.fundName;
                 } else {
                     params.prdId = item.groupId;
                     params.prdTitle = item.groupName;
                 }
                 params.recommentShow = false;
                 utils.setSession('_createInit', JSON.stringify(params));
                 window.location.href = "/tradeh5/newWap/familyAccount/createPlan.html"
             }

         }
     },
     filters: {
         formatGroupDate(date) {
             if (!date) return date;
             return `${date.substr(-4,2)}.${date.substr(-2)}`;
         },
         formatFundDate(date) {
             if (!date) return date;
             return `${date.substr(0,4)}.${date.substr(-4,2)}.${date.substr(-2)}`;
         },

     }
 })