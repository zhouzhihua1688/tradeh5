var vm = new Vue({
	el: '#app',
	data() {
		return {
			label: [{
				name: '投资研究',
				category: '2',
				contentList: [],
			}, {
				name: '投顾直播',
				category: '3',
				contentList: [],
			}, {
				name: '投顾视频',
				category: '1',
				contentList: []
			}],
			currentCategory: '2',
			videoElement:[]
		};
	},
	created() {
		this.getLayout()
	},
	mounted() {
		this.videoElement = document.getElementsByTagName('video');
	},
	computed: {
		currentList() {
			let contentList = [];
			contentList = JSON.parse(JSON.stringify(this.label.find((item) => {
				return item.category == this.currentCategory;
			}).contentList))
			if (contentList.length > 0) {
				contentList.forEach((item, index) => {
					if (item.publicTimeStr) {
						item.publicTimeStr = new Date(item.publicTimeStr).getTime();
					} else {
						item.publicTimeStr = -index;
					}
				})
				if (contentList.length > 0) {
					contentList.sort((a, b) => a.publicTimeStr < b.publicTimeStr ? 1 : a.publicTimeStr > b.publicTimeStr ? -1 : 0)
				}
			}
			return contentList;
		}
	},
	methods: {
		changeLab(category) {
			this.currentCategory = category;
		},
		// 服务页面跳转
		jumpPage(item) {
			// if (url) {
			var appurl = item.url;
			var arr = item.remark.split('|');
			var wapurl = arr && arr[0] ? arr[0] : '';
			if (isApp()) {
				appurl && (window.location.href = appurl);
			} else {
				wapurl && (window.location.href = wapurl);
			}
			// }
		},
		// 获取布局数据
		getLayout: function () {
			utils.ajax({
				url: '/res/v1/app-func-layout/location-info?layoutId=wapInvestService&r=' + Math.ceil(Math.random() * 10000),
				success: function (result) {
					if (result.returnCode === 0) {
						if (result.body && result.body.appLayoutFuncInfoList && Array.isArray(result.body.appLayoutFuncInfoList) && result.body.appLayoutFuncInfoList.length > 0) {
							Promise.all(result.body.appLayoutFuncInfoList.map(item => this.getLayoutInfo(item.funcmodId))).then((resultArr) => {
								console.log(resultArr);
								if (resultArr && resultArr[0]) {
									resultArr[0].forEach((item) => {
										if (item.object && item.object.length > 0) {
											if (item.themeTitle == '文章') { //文章分类2
												this.label[0].contentList = item.object.filter((item1) => {
													return item1.adviceCategory == '2'
												})
											}
											if (item.themeTitle == '直播') { //直播分类3
												this.label[1].contentList = item.object.filter((item1) => {
													return item1.adviceCategory == '3'
												})
											}
											if (item.themeTitle == '视频') { //视频分类1
												this.label[2].contentList = item.object.filter((item1) => {
													return item1.adviceCategory == '1'
												})
											}
										}
									})
								}
								// if (resultArr[0] && resultArr[0][0] && resultArr[0][0].object && resultArr[0][0].object.length > 0) {
								// 	// 视频1文章2直播3
								// 	resultArr[0][0].object.forEach(item => {
								// 		this.label.forEach(citem =>{
								// 			if(item.adviceCategory==citem.category){
								// 				citem.contentList.push(item);
								// 			}
								// 		})
								// 	});
								// }
							})
						}
					} else {
						utils.showTips('请求超时，请稍后重试');
					}
				}.bind(this)
			})
		},
		getLayoutInfo(funcModId) {
			return new Promise((resolve, reject) => {
				$.ajax({
					url: '/res/v1/app-func-layout/theme-infos-app?layoutId=wapInvestService&funcModId=' + funcModId + '&r=' + Math.ceil(Math.random() * 10000),
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
		playHandle(index) {
      const videoElement = [...this.videoElement];
      if (videoElement && videoElement.length) {
        videoElement.forEach((v, i) =>
          i === index ? this.videoElement[i].play() : this.videoElement[i].pause(),
        );
      }
    },

	}
})