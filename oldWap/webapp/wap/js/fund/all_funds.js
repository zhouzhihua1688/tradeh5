$(function () {
    //滚动导航条
    $('.wrapper').navbarscroll({
        endClickScroll: function (obj) {
            $(".content .all_funds").show()
            obj.index();
        }
    });

    // 表格
    var right_div2 = document.getElementById("right_div2");
    right_div2.onscroll = function () {
        var right_div2_top = this.scrollTop;
        var right_div2_left = this.scrollLeft;
        document.getElementById("left_div2").scrollTop = right_div2_top;
        document.getElementById("right_div1").scrollLeft = right_div2_left;
    }
    //设置右边div宽度
    document.getElementById("right_div").style.width = 12.5 + "rem";
});

var handle = {
    fundTp: 'all',
    curSortType: 'all',
    dwjzSort: 0,
    wfsySort: 0,
    qrnhSort: 0,
    rzfSort: 0,
    yzfSort: 0,
    jzfSort: 0,
    nzfSort: 0,
    allPageNo: 1,
    gzPageNo: 1,
    gpPageNo: 1,
    hhPageNo: 1,
    zqPageNo: 1,
    zsPageNo: 1,
    hbPageNo: 1,
    qtPageNo: 1
}

new Vue({
    el: '#content',
    data: {
        type: '',
        nowDate: '',
        originData: [],
        viewData: []
    },
    watch: {
        originData:{
            handler: function(val, oldval){
                this.viewData = [];
                var _this = this;
                this.originData.forEach(function(item){
                    var data = {
                        "type": item.filterFundTp,
                        "fundId": item.fundId,
                        "fundSt": item.fundSt,
                        "fundTp": item.fundTp,
                        "name": (item.fundNm.length > 8 ?item.fundNm.substr(0,8)+"...":item.fundNm)+"\n\r" + item.fundId,
                        "nav": (item.navStr.length > 8 ? item.navStr.substr(0,8)+"..." : item.navStr),
                        "incomeUnit": item.incomeUnit,
                        "navDt": item.navDt,
                        "yield": item.yield * 100,
                        "day": item.fundTp == '1' ? (item.dayYield < -100 ? "--" : item.dayYield.toFixed(2)) : (item.yield < -100 ? "--" : item.yield.toFixed(2)),
                        "month": item.monthProfitStr,
                        "season": item.thrMonthProfitStr,
                        "year": item.yearProfitStr,
                        "specialImgUrl": item.specialImgUrl
                    };
                    _this.viewData.push(data);
                });
            },
            deep:true
        }
    },
    mounted: function () {
        var _this = this;
        var url = App.projectNm + "/fund/query_funds_by_condition?&fundTp=all&r=" + (Math.random()*10000).toFixed(0);
        App.get(url,null,function(result){
            if (result.body != undefined && result.body != null){
                _this.nowDate = result.body.navDt;
                _this.originData = result.body.funds;
                if(result.body.funds.length > 0){
                    $(".data_more").show();
                }
            }
        });
    },
    methods: {
        setType:function(type) {
            if("hb" == type){
                $(".fund_type_tab_view").eq(0).hide();
                $(".fund_type_tab_view").eq(1).show();
                $("#right_table2").hide();
                $("#right_table3").show();
            }else{
                $(".fund_type_tab_view").eq(0).show();
                $(".fund_type_tab_view").eq(1).hide();
                $("#right_table2").show();
                $("#right_table3").hide();
            }

            $(".data_more").hide();
            var fundTp = type;
            handle['fundTp'] = fundTp;

            var _this = this;
            _this.viewData = [];
            var url = App.projectNm + "/fund/query_funds_by_condition?r=" + (Math.random()*10000).toFixed(0);
            if(App.isNotEmpty(fundTp)){
                url += "&fundTp=" + fundTp;
            }
            var curSortType = handle['curSortType'];
            if(curSortType != 'all'){
                var sort = handle[curSortType + 'Sort'];
                url += "&sortType=" + curSortType;
                url += "&sort=" + sort;
            }
            App.get(url,null,function(result){
                if (result.body != undefined && result.body != null){
                    _this.nowDate = result.body.navDt;
                    _this.originData = result.body.funds;
                    if(result.body.funds.length > 0){
                        $(".data_more").show();
                    }
                }
            });
        },
        sort:function (sortType) {
            // console.log("sortType", sortType);
            // console.log("fundTp", handle['fundTp']);
            handle['curSortType'] = sortType;
            var sort = handle[sortType + 'Sort'];
            handle[sortType + 'Sort'] = (handle[sortType + 'Sort'] + 1) % 2;

            if ($(event.target).find('span').hasClass('active_down_f')) {
                $(event.target).find('span').removeClass('active_down_f').addClass('active_on');
            } else if ($(event.target).find('span').hasClass('active_on')) {
                $(event.target).find('span').removeClass('active_on').addClass('active_down_f');
            } else {
                $('#right_table1>tbody>tr>th>span').each(function (index, item) {
                    $(item).removeClass('active_on active_down_f');
                    $(item).addClass('active_down');
                });
                $(event.target).find('span').removeClass('active_down').addClass('active_down_f');
            }

            var _this = this;
            var url = App.projectNm + "/fund/query_funds_by_condition?r=" + (Math.random()*10000).toFixed(0);
            url += "&sortType=" + sortType;
            url += "&sort=" + sort;
            if(App.isNotEmpty(handle['fundTp'])){
                url += "&fundTp=" + handle['fundTp'];
            }
            App.get(url,null,function(result){
                if (result.body != undefined && result.body != null){
                    _this.nowDate = result.body.navDt;
                    _this.originData = result.body.funds;
                }
            });
        },
        dataMore:function (){
            var url = App.projectNm + "/fund/query_funds_by_condition?r=" + (Math.random()*10000).toFixed(0);
            var fundTp = handle['fundTp'];
            if(App.isNotEmpty(fundTp)){
                url += "&fundTp=" + fundTp;
                handle[fundTp + 'PageNo'] ++;
                url += "&pageNo=" + handle[fundTp + 'PageNo'];
            }

            var curSortType = handle['curSortType'];
            if(curSortType != 'all'){
                var sort = handle[curSortType + 'Sort'];
                url += "&sortType=" + curSortType;
                url += "&sort=" + sort;
            }
            var _this = this;
            $(".data_more img").css("display","inline-block");
            App.get(url,null,function(result){
                if (result.body != undefined && result.body != null){

                    var moreList = result.body.funds;
                    if(moreList.length == 0){
                        $(".data_more").hide();
                    }

                    _this.nowDate = result.body.navDt;
                    var dataList = _this.originData;
                    dataList = dataList.concat(moreList);
                    _this.originData = dataList;
                    $(".data_more img").hide();
                }
            });
        },
        queryFundDetail:function (fundId) {
            if(fundId == "000330"){
                window.location.href = "../account/xjb_index.html";
            }else {
                window.location.href = "steadyCombination.html?fundId=" + fundId;
            }
        }
    }
});
