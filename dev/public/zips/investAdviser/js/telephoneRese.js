var vm = new Vue({
    el: '#app',
    data() {
        return {
            time: '15:00-18:00',
            date: '',
            showTips: false,
            dateString: '',
            dateErr: '*请选择工作日',
            dateShow: false,
            hintShow: false, // 提示语显示
            hint: '', // 提示语
            phone: {
                val: '',
                err: false,
                pass: false,
            },
            userSex: '',
            userName: '',

            workDayList: [], // 近一个月的工作日
        };

    },
    created() {
        this.getWorkDayList(); // 获取一段时间内的所有工作日
        this.getMobileNo();
        // this.nowTime();
    },
    mounted() {
        //日期选择器STAR ------------------------------
        var _this = this
        var selectDate1 = $.selectDate("#select-date", {}, function (data) {
            // var isWorkDay = new Date(Date.parse((data.year + '/' + data.month + '/' + data.day).toString())).getDay()
            _this.dateString = data.year + data.month + data.day
            if (_this.workDayList.indexOf(_this.dateString.toString()) !== -1) {
                _this.dateShow = false
                _this.date = data.year + "年" + data.month + "月" + data.day + "日"
                _this.dateString = data.year + data.month + data.day
                console.log(_this.dateString, '工作日')
            } else {
                console.log(_this.workDayList.indexOf(_this.dateString), _this.dateString.toString())
                _this.dateShow = true
                _this.date = ''
                _this.dateString = ''
                // _this.nowTime();
                console.log('不是工作日')
            }
        });
        //日期选择器END  ------------------------------

        mobileSelect1 = new MobileSelect({
            trigger: '#select-time',
            wheels: [{
                data: [{
                        id: '1',
                        value: '9:00-12:00'
                    },
                    {
                        id: '2',
                        value: '13:00-15:00'
                    },
                    {
                        id: '3',
                        value: '15:00-18:00'
                    }
                ]
            }],
            position: [2, 2],
            callback: (indexArr, data) => {
                _this.time = data[0].value
            }
        });
        // input禁止弹出键盘
        $('#select-date').on("focus", function () {
            document.activeElement.blur(); //屏蔽默认键盘弹出；
        });
        // input禁止弹出键盘
        $('#select-time').on("focus", function () {
            document.activeElement.blur(); //屏蔽默认键盘弹出；
        });
    },
    computed: {

    },
    methods: {
        getWorkDayList() {
            let now = new Date();
            let newGetTime = now.getTime();
            console.log('newGetTime',newGetTime)
            let data = {};
            data.startDate = this.dateFormat(now); //"20211222"
            // data.startDate = "20220108"
            data.endDate = this.dateFormat(new Date(newGetTime + 30 * 24 * 3600 * 1000 * 12)); //未来一年的日期"20211222";
            utils.ajax({
                url: '/cts/v1/workdate-query/work-day-list',
                type: 'GET',
                contentType: 'application/json',
                data,
                success: function (result) {
                    console.log('getWorkDayList result=', result);
                    if (result.returnCode == 0) {
                        this.workDayList = result.body;
                        this.strSlice() 
                        // 获取当前时间
                        this.nowTime();
                    }
                }.bind(this)
            })
        },
        dateFormat(d) {
            // let d = new Date(date);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            function fixZero(n) {
                return n < 10 ? '0' + n : n;
            }
            return [year, month, day].map(fixZero).join('');
        },
        // 分割字符串
        strSlice() {
            let yearArr = []
            let monthArr = []
            let dayArr = []
            this.workDayList.forEach((i) => {

                monthArr.push(i.substr(4, 2))
                dayArr.push(i.substr(6, 2))
            })
            console.log('yearArr', yearArr)
            console.log('monthArr', monthArr)
            console.log('dayArr', dayArr)
        },
        getMobileNo() {
            // 从sessionStorage里获取userInfo对应的手机号，
            let userInfo = utils.getSession(utils.userInfo);
            (userInfo && userInfo.mobileNo) && (this.phone.val = userInfo.mobileNo);
            (userInfo && userInfo.invNm) && (this.userName = userInfo.invNm);
            (userInfo && userInfo.sex) && (this.userSex = userInfo.sex);
            // 如没有，调用后台接口获取--未完成 
            if (!userInfo) {
                utils.ajax({
                    url: '/icif/v1/custs/get-simple-by-cust-no',
                    type: 'GET',
                    contentType: 'application/json',
                    // data: ,
                    success: function (result) {
                        this.userSex = result.body.sex
                        this.userName = result.body.invNm
                        this.phone.val = result.body.mobile
                    }.bind(this)
                })
            }
        },
        sureSend() {
            this.showTips = false;
            let messageSendVo = {}
            messageSendVo.phone = this.phone.val
            messageSendVo.bookingTime = `${this.date} ${this.time}`
            utils.ajax({
                url: '/message-center/v1/messageCrmRule/message/send',
                type: 'POST',
                contentType: 'application/json',
                data: messageSendVo,
                success: function (result) {
                    this.ManagerInfo = result.body
                    utils.showTips('预约成功');
                }.bind(this)
            })

        },
        orderBtn() {
            if (this.workDayList.indexOf(this.dateString.toString()) !== -1) {
                this.dateShow = false
                console.log(this.dateString, '工作日')
            } else {
                console.log(this.workDayList.indexOf(this.dateString), this.dateString.toString())
                this.dateShow = true
                this.date = ''
                this.dateString = ''
                console.log('不是工作日')
            }
            // 如果填写的信息验证不通过
            if (this.hintShow || this.dateShow || this.phone.val == '') {
                // this.dateShow = true
                console.log('请填写正确信息')
            } else {
                // 验证通过之后
                this.showTips = true;
            }
        },

        nowTime() { 

            this.date= this.workDayList[0].substr(0, 4)+'年'+ this.workDayList[0].substr(4, 2)+'月'+this.workDayList[0].substr(6, 2)+'日'
           
            this.dateString=this.workDayList[0]
            // this.dateString= '20220108'
            // this.date= '20220108'
            //获取当前时间
            // var _this = this;
            // let now = new Date();
            // let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
            // let _day = (10 > now.getDate()) ? '0' + now.getDate() : now.getDate();
            // this.date = now.getFullYear() + '年' + _month + '月' + _day + '日 ';
            // console.log('this.date', this.date);
            // this.dateString = now.getFullYear().toString() + _month.toString() + _day.toString();
            // this.date = '2022年01月08日'
            // this.dateString = '20220108'
            // // 判断当前时间是否工作日
            // if (_this.workDayList.indexOf(_this.dateString.toString()) !== -1) {
            //     _this.dateShow = false
            //     _this.date = data.year + "年" + data.month + "月" + data.day + "日"
            //     _this.dateString = data.year + data.month + data.day
            //     console.log(_this.dateString, '工作日')
            // } else {
            //     console.log('当前不是工作日,获取下一个工作日')
            //     // 则获取下一个工作日
            //     // _this.date=_this.workDayList[0]
            //     _this.date= _this.workDayList[0].substr(0, 4)+'年'+ _this.workDayList[0].substr(4, 2)+'月'+_this.workDayList[0].substr(6, 2)+'日'
            //     _this.dateString=_this.workDayList[0]
            // }

        },
        // 手机号码验证
        test() {
            const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            if (this.phone.val == '' || this.phone.val.length <= 10 || !reg.test(this.phone.val)) {
                this.hintShow = true
                this.hint = '*手机号格式错误'
                this.err = true
                return false

            } else {
                this.hintShow = false
                this.hint = '手机号格式正确'
                this.err = false
                return true
            }
        },
    }
})