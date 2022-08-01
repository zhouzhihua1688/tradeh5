/*
* @Author: mazhuo
* @Date:   2021-09-07 15:13:01
* @Last Modified by:   mazhuo
* @Last Modified time: 2021-09-25 17:47:35
*/

    // var str='<div class="vote">'+
	   //          '<div class="first">'+
		  //           '<span class="buy">认购</span>'+
		  //           '<div class="bar">'+
		  //               '<div class="tiao"></div>'+
		  //           '</div>'+
		  //           '<span class="number"></span>'+
    //             '</div>'+
		  //       '<div class="second">'+
		  //           '<span class="nobuy">不认购</span>'+
		  //           '<span class="number"></span>'+
		  //           '<div class="bar">'+
		  //               '<div class="tiao progress"></div>'+
		  //           '</div>'+
		  //       '</div>'+
    //         '</div>'
            
// 未选择         
    var noStr='<div class="vote" style="padding:0.5rem 0rem">'+
                // '<p v-for="(item,index) in aa" :key="index">'+
                    // '<p v-for="(items,index) in item.optionList" :key="index">'
			            '<div class="first">'+
				            '<span class="buy"></span>'+
			            '</div>'+
			            '<div class="vs"></div>'+
				        '<div class="second">'+
				            '<span class="nobuy"></span>'+
				        '</div>'+
			        // '</p>'+
		        // '</p>'+
            '</div>' 
        
// 已选择的
    var selectStr='<div class="choiceVote" @click="choiceVote(index)">'+
	            '<div class="selectTip">'+
	                '<div class="active">已选 [会] ✓</div>'+
	                '<div>不会</div>'+  
	            '</div>'+
	            '<div class="select">'+
	                '<div class="first">80%</div>'+
	                '<div class="second">'+
	                    '<div class="left"></div>'+
	                    '<div class="right"></div>'+
	                '</div>'+
	                '<div class="four">20%</div>'+
	            '</div>'+
            '</div>' 
// 底部弹窗
    var popStr='<div class="layer0 animated slideInUp" id="layer0" style="display: none;">'+
		        '<div style="position: fixed;bottom:0px;display: block;width:17.25rem;padding:0 0.75rem">'+
		            '<div class="giftlist giftlist0">'+
		                '<a href="javascript:;">'+
		                    '<div class="noTips">取消投票</div>'+
		                '</a>'+
		            '</div>'+
		            '<div class="close" @click="close(index)">'+
		                '<a href="javascript:;" style="color:#0070fa;font-size:0.75rem">取消</a>'+
		            '</div>'+
		        '</div>'+
            '</div>'

	$(".noChoice").html(noStr);
    $(".choice").html(selectStr); 
    $(".pop").html(popStr); 

     $(function(){
	    xh();
	    xh2();
        $(".vote").click(function(event) {
        	$(".vote").hide();
        	$(".choiceVote").show();
        });
	    // 关闭弹窗
	    $(".close").click(function(event) {
	    	$("#layer0").hide()
	    });
	    $(".choiceVote").click(function(event) {
	    	$("#layer0").show()
	    });	     
	})


// 投票比对                        
    var i=40;
    var k=60;
    /*add——创建tbx下的div加文字和变宽度的方法*/
    function add(i,k){
        // var tbox =$(".bar");
        // var tiao =$(".tiao");
        // var progress =$(".progress");
        var second =$(".select .second");
        var left =$(".select .second .left");
        var right =$(".select .second .right");
        if(i>=100){
           left.css("width","100%").css('transition', '1s');
           $(".select .second .right").hide();
           $(".select .second .left").css({
               borderRight: 'none',
               borderRadius: '50px'
           });

           // $(".vote .first .number").html("100%");
        }else{
           left.css("width",i+"%").css('transition', '1s');
           // $(".vote .first .number").html(i+"%")
        }
        if(k>=100){
           right.css("width","100%").css('transition', '1s');
            $(".select .second .left").hide();
            $(".select .second .right").css({
               borderRight: 'none',
               borderRadius: '50px',
               marginLeft:'0.45rem'
           });
           // $(".vote .second .number").html("100%");
        }else{
           right.css("width",k+"%").css('transition', '1s');
           // $(".vote .second .number").html(k+"%")
        }
    }
    function xh(){
        if(i<=100||k<=100){
            var time=setTimeout("xh()",100)
            add(i,k);
           clearTimeout(time);          
        }            
    }




// 多选投票

   var moreStr='<div class="moreSelect">'+
            '<div class="list">'+
                '<div class="tiao one red">'+
                '</div>'+
                '<div class="text">基金经理</div>'+
                '<div class="tick">'+
                    '<span>基金经理</span>'+
                    '<span>60%</span>'+
                '</div>'+
            '</div>'+
            '<div class="list">'+
                '<div class="tiao two red"></div>'+
                '<div class="text">收益高</div>'+
                '<div class="tick">'+
                    '<span>收益高</span>'+
                    '<span>30%</span>'+
                '</div>'+
            '</div>'+
            '<div class="list">'+
                '<div class="tiao three grey"></div>'+
                '<div class="text">有钱途</div>'+
                '<div class="tick">'+
                    '<span>有钱途</span>'+
                    '<span>10%</span>'+
                '</div>'+
            '</div>'+
            '<div class="confirm">确认</div>'+
        '</div>'    
 
   $(".moreChoice").html(moreStr);   
        
       

        $('.moreSelect .list').unbind('click');
        $(".moreSelect .list").click(function(event) {
            // 选择框框列表
            if($(this).hasClass('moreActive')){
                $(this).removeClass('moreActive');
                $(".moreSelect .confirm").removeClass('confirmActive'); 
            }else{
               $(this).addClass('moreActive');
               $(".moreSelect .confirm").addClass('confirmActive'); 
            } 
            // 按钮样式添加和移除-confirmActive：都不选就没有样式
            if($('*').hasClass('moreActive')){
             $(".moreSelect .confirm").addClass('confirmActive');
             $(".moreSelect .confirm").text('投票')
            }else{
               $(".moreSelect .confirm").removeClass('confirmActive'); 
               $(".moreSelect .confirm").text('确认')
            } 
        });
        



// 投票比对                        
    var one=60;
    var two=30;
    var three=10;
    /*add——创建tbx下的div加文字和变宽度的方法*/
    function add2(one,two){
        var tiao =$(".moreSelect .list .one");
        var tiao1 =$(".moreSelect .list .two");
        var tiao2 =$(".moreSelect .list .three");

        if(one>=100){
           tiao.css("width","100%").css('transition', '1s');
       
        }else{
           tiao.css("width",one+"%").css('transition', '1s');
        }
         if(two>=100){
           tiao1.css("width","100%").css('transition', '1s');
           // $(".vote .first .number").html("100%");
        }else{
           tiao1.css("width",two+"%").css('transition', '1s');
           // $(".vote .first .number").html(i+"%")
        }
        if(three>=100){
           tiao2.css("width","100%").css('transition', '1s');
           // $(".vote .first .number").html("100%");
        }else{
           tiao2.css("width",three+"%").css('transition', '1s');
           // $(".vote .first .number").html(i+"%")
        }
    }
    function xh2(){
        if(one<=100||two<=100||three<=100){
            var time=setTimeout("xh2()",100)
            add2(one,two,three);
           clearTimeout(time);          
        }            
    }