Vue.component('message-flow',{
    props: ['title'],
    template: '<h3>{{ title }}</h3>',
    data(){
        return{
            msgAllData:[],
            userInfo:'',
            allLoaded:false,
            popupVisible:false,
            userAgent:navigator.userAgent,
            // userIp:returnCitySN["cip"],
            topicId:'',
            // 上拉加载
            pageSize:10,
            pageNum:1
        }
    },
})

new Vue({
    el:'#app',
    data(){
        return{
            msgAllData:[],
            userInfo:'',
            allLoaded:false,
            popupVisible:false,
            userAgent:navigator.userAgent,
            // userIp:returnCitySN["cip"],
            topicId:'',
            // 上拉加载
            pageSize:10,
            pageNum:1
        }
    },
    created() {
        this.topicId=utils.getUrlParam('topicId');
        // this.getMsgList(true);
    },
    methods: {
        getMsgList(flag,flag2){
            utils.ajax({
                url: "/sfs/api/v1/post/topic",
                data:{pageNum:this.pageNum,pageSize:this.pageSize,topicId:this.topicId},
                success: function (result) {
                    if(flag){
                        this.msgAllData=result.body;
                        this.$refs.loadmore.onTopLoaded();
                        this.allLoaded = false;
                    }
                    if(flag2){
                        if(result.body.length===0){
                            this.allLoaded = true;// 若数据已全部获取完毕
                            this.$refs.loadmore.onBottomLoaded();
                        }
                        this.msgAllData=this.msgAllData.concat(result.body);
                    }
                    this.msgAllData.forEach((item)=>{
                        item.currentComment='';
                    })
                }.bind(this)
            });
        },
        // showTime(create,system){

        // },
        // 评论
        // 聚焦
        commentFocus(){
            this.currentComment='';
            this.$refs.currentComment[0].focus();
        },
        comment(item){
            var params={
                content: item.currentComment,
                id: item.postId,
                itemId: item.userId,
                itemType: "1",
                userAgent: this.userAgent,
                // userIp: this.userIp
            }
            console.log(params);
            // return;
            utils.ajax({
                url: "/sfs/api/v1/comment",
                type:'POST',
                data:params,
                success: function (result) {
                   console.log(result);
                }.bind(this)
            });
        },
        recommentVisible(){
            this.popupVisible=false;
        },
        // 点赞
        thumb(userId){
            
        },
        // 下拉刷新上拉加载
        loadTop() {
            this.pageNum=1;
            this.getMsgList(true);
        },
        loadBottom() {
            this.pageNum++;
            this.getMsgList(false,true);
        }
    },
    updated() {
        
        // allVideo[0]['disablePictureInPicture'] = true;
        // allVideo.forEach(function(item){
        //     item['disablePictureInPicture'] = true;
        // })
    },
    filters:{
        // 展示用户发布时间
        showTime(createTime,systemTime){
            if(!systemTime){
                return createTime.split(' ')[1];
            }else{
                let diff_s = Math.abs(moment(createTime).diff(moment(systemTime), 'seconds'));
				let diff_m = Math.abs(moment(createTime).diff(moment(systemTime), 'minutes'));
				let diff_h = Math.abs(moment(createTime).diff(moment(systemTime), 'hours'));
				let diff_d = Math.abs(moment(createTime.slice(0, 10) + ' 00:00:00').diff(moment(systemTime), 'days'));
				// let diff_W = Math.abs(moment(createTime).diff(moment(systemTime), 'weeks'));
				// let diff_M = Math.abs(moment(createTime).diff(moment(systemTime), 'months'));
				let diff_Y = Math.abs(moment(createTime.slice(0, 4) + '-01-01 00:00:00').diff(moment(systemTime), 'years'));

                if(diff_m < 1){             //  1分钟以内，显示xx秒前
                    return diff_s+'秒前';
                } else if( diff_h < 1){     //  1小时以内，显示xx分钟前
                    return diff_m+'分钟前';
                } else if( diff_h >= 1){
                    if(diff_d < 1){         // 今天以内的，用xx:xx(如18:20)
                        return createTime.slice(11, -3);
                    } else if(diff_d >= 1 && diff_d < 2){        // 昨天，用昨天xx：xx
                        return '昨天'+createTime.slice(11, -3);
                    } else if(diff_Y < 1){  // 昨天以前的且在当前年的，用mm/dd xx:xx表示
                        return createTime.slice(5, -3).replace(/-/g, '/');
                    } else {                // 不在当前年的，用yy/mm/dd xx:xx
                        return createTime.slice(0, -3).replace(/-/g, '/');
                    }
                }

            }
        }
    }
})