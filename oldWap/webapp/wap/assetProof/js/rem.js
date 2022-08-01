'use strict';
	/* 动态换算rem和px值  */
	    var rem =10;
	    window.onload = function () {
	        changeW();
	        window.addEventListener('resize', changeW, false);
	        function changeW() {
	            rem = 10/ 320 * document.documentElement.clientWidth;
	            document.documentElement.style.fontSize = rem + 'px';
	        }
	        window.addEventListener('resize', changeW, false);
	    }

