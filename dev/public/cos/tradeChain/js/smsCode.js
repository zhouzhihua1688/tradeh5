$(function () {
    utils.getBizConfig();
    var time = 60;
    var intervalFlag = true;
    var intervalID = 0;
    var serialNoObj = utils.getSession(utils.tradeChain);
    if (serialNoObj && serialNoObj.tradeVerify && serialNoObj.tradeVerify.canChgVfyChain == '1') {  // 当前是否可切换验证链路，“1”-是，“0”-否
        $('#change').show();
    }
    $('#change>a').on('click', function () {
        utils.ajax({
            url: '/mobile-bff/v1/verify/changeVerifyWay',
            success: function (result) {
                if (result.returnCode == 0) {
                    utils.verifyTradeChain(result.body);
                } else if (result.returnCode != 0 && result.returnCode != 9999) {
                    $('.text-center').text(result.returnMsg);
                    $('.Bomb-box').show();
                } else {
                    $('.text-center').text('系统异常，请稍后再试!');
                    $('.Bomb-box').show();
                }
            }
        });
    });
    // 发送短信
    sendCodeBySerialNo();

    $('.sendCode').on('click', function () {
        if (intervalFlag) { // 计时器存在
            return false;
        }
        sendCodeBySerialNo();
    });

    function sendCodeBySerialNo() {
        utils.ajax({
            url: '/mobile-bff/v1/verify/sendSms',
            success: function (result) {
                if (result.returnCode == 0) {
                    if (result.body.mobileNo) {
                        var mobileNo = result.body.mobileNo;
                        $('.title').html('验证码已发送至您<span class="red">' + mobileNo.slice(0, 3) + '****' + mobileNo.slice(-4) + '</span>的手机上');
                    }
                    intervalFlag = true;
                    $('.sendCode').text(time + '秒后重发');
                    intervalID = setInterval(function () {
                        time--;
                        if (time === 0) {
                            time = 60;
                            $('.sendCode').text('发送验证码');
                            intervalFlag = false;
                            clearInterval(intervalID);
                        } else {
                            $('.sendCode').text(time + '秒后重发');
                        }
                    }, 1000);
                } else if (result.returnCode != 0 && result.returnCode != 9999) {
                    $('.text-center').text(result.returnMsg);
                    $('.Bomb-box').show();
                } else {
                    $('.text-center').text('系统异常，请稍后再试!');
                    $('.Bomb-box').show();
                }
            },
            error: function () {
                $('.text-center').text('系统异常，请稍后再试!');
                $('.Bomb-box').show();
            }
        });
    }

    $('.input-code').on('input', function (event) {
        if ($(this).val()) {
            $('.next-btn').addClass('active');
        } else {
            $('.next-btn').removeClass('active');
        }
    });


    $('.next-btn').on('click', function () {
        if (!$(this).hasClass('active') || !serialNoObj || !serialNoObj.serialNo) {
            return false;
        }
        utils.ajax({
            url: '/mobile-bff/v1/verify/verifySms',
            type: 'POST',
            data: {
                serialNo: serialNoObj.serialNo,
                authCode: $('.input-code').val(),
                loginFrom: 'W'
            },
            success: function (result) {
                if (result.returnCode == 0) {
                    if (result.body.hasNextStep == '1') {     // hasNextStep为1,需要继续验下一个交易链路
                        utils.verifyTradeChain(result.body.tradeResult);
                    } else if (result.body.hasNextStep == '0' && !result.body.tradeResult) {    // hasNextStep为0,交易链路验证完毕
                        result.body.successInfo && utils.setSession(utils.successInfo, result.body.successInfo);
                        if (result.body.execResult.ecTradeSerialNo && result.body.execResult.tradeAsyncQueryUrl ) {  // ecTradeSerialNo存在，需要轮询
                            utils.loadingShow();
                            tradeAsyncCircleQuery(result.body.execResult, utils.getSession(utils.tradeAsyncQueryTimesSession) || utils.tradeAsyncQueryTimes, utils.getSession(utils.tradeAsyncQueryIntervalSession) || utils.tradeAsyncQueryInterval);
                        } else if (result.body.execResult.extendFields && result.body.execResult.extendFields.applyNo ) {  //20220207 资产证明applyNo存在，需要轮询
                            utils.loadingShow();
                            assetCertAsyncCircleQuery(result.body.execResult, utils.getSession(utils.tradeAsyncQueryTimesSession) || utils.tradeAsyncQueryTimes, utils.getSession(utils.tradeAsyncQueryIntervalSession) || utils.tradeAsyncQueryInterval);
                        } else { // 不需要轮询
                            // 20211118 组合升级投顾，安全链路通过，业务接口返回数据存储，不需要轮询的情况 
                            if(result.body.execResult && result.body.execResult.fundgroupUpgrade){
                                utils.setSession(utils.fundgroupUpgrade, result.body.execResult.fundgroupUpgrade);
                            }
                            var forwordUrl = utils.getSession(utils.serialNo_forword_url);
                            if (forwordUrl) {
                                window.location.href = forwordUrl;
                            }
                        }
                    }
                } else if (result.returnCode != 0 && result.returnCode != 9999) {
                    $('.text-center').text(result.returnMsg);
                    $('.Bomb-box').show();
                } else {
                    $('.text-center').text('系统异常，请稍后再试!');
                    $('.Bomb-box').show();
                }
            },
            error: function () {
                $('.text-center').text('系统异常，请稍后再试!');
                $('.Bomb-box').show();
            }
        });
    });

});