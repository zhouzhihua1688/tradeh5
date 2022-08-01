$(function() {
    function init() {
        var param = App.getSession(App.param);
        if (App.isNotEmpty(param)) {
            var val = param.split(",");
            var cards = App.getSession(App.cards);
            for (var index in cards) {
                var card = cards[index];
                if (val[0] == card.bankNo && val[1] == card.bankAcco) {
                    var signWay = "";
                    var signStyle = "";
                    if (card.signWay == "1") {
                        signWay = "快捷";
                        signStyle = "icon-shorcut"
                    } else if (card.signWay == "2") {
                        signWay = "银联通";
                        signStyle = "icon-union"
                    } else if (card.signWay == "3") {
                        signWay = "网银";
                        signStyle = "icon-E-bank"
                    };
                    $(".signWay-txt").html(signWay);
                    $(".signWay").html("<a class='icon " + signStyle + "'>" + signWay + "</a>");
                    $(".bank-name").html(card.bankGrpName);
                    $(".bank-id").html(card.bankAccoDisplay);
                    $(".bank-icon").html("<i class='bank bank-panel2 ico_" + card.bankNo + " no-margin-left'></i>");
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
                    var invnm = App.getSession(App.userInfo) == null ? "" : App.getSession(App.userInfo).invnm;
                    $("#userNm").html(invnm)
                }
            }
        }
    };
    init()
});