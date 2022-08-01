var temp = 0;
window.onscroll = function(){ 
	setBackOrNextBtn();
    if($(document).scrollTop() > temp){
    	$("#backDiv").hide("fade");
    	$("#nextDiv").hide("fade");
    }else{
    	$("#backDiv").show("fade");
    	$("#nextDiv").show("fade");
    }
    temp = $(document).scrollTop();
    
} ;

window.onload = function(){
	setBackOrNextBtn();
	$("#backDiv").show();
	$("#nextDiv").show();
};

function addLoadEvent(func) { 
	var oldonload = window.onload; 
	if (typeof window.onload != 'function') { 
		window.onload = func; 
	} else { 
		window.onload = function() { 
			oldonload(); 
			func(); 
		};
	} 
} 


function showBNDiv(){
	setBackOrNextBtn();
	$("#backDiv").show();
	$("#nextDiv").show();
};

addLoadEvent(showBNDiv);

function setBackOrNextBtn(){
    $("#backDiv").css("margin-top",$(document).scrollTop()+($(window).height()*0.7) - $("#nextDiv").height());
    $("#nextDiv").css("margin-top",$(document).scrollTop()+($(window).height()*0.7) - $("#nextDiv").height());
    $("#nextDiv").css("margin-left",$(document.body).width() - 40);
}

function backPage(){
	window.history.back();
}

function nextPage(){
	window.history.go(1);
}