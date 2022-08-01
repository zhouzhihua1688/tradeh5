var minAmt = '';
var contractList = {};
App.setSession("reminderType",2)
App.setSession("fundRiskLevel",0);
var availableProductList;
var selectedProduct;
var selectedBankCard;
$(function () {
    $('.paymentMethod').click(function () {
        $(".mask").show();
        $('#bankCardList').show();
    });
    $('.fundList .cancel').on('click', function () {//取消弹窗
        $('.fundList').hide();
    });
    $('.fundList .done').on('click', function () {//完成弹窗
        var index = $(".fundList").find("li[class*=active]").index();
        if(availableProductList != undefined && availableProductList != null) {
            selectedProduct = availableProductList[index - 1];

            var readTxt = "";
            var fundContractList = selectedProduct.fundContractList;
			console.log(fundContractList)
            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){
            	$("#risk_list").html("");
                var html = '';

                //根据类型处理数据
                var listKey = new Array();//拼分组数组
                fundContractList.forEach(function (item, index) {
                	if(listKey.indexOf(item.contractCategory) == -1){
                		listKey.push(item.contractCategory);
                	}
                });
                if(listKey.length > 0){
                //存到session
                App.setSession("topup_agreementIds",listKey.join(','))
            	}
				listKey.forEach(function (item0, index0) {

					if(item0 == "KFS"){
						html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/checkBox.png" alt="">我已阅读并确认已知悉';
					}else{
						html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/checkBox.png" alt="">我已同意';
					}
	                fundContractList.forEach(function (item, index) {
	            		if(item0 == item.contractCategory){
		                    html += "<a href=\""+ item.url +"\">《"+ item.title +"》</a>";
		                  
		                    if((index + 1) < fundContractList.length) {
								html += "&nbsp;";
		                    
		                    }
	                	}
	                });
	                html += '</p>';
	                $("#risk_list").append(html);
			        App.bind("#isRead"+index0,"tap",function(){
					    if ($(this).attr('src') === '../images/checkBox.png') {
					        $(this).attr('src', '../images/checked.png')
					        	
							var contractLength = $("#risk_list").children("p").length;
							var chkCnt = 0;
							$("#risk_list").children("p").each(function(){
								if($(this).children("img").attr('src') == '../images/checked.png'){
									chkCnt+=1;
								}
							});
					        
					        if(Number($("#rechargeAmount").val()) > 0  && (contractLength == chkCnt)){
					        	$(".btn").css({'background-color':'#fd7e23'});
								App.unbind('.btn', "tap",confirmRecharge);
					        	App.bind('.btn', "tap",confirmRecharge);
					        }else{
					        	App.unbind('.btn', "tap",confirmRecharge);
					        	$(".btn").css({'background-color':'#ddd6d6'});
					        }
					    } else {
					        $(this).attr('src', '../images/checkBox.png')
					    	App.unbind('.btn', "tap",confirmRecharge);
					    	$(".btn").css({'background-color':'#ddd6d6'});
					    }
			        })
                })

            }

            var date = selectedProduct.navDate.substr(-4, 2)+'.'+selectedProduct.navDate.substr(-2, 2);
            $(".sProductName").html(selectedProduct.fundName);
            $(".sProductId").html(selectedProduct.fundId);
            $(".sProductNavDt").html(date);
            $(".sProductYield").html(selectedProduct.yield + '%');
			if(selectedProduct.canBeAppended == true){
				minAmt = selectedProduct.minAppendAmount;
			}else{
            	minAmt = selectedProduct.minPurchaseAmount;
        	}
            
            if(App.isNotEmpty(selectedProduct.upgradeTips)){
            	$("#other_tip").html(selectedProduct.upgradeTips + '，<a href="'+selectedProduct.upgradeJumpUrl+'" class="blue">查看更多</a>');
            	$("#other_tip").show();
            }else{
            	$("#other_tip").hide();
            }
            
        }
        $('.fundList').hide();
    });
    $('.money .del').on('click', function () {//清空input
        $('.money input').val('')
        $('.chineseText span').text(changeNumMoneyToChinese(''))
    	App.unbind('.btn', "tap",confirmRecharge);
    	$(".btn").css({'background-color':'#ddd6d6'});
    });
    $('.money input').on('input', function () {//格式化input
        var val = $(this).val().replace(/[,A-z]/g, '');
        // var arr = val.split(/[.]/);
        // var reg = /(?=(\B)(\d{3})+$)/g;
        // $(this).val(str)
        $('.chineseText span').text(changeNumMoneyToChinese(val))
		var contractLength = $("#risk_list").children("p").length;
		var chkCnt = 0;
		$("#risk_list").children("p").each(function(){
			if($(this).children("img").attr('src') == '../images/checked.png'){
				chkCnt+=1;
			}
		});
		
        if(val > 0 && (contractLength == chkCnt)){
        	$(".btn").css({'background-color':'#fd7e23'});
			App.unbind('.btn', "tap",confirmRecharge);
        	App.bind('.btn', "tap",confirmRecharge);
        }else{
        	App.unbind('.btn', "tap",confirmRecharge);
        	$(".btn").css({'background-color':'#ddd6d6'});
        }
    });
    $(".btn").css({'background-color':'#ddd6d6'});
    queryAvailableProduct();
    queryCardList();
    queryRechargeDate();
});

function changeNumMoneyToChinese(money) {
    var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "元"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字
    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr = ""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义
    var Symbol = "";//正负值标记
    if (money == "") {
        return "";
    }

    money = parseFloat(money);
    if (money >= maxNum) {
        // alert('超出最大处理数字');
        return "";
    }
    if (money == 0) {
        ChineseStr = cnNums[0] + cnIntLast + cnInteger;
        return ChineseStr;
    }
    if (money < 0) {
        money = -money;
        Symbol = "负 ";
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = '';
    } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
        var zeroCount = 0;
        var IntLen = IntegerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = IntegerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == "0") {
                zeroCount++;
            }
            else {
                if (zeroCount > 0) {
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; //归零
                ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                ChineseStr += cnIntUnits[q];
            }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕   
    }
    if (DecimalNum != '') { //小数部分
        var decLen = DecimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = DecimalNum.substr(i, 1);
            if (n != '0') {
                ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (ChineseStr == '') {
        ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (DecimalNum == '') {
        ChineseStr += cnInteger;
    }
    ChineseStr = Symbol + ChineseStr;

    return ChineseStr;
}


function queryAvailableProduct(){
    var url = "/mobile-bff/v1/smac/recharge/list";
    App.get(url,null,function(result){
        var list = result.body;
        if(list != undefined && list != null && list.length > 0) {
            availableProductList = list;
            var listHtml = "";
            list.forEach(function (item, index) {
                var date = item.navDate.substr(-4, 2)+'.'+item.navDate.substr(-2, 2);
                var activecls = '';
                if(list.length == 1){
	                if(index == 0) {
	                	activecls = 'active';
	                    selectedProduct = item;
	                    $(".sProductName").html(item.fundName);
	                    $(".sProductId").html(item.fundId);
	                    $(".sProductNavDt").html(date);
	                    $(".sProductYield").html(item.yield + '%');
	                    if(App.isNotEmpty(item.upgradeTips)){
	                    	$("#other_tip").html(item.upgradeTips + '<a href="'+item.upgradeJumpUrl+'" class="blue">查看更多</a>');
	                    	$("#other_tip").show();
	                    }else{
	                    	$("#other_tip").hide();
	                    }
						if(selectedProduct.canBeAppended == true){
							minAmt = selectedProduct.minAppendAmount;
						}else{
			            	minAmt = selectedProduct.minPurchaseAmount;
			        	}
			        	

			            var readTxt = "";
			            var fundContractList = selectedProduct.fundContractList;
			            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){

			            	$("#risk_list").html("");
			                var html = '';

			                //根据类型处理数据
			                var listKey = new Array();//拼分组数组
			                fundContractList.forEach(function (item, index) {
			                	if(listKey.indexOf(item.contractCategory) == -1){
			                		listKey.push(item.contractCategory);
			                	}
			                });
			                if(listKey.length > 0){
			                //存到session
			                App.setSession("topup_agreementIds",listKey.join(','))
			            	}
							listKey.forEach(function (item0, index0) {

								if(item0 == "KFS"){
									html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/checkBox.png" alt="">我已阅读并确认已知悉';
								}else{
									html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/checkBox.png" alt="">我已同意';
								}
				                fundContractList.forEach(function (item, index) {
				            		if(item0 == item.contractCategory){
					                    html += "<a href=\""+ item.url +"\">《"+ item.title +"》</a>";
					                  
					                    if((index + 1) < fundContractList.length) {
					                        html += "&nbsp;";
					                        
					                    }
				                	}
				                });
				                html += '</p>';
				                $("#risk_list").append(html);
						        App.bind("#isRead"+index0,"tap",function(){
								    if ($(this).attr('src') === '../images/checkBox.png') {
								        $(this).attr('src', '../images/checked.png')
								        	
										var contractLength = $("#risk_list").children("p").length;
										var chkCnt = 0;
										$("#risk_list").children("p").each(function(){
											if($(this).children("img").attr('src') == '../images/checked.png'){
												chkCnt+=1;
											}
										});
								        
								        if(Number($("#rechargeAmount").val()) > 0  && (contractLength == chkCnt)){
								        	$(".btn").css({'background-color':'#fd7e23'});
											App.unbind('.btn', "tap",confirmRecharge);
								        	App.bind('.btn', "tap",confirmRecharge);
								        }else{
								        	App.unbind('.btn', "tap",confirmRecharge);
								        	$(".btn").css({'background-color':'#ddd6d6'});
								        }
								    } else {
								        $(this).attr('src', '../images/checkBox.png')
								    	App.unbind('.btn', "tap",confirmRecharge);
								    	$(".btn").css({'background-color':'#ddd6d6'});
								    }
						        })
			                })
			            }
			        	
	                }
            	}else{
	                if(item.choose) {
	                	selectedProduct = item;
	                	activecls = 'active';
	                    $(".sProductName").html(item.fundName);
	                    $(".sProductId").html(item.fundId);
	                    $(".sProductNavDt").html(date);
	                    $(".sProductYield").html(item.yield + '%');
	                    
	                    if(App.isNotEmpty(item.upgradeTips)){
	                    	$("#other_tip").html(item.upgradeTips + '<a href="'+item.upgradeJumpUrl+'" class="blue">查看更多</a>');
	                    	$("#other_tip").show();
	                    }else{
	                    	$("#other_tip").hide();
	                    }
						if(selectedProduct.canBeAppended == true){
							minAmt = selectedProduct.minAppendAmount;
						}else{
			            	minAmt = selectedProduct.minPurchaseAmount;
			        	}
			        	
			        	
			            var readTxt = "";
			            var fundContractList = selectedProduct.fundContractList;
			            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){
			                
			            	$("#risk_list").html("");
			                var html = '';

			                //根据类型处理数据
			                var listKey = new Array();//拼分组数组
			                fundContractList.forEach(function (item, index) {
			                	if(listKey.indexOf(item.contractCategory) == -1){
			                		listKey.push(item.contractCategory);
			                	}
			                });
			                if(listKey.length > 0){
			                //存到session
			                App.setSession("topup_agreementIds",listKey.join(','))
			            	}
							listKey.forEach(function (item0, index0) {

								if(item0 == "KFS"){
									html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/checkBox.png" alt="">我已阅读并确认已知悉';
								}else{
									html = '<p class="dim rules" ><img class="checkBox" id="isRead'+index0+'" src="../images/checkBox.png" alt="">我已同意';
								}
				                fundContractList.forEach(function (item, index) {
				            		if(item0 == item.contractCategory){
					                    html += "<a href=\""+ item.url +"\">《"+ item.title +"》</a>";
					        
					                    if((index + 1) < fundContractList.length) {
					                        html += "&nbsp;";
					                  
					                    }
				                	}
				                });
				                html += '</p>';
				                $("#risk_list").append(html);
						        App.bind("#isRead"+index0,"tap",function(){
								    if ($(this).attr('src') === '../images/checkBox.png') {
								        $(this).attr('src', '../images/checked.png')
								        	
										var contractLength = $("#risk_list").children("p").length;
										var chkCnt = 0;
										$("#risk_list").children("p").each(function(){
											if($(this).children("img").attr('src') == '../images/checked.png'){
												chkCnt+=1;
											}
										});
								        
								        if(Number($("#rechargeAmount").val()) > 0  && (contractLength == chkCnt)){
								        	$(".btn").css({'background-color':'#fd7e23'});
											App.unbind('.btn', "tap",confirmRecharge);
								        	App.bind('.btn', "tap",confirmRecharge);
								        }else{
								        	App.unbind('.btn', "tap",confirmRecharge);
								        	$(".btn").css({'background-color':'#ddd6d6'});
								        }
								    } else {
								        $(this).attr('src', '../images/checkBox.png')
								    	App.unbind('.btn', "tap",confirmRecharge);
								    	$(".btn").css({'background-color':'#ddd6d6'});
								    }
						        })
			                })
			            }
			        	
			        	
	                }
            	}
            	
                listHtml += '<li class="fund '+ activecls +'">' +
                    '    <img src="../images/account/'+ (activecls == 'active' ? 'active' : 'radio') +'.png" alt="">' +
                    '    <div>' +
                    '        <p>'+ item.fundName +' <span>'+ item.fundId +'</span></p>' +
                    '        <p class="pt5" style="color: #666;">'+item.productDesc+'</p>' +
                    '    </div>' +
                    '</li>';
            });
            $(".fundList ul").append(listHtml);
            $('.fundList .fund').on('click', function () {//选择基金
                $(this).find('img')
                    .attr('src', './../images/account/active.png')
                    .parent()
                    .siblings()
                    .find('img')
                    .attr('src', './../images/account/radio.png');
                $(this).addClass("active").siblings().removeClass("active");
            });
            if(list.length > 1){
			    $('.content .funds').on('click', function () {//弹窗
			        $('.fundList').show();
			    });
	            $("#list_tip").show();
        	}
        }else{
        	$("#list_tip").hide();
        }
    });
}

function queryCardList() {
    App.queryCard(function () {
        var cards = App.getSession(App.cards);
        if(cards == undefined || cards == null || cards.length == 0){
            alertTips("请先添加银行卡再充值", "确定", function(){
                window.location = "../card/manage_card.html";
            });
        } else {
        	//查询是否设置过交易密码
		    App.queryHasSetTradePassword(function (data) {
		        // console.log("callback", data);
				var data = JSON.parse(data);
		        if(data.returnCode == 1000){
		        	
		        }else if(data.body.isSetPwd != "1"){
					alertTips4("信息",'您暂未设置交易密码，请点击下方"立即设置"', "取消", "立即设置",
                            function(){$(".Bomb-box").hide();},
                            function(){window.location.href = "../card/bindCardInputPassword_1.html?referUrl=" + encodeURIComponent(document.URL)}
                        );
					return ;
		        }
		    });
        	
            var html = '';
            cards.forEach(function (item) {
                var signStyle,signTxt;
                if(item.signWay == "1"){
                    signStyle = "shorcut";
                    signTxt = "快捷";
                }else if(item.signWay == "2"){
                    signStyle = "union";
                    signTxt = "银联通";
                }else if(item.signWay == "3"){
                    signStyle = "E-bank";
                    signTxt = "网银";
                }else if(item.signWay == "5"){
                    return;
                }
                if(item.tradeFlag == '1' && selectedBankCard == undefined){
                    selectedBankCard = item;
                    $(".sBankName").html(item.bankName);
                    $(".sBankCardNumber").html(item.bankAccoDisplay);
                    $(".selectedBank").addClass("ico_" + item.bankNo);
					$("#limitRemark").html("默认充值限额："+item.limitRemark);
					$("#singleMax").val(item.dayThreashHold);
                }

                html += '<li class="grid-list-item">' +
                    '    <div class="rowDiv">' +
                    '        <div class="col1">' +
                    '            <i class="bank ico_'+ item.bankNo+' no-margin-left"></i>' +
                    '        </div>' +
                    '        <div class="col2">' +
                    '            <div class="list-title">' +
                    '                <span class="left">'+ item.bankName +'</span><span class="right">'+ item.bankAccoDisplay +'</span>' +
                    '            </div>' +
                    '        </div>' +
                    '        <div class="col3">' +
                    '            <a class="icon icon-'+ signStyle +'">'+ signTxt +'</a>' +
                    '        </div>' +
                    '    </div>' +
                    '</li>';
            });
            $("#bankCardList ul").append(html);
            $("#bankCardList li").click(function () {
                $(".mask").hide();
                $('#bankCardList').hide();
                var cards = App.getSession(App.cards);
                if(cards != undefined && cards != null && cards.length > 0){
                    $(".selectedBank").removeClass("ico_" + selectedBankCard.bankNo);
                    selectedBankCard = cards[$(this).index()];
                    $(".sBankName").html(selectedBankCard.bankName);
                    $(".sBankCardNumber").html(selectedBankCard.bankAccoDisplay);
                    $(".selectedBank").addClass("ico_" + selectedBankCard.bankNo);
					$("#limitRemark").html("默认充值限额："+selectedBankCard.limitRemark);
					$("#singleMax").val(selectedBankCard.dayThreashHold);
                }
            });
        }
    });
}

/**
 * 查询开始计息日期，与到账日期
 */
function queryRechargeDate(){
    var url = App.projectNm + "/etrading/get_ec_recharge?date="+ (new Date()).getTime();
    App.get(url,null,function(result){
        App.setSession(App.revenueDate, result.body.revenueDate);
        App.setSession(App.arrivalDate, result.body.arrivalDate);
        var revnueDate = result.body.revenueDate;
        var arrivalDate = result.body.arrivalDate;
        revnueDate = revnueDate.substring(5, 7) + "月" + revnueDate.substring(8) + "日";
        arrivalDate = arrivalDate.substring(5, 7) + "月" + arrivalDate.substring(8) + "日";
        $(".revenueDate").html(revnueDate);
        $(".arrivalDate").html(arrivalDate);
    });
}

/**
 * 确认充值
 */
function confirmRecharge(){
    if(!valide()){
        return;
    }
    var subAmt = $("#rechargeAmount").val().replace(/[,A-z]/g, '');
    if(Number(subAmt) < 0.01){
        alertTips("充值金额要不少于0.01元");
        return;
    }
    if(Number(subAmt) < Number(minAmt)){
        alertTips("充值金额不能小于最低申购金额"+App.formatMoney(minAmt));
        return;
    }

    var acceptMode = "4";
    if(selectedBankCard != undefined && selectedBankCard != null
        && selectedProduct != undefined && selectedProduct != null){
        var url = App.projectNm + "/etrading/ec_recharge";
        var data = JSON.stringify({"bankAcco":selectedBankCard.bankAcco,"bankNo":selectedBankCard.bankNo,"subAmt":subAmt,"baseAccountCode":selectedProduct.fundId,"acceptMode":acceptMode});
        App.post(url, data, null,function(result){
            App.setSession(App.serialNo_info, result.body.info);
            App.setSession(App.serialNo, result.body.serialNo);
            App.setSession(App.serialNo_success_show_data, data);
            App.setSession("risk_fundId",selectedProduct.fundId);
            var forwardUrl = App.getUrlParam("forwardUrl");
            if(App.isNotEmpty(forwardUrl)){
                App.setSession(App.serialNo_forword_url, "../account/topupsuccess.html?forwardUrl=" + forwardUrl);
            } else {
                App.setSession(App.serialNo_forword_url, "../account/topupsuccess.html");
            }
            window.location.href = "../common/setPassword.html";
        });
    }
}
	
$("#rechargeAmount").on("input", function () {
	var contractLength = $("#risk_list").children("p").length;
	var chkCnt = 0;
	$("#risk_list").children("p").each(function(){
		if($(this).children("img").attr('src') == '../images/checked.png'){
			chkCnt+=1;
		}
	});
	
	if(Number($("#singleMax").val()) <= Number($("#rechargeAmount").val()) ){
		$("#big").show();
		$("#small").hide();
	}else{
		$("#big").hide();
		$("#small").show();
	}
    if(Number($("#rechargeAmount").val()) > 0  && (contractLength == chkCnt)){
    	$(".btn").css({'background-color':'#fd7e23'});
		App.unbind('.btn', "tap",confirmRecharge);
    	App.bind('.btn', "tap",confirmRecharge);
    }else{
    	App.unbind('.btn', "tap",confirmRecharge);
    	$(".btn").css({'background-color':'#ddd6d6'});
    }
})
$(".btn").css({'background-color':'#ddd6d6'});