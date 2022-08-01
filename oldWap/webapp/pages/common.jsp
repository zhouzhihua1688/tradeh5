<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext" %>
<%
	new MClientThreadContext(request, response);
	String serviceAdreess = "http://www.99fund.com/cgi-bin/subject/RedPacketForPhone";
%>