<%@page import="net.sf.json.JSONObject"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="org.apache.commons.logging.LogFactory" %>
<%@page import="com.fund.etrading.mclient.common.Tools" %>
<%@page import="com.fund.etrading.mclient.common.HtfMD5"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext"%>
<%@page import="java.security.MessageDigest" %>
<%@page import="com.htffund.etrade.mss.service.PrivilegeService"%>
<%@page import="org.apache.commons.logging.Log" %>
<%! private Log logs = LogFactory.getLog("//pages//activityIndex.jsp"); %>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>

        <!-- Basic Page Needs================================================== -->
        <meta charset="utf-8">
        <title>汇添富</title>
        <meta name="description" content="">
        <meta name="author" content="J.Chen">

        <!-- Mobile Specific Metas================================================== -->
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

        <!-- CSS================================================== -->
		<link href="css/reset.css" rel="stylesheet" type="text/css">
		<link href="css/style.css" rel="stylesheet" type="text/css">
		<link href="css/common.css" rel="stylesheet" type="text/css">
       
		<!-- Javascript================================================== -->
		<script type="text/javascript" src="js/jquery-2.0.3.min.js"></script>
		<script type="text/javascript" src="js/fastclick.js"></script>
		<script type="text/javascript" src="js/jay.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.10.3.custom.min.js"></script>
		<script type="text/javascript" src="js/jquery.ui.effect-fade.js"></script>
		<script type="text/javascript" src="js/pageforword.js"></script>
</head>
<body style="background-color: #ebebeb;outline: none;"> <!-- class="hasBg" -->
<!-- <body style="background-position: center;background-repeat: no-repeat;background-color: #dfdacd;background-image: url('images/activity.png');"> -->
<!-- <div id="backDiv" onclick="backPage()" class="backPage"><img src="images/left.png"/></div>
<div id="nextDiv" onclick="nextPage()" class="backPage"><img src="images/right.png"/></div> -->
<div class="container"><!-- Everything started here -->
	<%-- <p style="text-align:center;font-size: 24px;font-weight: bold;width: 100%;position: absolute;top: 40%;color: #666666;">暂无活动</p>
	<a href="<%=path %>/pages/sendBonus.jsp" class="entBlock_wrap">
		<h2 class="eb_title">铁杆宝粉大回馈，您送红包我出钱！</h2>
		<h3 class="eb_times">截止时间：2014年2月28日</h3>
		<div class="eb_imgWrap">
			<img src="images/bigImg_2.jpg" alt="" class="eb_img">
		</div>
		<div class="eb_dataArea">自己掏钱送红包，心疼？！我满足您！过年啦，回馈铁杆宝粉,您送红包我出钱，还有5000元大奖等您拿！</div>
		<span class="eb_linkto">活动详情</span>
	</a> --%>
	
	<%-- <a href="<%=path %>/pages/guess.jsp" class="entBlock_wrap">
		<h2 class="eb_title">玩竞猜，变土豪！5000元大奖等您！</h2>
		<h3 class="eb_times">截止时间：2014年6月30日</h3>
		<div class="eb_imgWrap">
			<img src="images/bigImg_3.jpg" alt="" class="eb_img">
		</div>
		<div class="eb_dataArea">摇身变土豪，各种求交往！一起玩竞猜吧，天天开奖！已连续开出N份5000元大奖！</div>
		<span class="eb_linkto">活动详情</span>
	</a> --%>
	
   <!-- <div class="newsdata"></div>
   <div class="newscon">
     <div class="pad4">
      <a href="http://mp.weixin.qq.com/s?__biz=MjM5NTA5NzE4MA==&mid=201137967&idx=1&sn=507b03c29387e32d19ae4a52932514ce#rd" class="dsp-b">
       <span class="newstitle pb10">分享现金宝APP，赢iPad Air大奖！</span>
       <img class="newspic" style="content:url(images/pic1.jpg)" alt="">
       <span class="newsdetail pt10 pb10">即日起，分享现金宝APP给您的小伙伴有机会赢取iPad Air大奖！</span>
       <span class="newslink pt10">查看详细<i class="icon-arrow-right"></i></span>
      </a> 
     </div>
   </div> -->
   
<%--    <div class="newsdata"></div>
   <div class="newscon">
     <div class="pad4">
      <a href="<%=Tools.getEnv("mgmUrl") %>/mgm_index.htm?custid=<%=custId %>&ts=<%=times %>&sign=<%=sign %>" class="dsp-b">
       <span class="newstitle pb10">邀请好友体验现金宝，领4999元大红包啦！</span>
       <img class="newspic" style="content:url(images/bigImg_4.jpg)" alt="">
       <span class="newsdetail pt10 pb10">只赚现金宝收益？弱爆了！现在邀请小伙伴体验现金宝，可以直接领钱啦！1-4999元，100%有钱！发财新技能get起来！</span>
       <span class="newslink pt10">查看详细<i class="icon-arrow-right"></i></span>
      </a> 
     </div>
   </div>--%>
   
   <%-- <div class="newsdata"></div>
   <div class="newscon">
     <div class="pad4">
      <a href="<%=path %>/repayAct/index.html" class="dsp-b">
       <span class="newstitle pb10">双11血拼还款哪家强？！体验现金宝还信用卡送小米手机4！</span>
       <img class="newspic" style="content:url(images/bigImg_7.jpg)" alt="">
       <span class="newsdetail pt10 pb10">即日起使用现金宝APP成功还一笔信用卡有机会赢取小米手机4！分享活动给小伙伴再送移动电源！</span>
       <span class="newslink pt10">查看详细<i class="icon-arrow-right"></i></span>
      </a> 
     </div>
   </div> --%>
   
<%--    <div class="newsdata"></div>
   <div class="newscon">
     <div class="pad4">
      <a href="<%=path %>/iphone6/index.jsp" class="dsp-b">
       <span class="newstitle pb10">不卖肾免费拿iPhone6，快来试试手气吧！</span>
       <img class="newspic" style="content:url(images/bigImg_6.jpg)" alt="">
       <span class="newsdetail pt10 pb10">时下最火的理财APP现金宝免费送您iPhone6，快喊你的小伙伴一起来试试手气~</span>
       <span class="newslink pt10">查看详细<i class="icon-arrow-right"></i></span>
      </a> 
     </div>
   </div> --%>
   
<%--    <div class="newsdata"></div>
   <div class="newscon">
     <div class="pad4">
      <a href="<%=path %>/repayAct_141215/index.html" class="dsp-b">
       <span class="newstitle pb10">年末狂欢，还款赢大奖IPhone6免费拿！</span>
       <img class="newspic" style="content:url(images/bigImg_8.jpg)" alt="">
       <span class="newsdetail pt10 pb10">好基友一辈子，我怎可以独享这等利好消息？</span>
       <span class="newslink pt10">查看详细<i class="icon-arrow-right"></i></span>
      </a> 
     </div>
   </div> 
     --%> 
  
   <div class="newsdata"></div>
   <div class="newscon">
     <div class="pad4">
      <a href="<%=path %>/myxdl/index.html" class="dsp-b">
       <span class="newstitle pb10">汇添富民营新动力股票基金</span>
       <img class="newspic" style="content:url(../myxdl/images/img01.jpg)" alt="">
       <span class="newsdetail pt10 pb10">现金宝购基，享0费率优惠</span>
       <span class="newslink pt10">查看详细<i class="icon-arrow-right"></i></span>
      </a> 
     </div>
   </div> 
   <div class="newsdata"></div>
</div>

  </body>
</html>