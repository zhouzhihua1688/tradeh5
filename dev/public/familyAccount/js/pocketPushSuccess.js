var vm = new Vue({
    el: '#app',
    data() {
        return {
            successMoney: '', //充值的钱
            // rechargeTime:'',  //充值时间
            revenueDate: '',   //开始计算收益时间
            arrivalDate: '',   //收益到账时间
            startWeek: '',  //
            checkWeek: ''
        };

    },
    created() {
        var money= utils.getSession('successMoney');
        this.successMoney =Number(money);
        this.revenueDate = utils.getSession('revenueDate');
        this.arrivalDate = utils.getSession('arrivalDate');
        /**
         * 根据时间获取周几
         */
        this.getStartWeek(this.revenueDate); //开始计算收益时间的星期几
        this.getCheckWeek(this.arrivalDate); //收益时间的星期几
    },
    computed: {},
    watch: {},
    methods: {
        getStartWeek: function (dateString) {
            var dateArray = dateString.split("-");
            date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
            var startWeek = "周" + "日一二三四五六".charAt(date.getDay());
            this.startWeek = startWeek;
            // return "周" + "日一二三四五六".charAt(date.getDay());
        },
        getCheckWeek: function (dateString) {
            var dateArray = dateString.split("-");
            date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
            var checkWeek = "周" + "日一二三四五六".charAt(date.getDay());
            this.checkWeek = checkWeek;
        },
        jumpUrl:function(){
           window.location.href='/tradeh5/newWap/familyAccount/home.html' 
        },
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