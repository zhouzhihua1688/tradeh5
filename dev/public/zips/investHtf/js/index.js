var vm = new Vue({

    el: '#app',
    data() {
        return {
            title: ['服务内容', '团队介绍', '费用介绍'],
            number: 0, //title:默认选中第一个样式
            totalBalance: '',   //总资产
            balanceProfit: '',  //持有收益
            lastProfit: '',     //最新收益
            yieldDate: '',      //最新收益日期
            showHead: false,
            // 20211224用户风险等级
            // riskLevel: '1',
			videoInfo:{},
			// 滑动产品卡
			productListInfo:[],
			investRecommondInfo:{},
			toogle0:false,
			toogle1:false,
            // 客户经理
            footerFixShow:false,
            ManagerInfo: [],
        };

    },
    created() {
        // 20220117判断是否为实名客户，如果是实名客户，继续判断是否做过风险测评或者风险测评是否过期
        this.checkRealName();
        // 20211224获取用户风险等级
        // this.getRiskLevelByCustNo();
        this.hasAssets();
        // this.getAssets();
        this.getLayout();
        this.getManagerInfo();
    },
    mounted() {
        if(isApp()&&isIosApp()){
            $('.layer0 .close').css('marginBottom','2.5rem')
        }
    },
    computed: {
        recommondInfoImageAndUrl(){
            let obj = {};
            if(this.investRecommondInfo&&Object.keys(this.investRecommondInfo).length>0&&this.investRecommondInfo.object&&this.investRecommondInfo.object[0]){
                obj = {...this.investRecommondInfo.object[0]}
            }
            return obj
        }
    },
    methods: {
        // 20220117判断是否为实名客户，如果是实名客户，继续判断是否做过风险测评或者风险测评是否过期
        checkRealName() {
            utils.get({
                url: '/icif/v1/custs/get-simple-by-cust-no',
                success: function(result){
                    if(result.body && result.body.custTp === 'NRN'){ // 客户类型，RN-实名客户，NRN-非实名客户
                        utils.showTips({
                            content: '建议完成实名认证后可查看更多投顾策略。',
                            confirmText: '去实名', //确认按钮文字，默认确定
                            complete: function () { //需使用bind()
                                if (isApp()) {
                                    window.location.href = "htffundxjb://action?type=accountSecurity&subType=verifyIdentify&taskType=realName";
                                } else {
                                    window.location.href = '/mobileEC/wap/card/bindCardInputCardInfo.html';
                                }
                            }.bind(this),
                            nextComplete: function() { //需使用bind()，取消按钮
                                this.checkRiskInfo();
                            }.bind(this),
                            showCancel: true, //是否显示取消按钮，默认false
                            cancelButtonFirst: true,    // 取消button在前
                        });
                    } else {
                        this.checkRiskInfo();
                    }
                }.bind(this)
            });
        },
        // 20220117判断是否做过风险测评或者风险测评是否过期
        // 风险等级是否需要更新
        checkRiskInfo() {
            utils.get({
                url: '/mobile-bff/v1/common/check-union-risk-level',
                success: function (result) {
                    var code = result.body.code;
                    if (code == "9991") {
                        utils.showTips({
                            title: '',
                            content: '您的风险测评已过期，建议更新风险测评后可查看更多投顾策略。',
                            confirmText: '立即测评',
                            complete: function () {
                                let targetUrl = window.location.origin + "/mobileEC/wap/common/riskTest.html";
                                if (isApp()) {
                                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl);
                                } else {
                                    window.location.href = '/mobileEC/wap/common/riskTest.html?forwardUrl=' + encodeURIComponent(window.location.href);
                                }
                            },
                            showCancel: true,
                            cancelButtonFirst: true,    // 取消button在前
                        })
                    }
                    if (code == "9990") {
                        utils.showTips({
                            title: '',
                            content: '建议完成风险测评后可查看更多投顾策略。',
                            confirmText: '立即测评',
                            complete: function () {
                                let targetUrl = window.location.origin + "/mobileEC/wap/common/riskTest.html";
                                if (isApp()) {
                                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl);
                                } else {
                                    window.location.href = '/mobileEC/wap/common/riskTest.html?forwardUrl=' + encodeURIComponent(window.location.href);
                                }
                            },
                            showCancel: true,
                            cancelButtonFirst: true,    // 取消button在前
                        })
                    }
                }.bind(this)
            })
        },
        // 20211224获取用户风险等级
        getRiskLevelByCustNo() {
            utils.ajax({
                url: '/icif/v1/risks/risk-level',
                success: function (result) {
                    if(result.returnCode == 0 && result.body){
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
                        // this.riskLevel = '4';
                        this.riskLevel = result.body.riskLevel;
                    }
                }.bind(this),
                error: function () {
                    utils.showTips('请求超时，请稍后重试');
                }
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
        jumpOther(){
            this.footerFixShow = false;
            var targetUrl = window.location.origin + '/activity-center/act-resources/pages/investAdviser/telephoneRese.html';
            if(isApp()){
                window.location.href = `htffundxjb://action?type=url&link=` + btoa(targetUrl);
            }else{
                window.location.href = targetUrl;
            }
        },
        //导航切换样式--'服务内容', '团队介绍', '费用介绍'
        changeTitle: function (index) {
            this.number = index // 点击时，切换选中索引
        },
        //判断投顾是否创建过合约账户-判断有没有资产
        hasAssets: function () {
            utils.ajax({
                url: '/ias/v1/ar-accts/exist',
                type: 'GET',
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log("hasAssets:", result.body);
                        this.showHead = result.body;
                        if(result.body==true){
                            this.showHead = true;
							this.getAssets();
                            // $(".head-asset").show();
                            // $(".head-noAsset").hide();
                        }else{
                            this.showHead = false;
                            // $(".head-noAsset").show();
                            // $(".head-asset").hide();
                        }

                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        // 获取总资产
        getAssets: function () {
            let data = {
                // classify: '05',      // 20211227改换接口
                currencyType: '156',
            }
            utils.ajax({
                // url: '/assetcenter/v1/view/new/list/product',
                url: '/assetcenter/v1/view/exist/ias',   // 20211227改换接口 
                type: 'GET',
                data,
                success: function (result) {
                    if (result.returnCode === 0) {
                        console.log("getAssets:", result.body);
                        // this.totalBalance = result.body.totalBalance;  //总资产
                        this.totalBalance = result.body.totalAmt;  //总资产   // 20211227改换接口
                        this.balanceProfit = result.body.balanceProfit; //持有收益
                        this.lastProfit = result.body.lastProfit; //最新收益
                        this.yieldDate = result.body.yieldDate; //最新收益日期
                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
        },
        // 获取布局数据
        getLayout:function(){
            utils.ajax({
                url: '/res/v1/app-func-layout/location-info?layoutId=wapInvestHome&r='+Math.ceil(Math.random()*10000),
                success: function (result) {
                    if (result.returnCode === 0) {
						if(result.body&&result.body.appLayoutFuncInfoList&&Array.isArray(result.body.appLayoutFuncInfoList)&&result.body.appLayoutFuncInfoList.length>0){
							Promise.all(result.body.appLayoutFuncInfoList.map(item=>this.getLayoutInfo(item.funcmodId))).then((resultArr)=>{
								this.videoInfo = resultArr[0]&&resultArr[0][0]&&resultArr[0][0].object&&resultArr[0][0].object[0]?resultArr[0][0].object[0]:{};
								this.productListInfo = resultArr[1]?resultArr[1]:[];
								this.investRecommondInfo = resultArr[2]&&resultArr[2][0]?resultArr[2][0]:{};
								this.$nextTick(()=>{
									this.productListInfo.forEach((item,index) => {
										new Swiper('#swiper'+index, {
											loop: true,
											// autoplay:true,
											pagination: {
												el: '.swiper-pagination',
												type: 'custom',
												renderCustom: function (swiper, current, total) {
													var _html = '';
													for (var i = 1; i <= total; i++) {
														if (current == i) {
															_html +=
																'<span style="width: .5rem;height:.25rem;display: inline-block;margin: 0 .125rem;border-radius: .125rem;background-color: #dbab58;"></span>';
														} else {
															_html += '<span style="width: .25rem;height:.25rem;border-radius: 50%;display: inline-block;background: #ebd2a5;margin: 0 .125rem;"></span>';
														}
													}
													return _html; //返回所有的页码html
												}
											}
										})
									});
								})
							})
						}

                    } else {
                        utils.showTips('请求超时，请稍后重试');
                    }
                }.bind(this)
            })
			
        },
		getLayoutInfo(funcModId){
			return new Promise((resolve,reject)=>{
				$.ajax({
					url: '/res/v1/app-func-layout/theme-infos-app?layoutId=wapInvestHome&funcModId='+funcModId+'&r='+Math.ceil(Math.random()*10000),
					success: function (result) {
						if (result.returnCode === 0) {
							resolve(result.body)
						} else {
							resolve([])
						}
					}.bind(this)
				})
			})
		},
        // 微信跳转
        openWx(){
            if(isApp()){
                window.location.href="htffundxjb://action?type=openPlatform&subType=weChat"
            }else{
                window.location.href="weixin://"
            }
        },
        // 头部有资产第一个箭头跳转到App投顾资产页
        investUrl:function(){
            // window.location.href='htffundxjb://action?type=adviserService&subType=assets';
            //   window.location.href='htffundxjb://action?type=asset&subType=classify&viewType=0&assetClassifyType=05&assetMode=1&currencyType=156';
            if(isApp()){
                window.location.href = 'htffundxjb://action?type=asset&subType=classify&viewType=0&assetClassifyType=05&currencyType=156';
            }else{
                window.location.href = window.location.origin+'/tradeh5/newWap/myAssets/asset.html?index=3';
            }
        },
        // 头部有资产第二个箭头或者没有资产跳转到h5投顾测算页
        investTest:function(){
            let targetUrl = window.location.origin + "/tradeh5/newWap/investGroup/investCalculation/index.html";
            if(isApp()){
                window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl);
            } else {
                window.location.href = targetUrl; 
            }
        },
        // 投顾视频-查看更多
        moreVideo: function(url){
            // let targetUrl = 'https://appf05mdik19173.h5.xiaoeknow.com/v1/course/column/p_61de84ebe4b01402d349364f?type=3';
            if(isApp()){ // 生产
                window.location.href = 'htffundxjb://action?type=media&subType=directXE&link=' + btoa(url);
            }else{
                window.location.href = url;
            }
        },
        // 常见问题-查看更多
        moreQuestion:function(){
            let origin = (utils.isProdEnv()?'https://static.99fund.com':'http://10.50.115.48');  // 区分 生产环境和测试环境
            let targetUrl = origin + '/mobile/app_inner/faq/investAdviserQA.html';
            if(isApp()){
                window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl);
            } else {
                window.location.href = targetUrl;
            }
        },
        // 购买产品
        buyNow(url){
            if(url){
				var arr = url.split('|');
				var appurl = arr&&arr[0]?arr[0]:'';
				var wapurl = arr&&arr[1]?arr[1]:'';
				if(isApp()){
					appurl&&(window.location.href = appurl);
				}else{
					wapurl&&(window.location.href = wapurl);
				}
			}
        },
        // 推荐图片banner跳转
        jumpRecommend(url){
            console.log(url);
            if(url){
                if(isApp()){
                    window.location.href = "htffundxjb://action?type=url&link=" + btoa(url);
                } else {
                    window.location.href = url; 
                }
			}
        },
		// 更多服务
		moreService:function(){
			let targetUrl = '';
			// if(this.investRecommondInfo&&this.investRecommondInfo.viewmoreUrl){
			// 	targetUrl = window.location.origin + this.investRecommondInfo.viewmoreUrl;
			// }else{
            // }
            targetUrl = window.location.origin + "/activity-center/act-resources/pages/investHtf/subService.html";
			// let targetUrl = "/tradeh5/newWap/zips/investHtf/subService.html";
            if(isApp()){
                window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl)+"&titleBarColor=3d2f25";
            } else {
                window.location.href = targetUrl; 
            }
		},
		// 更多产品
		moreProduct:function(){
			let targetUrl = window.location.origin + "/activity-center/act-resources/pages/investHtf/subIndex.html";
			// let targetUrl = "/tradeh5/newWap/zips/investHtf/subIndex.html";
            if(isApp()){
                window.location.href = "htffundxjb://action?type=url&link=" + btoa(targetUrl)+"&titleBarColor=47362a";
            } else {
                window.location.href = targetUrl; 
            }
		},
        // 下面基金箭头跳转到投顾详情页
        // jumpUrl: function (groupId) {
        //     if (isApp()) {
        //         window.location.href = "htffundxjb://action?type=adviserService&subType=detail&groupId=" + groupId;
        //     } else {
        //         window.location.href = "/mobileEC/adviser/investGroupDetails.html?groupId=" + groupId;
        //     }

        // },
        numFormat(val) {
            if (val || val === 0) {
                val = val.toFixed(2);
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                return '';
            }
        },
    }
})