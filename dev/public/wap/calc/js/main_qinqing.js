/**
 * Created by admin on 2018/11/29.
 */
var vm = new Vue({
    el: '#allPage',
    data: {
        // 网络环境
        // testUrl:'http://appsit.99fund.com.cn:7081',
        // prodUrl:'',
        // 家庭亲情账户数据
        teamId:'',
        teamList:[],
        memberId:'',
        //用户输入数据
        provindeSalary: [
            {value: '上海'},
            {value: "北京"},
            {value: "天津"},
            {value: "河北"},
            {value: "山西"},
            {value: "内蒙古"},
            {value: "辽宁"},
            {value: "吉林"},
            {value: "黑龙江"},
            {value: "江苏"},
            {value: "浙江"},
            {value: "安徽"},
            {value: "福建"},
            {value: "江西"},
            {value: "山东"},
            {value: "河南"},
            {value: "湖北"},
            {value: "湖南"},
            {value: "广东"},
            {value: "广西"},
            {value: "海南"},
            {value: "重庆"},
            {value: "四川"},
            {value: "贵州"},
            {value: "云南"},
            {value: "西藏"},
            {value: "陕西"},
            {value: "甘肃"},
            {value: "青海"},
            {value: "宁夏"},
            {value: "新疆"}],
        //省份
        province: '上海',
        // 计划退休年龄
        retireAge: 60,
        //已工作年限
        hasWorkedYear: 0,
        // 当前月薪
        currentIncome: 6000,
        //预计工资年增长率
        salaryRate: [
            {value: 0.00, text: "0%"},
            {value: 0.01, text: "1%"},
            {value: 0.02, text: "2%"},
            {value: 0.03, text: "3%"},
            {value: 0.04, text: "4%"},
            {value: 0.05, text: "5%"},
            {value: 0.06, text: "6%"},
            {value: 0.07, text: "7%"},
            {value: 0.08, text: "8%"},
            {value: 0.09, text: "9%"},
            {value: 0.10, text: "10%"}
        ],
        incomeYearIncreaseRate: 0.05,
        //当前年龄
        age: 25,
        WishPensionForMonth: 0,
        annualYield: 0,
        //位置记录(进度条)
        disX: '',
        minLeft: 0,
        maxLeft: 0,
        toLeft: 0,
        minFigure: 3000,
        maxFigure: 6000,
        left: 0,
        //位置记录(刻度条)
        disXpercent: '',
        minLeftPercent: 0,
        maxLeftPercent: 0,
        leftPercent: 0,
        toLeftPercent: 0,
        minPercent: 1,
        maxPercent: 20,
        //默认参考数据
        annualYield: 0.05,
        //2016年各省份平均工资
        provinceWithAverageIncome: {
            '北京': 7706.00,
            '天津': 5265.00,
            '河北': 4748.92,
            '山西': 4581.25,
            '内蒙古': 5166.00,
            '辽宁': 4762.33,
            '吉林': 4726.15,
            '黑龙江': 4073.42,
            '上海': 6504.00,
            '江苏': 6057.00,
            '浙江': 4698.75,
            '安徽': 5107.00,
            '福建': 5261.50,
            '江西': 4789.17,
            '山东': 5297.00,
            '河南': 4169.00,
            '湖北': 4284.58,
            '湖南': 5013.33,
            '广东': 6070.67,
            '广西': 5019.92,
            '海南': 5214.00,
            '重庆': 5616.00,
            '四川': 5481.75,
            '贵州': 5011.58,
            '云南': 5297.00,
            '西藏': 5100.00,
            '陕西': 5135.50,
            '甘肃': 4962.42,
            '青海': 5549.08,
            '宁夏': 5464.17,
            '新疆': 4740.00
        },
        //退休年龄与养老金发放月数关系
        retireAgeWithPensionMonth: {
            '40': 233,
            '41': 230,
            '42': 226,
            '43': 223,
            '44': 220,
            '45': 216,
            '46': 212,
            '47': 208,
            '48': 204,
            '49': 199,
            '50': 195,
            '51': 190,
            '52': 185,
            '53': 180,
            '54': 175,
            '55': 170,
            '56': 164,
            '57': 158,
            '58': 152,
            '59': 145,
            '60': 139,
            '61': 132,
            '62': 125,
            '63': 117,
            '64': 109,
            '65': 101,
            '66': 93,
            '67': 84,
            '68': 75,
            '69': 65,
            '70': 56
        },
        //退休开支替代率与当前年龄关系
        retireSpendingReplaceRate: {
            '18': 0.70,
            '19': 0.70,
            '20': 0.70,
            '21': 0.70,
            '22': 0.70,
            '23': 0.70,
            '24': 0.70,
            '25': 0.70,
            '26': 0.70,
            '27': 0.70,
            '28': 0.70,
            '29': 0.70,
            '30': 0.70,
            '31': 0.70,
            '32': 0.70,
            '33': 0.70,
            '34': 0.70,
            '35': 0.70,
            '36': 0.70,
            '37': 0.70,
            '38': 0.70,
            '39': 0.70,
            '40': 0.70,
            '41': 0.697,
            '42': 0.694,
            '43': 0.691,
            '44': 0.688,
            '45': 0.686,
            '46': 0.683,
            '47': 0.680,
            '48': 0.677,
            '49': 0.674,
            '50': 0.671,
            '51': 0.668,
            '52': 0.665,
            '53': 0.663,
            '54': 0.660,
            '55': 0.657,
            '56': 0.654,
            '57': 0.651,
            '58': 0.648,
            '59': 0.645,
            '60': 0.642,
            '61': 0.639,
            '62': 0.637,
            '63': 0.634,
            '64': 0.631,
            '65': 0.628,
            '66': 0.625,
            '67': 0.622,
            '68': 0.619,
            '69': 0.616,
            '70': 0.550
        },
        //组合推荐产品
        // 一次买入
        ageWithFundCombination0: {
            combination1: {
                fundName: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
                fundDesc: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
                urls: ['htffundxjb://action?type=oap&subType=pp&groupId=A0039',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0027',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0049']
            },
            //测试链接
            // combination1: {
            //     fundName: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
            //     fundDesc: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
            //     urls: ['htffundxjb://action?type=oap&subType=pp&groupId=A0421',
            //         'htffundxjb://action?type=oap&subType=pp&groupId=A0296',
            //         'htffundxjb://action?type=oap&subType=pp&groupId=A0302']
            // },
            combination2: {
                fundName: ['锐意优选养老2号', '稳进优选养老2号', '安享优选养老2号'],
                fundDesc: ['锐意优选养老2号', '稳进优选养老2号', '安享优选养老2号'],
                urls: ['htffundxjb://action?type=oap&subType=pp&groupId=A0042',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0043',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0035']
            },
            combination3: {
                fundName: ['锐意优选养老3号', '稳进优选养老3号', '安享优选养老3号'],
                fundDesc: ['锐意优选养老3号', '稳进优选养老3号', '安享优选养老3号'],
                urls: ['htffundxjb://action?type=oap&subType=pp&groupId=A0045',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0047',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0036']
            },
            combination4: {
                fundName: ['锐意优选养老4号', '稳进优选养老4号', '安享优选养老4号'],
                fundDesc: ['锐意优选养老4号', '稳进优选养老4号', '安享优选养老4号'],
                urls: ['htffundxjb://action?type=oap&subType=pp&groupId=A0034',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0048',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0046']
            },
            combination5: {
                fundName: ['锐意优选养老5号', '稳进优选养老5号', '安享优选养老5号'],
                fundDesc: ['锐意优选养老5号', '稳进优选养老5号', '安享优选养老5号'],
                urls: ['htffundxjb://action?type=oap&subType=pp&groupId=A0028',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0044',
                    'htffundxjb://action?type=oap&subType=pp&groupId=A0041']
            }
            // fof: {
            //     fundName: ['添富养老2030三年持有FOF', '添富养老2030三年持有FOF', '添富养老2030三年持有FOF'],
            //     fundDesc: ['添富养老2030三年持有FOF', '添富养老2030三年持有FOF', '添富养老2030三年持有FOF'],
            //     urls: ['htffundxjb://action?type=fp&fundId=006763&fundNm=添富养老2030三年持有FOF',
            //         'htffundxjb://action?type=fp&fundId=006763&fundNm=添富养老2030三年持有FOF',
            //         'htffundxjb://action?type=fp&fundId=006763&fundNm=添富养老2030三年持有FOF']
            // }
        },
        // 定投
        ageWithFundCombination1: {
            combination1: {
                fundName: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
                fundDesc: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
                urls: ['htffundxjb://action?type=oap&subType=mip&groupId=A0039',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0027',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0049']
            },
            // combination1: {
            //     fundName: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
            //     fundDesc: ['锐意优选养老1号', '稳进优选养老1号', '安享优选养老1号'],
            //     urls: ['htffundxjb://action?type=oap&subType=mip&groupId=A0421',
            //         'htffundxjb://action?type=oap&subType=mip&groupId=A0296',
            //         'htffundxjb://action?type=oap&subType=mip&groupId=A0302']
            // },
            combination2: {
                fundName: ['锐意优选养老2号', '稳进优选养老2号', '安享优选养老2号'],
                fundDesc: ['锐意优选养老2号', '稳进优选养老2号', '安享优选养老2号'],
                urls: ['htffundxjb://action?type=oap&subType=mip&groupId=A0042',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0043',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0035']
            },
            combination3: {
                fundName: ['锐意优选养老3号', '稳进优选养老3号', '安享优选养老3号'],
                fundDesc: ['锐意优选养老3号', '稳进优选养老3号', '安享优选养老3号'],
                urls: ['htffundxjb://action?type=oap&subType=mip&groupId=A0045',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0047',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0036']
            },
            combination4: {
                fundName: ['锐意优选养老4号', '稳进优选养老4号', '安享优选养老4号'],
                fundDesc: ['锐意优选养老4号', '稳进优选养老4号', '安享优选养老4号'],
                urls: ['htffundxjb://action?type=oap&subType=mip&groupId=A0034',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0048',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0046']
            },
            combination5: {
                fundName: ['锐意优选养老5号', '稳进优选养老5号', '安享优选养老5号'],
                fundDesc: ['锐意优选养老5号', '稳进优选养老5号', '安享优选养老5号'],
                urls: ['htffundxjb://action?type=oap&subType=mip&groupId=A0028',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0044',
                    'htffundxjb://action?type=oap&subType=mip&groupId=A0041']
            }
            // fof: {
            //     fundName: ['添富养老2030三年持有FOF', '添富养老2030三年持有FOF', '添富养老2030三年持有FOF'],
            //     fundDesc: ['添富养老2030三年持有FOF', '添富养老2030三年持有FOF', '添富养老2030三年持有FOF'],
            //     urls: ['htffundxjb://action?type=fm&subType=create&fundId=006763&fundNm=添富养老2030三年持有FOF',
            //         'htffundxjb://action?type=fm&subType=create&fundId=006763&fundNm=添富养老2030三年持有FOF',
            //         'htffundxjb://action?type=fm&subType=create&fundId=006763&fundNm=添富养老2030三年持有FOF']
            // }
        },
        currentFundIndex: 1,
        // 推荐基金是否是fof类型
        isFofFund: false,
        //人均工资增长率(默认3%)
        perCapitaIncomeIncreaseRate: 0.03,
        // 养老金率(默认8%)
        pensionRate: 0.08,
        // 养老金存储利息(默认2%)
        pensionInterest: 0.02,
        // 寿命(默认85)
        life: 85,
        // 物价指数(默认3.5%)
        priceCoefficient: 0.035,
        // 养老金积累期收益率
        pensionIncomeRate: 0.1,
        echars1: {},
        echars2: {},
        echars3: {},
        //定投直投方式
        needAddCount1: {},
        needAddCount2: {},
        type: 1,
        // 控制前进后退
        currentPage: 1,
        firstEnterPageOne: true,
        firstEnterPageTwo: true
    },
    computed: {
        //控制前进后退 显示隐藏
        leftShow: function () {
            return this.currentPage != 1;
        },
        rightShow: function () {
            if (this.firstEnterPageOne) {
                return false;
            }
            if (this.currentPage == 2 && this.firstEnterPageTwo) {
                return false;
            }
            if (this.currentPage == 3) {
                return false;
            }
            if (this.currentPage == 1 && !this.firstEnterPageOne) {
                return true;
            }
            if (this.currentPage == 2 && !this.firstEnterPageTwo) {
                return true;
            }
            return true;
        },
        paidPensionYears: function () {
            var paidPensionYears = [];
            for (var i = 0, len; i < 47; i++) {
                paidPensionYears.push({value: i, text: i + "年"})
            }
            paidPensionYears.splice(0, 1);
            return paidPensionYears;
        },
        //当前年龄
        currentAge: function () {
            var currentAge = [];
            for (var i = 18, len; i < 66; i++) {
                currentAge.push({value: i, text: i + "岁"});
            }
            return currentAge;
        },
        //计划退休年龄
        retirementAge: function () {
            var retirementAge = [];
            for (var i = 40, len; i <= 70; i++) {
                retirementAge.push({value: i, text: i + "岁"})
            }
            return retirementAge
        },
        //滑块的金额计算
        relFigure: function () {
            this.minFigure = this.Fix(this.pensionForMonthAtNow + 1, 0);
            this.maxFigure = this.Fix(this.currentIncome, 0);
            var toLeft = Number(this.toLeft);
            var slidewidth = this.maxLeft;
            var relFigure = 0;
            if (toLeft <= 0) {
                relFigure = this.minFigure;
            }
            else if (toLeft >= slidewidth) {
                relFigure = this.maxFigure;
            }
            else {
                relFigure = parseInt((this.minFigure + toLeft / slidewidth * (this.maxFigure - this.minFigure)) / 100) * 100;
            }
            if(parseInt(relFigure/100)*100==parseInt(this.minFigure/100)*100&&relFigure!==this.minFigure){
                relFigure=parseInt((this.minFigure/100+1))*100
            }
            this.WishPensionForMonth = Math.max(this.minFigure, Math.min(relFigure, this.maxFigure));
            return relFigure;
        },
        //滑块的百分比计算
        percent: function () {
            var minPercent = this.minPercent,
                maxPercent = this.maxPercent,
                toLeftPercent = this.toLeftPercent,
                slidewidth = this.maxLeftPercent;
            var percent = 0;
            if (toLeftPercent <= 0) {
                percent = minPercent;
            }
            else if (toLeftPercent >= slidewidth) {
                percent = maxPercent;
            }
            else {
                percent = parseInt(toLeftPercent / slidewidth * (maxPercent - minPercent) + minPercent);
            }
            this.annualYield = percent / 100;
            return percent;
        },
        //该省份2016年平均工资
        averageIncomeInProvince: function () {
            return this.provinceWithAverageIncome[this.province];
        },
        //距离退休年限(计划退休年限 - 当前年龄)
        beforeRetireAge: function () {
            return this.retireAge - this.age;
        },
        // 养老金储备年限
        leftPensionAge: function () {
            return this.life - this.retireAge;
        },
        // 总养老金缴纳年限(已工作年限 + 距离退休年限)
        allPensionAge: function () {
            return this.hasWorkedYear + this.beforeRetireAge;
        },
        // 退休时的月工资
        incomeAtRetire: function () {
            return this.currentIncome * Math.pow(1 + this.incomeYearIncreaseRate, this.beforeRetireAge);
        },
        // 已存养老金总额
        hasSavedPensionTotal: function () {
            return this.calcHasSavedPension(this.currentIncome, this.averageIncomeInProvince, this.hasWorkedYear, this.pensionRate, this.incomeYearIncreaseRate);
        },
        // 未来所存养老金总额
        futurePensionTotal: function () {
            return this.calcForFuturePension(this.averageIncomeInProvince, this.beforeRetireAge, this.perCapitaIncomeIncreaseRate, this.currentIncome, this.pensionRate, this.incomeYearIncreaseRate);
        },
        // 最终养老金总额
        finalPensionCount: function () {
            return this.Fix(this.hasSavedPensionTotal + this.futurePensionTotal, 4);
        },
        // 每月基础账户养老金
        baseCountPensionForMonth: function () {
            return this.calcBaseCountPensionForMonth(this.incomeYearIncreaseRate, this.perCapitaIncomeIncreaseRate, this.currentIncome, this.averageIncomeInProvince, this.beforeRetireAge, this.allPensionAge);
        },
        // 每月个人账户养老金
        personalCountPensionForMonth: function () {
            return this.Fix(this.finalPensionCount / this.retireAgeWithPensionMonth[this.retireAge], 4);
        },
        // 月养老金领取额
        pensionForMonth: function () {
            return this.Fix(this.baseCountPensionForMonth + this.personalCountPensionForMonth, 4);
        },
        // 月养老金领取额现值
        pensionForMonthAtNow: function () {
            return this.pensionForMonth / Math.pow(1 + this.priceCoefficient, this.beforeRetireAge);
        },
        // 幸福指数
        happinessCoefficient: function () {
            return this.Fix(this.pensionForMonth / this.incomeAtRetire * 100, 2);
        },
        needInvestPension: function () {
            return this.currentIncome - this.pensionForMonthAtNow > 0;
        },
        fundCombinationInfo: function () {
            this.isFofFund = false;
            if (0 <= this.age && this.age < 40) {
                return this['ageWithFundCombination' + this.type].combination1;
            }
            if (40 <= this.age && this.age < 45) {
                // if (this.age > 43 && this.type == 1) {
                //     this.isFofFund = true;
                //     // return this['ageWithFundCombination' + this.type].fof;
                // }
                return this['ageWithFundCombination' + this.type].combination2;
            }
            if (45 <= this.age && this.age < 50) {
                // if (this.type == 1) {
                //     this.isFofFund = true;
                //     // return this['ageWithFundCombination' + this.type].fof;
                // }
                return this['ageWithFundCombination' + this.type].combination3;
            }
            if (50 <= this.age && this.age < 55) {
                // if (this.type == 1) {
                //     this.isFofFund = true;
                //     // return this['ageWithFundCombination' + this.type].fof;
                // }
                return this['ageWithFundCombination' + this.type].combination4;
            }
            if (this.age >= 55) {
                // if (this.type == 1) {
                //     this.isFofFund = true;
                //     // return this['ageWithFundCombination' + this.type].fof;
                // }
                return this['ageWithFundCombination' + this.type].combination5;
            }
        }
    },
    mounted: function () {
        var fd, sex, params = location.search.slice(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            if (param[0].indexOf("birthday") > -1) {
                fd = param[1];
                if (fd == "null" || (!fd)) {
                    this.age = 25;
                } else {
                    fd = fd.slice(0, 4);
                    this.age = new Date().getFullYear() - fd;
                }
                $("body").data("fd", fd);
            }
            if (param[0].indexOf("sex") > -1) {
                sex = param[1];
                if (sex == "null" || (!sex)) {
                    this.retireAge = 60;
                }
                else if (sex == '1') {
                    this.retireAge = 60;
                }
                else if (sex == '0') {
                    this.retireAge = 55;
                }
            }
        };
        this.getTeamId()
        .then((result)=>{
            // console.log(result);
            this.teamId=result.teamId;
            return this.getTeamList(result.teamId);
            
        })
        .then((result2)=>{
            // console.log(result2);
            this.teamList=result2;
			console.log('teamList',this.teamList);
            if(Array.isArray(result2)&&result2){
                this.custNo=result2[0].custNo;
            }else{
                this.showBomb('家庭账户列表无数据','center');
                // alert('家庭账户列表无数据');
            }
            
        })
        .catch((error)=>{
            // console.log(error);
            this.showBomb('家庭账户获取失败','center');
            // alert('家庭账户获取失败')
        })
        // Promise.all([])
    },
    methods: {
        getTeamId(){
            return new Promise((resolve,reject)=>{
                $.ajax({
                    type: "GET",
                    url: `/sfs/v1/accounts/is-open`,
                    dataType: "json",
                    timeout:60000,
                    success: function (res) {
                        if(res.returnCode=='0'){
                            return resolve(res.body)
                        }else{
                            return reject(res.returnMsg)
                        }
                    },
                    error: function (error) {
                        return reject(error)
                    }
                });
            })
        },
        getTeamList(teamId){
            return new Promise((resolve,reject)=>{
                $.ajax({
                    type: "GET",
                    url: `/sfs/v1/accounts/member/list`,
                    data: {teamId:teamId},
                    dataType: "json",
                    timeout:60000,
                    success: function (res) {
                        if(res.returnCode=='0'){
                            return resolve(res.body)
                        }else{
                            return reject(res.returnMsg)
                        }
                    },
                    error: function (error) {
                        return reject(error)
                    }
                });
            })
        },
        createPlan(url,type){
            var params={};
            var memberRoleName='';
            this.teamList.forEach(function(item){
                if(item.memberId==this.memberId){
                    memberRoleName=item.memberRoleName;
                }
            }.bind(this))
            params.acceptMode='MOBILE';
            params.accountType=3;
            params.memberId=this.memberId;
            params.branchCode ='247';
            if(type=='0'){
                params.planAmount=this.needAddCount1.count<1?'1':this.Fix(this.needAddCount1.count,0);
            }else{
                params.planAmount=this.needAddCount2.count<1?'1':this.Fix(this.needAddCount2.count,0);
            }
            params.teamId=this.teamId;
            params.planName=memberRoleName+'的养老计划';
            // console.log(params,'params');
            $.ajax({
                type:'post',
                url: `/sfs/v1/accounts/plans`,
                contentType: 'application/json',
                data: JSON.stringify(params),
                dataType: "json",
                timeout:60000,
                success: function (res) {
                    if(res.returnCode=='0'){
                        var reslut=res.body;
                        var arAcctName=encodeURIComponent(reslut.planName);
                        var realUrl=url+'&teamId='+reslut.teamId+'&arAcct='+reslut.arAcct+'&arAcctName='+arAcctName;
                        // console.log(realUrl,'realUrl');
                        window.location.href=realUrl;
                    }else{
                        this.showBomb('计划创建失败','center');
                        // alert("创建失败");
                    }
                    // console.log(url);
                    // console.log(res,'openStatus');
                }.bind(this),
                error: function (error) {
                    // console.log(error);
                    this.showBomb('计划创建失败','center');
                    // alert("创建失败");
                }
            });
        },
        directCreatePlan(){
            if(this.teamId){
                window.location.href='htffundxjb://action?type=familyAccount&subType=createPensionPlan&teamId='+this.teamId;
            }else{
                this.showBomb('家庭账户获取失败');
                // alert('获取账户失败');
            }
        },
        buy(event){
            var url=event.currentTarget.getAttribute('dataBaseUrl');
            this.createPlan(url,this.type);
        },
        nextPage: function () {
            var _this = this;
            $(".btnStart a").removeAttr("href");
            if (!this.memberId) {
                this.showBomb("请选择投资成员",'center');
                return;
            }
            if (this.age >= this.retireAge) {
                this.showBomb("年龄不能大于或等于计划退休年龄，请重新选择");
                return;
            }
            if (this.hasWorkedYear > this.age - 18) {
                this.showBomb("已缴纳养老金年限 ≤ 年龄 - 18");
                return;
            }
            if (this.currentIncome == '') {
                this.showBomb("月收入为必填项");
                return;
            }
            $(".btnStart a").attr("href", "#homePage2");
            $(".homePage").animate({"left": "-100%"}, "fast", "swing", function () {
                $(".homePage").hide();
                $(".homePage2").show();
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                //转盘指针
                var relscore = _this.happinessCoefficient;
                relscore = Math.max(0, Math.min(relscore, 100));
                var scoreDeg = relscore / 100 * 180;
                $(".relzhizhen").css({
                    'transform': 'rotate(' + scoreDeg + 'deg)',
                    'webkitTransform': 'rotate(' + scoreDeg + 'deg)',
                    'mozTransform': 'rotate(' + scoreDeg + 'deg)',
                    'msTransform': 'rotate(' + scoreDeg + 'deg)',
                    'transition': '2s',
                    'webkitTransition': '2s',
                    'mozTransition': '2s',
                    'msTransition': '2s'
                })
            });
            this.firstEnterPageOne = false;
            this.currentPage = 2;
        },
        //重写
        rewrite: function () {
            $(".homePage").animate({"left": "0"}, "fast", "swing", function () {
                $(".homePage").show();
                $(".homePage2").hide();
                $(".relzhizhen").css({
                    'transform': 'rotate(0deg)',
                    'webkitTransform': 'rotate(0deg)',
                    'mozTransform': 'rotate(0deg)',
                    'msTransform': 'rotate(0deg)',
                    'transition': '2s',
                    'webkitTransition': '2s',
                    'mozTransition': '2s',
                    'msTransition': '2s'
                });
                // history.pushState(null,null,'#homepage1')
            });
            this.firstEnterPageOne = true;
            this.firstEnterPageTwo = true;
            this.currentPage = 1;
        },
        setEcharsOption: function (data, xArr, type) {
            var _this = this;
            var targetValue = this.Fix(this['needAddCount' + (type + 1)].total, 0);
            var fundData = {
                fund1: {
                    highLine: [],
                    midLine: [],
                    lowLine: [],
                    capitalLine: []
                },
                fund2: {
                    highLine: [],
                    midLine: [],
                    lowLine: [],
                    capitalLine: []
                },
                fund3: {
                    highLine: [],
                    midLine: [],
                    lowLine: [],
                    capitalLine: []
                }
            };
            fundData.fund1.highLine = data.high.y3;
            fundData.fund1.midLine = data.high.y2;
            fundData.fund1.lowLine = data.high.y1;
            fundData.fund1.capitalLine = data.high.y0;

            fundData.fund2.highLine = data.mid.y3;
            fundData.fund2.midLine = data.mid.y2;
            fundData.fund2.lowLine = data.mid.y1;
            fundData.fund2.capitalLine = data.mid.y0;

            fundData.fund3.highLine = data.low.y3;
            fundData.fund3.midLine = data.low.y2;
            fundData.fund3.lowLine = data.low.y1;
            fundData.fund3.capitalLine = data.low.y0;
            var count = (this['needAddCount' + (Number(this.type) + 1)]).count;
            for (var i = 1; i <= 3; i++) {
                fundData['fund' + i].highLine = fundData['fund' + i].highLine.map(function (value) {
                    return _this.Fix(value * count, 0);
                });
                fundData['fund' + i].midLine = fundData['fund' + i].midLine.map(function (value) {
                    return _this.Fix(value * count, 0);
                });
                fundData['fund' + i].lowLine = fundData['fund' + i].lowLine.map(function (value) {
                    return _this.Fix(value * count, 0);
                });
                fundData['fund' + i].capitalLine = fundData['fund' + i].capitalLine.map(function (value) {
                    return _this.Fix(value * count, 0);
                });
            }
            // console.log("要绘制的基金数据:", fundData);

            var option = {
                color: ['#ffe6c4', '#ffc474', '#ff9f59', '#ff7215', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {backgroundColor: '#fff', textStyle: {color: "red"}},
                        lineStyle: {color: "#1aa2e6"}
                    },
                    position: ["0%", "0%"],
                    alwaysShowContent: true,
                    backgroundColor: "rgba(0,0,0,0)",
                    textStyle: {color: "#333"},
                    formatter: '<div style="display: -webkit-box;display: -ms-flexbox;display: -webkit-flex;display: flex;-webkit-box-pack: justify;-ms-flex-pack: justify;-webkit-justify-content: space-between;justify-content: space-between;" padding: 0 .5rem;>'
                    + '<h3 style="line-height: 1.5; padding-top: 0;width: 7.75rem; "><span  style="color:rgb(51, 51, 51);  padding-top:0;">组合模拟收益</span> <span class="tips" onclick="showBomb()" style="color:#178ce6; text-align: center; padding: 0;pointer-events: all;"></span></h3>'
                    + '<div style="line-height: 1.5;text-align: center;width: 7.75rem;">'
                    + '<span style="display:inline-block;margin-right:5px;width:9px;height:9px;background-color:#ff7215"></span>{a3} : <span style="color:#f4333c">{c3}</span>'
                    + '</div >'
                    + '</div>'
                    + '<div class="row">'
                    + '<div style="display: -webkit-box;display: -ms-flexbox;display: -webkit-flex;display: flex;-webkit-box-pack: justify;-ms-flex-pack: justify;-webkit-justify-content: space-between;justify-content: space-between; ">'
                    + '<div class="col-1" style="display: -webkit-box;display: -ms-flexbox;display: -webkit-flex;display: flex;-webkit-box-orient: vertical;-ms-flex-direction: column;-webkit-flex-direction: column;flex-direction:column;-webkit-align-items:center;box-align:center;-moz-box-align:center;-webkit-box-align:center;align-items: center; ">' +
                    '<div><span style="display:inline-block;margin-right:5px;width:9px;height:9px;background-color:#ffe6c4"></span>{a0}</div><div style="color:#f4333c">{c0}</div>' +
                    '</div>'
                    + '<div class="col-1" style="display: -webkit-box;display: -ms-flexbox;display: -webkit-flex;display: flex;-webkit-box-orient: vertical;-ms-flex-direction: column;-webkit-flex-direction: column;flex-direction:column;-webkit-align-items:center;box-align:center;-moz-box-align:center;-webkit-box-align:center;align-items: center; " >' +
                    '<div><span style="display:inline-block;margin-right:5px;width:9px;height:9px;background-color:#ffc56d"></span>{a1}</div>  <div style="color:#f4333c">{c1}</div>' +
                    '</div>'
                    + '<div class="col-1" style="display: -webkit-box;display: -ms-flexbox;display: -webkit-flex;display: flex;-webkit-box-orient: vertical;-ms-flex-direction: column;-webkit-flex-direction: column;flex-direction:column;-webkit-align-items:center;box-align:center;-moz-box-align:center;-webkit-box-align:center;align-items: center;">' +
                    '<div><span style="display:inline-block;margin-right:5px;width:9px;height:9px;background-color:#ff9f51"></span>{a2}</div>  <div style="color:#f4333c">{c2}</div>' +
                    '</div>' +
                    '</div>'
                    + '</div>'
                },
                grid: {left: '10%', right: '10%', top: "26%"},
                xAxis: {
                    type: 'category', boundaryGap: false,
                    axisTick: {show: false},
                    // 展示hanlde
                    // axisPointer: {
                    //     value: xArr[xArr.length - 1],
                    //     snap: true,
                    //     lineStyle: {
                    //         opacity: 0.5,
                    //         width: 2
                    //     },
                    //     label: {
                    //         show: true,
                    //         formatter: function (params) {
                    //             return echarts.format.formatTime('yyyy/MM', params.value);
                    //         }
                    //     },
                    //     handle: {
                    //         show: true,
                    //         size: 20,
                    //         margin: 40,
                    //         color: '#004E52'
                    //     }
                    // },
                    splitLine: {show: true, lineStyle: {color: "#f1f1f1"}},
                    axisLine: {show: true, lineStyle: {color: "#666"}},
                    axisLabel: {},
                    data: []
                },
                yAxis: {
                    axisPointer: {show: false},
                    type: 'value',
                    axisLine: {show: false, lineStyle: {color: "ffe6c4"}},
                    axisTick: {show: false},
                    axisLabel: {show: false},
                    splitLine: {show: true, lineStyle: {color: "#f1f1f1"}},
                },
                series: [
                    {
                        symbol: "none", name: '市场较好', type: 'line', smooth: true,
                        areaStyle: {normal: {color: "#ffe6c4", opacity: 1}},
                        lineStyle: {normal: {color: "#ffe6c4", width: 1}},
                        data: [],
                        z: 1
                    },
                    {
                        symbol: "none", name: '市场平均', type: 'line', smooth: true,
                        areaStyle: {normal: {color: "#ffc474", opacity: 1}},
                        lineStyle: {normal: {color: "#ffc474", width: 1}},
                        markPoint: {
                            silent: true,
                            symbol: "circle", symbolSize: [1, 1],
                            data: [
                                {name: '平均值', type: 'max', x: '60%', itemStyle: {normal: {color: "#fe5a5b"}}},
                                {name: '目标值', x: '60%', itemStyle: {normal: {color: "#008ae9"}}}
                            ],
                            label: {normal: {position: [0, -20], formatter: "{b}:{c}"}},
                        },
                        markLine: {
                            silent: true,
                            data: [
                                [
                                    {name: '平均值', yAxis: 'max', x: '60%'},
                                    {name: '平均值', type: 'max'}
                                ],
                                [
                                    {name: '目标值', yAxis: 4010, x: '60%', value: 8010},
                                    {
                                        name: '目标值',
                                        yAxis: 4010,
                                        x: '90%',
                                        value: 8010,
                                        lineStyle: {normal: {color: "#008ae9"}}
                                    }
                                ]
                            ],
                            lineStyle: {normal: {color: "#fe5a5b", type: "solid"}},
                            symbol: ["none", "circle"],
                            symbolSize: [10, 10],
                            label: {normal: {show: false}},

                        },
                        data: [],
                        z: 2
                    },
                    {
                        symbol: "none", name: '市场较差', type: 'line', smooth: true,
                        areaStyle: {normal: {color: "#ff9f59", opacity: 1}},
                        lineStyle: {normal: {color: "#ff9f59", width: 1}},
                        data: [],
                        z: 3
                    },
                    {
                        symbol: "none", name: '投入本金', type: 'line', smooth: true,
                        areaStyle: {normal: {color: "#ff7215", opacity: 1}},
                        lineStyle: {normal: {color: "#ff7215", width: 1}},
                        data: [],
                        z: 4
                    }
                ]
            };
            option.xAxis.axisLabel.interval = xArr.length - 2;
            option.xAxis.data = xArr;
            var maxValueArr = [];
            maxValueArr.push(fundData.fund1.highLine[fundData.fund1.highLine.length - 1]);
            maxValueArr.push(fundData.fund2.highLine[fundData.fund2.highLine.length - 1]);
            maxValueArr.push(fundData.fund3.highLine[fundData.fund3.highLine.length - 1]);
            var targetValueForY = targetValue;
            for (var i = 0; i < maxValueArr.length; i++) {
                if (targetValue > maxValueArr[i]) {
                    targetValueForY = maxValueArr[i];
                }
                $.extend(true, option.series[1].markPoint.data[1], {yAxis: targetValueForY});
                $.extend(true, option.series[1].markPoint.data[1], {value: targetValue});
                $.extend(true, option.series[1].markLine.data[1][0], {yAxis: targetValueForY});
                $.extend(true, option.series[1].markLine.data[1][0], {value: targetValue});
                $.extend(true, option.series[1].markLine.data[1][1], {yAxis: targetValueForY});
                $.extend(true, option.series[1].markLine.data[1][1], {value: targetValue});
                this.setOptionData(option, fundData, targetValue, i + 1);
            }
            setTimeout(function () {
                _this.echars1.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 1,
                    dataIndex: option.series[3].data.length - 1
                });
                _this.echars2.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 1,
                    dataIndex: option.series[3].data.length - 1
                });
                _this.echars3.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 1,
                    dataIndex: option.series[3].data.length - 1
                });
                _this.echars1.dispatchAction({type: 'hideTip'});
                _this.echars2.dispatchAction({type: 'hideTip'});
                _this.echars3.dispatchAction({type: 'hideTip'});
            }, 10);
        },
        setOptionData: function (option, fundData, targetValue, index) {
            option.series[0].data = fundData['fund' + index].highLine;
            option.series[1].data = fundData['fund' + index].midLine;
            option.series[2].data = fundData['fund' + index].lowLine;
            option.series[3].data = fundData['fund' + index].capitalLine;

            var averageVal = fundData['fund' + index].midLine[fundData['fund' + index].midLine.length - 1];
            if (averageVal > targetValue) {
                option.series[1].markPoint.data[0].label = {normal: {position: [0, -20]}};
                option.series[1].markPoint.data[1].label = {normal: {position: [0, 5]}};

            }
            else {
                option.series[1].markPoint.data[0].label = {normal: {position: [0, 5]}};
                option.series[1].markPoint.data[1].label = {normal: {position: [0, -20]}};
            }
            this['echars' + index].setOption(option, true);
        },
        drawEcharts: function (type) {
            //图绘制
            var _this = this;
            var date = new Date();
            var xArr = [];
            var beforeRetireAge = 0;
            var m = 0;
            beforeRetireAge = (this.beforeRetireAge < 0) ? 1 : this.beforeRetireAge;
            beforeRetireAge = (this.beforeRetireAge >= 47) ? 46 : this.beforeRetireAge;
            var birthday = 0;
            if ($("body").data("fd")) {
                birthday = this.retireAge - (new Date().getFullYear() - Number($("body").data("fd")));
            } else {
                birthday = beforeRetireAge;
            }
            for (var i = 1, len = (birthday + 1) * 12; i <= len; i++) {
                m = date.getMonth() + 1;
                date.setMonth(m);
                m = date.getMonth() + 1;
                m = m > 9 ? m : "0" + m;
                xArr.push(date.getFullYear() + "/" + m)
            }
            var s = document.createElement('script');
            s.src = 'target/y_' + (birthday + 1) + (type == 1 ? 'D.js' : '.js');
            s.onload = function () {
                _this.echars1 = echarts.init(document.getElementById('list1'));
                _this.echars2 = echarts.init(document.getElementById('list2'));
                _this.echars3 = echarts.init(document.getElementById('list3'));

                $(".homePage2").animate({"left": "-200%"}, "fast", "swing", function () {
                    $(".homePage2").hide();
                    $(".homePage3").show();
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    _this.left = $(".bigslide").width() / 2;
                    $(".smallslide").css({width: _this.left});
                    $(".figureTip").css({left: (_this.left - $(".figureTip").width() / 2)});
                    _this.toLeft = _this.left;
                    _this.maxLeft = $(".bigslide").width();
                    //百分比
                    _this.leftPercent = $(".ruling").width() * 0.4;
                    $(".pointer").css({left: _this.leftPercent - $(".pointer").width() / 2});
                    _this.toLeftPercent = _this.leftPercent;
                    _this.maxLeftPercent = $(".ruling").width();
                    setTimeout(function () {
                        _this.setEcharsOption(data, xArr, _this.type);
                    }, 300);
                });
            };
            document.body.appendChild(s);
        },
        nextPageMonth: function (type) {
            this.type = type;
            // 设置默认值
            this.WishPensionForMonth = Math.max(this.minFigure, Math.min(this.Fix((this.currentIncome + this.pensionForMonthAtNow) / 2, 0), this.maxFigure));
            this.annualYield = 0.08;
            this.drawEcharts(this.type);
            this.firstEnterPageTwo = false;
            this.currentPage = 3
        },
        nextPageSingle: function (type) {
            this.type = type;
            // 设置默认值
            this.WishPensionForMonth = Math.max(this.minFigure, Math.min(this.Fix((this.currentIncome + this.pensionForMonthAtNow) / 2, 0), this.maxFigure));
            this.annualYield = 0.08;
            this.drawEcharts(this.type);
            this.firstEnterPageTwo = false;
            this.currentPage = 3;
        },
        //显示弹窗
        showBomb: function (text,position) {
            position&&$(".Bomb-box-content").css('text-align',position);
            !position&&$(".Bomb-box-content").css('text-align','left');
            $(".Bomb-box-content").html(text);
            $(".Bomb-box").removeClass('hideBomb');
        },
        BombboxOk: function () {
            $(".Bomb-box").addClass('hideBomb');
        },
        //滑块部分
        touchstart: function (e) {
            this.disX = e.touches[0].clientX - $(".bigslide").offset().left - $('.figureTip').offset().left;
            this.maxLeft = $(".bigslide").width()-5;
        },
        touchmove: function (e) {
            var toLeft = e.touches[0].clientX - $(".bigslide").offset().left - this.disX;
            toLeft = toLeft < this.minLeft ? this.minLeft : toLeft;
            toLeft = toLeft > this.maxLeft ? this.maxLeft : toLeft;
            this.toLeft = toLeft;
            var tipLeft = toLeft - $(".figureTip").width() / 2;
            $(".smallslide").css({width: toLeft});
            $(".figureTip").css({left: tipLeft+2.5})
        },
        touchend: function (e) {
            var date = new Date();
            var xArr = [];
            var beforeRetireAge = 0;
            var m = 0;
            beforeRetireAge = (this.beforeRetireAge < 0) ? 1 : this.beforeRetireAge;
            beforeRetireAge = (this.beforeRetireAge >= 47) ? 46 : this.beforeRetireAge;
            for (var i = 1, len = (beforeRetireAge + 1) * 12; i <= len; i++) {
                m = date.getMonth() + 1;
                date.setMonth(m);
                m = date.getMonth() + 1;
                m = m > 9 ? m : "0" + m;
                xArr.push(date.getFullYear() + "/" + m)
            }
            this.setEcharsOption(data, xArr, this.type);
        },
        percentStart: function (e) {
            this.disXpercent = e.touches[0].clientX - e.srcElement.offsetLeft;
            this.maxLeftPercent = $(".ruling").width() - $(e.srcElement).width() / 2;
        },
        percentMove: function (e) {
            var toLeftPercent = (e.touches[0].clientX - this.disXpercent);
            toLeftPercent = toLeftPercent < this.minLeftPercent ? this.minLeftPercent : toLeftPercent;
            toLeftPercent = toLeftPercent > this.maxLeftPercent ? this.maxLeftPercent : toLeftPercent;
            this.toLeftPercent = toLeftPercent;
            var tipLeft = toLeftPercent - $(".pointer").width() / 4;
            $(".pointer").css({left: tipLeft});

            var minPercent = this.minPercent,
                maxPercent = this.maxPercent * 100,
                toLeftPercent = this.toLeftPercent,
                slidewidth = this.maxLeftPercent;
        },
        percentEnd: function (e) {
            var date = new Date();
            var xArr = [];
            var beforeRetireAge = 0;
            var m = 0;
            beforeRetireAge = (this.beforeRetireAge < 0) ? 1 : this.beforeRetireAge;
            beforeRetireAge = (this.beforeRetireAge >= 47) ? 46 : this.beforeRetireAge;
            for (var i = 1, len = (beforeRetireAge + 1) * 12; i <= len; i++) {
                m = date.getMonth() + 1;
                date.setMonth(m);
                m = date.getMonth() + 1;
                m = m > 9 ? m : "0" + m;
                xArr.push(date.getFullYear() + "/" + m)
            }
            this.setEcharsOption(data, xArr, this.type);
        },
        //用于计算的函数
        // 取小数点后几位(参数:要计算的值,要精确的位数)
        Fix: function (num, digit) {
            return Number(Number(num).toFixed(digit));
        },
        // 用于计算已经存下的养老金数(参数:当前收入,当地平均收入,已工作年限,养老金率,工资年增长率)
        calcHasSavedPension: function (currentIncome, averageIncomeInProvince, hasWorkedYear, pensionRate, incomeYearIncreaseRate) {
            var firstIncome = this.Fix(currentIncome / Math.pow(1 + incomeYearIncreaseRate, hasWorkedYear), 4); // 首次缴纳养老金时月工资
            var endIncome = currentIncome;
            // var firstIncomeForPension = Math.max(averageIncomeInProvince * 0.6, Math.min(firstIncome, averageIncomeInProvince * 3));
            var endIncomeForPension = Math.max(averageIncomeInProvince * 0.6, Math.min(endIncome, averageIncomeInProvince * 3));
            return this.Fix((firstIncome + endIncomeForPension) * 0.5 * 12 * pensionRate * hasWorkedYear, 4);
        },
        // 用于计算未来所存下的养老金数(参数:当地平均收入,距离退休年限,人均工资增长率,当前收入,养老金率)
        calcForFuturePension: function (averageIncomeInProvince, beforeRetireAge, perCapitaIncomeIncreaseRate, currentIncome, pensionRate, incomeYearIncreaseRate) {
            var floorAndUpperLimit = [{

                min: this.Fix(averageIncomeInProvince * 0.6 * 12, 4),
                max: this.Fix(averageIncomeInProvince * 3 * 12, 4)
            }];
            for (var i = 1; i <= beforeRetireAge; i++) {
                floorAndUpperLimit.push({
                    min: this.Fix(floorAndUpperLimit[0].min * Math.pow(1 + perCapitaIncomeIncreaseRate, i), 4),
                    max: this.Fix(floorAndUpperLimit[0].max * Math.pow(1 + perCapitaIncomeIncreaseRate, i), 4)
                });
            }
            var pensionForEveryMonth = [];
            for (var i = 1; i < floorAndUpperLimit.length; i++) {
                pensionForEveryMonth.push(this.Fix(Math.max(floorAndUpperLimit[i].min, Math.min(currentIncome * Math.pow(1 + incomeYearIncreaseRate, i) * 12, floorAndUpperLimit[i].max)), 4));
            }
            var pensionForEveryMonthTotal = 0;
            pensionForEveryMonth.forEach(function (value) {
                pensionForEveryMonthTotal += value;
            });
            var pensionForFuture = this.Fix(pensionForEveryMonthTotal * pensionRate, 4);
            return pensionForFuture;
        },
        // 用于计算每月基础账户养老金(参数:工资年增长率,人均工资增长率,当前收入,当地平均收入,距离退休年限,总养老金缴纳年限)
        calcBaseCountPensionForMonth: function (incomeYearIncreaseRate, perCapitaIncomeIncreaseRate, currentIncome, averageIncomeInProvince, beforeRetireAge, allPensionAge) {
            var indexationIncome = 0;
            if (incomeYearIncreaseRate == perCapitaIncomeIncreaseRate || beforeRetireAge == 0) {
                indexationIncome = this.Fix(currentIncome / averageIncomeInProvince, 4);
            }
            else {
                var left = currentIncome / averageIncomeInProvince;
                var up = 1 - Math.pow((1 + incomeYearIncreaseRate) / (1 + perCapitaIncomeIncreaseRate), beforeRetireAge + 1);
                var down = ((perCapitaIncomeIncreaseRate - incomeYearIncreaseRate) * (1 + beforeRetireAge)) / (1 + perCapitaIncomeIncreaseRate);
                indexationIncome = this.Fix(left * up / down, 4);
            }
            var indexationCoefficient = Math.min(Math.max(indexationIncome, 0.6), 3); // 指数化系数
            return this.Fix(averageIncomeInProvince * Math.pow(1 + perCapitaIncomeIncreaseRate, beforeRetireAge) * (1 + indexationCoefficient) / 2 * 0.01 * allPensionAge, 4);
        },
        // 计算养老金缺口总额(参数:年养老金缺口,养老金存储利息,养老金储备年限(寿命-退休年龄))
        // 月还款额=本金*月利率*(1+月利率)^n/[((1+月利率)^n)-1]
        calcPensionGapTotal: function (pensionGapForYear, pensionInterest, periods) {
            var coefficient = pensionInterest * Math.pow(1 + pensionInterest, periods) / (Math.pow(1 + pensionInterest, periods) - 1);
            return this.Fix(pensionGapForYear / coefficient, 4);
        },
        // 计算需要直投/定投的额度(0:直投,1:定投,参数:期望的养老金数,目前的养老金数,物价指数,距离退休年龄,养老金存储利息,pensionIncomeRate)
        // WishPensionForMonth：期望的养老金数; pensionForMonthAtNow: 目前的养老金数;
        // priceCoefficient: 物价指数; beforeRetireAge: 距离退休年龄; pensionInterest: 养老金存储利息,
        // annualYield: 预期养老基金年收益率; leftAge:养老金储备年限; type: 0:直投,1:定投;
        calcNeedAddCountForExpect: function (WishPensionForMonth, pensionForMonthAtNow, priceCoefficient, beforeRetireAge, pensionInterest, annualYield, leftAge, type) {
            var pensionGapForMonth = (WishPensionForMonth - pensionForMonthAtNow) * Math.pow(1 + priceCoefficient, beforeRetireAge);   // 每月养老金缺口
            var pensionGapTotal = pensionGapForMonth * (1 - 1 / Math.pow(1 + pensionInterest / 12, leftAge * 12)) / (1 - 1 / (1 + pensionInterest / 12)) / (1 + pensionInterest / 12);
            // console.log("-------------这里是数据检测-------------");
            // console.log("WishPensionForMonth:"+ typeof WishPensionForMonth);
            // console.log("pensionForMonthAtNow:"+ typeof pensionForMonthAtNow);
            // console.log("priceCoefficient:"+ typeof priceCoefficient);
            // console.log("beforeRetireAge:"+ typeof beforeRetireAge);
            // console.log("pensionInterest:"+ typeof pensionInterest);
            // console.log("annualYield:"+ typeof annualYield);
            // console.log("leftPensionAge:"+ typeof leftAge);
            // console.log("type:"+ typeof type);
            // console.log('pensionGapForMonth:' + typeof pensionGapForMonth);
            // console.log('pensionGapTotal:' + typeof pensionGapTotal);
            // console.log(arguments);
            if (type == 0) {
                return {
                    count: pensionGapTotal / Math.pow(1 + annualYield, beforeRetireAge), // (直投法)现在所需资金
                    total: pensionGapTotal // 总资产
                };
            }
            if (type == 1) {
                return {
                    count: pensionGapTotal * annualYield / 12 / (Math.pow(1 + annualYield / 12, beforeRetireAge * 12 + 1) - (1 + annualYield / 12)), // (定投法)按每月积累
                    total: pensionGapTotal // 总资产
                };
            }
            return 0;
        },
        tip1: function () {
            this.showBomb('养老生活幸福指数评估使用养老金替代率计算，是评估退休前后的生活质量水平的指标。')
        },
        tip2: function () {
            this.showBomb('根据全国平均工资增长率的历史数据、GDP增长率的变化趋势推算得到未来一段时间内的全国平均工资增长率，并假设您的工资增长率与全国平均工资增长率相同，由此计算出您在退休前一年的月工资的估计值。')
        },
        tip3: function () {
            this.showBomb('根据相关政策中的计算公式求得。但随着时间推移，物价上涨会使得货币贬值，实际购买力下降。')
        },
        buttonLeft: function () {
            var lineCharts = $('.lineChart');
            var currentIndex = 1;
            for (var i = 0; i < lineCharts.length; i++) {
                if (!lineCharts.eq(i).is(':hidden')) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex == 0) {
                return;
            }
            var toIndex = currentIndex - 1;
            this.currentFundIndex = toIndex;
            if (toIndex == 0) {
                $('.buttonLeft').css("visibility", "hidden");
                $('.buttonRight').css("visibility", "visible");
            } else if (toIndex == 1) {
                $('.buttonLeft').css("visibility", "visible");
                $('.buttonRight').css("visibility", "visible");
            } else {
                $('.buttonLeft').css("visibility", "visible");
                $('.buttonRight').css("visibility", "hidden");
            }

            lineCharts.eq(toIndex).show().siblings().hide();
        },
        buttonRight: function () {
            var lineCharts = $('.lineChart');
            var currentIndex = 1;
            for (var i = 0; i < lineCharts.length; i++) {
                if (!lineCharts.eq(i).is(':hidden')) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex == 2) {
                return;
            }
            var toIndex = currentIndex + 1;
            this.currentFundIndex = toIndex;
            if (toIndex == 0) {
                $('.buttonLeft').css("visibility", "hidden");
                $('.buttonRight').css("visibility", "visible");
            } else if (toIndex == 1) {
                $('.buttonLeft').css("visibility", "visible");
                $('.buttonRight').css("visibility", "visible");
            } else {
                $('.buttonLeft').css("visibility", "visible");
                $('.buttonRight').css("visibility", "hidden");
            }
            lineCharts.eq(toIndex).show().siblings().hide();
        },
        prev: function () {
            this.currentPage = Math.max(1, Math.min(this.currentPage - 1, 3));
            if (this.currentPage == 1) {
                $(".homePage").show().css({left: 0});
                $(".homePage2").hide();
                $(".homePage3").hide();
            }
            if (this.currentPage == 2) {
                $(".homePage2").show().css({left: 0});
                $(".homePage").hide();
                $(".homePage3").hide();
            }
        },
        next: function () {
            this.currentPage = Math.max(1, Math.min(this.currentPage + 1, 3));
            if (this.currentPage == 2) {
                $(".homePage2").show().css({left: 0});
                $(".homePage").hide();
                $(".homePage3").hide();
            }
            if (this.currentPage == 3) {
                $(".homePage3").show().css({left: 0});
                $(".homePage2").hide();
                $(".homePage").hide();
            }
        }
    },
    watch: {
		memberId: function(newValue, oldValue){
			console.log('newValue',newValue);
			console.log('teamList',this.teamList);
			if(newValue){
				var obj = this.teamList.filter(item => item.memberId == newValue)[0];
				obj && (this.age = obj.age);
			}
			else {
				this.age = 25;
			}
		},
        annualYield: function (newValue, oldValue) {
            this.needAddCount2 = this.calcNeedAddCountForExpect(this.WishPensionForMonth, this.pensionForMonthAtNow, this.priceCoefficient, this.beforeRetireAge, this.pensionInterest, this.annualYield, this.leftPensionAge, this.type);
            this.needAddCount1 = this.calcNeedAddCountForExpect(this.WishPensionForMonth, this.pensionForMonthAtNow, this.priceCoefficient, this.beforeRetireAge, this.pensionInterest, this.annualYield, this.leftPensionAge, this.type);
        },
        WishPensionForMonth: function (newValue, oldValue) {
            this.needAddCount2 = this.calcNeedAddCountForExpect(this.WishPensionForMonth, this.pensionForMonthAtNow, this.priceCoefficient, this.beforeRetireAge, this.pensionInterest, this.annualYield, this.leftPensionAge, this.type);
            this.needAddCount1 = this.calcNeedAddCountForExpect(this.WishPensionForMonth, this.pensionForMonthAtNow, this.priceCoefficient, this.beforeRetireAge, this.pensionInterest, this.annualYield, this.leftPensionAge, this.type);
        }
    }
});

