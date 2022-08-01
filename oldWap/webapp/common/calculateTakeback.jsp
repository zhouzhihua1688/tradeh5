<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.fund.etrading.mclient.common.Constants"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext"%>
<%@page import="com.fund.etrading.mclient.model.CardInfo" %>
<%@page import="com.fund.etrading.mclient.common.Tools"%>
<%@page import="com.fund.etrading.mclient.service.AccountService" %>
<%@page import="java.math.BigDecimal"%>
<%@page import="org.apache.commons.logging.LogFactory" %>
<%@page import="org.apache.commons.logging.Log" %>
<%@page import="com.fund.etrading.mclient.model.AccountInfo" %>
<%@page import="com.fund.etrading.mclient.framework.factory.AccountServiceBuilderFactory"%>
<%! private Log logs = LogFactory.getLog("//pages//calculateTakeback.jsp"); %>
<%
	new MClientThreadContext(request, response);
	String takebackType = request.getParameter("takebackType");
	String bankNo = request.getParameter("bankNo");
	String bankAcco = request.getParameter("bankAcco");

	AccountService accountService = Tools.getBean("accountServiceBuilderFactory", AccountServiceBuilderFactory.class).genAccountService();
	List<CardInfo> cards = accountService.card(true);
	double realLimit = 0;
	double balance = 0;
	double cLimit = 0;
	for(CardInfo card : cards){
		if(bankAcco.equals(card.getBankAcco()) && bankNo.equals(card.getBankNo())){
			cLimit = Double.parseDouble(card.getLimit());
			balance = card.getCashBalance();
			realLimit = Double.parseDouble(card.getRealLimit());
		}
	}
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>取现计算</title>
<style type="text/css">
body{background-color: #ebebeb;outline: none;margin:0px;}
div{background-color: white; padding: 6px;height: 100%;width: 100%;position: fixed;}
p{font-size: 16px;font-weight: bold; text-align: left;}
.detail_p{font-size: 14px;font-weight: normal;}
.table{font-size: 16px;font-weight: bold;margin-top: 20px;}
a{color: #FF9933;}
a:LINK {color: #FF9933;}
a:ACTIVE {color: #FF9933;}
a:FOCUS {color: #FF9933;}
a:HOVER {color: #FF9933;}
.k_table{
border: 1px solid black;
border-collapse: collapse;
text-align: left;
width: 98%;
position: absolute;
margin: 0px 4px;
line-height: 24px;
}
.k_table td{
border: 1px solid black;
}
</style>
</head>
<body>
	<%
		if("1".equals(takebackType) && realLimit != balance && realLimit != cLimit){
			Map<String, String> map = accountService.queryCardAmt();
			AccountInfo accountInfo = accountService.account();
			double mRemain = accountInfo.getMonthTakeBackReal() - Double.parseDouble(map.get("MonthUsedAmt"));
			if(mRemain < 0)
				mRemain = 0;
			double dRemain = accountInfo.getCashTakeBackReal() - Double.parseDouble(map.get("DayUsedAmt"));
			if(dRemain < 0)
				dRemain = 0;
	%>
		<div style="margin:0px;padding: 0px;">
			<p style="text-align: center;">快速取现额度计算</p>
				<table class="k_table">
					<tr>
						<td>您的每月额度</td>
						<td>您的每日额度</td>
					</tr>
					<tr>
						<td><%=Tools.formatMoney(accountInfo.getMonthTakeBackReal(), 2) %></td>
						<td><%=Tools.formatMoney(accountInfo.getCashTakeBackReal(), 2) %></td>
					</tr>
					<tr>
						<td>本月您还剩余额度</td>
						<td>今日您还剩余额度</td>
					</tr>
					<tr>
						<td><%=Tools.formatMoney(mRemain+"", 2) %></td>
						<td><%=Tools.formatMoney(dRemain+"", 2) %></td>
					</tr>
					<tr>
						<td colspan="2"><p style="font-size: 14px;margin: 0px;">注：当日充值金额当日不可取</p></td>
					</tr>
				</table>
		</div>
	<%
		}else{
			if("1".equals(MClientThreadContext.getUserInfo().getCanOpenmultiCard())){
				Map<String, String> result = accountService.queryCardLimit(bankNo, bankAcco);
				BigDecimal limit = new BigDecimal("0");
				BigDecimal restLimit = new BigDecimal("0");
				if(result != null){
					limit = new BigDecimal(result.get("Limit") == null ? "0" : (String) result.get("Limit"));
					restLimit = new BigDecimal(result.get("RestLimit") == null ? "0" : (String) result.get("RestLimit"));
				}
	%>
		<div>
			<table class="table" style="width: 98%;">
				<tr>
					<td>本卡充值资金（元）</td>
					<td style="text-align: center;"><%=Tools.formatMoney(limit.subtract(restLimit).toString(), 2) %></td>
				</tr>
				<tr>
					<td></td>
					<td style="text-align: center;">+</td>
				</tr>
				<tr>
					<td>当日多卡取现剩余额度（元）</td>
					<td style="text-align: center;"><%=Tools.formatMoney(restLimit.toString(), 2) %></td>
				</tr>
				<tr>
					<td colspan="2"><hr></td>
				</tr>
				<tr>
					<td>本卡今日可取额度（元）</td>
					<td style="text-align: center;"><%=Tools.formatMoney(limit.toString(), 2) %></td>
				</tr>
			</table>
			<p><a href="<%=request.getContextPath()%>/common/takeBackDetail.html">了解银行卡多卡取现规则</a></p>
		</div>
	<%
			}else{ 
	%>
		<div>
			<p style="text-align: center;">今日可取现金额&nbsp;&nbsp;＝&nbsp;&nbsp;本卡充值金额</p>
			<p style="text-align: left;">使用本张银行卡，仅能取出该卡充值资金，遵循同卡进出原则</p>
		</div>
	<%
			}
		}
	%>
</body>
</html>