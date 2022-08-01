$(function(){
    $("#icon").click(function () {
    //    $("input").val("")
    });
    queryUpgrade();
});
var holdingProductAvaliable = 0;
function queryUpgrade(){

    App.get("/mobile-bff/v1/smac/assetDetail", null, function (result) {
        if (result.body != undefined && result.body != null) {
            var upgradeFundVo = result.body.upgradeFundVo;
            if(upgradeFundVo.buttonName != undefined && upgradeFundVo.buttonName != null && upgradeFundVo.buttonName.length > 2) {
                $("title").html(upgradeFundVo.buttonName.substr(-2, 2));
            }
            $("#repurchaseAmt").val(App.formatMoney(upgradeFundVo.holdBalance, 2));
            $(".holdingProductName").html(upgradeFundVo.holdingProductName);
            $(".holdingProductId").html(upgradeFundVo.holdingProductId);
            $(".holdingProductDesc").html(upgradeFundVo.holdingProductDesc);
            $(".targetProductName").html(upgradeFundVo.targetProductName);
            $(".targetProductId").html(upgradeFundVo.targetProductId);
            $(".targetProductDesc").html(upgradeFundVo.targetProductDesc);
            $(".holdingProductRemark").html(upgradeFundVo.holdingProductRemark);
            if(App.isNotEmpty(upgradeFundVo.dialogMessage)){
            	$("#dialogMessage").html(upgradeFundVo.dialogMessage);
            	$(".head").show();
        	}
            $("#dialogMessageJumpUrl").click(function(){
            	if(App.isNotEmpty(upgradeFundVo.dialogMessageJumpUrl)){
            		window.location = upgradeFundVo.dialogMessageJumpUrl;
            	}
            });
            holdingProductAvaliable = upgradeFundVo.holdBalance;
        }
    });
}

$(".button").click(function () {
    // var repurchaseAmt = $("#repurchaseAmt").val();
    // if(App.isEmpty(repurchaseAmt)){
    //     alertTips("请先输入转换份额");
    //     return;
    // }

    if(Number(holdingProductAvaliable) <= 0){
        alertTips("当前可转份额为0份，无法继续操作。");
        return;
    }

    var url = "/mobile-bff/v1/smac/upgrade";
    var data = {
        "subQuty": holdingProductAvaliable,
        "fundId":$(".targetProductId").html()
    };
    App.post(url, JSON.stringify(data), null, function (result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../account/xjb_index.html");

        window.location.href = "../common/setBffPassword.html";
    });
});