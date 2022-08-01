<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>手机后台配置管理</title>
<style type="text/css">
table {text-align: center;}

.input {width: 100%;height: 24px;padding: 2px;}

.button {height: 39px;width: 100%;font-size: 20px;outline: none;float: right;margin-bottom: -40px;}
</style>
</head>
<body>
	<form action="<%=request.getContextPath() %>/confLogin" method="post">
		<table border="0" cellspacing="10">
			<tr>
				<td width="20%" align="right">用户名：</td>
				<td><input type="text" name="mobile" value="" size="34" class="input"/></td>
			</tr>
			<tr>
				<td width="20%" align="right">密&nbsp;码：</td>
				<td><input type="password" name="password" value="" size="34" class="input"/></td>
			</tr>
			<tr>
				<td colspan="2"><input type="submit" value="登录" class="button"/></td>
			</tr>
		</table>
	</form>
</body>
</html>