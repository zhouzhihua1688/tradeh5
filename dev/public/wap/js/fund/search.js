if (typeof WeixinJSBridge != "undefined") {
    $(".search-box").css({
        'top': '0px',
        'background': '#ebebeb'
    });
    $(".search-hide").css({
        'top': '40px'
    })
};
var fundLists = App.getSession(App.fundLists);

function init() {
    if (fundLists == null || fundLists.length == 0) {
        queryFundList();
        fundLists = App.getSession(App.fundLists)
    };
    showFundList(fundLists, fundtp)
};
init();
$(function() {
    App.bind("#search_type", "tap", function() {
        var cur_css = $(this).attr("class");
        if (cur_css != 'input-left') {
            $(".search-box-background").hide();
            $(".fund_list").css({
                'position': ''
            });
            $(".search-hide").hide();
            $(this).attr({
                "class": "input-left"
            })
        } else {
            $(".fund_list").css({
                'position': 'absolute'
            });
            $(".search-box-background").css({
                'height': document.body.scrollHeight + "px"
            });
            $(".search-box-background").show();
            $(".search-hide").show();
            $(this).attr({
                "class": "input-left down"
            })
        }
    });
    App.bind(".div-list", "tap", function() {
        $("#search_type").text($(this).text());
        $(".search-box-background").hide();
        $(".fund_list").css({
            'position': ''
        });
        $(".search-hide").hide();
        $("#search_type").attr({
            "class": "input-left"
        });
        var tp = $(this).attr("data");
        $(".fund_list").html('');
        if (tp != '-1') {
            showFundList(fundLists, tp)
        } else {
            showFundList(fundLists)
        }
    })
});

function queryFundList() {
    var url = App.projectNm + "/fund/fund_query";
    App.get(url, null, function(result) {
        App.setSession(App.fundLists, result.body.fund);
        showFundList(result.body.fund, fundtp)
    })
};
window.onscroll = function() {
    var t = document.body.scrollTop;
    if (typeof WeixinJSBridge == "undefined") {
        if (t > 30) {
            $(".search-box").css({
                'top': '0px',
                'background': '#ebebeb'
            });
            $(".search-hide").css({
                'top': '40px'
            })
        } else {
            $(".search-box").css({
                'top': '50px',
                'background': ''
            });
            $(".search-hide").css({
                'top': '90px'
            })
        }
    } else {
        $(".search-box").css({
            'top': '0px',
            'background': '#ebebeb'
        });
        $(".search-hide").css({
            'top': '40px'
        })
    }
};
$("#search_txt").focus(function() {
    $(this).val('')
});
$("#search_txt").blur(function() {
    if ($(this).val() == '' || $(this).val() == '请输入代码或名称查询') {
        $(this).val('请输入代码或名称查询')
    }
});
$("#search_txt").keyup(function() {
    $(".fund_list").html('');
    showFundList(fundLists, -1, $(this).val())
});