var vm = new Vue({
    el: '#app',
    data() {
        return {
            successMoney: '', //取得的钱
            realTime: '',//取现标志(0-普取,1-快取) ,
            bankAccoDisplay: '',  //到账尾号
            paymentDate: '',  //到账时间
            arrivalDate: ''
        };

    },
    created() {
        var detail = utils.getSession('detail'); //快速取现到账信息
        this.successMoney = Number(detail.successMoney);
        this.realTime = detail.realTime;
        this.bankAccoDisplay = detail.bankAccoDisplay;

        this.arrivalDate = utils.getSession('arrivalDate');

        this.getCheckWeek(this.arrivalDate);
    },
    computed: {},
    watch: {},
    methods: {
        getCheckWeek: function (dateString) {
            var dateArray = dateString.split("-");
            date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
            var startWeek = "周" + "日一二三四五六".charAt(date.getDay());
            this.paymentDate = this.arrivalDate + startWeek + '凌晨1点前到账';
            // return "周" + "日一二三四五六".charAt(date.getDay());
        },
        numFormat(val) {
            if (val || val === 0) {
                val = val.toFixed(2);
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                return '';
            }
        },
        jumpUrl:function(){
           window.location.href='/tradeh5/newWap/familyAccount/home.html' 
        }
    }
})