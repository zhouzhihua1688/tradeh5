<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.fund.etrading.mclient.model.SignDiffInfo"%>
<%@page import="com.fund.etrading.mclient.common.Constants"%>
<%@page import="com.fund.etrading.mclient.common.Tools"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext"%>
<%@page import="org.apache.commons.logging.LogFactory" %>
<%@page import="org.apache.commons.logging.Log" %>
<%@page import="com.fund.etrading.mclient.service.CreateCardService" %>
<%@page import="com.fund.etrading.mclient.model.SignDiffInfo" %>
<%@page import="com.fund.etrading.mclient.service.AccountService" %>
<%@page import="com.fund.etrading.mclient.model.CardInfo" %>
<%@page import="com.fund.etrading.mclient.framework.factory.AccountServiceBuilderFactory"%>
<%@page import="com.fund.etrading.mclient.framework.factory.CreateCardServiceBuilderFactory"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="net.sf.json.JSONArray"%>
<%@page import="org.apache.commons.lang.StringUtils" %>
<%! private Log logs = LogFactory.getLog("//pages//signDiff.jsp"); %>
<%
	new MClientThreadContext(request, response);
	String bankGroup = request.getParameter("bankGroup");
	String bankAcco = request.getParameter("bankAcco");
	String bankNo = request.getParameter("bankNo");
	String type = request.getParameter("type");
	logs.info("bankGroup:" + bankGroup + " bankAcco: " + bankAcco + " bankNo:" + bankNo + " type:" + type);
	if(null == bankGroup){
		bankGroup = "";
	}
	if(null == bankAcco){
		bankAcco = "";
	}
	if(null == bankNo){
		bankNo = "";
	}

	if(null == type || "".equals(type)){
		type = "0";
	}
	CreateCardService createCardService = Tools.getBean("createCardServiceBuilderFactory", CreateCardServiceBuilderFactory.class).genCreateCardService();
	Map<String,Object> result = createCardService.querySignDiff(bankGroup);
	logs.info("result: " + JSONObject.fromObject(result).toString());
	if(null == result){
		result = new HashMap<String,Object>();
	}
	String bankName = result.get("bankName") == null ? "" : (String)result.get("bankName");
	List<SignDiffInfo> signDiffs = (List<SignDiffInfo>)result.get("signDiffs");
	Double realLimit = new Double(0);
	if(signDiffs != null && signDiffs.size() > 0){
		if( "1".equals(type)){
			AccountService accountService = Tools.getBean("accountServiceBuilderFactory", AccountServiceBuilderFactory.class).genAccountService();
			List<CardInfo> cards = accountService.card(false);
			if(null != cards && cards.size() > 0){
				for(CardInfo card : cards){
					if(bankAcco.equals(card.getBankAcco()) && bankNo.equals(card.getBankNo())){
						realLimit = Double.parseDouble(card.getRealLimit());
						break;
					}
				}				
			}
		}
	}
%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<meta name="format-detection" content="telephone=no">
	<title>签约方式差异对比</title>
	<style>
		body {
			outline: none;
			margin: 0px;
		}

		div {
			background-color: white;
			padding: 6px;
			height: 100%;
			width: 100%;
		}


		.detail_p {
			font-size: 14px;
			font-weight: normal;
		}

		.table {
			font-size: 1em;
			/* font-weight: bold; */
			margin-top: 20px;
		}

		a {
			color: #FF9933;
		}

		a:LINK {
			color: #FF9933;
		}

		a:ACTIVE {
			color: #FF9933;
		}

		a:FOCUS {
			color: #FF9933;
		}

		a:HOVER {
			color: #FF9933;
		}

		.k_table {
			border: 1px solid #eee;
			border-collapse: collapse;
			width: 100%;
		}

		.k_table tr {
			border: 1px solid #eee;
			text-align: center;
		}

		.k_table td {
			border: 1px solid #eee;
			text-align: center;
			padding:.5em;
			line-height:1.5em;
		}

		.th{
			color:#444;font-family: Microsoft YaHei;
		}
		
		.diff-box{
			width: 98%;
			margin: 1em auto;
			padding: 0;
			color: #333;
		
		}
		.limit{
			width: 98%;
			margin: .5em auto;
			
		}
	</style>
</head>
<body>

<%
	if(null != signDiffs && signDiffs.size() > 0){
%>
<div class="diff-box" style="">
	<table class="k_table" style=" ">
		<tr style="border-top: none;">
			<td colspan="3" style="text-align: left;padding-left:1em;">签约方式差异对比:</td>
		</tr>
		<tr>
			<td style="text-align: center;" width="20%">签约方式</td>
			<td style="text-align: center;" width="40%">充值额度</td>
			<td style="text-align: center;" width="40%">开通方式</td>
		</tr>

		<%
			for(int i = 0; i < signDiffs.size();i++){
				SignDiffInfo info = signDiffs.get(i);
				if(StringUtils.isBlank(info.getOpenWay()))
					continue;
		%>
		<tr>
			<td style="text-align: center;"><%=info.getSignWay() %></td>
			<td style="text-align: justify;"><%=info.getRechargeAmt() %></td>
			<td style="text-align: justify;"><%=info.getOpenWay() %></td>
		</tr>
		<%
			}
		%>

		<%-- <%
			if(bankAcco != null && !"".equals(bankAcco) && "1".equals(type) && realLimit > 0){

		%>
		 <tr>
			 <td colspan="3" style="text-align: left;padding-left:1em;">本卡今日可取限额<span style="margin-left:4em;"><%=Tools.formatMoney(realLimit.toString(), 2) %></span></td>
			 
		</tr> 
		<%
			}
		%> --%>
	</table>

</div>
<%
	}
%>

</body>
</html>