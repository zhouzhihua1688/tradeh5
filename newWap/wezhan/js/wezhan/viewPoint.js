$(function () {
    $('.tab1 li').click(function () {
        if ($(this).hasClass("active")) {
            return;
        }
        if($(this).find("a").html()=='添财创造营'){
            $("body").css("background","#fff")
        }else{
            $("body").css("background","#f6f6f6")
        }
        // console.log($(this).find("a").html());
        if($(this).index() == 2){
            $(".i_ask").show();
        }else {
            $(".i_ask").hide();
        }
        $(this).addClass("active").siblings().removeClass('active');
        $(this).parent().siblings().hide().eq($(this).index()).show()
    });
    $(".i_ask").click(function () {
        window.location.href = 'ask.html';
    });
    $(".question").click(function () {
        $(".mask").show();
    });
    $(".close").click(function () {
        $(".mask").hide();
    });
    $(".top_titles a").each(function (index) {
        if (index == ($(".top_titles a").length - 1)) {
            $(this).css('marginRight', '0')
        }
    });
    $(".show_more").click(function () {
        showMore();
    });
    var tabIdx = App.getUrlParam("tabIdx");
    if(tabIdx == 2) {
        $('.tab1 li').eq(2).addClass("active").siblings().removeClass('active');
        $('.tab1').siblings().hide().eq(2).show();
        $(".i_ask").show();
    } else if(tabIdx == 1) {
        $('.tab1 li').eq(1).addClass("active").siblings().removeClass('active');
        $('.tab1').siblings().hide().eq(1).show();
    } else {
        $('.tab1 li').eq(0).addClass("active").siblings().removeClass('active');
        $('.tab1').siblings().hide().eq(0).show();
    }
    $(".footer_h").show();
    showTagList();
    queryMarketInterpretation(pageNo);
    queryAskLayout();
    queryLayout();
    queryCommentInfo(commentInfoPageNo);
});
var pageNo = 1;
var clickShowPageNo = 1;
var showMorePageNo = 1;
var commentInfoPageNo = 1;
var tagList = [];
var type = 1;
var pageSize = 10;
var num = 0;
function clickShowMarketInterpretation(queryPageNo,tags,type,index) {
    if(index != null){
        if($(".top_titles a").eq(index).hasClass('btn-active')){
            $(".top_titles a").eq(index).removeClass('btn-active')
            num -= 1;
        }else{
            $(".top_titles a").eq(index).addClass('btn-active')
            num += 1;
        }
    }
    if(num ==0){
        pageNo = 1;
    }
    if(tags != null && tags != "" && tags != undefined){
        var index = tagList.indexOf(tags);
        if(index>-1){
            tagList.splice(index,1);
        }else {
            tagList.push(tags);
        }
    }
    var tag = '' ;
    tagList.forEach(function (item) {
        if(item != "" && item != null && item != undefined){
            var index = tag.indexOf(item);
            if(index > -1){
                var reg = /(.)(?=,*\1)/g;
                tag = tag.replace(reg,"");
            }else {
                if(tag.length == 0){
                    tag += item ;
                }else {
                    tag += ","+item;
                }
            }
        }
    })
    var data = {
        'catalogId': '4076',
        'pageSize': pageSize,
        'pageNo': queryPageNo,
        'sortInfo':{"orderFiled":"createDate","orderType":"DESC"},
        'tagList': tag.split(",")
    };
    if(data.tagList == null || data.tagList == "" || data.tagList == undefined ){
        data.tagList = [];
    }
    var url ='/ess/v1/article/articles';
    App.post(url,JSON.stringify(data),null, function (result) {
        var infos = result.body;
        if(infos != undefined && infos != null){
            var html = '';
            infos.forEach(function (item) {

				if(App.isEmpty(item.picture)){
					html += '<div class="group1_content" onclick="javascript:window.location.href=\''+ item.url.replace(/index.html/,'share.html') +'\'">' +
						'<div>'+ item.title +'<img src="../img/wezhan/hot.png" alt="" class="hide '+(item.isHot == 1 ? 'show' : '')+'"></div>' +
						'<p>'+ item.brief +'</p>' +
						'<div class="group1_tip">' +
						(item.tags == null?'<span style="display: none;"></span> ':splitArray(item.tagList))+
						'   <span>'+ item.createDate +'</span>' +
						'</div>' +
						'</div>';
				}else{
					html += '<div class="group1_content" onclick="javascript:window.location.href=\''+ item.url.replace(/index.html/,'share.html') +'\'">' +
						   '<div class="textAndImg">'+
								'<div class="one">'+
									'<div>'+ item.title +'<img src="../img/wezhan/hot.png" alt="" class="hide '+(item.isHot == 1 ? 'show' : '')+'"></div>'+
									'<div>'+ item.brief +'</div>'+
									'<div class="group1_tip">' +
									(item.tags == null?'<span style="display: none;"></span> ':splitArray(item.tagList))+
									'   <span>'+ item.createDate +'</span>' +
									'</div>' +
								'</div>'+
								'<div class="two"><img src="'+item.picture+'" alt=""></div>'+
						   '</div>'+
						'</div>';	
				}
            });
            if (type == 1) {
                $(".group1_content_panel").html(html);
            } else {
                $(".group1_content_panel").append(html);
            }

            if(infos.length < pageSize){
                $(".show_more").hide();
            } else {
                $(".show_more").show();
            }
        } else {
            $(".show_more").hide();
        }
    });
}
function showMore() {
    if (tagList.length > 0) {
        showMorePageNo++;
        queryMarketInterpretation(showMorePageNo,tagList,2);
    } else{
        pageNo++;
        queryMarketInterpretation(pageNo);
    }
}

var LayoutFramework = {
    wap_advice_list: {
        base_frame:"<div class='group2'>" +
        "    <h2><span class='fl wap_advice_list_{index}_title'></span><a class='fr wap_advice_list_{index}_moreTxt'></a></h2>" +
        "    <div class='group2_content wap_advice_list_{index}'>" +
        "    </div>" +
        "</div>",
        data_frame: "<a style='display: block;' href='{url}'><img src='{imageUrl}'>" +
        "<p>{adviceDesc}</p></a>"
    },
    wap_banner: {
        base_frame:"<div class='swiper-container banner swiper-banner'>" +
        "<div class='swiper-wrapper wap_banner_{index}'></div>" +
        "<div class='swiper-pagination'></div>" +
        "</div>",
        data_frame:"<a href='{url}' class='swiper_img swiper-slide'><img src='{imageUrl}'></a>"
    },
	floatingImage:{
        base_frame:"<div class='side-right floatingImage_{index}' ></div>",
        data_frame:"<a href='{btnUrl}'><img src='{imageUrl}'>{btnName}</a>"
	},
    wap_line:"<div><img src='../img/account/huixian.png'></div>"
}

function queryLayout() {
    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=view_point&r=" + (Math.random()*10000).toFixed(0);

    App.get(url,null,function(result){
        // console.log("layout:", result);
        if (result.body.layout != undefined && result.body.layout != null){
            var layoutList = result.body.layout;
            var isAddLine = false;
            for (var index in layoutList) {
                var layoutObj = layoutList[index];
                Layout.drawingLayoutNew('#panel', layoutObj, index, LayoutFramework[layoutObj.temId], isAddLine);
            }
        }
    });
}

function queryAskLayout() {
    var url = App.projectNm + "/app_func/query_cust_layout?layoutId=view_point_ask&r=" + (Math.random()*10000).toFixed(0);

    App.get(url,null,function(result){
        // console.log("layout:", result);
        if (result.body.layout != undefined && result.body.layout != null){
            var layoutList = result.body.layout;
            var isAddLine = false;
            for (var index in layoutList) {
                var layoutObj = layoutList[index];
                Layout.drawingLayoutNew('#panel2', layoutObj, index, LayoutFramework[layoutObj.temId], isAddLine);
            }

        }
    });
}

function queryCommentInfo(pageNoTemp) {
    var url = '/sfs/api/v1/message-board/query-comment-info';
    var data = {"itemId":"wapView001", "itemTp":"9", "itemType":"9","pageNo": pageNoTemp, "pageSize":"10"};
    App.postNoJump(url, JSON.stringify(data), null, function (result) {
        if(result.returnCode == 0){
            commentInfoPageNo++;
            var info = result.body;
            if(info != undefined && info != null){
                var list = info.rows;
                if(list != undefined && list != null) {
                    var html = '';
                    list.forEach(function (item) {
                        var replyList = item.replyList;
                        var replyHtml = '';
                        if(replyList != null && replyList != undefined) {
                            replyList.forEach(function (reply) {
                                replyHtml += '<p class="user_a">回答：'+ (reply != undefined && reply != null ? reply.commentContent : '') +'</p>' +
                                    '<div class="content_r_footer">' +
                                    '    <span class="fl">'+ (reply != undefined && reply != null ? reply.commentDate : '') +'</span>' +
                                    '    <a href="javascript:;" class="fr" onclick="custLike()">' +
                                    '        <i class="'+ (reply.like ? 'is_like':'not_like') +'" data-reply-id="'+ reply.replyId +'" data-list-st="'+ (reply.like ? "1" : "0") +'"></i> <sup>'+ (reply != undefined && reply != null ? reply.likeCountDisplay : '0') +'</sup>' +
                                    '    </a>' +
                                    '</div>';
                            });
                        }
                        html += '<div class="group3">' +
                            '    <div class="group3_content_l fl">' +
                            '        <img src="'+ item.avatarImg +'" alt="">' +
                            '    </div>' +
                            '    <div class="group3_content_r fr">' +
                            '        <div class="user">' +
                            '            <p class="fl"><span class="blue">'+ item.nickname +'</span><span>提出了问题</span></p> <!--<i class="fr"></i>-->' +
                            '        </div>' +
                            '        <p class="user_q">'+ item.commentContent +'</p>' +
                            replyHtml +
                            '    </div>' +
                            '</div>';
                    });
                    $(".question_content_panel").append(html);
                }
            }
        } else {
            $('.tab1 li').eq(2).hide();
            $('.tab1 li').each(function(){
                $(this).width('50%');
            });
        }
    });
}

function custLike(){
    var eventTarget = $(event.target);
    var targetEl_I,targetEl_SUP;
    if(eventTarget[0].tagName == "I"){
        targetEl_I = eventTarget;
        targetEl_SUP = eventTarget.siblings("sup");
    } else if(eventTarget[0].tagName == "SUP"){
        targetEl_I = eventTarget.siblings("i");
        targetEl_SUP = eventTarget;
    } else {
        targetEl_I = eventTarget.find("I");
        targetEl_SUP = eventTarget.find("SUP");
    }
    var number = Number(targetEl_SUP.html().trim());
    if(targetEl_I.hasClass("is_like")){
        number = number <= 0 ? 0 : (number - 1);
        targetEl_SUP.html(number);
        targetEl_I.attr("data-list-st", "0");
        targetEl_I.removeClass("is_like");
        targetEl_I.addClass("not_like");
    } else {
        number = number < 0 ? 0 : (number + 1);
        targetEl_SUP.html(number);
        targetEl_I.attr("data-list-st", "1");
        targetEl_I.removeClass("not_like");
        targetEl_I.addClass("is_like");
    }

    var replyId = targetEl_I.attr("data-reply-id");
    var thumbUp = targetEl_I.attr("data-list-st");
    var url = '/sfs/api/v1/item/cust-like';
    var data = {"itemId":replyId, "itemTp":"7", "thumbUp": thumbUp};
    App.post(url, JSON.stringify(data), null, function (result) {
        var info = result.body;
        // if(info != undefined && info != null){
        //     $(event.target).children("sup").html(info.likeCountDisplay);
        // }
    });
}

function showTagList() {
    var url ='/ess/v1/article/tags?catalogId=4076';
    App.get(url,null,function (result) {
        if( result != undefined && result != null){
            var infos = result.body;
            var html = '';
            if(infos != undefined && infos != null) {
                infos.forEach(function (item,index) {
                    html +='<a href="javascript:;"  onclick="clickShowMarketInterpretation(clickShowPageNo,\''+item+'\',1,'+index+')">#'+item+'</a>'
                })
                $(".top_titles").append(html);
            }
        }
    })
}
function queryMarketInterpretation(pageNo) {
    var data = {
        'catalogId': '4076',
        'pageSize': pageSize,
        'pageNo': pageNo,
        'sortInfo':{"orderFiled":"createDate","orderType":"DESC"},
        'tagList': tagList
    };
    var url ='/ess/v1/article/articles';
    App.post(url,JSON.stringify(data), null, function (result) {
        var infos = result.body;
        if(infos != undefined && infos != null){
            var html = '';
            infos.forEach(function (item) {
			
				
				if(App.isEmpty(item.picture)){
					html += '<div class="group1_content" onclick="javascript:window.location.href=\''+ item.url.replace(/index.html/,'share.html') +'\'">' +
						'<div class="f_title">'+ item.title +'<img src="../img/wezhan/hot.png" alt="" class="hide '+(item.isHot == 1 ? 'show' : '')+'"></div>' +
						'<p>'+ item.brief +'</p>' +
						'<div class="group1_tip">' +
						(item.tags == null?'<span style="display: none;"></span> ':splitArray(item.tagList))+
						'   <span>'+ item.createDate +'</span>' +
						'</div>' +
						'</div>';
				}else{
					html += '<div class="group1_content" onclick="javascript:window.location.href=\''+ item.url.replace(/index.html/,'share.html') +'\'">' +
						   '<div class="textAndImg">'+
								'<div class="one">'+
									'<div>'+ item.title +'<img src="../img/wezhan/hot.png" alt="" class="hide '+(item.isHot == 1 ? 'show' : '')+'"></div>'+
									'<div>'+ item.brief +'</div>'+
									'<div class="group1_tip">' +
									(item.tags == null?'<span style="display: none;"></span> ':splitArray(item.tagList))+
									'   <span>'+ item.createDate +'</span>' +
									'</div>' +
								'</div>'+
								'<div class="two"><img src="'+item.picture+'" alt=""></div>'+
						   '</div>'+
						'</div>';	
				}
            });
            $(".group1_content_panel").append(html);
            if(infos.length < pageSize){
                $(".show_more").hide();
            } else {
                $(".show_more").show();
            }
        } else {
            $(".show_more").hide();
        }
    });
}
function splitArray(item) {
    var html = '';
    item.forEach(function (item) {
        html += '<span class="tags">#'+item+'</span>'
    })
    return html;
}



