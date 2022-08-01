$(function(){
    queryPlanList(pageNo++);
});
var pageNo = 1;

$(".more-btn").click(function () {
    queryPlanList(pageNo++);
});

function queryPlanList(pageNo) {
    var data = {};
    data.agreementId = [20,21];
    data.isAllFlag = '1';
    data.pageNo = pageNo;
    data.pageSize = 10;
    App.post("/ats-ng/v1/manage/contract-query/common-page-list", JSON.stringify(data), null, function (result) {
        if (result.body != undefined && result.body != null) {
            var planList = result.body;
            var planHtml = '';
            planList.forEach(function (item) {
                var showAmt = item.agreementId == '21' ? '自动足额购买' : ('购买'+ item.payAmtDisplay +'元');
                var showDate = item.cycle == 'MM' ? '每月' + Number(item.payDate) + '日' : dateFormat(item.payDate);
                var showStatus = '';
                if(item.contractStatus == 'C'){
                    showStatus = '<a href="javascript:;">已终止</a>';
                } else if(item.contractStatus == 'P'){
                    showStatus = '<a href="javascript:;">已暂停</a>';
                } else if(item.contractStatus == 'A'){
                    showStatus = '<a href="javascript:;">已失效</a>';
                }
                planHtml += '<div class="list list1" onclick="queryDetail(\''+ item.contractNo +'\')">\n' +
                    '        <h4><i></i><span>'+ item.contractDesc +'</span>'+ showStatus +'</h4>\n' +
                    '        <div class="plan-time"><span>' + showDate + '</span><span>'+ showAmt +'</span><a class=" iconi icon-arrow-right"></a></div>\n' +
                    '        <div class="fundname-time"><span class="fl">'+ item.fundName +' ('+ item.productId +')</span><span class="fr">'+ App.formatDateStr(item.nextPayDate) +'</span></div>\n' +
                    '    </div>';
            });
            $(".list-view").append(planHtml);
            if(planList == undefined || planList == null || planList.length == 0){
                $('.more-div').hide();
            }
        }
    });
}

function dateFormat(date) {
    if(App.isEmpty(date)) return '';
    return date.substr(4,2) + '月' + date.substr(6,2) + '日';
}
function queryDetail(contractNo) {
    window.location.href = 'autoDepositHistoryDetails.html?cNo=' + contractNo;
}