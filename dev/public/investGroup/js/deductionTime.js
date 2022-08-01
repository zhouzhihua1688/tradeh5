
var mip = {
    "mipcycle":"MM",
    "mipbuyday":"1",
};
var chooseTime = {
    "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"],
    "ED": [],    
	"DD": []
};
$(".selected-deduction-cycle").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $(".appDate").blur();
    return false
});

$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    var time = chooseTime[li.attr("data-choose-time")],
        str = "";
    setMipCycle(li.attr("data-choose-time"));
    li.addClass("on").siblings("li").removeClass("on");
    if(time.length == 0){
        $(".choose-time").hide();
        $(".appDate").attr("data-time", li.find("div").text());
        $(".appDate").html(li.find("div").text());
        mip.mipcycle = "ED";
        delete mip.mipbuyday;
        // queryAutoRechargePageInfo();
        return;
    }else {
        if (!li.hasClass("on")) {
            for (var i = 0; i < time.length; i++) {
                str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
            };
            $(".choose-time2 ul").html(str);
            $(".appDate").attr("data-time", li.find("div").text())
        } else {
            for (var i = 0; i < time.length; i++) {
                str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
            };
            $(".choose-time2 ul").html(str);
            $(".appDate").attr("data-time", li.find("div").text())
        }
        $(".choose-time").hide();
        $(".choose-time2").show()
    }
});

$(".choose-time2").click(function() {
    var li = $(event.target).parents("li");
    setMipBuyday(li.attr("data-choose-time"));
    if (li.length == 0) {
        return
    };
    $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
    // queryAutoRechargePageInfo();
    $(this).hide()
});

function setMipCycle(mipCycle) {
    mip.mipcycle = mipCycle;
};
// function getMipCycle() {
//     return mip.mipcycle;
// };
// function getMipBuyday() {
//     return mip.mipbuyday;
// };
function setMipBuyday(mipBuyday) {
    mip.mipbuyday = mipBuyday;
};







// function queryAutoRechargePageInfo() {

//     var url = App.projectNm + "/fund/query_fund_mip_last_period_dt?date=" + (new Date()).getTime() + "&mipCycle=" + getMipCycle();

//     var mipBuyday = getMipBuyday();
//     if (mipBuyday != undefined && mipBuyday != null){
//         url += "&mipDt=" + mipBuyday;
//     }

//     App.get(url, null, function(result) {
//         var body = result.body;
//         if (body != null && body != undefined) {
//             $(".kkDate").html("下次扣款日期：<span style=\"color: #f66\">" + body.nextMipDate + '</span>，遇非交易日顺延');
//         }
//     });
// }

//     // 扣款周期
//     var chooseTime = {
//     "MM": ["01日", "02日", "03日", "04日", "05日", "06日", "07日", "08日", "09日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
//     "2W": ["周一", "周二", "周三", "周四", "周五"],
//     "WW": ["周一", "周二", "周三", "周四", "周五"],
//     "ED": [],
// 	"DD": []
// };
// $(".selected-deduction-cycle").click(function(event) {
//     event.preventDefault();
//     $(".choose-time").show();
//     $(".appDate").blur();
//     return false
// });
// $(".choose-time").click(function(event) {
//     var li = $(event.target).parents("li");
//     if (li.length == 0) {
//         $(".choose-time").hide();
//         return
//     };
//     var time = chooseTime[li.attr("data-choose-time")],
//         str = "";
//     setMipCycle(li.attr("data-choose-time"));
//     li.addClass("on").siblings("li").removeClass("on");
//     if(time.length == 0){
//         $(".choose-time").hide();
//         $(".appDate").attr("data-time", li.find("div").text());
//         $(".appDate").html(li.find("div").text());
//         mip.mipcycle = "ED";
//         delete mip.mipbuyday;
//         // queryAutoRechargePageInfo();
//         return;
//     }else {
//         if (!li.hasClass("on")) {
//             for (var i = 0; i < time.length; i++) {
//                 str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
//             };
//             $(".choose-time2 ul").html(str);
//             $(".appDate").attr("data-time", li.find("div").text())
//         } else {
//             for (var i = 0; i < time.length; i++) {
//                 str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
//             };
//             $(".choose-time2 ul").html(str);
//             $(".appDate").attr("data-time", li.find("div").text())
//         }
//         $(".choose-time").hide();
//         $(".choose-time2").show()
//     }
// });
// $(".choose-time2").click(function() {
// 	 var li = $(event.target).parents("li");
// 	 setMipBuyday(li.attr("data-choose-time"));
// 	 if (li.length == 0) {
// 	     return
// 	 };
// 	 $(".appDate").html($(".appDate").attr("data-time") + li.find("div").text());
// 	 // queryAutoRechargePageInfo();
// 	 $(this).hide()
// });
	

	

  

  


