
var myChart_1;
var fundTp = "";
var incomeMap = {};
var is_set_pwd_show_tip_err_code = '0';
var cardsCount = 0;
var selectTab2 = 0;//切换标签
var isClick = false;//是否点击切换按钮
var card_list = App.getSession(App.cards);
var filterFundTp = '';
var isPeriodHold = '';


$(function(){
    utils.silentLogin();
    $(".tab1 li").click(function(event){
        // console.log("tab1:", $(".tab1 li.active").index());
        if($(this).hasClass("active")) { return;}
        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');
        $(".tab2").hide().eq($(this).index()).show();

        queryCharts(fundTp, $(this).index());
    });
    $(".tab2 li").click(function(){
        if($(this).hasClass("active")) { return;}
        $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');

        queryCharts(fundTp, $(".tab1 li.active").index());
    });
    $(".fund_detail_tip").click(function(event){
        $(".tip3").show();
    });

    var ssoCookie = HTF.getCookie("sso_cookie");
    if(!card_list || card_list.length == 0){
        if(ssoCookie){
            App.queryCard(function(){
                var cards = App.getSession(App.cards);
                cardsCount = cards.length;
            });
        }
    }else{
        cardsCount = card_list.length;
    }

    queryFundDetail();
    
});

var option_1 = {
    color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    tooltip : { show: true, trigger: 'axis',
        axisPointer: {
            type: 'line', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: { color: "#1aa2e6"}
        },
        position:["50%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
        formatter: function(itme){
            var itmeday=itme[0].name;
            var itmedata=itme[0].data;
            var showHtml = '';
            var selectedTab = $(".tab1 li.active").index();
            //特殊处理
            if(isClick && selectedTab == 0 && fundTp != '1'){
                if(selectTab2 == 3 || selectTab2 == 4){
                    itmeday = $(".tab2_0 li").eq(selectTab2).text();
                }else{
                    itmeday = '近' + $(".tab2_0 li").eq(selectTab2).text();
                }
            }

            isClick = false;
            if (fundTp == '1') {
                /*** 货基*/
                if(selectedTab == 0){
                    /*** 万份收益*/
                    showHtml = "<div class='chart_tag'>" + itmeday + "&nbsp;&nbsp;万份收益：<span style='color:"+ (Number(itmedata) < 0 ? "green" : "#f4333c") +"'>" + itmedata + "<span></div>";
                }else{
                    /*** 七日年化*/
                    showHtml = "<div class='chart_tag'>" + itmeday + "&nbsp;&nbsp;七日年化：<span style='color:"+ (Number(itmedata) < 0 ? "green" : "#f4333c") +"'>" + itmedata+'%' + "<span></div>";
                }
            } else {
                /*** 非货基*/
                if(selectedTab == 0){
                    /*** 收益率走势*/
                    showHtml = "<div class='chart_tag'>" + itmeday + "&nbsp;&nbsp;<span class='chart_sub_tag'></span>&nbsp;本基金：<span style='color:"+ (Number(itmedata) < 0 ? "green" : "#f4333c") +"'>" + itmedata+'%' + "<span></div>";
                }else{
                    /*** 净值走势*/
                    showHtml = "<div class='chart_tag'>" + itmeday + "&nbsp;&nbsp;最新单位净值：<span style='color:"+ (Number(itmedata) < 0 ? "green" : "#f4333c") +"'>" + Number(itmedata) + "<span></div>";
                }
            }
            return showHtml;
        }
    },
    grid: {left: '3%', right: '4%', bottom: '10%', top: "20%", containLabel: true },
    xAxis : [
        {
            type : 'category', boundaryGap : false, axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLine:{show: true, lineStyle:{color:"#f1f1f1"}},
            axisLabel: {interval: 30, textStyle: {color: "#999",fontWeight:"bolder",fontFamily:"Arial"}},
            data : [],
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale: true,
            splitNumber: 4,
            axisLine:{show: true, lineStyle:{color:"#f1f1f1"}},
            axisTick: {show: false},
            splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
            axisLabel: { show: true, formatter: function(value){return toDecimal(value);} ,textStyle: {color: "#999",fontWeight:"bolder",fontFamily:"Arial"}},
            axisPointer: { label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} }
        }
    ],
    series : [
        {
            symbol: "emptyCircle", name:'本基金', type:'line', smooth: true,
            symbolSize:6,
            showSymbol:false,
            hoverAnimation:false,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#fee6e3' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }], false)
                }
            },
            lineStyle: {
                normal: {
                    color: "#fb5c5f",
                    width:1
                }
            },
            data:[]
        }
    ]
};
function setOption(option,incomes1, fundTp, selectedTab){
    var result1 =  formattingIncomes(incomes1, fundTp, selectedTab);

    option.xAxis[0].data = result1.xArr;
    option.xAxis[0].axisLabel.interval = result1.xArr.length-2;
    option.series[0].data = result1.yArr;

}
function draw(myChart, option){
    if( !((option.series[0].data && option.series[0].data.length>0) || (option.series[1].data && option.series[1].data.length>0))){
        option.xAxis[0].data = ["",""];
        option.xAxis[0].axisLabel.interval = ["",""].length-2;
        $(".noData").show();
    }else{
        $(".noData").hide();
    }
    myChart.setOption(option);
    setTimeout(function(){
        myChart.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:10 });
    },0);
}

function formattingIncomes(incomes, fundTp, selectedTab){
    var xArr = [], yArr = [];
    var len = incomes.length;

    for (var i = 0; i < len; i++) {
        xArr.push(incomes[i].navDate + '        ');
        if (fundTp == '1') {
            /*** 货基*/
            if(selectedTab == 0){
                /*** 万份收益*/
                yArr.push(Number(incomes[i].fundIncomeUnit).toFixed(4));
            }else{
                /*** 七日年化*/
                yArr.push(Number(incomes[i].yield).toFixed(4));
            }
        } else {
            /*** 非货基*/
            if(selectedTab == 0){
                /*** 收益率走势*/
                yArr.push(Number(incomes[i].sumOfYield).toFixed(2));
            }else{
                /*** 净值走势*/
                yArr.push(Number(incomes[i].navDisplay).toFixed(4));
            }
        }
    }
    return {xArr: xArr, yArr: yArr};
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal(x) {
    /*var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }*/
    return Number(x).toFixed(2)+"%";
}

function queryCharts(fundTp, selectedTab){
    isClick = true;
    var btn_index = $(".tab2_" + selectedTab + " li.active").index();
    selectTab2 = btn_index;
    var selectedTimePeriod = "01";
    if(btn_index == 0){
        selectedTimePeriod = "01";
    } else if(btn_index == 1){
        selectedTimePeriod = "02";
    } else if(btn_index == 2){
        selectedTimePeriod = "03";
    } else if(btn_index == 3){
        selectedTimePeriod = "05";
    }else {
        selectedTimePeriod = "04";
    }
    /*
    OneWeek("00", "一周"),
    OneMonth("01", "近1个月"),
    Quarter("02", "近3个月"),
    HalfYear("03", "近6个月"),
    FromYear("04", "今年以来"),
    OneYear("05", "近1年"),
    TowYear("06", "近2年"),
    ThreeYear("07", "近3年"),
    FiveYear("09", "近5年"),
    FromBuild("08", "成立以来"),
    SFC("sfc","自发车日");
    */
    // console.log("key:", "TimePeriod" + selectedTimePeriod);
    var incomes = incomeMap["TimePeriod" + selectedTimePeriod];
    if(incomes == undefined || incomes == null) {
        var fundId = App.getUrlParam("fundId");
        // var url = App.projectNm + "/fund/query_fund_yields_renew?fundId="+ fundId +"&count="+ selectedTimePeriod;
        var url = "/productcenter/v1/new/compose/funds/single/curve/yield/index/collections?fundId="+ fundId +"&dateRangeType=" + selectedTimePeriod;

        App.get(url,null,function(result){
            if (result.body != undefined && result.body != null){
                // console.log("get:", result);
                if (result.body != undefined && result.body != null){
                    var incomes = result.body;
                    incomeMap["TimePeriod" + selectedTimePeriod] = incomes;
                    if (incomes.length > 0){
                        myChart_1 = echarts.init(document.getElementById('pie1'));
                        setOption(option_1, incomes, fundTp, selectedTab);
                        draw(myChart_1,option_1);
                        myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: incomes.length - 1});
                        myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: -1});
                    }else {
                        $(".noData").show();
                    }
                }
            }
        });
    }else {
        // console.log("cache:", incomes);
        if (incomes.length > 0){
            myChart_1 = echarts.init(document.getElementById('pie1'));
            setOption(option_1, incomes, fundTp, selectedTab);
            draw(myChart_1,option_1);
            myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: incomes.length - 1});
            myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: -1});
        }else {
            $(".noData").show();
        }
    }
};
var eventContent;
var eventTitle;
var sel_date;
function queryFundDetail() {
    var fundId = App.getUrlParam("fundId");
    var url =  "/mobile-bff/v1/fund/detailInfo";
    var data = JSON.stringify({
        "fundId": fundId
    });

	App.post(url, data, function(result) {
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var fundInfo = result.body;
            eventContent = fundInfo.fundNm;
            eventTitle = fundInfo.fundNm;
            sel_date = fundInfo.issueDate;
            $("#view_fundNmId").html(fundInfo.fundNm + " <span>("+fundInfo.fundId+")</span>");


            $("#view_type_risk").html("<span>" + getfundTpNm(fundInfo.filterFundTp)+ "</span><span>" + fundInfo.fundRiskLevelNm + "</span>");
            filterFundTp= fundInfo.filterFundTp;
            isPeriodHold = fundInfo.isPeriodHold;
            if(fundInfo.navDtFat.length == 10){
                $("#view_nav_dt").html(fundInfo.navDtFat.substr(5));
            }

            $("#view_monthProfit").html((App.isEmpty(fundInfo.monthProfitStr) || fundInfo.monthProfitStr == '--') ? '--' : (fundInfo.monthProfitStr + "%"));
            txtShow("#view_monthProfit", fundInfo.monthProfit);

            $("#view_thrMonthProfit").html((App.isEmpty(fundInfo.thrMonthProfitStr) || fundInfo.thrMonthProfitStr == '--') ? '--' : (fundInfo.thrMonthProfitStr + "%"));
            txtShow("#view_thrMonthProfit", fundInfo.thrMonthProfit);

            $("#view_halfYearProfit").html((App.isEmpty(fundInfo.halfYearProfitStr) || fundInfo.halfYearProfitStr == '--') ? '--' : (fundInfo.halfYearProfitStr + "%"));
            txtShow("#view_halfYearProfit", fundInfo.halfYearProfit);

            $("#view_yearProfit").html((App.isEmpty(fundInfo.yearProfitStr) || fundInfo.yearProfitStr == '--') ? '--' : (fundInfo.yearProfitStr + "%"));
            txtShow("#view_yearProfit", fundInfo.yearProfit);

            $("#view_twoYearProfit").html((App.isEmpty(fundInfo.twoYearProfitStr) || fundInfo.twoYearProfitStr == '--') ? '--' : (fundInfo.twoYearProfitStr + "%"));
            txtShow("#view_twoYearProfit", fundInfo.twoYearProfit);

            $("#view_thrYearProfit").html((App.isEmpty(fundInfo.thrYearProfitStr) || fundInfo.thrYearProfitStr == '--') ? '--' : (fundInfo.thrYearProfitStr + "%"));
            txtShow("#view_thrYearProfit", fundInfo.thrYearProfit);

            $("#view_fromYearProfit").html((App.isEmpty(fundInfo.fromyearreturnStr) || fundInfo.fromyearreturnStr == '--') ? '--' : (fundInfo.fromyearreturnStr + "%"));
            txtShow("#view_fromYearProfit", fundInfo.fromyearreturn);

            $("#view_sinceProfit").html((App.isEmpty(fundInfo.sinceProfitStr) || fundInfo.sinceProfitStr == '--') ? '--' : (fundInfo.sinceProfitStr + "%"));
            txtShow("#view_sinceProfit", fundInfo.sinceProfit);

            if(App.isNotEmpty(fundInfo.tips)){
                $(".fund_detail_tip_txt").html(fundInfo.tips);
                $(".fund_detail_tip").show();
            }
			var manageStr = "";
			fundInfo.fundManageInfos.forEach(function(item,index){
				manageStr+= item.name;
				if(fundInfo.fundManageInfos.length > index +1){
					manageStr+= "、";
				}
			});
            $("#view_manage").html(manageStr);
            $("#view_netValue").html(fundInfo.netValueStr);

            fundTp = fundInfo.fundTp;
            queryCharts(fundTp, $(".tab1 li.active").index());
            queryFundNav(fundTp);

            if(fundInfo.fundTp == '1'){
                $("#tab1_1").html("<a>万份收益</a>");
                $("#tab1_2").html("<a>七日年化</a>");
                $("#title_1").html("万份收益");
                $("#title_2").html("七日年化");
                $("#show_profit_btn").hide();
                $("#view_nav").html(Number(fundInfo.incomeUnit).toFixed(4));
                $("#view_yield").html(Number(fundInfo.yield * 100).toFixed(3) + "%");
                txtShow("#view_yield", fundInfo.yield);
            }else {
                $("#view_nav").html(fundInfo.navStr);
				if(App.isNotEmpty(fundInfo.dailyGrowthRateDisplay) ){
					$("#view_yield").html(Number(fundInfo.dailyGrowthRateDisplay) + "%");
					txtShow("#view_yield", fundInfo.dailyGrowthRateDisplay);
				}else{
					$("#view_yield").html("--");
					$("#view_yield").css("color", "#000");
				}
                

                $(".show_profit").click(function () {
                    if($(".tablelist_1").is(":hidden")){
                        $(".tablelist_1").show();
                        $("#show_profit_btn").attr("src", "../images/select_on.png");
                    }else{
                        $(".tablelist_1").hide();
                        $("#show_profit_btn").attr("src", "../images/select_down.png");
                    }
                });
            }

            var txt = "";
            if(fundInfo.fundSt == "1"){
                $(".buy").html("认购");
                txt += "认购费率：";
                $(".bottom").css("bottom","2.5rem");
				$("#div_").css("height","5.5rem");
                
            }else{
                txt += "申购费率：";
            }
            txt += '<span style="text-decoration: line-through">'
                + fundInfo.stdRate + '%</span> &nbsp;<span>'
                + fundInfo.curRate + '%</span>&nbsp;&nbsp;&nbsp;';
            switch (fundInfo.fundSt) {
                case "0":
                case "2":
                    txt += "开放申购 开放赎回";
                    break;
                case "1":
                    txt += "开放认购（发行中）";
                    break;
                case "4":
                    txt += "暂停交易";
                    break;
                case "5":
                    txt += "暂停申购 开放赎回";
                    break;
                case "6":
                    txt += "开放申购 暂停赎回";
                    break;
                case "7":
                    txt += "开放认购";
                    break;
                case "8":
                    txt += "暂停交易（募集结束）";
                    break;
                case "9":
                    txt += "暂停交易（基金封闭）";
                    break;
            }
			//赎回按钮显示控制 sunchanghong
			if(fundInfo.fundSt == '4' || fundInfo.fundSt == '6'){
				$(".redeem").parent("li").css('background', '#c6c6c6');
				$(".redeem").unbind("click");
			}else{
				$(".redeem").attr("href", "../fund/redeem.html?fundId=" + App.getUrlParam("fundId"));
			}
			//赎回按钮显示控制 sunchanghong
            if(fundInfo.fundSt == '1' || fundInfo.fundSt == '7'){
                $("#investmentRemark_tr").hide();
                $("#netValue_tr").hide();
            }

            if(fundInfo.canPurchase == '0' || fundInfo.fundSt == '5'){
                $(".buy").html("暂停交易");
                $(".buy").parent("li").css('background', '#c6c6c6');
                $(".buy").unbind("click");
                $(".btn_mip").hide();
                $(".btn_mip").unbind("click");
                $(".bottom").css("bottom","2.5rem");
				$("#div_").css("height","5.5rem");
            } else if(fundInfo.canMip == '0'){
                $(".btn_mip").hide();
                $(".btn_mip").unbind("click");
                $(".bottom").css("bottom","2.5rem");
				$("#div_").css("height","5.5rem");
            } else {
                getFundFee();
            }
            $(".buy-div").show();

            var labels = '';
            fundInfo.labels.forEach(function(item){
                labels += "<span>"+ item +"</span>";
            });
            $("#view_labels").html(labels);
            if(fundInfo.isTaxExtendPension == '1' || fundInfo.isTaxExtendPension == '2'){
                $(".btn_mip").hide();
                $(".redeem_btn_li").hide();
                /*$(".fund_mip").html("自动购买");
                $(".fund_mip").click(function () {
                    queryIsOpenYLAcco('../taxExtension/autodepositIndex.html?fundId='+fundId);
                });*/
                var showType = App.getUrlParam("showType");
                if(showType == '1'){
                    $(".buy_btn_li").hide();
                    $(".buy").html("选择该产品");
                } else {
                    $(".buy").html("开启养老投资计划");
                }
                $(".buy_btn_li").click(function () {
                    queryIsOpenYLAcco('../taxExtension/autodepositIndex.html?fundId='+fundId);
                });
            } else {
                //$(".btn_mip").show();
                //申购
                if($(".buy").html() == "申购" || $(".buy").html() == "认购"){
	                $(".buy_btn_li").click(function(){
	                    buttonJump('BUY');
	                });
            	}
                //定投
                if($(".fund_mip").html() == "定投"){
	                $(".fund_mip").click(function () {
	                    buttonJump('MIP');
	                });
            	}
            }
			//开售提醒按钮展示逻辑
			if(fundInfo.fundSt == "4" && fundInfo.fundTp != "8"){
				if(App.isNotEmpty(fundInfo.issueDate)){

					if(Date.parse(dateFmt(fundInfo.issueDate)) >Date.parse(new Date())){
						
						$("#kaishou").show();
					}
				}
			}
			
            queryFundDetailConfigBars(fundInfo.fundTp);
            

            //底部按钮20210530 
            if(fundInfo.xjbBaseAccount == "Y"){
                $(".buy-div").hide();
                $("#xjb_show").show();
                $("#view_feeRate").hide();
                $(".bottom").css("bottom","2.5rem");
                $("#div_").css("height","5.5rem"); 
            }

            var fundQuickRedeemSwitch = false;
            var url = "/res/v1/layout-switch/funcmod-switch?layoutIds=fundDetailQuickRedeemTagSwitch";
            utils.get(url, null, function (result) {
                if (result.body != undefined && result.body != null) {
                    fundQuickRedeemSwitch = result.body.fundDetailQuickRedeemTagSwitch? true: false;
                    if(fundQuickRedeemSwitch && fundInfo.quickRedeem == 'Y'){
                        $("#fastRedeem").show();
                    }
                }
            })

        }
    });
}
	//格式化输入日期
	function dateFmt(toFormat) {
		toFormat = String(toFormat);
		return toFormat.substr(0,4)+'-'+toFormat.substr(4,2)+'-'+toFormat.substr(6,2);
	};
	//格式化输出日期
	function fmtDate(dd,t){
		var a = new Date();
		if(dd!=''){
			a = new Date(dd);
		}
		var m = (a.getMonth()+1)>10 ?(a.getMonth()+1) : '0'+(a.getMonth()+1);
		var d = (a.getDate()+1)>10 ?(a.getDate()) : '0'+(a.getDate());
		if(t==1){
			return a.getFullYear()+m+d;
		}else{
			return a.getFullYear()+"-"+m+"-"+d;
		}
	};
function buttonJump(type) {
    if(is_set_pwd_show_tip_err_code == "1"){
        //$(".login_tip").show();
        //return;
    }else if(is_set_pwd_show_tip_err_code == "2"){
        if(cardsCount == 0){
            
        }else{
            $("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
            $("#add_bind_card").html("去设置");
        }
        $(".tip2").show();
        $("#add_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
        return;
    }else if (type == 'MIP'){
        window.location.href = "fund_mip.html?fundId=" + App.getUrlParam("fundId");
    }else if (type == 'BUY'){
        // 判断是否是理财基金
        if(isPeriodHold == '1'||filterFundTp == '8'){
            window.location.href = "financialPayment.html?fundId=" + App.getUrlParam("fundId");
        }else{
            window.location.href = "payment.html?fundId=" + App.getUrlParam("fundId");
        }
        
    }
}

function queryIsOpenYLAcco(url) {
    if(is_set_pwd_show_tip_err_code == "1"){
        //$(".login_tip").show();
        //return;
    }else if(is_set_pwd_show_tip_err_code == "2"){
		if(cardsCount == 0){
			
		}else{
			$("#bind_card_tip").html("您还未设置交易密码，请先设置交易密码");
		}
        $(".tip2").show();
        $("#add_bind_card").attr("href", "../card/bindCardInputCardInfo.html?referUrl=" + encodeURIComponent(document.URL));
        return;
    } else {
        App.get("/icif/v1/pitdaccts", null, function (result) {
            if (result.body != undefined && result.body != null) {
                console.log(result);
                if (result.body.isOpenPITD == 'Y'){
                    window.location.href = url;
                } else {
                    $(".go_to_open_account_tip").show();
                }
            }
        });
    }
}

function txtShow(field, val) {
    if(Number(val) < -100){
        $(field).css("color", "red");
    }else if(Number(val) < 0){
        $(field).css("color", "green");
    }else {
        $(field).css("color", "red");
    }
}

function getfundTpNm(fundTp) {
    if(fundTp == '0'){
        return "股票型";
    }else if(fundTp == '1'){
        return "货币型";
    }else if(fundTp == '2'){
        return "债券型";
    }else if(fundTp == '3'){
        return "混合型";
    }else if(fundTp == '4'){
        return "海外型";
    }else if(fundTp == '6'){
        return "指数型";
    }else if(fundTp == '8'){
        return "理财型";
    }else if(fundTp == 'F'){
        return "FOF";
    }
}

function queryFundDetailConfigBars(fundTp) {

    var fundId = App.getUrlParam("fundId");
    var url =  "/mobile-bff/v1/fund/fund-detail-config-bars";
		var data = JSON.stringify({
			"fundId": fundId,
			"fundType":fundTp
		});

	App.post(url, data, function(result) {
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var info = result.body.fundDetailConfigBars;
            $("#view_fundArchivesRemark").html(info.fundArchivesRemark);
            $("#view_jump_fundArchivesRemark").on("click", function(){window.location.href=info.fundArchivesRemarkUrl});
            $("#view_investmentRemark").html(info.investmentRemark);
            $("#view_jump_investmentRemark").on("click", function(){window.location.href=info.investmentRemarkUrl});

            $("#view_fundTradeRuleRemark").html(info.fundTradeRuleRemark);
            $("#view_jump_fundTradeRuleRemark").on("click", function(){window.location.href=info.fundTradeRuleUrl});

            $("#view_jump_manage").on("click", function(){window.location.href=info.fundManagerUrl});
            $("#view_jump_fundScaleQutyUrl").on("click", function(){window.location.href=info.fundScaleQutyUrl});

            info.fundPurchaseProcessesList.forEach(function (item, index) {
                var point = index + 1;
                $("#view_" + point + "_up").html(item.processTitle);
                $("#view_" + point + "_down").html(item.processDatePoint);
            });
            if(info.fundPurchaseProcessesList.length == 0){
                $(".slide_content").hide();
            }
        }
    });
}



function getFundFee() {
    var fundId = App.getUrlParam("fundId");
    var url = "/mobile-bff/v1/fund/getFundInfoPage?productId="+fundId;

    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
			if(result.body.rateTip == ""){
				$(".bottom").css({"bottom":"2.7rem"});
			}else{	
				$("#view_feeRate").html(result.body.rateTip.replace(/，/g," "));
			}
        }
    });
}

function queryFundNav(fundTp) {
    var fundId = App.getUrlParam("fundId");
    // var url = App.projectNm + "/fund/query_fund_yield_renew_page?r=" + (Math.random()*10000).toFixed(0);
    var url = "/mobile-bff/v1/fund/fund-yield-renew-page?r=" + (Math.random()*10000).toFixed(0);
    if(App.isNotEmpty(fundId)){
        url += "&fundId=" + fundId;
    }

    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var html = '';
            if(result.body.length == 0){
                $(".content3").hide();
            }else {
                if(fundTp == "1"){
                    result.body.forEach(function (item) {
                        html += "<tr>" +
                            "<td>" + item.navDate + "</td>" +
                            "<td>" + item.incomeunit + "</td>" +
                            "<td style='color: " + (Number(item.yield) >=0? "red" :"green") + "'>" + item.yield + "%</td>" +
                            "</tr>";
                    });
                    $("#view_income_list").html(html);
                    $(".income_list").show();
                    $("#more_income").attr("href", "navList_v1.html?fundId=" + App.getUrlParam("fundId") + "&fundTp=" + fundTp);
                }else{
                    result.body.forEach(function (item) {
                        html += "<tr>" +
                            "<td>" + item.navDate + "</td>" +
                            "<td>" + item.nav + "</td>" +
                            "<td>" + item.sumOfNav + "</td>" +
                            "<td style='color: " + (Number(item.dayGrouth) >=0? "red" :"green") + "'>" + item.dayGrouth + "%</td>" +
                            "</tr>";
                    });
                    $("#view_nav_list").html(html);
                    $(".nav_list").show();
                    $("#more_nav").attr("href", "navList_v1.html?fundId=" + App.getUrlParam("fundId") + "&fundTp=" + fundTp);
                }
            }
        }
    });
}



$(".close_tip").click(function(){
    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
    $(this).parents(".tip3").hide();
});
//未绑卡
// $(".Investment").click(function(){
//     $(".tip2").show();
//     // window.location.href="payment.html";
//     // return;
// });


$(".xjb_index").click(function(){
	window.location = '../account/xjb_index.html';
});


$(function(){
    function getThemeInfo() {
        var url ="/res/v1/app-func-layout/location?layoutId=wapFundDetail&date=" + (new Date()).getTime();
        App.get(url, null, function(res) {
            if (res.returnCode == 0 && res.body != undefined && res.body != null && res.body.length > 0) {
                var funcmodId = res.body[0].funcmodId; 
                 queryVideoId(funcmodId)
            }
        })
    };
	function queryVideoId(funcmodId) {
        var url ="/res/v1/app-func-layout/theme-infos";
        var data = {"layoutId":"wapFundDetail","funcModId":funcmodId,"objectId":App.getUrlParam("fundId")}
        App.post(url,JSON.stringify(data), null, function(res) {
            if (res.returnCode == 0 && res.body != undefined && res.body != null) {
                var themeList = res.body[0].object[0];
				if(App.isNotEmpty(themeList)){
					getVideoInfo(themeList.adviceRelateId);     
				}				
            }
        })
    };

    function getVideoInfo(id){
		var url ="/cms-service/v1/vedio/vedios-simple?videoIdList="+id+"&r=" + (new Date()).getTime();
		App.get(url, null, function(res) {
			if (res.returnCode == 0 && res.body != undefined && res.body != null) {
				var videoList= res.body[0];
				if(videoList.url==""){
					$(".bofangqi").hide()
					$("#video").hide();
				}else{
					$(".bofangqi").show()
					$("#video").show();
					$("#video_self").attr("src",videoList.url);
					$("#video_self").attr("poster",videoList.picture);
					$(".title").html(videoList.title)
					$(".play").html(videoList.hits+'次播放')
				}    
			}
		})
    }
    getThemeInfo();
    //视频信息
    // 点击视频显示控制器    
        $("#video_self").click(function(event) {
            $("#video_self").attr('controls', 'controls');
            $(".video_box").css('backgroundColor', '#fff');
            $(".title").hide()
            $(".play").hide()
        });
    // 点击播放器小图标显示视频    
        $(".bofangqi").click(function(){
            $("#video").show();
            $(".bofangqi").hide()
             $(".hidden").show()
        })
    // 收起和显示
        $(".hidden").click(function(){
            $("#video").hide();
            $(".bofangqi").show()
        })
    // 播放按钮    
        var Media = document.getElementById("video_self");
        $("#play_img").click(function(){
            Media.play(); //播放
            $("#play_img").hide()
            $(".title").hide()
            $(".play").hide()
        })
})
$("#kaishou_li").click(function(event) {
    /* Act on the event */
    addEvent();
});

//添加开售提醒
function addEvent(){
    // var url = App.projectNm +"/financial_calendar/add_custom_event";
    var url = "/mobile-bff/v1/financial-calendar/add-custom-event";
    var dataMap = {

   "eventContent": eventContent,

   "remindDate": sel_date.replace(/-/g,''),

   "remindTypes": "3",

   "eventTitle": eventTitle,

   "eventDate": sel_date.replace(/-/g,''),

   "osCalendarId":""
    };

$.ajax({
    url: url,
    data: JSON.stringify(dataMap),
    type: 'POST',
    contentType:'application/json;charset=utf-8',
    beforeSend:function(req){
        if(utils.getCookie('traceCode')){
            req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
        }
    },
    success: function (resultStr) {
            // result=JSON.parse(result);
            var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
            var data2 = result;
            var code = data2.returnCode;
            if(result.returnCode == "1000"){//重定向到登录页面
                var curUrl = window.location.href;
                loginUrl = "/tradeh5/newWap/auth/login_wap.html?referUrl=" + encodeURIComponent(curUrl);
                window.location = loginUrl;
            }else if (code == 0) {
                alertTips("提醒服务已开通,我们将在基金开售当天通过短信通知您");
            }else if (code == 10003) {
                // that.IsAward2=false;
            }else{
                alert(result.returnMsg);
            }
        },
        error: function () {
            // postFlag = false;
        }
    });
}

