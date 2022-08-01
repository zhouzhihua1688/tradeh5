var vm=new Vue({
  el: '#app',
  data() {
    return {
      tabbarText: ['赎回', '转换'],
      tabCurrentIndex: 1,
      quickRedeem:0, //0普通赎回,1快速赎回
      fundQuickRedeemSwitch: false, //快赎灰度开关
      canFastRedeem:false, //基金是否支持快速赎回
      balanceSerialNo: '',//基金持有详情
      redeemShow:true,
      // 转换部分所用数据
      convertDetail:[],
      branchNo:'247',
      transferInfundDetail:'',
      selectedFund:'',
      topTip:'',
      // 是否转购
      transferPurchase:'',
      // 估算内容
      feeTip:'',
      // 转换的份额
      convertQuty:'',
      // 最终提交时的转换份额
      finaConvertQuty:'',
      // 节流时间变量
      finallyTime:null,
      // 最大转换份额
      maxConvertQuty:'',
      // 最大限额
      largeRedeemFlag:'0',
      // 提交转换的flag
      nextFlag:false,
      confirmTipShow:false,
      purchaseStatus:'',
      convertTips:'',
      confirmTipOption:{
        text:'',
        btn1:'',
        btn2:''
      },
      percentValue:'',
      // fundContractList协议列表
      fundContractList:[],
      agreementList:[]
    }
  },
  methods: {
    formatMoney:App.formatMoney,
    tabClick(index) {
      this.tabCurrentIndex = index
    },
    // 赎回copy代码
    redeemAllFc() {
      // 赎回的全部逻辑
      var branchNo = '247';
      var tradeAcco = '';
      //赋值
      function queryFundDetail() {
        var item = App.getSession(App.selectedFund);
        App.get(item.api, null, function (result) {
          var item2 = result.body;

          if (item2 != undefined && item2 != null) {
            branchNo = item2.branchCode;
            document.title = item2.fundName;
            $("#fundId").val(item2.fundId);
            $("#title").html(item2.fundName);
            $("#shareType").val(item2.shareType);
            $("#currencyType").val(item2.currencyType);
            tradeAcco = item2.tradeAcco;
            $("#unionBalance").html(item2.marketValue == 0 ? "0.00" : App.formatMoney(item2.marketValue));
            $("#balance").html(item2.balanceQuty == 0 ? "0.00" : App.formatMoney(item2.balanceQuty));
            $("#avaliable").html(item2.availableQuty == 0 ? "0.00" : App.formatMoney(item2.availableQuty));
          }
        });
      }
      queryFundDetail();
      queryDate();

      //查询到账日期
      function queryDate() {
        var url = "/mobile-bff/v1/fund/fund-redeem-date?cashFrm=V&fundId=" + App.getUrlParam("fundId");
        App.get(url, null, function (result) {
          if (result.body != undefined && result.body != null) {
            $("#date").html(result.body.remark);
            $("#date").children("font").removeAttr("size");
          }
        });
      }

      $(function () {
        if(utils.isProdEnv()){
          $("#tradeRule").attr("href", "https://www.99fund.com/main/products/pofund/" + App.getUrlParam("fundId") + "/h5traderule.shtml");
          $("#quickRedeemtradeRule").attr("href", "https://www.99fund.com/main/products/pofund/" + App.getUrlParam("fundId") + "/h5traderule.shtml");
          $("#quickRedeemRule").attr("href", "https://static.99fund.com/mobile/common/quickRedeemRule.html");
          $("#quickredeem_agreement").attr("href", "https://static.99fund.com/mobile/agreement/quickredeem_agreement.html");
          $("#quickredeem_notice").attr("href", "https://static.99fund.com/mobile/agreement/quickredeem_notice.html");
        }
        else{
          $("#tradeRule").attr("href", "http://wwwdev.99fund.com.cn:8001/main/products/pofund/" + App.getUrlParam("fundId") + "/h5traderule.shtml");
          $("#quickRedeemtradeRule").attr("href", "http://wwwdev.99fund.com.cn:8001/main/products/pofund/" + App.getUrlParam("fundId") + "/h5traderule.shtml");
          $("#quickRedeemRule").attr("href", "http://10.50.115.48/mobile/common/quickRedeemRule.html");
          $("#quickredeem_agreement").attr("href", "http://10.50.115.48/mobile/agreement/quickredeem_agreement.html");
          $("#quickredeem_notice").attr("href", "http://10.50.115.48/mobile/agreement/quickredeem_notice.html");
        }
        var windowHeight = $(window).height(),
          footerHeight = $(".footer-tips").height(),
          contentHeight = $(".content").height();
        if (contentHeight > windowHeight - 60) {
          $(".footer-tips").css({
            "marginTop": "1rem",
            "opacity": 1
          })
        } else {
          $(".footer-tips").css({
            "position": "absolute",
            "top": windowHeight - footerHeight,
            "marginTop": "0",
            "opacity": 1
          })
        }

        App.bind("#shuhuiBank", "tap", function() {
          $("#selected_card_panel").show();
          $("#app").hide();
        });

        $("#fast").click(function () {
          $("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "") - 10));
          $(".first").hide();
        });
        $(".two").click(function () {
          console.log($("#avaliable").html());
          $("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "") / 2));
          $(".first").hide();
        });
        $(".third").click(function () {
          console.log($("#avaliable").html());
          $("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "") / 3));
          $(".first").hide();
        });

        $(".two_quick").click(function () {
          $("#quickRedeemAmt").val(App.formatMoney($("#quickAmt").val().replace(/,/g, "") / 2));
          queryRedeemFeeTips();
        });
        $(".third_quick").click(function () {
          $("#quickRedeemAmt").val(App.formatMoney($("#quickAmt").val().replace(/,/g, "") / 3));
          queryRedeemFeeTips();
        });

        $('.checkBox').on('click', function () {
          if ($(this).attr('src') === '../images/checkBox.png') {
              $(this).attr('src', '../images/checked.png');
            } else {
              $(this).attr('src', '../images/checkBox.png')
            }
        })
      });

      // $(".Bomb-box-ok").click(function () {
      //   $(".Bomb-box").hide();
      // });



      $(".giftlist a").on("click", function (event) {
        $("#tl").html($(this).children(".title").html());
        $("#largeRedeemFlag").val($(this).children(".title").attr('data'));
        $("#myGift1").hide();
        $(".new-mask").hide();
      })


      $(".close_button").click(function () {
        $("#myGift").hide();
        $(".mask").hide();
      });
      // 清楚input框
      $(".clearInput").click(function () {
        $(this).siblings("input").val("").trigger("input");
      });

      function valide(isAlert) {
        var inputs = $("input");
        for (var i = 0; i < inputs.length; i++) {
          var input = inputs.eq(i);
          if (input.val() == "") {
            var msg = input.attr("data-rquire-msg");
            if (msg == undefined) {
              continue;
            }
            isAlert == "needless" || alertTips(input.attr("data-rquire-msg"));
            return false;
          }
        }
        return true;
      }

      $("#subQuty").on("input", function () {
        var amt = $("#subQuty").val().replace(/[,A-z]/g, '');

        if (amt.indexOf('.') > -1) { //带小数
          if (/^[0-9]+(.[0-9]{1,2})?$/.test(Number(amt))) {

          } else {
            $("#subQuty").val(amt.substr(0, amt.indexOf('.') + 3));
          }

        } else if (/^[0-9]+?$/.test(String(amt))) {

        } else {
          alertTips("金额格式有误");
          return;
        }
        if (Number($("#avaliable").html().replace(/,/g, "")) < Number(amt)) {
          alertTips("不能最大赎回金额" + $("#avaliable").html().replace(/,/g, "") + "元");
          return;
        }
      });

      function alertTips(text) {
        $(".Bomb-box-tips").html(text);
        $(".Bomb-box-content p").html("");
        $(".convert-box").show();
      }

      //查询快速赎回费用相关信息
      function queryRedeemFeeTips() {
        var amt = $("#quickRedeemAmt").val().replace(/[,A-z]/g, '');

        if (amt == ''){
          $("#estimateRedeemFeeTip").html('');
          $("#quickRedeemQuty").val('');
          return;
        }
    
        if (amt.indexOf('.') > -1) { //带小数
          if (/^[0-9]+(.[0-9]{1,2})?$/.test(Number(amt))) {
    
          } else {
            $("#quickRedeemAmt").val(amt.substr(0, amt.indexOf('.') + 3));
          }
    
        } else if (/^[0-9]+?$/.test(String(amt))) {
    
        } else {
          this.alertTips("金额格式有误");
          return;
        }

         var selectedCard = App.getSession(App.selectedCard);
         var data= JSON.stringify({
             "bankAcco": selectedCard.bankAcco,
             "quickRedeem": "1",
             "quickRedeemAmt": Number($("#quickRedeemAmt").val().replace(/,/g, "")),
             "fundId":utils.getUrlParam("fundId"),
             "balanceSerialNo": $("#balanceSerialNo").val()
           });


           $.ajax({
            url:"/mobile-bff/v1/fund/redeem-fee-tips/estimate",
            type:"POST",
            data:data,
            dataType: "json",
            contentType: 'application/json',
            success:function(result){
              if (result.returnCode == 0 && result.body) {
                var estimateRedeemFeeTip = result.body.estimateRedeemFeeTip;
                var calculateUrl = result.body.calculateUrl;
                var key = "contentKey";
                var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
                var r = calculateUrl.match(reg);
                var contentKey = '';
                if (r != null) {
                  contentKey= decodeURIComponent(r[2]);
                }
      
                var url = "/mobile-bff/v1/unification/query?keys="+contentKey;
                utils.get(url,null,function(result){
                    if(result.body && result.body.fundQuickRedeemCalculateTips){
                        var fundQuickRedeemCalculateTips = result.body.fundQuickRedeemCalculateTips;
                        unificationValue = fundQuickRedeemCalculateTips.unificationValue ? fundQuickRedeemCalculateTips.unificationValue: '';
                        $("#fundQuickRedeemCalculateTips").val(unificationValue);
                    }
                })   
      
                estimateRedeemFeeTip = estimateRedeemFeeTip.replace("htffundxjb://action?type=appDialog&subType=plaintext&contentKey=fundQuickRedeemCalculateTips","javascript:");
                $("#estimateRedeemFeeTip").html(estimateRedeemFeeTip);
                $("#quickRedeemQuty").val(result.body.quickRedeemQuty);
                $("#estimateMsg").val('');
                var clickTip = document.getElementById('estimateRedeemFeeTip').getElementsByTagName('a')[0];
                clickTip.onclick = function(){
                  utils.showTips($("#fundQuickRedeemCalculateTips").val());
                }
              }
              else{
               $("#estimateRedeemFeeTip").html('');
               $("#quickRedeemQuty").val('');
               $("#estimateMsg").val(result.returnMsg);
              }
            },
            error:function(result) {
                alertTips('当前服务或网络异常，请稍后重试')
            }
        })

       }

      //快赎留痕
      function riskMark(){
        var params={
          accptMd: "WAP",
          agreementList: [
            "QUICK_REEDEM","QUICK_REEDEM_NOTICE"
          ]
        }
        utils.ajax({
            url: '/icif/v1/agreements/add',
            type: 'POST',
            data: params,
            success: function (result) {
                if (result.returnCode === 0) {
                    console.log(result);
                } 
            }
        })
      }

      $("#selectGift1").click(function () {
        $("#myGift1").show();
        $(".new-mask").show();
      })
      $("#close1").click(function () {
        $("#myGift1").hide();
        $(".new-mask").hide();
      })
      //提交赎回按钮事件
      $("#submit_btn").click(function () {
        var quickRedeem = $('#quickRedeem').val();

        if (Number($("#subQuty").val().replace(/,/g, "")) == 0 && !quickRedeem) {
          alertTips("赎回金额应大于0"); 
          return;
        }
        if (!/^[0-9]+(.[0-9]{1,2})?$/.test($("#subQuty").val().replace(/,/g, "")) && !quickRedeem) {
          alertTips("金额格式不对"); 
          return;
        }

        if ($(".confirm>a").css('backgroundColor') === 'rgb(221, 214, 214)' && quickRedeem) {
          return;
        }

        if (Number($("#quickRedeemAmt").val().replace(/,/g, "")) == 0 && quickRedeem) {
          alertTips("赎回金额应大于0"); 
          return;
        }
        if (!/^[0-9]+(.[0-9]{1,2})?$/.test($("#quickRedeemAmt").val().replace(/,/g, "")) && quickRedeem) {
          alertTips("金额格式不对"); 
          return;
        }
        if ($(".checkBox").attr('src') === '../images/checkBox.png'&& quickRedeem) {
          alertTips("请选择勾选协议"); 
          return;
        }
        if ($("#estimateMsg").val()&& quickRedeem) {
          alertTips($("#estimateMsg").val()); 
          return;
        }
        var data = {};
        var selectedCard = App.getSession(App.selectedCard);

        // var url = App.projectNm + "/fund/fund_redeem";
        var url = '/mobile-bff/v1/fund/fund-redeem';
        if(!quickRedeem){ //普通赎回
          data = {
            "fundId": $("#fundId").val(),
            "shareType": $("#shareType").val(),
            "cashFrm": "V",
            "subQuty": $("#subQuty").val().replace(/,/g, ""),
            "largeRedeemFlag": $("#largeRedeemFlag").val(),
            "currencyType": $("#currencyType").val(),
            "branchNo": branchNo,
            "bankNo": "",
            "bankAcco": "",
            "tradeAcco": tradeAcco
          };
        } 
        else{ //快速赎回
          riskMark();
          data = {
            "fundId": $("#fundId").val(),
            "shareType": $("#shareType").val(),
            "cashFrm": "B",
            "subQuty": $("#quickRedeemQuty").val(),
            "largeRedeemFlag": 0,
            "currencyType": $("#currencyType").val(),
            "branchNo": branchNo,
            "bankNo": selectedCard.bankNo,
            "bankAcco": selectedCard.bankAcco,
            "tradeAcco": tradeAcco,
            "quickRedeem": '1',
            "subAmt": Number($("#quickRedeemAmt").val().replace(/,/g, "")), 
          };
        }

        App.setSession("quicksubAmt", App.formatMoney($("#quickRedeemAmt").val().replace(/,/g, "")));
        var serialNo_forword_url = "/mobileEC/wap/fund/redeemsuccess.html" + (quickRedeem?"?type=quick" :"");

        utils.post(url, JSON.stringify(data), null, function (result) {
          App.setSession(App.serialNo_info, result.body.info);
          App.setSession(App.serialNo, result.body.serialNo);
          App.setSession(App.serialNo_success_show_data, data);
          App.setSession(App.serialNo_forword_url, serialNo_forword_url);
          // window.location.href = "../common/setPassword.html";
          utils.verifyTradeChain(result.body);
        });
      });
      $("#all").click(function () {
        $("#subQuty").val($("#avaliable").html());
        if (Number($("#avaliable").html().replace(/,/g, "") - 10) > 0) {
          $(".first").show();
        }
      });

      $("#all_quick").click(function () {
        $("#quickRedeemAmt").val(App.formatMoney($("#quickAmt").val().replace(/,/g, "")));
        queryRedeemFeeTips();
      });

      $("#close").click(function () { //删值
        $('.bifen div').each(function () { //切换
          if ($(this).hasClass("active")) {
            $(this).removeClass('active');
          }

        });
        $("#subQuty").val("");
      })

      $("#close_quick").click(function () { //删值
        $('.bifen div').each(function () { //切换
          if ($(this).hasClass("active")) {
            $(this).removeClass('active');
          }

        });
        $("#quickRedeemAmt").val("");
        queryRedeemFeeTips();

      })

      $('.bifen div').click(function () { //切换
        if ($(this).hasClass("active")) {
          return;
        }
        $(this).addClass("active").siblings().removeClass('active');

      });
      $('.tips span').eq(0).on('click', function () { //关闭弹窗
        $('.tips').hide()

      })
      $(".icon").click(function () {
        $('.tips').show()
      })
      queryTips()


      function queryTips() {
        var url = "/mobile-bff/v1/smac/tradeTips?sceneCode=02&r=" + (new Date()).getTime();
        App.get(url, null, function (result) {
          var body = result.body;
          if (body != null && body != undefined) {
            if (App.isNotEmpty(body.tradeRules)) {
              $(".tips_text").html(body.tradeRules);
              App.bind("#viewMore", "tap", function () {
                window.location.href = body.smacH5UpgradeJumpUrl;
              })
            } else {
              $(".icon").hide();
              $(".tips").hide();
            }
          } else {
            $(".icon").hide();
            $(".tips").hide();
          }
        });
      }

      function save() {
        $.ajax({
          url: '/mobile-bff/v1/financial/set-redeem-type',
          data: {
            fundId: fundId
          },
          method: 'POST',
          beforeSend:function(req){
            if(utils.getCookie('traceCode')){
              req.setRequestHeader("X-TraceCode", utils.getCookie('traceCode'));
            }
          },
          success: function (res) {
            var fundInfo = res.body;
            fundType = fundInfo.filterFundTp;
            callback(fundType);
          },
          finally: function (error) {
            console.log(error)
          }
        })
      }
    },
    
    switchQuickRedeem(number){
      this.quickRedeem = number;
      $("#quickRedeem").val(number);
      if(number == '0'){
        $("#normalRedeemLabel").css('background', 'url(../images/account/sel2.png) no-repeat left center');
        $("#normalRedeemLabel").css('background-size', '0.5rem');
        $("#quickRedeemLabel").css('background', 'url(../images/account/sel.png) no-repeat left center');
        $("#quickRedeemLabel").css('background-size', '0.5rem');
        $(".confirm>a").css("background", '#fd7e23');        
      }
      else if(number == '1'){
        $("#normalRedeemLabel").css('background', 'url(../images/account/sel.png) no-repeat left center');
        $("#normalRedeemLabel").css('background-size', '0.5rem');
        $("#quickRedeemLabel").css('background', 'url(../images/account/sel2.png) no-repeat left center');
        $("#quickRedeemLabel").css('background-size', '0.5rem');
        if($("#quickRedeemTimes").val()>0 && $("#quickAmt").val()>0){
          $(".confirm>a").css("background", '#fd7e23');
        } 
        else{
          $(".confirm>a").css("background", '#ddd6d6');
        }
      }
    },

    //查询债基快赎灰度开关
    queryQuickRedeemSwitch () {
      var url = "/res/v1/layout-switch/funcmod-switch?layoutIds=fundQuickRedeemSwitch";
      utils.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
          this.fundQuickRedeemSwitch = result.body.fundQuickRedeemSwitch? true: false;
        }
      }.bind(this));
    },

    //查询债基快赎信息
    queryRedeemFund () {
      var data={"fundId":utils.getUrlParam("fundId")}
      var url = "/mobile-bff/v1/fund/detailInfo";
      utils.post(url, data, function (result) {
        if (result.body != undefined && result.body != null) {
          this.canFastRedeem = result.body.quickRedeem=='Y' ? true : false;
        }
      }.bind(this));
    },
    
    //查询快速赎回费用相关信息
   queryRedeemFeeTips() {
    var amt = $("#quickRedeemAmt").val().replace(/[,A-z]/g, '');

    if (amt == ''){
      $("#estimateRedeemFeeTip").html('');
      $("#quickRedeemQuty").val('');
      return;
    }

    if (amt.indexOf('.') > -1) { //带小数
      if (/^[0-9]+(.[0-9]{1,2})?$/.test(Number(amt))) {

      } else {
        $("#quickRedeemAmt").val(amt.substr(0, amt.indexOf('.') + 3));
      }

    } else if (/^[0-9]+?$/.test(String(amt))) {

    } else {
      this.alertTips("金额格式有误");
      return;
    }

      var selectedCard = App.getSession(App.selectedCard);
      var data= JSON.stringify({
          "bankAcco": selectedCard.bankAcco,
          "quickRedeem": "1",
          "quickRedeemAmt": Number($("#quickRedeemAmt").val().replace(/,/g, "")),
          "fundId":utils.getUrlParam("fundId"),
          "balanceSerialNo": $("#balanceSerialNo").val()
        });

        $.ajax({
          url:"/mobile-bff/v1/fund/redeem-fee-tips/estimate",
          type:"POST",
          data:data,
          dataType: "json",
          contentType: 'application/json',
          success:function(result){
            if (result.returnCode == 0 && result.body) {
              var estimateRedeemFeeTip = result.body.estimateRedeemFeeTip;
              var calculateUrl = result.body.calculateUrl;
              var key = "contentKey";
              var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
              var r = calculateUrl.match(reg);
              var contentKey = '';
              if (r != null) {
                contentKey= decodeURIComponent(r[2]);
              }
    
              var url = "/mobile-bff/v1/unification/query?keys="+contentKey;
              utils.get(url,null,function(result){
                  if(result.body && result.body.fundQuickRedeemCalculateTips){
                      var fundQuickRedeemCalculateTips = result.body.fundQuickRedeemCalculateTips;
                      unificationValue = fundQuickRedeemCalculateTips.unificationValue ? fundQuickRedeemCalculateTips.unificationValue: '';
                      $("#fundQuickRedeemCalculateTips").val(unificationValue);
                  }
              })   
    
              estimateRedeemFeeTip = estimateRedeemFeeTip.replace("htffundxjb://action?type=appDialog&subType=plaintext&contentKey=fundQuickRedeemCalculateTips","javascript:");
              $("#estimateRedeemFeeTip").html(estimateRedeemFeeTip);
              $("#quickRedeemQuty").val(result.body.quickRedeemQuty);
              $("#estimateMsg").val('');
              var clickTip = document.getElementById('estimateRedeemFeeTip').getElementsByTagName('a')[0];
              clickTip.onclick = function(){
                utils.showTips($("#fundQuickRedeemCalculateTips").val());
              }
            }
            else{
             $("#estimateRedeemFeeTip").html('');
             $("#quickRedeemQuty").val('');
             $("#estimateMsg").val(result.returnMsg);
            }
          }.bind(this),
          error:function(result) {
              alertTips('当前服务或网络异常，请稍后重试')
          }
      })
    },

    // 转换部分代码
    getTopInfo(){
      // /v1/fund/getFundConvertInfo
      utils.ajax({
        url:'/mobile-bff/v1/fund/getFundConvertInfo?productId='+this.transferInfundDetail.fundId,
        success: function (result) {
            if (result.returnCode === 0) {
              this.topTip = result.body;
            }
        }.bind(this)
      })
    },

    queryCard(successFun) {
      var url = "/mobile-bff/v1/pay/pay-bank-list?currencyType="+$("#currencyType").val()+"&tradeType=12&tradeScene=11&fundId="+ App.getUrlParam("fundId")+"&balanceSerialNo="+this.balanceSerialNo;
      utils.get(url, null, function (result) {
        var payCards = result.body.bankInfos;
        var cards = payCards.filter(function(item){
          return item.bankGrpName != '现金宝';
        });
        App.setSession(App.cards, cards);
        if(App.isFunction(successFun)){
          eval(successFun).call(this);
        }
      });
    },

    queryBondFundRedeemTips(){
      var url = "/mobile-bff/v1/fund/bond-fund-redeem-tips?balanceSerialNo="+$("#balanceSerialNo").val()+"&fundId=" + App.getUrlParam("fundId");
      App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
          $("#normalRedeemTips").html(result.body.normalRedeemTips);
          $("#quickRedeemTips").html(result.body.quickRedeemTips);
          var quickRedeemTimes = result.body.quickRedeemTimes;
          $("#quickRedeemTimes").val(quickRedeemTimes);
          if ((quickRedeemTimes <= 0 || $("#quickAmt").val()<=0) && $("#quickRedeem").val() == 1){ //剩余赎回次数小于等于0
            $(".confirm>a").css("background", '#ddd6d6');
          }
          else if($("#quickRedeem").val() == 1){
            $(".confirm>a").css("background", '#fd7e23');
          }
        }
      });
    },
    queryFundDetail(){
      var item = App.getSession(App.selectedFund);
      this.selectedFund = App.getSession(App.selectedFund);
      // console.log(item);
      App.get(item.api, null, function (result) {
        var item2 = result.body;

        if (item2 != undefined && item2 != null) {
          document.title = item2.fundName;
          this.branchNo = item2.branchCode;
          this.convertDetail = item2;
          this.maxConvertQuty = item2.availableQuty;
          this.balanceSerialNo = item2.serialNo;
          $('#balanceSerialNo').val(item2.serialNo);
          this.queryCard(function() {
            setFirstUsingCard();
            initCardList()
          });
          this.queryBondFundRedeemTips();
          // $("#shareType").val(item2.shareType);
          // $("#currencyType").val(item2.currencyType);
          // tradeAcco = item2.tradeAcco;
          // $("#unionBalance").html(item2.marketValue == 0 ? "0.00" : App.formatMoney(item2.marketValue));
          // $("#balance").html(item2.balanceQuty == 0 ? "0.00" : App.formatMoney(item2.balanceQuty));
          // $("#avaliable").html(item2.availableQuty == 0 ? "0.00" : App.formatMoney(item2.availableQuty));
        }
      }.bind(this));

      function setFirstUsingCard() {
        var card = firstUsingCard(function() {
          var cards = App.getSession(App.cards);
          if(cards.length > 0){
            showFirstCard(cards[0]);
              return
          }
        });
        if (card != null) {
          showFirstCard(card);
        }
      }

      function initCardList() {
        var selectedCard = App.getSession(App.selectedCard);
        var cards = App.getSession(App.cards);
        for (var index in cards) {
          var bool = false;
          var card = cards[index];
          if (selectedCard != null && selectedCard.bankNo == card.bankNo && selectedCard.bankAcco == card.bankAcco) {
            bool = true
          };
              var signTxt = ""; /** 1 快捷 2 银联通 3 网银 5 不显示*/
              var signStyle = "";
          if(card.signWay == "1"){
            signStyle = "shorcut";
            signTxt = "快捷";
          }else if(card.signWay == "2"){
            signStyle = "union";
            signTxt = "银联通";
          }else if(card.signWay == "3"){
            signStyle = "E-bank";
            signTxt = "网银";
          }else if(card.signWay == "4"){
            signStyle = "E-bank";
            signTxt = "通联";
          }else if(card.signWay == "6"){
            signStyle = "E-bank";
            signTxt = "云闪付";
          }else if(card.signWay == "7"){
            signStyle = "E-bank";
            signTxt = "一网通";
          }else{
            signStyle = "";
            signTxt = "";
          }
          if(true || card.signWay == "7" || card.signWay == "1"){//wap只需支持快捷和招行一网通 20210705全放开
          $("#cards_panel").append("<div class='bankitems clearfix " + (bool ? "active" : "") + "' data='" + index + "|" + card.bankNo + "|" + card.bankAcco +"'>" 
          + "<div class='bankcontent clearfix'><div class='bankpic left'>"
          +'<img src="/mobileEC/images/bank/'+card.bankNo+'.png" />'
          +"</div><div class='c_bank_info left'><h3>" + card.bankGrpName +"[" + card.bankAccoDisplay +  "]</h3><p> "+card.bankQuickRemark
          +"</p></div>"
          +'                    <div class=\"lh-130 '+ signStyle +'\">\n' 
          +'            <a class="bankicon icon-'+ signStyle +'">'+ signTxt +'</a>' 
          +'                    </div>\n' +
          "</div>" );
          }
        };
        App.bind(".bankitems", "tap", handlerCard)
      }

      function handlerCard() {
        var data = $(event.target).attr("data");
        if (data == undefined) {
          var target = $(event.target);
          for (var i = 0; i < 4; i++) {
            target = target.parent();
            data = target.attr("data");
            if (data != undefined) break
          }
        };
        var array = String(data).split("|");
        $(".bankitems").removeClass("active").eq(array[0]).addClass("active");
        var bankAcco = array[2];
        var cards = App.getSession(App.cards);
        var card = {};
        cards.forEach(function(item){
          if(item.bankAcco == bankAcco)
          {
            card = item;
          }
        })

        App.setSession(App.selectedCard, card);
        $('#bankGrpName').html(card.bankGrpName);
        $('#bankAccoDisplay').html('('+card.bankAccoDisplay+')');
        $('#quickRemark').html(card.quickRemark);
        $('#quickAmt').val(card.quickAmt);

        var url = "/mobile-bff/v1/fund/fund-redeem-date?cashFrm=B&fundId=" + App.getUrlParam("fundId")
                +"&currencyType="+ $("#currencyType").val() +"&bankNo="+ card.bankNo+ "&bankAcco="+ card.bankAcco+"&quickRedeem=1";
        App.get(url, null, function (result) {
          if (result.body != undefined && result.body != null) {
            $("#quickRedeemRemark").html(result.body.quickRedeemRemark);
          }
        });

        // $("#quickRedeemAmt").val("");
        $("#selected_card_panel").hide();
        $("#app").show();
      }

      function firstUsingCard(successFun){
        var cards = App.getSession(App.cards);
        if(cards == null || (cards != null && cards.length == 0)){
            queryCard(successFun);
        }else{
            if(cards.length > 0){
              return cards[0];
            }else{
                alertTips("请先绑定一张银行卡！");
                window.location = "/mobileEC/wap/card/manage_card.html";
            }
        }
        return null;
    }

    function showFirstCard(card) {
      $('#bankGrpName').html(card.bankGrpName);
      $('#bankAccoDisplay').html('('+card.bankAccoDisplay+')');
      $('#quickRemark').html(card.quickRemark);
      $('#quickAmt').val(card.quickAmt);

      var url = "/mobile-bff/v1/fund/fund-redeem-date?cashFrm=B&fundId=" + App.getUrlParam("fundId")
                +"&currencyType="+ $("#currencyType").val() +"&bankNo="+ card.bankNo+ "&bankAcco="+ card.bankAcco+"&quickRedeem=1";
      App.get(url, null, function (result) {
        if (result.body != undefined && result.body != null) {
          $("#quickRedeemRemark").html(result.body.quickRedeemRemark);
        }
      });
      App.setSession(App.selectedCard, card);
    }
 
    },

    // 选择转入基金
    goSelectFund(){
      window.location.href='/tradeh5/newWap/tradeProcess/selectTransfFund/index.html?productId='+this.convertDetail.fundId
    },
    // 百分比切换
    percentToggle(value){
      if(this.transferInfundDetail){
        this.percentValue = value;
      }
      var maxConvertQuty = this.maxConvertQuty?String(this.maxConvertQuty):'';
      switch(value){
        case '1':
          this.convertQuty=App.formatMoney(maxConvertQuty.replace(/,/g, "") / 3);
          break;
        case '2':
          this.convertQuty=App.formatMoney(maxConvertQuty.replace(/,/g, "") / 2);
          break;
        case '3':
          this.convertQuty=App.formatMoney(maxConvertQuty.replace(/,/g, ""));
          break;
      }
      this.finaConvertQuty = this.convertQuty.replace(/,/g, "")
    },
    // 监听金额改变
    convertQutyChange(e){
      
        // if (Number($("#avaliable").html().replace(/,/g, "")) < Number(amt)) {
        //   this.alertTips("不能最大赎回金额" + $("#avaliable").html().replace(/,/g, "") + "元");
        //   return;
        // }
      // console.log(e.target.value);
      if(this.finallyTime!==null){
        clearTimeout(this.finallyTime);
      }
      this.finallyTime=setTimeout(()=>{
        var amt = e.target.value;
        if (amt.indexOf('.') > -1) { //带小数
          if (/^[0-9]+(.[0-9]{1,2})?$/.test(Number(amt))) {

          } else {
            this.convertQuty=amt.substr(0, amt.indexOf('.') + 3);
          }

        } else if (/^[0-9]+?$/.test(String(amt))) {

        }else if(amt==''){
        
        }
         else {
          this.convertQuty = '';
          this.alertTips("金额格式有误");
          return;
        }
        this.convertQuty=amt;
        this.finaConvertQuty=amt.replace(/[,A-z]/g, "").trim();
      },500)
    },

    // 转换费用估算
    feeTips(){
      if(this.finaConvertQuty!=''&&Number(this.finaConvertQuty)!==0){
        if(!this.transferInfundDetail){
          this.alertTips("请选择一只新的基金");
          return ;
        }
        var params={};
        params.accepteMode = 'M';
        params.fundId = this.convertDetail.fundId;
        params.redQuty = Number(this.finaConvertQuty);
        params.ofundId = this.transferInfundDetail.fundId;
        params.balanceSerialNo = this.convertDetail.serialNo;
        params.transferPurchase = this.transferPurchase;
        params.productType = this.selectedFund.productType;
        console.log(params);
        utils.ajax({
          type:'POST',
          url:'/mobile-bff/v1/fund/convert-fee-tips/estimate',
          data:params,
          success: function (result) {
              if (result.returnCode === 0) {
                console.log(result.body);
                if(result.body && result.body.estimateRedeemFeeTip){
                  this.feeTip = result.body;
                  this.feeTip.estimateRedeemFeeTip=this.feeTip.estimateRedeemFeeTip.replace(/font/g,'span');
                }
              }
          }.bind(this)
        })
      }else{
        this.feeTip = ''; 
      }
      // 
    },
    
    // 转换
    confirmNext(){
      if(!this.transferInfundDetail){
        this.alertTips("请选择一只新的基金");
        return;
      }
      if(this.agreementList.length!==this.fundContractList.length){
        console.log(123);
        this.alertTips("请选择勾选协议");
        return;
      }
      if(this.nextFlag){
        if(this.transferInfundDetail.canBePurchased===true){
          this.confirmTipShow = true;
          this.confirmTipOption.text='转购基金为新发基金，可能因提前结束认购导致转购失败，请确认是否发起转购';
          this.confirmTipOption.btn1='取消';
          this.confirmTipOption.btn2='继续发起';
          return;
        }
        if(this.feeTip.redeemInFirstFeeClassTips){
          this.confirmTipShow = true;
          this.confirmTipOption.text=this.feeTip.redeemInFirstFeeClassTips.replace(/font/g,'span');
          this.confirmTipOption.btn1='暂不发起';
          this.confirmTipOption.btn2='继续发起';
          return;
        }
        this.finaConfirm();
      }
    },
    finaConfirm(){
      // /mobile-bff/v1/fund/fund-convert
      this.confirmTipShow = false;
      var params={};
      params.arAcct = this.convertDetail.arAcct;
      params.branchNo = this.convertDetail.branchCode;
      params.fundId = this.convertDetail.fundId;
      params.tradeAcco = this.convertDetail.tradeAcco;
      params.toFundId = this.transferInfundDetail.fundId;
      params.transferPurchase = this.transferPurchase;
      params.largeRedeemFlag = this.largeRedeemFlag;
      params.fundSerialNo = this.convertDetail.serialNo;
      params.shareType = this.convertDetail.shareType;
      params.subQuty = Number(this.finaConvertQuty);
      utils.ajax({
        type:'POST',
        url:'/mobile-bff/v1/fund/fund-convert',
        data:params,
        success: function (result) {
            if (result.returnCode === 0) {
              console.log('123213',result.body);
              App.setSession(App.serialNo_info, result.body.info);
              App.setSession(App.serialNo, result.body.serialNo);
              App.setSession(App.serialNo_success_show_data, params);
              App.setSession(App.serialNo_forword_url, "/mobileEC/wap/fund/redeemsuccess.html?type=convert");
              // window.location.href = "../common/setPassword.html";
              utils.verifyTradeChain(result.body);
            }
        }.bind(this)
      })
    },
    getInfundDetail(){
      utils.ajax({
        type:'POST',
        url:'/mobile-bff/v1/fund/detailInfo',
        data:{fundId:this.transferInfundDetail.fundId},
        success: function (result) {
            if (result.returnCode === 0) {
              this.fundContractList = result.body.fundContractList;
              var dataArr = [];
              this.fundContractList.map(mapItem => {
                if (dataArr.length == 0) {
                    dataArr.push({ contractCategory: mapItem.contractCategory, List: [mapItem] })
                } else {
                    let res = dataArr.some(item=> {
                      if (item.contractCategory == mapItem.contractCategory) {
                        item.List.push(mapItem)
                        return true
                      }
                    })
                    if (!res) {
                      dataArr.push({ contractCategory: mapItem.contractCategory, List: [mapItem] })
                    }
                }
              })
              this.fundContractList = dataArr;
              // console.log(dataArr);
            }
        }.bind(this)
      })
    },
    largeRedeemFlagClick(){
      var _this=this;
      $('#myGift2').show();
      $(".new-mask").show();
      $(".giftlist1 a").on("click", function (event) {
        // $("#tl").html($(this).children(".title").html());
        _this.largeRedeemFlag=($(this).children(".title").attr('data'));
        $("#myGift2").hide();
        $(".new-mask").hide();
      })
    },
    tradeRule(){
      if(this.transferInfundDetail&&this.transferInfundDetail.fundId){
        // ff转换，fb转购
        var type = this.transferInfundDetail.canBePurchasedForCurrent=='Y'?'ff':'fb';
        var outFundId=this.convertDetail.fundId;
        var inFundId=this.transferInfundDetail.fundId;
        window.location.href="/mobileEC/common/productTransferRule.html?transferOutPrdid="+outFundId+"&tansferType="+type+"&transferInPrdid="+inFundId;
      }else{
        this.alertTips("请选择需要转入的产品");
      } 
    },
    getCovertTip(){
       utils.ajax({
         url:'/mobile-bff/v1/fund/covert-date?fundId='+this.selectedFund.productId+'&accptMd=M&tradeAction=T&ofundId='+this.transferInfundDetail.fundId+'&transferPurchase='+this.transferPurchase+'&purchaseStatus='+this.purchaseStatus+'&branchCode=247',
         success: function (result) {
             if (result.returnCode === 0) {
                if( result.body.convertTips){
                  this.convertTips = result.body.convertTips.replace(/font/g,'span')
                }
             }
         }.bind(this)
       })
    },
    // /mobile-bff/v1/fund/detailInfo
    // 一些展示信息接口不确定，一些接口参数不确定

    // $(".two").click(function () {
    //   console.log($("#avaliable").html());
    //   $("#subQuty").val(App.formatMoney($("#avaliable").html().replace(/,/g, "") / 2));
    //   $(".first").hide();
    // });
    alertTips(text) {
      $(".Bomb-box-tips").html(text);
      $(".Bomb-box-content p").html("");
      $(".convert-box").show();
    },
    
  },
  watch:{
    tabCurrentIndex(newv,oldv){
      if(newv===0){
        this.redeemAllFc();
      }
    },
    finaConvertQuty(newv,oldv){
      console.log(newv);
      this.feeTips();
      if(newv!=''&&newv!='0'&&Number(newv)<=Number(this.maxConvertQuty)){
        this.nextFlag = true;
      }else{
        this.nextFlag = false;
      }
    },
    
  },
  mounted() {
    if(utils.getUrlParam('index')==1){
      this.redeemShow=false;
    }
    if(this.tabCurrentIndex===0){
      this.redeemAllFc();
    }else{
      this.queryFundDetail();
    }
    this.transferInfundDetail = App.getSession('__inTransferFund');
    // 确定是否转购
    if(this.transferInfundDetail){
      if(this.transferInfundDetail.canBePurchasedForCurrent==='N'&&this.transferInfundDetail.canBePurchasedForCalcDatetime==='Y'){
        this.transferPurchase='Y';
      }else if(this.transferInfundDetail.canBePurchasedForCurrent==='Y'){
        this.getTopInfo();
        this.transferPurchase='N'
      }else{
        this.transferPurchase='N'
      }
      // 购买状态
      if(this.transferInfundDetail.fundSt==1||this.transferInfundDetail.fundSt==7){
        // 确定认购还是申购
        this.purchaseStatus = 'R'
      }else{
        this.purchaseStatus = 'B'
      }
      // 获取基金提示信息
      this.getCovertTip();
      this.getInfundDetail();
    } 

    // 20220616，如果赎回tab不展示的情况，快速赎回相关代码不需要执行
    if(this.redeemShow){
      this.queryQuickRedeemSwitch();
      this.queryRedeemFund();
    }
  }
})
