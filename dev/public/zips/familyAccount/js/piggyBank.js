var memberId = utils.getUrlParam("memberId");  
var shareCode = utils.getUrlParam("shareCode");
var clickNum = 0;
var allAbstract = [];
var availableArticles = [];
var coinNumber = 0;
var articleUrl = '';
var memberNameDisplay = '';
var articleLength = 0;
var isBanner = false;
var memberCustNo = '';
var currentCustNo = '';

$(function () {
    getIncomeDetails();
    getWealthStory();
})

//获取财富故事
function getWealthStory() {
    var catalogId = '5214';
    var pageNo = '1';
    var pageSize = '1000';
    var url = '/cms-service/v1/fundarticles/catalog?catalogId='+ catalogId +'&pageNo='+ pageNo+ '&pageSize='+ pageSize;
    utils.get(url, null, function(result){
        if(result.body != undefined && result.body != null && result.returnCode == 0){
            availableArticles= result.body.filter(item=>item.articleStatus == 'N'&& item.brief && item.url);
            articleLength = availableArticles.length;

        }
        else{
            $('#showTips').hide();
        }
    })
}

function getRandomStory(){
    var index = Math.floor(Math.random()*articleLength);
    articleUrl = availableArticles[index].url;
    $('#abstract').html(availableArticles[index].brief);
}

//获取分享码
function getShareCode(){
    return new Promise((resolve, reject)=>{
        var url = '/sfs/v1/members/share';
        var data = {"memberId": memberId};
        utils.post(url, JSON.stringify(data), function(result){
            if(result.body != undefined && result.body != null && result.returnCode == 0){
                if(result.body.shareCode){
                    resolve (result.body.shareCode);
                }
            }
        })
    })
}

//查看团队成员资产及收益
function getIncomeDetails(){
    var url = '/sfs/v1/members/share?memberId=' + memberId + '&shareCode=' + shareCode;
    utils.get(url, null, function(result){
        if(result.body != undefined && result.body != null && result.returnCode == 0){
            var incomeDetails = result.body.incomeDetails;
            var asssetAmount = result.body.asssetAmount;
            if(result.body.memberInfo){
                if(result.body.memberInfo.memberNameDisplay){
                    memberNameDisplay = result.body.memberInfo.memberNameDisplay;
                    document.title = memberNameDisplay + '的存钱罐';
                }

                //在App环境判断登录用户和存钱罐主人是否是一个人
                if(isApp()){
                    utils.get("/icif/v1/custs/get-simple-by-cust-no" , null, function(res){
                        if(res.returnCode === 0 && res.body){
                            var body = res.body;
                            if(body.custNo){
                                currentCustNo = body.custNo;
                            }                        
                        }
    
                        if(result.body.memberInfo.custNo){
                            memberCustNo = result.body.memberInfo.custNo;
                            if(currentCustNo && currentCustNo != memberCustNo){
                                $('.share').show();
                            }
                        }
                        else{
                            if(currentCustNo){
                                $('.share').show();
                            }
                        }
                    })
                }

            }
            if(asssetAmount){
                $('#asssetAmount').html(formatMoney(asssetAmount));
            }
            var imgBottle =document.getElementById("bottle");
            //存钱罐里没钱
            if(asssetAmount == 0){
                //有收益
                if(incomeDetails!=null && incomeDetails!=undefined && incomeDetails.length!=0){
                    $('#banner').hide();

                    coinNumber = Math.min(incomeDetails.length,3);
                    for (var i=0;i<Math.min(incomeDetails.length,3);i++)
                    { 
                        $('#profit'+i).html(incomeDetails[i].yieldAmount>0 ? '+'+incomeDetails[i].yieldAmount : incomeDetails[i].yieldAmount);
                        $('#date'+i).html(formateDate(incomeDetails[i].yieldDate));
                        $('#incomeId'+i).html(incomeDetails[i].incomeId);
                        $('#money'+i).show();
                    }
                }
                //无收益
                else{
                    $('#coins').hide();
                    $('#banner').show();
                    $('#bannerMsg1').hide();
                    $("#bannerContent").css({"width":  "13rem"});
                    $('#asssetAmount').html(formatMoney(asssetAmount));
                }

                imgBottle.src = "img/bottle_04.png";
                
            }
            //存钱罐里有钱
            else{
                //有收益
                if(incomeDetails!=null && incomeDetails!=undefined && incomeDetails.length!=0){
                    $('#banner').hide();

                    coinNumber = Math.min(incomeDetails.length,3);
                    for (var i=0;i<Math.min(incomeDetails.length,3);i++)
                    { 
                        $('#profit'+i).html(incomeDetails[i].yieldAmount>0 ? '+'+incomeDetails[i].yieldAmount : incomeDetails[i].yieldAmount);
                        $('#date'+i).html(formateDate(incomeDetails[i].yieldDate));
                        $('#incomeId'+i).html(incomeDetails[i].incomeId);
                        $('#money'+i).show();
                    }
                }
                //无收益
                else{
                    $('#coins').hide();
                    $('#banner').show();
                    $('#bannerMsg2').hide();
                    $("#bannerContent").css({"width":  "12rem"});
                    $('#asssetAmount').html(formatMoney(asssetAmount));
                } 

                if(asssetAmount < 100){
                    imgBottle.src = "img/bottle_01.png";
                }else if(asssetAmount < 1000){
                    imgBottle.src = "img/bottle_02.png";
                }else if(asssetAmount>=1000){
                    imgBottle.src = "img/bottle_03.png";
                }
            } 


            //test
            // imgBottle.src = "img/bottle_03.png";
            // coinNumber = 3;
            // $('#money0').show();
            // $('#money1').show();
            // $('#money2').show();
            
        }
    })
}

// 分享链接
function shareUrl(){
    getShareCode().then(shareCode=>{
        console.log(shareCode);
        var currentUrl = window.location.href;
        currentUrl= removeShareCodeFromUrl(currentUrl);
        if(currentUrl.indexOf("?") != -1){
            currentUrl = currentUrl+ '&shareCode='+ shareCode;
        }else{
            currentUrl = currentUrl+ '?shareCode='+ shareCode;
        }
        console.log(currentUrl);
        var imgUrl = window.location.origin + '/activity-center/act-resources/pages/familyAccount/img/weixin.png'
        var shareInfo = {
            title: memberNameDisplay+ '，我在现金宝为你开启了亲情账户',
            content:'希望陪伴你快乐成长，点击看看吧',
            imageUrl: imgUrl,
            url: currentUrl
        };
        var shareIosInfo = {
            shareTitle: memberNameDisplay+ '，我在现金宝为你开启了亲情账户',
            shareContent:'希望陪伴你快乐成长，点击看看吧',
            sharePicUrl: imgUrl,
            jumpUrl: currentUrl
        };
        if (isIosApp()) {
            window.webkit.messageHandlers.callAppShare.postMessage(shareIosInfo);
        } else if (isAndroidApp()) {
            handler.callAppShare(JSON.stringify(shareInfo));
        }else if(utils.isWeixin()){
            wxShare(shareInfo.content,shareInfo.title,imgUrl);
        }    
    })
}

//url去掉shareCode参数
function removeShareCodeFromUrl(url) {
    return String(url).replace(/&shareCode=.*?(&|$)/ig, '$1').replace(/\?shareCode=.*?&/ig, '?').replace(/\?shareCode=.*?$/ig, '')
}

//去掉千分符
function delcommafy(num) {
    if (num != undefined) {
      num = num.toString();
      num = num.replace(/[ ]/g, ""); //去除空格  
      num = num.replace(/,/gi, '');
      return Number(num);
    }
    else {
        return num
    }
}

function formateDate(date){
    return '('+ date.substr(-4,2) + "." + date.substr(-2,2)+ ')';
}

function getNumber(num){
    if(num.indexOf("+") != -1){
        num = num.replace(/[+]/g,"");
    }
    return Number(num); 
}

//收金币
$(".money").click(function(){
    clickNum += 1;
    var coin = $(this).find('img');
    var id = coin[0].id.charAt(coin[0].id.length-1);
    $('#profit'+id).hide();
    $('#date'+id).hide();
    coin.css('animation', 'downMove 0.8s forwards');

    var oldAsssetAmount = delcommafy($('#asssetAmount').html());
    var profit = $('#profit'+id).html();
    var newAsssetAmount = oldAsssetAmount+ getNumber(profit);
    var incomeId =  $(this).find('div').eq(2).html();
    var countUp = new CountUp('asssetAmount', oldAsssetAmount, newAsssetAmount, 2, 1);
    countUp.start();

    var url = '/sfs/v1/members/view?incomeId='+ incomeId  + '&shareCode=' + shareCode;
    utils.get(url, null, function(result){
        if(result.returnCode == 0){
            if(clickNum == Math.min(3,coinNumber))
            {
                setTimeout(function(){
                    $('#banner').show();
                    $('#bannerMsg2').hide();
                    $("#bannerContent").css({"width":  "12rem"});
                    var abstract = $('#abstract').html();
                    if (abstract && articleLength >0){
                        getRandomStory();
                        $('#showTips').show(); 
                        $('#coins').hide();
                    } 
                }, 1200)
            }
        }   
    })
})


$("#banner").click(function(){
    isBanner = true;
    var abstract = $('#abstract').html();
    if (abstract && articleLength >0){
        getRandomStory();
        $('#showTips').show(); 
    }
})

$("#iKnow").click(function(){
    $('#showTips').hide();
    if(isBanner){
        $('#banner').hide();
    }
})

$("#gotoUrl").click(function(){
    if (isApp()) {
        window.location.href ='htffundxjb://action?type=url&link='+btoa(articleUrl);
      } else {
        window.location.href =articleUrl;
      }
})

$("#wealthClassroom").click(function(){
    window.location.href = '/activity-center/act-resources/pages/familyAccount/wealthClassroom.html';
})

$("#myAssets").click(function(){
    var tipsObjAsset = {
        content: "账户详情需要在现金宝app中查看哦",
        showCancel: true,
        confirmText: '立即前往',
        complete: function () {
            window.location.href = "https://www.99fund.com/m.htm";
        }
    };

    if(isApp()){
        window.location.href = "htffundxjb://action?type=familyAccount&subType=assetHome";
    }else{
        // utils.showTips(tipsObjAsset);
        if(utils.isProdEnv()) {
            window.location.href = 'https://app.99fund.com/tradeh5/newWap/familyAccount/home.html?fromPiggy=1';
        }else{
            window.location.href = 'http://appuat.99fund.com.cn:7081/tradeh5/newWap/familyAccount/home.html?fromPiggy=1';
        }
    }
})
