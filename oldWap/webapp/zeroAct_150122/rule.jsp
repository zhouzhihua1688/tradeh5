<%@page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="org.apache.commons.logging.LogFactory" %>
<%@page import="com.fund.etrading.mclient.common.Tools" %>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext"%>
<%@page import="com.htffund.etrade.mss.service.RecomService"%>
<%@page import="com.fund.etrading.mclient.service.AccountService"%>
<%@page import="org.apache.commons.logging.Log" %>
<%@page import="com.fund.etrading.mclient.framework.factory.AccountServiceBuilderFactory"%>
<%! private Log logs = LogFactory.getLog("//zeroAct_150122//rule.jsp"); %>
<%
	new MClientThreadContext(request, response);
	int temp = 0;
	String mob = "";
	try{
	mob = MClientThreadContext.getUserInfo().getMobileNo();
	AccountService accountService = Tools.getBean("accountServiceBuilderFactory", AccountServiceBuilderFactory.class).genAccountService();
	List<String> list = accountService.queryOwnerPrivilege();
	if(list != null && list.size() > 0){
		temp = 1;
	}
	}catch(Exception e){
		
	}
	/* Map<String, String> map = Tools.getBean("recomService",
			RecomService.class).getRecomCount(
			Long.parseLong(MClientThreadContext.getCustId()),
			Tools.getEnv("actZeroId"));
	if (map != null && map.containsKey("count")) {
		temp = Integer.parseInt(map.get("count"));
	} */
%>
<!DOCTYPE html>
<html class="login-page">
<head>

        <!-- Basic Page Needs
  ================================================== -->
        <meta charset="utf-8">
        <title>抢0元购特权</title>
        <meta name="description" content="">
        <meta name="author" content="J.Chen">
        <!-- 让IE浏览器用最高级内核渲染页面 还有用 Chrome 框架的页面用webkit 内核
  ================================================== -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<!-- IOS6全屏 Chrome高版本全屏
  ================================================== -->
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes"> 
        <meta name="format-detection" content="telephone=no">
        <!-- 让360双核浏览器用webkit内核渲染页面
  ================================================== -->
	<meta name="renderer" content="webkit">
        <!-- Mobile Specific Metas
  ================================================== -->
		<!-- !!!注意 minimal-ui 是IOS7.1的新属性，最小化浏览器UI -->
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no, minimal-ui">

        <!-- CSS
  ================================================== -->
	<link href="css/reset.css" rel="stylesheet" type="text/css">
	<link href="css/style.css" rel="stylesheet" type="text/css">
    <script src="js/zepto.min.js"></script>
    <script src="js/touch.js"></script>
	<script src="js/js.js"></script>
        <!-- Favicons
        ================================================== -->
	<!--<link rel="shortcut icon" href="favicon.ico" >-->
		<!-- Android 主屏图标
        ================================================== -->	
	<!--<link rel="icon" sizes="196x196" href="touch-icon.png">-->
		<!-- IOS 主屏图标
        ================================================== -->
	<!--<link rel="apple-touch-icon" href="touch-icon-iphone.png">
	<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
	<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
	<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">-->
		<!-- Javascript
        ================================================== -->
</head>
<body>
<div class="conWrap">
    <div class="banWrap"><img src="images/banner01.jpg" class="ban01" width="100%"></div>
    <div class="tipsWrap">
        <div class="tips"><b class="ico">Step1</b><p>邀请<span>1</span>位好友成功绑定现金宝APP</p></div>
        <div class="tips"><b class="ico">Step2</b><p>立即获得30天基金0元购特权<br>可通过汇添富现金宝0费率申购旗下基金</p></div>
    </div>
    <div class="btnWrap">
        <a href="http://www.99fund.com?showToolbar=1" class="btn">立即邀请好友</a>
        <%
        	if(temp > 0){
   		%>
        	<p class="invNum">感谢参与，您已成功获得基金0元购特权！</p>
   		<%
        	}else{
   		%>
        	<p class="invNum">您尚未成功邀请好友，赶快去邀请吧！</p>
   		<%
        	}
        %>
    </div>
    <div class="ruleWrap">
        <b class="title">活动规则</b>
        <p>1、活动时间：2015年3月10日00:00:00—2015年6月30日23:59:59；</p>
        <p>2、仅限汇添富现金宝用户通过现金宝APP安卓、iPhone客户端参与活动；</p>
        <p>3、活动期间，用户成功邀请1位好友体验现金宝APP并完成绑卡即可获得“基金0元购特权”；</p>
        <p>4、在“基金0元购特权”有效期内，用户可通过汇添富现金宝0费率申购旗下基金；</p>
        <p>5、投资者每次获得“基金0元购特权”的有效期为30天，已拥有该特权并在特权有效期内，不可重复领取；</p>
        <p>6、本次活动最终解释权归汇添富基金所有，如您有任何疑问请致电汇添富官方客服400-888-9918或通过汇添富基金官方微信咨询。</p>
    </div>
</div>
<!--遮罩层-->
<div class="share_overmask">
	<div class="share_words"></div>
</div>
</body>
</html>
<!-- __Activity_info_Start_{
   "weixin_f": {
       "title": "任性如我，绝不独享现金宝，快来体验吧！",
       "remark":"推荐你一个非常好用的理财工具——现金宝，充值即享收益，投资一触即发",
       "img":"http://app.99fund.com/mobileEC/zeroAct_150122/images/share_icon.jpg",
       "link": "http://app.99fund.com/mobileEC/zeroAct_150122/index.html?mob=<%=mob%>"
   },
   "weixin_p": {
       "title": "任性如我，绝不独享现金宝，快来体验吧！",
       "remark":"推荐你一个非常好用的理财工具——现金宝，充值即享收益，投资一触即发",
       "img":"http://app.99fund.com/mobileEC/zeroAct_150122/images/share_icon.jpg",
       "link": "http://app.99fund.com/mobileEC/zeroAct_150122/index.html?mob=<%=mob%>"
   },
   "sina": {
       "title": "任性如我，绝不独享现金宝，快来体验吧！",
       "content": "任性如我，绝不独享现金宝，快来体验吧！",
       "img":"http://app.99fund.com/mobileEC/zeroAct_150122/images/share_icon.jpg",
       "link": "http://app.99fund.com/mobileEC/zeroAct_150122/index.html?mob=<%=mob%>"
   },
   "tencent": {
       "title": "任性如我，绝不独享现金宝，快来体验吧！",
       "img":"http://app.99fund.com/mobileEC/zeroAct_150122/images/share_icon.jpg",
       "link": "http://app.99fund.com/mobileEC/zeroAct_150122/index.html?mob=<%=mob%>"
   },
   "sms": {
       "title": "任性如我，绝不独享现金宝，快来体验吧！",
       "img":"http://app.99fund.com/mobileEC/zeroAct_150122/images/share_icon.jpg",
       "link": ""
   }
}_hiden_Info_End -->
