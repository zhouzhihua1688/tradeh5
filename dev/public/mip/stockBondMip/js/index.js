const vm =  new Vue({
    el:'#app',
    data(){
        return{
            pageNo:1,
            pageSize:10,
            mipList:[],
            hasLoadAllData:false
        }
    },
    created() {
        this.getMipList();
    },
    watch:{
        
    },
    computed:{
    },
    methods: {
        //获取股债定投宝列表
        getMipList:function(){
          if (this.hasLoadAllData) {
            return
          }
          utils.ajax({
            url:'/mobile-bff/v1/ats/stock-bond/list',
            type:'POST',
            data:{'agreementId':['52'],'isAllFlag':'2','pageSize':this.pageSize,'pageNo':this.pageNo},
            success:function(result){
                this.hasLoadAllData = !result.body || result.body.length < this.pageSize;
                this.mipList = this.mipList.concat(result.body);
                console.log(result);
            }.bind(this)
          })
        },

        //跳转定投详情页
        startChildMipDetail:function(contractNo){
            if (isApp()) {
                window.location.href = "htffundxjb://action?type=fm&subType=detail&contractNo=" + contractNo;
            } else {
                window.location.href = "https://www.99fund.com/m.htm";
            }
        },

        //终止计划
        stopContract:function(contractNo){
            utils.ajax({
                url:'/mobile-bff/v1/ats/stock-bond/cancel',
                type:'POST',
                data:{
                    'agreementId':'52',
                    'acceptMode':'M',
                    'contractNo':contractNo,
                    'operaType':'2'
                },
                success:function(result){
                    if (isApp()) {
                        if (isAndroidApp()) {
                            handler.startTradeVerify(JSON.stringify(result.body));
                        } else if (isIosApp()) {
                            window.webkit.messageHandlers.startTradeVerify.postMessage(result.body);
                        }
                    }
                }.bind(this)
            })
        },

        //修改计划
        modifyContract:function(contractNo){
            if(isApp()) {
                var targetUrl = "/tradeh5/newWap/mip/stockBondMip/createPlan.html?contractNo=" + contractNo;
                
                window.location.href = "htffundxjb://action?type=url&link="+btoa(window.location.origin + targetUrl);
            } else {
                window.location.href = "./createPlan.html?contractNo=" + contractNo;
            }
        },

        throttle(fn,delay){
            let flag = true;
            return function(){
                if(flag){
                    setTimeout(()=>{
                        fn.call(this);
                        flag = true;
                    },delay)
                }
                flag = false;
            }
        }
    },
    mounted(){
        window.onscroll = this.throttle(()=>{
            if (this.hasLoadAllData) {
                return
            }
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			let clientHeight = document.documentElement.clientHeight;
			let scrollHeight = document.documentElement.scrollHeight;
			if (scrollTop + clientHeight >= scrollHeight) {
				this.pageNo++;
				this.getMipList();
            }	
        },500)
    },
    filters:{
        numFormat(val) {
            if (val || val === 0) {
                val = val.toFixed(2);
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                return '';
            }
        }
    }
})

function finishTradeVerify(jsonString) {
    utils.showTips({
        content: '终止成功',
        confirmText: '我知道了'
    });
    //不适合使用reload()
    vm.hasLoadAllData = false;
    vm.pageNo = 1;
    vm.mipList = [];
    vm.getMipList();
}



