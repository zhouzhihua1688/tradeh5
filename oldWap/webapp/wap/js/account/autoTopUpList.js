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
    var url = App.projectNm + "/etrading/auto_recharge_query?date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        var list = result.body.list;
        if (list.length == 0) {
            window.location.href = "./gongzibao.html"
        } else {
            App.setSession(App.autoTopUpList, list);
            showAutoTopUpList(list)
        }
    })
};

function showAutoTopUpList(list) {
    var arr = [];
    for (var index in list) {
        var plan = list[index];
        var date = tranMipCycle(plan.mipCycle) + tranMipBuyday(plan.mipCycle, plan.mipBuyday);
        var unit;
        if (plan.mipCycle == "MM") {
            unit = '月'
        } else if (plan.mipCycle == "2W") {
            unit = '双周'
        } else if (plan.mipCycle == "WW") {
            unit = '周'
        };
        var isPause = plan.contractst == 'P';
        arr.push('<li class="father-li ' + (isPause ? 'pause' : '') + '">');
        arr.push('<p class="bottom-border"><i class="settled-icon"></i>' + plan.mipDesc + '<span>' + plan.contractstNm + '</span></p>');
        arr.push('<ol class="bottom-border">');
        arr.push('	<li>');
        arr.push('		<label for="">银行卡</label><span>' + plan.bankNm + '（' + plan.bankAccoDisplay + '）</span>');
        arr.push('	</li>');
        arr.push('	<li>');
        arr.push('		<label for="">充值金额</label><span>' + App.numberFormat(plan.mipBuyAmt) + '</span>');
        arr.push('	</li>');
        arr.push('	<li>');
        arr.push('		<label for="">充值日期</label><span>' + date + '</span>');
        arr.push('	</li>');
        arr.push('	<li>');
        arr.push('		<label for="">最近扣款日</label><span>' + plan.nextMipDate + '</span>');
        arr.push('	</li>');
        arr.push('</ol>');
        arr.push('<div class="settled-btn">');
        arr.push('	<a class="btn-remove" href="javascript:;" onclick="handlePlan(\'' + plan.contractno + '\', \'cancel\')">删除</a>');
        if (isPause) {
            arr.push('	<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + plan.contractno + '\', \'restart\')">恢复</a>')
        } else {
            arr.push('	<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + plan.contractno + '\', \'pause\')">暂停</a>')
        };
        arr.push('	<a class="btn-revise" href="javascript:;" onclick="modifyPlan(\'' + plan.contractno + '\')">修改</a>');
        arr.push('</div>');
        arr.push('</li>')
    };
    $(".settled-main ul").html(arr.join(""))
};

function modifyPlan(contractno) {
    var list = App.getSession(App.autoTopUpList);
    for (var index in list) {
        var plan = list[index];
        if (plan.contractno == contractno) {
            App.setSession(App.autoTopUpModifyInfo, plan);
            break
        }
    };
    window.location.href = "./autoTopUpCM.html?handTp=M"
};

function handlePlan(contractno, handleTp) {
    var url = App.projectNm + "/etrading/auto_recharge_handle";
    var data = JSON.stringify({
        contractno: contractno,
        handleTp: handleTp
    });
    App.post(url, data, null, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, handleTp);
        App.setSession(App.serialNo_forword_url, "../account/autoTopUpHandleSuccess.html");
        window.location.href = "../common/setPassword.html"
    })
}