Vue.config.devtools = true;
var vm = new Vue({
    el: '#app',
    data() {
        return {
            msgAllData: [],
            recommendData: {},
            video: '',
            showStatus: 0,
            commentList: '',
            postList: '',
            postTitle: '',
            topicTitle: '',
            articleDesc: '',
            resultData: '',
            userInfo: '',
            recommendUserList: [], // 推荐账号列表
            recommendUserPageSize: 6, // 推荐账号列表，每页6条数据
            recommendUserCurrentIndex: 0, // 推荐账号列表，当前页
            followNewFlag: '', // 关注小红点，是否展示flag
            // noContentHeight: 0,          // 暂无内容，所占页面高度
            allLoaded: false,
            loading: true,
            showLoading: true,
            popupVisible: false,
            userAgent: navigator.userAgent,
            // userIp:returnCitySN["cip"],
            currrentOrder: 'NEW',    //原参数HOT
            // 放大图片
            currentSwiper: null,
            isEnlarge: false,
            enlargeImgUrl: '',
            currentImgList: [],
            // 显示pop-list
            isHandleMore: false,
            // itemType
            itemType: {
                topic: {
                    type: '1',
                    name: '话题'
                },
                post: {
                    type: '2',
                    name: '动态'
                },
                fund: {
                    type: '3',
                    name: '基金'
                },
                comment: {
                    type: '4',
                    name: '留言'
                },
                reply: {
                    type: '5',
                    name: '回复'
                },
                user: {
                    type: '6',
                    name: '用户'
                },
                activity: {
                    type: '8',
                    name: '活动'
                }
            },
            // share、report只能在app环境
            isShare: false,
            // comment
            isComment: null,
            currentMsgData: null,
            currentMsgIndex: null,
            currentComment: '',
            isReply: false,
            currentPreset: '喜欢就评论',
            // 记录视频id
            myPlayer: [],
            oldId: '',
            // 上拉加载
            pageSize: 10,
            pageNum: 1,
            option: [],
            optionList: [],
            questions: [],
            options: [],
            surveyId: '',
            questionId: '',
            show: true,
            showPerent: false,
            style: '',
            isChoiceShow: false,
            width: '',
            surveyId: '',

            cancelVoteItem: {},

            styleLeft: {
                width: '',
            },
            styleObject: {
                width: '',
            },
            optionId: '',
            num: '0',
            // i: null,
            // active: false,
            // moreSelsect:[]
            voteInfoList: [],
            questionsList: [],
            optionsList: [],
            moreActiveIndex: [], //用于添加样式用
            arrOptionId: [],
            mySwiper2: null,
            activeIndex:-1,//用于投票里摘要显示
        }
    },
    created() {
        this.getMsgList(true, false, this.currrentOrder);

        this.getLayoutData();
        this.getUserInfo();
        // 获取关注小红点
        this.getFollowNewFlag();
        // 获取推荐账号
        this.getRecommendUser();
    },
    mounted: function () {
        this.isShare = isApp() ? true : false;
        // this.isShare=true;  
        if (navigator.userAgent.indexOf('QQBrowser') != -1 && navigator.userAgent.indexOf('Android') != -1) {
            this.$toast({
                message: '[注意] 在Android版微信中播放视频可能会被自动全屏。',
                position: 'middle',
                duration: 2000
            });
        }
    },
    computed: {
        noContentHeight() {
            var fontSize = document.documentElement.style.fontSize;
            return this.loading ? '0' : (($(window).height() / parseInt(fontSize) - 221 / 20) + 'rem');
        },
        recommendUserListDisplay() {
            return this.recommendUserList.slice(this.recommendUserCurrentIndex * this.recommendUserPageSize, (this.recommendUserCurrentIndex + 1) * this.recommendUserPageSize);
        },
        // styleVar: function () {
        //     for(var i=0; i<this.msgAllData.length;i++){
        //
        //         if(this.msgAllData[i].voteInfo!=null){
        //             this.option.push(this.msgAllData[i]);
        //             alert(this.surveyId);
        //             if(this.msgAllData[i].voteInfo.complete==true&&this.surveyId==this.msgAllData[i].voteInfo){
        //               var leftWidth=this.msgAllData[i].voteInfo.optionStats[0].optionCount;
        //               var rightWidth=this.msgAllData[i].voteInfo.optionStats[1].optionCount;
        //               var sum=leftWidth+rightWidth;
        //
        //               var leftPerent=(leftWidth/sum*100);
        //               alert(leftPerent)
        //
        //                 // var left = (optionStats[j].optionCount / prices * 100).toFixed(1);
        //
        //             }
        //         }
        //     }
        //     if(leftPerent!=100) {
        //         var leftStrip = {
        //             "width": leftPerent + '%',
        //             // "borderRadius": '50px',
        //             // "borderRight":'none',
        //             "transition": "1s"
        //         }
        //     }else{
        //         var leftStrip = {
        //             "width": leftPerent + '%',
        //             "borderRadius": '50px',
        //             "borderRight":'none',
        //             "transition": "1s"
        //         }
        //     }
        //     alert(leftPerent)
        //     return leftStrip;
        //    },
    },
    watch: {
        currentMsgIndex(newvalue, oldvalue) {
            this.currentPreset = '喜欢就评论'
        },
    },
    methods: {
        // 20220110--增加标题描述超过一定字数截取部分显示全部
        showText:function(index){
            console.log('index:',index);
            this.activeIndex = this.activeIndex == index ? -1 : index; 
        },
        // 获取关注小红点
        getFollowNewFlag() {
            $.ajax({
                url: "/sfs/api/v1/post/follow/new",
                success: function (result) {
                    if (result.returnCode == 0) {
                        if (result.body) {
                            this.followNewFlag = result.body;
                        }
                    }
                }.bind(this)
            });
        },
        // 获取推荐账号
        getRecommendUser() {
            $.ajax({
                url: "/sfs/api/v1/bbs/recommend/user",
                success: function (result) {
                    // var result = {
                    //     "returnCode": 0,
                    //     "returnMsg": "",
                    //     "body": {
                    //       "userInfos": [
                    //         { "avatarImage": null, "nickname": "游客-222", "userId": "222", "verified": false, "title": null, "guest": true, "custNo": null, "signature": null, "followTopicCount": null, "followUserCount": null, "fansCount": null, "followStatus": null },
                    //         { "avatarImage": null, "nickname": "游客-33", "userId": "33", "verified": false, "title": null, "guest": true, "custNo": null, "signature": null, "followTopicCount": null, "followUserCount": null, "fansCount": null, "followStatus": null },
                    //         { "avatarImage": null, "nickname": "游客-333", "userId": "333", "verified": false, "title": null, "guest": true, "custNo": null, "signature": null, "followTopicCount": null, "followUserCount": null, "fansCount": null, "followStatus": null },
                    //         {
                    //           "avatarImage": null,
                    //           "nickname": "游客-11111212",
                    //           "userId": "11111212",
                    //           "verified": false,
                    //           "title": null,
                    //           "guest": true,
                    //           "custNo": null,
                    //           "signature": null,
                    //           "followTopicCount": null,
                    //           "followUserCount": null,
                    //           "fansCount": null,
                    //           "followStatus": null
                    //         }
                    //       ],
                    //       "notFollow": true
                    //         // "notFollow": false
                    //     }
                    //   }
                    if (result.returnCode == 0) {
                        if (result.body && result.body.userInfos) {
                            result.body.userInfos.forEach((item) => {
                                item.selected = true;
                            })
                            this.recommendUserList = result.body.userInfos;
                            this.recommendUserCurrentIndex = 0;
                            // this.recommendUserList = [].concat(result.body.userInfos);
                        } else {
                            this.recommendUserList = [];
                        }
                    }
                }.bind(this)
            });
        },
        // 右边进度条长度
        //         intoPercent1: function (num) {
        //             var _this=this;
        //             _this.styleLeft.width=num+'%';
        //         },
        // intoPercent2: function (one,two,index) {
        //     var _this=this;
        //     var prices=one+two; //数组值相加求百分比用
        //
        //     var str=(one/prices*100);
        //
        //     _this.styleObject.width=str+'%';
        // },

        // translate:function(val){
        //     for (var i = 0; i < this.msgAllData.length; i++) {
        //
        //         if (this.msgAllData[i].voteInfo != null) {
        //             if (this.msgAllData[i].voteInfo.complete == true) {
        //
        //                 for (var j = 0; j < this.msgAllData[i].voteInfo.optionStats.length; j++) {
        //                     if(val==this.msgAllData[i].voteInfo.optionStats[j].optionId) {
        //                        alert(val)
        //                         return this.msgAllData[i].voteInfo.optionStats[j].optionName
        //                     }
        //
        //                 }
        //
        //             }
        //         }
        //     }
        //
        //
        // },
        getUserInfo() {
            $.ajax({
                url: "/sfs/api/v1/user",
                success: function (result) {
                    if (result.returnCode == 0) {
                        if (result.body) {
                            this.userInfo = result.body;
                        }
                    }
                }.bind(this)
            });
        },
        // 附件和超链接的排序
        //sortBy函数接受一个成员名字符串和一个可选的次要比较函数做为参数
        sortBy(name, minor) {
            return function (o, p) {
                var a, b;
                if (o && p && typeof o === 'object' && typeof p === 'object') {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return typeof minor === 'function' ? minor(o, p) : 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                } else {
                    thro("error");
                }
            }
        },
        getMsgList(flag, flag2, order) {
            // flag==true:下拉刷新    flag2==true:上拉加载
            if (order == 'FOLLOW') {
                this.followNewFlag = false;
            } else {
                // 刷新时check关注小红点
                this.getFollowNewFlag();
            }
            var _this = this;
            this.option = [];
            this.optionList = [];
            this.questions = [];
            // this.msgAllData=[];
            // this.options=[];
            if (order !== this.currrentOrder) {
                this.pageNum = 1;
                console.log(this.myPlayer);
                this.$nextTick(function () {
                    this.myPlayer.forEach(function (player) {
                        player.release();
                    })
                    this.myPlayer = [];
                })

            }
            // this.$nextTick(function(){
            this.currrentOrder = order;
            if (order == 'FOLLOW') {
                $('.filter span:nth-of-type(1)').addClass('active').children('i').addClass('active');
                // $('.filter span:nth-of-type(2)').removeClass('active').children('i').removeClass('active');
                // $('.filter span:nth-of-type(3)').removeClass('active').children('i').removeClass('active');
                $('.filter span:nth-of-type(2)').removeClass('active').children('i').removeClass('active');
            } else if (order == 'HOT') {
                $('.filter span:nth-of-type(1)').removeClass('active').children('i').removeClass('active');
                $('.filter span:nth-of-type(2)').addClass('active').children('i').addClass('active');
                $('.filter span:nth-of-type(3)').removeClass('active').children('i').removeClass('active');
            } else if (order == 'NEW') {  //原参数CREATE_TIME
                $('.filter span:nth-of-type(1)').removeClass('active').children('i').removeClass('active');
                // $('.filter span:nth-of-type(2)').removeClass('active').children('i').removeClass('active');
                // $('.filter span:nth-of-type(3)').addClass('active').children('i').addClass('active');
                $('.filter span:nth-of-type(2)').addClass('active').children('i').addClass('active');
            } else {
                $('.filter span:nth-of-type(2)').addClass('active').children('i').addClass('active');
            }
            utils.ajax({
                url: "/sfs/api/v1/post",
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    postSortEnum: order ? order : 'NEW'     //原参数HOT
                },
                success: function (result) {
                    if (flag) {
                        this.msgAllData = result.body;
                        console.log("-----------------------------")
                        console.log(result.body)
                        this.$refs.loadmore.onTopLoaded();
                        this.allLoaded = false;
                        this.showLoading = true;
                    }
                    if (flag2) {
                        if (result.body.length === 0) {
                            this.allLoaded = true; // 若数据已全部获取完毕
                            this.$refs.loadmore.onBottomLoaded();
                            this.$toast({
                                message: '没有更多了',
                                position: 'middle',
                                duration: 2000
                            });
                            this.showLoading = false;
                        }
                        this.msgAllData = this.msgAllData.concat(result.body);

                    }

                    for (var i = 0; i < this.msgAllData.length; i++) {

                        // 附件和超链接的排序
                        if (this.msgAllData[i].attachments.length > 0) {
                            this.msgAllData[i].attachments.sort(_this.sortBy("attachType"))
                        }
                        if (this.msgAllData[i].voteInfo != null) {

                            if (this.msgAllData[i].voteInfo.complete == true) {


                                // var sortData = function (data){

                                // return data.voteInfo.optionStats.sort((a,b) => {
                                //     return a.optionId - b.optionId
                                //
                                // })


                                if (this.msgAllData[i].voteInfo.optionStats < 3) { //当只是A,B二选一的时候

                                    var num = this.msgAllData[i].voteInfo.optionStats[0].optionCount + this.msgAllData[i].voteInfo.optionStats[1].optionCount;

                                    var percent1 = this.msgAllData[i].voteInfo.optionStats[0].optionCount / num * 100;
                                    var percent2 = this.msgAllData[i].voteInfo.optionStats[1].optionCount / num * 100;

                                    for (var j in this.msgAllData[i].voteInfo.optionStats) {
                                        this.msgAllData[i].voteInfo.optionStats.map(function (item) {
                                            return item.fenshu = "";
                                        })

                                        this.msgAllData[i].voteInfo.optionStats[0].fenshu = percent1;
                                        this.msgAllData[i].voteInfo.optionStats[1].fenshu = percent2;
                                    }
                                    this.msgAllData[i].voteInfo.optionStats.sort((a, b) => {
                                        return a.optionId - b.optionId

                                    })

                                } else { //当只是A,B,C,D多选一的时候，或者多选多

                                    this.msgAllData[i].voteInfo.optionStats.sort((a, b) => {
                                        return a.optionId - b.optionId

                                    })
                                    // 求总和
                                    var sum = this.msgAllData[i].voteInfo.optionStats.reduce((pre, cur) => {
                                        return pre + cur.optionCount
                                    }, 0)

                                    console.log("sum", sum);

                                    for (var j in this.msgAllData[i].voteInfo.optionStats) {
                                        this.msgAllData[i].voteInfo.optionStats[j].fenshu = this.msgAllData[i].voteInfo.optionStats[j].optionCount / sum * 100;

                                        for (var k in this.msgAllData[i].voteInfo.answerDetails) { //用来给选中投票的添加样式判断 active字段

                                            if (this.msgAllData[i].voteInfo.optionStats[j].optionId == this.msgAllData[i].voteInfo.answerDetails[k].optionId) {
                                                this.msgAllData[i].voteInfo.optionStats[j].active = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    console.log(this.msgAllData);
                    this.$nextTick(() => {
                        this.mySwiper2 = new Swiper('.swiperUrl', {
                            loop: false,
                            autoplay: false,
                            pagination: {
                                el: '.swiperurls-pagination',
                                // el: '.swiper-pagination',
                                type: 'custom',
                                renderCustom: function (swiper, current, total) {
                                    var _html = ''; 
                                 console.log('total',total)
                                    if (total < 2) {
                                        return 
                                    } else {
                                        for (var i = 1; i <= total; i++) {
                                            if (current == i) {
                                                _html +=
                                                    '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                                            } else {
                                                _html += '<span class="swiper-pagination-customs"></span>';
                                            }
                                        }
                                    }
                                    return _html; //返回所有的页码html
                                }}
                        })
                    })
                    // console.log("option",this.option);
                    //
                    // for (var j= 0; j<this.option.length; j++) {
                    //     this.optionList.push(this.option[j].voteInfo);
                    // }
                    // console.log("optionList",this.optionList);

                    // _this.add(80,20,"");

                    //
                    // if(item.voteInfo.complete==true){
                    //
                    //
                    // }

                    // for (var k= 0; k<this.optionList.length; k++) {
                    //    this.questions=this.questions.concat(this.optionList[k].questions);  
                    // }
                    // console.log("questions",this.questions)

                    // for (var l= 0; l<this.questions.length; l++) {

                    //     console.log(this.questions[0].options[0].optionName)
                    //     $(".noChoice .vote .buy").eq(0).text(this.questions[0].options[0].optionName)

                    // }
                    //  console.log("options",this.options)
                    // for (var m= 0; m<this.options.length; m++) {
                    //     alert($(".noChoice .buy").eq(0).text()); 
                    // }

                    // console.log('this.msgAllData=', this.msgAllData);
                    // this.currrentOrder=='FOLLOW' && (this.msgAllData = []);
                    if (this.currrentOrder == 'FOLLOW') {
                        // this.msgAllData = []
                        this.recommendUserCurrentIndex = 0;
                        this.recommendUserList.forEach((item) => {
                            item.selected = true;
                        })
                        // this.$set(this.recommendUserList, this.recommendUserList)
                        this.msgAllData.length == 0 && (this.allLoaded = true); // 展示推荐账户列表，可以认为下拉数据获取完毕
                      
                    }

                    this.loading = false;

                    this.msgAllData.forEach(function (item) {
                        item.currentComment = "";
                    }.bind(this));
                 
                }.bind(this)
            });
            // })

        },


        // 20210913-start-添加投票功能
        // 左边投票按钮
        // optionId,surveyId,questionId,surveySceneCode,num
        voteBuy: function (questionItem, item, optionIndex) {

            var optionId = questionItem.options[optionIndex].optionId;
            var surveyId = item.voteInfo.surveyId;
            var questionId = questionItem.questionId;
            var surveySceneCode = item.voteInfo.surveySceneCode;

            console.log("voteBuy questionItem", questionItem);
            console.log("voteBuy item", item);

            console.log("optionId", optionId);
            console.log("surveyId", surveyId);
            console.log("questionId", questionId);
            console.log("surveySceneCode", surveySceneCode);

            var params = {};
            var answerVoList = [{
                "optionArray": [optionId],
                "questionId": questionId
            }]
            params.answerVoList = answerVoList;
            params.branchCode = "247";
            params.surveyId = surveyId;
            params.surveySceneCode = surveySceneCode;
            console.log(params)

            utils.ajax({
                url: "/caa/v1/survey/survey",
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {

                        // 更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if (result.body.voteInfo.optionStats) {
                                        var voteInfo = result.body.voteInfo;
                                        voteInfo.optionStats.sort((a, b) => { //让id从小到大排序，用于前端页面展示
                                            return a.optionId - b.optionId
                                        })

                                        var num = voteInfo.optionStats[0].optionCount + voteInfo.optionStats[1].optionCount;

                                        var percent1 = voteInfo.optionStats[0].optionCount / num * 100;
                                        var percent2 = voteInfo.optionStats[1].optionCount / num * 100;

                                        for (var j in voteInfo.optionStats) {
                                            voteInfo.optionStats[0].fenshu = percent1;
                                            voteInfo.optionStats[1].fenshu = percent2;
                                        }
                                    }

                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                }
                            }.bind(this)
                        });


                    }
                }.bind(this)
            });

        },

        intoPercent: function (one, two, index) {
            var _this = this;
            // _this.add(one,two,index);
            var prices = one + two; //数组值相加求百分比用

            var str = (one / prices * 100).toFixed(1);

            return this.width = str + '%';
        },
        // 调用取消接口
        cancelVote: function () {
            var _this = this;
            var item = this.cancelVoteItem;
            var surveyId = item.voteId;
            console.log("surveyId", item.surveyId);
            utils.ajax({
                url: "/caa/v1/survey/survey/cancel",
                type: 'POST',
                data: {
                    surveyId: surveyId,
                    branchCode: '247'
                },
                success: function (result) {
                    if (result.returnCode === 0) {
                        $("#layer0").hide();
                        // this.getMsgList(true, false, this.currrentOrder);

                        // 更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if (result.body.voteInfo.optionStats) {
                                        var voteInfo = result.body.voteInfo;

                                        var num = voteInfo.optionStats[0].optionCount + voteInfo.optionStats[1].optionCount;

                                        var percent1 = voteInfo.optionStats[0].optionCount / num * 100;
                                        var percent2 = voteInfo.optionStats[1].optionCount / num * 100;

                                        for (var j in voteInfo.optionStats) {
                                            voteInfo.optionStats[0].fenshu = percent1;
                                            voteInfo.optionStats[1].fenshu = percent2;
                                        }
                                    }
                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                    if (!result.body.voteInfo.optionStats) {
                                        _this.moreActiveIndex = []; //把上次选中的索引样式清空
                                        // 添加或者取消按钮的样式
                                        Vue.set(item, 'active', false); //取消按钮的样式
                                    } else {
                                        Vue.set(item, 'active', true); // 添加按钮的样式
                                    }
                                }
                            }.bind(this)
                        });

                    }
                }.bind(this)
            });
        },

        // 投票比对
        /*add——创建tbx下的div加文字和变宽度的方法*/
        add: function (i, k, index) {

            // var i=40;
            // var k=60;
            // var tbox =$(".bar");
            // var tiao =$(".tiao");
            // var progress =$(".progress");
            var second = $(".select .second");

            // var left =$(".select .second .left");

            var left = $(".sub-block").eq(index).find($(".select .second .left"));

            // var left =$(".sub-block").find($(".select .second .left"));

            // var right =$(".select .second .right");

            var right = $(".sub-block").eq(index).find($(".select .second .right"));
            if (i >= 100) {

                this.showPerent = true;
                left.css("width", "100%");
                $(".select .second .right").hide();
                $(".select .second .left").css({
                    borderRight: 'none',
                    borderRadius: '50px'
                });

                // $(".vote .first .number").html("100%");
            } else {
                left.css("width", i + "%");
                // $(".vote .first .number").html(i+"%")
            }
            if (k >= 100) {
                right.css("width", "100%");
                $(".select .second .left").hide();
                $(".select .second .right").css({
                    borderRight: 'none',
                    borderRadius: '50px',
                    marginLeft: '0.45rem'
                });
                // $(".vote .second .number").html("100%");
            } else {
                right.css("width", k + "%");
                // $(".vote .second .number").html(k+"%")
            }
        },
        // xh:function(index){
        //   var _this=this
        //     var i=40;
        //     var k=60;
        //     if(i<=100||k<=100){
        //         var time=setTimeout("xh("+index+")",100)
        //         _this.add(i,k);
        //        clearTimeout(time);          
        //     }            
        // },

        // 取消投票
        choiceVote: function (item) { //显示弹框
            // var voteId = item.voteId;
            // this.surveyId=voteId;
            this.cancelVoteItem = item;
            $("#layer0").show();
        },
        closeHide: function (index) {
            $("#layer0").hide()
        },

        // 这是多个投票回答单选代码-多选一
        moreSelect: function (item, questionItem, itemOp, indexOp) {
            var _this = this;
            _this.voteInfoList = [];
            _this.questionsList = [];
            _this.optionsList = [];

            for (var i = 0; i < _this.msgAllData.length; i++) {
                if (_this.msgAllData[i].voteInfo) {
                    _this.voteInfoList.push(_this.msgAllData[i].voteInfo);
                }

            }
            for (var k = 0; k < this.voteInfoList.length; k++) {
                _this.questionsList = _this.questionsList.concat(_this.voteInfoList[k].questions);
            }


            for (var m = 0; m < _this.questionsList.length; m++) {
                if (_this.questionsList[m].options.length > 2) {
                    _this.optionsList = _this.optionsList.concat(_this.questionsList[m].options);
                }
            }


            console.log(_this.questionsList);
            console.log(_this.optionsList);

            this.$nextTick(function () {
                _this.optionsList.forEach(function (item) {

                    Vue.set(item, 'active', false);
                });
                Vue.set(itemOp, 'active', true);

            });

            // 调取投票接口
            console.log("item", item);
            var optionId = questionItem.options[indexOp].optionId;
            var questionId = questionItem.questionId;
            var surveyId = item.voteInfo.surveyId;
            var surveySceneCode = item.voteInfo.surveySceneCode;

            console.log("optionId", optionId);
            console.log("questionId", questionId);
            console.log("surveyId", surveyId);
            console.log("surveySceneCode", surveySceneCode);

            var params = {};
            var answerVoList = [{
                "optionArray": [optionId],
                "questionId": questionId
            }]
            params.answerVoList = answerVoList;
            params.branchCode = "247";
            params.surveyId = surveyId;
            params.surveySceneCode = surveySceneCode;
            console.log(params);

            // 提交投票
            utils.ajax({
                url: "/caa/v1/survey/survey",
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        // 更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if (result.body.voteInfo.optionStats) {
                                        var voteInfo = result.body.voteInfo;


                                        voteInfo.optionStats.sort((a, b) => {
                                            return a.optionId - b.optionId
                                        })

                                        // 求总和
                                        var sum = voteInfo.optionStats.reduce((pre, cur) => {
                                            return pre + cur.optionCount
                                        }, 0)

                                        console.log("sum", sum);

                                        for (var j in voteInfo.optionStats) {
                                            voteInfo.optionStats[j].fenshu = voteInfo.optionStats[j].optionCount / sum * 100;
                                        }
                                    }
                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                }
                            }.bind(this)
                        });

                    }
                }.bind(this)
            });
        },
        percent: function (fenshu) {
            return fenshu ? fenshu.toFixed(1) + '%' : '0%';
        },


        //这是多个投票回答(A,B,C,D)选择多个的代码-多选多
        muchSelect: function (item, questionItem, itemOp) {
            var _this = this;
            // 这一步只是列表添加样式用
            if (this.moreActiveIndex.indexOf(itemOp) !== -1) { //用于添加样式用
                this.moreActiveIndex.splice(this.moreActiveIndex.indexOf(itemOp), 1); //取消
                itemOp.check = false; //用作取消用
            } else {
                this.moreActiveIndex.push(itemOp); //选中添加到数组里
                itemOp.check = true; //用作选择用
                // $(".moreSelect .confirm").eq(index).addClass("confirmActive");
            }
            // 添加或者取消按钮的样式
            if (item.active) {
                if (this.moreActiveIndex == "") {
                    Vue.set(item, 'active', false); //取消按钮的样式
                }
            } else {
                Vue.set(item, 'active', true); // 添加按钮的样式
            }
            // this.$nextTick(function () {
            //     _this.optionsList.forEach(function (item) {
            //
            //         Vue.set(item,'active',false);
            //     });
            //     Vue.set(itemOp,'active',true);
            //
            // });

            // 调取投票接口
            // console.log("item",item);
            //
            // var arr=[];
            // var optionId=questionItem.options[indexOp].optionId;


            // let text=$(this).text();

            // let text = questionItem.options.optionId;
            // let ind = arr.indexOf(text);
            //
            // if (ind === -1) {
            //     arr.push(text);
            // }
            // else {
            //     arr.splice(ind, 1);
            // }

        },
        // 点击确认投票按钮
        confirm: function (item, questionItem) {
            var _this = this;
            var arrOptionId = [];
            for (var i = 0; i < questionItem.options.length; i++) {
                if (questionItem.options[i].check && questionItem.options[i].check == true) {
                    arrOptionId.push(questionItem.options[i].optionId); //拿到选择的OptionId
                }
            }

            if (arrOptionId == "") {
                return false;
            }

            var questionId = questionItem.questionId;
            var surveyId = item.voteInfo.surveyId;
            var surveySceneCode = item.voteInfo.surveySceneCode;

            console.log("questionId", questionId);
            console.log("surveyId", surveyId);
            console.log("surveySceneCode", surveySceneCode);


            var params = {};
            var answerVoList = [{
                "optionArray": arrOptionId,
                "questionId": questionId
            }]
            params.answerVoList = answerVoList;
            params.branchCode = "247";
            params.surveyId = surveyId;
            params.surveySceneCode = surveySceneCode;
            console.log(params);
            var postId = utils.getUrlParam('postId');
            console.log("postId", postId);
            // 提交投票
            utils.ajax({
                url: "/caa/v1/survey/survey",
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        //更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if (result.body.voteInfo.optionStats) {
                                        var voteInfo = result.body.voteInfo;

                                        voteInfo.optionStats.sort((a, b) => {
                                            return a.optionId - b.optionId
                                        })

                                        // 求总和
                                        var sum = voteInfo.optionStats.reduce((pre, cur) => {
                                            return pre + cur.optionCount
                                        }, 0)

                                        console.log("sum", sum);

                                        for (var j in voteInfo.optionStats) {
                                            voteInfo.optionStats[j].fenshu = voteInfo.optionStats[j].optionCount / sum * 100;
                                            for (var k in voteInfo.answerDetails) { //用来给选中投票的添加样式判断 active字段

                                                if (voteInfo.optionStats[j].optionId == voteInfo.answerDetails[k].optionId) {
                                                    voteInfo.optionStats[j].active = true;
                                                }
                                            }
                                        }
                                    }
                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                    if (!result.body.voteInfo.optionStats) {
                                        // _this.moreActiveIndex=[];   //把上次选中的索引样式清空
                                        // 添加或者取消按钮的样式
                                        Vue.set(item, 'active', false); //取消按钮的样式
                                    } else {
                                        Vue.set(item, 'active', true); // 添加按钮的样式
                                    }
                                }
                            }.bind(this)
                        });
                    }
                }.bind(this)
            });

        },

        // 20210913-end-添加投票功能 


        // 20210825打开文章/动态详情，优先使用配置的跳转地址，如果跳转地址没配，则取对应id的跳转地址，如果都没配，则无跳转地址，点击不跳转
        openPostDetail(item) {
            if (item.url) {
                this.gotoUrl(item);
            } else {
                this.more(item.adviceRelateId);
            }
        },
        more(postId) { //查看动态详情
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId);
            } else {
                window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId;
            }
        },
        gotoTopic(topicId) { //查看话题详情
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/topicDetail.html?topicId=' + topicId);
            } else {
                window.location.href = location.origin + '/tradeh5/newWap/community/topicDetail.html?topicId=' + topicId;
            }
        },
        gotoList(item) { //查看基金详情
            if (isApp()) {
                if (item.productCategoryId == '1') { //基金
                    window.location.href = "htffundxjb://action?type=fd&fundId=" + item.productId;
                } else if (item.productCategoryId == '4') { //实盘
                    window.location.href = "htffundxjb://action?type=actualGroup&subType=detail&groupId=" + item.productId;
                } else { //组合item.productCategoryId == '2'
                    window.location.href = "htffundxjb://action?type=fundGroup&subType=fgd&groupId=" + item.productId;
                }

                //window.location.href = 'htffundxjb://action?type=url&link=' + $.base64.encode(location.origin + '/tradeh5/newWap/community/topicDetailList.html?productId=' + productId);
            } else {
                if (item.productCategoryId == '1') { //基金
                    window.location.href = location.origin + '/mobileEC/wap/fund/steadyCombination.html?fundId=' + item.productId;
                } else if (item.productCategoryId == '4') { //实盘
                    window.location.href = location.origin + "/mobileEC/wap/fundgroup/fund_group_show.html?groupId=" + item.productId;
                } else { //组合item.productCategoryId == '2'
                    window.location.href = location.origin + '/mobileEC/wap/fundgroup/group_fund_details.html?groupId=' + item.productId;
                }
            }
        },
        // 评论
        commentJump(postId,commentCount) {
            // this.currentComment='';
            // this.$refs.currentComment[index].focus();
            // <!-- 9534 .社区h5前端信息流：不展示近3条评论，不默认展示评论输入框，如果无评论时，点击评论按钮则弹出输入框，有评论数时跳转到帖子详情页定位到评论列表   -->
            // if (commentCount == 0) {
            //     this.msgAllData.forEach((item, index) => {
            //         if (postId == item.postId && item.showComment) {
            //             item.showComment = false
            //         } else if (postId == item.postId) {
            //             item.showComment = true
            //             Vue.set(this.msgAllData, index, item)
            //             this.$nextTick(() => {
            //                 this.$refs.focusbottom[0].focus();
            //                
            //             })
            //         }else{
            //             item.showComment = false
            //         } 
            //         Vue.set(this.msgAllData, index, item)
            //     })
            // } else {
                if (isApp()) {
                    //+'&returnComments=true'  用来判断是否需要定位到评论列表
                    window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId + '&hash=1'+'&returnComments=true');
                } else {
                    window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId + '&hash=1' +'&returnComments=true';
                }
            // }
        },
        comment(item, index, topItem) {
            if (!this.isReply) {
                var currentItem = JSON.parse(JSON.stringify(item));
                currentItem.commentCount++;
                currentItem.commentsList.unshift({
                    content: topItem.currentComment,
                    nickname: this.userInfo.nickname
                });
            }

            var params = {
                content: topItem.currentComment,
                userAgent: this.userAgent,
            };
            !this.isReply && (params.itemId = item.postId);
            this.isReply && (params.itemId = item.id);
            !this.isReply && (params.itemType = this.itemType.post.type);
            this.isReply && (params.itemType = this.itemType.comment.type);
            this.isComment = null;
            // return;
            utils.ajax({
                url: "/sfs/api/v1/comment",
                type: 'POST',
                data: params,
                success: function (result) {
                    var message = this.isReply ? '回复提交成功' : '评论提交成功'
                    this.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                    !this.isReply && this.msgAllData.splice(index, 1, currentItem);
                    this.msgAllData[index].currentComment = '';
                }.bind(this)
            });
        },
        focusComment(item, index) {
            if (this.currentPreset == '喜欢就评论') {
                this.isReply = false;
                this.currentPreset = '喜欢就评论';
            } else {
                this.isReply = true;
            }
            this.commentHandle(item, index);
        },
        // 回复
        reply(item, index, postItem) {
            this.isReply = true;
            if (item.id) {
                this.currentPreset = '回复' + item.nickname + ':';
                this.commentHandle(item, index);
            } else {
                // 按照评论当前帖子处理
                this.currentPreset = '喜欢就评论';
                this.isReply = false;
                this.commentHandle(postItem, index);
            }
        },
        commentHandle(item, index) {
            this.currentMsgData = item;
            this.currentMsgIndex = index;
            this.isComment = index;
            this.$nextTick(function () {
                this.$refs.focusbottom[index].focus();
            }.bind(this));
        },
        recommentVisible() {
            // this.popupVisible=false;
        },
        // 点赞
        thumb(item, index) {
            // 静默点赞
            var currentItem = JSON.parse(JSON.stringify(item));
            if (item.thumb) {
                currentItem.thumb = false;
                currentItem.thumbCount--;
            } else {
                currentItem.thumb = true;
                currentItem.thumbCount++;
            }
            var params = {
                itemId: item.postId,
                status: item.thumb ? '0' : '1'
            }
            // return;
            utils.ajax({
                url: "/sfs/api/v1/thumb/post",
                type: 'POST',
                data: params,
                success: function (result) {
                    this.msgAllData.splice(index, 1, currentItem);
                }.bind(this)
            });
        },
        gotoUser(socialUserId) {
            window.location.href = 'htffundxjb://action?type=community&subType=personalPage&socialUserId=' + socialUserId;
        },

        // 下拉刷新上拉加载
        loadTop() {
            this.loading = true;
            this.pageNum = 1;
            this.getMsgList(true, false, this.currrentOrder);
            this.getLayoutData();
        },
        loadBottom() {
            this.loading = true;
            this.pageNum++;
            if (this.allLoaded === false) {
                this.getMsgList(false, true, this.currrentOrder);
            } else {
                this.loading = false;
            }
        },
        showMore(value) {
            if (String(value).length > 66) {
                return true;
            }
            return false;
        },
        // 9534
        //单张图的高度计算
        calcSingleImgHeight: function(imagesList){
            
        },
        // 图片展示
        fullScreen(item, event, bindex) {
            //20210908 调用APP原生方法fetchFeedImageList，传图片列表和当前选中图片页码
            var feedImageList = [];
            item.imagesList.forEach(function (item) {
                feedImageList.push(item.imageUrl);
            })
            var imgList = {
                imgUrlList: feedImageList,
                index: bindex + 1 //从1开始
            }
            if (isIosApp()) {
                window.webkit.messageHandlers.fetchFeedImageList.postMessage(JSON.stringify(imgList));
            } else if (isAndroidApp()) {
                handler.fetchFeedImageList(JSON.stringify(imgList));
            } else {
                if (event.target.getAttribute("class") === 'active') {
                    this.more(item.postId);
                } else {
                    this.currentImgList = item.imagesList;
                    this.isEnlarge = true;
                    this.$nextTick(function () {
                        this.currentSwiper = new Swiper('.swiper-image', {
                            pagination: {
                                el: '.swiper-pagination',
                                type: 'custom',
                                renderCustom: function (swiper, current, total) {
                                    return current + '/' + total;
                                }
                            }
                        });
                        this.currentSwiper.slideTo(bindex, 0, false);
                    }.bind(this))
                }
            }
        },
        visbiliyImg() {
            this.isEnlarge = false;
            this.currentImgList = [];
            this.currentSwiper.destroy(false);
        },
        hideHandleMore() {
            this.isHandleMore = false;
            this.msgAllData.forEach((item) => {
                item.isHandleMore = false;
            })
        },
        handleMore(item) {
            console.log('item', item);
            $.ajax({
                url: "/sfs/api/v1/post/feedback?postId=" + item.postId,
                type: 'GET',
                // data: params,
                complete: function (result) {
                    // var result = { "returnCode": 0, "returnMsg": "", "body": { "postId": "21072015582LCYX6", "postType": null, "topicId": null, "topicName": null,
                    //         "title": null, "summary": null, "userId": null, "userInfo": null, "createTime": "21-7-20 下午4:12", "updateTime": "21-9-15 上午12:30",
                    //         "systemTime": null, "thumbCount": 0, "commentCount": 1, "commentTime": "21-7-21 下午2:53", "commentStatus": 1, "viewCount": 181,
                    //         "recommend": 0, "level": 0, "thumb": false, "admin": false, "collect": false
                    //     }
                    // }
                    // result.body.admin = true;
                    // result.body.collect = true;

                }.bind(this),
                success: function (result) {
                    console.log('result', result);
                    if (result.returnCode == 0) {
                        this.$set(item, 'handleMore_admin', result.body.admin);
                        // this.$set(item, 'handleMore_collect', result.body.collect);
                    } else if (result.returnCode !== 9999) {
                        return utils.showTips(result.returnMsg);
                    }
                    this.$set(item, 'isHandleMore', true);
                    this.$nextTick(() => {
                        this.isHandleMore = true;
                    });
                }.bind(this)
            });
        },
        // 收藏动态
        collectPost(item,index) {
            console.log(item,'item');
            let postId = item.postId;
            let currentItem = JSON.parse(JSON.stringify(item));
            currentItem.collect = !item.collect;
            //收藏状态（1：收藏 0：取消收藏）
            let params = {
                "itemId": postId,
                "status": item.collect ? 0 : 1
            }
            utils.ajax({
                url: "/sfs/api/v1/collect/post",
                type: 'POST',
                data: params,
                success: function () {
                    this.msgAllData.splice(index, 1, currentItem);
                    var message = currentItem.collect ? '收藏成功' : '取消收藏成功';
                    Vue.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                }.bind(this)
            });
        },
        // 举报动态
        reportPost(postId) {
            console.log('reportPost postId=', postId);
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=feedback&subType=survey';
            } else {
                // 暂无h5对应页面
                // window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId;
            }
        },
        refreshRecommendUserList() {
            if ((this.recommendUserCurrentIndex + 1) * this.recommendUserPageSize >= this.recommendUserList.length) {
                this.recommendUserCurrentIndex = 0;
            } else {
                this.recommendUserCurrentIndex += 1;
            }
            // this.recommendUserList = [].concat(this.recommendUserList);
            console.log('refreshRecommendUserList this.recommendUserCurrentIndex=', this.recommendUserCurrentIndex);
        },
        followRecommendUsers() {
            var itemIds = [];
            this.recommendUserList.slice(this.recommendUserCurrentIndex * this.recommendUserPageSize,
                    (this.recommendUserCurrentIndex + 1) * this.recommendUserPageSize)
                .map(function (item) {
                    if (item.selected) {
                        itemIds.push(item.userId);
                    }
                })
            if (itemIds.length == 0) {
                return utils.showTips('请选择关注的账号');
            }
            // 关注状态（1：关注 0：取关）
            var params = {
                // itemId: '',
                itemIds: itemIds,
                status: 1
            }
            utils.ajax({
                url: "/sfs/api/v1/follow/user",
                type: 'POST',
                data: params,
                success: function (result) {
                    var message = params.status ? '关注成功' : '取消关注成功';
                    Vue.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                    this.pageNum = 1; // 重置当前动态流pageNum
                    this.getMsgList(true, '', 'FOLLOW'); // 刷新关注tab页
                    this.getRecommendUser(); // 更新推荐账户list
                }.bind(this)
            });
        },
        shareInfo(item) {
            window.location.href = 'shareAct?eventCode=COMMUNITY_POST_FX&eventId=' + item.postId;
        },
        // 动态流中关注用户
        followUser(item) {
            console.log('focusUser item.userId=', item.userId);
            console.log('focusUser item.userInfo.followStatus=', item.userInfo.followStatus);
            var itemIds = [item.userId];
            // 关注状态（1：关注 0：取关）
            var params = {
                // itemId: '',
                itemIds: itemIds,
                status: ((item.userInfo && item.userInfo.followStatus == 1) ? 0 : 1)
            }
            utils.ajax({
                url: "/sfs/api/v1/follow/user",
                type: 'POST',
                data: params,
                success: function (result) {
                    var message = params.status ? '关注成功' : '取消关注成功';
                    Vue.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                    // this.getMsgList(true,'','FOLLOW');  // 刷新关注tab页
                    // 刷新当前item关注状态
                    this.$set(item.userInfo, 'followStatus', params.status);
                }.bind(this)
            });
        },
        // 删除动态 
        delPost(postId) {
            console.log('delPost postId=', postId);
            this.hideHandleMore();
            utils.showTips({
                title: '您确定要删除该条帖子吗？', //标题
                // content: '确认要删除吗', //内容
                showCancel: true, //是否显示取消按钮，默认false
                confirmText: '确定', //确认按钮文字，默认确定
                complete: function () {
                    utils.ajax({
                        url: "/sfs/api/v1/post?postId=" + postId,
                        type: 'DELETE',
                        // data: params,
                        success: function (result) {
                            var message = '帖子删除成功';
                            Vue.$toast({
                                message,
                                position: 'center',
                                duration: 2000
                            });
                            this.getMsgList(true, false, this.currrentOrder);
                            this.hideHandleMore();
                        }.bind(this)
                    });
                }.bind(this)
            })
        },
        // 获取布局数据
        getLayoutData: function () {
            utils.ajax({
                url: '/res/v1/app-func-layout/location-info?layoutId=communityHome',
                success: function (result) {
                    if (result.returnCode === 0) {
                        if (result.body && result.body.appLayoutFuncInfoList && result
                            .body.appLayoutFuncInfoList.length > 0) {
                            result.body.appLayoutFuncInfoList.forEach(function (item) {
                                this.getRecommendData(item.layoutId, item
                                    .funcmodId, item.position);
                            }.bind(this))
                        }
                    } else {
                        this.$toast({
                            message: '网络错误',
                            position: 'middle',
                            duration: 2000
                        });
                    }
                }.bind(this)
            })


        },
        // 获取推荐数据
        getRecommendData(layoutId, funcModId, position) {
            var _this = this;
            utils.ajax({
                url: '/res/v1/app-func-layout/theme-infos-app?layoutId=' + layoutId +
                    '&funcModId=' + funcModId,
                success: function (result) {
                    if ((result.returnCode === 0) && result.body) {
                        if (result.body.length == 0) return;
                        Vue.set(this.recommendData, position - 1, result.body[0].object); //使视图及时更新                   
                        // this.currentRecomment = this.recommendData[this.count]
                        this.recommendData[1] && console.log(this.recommendData[1]);
                        if (this.recommendData[1]) {
                            // 对从推荐系统取到的数据进行处理，以便直接在html使用数据
                            var asyncPostData = this.recommendData[1].filter((item, index) => {
                                item.currentIndex = index;
                                return (!item.adviceTitle || !item.adviceDesc) && (item.adviceCategory == 4) && item.adviceRelateId
                            })
                            // 过滤出资讯关联类别是“动态”的数据，取其标题和评论列表
                            if (asyncPostData) {
                                Promise.all(asyncPostData.map((item) => this.getPost(item.adviceRelateId, item.currentIndex))).then((result) => {
                                    this.recommendData[1].forEach((fItem, fIndex) => {
                                        result.forEach((cItem) => {
                                            if (fIndex === cItem.index) {
                                                Vue.set(fItem, 'cList', cItem.list.slice(0, 3))
                                                Vue.set(fItem, 'postTitle', cItem.postTitle)
                                            }
                                        })
                                    }) //双层循环遍历将后台数据插入进recommend[1]对象数组中
                                }).catch(function (error) {
                                    console.log(error)
                                })
                            }
                            var asyncVideo = this.recommendData[1].filter((item, index) => {
                                item.currentIndex = index;
                                return item.adviceCategory == 3 && item.adviceRelateId
                            })
                            // 过滤出资讯关联类别是“直播”的数据，取其相关数据
                            if (asyncVideo) {
                                Promise.all(asyncVideo.map((item) => this.getVideoData(item.adviceRelateId, item.currentIndex))).then((res) => {
                                    this.recommendData[1].forEach((fItem, fIndex) => {
                                        res.forEach((vItem) => {
                                            if (fIndex === vItem.index) {
                                                Vue.set(fItem, 'showStatus', vItem.showStatus)
                                                Vue.set(fItem, 'time', vItem.time)
                                                Vue.set(fItem, 'videoTitle', vItem.videoTitle)
                                                Vue.set(fItem, 'videoDes', vItem.videoDes)
                                                Vue.set(fItem, 'videoPic', vItem.videoPic)
                                                Vue.set(fItem, 'videoUrl', vItem.videoUrl)
                                                Vue.set(fItem, 'isLive', vItem.isLive)
                                                Vue.set(fItem, 'detailUrl', vItem.detailUrl)
                                                Vue.set(fItem, 'shareLinkUrl', vItem.shareLinkUrl)
                                            }
                                        })
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }
                            var asyncTopicData = this.recommendData[1].filter((item, index) => {
                                item.currentIndex = index;
                                return (!item.adviceTitle || !item.adviceDesc) && (item.adviceCategory == 5) && item.adviceRelateId
                            })
                            // 过滤出资讯关联类别是“话题”的数据，取其标题和动态列表
                            if (asyncTopicData) {
                                Promise.all(asyncTopicData.map((item) => this.getTopicTitle(item.adviceRelateId, item.currentIndex))).then((res) => {
                                    this.recommendData[1].forEach((fItem, fIndex) => {
                                        res.forEach((tItem) => {
                                            if (fIndex === tItem.index) {
                                                Vue.set(fItem, 'topicTitle', tItem.title)
                                            }
                                        })
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                })
                                Promise.all(asyncTopicData.map((item) => this.getTopic(item.adviceRelateId, item.currentIndex))).then((res) => {
                                    this.recommendData[1].forEach((fItem, fIndex) => {
                                        res.forEach((tItem) => {
                                            if (fIndex === tItem.index) {
                                                Vue.set(fItem, 'postList', tItem.list)
                                            }
                                        })
                                    })
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }
                            this.$nextTick(() => {
                                this.recommendData[1] && this.getIndexBanner();
                            })
                        }
                    } else {
                        this.$toast({
                            message: '网络错误',
                            position: 'middle',
                            duration: 2000
                        });
                    }
                }.bind(this)
            })
        },
        getTopicTitle(id, index) {
            return new Promise((resolve, reject) => {
                $.get('/sfs/api/v1/topic/' + id, function (res) {
                    if ((res.returnCode === 0)) {
                        if (res.body) {
                            resolve({
                                title: res.body.name,
                                index
                            })
                        } else {
                            resolve({
                                title: '',
                                index
                            })
                        }
                    } else if (res.returnCode === 1000) {
                        // sso_cookie过期失效或者不存在情况
                        console.log('sso_cookie过期失效或者不存在情况!')
                        return utils.jumpLoginByChannelCode();
                    } else {
                        resolve({
                            title: '',
                            index
                        })
                    }
                }.bind(this))
                // return this.commentList;
            })
        },
        getTopic(id, index) {
            return new Promise((resolve, reject) => {
                $.get('/sfs/api/v1/post/topic', {
                    topicId: id
                }, function (res) {
                    if ((res.returnCode === 0)) {
                        if (res.body) {
                            this.postList = res.body;
                            resolve({
                                list: this.postList,
                                index
                            })
                        } else {
                            resolve({
                                list: [],
                                index
                            })
                        }
                    } else if (res.returnCode === 1000) {
                        // sso_cookie过期失效或者不存在情况
                        console.log('sso_cookie过期失效或者不存在情况!')
                        return utils.jumpLoginByChannelCode();
                    } else {
                        resolve({
                            list: [],
                            index
                        })
                    }
                }.bind(this))
                // return this.commentList;
            })
        },
        getVideoData(id, index) {
            return new Promise((resolve, reject) => {
                $.get('/cms-service/v1/vedio/vedios-simple?videoIdList=' + id, function (res) {
                    if ((res.returnCode === 0)) {
                        if (res.body) {
                            this.video = res.body[0];
                            var myDate = new Date().valueOf();
                            var date = this.video.videoDate.replace(/-/g, '/'); //必须把日期'-'转为'/'
                            var timestamp = new Date(date).getTime();
                            var diff = myDate - timestamp;
                            if ((diff >= 0 && diff <= this.video.mins * 60 * 1000)) {
                                //当视频状态应该是直播时 
                                this.showStatus = 0
                            } else if (diff < 0) {
                                //当视频状态应该是预告时 
                                this.showStatus = -1
                                date = parseInt(this.video.videoDate.slice(5, 7)) + '月' + this.video.videoDate.slice(8, 10) + '日' + this.video.videoDate.slice(10)
                            } else {
                                //当视频状态应该是回放时 
                                this.showStatus = 1
                                date = parseInt(this.video.videoDate.slice(5, 7)) + '月' + this.video.videoDate.slice(8, 10) + '日'
                            }
                            resolve({
                                isLive: this.video.isLive,
                                detailUrl: this.video.detailUrl,
                                shareLinkUrl: this.video.shareLinkUrl,
                                videoTitle: this.video.title,
                                videoDes: this.video.videoDes,
                                videoPic: this.video.picture,
                                videoUrl: this.video.url,
                                index,
                                showStatus: this.showStatus,
                                time: date
                            })
                        } else {
                            resolve({
                                videoTitle: '',
                                videoDes: '',
                                videoPic: '',
                                videoUrl: '',
                                index,
                                showStatus: 2,
                                time: ''
                            })
                        }
                    } else if (res.returnCode === 1000) {
                        // sso_cookie过期失效或者不存在情况
                        console.log('sso_cookie过期失效或者不存在情况!')
                        return utils.jumpLoginByChannelCode();
                    } else {
                        resolve({
                            videoTitle: '',
                            videoDes: '',
                            videoPic: '',
                            videoUrl: '',
                            index,
                            showStatus: 2,
                            time: ''
                        })
                    }
                }.bind(this))
            })
        },
        getPost(id, index) {
            return new Promise((resolve, reject) => {
                $.get('/sfs/api/v1/post/' + id, null, function (res) {
                    if ((res.returnCode === 0)) {
                        if (res.body && res.body.commentsList && res.body.commentsList.length > 0) {
                            this.commentList = res.body.commentsList;
                            resolve({
                                list: this.commentList,
                                index,
                                postTitle: res.body.title
                            })
                        } else {
                            resolve({
                                list: [],
                                index,
                                postTitle: ''
                            });
                        }
                    } else if (res.returnCode === 1000) {
                        // sso_cookie过期失效或者不存在情况
                        console.log('sso_cookie过期失效或者不存在情况!')
                        return utils.jumpLoginByChannelCode();
                    } else {
                        resolve({
                            list: [],
                            index
                        })
                    }
                }.bind(this))
            })
        },
        getIndexBanner() {
            var mySwiper = new Swiper('.swiper-banner', {
                resistance: true, //处于第一个或最后一个slide时，继续拖动Swiper会离开边界，释放后弹回。
                // autoplay: true,//可选选项，自动滑动
                direction: "horizontal",
                slidesPerView: 2,
                spaceBetween: -15,
                slidesPerGroup: 2,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'custom',
                    renderCustom: function (swiper, current, total) {
                        var _html = '';
                        for (var i = 1; i <= total; i++) {
                            if (current == i) {
                                _html +=
                                    '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                            } else {
                                _html += '<span class="swiper-pagination-customs"></span>';
                            }
                        }
                        return _html; //返回所有的页码html
                    }
                },
            })
        },

        more(postId) { //查看动态详情
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId);
            } else {
                window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId;
            }
        },
        gotoTopic(topicId) { //查看话题详情
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/topicDetail.html?topicId=' + topicId);
            } else {
                window.location.href = location.origin + '/tradeh5/newWap/community/topicDetail.html?topicId=' + topicId;
            }
        },
        gotoUrl(item, linkType) {
            var itemUrl = item.url ? item.url : item.videoUrl;
            if (!itemUrl) {
                return false;
            }
            itemUrl = String(itemUrl).replace(/^\/\//, window.location.protocol + '//');
            if (isApp()) {
                if (itemUrl.slice(0, 13) == 'htffundxjb://') {
                    window.location.href = itemUrl;
                } else {
                    if (linkType == 'pdf') {
                        window.location.href = 'htffundxjb://action?type=url&linkType=pdf&link=' + btoa(itemUrl);
                    } else {
                        window.location.href = 'htffundxjb://action?type=url&link=' + btoa(itemUrl);
                    }
                }
            } else {
                window.location.href = itemUrl;
            }
        },
        gotoVideo(item) {
            var itemUrl = item.url ? item.url : item.videoUrl;
            if (!itemUrl) {
                return false;
            }
            itemUrl = String(itemUrl).replace(/^\/\//, window.location.protocol + '//');
            console.log(itemUrl)
            if (isApp()) {
                if (item.url) {
                    if (itemUrl.slice(0, 13) == 'htffundxjb://') {
                        window.location.href = itemUrl;
                    } else {
                        window.location.href = 'htffundxjb://action?type=url&link=' + btoa(itemUrl);
                    }
                } else {
                    if (item.detailUrl.slice(0, 13) != 'htffundxjb://' && item.isLive == 1) {
                        window.location.href = itemUrl;
                    } else if (item.detailUrl.slice(0, 13) != 'htffundxjb://' && item.isLive == 2) {
                        window.location.href = 'htffundxjb://action?type=media&subType=liveXE&videoId=' + item.adviceRelateId;
                    } else {
                        window.location.href = 'htffundxjb://action?type=url&link=' + btoa(item.detailUrl);
                    }
                }
            } else {
                window.location.href = item.shareLinkUrl;
            }
        },
        openXEPage(videoInfo) {
            // 小鹅直播
            if (isApp()) {
                // IOS两个都支持，安卓只支持传videoId
                // window.location.href = 'htffundxjb://action?type=media&subType=liveXE&link=' + btoa(videoInfo.url);
                window.location.href = 'htffundxjb://action?type=media&subType=liveXE&videoId=' + videoInfo.videoId;
            } else {
                window.location.href = videoInfo.shareLinkUrl;
            }
        },
        openHuoShanPage(videoInfo) {
            // 火山直播
            if (isApp()) {
                // window.location.href = 'htffundxjb://action?type=media&subType=volcengine&activityId=XXX&isPortrait=1';
                window.location.href = videoInfo.url;
            } else {
                window.location.href = videoInfo.shareLinkUrl;
            }
        },
        updateVideo() {
            console.log('我更新了');
            var allVideo = document.querySelectorAll('video');
            if (allVideo.length > 0) {
                this.$nextTick(function () {
                    allVideo.forEach(function (item) {
                        if (!item.getAttribute('id').includes('html5_api')) {
                            var index = Number(item.getAttribute('data-index'));
                            var id = 'my-video-' + this.currrentOrder + index;
                            var myPlayer = new neplayer(id);
                            this.myPlayer.push(myPlayer);
                        }
                    }.bind(this));
                    this.myPlayer.forEach((player) => {
                        player.on('playing', function () {
                            var currentIndex = this.tagAttributes['data-index'];
                            var allVideos = document.querySelectorAll('video');
                            allVideos.forEach(function (item) {
                                if (Number(item.getAttribute('data-index')) !== Number(currentIndex)) {
                                    item.pause();
                                }
                            })
                        })
                    })
                })

            }

        },
        // 滚到顶部
        backTop() {
            let elementDiv = $('.content>div')[0];
            elementDiv.scrollTop = 0;
            this.$refs.loadmore.translate = 50;
            setTimeout(() => {
                this.$refs.loadmore.topMethod();
            }, 300)
        },
    },

    updated() {
        this.updateVideo();
    },
    filters: {
        // 展示用户发布时间，格式systemTime = "2021-06-24 15:04:33"
        showTime(createTime, systemTime) {
            if (!systemTime) {
                return createTime.split(' ')[1];
            } else {
                let diff_s = Math.abs(moment(createTime).diff(moment(systemTime), 'seconds'));
                let diff_m = Math.abs(moment(createTime).diff(moment(systemTime), 'minutes'));
                let diff_h = Math.abs(moment(createTime).diff(moment(systemTime), 'hours'));
                let diff_d = Math.abs(moment(createTime.slice(0, 10) + ' 00:00:00').diff(moment(systemTime), 'days'));
                // let diff_W = Math.abs(moment(createTime).diff(moment(systemTime), 'weeks'));
                // let diff_M = Math.abs(moment(createTime).diff(moment(systemTime), 'months'));
                let diff_Y = Math.abs(moment(createTime.slice(0, 4) + '-01-01 00:00:00').diff(moment(systemTime), 'years'));

                if (diff_m < 1) { //  1分钟以内，显示xx秒前
                    return diff_s + '秒前';
                } else if (diff_h < 1) { //  1小时以内，显示xx分钟前
                    return diff_m + '分钟前';
                } else if (diff_h >= 1) {
                    if (diff_d < 1) { // 今天以内的，用xx:xx(如18:20)
                        return createTime.slice(11, -3);
                    } else if (diff_d >= 1 && diff_d < 2) { // 昨天，用昨天xx：xx
                        return '昨天' + createTime.slice(11, -3);
                    } else if (diff_Y < 1) { // 昨天以前的且在当前年的，用mm/dd xx:xx表示
                        return createTime.slice(5, -3).replace(/-/g, '/');
                    } else { // 不在当前年的，用yy/mm/dd xx:xx
                        return createTime.slice(0, -3).replace(/-/g, '/');
                    }
                }

            }
        },

    }
})

// 给APP调用的全局函数，上划并刷新页面
function toAppPullDownRefresh() {
    vm.backTop();
}