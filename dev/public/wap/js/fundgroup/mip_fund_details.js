$(function () {
    queryFundGroupMipByContractNo();
});

function queryFundGroupMipByContractNo() {
    var contractNo = App.getUrlParam("contractNo");
    var url = App.projectNm + "/fund/query_fund_mip?contractNo="+ contractNo +"&r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var mip = result.body.mip[0];
            if(mip != undefined && mip != null) {
                $("#groupName").html(mip.mipDesc);
                if(mip.cashFrm == "V"){
                    $("#payWay").html("现金宝");
                } else {
                    $("#payWay").html(mip.bankName +" [ 尾号" + mip.bankAcco.substring(mip.bankAcco.length - 4) + " ] ");
                }

                $("#mipStatus").html(getMipStatusDesc(mip.contractSt, mip.contractSubSt));
                if(groupFundMipInfo.mipKind == "0"){
                    $("#mipWay").html("经典定投");
                } else {
                    $("#mipWay").html("智能定投");
                }
                $("#deductionCycle").html(getDeductionDesc(mip.mipcycle) + getMipbuydayDesc(mip.mipcycle, mip.mipbuyday));
                $("#mipAmt").html(App.formatMoney(mip.mipbuyamt));
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
function getMipStatusDesc(status, subStatus) {
    var result = "";
    if (App.isNotEmpty(status)) {
        switch (status) {
            case "N":
                result = "定投中";
                break;
            case "C":
                result = "终止";
                if (subStatus == ""){
                    result += "(手动终止)";
                } else {
                    result += "(自动终止)";
                }
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