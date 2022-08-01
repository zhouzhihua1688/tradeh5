$(function () {
    productId = App.getUrlParam('productId');
    var productType = App.getUrlParam('productType');
    queryTradeTypeInfos();
    queryPayRecords(1, productType);
    if(App.isNotEmpty(productType)){
        $(".product-type .box span").removeClass("span-active");
        $(".product-type .box span").each(function (index,item) {
            if($(item).attr("data-param") == productType){
                $(item).addClass("span-active");
                $("#header-product span").text($(item).text());
                $('.product-type .box').attr('data-param', productType);
            }
        });
    }
    if(App.isNotEmpty(productId)){
        $(".header-ul").hide();
    }
});
var productId;
var pageNo = 1;
var showData = new Map();
var subProducts = {};
var tradeType = App.getUrlParam('tradeType');
var tradeAcco = App.getUrlParam('tradeAcco');
var branchCode = App.getUrlParam('branchNo');
var branchNo = "247";
var arAcct = App.getUrlParam('arAcct');
$(".data_more").click(function () {
    $(".header-more").hide();
    pageNo++;
    queryPayRecords(pageNo);
});

function queryTradeTypeInfos() {
    var url = "/ess/v1/trade/subproducts";
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            result.body.forEach(function (item) {
                subProducts[item.productType] = item.subTypes;
            });
        }
    });
}
function queryPayRecords(pNo, productType) {

    $(".data_more").hide();

    pageNo = pNo;
    var param = getParam();
    if(App.isNotEmpty(productType)){
        param.productType = productType;
    }
    if(App.isNotEmpty(productId)){
        param.productId = productId;
    }
    if(App.isNotEmpty(tradeType)){
        param.tradeType = tradeType;
    }
    if(App.isNotEmpty(tradeAcco) ){
        param.tradeAcco = tradeAcco;
    }
    if(App.isNotEmpty(branchCode)){
        param.branchNo = branchCode;
    }else{
		param.branchNo = branchNo;
	}
    if(App.isNotEmpty(arAcct)){
        param.arAcct = arAcct;
    }else{
		param.arAcct = arAcct;
	}
    var pageSize = 20;
    var url = "/ess/v1/trade/tradeinfos?"
        + "&pageNo=" + pageNo
        + "&pageSize=" + pageSize
        + "&branchNo="+ param.branchNo;
        if(App.isNotEmpty(param.startDate)){
            url += "&apdtStart=" + param.startDate;
        }	
        if(App.isNotEmpty(param.endDate)){
            url += "&apdtEnd=" + param.endDate;
        }
		
        if(App.isNotEmpty(param.productType)){
            url += "&productType=" + param.productType;
        }
        if(App.isNotEmpty(param.tradeAcco)){
            url += "&tradeAcco=" + param.tradeAcco;
        }
        if(App.isNotEmpty(param.tradeType)){
            url += "&tradeType=" + param.tradeType;
        }
        if(App.isNotEmpty(param.productSubType)){
            url += "&subProductType=" + param.productSubType;
        }
        if(App.isNotEmpty(param.productId)){
            url += "&productId=" + param.productId;
        }
        if(App.isNotEmpty(param.arAcct)){
            url += "&arAccts=" + param.arAcct;
        }
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            var payTradeRecordList = result.body;
            if (payTradeRecordList != undefined && payTradeRecordList != null) {
                payTradeRecordList.forEach(function (item) {
                    if(App.isNotEmpty(item.tradeDt)){
                        var date = item.tradeDt.substring(0,7);
                        var list = showData.get(date);
                        if(App.isNotNull(list)){
                            list.push(item);
                        } else {
                            var newList = new Array();
                            newList.push(item);
                            showData.set(date, newList);
                        }
                    }
                });
                drawingHtml();
                if (payTradeRecordList.length >= pageSize) {
                    $(".data_more").show();
                }
            }
        }
    });
}

function drawingHtml() {
    $(".contentBody").html('');
    if(App.isNotNull(showData)){
        var index = 1;
        var html = '';
        showData.forEach(function (list, key) {
            if (App.isNotNull(list)){
                var listHtml = '';
                list.forEach(function (item) {
                    var color1 = '';
                    var color2 = '';
                    if(item.moneyFlow == "BUY"){//根据资金流向显示不同的颜色
                        color1 = "red";
                    }else if(item.moneyFlow == "SELL"){
                        color1 = "blue";
                    }
                    if(item.tradeStatusName != "交易成功"){//根据交易状态显示不同的颜色
                        color2 = "red";
                    }
                    listHtml += '<ul class="list" data="'+item.tradeDetailApi+'">' +
                                    '<li>' +
                                        '<span class="'+color1+'">'+ item.tradeTypeBriefName +'</span>' +
                                    '</li>' +
                                    '<li class="zh">' +
                                        '<span >'+ App.subString(item.tradeName, 10, '...') +'</span>' +
                                        '<span>'+ item.tradeDt + '&nbsp;' + item.tradeTm +'</span>' +
                                    '</li>' +
                                    '<li>' +
                                        '<span>'+ item.tradeAmount + item.tradeUnit +'</span>' +
                                        '<span class="'+color2+'">'+ item.tradeStatusName +'</span>' +
                                    '</li>' +
                                '</ul>';
                });

                html += '<div class="content content'+ index +'">' +
                    '   <div class="content-title">' +
                    '       <span>'+ key +'</span><i class="choose all"></i>' +
                    '   </div>' +
                    '   <div class="content-list">'+ listHtml +'</div>' +
                    '</div>';

                index++;

            }
        });
        if (App.isNotEmpty(html)) {
            $(".contentBody").html(html);
        }
        $(".list").click(function(){
            App.setSession("tradeInfoApi",$(this).attr("data"));
            window.location.href = 'tradeInfo.html';
        });
    }
}

function getParam() {
    var tradeType = $('.trade-type').attr('data-param');
    var productType = $('.product-type .box').attr('data-param');
    var productSubType = $('.product-type .custom').attr('data-param');
    var tradeDate = $('.trade-date').attr('data-param');

    var param = {
        'tradeType': tradeType,
        'productType': productType
    };
    var subProductType = subProducts[productType];
    if(subProductType != undefined && subProductType != null){
        param.productSubType = productSubType;
    }
    var startDate = new Date();
    var endDate = new Date();
    if(tradeDate == '1M'){
        startDate = App.dateCalculation('M', -1, startDate);
        param.startDate = App.formatTargetDateStr('yyyyMMdd', startDate);
        param.endDate = App.formatTargetDateStr('yyyyMMdd', endDate);
    } else if(tradeDate == '3M'){
        startDate = App.dateCalculation('M', -3, startDate);
        param.startDate = App.formatTargetDateStr('yyyyMMdd', startDate);
        param.endDate = App.formatTargetDateStr('yyyyMMdd', endDate);
    } else if(tradeDate == '6M'){
        startDate = App.dateCalculation('M', -6, startDate);
        param.startDate = App.formatTargetDateStr('yyyyMMdd', startDate);
        param.endDate = App.formatTargetDateStr('yyyyMMdd', endDate);
    } else if(tradeDate == '1Y'){
        startDate = App.dateCalculation('y', -1, startDate);
        param.startDate = App.formatTargetDateStr('yyyyMMdd', startDate);
        param.endDate = App.formatTargetDateStr('yyyyMMdd', endDate);
    } else if(tradeDate == '3Y'){
        startDate = App.dateCalculation('y', -5, startDate);
        param.startDate = App.formatTargetDateStr('yyyyMMdd', startDate);
        param.endDate = App.formatTargetDateStr('yyyyMMdd', endDate);
    } else {
        var sDate = ($("#time1").val()).replace(/\-/g, '');
        var eDate = ($("#time2").val()).replace(/\-/g, '');
        param.startDate = sDate;
        param.endDate = eDate;
    }
    // console.log(param.name);
    return param;
}

var flag1=true;
var flag2=true;
var flag3=true;
var openStatus1=false;
var openStatus2=false;
var openStatus3=false;
$("#header-deal").click(function () {
    $(".header-more").hide();
    if(openStatus3){
        $(".header-mask").hide();
        $(".header-time").hide();
        $("#header-time i").removeClass("select-active");
        flag3=true;
        openStatus3=false;
        return;
    }
    if(openStatus2){
        $(".header-mask").hide();
        $(".header-product").hide();
        $("#header-product i").removeClass("select-active");
        flag2=true;
        openStatus2=false;
        return;
    }
    if(flag1){
        $(".header-mask").show();
        $(".header-deal").show();
        $("#header-deal i").addClass("select-active").css("background-size","100% 100%");
        flag1=false;
        openStatus1=true;
    }else{
        $(".header-mask").hide();
        $(".header-deal").hide();
        $("#header-deal i").removeClass("select-active");
        flag1=true;
        openStatus1=false;
    }
});
$(".header-deal").on("click",function (event) {
    var $target=$(event.target);
    $('.trade-type').attr('data-param',$target.attr("data-param"));

    if($target.is("span")){
        $(".header-deal span").removeClass("span-active");
        $target.addClass("span-active");
        $("#header-deal span").text($target.text())
        $(".header-mask").hide();
        $(".header-deal").hide();
        $("#header-deal i").removeClass("select-active");
        flag1=true;
        openStatus1=false;
        showData = new Map();
        queryPayRecords(1);
    }
});

$("#header-product").click(function () {
    $(".header-more").hide();
    if(openStatus1){
        $(".header-mask").hide();
        $(".header-deal").hide();
        $("#header-deal i").removeClass("select-active");
        flag1=true;
        openStatus1=false;
        return;
    }
    if(openStatus3){
        $(".header-mask").hide();
        $(".header-time").hide();
        $("#header-time i").removeClass("select-active");
        flag3=true;
        openStatus3=false;
        return;
    }
    if(flag2){
        $(".header-mask").show();
        $(".header-product").show();
        $("#header-product i").addClass("select-active");
        flag2=false;
        openStatus2=true;
    }else{
        $(".header-mask").hide();
        $(".header-product").hide();
        $("#header-product i").removeClass("select-active");
        flag2=true;
        openStatus2=false;
    }
});
$(".header-product .box").on("click",function (event) {
    var $target=$(event.target);
    var productType = $target.attr("data-param");
    var subProductType = subProducts[productType];
    $('.product-type .box').attr('data-param', productType);

    if($target.is("span")){
        $(".header-product .box span").removeClass("span-active");
        $target.addClass("span-active");
        $("#header-product span").text($target.text())
        $("#header-product i").removeClass("select-active");
        flag2=true;
        openStatus2=false;

        if(subProductType != null && subProductType != undefined){
            var html = ''
            subProductType.forEach(function (item) {
                html += '<span data-param="'+ item.type +'">'+ item.typeName +'</span>';
            });
            $('.product-type-title').html($target.html()+'交易');
            $('.product-sub-type .custom-content').html(html);
            $('.product-sub-type').show();
        } else {
            $('.product-sub-type').hide();
            $(".header-mask").hide();
            $(".header-product").hide();
            showData = new Map();
            queryPayRecords(1);
        }
    }
});
$(".header-product .custom").on("click",function (event) {
    var $target=$(event.target);
    $('.product-type .custom').attr('data-param',$target.attr("data-param"));

    if($target.is("span")){
        $(".header-product .custom span").removeClass("span-active");
        $target.addClass("span-active");
        $("#header-product span").text($target.text())
        $("#header-product i").removeClass("select-active");
        $(".header-mask").hide();
        $(".header-product").hide();
        flag2=true;
        openStatus2=false;
        showData = new Map();
        queryPayRecords(1);
    }
});

$("#header-time").click(function () {
    $(".header-more").hide();
    if(openStatus1){
        $(".header-mask").hide();
        $(".header-deal").hide();
        $("#header-deal i").removeClass("select-active");
        flag1=true;
        openStatus1=false;
        return;
    }
    if(openStatus2){
        $(".header-mask").hide();
        $(".header-product").hide();
        $("#header-product i").removeClass("select-active");
        flag2=true;
        openStatus2=false;
        return;
    }
    if(flag3){
        $(".header-mask").show();
        $(".header-time").show();
        $("#header-time i").addClass("select-active");
        flag3=false;
        openStatus3=true;
    }else{
        $(".header-mask").hide();
        $(".header-time").hide();
        $("#header-time i").removeClass("select-active");
        flag3=true;
        openStatus3=false;
    }
});
$(".header-time").on("click",function (event) {
    var $target=$(event.target);
    $('.trade-date').attr('data-param',$target.attr("data-param"));

    if($target.is("span")){
        $(".header-time span").removeClass("span-active");
        $target.addClass("span-active");
        $("#header-time span").text($target.text());
        $("#header-time i").removeClass("select-active");
        flag3=true;
        openStatus3=false;
        if($target.text()=='自定义'){
            $(".header-time .custom").show();
        }else {
            $(".header-time .custom").hide();
            $(".header-mask").hide();
            $(".header-time").hide();
            showData = new Map();
            queryPayRecords(1);
        }
    }
});
$('.btn-confirm').click(function () {
    var sDate = ($("#time1").val()).replace(/\-/g, '');
    var eDate = ($("#time2").val()).replace(/\-/g, '');
    if(App.isNotEmpty(sDate) && App.isNotEmpty(eDate)){
        if(Number(sDate) > Number(eDate)){
            alertTips('<div style="line-height: 1.5;">开始时间不能大于结束时间</div>', '确定');
        }else {
            $(".header-more").hide();
            $(".header-mask").hide();
            showData = new Map();
            queryPayRecords(1);
        }
    } else {
        alertTips('<div style="line-height: 1.5;">请选择日期</div>', '确定');
    }
});

//mask Click
$(".header-mask").click(function () {
    flag1=true;
    flag2=true;
    flag3=true;
    openStatus1=false;
    openStatus2=false;
    openStatus3=false;
    $(".header ul li i").removeClass("select-active");
    $(".header-more").hide();
    $(this).hide();
});

//    时间插件
var calendarym1 = new LCalendar();
var calendarym2 = new LCalendar();

calendarym1.init({
    'trigger': '#time1',
    'type': 'date',
    'minDate':'2016-10-01',//最小日期 注意：该值会覆盖标签内定义的日期范围
    'maxDate':new Date().getFullYear()+ '-' + (new Date().getMonth()+1)+'-'+new Date().getDate()//最大日期 注意：该值会覆盖标签内定义的日期范围
});
calendarym2.init({
    'trigger': '#time2',
    'type': 'date',
    'minDate':'2016-10-01',//最小日期 注意：该值会覆盖标签内定义的日期范围
    'maxDate':new Date().getFullYear()+ '-' + (new Date().getMonth()+1)+'-'+new Date().getDate()//最大日期 注意：该值会覆盖标签内定义的日期范围
});


var flag=true;
$(".content1").on("click",function (event) {

    var $target=$(event.target);

    if($target.is("i")){
        if($target.hasClass("all")){
            if(flag){
                $(".content1 i").addClass("active");
                flag=false;
            }else{
                $(".content1 i").removeClass("active");
                flag=true;
            }
        }
        if(!$target.hasClass("all")&&$target.hasClass("active")){
            $target.removeClass("active")
        }else if(!$target.hasClass("all")){
            $target.addClass("active");
        }
    }

    event.preventDefault();
});
$(".down-start").click(function () {
    $(this).hide();
    $(".download").show();
    $(".content i").show();
})
$(".cancel").click(function () {
    $(".download").hide();
    $(".down-start").show();
    $(".content i").hide();
})