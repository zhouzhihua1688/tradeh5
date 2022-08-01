require.config({
    baseUrl: "js/",
    urlArgs: getCookie("wapVersion"),
    paths: {
        jquery: "lib/jquery.min",
        stat:"lib/stat"
    },
    shim: {
        jquery: {
            exports: "jQuery"
        },
        jqueryhammer: ["jquery"]
    }
});
 
!function() {
    var a = {
    }, b = location.pathname, c = b.split(".")[0].split("/"), d = (c[1], c[c.length - 1]);
    if(c.length>4){
        require.config({
            baseUrl: "../js/"
        });
    }
    require(["stat"], function(e) {
        if(a[b] != null){
            require([a[b]], function(k) {
                !!k && k.init();
            });
        }
    });
}();

function getCookie(key){
	/*var allcookies = document.cookie;
	var cookies = allcookies.split(";");
	var returnVal = "";
	if(cookies != null || cookies != undefined)
		for(index in cookies){
			var cookieKV = cookies[index];
			if(cookieKV.indexOf(key+"=") > -1){
				var keyVal = cookieKV.split("=");
				returnVal = keyVal[1];
			}
		}
	return returnVal;*/return (new Date().getTime() / 10000).toFixed(0);
};