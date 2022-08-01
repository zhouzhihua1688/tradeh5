$(function () {
    queryInfo();
});
$('.content_1 ul li').click(function(event) {
    // event.preventDefault();
    $(this).addClass('current').siblings().removeClass('current');
    if($(this).index() == 1){
        $(".content_2").show();
    } else {
        $(".content_2").hide();
    }
});
$('.content_1 ul li i').click(function(event) {
    // event.preventDefault();
    $(this).siblings('input').prop('checked', true);
    $(this).parents('li').addClass('current').siblings().removeClass('current');
    if($(this).parents('li').index() == 1){
        $(".content_2").show();
    } else {
        $(".content_2").hide();
    }
});
$("#btn-submit").click(function () {
    saveInfo();
});

function queryInfo() {
    var url = App.projectNm + "/customer_info/query_sales_applica_detail?r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var info = result.body;
            if(info != undefined &&　info != null){
                $(".isCreditRecord li").removeClass("current");
                if(info.isCreditRecord == 'Y'){
                    $(".isCreditRecord li").eq(1).addClass("current");
                    $(".content_2").show();
                    if(App.isNotEmpty(info.creditproblemMemo)){
                        $(".textarea_remark").val(info.creditproblemMemo);
                    }
                } else {
                    $(".isCreditRecord li").eq(0).addClass("current");
                }
            }

        }
    });
}

function saveInfo() {
    var data = {};
    var index = $(".isCreditRecord").find(".current").index();
    if(index == 0){
        data.isCreditProblem = "N";
    } else {
            data.isCreditProblem = "Y";
            data.problemRemark = $(".textarea_remark").val();
            if(App.isEmpty(data.problemRemark)){
                alertTips("请先填写诚信问题具体说明");
                return;
            }
    }
    // console.log(data);
    var url = App.projectNm + "/customer_info/save_credit_record";
    App.post(url, JSON.stringify(data), null, function (result) {
        window.location.href = "./parfectInfo.html";
    });
}