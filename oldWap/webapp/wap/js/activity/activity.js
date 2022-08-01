$(function() {
    queryActivity()
});

function queryActivity() {
    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=wxActivity&date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        if (result.returnCode == 0 && result.body != undefined && result.body != null) {
            var layoutList = result.body.layout;
            for (index in layoutList) {
                var layout = layoutList[index];
                if (index == 0) {
                    subQuery(layout, $("#activity_onLine ul"), 0)
                } else {
                    subQuery(layout, $("#activity_offLine ul"), 1)
                }
            }
        }
    })
};

function subQuery(layout, panel, isJS) {
    if (layout != undefined && layout != null) {
        var dataUrl = App.projectNm + layout.requestUrl.substr(8);
        App.get(dataUrl, null, function(res) {
            if (res.returnCode == 0 && res.body != undefined && res.body != null) {
                var themeList = res.body.theme;
                for (i in themeList) {
                    var theme = themeList[i];
                    var themeDataList = theme.object;
                    for (j in themeDataList) {
                        themeData = themeDataList[j];
                        var html = '<li><a href="' + themeData.wapjumpurl + '">' + (isJS == 1 ? '<span class="end-lable">已结束</span>' : '') + '<img src="' + themeData.imageurl + '">' + '<div class="activity-title">' + '    <h4>' + themeData.title + '</h4>' + '    <p class="font-arial">活动时间：' + themeData.actStartTime + '至' + themeData.actEndTime + '</p>' + '    <p>' + themeData.description + '</p>' + '</div>' + '</a></li>';
                        $(panel).append(html)
                    }
                }
            }
        })
    }
}