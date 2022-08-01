/**
 * @date: 2021-01-18 17:28:14
 * @desc: 通用逻辑处理，调用之前必须已加载utils.js和jQuery等组件
 */


//  判断当前页面是否必须登录
try {
    console.log('window.needLoginFlag=', window.needLoginFlag);
    if(window.needLoginFlag && !utils.getCookie('sso_cookie')){
        utils.jumpLoginByChannelCode();
    }
} catch (error) {
    console.log('base.js error=', error);
    console.log('needLoginFlag不存在，当前页面初始load不需要登录态');
}




