var elStyle =  document.createElement('style');
elStyle.innerHTML = `
.gearDate,
.gearDatetime {
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9900;
    overflow: hidden;
    animation-fill-mode: both
}

.date_ctrl {
    vertical-align: middle;
    background-color: #d5d8df;
    color: #000;
    margin: 0;
    height: auto;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9901;
    overflow: hidden;
    transform: translate3d(0, 0, 0)
}

.slideInUp {
    animation: slideInUp .3s;
}

@keyframes slideInUp {
    from {
        transform: translate3d(0, 100%, 0)
    }
    to {
        transform: translate3d(0, 0, 0)
    }
}

.ym_roll,
.date_roll,
.datetime_roll,
.time_roll {
    display: flex;
    width: 100%;
    height: auto;
    overflow: hidden;
    background-color: transparent;
    -webkit-mask: -webkit-gradient(linear, 0% 50%, 0% 100%, from(#debb47), to(rgba(36, 142, 36, 0)));
    -webkit-mask: -webkit-linear-gradient(top, #debb47 50%, rgba(36, 142, 36, 0))
}

.ym_roll>div,
.date_roll>div,
.datetime_roll>div,
.time_roll>div {
    font-size: 2.3em;
    height: 10em;
    float: left;
    background-color: transparent;
    position: relative;
    overflow: hidden;
    flex: 4
}

.ym_roll>div .gear,
.date_roll>div .gear,
.datetime_roll>div .gear,
.time_roll>div .gear {
    width: 100%;
    float: left;
    position: absolute;
    z-index: 9902;
    margin-top: -4em
}

.date_roll_mask {
    -webkit-mask: -webkit-gradient(linear, 0% 40%, 0% 0%, from(#debb47), to(rgba(36, 142, 36, 0)));
    -webkit-mask: -webkit-linear-gradient(bottom, #debb47 50%, rgba(36, 142, 36, 0));
    padding: 0
}

.date_roll>div:nth-child(2) {
    flex: 2
}

.date_roll>div:nth-child(1),
.datetime_roll>div:nth-child(1) {
    flex: 4
}

.datetime_roll>div:first-child {
    flex: 6
}

.datetime_roll>div:last-child {
    flex: 6
}

.date_grid {
    position: relative;
    top: 4em;
    width: 100%;
    height: 2em;
    margin: 0;
    box-sizing: border-box;
    z-index: 0;
    border-top: 1px solid #abaeb5;
    border-bottom: 1px solid #abaeb5
}

.date_grid>div {
    color: #000;
    position: absolute;
    right: 0;
    top: 0;
    font-size: .8em;
    line-height: 2.5em
}

.date_roll>div:nth-child(3) .date_grid>div {
    left: 42%
}

.datetime_roll>div .date_grid>div {
    right: 0
}

.datetime_roll>div:first-child .date_grid>div {
    left: auto;
    right: 0%
}

.datetime_roll>div:last-child .date_grid>div {
    left: 50%
}

.time_roll>div:nth-child(1) .date_grid>div {
    right: 1em
}

.ym_roll>div:nth-child(1) .date_grid>div {
    right: .1em
}

.ym_roll>div .date_grid>div,
.time_roll>div .date_grid>div {
    right: 5em
}

.date_btn {
    color: #0575f2;
    font-size: 1.6em;
    line-height: 1em;
    text-align: center;
    padding: .8em 1em
}

.date_btn_box:before,
.date_btn_box:after {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    display: block;
    background-color: #96979b;
    z-index: 15;
    transform: scaleY(0.33)
}

.date_btn_box {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: #f1f2f4;
    position: relative
}

.date_btn_box:before {
    left: 0;
    top: 0;
    transform-origin: 50% 20%
}

.date_btn_box:after {
    left: 0;
    bottom: 0;
    transform-origin: 50% 70%
}

.date_roll>div:nth-child(1) .gear {
    text-indent: 20%
}

.date_roll>div:nth-child(2) .gear {
    text-indent: -20%
}

.date_roll>div:nth-child(3) .gear {
    text-indent: -55%
}

.datetime_roll>div .gear {
    width: 100%;
    text-indent: -25%
}

.datetime_roll>div:first-child .gear {
    text-indent: -10%
}

.datetime_roll>div:last-child .gear {
    text-indent: -50%
}

.ym_roll>div .gear,
.time_roll>div .gear {
    width: 100%;
    text-indent: -70%
}

.ym_roll>div:nth-child(1) .gear,
.time_roll>div:nth-child(1) .gear {
    width: 100%;
    text-indent: 10%
}

.tooth {
    height: 2em;
    line-height: 2em;
    text-align: center
}
`;
document.querySelector('head').appendChild(elStyle);
window.LCalendar = (function() {
	var MobileCalendar = function() {
			this.gearDate;
			this.minY = 1900;
			this.minM = 1;
			this.minD = 1;
			this.maxY = 2099;
			this.maxM = 12;
			this.maxD = 31;
			this.callBack = null;
			this.isDom = function(dom){
				if(dom){
					// HTMLElement在浏览器中为object
					if(typeof HTMLElement === 'object'){
						return dom instanceof HTMLElement
					}else{
						// HTMLElement在浏览器中为function
						return typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string'
					}
				}else{
					return false
				}
			}
	}
	MobileCalendar.prototype = {
			init: function(params) {
					this.type = params.type;
					this.formatTp = '-';
					if(params.formatTp){
							this.formatTp = params.formatTp;
					}
					if(this.isDom(params.trigger)){
						this.trigger = params.trigger
					}else{
						this.trigger = document.querySelector(params.trigger);
					}
					if (this.trigger.getAttribute("data-lcalendar") != null) {
							var arr = this.trigger.getAttribute("data-lcalendar").split(',');
							var minArr = arr[0].split('-');
							this.minY = ~~minArr[0];
							this.minM = ~~minArr[1];
							this.minD = ~~minArr[2];
							var maxArr = arr[1].split('-');
							this.maxY = ~~maxArr[0];
							this.maxM = ~~maxArr[1];
							this.maxD = ~~maxArr[2];
					}
					if (params.minDate) {
							var minArr = params.minDate.split('-');
							this.minY = ~~minArr[0];
							this.minM = ~~minArr[1];
							this.minD = ~~minArr[2];
					}
					if (params.maxDate) {
							var maxArr = params.maxDate.split('-');
							this.maxY = ~~maxArr[0];
							this.maxM = ~~maxArr[1];
							this.maxD = ~~maxArr[2];
					}
					if(params.callBack) {
							this.callBack = params.callBack;
					}
					this.bindEvent(this.type);
			},
			bindEvent: function(type) {
					var _self = this;
					//呼出日期插件
					function popupDate(e) {
							_self.gearDate = document.createElement("div");
							_self.gearDate.className = "gearDate";
							_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
									'<div class="date_btn_box">' +
									'<div class="date_btn lcalendar_cancel">取消</div>' +
									'<div class="date_btn lcalendar_finish">确定</div>' +
									'</div>' +
									'<div class="date_roll_mask">' +
									'<div class="date_roll">' +
									'<div>' +
									'<div class="gear date_yy" data-datetype="date_yy"></div>' +
									'<div class="date_grid">' +
									'<div>年</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear date_mm" data-datetype="date_mm"></div>' +
									'<div class="date_grid">' +
									'<div>月</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear date_dd" data-datetype="date_dd"></div>' +
									'<div class="date_grid">' +
									'<div>日</div>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'</div>';
							document.body.appendChild(_self.gearDate);
							dateCtrlInit();
							var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
							lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
							var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
							lcalendar_finish.addEventListener('touchstart', finishMobileDate);
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var date_mm = _self.gearDate.querySelector(".date_mm");
							var date_dd = _self.gearDate.querySelector(".date_dd");
							date_yy.addEventListener('touchstart', gearTouchStart);
							date_mm.addEventListener('touchstart', gearTouchStart);
							date_dd.addEventListener('touchstart', gearTouchStart);
							date_yy.addEventListener('touchmove', gearTouchMove);
							date_mm.addEventListener('touchmove', gearTouchMove);
							date_dd.addEventListener('touchmove', gearTouchMove);
							date_yy.addEventListener('touchend', gearTouchEnd);
							date_mm.addEventListener('touchend', gearTouchEnd);
							date_dd.addEventListener('touchend', gearTouchEnd);
					}
					//初始化年月日插件默认值
					function dateCtrlInit() {
							var date = new Date();
							var dateArr = {
									yy: date.getFullYear(),
									mm: date.getMonth(),
									dd: date.getDate() - 1
							};
							if (new RegExp(`^\\d{4}${_self.formatTp}\\d{1,2}${_self.formatTp}\\d{1,2}$`).test(_self.trigger.value)) {
									rs = _self.trigger.value.match(new RegExp(`(^|${_self.formatTp})\\d{1,4}`,'g'));
									dateArr.yy = rs[0] - _self.minY;
									dateArr.mm = rs[1].replace(new RegExp(`\\${_self.formatTp}`,'g'),"") - 1;
									dateArr.dd = rs[2].replace(new RegExp(`\\${_self.formatTp}`,'g'),"") - 1;
							} else {
									dateArr.yy = dateArr.yy - _self.minY;
							}
							_self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
							_self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
							_self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
							setDateGearTooth();
					}
					//呼出年月插件
					function popupYM(e) {
							_self.gearDate = document.createElement("div");
							_self.gearDate.className = "gearDate";
							_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
									'<div class="date_btn_box">' +
									'<div class="date_btn lcalendar_cancel">取消</div>' +
									'<div class="date_btn lcalendar_finish">确定</div>' +
									'</div>' +
									'<div class="date_roll_mask">' +
									'<div class="ym_roll">' +
									'<div>' +
									'<div class="gear date_yy" data-datetype="date_yy"></div>' +
									'<div class="date_grid">' +
									'<div>年</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear date_mm" data-datetype="date_mm"></div>' +
									'<div class="date_grid">' +
									'<div>月</div>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'</div>';
							document.body.appendChild(_self.gearDate);
							ymCtrlInit();
							var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
							lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
							var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
							lcalendar_finish.addEventListener('touchstart', finishMobileYM);
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var date_mm = _self.gearDate.querySelector(".date_mm");
							date_yy.addEventListener('touchstart', gearTouchStart);
							date_mm.addEventListener('touchstart', gearTouchStart);
							date_yy.addEventListener('touchmove', gearTouchMove);
							date_mm.addEventListener('touchmove', gearTouchMove);
							date_yy.addEventListener('touchend', gearTouchEnd);
							date_mm.addEventListener('touchend', gearTouchEnd);
					}
					//初始化年月插件默认值
					function ymCtrlInit() {
							var date = new Date();
							var dateArr = {
									yy: date.getFullYear(),
									mm: date.getMonth()
							};
							// if (/^\d{4}-\d{1,2}$/.test(_self.trigger.value)) {
							if (new RegExp(`^\\d{4}${_self.formatTp}\\d{1,2}$`).test(_self.trigger.value)) {
									rs = _self.trigger.value.match(new RegExp(`(^|${_self.formatTp})\\d{1,4}`,'g'));
									dateArr.yy = rs[0] - _self.minY;
									dateArr.mm = rs[1].replace(new RegExp(`\\${_self.formatTp}`,'g'),"") - 1;
							} else {
									dateArr.yy = dateArr.yy - _self.minY;
							}
							_self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
							_self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
							setDateGearTooth();
					}
					//呼出日期+时间插件
					function popupDateTime(e) {
							_self.gearDate = document.createElement("div");
							_self.gearDate.className = "gearDatetime";
							_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
									'<div class="date_btn_box">' +
									'<div class="date_btn lcalendar_cancel">取消</div>' +
									'<div class="date_btn lcalendar_finish">确定</div>' +
									'</div>' +
									'<div class="date_roll_mask">' +
									'<div class="datetime_roll">' +
									'<div>' +
									'<div class="gear date_yy" data-datetype="date_yy"></div>' +
									'<div class="date_grid">' +
									'<div>年</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear date_mm" data-datetype="date_mm"></div>' +
									'<div class="date_grid">' +
									'<div>月</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear date_dd" data-datetype="date_dd"></div>' +
									'<div class="date_grid">' +
									'<div>日</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear time_hh" data-datetype="time_hh"></div>' +
									'<div class="date_grid">' +
									'<div>时</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear time_mm" data-datetype="time_mm"></div>' +
									'<div class="date_grid">' +
									'<div>分</div>' +
									'</div>' +
									'</div>' +
									'</div>' + //date_roll
									'</div>' + //date_roll_mask
									'</div>';
							document.body.appendChild(_self.gearDate);
							dateTimeCtrlInit();
							var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
							lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
							var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
							lcalendar_finish.addEventListener('touchstart', finishMobileDateTime);
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var date_mm = _self.gearDate.querySelector(".date_mm");
							var date_dd = _self.gearDate.querySelector(".date_dd");
							var time_hh = _self.gearDate.querySelector(".time_hh");
							var time_mm = _self.gearDate.querySelector(".time_mm");
							date_yy.addEventListener('touchstart', gearTouchStart);
							date_mm.addEventListener('touchstart', gearTouchStart);
							date_dd.addEventListener('touchstart', gearTouchStart);
							time_hh.addEventListener('touchstart', gearTouchStart);
							time_mm.addEventListener('touchstart', gearTouchStart);
							date_yy.addEventListener('touchmove', gearTouchMove);
							date_mm.addEventListener('touchmove', gearTouchMove);
							date_dd.addEventListener('touchmove', gearTouchMove);
							time_hh.addEventListener('touchmove', gearTouchMove);
							time_mm.addEventListener('touchmove', gearTouchMove);
							date_yy.addEventListener('touchend', gearTouchEnd);
							date_mm.addEventListener('touchend', gearTouchEnd);
							date_dd.addEventListener('touchend', gearTouchEnd);
							time_hh.addEventListener('touchend', gearTouchEnd);
							time_mm.addEventListener('touchend', gearTouchEnd);
					}
					//初始化年月日时分插件默认值
					function dateTimeCtrlInit() {
							var date = new Date();
							var dateArr = {
									yy: date.getFullYear(),
									mm: date.getMonth(),
									dd: date.getDate() - 1,
									hh: date.getHours(),
									mi: date.getMinutes()
							};
							// if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(_self.trigger.value)) {
							if (new RegExp(`^\\d{4}${_self.formatTp}\\d{1,2}${_self.formatTp}\\d{1,2}\\s\\d{2}:\\d{2}$`).test(_self.trigger.value)) {
									// rs = _self.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
									rs = _self.trigger.value.match(new RegExp(`(^|${_self.formatTp}|\\s|:)\\d{1,4}`,'g'));
									dateArr.yy = rs[0] - _self.minY;
									dateArr.mm = rs[1].replace(new RegExp(`\\${_self.formatTp}`,'g'),"") - 1;
									dateArr.dd = rs[2].replace(new RegExp(`\\${_self.formatTp}`,'g'),"") - 1;
									dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""));
									dateArr.mi = parseInt(rs[4].replace(/:0?/g, ""));
							} else {
									dateArr.yy = dateArr.yy - _self.minY;
							}
							_self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
							_self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
							_self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
							setDateGearTooth();
							_self.gearDate.querySelector(".time_hh").setAttribute("val", dateArr.hh);
							_self.gearDate.querySelector(".time_mm").setAttribute("val", dateArr.mi);
							setTimeGearTooth();
					}
					//呼出时间插件
					function popupTime(e) {
							_self.gearDate = document.createElement("div");
							_self.gearDate.className = "gearDate";
							_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
									'<div class="date_btn_box">' +
									'<div class="date_btn lcalendar_cancel">取消</div>' +
									'<div class="date_btn lcalendar_finish">确定</div>' +
									'</div>' +
									'<div class="date_roll_mask">' +
									'<div class="time_roll">' +
									'<div>' +
									'<div class="gear time_hh" data-datetype="time_hh"></div>' +
									'<div class="date_grid">' +
									'<div>时</div>' +
									'</div>' +
									'</div>' +
									'<div>' +
									'<div class="gear time_mm" data-datetype="time_mm"></div>' +
									'<div class="date_grid">' +
									'<div>分</div>' +
									'</div>' +
									'</div>' +
									'</div>' + //time_roll
									'</div>' +
									'</div>';
							document.body.appendChild(_self.gearDate);
							timeCtrlInit();
							var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
							lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
							var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
							lcalendar_finish.addEventListener('touchstart', finishMobileTime);
							var time_hh = _self.gearDate.querySelector(".time_hh");
							var time_mm = _self.gearDate.querySelector(".time_mm");
							time_hh.addEventListener('touchstart', gearTouchStart);
							time_mm.addEventListener('touchstart', gearTouchStart);
							time_hh.addEventListener('touchmove', gearTouchMove);
							time_mm.addEventListener('touchmove', gearTouchMove);
							time_hh.addEventListener('touchend', gearTouchEnd);
							time_mm.addEventListener('touchend', gearTouchEnd);
					}
					//初始化时分插件默认值
					function timeCtrlInit() {
							var d = new Date();
							var e = {
									hh: d.getHours(),
									mm: d.getMinutes()
							};
							if (/^\d{2}:\d{2}$/.test(_self.trigger.value)) {
									rs = _self.trigger.value.match(/(^|:)\d{2}/g);
									e.hh = parseInt(rs[0].replace(/^0?/g, ""));
									e.mm = parseInt(rs[1].replace(/:0?/g, ""))
							}
							_self.gearDate.querySelector(".time_hh").setAttribute("val", e.hh);
							_self.gearDate.querySelector(".time_mm").setAttribute("val", e.mm);
							setTimeGearTooth();
					}
					//重置日期节点个数
					function setDateGearTooth() {
							var newY = new Date().getFullYear();
							var passY = _self.maxY - _self.minY + 1;
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var itemStr = "";
							if (date_yy && date_yy.getAttribute("val")) {
									//得到年份的值
									var yyVal = parseInt(date_yy.getAttribute("val"));
									//p 当前节点前后需要展示的节点个数
									for (var p = 0; p <= passY - 1; p++) {
											itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
									}
									date_yy.innerHTML = itemStr;
									var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
									if (!isNaN(top)) {
											top % 2 == 0 ? (top = top) : (top = top + 1);
											top > 8 && (top = 8);
											var minTop = 8 - (passY - 1) * 2;
											top < minTop && (top = minTop);
											date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
											date_yy.setAttribute('top', top + 'em');
											yyVal = Math.abs(top - 8) / 2;
											date_yy.setAttribute("val", yyVal);
									} else {
											var minTop = 8 - (passY - 1) * 2;
											var gearVal = Math.abs(minTop - 8) / 2;
											if (_self.maxY < newY) {
													yyVal > gearVal && (yyVal = gearVal);
											} else if (_self.minY > newY) {
													yyVal < gearVal && (yyVal = gearVal);
											}
											date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
											date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
									}
							} else {
									return;
							}
							var date_mm = _self.gearDate.querySelector(".date_mm");
							if (date_mm && date_mm.getAttribute("val")) {
									itemStr = "";
									//得到月份的值
									var mmVal = parseInt(date_mm.getAttribute("val"));
									var maxM = 11;
									var minM = 0;
									//当年份到达最大值
									if (yyVal == passY - 1) {
											maxM = _self.maxM - 1;
									}
									//当年份到达最小值
									if (yyVal == 0) {
											minM = _self.minM - 1;
									}
									//p 当前节点前后需要展示的节点个数
									for (var p = 0; p < maxM - minM + 1; p++) {
											itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
									}
									date_mm.innerHTML = itemStr;
									var top = Math.floor(parseFloat(date_mm.getAttribute('top')));
									if (!isNaN(top)) {
											if (mmVal > maxM) {
													mmVal = maxM;
											} else if (mmVal < minM) {
													mmVal = maxM;
											}
									} else {
											if (mmVal > maxM || (_self.maxY < newY && !_self.trigger.value)) {
													mmVal = maxM;
											} else if (mmVal < minM || (_self.minY > newY && !_self.trigger.value)) {
													mmVal = maxM;
											}
									}
									date_mm.setAttribute("val", mmVal);
									date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
									date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
							} else {
									return;
							}
							var date_dd = _self.gearDate.querySelector(".date_dd");
							if (date_dd && date_dd.getAttribute("val")) {
									itemStr = "";
									//得到日期的值
									var ddVal = parseInt(date_dd.getAttribute("val"));
									//返回月份的天数
									var maxMonthDays = calcDays(yyVal, mmVal);
									//p 当前节点前后需要展示的节点个数
									var maxD = maxMonthDays - 1;
									var minD = 0;
									//当年份月份到达最大值
									if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
											maxD = _self.maxD - 1;
									}
									//当年、月到达最小值
									if (yyVal == 0 && _self.minM == mmVal + 1) {
											minD = _self.minD - 1;
									}
									for (var p = 0; p < maxD - minD + 1; p++) {
											itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
									}
									date_dd.innerHTML = itemStr;
									var top = Math.floor(parseFloat(date_dd.getAttribute('top')));
									if (!isNaN(top)) {
											if (ddVal > maxD) {
													ddVal = maxD;
											} else if (ddVal < minD) {
													ddVal = minD;
											}
									} else {
											if (ddVal > maxD || (_self.maxY < newY && !_self.trigger.value)) {
													ddVal = maxD;
											} else if (ddVal < minD || (_self.minY > newY && !_self.trigger.value)) {
													ddVal = maxD;
											}
									}
									date_dd.setAttribute("val", ddVal);
									date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
									date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');
							} else {
									return;
							}
					}
					//重置时间节点个数
					function setTimeGearTooth() {
							var time_hh = _self.gearDate.querySelector(".time_hh");
							if (time_hh && time_hh.getAttribute("val")) {
									var i = "";
									var hhVal = parseInt(time_hh.getAttribute("val"));
									for (var g = 0; g <= 23; g++) {
											i += "<div class='tooth'>" + g + "</div>";
									}
									time_hh.innerHTML = i;
									time_hh.style["-webkit-transform"] = 'translate3d(0,' + (8 - hhVal * 2) + 'em,0)';
									time_hh.setAttribute('top', 8 - hhVal * 2 + 'em');
							} else {
									return
							}
							var time_mm = _self.gearDate.querySelector(".time_mm");
							if (time_mm && time_mm.getAttribute("val")) {
									var i = "";
									var mmVal = parseInt(time_mm.getAttribute("val"));
									for (var g = 0; g <= 59; g++) {
											i += "<div class='tooth'>" + g + "</div>";
									}
									time_mm.innerHTML = i;
									time_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - mmVal * 2) + 'em,0)';
									time_mm.setAttribute('top', 8 - mmVal * 2 + 'em');
							} else {
									return;
							}
					}
					//求月份最大天数
					function calcDays(year, month) {
							if (month == 1) {
									year += _self.minY;
									if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
											return 29;
									} else {
											return 28;
									}
							} else {
									if (month == 3 || month == 5 || month == 8 || month == 10) {
											return 30;
									} else {
											return 31;
									}
							}
					}
					//触摸开始
					function gearTouchStart(e) {
							e.preventDefault();
							var target = e.target;
							while (true) {
									if (!target.classList.contains("gear")) {
											target = target.parentElement;
									} else {
											break;
									}
							}
							clearInterval(target["int_" + target.id]);
							target["old_" + target.id] = e.targetTouches[0].screenY;
							target["o_t_" + target.id] = (new Date()).getTime();
							var top = target.getAttribute('top');
							if (top) {
									target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
							} else {
									target["o_d_" + target.id] = 0;
							}
							target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
					}
					//手指移动
					function gearTouchMove(e) {
							e.preventDefault();
							var target = e.target;
							while (true) {
									if (!target.classList.contains("gear")) {
											target = target.parentElement;
									} else {
											break;
									}
							}
							target["new_" + target.id] = e.targetTouches[0].screenY;
							target["n_t_" + target.id] = (new Date()).getTime();
							var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
							target["pos_" + target.id] = target["o_d_" + target.id] + f;
							target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
							target.setAttribute('top', target["pos_" + target.id] + 'em');
							if (e.targetTouches[0].screenY < 1) {
									gearTouchEnd(e);
							}
					}
					//离开屏幕
					function gearTouchEnd(e) {
							e.preventDefault();
							var target = e.target;
							while (true) {
									if (!target.classList.contains("gear")) {
											target = target.parentElement;
									} else {
											break;
									}
							}
							var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
							if (Math.abs(flag) <= 0.2) {
									target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
							} else {
									if (Math.abs(flag) <= 0.5) {
											target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
									} else {
											target["spd_" + target.id] = flag / 2;
									}
							}
							if (!target["pos_" + target.id]) {
									target["pos_" + target.id] = 0;
							}
							rollGear(target);
					}
					//缓动效果
					function rollGear(target) {
							var d = 0;
							var stopGear = false;

							function setDuration() {
									target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
									target.style.webkitTransitionTimingFunction = target.style.transitionTimingFunction = 'cubic-bezier(0.19, 1, 0.22, 1)';
									stopGear = true;
							}
							var passY = _self.maxY - _self.minY + 1;
							clearInterval(target["int_" + target.id]);
							target["int_" + target.id] = setInterval(function() {
									if (!_self.gearDate) {
											clearInterval(target["int_" + target.id]);
											return;
									}
									var pos = target["pos_" + target.id];
									var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
									pos += speed;
									if (Math.abs(speed) > 0.1) {} else {
											var b = Math.round(pos / 2) * 2;
											pos = b;
											setDuration();
									}
									if (pos > 8) {
											pos = 8;
											setDuration();
									}
									switch (target.dataset.datetype) {
											case "date_yy":
													var minTop = 8 - (passY - 1) * 2;
													if (pos < minTop) {
															pos = minTop;
															setDuration();
													}
													if (stopGear) {
															var gearVal = Math.abs(pos - 8) / 2;
															setGear(target, gearVal);
															clearInterval(target["int_" + target.id]);
													}
													break;
											case "date_mm":
													var date_yy = _self.gearDate.querySelector(".date_yy");
													//得到年份的值
													var yyVal = parseInt(date_yy.getAttribute("val"));
													var maxM = 11;
													var minM = 0;
													//当年份到达最大值
													if (yyVal == passY - 1) {
															maxM = _self.maxM - 1;
													}
													//当年份到达最小值
													if (yyVal == 0) {
															minM = _self.minM - 1;
													}
													var minTop = 8 - (maxM - minM) * 2;
													if (pos < minTop) {
															pos = minTop;
															setDuration();
													}
													if (stopGear) {
															var gearVal = Math.abs(pos - 8) / 2 + minM;
															setGear(target, gearVal);
															clearInterval(target["int_" + target.id]);
													}
													break;
											case "date_dd":
													var date_yy = _self.gearDate.querySelector(".date_yy");
													var date_mm = _self.gearDate.querySelector(".date_mm");
													//得到年份的值
													var yyVal = parseInt(date_yy.getAttribute("val"));
													//得到月份的值
													var mmVal = parseInt(date_mm.getAttribute("val"));
													//返回月份的天数
													var maxMonthDays = calcDays(yyVal, mmVal);
													var maxD = maxMonthDays - 1;
													var minD = 0;
													//当年份月份到达最大值
													if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
															maxD = _self.maxD - 1;
													}
													//当年、月到达最小值
													if (yyVal == 0 && _self.minM == mmVal + 1) {
															minD = _self.minD - 1;
													}
													var minTop = 8 - (maxD - minD) * 2;
													if (pos < minTop) {
															pos = minTop;
															setDuration();
													}
													if (stopGear) {
															var gearVal = Math.abs(pos - 8) / 2 + minD;
															setGear(target, gearVal);
															clearInterval(target["int_" + target.id]);
													}
													break;
											case "time_hh":
													if (pos < -38) {
															pos = -38;
															setDuration();
													}
													if (stopGear) {
															var gearVal = Math.abs(pos - 8) / 2;
															setGear(target, gearVal);
															clearInterval(target["int_" + target.id]);
													}
													break;
											case "time_mm":
													if (pos < -110) {
															pos = -110;
															setDuration();
													}
													if (stopGear) {
															var gearVal = Math.abs(pos - 8) / 2;
															setGear(target, gearVal);
															clearInterval(target["int_" + target.id]);
													}
													break;
											default:
									}
									target["pos_" + target.id] = pos;
									target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
									target.setAttribute('top', pos + 'em');
									d++;
							}, 30);
					}
					//控制插件滚动后停留的值
					function setGear(target, val) {
							if (_self.gearDate !== null && !isNaN(val)) {
									val = Math.round(val);
									target.setAttribute("val", val);
									if (/date/.test(target.dataset.datetype)) {
											setDateGearTooth();
									} else {
											setTimeGearTooth();
									}
							}
					}
					//取消
					function closeMobileCalendar(e) {
							e.preventDefault();
							var evt;
							try {
									evt = new CustomEvent('input');
							} catch (e) {
									//兼容旧浏览器(注意：该方法已从最新的web标准中删除)
									evt = document.createEvent('Event');
									evt.initEvent('input', true, true);
							}
							_self.trigger.dispatchEvent(evt);
							document.body.removeChild(_self.gearDate);
							_self.gearDate = null;
							if (_self.callBack != undefined && _self.callBack != null && typeof _self.callBack == "function") {
									eval(_self.callBack).call(this);
							}
					}

					//日期确认
					function finishMobileDate(e) {
							var passY = _self.maxY - _self.minY + 1;
							var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
							var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
							date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
							var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
							date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
							_self.trigger.value = (date_yy % passY + _self.minY) + _self.formatTp + date_mm + _self.formatTp + date_dd;
							closeMobileCalendar(e);
					}
					//年月确认
					function finishMobileYM(e) {
							var passY = _self.maxY - _self.minY + 1;
							var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
							var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
							date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
							_self.trigger.value = (date_yy % passY + _self.minY) + _self.formatTp + date_mm;
							closeMobileCalendar(e);
					}
					//日期时间确认
					function finishMobileDateTime(e) {
							var passY = _self.maxY - _self.minY + 1;
							var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
							var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
							date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
							var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
							date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
							var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
							time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
							var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
							time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
							_self.trigger.value = (date_yy % passY + _self.minY) + _self.formatTp + date_mm + _self.formatTp + date_dd + " " + (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
							closeMobileCalendar(e);
					}
					//时间确认
					function finishMobileTime(e) {
							var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
							time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
							var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
							time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
							_self.trigger.value = (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
							closeMobileCalendar(e);
					}
					_self.trigger.addEventListener('click', {
							"ym": popupYM,
							"date": popupDate,
							"datetime": popupDateTime,
							"time": popupTime
					}[type]);
			}
	}
	return MobileCalendar;
})()
Vue.component('calendar',{
	template:`
			<input type="text" :value="value" ref="time" v-bind="$attrs">
	`,
	inheritAttrs:false,
	data(){
		timerConstract:null
	},
	props:{
		value:String,
		config:{
			type:Object,
			default(){
				return {
					type:'date'
				}
			}
		}
		// config:{
		// 		type:'date,ym,datetime,time', 
		// 		minDate:'2022-12-31,2022-12,2022-12-31 00:00,00:00' ,
		// 		maxDate:'2022-12-31,2022-12,2022-12-31 00:00,00:00',
		// 		formatTp:'.',//输出的日期格式，默认‘-’ YYYY-MM-DD
		// 	}
	},
	watch:{
		config:{
			handler(newval,oldval){
				var _self = this;
				this.timerConstract.init(Object.assign({},newval,{ 
					'trigger': _self.$refs.time,
					callBack:function(){
						_self.$emit('input', _self.$refs.time.value);
					}
				}))
			},
			deep:true
		}
	},
	mounted() {
		var _self = this;
		this.timerConstract = new LCalendar();
		this.timerConstract.init(Object.assign({},_self.config,{ 
			'trigger': _self.$refs.time,
			callBack:function(){
				_self.$emit('input', _self.$refs.time.value);
			}
		}))
	},
});