//初始化数据
$(".btn").css({'background-color':'#ddd6d6'});
App.setSession("reminderType",2)
App.setSession("fundRiskLevel",0);
var productId = "000330";
setMipBuyday("1");
setMipCycle("MM");
queryCanRechargeProductList();
$(function() {
    App.queryCard(function() {
        setSelectedCard();
        initCardList();
        setFirstUsingCard()
    });

    var handTp = App.getUrlParam("handTp");
    setFirstUsingCard();
    if (handTp == "C") {
        //App.bind("#btn-submit", "tap", submitCreate);
        var cards = App.getSession(App.cards);
        if (cards == null) {
            App.queryCard(function() {
                setSelectedCard();
                initCardList()
            })
        } else {
            setSelectedCard();
            initCardList()
        };
        showTime()
    } else {
    	$(".checkBox").attr('src', '../images/checked.png')
        $(".selectBankCard").unbind("click");
        $(".btn").css({'background-color':'#fd7e23'});
        App.bind("#btn-submit", "tap", submitModify);
        var plan = App.getSession(App.autoTopUpModifyInfo);
        if (plan == null || plan == undefined || plan == '') {
            window.location.href = "./autoTopUpList.html"
        } else {
            setSelectedCard(plan);
            $(".inputMoney input").val(plan.mipBuyAmt);
            setMipCycle(plan.mipCycle);
            setMipBuyday(plan.mipBuyday);
            $("#appDate").val(tranMipCycle(plan.mipCycle) + tranMipBuyday(plan.mipCycle, plan.mipBuyday));
            if (plan.mipDesc == "") {
                showTime()
            } else {
                $(".autoTopUpRemark").val(plan.mipDesc)
            }
        }
    }
});

function getMipCycle() {
    return App.getSession("__auto_topup_mipCycle")
};

function setMipCycle(mipCycle) {
    App.setSession("__auto_topup_mipCycle", mipCycle)
};

function getMipBuyday() {
    return App.getSession("__auto_topup_mipBuyday")
};

function setMipBuyday(mipBuyday) {
    App.setSession("__auto_topup_mipBuyday", mipBuyday)
};

function showTime() {
    var mydate = new Date();
    var str = "" + mydate.getFullYear();
    var month = (mydate.getMonth() + 1);
    var monthDay = mydate.getDate();
    str += month < 10 ? ("0" + month) : month;
    str += monthDay < 10 ? ("0" + monthDay) : monthDay;
    $(".autoTopUpRemark").attr("placeholder", "工资宝" + str + "")
};

function setSelectedCard(plan) {
    var cards = App.getSession(App.cards);
    if (cards == null || cards.length == 0) {
        App.queryCard(function() {
            var cards = App.getSession(App.cards);
            setCardPanel(plan.bankNo, plan.bankAcco, cards)
        })
    } else {
        setCardPanel(plan.bankNo, plan.bankAcco, cards)
    }
};

function setCardPanel(bankNo, bankAcco, card_list) {
    var card = searchCard(bankNo, bankAcco, card_list);
    if (card == null) {
        setFirstUsingCard()
    } else {
        App.setSession(App.selectedCard, card);
        setCard(card)
    }
};

function searchCard(bankNo, bankAcco, cards) {
    for (var index in cards) {
        var card = cards[index];
        if (card.bankAcco == bankAcco && card.bankNo == bankNo) {
            return card
        }
    };
    return null
};

function setSelectedCard() {
    var card = App.getSession(App.selectedCard);
    if (card == null) {
        setFirstUsingCard()
    } else {
        setCard(card)
    }
};

function setFirstUsingCard() {
    var card = App.firstUsingCard(function() {
        var cards = App.getSession(App.cards);
        if (cards.length > 0) {
            for (var index in cards) {
                var card = cards[index];
                if ("1" == card.tradeFlag) {
                    showFirstCard(card);
                    return
                }
            }
        } else {
            alertTips("请先绑定一张银行卡", "确定", function() {
                window.location = "../card/manage_card.html"
            })
        }
    });
    if (card != null) {
        showFirstCard(card)
    }
};

function showFirstCard(card) {
    setCard(card);
    App.setSession(App.selectedCard, card)
};

function setCard(card) {
    $(".selectedBankCard").html('<i class="bank-panel1 bank ico_' + card.bankNo + '" style="margin-right:0;top:.4rem;"></i><span class="ml10 black">' + card.bankName + '</span><span class="ml10">' + card.bankAccoDisplay + '</span><img class="ml10" src="../images/arr.png">');
    if(card.remark != "" && card.remark != null){
    	$("#topup_txt").html('<p>' + replaceTxt2Html(card.remark) + '</p>');
	}
    if (card.rechargeRemark != "" && card.rechargeRemark != null) {
        $("#rechargeRemark_ul").show();
        $("#rechargeRemark").html('<p class="red">' + card.rechargeRemark + '</p>')
    } else {
        $("#rechargeRemark_ul").hide()
    }
};

function initCardList() {
    var cards = App.getSession(App.cards);
    var arr = [];
    for (var index in cards) {
        var card = cards[index];
        if (card.tradeFlag != "1") continue;
        var signStyle;
        var signWay;
        if (card.signWay == "1") {
            signStyle = "icon-shorcut";
            signWay = "快捷"
        } else if (card.signWay == "2") {
            signStyle = "icon-union";
            signWay = "银联通"
        } else if (card.signWay == "3") {
            signStyle = "icon-E-bank";
            signWay = "网银"
        } else if (card.signWay == "5") {
            continue
        };
        arr.push('<li class="grid-list-item heigth-130 bottom-border bank-card-option" data="' + card.bankNo + ',' + card.bankAcco + '">');
        arr.push('<div class="row">');
        arr.push('    <div class="lh-130">');
        arr.push('        <i class="bank-panel2 bank ico_' + card.bankNo + ' no-margin-left"></i>');
        arr.push('   </div>');
        arr.push('    <div class="col-1">');
        arr.push('        <div class="list-title">');
        arr.push('            <p class="bank-name">' + card.bankName + '</p>');
        arr.push('              <p class="bank-id">' + card.bankAccoDisplay + '</p>');
        arr.push('         </div>');
        arr.push('     </div>');
        arr.push('      <div class="lh-130">');
        arr.push('       <a class="icon ' + signStyle + '">' + signWay + '</a>');
        arr.push('    </div>');
        arr.push(' </div>');
        arr.push('</li>')
    };
    $("#bankCardList ul").html(arr.join(""));
    App.bind(".bank-card-option", "tap", handlerCard)
};

function handlerCard() {
    var data = $(event.target).attr("data");
    if (data == undefined) {
        var target = $(event.target);
        for (var i = 0; i < 4; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break
        }
    };
    var array = String(data).split(",");
    var bankNo = array[0];
    var bankAcco = array[1];
    var cards = App.getSession(App.cards);
    for (var index in cards) {
        var card = cards[index];
        if (card.bankNo == bankNo && card.bankAcco == bankAcco) {
            App.setSession(App.selectedCard, card);
            setCard(card)
        }
    }
};
var chooseTime = {
    "MM": ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
    "2W": ["周一", "周二", "周三", "周四", "周五"],
    "WW": ["周一", "周二", "周三", "周四", "周五"]
};
$("#appDate").click(function(event) {
    event.preventDefault();
    $(".choose-time").show();
    $("#appDate").blur();
    return false
});
$(".choose-time").click(function(event) {
    var li = $(event.target).parents("li");
    setMipCycle(li.attr("data-choose-time"));
    if (li.length == 0) {
        $(".choose-time").hide();
        return
    };
    if (!li.hasClass("on")) {
        li.addClass("on").siblings("li").removeClass("on");
        var time = chooseTime[li.attr("data-choose-time")],
            str = "";
        for (var i = 0; i < time.length; i++) {
            str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
        };
        $(".choose-time2 ul").html(str);
        $("#appDate").attr("data-time", li.find("div").text())
    };
    $(".choose-time").hide();
    $(".choose-time2").show()
});
$(".choose-time2").click(function() {
    var li = $(event.target).parents("li");
    setMipBuyday(li.attr("data-choose-time"));
    if (li.length == 0) {
        return
    };
    $("#appDate").val($("#appDate").attr("data-time") + li.find("div").text());
    queryAutoRechargePageInfo();
    $(this).hide()
});

function submitCreate() {
    var myMoney = $(".inputMoney input").val();

    var choose_time = getMipCycle();
    var choose_time2 = getMipBuyday();
    var card = App.getSession(App.selectedCard);
    if (!valide()) {
        return
    };
    if (card == null) {
        alertTips('请选择银行卡');
        return
    };
    if (myMoney == '') {
        alertTips('请输入金额');
        return
    };
    if (choose_time == '' || choose_time2 == '') {
        alertTips('请选择扣款日期');
        return
    };

    App.unbind("#btn-submit", "tap", submitCreate);
    var remark = $(".autoTopUpRemark").val();
    var mipCycle = choose_time;
    var mipBuyday = (Array(2).join(0) + choose_time2).slice(-2);
    var url = App.projectNm + "/etrading/auto_recharge_create";
    var data = JSON.stringify({
        bankAcco: card.bankAcco,
        bankNo: card.bankNo,
        mipApkind: '00',
        mipCycle: mipCycle,
        mipBuyday: mipBuyday,
        mipBuyAmt: Number(myMoney),
        mipDesc: remark
    });
    App.post(url, data, function() {
        App.bind("#btn-submit", "tap", submitCreate)
    }, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../account/setUpSuccess.html");
        App.setSession("risk_fundId",productId);
        if(productId == "A0081"){
        	App.setSession("fundRiskLevel","01");
        }
        window.location.href = "../common/setPassword.html"
    })
};

function submitModify() {
    var myMoney = $(".inputMoney input").val();
    var data1 = $('.checkBox').attr("src").indexOf("checked");
    var choose_time = getMipCycle();
    var choose_time2 = getMipBuyday();
    var card = App.getSession(App.selectedCard);
    if (card == null) {
        alertTips('请选择银行卡');
        return
    };
    if (myMoney == '') {
        alertTips('请输入金额');
        return
    };
    if (choose_time == '' || choose_time2 == '') {
        alertTips('请选择充值日期');
        return
    };
    if (data1 == 0) {
        alertTips('请勾选同意《自动充值服务协议》');
        return
    };
    App.unbind("#btn-submit", "tap", submitModify);
    var remark = $(".autoTopUpRemark").val();
    var mipCycle = choose_time;
    var mipBuyday = (Array(2).join(0) + choose_time2).slice(-2);
    var autoTopUp = App.getSession(App.autoTopUpModifyInfo);
    var url = App.projectNm + "/etrading/auto_recharge_modify";
    var data = JSON.stringify({
        contractno: autoTopUp.contractno,
        bankAcco: card.bankAcco,
        bankNo: card.bankNo,
        mipApkind: '00',
        mipCycle: mipCycle,
        mipBuyday: mipBuyday,
        mipBuyAmt: Number(myMoney),
        mipDesc: remark
    });
    App.post(url, data, function() {
        App.bind("#btn-submit", "tap", submitModify)
    }, function(result) {
        App.setSession(App.serialNo_info, result.body.info);
        App.setSession(App.serialNo, result.body.serialNo);
        App.setSession(App.serialNo_success_show_data, data);
        App.setSession(App.serialNo_forword_url, "../account/setUpSuccess.html");
        App.setSession("risk_fundId",productId);
        if(productId == "A0081"){
        	App.setSession("fundRiskLevel","01");
        }
        window.location.href = "../common/setPassword.html"
    })
};

function queryAutoRechargePageInfo() {
    var data = JSON.stringify({
        mipcycle: getMipCycle(),
        mipbuyday: getMipBuyday(),
    });
    var url = App.projectNm + "/etrading/auto_recharge_page_info?date=" + (new Date()).getTime();
    App.post(url, data, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {
            $("#kkDate").html(body.shortRemark + '&nbsp;&nbsp;<img class="nextDates" style="vertical-align: middle;margin-top: -.1rem;"src="../images/point.png" alt="">');
            $("#nextRechargeDate").html(body.nextRechargeDate);
            App.bind(".nextDates", "tap", function() {
                alertTips2(body.redRemark, "text-left")
            })
        }
    })
}

function queryPayTreasureTips(amt){

    var url = "/mobile-bff/v1/fund/pay_treasure_tips?productId="+productId+"&amount="+amt+"&period="+getMipCycle()+"&r=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {
        	$("#dim").html(body.profitRemark+'&nbsp;<img style="vertical-align: middle;margin-top: -.1rem;" class="icon-i" src="../images/point.png" alt="">');
            App.bind(".icon-i", "tap", function() {
                alertTips2(body.supportRemark, "text-left")
            })
        }
    });
}
var contractList = {};
function queryCanRechargeProductList(){
    var url = "/mobile-bff/v1/fund/can_recharge_product_list?date=" + (new Date()).getTime();
    App.get(url, null, function(result) {
        var body = result.body;
        if (body != null && body != undefined) {
        	var htm = '<li class="title">'
            +'<span class="blue cancel">取消</span>'
            +'<span>选择转入产品</span>'
            +'<span class="blue done">完成</span>'
            +'</li>';
        	if(body.length > 0){
        		for(var k in body){
        			var item = body[k];
        			var url = '';
        			var itemId = item.productId;
        			contractList[itemId]= item.fundContractList;
        			if(item.productType == "1"){//基金
        				itemId = (item.jumpUrl).substr((item.jumpUrl).indexOf("fundId=")+7);
        				url = '../fund/steadyCombination.html?fundId='+itemId;
        				
        			}else if(item.productType == "2"){//组合
        				url = '../fundgroup/group_fund_details.html?groupId='+itemId;
        			}
        			var img = "../images/radio.png";
        			if(item.productId == productId){
        				img = "../images/active.png";
        				if(productId == "000330"){
        					productId = itemId;
				            var html = '<a href="http://static.99fund.com/mobile/agreement/auto_investment_agreement.html">《工资宝服务协议》</a>、';
	        			}else{
				            var html = '<a href="http://static.99fund.com/mobile/agreement/funds_group_agreement.html">《汇添富组合产品服务协议》</a>';
	        			}
    					
			            var readTxt = "";
			            var fundContractList = item.fundContractList;
			            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){
							$("#risk_list").html("");
							var html0 = '<p class="dim rules" ><img class="checkBox" id="isRead" src="../images/checkBox.png" alt="">我已同意';
							if(productId == "000330"){
							
								html0 += '<a href="http://static.99fund.com/mobile/agreement/auto_investment_agreement.html">《工资宝服务协议》</a>';
							}else{
								html0 += '<a href="http://static.99fund.com/mobile/agreement/funds_group_agreement.html">《汇添富组合产品服务协议》</a>';
							}
							$("#risk_list").html(html0);
							App.bind("#isRead","tap",function(){
								if ($(this).attr('src') === '../images/checkBox.png') {
									$(this).attr('src', '../images/checked.png')
										
									var contractLength = $("#risk_list").children("p").length;
									var chkCnt = 0;
									$("#risk_list").children("p").each(function(){
										if($(this).children("img").attr('src') == '../images/checked.png'){
											chkCnt+=1;
										}
									});
									
									if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
										$(".btn").css({'background-color':'#fd7e23'});
										App.unbind('.btn', "tap",submitCreate);
										App.bind('.btn', "tap",submitCreate);
									}else{
										App.unbind('.btn', "tap",submitCreate);
										$(".btn").css({'background-color':'#ddd6d6'});
									}
								} else {
									$(this).attr('src', '../images/checkBox.png')
									App.unbind('.btn', "tap",submitCreate);
									$(".btn").css({'background-color':'#ddd6d6'});
								}
							})
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
			                App.setSession("auto_agreementIds",listKey.join(','))
			            	}
							listKey.forEach(function (item0, index0) {
								console.log(1)
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
								        
								        if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
								        	$(".btn").css({'background-color':'#fd7e23'});
											App.unbind('.btn', "tap",submitCreate);
								        	App.bind('.btn', "tap",submitCreate);
								        }else{
								        	App.unbind('.btn', "tap",submitCreate);
								        	$(".btn").css({'background-color':'#ddd6d6'});
								        }
								    } else {
								        $(this).attr('src', '../images/checkBox.png')
								    	App.unbind('.btn', "tap",submitCreate);
								    	$(".btn").css({'background-color':'#ddd6d6'});
								    }
						        })
			                });
			                
			            }

        			}
        			htm+='<li class="fund">'
	                +'<div class="chk" pid="'+itemId+'" pnm="'+item.productName+'">'
	                    +'<img src="'+img+'" alt="">'
	                    +'<div>'
	                        +'<p>'+item.productName+'</p>'
	                        +'<p class="pt5" style="color: #666;">'+item.productDesc+'</p>'
	                    +'</div>'
	                +'</div>'
	                +'<span class="blue" class="detail" onclick="window.location=\''+url+'\'">'+item.jumpName+'</span>'
	            +'</li>';
        		}
            	$("#fund").html(htm);
            	
	            App.bind(".chk", "tap", function() {
			        $(this).find('img')
			            .attr('src', '../images/active.png')
			            .parents('.fund')
			            .siblings()
			            .find('img')
			            .attr('src', '../images/radio.png');
	            })

            }
            App.bind(".done","tap",function(){
            	$("#fund").children("li").each(function(){
            		if($(this).find("img").attr("src") != undefined && $(this).find("img").attr("src").indexOf("active") > -1){
			            productId = $(this).children("div").attr("pid");
			        	$("#productName").html($(this).children("div").attr("pnm"));
			        	var val =$('.inputMoney input').val();
			        	if(val != ""){
			        		queryPayTreasureTips(val);
			        	}
						if(productId == "A0081"){//特殊处理
							$(".btn").css({'background-color':'#ddd6d6'});
							$("#risk_list").html("");
							var html = '';
		                	html = '<p class="dim rules" ><img class="checkBox" id="isRead0" src="../images/checkBox.png" alt="">我已同意';
					        html += '<a href="http://static.99fund.com/mobile/agreement/funds_group_agreement.html">《汇添富组合产品服务协议》</a>';
							html += '</p>';
							$("#risk_list").append(html);

					        App.bind("#isRead0","tap",function(){
							    if ($(this).attr('src') === '../images/checkBox.png') {
							        $(this).attr('src', '../images/checked.png')
							        	
									var contractLength = $("#risk_list").children("p").length;
									var chkCnt = 0;
									$("#risk_list").children("p").each(function(){
										if($(this).children("img").attr('src') == '../images/checked.png'){
											chkCnt+=1;
										}
									});
							        
							        if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
							        	$(".btn").css({'background-color':'#fd7e23'});
										App.unbind('.btn', "tap",submitCreate);
							        	App.bind('.btn', "tap",submitCreate);
							        }else{
							        	App.unbind('.btn', "tap",submitCreate);
							        	$(".btn").css({'background-color':'#ddd6d6'});
							        }
							    } else {
							        $(this).attr('src', '../images/checkBox.png')
							    	App.unbind('.btn', "tap",submitCreate);
							    	$(".btn").css({'background-color':'#ddd6d6'});
							    }
					        })
						}else{
							productId = '000330';
						}
						var readTxt = "";
			            var fundContractList = contractList[productId];
			            console.log(contractList);
			            if (fundContractList != undefined && fundContractList != null && fundContractList.length > 0){

							$("#risk_list").html("");
							var html0 = '<p class="dim rules" ><img class="checkBox" id="isRead" src="../images/checkBox.png" alt="">我已同意';
							if(productId == "000330"){
								
								html0 += '<a href="http://static.99fund.com/mobile/agreement/auto_investment_agreement.html">《工资宝服务协议》</a>';
							}else{
								html0 += '<a href="http://static.99fund.com/mobile/agreement/funds_group_agreement.html">《汇添富组合产品服务协议》</a>';
							}
							$("#risk_list").html(html0);
							App.bind("#isRead","tap",function(){
								if ($(this).attr('src') === '../images/checkBox.png') {
									$(this).attr('src', '../images/checked.png')
										
									var contractLength = $("#risk_list").children("p").length;
									var chkCnt = 0;
									$("#risk_list").children("p").each(function(){
										if($(this).children("img").attr('src') == '../images/checked.png'){
											chkCnt+=1;
										}
									});
									
									if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
										$(".btn").css({'background-color':'#fd7e23'});
										App.unbind('.btn', "tap",submitCreate);
										App.bind('.btn', "tap",submitCreate);
									}else{
										App.unbind('.btn', "tap",submitCreate);
										$(".btn").css({'background-color':'#ddd6d6'});
									}
								} else {
									$(this).attr('src', '../images/checkBox.png')
									App.unbind('.btn', "tap",submitCreate);
									$(".btn").css({'background-color':'#ddd6d6'});
								}
							})
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
			                App.setSession("auto_agreementIds",listKey.join(','))
			            	}
							listKey.forEach(function (item0, index0) {
								console.log(11)
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
								        
								        if(Number($(".inputMoney input").val()) > 0  && (contractLength == chkCnt)){
								        	$(".btn").css({'background-color':'#fd7e23'});
											App.unbind('.btn', "tap",submitCreate);
								        	App.bind('.btn', "tap",submitCreate);
								        }else{
								        	App.unbind('.btn', "tap",submitCreate);
								        	$(".btn").css({'background-color':'#ddd6d6'});
								        }
								    } else {
								        $(this).attr('src', '../images/checkBox.png')
								    	App.unbind('.btn', "tap",submitCreate);
								    	$(".btn").css({'background-color':'#ddd6d6'});
								    }
						        })
			                });
			            }

			        	
	       			}
	       		});
            	$('.fundList').fadeOut("slow")
	        })
            App.bind(".cancel","tap",function(){
            	$('.fundList').fadeOut("slow")
	        })
        }
    })
}
        var chooseTime = {
            "MM": ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日", "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日"],
            "2W": ["周一", "周二", "周三", "周四", "周五"],
            "WW": ["周一", "周二", "周三", "周四", "周五"]
        };
        $("#appDate").click(function (event) {
            event.preventDefault();
            $(".choose-time").show();
            return false
        });
        $(".choose-time").click(function (event) {
            var li = $(event.target).parents("li");
            if (li.length == 0) {
                $(".choose-time").hide();
                return
            };
            if (!li.hasClass("on")) {
                li.addClass("on").siblings("li").removeClass("on");
                var time = chooseTime[li.attr("data-choose-time")],
                    str = "";
                for (var i = 0; i < time.length; i++) {
                    str += '<li class="bottom-border font-28" data-choose-time="' + (i + 1) + '"><div>' + time[i] + '<span class="annulus"></span></div></li>'
                };
                $(".choose-time2 ul").html(str);
                $("#appDate").attr("data-time", li.find("div").text())
            };
            $(".choose-time").hide();
            $(".choose-time2").show()
        });
        $(".choose-time2").click(function () {
            var li = $(event.target).parents("li");
            if (li.length == 0) {
                return
            };
            $("#appDate .date").text($("#appDate").attr("data-time") + li.find("div").text());
            $(this).hide()
        });



$('.checkBox').on('click', function () {
    if ($(this).attr('src') === '../images/checkBox.png') {
        $(this).attr('src', '../images/checked.png')
        if(Number($(".inputMoney input").val()) > 0 ){
        	$(".btn").css({'background-color':'#fd7e23'});
			App.unbind('.btn', "tap",submitCreate);
        	App.bind('.btn', "tap",submitCreate);
        }else{
        	App.unbind('.btn', "tap",submitCreate);
        	$(".btn").css({'background-color':'#ddd6d6'});
        }
    } else {
        $(this).attr('src', '../images/checkBox.png')
    	App.unbind('.btn', "tap",submitCreate);
    	$(".btn").css({'background-color':'#ddd6d6'});
    }
})
    $('.content .funds').on('click', function () {//弹窗
        $('.fundList').css('display', 'block')
    })
    $('.fundList .cancel').on('click', function () {//取消弹窗
        $('.fundList').css('display', 'none')
    })
	$('.fundList .done').on('click', function () {//取消弹窗
        $('.fundList').css('display', 'none')
    })
    $('.fundList .fund>div').on('click', function () {//选择基金
        $(this).find('img')
            .attr('src', '../images/active.png')
            .parents('.fund')
            .siblings()
            .find('img')
            .attr('src', '../images/radio.png')
    })
    $('.inputMoney .del').on('click', function () {//清空input
        $('.money input').val('')
        $('.chineseText span').text(changeNumMoneyToChinese(''))
    	App.unbind('.btn', "tap",submitCreate);
    	$(".btn").css({'background-color':'#ddd6d6'});
    })
    $('.inputMoney input').on('input', function () {//格式化input
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
			App.unbind('.btn', "tap",submitCreate);
	    	App.bind('.btn', "tap",submitCreate);
	    }else{
	    	App.unbind('.btn', "tap",submitCreate);
	    	$(".btn").css({'background-color':'#ddd6d6'});
	    }
        queryPayTreasureTips(val);
    })
queryAutoRechargePageInfo();
