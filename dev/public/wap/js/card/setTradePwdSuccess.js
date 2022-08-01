$(function() {
	App.setSession("only_set_trade_pwd",0);
    App.queryCard();
    App.queryUserInfo()
    if(utils.getCookie('channelCode') != 'airstar' || utils.getCookie('channelCode') != 'zhengtong'){
        $('.text-center').show();
    }
    else { // 小米金融内
        App.get("/mobile-bff/v1/common/check-union-risk-level",null,function(result){
            if(result.returnCode == 0 && result.body){
                if(result.body.code != '0000'){ // 未做过风险测评
                    $('#newBtnLayout').html('<div class="new-btn-layout-text">' +
                        '<span>完成风险测评后可顺利购买产品!</span>' +
                        '</div>' +
                        '<div class="new-btn-layout">' +
                        '<div id="goBackBtn">返回</div>' +
                        '<div id="goRiskTest">去风险测评</div>' +
                        '</div>');
                }
                else { // 已经做过风险测评
                    $('#newBtnLayout').html('<div class="new-btn-layout2"><div id="goBackBtn">返回</div></div>');
                }
                var referUrl = decodeURIComponent(App.getUrlParam('referUrl'));
                $('#goRiskTest').on('click',function(){
                    window.location.href = '../common/riskTest.html' + (referUrl ? '?forwardUrl=' + encodeURIComponent(referUrl) : '');
                });
                $('#goBackBtn').on('click',function(){
                    window.location.href = referUrl ? referUrl : '../wezhan/service.html';
                });
                $('#newBtnLayout').show();
            }
        });
    }
});