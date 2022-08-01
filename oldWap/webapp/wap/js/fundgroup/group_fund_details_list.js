var groupId = "";
$(function(){
    //组合详情数据加载
    groupId = App.getUrlParam("groupId");
    requestGroupFundDetail(groupId);
});

function requestGroupFundDetail(groupId){
    App.get(App.projectNm + "/adviser/query_fundgroup_detail_info?groupId=" + groupId, null, function(result){

        if(result.body != undefined && result.body != null){
            var detailInfo = result.body.detailInfo;
            if(detailInfo != undefined && detailInfo != ""){

                var groupDetails = detailInfo.groupDetails;
                $("title").html(detailInfo.groupname);
                $(".subGroupFundList").empty();
                var subListHtml = "";
                for(var i in groupDetails){
                    var subgroup = groupDetails[i];
                    var percent = subgroup.percent;
                    var classifyName = subgroup.classifyName;
                    var subFunds = subgroup.subList;
                    var color = subgroup.color;
                    if(subFunds.length == 0)
                        continue;
                    subListHtml = subListHtml + "<tbody><tr>"
                        + "<td><i style='background-color: "+ color +"'></i>" + classifyName
                        + "</td><td class='font-arial red'>"+ percent + "<span class='sign'>%</span>"
                        + "</td></tr>";

                    for(var j in subFunds){
                        var fund = subFunds[j];
                        var fundId = fund.fundId;
                        var fundNm = fund.fundNm;
                        var fundPercent = fund.percent;
                        var canApply = fund.canApply;
                        var stopTrade = fund.stopTrade;
                        var canRedeem = fund.canRedeem;
                        var fundStName = fund.fundStName;
                        subListHtml = subListHtml + "<tr onclick='javascript: window.location.href = \""+ fund.jumpUrl +"\"'><td>" + fundNm
                            + "<span class='font-arial'>"+ fundId + "</span>";
                        if(canApply == "0" || stopTrade == "1" || canRedeem == "0"){
                            subListHtml = subListHtml + "<br><i class='deal'>" + fundStName + "</i>";
                        }
                        subListHtml = subListHtml + "</td><td class='font-arial'>" + fundPercent + "<span class='sign'>%</span>"
                            +"</td></tr>";
                    }
                    subListHtml = subListHtml + "</tbody>";
                }
                $(".subGroupFundList").html(subListHtml);
            }
        }
    });
}