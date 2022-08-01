<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.fund.etrading.mclient.model.fixedterm.FixedFundInfo"%>
<%@page import="com.fund.etrading.mclient.service.FundService"%>
<%@page import="com.fund.etrading.mclient.common.Tools"%>
<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	FundService fundService = Tools.getContextBean("fundService35", FundService.class);

	List<FixedFundInfo> funds = null;
	List<FixedFundInfo> financials = null;
	if(fundService != null){
		Map<String, Object> fixedMap = fundService.queryFixedFundList();
		funds = (List<FixedFundInfo>)fixedMap.get("fixedFundList");
		financials = (List<FixedFundInfo>)fixedMap.get("fixedFinancialList");
	}
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>汇定期产品</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="format-detection" content="telephone=no,email=no,address=no">
    <style>
        /* Start reset */
        *{ margin: 0; padding: 0;}
        html {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;min-height: 100%;position: relative;}
        body{ font: 14px/1em Microsoft YaHei,sans-serif;color: #666;max-width: 750px;  background-color: #f3f3f3;}
        @media only screen and (max-width: 320px) {
            body{ font-size: 12px; }
        }
        ul, ol, dl{ list-style: none;}
        em, i{ font-style: normal;}
        input{ border: 0;line-height: normal;}
        img{ display: block;max-width: 100%;height: auto; border: 0;}
        table {border-collapse: collapse;border-spacing: 0;}
        a{ text-decoration: none; }
        a:active,a:hover { outline: 0;}
        /* End reset */
        .fixed{

        }
        .fixed-title{
            background-color: #fff;
            overflow: hidden;
            margin-bottom: 3%;
            border-bottom: 1px solid #fff;
        }
        .fixed-title li{
            width: 50%;
            float: left;
            text-align: center;
        }
        .fixed-title li.on{
           border-bottom: 2px solid #fe7e01;
        }
        .fixed-title li a{
            display: block;
            color: #333;
            font-size: 1.125em;
            height: 3em;
            line-height: 3em;
        }

        .fixed-list li{
            border-top: 1px solid #e7e7e7;
            border-bottom: 1px solid #e7e7e7;
            padding: 0% 4%;
            overflow: hidden;
            background-color: #fff;
            margin-bottom: 2%;
        }
        .fixed-list li a{
            display: block;
            height: 3em;
            line-height: 3em;
            font-weight: normal;
            font-size: 1.125em;
            color: #333;
            border-bottom: 1px solid #eee;
            margin-bottom: 3%;
            position: relative;
        }
        .fixed-list li a span{
            padding: 0 5px ;
            font-size: .875em;
            color: #fff;
            background-color: #ccc;
            border-radius: 2px;
            margin-left: 1em;
        }
        .fixed-list li a i{
            position: absolute;
            top: 50%;
            right: 2px;
            width: 10px;
            height: 18px;
            margin-top: -9px;
            background: url("img/fixed-arrow.png") no-repeat;
            background-size: 10px 18px;
            display: inline-block;
            vertical-align: middle;
        }
        @media only screen and (max-width: 320px) {
            .fixed-list li a i{
                background-size: 8px 15px;
            }
        }
        .fixed-list-div{
            float: left;
            width: 50%;
            margin-bottom: 1em;
        }
        .fixed-list-div p{
            line-height: 2em;
            font-size: 1em;
        }
        .fixed-list-div p strong{
            font-family: arial, sans-serif;
            font-size: 1.125em;
        }
        .fixed-list-div p.c-orange{
            color: #fe7e01;
        }

        /* new add */
        .fixed-list li .trade-rule {
            display: block;
            width: 100%;
            font-size: 1em;
            height: 3em;
            line-height: 3em;
            color: #666;
            text-align: center;
            clear: both;
            border-top: 1px solid #eee;

        }
        .fixed-list li .trade-rule i{
            width: 17px;
            height: 10px;
            margin-left: 5px;
            background-size: 17px 10px;
            display: inline-block;
        }
        .fixed-list li .trade-rule i.arrow-down{
            background: url("img/arrow-down.png") no-repeat;
        }
        .fixed-list li .trade-rule i.arrow-up{
            background: url("img/arrow-up.png") no-repeat;
        }
        .fixed-list li .rule-info{
            padding-top: 1%;
            display: none;
        }
        .fixed-list li .rule-info h4{
            color: #000;
            font-size: 1em;
            line-height: 1.5em;
            font-weight: normal;
        }
        .fixed-list li .rule-info p{
            color: #666;
            font-size: 1em;
            line-height: 1.5em;
        }
        .fixed-list li .rule-info p.marginb{
            margin-bottom: 1em;
        }
    </style>
</head>

<body>
    <!--fixed-->
    <div class="fixed">
    	<% if(funds != null && funds.size() > 0 && financials != null && financials.size() > 0){ %>
         <ul class="fixed-title">
             <li class="on"><a href="javascript:;">定期开放基金</a></li>
             <li><a href="javascript:;">理财基金</a></li>
         </ul>
    	<%} %>
        <!--定期开放基金-->
        <ul class="fixed-list" id="funds" <%if(funds == null || funds.size() == 0 ){ %> style="display: none;" <%} %>>
        	<%
        		if(funds != null){
        			for(FixedFundInfo ffi : funds){
        				String tradeStr = StringUtils.EMPTY;
        				/* 基金状态：0\1\2\6 可购买*/
        				if (StringUtils.equals(ffi.getFundSt(), "2")){
        					tradeStr = "暂停定投";
        				} else if(StringUtils.equals(ffi.getFundSt(), "4")){
        					tradeStr = "暂停交易";
        				} else if(StringUtils.equals(ffi.getFundSt(), "5")){
        					tradeStr = "暂停申购";
        				/* } else if(StringUtils.equals(ffi.getFundSt(), "6")){
        					tradeStr = "暂停赎回"; */
        				} else if(StringUtils.equals(ffi.getFundSt(), "7")){
        					tradeStr = "募集期";
        				} else if(StringUtils.equals(ffi.getFundSt(), "8")){
        					tradeStr = "募集结束";
        				} else if(StringUtils.equals(ffi.getFundSt(), "9")){
        					tradeStr = "基金封闭";
        				}
        	%>
            <li>
                <a href="<%=StringUtils.isBlank(ffi.getUrl()) ? "javascript:;" : ffi.getUrl() %>"><%=ffi.getFundName() %><% if(!StringUtils.isBlank(tradeStr)){ %><span><%=tradeStr %></span><%} %><i></i></a>
                <div class="fixed-list-div">
                    <p class="c-orange"><strong><%=ffi.getProfit() %>%</strong></p>
                    <p>成立以来累计收益率</p>
                </div>
                <div class="fixed-list-div">
                    <p><strong><%=ffi.getTermType() %></strong>天</p>
                    <p>投资期限</p>
                </div>

                <div class="trade-rule">
                    <span>交易规则</span><i class="arrow-down"></i>
                </div>
                <div class="rule-info">
                    <h4>申购须知</h4>
                    <%
                    	List<Map<String, String>> list = ffi.getApplyDesc();

            			int temp = 0;
                    	if(list != null && list.size() > 0)
                    		for(Map<String, String> map : list){
                    			temp++;
                    %>
                    			<p <%if(temp == list.size()){ %> class="marginb"<%} %>><%=map.get("key") %>：<%=map.get("value") %></p>
                    <%
                    		} 
                    %>

                    <h4>赎回须知</h4>
                    <%
                    list = ffi.getRedeemDesc();

            			temp = 0;
                    	if(list != null && list.size() > 0)
                    		for(Map<String, String> map : list){
                    			temp++;
                    %>
                    			<p <%if(temp == list.size()){ %> class="marginb"<%} %>><%=map.get("key") %>：<%=map.get("value") %></p>
                    <%
                    		} 
                    %>
                </div>
            </li>
            <%
        			}
        		}
            %>
        </ul>
        <!--理财基金-->
        <ul class="fixed-list" id="financials" <%if(financials == null || financials.size() == 0 || (funds != null && funds.size() > 0) ){ %> style="display: none;" <%} %>>
        	<%
        		if(financials != null){
        			for(FixedFundInfo ffi : financials){
        				String tradeStr = StringUtils.EMPTY;
        				/* 基金状态：0\1\2\6 可购买*/
        				if (StringUtils.equals(ffi.getFundSt(), "2")){
        					tradeStr = "暂停定投";
        				} else if(StringUtils.equals(ffi.getFundSt(), "4")){
        					tradeStr = "暂停交易";
        				} else if(StringUtils.equals(ffi.getFundSt(), "5")){
        					tradeStr = "暂停申购";
        				/* } else if(StringUtils.equals(ffi.getFundSt(), "6")){
        					tradeStr = "暂停赎回"; */
        				} else if(StringUtils.equals(ffi.getFundSt(), "7")){
        					tradeStr = "募集期";
        				} else if(StringUtils.equals(ffi.getFundSt(), "8")){
        					tradeStr = "募集结束";
        				} else if(StringUtils.equals(ffi.getFundSt(), "9")){
        					tradeStr = "基金封闭";
        				}
        	%>
            <li>
                <a href="<%=StringUtils.isBlank(ffi.getUrl()) ? "javascript:;" : ffi.getUrl() %>"><%=ffi.getFundName() %><% if(!StringUtils.isBlank(tradeStr)){ %><span><%=tradeStr %></span><%} %><i></i></a>
                <div class="fixed-list-div">
                    <p class="c-orange"><strong><%=ffi.getProfit() %>%</strong></p>
                    <p>最近运作期年化收益率</p>
                </div>
                <div class="fixed-list-div">
                    <p><strong><%=ffi.getTermType() %></strong>天</p>
                    <p>投资期限</p>
                </div>

                <div class="trade-rule">
                    <span>交易规则</span><i class="arrow-down"></i>
                </div>
                <div class="rule-info">
                    <h4>申购须知</h4>
                    <%
                    	List<Map<String, String>> list = ffi.getApplyDesc();

            			int temp = 0;
                    	if(list != null && list.size() > 0)
                    		for(Map<String, String> map : list){
                    			temp++;
                    %>
                    			<p <%if(temp == list.size()){ %> class="marginb"<%} %>><%=map.get("key") %>：<%=map.get("value") %></p>
                    <%
                    		} 
                    %>

                    <h4>赎回须知</h4>
                    <%
                    list = ffi.getRedeemDesc();

            			temp = 0;
                    	if(list != null && list.size() > 0)
                    		for(Map<String, String> map : list){
                    			temp++;
                    %>
                    			<p <%if(temp == list.size()){ %> class="marginb"<%} %>><%=map.get("key") %>：<%=map.get("value") %></p>
                    <%
                    		} 
                    %>
                </div>
            </li>
            <%
        			}
        		}
            %>
        </ul>
    </div>
    <script src="../basic/jquery.3.4.1.min.js"></script>
    <script>
       $(function(){
           $(".fixed-title li a").on("click",function(){
               $(this).parent().addClass("on").siblings().removeClass("on");
               var index = $(this).parent().index();
               $(".fixed-list").hide().eq(index).show();
           });

           $(".trade-rule").on("click",function(){
               var ichild = $(this).children("i");
               if(ichild.hasClass("arrow-down")){
                   $(this).siblings(".rule-info").show();
                   ichild.attr("class","arrow-up");
               }
               else{
                   $(this).siblings(".rule-info").hide();
                   ichild.attr("class","arrow-down");
               }
           });
       });
    </script>
</body>
</html>