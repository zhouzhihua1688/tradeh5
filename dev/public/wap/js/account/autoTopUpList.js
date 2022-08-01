$(function() {
    queryAutoTopUpList();
    $(".btn-remove").click(function() {
        $(this).parents('.father-li').remove();
        window.location.href = "removePassword.html"
    });
    $(".btn-stop").click(function() {
        if ($(this).hasClass('btn-recover')) {
            $(this).html('暂停');
            $(".box-style-1 .Bomb-box-main .no-tips").html('自动充值计划已恢复');
            $(this).parents('li').removeClass('pause');
            $(this).removeClass('btn-recover');
        } else {
            $(this).html('恢复');
            $(".box-style-1 .Bomb-box-main .no-tips").html('自动充值计划已暂停');
            $(this).parents('li').addClass('pause');
            $(this).addClass('btn-recover');
        }
    })
});

function queryAutoTopUpList() {
    var url = '/ats-ng/v1/manage/contract-query/autorecharge-cashplus?pageNo=1&isAllFlag=0&date=' + (new Date()).getTime();
    App.get(url, null, function(result) {
        var list = result.body;
        if (list.length == 0) {
            window.location.href = "./gongzibao.html"
        } else {
            App.setSession(App.autoTopUpList, list);
            showAutoTopUpList(list);
        }
    })
}

function showAutoTopUpList(list) {
    var arr = [];
    for (var index in list) {
        var plan = list[index];
        var date = tranMipCycle(plan.cycle) + tranMipBuyday(plan.cycle, Number(plan.payDate));
        var unit = '';
        if (plan.cycle == "MM") {
            unit = '月'
        } else if (plan.cycle == "2W") {
            unit = '双周'
        } else if (plan.cycle == "WW") {
            unit = '周'
        }
        var isPause = plan.contractStatus == 'P';
        arr.push('<li class="father-li ' + (isPause ? 'pause' : '') + '">');
        arr.push('<p class="bottom-border"><i class="settled-icon"></i>' + plan.contractDesc + '<span>' + plan.contractStDesc + '</span></p>');
        arr.push('<ol class="bottom-border">');
        arr.push('	<li>');
        arr.push('		<label for="">银行卡</label><span>' + plan.bankGrpName + '（' + plan.bankAccoDisplay + '）</span>');
        arr.push('	</li>');
        arr.push('	<li>');
        arr.push('		<label for="">充值金额</label><span>' + App.numberFormat(plan.payAmtDisplay) + '</span>');
        arr.push('	</li>');
        arr.push('	<li>');
        arr.push('		<label for="">充值日期</label><span>' + date + '</span>');
        arr.push('	</li>');
        arr.push('	<li>');
        arr.push('		<label for="">最近扣款日</label><span>' + plan.nextPayDate.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3') + '</span>');
        arr.push('	</li>');
        arr.push('</ol>');
        arr.push('<div class="settled-btn">');
        arr.push('	<a class="btn-remove" href="javascript:;" onclick="handlePlan(\'' + plan.contractNo + '\', \'cancel\')">删除</a>');
        if (isPause) {
            arr.push('	<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + plan.contractNo + '\', \'restart\')">恢复</a>')
        } else {
            arr.push('	<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + plan.contractNo + '\', \'pause\')">暂停</a>')
        }
        arr.push('	<a class="btn-revise" href="javascript:;" onclick="modifyPlan(\'' + plan.contractNo + '\')">修改</a>');
        arr.push('</div>');
        arr.push('</li>')
    }
    $(".settled-main ul").html(arr.join(""))
}

function modifyPlan(contractno) {
    var list = App.getSession(App.autoTopUpList);
    var listObj = list.filter(function(item){
        return item.contractNo == contractno;
    })[0];
    var url = '';
    if(listObj.contractType == 1){ // 现金宝合约
        url = '/ats-ng/v1/manage/contract-query/autorecharge-contractno';
    }
    else { // 其它合约
        url = '/ats-ng/v1/manage/contract-query/common-contractno';
    }
    url += '?contractNo=' + contractno;
    App.get(url, null, function(result) {
        var body = result.body;
        App.setSession(App.autoTopUpModifyInfo, body);
        window.location.href = "./autoTopUpCM.html?handTp=M";
    });
}

function handlePlan(contractno, handleTp) {
    var list = App.getSession(App.autoTopUpList);
    var listObj = list.filter(function(item){
        return item.contractNo == contractno;
    })[0];
    var handleUrl = '';
    if(listObj.contractType == 1){ // 现金宝合约
        handleUrl = '/ats-ng/v1/manage/contract-query/autorecharge-contractno';
    }
    else { // 其它合约
        handleUrl = '/ats-ng/v1/manage/contract-query/common-contractno';
    }
    handleUrl += '?contractNo=' + contractno;
    App.get(handleUrl, null, function(handleUrlResult) {
        // var url = App.projectNm + "/etrading/auto_recharge_handle";
        var url = '/mobile-bff/v1/etrading/auto-recharge-handle';
        var data = JSON.stringify({
            contractNo: contractno,
            handleTp: handleTp,
            productId: handleUrlResult.body.productId
        });
        utils.post(url, data, null, function(result) {
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, handleTp);
            App.setSession(App.serialNo_forword_url, "/mobileEC/wap/account/autoTopUpHandleSuccess.html");
            utils.verifyTradeChain(result.body);
            // window.location.href = "../common/setPassword.html"
        })
    });
}