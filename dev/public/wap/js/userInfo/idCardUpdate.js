$(function () {
    $(".tap-tap").click(function () {
        $(".tip-dailog").show();
    });
    $(".close-tip").click(function(){
        $(".tip-dailog").hide();
    });

    $('.checkBox').on('click', function () {
        if ($(this).attr('src') === '../images/checkBox.png') {
            $(this).attr('src', '../images/checked.png');
        } else {
            $(this).attr('src', '../images/checkBox.png')
        }
    })

    function  showPhone(panel, obj){
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
    var limitSize = 500;//最大500kb
	function awaitWrap(promise) { // await 异常处理包装
		return promise.then(res => [null, res], error => [error, null]);
	}
    //新接口
    async function nextStep() {
        var file1 = $(".file-1").get(0).files[0];
        var file2 = $(".file-2").get(0).files[0];
        var fileall = [];  //存放图片的容器
        // 证件类型(M-未认证，0-身份证，1-护照，2-军官证，3-士兵证，4-港澳通行证，5-户口本，6-外国人永久居留证，7-其他，8-文职证，9-警官证)
        var idTp = '0';
        console.log('idTp=', idTp);

        //是否自动保存地址
        var isAuto = 1;
        if ($(".checkBox").attr('src') === '../images/checkBox.png') {
            isAuto = 0;
        }

        if (!file1) {
            alertTips3("身份证人像面不能为空", "", "知道了");
            return;
        }
        if (!file2) {
            alertTips3("身份证国徽面不能为空", "", "知道了");
            return;
        }
		let [error1, res1] = await awaitWrap(compress(file1, limitSize)); 
		let [error2, res2] = await awaitWrap(compress(file2, limitSize)); 
		if(!error1&&res1){
			file1 = res1.compressFile
		}
		if(!error2&&res2){
			file2 = res2.compressFile
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
            url: `/mobile-bff/v1/account/upload-cust-cert-pic?idTp=` + idTp + `&isAuto=`+ isAuto,
            type: "POST",
            data: formData, // 上传formdata封装的数据
            // headers: {
            //     Accept: "application/json; charset=utf-8"
            // },
            dataType: 'JSON',
            cache: false,                      // 不缓存
			timeout: 30000, //超时时间：30秒
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

                        utils.ajax({
                            url: `/mobile-bff/v1/account/upload-cust-cert-pic-finish`,
                            type: "POST",
                            data: JSON.stringify({
                                frontIdPath: frontPath,
                                frontIdPicSize: frontIdPicSize,
                                backIdPath: backPath,
                                backIdPicSize: backIdPicSize,
                                idTp: idTp,
                                operType: '01'
                            }),
                            success: function (result) {
                                console.log(result);
                                App.isLoading(false);
                                if (result.returnCode == 0) {
                                    // alertTips3("上传并提交成功", "", "知道了");
                                    window.location.href = "./parfectInfo.html" + location.search;  //提交成功跳转到个人信息页面
                                } else {
                                    alertTips3(result.returnMsg, "", "知道了");
                                }
                            },
                            error: function () {
								App.isLoading(false);
                                alertTips3("提交失败", "", "知道了");
                            }
                        });
                    }
                } else {
                    alertTips3(res.returnMsg, "", "知道了");
                }
            },
            error: function () {
				App.isLoading(false);
                alertTips3("上传失败，请稍后重试。", "", "知道了");
            }
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