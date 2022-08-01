document.addEventListener("touchstart", function(){}, true);
window.addEventListener('load', function() {
	if (typeof FastClick != 'undefined') {
		FastClick.attach(document.body);
	} else {
		alert("缺少加载 fastclick.js ");
	}
}, false);

var closeNumPop = function(popwrap,actNum,elem) {
	popwrap.removeClass("show");
	actNum.removeClass("act");
	elem.off(".closeNumPop");
};

$(function() {
	//--
	$("#engSendPop").on("touchmove",function(e) {
		$("html").on("touchmove", function(e) {
			e.preventDefault();
		});
		//e.stopImmediatePropagation
	}).on("click", function(e) {
		e.stopPropagation();
		$(this).removeClass('show');
		$("html").off("touchmove");
	}).on("click", ".engSendInnerWrap", function(e) {
		e.stopPropagation();
	}).on("click", '.engSendYesBtn', function(e) {
		$(document.getElementById('engSendPop')).removeClass('show');
		$("html").off("touchmove");
	});
	//--
	if (document.getElementById('numberPop') ) {
		var popwrap = $("#numberPop");
		var popIthem = popwrap.find(".numSelect");
		var numInputWrap = $(".engus_Num_Select_wrap");
		var numInputs = $('.innerNumber');
		var numFonts = $(".szft");
		
		numInputWrap.on("click", ".innerNumber", function(e) {
			e.stopPropagation();
			var _this =$(this);
			var _thisNum = _this.val();
			if (numInputs.filter(".act")[0] != _this[0]) {
				numInputs.filter(".act").next(".sznu").children('font').removeClass('act');
				numInputs.filter(".act").removeClass("act");
				_this.addClass("act");
				_this.next(".sznu").children('font').addClass("act");
			} else if (numInputs.filter(".act")[0] == _this[0]) {
				return;
			} else {
				this.addClass("act");
			}
			//--next if
			if (popwrap.filter(".show").length === 0 ) {
				popwrap.addClass("show");
				$('html').on("click.closeNumPop", function() {
					var _this = $(this);
					var _actNum = numInputs.filter(".act");
					closeNumPop(popwrap,_actNum,_this);
				});
			}
			popIthem.removeClass("act");
			popIthem.filter(function() {
				return $(this).attr('val') == _thisNum;
			}).addClass('act');
		});
		//-- next fn 
		$("#engSendBtn").click(function(e) {
			e.stopPropagation();
			var my_guess = $("#my_guess").text();
			if(my_guess == "0"){
				$(".engSendYesBtn").unbind("click");
				$(".ssf_2").show();
				$(".ssf_1").hide();
			}else{
				var nums = "";
				var numLength = numInputs.length;
				for (var i=0; i < numLength; i++ ) {
					nums = nums + numInputs.eq(i).val();
				}
				$(document.getElementById('egsdNum')).html(nums);
				$(".engSendYesBtn").bind("click",submitGuessResult);
				$(".ssf_2").hide();
				$(".ssf_1").show();
			}
			$(document.getElementById('engSendPop')).addClass("show");
		});
		
		popwrap.on("click", '.numSelect', function(e) {
			e.stopPropagation();
			var _this = $(this);
			var _text =_this.text();
			var inAct = numInputs.filter(".act");
			inAct.val(_text);
			inAct.parent().find("font").html(_text);
			//numInput
			popwrap.removeClass("show");
			inAct.removeClass("act");
			
		});	
	
	}


});