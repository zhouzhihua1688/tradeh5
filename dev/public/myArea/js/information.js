var vm = new Vue({
    el: '#app',
    data() {
      return {
        fundList:[],
        fundMoneyList:[],
        fundIds:[],
        fundMoneyIds:[],
        tabList:['资讯','公告'],
        tabNoticeList:[{name:'发行文件',value:'2972'},{name:'定期公告',value:'2973'},{name:'临时公告',value:'2974'},{name:'风险评级',value:'3761'}],
        classifyIndex:'0',
        noticeIndex:'0',
        informationList:[],//资讯列表 
        noticeList:[],    //公告 
        fundIds:utils.getUrlParam('fundIds'),  //自选基金列表id
        listIndex:'1',
      };
  
    },
    created() {

    },
    mounted: function () {
        this.getFundInfo();
        // this.getInformation();  //资讯
        // this.getNotice('2972'); //公告-发行文件2972
        window.onscroll=this.pageScroll;
    },
    computed: {

    },
    watch: {

    },
    methods: {
  //   tabList 列表切换
        changeClassify:function(item, index){
            this.classifyIndex = index;
        },
        // 公告列表下的的栏目
        noticeClassify:function(item, index){
            this.noticeIndex = index;
            this.getNotice(item.value);
        },

// 获取基金列表详情
        getFundInfo() {
            let params = {}; 
            params.fundTp='0'; //0-非货币基金, 1-货币基金, 
            utils.ajax({
                url: '/mobile-bff/v1/concern/queryMyOptional',
                data:params,
                success: function (result) {
                    console.log("非货币基金:",result);
                    if(result.returnCode==0){
                        this.fundList=result.body.fundList;
                        if( this.fundList.length>0){
                            let ids=result.body.fundList.map(function(item){
                               return item.fundId;
                            })
                            this.fundIds=ids; 
                        }
                        this.getFundMoneyInfo(this.fundIds);
                    }
                }.bind(this)
            })
        },
// 获取货币基金列表详情
        getFundMoneyInfo(fundIds) {
            let params = {}; 
            params.fundTp='1'; //0-非货币基金, 1-货币基金, 
            utils.ajax({
                url: '/mobile-bff/v1/concern/queryMyOptional',
                data:params,
                success: function (result) {
                    if(result.returnCode==0){
                        console.log("货币基金:",result);
                        this.fundMoneyList=result.body.currencyList;
                        if( this.fundMoneyList.length>0){
                            let moneyIds=result.body.currencyList.map(function(item){
                                return item.fundId;
                            }) 
                            this.fundMoneyIds=moneyIds;
                        }
                        if(fundIds||this.fundMoneyIds){
                            this.getInformation();
                            this.getNotice('2972');
                        } 
                    }
                }.bind(this)
            })
        },   
// 获取tab资讯列表详情
        getInformation() {
          let params = {}; 
          var _this=this;
          params.type='0'; //资讯(0),公告(1)
          let newArr=this.fundIds.concat(this.fundMoneyIds);
          params.fundIds= newArr.join();
          params.pageNo=_this.listIndex;
          params.pageSize=20; 
          console.log(params);
            utils.ajax({
              url: '/cms-service/v1/query/fund/optional/news/or/announcement',
              data:params,
              success: function (result) {
                  if(result.returnCode==0){
                    //   this.informationList = this.fundList.concat(result.body);
                    this.informationList=this.informationList.concat(result.body.map(function(item){
                        let tagArr=[]
                        if(item.tags){
                        tagArr=item.tags.replace(/(^\s*)/g, "").replace(/\s+/g, ',').split(',');
                        }   
                        
                        item.tagArr =tagArr;
                        return item;       
                    }));
                    console.log("资讯==",this.informationList);
                  }
              }.bind(this)
           })
        },

// 获取tab公告列表详情
        getNotice(value) {
            let params = {}; 
            params.type='1'; //资讯(0),公告(1)
            let newArr=this.fundIds.concat(this.fundMoneyIds);
            params.fundIds= newArr.join();
            params.catalogId=value;
            params.pageNo=1;
            params.pageSize=9999;
            console.log(params);
            utils.ajax({
                url: '/cms-service/v1/query/fund/optional/news/or/announcement',
                data:params,
                success: function (result) {
                    if(result.returnCode==0){
                        this.noticeList=result.body.map(function(item){
                            let tagArr=[]
                            if(item.tags){
                            tagArr=item.tags.replace(/(^\s*)/g, "").replace(/\s+/g, ',').split(',');
                            }   
                            
                            item.tagArr =tagArr;
                            return item;       
                        });
                        console.log("公告==",this.noticeList);
                    }
                }.bind(this)
            })
        },
        //  页面滚动事件  常做下拉加载内容
        pageScroll(){
            var _this=this;
                // 获取滚动的距离
            let scrollTop=document.documentElement.scrollTop;
            // 获取滚动的高度（获取整个html的高度）
            let scrollHeight=document.documentElement.scrollHeight;
            // 获取屏幕(浏览器)高度
            let clienHeight=document.documentElement.clientHeight;
            // 滚动的距离 + 屏幕高度 - 内容高度 >= 0 表示滚动到底部了      (下拉加载判断条件)
            if(scrollTop+clienHeight-scrollHeight >=0){
                    if(_this.classifyIndex==0){
                        _this.listIndex++;
                        _this.getInformation();
                    } 
            }
        },
        numFormat(val) {
            if (val || val === 0) {
                val = val.toFixed(2);
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                return '';
            }
        },
    },
    filters: {
    }
})