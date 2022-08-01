var mob = "";
var url = "/mobileEC";
var t = 59;
var intervalId;
var temp = 0;
Zepto(function($){
    var dpr = window.devicePixelRatio;
    if (dpr >=1.5){
        img01 = 'images/banner01@2x.jpg';
        img02 = 'images/banner02@2x.jpg';
        $('.ban01').attr('src',img01);
        $('.ban02').attr('src',img02);
    }
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

function reg(){
	if(temp == 0){
		temp++;
		var mobile = $("#mobile").val();
		if(mobile == undefined || mobile == null || mobile == ""){
			alert("请输入手机号！");
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
					window.location = url + "/zeroAct_150122/register.html?mob=" + mob;
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
			alert("请先输入手机号！");
			return;
		}
		if(authCode == undefined || authCode == null || authCode == ""){
			alert("请输入验证码！");
			return;
		}
		$.ajax({
			type : 'post',
			url : url +'/services/account/register_confirm',
			data : JSON.stringify({"serialNo": serialNo, "authCode": authCode}),
			dataType : 'json',
			success : function(data){
				temp = 0;
				if (0 == data.returnCode) {
					window.sessionStorage.setItem("serialNo", data.body.serialNo);
					regPwd();
				} else {
					alert(data.returnMsg);
				}
			},
			error : errorFun
		});
	}
}

function regPwd(){
	var serialNo = window.sessionStorage.getItem("serialNo");
	var pwd = $("#pwd").val();
	if(serialNo == undefined || serialNo == null || serialNo == ""){
		alert("请先输入手机号！");
		return;
	}
	if(pwd == undefined || pwd == null || pwd == ""){
		alert("请输入登录密码！");
		return;
	}else if(6 > pwd.length || 14 < pwd.length){
		alert("登录密码长度不对！");
		return;
	}
	$.ajax({
		type : 'post',
		url : url +'/services/account/register_loginpwd_web',
		data : JSON.stringify({"serialNo": serialNo, "password": pwd}),
		dataType : 'json',
		success : function(data){
			if (0 == data.returnCode) {
				fill();
			} else {
				alert(data.returnMsg);
			}
		},
		error : errorFun
	});
}

function fill(){
	if(mob == undefined || mob == null || mob == ""){
		alert("推荐人手机号不能为空！");
		return;
	}
	$.ajax({
		type : 'post',
		url : url +'/services/account/fill_inviter_info',
		data : JSON.stringify({"inviterMob": mob}),
		dataType : 'json',
		success : function(data){
			if (0 == data.returnCode) {
				
				window.location = url + "/zeroAct_150122/regSuc.html";
			} else {
				alert(data.returnMsg);
			}
		},
		error : errorFun
	});
}

function errorFun(action, tp){
	temp = 0;
	alert('网络连接错误！');
}