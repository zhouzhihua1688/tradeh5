var page=utils.getUrlParam('page');
$(function () {
    $(".tap-tap").click(function () {
        $(".tip-dailog").show();
    });
    $(".close-tip").click(function () {
        $(".tip-dailog").hide();
    });

    function showPhone(panel, obj) {
        var fileList = obj.files;
        for (var i = 0; i < fileList.length; i++) {
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
        var fileall = [];  //存放图片的容器

        // 证件类型(M-未认证，0-身份证，1-护照，2-军官证，3-士兵证，4-港澳通行证，5-户口本，6-外国人永久居留证，7-其他，8-文职证，9-警官证)
        var idTp = utils.getUrlParam("idTp");
        console.log('idTp=', idTp);

        if (!file1) {
            alertTips3("证件持有人信息页不能为空", "", "知道了");
            return;
        }
        if (!file2) {
            alertTips3("证件类型页不能为空", "", "知道了");
            return;
        }
        console.log('file1', file1);
        console.log('file2', file2);

        fileall.push(file1);
        fileall.push(file2);

        var frontIdPicSize = file1.size/ 1000;
        var backIdPicSize = file2.size/ 1000;

        console.log("frontIdPicSize", frontIdPicSize);
        console.log("backIdPicSize", backIdPicSize);

        var formData = new FormData();

        for (var i = 0; i < fileall.length; i++) {
            formData.append("files", fileall[i]);
        }

        // formData.append("file", file1);
        // formData.append("idTp", idTp);

        // App.uploadFile('/mobile-bff/v1/account/upload-cust-cert-pic?idTp='+idTp, formData, function (res) {
        //     console.log(res);
        // });

        App.isLoading(true);   //加载中
        $.ajax({
            url: `/mobile-bff/v1/account/upload-cust-cert-pic?idTp=` + idTp,
            type: "POST",
            data: formData, // 上传formdata封装的数据
            // headers: {
            //     Accept: "application/json; charset=utf-8"
            // },
            dataType: 'JSON',
            cache: false,                      // 不缓存
            // contentType:'multipart/form-data',
            // mimeType: "multipart/form-data",
            processData: false,//告诉jq不要处理发送的数据
            contentType: false,//告诉jq不要设置content-Type请求头
            success: function (res) {
                console.log(res);
                App.isLoading(false);
                if (res.returnCode == 0) {
                    if (res.body) {
                        var frontPath = res.body.userIdPicPathFront; //手持照片正面路径
                        var backPath = res.body.userIdPicPathBack; //手持照片反面路径
                        // alertTips3("上传成功", "", "知道了");
                        window.location.href = "./holdIdCard.html?idTp=" + idTp + '&frontPath=' + frontPath + '&backPath=' + backPath + '&frontIdPicSize=' + frontIdPicSize + '&backIdPicSize=' + backIdPicSize+ '&page='+page; //上传成功跳转到手持照片上传页
                    }
                } else {
                    alertTips3(res.returnMsg, "", "知道了");
                }
            },
            error: function () {
                alertTips3("上传失败", "", "知道了");
            }
        });


        // utils.setCookie('file1',file1);
        // App.setSession("file1",file1)
        // window.location.href = "./holdIdCard.html?file1=" + file1;
        // utils.setSession("file1",file1);
        // window.location.href = "./holdIdCard.html" + location.search;

        // var reader = new FileReader();
        //  reader.readAsDataURL(file1);//转化二进制流，异步方法

        // formData.append("back", file2);
        // formData.append("frontIdPicSize", file1.size / 1000);
        // formData.append("backIdPicSize", file2.size / 1000);
        // formData.append("operType", "01");
        // App.uploadFile(App.applicationNm + "uploadIdCard", formData, function (res) {
        //     // window.location.href = "./parfectInfo.html" + location.search;
        //     window.location.href = "./holdIdCard.html" + location.search;
        // });
        // App.uploadFile('/mobile-bff/v1/account/upload-cust-cert-pic?idTp='+idTp, formData, function (res) {
        //     console.log(res);
        // });
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