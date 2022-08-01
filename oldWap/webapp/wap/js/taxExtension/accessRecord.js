var pageNo = 1;
var showData = new Map();
$(function(){
    //select展示
    displaySelects();
    //默认加载数据
    queryPayRecords();

});

$("#selectYear").change(function () {
    pageNo = 1;
    showData = new Map();
    queryPayRecords();
});

$("#selectMonth").change(function () {
    pageNo = 1;
    showData = new Map();
    queryPayRecords();
});

$("#selectTaxRecordTp").change(function () {
    pageNo = 1;
    showData = new Map();
    queryPayRecords();
});

$(".data_more").click(function () {
    pageNo++;
    queryPayRecords();
});

function displaySelects() {
    //年份处理
    var startYear = 2019;
    var nowDate = new Date();
    var currentYear = nowDate.getFullYear();
    for (var i = startYear; i<=currentYear; i++) {
        $("#selectYear").append("<option value='" + i + "'>" + i + "</option>");
    }
    $("#selectYear").val(currentYear);
}

function queryPayRecords() {
    //清空展示
    $(".contentBody").html("");
    $(".data_more").hide();

    // var tradeType = $("#selectTaxRecordTp").val();
    var selectMonth = $("#selectMonth").val();
    var selectYear = $("#selectYear").val();

    var startDate;
    var endDate;
    if (selectMonth != null && selectMonth != "") {
        startDate = new Date(selectYear, selectMonth,1);
        endDate = new Date(selectYear, Number(selectMonth) + 1,0);
    } else {
        startDate = new Date(selectYear, 0,1);
        endDate = new Date(Number(selectYear)+1, 0, 0);
    }
    var startTime = App.formatTargetDateStr("yyyyMMdd", startDate);
    var endTime = App.formatTargetDateStr("yyyyMMdd", endDate);
    var itemPerPage = 20;
    var url = "/ags/v1/funds/query-payrecord?"
                + "startTime=" + startTime + "&endTime=" + endTime
                + "&pageNo=" + pageNo + "&itemPerPage=" + itemPerPage
                + "&downloadFlag=0";
                // + "&tradeType=" + tradeType
    App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
            var payTradeRecordList = result.body;
            if (payTradeRecordList != undefined && payTradeRecordList != null) {
                payTradeRecordList.forEach(function (item) {
                    if(App.isNotEmpty(item.apdt)){
                        var intiAckdt =App.strToDate(item.apdt);
                        var currentDateDisplay = App.formatTargetDateStr("yyyy-MM", intiAckdt);
                        var list = showData.get(currentDateDisplay);
                        if(App.isNotNull(list)){
                            list.push(item);
                        } else {
                            var newList = new Array();
                            newList.push(item);
                            showData.set(currentDateDisplay, newList);
                        }
                    }
                });
                if(pageNo == 1 && payTradeRecordList.length == 0){
                    alertTips('<div style="line-height: 1.5;">税延凭证最快将在交易成功后一个交易日生成。当前暂无税延凭证。</div>');
                }else {
                    drawingHtml();
                    if (payTradeRecordList.length >= itemPerPage) {
                        $(".data_more").show();
                    }

                    //绑定事件勾选事件
                    $(".content").on("click", function (event) {
                        selectedEvent(event);
                    });

                    //下载事件
                    $(".affirm").click(function () {
                        downloadFile();
                    });
                }
            }
        }
    });
}

function drawingHtml() {
    if(App.isNotNull(showData)){
        var index = 1;
        var html = '';
        showData.forEach(function (list, key) {
            if (App.isNotNull(list)){

                var listHtml = '';
                list.forEach(function (item) {
                    if(App.isNotEmpty(item.apdt)){
                        var intiAckdt =App.strToDate(item.apdt);
                        var currentAckDtFormat = App.formatTargetDateStr("yyyy-MM-dd", intiAckdt);
                        var subAmt = App.isNotNull(item.subAmt) ? item.subAmt : "--";
                        listHtml += '<ul class="list">' +
                                    '   <li class="zh">' +
                                    '       <span>'+ item.fundname +'</span><span>'+ item.fundid +'</span>' +
                                    '   </li>' +
                                    '   <li><span>'+ App.formatMoney(subAmt) +'元</span><span>'+ item.tradeStatusDesc +'</span></li>' +
                                    '   <li><span>'+ currentAckDtFormat +'</span><span>'+ item.tradeType +'</span>'+
                                        (App.isNotEmpty(item.taxAdvanCode) ? '<i class="choose" data-serial-no="'+ item.serialno +'"></i>' : '') +
                                    '   </li>' +
                                    '</ul>';
                    }
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
    }
}

function selectedEvent(event) {
    var $curTarget = $(event.target);
    if($curTarget.is("i")){
        $curTarget.toggleClass("active");
    }
    if($curTarget.parent().hasClass("content-title")){
        var $contentList = $curTarget.parents(".content").find(".content-list");
        if($contentList != null && $contentList != undefined) {
            if($curTarget.hasClass("active")){
                $contentList.find(".choose").addClass("active");
            } else {
                $contentList.find(".choose").removeClass("active");
            }
        }
    }
    if($curTarget.parent().is("li")){
        var $iList = $curTarget.parents(".content-list").find("i");
        var temp = 0;
        $iList.each(function (index, i) {
            if($(i).hasClass("active")){
                temp++;
            }
        });
        var $chooseAll = $curTarget.parents(".content").find(".content-title i");
        if(temp == $iList.length){
            $chooseAll.addClass("active");
        } else {
            $chooseAll.removeClass("active");
        }
    }
    event.preventDefault();
}

function downloadFile(){
    var serialNoListStr = "";
    //获取所有选中的记录
    var totalCount = 0;
    $(".content i").each(function () {
        if ($(this).hasClass("active")) {
            var dataSerialNo = $(this).attr("data-serial-no");
            if (typeof dataSerialNo != typeof undefined && dataSerialNo != false) {
                totalCount++;
                serialNoListStr += dataSerialNo + ",";
            }
        }
    });
    if (totalCount == 0) {
        alertTips('<div style="line-height: 1.5;">暂无下载记录</div>');
        return;
    } else {
        serialNoListStr = serialNoListStr.substring(0, serialNoListStr.length-1);
        window.location.href = "/ags/v1/funds/gen-taxadvancode?downloadType=inline&serialNoList=" + serialNoListStr;
    }
}
