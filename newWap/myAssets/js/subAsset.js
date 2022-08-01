$(function () {
    // query值
    var productId = getUrlParam('productId');
    var classify = getUrlParam('classify');
    getList(productId,classify);
    // 基金，组合，资管页面跳转
    $(document).on('click','.fund-list',function(){
        console.log('123');
        var dataItem= decodeURIComponent($(this).attr('data-item'));
        // console.log(dataItem);
        // return;
        var type=$(this).attr('data-type');
        // console.log(type,'type');
        var productId=$(this).attr('data-id');
        // console.log(productId,'productId');
        var balanceSerialNo=$(this).attr('data-balanceSerialNo');
        // console.log(balanceSerialNo);
        var storage=window.sessionStorage;
        storage.setItem("_selected_fund", dataItem);
        // return;
        switch(type){
            case '02':
                window.location.href='/mobileEC/wap/fund/fund_holding_detail_new.html?fundId='+productId;
                break;
            case '03':
                window.location.href='/mobileEC/wap/fundgroup/hold_group_fund_details.html?groupId='+productId+'&balanceSerialNo='+balanceSerialNo;
                break;
            case '04':
                window.location.href='/mobileEC/prdPagesNew/topFinancialDetail.html?productId='+productId+'&balanceSerialNo='+balanceSerialNo;
                break;    
        }
    })
})


// getXjbList获取现金宝数据
function getList(productId,classify) {
    $.ajax({
        url: '/assetcenter/v1/view/list/share',
        data:{
            assetMode:'1',
            productId:productId,
            // productId:'470028',
            currencyType:'156',
            classify:classify
        },
        
        success: function (res) {
            // console.log(res, 'xjb');
            if (res.returnCode === 0) {
                var allData = res.body;
                var shareItem = res.body.shareItems;
                var html = '';
                html += `
                <div class="sub-card">
                <div class="card-title">
                    <div class="title-r" >
                        <span class="title_text1">${shareItem[0].productName}</span>
                        <span class="title_text2">${shareItem[0].productId}</span>
                    </div>
                    <img class="title-l" src="./img/arrow.png" >
                </div>
                <div class="card-detail">
                    <div class="total-balance" >
                        总资产（元）
                    </div>
                    <div class="balance-num">
                        ${allData.totalBalance}
                    </div>
                    <div class="fields">
                        <div class="fields-c" >
                            <span class="fields-text1">${allData.fields[0].title?allData.fields[0].title:'--'}</span>
                            <span class="fields-text2" style="color:${allData.fields[0].color}">${allData.fields[0].value?allData.fields[0].value:'--'}</span>
                        </div>
                         <div class="fields-c" >
                            <span class="fields-text1">${allData.fields[1].title?allData.fields[1].title:'--'}</span>
                            <span class="fields-text2" style="color:${allData.fields[1].color}">${allData.fields[1].value?allData.fields[1].value:'--'}</span>
                        </div>
                    </div>
                </div>
            </div>
                `;
                html+=`
                <div class="content-title" >
                ${allData.title?allData.title:'--'}
            </div>
                `;
                shareItem.forEach(function(item){
                    html+=`
                <div class="fund-list" data-item="${encodeURIComponent(JSON.stringify(item))}" data-type="${allData.productType}" data-balanceSerialNo="${item.assetSerialNo}" data-id="${item.productId}">
                <div class="fund-title" >
                    <div class="title-r clearfix" style="width:94%">`;
                    if(item.shareName.length>16){
                       html+= `<span class="title_text1 fl">${item.shareName.slice(0,15)}...</span>`
                    }else{
                        html+=`<span class="title_text1 fl">${item.shareName}</span>`
                    }
                        
                    if(item.tag){
                        html+=`<span class="title_text2 fr" style="margin-top:2px">${item.tag}</span>`
                    }
                        
                   html+= `</div>
                    <img class="title-l" src="./img/arrow.png" >
                </div>
                <div class="fund-table">
                `
                if(item.fields[0]){
                    html+=`<div class="table-box">
                        <span class="box-text1 text-left" >${item.fields[0].title}</span>
                        <span class="box-text2 text-left" style="color:${item.fields[0].color}">${item.fields[0].value}</span>
                    </div>`
                }else{
                    html+=`<div class="table-box">
                        <span class="box-text1 text-left" ></span>
                        <span class="box-text2 text-left"></span>
                    </div>`
                }
                if(item.fields[1]){
                    html+= `
                    <div class="table-box">
                        <span class="box-text1 text-center">${item.fields[1].title}</span>
                        <span class="box-text2 text-center" style="color:${item.fields[1].color}">${item.fields[1].value}</span>
                    </div>
                    `
                }else{
                    html+= `
                    <div class="table-box">
                        <span class="box-text1 text-center"></span>
                        <span class="box-text2 text-center" ></span>
                    </div>
                    `
                }
                if(item.fields[2]){
                    html+= `
                    <div class="table-box">
                    <span class="box-text1 text-right">${item.fields[2].title}</span>
                     <span class="box-text2 text-right" style="color:${item.fields[2].color}">${item.fields[2].value}</span>
                 </div>
                    `
                }else{
                    html+= `
                    <div class="table-box">
                    <span class="box-text1 text-right"></span>
                     <span class="box-text2 text-right"></span>
                 </div>
                    `
                }
                if(item.fields[3]){
                    html+= `
                    <div class="table-box mbottom-40t">
                        <span class="box-text1 text-left">${item.fields[3].title}</span>
                        <span class="box-text2 text-left" style="color:${item.fields[3].color}"> ${item.fields[3].value}</span>
                    </div>
                    `
                }else{
                    html+= `
                    <div class="table-box mbottom-40t">
                        <span class="box-text1 text-left"></span>
                        <span class="box-text2 text-left"></span>
                    </div>
                    `
                }
                if(item.fields[4]){
                    html+= `
                    <div class="table-box mbottom-40t">
                        <span class="box-text1 text-center">${item.fields[4].title}</span>
                        <span class="box-text2 text-center" style="color:${item.fields[4].color}">${item.fields[4].value}</span>
                    </div>
                    `
                }else{
                    html+= `
                    <div class="table-box mbottom-40t">
                        <span class="box-text1 text-center"></span>
                        <span class="box-text2 text-center"></span>
                    </div>
                    `
                }
                if(item.fields[5]){
                    html+= `
                    <div class="table-box mbottom-40t">
                        <span class="box-text1 text-right">${item.fields[5].title}</span>
                        <span class="box-text2 text-right" style="color:${item.fields[5].color}">${item.fields[5].value}</span>
                    </div>
                    `
                }else{
                    html+= `
                    <div class="table-box mbottom-40t">
                        <span class="box-text1 text-right"></span>
                        <span class="box-text2 text-right"></span>
                    </div>
                    `
                }
                     html+=`</div>`;
                if(allData.tip){
                    html+=`<div class="fund-tip" >
                    ${allData.tip}
                </div>
                <div class="fund-blank" ></div>
                `;
                }
                html+='</div>';
                });
                $('.content').html(html);
            }
            else if(res.returnCode === 1000){
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                jumpLogin();
            }  
            else {
                $('.Bomb-box-content p').text(res.returnMsg);
                $('.Bomb-box').show();
                return false;
            }

        }
    })
}



// 公共方法

// get queryParam
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return '';
}
// 千分符format
function symbolFormat(val) {
    if (val) {
        val = val.toString();
    }
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
// 日期format
function formatDate(val) {
    var value = val;
    if (value) {
        value = value.slice(4).split('')[0] + value.slice(4).split('')[1] + '-' + value.slice(4).split('')[2] + value.slice(4).split('')[3];
        return value;
    } else {
        return '--'
    }
}

// 跳转登陆
function jumpLogin(){
    window.location.href="/mobileEC/wap/login/login.html?referUrl=/tradeh5/newWap/myAssets/asset.html"
}