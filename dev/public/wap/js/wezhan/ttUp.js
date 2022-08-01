$(function () {
    queryMore(pageNo);
    $(".show_more").click(function () {
        showMore();
    });
});
var pageNo = 1;
var domain = document.domain;
var catalogId = "4120";
if(domain.indexOf("sit") >= 0 || domain.indexOf("uat") >= 0){//sit uat
	catalogId = "4120";
}else{
	catalogId = "4109";
}
function queryMore(pageNo) {
    var url = '/cms-service/v1/fundarticles/catalog?catalogId='+catalogId+'&pageNo='+ pageNo +'&pageSize=10';
    App.get(url, function () {
        $(".show_more").click(function () {
            showMore();
        });
    }, function (result) {
        pageNo++;
        var infos = result.body;
        if(infos != undefined && infos != null){
            var html = '';
            infos.forEach(function (item) {
                var date = item.createDate;
                html += '<div class="group" onclick="javascript:window.location.href=\''+ item.url +'\'">' +
                    '    <div class="group_fl fl">' +
                    '        <p>'+ item.title +'</p>' +
                    '        <p>'+ date +'</p>' +
                    '    </div>' +
                    '    <div class="group_fr fr">' +
                    '        <i></i>' +
                    '    </div>' +
                    '</div>';
            });
            $(".container").append(html);
            if(infos.length < 10){
                $(".show_more").hide();
            } else {
                $(".show_more").show();
            }
        } else {
            $(".show_more").hide();
        }
    });
}
function showMore() {
    $(".show_more").unbind("click");
    queryMarketInterpretation(pageNo);
}