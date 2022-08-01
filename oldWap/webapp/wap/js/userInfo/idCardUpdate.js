$(function () {
    $(".tap-tap").click(function () {
        $(".tip-dailog").show();
    });
    $(".close-tip").click(function(){
        $(".tip-dailog").hide();
    });

    function showPhone(panel, obj){
        var fileList = obj.files;
        for(var i=0; i<fileList.length; i++){
            var reader = new FileReader();
            reader.readAsDataURL(fileList[i]);
            reader.onload = function (ev) {
                var imgResult = ev.target.result;
                $(panel).attr("src", imgResult);
            }
        }
    }
    
    function nextStep() {
        var file1 = $(".file-1").get(0).files[0];
        var file2 = $(".file-2").get(0).files[0];
        if(!file1) {
            alertTips3("身份证人像面不能为空", "", "知道了");
            return;
        }
        if(!file2) {
            alertTips3("身份证国徽面不能为空", "", "知道了");
            return;
        }

        var formData = new FormData();
        formData.append("front", file1);
        formData.append("back", file2);
        formData.append("frontIdPicSize", file1.size / 1000);
        formData.append("backIdPicSize", file2.size / 1000);
        formData.append("operType", "01");
        App.uploadFile(App.applicationNm + "uploadIdCard", formData, function (res) {
            window.location.href = "./parfectInfo.html";
        });
    }

    $(".file-1").change(function () {
        showPhone("#card-1", this);
    });
    $(".file-2").change(function () {
        showPhone("#card-2", this);
    });
    $(".footer").click(function () {
        nextStep();
    });
});