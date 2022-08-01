<%@page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.fund.etrading.mclient.common.Tools" %>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext"%>
<%@page import="com.htffund.etrade.mss.service.PrivilegeService"%>
<%@page import="org.apache.commons.logging.LogFactory" %>
<%@page import="org.apache.commons.logging.Log" %>
<%! private Log logs = LogFactory.getLog("//fundAct_150529//handle.jsp"); %>
<%
	new MClientThreadContext(request, response);
	String custNo = "";
	Map<String, Object> returnMap = new HashMap<String, Object>();
	try{
		custNo = MClientThreadContext.getCustNo();
		//custNo = "1005200422";
		if(StringUtils.isNotBlank(custNo)){
			PrivilegeService privilegeService = Tools.getBean("privilegeService", PrivilegeService.class);
			Map<String, Object> result = privilegeService.providerPrivilege(custNo,"0030yj");
			Map<String, Object> result2 = privilegeService.providerPrivilege(custNo,"0010yj");
			String status = String.valueOf(result.get("status"));
			returnMap.put("returnCode", 0);
			returnMap.put("returnMsg", StringUtils.EMPTY);
			returnMap.put("status", status);
			if("0".equals(status)){
				returnMap.put("msg", "您已经拥有该特权，无需再领。请直接去基金页面购买吧！");
			}else if("1".equals(status)){
				returnMap.put("msg", "恭喜您！您已成功领取该特权。快去基金页面看看吧~");
			}else if("2".equals(status)){
				returnMap.put("msg", "今天的名额已经被抢光，明天再来试吧~");
			}else{
				returnMap.put("msg", "");
			}
		}else{
			//请登录后，再来参加活动
			returnMap.put("returnCode", 1);
			returnMap.put("returnMsg", "您还未登录，请先登录后再领取。");
		}
	}catch(Exception e){
		logs.error("JSP活动", e);
		returnMap.put("returnCode", 9);
		returnMap.put("returnMsg", "系统异常，请稍后再试！");
	}
	response.getWriter().write(JSONObject.fromObject(returnMap).toString());
%>
