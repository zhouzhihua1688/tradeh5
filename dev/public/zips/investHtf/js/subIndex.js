var vm = new Vue({
	el: '#app',
	data() {
		return {
			// cardType:[
			// 	{name:'活钱管理',value:'13',listName:''},
			// 	{name:'稳健投资',value:'14',listName:''},
			// 	{name:'长期投资',value:'15',listName:''},
			// 	{name:'教育投资',value:'16',listName:''},
			// 	{name:'养老投资',value:'17',listName:''},
			// ],
			productList: [],
			currentValue: '活钱管理',
			currentIndex:2 //按tab下标位置指定
		};
	},
	created() {
		this.getLayout()
	},
	watch: {},
	computed: {
		cardType() {
			if (this.productList && this.productList.length > 0) {
				let arr = [];
				this.productList.forEach(item => {
					if (!arr.includes(item.prdRecommendTitle)) {
						arr.push(item.prdRecommendTitle)
					}
				});
				return arr
			}
		},
		currentList() {
			if (this.productList && this.productList.length > 0) {
				return this.productList.filter((item) => {
					return item.prdRecommendTitle == this.currentValue
				})
			} else {
				return []
			}
		},
		recomElementRemark() {
			let obj = this.productList.find((item) => {
				return item.prdRecommendTitle == this.currentValue
			})
			if (obj) {
				return obj.recomElementRemark
			} else {
				return ''
			}
		}
	},
	methods: {
		changeLab(item) {
			console.log(this.currentValue);
			this.currentValue = item;
		},
		jumpUrl(url) {
			if (url) {
				var arr = url.split('|');
				var appurl = arr && arr[0] ? arr[0] : '';
				var wapurl = arr && arr[1] ? arr[1] : '';
				if (isApp()) {
					appurl && (window.location.href = appurl);
				} else {
					wapurl && (window.location.href = wapurl);
				}
			}
		},
		// 获取布局数据
		getLayout: function () {
			utils.ajax({
				url: '/res/v1/app-func-layout/location-info?layoutId=wapInvestSubtitle&r=' + Math.ceil(Math.random() * 10000),
				success: function (result) {
					if (result.returnCode === 0) {
						if (result.body && result.body.appLayoutFuncInfoList && Array.isArray(result.body.appLayoutFuncInfoList) && result.body.appLayoutFuncInfoList.length > 0) {
							Promise.all(result.body.appLayoutFuncInfoList.map(item => this.getLayoutInfo(item.funcmodId))).then((resultArr) => {
								console.log(resultArr[0]);
								if (resultArr && resultArr[0] && resultArr[0][0] && resultArr[0][0].object) {
									this.productList = resultArr[0][0].object;
									if (this.productList.length > 0) {
										let arr = [];
										this.productList.forEach(item => {
											if (!arr.includes(item.prdRecommendTitle)) {
												arr.push(item.prdRecommendTitle)
											}
										});
										this.currentValue = arr[this.currentIndex]?arr[this.currentIndex]:'活钱管理';
									}
								}
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
		// 匹配文字中的数字，匹配的每段数据不能相同
		numberStringFormat(val){
			if(val||val===0){
				var str = val;
				var arr = str.match(/\d+(.\d+)?/g);
				if(arr&&arr.length>0){
					arr.forEach(function(item){
						str=str.replace(item,`<em>${item}</em>`)
					})
					return str
				}else{
					return val
				}
			}else{
				return val
			}
		}
	}
})