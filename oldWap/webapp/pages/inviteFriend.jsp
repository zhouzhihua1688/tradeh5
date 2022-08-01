<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.fund.etrading.mclient.common.Tools" %>
<%@page import="com.fund.etrading.mclient.service.AccountService" %>
<%@page import="com.fund.etrading.mclient.model.AccountInfo" %>
<%@page import="com.fund.etrading.mclient.common.MobileHttpClient"%>
<%@page import="com.fund.etrading.mclient.common.Constants"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext" %>
<%@page import="com.fund.etrading.mclient.model.UserInfo" %>
<%@page import="com.fund.etrading.mclient.framework.factory.AccountServiceBuilderFactory"%>
<%
	new MClientThreadContext(request, response);
	String path = request.getContextPath();
	AccountService accountService = Tools.getBean("accountServiceBuilderFactory", AccountServiceBuilderFactory.class).genAccountService();
	AccountInfo accountInfo = accountService.account();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<title>邀请好友</title>
<style>
body{background-color: #ebebeb;outline: none;}
p{text-align: center;margin: 8px 0px;width: 100%;font-size: 16px;color: #979797;width: 100%;}
button{width: 100%;height: 50px;border: 0px;border-radius: 6px;-moz-border-radius: 6px;background-color: #fe7b20;color: white;font-size: 20px;outline: none;}
textarea{width: 100%;font-size: 16px;height: 80px;border-color: #d8d8d8;border-radius: 6px;-moz-border-radius: 6px;resize:none;outline: none;padding: 5px 0px 0px 0px;}
footer{text-align: center;}
span{float: left;}
a{float: right;}
.p{padding: 14px 0px;}
</style>
<script type="text/javascript" src="../basic/jquery.3.4.1.min.js"></script>
<script type="text/javascript" src="js/jquery.base64.js"></script>
<script type="text/javascript">

var cardTextArr = ['用现金宝，卡再多也不怕，终于能做个安静的美男子了'
               	,'做不了秒杀高考数学题的考神，好歹让我做个取现秒到的宝神！'
               	,'让我独享现金宝？臣妾做不到啊！！！'
               	,'取现还要等2小时的人伤不起啊伤不起！果断改用现金宝！'
               	,'用现金宝，取现秒到那一刹，简直觉得自己帅到掉渣！'
               	,'我有现金宝，取现能秒到，还款能实时！'
               	,'有了现金宝，妈妈再也不用担心我的账户安全了！'
               	,'我会告诉你我也开始用现金宝了么~ '
               	,'500万，只要你存得了，没有你取不了。'
               ];
jQuery(function($){
	var _textId = parseInt(Math.random()*cardTextArr.length);
	$('.textarea').val(cardTextArr[_textId]);
});
function changeText(){
	num = parseInt(Math.random()*cardTextArr.length);
	num++;
	if(num >= cardTextArr.length)
		num = 0;
	$('.textarea').val(cardTextArr[num]);
	saveSession();
}
$.base64.utf8encode = true;
function linkShare(){
	saveSession();
	//var textInfo = $(".textarea").val();
	//var info = $.base64.encode(textInfo);
	window.location="http://www.99fund.com?showToolbar=1";
}

function saveSession(){
	var val = $(".textarea").val();
	$.ajax({
		type:"post",
		url:"<%=path%>/pages/inviteFriendSave.jsp",
		data:val,
		contentType:"application/json; charset=utf-8",
		success:function (result){},
		error:function(){
			alert("Error");
		},
		dataType:"text",
		async:true
	});
}
</script>
</head>
<body>
<!-- <a href="tel:123-4567-8901">123-4567-8901</a> -->
	<section>
		<p>让好友扫一扫</p>
		<p><img src="<%=path%>/twoCodeImage"></p>
		<p style="color: black;font-size: 28px;"><%=accountInfo.getYield() %></p>
		<p>七日年化收益日期<%=accountInfo.getYieldDay() %></p>
		<p><button onclick="linkShare()">发链接邀请好友</button></p>
		<p class="p"><span>捎句话给他</span>  <a href="javascript:void(0);" onclick="changeText()">换一句</a></p>
		<p><textarea class="textarea" onchange="saveSession()"></textarea></p>
	</section>
	<div style="height: 50px;"></div>
</body>
</html>