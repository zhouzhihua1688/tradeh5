$(function () {
    renderingPage();
    $(".investment").attr("href", "../fund/fund_mip.html?fundId=" + App.getUrlParam("fundId"));
    $(".buy").attr("href", "../fund/payment.html?fundId=" + App.getUrlParam("fundId"));
});

function renderingPage() {
    var item = App.getSession(App.selectedFund);
    if(item != undefined && item != null) {

        queryFundDetail();

        $("title").html(item.fund.fundNm);
        $("#fund_name").html(item.fund.fundNm + item.fund.fundId);
        $("#yield").html(App.formatMoney(item.fund.yield, 2));
        $("#seat_name").html(item.seatName);
        $("#balance").html(App.formatMoney(item.balance));
        $("#avaliable").html(App.formatMoney(item.avaliable));
        setVal("#union_balance", item.unionBalance == 0 ? "0.00" : App.formatMoney(item.unionBalance));
        $("#nav").html(App.formatMoney(item.fund.navStr, 3));
        App.transferColor("#nav", "color_green", "color_red");
        if(item.fund.navDt.length == 8){
            $("#nav_dt").html(item.fund.navDt.substring(4, 6) + "-" + item.fund.navDt.substring(6, 8));
        }
        if (item.isDirect == '1' && Number(item.mipFlagNum) > 0){
            $("#isMip").html("有");
        }
        if(item.melonmd == "0"){
            $("#melonmd").html("红利再投");
        } else if(item.melonmd == "-1"){
            $("#melonmd").html("请至代销机构处查询");
        } else {
            $("#melonmd").html("现金分红");
        }
    }
}

function queryFundDetail() {
    var item = App.getSession(App.selectedFund);
    var fundId = item.fund.fundId;
    var url = App.projectNm + "/fund/fund_detail_info?r=" + (Math.random()*10000).toFixed(0);
    if(App.isNotEmpty(fundId)){
        url += "&fundId=" + fundId;
    }

    App.get(url,null,function(result){
        if (result.body != undefined && result.body != null){
            // console.log(result);
            var fundInfo = result.body;
            var txt = "";
            if(fundInfo.fundSt == "1"){
                $(".buy").html("认购");
                txt += "认购费率：";
            }else{
                txt += "申购费率：";
            }
            $(".currency-type").html(fundInfo.currencyTypeUnit);
            txt += '<span style="text-decoration: line-through">'
                + Number(fundInfo.stdRate).toFixed(2)+'%</span> &nbsp;<span>'
                + Number(fundInfo.curRate).toFixed(2) + '%</span>&nbsp;&nbsp;&nbsp;';
            switch (fundInfo.fundSt) {
                case "0":
                case "2":
                    txt += "开放申购 开放赎回";
                    break;
                case "1":
                    txt += "开放认购（发行中）";
                    break;
                case "4":
                    txt += "暂停交易";
                    break;
                case "5":
                    txt += "暂停申购 开放赎回";
                    break;
                case "6":
                    txt += "开放申购 暂停赎回";
                    break;
                case "7":
                    txt += "开放认购";
                    break;
                case "8":
                    txt += "暂停交易（募集结束）";
                    break;
                case "9":
                    txt += "暂停交易（基金封闭）";
                    break;
            }

            if(fundInfo.canPurchase == '0' || fundInfo.fundSt == '4' || fundInfo.fundSt == '5'){
                $(".buy").html("暂停交易");
                $(".buy").parent("li").css('background', '#c6c6c6');
                $(".buy").unbind("click");
            } else {
                $("#view_feeRate").html(txt + '<br/>' + fundInfo.fundStShowDateDesc);
            }
            $("#view_feeRate").show();
        }
    });
}

function setVal(field, val, unit) {
    $(field).html(App.formatMoney(val) + (unit == undefined || unit == null ? "" : unit));
    if(Number(val) < 0){
        App.transferColor(field, "color_red", "color_green");
    } else {
        App.transferColor(field, "color_green", "color_red");
    }
}

//问号提示
$(".icon-question1").click(function () {
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html("该基金持仓收益与投入本金的比值")
    $(".Bomb-box1").show();
})
$(".icon-question2").click(function () {
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html("目前持有的基金份额对应的盈亏，不包括现金分红，现金分红计入已实现盈亏")
    $(".Bomb-box1").show();
})
$(".icon-question3").click(function () {
    $(".Bomb-box1 .Bomb-box-main .Bomb-box-content p").html("该基金历史以来累积持有份额产生的累积收益，包含已经赎回、转出的份额所产生的收益（包括现金分红）")
    $(".Bomb-box1").show();
})

$(".Bomb-box-ok").click(function () {
    $(this).parent().parent().hide();
})