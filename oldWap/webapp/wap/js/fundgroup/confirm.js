$(function () {
    var purObj = App.getSession(App.fundGroupObj);
    if(purObj == undefined || purObj == null) {
        window.location.href = "../../wezhan/combinationZone.html";
    } else {
        if (purObj.handleType == "M"){
            $(".amt-name").html("每期投资金额(元) ");
            $(".mip-type").show();
            $(".deduction-cycle").show();
            $(".fee").hide();
            if(purObj.mipcycle == "ED"){
                $(".cycle").html(getDeductionDesc(purObj.mipcycle));
            }else {
                $(".cycle").html(getDeductionDesc(purObj.mipcycle) + getMipbuydayDesc(purObj.mipcycle, purObj.mipbuyday));
            }
        }
        $("#fee").html(App.formatMoney(purObj.fee));
        $("#groupName").html(purObj.groupName);
        $("#amt").html(App.formatMoney(purObj.amt));
        if(purObj.purType == "B"){
            $("#payWay").html(purObj.bankName + " [ " + purObj.displayCard + " ]");
        } else {
            $("#payWay").html("现金宝");
        }
        groupPreTradeDetail();
    }
});
var fundList = "";

function groupPreTradeDetail() {
    var purObj = App.getSession(App.fundGroupObj);
    var url = App.projectNm + "/adviser/group_pre_trade_detail?r=" + (Math.random() * 10000).toFixed(0);
    var data = {
        "amt" : purObj.amt,
        "tradeTp" : purObj.tradeTp,
        "groupId" : purObj.groupId,
        "shareType" : purObj.shareType,
        "purType" : purObj.purType
    };

    App.post(url, JSON.stringify(data), null,function (result) {
        if(result.body != undefined && result.body != null){
            var preTradeGroupFunds = result.body.preTradeGroupFunds;
            var fundListHtml = "";
            var fundListStr = "";
            var index = 0;
            preTradeGroupFunds.forEach(function (item) {
                index++;
                fundListStr += "{\"fundId\" : \""+item.fundId+"\", \"fundPercent\" : \""+item.prePercent+"\"}";
                if (index < preTradeGroupFunds.length){
                    fundListStr += ","
                }
                fundListHtml += "<tr>\n" +
                    "                        <td>"+ item.fundName +"</td>\n" +
                    "                        <td>"+ item.prePercent +"%</td>\n" +
                    "                        <td>"+ (purObj.tradeTp == "P" ? item.preAmount : item.preQuty) +"</td>\n" +
                    "                    </tr>";
            });
            fundList = "[" + fundListStr + "]";
            $("#fundList").html(fundListHtml);
        }
    });
}

$(".btn-orange").click(function () {
    var purObj = App.getSession(App.fundGroupObj);
    var data = {
        "tradeTp" : purObj.tradeTp,
        "groupId" : purObj.groupId,
        "shareType" : purObj.shareType,
        "purType" : purObj.purType,
        "cashFrm" : purObj.cashFrm
    };
    if (App.isNotEmpty(purObj.selectedCoupon)){
        data.couponSerialNo = purObj.selectedCoupon;
    }
    if (purObj.cashFrm == "B"){
        data.bankNo = purObj.bankNo;
        data.bankAcco = purObj.bankAcco;
    }
    var url = "";
    //handleType = p:申购、M:定投
    if (purObj.handleType == "P"){
        data.amt = purObj.amt;
        data.transferType = purObj.transferType;
        url = App.projectNm + "/adviser/purchase_fund_group?r=" + (Math.random() * 10000).toFixed(0);

    } else if (purObj.handleType == "M"){
        data.mipbuyamt = purObj.amt;
        data.mipcycle = purObj.mipcycle;
        data.mipbuyday = purObj.mipbuyday;
        data.isSupportPeriod = purObj.isSupportPeriod;
        if(purObj.isSupportPeriod == "1"){
            data.periodNumber = purObj.periodNumber;
        }
        url = App.projectNm + "/adviser/fund_group_mip_create?r=" + (Math.random() * 10000).toFixed(0);
    }
    App.post(url, JSON.stringify(data), null,function (result) {
        if(result.body != undefined && result.body != null){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
		    var forwardUrl = App.getUrlParam("forwardUrl");
		    var newForwardUrl = '';
		    if(App.isNotEmpty(forwardUrl)){
		    	newForwardUrl = "?forwardUrl="+forwardUrl;
		    }
            //handleType = p:申购、M:定投
            if (purObj.handleType == "P"){
                App.setSession(App.serialNo_forword_url, "../fundgroup/fund_group_purchase_successfully.html"+newForwardUrl);
            } else if (purObj.handleType == "M"){
                App.setSession(App.serialNo_forword_url, "../fundgroup/fund_group_mip_successfully.html"+newForwardUrl);
            }

            window.location.href = "../common/setPassword.html";
        }
    });
});
var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": []
};

function getMipbuydayDesc(deduction, mipBuyday) {
    if (deduction == "ED"){
        return "--";
    } else {
        if(App.isEmpty(mipBuyday)){
            return "--";
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