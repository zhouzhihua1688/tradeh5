$(function () {
    utils.getBizConfig();
    var topBankCardInfo = {};
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
    // 头部银行卡信息查询
    changeBankCard();
    $('#changeCard').on('click', function () {
        utils.ajax({
            url: '/mobile-bff/v1/verify/changeCustVerifyInfo',
            success: function (result) {
                if (result.returnCode == 0) {
                    topBankCardInfo = result.body;
                    $('.bank-card').html(result.body.bankQuestion);
                    if (result.body.bankCardNum > 1) {
                        $('#changeCard').show();
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

    function changeBankCard() {
        utils.ajax({
            url: '/mobile-bff/v1/verify/queryCustVerifyInfo',
            success: function (result) {
                if (result.returnCode == 0) {
                    topBankCardInfo = result.body;
                    $('.bank-card').html(result.body.bankQuestion);
                    if (result.body.bankCardNum > 1) {
                        $('#changeCard').show();
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
    }


    // 下一步按钮点击事件
    $('.next-btn').on('click', function () {
        if (!$(this).hasClass('active') || !topBankCardInfo.bankName || !topBankCardInfo.bankAccoFix || !serialNoObj || !serialNoObj.serialNo) {
            return false;
        }
        var idTp = 'M';
        if ($('#idType').html() === '身份证') {
            idTp = '0'
        }
        if ($('#idType').html() === '中国护照') {
            idTp = '1'
        }
        if ($('#idType').html() === '户口本') {
            idTp = '5'
        }
        if ($('#idType').html() === '台胞证') {
            idTp = 'A'
        }
        if ($('#idType').html() === '港澳通行证') {
            idTp = '4'
        }
        utils.ajax({
            url: '/mobile-bff/v1/verify/verifyCustInfo',
            type: 'POST',
            data: {
                bankAcco: $('#bankAcco').val(),
                bankAccoFix: topBankCardInfo.bankAccoFix,
                bankName: topBankCardInfo.bankName,
                // couponSerialNo: "string",
                idNo: $('#idNo').val(),
                idTp: idTp,
                serialNo: serialNoObj.serialNo,
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
    var selectType = new MobileSelect({
        trigger: '#selectType',
        wheels: [
            {data: ['身份证', '中国护照', '户口本', '台胞证', '港澳通行证']}
        ],
        transitionEnd: function (indexArr, data) {
            //console.log(data);
        },
        callback: function (indexArr, data) {
            $('#idType').text(data[0]);
        }
    });
    $('.id-info .input-block:first-child').on('click', function () {
        selectType.show();
    });
    $('#bankAcco').on('input', function (event) {
        if ($(this).val() && $('#idNo').val()) {
            $('.next-btn').addClass('active');
        } else {
            $('.next-btn').removeClass('active');
        }
    });
    $('#idNo').on('input', function (event) {
        if ($(this).val() && $('#bankAcco').val()) {
            $('.next-btn').addClass('active');
        } else {
            $('.next-btn').removeClass('active');
        }
    });
});