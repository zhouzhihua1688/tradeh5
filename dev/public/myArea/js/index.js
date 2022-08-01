var vm = new Vue({
    el: '#app',
    data() {
      return {
        tabList:['基金','组合','投顾','基金经理'],
        // dateList:["日涨跌",'近一周','近一月','近三月','近六月','近一年','近两年','近三年','近五年','今年以来','成立以来'],
        dateList:[
            {name:'日涨跌',value:'rzf'}, {name:'近一周',value:'weeklyReturn'}, {name:'近一月',value:'yzf'},
            {name:'近三月',value:'jzf'}, {name:'近六月',value:'halfYearReturn'},{name:'近一年',value:'nzf'}, {name:'近两年',value:'twoYearReturn'},
            {name:'近三年',value:'threeyearReturn'},{name:'近五年',value:'fiveYearReturn'},{name:'今年以来',value:'jnyl'},{name:'成立以来',value:'fromBuildReturn'}
        ],
        GroupTabList:[
            {name:'日涨跌',value:'rzf'},{name:'近一月',value:'yzf'},
            {name:'近三月',value:'jzf'}, {name:'近六月',value:'halfYearReturn'},{name:'近一年',value:'nzf'},
            {name:'近三年',value:'threeyearReturn'},{name:'今年以来',value:'jnyl'},{name:'成立以来',value:'fromBuildReturn'}
        ],
        sort:'',   //估值排序
        moneySort:'',//货币基金排序-万份
        moneyYearSort:'', //七日年化
        groupSort:'', //组合估值排序
        dayGroupSort:'',//组合现金+组合排序-日涨跌幅
        dayGroupMoneySort:'',//组合现金+组合排序-日万元收益
        investSort:'', //投顾排序
        // fundNavText:'',
        fundNavDate:'',  //基金估值日期
        fundDateText:'',  //基金净值日期
        fundMoneyNavDate:'',//货币基金万分收益日期
        groupNavDate:'', //组合估值日期
        groupDateText:'',  //组合收益率日期
        groupAddNavDate:'',  //组合 ----现金+组合日期
        investNavDate:'',   //投顾估值涨跌日期
        investDateText:'',  //投顾收益率日期
        activeIndex:'0',  //datelist索引-基金净值
        groupIndex:'0',   //datelist索引-组合收益率
        investIndex:'0' ,  //datelist索引-投顾收益率
        classifyIndex:'0',
        fundList:[], //基金列表
        fundMoneyList:[], //货币基金
        fundGroupList:[], //组合列表
        groupAddMoneyList:[],//组合=现金+组合
        investList:[],    //投顾列表
        managerList:[],  //基金经理列表
        footerList:[],   //底部估值数据
        groupMatchDate:'',  //组合对比时间数据
        matchDate:'',   //投顾对比时间

        navDt:'', // 20220616 获取最新净值日期，格式20220616
      };
  
    },
created() {
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
    this.fundNavDate=month + seperator1 + strDate;
    this.groupNavDate=month + seperator1 + strDate; //投顾和组合取今天时间
    this.investNavDate=month + seperator1 + strDate; //投顾和组合取今天时间
    //昨天
    var time = (new Date).getTime() - 24 * 60 * 60 * 1000;
    var yesday = new Date(time); // 获取的是前天
    yesday =(yesday.getMonth()> 9 ? (yesday.getMonth() + 1) : "0" + (yesday.getMonth() + 1)) + "." +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate()));
    this.fundDateText=yesday;
    this.groupDateText=yesday;
    this.investDateText=yesday;
    console.log(yesday)
},
mounted: function () {
    this.getFundInfo('','');  //基金-非货币
    this.getFundMoneyInfo('',''); //基金-货币基金
    this.getFundGroupInfo('',''); //组合-普通
    this.getGroupAddMoneyInfo('','');//组合-现金+组合
    this.getInvestInfo('',''); //--投顾
    this.getManagerInfo();   //经理
    this.getFooterInfo();   //footer指数
},
computed: {

},
watch: {

},
methods: {
    // 获取tab基金列表详情
        getFundInfo(sort,value) {
            let params = {}; 
            params.fundTp='0'; //0-非货币基金, 1-货币基金, 
            // if(sort){
            //     params.sort= sort;  //排序方法(0-降序，1-升序)
            // }
            if(value){
                params.sortType= value;  //按净值，日涨跌，近一年等查询
            }
            utils.ajax({
                url: '/mobile-bff/v1/concern/queryMyOptional',
                data:params,
                success: function (result) {
                    console.log("非货币基金:",result);
                    if(result.returnCode==0){
                        this.fundList=result.body.fundList;
                        // console.log(this.fundList)
                        if(this.fundList.length>0){
                            // this.fundDateText=value?this.fundDateText:result.body.fundList[0].navDt?result.body.fundList[0].navDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'';
                            this.fundList.forEach(item=>{
                                if(this.navDt < item.navDt){
                                    this.navDt = item.navDt;   // 取最新的日期
                                }
                                item.navDtString = item.navDt?item.navDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'--';//日涨幅净值日期
                            })
                            this.fundDateText = this.navDt?this.navDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'--';//日涨幅净值日期

                            let arrIds=this.fundList.map(function(item){
                                return item.fundId;
                                })
                            this.getFundEstimateInfo(0,arrIds.join()); //获取估值数据
                        }
                    }
                }.bind(this)
            })
        },
// 获取tab基金货币基金列表详情
        getFundMoneyInfo(moneySort,moneyYearSort) {
            let params = {}; 
            params.fundTp='1'; //0-非货币基金, 1-货币基金, 
            // if(moneySort){
            //     params.sort= moneySort;  //万份收益
            // }
            // if(moneyYearSort){
            //     params.sort= moneyYearSort;  //七日年华
            // }
            utils.ajax({
                url: '/mobile-bff/v1/concern/queryMyOptional',
                data:params,
                success: function (result) {
                    if(result.returnCode==0){
                        console.log("货币基金:",result);
                        this.fundMoneyList=result.body.currencyList;
                        if(this.fundMoneyList.length>0){
                            this.fundMoneyNavDate=result.body.currencyList[0].navDt?result.body.currencyList[0].navDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):''; 

                            if(!this.moneyYearSort){   //万份收益排序
                                if(!this.moneySort){
                                    this.fundMoneyList=result.body.currencyList;
                                }else if(this.moneySort==1){ //升序
                                    let sortNewList= this.fundMoneyList.sort(function(a,b){
                                            return a.income-b.income ;
                                    }) 
                                    this.fundMoneyList=sortNewList; 
                                }else if(this.moneySort==0){  //降序
                                    let sortNewList=this.fundMoneyList.sort(function(a,b){
                                        return b.income-a.income ;
                                    }) 
                                    this.fundMoneyList=sortNewList;
                                }
                            }
                            if(!this.moneySort){   //七日年化收益排序
                                if(!this.moneyYearSort){
                                    this.fundMoneyList=result.body.currencyList;
                                }else if(this.moneyYearSort==1){ //升序
                                    let sortNewList= this.fundMoneyList.sort(function(a,b){
                                            return a.yield-b.yield ;
                                    }) 
                                    this.fundMoneyList=sortNewList; 
                                }else if(this.moneyYearSort==0){  //降序
                                    let sortNewList=this.fundMoneyList.sort(function(a,b){
                                        return b.yield-a.yield ;
                                    }) 
                                    this.fundMoneyList=sortNewList;
                                }
                            }
                        }
                        
                        // console.log(this.fundList)
                        // if(this.fundMoneyList.length>0){
                        //     let fundMoneyIds=this.fundMoneyList.map(function(item){
                        //         return item.fundId;
                        //     })
                        //     this.getEstimateInfo(1,fundMoneyIds.join()); //获取货币基金估值数据
                        // } 
                    }
                }.bind(this)
            })
        },    
    // 获取tab组合列表数据--普通组合
        getFundGroupInfo(groupSort,value) {  
            let params = {};
            params.fundGroupTp='0'; //组合类型(0-普通组合，1-现金+组合，2 投顾) 
            // if(groupSort){
            //     params.sort= groupSort;  //排序方法(0-降序，1-升序)
            // }
            if(value){
                params.sortType= value;  //按净值，日涨跌，近一年等查询
            }
            utils.ajax({
                url: '/mobile-bff/v1/concern/groupConcernList',
                data:params,
                success: function (result) {          
                    if(result.returnCode==0){
                        console.log("组合:",result);
                        if(result.body.fundGroupList.length>0){
                            this.fundGroupList=result.body.fundGroupList.sort(function(a,b){
                                return b.navDate-a.navDate;
                            })
                        }
                        if(this.fundGroupList.length>0){
                            this.groupDateText=value?this.groupDateText:result.body.fundGroupList[0].navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3');
        
                            // 用于每条数据的时间和收益率的时间做对比用
                            this.groupMatchDate=result.body.fundGroupList[0].navDate?result.body.fundGroupList[0].navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2$3'):'';

                            let fundGroupIds=this.fundGroupList.map(function(item){
                                return item.fundGroupId;
                                })
                            this.getFundGroupEstimateInfo(0,fundGroupIds.join()); //获取估值数据
                        }
                    }
                }.bind(this)
            })
        },
    // 获取tab组合列表数据--现金＋组合
        getGroupAddMoneyInfo(dayGroupSort,dayGroupMoneySort) {  
            let params = {};
            params.fundGroupTp='1'; //组合类型(0-普通组合，1-现金+组合，2 投顾) 
            // if(dayGroupSort){
            //     params.sort= dayGroupSort;  //排序方法-日涨跌(0-降序，1-升序)
            // }
            // if(dayGroupMoneySort){
            //     params.sort= dayGroupMoneySort;  //排序方法-日万元收益
            // }
            utils.ajax({
                url: '/mobile-bff/v1/concern/groupConcernList',
                data:params,
                success: function (result) {          
                    if(result.returnCode==0){
                        console.log("现金+组合:",result);
                        this.groupAddMoneyList=result.body.currencyList;
                        if(this.groupAddMoneyList.length>0){
                            this.groupAddNavDate=result.body.currencyList[0].navDate?result.body.currencyList[0].navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3'):'';
                            if(!this.dayGroupMoneySort){   //日涨跌幅排序
                                if(!this.dayGroupSort){
                                    this.groupAddMoneyList=result.body.currencyList;
                                }else if(this.dayGroupSort==1){ //升序
                                    let sortNewList= this.groupAddMoneyList.sort(function(a,b){
                                            return a.dayQuoteChange-b.dayQuoteChange ;
                                    }) 
                                    this.groupAddMoneyList=sortNewList; 
                                }else if(this.dayGroupSort==0){  //降序
                                    let sortNewList=this.groupAddMoneyList.sort(function(a,b){
                                        return b.dayQuoteChange-a.dayQuoteChange ;
                                    }) 
                                    this.groupAddMoneyList=sortNewList;
                                }
                            }
                            if(!this.dayGroupSort){   //日万元收益排序
                                if(!this.dayGroupMoneySort){
                                    this.groupAddMoneyList=result.body.currencyList;
                                }else if(this.dayGroupMoneySort==1){ //升序
                                    let sortNewList= this.groupAddMoneyList.sort(function(a,b){
                                            return a.dayIncome-b.dayIncome ;
                                    }) 
                                    this.groupAddMoneyList=sortNewList; 
                                }else if(this.dayGroupMoneySort==0){  //降序
                                    let sortNewList=this.groupAddMoneyList.sort(function(a,b){
                                        return b.dayIncome-a.dayIncome ;
                                    }) 
                                    this.groupAddMoneyList=sortNewList;
                                }
                            }
                        }   
                    }
                }.bind(this)
            })
        },
    // 获取tab投顾列表数据
        getInvestInfo(investSort,value) {
            let params = {};
            params.fundGroupTp='2'; //组合类型(0-普通组合，1-现金+组合，2 投顾)
            // if(investSort){
            //     params.sort= investSort;  //排序方法(0-降序，1-升序)
            // }
            if(value){
                params.sortType= value;  //按净值，日涨跌，近一年等查询
            }
            utils.ajax({
                url: '/mobile-bff/v1/concern/groupConcernList',
                data:params,
                success: function (result) {           
                    if(result.returnCode==0){
                        console.log("投顾:",result);
                        if(result.body.iasList.length>0){
                            this.investList=result.body.iasList.sort(function(a,b){
                                return b.navDate-a.navDate
                            });
                        }
                        if(this.investList.length>0){
                            this.investDateText=value?this.investDateText:result.body.iasList[0].navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2.$3');
                            // 用于每条数据的时间和收益率的时间做对比用
                            this.matchDate=result.body.iasList[0].navDate?result.body.iasList[0].navDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2$3'):'';
                        }
                    }
                }.bind(this)
            })
        },
    // 获取tab基金经理列表数据
        getManagerInfo() {
            // let params = {};  
            utils.ajax({
                url: '/mobile-bff/v1/concern/concernFundManagerList',
                success: function (result) {
                    // console.log("fund:",result);
                    if(result.returnCode==0){
                        this.managerList=result.body;
                    }
                }.bind(this)
            })
        },
// 实时动态获取基金列表的估值数据  
        getFundEstimateInfo(type,idList) {
            let params = {};
            params.fundIds = idList;
            console.log(idList)
            utils.ajax({
                url: '/productcenter/v1/valuation/funds',
                type: 'POST',
                data: params,
                success: function (result) {
                    if(result.returnCode==0){
                        console.log("基金估值:",result);
                        if(type==0&&result.body.record.length>0){  //非货币基金
                            this.fundNavDate=result.body.record[0].date.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g, '$2.$3');//估值日期
                            let newList=this.fundList.map(function(item){
                                for(var i=0;i<result.body.record.length;i++){
                                    if(result.body.record[i].fundCode){
                                        if(result.body.record[i].fundCode==item.fundId){
                                            item.netChange=result.body.record[i].netChange;
                                            item.netValue=result.body.record[i].netValue;
                                            item.changePercent=result.body.record[i].changePercent;
                                            item.netDate=result.body.record[i].date;
                                        } 
                                    }
                                }
                                return item;
                            })
                            // this.fundList= newList;//非货币基金
                           
                            var hasNetValue = newList.filter((item) => {   //过滤有估值的数据
                                return item.changePercent;
                              });
                            var noNetValue = newList.filter((item) => {   //过滤无估值的数据
                                return !item.changePercent;
                            }); 
                            if(!this.sort){
                                this.fundList= newList;//非货币基金
                            }else if(this.sort==1){ //升序
                                let sortNewList=hasNetValue.sort(function(a,b){
                                        return a.changePercent-b.changePercent ;
                                }) 
                                this.fundList=sortNewList.concat(noNetValue);  //合并数组 
                            }else if(this.sort==0){  //降序
                                let sortNewList=hasNetValue.sort(function(a,b){
                                    return b.changePercent-a.changePercent ;
                                }) 
                                this.fundList=sortNewList.concat(noNetValue);  //合并数组
                            } 
                        }
                        // if(type==1){  //货币基金
                        //     let moneyNewList=this.fundMoneyList.map(function(item){
                        //         for(var i=0;i<result.body.record.length;i++){
                        //             if(result.body.record[i].fundCode){
                        //                 if(result.body.record[i].fundCode==item.fundId){
                        //                     item.netChange=result.body.record[i].netChange;
                        //                     item.netValue=result.body.record[i].netValue;
                        //                     item.netDate=result.body.record[i].date;
                        //                 }
                        //             }
                        //         }
                        //         return item;
                        //     })
                        //     this.fundMoneyList=moneyNewList;//货币基金
                        // }   
                    }
                }.bind(this)
            })
        }, 
// 实时动态获取组合列表的估值数据  
        getFundGroupEstimateInfo(type,groupIdList) {
            let params = {};
            params.groupIdList = groupIdList;
            console.log(groupIdList);
            utils.ajax({
                url: '/productcenter/v1/valuation/fundgroup/batch/latest',
                type: 'GET',
                data: params,
                success: function (result) {
                    if(result.returnCode==0){
                        console.log("组合估值:",result);
                        if(type==0&&result.body.length>0){  //组合
                            // this.groupNavDate=result.body[0].date.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g, '$2.$3');//估值日期
                            let newGroupList=this.fundGroupList.map(function(item){
                                for(var i=0;i<result.body.length;i++){
                                    if(result.body[i].groupId){
                                        if(result.body[i].groupId==item.fundGroupId){
                                            item.netChange=result.body[i].netChange;
                                            item.netValue=result.body[i].netValue;
                                            item.changePercent=result.body[i].changePercent;
                                            item.netDate=result.body[i].date;
                                        }
                                    }
                                }
                                return item;
                            })
                            // this.fundGroupList= newGroupList;//普通组合
                            var hasNetValue = newGroupList.filter((item) => {   //过滤有估值的数据
                                return item.changePercent;
                              });
                            var noNetValue = newGroupList.filter((item) => {   //过滤无估值的数据
                                return !item.changePercent;
                            }); 
                            if(!this.groupSort){
                                this.fundGroupList= newGroupList;//普通组合
                            }else if(this.groupSort==1){ //升序
                                let sortNewList=hasNetValue.sort(function(a,b){
                                        return a.changePercent-b.changePercent ;
                                }) 
                                this.fundGroupList=sortNewList.concat(noNetValue);  //合并数组 
                            }else if(this.groupSort==0){  //降序
                                let sortNewList=hasNetValue.sort(function(a,b){
                                    return b.changePercent-a.changePercent ;
                                }) 
                                this.fundGroupList=sortNewList.concat(noNetValue);  //合并数组
                            } 
                        }  
                    }
                }.bind(this)
            })
        }, 
// 实时动态获取投顾列表的估值数据         
        getinvestEstimateInfo(type,investIdList) {
            let params = {};
            params.groupIdList = investIdList;
            console.log(groupIdList);
            utils.ajax({
                url: '/productcenter/v1/valuation/fundgroup/batch/latest',
                type: 'GET',
                data: params,
                success: function (result) {
                    if(result.returnCode==0){
                        console.log("组合估值:",result);
                        if(type==0&&result.body.length>0){  //组合
                            // this.investNavDate=result.body[0].date.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g, '$2.$3');//估值日期
                            let newInvestList=this.investList.map(function(item){
                                for(var i=0;i<result.body.length;i++){
                                    if(result.body[i].groupId){
                                        if(result.body[i].groupId==item.fundGroupId){
                                            item.netChange=result.body[i].netChange;
                                            item.netValue=result.body[i].netValue;
                                            item.netDate=result.body[i].date;
                                        }
                                    }
                                }
                                return item;
                            })
                            // this.investList= newInvestList;//投顾

                            var hasNetValue = newInvestList.filter((item) => {   //过滤有估值的数据
                                return item.netChange;
                              });
                            var noNetValue = newInvestList.filter((item) => {   //过滤无估值的数据
                                return !item.netChange;
                            }); 
                            if(!this.investSort){
                                this.investList= newInvestList;//投顾
                            }else if(this.investSort==1){ //升序
                                let sortNewList=hasNetValue.sort(function(a,b){
                                        return a.netChange-b.netChange ;
                                }) 
                                this.investList=sortNewList.concat(noNetValue);  //合并数组 
                            }else if(this.investSort==0){  //降序
                                let sortNewList=hasNetValue.sort(function(a,b){
                                    return b.netChange-a.netChange ;
                                }) 
                                this.investList=sortNewList.concat(noNetValue);  //合并数组
                            }
                        }  
                    }
                }.bind(this)
            })
        }, 

//   tabList 列表切换
        changeClassify:function(item, index){
            this.classifyIndex = index;

            if(this.classifyIndex==0){
                this.showGroupDown();
                this.showInvestDown();
            }else if(this.classifyIndex==1){
                this.showImgDown();
                this.showInvestDown();
            }else if(this.classifyIndex==2){
                this.showImgDown();
                this.showGroupDown();
            } 
        },


//获取底部固定的行情信息数据
        getFooterInfo() {
            // let params = {};  
            utils.ajax({
                url: '/productcenter/v1/valuation/indices',
                success: function (result) {
                    console.log("估值数据:",result);
                    if(result.returnCode==0){
                        this.footerList=result.body.record;
                    }
                }.bind(this)
            })
        },
// 基金 排序估值
        fundSort:function(){
            // this.sort='';//排序方法(0-降序，1-升序)
            if(!this.sort){
                this.sort='0';
            }else if(this.sort=='0'){
                this.sort='1';
            }else if(this.sort='1'){
                this.sort='';
            }
            this.groupSort='';
            this.investSort='';
            this.showImgDown();  //清除阴影和弹出层列表
            this.showGroupDown();//清除阴影和弹出层列表
            this.showInvestDown();//清除阴影和弹出层列表
            this.getFundInfo(this.sort,'');
        },
// 货币基金万份收益排序 
        fundMoneySort:function(){
            this.moneyYearSort='';//清空七日年化
            if(!this.moneySort){
                this.moneySort='0';
            }else if(this.moneySort=='0'){
                this.moneySort='1';
            }else if(this.moneySort='1'){
                this.moneySort='';
            }
            this.getFundMoneyInfo(this.moneySort,'');
        },

    // 货币基金七日年化排序 
        fundMoneyYearSort:function(){
            this.moneySort='';// 清空万份收益
            if(!this.moneyYearSort){
                this.moneyYearSort='0';
            }else if(this.moneyYearSort=='0'){
                this.moneyYearSort='1';
            }else if(this.moneyYearSort='1'){
                this.moneyYearSort='';
            }
            this.getFundMoneyInfo('',this.moneyYearSort);
        },
// 组合排序估值
        groupClickSort:function(){
            // this.groupSort='';//排序方法(0-降序，1-升序)
            if(!this.groupSort){
                this.groupSort='0';
            }else if(this.groupSort=='0'){
                this.groupSort='1';
            }else if(this.groupSort='1'){
                this.groupSort='';
            }
            this.sort='';
            this.investSort='';
            this.showImgDown();  //清除阴影和弹出层列表
            this.showGroupDown();//清除阴影和弹出层列表
            this.showInvestDown();//清除阴影和弹出层列表
            if(this.classifyIndex=='1'){//组合
                this.getFundGroupInfo(this.groupSort,'');
            }    
        }, 
    //组合:现金＋组合排序--日涨跌幅 
        addDayGroupSort:function(){
            this.dayGroupMoneySort='';// 清空万份收益
            if(!this.dayGroupSort){
                this.dayGroupSort='0';
            }else if(this.dayGroupSort=='0'){
                this.dayGroupSort='1';
            }else if(this.dayGroupSort='1'){   
                this.dayGroupSort='';
            }
            this.getGroupAddMoneyInfo(this.dayGroupSort,'');
        },
    //组合:现金＋组合排序--日万元收益 
        addDayGroupMoneySort:function(){
            this.dayGroupSort='';// 日涨跌幅 
            if(!this.dayGroupMoneySort){
                this.dayGroupMoneySort='0';
            }else if(this.dayGroupMoneySort=='0'){
                this.dayGroupMoneySort='1';
            }else if(this.dayGroupMoneySort='1'){
                this.dayGroupMoneySort='';
            }
            this.getGroupAddMoneyInfo('',this.dayGroupMoneySort);
        },
    // 投顾排序估值
        investClickSort:function(){
            // this.groupSort='';//排序方法(0-降序，1-升序)
            if(!this.investSort){
                this.investSort='0';
            }else if(this.investSort=='0'){
                this.investSort='1';
            }else if(this.investSort='1'){
                this.investSort='';
            }
            this.sort='';
            this.groupSort='';
            this.showImgDown();  //清除阴影和弹出层列表
            this.showGroupDown();//清除阴影和弹出层列表
            this.showInvestDown();//清除阴影和弹出层列表
            this.getInvestInfo(this.investSort,'');    
        }, 
// tabList 基金净值列表切换
        fundActiveIcon:function(item, index){
            this.activeIndex = index;
            //昨天
            var time = (new Date).getTime() - 24 * 60 * 60 * 1000;
            var yesday = new Date(time); // 获取的是前天
            yesday =(yesday.getMonth()> 9 ? (yesday.getMonth() + 1) : "0" + (yesday.getMonth() + 1)) + "." +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate()));
            this.fundDateText=item.value=='rzf'?yesday:item.name;
            this.getFundInfo('',item.value);  //按净值列表选择查询--基金
            this.showImgDown();       
        }, 
// tabList 组合净值列表切换
        groupActiveIcon:function(item, index){
            this.groupIndex = index;   
            //昨天
            var time = (new Date).getTime() - 24 * 60 * 60 * 1000;
            var yesday = new Date(time); // 获取的是前天
            yesday =(yesday.getMonth()> 9 ? (yesday.getMonth() + 1) : "0" + (yesday.getMonth() + 1)) + "." +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate()));
            this.groupDateText=item.value=='rzf'?yesday:item.name;
            this.getFundGroupInfo('',item.value);  //按净值列表选择查询--基金     
            this.showGroupDown();       
        }, 
// tabList 投顾净值列表切换
        investActiveIcon:function(item, index){
            this.investIndex = index;
            //昨天
            var time = (new Date).getTime() - 24 * 60 * 60 * 1000;
            var yesday = new Date(time); // 获取的是前天
            yesday =(yesday.getMonth()> 9 ? (yesday.getMonth() + 1) : "0" + (yesday.getMonth() + 1)) + "." +(yesday.getDate()> 9 ? (yesday.getDate()) : "0" + (yesday.getDate()));
            this.investDateText=item.value=='rzf'?yesday:item.name;
            this.getInvestInfo('',item.value);  //按净值列表选择查询--基金
            this.showInvestDown();       
        },    
// tabList列表净值部分的显示隐藏--基金净值
        showImgUp:function(){
            $('.fundActiveIcon').slideDown()
            $(".imgUp").hide();
            $(".imgDown").show();
            $(".fundMask").show();
            this.sort='';   //清除排序
        }, 
        showImgDown:function(){
            $('.fundActiveIcon').slideUp()
            $(".imgUp").show();
            $(".imgDown").hide();
            $(".fundMask").hide();
            
        }, 
// tabList列表净值部分的显示隐藏--组合收益率
        showGroupUp:function(){
            var _this=this;
            $('.groupActiveIcon').slideDown()
            $(".imgGroupUp").hide();
            $(".imgGroupDown").show();
            $(".groupMask").show();
            this.groupSort='';   //清除排序
            // this.showImgDown();
            // this.showInvestDown();
        }, 
        showGroupDown:function(){
            $('.groupActiveIcon').slideUp()
            $(".imgGroupUp").show();
            $(".imgGroupDown").hide();
            $(".groupMask").hide();
            // this.showImgDown();
            // this.showInvestDown();
        }, 
// tabList列表净值部分的显示隐藏--投顾收益率
        showInvestUp:function(){
            $('.investActiveIcon').slideDown()
            $(".imgInvestUp").hide();
            $(".imgInvestDown").show();
            $(".investMask").show();
            this.investSort='';   //清除排序
            // this.showImgDown();
            // this.showGroupDown();
        }, 
        showInvestDown:function(){
            $('.investActiveIcon').slideUp()
            $(".imgInvestUp").show();
            $(".imgInvestDown").hide();
            $(".investMask").hide();
            // this.showImgDown();
            // this.showGroupDown();
        },    
//弹出底部信息数据    
        compositeUp:function(){
            $('.slideList').slideDown();
            $('#compositeUp').hide();
            $('#compositeDown').show();
        },
//隐藏底部信息数据 
        compositeDown:function(){
            $('.slideList').slideUp();
            $('#compositeUp').show();
            $('#compositeDown').hide();
        },
//跳转到资讯公告页面
        jumpInformation:function(){
            console.log(this.fundList);
            var _this=this;
            // let fundId=[];
            // let fundIds=this.fundList.map(function(item){
            //     return item.fundId;
            // })
            // window.location.href=fundIds.length!=0?'./information.html?fundIds='+fundIds.join():'./information.html?fundIds=" "';
            window.location.href='./information.html';

            // let fundGroupIds=this.fundGroupList.map(function(item){
            //     return item.fundGroupId;
            // })
            // let investGroupIds=this.investList.map(function(item){
            //     return item.fundGroupId;
            // })
            // if(_this.classifyIndex==0){  //基金
            //     window.location.href=fundIds.length!=0?'./information.html?fundIds='+fundIds.join():'./information.html?fundIds=" "';
            // }else if(_this.classifyIndex==1){ //组合
            //     window.location.href=fundGroupIds.length!=0?'./information.html?fundIds='+fundGroupIds.join():'./information.html?fundIds=" "';
            // }else if(_this.classifyIndex==2){ //投顾
            //     window.location.href=investGroupIds.length!=0?'./information.html?fundIds='+investGroupIds.join():'./information.html?fundIds=" "';
            // }
            
        },
        // 跳转到讨论页面
        jumpFreeToDiscuss:function(){
            window.location.href='./freeToDiscuss.html';
        },
 
     

 
    
  
    
      //切换金额样式
    //   changeMoney: function (index, item) {
    //     this.inputValue = this.amount[index].value; //选择默认的金额填入输入框
    //     this.number = index; //默认金额样式的切换
  
    //     let money = this.inputValue.replace(/[,A-z]/g, '');
    //     this.chinese = this.changeNumMoneyToChinese(money); //转换成中文金额大写格式
    //   },

  
 
  
    
    
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