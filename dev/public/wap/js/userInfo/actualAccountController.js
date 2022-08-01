var page=utils.getUrlParam('page');
$(function () {
    var now = new Date();

    $('.controller-idCard-valid-date').mobiscroll().date({
        theme: 'ios',
        lang: 'zh',
        display: 'bottom',
        dateFormat: 'yyyy-mm-dd',
        endYear: 2099,
        onSet: function (val, inst) {
            if(val != undefined && val != null && App.isNotEmpty(val.valueText)){
                idNoValiDate = val.valueText.substring(0,4)+val.valueText.substring(5,7)+val.valueText.substring(8,10);
            }
        }
    });

    queryRealCustomerInfo();
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
    saveRealCustomerInfo();
});
var idNoValiDate = '';

function queryRealCustomerInfo() {
    var url = App.projectNm + "/customer_info/query_real_customer_info?handleTp=1&r=t" + (Math.random() * 10000).toFixed(0);
    App.get(url, null, function(result){
        if (result.body != undefined && result.body != null){
            var realInfo = result.body.realInfo;
            if(realInfo != undefined &&　realInfo != null){
                $(".isHolding li").removeClass("current");
                if(realInfo.isHolding == 'N'){
                    $(".isHolding li").eq(1).addClass("current");
                    $(".content_2").show();

                    idNoValiDate = realInfo.validate;
                    $(".controller-idCard-valid-date").val(realInfo.validate);
                    $(".controller-idCard").val(realInfo.idno);
                    $(".controller-name").val(realInfo.name);
                    $(".controller-phone-num").val(realInfo.mobileno);
                    $(".controller-relation").val(realInfo.relationship);
                }else {
                    $(".isHolding li").eq(0).addClass("current");
                }
            }

        }
    });
}

function saveRealCustomerInfo() {
    var data = {"handleTp":"1"};
    var index = $(".isHolding").find(".current").index();
    if(index == 0){
        data.isHolding = "Y";
    } else {
        if(App.isEmpty($(".controller-name").val())){
            alertTips("请先填写姓名");
            return;
        }
        if(App.isEmpty($(".controller-idCard").val())){
            alertTips("请先填写证件号");
            return;
        }
        if(App.isEmpty($(".controller-phone-num").val())){
            alertTips("请先填写手机号");
            return;
        }
        if(App.isEmpty(idNoValiDate)){
            alertTips("请先选择证件有效期");
            return;
        }
        if(App.isEmpty($(".controller-relation").val())){
            alertTips("请先填写关系");
            return;
        }
        data.isHolding = "N";
        data.name = $(".controller-name").val();
        data.idno = $(".controller-idCard").val();
        data.validate = idNoValiDate;
        data.mobileno = $(".controller-phone-num").val();
        data.relationship = $(".controller-relation").val();
    }
    // console.log(data);
    var url = App.projectNm + "/customer_info/save_real_customer_info";
    App.post(url, JSON.stringify(data), null, function (result) {
        // window.location.href = "./parfectInfo.html";
        if(page){  //20220720判断是否从tradeH5新页面跳转
            window.location.href = "/tradeh5/newWap/myArea/personalInfo/index.html";
        }else{
            window.location.href = "./parfectInfo.html";
        }
    });
}