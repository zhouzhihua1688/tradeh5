/*
* @Author: mazhuo
* @Date:   2021-12-14 15:16:36
* @Last Modified by:   mazhuo
* @Last Modified time: 2021-12-23 17:38:44
*/
var vm =new Vue({
    el: '#app',
    data() {
        return {
        	title:['财商启蒙','宝宝子vlog'],
        	storyList:[],              //财富故事 数据
        	videoList:[],               //财商视频 数据
          number: 0, //title:默认选中第一个样式
          catalogId:"5214",
            // catalogId: utils.getUrlParam('catalogId'),
        };

    },
    created() { 
      var video = this.getUrlParam('video');
      if(video != ''){
          this.number = 1;
          this.catalogId='5215';
      }
      this.getDataList(); 
    },
    mounted() {
    },
    computed: {
      
    },
    watch: {

    },
    methods: {
       //头部导航切换样式
        changeTitle: function(index) {
            this.number = index // 点击时，切换选中索引
            if(index==0){       // 切换时调取接口并判断catalogId
              this.catalogId='5214'
            }else{
              this.catalogId='5215'
            }
            this.getDataList(); 
         },
        getDataList:function(catalogId){
        	// let data = {
         //        catalogId: this.catalogId=='5214'?this.catalogId:'5215', //财富故事：5214 财商视频：5215
         //        pageNo:'1',
         //        pageSize:'9999',
         //    }
            if(this.catalogId=='5214'){
               var data = {
                catalogId: this.catalogId=='5214'?this.catalogId:'5215', //财富故事：5214 财商视频：5215
                pageNo:'1',
                pageSize:'9999',
               } 
            }else{
               var data = {
                tags:'财商视频', //财富故事：5214 
               }  
            }

            let url=this.catalogId=='5214'?'/cms-service/v1/fundarticles/catalog':'/cms-service/v1/vedio/vedios-simple'

        	utils.ajax({
                url:url,
                type: 'GET',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                      console.log("后端数据:",result.body);
                      this.storyList=result.body;   // 财富故事数据
                      if(this.catalogId=='5215'){
                        this.videoList=result.body;   // 财商视频数据
                        // this.videoList=this.compar(this.videoList, 'videoId');
                      }
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
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
        jumpVideoUrl:function(videoId, url){
          if (isApp()) {
              window.location.href = "htffundxjb://action?type=media&subType=video&videoId="+ videoId;
            } else {
              window.location.href =url;
            }
      },
        getUrlParam: function (name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
          var r = window.location.search.substr(1).match(reg); //匹配目标参数
          if (r != null) return unescape(r[2]);
          return ''; //返回参数值
      },
        compar: function(array, key) {
          return array.sort(function (a, b) {
            const x = a[key];
            const y = b[key];
            return y.localeCompare(x);
          });
        },
  
    }
})