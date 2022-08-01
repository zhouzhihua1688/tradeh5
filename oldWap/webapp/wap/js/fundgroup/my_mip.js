$(function () {
    $('.tab3 li').click(function () {
        if ($(this).index() == 0){
            //基金定投
            $(".goto-create-mip a").attr("href", "../fund/all_funds.html");
            $(".fund-mip-body").show();
            $(".fund-group-mip-body").hide();
        } else {
            //组合定投
            $(".goto-create-mip a").attr("href", "../wezhan/combinationZone.html");
            $(".fund-mip-body").hide();
            $(".fund-group-mip-body").show();
        }
        if ($(this).hasClass("active")) {
            return;
        }
        $(this).addClass("active").siblings().removeClass('active');
        // $(this).parent().next("qiehuan").hide().eq($(this).index()).show();
        $(this).parent().siblings().hide().eq($(this).index()).show()

    });
    if (App.getUrlParam("showTp") == 0){
        //基金定投
        $(".tab3 li").eq(0).addClass("active").siblings().removeClass('active');
        $(".goto-create-mip a").attr("href", "../fund/all_funds.html");
        $(".fund-mip-body").show();
        $(".fund-group-mip-body").hide();
    } else {
        //组合定投
        $(".tab3 li").eq(1).addClass("active").siblings().removeClass('active');
        $(".goto-create-mip a").attr("href", "../wezhan/combinationZone.html");
        $(".fund-mip-body").hide();
        $(".fund-group-mip-body").show();
    }
    queryFundMipList();
    queryFundGroupMipList();
});
function queryFundMipList() {
    var url = App.projectNm + "/fund/holding_mips?pageNo=1&pageSize=100&r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var fundMips = result.body.fundMips;
            var html = "";
            if (fundMips != undefined && fundMips != null){
                fundMips.forEach(function (item) {
                    html += "<div class=\"title_tip\"></div>\n" +
                        "<div class=\"qiehuan_content\">\n" +
                        "                <table>\n" +
                        "                    <thead class=\"thead\">\n" +
                        "                        <tr>\n" +
                        "                            <td>"+ item.mipDesc + (item.isintelligentmip == "Y" ? "<span>智投</span>":"")  + (item.istargetProfitmip == "Y" ? "<span>目标盈</span>":"") + "</td>\n" +
                        "                            <td class=\""+ (item.contractSt == "N" ? "color-red" : "") +"\">"+ getMipStatusDesc(item.contractSt) +"</td>\n" +
                        "                        </tr>\n" +
                        "                    </thead>\n" +
                        "                </table>\n" +
                        "                <table class=\"tbody\">\n" +
                        "                        <tr>\n" +
                        "                            <td>基金名称</td>\n" +
                        "                            <td>每期基础金额(元)</td>\n" +
                        "                        </tr>\n" +
                        "                        <tr>\n" +
                        "                            <td>"+ item.fund.fundNm+"</td>\n" +
                        "                            <td>"+ App.formatMoney(item.mipbuyamt) +"</td>\n" +
                        "                        </tr>\n" +
                        "                        <tr>\n" +
                        "                            <td>扣款时间</td>\n" +
                        "                            <td>下次扣款日期</td>\n" +
                        "                        </tr>\n" +
                        "                        <tr>\n" +
                        "                            <td >"+ (item.mipcycle == "ED" ? getDeductionDesc(item.mipcycle) : (getDeductionDesc(item.mipcycle) + getMipbuydayDesc(item.mipcycle, item.mipbuyday))) +"</td>\n" +
                        "                            <td>"+ item.nextBuyDate +"</td>\n" +
                        "                        </tr>\n" +
                        (
                            item.isintelligentmip == "Y" ?
                                ("                        <tr>\n" +
                                    "                            <td>目标收益率</td>\n" +
                                    "                            <td>当前收益率</td>\n" +
                                    "                        </tr>\n" +
                                    "                        <tr>\n" +
                                    (item.istargetProfitmip == "Y" ?
                                        "                            <td class=\""+ (Number(item.targetProfit) >= 0? "color-red" : "color-green") +"\">" + item.targetProfit + "%</td>\n":
                                        "                            <td class=\"color-green\">--</td>\n") +
                                    (item.istargetProfitmip == "Y" ?
                                        "                            <td class=\""+ (Number(item.currentProfit) >= 0? "color-red" : "color-green") +"\">" + item.currentProfit + "%</td>\n":
                                        "                            <td class=\"color-green\">--</td>\n") +
                                    "                        </tr>")
                                : ""

                        )
                         +
                        "                </table>\n" +
                        "            </div>";
                });
            }
            if(App.isEmpty(html)){
                $(".fund-mip-body").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
            } else {
                $(".fund-mip-body").html(html);
            }
        }
    });
}
function queryFundGroupMipList() {
    var url = App.projectNm + "/adviser/fund_group_mip_list?fundGroupType=&pageNo=1&pageSize=100&r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var groupFundMipList = result.body.groupFundMipList;
            var html = "";
            if (groupFundMipList != undefined && groupFundMipList != null){
                groupFundMipList.forEach(function (item) {
                    html += "<div class=\"title_tip\"></div>\n" +
                        "                    <div class=\"qiehuan_content\">\n" +
                        "                        <table>\n" +
                        "                            <thead class=\"thead\">\n" +
                        "                            <tr>\n" +
                        "                                <td>"+ item.groupName +"</td>\n" +
                        "                                <td class=\""+ ((item.contractSt == "N" ? "color-red" : "")) +"\">"+ getMipStatusDesc(item.contractSt) +"</td>\n" +
                        "                            </tr>\n" +
                        "                            </thead>\n" +
                        "                        </table>\n" +
                        "                        <table class=\"tbody\">\n" +
                        "                            <tr>\n" +
                        "                                <td >每期定投金额(元)</td>\n" +
                        "                                <td >扣款日期</td>\n" +
                        "                                <td >下次扣款日期</td>\n" +
                        "                            </tr>\n" +
                        "                            <tr>\n" +
                        "                                <td >"+ App.formatMoney(item.mipbuyamt) +"</td>\n" +
                        "                                <td>"+ (item.mipcycle == "ED" ? getDeductionDesc(item.mipcycle) : (getDeductionDesc(item.mipcycle) + getMipbuydayDesc(item.mipcycle, item.mipbuyday))) +"</td>\n" +
                        "                                <td>" + item.nextBuyDate + "</td>\n" +
                        "                            </tr>\n" +
                        "                        </table>\n" +
                        "                    </div>";
                });
            }
            if(App.isEmpty(html)){
                $(".fund-group-mip-body").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
            } else {
                $(".fund-group-mip-body").html(html);
            }
        }
    });
}
var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": []
};

function getMipbuydayDesc(deduction, mipBuyday) {
    if (deduction == "ED"){
        return "---";
    } else {
        if(App.isEmpty(mipBuyday)){
            return "---";
        }
        var chooseTime2 = chooseTime[deduction];
        var desc = chooseTime2[Number(mipBuyday) - 1];
        return desc;
    }
}

function getDeductionDesc(deduction) {
    var result = "";
    if (App.isNotEmpty(deduction)) {
        switch (deduction) {
            case "MM":
                result = "每月";
                break;
            case "2W":
                result = "每双周";
                break;
            case "WW":
                result = "每周";
                break;
            case "ED":
                result = "每日";
                break;
        }
    }
    return result;
}

function getMipStatusDesc(status) {
    var result = "";
    if (App.isNotEmpty(status)) {
        switch (status) {
            case "N":
                result = "定投中";
                break;
            case "C":
                result = "终止";
                break;
            case "P":
                result = "暂停";
                break;
            case "A":
                result = "失效";
                break;
        }
    }
    return result;
}