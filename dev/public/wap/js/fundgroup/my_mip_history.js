$(function () {
    $('.tab3 li').click(function () {
        if ( $(this).index() == 0){
            //基金
            $(".qiehuan").show();
            $(".qiehuan_2").hide();
            $(".more").unbind("click", queryFundGroupMipList);
            $(".more").bind("click", queryFundMipList);
            if(fundMoreDisplay){
                $(".footer_fiexd").show();
            } else {
                $(".footer_fiexd").hide();
            }
        } else {
            //组合
            $(".qiehuan").hide();
            $(".qiehuan_2").show();
            $(".more").unbind("click", queryFundMipList);
            $(".more").bind("click", queryFundGroupMipList);
            if(fundGroupMoreDisplay){
                $(".footer_fiexd").show();
            } else {
                $(".footer_fiexd").hide();
            }
        }

        if ($(this).hasClass("active")) {
            return;
        }
        $(this).addClass("active").siblings().removeClass('active');
        // $(this).parent().next("qiehuan").hide().eq($(this).index()).show();
        $(this).parent().siblings().hide().eq($(this).index()).show()

    });
    $(".more").bind("click", queryFundMipList);
    queryFundMipList();
    queryFundGroupMipList();
});
var fundMoreDisplay = true;
var fundGroupMoreDisplay = true;
var fundPageNo = 1;
var fundGroupPageNo = 1;
function queryFundMipList() {
    var url ="/mobile-bff/v1/fund/queryContractList";
    var data = {
        pageNo:fundPageNo,
        pageSize:100,
        agreementType:'1',
        isAllFlag: '1' //20220713 终止合约传1
    }
    utils.post(url, JSON.stringify(data), function(result){
        if (result.body != undefined && result.body != null){
            var fundMips = result.body;
            var html = "";
            if (fundMips != undefined && fundMips != null){
                fundMips.forEach(function (item) {
                    html += "<div class=\"title_tip\"></div>\n" +
                        "<div class=\"qiehuan_content\"  onclick=\"gotoFundDetails('"+ item.contractNo +"')\">\n" +
                        "                <table>\n" +
                        "                    <thead class=\"thead\">\n" +
                        "                        <tr>\n" +
                        "                            <td>"+ item.contractDesc + (item.isTargetProfit == "1" ? "<span>目标盈</span>":"") + '</td>\n' +
                        "                            <td>"+ getMipStatusDesc(item.contractStatus) +"</td>\n" +
                        "                        </tr>\n" +
                        "                    </thead>\n" +
                        "                </table>\n" +
                        "                <table class=\"tbody\">\n" +
                        "                        <tr>\n" +
                        "                            <td>基金名称</td>\n" +
                        "                            <td>每期基础金额(元)</td>\n" +
                        "                        </tr>\n" +
                        "                        <tr>\n" +
                        "                            <td>"+ item.fundName +"</td>\n" +
                        "                            <td>"+ App.formatMoney(item.payAmtDisplay) +"</td>\n" +
                        "                        </tr>\n" +
                        "                        <tr>\n" +
                        "                            <td>扣款时间</td>\n" +
                        "                            <td>下次扣款日期</td>\n" +
                        "                        </tr>\n" +
                        "                        <tr>\n" +
                        "                            <td >"+ (item.cycle == "DD" ? getDeductionDesc(item.cycle) : (getDeductionDesc(item.cycle) + getMipbuydayDesc(item.cycle, item.payDate))) +"</td>\n" +
                        "                            <td>--</td>\n" +
                        "                        </tr>\n" +
                        (
                            item.isintelligentmip == "Y" ?
                                ("                        <tr>\n" +
                                    "                            <td>目标收益率</td>\n" +
                                    "                            <td>当前收益率</td>\n" +
                                    "                        </tr>\n" +
                                    "                        <tr>\n" +
                                    (item.istargetProfitmip == "Y" ?
                                        "                            <td>" + item.targetProfit + "%</td>\n":
                                        "                            <td class=\"color-green\">--</td>\n") +
                                    (item.istargetProfitmip == "Y" ?
                                        "                            <td>" + item.currentProfit + "%</td>\n":
                                        "                            <td class=\"color-green\">--</td>\n") +
                                    "                        </tr>")
                                : ""

                        )
                        +
                        "                </table>\n" +
                        "            </div>";
                });
            }
            if(App.isEmpty(html) && fundPageNo == 1){
                fundMoreDisplay = false;
                $(".fund-mip-body").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
            } else {
                $(".footer_fiexd").show();
                $(".fund-mip-body").append(html);
            }
        }
    });
}
function queryFundGroupMipList() {
    var url ="/mobile-bff/v1/fund/queryContractList";
    var data = {
        pageNo:fundGroupPageNo,
        pageSize:100,
        agreementType:'2',
        isAllFlag: '1' //20220713 终止合约传1
    }
    utils.post(url, JSON.stringify(data), function(result){
        if (result.body != undefined && result.body != null){
            var groupFundMipList = result.body;
            var html = "";
            if (groupFundMipList != undefined && groupFundMipList != null){
                groupFundMipList.forEach(function (item) {
                    html += "<div class=\"title_tip\">\n" +
                        "                    </div>\n" +
                        "                    <div class=\"qiehuan_content\" onclick=\"gotoFundGroupDetails('"+ item.contractNo +"')\">\n" +
                        "                        <table>\n" +
                        "                            <thead class=\"thead\">\n" +
                        "                            <tr>\n" +
                        "                                <td>"+ item.contractDesc + (item.isTargetProfit == "1" ? "<span>目标盈</span>":"") +"</td>\n" +
                        "                                <td>"+ getMipStatusDesc(item.contractStatus) +"</td>\n" +
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
                        "                                <td >"+ item.payAmtDisplay +"</td>\n" +
                        "                                <td>"+((item.cycle == "DD"||item.cycle == "QQ"||item.cycle == "SS") ? getDeductionDesc(item.cycle) : (getDeductionDesc(item.cycle) + getMipbuydayDesc(item.cycle, item.payDate))) + "</td>\n" +
                        "                                <td>--</td>\n" +
                        "                            </tr>\n" +
                        "                        </table>\n" +
                        "                    </div>";
                });
            }
            if(App.isEmpty(html) && fundGroupPageNo == 1){
                fundGroupMoreDisplay = false;
                $(".fund-group-mip-body").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
            } else {
                $(".fund-group-mip-body").append(html);
            }
        }
    });
}


function more() {
    var selectedTab = $('.tab3 li.active').index();
    if(selectedTab == 0){
        fundPageNo = fundPageNo + 1;
        queryFundMipList();
    } else {
        fundGroupPageNo = fundGroupPageNo + 1;
        queryFundGroupMipList();
    }
}
function gotoFundGroupDetails(contractNo) {
    window.location.href = "mip_fund_group_details.html?contractNo=" + contractNo;
}
function gotoFundDetails(contractNo) {
    window.location.href = "mip_fund_details.html?contractNo=" + contractNo;
}
var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "DD": [],
	"QQ": [],
	"SS": []
};

function getMipbuydayDesc(deduction, mipBuyday) {
    if (deduction == "DD"){
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
			case "QQ":
                result = "每季";
                break;
            case "MM":
                result = "每月";
                break;
            case "2W":
                result = "每双周";
                break;
            case "WW":
                result = "每周";
                break;
			case "DD":
				result = "每天";
				break;
			case "SS":
				result = "单笔";
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