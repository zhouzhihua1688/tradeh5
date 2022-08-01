$(function () {
    queryFundGroupList();
});

function queryFundGroupList() {
    var fundGroupType = App.getUrlParam("fundGroupType");
    var url = App.projectNm + "/adviser/holding_fund_group_list?fundGroupType="+ fundGroupType +"&r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var body = result.body;
            if(body != undefined && body != null) {
                $("#totalFGAsset").html(App.formatMoney(body.totalFGAsset));
                if (App.isNotEmpty(body.totalFGAsset)){
                    if (body.totalFGAsset != "--" && Number(body.totalFGAsset) < 0){
                        $("#totalFGAsset").css("color","#009944");
                    }
                } else {
                    $("#totalFGAsset").css("color","#009944");
                }
                $("#totalFGYesterdayProfit").html(App.formatMoney(body.totalFGYesterdayProfit));
                if (body.totalFGYesterdayProfit != "--" && App.isNotEmpty(body.totalFGYesterdayProfit) && Number(body.totalFGYesterdayProfit) < 0){
                    $("#totalFGYesterdayProfit").removeClass("red").addClass("color-green");
                }
                $("#totalFGIncome").html(App.formatMoney(body.totalFGIncome));
                if (body.totalFGIncome != "--" && App.isNotEmpty(body.totalFGIncome) && Number(body.totalFGIncome) < 0){
                    $("#totalFGIncome").removeClass("red").addClass("color-green");
                }
                $("#totalFGProfit").html(App.formatMoney(body.totalFGProfit));
                if (body.totalFGProfit != "--" && App.isNotEmpty(body.totalFGProfit) && Number(body.totalFGProfit) < 0){
                    $("#totalFGProfit").removeClass("red").addClass("color-green");
                }
                $("title").html(body.myFundGroupTypeTitle);
                var html = "";
                var holdFundGroups = result.body.holdFundGroups;
                if(holdFundGroups != undefined && holdFundGroups != null) {
                    holdFundGroups.forEach(function (item) {
                        html += "<div onclick='gotoHoldingDetails(\""+ item.groupid +"\",\"" + item.balanceSerialNo +"\")' class=\"qiehuan content1_1\"\">\n" +
                            "               <div class=\"qiehuan_content\">\n" +
                            "                   <table>\n" +
                            "                       <tr>\n" +
                            "                           <td>"+ item.groupname +" <span style=\"color:#999999;font-size: .6rem\">"+ item.groupid +"</span></td>\n" +
                            "                           <td class=\"color-red\">"+ (item.isHasMip == 1 ? "  定投中":"" ||item.dividendCount == 1 ? "分红中" : "") +"</td>\n" +
                            "                       </tr>\n" +
                            "                   </table>\n" +
                            "                   <table>\n" +
                            "                        <tr>\n" +
                            "                            <td>参考市值</td>\n" +
                            "                            <td class=\"\" style=\"padding-left:2.5rem\">持有盈亏</td>\n" +
                            "                            <td class=\"\">昨日盈亏("+ item.incomeDate +")</td>\n" +
                            "                        </tr>                    \n" +
                            "                        <tr>\n" +
                            "                            <td style=\"color:#000\">"+ App.formatMoney(item.holdingAsset) +"</td>\n" +
                            "                            <td class=\""+ (item.holdingProfit < 0 ? "color-green" : "color-red") +"\" style=\"padding-left:2.5rem\">"+ App.formatMoney(item.holdingProfit) +"</td>\n" +
                            "                            <td class=\""+ (item.income < 0 ? "color-green" : "color-red") +"\">"+ item.income +"("+ item.yesterdayProfitRate +"%)</td>\n" +
                            "                        </tr>                        \n" +
                            "                    </table>\n" +
                            "               </div>\n" +
                            (item.unConfirmedCount > 0 ? ("<div class=\"prompt\"><p style=\"margin-left: 0.8rem; display: inline-block;\"><span style=\"color: rgb(244, 51, 60);\">"+ item.unConfirmedCount +"</span>笔交易确认中</p></div>") : "") +
                            "               <div class=\"gary_bg\"></div>\n" +
                            "            </div>";
                    });
                }
                $(".fund-group-list").html(html);
            }
        }
    });
}
function gotoHoldingDetails(groupId, balanceSerialNo) {
    window.location.href = "hold_group_fund_details.html?groupId=" + groupId +"&balanceSerialNo=" + balanceSerialNo;
}