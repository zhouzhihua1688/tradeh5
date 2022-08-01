$(function() {
    function init() {
        var sid = App.getUrlParam("sid");
        var tradeList = App.getSession(App.tradeInfoList);
        var trade;
        for (var index in tradeList) {
            var t = tradeList[index];
            var accountTrade = t.accountTrade;
            var fundTrade = t.fundTrade;
            var financialTrade = t.financialTrade;
            var creditRepay = t.creditRepay;
            var mobileRecharge = t.mobileRecharge;
            var tradeSid = t.serialNo + '-';
            if (accountTrade != null) {
                tradeSid += accountTrade.tradeDate
            } else if (fundTrade != null) {
                tradeSid += fundTrade.tradeDate
            } else if (financialTrade != null) {
                tradeSid += financialTrade.tradeDate
            } else if (creditRepay != null) {
                tradeSid += creditRepay.tradeDate
            } else if (mobileRecharge != null) {
                tradeSid += mobileRecharge.tradeDate
            };
            if (tradeSid == sid) {
                trade = t
            }
        };
        if (trade != undefined || trade != null) {
            var html = showTradeDetailInfo(trade);
            $("#trade_detail_panel").empty();
            $("#trade_detail_panel").append(html)
        }
    };
    init()
});

function showTradeDetailInfo(trade) {
    var serialNo = trade.serialNo;
    var apKind = trade.apKind;
    var remark = trade.remark;
    var cancelFlag = trade.cancelFlag;
    var accountTrade = trade.accountTrade;
    var fundTrade = trade.fundTrade;
    var financialTrade = trade.financialTrade;
    var creditRepay = trade.creditRepay;
    var mobileRecharge = trade.mobileRecharge;
    var html = "";
    if (accountTrade != null) {
        $("#trade_title_panel").html("账户交易查询");
        html += setDetailInfoRow("交易类型", TradeTools.tradeType(apKind));
        html += setDetailInfoRow("支付卡号", accountTrade.bankNm + TradeTools.getDisplayAcco(accountTrade.bankAcco));
        var apKind_list = "900,922,924,925,926,930,939,952,969";
        var subAmtTxt = TradeTools.getAmt(accountTrade.subQuty, accountTrade.subAmt, apKind, apKind_list);
        if (String(subAmtTxt).indexOf("元") > -1) {
            html += setDetailInfoRow("交易金额", subAmtTxt)
        } else if (String(subAmtTxt).indexOf("份") > -1) {
            html += setDetailInfoRow("交易份额", subAmtTxt)
        };
        html += setDetailInfoRow("交易时间", accountTrade.tradeDate);
        html += setDetailInfoRow("交易状态", TradeTools.tradeStates(accountTrade.tradeSt));
        html += setDetailInfoRow("备注", remark)
    } else if (fundTrade != null) {
        var apKinds = "020,021,022,023,039,049,024";
        $("#trade_title_panel").html("基金交易查询");
        html += setDetailInfoRow("交易类型", TradeTools.tradeType(apKind));
        html += setDetailInfoRow("基金代码", fundTrade.fundId);
        html += setDetailInfoRow("基金名称", fundTrade.fundNm);
        if (apKinds.indexOf(apKind) != -1) {
            html += setDetailInfoRow("支付卡号", fundTrade.bankNm + TradeTools.getDisplayAcco(fundTrade.bankAcco))
        };
        var apKind_list = "020,021,022,023,039,049,920,940,949,950,043,142,143,024,951,036";
        var subAmtTxt = TradeTools.getAmt(fundTrade.subQuty, fundTrade.subAmt, apKind, apKind_list);
        if (String(subAmtTxt).indexOf("元") > -1) {
            html += setDetailInfoRow("交易金额", subAmtTxt)
        } else if (String(subAmtTxt).indexOf("份") > -1) {
            html += setDetailInfoRow("交易份额", subAmtTxt)
        };
        html += setDetailInfoRow("交易时间", fundTrade.tradeDate);
        html += setDetailInfoRow("交易状态", TradeTools.tradeStates(fundTrade.tradeSt));
        html += setDetailInfoRow("备注", remark)
    } else if (financialTrade != null) {
        var apKinds = "020,021,022,023,024,025";
        $("#trade_title_panel").html("理财交易查询");
        html += setDetailInfoRow("交易类型", TradeTools.tradeType(apKind));
        html += setDetailInfoRow("理财产品", financialTrade.fundNm);
        if (apKinds.indexOf(apKind) != -1) {
            html += setDetailInfoRow("支付卡号", financialTrade.bankNm + TradeTools.getDisplayAcco(financialTrade.bankAcco))
        };
        var apKind_list = "020,021,022,023,025,920,940,949,950,024,951";
        var subAmtTxt = TradeTools.getAmt(financialTrade.subQuty, financialTrade.subAmt, apKind, apKind_list);
        if (String(subAmtTxt).indexOf("元") > -1) {
            html += setDetailInfoRow("交易金额", subAmtTxt)
        } else if (String(subAmtTxt).indexOf("份") > -1) {
            html += setDetailInfoRow("交易份额", subAmtTxt)
        };
        html += setDetailInfoRow("交易时间", financialTrade.tradeDate);
        html += setDetailInfoRow("交易状态", TradeTools.tradeStates(financialTrade.tradeSt));
        html += setDetailInfoRow("备注", remark)
    } else if (creditRepay != null) {
        $("#trade_title_panel").html("信用卡还款查询");
        var credit = creditRepay.credit;
        html += setDetailInfoRow("交易类型", "信用卡自助还款");
        html += setDetailInfoRow("交易时间", creditRepay.tradeDate, true);
        html += setDetailInfoRow("银行名称", credit.bankNm == "" ? credit.bankNo : credit.bankNm);
        html += setDetailInfoRow("银行卡号", TradeTools.getDisplayAcco(credit.cardNbr), true);
        html += setDetailInfoRow("还款金额", App.numberFormat(creditRepay.subAmt) + "元");
        html += setDetailInfoRow("交易状态", TradeTools.tradeStates(creditRepay.tradeSt));
        html += setDetailInfoRow("备注", remark)
    } else if (mobileRecharge != null) {
        $("#trade_title_panel").html("手机充值查询");
        html += setDetailInfoRow("交易类型", "手机充值");
        html += setDetailInfoRow("交易时间", mobileRecharge.tradeDate);
        html += setDetailInfoRow("充值金额", App.numberFormat(mobileRecharge.subAmt) + "元");
        html += setDetailInfoRow("手机号码", App.getDisplayMob(mobileRecharge.mobileNo));
        html += setDetailInfoRow("交易状态", TradeTools.tradeStates(mobileRecharge.tradeSt));
        html += setDetailInfoRow("备注", remark)
    };
    return html
};

function setDetailInfoRow(name, value) {
    var html = "<div class='trade-detail-list'>" + "<div class='left1'>" + name + "</div><div class='right1' " + (value.indexOf("处理中") > -1 ? "style='color:red'" : "") + ">" + value + "</div></div>";
    return html
};

function setDetailInfoRow(name, value, flag) {
    var html = "<div class='trade-detail-list'>" + "<div class='left1'>" + name + "</div><div class='right1' ";
    if (flag) {
        html += " style='color:red' "
    } else {
        html += (value.indexOf("处理中") > -1 ? " style='color:red' " : " ")
    };
    html += ">" + value + "</div></div>";
    return html
}