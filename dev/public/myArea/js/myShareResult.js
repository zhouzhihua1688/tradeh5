var vm = new Vue({
        el: '#app',
        data() {
          return {
            userInfoList:[],
            fundList:[],
            fundNavText:'',   //估值日期
            socialUserId:utils.getUrlParam('socialUserId'),
            fundValuationAndNavEnum:utils.getUrlParam('fundValuationAndNavEnum'),
            fundIds:utils.getUrlParam('fundIds'),  //自选基金列表id
            // fundIds:'000122,000123,470006,470009,470058,470888,470020,013814,000696,006259,001417,006893,007457,006763,006408,011021,014631,014018,014528,012157',
            // offset:0,
            navDteList:[{appValue:'rzf',value:'WEEKLY_RETURN'},
                {appValue:'weeklyReturn',value:'WEEKLY_RETURN'},{appValue:'yzf',value:'MONTHLY_RETURN'},{appValue:'jzf',value:'QUARTER_RETURN'},
                {appValue:'halfYearReturn',value:'HALF_YEAR_RETURN'},{appValue:'nzf',value:'YEAR_RETURN'},{appValue:'twoYearReturn',value:'TWO_YEAR_RETURN'},
                {appValue:'threeyearReturn',value:'THREE_YEAR_RETURN'},{appValue:'fiveYearReturn',value:'FIVE_YEAR_RETURN'},
                {appValue:'jnyl',value:'FROM_YEAR_RETURN'},{appValue:'fromBuildReturn',value:'FROM_BUILD_RETURN'},
            ],
            navDate: '', //日涨幅日期  格式20220616
            navDateString:'', //日涨幅日期  格式06.16
            newFundValuationAndNavEnum:'',
            total:'',
            pageNo:1,   //
            pageSize:20,
            listIndex:0,  //数组第几个
            newArr:[]
          };
      
        },
    created() {
        // 分组20一组
        let arr = this.fundIds.split(",");
        let num =20;
        this.newArr = arr.reduce((pre, cur, index) => {
        if (index % num === 0) {
            return pre.concat([arr.slice(index, index + num)]);
        } else {
            return pre;
        }
        }, []);
        this.total=this.newArr.length;  //可以获取总共有几页
        console.log("总页:",this.total);

        if(this.fundValuationAndNavEnum){
            for (let i= 0; i< this.navDteList.length; i++) {  
                if(this.fundValuationAndNavEnum==this.navDteList[i].appValue){
                    this.newFundValuationAndNavEnum=this.navDteList[i].value;
                } 
            }
        } 
        console.log(this.newFundValuationAndNavEnum)   
        var date = new Date();
        var seperator1 = ".";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
    //   this.fundNavText=month + seperator1 + strDate;
    },
    mounted: function () {
      this.getFundListInfo();
      this.getUserInfo();
      window.onscroll=this.pageScroll;
    },
    computed: {

    },
    watch: {

    },
    methods: {
  // 获取用户头像，昵称列表详情
        getUserInfo() {
        this.userInfoList=[];
        let params = {}; 
        params.socialUserId=this.socialUserId;
            utils.ajax({
                url: '/sfs/api/v1/user/base',
                data:params,
                success: function (result) {
                    if(result.returnCode==0){
                        this.userInfoList.push(result.body);     
                    }
                }.bind(this)
            })
        },

// 获取分享自选基金列表详情
        // splitNumberByGroup(str, group) {
        //     var nums = str.split(',');
        //     return nums.reduce((res, num, i) => {
        //         res[i/group|0].push(num)
        //         return res;
        //     }, Array.from({length: Math.ceil(nums.length/group)}, () => []))
        // },
        getFundListInfo() {
            let params = {};  
            console.log(this.newArr);
            if(this.newArr.length>1){
                params.fundIds=this.listIndex!=this.newArr.length?this.newArr[this.listIndex].join():'';
            }else{
                params.fundIds=this.newArr[this.listIndex].join() 
            }
            // params.fundIds=this.newArr.length>1?this.newArr[this.listIndex].join():this.newArr[0].join();
            params.fundValuationAndNavEnum=this.newFundValuationAndNavEnum?this.newFundValuationAndNavEnum:'WEEKLY_RETURN';  //WEEKLY_RETURN:近一周
            params.pageNo=1;
            params.pageSize=20;
            if(!params.fundIds) return;
            console.log(params);
            $(".cover").css('display','none'); //隐藏加载图标，开始加载数据
            utils.ajax({
                  url: '/mobile-bff/v1/fund/fund-valuation-and-nav-list',
                  data:params,
                  success: function (result) {
                      if(result.returnCode==0){
                        //   this.fundList=result.body;
                          console.log(result.body);
                        //   this.fundList=[...this.fundList,...result.body];
                        if (this.listIndex == 0) {
                            this.fundList=result.body;
                          } else {
                            this.fundList = this.fundList.concat(result.body);
                          }   
                          if(this.fundList.length>0){
                               this.fundNavText=this.fundList[0].valuationDate?this.fundList[0].valuationDate.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g, '$2.$3'):'--';//估值日期
                            if(this.fundValuationAndNavEnum=='rzf'){
                                // this.navDate=this.fundList[0].navDate?this.fundList[0].navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'--';//日涨幅净值日期
                                this.fundList.forEach(item=>{
                                    if(this.navDate < item.navDate){
                                        this.navDate = item.navDate;   // 取最新的日期
                                    }
                                    item.navDateString = item.navDate?item.navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'--';//日涨幅净值日期
                                })
                                this.navDateString = this.navDate?this.navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'--';//日涨幅净值日期
                            }
                          }
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
                if(_this.listIndex<_this.total){  //如果不是最后一页，则执行下拉参数
                    if(_this.total<=1) return  $(".noCover").css('display','block');   //当只有一组数据的时候返回
                    _this.listIndex++;
                    $(".cover").css('display','block'); //显示loading图标提醒加载动作
                    _this.getFundListInfo();
                }else{
                    $(".cover").css('display','none'); //隐藏loading图标提醒加载动作
                    $(".noCover").css('display','block');
                }
            }
            
        },
// 一键导入自选基金
        exportFund:function(){
            let params = {}; 
            let fundIds=this.fundList.map(function(item){
              return item.fundId;
            })
            if(fundIds.length<=0){
                return  utils.showTips('暂无可导入的自选数据');
            }
            params.productIds=fundIds.join();
            params.productType='0';  //0-基金
            console.log(params);
            utils.ajax({
                type:'POST',
                url: '/mobile-bff/v1/concern/batchAddConcern',
                data:params,
                success: function (result) {
                    if(result.returnCode==0){
                      if(result){
                          utils.showTips({
                            title: '导入成功',
                            // content: res.msg,
                            confirmText: '确定',
                            complete: function () {
                              // 跳转我的自选页
                              setTimeout(() => {
                                window.location.href = './index.html';
                              }, 1000)
                            }
                          })
                      }
                    }
                }.bind(this)
            })
        },
// 查看我的自选
        jumpUrl:function(){
          window.location.href="./index.html";
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
        fundValuationAndNavEnum(val) {
            if(val == 'rzf'){  //日涨幅
               return val = '';    //如果是日涨幅取第一条数据的时间 单独去时间：navDate      
            }else if (val == 'weeklyReturn') {
               return val = '近一周'
            }else if (val == 'yzf') {
               return val = '近一月'
            }else if (val == 'jzf') {
               return val = '近三月'
            } else if (val == 'halfYearReturn') {
               return val = '近六月'
            }else if (val == 'nzf') {
               return val = '近一年'
            }else if (val == 'twoYearReturn') {
               return val = '近二年'
            } else if (val == 'threeyearReturn') {
               return val = '近三年'
            }else if (val == 'fiveYearReturn') {
               return val = '近五年'
            } else if (val == 'jnyl') {
               return val = '今年以来'
            } else if (val == 'fromBuildReturn') {
               return val = '成立以来'
            }
            return '';
        },
    }
})