
// 20220207 安全链路通用fucntion提取

// 交易结果轮询
function tradeAsyncCircleQuery(execResult, countLimit, queryInterval) {
  var count = 1;
  var ajaxHasDone = 0;
  var errorMsg = '';
  var setIntervalID = setInterval(function () {
      if (count >= countLimit) { // 轮询结束
          clearInterval(setIntervalID);
      }
      count++;
      $.ajax({
          url: '/' + execResult.tradeAsyncQueryUrl,
          contentType: 'application/json',
          data: {serialNo: execResult.ecTradeSerialNo},
          dataType: 'json',
          success: function (ecTradeResult) {
              if (ecTradeResult.returnCode == 0 && ecTradeResult.body.status == '0000') { // 轮询结束
                  ecTradeResult.body.remark && utils.setSession(utils.successInfo, ecTradeResult.body.remark);
                  utils.loadingHide();
                  clearInterval(setIntervalID);
                  var forwordUrl = utils.getSession(utils.serialNo_forword_url);
                  // 20210726 顺风车修改
                  // if (forwordUrl) {
                  //     window.location.href = forwordUrl;
                  // }
                  if (forwordUrl) {
                      var ecTradeSerialNo = execResult.ecTradeSerialNo;
                      var balanceSerialNo = ecTradeResult.body.balanceSerialNo;
                      var tempStr = '';
                      tempStr = tempStr + (ecTradeSerialNo?('&serialNo='+ecTradeSerialNo):'');
                      tempStr = tempStr + (balanceSerialNo?('&balanceSerialNo='+balanceSerialNo):'');
                      if(tempStr){
                          if(~forwordUrl.indexOf('?')) {
                              window.location.href = forwordUrl+tempStr;
                          } else {
                              window.location.href = forwordUrl+'?'+tempStr.slice(1);
                          }
                      } else {
                          window.location.href = forwordUrl;
                      }
                  }


              }
              else {
                  ajaxHasDone++;
                  errorMsg = ecTradeResult.body.remark;
              }
          },
          error: function(){
              ajaxHasDone++;
          },
          complete: function () {
              if (ajaxHasDone >= countLimit) { // 轮询失败
                  utils.loadingHide();
                  clearInterval(setIntervalID);
                  $('.text-center').text(errorMsg ? errorMsg :'交易处理中，请稍后查询交易结果');
                  $('.Bomb-box').show();
                // 20220608 轮询3次后展示弹窗交易处理中，点击确定按钮跳转到交易记录页面 S
                $('.Bomb-box-ok').click(function(){
                    window.location.href = '/mobileEC/wap/trade/tradeList.html';
                })
                // 20220608 轮询3次后展示弹窗交易处理中，点击确定按钮跳转到交易记录页面 E

              }
          }
      });
  }, queryInterval);
}

// 资产证明申请结果轮询
function assetCertAsyncCircleQuery(execResult, countLimit, queryInterval) {
  var count = 1;
  var ajaxHasDone = 0;
  var errorMsg = '';
  var setIntervalID = setInterval(function () {
      if (count >= countLimit) { // 轮询结束
          clearInterval(setIntervalID);
      }
      count++;
      $.ajax({
          url: '/assetcenter/v2/certification/status',
          contentType: 'application/json',
          data: {applyNo: execResult.extendFields.applyNo},
          dataType: 'json',
          success: function (assetCertResult) {
              // CertifiStatus {
              //     applyNo (string, optional): 申请编号 ,
              //     filePath (string, optional): 文件路径(成功时返回) ,
              //     status (string, optional): 申请状态(I-处理中 F-失败 S-成功 D-已失效) ,
              //     statusMsg (string, optional): 状态描述
              // }
              if (assetCertResult.returnCode == 0 && assetCertResult.body.status !== 'I') { // 轮询结束
                  // assetCertResult.body && utils.setSession(utils.successInfo, assetCertResult.body);  // 暂时不需要
                  utils.loadingHide();
                  clearInterval(setIntervalID);
                  var forwordUrl = utils.getSession(utils.serialNo_forword_url);
                  if (forwordUrl) {
                      window.location.href = forwordUrl;
                  }
              }
              else {
                  ajaxHasDone++;
                  errorMsg = assetCertResult.body.statusMsg;
              }
          },
          error: function(){
              ajaxHasDone++;
          },
          complete: function () {
              if (ajaxHasDone >= countLimit) { // 轮询失败
                  utils.loadingHide();
                  clearInterval(setIntervalID);
                  $('.text-center').text(errorMsg ? errorMsg :'资产申请处理中，请稍后查询结果');
                  $('.Bomb-box').show();
              }
          }
      });
  }, queryInterval);
}