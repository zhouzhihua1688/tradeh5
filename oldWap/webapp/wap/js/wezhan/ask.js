$(function () {
    $("#ask").on('input',function(){
        var len=$(this).val().toString().length;
        $(".count_num").html(len);
    })
    $(".submit").click(function () {
        if($("#ask").val().toString().length<10){
            $(".mask").show();
            return;
        }
        leaveMessage();
    });
    $(".close").click(function () {
        $(".mask").hide();
    });
});

function leaveMessage() {
    var url = '/sfs/api/v1/message-board/leave-message';
    var data = {"commentToItemId":"wapView001", "commentToItemTp":"9", "commentContext": $("#ask").val()};
    App.post(url, JSON.stringify(data), null, function (result) {
        var info = result.body;
        if(info != undefined && info != null){
            window.location.href = "./viewPoint.html?tabIdx=2";
        }
    });
}