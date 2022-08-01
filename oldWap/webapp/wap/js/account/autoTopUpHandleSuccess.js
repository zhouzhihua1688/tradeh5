$(function() {
    var data = App.getSession(App.serialNo_success_show_data);
    var txt;
    if (data == "restart") {
        txt = "已恢复"
    } else if (data == "pause") {
        txt = "已暂停"
    } else {
        txt = "已删除"
    };
    $("#successInfo").html("自动充值计划" + txt + "！")
});