$(function(){
    var data = utils.getSession(utils.tradeChain);
    $('#change').on('click', changeChain);
    if(data && data.tradeVerify && data.tradeVerify.canChgVfyChain == '1'){ // 当前可切换验证链路
        $('#change').show();
    }

    function changeChain() {

    }

});