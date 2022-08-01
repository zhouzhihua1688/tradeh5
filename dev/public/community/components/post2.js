(function (newStyle) {
    let styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        styleElement.textContent = newStyle;
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

}(`
@media only screen and (-webkit-min-device-pixel-ratio: 2.0) {
    .border-top.border-bottom::after, .border-bottom::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
}
/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
    .border-top.border-bottom::after, .border-bottom::after {
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
    }
}
[v-cloak] {
    display: none;
}
video::-webkit-media-controls-fullscreen-button {            
    display: none;
}
.sub-content{
    padding: .75rem;
}
.sub-header .uicon{
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 0.1px #dddddd solid;
    margin-right: .5rem;
    margin-top: 3px;
}
.sub-header .uinfo .uinfo-t span,.sub-header .uinfo .uinfo-t i{
    vertical-align: middle;
}
.sub-header .uinfo .uinfo-t .uname{
    color: #000;
    font-size: .7rem;
}
.sub-header .uinfo .uinfo-t .uicon-s{
    display: inline-block;
    width: .75rem;
    height: .75rem;
    background: url('./img/v.png') no-repeat;
    background-size: cover;
}
.sub-header .uinfo .uinfo-t .utag{
    display: inline-block;
    padding: .05rem .375rem;
    height: .75rem;
    line-height: .75rem;
    background-color: #ffefef;
    color: #fb5c5f;
    font-size: .6rem;
    border-radius: .375rem;
    margin-left: .25rem;
}
.sub-header .uinfo .uinfo-b{
    font-size: .6rem;
}
.sub-header .relation{
    font-size: .7rem;
    color: #fb5c5f;
}
.sub-header .relation.followed{
    color: #999;
}
.sub-tag{
    padding-bottom: .75rem;
}
.sub-tag a{
    color: #148ce6;
    font-size: .75rem;
}
.sub-content{
    background: #fff;
}
.sub-header {
    margin-bottom: .75rem;
}
.sub-block{
    /* margin-bottom: .5rem;*/
    /* 9534 */
    /* border-bottom: 10px solid #eee; */
}
.article-attach {
    margin-top: 20px;
    margin-bottom: 15px;
}
.attachList {
    display: flex;
    align-items: center;
    vertical-align: middle;
    background-color: rgb(246, 246, 246);
    height: 50px;
    width: 100%;
}
.attachName{
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
    word-break: break-all;
    color: #000;
    font-size: 0.65rem;
    margin-left: 10px;
    margin-right: 10px;
}
.sub-content article{
    position: relative;
}
.sub-content article .article-t{
    font-size: .85rem;
    color: #000;
    font-weight: bold;
    margin-bottom: 0.5rem;
}
.article-t{
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
    word-break: break-all;
}
.sub-content article .article-c{
    font-size: .7rem;
    color: #000;
    display:-webkit-box;
    -webkit-line-clamp:5;
    -webkit-box-orient:vertical;
    overflow:hidden;
    word-break: break-all;
    margin: .25rem 0;
    white-space: break-spaces;
}
.sub-content article .article-c span:nth-of-type(2){
    color: #148ce6;
}
.sub-content article .article-img{
    display: flex;
    /* justify-content: space-between; */
    justify-content: normal;
    flex-wrap:wrap;
    padding-top:.5rem; 
 }
.sub-content article .article-img .multipleDiv{
    position: relative;
    width:31%;
    height: 5.5rem;
    border-radius: .2rem;
    overflow: hidden;
    margin-left: 0.25rem
}
.sub-content article .article-img>div:first-child {
    margin-left: 0
}
.sub-content article .article-img img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.sub-content article .article-img div.active:after{
    content: attr(data-content);
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 5.5rem;
    background-color: rgba(0, 0, 0, .5);
    z-index: 10;
    color: #fff;
    font-size: 1.25rem;
    border-radius: .2rem;
    text-align: center;
    line-height: 5.5rem;
}
.sub-content article .article-fundtag{
    margin-top: .25rem;
    line-height: 1.5;
    
}

.sub-content article .article-fundtag a{
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: .05rem .5rem;
   
    margin: 0.25rem 0 0;

    background-color: #f3faff;
    border-radius: .75rem;
    word-break: break-all;
    font-size: .6rem;
}
/* .sub-content article .article-fundtag i,.sub-content article .article-fundtag span{
    vertical-align: middle;
} */
.sub-content article .article-fundtag i{
    display: inline-block;
    width: .325rem;
    height: .5rem;
    background: url("./img/arrow-l.png") no-repeat;
    background-size: 100% 100%;
    margin-left: .25rem;
}
.sub-content article .article-handle{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:.25rem 1.25rem 0 1.25rem;
    font-size: .65rem;
}
.sub-content article .article-handle>p>i{
    display: inline-block;
    width: .75rem;
    height: .75rem;
    vertical-align: middle;
}
.sub-content article .article-handle>p>span{
    vertical-align: middle;
}
.sub-content article .article-handle p:nth-of-type(1).active{
    color: #fb5c5f;
}
.sub-content article .article-handle p:nth-of-type(1) i{
    background: url("./img/zan.png") no-repeat;
    background-size: 100% 100%;
    margin-top: -1px;
}
.sub-content article .article-handle p:nth-of-type(1).active i{
    background: url("./img/zan-chose.png") no-repeat;
    background-size: 100% 100%;
}
.sub-content article .article-handle p:nth-of-type(2) i{
    background: url("./img/comment.png") no-repeat;
    background-size: 100% 100%;
}
.sub-content article .article-handle p:nth-of-type(3) i{
    width: .9rem;
    background: url("./img/favorite.png") no-repeat;
    background-size: 100% 100%;
}
.sub-content article .article-handle p:nth-of-type(3).active i{
    background: url("./img/favorite-c.png") no-repeat;
    background-size: 100% 100%;
}
.sub-content article .article-handle p:nth-of-type(4) span{
    display: block;margin-top: -2px;
}
.sub-content article .article-handle p span i{
    width: 3px; height: 3px; background: #666666; border-radius: 50%;display: inline-block;margin-right: 2px;
}
.sub-content article .pop-list{
    /* height: 7rem; */
    font-size: .7rem;
    width: 5.5rem; background: #FFFFFF; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); border-radius: .2rem;
    position: absolute; right: 1rem; padding-left: .75rem; z-index: 1001;
}
.pop-triangle-up{
    z-index: 1002; width: 0; height: 0; position: absolute; top: -.25rem; right: 0.25rem;
    border-left: .25rem solid transparent;
    border-right: .25rem solid transparent;
    border-bottom: .25rem solid #fff;
}
.sub-content article .pop-list ul{
    display: flex; flex-direction: column; justify-content: center; align-items: center;
}
.sub-content article .pop-list li{
    line-height: 2.25rem; width: 4.75rem;
    border-bottom: 1px solid #EEE;
}
.sub-content article .pop-list li:last-child{
    border-bottom: none;
}
.sub-content article .pop-list li i{
    display: inline-block; width: .9rem; height: .75rem; vertical-align: middle; margin-right: .5rem;
}

.sub-content article .pop-list li:nth-of-type(1) i{
    background: url("./img/report.png") no-repeat; background-size: 100% 100%;
}
.sub-content article .pop-list li:nth-of-type(2) i{
    background: url("./img/delete.png") no-repeat; background-size: 100% 100%;
}
.pop-list-back {
    position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, .7); z-index: 1000;
}
.sub-comment{
    padding: .75rem;
    /* 9534*/
    
    border-top: 1px solid #eee;
    font-size: .65rem;
    background: #fff;
}
.sub-comment .comment-list{
    line-height: 1.5;
    word-break: break-all;
}
.sub-comment .comment-list .uname{
    color: #148ce6;
}
.sub-comment .comment-list .ucomment{
    color: #000;
}
.sub-comment input::placeholder{
    color: #999;
}
.sub-comment .comment-list{
    margin-bottom: .75rem;
}
.sub-comment .comment-list li{
    margin-bottom: .5rem;
}
/* .sub-comment input{
    width: 100%;
    box-sizing: border-box;
    background-color: #f6f6f6;
    color: #000;
    padding: .75rem;
    border-radius: .75rem;
    margin-top: .5rem;
    outline: none;
} */
.submit{
    display: flex;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;
    box-sizing:border-box;
    align-items: center;
}

.submit input{
    flex: 1;
    box-sizing: border-box;
    background-color: #f6f6f6;
    color: #000;
    padding: .75rem;
    border-radius: .75rem;
    outline: none;
    margin-top: 0;
    font-size: .65rem;
}

.submit span{
    margin-left: .75rem;
    font-size: .75rem;
    color: #148ce6;
}
/* 回复弹窗样式 */
.recomment{
    width: 100%;
    height: 90%;
    background-color: #fff;
    border-radius: 1rem 1rem 0 0;
}
.recomment-t{
    position: relative;
    font-size: .85rem;
    text-align: center;
    line-height: 2.5rem;
    border-bottom: 1px #eee solid;
}
.recomment-t i{
    position: absolute;
    left: .75rem;
    top: .75rem;
    width: .55rem;
    height: .9rem;
    background: url('./img/back.png') no-repeat;
    background-size: 100% 100%;

}
.recomment-c{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #f6f6f6;
    /* margin-bottom: 5rem; */
}
.recomment-content{
    padding: 1.25rem .75rem .75rem .75rem;
    background-color: #fff;
}
.recomment-content .re-user,.list-user {
    display: flex;
    align-items: center;
}
.recomment-content .re-user img,.list-user img{
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0;
    border-radius: 50%;
    margin-right: .5rem;
}
.recomment-content .re-user span,.list-user span{
    font-size: .7rem;
    color: #000;
}
.recomment-content .re-summery,.list-summery{
    padding: .5rem 0;
    font-size: .7rem;
}
.recomment-content .re-time,.list-time{
    font-size: .6rem;
    color: #666;
}
.recomment-count{
    line-height: 1.75rem;
    padding: 0 .75rem;
    font-size: .7rem;
    color: #666;
}
.recomment-list{
    background-color: #fff;
    padding-left: .75rem;
}
.recomment-list .list-content{
    padding: .75rem .75rem .75rem 0;
    border-bottom: 1px solid #eee;
}
.recomment-bottom{
    background-color: #f6f6f6;
    height: 8rem;
}
.recomment-flex{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: .5rem 0;
    border-top: 1px #eee solid;
    text-align: center;
}
.recomment-flex input{
    width: 92%;
    box-sizing: border-box;
    background-color: #f6f6f6;
    color: #000;
    padding: .75rem;
    border-radius: .75rem;
    outline: none;
}
.enlarge-img{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .9);
    z-index: 99999999999;
    overflow-y: auto;
}
.enlarge-img img{
    width: 100%;
    margin:auto;
}
.reloading{
    display: flex;
    width: 100%;
    font-size: .6rem;
    justify-content: center;
    align-items: center;
    padding-bottom: .5rem;
}
.reloading p{
    margin-left: .5rem;
}
.post-swiper{
    width: 100%;
    height: 100%;
}
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
    top: 50px;
    bottom:auto,
    color: #fff;
}



.swiper-pagination-customs {
    width: .25rem;
    height:.25rem;
    border-radius: 50%;
    display: inline-block;
    background: #dddddd;
    margin: 0 .25rem;
}

.swiper-pagination-customs-active {
    width: .5rem;
    height:.25rem;
    border-radius: .125rem;
    display: inline-block;
    background-color: #f85d63;
}
.detail-slide {
    display: flex;
    justify-content: center;
    height: 100%;
    overflow-y:auto ;
}
#wrap .openWay {
    background-color: #fff;
    }

    #wrap .openWay img {
    width: 0.8rem;
    margin: 0.06666667rem 0 0 0.42666667rem;
    }
    #wrap .openWay button {
    float: right;
    height: 0.66666667rem;
    background-color: #ff7500;
    border: 1px solid #ff7500;
    color: #fff9fb;
    outline: none;
    border-radius: 2px;
    font-size: 0.21333333rem;
    margin: 0.22666667rem 0.42666667rem 0 0;
    }
    #wrap .videoImage{
        position: relative;
        width: 100%;
        height: 200px;
    }
    #wrap .videoImage img.playButton{
        position: absolute;
        margin: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 30px;
    }
    #wrap .videoImage img{
        width: 100%;
        height: 200px;
    }
    #wrap .video1{
        display: none;
    }
    #wrap .video,
    #wrap .video video {
    width: 100%;
    }

    video {
    object-fit: fill;
    }
    .vjs-paused .vjs-big-play-button,
    .vjs-paused.vjs-has-started .vjs-big-play-button {
    display: block;
    }
    .vjs-default-kin .vjs-big-play-centered .vjs-big-play-button {
    left: 50%;
    top: 50%;
    }
    #wrap .main .cathedra {
    padding-top: 0.4rem;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    }
    #wrap .main .cathedra h3 {
    width: 9.13333333rem;
    margin-left: 0.33333333rem;
    }
    #wrap .main .cathedra p {
    margin: 0 0.33333333rem;
    padding: 0.32rem 0 0.28rem 0;
    color: #959595;
    }
    #wrap .main .cathedra p span.time {
    float: right;
    }
    #wrap .main p.content {
    padding: 0.6rem 0.42666667rem 0.6rem;
    text-indent: .5rem;
    line-height: 0.66666667rem;
    color: #959595;
    text-align: justify;
    background-color: #fff;
    }
    #wrap .main .more {
    margin-top: 0.26666667rem;
    background-color: #fff;
    }
    #wrap .main .more .about {
    padding: 0 0.42666667rem;
    }
    #wrap .main .more .about h3 {
    width: 2.66666667rem;
    margin: 0;
    display: inline-block;
    }
    #wrap .main .more .about a {
    float: right;
    display: inline-block;
    color: #666;
    margin-top: 0.06666667rem;
    }
    #wrap .main .more .about {
    padding: 0.6rem 0.42666667rem 0.6rem;
    }
    #wrap .main .more .aboutVideo {
    display: flex;
    justify-content: space-between;
    padding: 0 0.4rem;
    font-size: 0;
    }
    #wrap .main .more .aboutVideo div {
    width: 4.4rem;
    }
    #wrap .main .more .aboutVideo .lf a img {
    width: 4.4rem;
    height: 2.4rem;
    border-radius: 3px;
    }
    #wrap .main .more .aboutVideo div a {
    display: block;
    }
    .video-js {
    width: 100%;
    }
    .vjs-poster {
    position: relative!important;
    }
    .vjs-big-play-centered .vjs-big-play-button {
    border-radius: 50% !important;
    background-color: rgba(0, 0, 0, 0.4) !important;
    }
    .video-js .vjs-big-play-button {
    top: 50% !important;
    left: 50% !important;
    width: 1.5rem !important;
    height: 1.5rem !important;
    line-height: 1.5rem !important;
    font-size: 0.5rem !important;
    margin-top: -0.5rem !important;
    margin-left: -0.6rem !important;
    border-radius: 50% !important;
    }
    .clearfix:after {
    display: block;
    content: "";
    clear: both;
    }
    .article-attach{
        margin-top: 20px;
        margin-bottom: 15px;
    }
    .attachList{
        display: flex;
        align-items: center;
        vertical-align: middle;
        background-color: rgb(246, 246, 246);
            
        height: 50px;
        width: 100%;
    }
    .attachName{
        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
        word-break: break-all;
        color: #000;
        font-size: 0.65rem;
        margin-left: 10px;
        margin-right: 10px;
    }
    /* 徽章 */
.badgeImg{
    width: 1rem !important;
    height: 1rem !important;
    margin-right: 0rem!important;
    margin-left: 0.3rem!important;
    border-radius:0rem !important;
}
/* 9534 UOP社区管理后台优化 #4  单张图片的展示优化：预览图以图片中心为基准，如果宽高比大于xxx则以高为准等比缩放，宽度两边超出部分截掉，
如果宽高比小于yyy则以宽为准等比缩放，高度上下两头超出部分截掉，其他在xxx-yyy之间的按等比缩放展示。 */
.singleDiv{
    max-width: 55%!important;
    max-height: 9rem!important;
  
}
.singleImg{ 
    object-fit: scale-down!important;
    object-position:left!important ;
} 
    
    /*
* @Author: mazhuo
* @Date:   2021-09-08 13:41:22
* @Last Modified by:   mazhuo
* @Last Modified time: 2022-03-08 10:12:54
*/

/* 单选未选择 */
.vote{width:100%;height:2.5rem;display: flex;justify-content: space-between;align-items: center;}
.vote .first{width:6.75rem;height:2rem;background: url('./img/redLeft.png') no-repeat;background-size: 100% 100%;
 margin-left:1.75rem;text-align: center;line-height: 2rem}
.vote .vs{width:1.25rem;height:0.7rem;background: url('./img/vs.png') no-repeat;background-size: 100% 100%;margin:0 0.25rem;}
.vote .second{width:6.75rem;height:2rem;background: url('./img/blueRight.png') no-repeat;background-size: 100% 100%;
 margin-right:1.75rem;text-align: center;line-height: 2rem}
.vote div .buy{font-size:0.75rem;text-align: center;display:block;color:#fff;}
.vote div .nobuy{font-size:0.75rem;text-align: center;display:block;color:#fff;}

.vote .first .bar{width:5rem;height:0.5rem;background: #fff;display: inline-block;margin-left:0.75rem;border-radius:1.25rem;}
.vote .second .bar{width:5rem;height:0.5rem;background: #fff;display: inline-block;border-radius:1.25rem;}
.vote .bar .tiao{
 width:0px;height:0.5rem; 
 background:#f3d0d0;
 text-align:center;
 border-radius:1.25rem;
}
.vote .first .number{display: inline-block;color:#fff;}
.vote .second .number{display: inline-block;color:#fff;margin-left:0.75rem;}

/* 单选已选择 */
.choiceVote{width:100%;padding:0.5rem 0rem;}
.selectTip{width:100%;display: flex;justify-content: space-between;align-items: center;font-size:0.75rem}
.selectTip div{width:50%;padding:0 0.75rem;font-size:0.75rem;color:#148ce6;}
.selectTip div:nth-of-type(2){text-align:right}
.selectTip div.active{color:#fb5c5f}
.select{width:100%;height:1.75rem;display: flex;justify-content: space-between;align-items: center;font-size:0.75rem}
.select .first{width:20%;margin-left:0.75rem;color:#fb5c5f;font-weight:bold;
	/* text-indent:0.5rem */
}
.select .second{width:100%;display: flex;justify-content: space-between;align-items: center;border-radius:50px;background:#fff;}
.select .second .left{
    width:0%;
    /* height:0.5rem;  */
    /* margin: 0 auto; */
    border-left:0.75rem solid transparent;
    border-right:1rem solid #fb5c5f;
    border-bottom:0.75rem solid ;
    color: #fb5c5f;
    border-radius: 50px 100px 100px 0px;
    transform: rotate(-180deg);
    margin-left:0.5rem;
}
.select .second .right{width:0%;
    border-left:0.75rem solid transparent;
    border-right:1rem solid #148ce6;
    border-bottom:0.75rem solid ;
    color: #148ce6;
    border-radius: 50px 100px 100px 0px;
    margin-left: -0.45rem;
    transform: rotate(360deg);
}
.select .four{width:20%;text-align:center;
    margin-right:0.75rem;color:#148ce6;font-weight:bold;padding-left:0.5rem;}



/* 多选投票样式 */
.moreSelect{width:17.25rem;margin:0 auto;margin-bottom:10rem;background: #f6f6f6;padding:0.5rem 0;border-radius:3px}
.moreSelect .list{width:16.0rem;height:1.75rem;text-align:center;line-height:1.75rem;background: #FFF;margin:0 auto;border:1px solid #ccc;
    margin-top: 0.5rem;border-radius: 5px;color: #148ce6;font-size: 0.75rem;position: relative;
}
.moreSelect .list.moreActive{width:16.0rem;height:1.75rem;text-align:center;line-height:1.75rem;background: #FFF;margin:0 auto;border:1px solid #fb5c5f;
    margin-top: 0.5rem;border-radius: 5px;color: #fb5c5f;font-size: 0.75rem}

.moreSelect .list .text{position: absolute;top:0;left:50%;margin-left:-1rem;}

.moreSelect .tick{width:90%;position: absolute;top:0;left:0.75rem;display: flex;justify-content: space-between;align-items: center;} 

.moreSelect .confirm{width: 10.0rem;height: 1.75rem;background:#fececf;color:#fff;font-size: 0.75rem;border:none;border-radius: 1.25rem;margin:0 auto;text-align:center;line-height:1.75rem;margin-top:0.75rem;}
.moreSelect .confirmActive{width: 10.0rem;height: 1.75rem;background:#fb5c5f;color:#fff;font-size: 0.75rem;border:none;border-radius: 1.25rem}

.moreSelect .list .tiao.grey{width:0px; height:1.75rem; background:#eee; text-align:center;}

.moreSelect .list .tiao.red{width:0px;height:1.75rem; background:#ffefef; text-align:center; }





 /* 底部弹窗    */
/* 浮层 */
.layer0 { background-color: #ffffff; height: 100%; width: 100%; position: fixed;left:0; overflow: auto;z-index: 10;}
.layer0{
    /* background-color: #4c4c4c; */

   /*  background: rgba(0, 0, 0, 0);
    height:auto;
    width:17.75rem;
    position: fixed;
    bottom: 0;
    left:50%;
    overflow: auto;
    z-index:99999999;
    margin-left:-8.875rem;
    border-radius:10px; */

    position: fixed;
    top: 0;
    left:50%;
    background-color: rgba(0,0,0,0.5);
    height: 100%;
    width: 100%;
    overflow: auto;
    font-size: 0.6rem;
    z-index: 999;
    bottom: 0px;
    margin-left:-9.35rem;
   }

/* .mask {
    width: 100%;
    height:160%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .7);
    display: none;
    z-index:99999999;
} */
.animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

@keyframes slideInDown{
    0%{opacity:0;-webkit-transform:translateY(-2000px);-ms-transform:translateY(-2000px);transform:translateY(-2000px)}
    100%{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0)}}
 
@keyframes slideInUp{
    0%{opacity:0;-webkit-transform:translateY(60%);-ms-transform:translateY(60%);transform:translateY(60%)}
    100%{-webkit-transform:translateY(0%);-ms-transform:translateY(0%);transform:translateY(0%)}}    
.slideInDown{-webkit-animation-name:slideInDown;animation-name:slideInDown}
.slideInUp{-webkit-animation-name:slideInUp;animation-name:slideInUp;}
.slideInUp .giftlist .noTips{height:2rem;text-align:center;line-height: 2rem;font-size:0.85rem;color:#148ce6;}
.slideInUp .giftlist ul {overflow-y: auto;padding-bottom: 2.5rem;height:19rem;}
.slideInUp .giftlist ul li{height:2.5rem;line-height: 2.5rem;text-align: center;padding: 0 .75rem;font-size: .6rem;overflow: hidden;}
.slideInUp .giftlist ul li span{display: inline-block;color:#666;}
.slideInUp .giftlist ul li .circle{width: .8rem; height: .8rem; vertical-align: middle; border-radius: 50%; margin-top: .8rem; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; -o-box-sizing: border-box; -ms-box-sizing: border-box; box-sizing: border-box;}
.slideInUp .giftlist .noTips{height:3rem;line-height:3rem;border-bottom:1px solid #eee;background: #fff;}
.slideInUp .giftlist :last-child .noTips{border-radius:10px;}
.layer0 .close{height:3rem;line-height:3rem;margin-top:0.5rem;text-align:center;background: #fff;border-radius: 10px;margin-bottom: 1rem;}

.slideInUp .close_button{width:100%;height:2.5rem;border-top: 1px #fb5c5f solid;color:#fb5c5f;font-size: .75rem;text-align: center;line-height: 2.5rem;position: fixed;bottom:30%;z-index: 10;background: #fff;}
    
    
    
`))

// 自定义组件，父节点必须添加style="overflow:scroll;height:100vh"
Vue.component('post', {
    model: {
        prop: "value",
        event: "input",
    },
    props: {
        value: {
            validator: () => true,
        },
        list: {
            type: [Array],
            default: () => []
        },
        url: {
            type: String,
            default: () => '/sfs/api/v1/post'
        }
    },
    data() {
        return {
            msgAllData: [],
            // recommendData:[],
            userInfo: '',
            allLoaded: false,
            loading: true,
            showLoading: true,
            // popupVisible:false,
            // userAgent:navigator.userAgent,
            // userIp:returnCitySN["cip"],
            currrentOrder: '',
            // 放大图片
            currentSwiper: null,
            isEnlarge: false,
            currentImgList: [],
            // 显示pop-list
            isHandleMore: false,
            // itemType
            itemType: { topic: { type: '1', name: '话题' }, post: { type: '2', name: '动态' }, fund: { type: '3', name: '基金' }, comment: { type: '4', name: '留言' }, reply: { type: '5', name: '回复' }, user: { type: '6', name: '用户' }, activity: { type: '8', name: '活动' } },
            // share、report只能在app环境
            isShare: false,
            // comment
            isComment: null,
            currentMsgData: null,
            currentMsgIndex: null,
            currentComment: '',
            isReply: false,
            currentPreset: '喜欢就评论',
            // 记录视频
            myPlayer: [],
            oldId: '',
            // 上拉加载
            pageSize: 10,
            pageNum: 1,
            option:[],
            optionList:[],
            questions:[],
            options:[],
            surveyId:'',
            questionId:'',
            show:true,
            showPerent:false,
            style:'',
            isChoiceShow:false,
            width:'',
            surveyId:'',

            cancelVoteItem: {},

            styleLeft: {
                width: '',
            },
            styleObject: {
                width: '',
            },
            optionId:'',
            num:'0',
            voteInfoList:[],
            questionsList:[],
            optionsList:[],
            moreActiveIndex:[],   //用于添加样式用
            arrOptionId:[],
            mySwiper2:null, //
            activeIndex:-1,//用于投票里摘要显示
        }
    },
    created() {
        this.getMsgList(true);
        this.getUserInfo();
    },

    mounted: function () {
        this.isShare = isApp() ? true : false;
        if (navigator.userAgent.indexOf('QQBrowser') != -1 && navigator.userAgent.indexOf('Android') != -1) {
            this.$toast({
                message: '[注意] 在Android版微信中播放视频可能会被自动全屏。',
                position: 'middle',
                duration: 2000
            });
        }
    },
    watch: {
        currentMsgIndex() {
            this.currentPreset = '喜欢就评论'
        },
        url: function () {
            console.log('this.url=', this.url);
            this.pageNum = 1;
            this.pageSize = 10;
            this.$nextTick(function () {
                this.myPlayer.forEach(function (player) {
                    player.release();
                })
                this.myPlayer = [];
                this.getMsgList(true);
            })
        }
    },
    methods: {
        // 20220110--增加标题描述超过一定字数截取部分显示全部
        showText:function(index){
            console.log('index:',index);
            this.activeIndex = this.activeIndex == index ? -1 : index; 
        },
        getUserInfo() {
            console.log('getUserInfo')
            $.ajax({
                url: "/sfs/api/v1/user",
                beforeSend:function(req){
					if(utils.getCookie('traceCode')){
						req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
					}
				},
                success: function (result) {
                    if (result.returnCode == 0) {
                        if (result.body) {
                            this.userInfo = result.body;
                        }
                    }
                }.bind(this)
            });
        },

         // 附件和超链接的排序
        //sortBy函数接受一个成员名字符串和一个可选的次要比较函数做为参数
        sortBy(name, minor) {
            return function (o, p) {
                var a, b;
                if (o && p && typeof o === 'object' && typeof p === 'object') {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return typeof minor === 'function' ? minor(o, p) : 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                } else {
                    thro("error");
                }
            }
        },
        getMsgList(flag, flag2, order) {
            var _this=this;
            this.option=[];
            this.optionList=[];
            this.questions=[];
            // this.msgAllData=[];
            // this.options=[];
            this.currrentOrder = order;
            if (order == 'HOT') {
                $('.filter span:nth-of-type(1)').addClass('active').children('i').addClass('active');
                $('.filter span:nth-of-type(2)').removeClass('active').children('i').removeClass('active');
            } else if (order == 'NEW') {  //原参数CREATE_TIME
                $('.filter span:nth-of-type(2)').addClass('active').children('i').addClass('active');
                $('.filter span:nth-of-type(1)').removeClass('active').children('i').removeClass('active');
            } else {
                $('.filter span:nth-of-type(1)').addClass('active').children('i').addClass('active');
            }
            utils.ajax({
                // url: "/sfs/api/v1/post",
                url: this.url,
                data: { pageNum: this.pageNum, pageSize: this.pageSize, postSortEnum: order ? order : 'NEW' },
                success: function (result) {
                    if (flag) {
                        this.msgAllData = result.body;
                        this.$refs.loadmore.onTopLoaded();
                        this.allLoaded = false;
                        this.showLoading = true;
                        this.loading = false;


                        for(var i=0; i<this.msgAllData.length;i++){
                              // 附件和超链接的排序
                        if (this.msgAllData[i].attachments.length > 0) {
                            this.msgAllData[i].attachments.sort(_this.sortBy("attachType"))
                        }
                            if(this.msgAllData[i].voteInfo!=null){

                                if(this.msgAllData[i].voteInfo.complete==true){


                                    // var sortData = function (data){

                                    // return data.voteInfo.optionStats.sort((a,b) => {
                                    //     return a.optionId - b.optionId
                                    //
                                    // })


                                    if (this.msgAllData[i].voteInfo.optionStats < 3) {  //当只是A,B二选一的时候
                                        var num = this.msgAllData[i].voteInfo.optionStats[0].optionCount + this.msgAllData[i].voteInfo.optionStats[1].optionCount;

                                        var percent1 = this.msgAllData[i].voteInfo.optionStats[0].optionCount / num * 100;
                                        var percent2 = this.msgAllData[i].voteInfo.optionStats[1].optionCount / num * 100;

                                        for (var j in this.msgAllData[i].voteInfo.optionStats) {
                                            this.msgAllData[i].voteInfo.optionStats.map(function (item) {
                                                return item.fenshu = "";
                                            })

                                            this.msgAllData[i].voteInfo.optionStats[0].fenshu = percent1;
                                            this.msgAllData[i].voteInfo.optionStats[1].fenshu = percent2;
                                        }
                                        this.msgAllData[i].voteInfo.optionStats.sort((a, b) => {
                                            return a.optionId - b.optionId

                                        })
                                    }else{     //当只是A,B,C,D多选一的时候，或者多选多

                                        this.msgAllData[i].voteInfo.optionStats.sort((a, b) => {
                                            return a.optionId - b.optionId

                                        })
                                        // 求总和
                                        var sum = this.msgAllData[i].voteInfo.optionStats.reduce((pre, cur)=>{
                                            return pre + cur.optionCount
                                        },0)

                                        console.log("sum",sum);

                                        for(var j in this.msgAllData[i].voteInfo.optionStats){
                                            this.msgAllData[i].voteInfo.optionStats[j].fenshu=this.msgAllData[i].voteInfo.optionStats[j].optionCount/sum*100;

                                            for(var k in this.msgAllData[i].voteInfo.answerDetails){  //用来给选中投票的添加样式判断 active字段

                                                if(this.msgAllData[i].voteInfo.optionStats[j].optionId==this.msgAllData[i].voteInfo.answerDetails[k].optionId){
                                                    this.msgAllData[i].voteInfo.optionStats[j].active=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        console.log(this.msgAllData);
                        this.$nextTick(() => {
                            // 222
                            this.mySwiper2 = new Swiper('.swiperUrl', {
                                loop: false,
                                autoplay: false,
                                pagination: {
                                    // el: '.swiperurls-pagination',
                                    el: '.swiper-pagination',
                                    type: 'custom',
                                    renderCustom: function (swiper, current, total) {
                                        var _html = ''; 
                                     console.log('total',total)
                                        if (total < 2) {
                                            return
                                        } else {
                                            for (var i = 1; i <= total; i++) {
                                                if (current == i) {
                                                    _html +=
                                                        '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
                                                } else {
                                                    _html += '<span class="swiper-pagination-customs"></span>';
                                                }
                                            }
                                        }
                                        return _html; //返回所有的页码html
                                    }}
                                
    
                            })
                           
                        })


                    }

                    if (flag2) {
                        if (result.body.length === 0) {
                            console.log('loadover');
                            this.allLoaded = true;// 若数据已全部获取完毕
                            this.$refs.loadmore.onBottomLoaded();
                            this.$toast({
                                message: '没有更多了',
                                position: 'middle',
                                duration: 2000
                            });
                            this.showLoading = false;
                        }
                        // this.$refs.loadmore.onBottomLoaded();
                        this.msgAllData = this.msgAllData.concat(result.body);

                        for(var i=0; i<this.msgAllData.length;i++){

                            if(this.msgAllData[i].voteInfo!=null){

                                if(this.msgAllData[i].voteInfo.complete==true){


                                    // var sortData = function (data){

                                    // return data.voteInfo.optionStats.sort((a,b) => {
                                    //     return a.optionId - b.optionId
                                    //
                                    // })


                                    if (this.msgAllData[i].voteInfo.optionStats < 3) {  //当只是A,B二选一的时候
                                        var num = this.msgAllData[i].voteInfo.optionStats[0].optionCount + this.msgAllData[i].voteInfo.optionStats[1].optionCount;

                                        var percent1 = this.msgAllData[i].voteInfo.optionStats[0].optionCount / num * 100;
                                        var percent2 = this.msgAllData[i].voteInfo.optionStats[1].optionCount / num * 100;

                                        for (var j in this.msgAllData[i].voteInfo.optionStats) {
                                            this.msgAllData[i].voteInfo.optionStats.map(function (item) {
                                                return item.fenshu = "";
                                            })

                                            this.msgAllData[i].voteInfo.optionStats[0].fenshu = percent1;
                                            this.msgAllData[i].voteInfo.optionStats[1].fenshu = percent2;
                                        }
                                        this.msgAllData[i].voteInfo.optionStats.sort((a, b) => {
                                            return a.optionId - b.optionId

                                        })
                                    }else{     //当只是A,B,C,D多选一的时候，或者多选多

                                        this.msgAllData[i].voteInfo.optionStats.sort((a, b) => {
                                            return a.optionId - b.optionId

                                        })
                                        // 求总和
                                        var sum = this.msgAllData[i].voteInfo.optionStats.reduce((pre, cur)=>{
                                            return pre + cur.optionCount
                                        },0)

                                        console.log("sum",sum);

                                        for(var j in this.msgAllData[i].voteInfo.optionStats){
                                            this.msgAllData[i].voteInfo.optionStats[j].fenshu=this.msgAllData[i].voteInfo.optionStats[j].optionCount/sum*100;

                                            for(var k in this.msgAllData[i].voteInfo.answerDetails){  //用来给选中投票的添加样式判断 active字段

                                                if(this.msgAllData[i].voteInfo.optionStats[j].optionId==this.msgAllData[i].voteInfo.answerDetails[k].optionId){
                                                    this.msgAllData[i].voteInfo.optionStats[j].active=true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        console.log(this.msgAllData);
                        
                    };
                    this.msgAllData.forEach(function (item) {
                        item.currentComment = "";
                    }.bind(this))
                }.bind(this)
            });
        },
        more(postId) {//查看动态详情
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId);
            } else {
                window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId;
            }
        },
        gotoTopic(topicId) {//查看话题详情
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/topicDetail.html?topicId=' + topicId);
            } else {
                window.location.href = location.origin + '/tradeh5/newWap/community/topicDetail.html?topicId=' + topicId;
            }
        },
        gotoList(item) {//查看基金详情
            if (isApp()) {
                if (item.productCategoryId == '1') {//基金
                    window.location.href = "htffundxjb://action?type=fd&fundId=" + item.productId;
                } else if (item.productCategoryId == '4') {//实盘
                    window.location.href = "htffundxjb://action?type=actualGroup&subType=detail&groupId=" + item.productId;
                } else { //组合item.productCategoryId == '2'
                    window.location.href = "htffundxjb://action?type=fundGroup&subType=fgd&groupId=" + item.productId;
                }

                //window.location.href = 'htffundxjb://action?type=url&link=' + $.base64.encode(location.origin + '/tradeh5/newWap/community/topicDetailList.html?productId=' + productId);
            } else {
                if (item.productCategoryId == '1') {//基金
                    window.location.href = location.origin + '/mobileEC/wap/fund/steadyCombination.html?fundId=' + item.productId;
                } else if (item.productCategoryId == '4') {//实盘
                    window.location.href = location.origin + "/mobileEC/wap/fundgroup/fund_group_show.html?groupId=" + item.productId;
                } else { //组合item.productCategoryId == '2'
                    window.location.href = location.origin + '/mobileEC/wap/fundgroup/group_fund_details.html?groupId=' + item.productId;
                }
            }
        },
        // 评论
        commentJump(postId,commentCount) {
            // this.currentComment='';
            // this.$refs.currentComment[index].focus();
             // <!-- 9534 .社区h5前端信息流：不展示近3条评论，不默认展示评论输入框，如果无评论时，点击评论按钮则弹出输入框，有评论数时跳转到帖子详情页定位到评论列表   -->
            //  if (commentCount == 0) {
            //     this.msgAllData.forEach((item, index) => {
            //         if (postId == item.postId && item.showComment) {
            //             item.showComment = false
            //         } else if (postId == item.postId) {
            //             item.showComment = true
            //             Vue.set(this.msgAllData, index, item)
            //             this.$nextTick(() => {
            //                 this.$refs.focusbottom[0].focus();
            //             })
            //         }else{
            //             item.showComment = false
            //         } 
            //         Vue.set(this.msgAllData, index, item)
            //     })
            // } else {
                if (isApp()) {
                    //+'&returnComments=true'  用来判断是否需要定位到评论列表
                    window.location.href = 'htffundxjb://action?type=url&link=' + btoa(location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId + '&hash=1' +'&returnComments=true');
                } else {
                    window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId + '&hash=1'  +'&returnComments=true';
                }
            // }
        },
        comment(item, index, topItem) {
            if (!this.isReply) {
                var currentItem = JSON.parse(JSON.stringify(item));
                currentItem.commentCount++;
                currentItem.commentsList.unshift({ content: topItem.currentComment, nickname: this.userInfo.nickname });
            }
            var params = {
                content: topItem.currentComment,
                userAgent: this.userAgent,
                // userIp: this.userIp
            }
            !this.isReply && (params.itemId = item.postId);
            this.isReply && (params.itemId = item.id);
            !this.isReply && (params.itemType = this.itemType.post.type);
            this.isReply && (params.itemType = this.itemType.comment.type);
            this.isComment = null;
            // return;
            utils.ajax({
                url: "/sfs/api/v1/comment",
                type: 'POST',
                data: params,
                success: function (result) {
                    var message = this.isReply ? '回复提交成功' : '评论提交成功'
                    this.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                    !this.isReply && this.msgAllData.splice(index, 1, currentItem);
                    this.msgAllData[index].currentComment = '';
                }.bind(this)
            });
        },
        focusComment(item, index) {
            if (this.currentPreset == '喜欢就评论') {
                this.isReply = false;
                this.currentPreset = '喜欢就评论';
            } else {
                this.isReply = true;
            }
            this.commentHandle(item, index);
        },
        // 回复
        reply(item, index, postItem) {
            this.isReply = true;
            if (item.id) {
                this.currentPreset = '回复' + item.nickname + ':';
                this.commentHandle(item, index);
            } else {
                // 按照评论当前帖子处理
                this.currentPreset = '喜欢就评论';
                this.isReply = false;
                this.commentHandle(postItem, index);
            }
        },
        commentHandle(item, index) {
            this.currentMsgData = item;
            this.currentMsgIndex = index;
            this.isComment = index;
            this.$nextTick(function () {
                this.$refs.focusbottom[index].focus();
            }.bind(this));
        },
        recommentVisible() {
            this.popupVisible = false;
        },
        // 点赞
        thumb(item, index) {
            // 静默点赞
            var currentItem = JSON.parse(JSON.stringify(item));
            if (item.thumb) {
                currentItem.thumb = false;
                currentItem.thumbCount--;
            } else {
                currentItem.thumb = true;
                currentItem.thumbCount++;
            }
            var params = {
                itemId: item.postId,
                status: item.thumb ? '0' : '1'
            }
            // return;
            utils.ajax({
                url: "/sfs/api/v1/thumb/post",
                type: 'POST',
                data: params,
                success: function (result) {
                    this.msgAllData.splice(index, 1, currentItem);
                }.bind(this)
            });
        },
        gotoUser(socialUserId) {
            window.location.href = 'htffundxjb://action?type=community&subType=personalPage&socialUserId=' + socialUserId;
        },

        // 下拉刷新上拉加载
        loadTop() {
            console.log('loadTop');
            this.pageNum = 1;
            this.getMsgList(true, false, this.currrentOrder);
            // this.getLayoutData();
        },

        loadBottom() {
            console.log('loadBottom');
            this.pageNum++;
            if (this.allLoaded === false) {
                this.getMsgList(false, true, this.currrentOrder);
            }
        },
        showMore(value) {
            if (String(value).length > 66) {
                return true;
            }
            return false;
        },
        // 图片展示
        fullScreen(item, event, bindex) {
            //20210908 调用APP原生方法fetchFeedImageList，传图片列表和当前选中图片页码
            var feedImageList= [];
            item.imagesList.forEach(function(item){
                feedImageList.push(item.imageUrl);
            })
            var imgList= {
                imgUrlList: feedImageList,
                index: bindex+1 //从1开始
            }
            if(isIosApp()){
                window.webkit.messageHandlers.fetchFeedImageList.postMessage(JSON.stringify(imgList));
            }else if(isAndroidApp()){
                handler.fetchFeedImageList(JSON.stringify(imgList));
            }else{            
                if (event.target.getAttribute("class") === 'active') {
                    this.more(item.postId);
                } else {
                    this.currentImgList = item.imagesList;
                    this.isEnlarge = true;
                    this.$nextTick(function () {
                        this.currentSwiper = new Swiper('.post-swiper', {
                            pagination: {
                                el: '.swiper-pagination',
                                type: 'custom',
                                renderCustom: function (swiper, current, total) {
                                    return current + '/' + total;
                                }
                            }
                        });
                        this.currentSwiper.slideTo(bindex, 0, false)
                    }.bind(this))
                }
            }
        },
        visbiliyImg() {
            this.isEnlarge = false;
            this.currentImgList = [];
            this.currentSwiper.destroy(false);
        },
        hideHandleMore() {
            this.isHandleMore = false;
            this.msgAllData.forEach((item)=>{
                item.isHandleMore = false;
            })
        },
        handleMore(item){
            console.log('item', item);
            $.ajax({
                url: "/sfs/api/v1/post/feedback?postId=" + item.postId,
                type: 'GET',
                // data: params,
                beforeSend:function(req){
					if(utils.getCookie('traceCode')){
						req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
					}
				},
                complete: function (result) {
                    // var result = { "returnCode": 0, "returnMsg": "", "body": { "postId": "21072015582LCYX6", "postType": null, "topicId": null, "topicName": null,
                    //         "title": null, "summary": null, "userId": null, "userInfo": null, "createTime": "21-7-20 下午4:12", "updateTime": "21-9-15 上午12:30",
                    //         "systemTime": null, "thumbCount": 0, "commentCount": 1, "commentTime": "21-7-21 下午2:53", "commentStatus": 1, "viewCount": 181,
                    //         "recommend": 0, "level": 0, "thumb": false, "admin": false, "collect": false
                    //     }
                    // }
                    // result.body.admin = true;
                    // result.body.collect = true;
                    
                }.bind(this),
                success: function (result) {
                    console.log('result', result);
                    if(result.returnCode == 0){
                        this.$set(item, 'handleMore_admin', result.body.admin);
                        // this.$set(item, 'handleMore_collect', result.body.collect);
                    } else if(result.returnCode !== 9999){
                        return utils.showTips(result.returnMsg);
                    }
                    this.$set(item, 'isHandleMore', true);
                    this.$nextTick(()=>{
                        this.isHandleMore = true;
                    });
                }.bind(this)
            });
        },
        // 收藏动态
        collectPost(item,index) {
            console.log(item,'item');
            let postId = item.postId;
            let currentItem = JSON.parse(JSON.stringify(item));
            currentItem.collect = !item.collect;
            //收藏状态（1：收藏 0：取消收藏）
            let params = {
                "itemId": postId,
                "status": item.collect ? 0 : 1
            }
            utils.ajax({
                url: "/sfs/api/v1/collect/post",
                type: 'POST',
                data: params,
                success: function () {
                    this.msgAllData.splice(index, 1, currentItem);
                    var message = currentItem.collect ? '收藏成功' : '取消收藏成功';
                    Vue.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                }.bind(this)
            });
        },
        // 举报动态
        reportPost(postId){
            console.log('reportPost postId=', postId);
            if (isApp()) {
                window.location.href = 'htffundxjb://action?type=feedback&subType=survey';
            } else {
                // 暂无h5对应页面
                // window.location.href = location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + postId;
            }
        },
        shareInfo(item) {
            // shareAct?eventCode=事件场景码&eventId=事件ID
            window.location.href = 'shareAct?eventCode=COMMUNITY_POST_FX&eventId=' + item.postId;
            // console.log('shareInfo item.postId=', item.postId)
            // utils.get('/sfs/api/v1/post/'+item.postId,null,function(res){
            //     var body = res.body;
            //     if(body){
            //         var imgUrl = '';
            //         if(body.imagesList && body.imagesList[0] && body.imagesList[0].imageUrl){
            //             imgUrl = body.imagesList[0].imageUrl;
            //             imgUrl = String(imgUrl).replace(/^\/\//, window.location.protocol + '//');
            //         }
            //         var shareInfoParams={
            //             iTemType:this.itemType.post.type,
            //             iTemId:body.postId,
            //             title:body.title,
            //             content:body.summary,
            //             imgUrl:imgUrl,
            //             url: window.location.origin + '/tradeh5/newWap/community/postDetails.html?postId=' + body.postId,
            //         };
            //         // console.log('shareInfo shareInfoParams=', shareInfoParams)
            //         try{
            //             if(isIosApp()){
            //                 window.webkit.messageHandlers.shareSocialItem.postMessage(shareInfoParams);
            //             }else if(isAndroidApp()){
            //                 handler.shareSocialItem(shareInfoParams.iTemType,shareInfoParams.postId,shareInfoParams.title,shareInfoParams.content,shareInfoParams.imgUrl,shareInfoParams.url);
            //             }
            //         }catch(e){
            //             console.log(e);
            //         }
            //     } else {
            //         var message= '帖子详情获取失败';
            //         Vue.$toast({
            //             message,
            //             position: 'center',
            //             duration: 2000
            //         });
            //     }
            // }.bind(this));
        },
        // 动态流中关注用户
        followUser(item){
            console.log('focusUser item.userId=', item.userId);
            console.log('focusUser item.userInfo.followStatus=', item.userInfo.followStatus);
            var itemIds = [item.userId];
            // 关注状态（1：关注 0：取关）
            var params = {
                // itemId: '',
                itemIds: itemIds,
                status: ((item.userInfo&&item.userInfo.followStatus==1)?0:1)
            }
            utils.ajax({
                url: "/sfs/api/v1/follow/user",
                type: 'POST',
                data: params,
                success: function (result) {
                    var message = params.status?'关注成功':'取消关注成功';
                    Vue.$toast({
                        message,
                        position: 'center',
                        duration: 2000
                    });
                    // this.getMsgList(true,'','FOLLOW');  // 刷新关注tab页
                    // 刷新当前item关注状态
                    this.$set(item.userInfo, 'followStatus', params.status);
                }.bind(this)
            });
        },
        // 删除动态 
        delPost(postId) {
            console.log('delPost postId=', postId);
            utils.showTips({
                title: '您确定要删除该条帖子吗？', //标题
                // content: '确认要删除吗', //内容
                showCancel: true, //是否显示取消按钮，默认false
                confirmText: '确定', //确认按钮文字，默认确定
                complete: function () {
                    utils.ajax({
                        url: "/sfs/api/v1/post?postId=" + postId,
                        type: 'DELETE',
                        // data: params,
                        success: function (result) {
                            var message = '帖子删除成功';
                            Vue.$toast({
                                message,
                                position: 'center',
                                duration: 2000
                            });
                            this.getMsgList(true);
                        }.bind(this)
                    });
                }.bind(this)
            })
        },
        openXEPage(videoInfo) {
            // 小鹅直播
            if (isApp()) {
                // IOS两个都支持，安卓只支持传videoId
                // window.location.href = 'htffundxjb://action?type=media&subType=liveXE&link=' + btoa(videoInfo.url);
                window.location.href = 'htffundxjb://action?type=media&subType=liveXE&videoId=' + videoInfo.videoId;
            } else {
                window.location.href = videoInfo.shareLinkUrl;
            }
        },
        openHuoShanPage(videoInfo) {
            // 火山直播
            if (isApp()) {
                // window.location.href = 'htffundxjb://action?type=media&subType=volcengine&activityId=XXX&isPortrait=1';
                window.location.href = videoInfo.url;
            } else {
                window.location.href = videoInfo.shareLinkUrl;
            }
        },
        // urlToLink(str,flag){
        //     if (!str) return '';
        //     var re = /((http|https):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g; 
        //     var len1 =str.length;
        //     str = str.replace(/&nbsp;/g,' ');
        //     str = str.replace(re, "<a href='$1' target='_blank' >网页链接</a>"); 
        //     var len2 =str.length; 
        //     var len = len2-len1+38;  
        //     if(flag){
        //         if (str.length > len) {
        //             str = str.slice(0, len) + '...';
        //         }

        //     }
        //     return str
        // }
        // urlToLink(str) {
        //     if (!str) return '';
        //     if (str.length > 66) {
        //         str = str.slice(0, 66) + '...';
        //     }
        //     return str
        // },
        gotoUrl(item, linkType) {
            var itemUrl = item.url;
            if (!itemUrl) {
                return false;
            }
            itemUrl = String(itemUrl).replace(/^\/\//, window.location.protocol + '//');
            if (isApp()) {
                if (itemUrl.slice(0, 13) == 'htffundxjb://') {
                    window.location.href = itemUrl;
                } else {
                    if (linkType == 'pdf') {
                        window.location.href = 'htffundxjb://action?type=url&linkType=pdf&link=' + btoa(itemUrl);
                    } else {
                        window.location.href = 'htffundxjb://action?type=url&link=' + btoa(itemUrl);
                    }
                }
            } else {
                window.location.href = itemUrl;
            }
        },
        cutWords(str) {
            if (!str) return '';
            if (str.length > 30) {
                str = str.slice(0, 30) + '...';
            }
            return str
        },
        updateVideo() {
            var allVideo = document.querySelectorAll('video');
            allVideo.forEach(function (item) {
                if (!item.getAttribute('id').includes('html5_api')) {
                    var index = Number(item.getAttribute('data-index'));
                    var id = 'my-video' + index;
                    var myPlayer = new neplayer(id);
                    this.myPlayer.push(myPlayer);
                }
            }.bind(this));
            this.myPlayer.forEach((player) => {
                player.on('playing', function () {
                    var currentIndex = this.tagAttributes['data-index'];
                    var allVideos = document.querySelectorAll('video');
                    allVideos.forEach(function (item) {
                        if (Number(item.getAttribute('data-index')) !== Number(currentIndex)) {
                            item.pause();
                        }
                    })
                })
            })
        },


// 20210913-start-添加投票功能
        // 左边投票按钮
        // optionId,surveyId,questionId,surveySceneCode,num
        voteBuy:function(questionItem, item, optionIndex){
            
            var optionId = questionItem.options[optionIndex].optionId;
            var surveyId = item.voteInfo.surveyId;
            var questionId = questionItem.questionId;
            var surveySceneCode = item.voteInfo.surveySceneCode;

            console.log("voteBuy questionItem",questionItem);
            console.log("voteBuy item",item);

            console.log("optionId",optionId);
            console.log("surveyId",surveyId);
            console.log("questionId",questionId);
            console.log("surveySceneCode",surveySceneCode);

            var params={};
            var answerVoList=[
                {
                    "optionArray": [optionId],
                    "questionId":questionId
                }
            ]
            params.answerVoList=answerVoList;
            params.branchCode="247";
            params.surveyId=surveyId;
            params.surveySceneCode=surveySceneCode;
            console.log(params)
            utils.ajax({
                url: "/caa/v1/survey/survey",
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {

                        // 更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo ) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if(result.body.voteInfo.optionStats){
                                        var voteInfo = result.body.voteInfo;
    
                                        var num= voteInfo.optionStats[0].optionCount + voteInfo.optionStats[1].optionCount;
    
                                        var percent1=voteInfo.optionStats[0].optionCount/num*100;
                                        var percent2=voteInfo.optionStats[1].optionCount/num*100;
    
                                        for(var j in voteInfo.optionStats){
                                            voteInfo.optionStats[0].fenshu=percent1;
                                            voteInfo.optionStats[1].fenshu=percent2;
                                        }
                                    }

                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                    this.getMsgList(true);
                                }
                            }.bind(this)
                        });


                    }
                }.bind(this)
            });

        },


        intoPercent: function (one,two,index) {
            var _this=this;

            // _this.add(one,two,index);

            var prices=one+two; //数组值相加求百分比用

            var str=(one/prices*100).toFixed(1);

            return this.width=str+'%';
            // alert(this.width);
            // return;
        },

        // 调用取消接口
        cancelVote:function(){
            var item = this.cancelVoteItem;
            var surveyId = item.voteId;
            console.log("surveyId",surveyId);
            utils.ajax({
                url: "/caa/v1/survey/survey/cancel",
                type: 'POST',
                data:{
                    surveyId: surveyId,
                    branchCode:'247'
                },
                success: function (result) {
                    if (result.returnCode === 0) {
                        $("#layer1").hide();
                        // this.getMsgList(true, false, this.currrentOrder);

                        // 更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo ) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if(result.body.voteInfo.optionStats){
                                        var voteInfo = result.body.voteInfo;

                                        var num= voteInfo.optionStats[0].optionCount + voteInfo.optionStats[1].optionCount;

                                        var percent1=voteInfo.optionStats[0].optionCount/num*100;
                                        var percent2=voteInfo.optionStats[1].optionCount/num*100;

                                        for(var j in voteInfo.optionStats){
                                            voteInfo.optionStats[0].fenshu=percent1;
                                            voteInfo.optionStats[1].fenshu=percent2;
                                        }
                                    }

                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                    if(!result.body.voteInfo.optionStats){
                                        this.moreActiveIndex=[];   //把上次选中的索引样式清空
                                        // 添加或者取消按钮的样式
                                        Vue.set(item,'active',false);//取消按钮的样式
                                    }else{
                                        Vue.set(item,'active',true);// 添加按钮的样式
                                    }
                                }
                            }.bind(this)
                        });

                    }
                }.bind(this)
            });
        },
        
        // 取消投票
        choiceVote:function(item){   //显示弹框
            // var voteId = item.voteId;
            // this.surveyId=voteId;
            this.cancelVoteItem = item;
            $("#layer1").show();
        },
        closeHide:function(index){
            $("#layer1").hide()
        },


    // 这是多个投票回答单选代码
        moreSelect:function(item,questionItem,itemOp,indexOp){
            var _this=this;
            _this.voteInfoList=[];
            _this.questionsList=[];
            _this.optionsList=[];

            for (var i= 0; i<_this.msgAllData.length; i++) {
                if(_this.msgAllData[i].voteInfo){
                    _this.voteInfoList.push(_this.msgAllData[i].voteInfo);
                }

            }
            for (var k= 0; k<this.voteInfoList.length; k++) {
                _this.questionsList=_this.questionsList.concat(_this.voteInfoList[k].questions);
            }


            for (var m=0;m<_this.questionsList.length;m++) {
                if(_this.questionsList[m].options.length>2){
                    _this.optionsList=_this.optionsList.concat(_this.questionsList[m].options);
                }
            }


            console.log(_this.questionsList);
            console.log(_this.optionsList);

            this.$nextTick(function () {    //这一步是点击选择用作添加样式
                _this.optionsList.forEach(function (item) {

                    Vue.set(item,'active',false);
                });
                Vue.set(itemOp,'active',true);

            });

            // 调取投票接口
            console.log("item",item);
            var optionId = questionItem.options[indexOp].optionId;
            var questionId = questionItem.questionId;
            var surveyId=item.voteInfo.surveyId;
            var surveySceneCode=item.voteInfo.surveySceneCode;

            console.log("optionId",optionId);
            console.log("questionId",questionId);
            console.log("surveyId",surveyId);
            console.log("surveySceneCode",surveySceneCode);

            var params={};
            var answerVoList=[
                {
                    "optionArray": [optionId],
                    "questionId":questionId
                }
            ]
            params.answerVoList=answerVoList;
            params.branchCode="247";
            params.surveyId=surveyId;
            params.surveySceneCode=surveySceneCode;
            console.log(params);

            // 提交投票
            utils.ajax({
                url: "/caa/v1/survey/survey",
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {
                        // 更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo ) {
                                    console.log('/sfs/api/v1/post/ result=', result)
                                    if(result.body.voteInfo.optionStats){
                                        var voteInfo = result.body.voteInfo;


                                        voteInfo.optionStats.sort((a,b) => {
                                            return a.optionId - b.optionId
                                        })

                                        // 求总和
                                        var sum = voteInfo.optionStats.reduce((pre, cur)=>{
                                            return pre + cur.optionCount
                                        },0)

                                        console.log("sum",sum);

                                        for(var j in voteInfo.optionStats){
                                            voteInfo.optionStats[j].fenshu=voteInfo.optionStats[j].optionCount/sum*100;
                                        }
                                    }
                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                }
                            }.bind(this)
                        });

                    }
                }.bind(this)
            });
        },
        percent: function (fenshu) {
            return fenshu?fenshu.toFixed(1)+'%':'0%';
        },

        //这是多个投票回答(A,B,C,D)选择多个的代码-多选多
        muchSelect:function(item,questionItem,itemOp){
            var _this=this;
            // 这一步只是列表添加样式用
            if (this.moreActiveIndex.indexOf(itemOp) !== -1) {  //用于添加样式用
                this.moreActiveIndex.splice(this.moreActiveIndex.indexOf(itemOp), 1); //取消
                itemOp.check=false;      //用作取消用
            } else {
                this.moreActiveIndex.push(itemOp);//选中添加到数组里
                itemOp.check=true;     //用作选择用
            }
            // 添加或者取消按钮的样式
            if(item.active){
                if(this.moreActiveIndex==""){
                    Vue.set(item,'active',false);//取消按钮的样式
                }
            }else{
                Vue.set(item,'active',true);// 添加按钮的样式
            }
            // this.$nextTick(function () {
            //     _this.optionsList.forEach(function (item) {
            //
            //         Vue.set(item,'active',false);
            //     });
            //     Vue.set(itemOp,'active',true);
            //
            // });

            // 调取投票接口
            // console.log("item",item);
            //
            // var arr=[];
            // var optionId=questionItem.options[indexOp].optionId;


            // let text=$(this).text();

            // let text = questionItem.options.optionId;
            // let ind = arr.indexOf(text);
            //
            // if (ind === -1) {
            //     arr.push(text);
            // }
            // else {
            //     arr.splice(ind, 1);
            // }

        },
        // 点击确认投票按钮
        confirm:function(item,questionItem){
            var _this=this;
            var arrOptionId=[];
            for (var i=0;i<questionItem.options.length;i++) {
                if(questionItem.options[i].check&&questionItem.options[i].check==true){
                    arrOptionId.push(questionItem.options[i].optionId);    //拿到选择的OptionId
                }
            }

            if(arrOptionId==""){
                return false;
            }

            var questionId = questionItem.questionId;
            var surveyId=item.voteInfo.surveyId;
            var surveySceneCode=item.voteInfo.surveySceneCode;

            console.log("questionId",questionId);
            console.log("surveyId",surveyId);
            console.log("surveySceneCode",surveySceneCode);


            var params={};
            var answerVoList=[
                {
                    "optionArray": arrOptionId,
                    "questionId":questionId
                }
            ]
            params.answerVoList=answerVoList;
            params.branchCode="247";
            params.surveyId=surveyId;
            params.surveySceneCode=surveySceneCode;
            console.log(params);
            var postId = utils.getUrlParam('postId');
            console.log("postId",postId);
            // 提交投票
            utils.ajax({
                url: "/caa/v1/survey/survey",
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.returnCode === 0) {

                        //更新当前投票item
                        utils.ajax({
                            url: "/sfs/api/v1/post/" + item.postId,
                            type: 'GET',
                            success: function (result) {
                                if (result.returnCode === 0 && result.body && result.body.voteInfo ) {
                                    console.log('/sfs/api/v1/post/ result=', result)

                                    if(result.body.voteInfo.optionStats){
                                        var voteInfo = result.body.voteInfo;

                                        voteInfo.optionStats.sort((a,b) => {
                                            return a.optionId - b.optionId
                                        })

                                        // 求总和
                                        var sum = voteInfo.optionStats.reduce((pre, cur)=>{
                                            return pre + cur.optionCount
                                        },0)

                                        console.log("sum",sum);

                                        for(var j in voteInfo.optionStats){
                                            voteInfo.optionStats[j].fenshu=voteInfo.optionStats[j].optionCount/sum*100;

                                            for(var k in voteInfo.answerDetails){  //用来给选中投票的添加样式判断 active字段

                                                if(voteInfo.optionStats[j].optionId==voteInfo.answerDetails[k].optionId){
                                                    voteInfo.optionStats[j].active=true;
                                                }
                                            }
                                        }
                                    }
                                    this.$set(item, 'voteInfo', result.body.voteInfo);
                                    if(!result.body.voteInfo.optionStats){
                                        // _this.moreActiveIndex=[];   //把上次选中的索引样式清空
                                        // 添加或者取消按钮的样式
                                        Vue.set(item,'active',false);//取消按钮的样式
                                    }else{
                                        Vue.set(item,'active',true);// 添加按钮的样式
                                    }
                                }
                            }.bind(this)
                        });
                    }
                }.bind(this)
            });

        },

// 20210913-end-添加投票功能


    },
    filters: {
        // 展示用户发布时间，格式systemTime = "2021-06-24 15:04:33"
        showTime(createTime, systemTime) {
            if (!systemTime) {
                return createTime.split(' ')[1];
            } else {
                let diff_s = Math.abs(moment(createTime).diff(moment(systemTime), 'seconds'));
                let diff_m = Math.abs(moment(createTime).diff(moment(systemTime), 'minutes'));
                let diff_h = Math.abs(moment(createTime).diff(moment(systemTime), 'hours'));
                let diff_d = Math.abs(moment(createTime.slice(0, 10) + ' 00:00:00').diff(moment(systemTime), 'days'));
                // let diff_W = Math.abs(moment(createTime).diff(moment(systemTime), 'weeks'));
                // let diff_M = Math.abs(moment(createTime).diff(moment(systemTime), 'months'));
                let diff_Y = Math.abs(moment(createTime.slice(0, 4) + '-01-01 00:00:00').diff(moment(systemTime), 'years'));

                if (diff_m < 1) { //  1分钟以内，显示xx秒前
                    return diff_s + '秒前';
                } else if (diff_h < 1) { //  1小时以内，显示xx分钟前
                    return diff_m + '分钟前';
                } else if (diff_h >= 1) {
                    if (diff_d < 1) { // 今天以内的，用xx:xx(如18:20)
                        return createTime.slice(11, -3);
                    } else if (diff_d >= 1 && diff_d < 2) { // 昨天，用昨天xx：xx
                        return '昨天' + createTime.slice(11, -3);
                    } else if (diff_Y < 1) { // 昨天以前的且在当前年的，用mm/dd xx:xx表示
                        return createTime.slice(5, -3).replace(/-/g, '/');
                    } else { // 不在当前年的，用yy/mm/dd xx:xx
                        return createTime.slice(0, -3).replace(/-/g, '/');
                    }
                }

            }
        },

    },
    updated() {
        this.updateVideo();
    },
    template: `
    <div>
        <div  v-infinite-scroll="loadBottom"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <mt-loadmore  :auto-fill="false" :top-method="loadTop"  :bottom-all-loaded="allLoaded" ref="loadmore" 
        >
        <ul class="content-list" >
            <li class="sub-block" v-show="msgAllData.length>0" v-for="(item,index) in msgAllData" :key="index">
                <div class="sub-content" style="margin-bottom:0.5rem">
                    <div class="sub-header clearfix">
                        <img :src="item.userInfo.avatarImage" class="uicon fl" @click="gotoUser(item.userInfo.userId)">
                        <div class="uinfo fl" @click="gotoUser(item.userInfo.userId)">
                            <h4 class="uinfo-t">
                                <span class="uname">{{item.userInfo.nickname}}</span>
                                <i class="uicon-s" v-show="item.userInfo.verified"></i>
                                <span class="utag" v-show="item.userInfo.title">{{item.userInfo.title}}</span>
                            </h4>
                            <h4 class="uinfo-b">{{item.createTime | showTime(item.systemTime)}}</h4>
                        </div>
                        <!-- 徽章 -->
                        <div v-if='item.userInfo.badgeList&&item.userInfo.badgeList.length>0' v-for='(item2,index2) in item.userInfo.badgeList'>
                            <img :src="item2.iconImageLight" class="uicon fl badgeImg" :key='item2.badgeId'>
                        </div>
                        <!-- <span v-if="item.admin==true" class="close-icon fr" @click="delPost(item.postId)">
                            <img src="img/del.png" alt="del.png">
                        </span> -->
                        <a href="javascript:;" v-if="!item.admin" :class="'relation fr '+((item.userInfo&&item.userInfo.followStatus==1)?'followed':'')" 
                            @click="followUser(item)" v-text="(item.userInfo&&item.userInfo.followStatus==1)?'已关注':'+关注'"></a>
                    </div>
                    <!-- <p class="sub-tag" v-if="item.topicName">
                        <a href="javascript:;" @click="gotoTopic(item.topicId)">#{{item.topicName}}</a>
                    </p>-->
                    <!-- 20220523新增多个话题 -->
                    <p class="sub-tag" style="overflow-x: auto;white-space: nowrap;" v-if="item.topics&&item.topics.length>0">
                        <template  v-for="(itemTopics,indexTopics) in item.topics" :key="indexTopics">
                            <a href="javascript:;" @click="gotoTopic(itemTopics.id)" style="margin-right:0.65rem;">#{{itemTopics.name}}</a>
                        </template> 
                    </p>
                    <article>
                        <!--<h2 class="article-t" v-html="item.title" @click="more(item.postId)"></h2> -->
                        <!-- 20220523新增置顶 -->
                        <h2 class="article-t"  @click="more(item.postId)">
                            <span v-show="item.level=='1'" v-text="'置顶'" style="display: inline-block;width:1.75rem;height:1rem;line-height:1rem;text-align: center;background:#fb5c5f;color:#fff;border-radius:0.15rem;font-size:0.7rem;margin-right:0.35rem;vertical-align:middle">
                            </span><span style="vertical-align:middle">{{item.title}}</span>
                        </h2>
                        <div class="article-c" v-show="item.summary" @click="more(item.postId)" >
                            <span v-html="item.summary"></span>
                        </div>
                        <div class="article-img" v-show="(item.imagesList && item.imagesList.length > 0)" >
                            <template v-if="item.imagesList&&item.imagesList.length<=3">
                                <div  v-for="(bTag,bindex) in item.imagesList" @click.stop="fullScreen(item,$event,bindex)" :class="[item.imagesList.length==1?'singleDiv':'multipleDiv']">
                                <!-- 20211028 若是文章，则显示缩略图；若是动态，则显示原图 -->
                                <!--  <img v-if="item.postType == 1" :src="bTag.thumbnailUrl" alt=""> 
                                 <img v-else :src="bTag.imageUrl" alt="">  -->
                                <img v-if="item.postType == 1" :src="bTag.thumbnailUrl" :class="[item.imagesList.length==1?'singleImg':'']" alt="">
                                <img v-else :src="bTag.imageUrl"  :class="[item.imagesList.length==1?'singleImg':'']" alt="">
                                </div>
                            </template>
                            <template v-else>
                                <div  v-for="(bTag,bindex) in item.imagesList" v-show="bindex<3" :class="bindex==2?'active':''" :data-content="'+'+(item.imagesList.length-3)" @click.stop="fullScreen(item,$event,bindex)">
                                    <!-- 20211028 若是文章，则显示缩略图；若是动态，则显示原图 -->
                                    <img v-if="item.postType == 1" :src="bTag.thumbnailUrl" alt=""> 
                                    <img v-else :src="bTag.imageUrl" alt="">
                                </div>
                            </template>
                        </div>
                        <!-- 视频 -->
                    <div v-if="item.videoInfo" class="video_box" style="width:100%;position:relative;" :style="item.videoInfo.isLive==='0'?'padding-bottom:56.25%;height:0':'height:auto'" >
                        <template v-if="item.videoInfo.isLive==='0'">
                            <!-- <video width="100%" height="100%" :id="'video_'+index" controls controlslist="nodownload"  :poster="item.videoInfo.picture" style="position: absolute;top:0;left: 0;width: 100%;height: 100%" :data-index="index"       >
                                <source :src="item.videoInfo.url" type="video/mp4">
                                <p>浏览器不支持视频</p>
                            </video> -->
                            <video :id="'my-video'+index" 
                            class="video-js vjs-big-play-centered vjs-fluid" 
                            x-webkit-airplay="allow" 
                            webkit-playsinline
                            playsinline
                            x5-video-player-type="h5" 
                            x5-video-player-fullscreen="true" 
                            x5-video-orientation="landscape|portrait"
                            controls 
                            :poster="item.videoInfo.picture" 
                            :data-index="index"
                                >
                                <source :src="item.videoInfo.url" type="video/mp4"/>
                            </video>
                        </template>
                        <template v-else-if="item.videoInfo.isLive==='2'">
                            <!-- 小鹅直播 -->
                            <a href="javascript:;" style="display: block;"
                                @click="openXEPage(item.videoInfo)">
                                <img :src="item.videoInfo.picture" alt=""
                                    style="display: block;width: 100%;">
                            </a>
                        </template>
                        <template v-else>
                            <!-- item.videoInfo.isLive==='4' 火山直播 -->
                            <a href="javascript:;" style="display: block;"
                                @click="openHuoShanPage(item.videoInfo)">
                                <img :src="item.videoInfo.picture" alt=""
                                    style="display: block;width: 100%;">
                            </a>
                        </template>
                    </div>
                        <div class="article-fundtag">
                            <a href="javascript:;" class="" v-show="item.productsList&&item.productsList.length>0" v-for="(aTag,index) in item.productsList" >
                                <span @click="gotoList(aTag)">{{aTag.productName}}&nbsp;{{aTag.productId}}</span>
                                <i @click="gotoList(aTag)"></i>
                            </a>
                        </div>
                        
                         <!-- 单选未选 -->

                        <div v-if="item.voteInfo && item.voteInfo.questions && item.voteInfo.questions.length>0">
                           <!-- 单选未选 -->

                            <div class="noChoice" v-if="item.voteInfo.complete==false" >
                                <!--<div>-->
                                    <!--<span style="width:0.2rem;height:0.75rem;display: inline-block;background:#fb5c5f;margin:0;margin-left:-0.75rem;border-radius: 0 3px 3px 0;float:left" v-show="!!item.voteInfo.surveyTitle"></span>-->
                                    <!--<span style="margin-left:0.25rem;margin-top:-0.15rem;display: inline-block;float:left;font-size:0.75rem;font-weight: bold;color:#000;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical"  v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle:''"></span>-->
                                <!--</div>-->
                           
                                <div style="margin-top:0.75rem" v-if="item.voteInfo.questions[0].options && item.voteInfo.questions[0].options.length<3">
                                    <span style="width:0.2rem;height:0.75rem;display: inline-block;background:#fb5c5f;margin:0;margin-left:-0.75rem;border-radius: 0 3px 3px 0;float:left" v-show="!!item.voteInfo.surveyTitle"></span>
                                    <!--<span style="margin-left:0.25rem;margin-top:-0.15rem;display: inline-block;float:left;font-size:0.75rem;font-weight: bold;color:#000;" v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle.substr(0,20):''"></span>-->
                                    <!--20220308修改显示三行+'...'-->
                                    <span style="margin-left:0.25rem;margin-top:-0.15rem;display: inline-block;float:left;font-size:0.75rem;font-weight: bold;color:#000;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical" v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle:''"></span>

                                    <!-- 20220107增加摘要描述     -->
                                    <div style="margin-left:0.25rem;margin-top:-0.15rem;display:block;clear:both;font-size:0.6rem;font-weight: bold;color:#666;padding-top:0.35rem;padding-right: 0.75rem;text-align:justify">

                                        <template v-if="item.voteInfo.surveyDesc&&activeIndex!==index">
                                            <span v-if="item.voteInfo.surveyDesc.length>70">  <!--这里用于70字差不多三行...产看全部-显示-->
                                                <span v-text="item.voteInfo.surveyDesc.substr(0,70)"></span>
                                                <span style="color:#148ce6" v-text="'...查看全部'" @click.stop="showText(index)"></span>
                                            </span>
                                            <span v-else v-text="item.voteInfo.surveyDesc"></span>
                                        </template>

                                        <template v-else>
                                            <span v-text="item.voteInfo.surveyDesc"></span>
                                        </template>
                                    </div>
                                </div>
                                <div v-else style="position: relative;margin-top: 1rem;padding:0.25rem 0rem;background:#f6f6f6">
                                    <span style="width:0.2rem;height:0.75rem;position: relative; top:0.65rem;left:0.75rem;display: inline-block;background:#fb5c5f;margin:0;margin-left:-0.75rem;border-radius: 0 3px 3px 0;float:left" v-show="!!item.voteInfo.surveyTitle"></span>
                                    <span style="margin-left:0.5rem;margin-right: 0.5rem;position: relative; top:0.5rem;display: inline-block;font-size:0.75rem;font-weight: bold;color:#000;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical" v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle:''"></span>

                                    <!-- 20220107增加摘要描述     -->
                                    <div style="clear:both;font-size:0.6rem;font-weight: bold;color:#666;text-align:justify;position:relative;top:1.15rem;left:0.5rem;margin-right: 1rem;">
                                         <template v-if="item.voteInfo.surveyDesc&&activeIndex!==index">
                                            <span v-if="item.voteInfo.surveyDesc.length>70">  <!--这里用于70字差不多三行...产看全部-显示-->
                                                <span v-text="item.voteInfo.surveyDesc.substr(0,70)"></span>
                                                <span style="color:#148ce6" v-text="'...查看全部'" @click.stop="showText(index)"></span>
                                            </span>
                                            <span v-else v-text="item.voteInfo.surveyDesc"></span>
                                        </template>

                                        <template v-else>
                                            <span v-text="item.voteInfo.surveyDesc"></span>
                                        </template>
                                    </div> 
                                </div>
                                
                                
                                <span v-for="(questionItem,questionIndex) in item.voteInfo.questions">
                                  
                                        <!--<div class="vote" style="padding:0.5rem 0rem">-->
                                            <!--<div class="first">-->
                                                <!--<span class="buy"  v-text="questionItem.options[0].optionName" @click="voteBuy(questionItem, item, 0)"></span>-->
                                            <!--</div>-->
                                            <!--<div class="vs"></div>-->
                                            <!--<div class="second">-->
                                                <!--<span class="nobuy" v-text="questionItem.options[1].optionName" @click="voteBuy(questionItem, item, 1)"></span>-->
                                            <!--</div>-->
                                         <!--</div>-->
                                  
                                  <!--只有A,B选项-->
                                    <template v-if="questionItem.options && questionItem.options.length<3">
                                        <div class="vote" style="padding:0.5rem 0rem">
                                            <div class="first">
                                                <!-- <span class="buy"  v-text="questionItem.options[0].optionName"  @click="voteBuy(questionItem.options[0].optionId,item.voteInfo.surveyId,questionItem.questionId,item.voteInfo.surveySceneCode,1)"></span> -->
                                                <span class="buy"  v-text="questionItem.options[0].optionName"  @click="voteBuy(questionItem, item, 0)"></span>
                                            </div>
                                            <div class="vs"></div>
                                            <div class="second">
                                                <!-- <span class="nobuy" v-text="questionItem.options[1].optionName" @click="voteBuy(questionItem.options[1].optionId,item.voteInfo.surveyId,questionItem.questionId,item.voteInfo.surveySceneCode,2)"></span> -->
                                                <span class="nobuy" v-text="questionItem.options[1].optionName" @click="voteBuy(questionItem, item, 1)"></span>
                                            </div>
                                         </div>
                                    </template>
                                    <!--有多个选项选一个-->
                                    <template v-else>
                                        <div class="moreSelect" style="padding:1.5rem 0rem;margin:0">
                                        <!--判断是不是多选一单选questionType=='1' 未选-->
                                           <template v-if="item.voteInfo.questions[0].questionType=='1'">
                                               <span v-for="(itemOp,indexOp) in questionItem.options" @click="moreSelect(item,questionItem,itemOp,indexOp)">
                                                    <!--<div class="list"    :class="{moreActive:i === indexOp}">-->
                                                    <div class="list" :class="{'moreActive':itemOp.active,'remoActive':!itemOp.active}" >
                                                        <div class="tiao one red">
                                                        </div>
                                                        <div class="text" v-text="itemOp.optionName" style="text-align: center;width: 100%;position:absolute;top:0;left:0;margin:0"></div>
                                                        <!--<div class="tick">-->
                                                            <!--<span></span>-->
                                                            <!--<span></span>-->
                                                        <!--</div>-->
                                                    </div>
                                               </span>
                                           </template>    
                                           <!--多选questionType=='2'-->
                                            <template v-else>
                                                 <span v-for="(itemOp,indexOp) in questionItem.options"  @click="muchSelect(item,questionItem,itemOp,indexOp)" v-if="item.voteInfo&&item.voteInfo.complete==false">
                                                     <!--:class="moreActiveIndex == indexOp ? 'moreActive' : ''" -->
                                                     <!--:class="{'moreActive':spanIndex.indexOf(index)>-1}"-->
                                                     <div class="list" :class="{'moreActive':moreActiveIndex.indexOf(itemOp)!=-1}">
                                                        <div class="tiao one red">
                                                        </div>
                                                        <div class="text" v-text="itemOp.optionName" style="text-align: center;width: 100%;position:absolute;top:0;left:0;margin:0"></div>
                                                         <!--<div class="tick">-->
                                                         <!--<span></span>-->
                                                         <!--<span></span>-->
                                                         <!--</div>-->
                                                    </div>
                                                 </span>
                                                 <div class="confirm" @click="confirm(item,questionItem)" :class="{confirmActive:item.active}">投票</div>
                                            </template>
                                        </div>
                                    </template>    
                                       
                                </span>
                            </div>
                            <div class="choice"  v-if="item.voteInfo.complete==true" @click="choiceVote(item)">
                                <!--<template v-for="(items,indexs) in item.voteInfo.optionStats">-->
                                <template v-for="(questionItem, questionIndex) in item.voteInfo.questions">
                                    <template v-if="questionItem.options.length<3">
                                        <div class="choiceVote">
                                            <div>
                                                <span style="width:0.2rem;height:0.75rem;display: inline-block;background:#fb5c5f;margin:0;margin-left:-0.75rem;border-radius: 0 3px 3px 0;float:left" v-show="!!item.voteInfo.surveyTitle"></span>
                                               <!-- <span style="margin-left:0.25rem;margin-top:-0.15rem;display: inline-block;float:left;font-size:0.75rem;font-weight: bold;color:#000;" v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle:''"></span>  -->
                                               <!--20220308添加修改显示3行+'...'-->
                                                <span style="margin-left:0.25rem;margin-top:-0.15rem;display: inline-block;float:left;font-size:0.75rem;font-weight: bold;color:#000;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical" v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle:''"></span>

                                                 <!-- 20220107增加摘要描述     -->
                                                <div style="margin-left:0.25rem;margin-top:-0.15rem;display:block;clear:both;font-size:0.6rem;font-weight: bold;color:#666;padding-top:0.35rem;padding-right: 0.75rem;text-align:justify">

                                                    <template v-if="item.voteInfo.surveyDesc&&activeIndex!==index">
                                                        <span v-if="item.voteInfo.surveyDesc&&item.voteInfo.surveyDesc.length>70">  <!--这里用于70字差不多三行...产看全部-显示-->
                                                            <span v-text="item.voteInfo.surveyDesc.substr(0,70)"></span>
                                                            <span style="color:#148ce6" v-text="'...查看全部'" @click.stop="showText(index)"></span>
                                                        </span>
                                                        <span v-else v-text="item.voteInfo.surveyDesc"></span>
                                                    </template>

                                                    <template v-else>
                                                        <span v-text="item.voteInfo.surveyDesc"></span>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="selectTip" style="margin-top:1.25rem">
                                                <template v-if="item.voteInfo.answerDetails[0].optionId==item.voteInfo.optionStats[0].optionId">
                                                       <div class="active" v-text="'已选  '+item.voteInfo.optionStats[0].optionName+'  ✓'"></div>
                                                       <div v-text="item.voteInfo.optionStats[1].optionName"></div>
                                                </template>
                                                <template v-else>
                                                    <div class="active" v-text="item.voteInfo.optionStats[0].optionName"></div>
                                                    <div  v-text="'已选  '+item.voteInfo.optionStats[1].optionName+'  ✓'"></div>
                                                </template>
        
                                            </div>
                                            <div class="select">
                                                <div class="first" v-text="intoPercent(item.voteInfo.optionStats[0].optionCount,item.voteInfo.optionStats[1].optionCount,index)" :title='item.voteInfo.optionStats[0].optionCount'></div>
                                                <div class="second">
                                                        <template v-if="item.voteInfo.optionStats[0].fenshu!=100">
                                                            <div class="left"  v-if="item.voteInfo.optionStats[0].optionCount!=0" :style="{width: item.voteInfo.optionStats[0].fenshu + '%'}"></div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="left"  v-if="item.voteInfo.optionStats[0].optionCount!=0" :style="{width: item.voteInfo.optionStats[0].fenshu + '%',borderRadius:'50px',borderRight:'none'}"></div>
                                                        </template>
        
                                                        <template v-if="item.voteInfo.optionStats[1].fenshu!=100">
                                                            <div class="right" v-if="item.voteInfo.optionStats[1].optionCount!=0" :style="{width: item.voteInfo.optionStats[1].fenshu + '%'}"></div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="right" v-if="item.voteInfo.optionStats[1].optionCount!=0" :style="{width: item.voteInfo.optionStats[1].fenshu + '%',borderRadius:'50px',borderRight:'none',marginLeft:'0.35rem'}"></div>
                                                        </template>
        
                                                </div>
                                                <!--<div class="four"></div>-->
                                                <div class="four" v-text="intoPercent(item.voteInfo.optionStats[1].optionCount,item.voteInfo.optionStats[0].optionCount,index)" :title='item.voteInfo.optionStats[1].optionCount'></div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                            <div class="moreSelect" style="margin-top:0.75rem;margin:0">
                                                <div>
                                                    <span style="width:0.2rem;height:0.75rem;position: relative;top:0.1rem;left:0.75rem;display: inline-block;background:#fb5c5f;margin:0;margin-left:-0.75rem;border-radius: 0 3px 3px 0;float:left" v-show="!!item.voteInfo.surveyTitle"></span>
                                                    <span style="margin-left:0.5rem;margin-right: 0.5rem;margin-top:-0.15rem;display: inline-block;font-size:0.75rem;font-weight: bold;color:#000;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical" v-text="item.voteInfo.surveyTitle?item.voteInfo.surveyTitle:''"></span>

                                                    <!-- 20220107增加摘要描述     -->
                                                    <div style="clear:both;font-size:0.6rem;font-weight: bold;color:#666;text-align:justify;position:relative;top:0.5rem;left:0.5rem;margin-right: 1rem;padding-bottom:0.85rem">
                                                         <template v-if="item.voteInfo.surveyDesc&&activeIndex!==index">
                                                            <span v-if="item.voteInfo.surveyDesc&&item.voteInfo.surveyDesc.length>70">  <!--这里用于70字差不多三行...产看全部-显示-->
                                                                <span v-text="item.voteInfo.surveyDesc.substr(0,70)"></span>
                                                                <span style="color:#148ce6" v-text="'...查看全部'" @click.stop="showText(index)"></span>
                                                            </span>
                                                            <span v-else v-text="item.voteInfo.surveyDesc"></span>
                                                        </template>

                                                        <template v-else>
                                                            <span v-text="item.voteInfo.surveyDesc"></span>
                                                        </template>
                                                    </div> 
                                                </div>
                                               <!--判断是不是多选一单选 questionType=='1' 已选结果-->
                                               <template v-if="item.voteInfo.questions[0].questionType=='1'">
                                                   <span v-for="(itemOp,indexOp) in questionItem.options">
                                                        <!--<div class="list"    :class="{moreActive:i === indexOp}">-->
                                                        <!--:class="{'moreActive':itemOp.active,'remoActive':!itemOp.active}" -->
    
                                                        <!--给选中的加class:moreActive-->
                                                        <div class="list" :class="{moreActive:item.voteInfo.optionStats[indexOp].optionId==item.voteInfo.answerDetails[0].optionId}">
                                                            <div class="tiao one grey" :style="{width: item.voteInfo.optionStats[indexOp].fenshu + '%'}" :class="{red:item.voteInfo.optionStats[indexOp].optionId==item.voteInfo.answerDetails[0].optionId}">
                                                            </div>
                                                            <div class="tick">
                                                                <span v-text="item.voteInfo.optionStats[indexOp].optionId==item.voteInfo.answerDetails[0].optionId?item.voteInfo.optionStats[indexOp].optionName+'  ✓':item.voteInfo.optionStats[indexOp].optionName"></span>
                                                                <span v-text="percent(item.voteInfo.optionStats[indexOp].fenshu)"></span>
                                                            </div>
                                                            <!--<div class="text" v-text="itemOp.optionName" v-if="item.voteInfo.answerDetails!=null"></div>-->
    
                                                        </div>
                                                   </span>
                                               </template>    
                                               <!--是多选多已选结果-->
                                                <template v-else>
                                                       <span v-for="(itemOp,indexOp) in questionItem.options" v-if="item.voteInfo&&item.voteInfo.complete==true">
                                                            <!--给选中的加class:moreActive-->
                                                            <div class="list" :class="{moreActive:item.voteInfo.optionStats[indexOp].active}">
                                                                <div class="tiao one grey" :style="{width: item.voteInfo.optionStats[indexOp].fenshu + '%'}" :class="{red:item.voteInfo.optionStats[indexOp].active}">
                                                                </div>
                                                                <div class="tick">
                                                                    <span v-text="item.voteInfo.optionStats[indexOp].active?item.voteInfo.optionStats[indexOp].optionName+'  ✓':item.voteInfo.optionStats[indexOp].optionName"></span>
                                                                    <span v-text="percent(item.voteInfo.optionStats[indexOp].fenshu)"></span>
                                                                </div>
                                                                <!--<div class="text" v-text="itemOp.optionName" v-if="item.voteInfo.answerDetails!=null"></div>-->

                                                            </div>
                                                       </span>
                                                       <div class="confirm confirmActive">已投票</div>
                                                </template>
                                            </div>
                                    </template>
                                </template>            
                            </div>
                                      
                        </div>
                        
                        
                        
                        <!-- <div class="article-attach">
                            <div class="attachList" v-show="item.attachments&&item.attachments.length>0" v-for="(aTag,index) in item.attachments">
                                <span class="image" style='margin-left:5px'><img src="./img/attachImage.png" width="40px" height="40px" alt="附件" /></span>
                                <a href='javascript:;' @click="gotoUrl(aTag,'pdf')" class="attachName" v-text="aTag.attachName"></a>
                            </div>
                        </div>--> 
                           <div class="article-attach">
                                        <!-- 需求9153 新增swiper 附件和超链接的轮播图-->
                                        <!-- attachments.length为0时不展示分页器 -->
                                        <div class="swiper-container swiperUrl" v-if='item.attachments.length>0'>
                                            <div class="swiper-wrapper">
                                                <div class="attachList  swiper-slide"
                                                    v-for="(aTag,id) in item.attachments" :key="id">
                                                    <span class="image" style="margin-left: 5px;margin-top: 5px;">
                                                        <img v-if='aTag.attachType==1' src="./img/attachImage.png"
                                                            width="40px" height="40px" alt="附件" />
                                                        <img v-if='aTag.attachType==5' src="./img/urlIcon.png" width="40px"
                                                        height="40px" alt="链接" />
                                                    </span>
                                                    <a v-if='aTag.attachType==1' href='javascript:;' @click="gotoUrl(aTag,'pdf')"
                                                        class="attachName" v-text="aTag.attachName"></a>
                                                    <a v-if='aTag.attachType==5' href='javascript:;' @click="gotoUrl(aTag)"
                                                        class="attachName" v-text="aTag.attachName"></a>
                                               
                                                </div>
                                            </div>
                                            <div   v-if='item.attachments.length>1' class="swiper-pagination swiperurls-pagination" style=""></div>
                                            
                                            <div style=' display: inline-block;clear:both' />
                                        </div>
                            </div>
                        <div class="article-handle">
                            <p @click="thumb(item,index)" :class="{active:item.thumb}">
                                <i></i>
                                <span>{{item.thumbCount}}</span>
                            </p>
                            <!-- 9534 -->
                            <p @click="commentJump(item.postId,item.commentCount)">
                                <i></i>
                                <span>{{item.commentCount}}</span>
                            </p>
                            <p @click="collectPost(item,index)" :class="{active:item.collect}">
                                <i></i>
                                <span>{{item.collect?'取消收藏':'收藏'}}</span>
                            </p>
                            <p @click="handleMore(item)">
                                <span><i></i><i></i><i></i></span>
                            </p>
                        </div>
                        <div class="pop-list" v-show="item.isHandleMore" :data-id="item.postId">
                            <div class="pop-triangle-up"></div>
                            <ul>
                                <!-- <li v-if='item.handleMore_collect' class="active" @click="collectPost(item)"><i></i>取消收藏</li>
                                <li v-else @click="collectPost(item)"><i></i>收藏</li> -->
                                <!-- <li v-if='isApp()' @click="report(item.postId)"><i></i>投诉</li> -->
                                <li @click="reportPost(item.postId)"><i></i>投诉</li>
                                <li v-if='item.handleMore_admin' @click="delPost(item.postId)"><i></i>删除</li>
                            </ul>
                        </div>
                    </article>
                </div>
                <div class="sub-comment" v-if='item.showComment' >
                    <!--9534-->
                    <!--  <ol class="comment-list" v-if="item.commentsList&&item.commentsList.length>0" >
                        <li v-for="comment in item.commentsList" >
                            <span class="uname" @click="gotoUser(comment.userId)">{{comment.nickname?comment.nickname:'admin'}}:</span>
                            <span class="ucomment" @click="reply(comment,index, item)" v-html="comment.content"></span>
                        </li>
                    </ol>-->
                    <!-- <input type="text" placeholder="喜欢就评论"  v-show="isComment!==index"> -->

                    <div class="submit"  @click.stop.prevent="focusComment(item,index)">
                    <input type="text" :placeholder="isComment==index?currentPreset:'喜欢就评论'" autofocus ref="focusbottom" v-model="item.currentComment">  
                    <span @click.stop.prevent="comment(currentMsgData,currentMsgIndex,item)" v-show="isComment==index">发送</span>
                    </div>
                </div>
            </li>
            <template v-if="msgAllData.length>9">
            <div class="reloading" v-show="showLoading">
                <mt-spinner type="fading-circle"></mt-spinner>
                <p>加载中...</p>
            </div> 
            </template>
            </ul>
            
         </mt-loadmore>
        </div>
        <div class="enlarge-img" v-show="isEnlarge" @click.stop="visbiliyImg">
            <div class="swiper-container post-swiper">
                <div class="swiper-wrapper">
                    <div class="swiper-slide detail-slide" v-for="item in currentImgList"><img :src="item.imageUrl" alt=""></div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        
        <!-- 底部弹窗 -->
         <div class="pop">
            <div class="layer0  slideInUp" id="layer1" style="display: none">
                <div style="position: fixed;bottom:0px;width:17.25rem;padding:0 0.75rem">
                    <div class="giftlist giftlist0">
                        <a href="javascript:;">
                            <div class="noTips" @click="cancelVote()">取消投票</div>
                        </a>
                    </div>
                    <div class="close" @click="closeHide()">
                       <a href="javascript:;" style="color:#0070fa;font-size:0.75rem">取消</a>
                    </div>
                </div>
            </div>
         </div>
         <div class="pop-list-back" v-show="isHandleMore" @click.stop.prevent="hideHandleMore">

    </div>
   
    `
})