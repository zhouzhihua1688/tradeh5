//将参数存入数组
var fundList = App.getUrlParam("fundList");
var totalAmt = App.getUrlParam("totalAmt");

var fundArr = fundList.split(",");
var percent = parseInt(100/fundArr.length);//基础占比
var percent0 = ''; //首位占比
if(parseInt(percent * fundArr.length) < 100){
	percent0 = 100 - percent * (fundArr.length - 1);
}else{
	percent0 = percent;
}
var percentMoney = parseInt(totalAmt/fundArr.length);//基础占比
var percentMoney0 = ''; //首位占比
if(parseInt(percentMoney * fundArr.length) < totalAmt){
	percentMoney0 = totalAmt - percentMoney * (fundArr.length - 1);
}else{
	percentMoney0 = percentMoney;
}



$(function () {
	//取出定投列表数据
	var initBatchSetData = App.getSession("batchSetData");
	var curUrl = window.location.href;
	if(curUrl.indexOf('edit') > -1 && initBatchSetData && initBatchSetData.length > 0){//修改数据 
		showInit(initBatchSetData);
	}else{
		queryInfo();
	}
	
    $(".Bomb-box-ok").click(function () {
        $(this).parent().parent().hide();
    });
    $(".Bomb-box-2").click(function () {
        $(this).parent().parent().parent().hide();
    });


});
	//展示session中的数据
	function showInit(initBatchSetData){

		var htm = '';
		initBatchSetData.forEach(function(item,index){
				htm+='<div class="group ">'
					+'<div class="group-content clearfix">'
						+'<p class="col-6 text-left '+item.fundId+'_fundNm">'+fmtName(item.fundNm)+'</p><p class="col-4 text-right '+item.fundId+'_fundMoney">'+formatMoney(item.fundMoney)+'</p><p class="col-2 text-right"><span class="margin-R30 modifyData" onclick="modify(this)" id="'+item.fundId+'" data-limit="'+item.minMipAmt+'">'+item.percent+'</span></p>'
					+'</div>'
					+'<div class="group-desc">'
						+'<p class="text-left"><span>费率：</span><span class="'+item.fundId+'_fee1"></span>&nbsp;&nbsp;'+
						'<span class="'+item.fundId+'_fee2"></span><span class="'+item.fundId+'_fee3"></span></p>'
					+'</div>'
				+'</div>';
			
		})
		$(".box2").html(htm);

		//批量查询基金费率
		utils.post('/mobile-bff/v1/fund/batch-fund-fee',JSON.stringify({"fundFeeReqList":utils.getSession('fundFeeReqList')}), function(result2){
			if (result2.body != undefined && result2.body != null){
				var resList = result2.body;	
				for(var index in resList){
					var item = resList[index];
				$("."+index+'_fee1').html(item.rate);
				$("."+index+'_fee2').html(item.uRate);

				$("."+index+'_fee3').html('('+item.discountFee+'元 省了'+item.fee+'元)');
				};
			}

		});
	}

    //批量查询基金信息
    function queryInfo(){
		
		var url = '/mobile-bff/v1/fund/detailInfo';
		// var url2 = '/mobileEC/services/fund/fund_fee';
		var htm = '';
		for(var k = 0;k < fundArr.length; k++){
			htm+='<div class="group ">'
				+'<div class="group-content clearfix">'
					+'<p class="col-6 text-left '+fundArr[k]+'_fundNm"></p><p class="col-4 text-right '+fundArr[k]+'_fundMoney"></p><p class="col-2 text-right"><span class="margin-R30 modifyData" onclick="modify(this)" id="'+fundArr[k]+'">%</span></p>'
				+'</div>'
				+'<div class="group-desc">'
					+'<p class="text-left" ><span>费率：</span><span class="'+fundArr[k]+'_fee1"></span>&nbsp;&nbsp;<span class="'+fundArr[k]+'_fee2">'+'</span><span class="'+fundArr[k]+'_fee3"></span></p>'
				+'</div>'
			+'</div>';
			//查询基金信息
			utils.post(url,JSON.stringify({"fundId": fundArr[k]}), function(result){
				if (result.body != undefined && result.body != null){
					var body = result.body;	

					$("."+body.fundId+'_fundNm').html(body.fundNm);
					$("."+body.fundId+'_fundMoney').html((body.fundId == fundArr[0] ? formatMoney(totalAmt-(fundArr.length*percentMoney) +percentMoney)  : formatMoney(percentMoney)));
					$("#"+body.fundId).html((body.fundId == fundArr[0] ? percent0 : percent)+'%');
					$("#"+body.fundId).attr("data-limit",body.minMipAmt)
					//查询基金费率
					var url2 = "/mobile-bff/v1/fund/fund-fee?subAmt="+ Number($("."+body.fundId+'_fundMoney').html().replace(/,/g,'')) + "&fundId="+ body.fundId + "&cashFrm=V&bankNo=''&shareType=A"
					// var data = {"subAmt": Number($("."+body.fundId+'_fundMoney').html().replace(/,/g,'')), "fundId": body.fundId, "cashFrm": "V", "shareType": "A", "bankNo": ""};

					utils.get(url2, function(result2){
						if (result2.body != undefined && result2.body != null){
							var body2 = result2.body;	
							
							$("."+body.fundId+'_fee1').html(body2.rate);
							$("."+body.fundId+'_fee2').html(body2.uRate);
	
							$("."+body.fundId+'_fee3').html('('+body2.discountFee+'元 省了'+body2.fee+'元)');
						
						}

					});
				
				}

			});
						
		};
		$(".box2").html(htm);
    }
   
    
    //输入框
    // 修改数据
 $(".modify-input input").on('input',function(){
	var val = $(this).val();
	if(!val){
		val = 0;
	}
	
	val = Number(parseInt(val));
	
	//不能输入小数
	if(val > 100){
		$(".modify-input input").val(100);
	}else{
		$(".modify-input input").val(val);
	}
	

 }) 
 function modify(v){
 	 $("#modify").attr("data",$(v).attr("id"));
 	 $(".modify-input input").val($(v).text().replace('%',''))
 	 $("#modify").show();
 	 $(".mask").show();
 }
 var dataIndex='';
 $('.modifyData').on('click',function(){
     dataIndex=$(this).attr('data-index');
     $(".modify-input input").val($(this).text().replace('%',''))
     $("#modify").show();
    $(".mask").show();
 })
 $("#modify .fl").on('click',function(){
	$("#modify").hide();
	$(".mask").hide();  
 })
 $("#modify .fr").on("click",function(){
 	 	var data = $(this).parent().parent("div").attr("data");
		var curPercent = $(".modify-input input").val();
        
		var curMoney = (totalAmt*curPercent)/100;
		if((curPercent > 0) && (Number(curMoney) < Number($('#'+data).attr('data-limit')))){
			alertTips('当前金额小于本基金起投金额，请重新设置');
			return;
		}else{
			$("."+data+'_fundMoney').html(formatMoney( curMoney));
			$('#'+data).text(curPercent+'%');
			$("#modify").hide();
			$(".mask").hide();  
			//计算总占比
			var total_per = 0;
			$(".modifyData").each(function(){
				var new_per = parseInt($("#"+$(this).attr("id")).text().replace('%',''));
				$("."+$(this).attr("id")+"_fundMoney").html(formatMoney(new_per*totalAmt/100) );
				total_per+= new_per;
			});
			$("#select_per").val(total_per);
		}
 })
    
   
    $(".close_tip").click(function(){
       
        $(this).parents(".tip").hide();
        $(this).parents(".tip2").hide();
    })

   
    $(".Bomb-box-ok").click(function () {
        $(this).parent().parent().hide();
    });
    $(".Bomb-box-2").click(function () {
    	$(this).parent().parent().hide();
        $(this).parent().parent().parent().hide();
    });



$("#btn-submit").click(function(){
	purchase()
});

function purchase() {

	if(parseInt($("#select_per").val()) < 100){
		alertTips("配比不足100%");
		return;
	}
	if(parseInt($("#select_per").val()) > 100){
		alertTips("配比已超过100%");
		return;
	}
	var fundNameStr = '';
	var isCanContinue = false;
	var noFund = '';
	//组装数据
	var batchSetData = [];//批量基金配比数组
	var fundPayInfos = [];//创建批量定投入参数组
	var fundFeeReqList = [];//批量查询费率数组
	fundArr.forEach(function(item,index){
		var fundItem = {};
		var fundItem2 = {};
		var fundItem3 = {};
		fundItem.fundId = item;
		fundItem.fundNm = $("."+item+"_fundNm").html();
		fundItem.percent = $("#"+item).text();
		fundItem.fundMoney = $("."+item+"_fundMoney").html().replace(/,/g,'');
		fundItem.minMipAmt = $("#"+item).attr('data-limit');
		
		batchSetData.push(fundItem);
		
		fundItem2.shareType = 'A';
		fundItem2.payAmt = fundItem.fundMoney;
		fundItem2.productId = item;
		fundPayInfos.push(fundItem2);
		
		
		fundItem3.shareType = 'A';
		fundItem3.subAmt = fundItem.fundMoney;
		fundItem3.fundId = item;
		fundItem3.cashFrm = 'V';
		fundItem3.bankNo = '';

		fundFeeReqList.push(fundItem3);
		
		if(index == 0){
			fundNameStr+=fundItem.fundNm;
		}else{
			fundNameStr+='、'+fundItem.fundNm;
		}

		if((fundItem.percent.replace('%','') > 0) && (Number(fundItem.fundMoney) < Number(fundItem.minMipAmt))){
			isCanContinue = true;
			noFund = fundItem.fundNm;
		}
		
	});

	if(isCanContinue){
		alertTips(noFund+",基金起投金额小于本基金起投金额，请重新设置");
		return;
	}
	//存入session
	App.setSession("fundNameStr",fundNameStr);
	App.setSession("batchSetData",batchSetData);
	App.setSession("fundPayInfos",fundPayInfos);
	App.setSession("fundFeeReqList",fundFeeReqList);
	var curUrl = window.location.href;
	window.location.href=curUrl.replace('batchMipList','batchMip');
}

function alertTips(tips) {
    $(".Bomb-box .Bomb-box-main .Bomb-box-content p").html(tips);
    $(".Bomb-box").show();
}


$(".close_tip").click(function () {
    $(this).parents(".tip").hide();
    $(this).parents(".tip2").hide();
});
