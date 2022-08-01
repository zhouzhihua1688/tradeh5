  var vm=new Vue({
  el:'#app',
  data(){
    return{
      layoutData:[],
      // 列表搜索type
      typeList:['全部','持有','自选'],
      typeCurrentIndex:0,
      // item index
      itemCurrentIndex:0,
      currentItemValue:'',
      // sub标签内容
      subDetail:[],
      // 多选标签
      multaSub:[],
      // 一年两年三年收益率,日收益率
      orderYield:{yearReturn:'近1年收益率',twoYearsReturn:'近2年收益率',threeYearsReturn:'近3年收益率'},
      currentOrderYield:'threeYearsReturn',
      selectIsShow:false,
      // searchbox部分
      // searchbox是否显示隐藏
      sBoxIsShow:false,
      searchValue:'',
      searchData:[],
      searchPageNo:1,
      // 转换tips
      tipsShow:false,
      // 基金列表
      tableData:[],
      productId:'',
      pageNo:1,
      // pageSize:20
    }
  },
  created() {
    this.getLayoutData()
    // this.getFundData(this.typeCurrentIndex,'470008')
  },
  computed:{
   
  },
  mounted() {
    // this.homePageNext();
    this.productId = utils.getUrlParam('productId');
  },
  methods: {
    getLayoutData(){
      utils.ajax({
        url: '/productcenter/v1/search/config/collections',
        success: function (result) {
            if (result.returnCode === 0) {
                console.log(result);
                this.layoutData = result.body[1].configDetail;
                this.subDetail = result.body[1].configDetail[0].itemDetail
                this.currentItemValue = result.body[1].configDetail[0].description
            }
        }.bind(this)
      })
    },
    getFundData(type){
      var type = String(type);
      var subFundTypeTagList = this.multaSub.length>0? this.multaSub.join():'';
      var url=`/mobile-bff/v1/transfer/can-transfer-fund-list?acceptMode=M`;
      url+=`&productId=${this.productId}`;
      url+=`&type=${type}`;
      if(type=='0'){
        url+=`&fundTypeTag=${this.currentItemValue}`;
        subFundTypeTagList&&(url+=`&subFundTypeTagList=${subFundTypeTagList}`);
      }
      url+=`&orderYield=${this.currentOrderYield}`;
      url+=`&pageNo=${this.pageNo}`;
      // pageSize&&(url+=`&pageSize=${this.pageSize}`);
      utils.ajax({
        url,
        success: function (result) {
            if (result.returnCode === 0) {
              console.log(result.body);
              this.tableData = this.tableData.concat(result.body);
            }
        }.bind(this)
      })
    },
    getSearchData(){
      var url=`/mobile-bff/v1/transfer/can-transfer-fund-list?acceptMode=M`;
      url+=`&productId=${this.productId}`;
      url+=`&orderYield=dailyGrowthRate`;
      url+=`&pageNo=${this.searchPageNo}`;
      url+=`&searchKey=${this.searchValue}`
      // pageSize&&(url+=`&pageSize=${this.pageSize}`);
      utils.ajax({
        url,
        success: function (result) {
            if (result.returnCode === 0) {
              this.searchData = this.searchData.concat(result.body);
            }
        }.bind(this)
      })
    },
    typeClick(index){
      this.typeCurrentIndex = index;
    },
    itemClick(item,index){
      this.subDetail = item.itemDetail;
      this.itemCurrentIndex = index;
      this.currentItemValue = item.description
    },
    subClick(item){
      if(this.multaSub.includes(item.keyValue)){
        var index=this.multaSub.findIndex((i)=>{
          return i==item.keyValue
        })
        this.multaSub.splice(index,1)
      }else{
        this.multaSub.push(item.keyValue)
      }
    },
    yieldColor(item){
      var formatYearReturn=''
      switch(this.currentOrderYield){
        case 'yearReturn': 
          formatYearReturn='yearReturn';
          break;
        case 'twoYearsReturn': 
          formatYearReturn='twoYearReturn'; 
          break; 
        case 'threeYearsReturn': 
          formatYearReturn='threeYearReturn'; 
          break; 
      }
      if(!item[formatYearReturn]&&item[formatYearReturn]!=0){
        return ''
      }
      if(item[formatYearReturn]>0||item[formatYearReturn]===0){
        return {color:'red'};
      }else{
        return {color:'green'}
      }
    },
    closeSelect(key){
      this.selectIsShow = false;
    },
    openSelect(){
      this.selectIsShow = true
    },
    clearStatus(){
      this.pageNo=1;
      this.tableData = []
    },
    // show search focus
    showSearchBox(){
      this.sBoxIsShow = true;
    },
    searching(){
      this.searchPageNo = 1;
      this.searchData = [];
      if(this.searchValue==''){
        this.searchData = [];
        return;
      }
      this.getSearchData();
    },
    searchBack(){
      this.sBoxIsShow = false;
      this.searchPageNo = 1;
      this.searchData = [];
      this.searchValue='';
      document.querySelectorAll('input[type=search]').forEach((item)=>{item.value=''})
    },
    // 主页面分页
    homePageNext(el){
      if(el.target.offsetHeight + el.target.scrollTop >= el.target.scrollHeight){
        this.pageNo++;
        this.getFundData(this.typeCurrentIndex)
      }
    },
    // 搜索页面分页
    searchPageNext(el){
      if(el.target.offsetHeight + el.target.scrollTop >= el.target.scrollHeight){
        this.searchPageNo++;
        this.getSearchData()
      }
    },
    // 转入基金
    inFund(item){
      console.log(item);
      utils.setSession('__inTransferFund',item);

      // 20220616，选中了转入基金后，返回上个页面，并带着参数 S
      window.location.href = document.referrer;   
      // window.location.href='/mobileEC/wap/fund/redeemAndConvert.html'
      // // ?productId='+utils.getUrlParam('productId')
      // 20220616，选中了转入基金后，返回上个页面，并带着参数 E
    },
  },
  watch:{
    currentItemValue(){
      this.clearStatus();
      this.getFundData(this.typeCurrentIndex);
      (this.multaSub.length>0)&&(this.multaSub = []);
    },
    multaSub(){
      this.clearStatus();
      this.getFundData(this.typeCurrentIndex)
    },
    typeCurrentIndex(newvalue,oldvalue){
      this.clearStatus();
      this.getFundData(newvalue)
    }
  },
  filters:{
    formatYearReturn(item,currentOrderYield){
      var formatYearReturn=''
      switch(currentOrderYield){
        case 'yearReturn': 
          formatYearReturn='yearReturn';
          break;
        case 'twoYearsReturn': 
          formatYearReturn='twoYearReturn'; 
          break; 
        case 'threeYearsReturn': 
          formatYearReturn='threeYearReturn'; 
          break; 
      }
      if(item[formatYearReturn]||item[formatYearReturn]===0){
        return item[formatYearReturn]+'%';
      }else{
        return '--'
      }
    }
  }
})