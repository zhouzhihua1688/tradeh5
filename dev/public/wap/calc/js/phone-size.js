
// 相对字体大小设置
var oHtml = document.documentElement;
getFont();
// window.onresize = function(){
//     getFont();
// }
window.addEventListener("resize", function(){
    getFont();
});
function getFont(){
    var screenWidth = oHtml.clientWidth;
    screenWidth = screenWidth > 640 ? 640 : screenWidth;
    oHtml.style.fontSize = screenWidth/(750/40)+'px';

}
