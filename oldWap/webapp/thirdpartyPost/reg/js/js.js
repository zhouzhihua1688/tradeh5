var mob = "";
var url = "/mobileEC";
var t = 59;
var intervalId;
var temp = 0;
Zepto(function($){

	/*var dpr = window.devicePixelRatio;
    if (dpr >=1.5){
        img01 = 'images/banner01@2x.jpg';
        img02 = 'images/banner02@2x.jpg';
        $('.ban01').attr('src',img01);
        $('.ban02').attr('src',img02);
    }*/
    
    mob = getUrlParam("mob");
    $("#btn_ljty").on("tap", reg);
    $("#btn_next").on("tap", regConfirm);
    $("#resendBtn").on("tap", resend);
    $("#timePanel").show();
    $("#resendBtn").hide();
    if(window.location.pathname.indexOf("register.html", 0) > -1){
        intervalId = setInterval(resendTiming, 1000);
    }
//    $('.btnShare').on('click',function(){
//        $(this).addClass('animationjelly');
//		$('.share_overmask').addClass('show');
//		$(this).on("webkitAnimationEnd.tapanimate animationend.tapanimate", function(e) {
//			e.stopPropagation();
//			$(this).removeClass("animationjelly");
//		});
//		
//	});
//    $('.share_overmask').on('click',function(){
//		$(this).removeClass('show');
//	});
});
function getUrlParam(key){
	var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null){
		return unescape(r[2]);
	}
	return "";
}

function resendTiming(){
	if(t > 0){
	    $("#timePanel").show();
	    $("#resendBtn").hide();
		$("#time").html(t);
		t--;
	}else{
		t = 59;
		clearInterval(intervalId);
	    $("#timePanel").hide();
	    $("#resendBtn").show();
	}
}

function resend(){
	intervalId = setInterval(resendTiming, 1000);
	if(temp == 0){
		temp++;
		$.ajax({
			type : 'post',
			url : url +'/services/resend',
			data : JSON.stringify({"serialNo": ""}),
			dataType : 'json',
			success : function(data){
				temp = 0;
			},
			error : errorFun
		});
	}
}
function getUrlParam (key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return "";
}

function reg(){
	if(temp == 0){
		temp++;
		var mobile = $("#mobile").val();
		if(mobile == undefined || mobile == null || mobile == ""){
			alert("?????????????????????");
			return;
		}
		var dzhAC = escape(getUrlParam("dzh_ac"));
		if(dzhAC == undefined || dzhAC == null || dzhAC == ""){
			alert("??????????????????????????????");
			return;
		}
		$.ajax({
			type : 'post',
			url : url +'/services/account/register',
			data : JSON.stringify({"mobileNo": mobile}),
			dataType : 'json',
			success : function(data){
				temp = 0;
				if (0 == data.returnCode) {
					window.sessionStorage.setItem("serialNo", data.body.serialNo);
					window.sessionStorage.setItem("dzhAc", dzhAC);
					window.location = url + "/thirdpartyPost/reg/register.html?mob=" + mobile;
				} else {
					alert(data.returnMsg);
				}
			},
			error : errorFun
		});
	}
}

function regConfirm(){
	if(temp == 0){
		temp++;
		var serialNo = window.sessionStorage.getItem("serialNo");
		var authCode = $("#authCode").val();
		if(serialNo == undefined || serialNo == null || serialNo == ""){
			alert("????????????????????????");
			return;
		}
		if(authCode == undefined || authCode == null || authCode == ""){
			alert("?????????????????????");
			return;
		}
		var pwd = $("#pwd").val();
		if(pwd == undefined || pwd == null || pwd == ""){
			alert("????????????????????????");
			return;
		}else if(6 > pwd.length || 14 < pwd.length){
			alert("???????????????????????????");
			return;
		}
		var dzhAC = window.sessionStorage.getItem("dzhAc");
		if(dzhAC == undefined || dzhAC == null || dzhAC == ""){
			alert("??????????????????????????????");
			return;
		}
		$.ajax({
			type : 'post',
			url : url +'/services/account/register_loginpwd_web1',
			data : JSON.stringify({"serialNo": serialNo, "authCode": authCode, "password": pwd, "dzh_ac": dzhAC}),
			dataType : 'json',
			success : function(data){
				temp = 0;
				if (0 == data.returnCode) {
					fill();
				} else {
					alert(data.returnMsg);
				}
			},
			error : errorFun
		});
	}
}

function fill(){
	window.location = url + "/thirdpartyPost/reg/regSuc.html";
}

function errorFun(action, tp){
	temp = 0;
	alert('?????????????????????');
}