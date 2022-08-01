$(function() {
    function init() {
        var param = App.getSession(App.param);
        if (App.isNotEmpty(param)) {

            var url = "/mobile-bff/v1/account/card-detailInfo?bankCardSerialid="+param ;
            App.get(url, null, function (result) {
                var card = result.body;

                    var signWay = "";
                    var signStyle = "";
                    if(card.signWay == "1"){
                        signStyle = "icon-shorcut";
                        signWay = "快捷";
                    }else if(card.signWay == "2"){
                        signStyle = "icon-union";
                        signWay = "银联通";
                    }else if(card.signWay == "3"){
                        signStyle = "icon-E-bank";
                        signWay = "网银";
                    }else if(card.signWay == "4"){
                        signStyle = "icon-E-bank";
                        signWay = "通联";
                    }else if(card.signWay == "6"){
                        signStyle = "icon-E-bank";
                        signWay = "云闪付";
                    }else if(card.signWay == "7"){
                        signStyle = "icon-E-bank";
                        signWay = "一网通";
                    }
                    $(".signWay-txt").html(signWay);
                    $(".signWay").html("<a class='icon " + signStyle + "'>" + signWay + "</a>");
                    $(".bank-name").html(card.bankGrpName+ ' '+(card.mainFlag == "Y" ? '<span class="mainFlg">主卡</span>' :''));
                    $(".bank-id").html(card.bankAccoDisplay + ' '+(card.bankAcctName ? card.bankAcctName :''));
                    $(".bank-icon").html('<img src="/mobileEC/images/bank/'+card.bankNo+'.png" class="bank-logo-new"/>');
                    if (card.singleThreashHold == -1) {
                        $("#singleThreashHold_panel").hide()
                    } else {
                        $("#singleThreashHold").html(App.numberFormat(card.singleThreashHold))
                    };
                    if (card.dayThreashHold == -1) {
                        $("#dayThreashHold_panel").hide()
                    } else {
                        $("#dayThreashHold").html(App.numberFormat(card.dayThreashHold))
                    };
                    if (card.limit <= 0) {
                        $("#limit_panel").hide()
                    } else {
                        $("#limit").html(App.numberFormat(card.realLimit))
                    };
                    var invnm = App.getSession(App.userInfo) == null ? "" : (App.getSession(App.userInfo).invnm || App.getSession(App.userInfo).invNm);
                    $("#userNm").html(invnm)
                }
            );
        }
    };
    init()
});