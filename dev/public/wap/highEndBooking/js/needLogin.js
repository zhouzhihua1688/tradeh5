/**
 * @date: 2021-01-18 01:40:09
 * @desc: 当前页面必须要有对应登录态cookie才可以访问，如果没有则跳转去授权获取
 */


// 
// document.write('<div>aaaaaaaaaa</div>');

// 设置需要登录flag
window.needLoginFlag = true;

// 判断utils.js是否已添加
// if(window.utils === undefined){
//     console.log('utils.js未添加，动态添加utils.js');
//     // 即为utils.js中的addScript函数内容
//     // var script = document.createElement('script');
//     // script.setAttribute('type','text/javascript');
//     // script.setAttribute('src', '/tradeh5/newWap/base/js/utils.js');
//     // document.getElementsByTagName('head')[0].appendChild(script);

    
//     var needLoginFlag = true;
//     document.write('<script src="/tradeh5/newWap/base/js/utils.js"></script>');

//     console.log(window.utils === undefined);
//     console.log('utils.js加载完毕');
// }


// 判断是否有sso_cookie
// console.log((utils.getCookie('sso_cookie')));
// if(!utils.getCookie('sso_cookie')){
//     console.log('sso_cookie不存在');
//     // 按渠道跳转
//     utils.jumpLoginByChannelCode();
// } else {
//     window.needLoginFlag = false;
// }
