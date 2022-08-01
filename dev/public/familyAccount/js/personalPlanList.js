var selectOrder = '';
var selectFilter = 'NOT_FILTER';
var memberId = utils.getUrlParam('memberId') || utils.getSession("selectedMemberId"); //utils.getUrlParam('memberId')
var teamId = utils.getUrlParam('teamId') || utils.getSession("selectedTeamId"); //utils.getUrlParam('teamId')
 
getNickname();
// S 20210423 获取userInfo信息，并存入session中(三方登录情况)
getUserInfo();
showPlans(teamId,memberId,'UPDATE_TIME','NOT_FILTER');


$(function(){
    
    $(".giftlist0").children("a").each(function(index, val) {
        var ele = $(this);
        ele.on("click", function() {
            selectOrder = $(this).children("div").attr("data");
            $("#order2").html($(this).children("div").text()+'<img src="img/jiantou.png" alt="" style="width:0.45rem;height:0.275rem;margin-left:0.25rem;margin-top:-0.1rem">');			
            showPlans(teamId,memberId,selectOrder,selectFilter);
            $(".mask,.layer0").hide()

        });
    });
    $(".giftlist2").children("a").each(function(index, val) {
        var ele = $(this);
        ele.on("click", function() {
            selectFilter = $(this).children("div").attr("data");
            $("#order1").html($(this).children("div").text()+'<img src="img/jiantou.png" alt="" style="width:0.45rem;height:0.275rem;margin-left:0.25rem;margin-top:-0.1rem">');				
            showPlans(teamId,memberId ,selectOrder,selectFilter);
            $(".mask,.layer0").hide()

        });
    });
});
// 关闭浮层
$(".close").click(function(){
    $(".mask,.layer0").hide()
    $("#order2").html($("#order2").html().replace("jiantou2","jiantou"));
    $("#order1").html($("#order1").html().replace("jiantou2","jiantou"));
})

$("#btn-submit").click(function(){
    window.location.href='createPlan.html';
});

// var teamId = '';//当前登录用户的teamId

function getNickname(){
    var url = '/sfs/v1/members/share?memberId=' + memberId;
    utils.get(url, null, function(result){
        if(result.body != undefined && result.body != null && result.returnCode == 0){
            if(result.body.memberInfo){
                if(result.body.memberInfo.memberNameDisplay){
                    var memberNameDisplay = result.body.memberInfo.memberNameDisplay;
                    document.title = memberNameDisplay + '的小金库';
                }
            }    
        }
    })
}

//获取当前用户userInfo信息（三方登录情况需要重新设置userInfo到sessionStorage
function getUserInfo(){
    utils.get('/icif/v1/custs/get-simple-by-cust-no',null,function(result){
        console.log('get-simple-by-cust-no result=', result);
        if(result && result.returnCode == 0){
            result.body && utils.setSession(utils.userInfo, result.body);
        }
    });
}

//计划信息
function showPlans(teamId,memberId,sortType,filterType){
    var url = '/sfs/v1/accounts/assets/stat?accountType=1&teamId='+teamId; 
    if(memberId){
        url+='&memberId='+memberId;
    }
    if(sortType){
        url+='&sortType='+sortType;
    }
    if(filterType){
        url+='&filterType='+filterType;
    }
    // 36393 【UAT环境】WAP端：零花钱的计划和资产不该展示在小金库下面
//    url+='&accountType=1';
    
    utils.get(url,null,function(result){
        var body = result.body;
        if(result.returnCode == 0){
            if(body.investMemberCount > 0){
                $(".banfoot .left").html(body.investMemberCount+'位家庭成员正在参与投资');
                $(".banfoot").show();
                $(".content").css("height","9rem");
            }else{
                $(".banfoot").hide();
                $(".content").css("height","7.85rem");
            }
            $(".assetTotalAmount").html(formatMoney(body.totalAssetAmount));
            $(".currencyTypeUnit").html(body.currencyTypeUnit);
            $(".holdYield").html(formatMoney(body.holdYield));
            $(".lastYield").html(formatMoney(body.lastYieldAmount));
            $(".totalYield").html(formatMoney(body.totalYield));
            $(".yieldDate").html('最新收益('+(body.navDate ? body.navDate.substring(4,6)+'.'+body.navDate.substring(6,8):'--')+')');
            var planList = body.plansList;
            var htm = '';
            $("#listItem").html(htm);
            planList.forEach(function(item,index){
                htm+='<div class="listItem">'+
                    '<div class="itemTitle">'+item.planName+
                    '</div>'+
                    '<div class="itemMid">'+
                        '<div class="infoLeft">'+
                            '<div class="infoTitle">持有金额(元)'+
                            '</div>'+
                            '<div class="infoContent">'+formatMoney(item.holdAmount) +
                            '</div>'+
                        '</div>'+
                        '<div class="infoMid">'+
                            '<div class="infoTitle">持有收益<img src="./img/list_point.png" alt="">'+
                            '</div>'+
                            '<div class="infoContent"  style="color: '+showColor(item.holdYield)+' ">'+formatMoney(item.holdYield) +
                            '</div>'+
                        '</div>'+
                        '<div class="infoRight">'+
                            '<div class="infoTitle">最新收益('+(item.yieldDate ? item.yieldDate.substring(4,6)+'.'+item.yieldDate.substring(6,8) : "--")+')'+
                            '</div>'+
                            '<div class="infoContent"  style="color: '+showColor(item.lastYield)+' ">'+formatMoney(item.lastYield) +
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="line"></div>'+
                    '<div class="itemFoot">';
                        if(item.permission != 3){
                            htm+='<div class="itemRight" style="width:100%" onclick="gotoDetail(\''+item.accountId+'\')">查看详情</div>';
                        }else{
                        htm+=	'<div class="itemLeft" data="'+item.arAcct+'" data-accountId="'+item.accountId+'" >立即存入</div>'+
                        '<div class="midLine"></div><div class="itemRight" onclick="gotoDetail(\''+item.accountId+'\')">查看详情</div>';
                        }

                    htm+='</div>'+
                '</div>';
            });
            $("#listItem").html(htm);
            if(planList.length == 0){
                $("#listItem").hide();
                $(".noContent").show()
            }else{
                $("#listItem").show();
                $(".noContent").hide()	
            }

            //立即存入
            $(".itemLeft").click(function(){

                var arAcct = $(this).attr("data");
                var accountId = $(this).attr("data-accountId");
                $(".mask,#layer1").show()
                //买入其他产品
                $(".addOther").click(function(){
                    window.location.href = "allFund.html?arAcct="+arAcct;
                })
                //追加投资
                $(".addInvest").click(function(){
                    window.location.href = "addInvest.html?arAcct="+arAcct+"&accountId="+accountId;
                })
                
            });
            

        }
    });
}
//跳去计划详情
function gotoDetail(accountId){
    if(accountId) window.location.href = 'planDetail.html?accountId='+accountId;
}

$('.banfoot').click(function(){
    if(teamId && memberId ){
        window.location.href = 'assetDetail.html?teamId='+teamId+'&memberId='+memberId;
    }else{
        window.location.href = 'assetDetail.html?teamId='+teamId;
    }
})

//选择排序
$("#order2").click(function(){
    if($("#order2").text().trim() == "排序"){
        $("#order2").html('按修改时间<img src="img/jiantou.png" alt="" style="width:0.45rem;height:0.275rem;margin-left:0.25rem;margin-top:-0.1rem">');
    }
    //遍历选中对应的选项
    $(".giftlist0").children("a").each(function(index, val) {
        var ele = $(this);

        if(ele.children("div").text().trim()  == $("#order2").text().trim() ){
            ele.children("div").addClass("selectedRed");
        }else{
            ele.children("div").removeClass("selectedRed");
        }
    });
    $("#order2").html($(this).html().replace("jiantou","jiantou2"));
    $(".mask,#layer0").show()
});
//选择排序
$("#order1").click(function(){
    //遍历选中对应的选项
    $(".giftlist2").children("a").each(function(index, val) {
        var ele = $(this);

        if(ele.children("div").text().trim()  == $("#order1").text().trim() ){
            ele.children("div").addClass("selectedRed");
        }else{
            ele.children("div").removeClass("selectedRed");
        }
    });
    $("#order1").html($(this).html().replace("jiantou","jiantou2"));
    $(".mask,#layer2").show()
});