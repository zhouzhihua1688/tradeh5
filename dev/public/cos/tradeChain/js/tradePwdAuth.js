$(function () {
    utils.getBizConfig();
    var flag = false;
    var ul = $('.pwd-area ul');
    var li = $('.pwd-area li');
    var pnt = $('.pwd-area li i');
    var pwd = $('.pwd-area input');
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
    ul.on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (flag) {
            flag = false;
        } else {
            flag = true;
            pwd.focus();
        }
    });
    var bind_name = 'input';//定义所要绑定的事件名称
    if (navigator.userAgent.indexOf('MSIE') != -1) {
        bind_name = 'propertychange';//判断是否为IE内核 IE内核的事件名称要改为propertychange
    }
    pwd.on(bind_name, function (event) {
        var value = pwd.val().match(/\d{0,6}/g)[0];
        pwd.val('');
        value !== '' && pwd.val(value);
        var len = value.length;
        for (var i = 0; i < 6; i++) {
            i < len ? pnt.eq(i).css({'display': 'block'}) : pnt.eq(i).hide();
        }
        if ($(this).val() && $(this).val().length === 6) {
            $('.next-btn').addClass('active');
        } else {
            $('.next-btn').removeClass('active');
        }
    });


    $('.next-btn').on('click', function () {
        var myPassword = $('.pwd-area input').val();
        if (!$(this).hasClass('active') || !serialNoObj || !serialNoObj.serialNo) {
            return;
        }
        console.log("myPassword",myPassword)
        console.log("serialNoObj.serialNo",serialNoObj.serialNo)
        utils.ajax({
            url: '/mobile-bff/v1/verify/verifyPasswordWeb',
            type: 'POST',
            data: {
                serialNo: serialNoObj.serialNo,
                tradePwd: myPassword,
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