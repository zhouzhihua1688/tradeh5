
var riskfundContractNo = []; // 高于用户风险等级的基金定投计划协议列表
var riskInvestAdvisoryContractNo = []; //高于用户风险等级的投顾定投计划协议列表
if(decodeURIComponent(App.getUrlParam('riskfundContractNo'))!=''){
    riskfundContractNo= decodeURIComponent(App.getUrlParam('riskfundContractNo')).split(',');
}
if(decodeURIComponent(App.getUrlParam('riskInvestAdvisoryContractNo'))!=''){
    riskInvestAdvisoryContractNo = decodeURIComponent(App.getUrlParam('riskInvestAdvisoryContractNo')).split(','); 
}

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
    
    //隐藏Tab
    if(riskfundContractNo.length > 0){
        $(".clearfix").hide();
        $(".content1_1").css("margin-bottom","0");
    }

    queryFundMipList();
    queryFundGroupMipList();
});
function queryFundMipList() {
    // var url = App.projectNm + "/fund/holding_mips?pageNo=1&pageSize=100&r=t" + (Math.random() * 10000).toFixed(0);
    // App.get(url, null, function(result){
    //     if (result.body != undefined && result.body != null){
    //         var fundMips = result.body.fundMips;
    //         var html = "";
    //         if (fundMips != undefined && fundMips != null){
    //             fundMips.forEach(function (item) {
    //                 if((riskfundContractNo.length > 0 && riskfundContractNo.indexOf(item.contractNo)>-1) || riskfundContractNo.length == 0 ){
    //                     var isPause = item.contractSt == 'P';
    //                     html+='                <li class="father-li '+ (isPause ? 'pause' : '') + '">'
    //                     +'<p class="bottom-border"><i class="settled-icon"></i>'+ item.mipDesc + (item.isintelligentmip == "Y" ? "(智投)":"")  + (item.istargetProfitmip == "Y" ? "<span>目标盈</span>":"") + '<span>'+ getMipStatusDesc(item.contractSt) +'</span></p>'
    //                     +'<ol class="bottom-border">'
    //                     +'<li>        '
    //                     +'<label for="">基金名称</label><span>'+ fmtName(item.fund.fundNm)+'</span>  ' 
    //                     +'</li>   '
    //                     +'<li>        '
    //                     +'<label for="">每期基础金额(元)</label><span>'+ App.formatMoney(item.mipbuyamt) +'</span> '
    //                     +'</li>   '
    //                     +'<li>        '
    //                     +'<label for="">扣款时间</label><span>'+ (item.mipcycle == "DD" ? getDeductionDesc(item.mipcycle) : (getDeductionDesc(item.mipcycle) + getMipbuydayDesc(item.mipcycle, item.mipbuyday))) +'</span> '
    //                     +'</li>   '
    //                     +'<li>       ' 
    //                     +'<label for="">下次扣款日期</label><span>'+ item.nextBuyDate +'</span>  '
    //                     +'</li>'
    //                     +'</ol>'
    //                     +'<div class="settled-btn">   '
    //                     +'<a class="btn-remove" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'CANCEL\',\'fund\',\''+item.isOpenTargetProfit+'\',\'' + item.fundId + '\')">删除</a>';
    //                     if(isPause){
    //                         html+='<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'RESUME\',\'fund\',\''+item.isOpenTargetProfit+'\',\'' + item.fundId + '\')">恢复</a>';
    
    //                     }else{
    //                         html+='<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'PAUSE\',\'fund\',\''+item.isOpenTargetProfit+'\',\'' + item.fundId + '\')">暂停</a>';
    //                     }
    //                     html+='<a class="btn-revise" href="javascript:;"onclick="handlePlan(\'' + item.contractNo + '\', \'EDIT\',\'fund\',\''+item.isOpenTargetProfit+'\',\'' + item.fundId + '\')">修改</a>'
    //                     +'</div>'
    //                     +'</li>';
    //                 }
                   
    //             });
    //         }
    //         if(App.isEmpty(html)){
    //             $(".fund-mip-body ul").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
    //         } else {
    //             $(".fund-mip-body ul").html(html);
    //         }
    //         // $(".btn-revise").click(function(){
    //         //     alertTips("请前往APP查看");
    //         // })
            
    //     }
    // });
	utils.ajax({
		url:'/mobile-bff/v1/fund/queryContractList',
		data:{
			pageNo:1,
			pageSize:100,
			agreementType:'1',
            isAllFlag: '0' //20220711 正常合约传0
		},
		type:'POST',
		success:function(result){
			var fundMips = result.body;
            var html = "";
            if (fundMips != undefined && fundMips != null){
                fundMips.forEach(function (item,index,arr) {
                    if((riskfundContractNo.length > 0 && riskfundContractNo.indexOf(item.contractNo)>-1) || riskfundContractNo.length == 0 ){
                        var isPause = item.contractStatus == 'P';
                        html+='                <li class="father-li '+ (isPause ? 'pause' : '' +index==arr.length-1?'marginb120':'') + '">'
                        +'<p class="bottom-border"><i class="settled-icon"></i>'+ item.contractDesc + (item.isTargetProfit == "1" ? "<span>目标盈</span>":"") + '<span>'+ getMipStatusDesc(item.contractStatus) +'</span></p>'
                        +'<ol class="bottom-border">'
                        +'<li>        '
                        +'<label for="">基金名称</label><span>'+ fmtName(item.fundName)+'</span>  ' 
                        +'</li>   '
                        +'<li>        '
                        +'<label for="">每期基础金额(元)</label><span>'+ App.formatMoney(item.payAmtDisplay) +'</span> '
                        +'</li>   '
                        +'<li>        '
                        +'<label for="">扣款时间</label><span>'+ (item.cycle == "DD" ? getDeductionDesc(item.cycle) : (getDeductionDesc(item.cycle) + getMipbuydayDesc(item.cycle, item.payDate))) +'</span> '
                        +'</li>   '
                        +'<li>       ' 
                        +'<label for="">下次扣款日期</label><span>'+ timeFormat(item.nextPayDate) +'</span>  '
                        +'</li>'
                        +'</ol>'
                        +'<div class="settled-btn">   '
                        +'<a class="btn-remove" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'CANCEL\',\'fund\',\''+item.isTargetProfit+'\',\'' + item.productId + '\')">终止</a>';
                        if(!!item.editable&&!!item.pause) {  //20220728股债定投宝不支持暂停和修改
                            if (isPause) {
                                html += '<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'RESUME\',\'fund\',\'' + item.isTargetProfit + '\',\'' + item.productId + '\')">恢复</a>';

                            } else {
                                html += '<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'PAUSE\',\'fund\',\'' + item.isTargetProfit + '\',\'' + item.productId + '\')">暂停</a>';
                            }
                            html += '<a class="btn-revise" href="javascript:;"onclick="handlePlan(\'' + item.contractNo + '\', \'EDIT\',\'fund\',\'' + item.isTargetProfit + '\',\'' + item.productId + '\')">修改</a>'
                        }
                        +'</div>'
                        +'</li>';
                    }
                   
                });
            }
            if(App.isEmpty(html)){
                $(".fund-mip-body ul").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
            } else {
                $(".fund-mip-body ul").html(html);
            }
		}
	})
}
function queryFundGroupMipList() {
    var url ="/mobile-bff/v1/fund/queryContractList"
	utils.ajax({
		url,
		data:{
			pageNo:1,
			pageSize:100,
			agreementType:'2',
            isAllFlag: '0' //20220711 正常合约传0
		},
		type:'POST',
		success:function(result){
			console.log(result);
			$('#loadingLayout').hide();
			var groupFundMipList = result.body;
            var html = "";
            if (groupFundMipList != undefined && groupFundMipList != null){
				groupFundMipList.forEach(function (item,index,arr) {
					if(riskfundContractNo.length == 0 && riskInvestAdvisoryContractNo.length == 0){
						var isPause = item.contractStatus  == 'P';
						html+='                <li class="father-li '+ (isPause ? 'pause' : ''+index==arr.length-1?'marginb120':'') + '">'
						+'<p class="bottom-border"><i class="settled-icon"></i>'+ item.contractDesc + (item.isTargetProfit == "1" ? "<span>目标盈</span>":"") + '<span>'+ getMipStatusDesc(item.contractStatus)+'</span></p>'
						+'<ol class="bottom-border">'
						+'<li>        '
						+'<label for="">组合名称</label><span>'+ item.fundGroupTypeName+'</span>  ' 
						+'</li>   '
						+'<li>        '
						+'<label for="">每期基础金额(元)</label><span>'+ item.payAmtDisplay +'</span> '
						+'</li>   '
						+'<li>        '
						+'<label for="">扣款时间</label><span>'+ ((item.cycle == "DD"||item.cycle == "QQ"||item.cycle == "SS") ? getDeductionDesc(item.cycle) : (getDeductionDesc(item.cycle) + getMipbuydayDesc(item.cycle, item.payDate))) +'</span> '
						+'</li>   '
						+'<li>       ' 
						+'<label for="">下次扣款日期</label><span>'+ timeFormat(item.nextPayDate) +'</span>  '
						+'</li>'
						+'</ol>'
						+'<div class="settled-btn">   '
						+'<a class="btn-remove" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'CANCEL\',\'group\',\''+item.isTargetProfit+'\',\'' + item.productId + '\')">终止</a>';
                        if(!!item.editable&&!!item.pause) {  //20220728股债定投宝不支持暂停和修改
                            if (isPause) {
                                html += '<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'RESTART\',\'group\',\'' + item.isTargetProfit + '\',\'' + item.productId + '\')">恢复</a>';

                            } else {
                                html += '<a class="btn-stop" href="javascript:;" onclick="handlePlan(\'' + item.contractNo + '\', \'PAUSE\',\'group\',\'' + item.isTargetProfit + '\',\'' + item.productId + '\')">暂停</a>';
                            }
                            html += '<a class="btn-revise" href="javascript:;"onclick="handlePlan(\'' + item.contractNo + '\', \'EDIT\',\'group\',\'' + item.isTargetProfit + '\',\'' + item.productId + '\')">修改</a>'
                        }
						+'</div>'
						+'</li>';
					}
				});
			}
            if(App.isEmpty(html)){
                $(".fund-group-mip-body ul").html("<div style='background-color: #f6f6f6; width: 100%; text-align: center; top: 25%; position: fixed;'>暂无定投</div>");
            } else {
                $(".fund-group-mip-body ul").html(html);
            }
            // $(".btn-revise").click(function(){
            //     alertTips("请前往APP查看");
            // })
		}
	})
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
	console.log(deduction, mipBuyday);
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
			case "F":
				result = "已冻结";
				break;
			case "T":
				result = "预终止";
				break;
        }
    }
    return result;
}
// timeformat
function timeFormat(val){
	if(val&&val.length===8){
		return val.slice(0,4)+'-'+val.slice(4,6)+'-'+val.slice(6,8)
	}else{
		return val
	}
}
//操作状态 修改\恢复\暂停
function handlePlan(contractno, handleTp,fundTp,isTargetProfit, fundId) {
    if(fundTp == 'fund'){
        if(handleTp == 'EDIT'){
            window.location.href = "../fund/fund_mip.html?fundId="+fundId+'&contractno='+contractno;
            return;
        }

        var url = '/mobile-bff/v1/fund/fund-mip-handle';
        var data = JSON.stringify({
            contractNo: contractno,
            handleType: handleTp,
            profitPlus:'N',
            isOpenTargetProfit :isTargetProfit=='0'?'N':'Y'
        });
    }else if(fundTp == 'group'){
        if(handleTp == 'EDIT'){
            window.location.href = "../fundgroup/create_mip.html?groupId="+fundId+'&contractno='+contractno;
            return;
            // alertTips("请前往APP查看");
            // return;            
        }

        var url = '/mobile-bff/v1/fund-group/fundgroup-mip-handle';
        var data = JSON.stringify({
            contractNo: contractno,
            handleType: handleTp,
            isInvestment:'N'
        });
    }
	console.log(data);
	// return
    utils.post(url, data, null, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, handleTp);
        App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fundgroup/my_mip.html");
        utils.verifyTradeChain(result.body);

    })
}
