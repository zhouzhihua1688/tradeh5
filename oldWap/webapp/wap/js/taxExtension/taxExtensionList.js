$(function () {

    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wap_tax_index_unopen&r=" + (Math.random()*10000).toFixed(0);

    App.get(url,null,function(result){
        // console.log("layout:", result);
        // var result = {"body":{"layout":[{"dataFrom":"0","funcmodId":"func1554975499655","funcmodName":"图片广告位","layoutId":"wap_tax_index_unopen","loginFlag":"2","position":1,"remark":"","requestMethod":"GET","requestUrl":"services/app_func/query_cust_theme?layoutId=wap_tax_index_unopen&funcModId=func1554975499655","temId":"wap_banner"},{"dataFrom":"0","funcmodId":"func1554975868736","funcmodName":"产品推荐","layoutId":"wap_tax_index_unopen","loginFlag":"2","position":2,"remark":"","requestMethod":"GET","requestUrl":"services/app_func/query_cust_theme?layoutId=wap_tax_index_unopen&funcModId=func1554975868736","temId":"wap_product_recom"}]},"returnCode":0,"returnMsg":"","successMsg":""};
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

    //查询是否开户
    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            var isOpenPITD = result.body.isOpenPITD;
            if(isOpenPITD == 'Y'){
                $(".footer").hide();
            }

        }
    });
});