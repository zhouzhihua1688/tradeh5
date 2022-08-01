<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.fund.etrading.mclient.common.Tools" %>
<%@page import="com.fund.etrading.mclient.common.MobileHttpClient"%>
<%@page import="com.fund.etrading.mclient.common.Constants"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext" %>
<%@page import="java.io.BufferedReader" %>
<%@page import="org.apache.commons.logging.LogFactory" %>
<%@page import="org.apache.commons.logging.Log" %>
<%! private Log logs = LogFactory.getLog("//pages//inviteFriendSave.jsp"); %>
<%
	new MClientThreadContext(request, response);
	MClientThreadContext.getUserInfo();	
	String path = request.getContextPath();
	BufferedReader br = request.getReader();
	StringBuffer str = new StringBuffer();
	String line = null;
	while((line = br.readLine()) != null){
		str.append(line);
	}
	logs.info("-----------inviteFriendSave.jsp"+str.toString());
	MClientThreadContext.getSession().setAttribute(Constants.INVITE_FRIEND_INFO, str.toString());
%>