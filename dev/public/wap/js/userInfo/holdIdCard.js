var page=utils.getUrlParam('page');
$(function () {
    $(".tap-tap").click(function () {
        $(".tip-dailog").show();
    });
    $(".close-tip").click(function () {
        $(".tip-dailog").hide();
    });
    // 证件类型(M-未认证，0-身份证，1-护照，2-军官证，3-士兵证，4-港澳通行证，5-户口本，6-外国人永久居留证，7-其他，8-文职证，9-警官证)
    var idTp = utils.getUrlParam("idTp");
    var frontPath = utils.getUrlParam("frontPath");
    var backPath = utils.getUrlParam("backPath");
    var frontIdPicSize = utils.getUrlParam("frontIdPicSize");
    var backIdPicSize = utils.getUrlParam("backIdPicSize");
    console.log('idTp=', idTp); //证件类型
    console.log('frontPath=', frontPath); //正面路径
    console.log('backPath=', backPath); //反面路径

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
        var file3 = $(".file-3").get(0).files[0];

        if (!file3) {
            alertTips3("手持开户的证件照不能为空", "", "知道了");
            return;
        }
        console.log(file3);

        var handHoldIdPicSize = file3.size/ 1000;

        var formData = new FormData();
        formData.append("files", file3);

        //上传手持照片路径
        App.isLoading(true);   //加载中
        console.log(frontIdPicSize);
        $.ajax({
            url: `/mobile-bff/v1/account/upload-cert-pic-hand-hold`,
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
                if (res.returnCode == 0) {
                    //获取到上传图片路径后点击提交-执行提交操作
                    if (res.body && res.body.userIdPicPath) {
                        var handHoldIdPath = res.body.userIdPicPath; //手持照片路径
                        utils.ajax({
                            url: `/mobile-bff/v1/account/upload-cust-cert-pic-finish`,
                            type: "POST",
                            data: JSON.stringify({
                                frontIdPath: frontPath,
                                frontIdPicSize: frontIdPicSize,
                                backIdPath: backPath,
                                backIdPicSize: backIdPicSize,
                                handHoldIdPath: handHoldIdPath,
                                handHoldIdPicSize: handHoldIdPicSize,
                                idTp: idTp,
                                operType: '01'
                            }),
                            success: function (result) {
                                console.log(result);
                                App.isLoading(false);
                                if (result.returnCode == 0) {
                                    // alertTips3("上传并提交成功", "", "知道了");
                                    // window.location.href = "./parfectInfo.html" + location.search;  //提交成功跳转到个人信息页面
                                    if(page){  //20220720判断是否从tradeH5新页面跳转
                                        window.location.href = "/tradeh5/newWap/myArea/personalInfo/index.html";
                                    }else{
                                        window.location.href = "./parfectInfo.html" + location.search;  //提交成功跳转到个人信息页面
                                    }
                                } else {
                                    alertTips3(result.returnMsg, "", "知道了");
                                }
                            },
                            error: function () {
                                alertTips3("提交失败", "", "知道了");
                            }
                        });
                    }
                } else {
                    alertTips3(res.returnMsg, "", "知道了");
                }
            },
            error: function () {
                alertTips3("上传失败", "", "知道了");
            }
        });

        // App.uploadFile(App.applicationNm + "uploadIdCard", formData, function (res) {
        //     window.location.href = "./parfectInfo.html" + location.search;
        // });
    }

    $(".file-3").change(function () {
        showPhone("#card-1", this);
    });
    $(".file-2").change(function () {
        showPhone("#card-2", this);
    });
    $(".footer").click(function () {
        nextStep();
    });
});