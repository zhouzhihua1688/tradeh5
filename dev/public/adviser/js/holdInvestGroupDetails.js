// 20211124 从html移出

var level_list  = new Object();
var establishDateStr = "";
requestGroupFundDetail();

function showTips(tpnum){
  $('#tip'+tpnum).show();
}
// 暂时先不展示
if(!isApp()){
	$(".fgx").show();
	$(".footer_area").show();
}

$(function(){
  $(".list").on("click","",function(){
    if($(".tubiao").attr("src")==='img/icon02.png'){
      $(".taget").show()
      $(".tubiao").attr("src","img/select_up.png");
    }else{
      $(".tubiao").attr("src","img/select_up.png");
      $(".taget").hide()
      $(".tubiao").attr("src",'img/icon02.png')
    }
  })
})

/*弹框*/
/*关闭弹框*/
$('.layer .layer-wrap button').on("click",function () {
  $('.layer').hide();
  $(document.body).css({  "overflow":"auto"});
});
$("#tips").click(function(){
  $(".tip3").show();
});
$(".close_tip").click(function(){
  $(this).parents(".tip3").hide();
});
/* 跳转投顾公告列表 */
function goToAnnouncementList(groupId){
  // window.location.href=`/tradeh5/newWap/fundgroup/investNotice.html?groupId=${groupId}`
  var itemUrl = location.origin + `/tradeh5/newWap/fundgroup/investNotice.html?groupId=${groupId}`;
  if(isApp()){
    // window.location.href = 'htffundxjb://action?type=url&link='+btoa(location.origin+itemUrl);
    window.location.href = 'htffundxjb://action?type=url&link='+btoa(itemUrl);
  }else{
    window.location.href = itemUrl;
  }
}
// 跳转定期报告
function goToPeriodicReportList(balanceSerialNo){
  // window.location.href=`/tradeh5/newWap/fundgroup/investNotice.html?groupId=${groupId}`
  var itemUrl = location.origin + `/tradeh5/newWap/investGroup/investmentList/list.html?balanceSerialNo=${balanceSerialNo}`;
  if(isApp()){
    // window.location.href = 'htffundxjb://action?type=url&link='+btoa(location.origin+itemUrl);
    window.location.href = 'htffundxjb://action?type=url&link='+btoa(itemUrl);
  }else{
    window.location.href = itemUrl;
  }
}
/* 跳转投顾公告详情 */
function goToDetail(serialno) {
  // window.location.href = `/tradeh5/newWap/fundgroup/noticeDetail.html?serialno=${serialno}`
  var itemUrl = location.origin + `/tradeh5/newWap/fundgroup/noticeDetail.html?serialno=${serialno}`;
  if(isApp()){
    window.location.href = 'htffundxjb://action?type=url&link='+btoa(itemUrl);
    // window.location.href = 'htffundxjb://action?type=url&link='+btoa(location.origin+itemUrl);
  }else{
    window.location.href = itemUrl;
  }
  }
/* 获取投顾公告 */
function getAnnouncementList(){
  var groupId = utils.getUrlParam("groupId");
  var url=`/productcenter/v1/new/compose/fundgroup/single/announcement/collections?groupId=${groupId}&pageNo=1&pageSize=2`
  $.get(url, function(result){
        if(result.returnCode == 0 && result.body != undefined && result.body != null){
          var str='';
          if(result.body.resultTotalNum===0){
            // 20211220 投顾公告默认展示，标题修改为 信息披露
            // return	$('.invest_notice').hide();
            str = '<div>暂无重大事项披露，感谢您的关注。</div>'
            return $('.invest_notice').append(str);
          }
          result.body.announcementVOList.forEach(item=>{
            str+=`<div class="list_item" data-no='${item.serialno}'>${item.title}</div>`
          })
          if(result.body.resultTotalNum>2){
            str+=`<div class="more" onclick='goToAnnouncementList("${groupId}")'>更多公告</div>`
          }
          $('.invest_notice').append(str)
          $('.invest_notice .list_item').on('click',function(event){
            goToDetail(event.target.dataset.no)
          })
        }
      }
  );
}
// 20211220投顾公告不在此页面获取，点击直接跳转到投顾公告页面（信息披露页面）
// getAnnouncementList()
$('.invest_notice p img').parent().on('click', function () {
  var groupId = utils.getUrlParam("groupId");
  goToAnnouncementList(groupId);
})
$('.invest_report p img').parent().on('click', function () {
  var balanceSerialNo = utils.getUrlParam("balanceSerialNo");
  goToPeriodicReportList(balanceSerialNo);
})
var fundGroupCreateDate = "";
$(function(){
  $(".tab2 li").click(function (){
    if($(this).hasClass("active")) { return;}
    $(this).parents("ul").find("li").eq($(this).index()).addClass("active").siblings().removeClass('active');
    var value = $(this).val();
    if($('.tab_cg>li.active').attr('data') == 1){ // 当前选择收益走势
      queryCharts(value);
    }
    else { // 选择组合业绩
      switch(value)
      {
        case 1:
          queryCharts(1);
          break;
        case 2:
          queryCharts(9);
          break;
        case 3:
          queryCharts(2);
          break;
        case 4:
          queryCharts(3);
          break;
        case 6:
          queryCharts(4);
          break;
      }
    }
  });

  $(".tab_cg li").click(function (){
    $(".tab_cg li").removeClass('active');
    $(this).addClass('active');
    $(".tab2 li").removeClass('active')
    $(".tab2 li").eq(0).addClass('active')
    queryCharts(1);
  });

  var version = utils.getUrlParam("version");
  var groupId = utils.getUrlParam("groupId");
  queryReportData(groupId);
  if(groupId == 'A0081'){
    window.location.href = 'holdGroupFundDetailsXJJ.html?groupId=' + groupId + "&balanceSerialNo=" + utils.getUrlParam("balanceSerialNo") + "&version=" + version;
  } else {
    //  vrayInvestmentPlan();
    //queryYields();
    queryCharts("1");
    // queryRecommendInfo();//调仓陪伴位
  }
  $('tcReward').click(function(){
    window.location.href="#"
  })
});

$(".div-jump").click(function () {
  if(isApp()){
    window.location.href = "htffundxjb://action?type=url&link=" + btoa("https://activity.99fund.com/activity-center/act-resources/pages/202002xiaoquexingpeiban/index.html");
  } else {
    window.location.href = "https://activity.99fund.com/activity-center/act-resources/pages/202002xiaoquexingpeiban/index.html";
  }
});
var sDate = '';
var eDate = '';
var intervalValue = 0;
var option_1 = {
  color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
  tooltip : { show: true, trigger: 'axis',
    axisPointer: {
      type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
    },
    position:["20%", "2%"],alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
    formatter: function(params){
      var arr = [];
      var _date = params[0].axisValue.split('-');
      arr.push('<div style="width: 100%;font-size: .6rem;padding-bottom:1rem;margin-top: -0.4rem;"><div style="display:inline-block;width:20%;"><span>日期</span><span style="display:block;">'+_date[1]+'.'+_date[2]+'</span></div>')
      var qjsy = utils.formatMoney(String(params[0].data),2);
      for(var i=0; i< params.length; i++){
        //console.log(params[i].seriesName);
        switch (params[i].seriesName){
          case "区间收益":
            arr.push('<div style="display:inline-block;width:30%;margin-left:1.2rem;"><span class="icon icon-1"  style="width:.5rem;height:.1rem;background-color:#148ce6;display:inline-block;margin-top:-0.2rem;vertical-align:middle;margin-right:.2rem;"></span>');
            if(qjsy.indexOf('-') == -1){
              arr.push("<span>" + params[i].seriesName + "</span> <span style='color:#fb5c5f;display:block;text-indent:.7rem;'>" +utils.formatMoney(String(params[0].data),2) + "</span></div>");
            }else{
              arr.push("<span>" + params[i].seriesName + "</span>  <span style='color:#009944;display:block;text-indent:.7rem;'>" +utils.formatMoney(String(params[0].data),2) + "</span></div>");
            }
            break;
          case "资产":
            arr.push('<div style="display:inline-block;width:30%;margin-left:1.8rem;"> <span class="icon icon-4"  style="width:.5rem;height:.1rem;background-color:#fb5c5f;display:inline-block;margin-top:-0.2rem;vertical-align:middle;margin-right:.2rem;"></span>');
            arr.push("<span>" + params[i].seriesName + "</span>  <span style='display:block;text-indent:.7rem;'>" +utils.formatMoney(!!(params[i].data) ? String(params[i].data) : "0",2) + "</span></div>");
            break;
        }
        //arr.push(params[i].seriesName + ": <span style='color:#fb5c5f'>" +utils.formatMoney(String(params[i].data),2) + "</span>");
      }
      arr.push("</div>");
      return arr.join("");
    }
    //' <div style="width: 100%;margin-left: -50%;font-size: 14px;"><span class="icon icon-1"></span> {a0}: {c0}% &nbsp;&nbsp; <span class="icon icon-3"> </span>{a1}: {c1}%</div>'
  },
  grid: {left: '5%', right: '5%', bottom: '0%', top: "20%", containLabel: true },
  xAxis : [
    {
      type : 'category',
      boundaryGap : false,
      axisTick: {show: false},
      splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
      axisLine:{show: true, lineStyle:{color:"#a5a5a5"}},
      axisLabel: {interval: 30,textStyle: {color: "#999999",fontSize:10}, formatter: function(value, index){
          if(index ==0){ return "                             " + value; }
          return value + "          ";
        }
      },
      data : []
    }
  ],
  yAxis : [
    {
      type : 'value',
      axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
      axisTick: {show: false},
      splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
      axisLabel: {  show: true, inside: true,formatter: function(value){return toDecimal(value);} ,textStyle: {color: "#999999",fontSize:10}},
      axisPointer: {show:false/*  , label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} */ },
      z:999,

      min:'dataMin',
      max:'dataMax',
        
    },
    {
      type : 'value',
      axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
      axisTick: {show: false},
      splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
      axisLabel: {  show: true,inside: true,formatter: function(value){return toDecimal(value);} ,textStyle: {color: "#999999",fontSize:10}},
      axisPointer: {show:false/*  , label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} */ },
      z:999, 
      // scale:true,


      min:'dataMin',
      max:'dataMax',
    },
  ],
  series : [
    {
      symbol: "none",
      name:'区间收益', 
      type:'line', 
      smooth: true,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0, color: 'rgba(251,208,209,0.3)' // 0% 处的颜色
          }, {
            offset: 1, color: '#fff' // 100% 处的颜色
          }], false)
        }
      },
      lineStyle: {
        normal: {
          color: "#1aa2e6",
          width:1
        }
      },
      yAxisIndex: 0,
      z:999,
      data: []
    },
    {
      symbol: "none",
      name:'资产',
      type:'line',
      smooth: true,
      showSymbol: false,
      hoverAnimation: false,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0, color: 'rgba(251,208,209,0.3)' // 0% 处的颜色
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
      yAxisIndex: 1,
      z:999,
      data: []
    }
  ]

};
var option_1_2 = {
  color: ['#fb5c5f','#89acd8', '#f11', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
  tooltip : { show: true, trigger: 'axis',
    axisPointer: {
      type: 'cross', label: {  backgroundColor: 'rgba(0,0,0,0)',textStyle: {color: "red"} }, lineStyle: {type:"dashed", color: "#1aa2e6" }
    },
    position:["30%", "5%"],
    alwaysShowContent: true , backgroundColor: "rgba(0,0,0,0)", textStyle:{ color: "#333"},
    formatter: function(params){
      var arr = [];
      arr.push('<div style="width: 100%;font-size: .6rem;text-align: center;color: #666;">'+params[0].axisValue+'<span style="margin-left: 0.2rem;">组合业绩</span><span style="color: ' + (params[0].data >= 0 ? '#F4333C' : '#009944') + ';">' + params[0].data + '%</span></div>');
      return arr.join("");
    }
  },
  // grid: {left: '5%', right: '5%', bottom: '0%', top: "20%", containLabel: true },
  xAxis : [
    {
      type : 'category',
      boundaryGap : false,
      axisTick: {show: false},
      splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
      axisLine:{show: true, lineStyle:{color:"#a5a5a5"}},
      axisLabel: {interval: 30,textStyle: {color: "#999999",fontSize:10}, formatter: function(value, index){
          if(index ==0){ return "   " + value; }
          return value + "          ";
        }
      },
      data : []
    }
  ],
  yAxis : [
    {
      type : 'value',
      axisLine:{show: true, lineStyle:{color:"f1f1f1"}},
      axisTick: {show: false},
      splitLine:{ show: true, lineStyle: { color: "#f1f1f1"} },
      axisLabel: {  show: true,    formatter: function(value){return toDecimal(value) + '%';} ,textStyle: {color: "#999999",fontSize:10}},
      axisPointer: {show:false/*  , label: {show:false},lineStyle: {type: "solid",color: "#1aa2e6"} */ },
    }
  ],
  series : [
    {
      symbol: "none", name:'区间收益', type:'line', smooth: true,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0, color: '#e8f4fd' // 0% 处的颜色
          }, {
            offset: 1, color: '#fff' // 100% 处的颜色
          }], false)
        }
      },
      lineStyle: {
        normal: {
          color: "#1aa2e6",
          width:1
        }
      },
      data: []
    }
  ]
};
function formatMoney (num, scaleNum) {
  if(num == undefined || num == null || num == ''){
    return "0.00";
  } else if (num == "--" || num == "-"){
    return "--";
  }
  if(scaleNum == undefined || scaleNum == null){
    scaleNum = 2;
  }
  var numberStr = String(num).replace(/,/g, "");
  //金额转换 分->元 保留2位小数 并每隔3位用逗号分开 1,234.56
  var str = Number(numberStr).toFixed(scaleNum) + '';
  var intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
  var dot = str.substring(str.length,str.indexOf("."))//取到小数部分搜索
  var ret = intSum + dot;
  return ret;
}

function draw(myChart, option){
  if( !((option.series[0].data && option.series[0].data.length>0) ||  (option.series[1].data && option.series[1].data.length>0))){
    option.xAxis[0].data = ["",""];
    option.xAxis[0].axisLabel.interval = ["",""].length-2;
    $(".noData").show();
  }else{
    $(".noData").hide();
  }
  myChart.setOption(option);
}

//制保留2位小数，如：2，会在2后面补上00.即2.00
function toDecimal(x) {
  var f = parseFloat(x);
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
  }
  return s;
}
// 更多
var onoff=true;
var version = utils.getUrlParam("version");
function queryYields(dataList, isInvestment){
  var groupId = utils.getUrlParam("groupId");
  var balanceSerialNo = utils.getUrlParam("balanceSerialNo");
  $.get("/mobile-bff/v1/fund-group/hold/detailInfo?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo + "&isInvestment=" + isInvestment, function(data){
    // console.log(data);
    //alert("测试组合持有页面显示有时为空白问题，请不要提BUG： returnCode>>" + data.returnCode);
    if(data.returnCode == 0){
      // 20220329 新增投顾月报/季报 S
      if(data.body && data.body.existReport){
        reportRoutine = {};
        reportRoutine.existReport = data.body.existReport;  //是否存在最新报表
        reportRoutine.monthlyReportDate = data.body.monthlyReportDate;  //月报月份（yyyyMM），报表类型为月报时下发
        reportRoutine.reportName = data.body.reportName;  //报表名称
        reportRoutine.reportType = data.body.reportType;  //报表类型: 1-月报; 2-季报 ,
        reportRoutine.reportUrl = data.body.reportUrl;  //报表url地址
        reportRoutine.reportSerialNo = data.body.reportSerialNo;  //报表编号
        reportRoutine.updateDate = data.body.updateDate;  //报表更新日期（yyyyMMdd）

        $('.report_routine').show();
        $('.report_routine .new_report_name').text(reportRoutine.reportName);
        $('.report_routine .new_report_date').text(reportRoutine.updateDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3'));
        $('.report_routine').on('click',function(){
          var targetUrl = reportRoutine.reportUrl;
          if(reportRoutine.reportType == '1'){
            // 投顾月报
            if(targetUrl.indexOf('yearMonth') == -1){
              targetUrl += ((targetUrl.indexOf('?') == -1)?'?':'&');
              targetUrl += 'yearMonth=' + reportRoutine.monthlyReportDate;
            } else {
              // 跳转url上已有yearMonth，不再处理
            }
          } else if(reportRoutine.reportType == '2'){
            // 投顾季报
            targetUrl += ((targetUrl.indexOf('?') == -1)?'?':'&');
            targetUrl = targetUrl + 'serialNo=' + reportRoutine.reportSerialNo + "&balanceSerialNo=" + utils.getUrlParam("balanceSerialNo");
          }
          console.log('targetUrl=', targetUrl);
          if(isApp()){
            window.location.href = "htffundxjb://action?type=url&link="+btoa(targetUrl);
          } else {
            window.location.href = targetUrl;
          }
        })
      }
      // 20220329 新增投顾月报/季报 E
      var fundGroupType = data.body.fundGroupType;
      var arAcct = data.body.arAcct;
      var holdGroupInfo = data.body.holdGroupInfo;
      $("#marketValue").html(holdGroupInfo.holdingAsset);
      $("#holdingYield").html(holdGroupInfo.holdingYield+"%");
      var totalProfit = holdGroupInfo.totalProfit;
      if(totalProfit.indexOf('-') > -1){//负值
        $("#totalProfit").removeClass("red").addClass("green").html(totalProfit);
      }else{
        $("#totalProfit").html(totalProfit);
      }
      $("#holdingCost").html(holdGroupInfo.holdingCost);
      $("#income").html(holdGroupInfo.income);
      if(!!(holdGroupInfo.incomeDate)){
        $("#income_dt").html( holdGroupInfo.incomeDate.substr(-4,2) + '.' +  holdGroupInfo.incomeDate.substr(-2,2));
      }else{
        $("#income_dt").html("--");
      }
      if(!!(data.body.profitUpdating)){
        $("#income_title").html(data.body.profitUpdating);
      }
      $("#holdingProfit").html(holdGroupInfo.holdingProfit);

      var groupYieldRate = holdGroupInfo.groupYieldRate;
      if(groupYieldRate.indexOf('-') > -1){//负值
        $("#groupYieldRate").removeClass("red").addClass("green").html(holdGroupInfo.groupYieldRate+"%");
      }else{
        $("#groupYieldRate").html(holdGroupInfo.groupYieldRate+"%");
      }
      var holdingAsset = holdGroupInfo.holdingAsset.replace(/,/g, '');
      if(Number(holdingAsset) < 0) {
        $("#marketValue").removeClass("red");
        $("#marketValue").addClass("green");
      }
      var hYield = holdGroupInfo.holdingYield.replace('%', '');
      if(Number(hYield) < 0) {
        $("#holdingYield").removeClass("red");
        $("#holdingYield").addClass("green");
      }
      var tProfit = holdGroupInfo.totalProfit.replace(/,/g, '');
      if(Number(tProfit) < 0) {
        $("#totalProfit").removeClass("red");
        $("#totalProfit").addClass("green");
      }
      var income = holdGroupInfo.income.replace(/,/g, '');
      if(Number(income) < 0) {
        $("#income").removeClass("red");
        $("#income").addClass("green");
      }
      var holdingCost = holdGroupInfo.holdingCost.replace(',', '');
      if(Number(holdingCost) < 0) {
        $("#holdingCost").removeClass("red");
        $("#holdingCost").addClass("green");
      }
      var holdingProfit = holdGroupInfo.holdingProfit.replace(/,/g, '');
      if(Number(holdingProfit) < 0) {
        $("#holdingProfit").removeClass("red");
        $("#holdingProfit").addClass("green");
      }
      fundGroupCreateDate = data.body.creataDate;
      //console.log("createDate:", data.body.creataDate);
      //查看更多按钮
      $("#tabMore").on("click", function(){
        var more_data = $(this).attr("data");
        // console.log(more_data);
        if(more_data == "3"){
          if(isApp()){
            window.location.href = "htffundxjb://action?type=tq&subType=adviserService&productId=" + holdGroupInfo.groupid
                +"&tradeType=&arAcct=" + arAcct+"&balanceSerialNo="+utils.getUrlParam("balanceSerialNo");
          } else {
            window.location.href = "/mobileEC/wap/trade/tradeList.html?arAcct="+arAcct+"&productId="+holdGroupInfo.groupid+"&branchNo=247"
          }

        }else  if(more_data == "2"){
          if(isApp()){
            window.location.href = "htffundxjb://action?type=tq&subType=adviserService&productId=" + holdGroupInfo.groupid
                +"&tradeType=4&arAcct=" + arAcct;
          } else {
            window.location.href = "/mobileEC/wap/trade/tradeList.html?tradeType=4&arAcct="+arAcct+"&productId="+holdGroupInfo.groupid+"&branchNo=247"
          }
        }
      });
      if(data.body.unConfirmedCount > 0){
        $("#trade_count").html(data.body.unConfirmedCount);
      }else{
        $("#trade_count_a").hide();
      }
      //组装分类数据
      var fundGDetails = holdGroupInfo.fundGroupDetails;
      if(fundGDetails.length > 0){ // ias系统下发了fundGDetails
        var listHtml = "";
        for(var i=0; i<fundGDetails.length; i++){
          var fundGInfo = fundGDetails[i];
          var profit = fundGInfo.profit;
          var holdingYield = fundGInfo.holdingYield;
          var holdingYieldRate = fundGInfo.holdingYieldRate;
          var profitDate = fundGInfo.profitDate;
          if(profit.indexOf('-') == -1){
            profit = "+"+utils.formatMoney(profit,2);
          }else{
            profit = utils.formatMoney(profit,2);
          }
          if(String(holdingYield).indexOf('-') == -1){
            holdingYield  = "+"+utils.formatMoney(String(holdingYield),2);
          }else{
            holdingYield = utils.formatMoney(String(holdingYield),2);
          }
          if(String(holdingYieldRate).indexOf('-') == -1){
            holdingYieldRate  = "+"+holdingYieldRate  ;
          }
          var profitDt='';
          if(!!(profitDate)){
            profitDt = profitDate.substr(4,2)+"."+profitDate.substr(6,2);
          }
          var clss = colorList2[fundGInfo.fundGroupTp];
          if(clss == undefined){
            clss = '#68B0EA';
          }

          //根据状态显示对应的标签
          var dealtags = '';
          if(!!(fundGInfo.fundStatusName) && !!(fundGInfo.fundTradeStName)){
            dealtags = (!(fundGInfo.fundStatusName)  ? "" : "<br/><i class='deal'>"+ fundGInfo.fundStatusName +"</i>")
                + (!(fundGInfo.fundTradeStName)  ? "" : "<i class='deal' >" + fundGInfo.fundTradeStName + "</i>");
          }else if(!!(fundGInfo.fundStatusName) && !(fundGInfo.fundTradeStName)){
            dealtags = (!(fundGInfo.fundStatusName)  ? "" : "<br/><i class='deal'>"+ fundGInfo.fundStatusName +"</i>");
          }else if(!(fundGInfo.fundStatusName) && !!(fundGInfo.fundTradeStName)){
            dealtags =(!(fundGInfo.fundTradeStName)  ? "" : "<br/><i class='deal' >" + fundGInfo.fundTradeStName + "</i>");
          }
          listHtml+= '<div class="jijin" style="clear:both">'
              +'<div class="first" onclick="forwardFundDetailPage(\''+ fundGInfo.fundId + '\','+fundGInfo.proxyFund+',\''+ fundGInfo.fundCompanyFlag + '\')"><span style="background-color:'+clss+'"></span>'+ fundGInfo.fundName
              + dealtags
              +'</div>'
              +'<div class="second">'+ fundGInfo.percent +'%</div>'
              +'<div class="third">'+ utils.formatMoney(fundGInfo.marketvalue,2) +'<img src="img/imgDown.png" alt="" class="tubiao"></div>'
              +'<div class="taget" style="display:none">'
              +'<div class="list_more">  '
              +'<div class="one">('+profitDt+')日收益 '+'<span style="color:#000">'+profit+'</span>'+'</div>'
              +'<div class="two" style="float:right">持有份额 '+'<span style="color:#000">'+fundGInfo.holdBalance+'</span>' +'</div>'
              //+'<div class="two" style="float:right">持有收益 '+'<span style="color:#000">'+holdingYield +'</span>'+'</div>'
              +'</div>'
              //+'<div class="list_more">  '
              //+'   <div class="one">持有收益率 '+'<span style="color:#000">'+holdingYieldRate +'%</span>'+'</div>'
              //+'   <div class="two" style="float:right">持有份额 '+'<span style="color:#000">'+fundGInfo.holdBalance+'</span>' +'</div>'
              //+'</div>'
              +'</div></div>';

          if(fundGInfo.fundTradeStName == "处理中" || Number(fundGInfo.dividendCount) > 0) bool = true;
        }
        $("#jijin_list").html(listHtml);
        $(".jijin").on("click",function(){
          if($(this).children("div").children("img").attr("src")==='img/imgDown.png'){
            $(this).children("div").show()
            $(this).children("div").children("img").attr("src","img/imgUp.png");
          }else{
            $(this).children("div:last").hide()
            $(this).children("div").children("img").attr("src",'img/imgDown.png')
          }

        })
        //渲染最新成份饼图
        dataList.forEach(function(item, index){
          var total_per = 0;
          for(var i=0; i<fundGDetails.length; i++){
            var fundGInfo = fundGDetails[i];
            if(fundGInfo.fundGroupTp == item.fundId){
              total_per = Number(total_per) + Number(fundGInfo.percent);
            }
          }
          if(Number(total_per) > 0){
            item.value = utils.formatMoney(String(total_per),2);
          }
        });
        // console.log(dataList);
        var fund_list_html = "";
        var tab2_html = "";
        var temp_index = 0;
        dataList.forEach(function(item, index){
          if(item.value > 0){
            fund_list_html += '<li>';
            var col = item.color;
            var cls = "";
            if(temp_index == 0) cls = "";
            fund_list_html += '<span class="pieEle '+cls+'" data-fundId="'+ item.fundId +'" data-fundNm = "'+ item.name +'"><i style="background-color: '+ item.color +'"></i>'+ item.name +'&nbsp;&nbsp;<span style="color:#000000">占比'+ item.value +'%</span></span>';

            fund_list_html += '</li>';

            var isActive = "";
            if(temp_index == 0) isActive = "";
            tab2_html += '<li class="'+isActive+'" data-fundId="'+ item.fundId +'" data-fundNm = "'+ item.name +'"><a>'+ item.name.substr(3,4) +'</a></li>';
            temp_index++;
          }
        });
        $('.fund-tab-btn').html(tab2_html);
        var myChart_2 = echarts.init(document.getElementById('pie2'));
        option_2.series[0].data = dataList;
        myChart_2.setOption(option_2);
        $(".fund-list").html(fund_list_html);
        if(temp_index == 1){
          $(".fund-list").css({"top":"3.5rem"});
        }else if(temp_index == 2){
          $(".fund-list").css({"top":"3rem"});
        }else if(temp_index == 3){
          $(".fund-list").css({"top":"2.35rem"});
        }else if(temp_index == 4){
          $(".fund-list").css({"top":"1.85rem"});
        }
      }
      else { // ias未下发,按照管理型投顾组合处理,取custBar字段
        if(data.body.custBar.length > 0){
          var fundTypeArr = ['R', 'F', 'V', 'O']; // R--权益类 F--固收类 V-货币 O--其他
          var echartsPieData = data.body.custBar.map(function (custBarValue, custBarIndex) {
            var filterItem = dataList.filter(function(item){return item.fundId === fundTypeArr[custBarIndex];})[0];
            return {
              fundId: fundTypeArr[custBarIndex],
              value: custBarValue,
              name: filterItem.name,
              color: filterItem.color
            };
          });
          var fund_list_html = "";
          var tab2_html = "";
          var temp_index = 0;
          echartsPieData.forEach(function(item){
            if(item.value > 0){
              fund_list_html += '<li>';
              var cls = "";
              if(temp_index == 0) cls = "";
              fund_list_html += '<span class="pieEle '+cls+'" data-fundId="'+ item.fundId +'" data-fundNm = "'+ item.name +'"><i style="background-color: '+ item.color +'"></i>'+ item.name +'&nbsp;&nbsp;<span style="color:#000000">占比'+ item.value +'%</span></span>';
              fund_list_html += '</li>';
              var isActive = "";
              if(temp_index == 0) isActive = "";
              tab2_html += '<li class="'+isActive+'" data-fundId="'+ item.fundId +'" data-fundNm = "'+ item.name +'"><a>'+ item.name.substr(3,4) +'</a></li>';
              temp_index++;
            }
          });
          var myChart_2 = echarts.init(document.getElementById('pie2'));
          option_2.series[0].data = echartsPieData;
          myChart_2.setOption(option_2);
          $(".fund-list").html(fund_list_html);
          if(temp_index == 1){
            $(".fund-list").css({"top":"3.5rem"});
          }else if(temp_index == 2){
            $(".fund-list").css({"top":"3rem"});
          }else if(temp_index == 3){
            $(".fund-list").css({"top":"2.35rem"});
          }else if(temp_index == 4){
            $(".fund-list").css({"top":"1.85rem"});
        }
      }
      }
      //setTimeout(function () { assembleData(data) },800);
      //交易记录
      queryTradeList(arAcct);
      queryFenList(arAcct);
      investBtn(arAcct);    //追加，定投20211126    
      // 偏离度
      $('#irrelevanceStr').html(data.body.irrelevanceStr+'%');
      $('#checkDeg').click(function(){
        $('#tip4').show()
      })
    }else if(data.returnCode == 1000){//
      layerShow3();
    }
  });
}


function queryRecommendInfo(){
  var balanceSerialNo = utils.getUrlParam("balanceSerialNo");
  var url = "/mobile-bff/v1/fund-group/fundgroupHoldInfo?productType=1&balanceSerialNo="+balanceSerialNo+"&productId="+utils.getUrlParam("groupId");
  $.get(url, function(result){
        if(result.returnCode == 0 && result.body != undefined && result.body != null){
          var html = '';
          var item = result.body;
          if(!!(item.infoTitle)){
            var infoTitle = item.infoTitle.length > 20 ? item.infoTitle.substr(0,20) + '...' : item.infoTitle;
            html += '<li class="jingzhi div-jump list" style=" margin-top: 0.01rem;" onclick="visit(\''+item.infoJumpUrl+'\')">'
                +'	<p><img src="./img/sound.png" alt="" style="margin-right: .45rem;"><span >'+infoTitle+'</span></p>'
                +'	<img class="right_1" src="./img/icon02.png">'
                +'</li>';
          }
          $(".content0 .wrap").html(html);
          if(html.length > 0){
            $(".content0").show();
            if($('.content0 .wrap .list').length>1){
              scroll();
            }
          }
        }
      }
  );

}

function visit(url){
  window.location.href = url;
}

function scroll() {
  $(".content0 .wrap .list:eq(0)").animate({ "margin-top": "-2.5rem" },1000, function () {
    $(".content0 .wrap .list:eq(0)").appendTo($(".content0 .wrap"));
    $(".content0 .wrap .list:last").css({ "margin-top": '0' });
  })
  setTimeout(scroll, 4000)
}
function queryCharts(queryTp){//持有收益数据
  var balanceSerialNo = utils.getUrlParam("balanceSerialNo");
  var groupId = utils.getUrlParam("groupId");
  if($('.tab_cg>li.active').attr('data') == 1){ // 当前选择收益走势
    var url = "/ias/v1/charts/total-incomes?groupId=" + groupId + "&queryTp=" + queryTp + "&balanceSerialNo=" + balanceSerialNo;
    // var url = "/fundgroup/v1/trader/query-cust-total-income-graph?groupId=" + utils.getUrlParam("groupId")
    // 		+"&queryTp="+ queryTp
    // 		+"&balanceSerialno="+balanceSerialNo;
    $.get(url, function(data){
      //console.log("result:", data);
      if(data.returnCode == 0){
        //	累计盈亏
        var totalIncomes = data.body.chartData;
        // var totalIncomes = data.body.incomes;
        if(totalIncomes.length > 0){
          // 20220506紧急上线，区间收益使用intervalYield  S
          // intervalValue = totalIncomes[0].chartNum;  
          intervalValue = totalIncomes[0].intervalYield;
          // 20220506紧急上线，区间收益使用intervalYield  E
          $('#pie1').show();
          getAssetCharts(queryTp,totalIncomes)
        } else {
          $('#pie1').hide();
          $(".noData").show();
        }
      }
    });
  }
  // else { // 当前选择组合业绩
  //   var url = "/mobileEC/services/adviser/query_fund_group_yields?groupId=" + groupId + "&chartTp=0,1,4&queryTp=" + queryTp + "&createDt=" + establishDateStr + "&t=" + new Date().getTime();
  //   $.get(url, function(data){
  //     var result = typeof data === 'string' ? JSON.parse(data) : data;
  //     if(result.returnCode == 0){
  //       var syList = result.body.syList;
  //       var hs300List = result.body.hs300List;
  //       var mixList = result.body.mixList;
  //       hs300List.length = syList.length;
  //       mixList.length = syList.length;
  //       if(syList.length > 0){
  //         $('#pie1').show();
  //         myChart_1_2 = echarts.init(document.getElementById('pie1'));
  //         var result1 =  formattingIncomes1_1(syList);
  //         option_1_2.xAxis[0].data = result1.xArr;
  //         option_1_2.xAxis[0].axisLabel.interval = result1.xArr.length-2;
  //         option_1_2.series[0].data = result1.yArr;
  //         draw(myChart_1_2,option_1_2);
  //         myChart_1_2.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: result1.xArr.length - 1});
  //         myChart_1_2.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: -1});
  //       } else {
  //         $('#pie1').hide();
  //         $(".noData").show();
  //       }
  //     }
  //   });
  // }

}
function getAssetCharts(queryTp,totalIncomes){

  var balanceSerialNo = utils.getUrlParam("balanceSerialNo");
  var groupId = utils.getUrlParam("groupId");
  $.get("/ias/v1/charts/assets?groupId=" + groupId + "&queryTp=" + queryTp + "&balanceSerialNo=" + balanceSerialNo + "&t=" + new Date().getTime(), function(result){
    //console.log("result:", data);
    if(result.returnCode == 0){
      //	累计盈亏
      var totalIncomes2 = result.body.chartData;
      myChart_1 = echarts.init(document.getElementById('pie1'));
      var seriesIndex = 0;
      var num = 1;
      if(totalIncomes2.length>0){ 
       
        seriesIndex = 0;
        num = totalIncomes2.length - 1;
        setOptionForTwo(option_1, totalIncomes,totalIncomes2);
        setOptionMaxAndInterval(option_1,totalIncomes,totalIncomes2)
        draw(myChart_1,option_1);
      }
     
      $("#profitChart").show();
      myChart_1.dispatchAction({ type: 'showTip', seriesIndex: seriesIndex, dataIndex:num });
      myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:-1 });
    }else{
      myChart_1 = echarts.init(document.getElementById('pie1'));
      
      setOptionForTwo(option_1, totalIncomes,'');
      draw(myChart_1,option_1);
      var seriesIndex = 0;
      var num = 1;
      if(totalIncomes.length > 0){
        seriesIndex = 0;
        num = totalIncomes.length - 1;
      }
      $("#profitChart").show();
      myChart_1.dispatchAction({ type: 'showTip', seriesIndex: seriesIndex, dataIndex:num });
      myChart_1.dispatchAction({ type: 'showTip', seriesIndex: 1, dataIndex:-1 });
    }
    var options = myChart_1.getOption();
    console.log('1111111',options.yAxis[0].max,options.yAxis[0].min)
    console.log('2222222',options.yAxis[1].max,options.yAxis[1].min)
    // option_1.yAxis[1].max=1.25*(option_1.yAxis[1].max)
    // option_1.yAxis[0].max=1.25*(option_1.yAxis[0].max)
    // option_1.yAxis[1].min=-0.33*( options.yAxis[1].max)
    // option_1.yAxis[0].min=-0.33*( options.yAxis[0].max)
   myChart_1.setOption(option_1)
  });
}


//两条线走势图设置开始
function setOptionForTwo(option, incomes1, incomes2){
  var result1 =  formattingIncomes1(incomes1);
  var result2 =  formattingIncomes(incomes2);
  option.xAxis[0].data = result1.xArr;
  option.xAxis[0].axisLabel.interval = result1.xArr.length-2;
  option.series[0].data = result1.yArr;
  option.series[1].data = result2.yArr;

}
// 设置双y轴的最大值与双Y轴刻度比例
function setOptionMaxAndInterval(option, incomes1, incomes2){
  var result1 = formattingIncomes1(incomes1).yArr;//收益区间
  var result2 = formattingIncomes(incomes2).yArr;//总资产
  // 设置最大分割数
  // var splitNumber = 6;
  var splitNumber = 6;
  // 两个Data中的最大值
  // var resultMax1 = Math.max(...result1)*1.2;
  // var resultMax1 = Math.max(...result1)*1.2;
  var resultMax1 = Math.max(...result1)+(Math.max(...result1)-Math.min(...result1))/2;
  var resultMax2 = Math.max(...result2)+(Math.max(...result2)-Math.min(...result2))/2;
  // 两个Data中的最小值
  // var resultMin1 = Math.min(...result1)>=0?(Math.min(...result1)/1.2):(Math.min(...result1)*1.2);
  var resultMin1 = Math.min(...result1)-(Math.max(...result1)-Math.min(...result1))/2;
  var resultMin2 = Math.min(...result2)-(Math.max(...result2)-Math.min(...result2))/2;
  // var resultMin2 = 0;
  // 设置坐标轴分割间隔
  var interval1 = resultMin1>=0?(resultMax1-resultMin1)/splitNumber:(resultMax1+Math.abs(resultMin1))/splitNumber;
  var interval2 =  resultMax2/splitNumber;
  console.log(interval1,interval2);
  option.yAxis[0].max = resultMax1;
  option.yAxis[1].max = resultMax2;
  option.yAxis[0].min = resultMin1;
  option.yAxis[1].min = resultMin2;
  option.yAxis[0].interval = interval1;
  option.yAxis[1].interval = interval2;
}
function formattingIncomes1_1(incomes){
  var xArr = [], yArr = [];
  //incomes.shift();
  var len = incomes.length;
  for (var i = 0; i < len; i++) {
    var chartDt = incomes[i].chartDt;
    //console.log(chartDt);
    xArr.push("      "+chartDt.substr(0,4) + "." + chartDt.substr(-4,2) + "." + chartDt.substr(-2,2) + "                ");
    yArr.push(!!(incomes[i].chartNum) ?incomes[i].chartNum :0);
  }
  return {xArr: xArr, yArr: yArr};
}

// 20220506紧急上线，区间收益使用intervalYield
function formattingIncomes1(incomes){
  var xArr = [], yArr = [];
  //incomes.shift();
  var len = incomes.length;
  for (var i = 0; i < len; i++) {
    var chartDt = incomes[i].chartDt;
    //console.log(chartDt);
    xArr.push("      "+chartDt.substr(0,4) + "-" + chartDt.substr(-4,2) + "-" + chartDt.substr(-2,2) + "                ");
    // 20220506紧急上线，区间收益使用intervalYield  S
    // yArr.push(!!(incomes[i].chartNum) ?incomes[i].chartNum :0);
    yArr.push(!!(incomes[i].intervalYield) ?incomes[i].intervalYield :0);
    // 20220506紧急上线，区间收益使用intervalYield  E
  }
  return {xArr: xArr, yArr: yArr};
}

// 20220506紧急上线，备注，这里总资产还是用chartNum
function formattingIncomes(incomes){
  var xArr = [], yArr = [];
//        incomes.shift();
  var len = incomes.length;
  for (var i = 0; i < len; i++) {
    var chartDt = incomes[i].chartDt;
    //console.log(chartDt);
    xArr.push("      "+chartDt.substr(0,4) + "-" + chartDt.substr(-4,2) + "-" + chartDt.substr(-2,2) + "                ");
    yArr.push(!!(incomes[i].chartNum) ?incomes[i].chartNum :0);
  }
  return {xArr: xArr, yArr: yArr};
}

function fmtDate(s){
  return s.substr(0,4)+"."+s.substr(4,2)+"."+s.substr(6,2);

}
function forwardFundDetailPage(fundId,proxyFund,fundCompanyFlag) {
  if (fundCompanyFlag&&fundCompanyFlag =='2') {  //1-本公司基金,2其他公司基金
      utils.showTips({
          content: '外部基金暂不支持查看详情',
          showCancel: false, //是否显示取消按钮，默认false
          confirmText: '我知道了', //确认按钮文字，默认确定
          complete: function () { //需使用bind()
          }.bind(this)
      });
      return;
  }
  if(!proxyFund){
    window.location.href = "htffundxjb://action?type=fd&fundId=" + fundId;
  }
}

//格式化输出日期
function fmtDate2(s){
  return s.substr(0,4)+"-"+s.substr(4,2)+"-"+s.substr(6,2);
};
//更新日期
$("#jzrq").html("截至"+getNowDate());

function compareDate(t1,t2){
  var oDate1 = new Date(t1);
  var oDate2 = new Date(t2);
  if(oDate1.getTime() > oDate2.getTime()){
    return true;
  }else{
    return false;
  }
}
var option_2_color = ['#5c74cd', '#ee6f6f', '#fda985', '#feda77', '#76dde1', '#68b0ea'];
var option_2 = {
  color: option_2_color,

  tooltip: {
    show: true, trigger: 'item',
    position: ["42.5%", "41.5%"], alwaysShowContent: true, backgroundColor: "rgba(0,0,0,0)", textStyle: { color: "#333" },
    //    formatter: ' <div style="width: 100%;margin-left: -50%;font-size: 14px;">{a0}: <span style="color:#f4333c">{c0}%</span></div>'
    formatter: function (item) {
      // var itmedata1 = itme[0].data + '%';
      // var itmedata2 = itme[1].data + '%';
      //	  return "<div><p style='font-size:.6rem'>跟投人次</p><h2 class='followNum' style='text-align:center;font-weight:900;font-size:.8rem;'>"+ gentouNumber +"</h2></div>";
    },
  },
  legend:{
    selectedMode:false,
  },
  series: [
    {
      // name: '访问来源',
      type: 'pie',
      radius: ['39%', '59%'],
      center: ['50%', '50%'],
      hoverAnimation: false,
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'outside',
          formatter: function (item) {
            var strs = item.data.name + ' ' + item.percent + '%'
            strs = strs.split(''); //字符串数组
            var str = ''
            for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
              str += s;
              if (!(i % 7)) str += '\n'; //按需要求余
            }
            return str
          }
          // rotate:90,

        }
        // emphasis: {
        // 	show: true,
        // 	textStyle: {
        // 		fontSize: '11',
        // 		// fontWeight: 'bold',
        // 	}
        // }
      },
      labelLine: {
        normal: {
          length: 24,
          length2: 0,
        }
      },
      data: []
    }
  ]
};
/**
 * 获取标准基础信息
 * */
  var colorList2 = new Array();
  var dueType = '01';//默认续期
function requestGroupFundDetail(){
  var groupId = utils.getUrlParam("groupId");
  $.get("/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId, function(result){
    if(result.returnCode == 0){
      var detailInfo = result.body;
      if(detailInfo != undefined && detailInfo != ""){
        if(detailInfo.isInvestment === 'Y' && detailInfo.investType === 'M'){ // 管理型组合不展示持仓详情
          $('.jijin_mingxi').hide();
        }
		 //20220607新增投顾目标盈相关内容
		if(detailInfo.isTargetProfit=='1'){
			$('.target-container-1').show();
			$('.target-container-2').show();
			getTargetInfo(detailInfo);
			if(detailInfo.fundgroupTargetDetailVO&&detailInfo.fundgroupTargetDetailVO.endOptionOperationList){
				var str = '';
				detailInfo.fundgroupTargetDetailVO.endOptionOperationList.forEach(function(item,index,arr){
					str+=`<div class="padding childrens" style="background: #fff;${index<arr.length-1?'border-bottom:1px #eee solid':''}" data-operation="${item.operation}" data-name="${item.title}" >
					<div class="flex flexB">
						<div>${item.title}</div>
						<div class="${item.operation==dueType?'cirClick':'cir'}"></div>
					</div>
					<br>
					<div class="font-color" style="width: 85%;">${item.content}</div>
				</div>`
				})
				$('.showDue').html(str);
				$('.childrens').on('click',function(e){
					var dataName = $(this).attr('data-name');
					var dataOperation = $(this).attr('data-operation');
					dueType = dataOperation;
					modifyDueType(utils.getUrlParam("balanceSerialNo"),dataOperation,$(this),dataName);
					$('.showDue').hide();
				})
			}
			// 展示目标盈相关按钮
			if(!isApp()){
				$(".fgx").show();
				$(".footer_area").hide();
				$(".footer_area1").show();
				$(".footer_area1 .btn_target_out").click(function(){
					var itemUrl ="/tradeh5/newWap/investGroup/investOut.html?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo;
					if(isApp()){
						window.location.href = 'htffundxjb://action?type=url&link='+btoa(itemUrl);
					}else{
						window.location.href = itemUrl;
					}
				})
			}
			if(detailInfo.fundgroupTargetDetailVO){
				// 参与开始日
				var participationStartFormat =targetTimeFormat(detailInfo.fundgroupTargetDetailVO.participationStartFormat,false,true)
				// 参与结束日
				var participationEndFormat =targetTimeFormat(detailInfo.fundgroupTargetDetailVO.participationEndFormat,false,true)
				participationStartFormat = participationStartFormat.replace(/-/,'/');
				participationEndFormat = participationEndFormat.replace(/-/,'/');
				var currentDate = new Date().getTime();
				if(currentDate<new Date(participationStartFormat).getTime()){
					$('.footer_area1 .btn_target_out').hide()
					$('.footer_area1 .btn_target_in').show()
				}else if(currentDate>=new Date(participationStartFormat).getTime()&&currentDate<=new Date(participationEndFormat).getTime()){
					$('.footer_area1 .btn_target_out').css({backgroundColor:'#999',color:'#fff',pointerEvents:'none'})
					$('.footer_area1 .btn_target_in').show()
				}else{
					$('.footer_area1 .btn_target_out').show()
					$('.footer_area1 .btn_target_in').css({backgroundColor:'#999',color:'#fff',pointerEvents:'none'})
				}
			}
		}else{
			// 展示非目标盈相关按钮
			if(!isApp()){
				$(".fgx").show();
				$(".footer_area").show();
				$(".footer_area1").hide();
			}
		}
        establishDateStr = detailInfo.establishDateStr;
        var groupDetails = detailInfo.groupDetails;
        getLevel(groupDetails);
        groupName = detailInfo.groupname;
        document.title = groupName;
        var dataList = new Array();
        var groupDetails = detailInfo.groupDetails;
        var colorList = new Array();
        for(var i in groupDetails){
          var subgroup = groupDetails[i];
          //if(subgroup.percent > 0){
            if(subgroup.color.indexOf('#') == -1){
              subgroup.color = '#68b0ea';
            }

            colorList.push(subgroup.color);
            colorList2[subgroup.classifyType] = subgroup.color;
            dataList.push({'name': subgroup.classifyName, 'value': 0, 'fundId':subgroup.classifyType,'color':subgroup.color});
          //}
        }
        option_2.color = colorList;
        queryYields(dataList, detailInfo.isInvestment);
        var xieyiData = detailInfo.adviserContractList.filter(function(item){
          return item.investAgreementType == '01'; // 01 - 投顾协议类型
        })[0];
        if(xieyiData){
          $("#xieyi").click(function () {
            window.location.href = "htffundxjb://action?type=url&linkType=" + xieyiData.agreementLinkType + "&link=" + btoa(xieyiData.agreementLinkUrl);
          });
        }
        else {
          $("#xieyi").hide();
        }
      }
    }

  })
}
// 2020.08.10 新加js 和圆饼图
// 关闭顶部的Tips
$(".inform img").click(function(){
  $("#tip_f").hide()
})
// 调仓说明文案的行数限制
$(".explain .text").each(function(){
  var maxwidth=40;//设置最多显示的字数
  var text=$(this).text();
  if($(this).text().length>maxwidth){
    $(this).text($(this).text().substring(0,maxwidth));
    $(this).html($(this).html()+"...");//如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；
  };
})
// 收益，分红，交易切换
$('.tab3 li').click(function () {
  if ($(this).hasClass("active")) {
    return;
  }
  var htm = "";
  //判断有没有数据
  if($(this).attr("data") ==  "1"){//收益
    htm = $(".shouyi").html().trim();
  }else if($(this).attr("data") ==  "2"){//分红
    htm = $(".fenfong").html().trim();
  }else if($(this).attr("data") ==  "3"){//交易
    htm = $(".jiaoyi").html().trim();
  }
  if(htm == ""){
    $("#tabMore").hide();
    $("#tabNoMore").show();
  }else{
    $("#tabMore").show();
    $("#tabNoMore").hide();
  }
  $("#tabMore").attr("data",$(this).attr("data"));
  $(this).addClass("active").siblings().removeClass('active');
  // $(this).parent().next("qiehuan").hide().eq($(this).index()).show();
  $(this).parent().siblings().hide().eq($(this).index()).show()

});
var groupId = utils.getUrlParam("groupId");
var balanceSerialno = utils.getUrlParam("balanceSerialno");
$("#tabMore").click(function(){
  var data = $(this).attr("data");
  if(data == "1"){//收益记录
    // window.location.href = "htffundxjb://action?type=url&link="
    // 		+ btoa(window.location.origin+"/mobileEC/wap/fundgroup/fund_group_history_query.html?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialno);
    var targetUrl = window.location.origin+"/mobileEC/wap/fundgroup/fund_group_history_query.html?groupId="+groupId+"&balanceSerialNo="+balanceSerialno;
    if(isApp()){
      window.location.href = "htffundxjb://action?type=url&link="+btoa(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  }
});
/**
 *收益记录
  */
historyQuery(groupId, balanceSerialno);
function historyQuery(groupId,balanceSerialno) {
  $.get("/fundgroup/v1/trader/query-cust-history-income?groupId=" + groupId + "&balanceSerialno="+ balanceSerialno, function (result) {
    if(result.returnCode == 0){
      var body = result.body;
      var f1_html = '<div class="biaoti"><div class="first">日期</div><div class="second">日收益(元)</div><div class="third">日涨跌幅</div></div>';
      var flag = 0;
      body.forEach(function (item,index) {
        var groupNavdt = item.groupNavdt;
        groupNavdt = groupNavdt.substr(0,4)+"."+groupNavdt.substr(4,2)+"."+groupNavdt.substr(6,2);
        var cls = "";
        if (item.groupYield < 0) {
          cls = "green";
        } else {
          cls = "red";
        }
        var cls1 = "red";
        var groupYieldRate = (Math.round(item.groupYieldRate*100)/100).toFixed(2);
        if(item.groupYieldRate < 0){
          cls1 = "green";
        }
        if(index < 3){
          f1_html += '<div class="shuju"><div class="first">'+groupNavdt+'</div><div class="second"><span class="'+cls+'">'+item.groupYieldDisplay+'</span></span></div><div class="third " style="color:'+cls1+'" >'+groupYieldRate+'%</div></div>'
        }
        flag++;
      });
      if(flag>0){
        $('.shouyi').html(f1_html);
      }else{
        $("#tabMore").hide();
        $("#tabNoMore").show();
      }
    }

  });
}
/**
 * 交易记录
 */
function queryTradeList(arAcct){
  if(arAcct == null || arAcct == undefined){
    arAcct = "";
  }
  $.get("/ess/v1/trade/tradeinfos?productId=" + groupId+"&arAccts="+arAcct+"&productType=3&pageSize=3" , function (result) {
    var body = result.body;
    var f1_html = '';
    var f1_html2 = '';
    var i = 0;
    // var _num = 0;
    // console.log("body---"+JSON.stringify(body));
    body.forEach(function (item,index) {
      var cls = "#fb5c5f";
      if(item.tradeTypeBriefName == "赎回"){
        cls = "#148ce6";
      }
      // console.log("item---"+JSON.stringify(item));
      if(index < 3){
        f1_html += '<div class="shuju3"><div class="first" style="color:'+cls+'">'+item.tradeTypeBriefName
            +'</div><div class="second"><span>'+item.tradeName+'</span><p style="color:#666">'+item.tradeDt.replace(/-/g, '.')
            +"&nbsp;&nbsp;"+item.tradeTm.substr(0,5) +'</p></div><div class="third "><span>'
            +item.tradeAmount +item.tradeUnit+'</span><p style="color:#666">'+item.tradeStatusName +'</p></div></div>';
      }
      if(i < 3 && item.tradeTypeBriefName == '分红'){
        i++;
        f1_html2 += '<div class="shuju2"><div class="first">'+item.tradeTypeBriefName +'</div><div class="second"><span>'+item.tradeName+'</span><p style="color:#666">'+item.tradeDt.replace(/-/g, '.')+"&nbsp;&nbsp;"+item.tradeTm.substr(0,5) +'</p></div><div class="third "><span>'+item.tradeAmount +item.tradeUnit+'</span><p style="color:#666">'+item.tradeStatusName +'</p></div></div>'
      }
      if(item.tradeStatusName == "受理成功"){
        _num++;
      }
    });
    // if(_num > 0){
    // 	$("#_num").html("("+_num+")");

    // }
    $('.jiaoyi').html(f1_html);
  });
  // 20210706 获取在途交易笔数
  
  // /assetcenter/v1/view/list/product/ias?custNo=1030948191&assetMode=0&arAcct=IAS_10000006624&currencyType=156
  $.get("/assetcenter/v1/view/list/product/ias?currencyType=156&assetMode=0&arAcct="+arAcct, function (result) {
    var body = result.body;
    console.log('queryTradeList2 body=', body);
    if (result.returnCode==0) {
      if (body && body.onWayCount && Number(body.onWayCount) > 0) {
        $("#_num").html("("+body.onWayCount+")");
      }
    }
  });
}


/**
 * 分红记录
 */
function queryFenList(arAcct){
  if(arAcct == null || arAcct == undefined){
    arAcct = "";
  }
  $.get("/ess/v1/trade/tradeinfos?productId=" + groupId+"&arAccts="+arAcct+"&productType=3&tradeType=4&pageSize=3" , function (result) {
    var body = result.body;
    var f1_html = '';
    var f1_html2 = '';
    var i = 0;
    // var _num = 0;
    // console.log("body---"+JSON.stringify(body));
    body.forEach(function (item,index) {

      if(i < 3 && item.tradeTypeBriefName == '分红'){
        i++;
        f1_html2 += '<div class="shuju2"><div class="first">'+item.tradeTypeBriefName +'</div><div class="second"><span>'+item.tradeName+'</span><p style="color:#666">'+item.tradeDt.replace(/-/g, '.')+"&nbsp;&nbsp;"+item.tradeTm.substr(0,5) +'</p></div><div class="third "><span>'+item.tradeAmount +item.tradeUnit+'</span><p style="color:#666">'+item.tradeStatusName +'</p></div></div>'
      }

    });

    $('.fenfong').html(f1_html2);
  });
}


function getNowDate(){
  var myDate = new Date();
  var month = (myDate.getMonth()+1)>9?(myDate.getMonth()+1):"0"+(myDate.getMonth()+1);
  var date =  myDate.getDate()>9? myDate.getDate():"0"+(myDate.getDate());

  return  myDate.getFullYear()+"."+month+"."+date;
}

/**
 * 组装数据  jijin_list
 */
function assembleData(data) {
  // console.log("data-----"+JSON.stringify(data));

  if(data.returnCode == 0){
    var holdGroupInfo = data.body.holdGroupInfo;
    // console.log("holdGroupInfo--------"+JSON.stringify(holdGroupInfo));
    var fundGDetails = holdGroupInfo.fundGroupDetails;
    if(fundGDetails != null && fundGDetails != undefined){
      // console.log("fundGDetails--------"+JSON.stringify(fundGDetails));
      var htmstr = "";
      var fundGDetailsList =  getSzGroup(fundGDetails,"fundGroupTpNm");
      // console.log("fundGDetailsList--------"+JSON.stringify(fundGDetailsList));
      var fl_length = fundGDetailsList.length;
      var dataList = new Array();
      var colorList = new Array();
      for(var i=0; i<fl_length; i++){
        var fundGInfo = fundGDetailsList[i];
        var fundGroupTpNm = fundGInfo.fundGroupTpNm;//权益类,固收类,货币类,其他,
        var date = fundGInfo.data;
        // console.log("fundGDetailsList--------"+JSON.stringify(fundGDetailsList));
        var d_length = date.length;
        var sumpar = 0;
        var color = "";
        for (var j = 0;j < d_length;j++){
          var obj = date[j];
          // console.log("obj--------"+JSON.stringify(obj));
          var fundGroupTp = obj.fundGroupTp;// 基金大类类别R:权益类,F:固收类,V:货币类,O:其他,
          var fundId = obj.fundId; //基金代码
          var percent = obj.percent;//占比
          var profit = obj.profit;//日收益
          var holdBalance = obj.holdBalance;//持有份额
          var fundTradeStName = obj.fundTradeStName;//基金状态名称
          var fundTradeStName_style = "";//基金状态名称样式
          // var nav = obj.nav;//最新净值
          var navDisplay = obj.navDisplay;//最新净值
          var fundName = obj.fundName;//基金简称
          if(fundName.length>9){
            fundName = fundName.substring(0,9);
          }
          var profitDate = obj.profitDate;//最近一天收益日期
          if(!!(profitDate)){
            profitDate = profitDate.substr(4,2)+"."+profitDate.substr(6,2);
          }else{
            profitDate = "--";
          }
          if(!!(fundTradeStName)){
            fundTradeStName_style = " fenhong";
          }else{
            fundTradeStName_style = " jijin-item";
          }
          sumpar = accadd(percent,sumpar);
          var lev_obj = getLevlObj(fundId,level_list);///获取对应的fundId 风险对象
          // console.log("level_list--------"+JSON.stringify(level_list));

          if(lev_obj != null){
            color = lev_obj.color;
            var sy_color = "red";
            if(!(percent) ){
              percent = "0";
            }
            if(profit<0 ){
              sy_color = "green";
            }
            //
            htmstr+= '<div class="jijin-content"><div class="'+fundTradeStName_style+'"><div class="jijin-name" onclick="forwardFundDetailPage(\''+ lev_obj.jumpUrl+ '\')">' +
                '<span class="red" style="background-color: '+color+'"></span><span>'+obj.fundName+'</span>'+(!(fundTradeStName)  ? "" : "<i class='deal' >" + fundTradeStName + "</i>")
                +'</div><div class="jijin-zhanbi">'+percent+'%</div><div class="jijin-jine"> '+utils.formatMoney(obj.marketvalue,2)+' <img src="img/imgDown.png" alt="" class="tubiao"></div>'
                +'</div><div class="jijin-item2" style="display: none;"><div><span>('+profitDate+')日收益 '+'</span><span style="color: '+sy_color+';">'+profit+'</span></div><div><span>持有份额'
                +'</span><span>'+holdBalance+'</span></div></div></div>';
          }
        }
        colorList.push(color);//收集饼图颜色
        dataList.push({'name': fundGroupTpNm, 'value': sumpar, 'fundId':fundGroupTpNm,'color':color});//收集饼图比例数据
      }
      // console.log(htmstr);
      $("#jijin_list").html(htmstr);
      $('.jijin-content').click(function(){
        console.log(this);
        if($(this).find('.jijin-item2').is(':hidden')){
          $(this).addClass('paddB75');
          $(this).find('.jijin-item2').show();
          $(this).find('.tubiao').attr('src','img/imgUp.png');
        }
        else {
          $(this).removeClass('paddB75');
          $(this).find('.jijin-item2').hide();
          $(this).find('.tubiao').attr('src','img/imgDown.png');
        }
      });
      ////饼图 合计
      option_2.color = colorList;
      var fund_list_html = "";
      var temp_index = 0;
      dataList.forEach(function(item, index){
        fund_list_html += '<li>';
        var cls = "";
        if(temp_index == 0) cls = "";
        fund_list_html += '<span style="width: 100%;" class="pieEle '+cls+'" data-fundId="'+ item.fundId +'" data-fundNm = "'+ item.name +'"><i style="background-color: '+ item.color +'"></i>'+ item.name +'</span><span style="width: 100%;color:#000000;" class="pieEle ">占比'+ item.value +'%</span>';
        fund_list_html += '</li>';
      });
      $(".fund-list").html(fund_list_html);
      var dl = dataList.length;//类别数量
      if(dl<2){
        $(".fund-list").css("top","3.5rem");
      }else if(dl<3){
        $(".fund-list").css("top","3rem");
      }else if(dl<4){
        $(".fund-list").css("top","2.35rem");
      }else if(dl<5){
        $(".fund-list").css("top","2rem");
      }
      var myChart_2 = echarts.init(document.getElementById('pie2'));
      option_2.series[0].data = dataList;
      myChart_2.setOption(option_2);
    }

  }
}


/**
 *  根据基金大类进行分组
 * @param arr
 * @param parm
 * @returns {Array}
 */
function getSzGroup(arr,parm){
  var map = {};
  var dest = [];
  var length = arr.length;
  for(var i = 0;i < length; i ++){
    var ai = arr[i];
    if(ai[parm] && !map[ai[parm]]){
      dest.push({
        fundGroupTpNm:ai[parm],
        data:[ai]
      });
      map[ai[parm]]=ai;
    }else{
      var delength = dest.length;
      for(var j = 0;j < delength ;j++){
        var dj = dest[j];
        if(dj.fundGroupTpNm == ai[parm]){
          dj.data.push(ai);
          break;
        }
      }
    }
  }
  return dest;
}

/**
 * 相对精确加法
 */
function accadd(arg1,arg2) {
  if(isNaN(arg1)){
    arg1 = 0;
  }
  if(isNaN(arg2)){
    arg2 = 0;
  }
  arg1 = Number(arg1);
  arg2 = Number(arg2);
  var r1,r2,m,c;
  try{r1=arg1.toString().split(".")[1].length;}catch (e) {r1=0}
  try{r2=arg2.toString().split(".")[1].length;}catch (e) {r2=0}
  c = Math.abs(r1-r2);
  m = Math.pow(10,Math.max(r1,r2));
  if(c>0){
    var cm = Math.pow(10,c);
    if(r1>r2){
      arg1 = Number(arg1.toString().replace(".",""));
      arg2 = Number(arg2.toString().replace(".",""))*cm;
    }else{
      arg1 = Number(arg1.toString().replace(".",""))*cm;
      arg2 = Number(arg2.toString().replace(".",""));
    }
  }else{
    arg1 = Number(arg1.toString().replace(".",""));
    arg2 = Number(arg2.toString().replace(".",""));
  }
  return (arg1+arg2)/m;
}

/**
 * 获取 fund-group/detailInfo   获取基金的风险等级等
 * @param obj groupDetails
 */
function getLevel(groupDetails) {
  // var groupId = utils.getUrlParam("groupId");
  var res = new Array();
  // $.get("/mobile-bff/v1/fund-group/detailInfo?groupId=" + groupId, function(result){
  // 	if(result.returnCode == 0) {
  // 		var detailInfo = result.body;
  // 		if (detailInfo != undefined && detailInfo != "") {
  // var dataList = new Array();
  // var groupDetails = detailInfo.groupDetails;
  var length = (groupDetails?groupDetails.length:0);
  for(var i=0;i<length;i++){
    var obj = groupDetails[i];

    var percent = obj.percent;
    if(percent == '' || percent == null || percent .length<1 || percent<= 0){
      continue;
    }else{var subLists = obj.subList;
      var color = obj.color;
      var sub_length = subLists.length;
      for(var j = 0;j<sub_length;j++){
        var det = {};
        var subList = subLists[j];
        var dayYield = subList.dayYield;//日收益率
        var fundId = subList.fundId;//基金ID
        var fundRiskLevelNm = subList.fundRiskLevelNm;//基金风险等级名称
        var jumpUrl = subList.jumpUrl;//
        var fundRiskLevel = subList.fundRiskLevel;//基金风险等级
        det.dayYield = dayYield;
        det.fundId = fundId;
        det.fundRiskLevelNm = fundRiskLevelNm;
        det.jumpUrl = jumpUrl;
        det.fundRiskLevel = fundRiskLevel;
        det.color = color;
        res.push(det);
      }
    }
  }
  level_list = res;
  // console.log(res);
  // }
  // }

  // })

}

/**
 * 获取对应级别对象
 * @param fundId
 * @param arr
 */
function  getLevlObj(fundId,arr) {
  var arr_length = arr.length;
  for(var i = 0;i<arr_length;i++){
    var obj = arr[i];
    var fundId_obj = obj.fundId;
    if(fundId_obj == fundId){
      return obj;
    }
  }
  return null;
}

function queryReportData(groupId){
  $.get("/mobileEC/services/adviser/query_fund_group_report?groupId=" + groupId + "&t=" + new Date().getTime(), function(resultStr){
    var result = typeof resultStr === 'string' ? JSON.parse(resultStr) : resultStr;
    if(result.returnCode == 0){
      var reports = result.body.reports;
      if(reports.length > 0){
        var reportObj = reports[0];
        $('.report_cg .new_report_name').text(reportObj.reportName);
        $('.report_cg .new_report_date').text(reportObj.reportDate.replace(/-/g,'.'));
        $('.report_cg').attr('url', reportObj.reportUrl || reportObj.reportName);
        reportObj.reportUrl ? $('.report_cg').attr('url_type', 1) : $('.report_cg').attr('url_type', 2);
        $('.report_cg').on('click',function(){
          var url = encodeURI($(this).attr('url'));
          var urlType = $(this).attr('url_type');
          var jumpUrl = '';
          if(urlType == 1){
            jumpUrl = 'htffundxjb://action?type=adviserService&subType=regularReport&link=' + btoa(url) + '&groupId=' + groupId;
          }
          else {
            jumpUrl = 'htffundxjb://action?type=adviserService&subType=regularReport&link=' + btoa(location.origin + "/mobileEC/services/adviser/show_fund_group_report?reportNm=" + url) + '&groupId=' + groupId;
          }
          console.log(jumpUrl);
          window.location.href = jumpUrl;
        });
        $('.report_cg').show();
      }
    }
  });
}
// $("#baogao").click(function () {
// 	window.location.href = "htffundxjb://action?type=url&link="
// 			+ btoa(window.location.origin+"/mobileEC/adviser/regularReport.html?groupId="+utils.getUrlParam("groupId"));
// });
/**
 * 查询占比文案
 * @type {string}
 */

var strKeys = "standardFundGroupRate";
$.get('/mobile-bff/v1/unification/query?keys='+ strKeys, function(result){
  if(result.returnCode == 0 && result.body != undefined && result.body != null && result.body[strKeys]){
    $("#zbwa").html(result.body[strKeys]['unificationValue']);
    $("#zbwa").each(function(){
      var maxwidth=80;//设置最多显示的字数
      var text=$(this).text();
      if($(this).text().length>maxwidth){
        $(this).text($(this).text().substring(0,maxwidth));
        $(this).html($(this).html()+"..."+"<a href='###'style='color:#3fa0e9'> 展开全部</a>");//如果字数超过最大字数，超出部分用...代替，并且在后面加上点击展开的链接；

      };
      $(this).find("a").click(function(){
        $(this).parent().text(text);//点击“点击展开”，展开全文
      })
    })
  }
});
//查询成成份业绩
function layerShow2(){
  $.get('/mobile-bff/v1/unification/query?keys=fundGroupHoldTip', function(result){
    if(result.returnCode == 0 && result.body != undefined && result.body != null && result.body["fundGroupHoldTip"]){

      $(".display_yield_desc1").html(result.body["fundGroupHoldTip"]['unificationValue']);
      $(document.body).css({ "overflow-x":"hidden","overflow-y":"hidden"});
      $('#layer1').show();

    }else{
      $("#layer1").hide();
    }
  });
}

function getThemeInfo(infoData) {
    var url ="/res/v1/app-func-layout/location?layoutId=assetHolding&date=" + (new Date()).getTime();
    App.get(url, null, function(res) {
        if (res.returnCode == 0 && res.body != undefined && res.body != null && res.body.length > 0) {
            var funcmodId = res.body[0].funcmodId; 
              getThemeContentInfo(funcmodId,infoData)
        }
    })
};
function getThemeContentInfo(funcmodId,infoData) {
      var url ="/res/v1/app-func-layout/theme-infos";
      var data = {"layoutId":"assetHolding","funcModId":funcmodId,"objectId":utils.getUrlParam("groupId")}
      App.post(url,JSON.stringify(data), null, function(res) {
          if (res.returnCode == 0 && res.body != undefined && res.body != null && res.body.length > 0) {
      if(res.body[0].object.length > 0){
        var extField = JSON.parse(res.body[0].object[0].extField);
        var S_title = extField.title;
        var S_subTitle = extField.subTitle;
        var S_jumpUrl = extField.jumpUrl;
        var adviseHoldDays=infoData.adviseHoldDays;
        var holdDays=infoData.holdDays;
        var holdYieldRate=infoData.holdYieldRate;
        if(S_jumpUrl){
          $('.box-r').attr('href',S_jumpUrl).css({"margin-left":".75rem"});
        }else{
          $('.box-r').hide();
        }
        if(String(holdYieldRate).indexOf('-') > -1){
          holdYieldRate = "<span style=\"color:green\">"+holdYieldRate+"%</span>";
        }else{
          holdYieldRate = "<span style=\"color:red\">"+holdYieldRate+"%</span>";
        }
        S_title=S_title.replace('${holdYeildRate}',holdYieldRate)
        .replace('${holdDays}',holdDays)
        .replace('${adviseHoldDays}',adviseHoldDays);
    
        S_subTitle=S_subTitle.replace('${adviseHoldDays}',adviseHoldDays).replace('${holdDays}',holdDays);

        $('.s_title').html(S_title)
        $('.bar .bartip').html(S_subTitle)
        $("#dear_img").css({"background":"url("+res.body[0].object[0].imageUrl+") ","background-size":"100% 100%"});
        $(".dear_txt").html(res.body[0].object[0].adviceTitle);
        $(".dear_investor").show();
        var progress=Number((holdDays/adviseHoldDays)*100).toFixed(2);

        var barWidth=$('.bar').width();
        var progressBarWidth=$('.bar').width()*(progress/100);
        var tipBarWidthHalf=$('.bartip').outerWidth()/2;
        var topArrowWidth= $('.bar>img').width();
        $(".bar").css('--percent',progress);
        // $('.bar>p.bartip>img').css('left',(tipBarWidthHalf-topArrowWidth));
        $('.barVoids').css('height',($('.bar').height()+$('.bar>img').height()+$('.bar .bartip').height()));
        if((progressBarWidth>tipBarWidthHalf)&&(barWidth-progressBarWidth)>tipBarWidthHalf){
          $('.bartip').css('left',(((progressBarWidth-tipBarWidthHalf)/barWidth*100)+'%'))
          $('.bar>img').css('left',(progressBarWidth-topArrowWidth)/barWidth*100+'%')
        }else if(progressBarWidth<tipBarWidthHalf){
          $('.bartip').css('left',0)
          if((progressBarWidth-topArrowWidth/2)<0){
            $('.bar>img').css('left',0)
          }else{
            $('.bar>img').css('left',(progressBarWidth-topArrowWidth)/barWidth*100+'%')
          }
        }else{
          $('.bartip').css('right',0)
          $('.bar>img').css('left',(progressBarWidth-topArrowWidth)/barWidth*100+'%')
        }
        
          
      }				
          }
      })
  };
//查询持有建议
showAdvise();
function showAdvise(){
  
  $.get('/mobile-bff/v1/account/get-hold-info?balanceSerialNo='+utils.getUrlParam("balanceSerialNo")+'&productId='+utils.getUrlParam("groupId")+'&productType=1', function(result){
    if(result.returnCode == 0 && result.body != undefined && result.body != null ){
      var res = result.body;
      if(!!(res.adviseHoldDays) &&  !!(res.holdDays ) && !!(res.holdYieldRate )){
        getThemeInfo(result.body);
      }
    }
  });
}
function layerShow3(){
  $(".display_yield_desc1").html("数据加载失败，请返回重试!");
  $(document.body).css({ "overflow-x":"hidden","overflow-y":"hidden"});
  $('#layer1').show();
}

// 底部按钮控制逻辑重写
// getBtn();
// getBtn2();

//start-点击按钮展示浮框---20211125
$(".footer_area .btn_in").click(function(){
  $('.mask').show();
  $('#showDialog').show();
  $('#showDialog').css('height', '27rem');
})
// 关闭浮框
$("#closeBtn").click(function(){
  $('.mask').hide();
  $('#showDialog').hide();
})
  var groupId = utils.getUrlParam("groupId");
  var balanceSerialNo = utils.getUrlParam("balanceSerialNo");
// 点击转出按钮跳转
  $(".footer_area .btn_out").click(function(){
    var itemUrl ="/tradeh5/newWap/investGroup/investOut.html?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo;
    if(isApp()){
      window.location.href = 'htffundxjb://action?type=url&link='+btoa(itemUrl);
    }else{
      window.location.href = itemUrl;
    }
  })

//点击追加跳转
function investBtn(arAcct){
	// 目标盈按钮跳转绑定
	$(".btn_target_in").click(function(){
		if(arAcct == null || arAcct == undefined){
		arAcct = "";
		}
		var addUrl ="/tradeh5/newWap/investGroup/investEnter.html?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo+ "&arAccts=" +arAcct;
		if(isApp()){
			window.location.href = 'htffundxjb://action?type=url&link='+btoa(addUrl);
		}else{
			window.location.href = addUrl;
		}
	})
  $("#addBtn").click(function(){
    if(arAcct == null || arAcct == undefined){
    arAcct = "";
    }
    var addUrl ="/tradeh5/newWap/investGroup/investEnter.html?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo+ "&arAccts=" +arAcct;
    if(isApp()){
      window.location.href = 'htffundxjb://action?type=url&link='+btoa(addUrl);
    }else{
      window.location.href = addUrl;
    }
  })
//点击定投跳转
  $("#investBtn").click(function(){
    if(arAcct == null || arAcct == undefined){
    arAcct = "";
    }
    var investUrl ="/tradeh5/newWap/investGroup/investPurchaseMip.html?groupId=" + groupId + "&balanceSerialNo=" + balanceSerialNo+ "&arAccts=" +arAcct;
    if(isApp()){
      window.location.href = 'htffundxjb://action?type=url&link='+btoa(investUrl);
    }else{
      window.location.href = investUrl;
    }
  }) 

}  
// 添加目标盈相关内容
function getTargetInfo(detailInfo){
	utils.ajax({
		url:'/ias/v1/assets/asset/detail?balanceSerialNo='+balanceSerialNo+'&containDetail=false',
		success: function (result) {
			if (result.returnCode === 0) {
				console.log(result);
				var info = result.body;
				var str = '';
				str+=`<div class="container">
				<p><img src="./img/shijian.png" alt="">本期<span>已运作${info.operatingDaysDisplay}天</span>，服务到期日${targetTimeFormat(info.dueDate,true)}</p>
				<p>止盈日或到期日12:00前可支持修改到期处理方式</p>
				</div>`
				$('.target-container-1').html(str);
				var obj;
				obj=detailInfo.fundgroupTargetDetailVO.endOptionOperationList.find((item)=>{
					return item.operation == info.dueType;
				})
				if(obj){
					console.log(obj);
					$('.duetype-showtext').text(obj.title);
					dueType = obj.operation;
					var str = '';
					detailInfo.fundgroupTargetDetailVO.endOptionOperationList.forEach(function(item,index,arr){
						str+=`<div class="padding childrens" style="background: #fff;${index<arr.length-1?'border-bottom:1px #eee solid':''}" data-operation="${item.operation}" data-name="${item.title}" >
						<div class="flex flexB">
							<div>${item.title}</div>
							<div class="${item.operation==dueType?'cirClick':'cir'}"></div>
						</div>
						<br>
						<div class="font-color" style="width: 85%;">${item.content}</div>
					</div>`
					})
					$('.showDue').html(str);
					$('.childrens').on('click',function(e){
						var dataName = $(this).attr('data-name');
						var dataOperation = $(this).attr('data-operation');
						dueType = dataOperation;
						modifyDueType(utils.getUrlParam("balanceSerialNo"),dataOperation,$(this),dataName);
						$('.showDue').hide();
					})
				}
			}
		}.bind(this)
	})
}
// 更换止盈处理方式
function modifyDueType(balanceSerialNo,dueType,dom,dataName){
	utils.ajax({
		url:'/ias/v1/target-profit/due-type',
		type: 'POST',
		data:{balanceSerialNo,dueType},
		success: function (result) {
			if (result.returnCode === 0) {
				if(result.body){
					$('.duetype-showtext').text(dataName);
					dom.siblings().children('.flexB').find('div').eq(1).removeClass().addClass('cir');
					dom.children('.flexB').find('div').eq(1).removeClass().addClass('cirClick');
				}
			}
		}.bind(this)
	})
}
// 目标盈日期format
function targetTimeFormat(val,flag,isAll){
	try {
		if(val){
			if(val.length===8){//YYYYMMDD
				if(flag){
					return val.slice(0,4)+'.'+val.slice(4,6)+'.'+val.slice(6,8)
				}else{
					return val.slice(0,4)+'-'+val.slice(4,6)+'-'+val.slice(6,8)
				}
			}else{//YYYYMMDD HHmmss
				if(flag){
					return val.slice(0,4)+'年'+val.slice(4,6)+'月'+val.slice(6,8)+'日'+val.slice(8,11)+':'+val.slice(11,13)
				}else{
					if (isAll){
						return val.slice(0,4)+'-'+val.slice(4,6)+'-'+val.slice(6,8)+val.slice(8,11)+':'+val.slice(11,13)+':'+val.slice(13,15)	
					}else{
						return val.slice(0,4)+'-'+val.slice(4,6)+'-'+val.slice(6,8)+val.slice(8,11)+':'+val.slice(11,13)	
					}
					
				}
			}
		}else{
			return ''
		}	
	} catch (error) {
		return ''
	}
}
$('.layer1').click(function(){
	$('.layer1').hide()
})
//end-点击按钮展示浮框---20211125

