$('.nav ul li a').click(function (e) {
    e.preventDefault();
    if ($(this).parents("li").hasClass('active')) { return; }
    var li = $(this).parents("li");
    li.addClass('active').siblings().removeClass('active');

    $(this).parents('.nav').next()
        .children().hide()
        .eq(li.index()).show();
});


$('.btn-question').click(function () {
    $('.layer').show();
    $('section').css('visibility', 'hidden');
});

$('.close').click(function () {
    $('.layer').hide();
    $('.dialog').hide();
    $('section').css('visibility', 'visible');
});



/*; (function () {

})()
    // 柱状图
    var asset = [
        /!*{ name: '现金宝', value: 2457 },
        { name: '定期', value: 4356 },
        { name: '基金', value: -2654 },
        { name: '高端', value: 5682 },*!/
    ]

    asset = calcAsset(asset);

    asset.forEach(function (item, index, self) {

        switch (index) {
            case 0: setHeight('.xjb', item.value, item.h)
                break;
            case 1: setHeight('.regular ', item.value, item.h)
                break;
            case 2: setHeight('.fund', item.value, item.h)
                break;
            case 3: setHeight('.high', item.value, item.h)
                break;
        }

    });*/
    function setAsset(asset, currencyType){

        asset = calcAsset(asset);

        asset.forEach(function (item, index, self) {

            switch (item.type) {
                case 1: setHeight('.xjb', item.value, item.h, currencyType)
                    break;
                case 2: setHeight('.regular', item.value, item.h, currencyType)
                    break;
                case 3: setHeight('.fund', item.value, item.h, currencyType)
                    break;
                case 4: setHeight('.high', item.value, item.h, currencyType)
                    break;

                case 5: setHeight('.xjb', item.value, item.h, currencyType)
                    break;
                case 6: setHeight('.fund', item.value, item.h, currencyType)
                    break;
                case 7:
                    $(".regular .Profit-name").html("组合");
                    setHeight('.regular', item.value, item.h, currencyType)
                    break;
                case 8: setHeight('.high', item.value, item.h, currencyType)
                    break;
            }

        });
        calcuBenchmark();
    }


    function calcuBenchmark() {

        var maxH = $('.benchmark-con').height() / 2 - 35;
        var dif;
        var $upH = $('.xjb,.regular,.fund,.high').not('.negative-bottom');
        if ($upH.length > 0) {
            var upHDom = $upH.reduce(function (pre, cur, index, self) {
                if ($(pre).height() > $(cur).height()) {
                    return pre
                }
                return cur;
            })
            var dif = maxH - $(upHDom).height()
        } else {
            dif = maxH;
        }

        if (dif > 10) {
            $('.benchmark').css('marginTop', maxH - dif + 35)
        }

        var $downH = $('.xjb,.regular,.fund,.high').filter('.negative-bottom')
        if ($downH.length > 0) {
            var downHDom = $downH.reduce(function (pre, cur, index, self) {
                if ($(pre).height() > $(cur).height()) {
                    return pre
                }
                return cur;
            })
            dif = maxH - $(downHDom).height()
        } else {
            dif = maxH;
        }
        if (dif > 10) {
            $('.benchmark').css('marginBottom', maxH - dif + 35)
        }

    }



    function setHeight(dom, value, heihgt, currencyType) {
        $(dom).show();
        if (value < 0) {
            $(dom).addClass('negative-bottom');
        }
        $(dom).children('.left,.right').height(parseInt(Math.abs(heihgt)));
        if(Number(value) > 0){
            $(dom).find('.Profit-val').css('color', '#fe5a5b');
        } else if(Number(value) < 0) {
            $(dom).find('.Profit-val').css('color', '#009944');
        } else {
            $(dom).find('.Profit-val').css('color', '#000');
        }
        if(Math.abs(value) > 10000000){
            $(dom).find('.Profit-val').addClass('scale-half')
        }
        var unit = "";
        if ("156" == currencyType){
            unit = "元";
        } else if ("840" == currencyType) {
            unit = "美元";
        }
        $(dom).find('.Profit-val').html(value + unit);
    }


    function calcAsset(arr) {
        var asset = arr;
        var values = asset.map(function (item, index, self) {
            return Math.abs(item.value);
        });
        var min = Math.min.apply(null, values)
        var max = Math.max.apply(null, values)
        var maxH = $('.benchmark-con').height() / 2 - 35;
        var minH = 12;

        values.forEach(function (item, index, self) {
            asset[index].h = item == 0 ? 0 : (maxH - minH) * item / max + minH
        });
        return asset;
    }

