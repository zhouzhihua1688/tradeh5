$(function() {
    App.queryAccountInfo();
    var si = App.getSession(App.successInfo).replace("size=14", "class=\"f16\"");
    si = si.replace("size=6", "class=\"f12\"");
    si = si.replace("size=12", "class=\"f11\"");
    //$("#successInfo").html(si);
    App.confirmBtnEvent(function() {
        App.bind("#confirm_btn", "tap", function() {
            window.location = "../index/index.html"
        })
    })
});