$(function() {
    var si = App.getSession(App.successInfo);
    $("#successInfo").html(si);
    App.queryCard();
    App.queryAccountInfo();
    App.confirmBtnEvent(function() {
        App.bind("#confirm_btn", "tap", function() {
            window.location = "../index/index.html"
        })
    })
});