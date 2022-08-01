$(function(){
    App.get("/icif/v1/custs/qry-by-cust-no", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            var custInfo = result.body;
            if(App.isNotNull(custInfo)){
                var basicUserInfo = custInfo.icifPerCust;
                if(App.isNotNull(basicUserInfo)){
                    $("#name").html(basicUserInfo.invNm);
                    var idnoTxt;
                    if (App.isNotEmpty(basicUserInfo.idNo)){
                        idnoTxt = basicUserInfo.idNo.substr(0,3) + '****' + basicUserInfo.idNo.substr(basicUserInfo.idNo.length - 4, 4);
                        if(basicUserInfo.idTp == 'M'){
                            idnoTxt = '未认证';
                            isOpen = true;
                        }else if(basicUserInfo.idTp == '0'){
                            idnoTxt += '(身份证)';
                        }else if (basicUserInfo.idTp == '1'){
                            idnoTxt += '(护照)';
                        }else if (basicUserInfo.idTp == '2'){
                            idnoTxt += '(军官证)';
                        }else if (basicUserInfo.idTp == '3'){
                            idnoTxt += '(士兵证)';
                        }else if (basicUserInfo.idTp == '4'){
                            idnoTxt += '(港澳居民来往内地通行证)';
                        }else if (basicUserInfo.idTp == '5'){
                            idnoTxt += '(户口本)';
                        }else if (basicUserInfo.idTp == '6' || basicUserInfo.idTp == 'B'){
                            idnoTxt += '(外国人永久居留证)';
                        }else if (basicUserInfo.idTp == '7'){
                            idnoTxt += '(其他类型)';
                        }else if (basicUserInfo.idTp == '8'){
                            idnoTxt += '(文职证)';
                        }else if (basicUserInfo.idTp == '9'){
                            idnoTxt += '(警官证)';
                        }else if (basicUserInfo.idTp == 'A'){
                            idnoTxt += '(台胞证)';
                        }else if (basicUserInfo.idTp == 'F'){
                            idnoTxt += '(基金账号)';
                        }
                    }
                    $("#idno").html(idnoTxt);
                    if(App.isNotEmpty(basicUserInfo.idValiDate)){
                        if(basicUserInfo.idValiDate.indexOf("9999") > -1 || basicUserInfo.idValiDate.indexOf("2099") > -1){
                            $("#certValidDate").html("长期有效");
                        }else {
                            $("#certValidDate").html(basicUserInfo.idValiDate.substr(0,4)+"年"+basicUserInfo.idValiDate.substr(4,2)+"月"+basicUserInfo.idValiDate.substr(6,2)+"日");
                        }
                    }
                    if(App.isNotEmpty(basicUserInfo.mobile)){
                        $("#mobile").html(basicUserInfo.mobile.substr(0,3) + '****' + basicUserInfo.mobile.substr(basicUserInfo.mobile.length - 4, 4));
                    }

                    $("#employer").val(basicUserInfo.companyName);
                    $("#enterpriseIdNumber").val(basicUserInfo.companyIdNo);
                }
            }

        }
    });

    App.get("/icif/v1/pitdaccts", null, function (result) {
        if (result.body != undefined && result.body != null) {
            console.log(result);
            var pitdInvestAcct = result.body.pitdInvestAcct;
            var pitdInst = result.body.pitdInst;
            if(App.isNotNull(pitdInvestAcct)){
                $("#pitdInvestAcct").html(pitdInvestAcct.investAcct);
            }

        }
    });

    //编辑
    $("#btn-submit").click(function () {
        var dataClickTp = $("#btn-submit").attr("data-click-tp");
        if (dataClickTp == "edit") {
            $("#employer").removeAttr("readonly");
            $("#enterpriseIdNumber").removeAttr("readonly");
            $("#btn-submit").attr("data-click-tp", "save");
            $("#btn-submit").text("完成");
            return;
        }

        if (dataClickTp == "save") {
            var url = "/icif/v1/pcusts/ext-info";
            var companyName = $("#employer").val();
            var companyIdNo = $("#enterpriseIdNumber").val();
            var data = {"accptMd":"MOBILE", "companyName": companyName, "companyIdNo": companyIdNo};
            console.log(data)
            App.put(url, JSON.stringify(data), null, function (result) {
                var returnCode = result.returnCode;
                var returnMsg = result.returnMsg;
                if (returnCode == 0) {
                    $("#employer").attr("readonly", "true");
                    $("#enterpriseIdNumber").attr("readonly", "true");
                    $("#btn-submit").attr("data-click-tp", "edit");
                    $("#btn-submit").text("编辑");
                } else {
                    alertTips('<div style="line-height: 1.5;">'+ returnMsg +'</div>');
                    return;
                }
            });
        }
    });

});
