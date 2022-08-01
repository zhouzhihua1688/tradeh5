var fundLists = App.getSession(App.recomfundLists);

function init() {
    if (fundLists == null || fundLists.length == 0) {
        queryFundList();
        fundLists = App.getSession(App.recomfundLists)
    };
    showFundList(fundLists)
};
init();

function queryFundList() {
    var url = App.projectNm + "/fund/query_recommend_funds";
    App.get(url, null, function(result) {
        App.setSession(App.recomfundLists, result.body.recommendFunds);
        showFundList(result.body.recommendFunds);
        App.setSession(App.bannerInfo, result.body.bannerInfo)
    })
}