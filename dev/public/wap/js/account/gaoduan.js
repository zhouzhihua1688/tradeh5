$(function() {
    var oid = App.getUrlParam("oid");
    $("#querySwitchBtn").attr("href", "http://202.152.179.245/weixin/common/querySwitch_set_tfh.html?oid=" + oid + "&flag=0");
    queryTopAssets()
});

function queryTopAssets() {
    var url = App.projectNm + "/top_financial/holding_top_financial_aessets?date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        if (result.returnCode == 0) {
            var assets = result.body.asset;
            if (assets != undefined && assets != null) {};
            $("#totalAsset").html(App.numberFormat(assets.totalAsset));
            $("#availableAsset").html(App.numberFormat(assets.availableAsset));
            $("#pledgeAsset").html(App.numberFormat(assets.pledgeAsset));
            var financials = result.body.financials;
            var html = "";
            if (financials != undefined && financials != null) {
                for (index in financials) {
                    var fin = financials[index];
                    html += '<li>' + '<div class="title-type clearfix">' + '    <span class="title-type-1">' + fin.fundNm + '</span>' + ((fin.pledgeStatus == '0' || fin.pledgeStatus == '') ? '' : ('<span class="title-type-2">' + (fin.pledgeStatus == '1' ? '可借款' : "质押中") + '</span>')) + '</div>' + '<div class="type-main">' + '     <ol class="clearfix">' + '        <li>' + '            <p>持有资产</p>' + '            <span class="color-red font-arial">' + App.numberFormat(fin.marketValue) + '</span>' + '        </li>' + '        <li>' + '            <p>起息日</p>' + '            <span class="font-arial"> ' + (fin.interestDate == '' ? '&nbsp;' : fin.interestDate) + '</span>' + '        </li>' + '        <li>' + '            <p>预期年化收益率</p>' + '            <span class="font-arial">' + (fin.yieldRate == '' ? '&nbsp;' : fin.yieldRate) + '</span>' + '        </li>' + '        <li>' + '            <p>到期日</p>' + '            <span class="color-red font-arial"> ' + (fin.expireDate == '' ? '&nbsp;' : fin.expireDate) + '</span>' + '        </li>' + '    </ol>' + '</div>' + (fin.intransitNum > 0 ? '<div class="care-for">' + '    <img src="../images/account/gaoduan_tips.png" alt="">' + '    <p><span>' + fin.intransitNum + '</span>笔交易确认中</p>' + '</div>' : '') + '</li>'
                }
            };
            $(".section2 ul").append(html)
        }
    })
}