$(function () {
    queryYLInfo();

    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wap_tax_index_open&r=" + (Math.random()*10000).toFixed(0);
    App.get(url,null,function(result){
        // console.log("layout:", result);
        if (result.body.layout != undefined && result.body.layout != null){
            var layoutList = result.body.layout;
            var isAddLine = false;
            var size = layoutList.length;
            for (var index in layoutList) {
                if (index == size - 1) {
                    isAddLine = false;
                }
                Layout.drawingLayout('#panel', layoutList[index], index, isAddLine);
            }
        }
    });
    $(".tips").click(function () {
        window.location.href = 'http://static.99fund.com/mobile/app_inner/faq/tdp_faq.html';
    });
    queryTaxpensionAssets();
    queryCustomerInfo();
});

function queryYLInfo() {
    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            if (result.body.isOpenPITD != 'Y'){
                window.location.href = 'http://mcpuat.99fund.com.cn:7955/mcpweb/uppages/shuiyanzhengce/index.html';
            }
        }
    });
}
function queryTaxpensionAssets() {
    App.get("/mobile-bff/v1/fund-pension/taxpension-homepage-info", null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            $("#totalAsset").html(App.formatMoney(result.body.totalAsset));
        }
    });
}
function queryCustomerInfo() {
    App.get("/mobile-bff/v1/customerInfo/basic-customer-info", null, function (result) {
        if (result.body != undefined && result.body != null) {
            // console.log(result);
            var custInfo = result.body;
            if(App.isNotNull(custInfo)){
                var basicUserInfo = custInfo.buserInfo;
                if(App.isNotNull(basicUserInfo)){
                    $("#name").html(basicUserInfo.invnm);

                    if(App.isNotEmpty(basicUserInfo.mobileno)){
                        $("#mobile").html(basicUserInfo.mobileno.substr(0,3) + '****' + basicUserInfo.mobileno.substr(basicUserInfo.mobileno.length - 4, 4));
                    }
                }
            }

        }
    });
}