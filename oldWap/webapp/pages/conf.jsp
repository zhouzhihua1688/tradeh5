<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="com.fund.etrading.mclient.common.MClientThreadContext" %>
<%
new MClientThreadContext(request, response);
String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>手机后台配置管理</title>
<style type="text/css">
body {background-color: #ebebeb;}
#tabs {	overflow: hidden;	width: 100%;margin: 0;	padding: 0;	list-style: none;}
#tabs li {float: left;margin: 0 .5em 0 0;}
#tabs a {position: relative;background: #ddd;background-image: linear-gradient(to bottom, #fff, #ddd);padding: .7em 3.5em;float: left;text-decoration: none;color: #444;text-shadow: 0 1px 0 rgba(255, 255, 255, .8);border-radius: 5px 0 0 0;box-shadow: 0 2px 2px rgba(0, 0, 0, .4);}
#tabs a:hover,#tabs a:hover::after,#tabs a:focus,#tabs a:focus::after {	background: #fff;}
#tabs a:focus {outline: 0;}
#tabs a::after {content: '';position: absolute;	z-index: 1;	top: 0;	right: -.5em;bottom: 0;	width: 1em;	background: #ddd;	background-image: linear-gradient(to bottom, #fff, #ddd);	box-shadow: 2px 2px 2px rgba(0, 0, 0, .4);	transform: skew(10deg);	border-radius: 0 5px 0 0;}
#tabs #current a,#tabs #current a::after {background: #fff;z-index: 3;}
#content {background: #fff;padding: 5px;position: relative;	z-index: 2;	border-radius: 0 5px 5px 5px;box-shadow: 0 -2px 3px -2px rgba(0, 0, 0, .5);}
.button {margin-top: -40px;float: right;height: 35px;border: 0px;border-radius: 6px;-moz-border-radius: 6px;background-color: #fe7b20;	color: white;font-size: 20px;outline: none;}
table {	width: 100%;}
table .td_left {width: 10%;}
table .td_right{width: 90%;}
input {	width: 100%;height: 24px;padding: 2px;}
button {height: 39px;width: 90px;font-size: 20px;outline: none;float: right;margin-bottom: -40px;}
.button1{
background: none repeat scroll 0 0 #ebebeb; 
width:180px; 
font-size: 20px; 
cursor:pointer; 
color:#000000;
outline: none;
float: right;
text-align:center;
line-height:40px;
}
</style>
<script src="<%=path %>/basic/jquery.3.4.1.min.js"></script>
<script src="<%=path %>/pages/laydate/laydate.js"></script>
<script>
$(document).ready(function() {
	
		 
    $("#content").find("[id^='tab']").hide(); // Hide all content
    $("#tabs li:first").attr("id","current"); // Activate the first tab
    $("#content #tab1").fadeIn(); // Show first tab's content

    document.getElementById("save2").style.visibility = "hidden";
    
	query("env");//default query env.properties
    $('#tabs a').click(function(e) {
        e.preventDefault();
        if ($(this).closest("li").attr("id") == "current"){ //detection for current tab
         return;       
        }
        else{             
          $("#content").find("[id^='tab']").hide(); // Hide all content
          $("#tabs li").attr("id",""); //Reset id's
          $(this).parent().attr("id","current"); // Activate this
          $('#' + $(this).attr('name')).fadeIn(); // Show content for the current tab
          
          var tabName = $(this).attr('name');
          if("tab3" == tabName || "tab4" == tabName){
        	 document.getElementById("save2").style.visibility = "visible";
        	 document.getElementById("save1").style.visibility = "hidden";
          }else{
        	  document.getElementById("save1").style.visibility = "visible";
         	 document.getElementById("save2").style.visibility = "hidden";
         	
          }
        }
        
    });
});
var FILE_NAME = "env";
function query(fileName){
	FILE_NAME = fileName;
	var queryurl ="<%=path %>/confQuery?fileNm=" + FILE_NAME;
    $.ajax({
		type:"get",
		url:queryurl,
		success:function (result){
			$("#content").find("[id^='tble_']").empty();
			for(var i=0; i<result.length; i++){
				var obj = result[i];
				var fileNm = obj.fieldNm;
				var fieldKey = fileNm.split("_")[1];
				//alert(obj.fieldVal);
				var fieldVal = obj.fieldVal;
				fieldVal = eval("(" + fieldVal + ")"); 
				var tr = "<tr>"
						+"<td id='field' class='td_left'>"+ fieldVal.name +"</td>"
						+"<td id='field' class='td_left'>"+ fieldKey +"</td>"
						+"<td class='td_right'>"
						+"<input type='text' onchange='setField(this)' name='fieldVal' value='"+ fieldVal.value +"' />"
						+"<input type='hidden' name='fieldNm' value='"+ fileNm +"' />"
						+"<input type='hidden' name='oldVal' value='"+ fieldVal.value +"' />"
						+"<input type='hidden' name='flag' value='0' />"
						+"</td>"
						+"</tr>";
				$("#tble_" + FILE_NAME).append(tr);
			} 
		},
		error:function(textStatus,errorThrown){
			alert("请求查询服务失败!");
		},
		dataType:"json",
		async:true});
}

function queryVersion(fileName){
	FILE_NAME = fileName;
	var queryurl ="<%=path %>/confQuery?fileNm=" + FILE_NAME;
    $.ajax({
		type:"get",
		url:queryurl,
		success:function (result){
			$("#content").find("[id^='tble_']").empty();
				var upVersion = result[0].upVersion;
				var lastVersion = result[0].lastVersion;
				var url = result[0].url;
				var remark = result[0].remark;
				
				var type = result[0].type == '1' ? 'android' : 'ios';
				
				var tr = "<tr>"
						+"<td id='field' class='td_left'> 更新前版本号 :</td>"
						+"<td class='td_right'>"
						+"<input type='text'  name='upVersion' value='"+ upVersion +"' />"
						+"<input type='hidden' name='type' value='"+ type +"' />"
						+"</td>"
						+"</tr>";
					tr +=   "<tr>"
							+"<td id='field' class='td_left'>更新后版本号 :</td>"
							+"<td class='td_right'>"
							+"<input type='text'  name='lastVersion' value='"+ lastVersion +"' />"
							+"</td>"
							+"</tr>";
					tr +=   "<tr>"
							+"<td id='field' class='td_left'>下载链接  :</td>"
							+"<td class='td_right'>"
							+"<input type='text'  name='url' value='"+ url +"' />"
							+"</td>"
							+"</tr>";
					tr +=   "<tr>"
							+"<td id='field' class='td_left'>备注:</td>"
							+"<td class='td_right'>"
							+"<textarea  cols='80' rows='6'  name='remark'>"
							+ remark
							+"</textarea></td>"
							+"</tr>";
						
				$("#tble_" + FILE_NAME).append(tr);
		},
		error:function(textStatus,errorThrown){
			alert("请求查询服务失败!");
		},
		dataType:"json",
		async:true});
}

function saveModify(){
	var list = $("input[name='flag'][value='1']");
	var jsonStr = "{\"datas\":[";
	for(var i=0; i < list.length; i++){
		var flag = list[i];
		var fieldNm = $(flag).parent().find("input[name='fieldNm']").val();
		var fieldVal = $(flag).parent().find("input[name='fieldVal']").val();
		jsonStr += "{\"key\":\"" + fieldNm + "\",\"value\":\"" + fieldVal + "\"},";
	}
	jsonStr = jsonStr.substring(0, jsonStr.length - 1) +"]}";
    $.ajax({
		type:"post",
		url:"<%=path %>/confSave",
		data:jsonStr,
        contentType: "application/json; charset=utf-8",
		success:function (result){
			alert(result);
			query(FILE_NAME);
		},
		error:function(textStatus,errorThrown){
			alert("请求保存服务失败!");
		},
		dataType:"text",
		async:true});
}


function cancel(type){
	if(type == 'env')
		$("#div1").html("");
	else if(type == 'info')
		$("#div2").html("");
	else if(type == 'pending'){
		$("#div3").html("");
	}
}

function queryPending(fileName){
	//$("#div3").html("");
	FILE_NAME = 'pending';
	var queryurl ="<%=path %>/confQuery?fileNm=" + FILE_NAME;
    $.ajax({
		type:"get",
		url:queryurl,
		success:function (result){
			$("#content").find("[id^='tble_']").empty();
			var th = "<tr>"
				+"<td id='field' class='td_left'>配置名称</td>"
				+"<td id='field' class='td_left'>配置标识</td>"
				+"<td id='field' class='td_left'>备注</td>"
				+"<td>开始时间</td>"
				+"<td>结束时间</td>"
				+"<td>操作</td>"
				+"</tr>";
			$("#tble_" + FILE_NAME).append(th);
			for(var i=0; i<result.length; i++){
				var obj = result[i];
				var fileNm = obj.fieldNm;
				var fieldKey = obj.key;
				//alert(obj.fieldVal);
				var fieldVal = obj.fieldVal;
				fieldVal = eval("(" + fieldVal + ")"); 
				
				var startDate = obj.startDate;
				
				var endDate = obj.endDate;
				
				var clickMethod = 'queryPendingByKey("' +  fieldKey.trim() + '")\'>修改</a>';
				var tr = "<tr>"
						+"<td id='field' class='td_left'>"+ fieldVal.name +"</td>"
						+"<td id='field' class='td_left'>"+ fieldKey +"</td>"
						+"<td id='field' class='td_left'>"+ fieldVal.remark +"</td>"
						+"<td>"+ startDate +"</td>"
						+"<td>"+ endDate +"</td>"
						//+"<td><a href='javascript:void(0)' onclick='queryPendingByKey(\'" + fieldKey + "\')'>修改</a></td>"
						+"<td><a href='javascript:void(0)' onclick='" + clickMethod +  '</td>'
						+"</tr>";
				$("#tble_" + FILE_NAME).append(tr);
			} 
		},
		error:function(textStatus,errorThrown){
			alert("请求查询服务失败!");
		},
		dataType:"json",
		async:true});
}

function queryPendingByKey(key){
	
		$("#div3").html("");
		
		FILE_NAME = 'pending';
		var type = "updatePedding";
		var queryurl ="<%=path %>/confQuery?fileNm=" + FILE_NAME + "&key=" + key;
	    $.ajax({
			type:"get",
			url:queryurl,
			success:function (result){
				//$("#content").find("[id^='tble_']").empty();
				for(var i=0; i<result.length; i++){
					var obj = result[i];
					var fileNm = obj.fieldNm;
					var fieldKey = obj.key;
					//alert(obj.fieldVal);
					var fieldVal = obj.fieldVal;
					fieldVal = eval("(" + fieldVal + ")"); 
					
					var startDate = obj.startDate;
					
					var endDate = obj.endDate;
					
					
						var html = '<div><table>'
							//+ " onclick=\"laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})\"" +
						
						html += "<tr><td>配置名称:</td><td><input type='text' value='" + fieldVal.name + "' id='" + type + "_cname' name='cname'/></td></tr>";
						
						html += "<tr><td>配置标识:</td><td><input type='text' readonly='readonly' value='" + fieldKey + "' id='" + type + "_ckey' name='ckey'/></td></tr>";
						
						html += "<tr><td>备注:</td><td><input type='text'  value='" + fieldVal.remark + "' id='" + type + "_cremark' name='remark'/> </td></tr>";
						
						html += "<tr><td>开始时间:</td><td><input type='text' " + " onclick=\"laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})\"" + " id='" + type + "_cstartDate' value='" + startDate + "' name='startDate'/></td></tr>";
						html += "<tr><td>结束时间:</td><td><input type='text' " + " onclick=\"laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})\"" + " id='" + type + "_cendDate' value='" + endDate + "' name='endDate'/></td></tr>";
						
						var enable = fieldVal.enable;
						var level = fieldVal.level;
						
						if(enable == '0'){
							html += "<tr><td>是否可用:</td><td><select id='updatePedding_cenable' "
								+ " name='enable'><option value='1' >是</option><option value='0' selected='selected'>否</option> </select></td></tr>";
						}else{
							html += "<tr><td>是否可用:</td><td><select id='updatePedding_cenable' "
							+ " name='enable'><option value='1' selected='selected'>是</option><option value='0'>否</option> </select></td></tr>";
						}
						
						if(level == '2'){
							html += "<tr><td>业务级别:</td><td><select id='updatePedding_clevel' " +" name='level'>"+
							"<option value='1'>IT维护人员</option><option value='2' selected='selected'>业务人员</option> </select></td></tr>";
						}else{
							html += "<tr><td>业务级别:</td><td><select id='updatePedding_clevel' " +" name='level'>"+
							"<option value='1' selected='selected'>IT维护人员</option><option value='2'>业务人员</option> </select></td></tr>";
						}
						
						html += "<tr><td colspan='2'  align='center'><div> <input style='height:39px;width:70px;' type='button' onclick='sure(\"updatePedding\")' value='确定' id='sure'/><input style='margin-left:15px;height:39px;width:70px;' type='button' onclick='cancel(\"pending\")' id='cancel' value='取消'/></div> </td></tr>";	
						html += '</table></div>';
						$("#div3").html(html);
				} 
			},
			error:function(textStatus,errorThrown){
				alert("请求查询服务失败!");
			},
			dataType:"json",
			async:true});
	    
}

function sure(type){
	
	var name = $("#" + type + "_cname").val();
	var key = $("#" + type + "_ckey").val();
	var value = $("#" + type + "_cvalue").val();
	var remark = $("#" + type + "_cremark").val();
	var ifinsert = '1';
	var level = '';
	var enable = '';
	
	if(undefined == key || null == key || '' == key){
		alert('唯一标识不能为空!');
		return ;
	}
	if(undefined == name || null == name || '' == name){
		name = '';
	}
	if(undefined == value || null == value || '' == value){
		value = '';
	}
	if(undefined == remark || null == remark || '' == remark){
		remark = '';
	}
	var jsonStr = '';
	if(type == 'env'){
		 level =  $('#env_clevel option:selected').val();
		 enable =  $('#env_cenable option:selected').val();
		 jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
			+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level
			//+  '\",\"startDate\":\"' + startDate  +  '\",\"endDate\":\"' + endDate 
			+   '\",\"enable\":\"' + enable + '\"}';
	}else if(type == 'info'){
		 level =  $('#info_clevel option:selected').val();
		 enable =  $('#info_cenable option:selected').val();
		 jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
			+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level
			//+  '\",\"startDate\":\"' + startDate  +  '\",\"endDate\":\"' + endDate 
			+   '\",\"enable\":\"' + enable + '\"}';
	}else if(type == 'pedding'){
		 level =  $('#pedding_clevel option:selected').val();
		 enable =  $('#pedding_cenable option:selected').val();
		 jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
			+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level
			//+  '\",\"startDate\":\"' + startDate  +  '\",\"endDate\":\"' + endDate 
			+   '\",\"enable\":\"' + enable + '\"}';
	}else if(type == 'pending' || type == 'updatePedding'){
		if(type == 'updatePedding'){
			level =  $('#updatePedding_clevel option:selected').val();
			 enable =  $('#updatePedding_cenable option:selected').val();
		}else{
			level =  $('#pending_clevel option:selected').val();
			 enable =  $('#pending_cenable option:selected').val();
		}
		 var startDate = $("#" + type + "_cstartDate").val(),endDate = $("#" + type + "_cendDate").val();;
		 if(undefined == startDate || null == startDate || '' == startDate){
			 startDate = '';
			}
			if(undefined == endDate || null == endDate || '' == endDate){
				endDate = '';
			}
			if(startDate != '' && endDate != ''){
				if(comptime(startDate,endDate) < 0){
					 alert("开始时间必须小于结束时间");
					return false;
				}
			}
		jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
		+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level
		+  '\",\"startDate\":\"' + startDate  +  '\",\"endDate\":\"' + endDate 
		+   '\",\"enable\":\"' + enable + '\"}';
	}
	
    $.ajax({
		type:"post",
		url:"<%=path%>/confSave",
		data:jsonStr,
        contentType: "application/json; charset=utf-8",
		success:function (result){
			
			if(1 == result || 2 == result){
				
				 if(1 == result){
					 if(type == 'updatePedding' || type == 'pending'){
						 jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
						 +  '\",\"startDate\":\"' + startDate  +  '\",\"endDate\":\"' + endDate 	 
							+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level +   '\",\"enable\":\"' + enable + 
							   '\",\"update\":\"' +'1\"}';	
					}else{
						jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
						+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level +   '\",\"enable\":\"' + enable + 
						   '\",\"update\":\"' +'1\"}';
					}
					 msg  = '存在可用的唯一标识，是否为其升级?';
				}else{
					if(type == 'updatePedding' || type == 'pending'){
						 jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
						 +  '\",\"startDate\":\"' + startDate  +  '\",\"endDate\":\"' + endDate 
							+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level +   '\",\"enable\":\"' + enable + 
							   '\",\"update\":\"' +  '1\",\"ifEnable\":\"' +'1\"}';	
					}else{
						jsonStr = '{\"name\":\"' + name + '\",\"key\":\"' + key  + '\",\"value\":\"' + value  + '\",\"remark\":\"' + remark 
						+ '\",\"ifinsert\":\"' + ifinsert +  '\",\"type\":\"' + type  +  '\",\"level\":\"' + level +   '\",\"enable\":\"' + enable + 
						   '\",\"update\":\"' +  '1\",\"ifEnable\":\"' +'1\"}';	
					}
					 msg  = '该唯一标识的最新版本被禁用，是否为您启用最新版本，再为您升级版本!';
				} 
				 
				 if(confirm(msg)){
					 $.ajax({
							type:"post",
							url:"<%=path%>/confSave",
							data:jsonStr,
					        contentType: "application/json; charset=utf-8",
							success:function (result){
								alert(result);
								if(type == 'updatePedding' || type == 'pending'){
									queryPending(type);
								}else{
									query(type);
								}
							},
							error:function(textStatus,errorThrown){
								alert("请求保存服务失败!");
							},
							dataType:"text",
							async:true});
				 }
			}else{
				alert(result);
				if(type == 'updatePedding' || type == 'pending'){
					queryPending(type);
				}else{
					query(type);
				}
			}
		},
		error:function(textStatus,errorThrown){
			alert("请求保存服务失败!");
		},
		dataType:"text",
		async:true});

}

function comptime(beginTime,endTime) {
    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');

    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

    var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
    return a;
}

function addConfig(type){
	
	if(type == 'env')
		$("#div1").html("");
	else if(type == 'info'){
		$("#div2").html("");
	}else if(type == 'pending'){
		$("#div3").html("");
	}
		
	
	var html = '<div><table>'
	
	html += "<input type='hidden' id='type' value='" + type + "'/> <br/>";
	
	html += "<tr><td>配置名称:</td><td><input type='text' id='" + type + "_cname' name='cname'/></td></tr>";
	
	html += "<tr><td>配置标识:</td><td><input type='text' id='" + type + "_ckey' name='ckey'/></td></tr>";
	
	
	if(type == 'env'){
		html += "<tr><td>配置值:</td><td><input type='text' id='" + type + "_cvalue' name='cvalue'/> </td></tr>";
		html += "<tr><td>备注:</td><td><input type='text' id='" + type + "_cremark' name='remark'/> </td></tr>";
		
		html += "<tr><td>是否可用:</td><td><select id='env_cenable' "
			+ " name='enable'><option value='1'>是</option><option value='0'>否</option> </select></td></tr>";
		html += "<tr><td>业务级别:</td><td><select id='env_clevel' " +" name='level'>"+
		"<option value='1'>IT维护人员</option><option value='2'>业务人员</option> </select></td></tr>";
		
		html += "<tr><td colspan='2'  align='center'><div> <input style='height:39px;width:70px;' type='button' onclick='sure(\"env\")' value='确定' id='sure'/><input style='margin-left:15px;height:39px;width:70px;' type='button' onclick='cancel(\"env\")' id='cancel' value='取消'/></div> </td></tr>";
		html += '</table></div>';
		$("#div1").html(html);
	}
	else if(type == 'info'){
		html += "<tr><td>配置值:</td><td><input type='text' id='" + type + "_cvalue' name='cvalue'/> </td></tr>";
		html += "<tr><td>备注:</td><td><input type='text' id='" + type + "_cremark' name='remark'/> </td></tr>";
		html += "<tr><td>是否可用:</td><td><select id='info_cenable' "
			+ " name='enable'><option value='1'>是</option><option value='0'>否</option> </select></td></tr>";
		html += "<tr><td>业务级别:</td><td><select id='info_clevel' " +" name='level'>"+
		"<option value='1'>IT维护人员</option><option value='2'>业务人员</option> </select></td></tr>";
		html += "<tr><td colspan='2'  align='center'><div> <input style='height:39px;width:70px;' type='button' onclick='sure(\"info\")' value='确定' id='sure'/><input style='margin-left:15px;height:39px;width:70px;' type='button' onclick='cancel(\"info\")' id='cancel' value='取消'/></div> </td></tr>";	
		html += '</table></div>';
		$("#div2").html(html);
	}else if(type == 'pending'){
		html += "<tr><td>开始时间:</td><td><input type='text'" + " onclick=\"laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})\"" + " id='" + type + "_cstartDate' name='startDate'/></td></tr>";
		html += "<tr><td>结束时间:</td><td><input type='text'" + " onclick=\"laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})\"" + " id='" + type + "_cendDate' name='endDate'/> </td></tr>";
		html += "<tr><td>备注:</td><td><input type='text' id='" + type + "_cremark' name='remark'/> </td></tr>";
		html += "<tr><td>是否可用:</td><td><select id='pending_cenable' "
			+ " name='enable'><option value='1'>是</option><option value='0'>否</option> </select></td></tr>";
		html += "<tr><td>业务级别:</td><td><select id='pending_clevel' " +" name='level'>"+
		"<option value='1'>IT维护人员</option><option value='2'>业务人员</option> </select></td></tr>";
		html += "<tr><td colspan='2'  align='center'><div> <input style='height:39px;width:70px;' type='button' onclick='sure(\"pending\")' value='确定' id='sure'/><input style='margin-left:15px;height:39px;width:70px;' type='button' onclick='cancel(\"pending\")' id='cancel' value='取消'/></div> </td></tr>";	
		html += '</table></div>';
		$("#div3").html(html);
	}
	
}


function saveModify1(upgrade){
	var upVersion = $("input[name='type']").val() + "_" + $("input[name='upVersion']").val();
	var url = $("input[name='url']").val();
	var lastVersion = $("input[name='lastVersion']").val();
	
	var remark = $("textarea[name='remark']").val();
	
	remark= remark.replace(/\n/g,"<br/>"); 
	
	var jsonStr = "{\"datas\":[";
	jsonStr += "{\"key\":\"" + upVersion + "\",\"url\":\"" + url   
	+ "\",\"lastVersion\":\"" + lastVersion 
	+ "\",\"remark\":\"" + remark 
		+ "\"},";
	jsonStr = jsonStr.substring(0, jsonStr.length - 1) +"]}";
    $.ajax({
		type:"post",
		url:"<%=path %>/confSave",
		data:jsonStr,
        contentType: "application/json; charset=utf-8",
		success:function (result){
			alert(result);
			queryVersion(FILE_NAME);
		},
		error:function(textStatus,errorThrown){
			alert("请求保存服务失败!");
		},
		dataType:"text",
		async:true});
}

function setField(obj){
	var curVal = obj.value;
	if(curVal == $(obj).parent().find("input[name='oldVal']").val()){
		$(obj).parent().find("input[name='flag']").val("0");
	}else{
		$(obj).parent().find("input[name='flag']").val("1");
	}
}
</script>
</head>
<body>
	
	<button onclick="saveModify()" id="save1">保存</button>
	<button onclick="saveModify1('upgrade')" id="save2">保存</button>
	<section>
		<ul id="tabs">
			<li><a name="tab1" onclick="query('env')" href="javascript:void(0);">env.properties</a></li>
			<li><a name="tab2" onclick="query('info')" href="javascript:void(0);">Info.properties</a></li>
			<li><a name="tab3" onclick="queryVersion('ios')" href="javascript:void(0);">ios.properties</a></li>
			<li><a name="tab4" onclick="queryVersion('android')" href="javascript:void(0);">android.properties</a></li>
			<li><a name="tab5" onclick="queryPending('pending')" href="javascript:void(0);">待阅配置</a></li>
		</ul>
			<div id="content">
			<div id="tab1">
				 <div class="button1" onclick="addConfig('env')">新增系统配置信息</div>
				<div id="div1"></div>
				<table id="tble_env" style="margin-top: 40px;">
				</table>
			</div>
			<div id="tab2">
				 <div class="button1" onclick="addConfig('info')">新增文案配置信息</div>
				<div id="div2"></div> 
					<table id="tble_info">
					</table>
			</div>
			<div id="tab3">
				<table id="tble_ios">
				</table>
			</div>
			<div id="tab4">
				<table id="tble_android">
				</table>
			</div>
			<div id="tab5">
				 <div class="button1" onclick="addConfig('pending')">新增待阅配置</div>
				<div id="div3"></div> 
				<table id="tble_pending">
				</table>
			</div>
		</div>
	</section>
</body>
</html>