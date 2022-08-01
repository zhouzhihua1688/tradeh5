    $('.content header>div').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active')
        $('.fund').eq($(this).index()).addClass('active').siblings().removeClass('active')
    })
    var custNo = App.getCookie("sso_cookie_ext_dp");

    //持有
	function getHoldList(tp){
		App.get("/assetcenter/v1/asset/list?currencyType=156&assetType="+tp, null, function(result){
			if(result.body != undefined && result.body != null){
				var lists = result.body.assetList;
				var htm = '';
				if(lists != undefined && lists != "" && lists.length > 0){
					if(tp == "HUOBI"){
						if($.trim($("#hold").html()) != ""){
							htm+='<li style="background-color: #ebebeb;"></li>';
						}
						htm+='<li>'
			                +'<h2>基金名称</h2>'
			                +'<h2 class="center">万份收益</h2>'
			                +'<h2 class="worth">'
			                    +'<p>七日年化</p>'
			                +'</h2>'
			            +'</li>';
					}else{
						if(tp == "FINANCE" && $.trim($("#hold").html()) != ""){
							
						}else{
						htm+='<li>'
			                +'<h2>基金名称</h2>'
			                +'<h2 class="worth">'
			                    +'<p>净值</p>'
			                +'</h2>'
			            +'</li>';
			        	}
		            }
		            //去重数组
		            lists = unique(lists);
		            for(var k in lists){
		            	var item = lists[k];
		            	var cls = '';
		            	var show = '';
		            	var outStyle = {};
		            	if(tp == "FUND" || tp == "FINANCE"){
		            		outStyle = format(item.dailyGrowthRateDisplay,0);
		            		if(App.isEmpty(item.navDate) || item.navDate == "--"){
		            			outStyle["show"] = "--";
		            		}
		            	}else{
		            		outStyle = format(item.yield,100);
		            	}
		            	if(App.isNotEmpty(outStyle)){
		            		cls = outStyle["cls"];
		            		show = outStyle["show"];
		            	}
		            	if((item.fundType != "1" && (tp == "FUND" || tp == "FINANCE")) || (tp == "HUOBI")){
			            	htm+='<li onclick="gotoUrl(\''+item.fundId+'\')">'
				                +'<div class="left"><span>'+item.fundName+'</span><span class="grey">'+item.fundId+'</span></div>';
				            if(tp == "HUOBI"){
				            	htm+='<div class="center">'+App.formatMoney(item.incomeUnit,4)+'</div>';
				                htm+='<div class="right"><span class="'+cls+'">'+show+'</span><span class="grey">('+formatDate(item.navDate)+')</span></div>'
				           		+'</li>';
				            }else{
				                htm+='<div class="right"><span>'+App.formatMoney(item.nav,4)+'</span><span class="'+cls+'">'+show+'</span><span class="grey">('+formatDate(item.navDate)+')</span></div>'
				           		+'</li>';
				           	}
			           	}
		            }
		            if(tp =="HUOBI"){
		            	if($.trim($("#hold").html()) != ""){
		            		$("#hold").append(htm);
		            	}else{
		            		$("#hold").html(htm);
		            	}
		            }else if(tp == "FINANCE"){
		            	getHoldList("HUOBI");
		            	if($.trim($("#hold").html()) != ""){
		            		$("#hold").append(htm);
		            	}else{
		            		$("#hold").html(htm);
		            	}
		            }else{
		            	getHoldList("FINANCE");
		            	$("#hold").html(htm);
		            }
				}else{
					if(tp == "FUND"){
						getHoldList("FINANCE");
					}else if(tp == "FINANCE"){
						getHoldList("HUOBI");
					}
				}
			}
		});
	}
	
    //自选
	function getOptionList(){
		App.get("/mobile-bff/v1/concern/queryMyOptional", null, function(result){

			if(result.body != undefined && result.body != null){
				var fundLists = result.body.fundList;
				var currencyLists = result.body.currencyList;
				var htm = '';
				if(fundLists != undefined && fundLists != ""){
					htm+='<li>'
		                +'<h2>基金名称</h2>'
		                +'<h2 class="worth">'
		                    +'<p>净值</p>'
		                +'</h2>'
		            +'</li>';
		            for(var k in fundLists){
		            	var item = fundLists[k];
		            	var cls = '';
		            	var show = '';
		            	var outStyle = {};
		            	outStyle = format(item.quoteChange,0);
		            	if(App.isNotEmpty(outStyle)){
		            		cls = outStyle["cls"];
		            		show = outStyle["show"];
		            	}
		            	htm+='<li onclick="gotoUrl(\''+item.fundId+'\')">'
			                +'<div class="left"><span>'+item.fundNm+'</span><span class="grey">'+item.fundId+'</span></div>'
			                +'<div class="right"><span>'+App.formatMoney(item.nav,4)+'</span><span class="'+cls+'">'+show+'</span><span class="grey">('+formatDate(item.navDt)+')</span></div>'
			           		+'</li>';
		            }
				}
				if(currencyLists != undefined && currencyLists != ""){
					htm+='<li style="background-color: #ebebeb;"></li><li>'
		                +'<h2>基金名称</h2>'
		                +'<h2 class="center">万份收益</h2>'
		                +'<h2 class="worth">'
		                    +'<p>七日年化</p>'
		                +'</h2>'
		            +'</li>';
		            for(var m in currencyLists){
		            	var item = currencyLists[m];
		            	var cls = '';
		            	var show = '';
		            	var outStyle = {};
		            	outStyle = format(item.yield,0);
		            	if(App.isNotEmpty(outStyle)){
		            		cls = outStyle["cls"];
		            		show = outStyle["show"];
		            	}
		            	htm+='<li onclick="gotoUrl(\''+item.fundId+'\')">'
			                +'<div class="left"><span>'+item.fundNm+'</span><span class="grey">'+item.fundId+'</span></div>'
			                +'<div class="center">'+App.formatMoney(item.income,4)+'</div>'
			                +'<div class="right"><span class="'+cls+'">'+show+'</span><span class="grey">('+formatDate(item.navDt)+')</span></div>'
			           		+'</li>';
					}
				}
				$("#option").html(htm);
			}
		});
	}
	
	function format(v,p){
		styleArr = {};
    	if(App.isNotEmpty(v)){
    		if(p > 0){
    			v = v*p;
    		}
    		v = App.formatMoney(v,2)
        	if(String(v).indexOf('-') > -1){
        		styleArr["cls"] = 'green';
        		styleArr["show"] = v+'%';
        	}else{
        		styleArr["show"] = '+'+v+'%';
        		styleArr["cls"] = 'red';
        	}
    	}else{
    		styleArr["show"] = '--';
    	}
    	return styleArr;
	}
	function formatDate(d){
		if(App.isEmpty(d) || d == "--"){
			return '--';
		}else{
			return d.substr(4,2) + "." + d.substr(-2,2);
		}
	}
	function gotoUrl(id){
		var id = id.replace(" ",'');
		if(id == "000330"){
			window.location = '../account/xjb_index.html';
		}else{
			window.location = '../fund/steadyCombination.html?fundId='+id;
		}
	}
	
	function unique(arr){
		var newArr = [];
		var newArr2 = [];
		for(var m=0;m<arr.length;m++){	
			if(newArr.indexOf(arr[m].fundId) == -1){
				newArr.push(arr[m].fundId);
				newArr2.push(arr[m]);
			}
		}
		return newArr2;
	}
	
	
	if(HTF.isWeixin()){
        var code = HTF.getUrlParam("code");
        var ssoCookie = HTF.getCookie("sso_cookie");
        if (HTF.isNotBlank(ssoCookie)) {
            // ssoCookie存在，已登录状态，无需处理code
            // 业务逻辑ajax请求正常处理对应（带着sso_cookie）
			getOptionList();
			getHoldList("FUND");
        } else {
        	if(HTF.isNotBlank(code)) {
	            HTF.codeLoginRequest(code);
			}else{
				HTF.getCode();
			}
        }
	}else{
		getOptionList();
		getHoldList("FUND");
	}
	