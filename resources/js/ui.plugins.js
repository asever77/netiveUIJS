//utils module
;(function ($, win, doc, undefined) {

	'use strict';

	var $ui = win.$plugins,
		namespace = 'netiveUI.plugins';

	/* ------------------------------------------------------------------------
	* name : accordion tab  
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiAccordion({ option });
	* - $plugins.uiAccordionToggle({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiAccordion: function (opt) {
			return createUiAccordion(opt);
		},
		uiAccordionToggle: function (opt) {
			return createUiAccordionToggle(opt);
		}
	});
	$ui.uiAccordion.option = {
	 	current: null,
		autoclose: false,
		callback: false,
		level: 3
	};
	function createUiAccordion(opt){
		if (opt === undefined || !$('#' + opt.id).length) {
			return false;
		}

		var opt = $.extend(true, {}, $ui.uiAccordion.option, opt),
			id = opt.id,
			current = opt.current,
			callback = opt.callback,
			autoclose = opt.autoclose,
			level = opt.lavel,
			$acco = $('#' + id),
			$wrap = $acco.children('.ui-acco-wrap'),
			$pnl = $wrap.children('.ui-acco-pnl'),
			$tit = $wrap.children('.ui-acco-tit'),
			$btn = $tit.find('.ui-acco-btn'),
			len = $wrap.length, 
			keys = $ui.option.keys,
			i = 0, 
			optAcco,
			para = $ui.uiPara('acco'),
			paras,
			paraname;
		
		
		//set up
		if (!!para) {
			if (para.split('+').length > 1) {
				//2개이상 설정
				//acco=exeAcco1*2+exeAcco2*3
				paras = para.split('+');

				for (var i = 0; i < paras.length; i++ ) {
					paraname = paras[i].split('*');
					opt.id === paraname[0] ? current = [Number(paraname[1])] : '';
				}
			} else {
				//1개 탭 설정
				//tab=1
			 	if (para.split('*').length > 1) {
					paraname = para.split('*');
					opt.id === paraname[0] ? current = [Number(paraname[1])] : '';
				} else {
					current = [Number(para)];
				}
			}
		}

		//set up
		!$pnl ? $pnl = $tit.children('.ui-acco-pnl') : '';
		$acco
			.attr('role','presentation')
			.data('opt', { 
				id:id, 
				close: autoclose, 
				callback: callback
			});
		$tit.attr('role','heading')
			.attr('aria-level', level);
		$pnl.attr('role','region');

		for (i = 0; i < len; i++) {
			var $accobtn = $wrap.eq(i).find('> .ui-acco-tit > .ui-acco-btn'),
				$accotit = $wrap.eq(i).find('> .ui-acco-tit'),
				$accopln = $wrap.eq(i).find('> .ui-acco-pnl');
			
			!$accopln ? $accopln = $accotit.children('.ui-acco-pnl') : '';
			$accotit.attr('id') === undefined ? $accobtn.attr('id', id + '-btn' + i) : '';
			$accopln.attr('id') === undefined ? $accopln.attr('id', id + '-pnl' + i) : '';
			
			$accobtn
				.data('selected', false)
				.attr('data-n', i)
				.attr('data-len', len)
				.attr('aria-expanded', false)
				.attr('aria-controls', $accopln.attr('id'))
				.removeClass('selected')
				.find('.ui-acco-arrow').text('열기');
			$accopln
				.attr('data-n', i)
				.attr('data-len', len)
				.attr('aria-labelledby', $accobtn.attr('id'))
				.attr('aria-hidden', true).hide();

			i === 0 ? $accobtn.attr('acco-first', true) : '';
			i === len - 1 ? $accobtn.attr('acco-last', true) : ''
		}
		
		current !== null ? 
			$ui.uiAccordionToggle({ 
				id: id, 
				current: current, 
				motion: false 
			}) : '';

		//event
		$btn.off('click.uiaccotab keydown.uiaccotab')
			.on({
				'click.uiaccotab': evtClick,
				'keydown.uiaccotab': evtKeys
			});

		function evtClick(e) {
			if (!!$(this).closest('.ui-acco-wrap').find('.ui-acco-pnl').length) {
				e.preventDefault();
				var $this = $(this);

				optAcco = $this.closest('.ui-acco').data('opt');
				$ui.uiAccordionToggle({ 
					id: optAcco.id, 
					current: [$this.data('n')], 
					close: optAcco.close, 
					callback: optAcco.callback
				});
			}
		}
		function evtKeys(e) {
			var $this = $(this),
				n = Number($this.data('n')),
				m = Number($this.data('len')),
				id = $this.closest('.ui-acco').attr('id');

			switch(e.keyCode){
				case keys.up: upLeftKey(e);
				break;

				case keys.left: upLeftKey(e);
				break;

				case keys.down: downRightKey(e);
				break;

				case keys.right: downRightKey(e);
				break;

				case keys.end: endKey(e);
				break;

				case keys.home: homeKey(e);
				break;
			}

			function upLeftKey(e) {
				e.preventDefault();
				
				!$this.attr('acco-first') ?
				$('#' + id + '-btn' + (n - 1)).focus():
				$('#' + id + '-btn' + (m - 1)).focus();
			}
			function downRightKey(e) {
				e.preventDefault();

				!$this.attr('acco-last') ? 
				$('#' + id + '-btn' + (n + 1)).focus():
				$('#' + id + '-btn0').focus();
			}
			function endKey(e) {
				e.preventDefault();

				$('#' + id + '-btn' + (m - 1)).focus();
			}
			function homeKey(e) {
				e.preventDefault();
				$('#' + id + '-btn0').focus();
			}
		}
	}
	function createUiAccordionToggle(opt){
		if (opt === undefined) {
			return false;
		}
		
		var id = opt.id,
			$acco = $('#' + id),
			dataOpt = $acco.data('opt'),
			current = opt.current === undefined ? null : opt.current,
			callback = opt.callback === undefined ? dataOpt.callback : opt.callback,
			state = opt.state === undefined ? 'toggle' : opt.state,
			motion = opt.motion === undefined ? true : opt.motion,
			autoclose = dataOpt.close,
			open = null,
			$wrap = $acco.children('.ui-acco-wrap'),
			$pnl,
			$tit,
			$btn,
			len = $wrap.length,
			speed = 200,
			i, c = 0;
		
		(motion === false) ? speed = 0 : speed = 200;

		if (current !== 'all') {
			for (i = 0 ; i < current.length; i++) {
				$pnl = $wrap.eq(current[i]).children('.ui-acco-pnl');
				$tit = $wrap.eq(current[i]).children('.ui-acco-tit');
				$btn = $tit.find('.ui-acco-btn');
				
				if (state === 'toggle') {
					(!$btn.data('selected')) ? act('down') : act('up');
				} else {
					(state === 'open') ? act('down') : (state === 'close') ? act('up') : '';
				}
			}
			!callback ? '' :
				callback({ 
					id:id, 
					open:open, 
					current:current
				});
		} else if (current === 'all') {
			checking();
		}

		function checking() {
			//열린상태 체크하여 전체 열지 닫을지 결정
			c = 0;
			$wrap.each(function(i){
				c = ($wrap.eq(i).find('> .ui-acco-tit .ui-acco-btn').attr('aria-expanded') === 'true') ? c + 1 : c + 0;
			});
			//state option 
			if (state === 'open') {
				c = 0;
				$acco.data('allopen', false);
			} else if (state === 'close') {
				c = len;
				$acco.data('allopen', true);
			}
			//all check action
			if (c === 0 || !$acco.data('allopen')) {
				$acco.data('allopen', true);
				act('down');
			} else if (c === len || !!$acco.data('allopen')) {
				$acco.data('allopen', false);
				act('up');
			}
		}
		//모션
		function act(v) {
			var isDown = v === 'down',
				a = isDown ? true : false, 
				cls = isDown ? 'addClass' : 'removeClass', 
				updown = isDown ? 'slideDown' : 'slideUp',
				txt = isDown ? '닫기' : '열기';
			
			open = isDown ? true : false;

			if (autoclose === true && isDown) {
				$wrap.each(function(i){
					$wrap.eq(i).find('> .ui-acco-tit .ui-acco-btn').data('selected', false).removeClass('selected').attr('aria-expanded', false)
						.find('.ui-acco-arrow').text('열기');
					$wrap.eq(i).find('> .ui-acco-pnl').attr('aria-hidden',true).stop().slideUp(speed);
				});
			}
			if (current === 'all') {
				$wrap.each(function(i){
					$wrap.eq(i).find('> .ui-acco-tit .ui-acco-btn').data('selected', a)[cls]('selected').attr('aria-expanded', a)
						.find('.ui-acco-arrow').text(txt);
					$wrap.eq(i).find('> .ui-acco-pnl').attr('aria-hidden', !a).stop()[updown](speed, function(){
						$(this).css({ height: '', padding: '', margin: '' }); // 초기화
					});
				});
			} else {
				$btn.data('selected', a).attr('aria-expanded', a)[cls]('selected')
					.find('.ui-acco-arrow').text(txt);
				$pnl.attr('aria-hidden', !a).stop()[updown](speed, function(){
					$(this).css({ height: '', padding: '', margin: '' }); // 초기화
				});
			}
		}
	}



	/* ------------------------------------------------------------------------
	* name : dropdown
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uidropdown({ option });
	* - $plugins.uiDropdownToggle({ option });
	* - $plugins.uiDropdownHide();
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiDropdown: function (opt) {
			return createUiDropdown(opt);
		},
		uiDropdownToggle: function (opt) {
			return createUiDropdownToggle(opt);
		},
		uiDropdownHide: function () {
			return createUiDropdownHide();
		},
	});
	$ui.uiDropdown.option = {
		eff: 'base',
		ps: 'bl',
		hold: true,
		auto: false,
		back_close: true,
		openback:false,
		closeback:false,
		dim : false,
		_offset: false,
		_close: true,
		_expanded: false,
		eff_ps: 10,
		eff_speed: 100
	};
	function createUiDropdown(opt){
		if (opt === undefined || !$('#' + opt.id).length) {
			return false;
		}

		var opt = $.extend(true, {}, $ui.uiDropdown.option, opt),
			id = opt.id,
			eff = opt.eff,
			auto = opt.auto,
			ps = opt.ps,
			hold = opt.hold,
			back_close = opt.back_close,
			dim = opt.dim,
			openback = opt.openback,
			closeback = opt.closeback,
			_offset = opt._offset,
			_close = opt._close,
			_expanded = opt._expanded,
			eff_ps = opt.eff_ps,
			eff_speed = opt.eff_speed,
			$btn = $('#' + id),
			$pnl = $('[data-id="'+ id +'"]'); 
				
		//set up

		if (auto) {
			if (Math.abs($(win).scrollTop() - $btn.offset().top - $btn.outerHeight()) < Math.abs($(win).scrollTop() +  $(win).outerHeight() / 1.5)) {
				ps = 'bc';
				eff = 'st';
			} else {
				ps = 'tc';
				eff = 'sb';
			}
		}
		$btn.attr('aria-expanded', false)
			.data('opt', { 
				id: id, 
				eff: eff, 
				ps: ps,
				hold: hold, 
				auto: auto,
				dim: dim,
				openback: openback,
				closeback: closeback,
				_offset: _offset, 
				_close :_close, 
				_expanded: _expanded,
				eff_ps: eff_ps,
				eff_speed: eff_speed
			});
		$pnl.attr('aria-hidden', true).attr('aria-labelledby', id).addClass(ps)
			.data('opt', { 
				id: id, 
				eff: eff, 
				ps: ps,
				hold: hold, 
				auto: auto,
				dim : dim,
				openback: openback,
				closeback: closeback,
				_offset: _offset, 
				_close: _close, 
				_expanded: _expanded,
				eff_ps: eff_ps,
				eff_speed: eff_speed
			});
		
		//event
		$btn.off('click.dropdown').on('click.dropdown', function(e){
			action(this);
		});
		$(doc)
		.off('click.dropdownclose').on('click.dropdownclose', '.ui-drop-close', function(e){
			var pnl_opt = $('#' + $(this).closest('.ui-drop-pnl').data('id')).data('opt');

			pnl_opt._expanded = true;
			$ui.uiDropdownToggle({ id: pnl_opt.id });
			$('#' + pnl_opt.id).focus();
		})
		.off('click.bd').on('click.bd', function(e){
			//dropdown 영역 외에 클릭 시 판단
			if (!!$('body').data('dropdownOpened')){
				if ($('.ui-drop-pnl').has(e.target).length < 1) {
					$ui.uiDropdownHide();
				}
			}
		});

		!back_close ? $(doc).off('click.bd') : '';

		function action(t) {
			var $this = $(t),
				btn_opt = $this.data('opt');

			$this.data('sct', $(doc).scrollTop());
			$ui.uiDropdownToggle({ id: btn_opt.id });
		}
	}
	function createUiDropdownToggle(opt){
		if (opt === undefined) {
			return false;
		}
		
		var id = opt.id,
			$btn = $('#' + id),
			$pnl = $('.ui-drop-pnl[data-id="'+ id +'"]'),
			defaults = $btn.data('opt'),
			opt = $.extend(true, {}, defaults, opt),
			eff = opt.eff,
			auto = opt.auto,
			ps = opt.ps,
			dim = opt.dim,
			openback = opt.openback,
			closeback = opt.closeback,
			hold = opt.hold,
			_offset = opt._offset,
			_close = opt._close,
			_expanded =  $btn.attr('aria-expanded'),
			eff_ps = opt.eff_ps, 
			eff_speed = opt.eff_speed,
			is_modal = !!$btn.closest('.ui-modal').length,
			btn_w = Math.ceil($btn.outerWidth()),
			btn_h = Math.ceil($btn.outerHeight()),
			btn_t = Math.ceil($btn.position().top),
			btn_l = Math.ceil($btn.position().left),
			pnl_w = Math.ceil($pnl.outerWidth()),
			pnl_h = Math.ceil($pnl.outerHeight());

		//_offset: ture 이거나 modal안의 dropdown 일때 position -> offset 으로 위치 값 변경
		if (_offset || is_modal) {
			btn_t = Math.ceil($btn.offset().top);
			btn_l = Math.ceil($btn.offset().left);
			is_modal ? btn_t = btn_t - $(win).scrollTop(): '';
		}

		//test 
		!!$btn.attr('data-ps') ? ps = $btn.attr('data-ps') : '';

		//위치 자동 설정
		if (auto) {
			if (Math.abs($(win).scrollTop() - $btn.offset().top - $btn.outerHeight()) < Math.abs($(win).scrollTop() +  $(win).outerHeight() / 1.5)) {
				ps = 'bc';
				eff = 'st';
			} else {
				ps = 'tc';
				eff = 'sb';
			}
		}
		
		_expanded === 'false' ? pnlShow(): pnlHide();

		function pnlShow(){
			var org_t, 
				org_l,
				drop_inner = $btn.closest('.ui-drop-pnl').data('id');
			
			//다른 dropdown 닫기가 활성화일때
			if (_close) {
				//dropdown in dropdown 인 경우
				if (!!drop_inner) {
					$('.ui-drop').not('#' + drop_inner).attr('aria-expanded', false);
					$('.ui-drop-pnl').not('[data-id="' + drop_inner +'"]').attr('aria-hidden', true).attr('tabindex', -1).removeAttr('style');
				} else {
					$ui.uiDropdownHide();
				}
			}

			$btn.attr('aria-expanded', true);
			$pnl.attr('aria-hidden', false).attr('tabindex', 0).addClass('on');

			//focus hold or sense
			hold ?	
				$ui.uiFocusTab({ selector:'.ui-drop-pnl[data-id="'+ id +'"]', type:'hold' }):
				$ui.uiFocusTab({ selector:'.ui-drop-pnl[data-id="'+ id +'"]', type:'sense', callback:pnlHide });

			switch (ps) {
				case 'bl': $pnl.css({ top: btn_t + btn_h, left: btn_l }); 
					break;
				case 'bc': $pnl.css({ top: btn_t + btn_h, left: btn_l - ((pnl_w - btn_w) / 2) }); 
					break;
				case 'br': $pnl.css({ top: btn_t + btn_h, left: btn_l - (pnl_w - btn_w) }); 
					break;
				case 'tl': $pnl.css({ top: btn_t - pnl_h, left: btn_l }); 
					break;
				case 'tc': $pnl.css({ top: btn_t - pnl_h, left: btn_l - ((pnl_w - btn_w) / 2) }); 
					break;
				case 'tr': $pnl.css({ top: btn_t - pnl_h, left: btn_l - (pnl_w - btn_w) }); 
					break;
				case 'rt': $pnl.css({ top: btn_t, left: btn_l + btn_w }); 
					break;
				case 'rm': $pnl.css({ top: btn_t - ((pnl_h - btn_h) / 2), left:  btn_l + btn_w  }); 
					break;
				case 'rb': $pnl.css({ top: btn_t - (pnl_h - btn_h), left: btn_l + btn_w }); 
					break;
				case 'lt': $pnl.css({ top: btn_t, left: btn_l - pnl_w }); 
					break;
				case 'lm': $pnl.css({ top: btn_t - ((pnl_h - btn_h) / 2), left: btn_l - pnl_w  }); 
					break;
				case 'lb': $pnl.css({ top: btn_t - (pnl_h - btn_h), left: btn_l - pnl_w }); 
					break; 
				case 'center': $pnl.css({ top: '50%', left: '50%', marginTop: (pnl_h / 2 ) * -1, marginLeft: (pnl_w / 2 ) * -1 }); 
					break;
			}
			
			org_t = parseInt($pnl.css('top')),
			org_l = parseInt($pnl.css('left'));
			
			switch (eff) {
				case 'base': $pnl.stop().show(0); 
					break;
				case 'fade': $pnl.stop().fadeIn(eff_speed); 
					break;
				case 'st': $pnl.css({ top: org_t - eff_ps, opacity: 0, display: 'block' }).stop().animate({ top: org_t, opacity: 1 }, eff_speed); 
					break;
				case 'sb': $pnl.css({ top: org_t + eff_ps, opacity: 0, display: 'block' }).stop().animate({ top: org_t, opacity: 1 }, eff_speed); 
					break;
				case 'sl': $pnl.css({ left: org_l + eff_ps, opacity: 0, display: 'block' }).stop().animate({ left: org_l, opacity: 1 }, eff_speed); 
					break;
				case 'sr': $pnl.css({ left: org_l - eff_ps, opacity: 0, display: 'block' }).stop().animate({ left: org_l, opacity: 1 }, eff_speed); 
					break;
			}

			setTimeout(function(){
				$('body').data('dropdownOpened',true).addClass('dropdownOpened');
			},0);

			!!openback ? openback() : '';
			!!dim ? dimShow($pnl) : '';
			
		}
		function pnlHide(){
			var org_t = parseInt($pnl.css('top')),
				org_l = parseInt($pnl.css('left'));
			
			if ($pnl.closest('.ui-drop-box').length < 1) {
				$('body').data('dropdownOpened',false).removeClass('dropdownOpened');
			}
			$btn.attr('aria-expanded', false).focus();
			$pnl.attr('aria-hidden', true).attr('tabindex', -1).removeClass('on');
			
			switch (eff) {
				case 'base': $pnl.stop().hide(0, pnlHideEnd); 
					break;
				case 'fade': $pnl.stop().fadeOut(eff_speed, pnlHideEnd); 
					break;
				case 'st': $pnl.stop().animate({ top: org_t - eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
				case 'sb': $pnl.stop().animate({ top: org_t + eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
				case 'sl': $pnl.stop().animate({ left: org_l + eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
				case 'sr': $pnl.stop().animate({ left: org_l - eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
			}

			function pnlHideEnd(){
				$pnl.hide().removeAttr('style'); 
			}

			!!closeback ? closeback() : '';
			!!dim ? dimHide() : '';
		}

		
	}
	function dimShow(t){
		$(t).after('<div class="ui-drop-dim"></div>');
		$('.ui-drop-dim').stop().animate({
			opacity:0.7
		})
	}
	function dimHide(){
		$('.ui-drop-dim').stop().animate({
			opacity:0
		},200, function(){
			$(this).remove();
		});
	}
	function createUiDropdownHide(){
		$('body').data('dropdownOpened',false).removeClass('dropdownOpened');
		$('.ui-drop').attr('aria-expanded', false);
		
		$('.ui-drop-pnl[aria-hidden="false"]').each(function(){
			var $pnl = $(this),
				defaults = $pnl.data('opt'),
				opt = $.extend(true, {}, defaults),
				eff = opt.eff,
				eff_ps = opt.eff_ps,
				closeback = opt.closeback,
				eff_speed = opt.eff_speed,
				org_t = parseInt($pnl.css('top')),
				org_l = parseInt($pnl.css('left'));
			
			switch (eff) {
				case 'base': $pnl.stop().hide(0, pnlHideEnd); 
					break;
				case 'fade': $pnl.stop().fadeOut(eff_speed, pnlHideEnd); 
					break;
				case 'st': $pnl.stop().animate({ top: org_t - eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
				case 'sb': $pnl.stop().animate({ top: org_t + eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
				case 'sl': $pnl.stop().animate({ left: org_l + eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
				case 'sr': $pnl.stop().animate({ left: org_l - eff_ps, opacity: 0 }, eff_speed, pnlHideEnd); 
					break;
			}

			function pnlHideEnd(){
				$pnl.hide().removeAttr('style'); 
			}
			$pnl.attr('aria-hidden', true).attr('tabindex', -1);
			!!closeback ? closeback() : '';
		});	

		
		dimHide();
	}



	/* ------------------------------------------------------------------------
	* name : date picker
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiDatePicker({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiDatePicker: function (opt) {
			return createUiDatePicker(opt);
		}
	});
	$ui.uiDatePicker.option = {
		selector: '.ui-datepicker',
		multi: false,
		title: false,
		date_split: '.',
		openback: false,
		closeback: false,
		dual: true,
		callback: function(v){ console.log(v) },
		shortDate: false, //DDMMYYYY
		dateMonths: new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'),
		weekDay: new Array('일', '월', '화', '수', '목', '금', '토'),
		remove: false
	};
	function createUiDatePicker(opt){
		var opt = $.extend(true, {}, $ui.uiDatePicker.option, opt),
			date_split = opt.date_split,
			selector = opt.selector,
			multi = opt.multi,
			dual = opt.dual,
			openback = opt.openback,
			date_title = opt.title,
			closeback = opt.closeback,
			callback = opt.callback,
			dateMonths = opt.dateMonths,
			weekDay = opt.weekDay,
			shortDate = opt.shortDate,
			remove = opt.remove,
			$datepicker = $(selector),
			date = new Date(),
			dateToday = date,
			calVar,
			day_start,
			day_end;

		$ui.uiDatePicker.option.dual = dual;
		
		$datepicker.data('opt', { callback: callback, shortDate: shortDate, openback:openback, closeback:closeback, multi:multi });

		//이달의 날짜 텍스트화
		function textDate(d, m, y, whatday) {
			var text_date = new Date(y, m - 1, d);
			
			if (whatday === true) {
				//요일 추가
				return (text_date.getFullYear() + date_split + dateMonths[text_date.getMonth()] + date_split + $ui.option.partsAdd0(text_date.getDate()) + " (" + weekDay[text_date.getDay()] + ")");
			} else {
				return (text_date.getFullYear() + date_split + dateMonths[text_date.getMonth()] + date_split + $ui.option.partsAdd0(text_date.getDate()));
			}
		}

		//사용여부확인 필요
		function subtractDate(oneDate, anotherDate) { 
			return (anotherDate - oneDate); 
		}

		//DD.MM.YYYY 순으로 정렬
		function toDDMMYYY(d) {
			var d = new Date(d);
			return ($ui.option.partsAdd0(d.getDate()) + date_split + $ui.option.partsAdd0(d.getMonth() + 1) + date_split + d.getFullYear());
		}
		//input에 출력
		function writeInputDateValue(calendarEl, obj, end) {
			var d = $(obj).data("day"),
				id = calendarEl.inputId,
				opt = $("#" + id).closest('.ui-datepicker').data('opt');

			!!end ? id = id + '_end' : '';

			calendarEl.shortDate ? d = toDDMMYYY(d) : ''; //DD.MM.YYYY로 설정

			$("#" + id).val(d);
			!!opt.callback ? opt.callback({ id:id, value:d }): '';
		}

		function calendarObject(opt) {
			this.calId = opt.calId;
			this.inputId = opt.inputId;
			this.buttonId = opt.buttonId;
			this.shortDate = opt.shortDate;
		}

		//사용여부확인 필요
		function matchToday() {
			$('.tbl-datepicker button').not(':disabled').each(function () {
				var $this = $(this);

				$this.data('day') === textDate(dateToday.getDate(), dateToday.getMonth() + 1, dateToday.getFullYear(), false) ?
					$this.attr('title', $this.attr('title')+' (오늘)').addClass('today') : '';
			});
		}

		//달력 Build
		function buildCalendar(date, calendarEl, v) {
			var inp_val = $('#' + calendarEl.inputId).val(),
				nVal = inp_val.split(date_split),
				generate = v === 'generate' ? true : false,
				day = !generate ? date.getDate() : inp_val === '' ? date.getDate() : Number(nVal[2]),
				month = !generate ? date.getMonth() : inp_val === '' ? date.getMonth() : Number(nVal[1] - 1),
				year = !generate ? date.getFullYear() : inp_val === '' ? date.getFullYear() : Number(nVal[0]),
				prevMonth = new Date(year, month - 1, 1),
				thisMonth = new Date(year, month, 1),
				nextMonth = new Date(year, month + 1, 1),
				firstWeekDay = thisMonth.getDay(),
				daysInMonth = Math.floor((nextMonth.getTime() - thisMonth.getTime()) / (1000 * 60 * 60 * 24)),
				daysInMonth_prev = Math.floor((thisMonth.getTime() - prevMonth.getTime()) / (1000 * 60 * 60 * 24)),
				$input = $('#' + calendarEl.inputId).eq(0),
				tit = !date_title ? $input.attr('title') : date_title,
				_minDay = new Array(),
				_maxDay = new Array(),
				_calendarHtml = '',
				//_isOver = false,
				mm = nextMonth.getMonth(),
				week_day;

			$input.data('min') !== undefined ? _minDay = $input.data('min').split(date_split, 3) : _minDay[0] = 1910;// 최소 선택 가능
			$input.data('max') !== undefined ? _maxDay = $input.data('max').split(date_split, 3) : _maxDay[0] = 2050;// 최대 선택 가능
			month === 2 ? daysInMonth = 31 : '';
			
			/* datepicker-head -------------------- */
			_calendarHtml += '<div class="datepicker-head">';
			/* title: datepicker-head-tit */
			_calendarHtml += '<div class="datepicker-head-tit">'+ tit +'</div>';
		
			/* 년월 선택: datepicker-head-select */
			_calendarHtml += '<div class="datepicker-head-select">';
			_calendarHtml += '<div class="ui-select datepicker-head-year">';
			_calendarHtml += '<select title="년도 선택" id="sel_'+ calendarEl.inputId +'_year">';

			for (var y = Number(_minDay[0]); y < Number(_maxDay[0]) + 1; y++) {
				_calendarHtml += y === year ? '<option value="'+ y +'" selected>'+ y +'년</option>': '<option value="'+ y +'">'+ y +'년</option>';
			}

			_calendarHtml += '</select>';
			_calendarHtml += '</div>';

			_calendarHtml += '<div class="ui-select datepicker-head-month">';
			_calendarHtml += '<select title="월 선택" id="sel_'+ calendarEl.inputId +'_month">';

			for (var m = 1; m < 13; m++) {
				m < 10 ? m = '0' + m : '';
				_calendarHtml += m === month + 1 ? '<option value="'+ Number(m) +'" selected>'+ m +'월</option>': '<option value="'+ Number(m) +'">'+ m +'월</option>';
				m = Number(m);
			}

			_calendarHtml += '</select>';
			_calendarHtml += '</div>';
			_calendarHtml += '</div>';

			/* 년월 선택: button */
			_calendarHtml += '<div class="datepicker-head-btn">';
			_calendarHtml += year <= _minDay[0] && dateMonths[month] <= _minDay[1] ? 
				'<button type="button" class="ui-datepicker-prev-y disabled" disabled>': '<button type="button" class="ui-datepicker-prev-y" title="이전 년도">';
			_calendarHtml += '<span class="hide">이전 ' + (year - 1) + ' 년으로 이동</span></button>';

			_calendarHtml += year <= _minDay[0] ? 
				'<button type="button" class="ui-datepicker-prev disabled" disabled>': '<button type="button" class="ui-datepicker-prev" title="이전 달">';
			_calendarHtml += '<span class="hide">이전 ' + dateMonths[(month === 0) ? 11 : month - 1] + ' 월로 이동</span></button>';

			_calendarHtml += year >= _maxDay[0] && dateMonths[month] >= _maxDay[1] ? 
				'<button type="button" class="ui-datepicker-next disabled" disabled>': '<button type="button" class="ui-datepicker-next" title="다음 달">';
			_calendarHtml += '<span class="hide">다음 ' + dateMonths[(month == 11) ? 0 : month + 1] + ' 월로 이동</span></button>';

			_calendarHtml += year >= _maxDay[0] ? 
				'<button type="button" class="ui-datepicker-next-y disabled" disabled>': '<button type="button" class="ui-datepicker-next-y" title="다음 년도">';
			_calendarHtml += '<span class="hide">다음 ' + (year + 1) + ' 년으로 이동</span></button>';
			_calendarHtml += '</div>';

			/* today */
			_calendarHtml += '<div class="datepicker-head-today">';
			_calendarHtml += '<button type="button" class="today" data-day=' + textDate(dateToday.getDate(), dateToday.getMonth() + 1, dateToday.getFullYear(), false) + ' title="오늘로 이동"><span class="hide">오늘 - '+ textDate(dateToday.getDate(), dateToday.getMonth() + 1, dateToday.getFullYear(), true) +' 이동</span></button>';
			_calendarHtml += '</div>';
			
			/* datepicker-head-date */
			_calendarHtml += '<div class="datepicker-head-date">';
			
			
			if (multi && dual) {
				_calendarHtml += '<div class="datepicker-multi-head">';
				_calendarHtml += '<div class="n1">';
				_calendarHtml += '<span class="year" data-y="'+ year +'"><strong>' + year + '</strong>년</span> ';
				_calendarHtml += '<span class="month" data-m="'+ dateMonths[month] +'"><strong>' + dateMonths[month] + '</strong>월</span>';
				_calendarHtml += '</div>';

				_calendarHtml += '<div class="n2">';
				_calendarHtml += '<span class="year2" data-y="'+ year +'"><strong>' + year + '</strong>년</span> ';
				_calendarHtml += '<span class="month2" data-m="'+  dateMonths[month + 1] +'"><strong>' +  dateMonths[month + 1] + '</strong>월</span>';
				_calendarHtml += '</div>';
				_calendarHtml += '</div>';
			} else {
				_calendarHtml += '<span class="year" data-y="'+ year +'"><strong>' + year + '</strong>년</span> ';
				_calendarHtml += '<span class="month" data-m="'+ dateMonths[month] +'"><strong>' + dateMonths[month] + '</strong>월</span>';
			
			}
			
			_calendarHtml += '<span class="hide">선택됨</span>';
			_calendarHtml += '</div>';
			_calendarHtml += '</div>';
			
			/* datepicker-core -------------------- */
			_calendarHtml += '<div class="datepicker-core"></div>';
			_calendarHtml += '<button type="button" class="btn-close ui-datepicker-close"><span class="hide">닫기</span></button>';

			return _calendarHtml;
		}
		function buildCore(date, calendarEl, v) {
			var $base = $('#' + calendarEl.calId),
				inp_val = $('#' + calendarEl.inputId).val(),
				nVal = inp_val.split(date_split),
				generate = v === 'generate' ? true : false,
				day = !generate ? date.getDate() : inp_val === '' ? date.getDate() : Number(nVal[2]),
				month = !generate ? date.getMonth() : inp_val === '' ? date.getMonth() : Number(nVal[1] - 1),
				year = !generate ? date.getFullYear() : inp_val === '' ? date.getFullYear() : Number(nVal[0]),
				prevMonth = new Date(year, month - 1, 1),
				thisMonth = new Date(year, month, 1),
				nextMonth = new Date(year, month + 1, 1),
				nextMonth2 = new Date(year, month + 2, 1),
				firstWeekDay = thisMonth.getDay(),
				nextWeekDay = nextMonth.getDay(),
				prevWeekDay = prevMonth.getDay(),
				daysInMonth = Math.floor((nextMonth.getTime() - thisMonth.getTime()) / (1000 * 60 * 60 * 24)),
				daysInMonth_prev = Math.floor((thisMonth.getTime() - prevMonth.getTime()) / (1000 * 60 * 60 * 24)),
				daysInMonth_next = Math.floor((nextMonth2.getTime() - nextMonth.getTime()) / (1000 * 60 * 60 * 24)),
				$input = $('#' + calendarEl.inputId).eq(0),
				tit = $input.attr('title'),
				_minDay = new Array(),
				_maxDay = new Array(),
				_calendarHtml = '',
				mm = nextMonth.getMonth(),
				week_day,
				empty_before = daysInMonth_prev - firstWeekDay,
				empty_after = 0;

			// 최소,최대 선택 가능
			$input.data('min') !== undefined ? _minDay = $input.data('min').split(date_split, 3) : _minDay[0] = 1910;
			$input.data('max') !== undefined ? _maxDay = $input.data('max').split(date_split, 3) : _maxDay[0] = 2050;

			month === 2 ? daysInMonth = 31 : '';

			$base.find('.ui-datepicker-prev span').text('이전 '+ dateMonths[(month === 0) ? 11 : month - 1]+ '월로 이동');
			$base.find('.ui-datepicker-next span').text('다음 '+ dateMonths[(month == 11) ? 0 : month + 1]+ '월로 이동');
			$base.find('.datepicker-head-date').find('.year').data('y',year).find('strong').text(year);
			$base.find('.datepicker-head-date').find('.month').data('m',dateMonths[month]).find('strong').text(dateMonths[month]);

			if (multi) {
				if (month + 1 === 12) {
					$base.find('.datepicker-head-date').find('.year2').data('y',year + 1).find('strong').text(year + 1);
					$base.find('.datepicker-head-date').find('.month2').data('m', dateMonths[0]).find('strong').text(dateMonths[0]);
				} else {
					$base.find('.datepicker-head-date').find('.year2').data('y',year).find('strong').text(year);
					$base.find('.datepicker-head-date').find('.month2').data('m', dateMonths[month + 1]).find('strong').text(dateMonths[month + 1]);
				}
			}

			$base.find('.datepicker-head-year option').prop('selected', false).removeAttr('selected');
			$base.find('.datepicker-head-year option[value="'+ year +'"]').prop('selected', true);
			$base.find('.datepicker-head-month option').prop('selected', false).removeAttr('selected');
			$base.find('.datepicker-head-month option[value="'+ (month + 1) +'"]').prop('selected', true);

			year <= _minDay[0] && dateMonths[month] <= _minDay[1] ? 
				$base.find('.ui-datepicker-prev').addClass('disabled').attr('disabled'):
				$base.find('.ui-datepicker-prev').removeAttr('disabled').removeClass('disabled');
			
			year <= _minDay[0] ? 
				$base.find('.ui-datepicker-prev-y').addClass('disabled').attr('disabled'):
				$base.find('.ui-datepicker-prev-y').removeAttr('disabled').removeClass('disabled');

			year >= _maxDay[0] && dateMonths[month] >= _maxDay[1] ? 
				$base.find('.ui-datepicker-next').addClass('disabled').attr('disabled'): 
				$base.find('.ui-datepicker-next').removeAttr('disabled').removeClass('disabled');

			year >= _maxDay[0] ? 
				$base.find('.ui-datepicker-next-y').addClass('disabled').attr('disabled'): 
				$base.find('.ui-datepicker-next-y').removeAttr('disabled').removeClass('disabled');
			
			//table datepicker 
			_calendarHtml += '<table class="tbl-datepicker" data-date="'+ year + '' + dateMonths[month] +'">';
			_calendarHtml += '<caption>'+ year +'년 '+ dateMonths[month] +'월 일자 선택</caption>';
			_calendarHtml += '<colgroup>';
			_calendarHtml += '<col span="7" class="n1">';
			_calendarHtml += '</colgroup>';
			_calendarHtml += '<thead><tr>';
			_calendarHtml += '<th scope="col" class="day-sun"><abbr title="일요일">'+ weekDay[0] +'</abbr></th>';
			_calendarHtml += '<th scope="col"><abbr title="월요일">'+ weekDay[1] +'</abbr></th>';
			_calendarHtml += '<th scope="col"><abbr title="화요일">'+ weekDay[2] +'</abbr></th>';
			_calendarHtml += '<th scope="col"><abbr title="수요일">'+ weekDay[3] +'</abbr></th>';
			_calendarHtml += '<th scope="col"><abbr title="목요일">'+ weekDay[4] +'</abbr></th>';
			_calendarHtml += '<th scope="col"><abbr title="금요일">'+ weekDay[5] +'</abbr></th>';
			_calendarHtml += '<th scope="col" class="day-sat"><abbr title="토요일">'+ weekDay[6] +'</abbr></th>';
			_calendarHtml += '</tr></thead>';
			_calendarHtml += '<tbody><tr>';

			//이전 달 
			prevMonthday(firstWeekDay);

			mm < 1 ? mm = 12 : '';
			mm = $ui.option.partsAdd0(mm);
			week_day = firstWeekDay;

			//현재 달
			for (var dayCounter = 1; dayCounter <= daysInMonth; dayCounter++) {
				week_day %= 7;
				week_day === 0 ? daysInMonth - dayCounter < 7 ? _calendarHtml += '</tr>' : _calendarHtml += '</tr><tr>' : '';
				
				if (week_day === 0) {
					_calendarHtml += '<td class="day-sun">';
				} else if (week_day === 6) {
					_calendarHtml += '<td class="day-sat">';
				} else {
					_calendarHtml += '<td>';
				}

				if ((year < _minDay[0]) || (year == _minDay[0] && dateMonths[month] < _minDay[1]) || (year == _minDay[0] && dateMonths[month] == _minDay[1] && dayCounter < _minDay[2])) {
					_calendarHtml += '<span title="'+ textDate(dayCounter, mm, year, true) +'">' + $ui.option.partsAdd0(dayCounter) + '</span></td>';
				} else if ((year > _maxDay[0]) || (year == _maxDay[0] && dateMonths[month] > _maxDay[1]) || (year == _maxDay[0] && dateMonths[month] == _maxDay[1] && dayCounter > _maxDay[2])) {
					_calendarHtml += '<span title="'+ textDate(dayCounter, mm, year, true) +'">' + $ui.option.partsAdd0(dayCounter) + '</span></td>';
				} else {
					_calendarHtml += '<button type="button" title="'+ textDate(dayCounter, mm, year, true) +'" data-day="'+ textDate(dayCounter, mm, year, false) +'" value="'+ dayCounter +'">'+ $ui.option.partsAdd0(dayCounter) +'</button></td>';
				}
				week_day++;
			}

			//다음 달
			nextMonthday(week_day);

			_calendarHtml += '</tr></tbody></table>';

			// multi datepicker table 
			if (multi && dual) {
				empty_after = 0;
		 		empty_before = daysInMonth - nextWeekDay;

				_calendarHtml += '<table class="tbl-datepicker type-multi" data-date="'+ year + '' + dateMonths[month + 1] +'">';
				_calendarHtml += '<caption>'+ year +'년 '+ dateMonths[month + 1] +'월 일자 선택</caption>';
				_calendarHtml += '<colgroup>';
				_calendarHtml += '<col span="7" class="n1">';
				_calendarHtml += '</colgroup>';
				_calendarHtml += '<thead><tr>';
				_calendarHtml += '<th scope="col" class="day-sun"><abbr title="일요일">'+ weekDay[0] +'</abbr></th>';
				_calendarHtml += '<th scope="col"><abbr title="월요일">'+ weekDay[1] +'</abbr></th>';
				_calendarHtml += '<th scope="col"><abbr title="화요일">'+ weekDay[2] +'</abbr></th>';
				_calendarHtml += '<th scope="col"><abbr title="수요일">'+ weekDay[3] +'</abbr></th>';
				_calendarHtml += '<th scope="col"><abbr title="목요일">'+ weekDay[4] +'</abbr></th>';
				_calendarHtml += '<th scope="col"><abbr title="금요일">'+ weekDay[5] +'</abbr></th>';
				_calendarHtml += '<th scope="col" class="day-sat"><abbr title="토요일">'+ weekDay[6] +'</abbr></th>';
				_calendarHtml += '</tr></thead>';
				_calendarHtml += '<tbody><tr>';

				//이전 달
				prevMonthday(nextWeekDay);

				mm = Number(mm) + 1;
				mm < 1 ? mm = 12 : '';

				if (mm > 12) {
					mm = 1;
					year = year + 1;
				};

 				mm = $ui.option.partsAdd0(mm);
				week_day = nextWeekDay;

				//현재 달
				for (var dayCounter = 1; dayCounter <= daysInMonth_next; dayCounter++) {
					week_day %= 7;
					week_day === 0 ? daysInMonth_next - dayCounter < 7 ? _calendarHtml += '</tr>' : _calendarHtml += '</tr><tr>' : '';
					
					if (week_day === 0) {
						_calendarHtml += '<td class="day-sun">';
					} else if (week_day === 6) {
						_calendarHtml += '<td class="day-sat">';
					} else {
						_calendarHtml += '<td>';
					}

					if ((year < _minDay[0]) || (year == _minDay[0] && dateMonths[month + 1] < _minDay[1]) || (year == _minDay[0] && dateMonths[month + 1] == _minDay[1] && dayCounter < _minDay[2])) {
						_calendarHtml += '<span title="'+ textDate(dayCounter, mm, year, true) +'">' + $ui.option.partsAdd0(dayCounter) + '</span></td>';
					} else if ((year > _maxDay[0]) || (year == _maxDay[0] && dateMonths[month + 1] > _maxDay[1]) || (year == _maxDay[0] && dateMonths[month + 1] == _maxDay[1] && dayCounter > _maxDay[2])) {
						_calendarHtml += '<span title="'+ textDate(dayCounter, mm, year, true) +'">' + $ui.option.partsAdd0(dayCounter) + '</span></td>';
					} else {
						_calendarHtml += '<button type="button" title="'+ textDate(dayCounter, mm, year, true) +'" data-day="'+ textDate(dayCounter, mm, year, false) +'" value="'+ dayCounter +'">'+ $ui.option.partsAdd0(dayCounter) +'</button></td>';
					}
					week_day++;
				}

				//다음 달
				nextMonthday(week_day);

				_calendarHtml += '</tr></tbody></table>';
			}

			function prevMonthday(weekDay){
				for (var week = 0; week < weekDay; week++) {
					empty_before = empty_before + 1;

					if (week === 0) {
						_calendarHtml += '<td class="empty"><button type="button" disabled>'+ empty_before +'</button></td>';
					} else if (week === 6) {
						_calendarHtml += '<td class="empty"><button type="button" disabled>'+ empty_before +'</button></td>';
					} else {
						_calendarHtml += '<td class="empty"><button type="button" disabled>'+ empty_before +'</button></td>'; 
					}
				}
			}
			function nextMonthday(week_day){
				for (week_day = week_day; week_day < 7; week_day++) { 
					empty_after = empty_after + 1;

					if (week_day === 0) {
						_calendarHtml += '<td class="empty"><button type="button" disabled>'+ empty_after +'</button></td>';
					} else if (week_day == 6) {
						_calendarHtml += '<td class="empty"><button type="button" disabled>'+ empty_after +'</button></td>';
					} else {
						_calendarHtml += '<td class="empty"><button type="button" disabled>'+ empty_after +'</button></td>';
					}
				}
			}
			
			return _calendarHtml;
		}

		//달력 Hide&Remove
		function hideCalendar(calendarEl) {
			$("#" + calendarEl.calId).animate({
				opacity: 0
			}, 300, function () {
				$(this).remove();
			});
		}
		function datepickerClose(calendarEl){
			var $btn = $('#' + calendarEl.calId).closest('.ui-datepicker').find('.ui-datepicker-btn');

			$ui.uiDropdownToggle({ id:$btn.attr('id') });
			$ui.uiScroll({ value:$btn.data('sct'), speed:200 });

			remove ? hideCalendar(calendarEl): '';
		}

		//달력 Show
		function reDisplayCalendar(calendarEl, v) {
			var $calWrap = $("#" + calendarEl.calId);
			
			$calWrap.find('.datepicker-core').empty().append(buildCore(date, calendarEl, v));
			dayMultiSelect(calendarEl);
		}
		function displayCalendar(calendarEl, v) {
			var id_ = "#" + calendarEl.calId,
				$calWrap = $(id_);
			
			$calWrap.empty().append(buildCalendar(date, calendarEl, v));

			reDisplayCalendar(calendarEl, v);
			dayMultiSelect(calendarEl);
			$ui.uiFocusTab({ selector:$calWrap, type:'hold' });

			//datepicker event--------------------------------------------------------
			//select year & month
			$calWrap.find('.datepicker-head-year select').off('change.uidpsel').on('change.uidpsel', function(e){
				e.preventDefault();
				yearMonthSelect(this, 'year');
			});
			$calWrap.find('.datepicker-head-month select').off('change.uidpsel').on('change.uidpsel', function(e){
				e.preventDefault();
				yearMonthSelect(this, 'month');
			});
			//next & prev month
			$calWrap.find('.ui-datepicker-prev').off('click.uidatepicker').on('click.uidatepicker', function(e) {
				e.preventDefault();
				monthNextPrev(this, 'prev');
			});
			$calWrap.find('.ui-datepicker-next').off('click.uidatepicker').on('click.uidatepicker', function(e) {
				e.preventDefault();
				monthNextPrev(this, 'next');
			});
			$calWrap.find('.ui-datepicker-prev-y').off('click.uidatepicker').on('click.uidatepicker', function(e) {
				e.preventDefault();
				yearNextPrev(this, 'prev');
			});
			$calWrap.find('.ui-datepicker-next-y').off('click.uidatepicker').on('click.uidatepicker', function(e) {
				e.preventDefault();
				yearNextPrev(this, 'next');
			});
			//close
			$('.ui-datepicker-close').off('click.uidayclose').on('click.uidayclose', function(){
				datepickerClose(calendarEl);
			});

			function yearMonthSelect(t, v){
				var $currentDate = $(t).closest('.datepicker-head').find('.datepicker-head-date'),
					_y = v === 'year' ? 
						$(t).closest('.datepicker-head-year').find('select').eq(0).val(): 
						Number($currentDate.find('.year').data('y')),
					_m = v === 'month' ? 
						$(t).closest('.datepicker-head-month').find('select').eq(0).val(): 
						Number($currentDate.find('.month').data('m') - 1),
					dateTemp = v === 'year' ? new Date(_y, _m, 1): new Date(_y, _m - 1, 1);

				date = dateTemp;
				reDisplayCalendar(calendarEl);
				
				v === 'year' ? 
					$calWrap.find('.datepicker-head-year select').eq(0).focus(): 
					$calWrap.find('.datepicker-head-month select').eq(0).focus();
			}
			function monthNextPrev(t, v){
				var $this = $(t),
					limit = v === 'next' ? 'max': 'min',
					$currentDate = $this.closest('.datepicker-head').find('.datepicker-head-date'),
					_y = Number($currentDate.find('.year').data('y')),
					_m = Number($currentDate.find('.month').data('m') - 1),
					dateTemp = v === 'next' ? new Date(_y, _m + 1, 1): new Date(_y, _m - 1, 1);

				if ($this.hasClass('disabled')) {
					alert($('#'+ calendarEl.inputId).data(limit) +' 을 벗어난 달은 선택이 불가능 합니다.');
				} else {
					date = dateTemp;
					reDisplayCalendar(calendarEl);
					$this.eq(0).focus();
				}
			}
			function yearNextPrev(t, v){
				var $this = $(t),
					limit = v === 'next' ? 'max': 'min',
					$currentDate = $this.closest('.datepicker-head').find('.datepicker-head-date'),
					_y = Number($currentDate.find('.year').data('y')),
					_m = Number($currentDate.find('.month').data('m') - 1),
					dateTemp = v === 'next' ? new Date(_y + 1, _m, 1): new Date(_y - 1, _m, 1);

				if ($this.hasClass('disabled')) {
					alert($('#'+ calendarEl.inputId).data(limit) +' 을 벗어난 년은 선택이 불가능 합니다.');
				} else {
					date = dateTemp;
					reDisplayCalendar(calendarEl);
					$this.eq(0).focus();
				}
			}

			if (multi) {
				$(doc)
					.off('click.uidaysel').on('click.uidaysel', id_ + ' td button', function() {
						daySelectAct(calendarEl, this);
					})
					.off('mouseover.uidaysel').on('mouseover.uidaysel', id_ + ' td button', function() {
						dayHover(this);
					})
					.off('mouseover.uidaysel2').on('mouseover.uidaysel2', id_ + ' .type-multi td button', function() {
						monthHover(this);
					})
					.off('mouseleave.uidaysel3').on('mouseleave.uidaysel3', id_ + ' .tbl-datepicker', function() {
						$('.tbl-datepicker').find('.hover').removeClass('hover');
					})
					.off('click.uitoday').on('click.uitoday', id_ + ' .datepicker-head-today button', function() {
						date = new Date();
						reDisplayCalendar(calendarEl);
					})
					.off('click.uitoday').on('click.uitoday', id_ + ' .btn-base', function() {
						day_start ? writeInputDateValue(calendarEl, day_start) :'';
						day_end ? writeInputDateValue(calendarEl, day_end, true) : '';

						datepickerClose(calendarEl);
					});
			} else {
				$(doc)
					.off('click.uidaysel').on('click.uidaysel', id_ + ' td button', function() {
						var $this = $(this);

						writeInputDateValue(calendarEl, $this);
						datepickerClose(calendarEl);
					})
					.off('click.uitoday').on('click.uitoday', id_ + ' .datepicker-head-today button', function() {
						date = new Date();

						reDisplayCalendar(calendarEl);
						$calWrap.find('td button.today').eq(0).focus();
					});
			}

			
			var _btnOffset = $("#" + calendarEl.buttonId).offset();
			matchToday();
			
			return false;
		}

		function monthHover(t){
			var $this = $(t),
				$core = $this.closest('.datepicker-core'),
				$tbl = $this.closest('.tbl-datepicker');

			if (!!$core.data('start')) {
				$tbl.prev().find('tr').addClass('hover').find('td').addClass('hover');
			}
		}
		function dayHover(t){
			var $this = $(t),
				$core = $this.closest('.datepicker-core');

			if (!!$core.data('start')) {
				$this.closest('td').addClass('hover').prevAll().addClass('hover');
				$this.closest('tr').addClass('hover').prevAll().find('td').addClass('hover');

				$this.closest('td').nextAll().removeClass('hover');
				$this.closest('tr').removeClass('hover').nextAll().find('td').removeClass('hover');
			}
		}
		function daySelectAct(calendarEl, t){
			var $this = $(t),
				$core = $this.closest('.datepicker-core'),
				n_day = $this.data('day').replace(/\-/g,''),
				n_day_ = $core.data('day') === undefined ? false :$core.data('day').replace(/\-/g,'');

			if($ui.uiDatePicker.option.date_split === '.') {
				n_day = $this.data('day').replace(/\./g,'');
				n_day_ = $core.data('day') === undefined ? false :$core.data('day').replace(/\./g,'');
			}

			var sam_day = n_day === n_day_,
				next_day = n_day > n_day_,
				prev_day = n_day < n_day_;

			//첫클릭은 시작, 두번째는 종료
			if (!$core.data('start')) {
				$core.data('start', true);
				$core.data('day', n_day);

				//초기화
				$core.find('.selected-end').removeClass('selected-end').removeAttr('aria-selected');
				$core.find('.disabled').removeClass('disabled');
				$core.find('.hover-on').removeClass('hover-on');
				$core.find('.selected-start').removeClass('selected-start').removeAttr('aria-selected');
				$core.find('.selected').removeClass('selected').removeAttr('aria-selected');

				//선택 및 반영
				$this.addClass('selected-start').attr('aria-selected', true);
				if (!!$this.closest('table').hasClass('type-multi')) {
					$this.closest('table').prev().find('tr').addClass('disabled').find('td').addClass('disabled').find('button');
				}
				$this.closest('td').addClass('on-start').prevAll().addClass('disabled').find('button');
				$this.closest('tr').addClass('on-start').prevAll().addClass('disabled').find('td').addClass('disabled').find('button');

				$('.on-start').find('tr.on-start').find('button').attr('disabled');


				day_start = $this;
				writeInputDateValue(calendarEl, $this);
				writeInputDateValue(calendarEl, $this, true);
			} else if (next_day) {
				$core.data('start', false);

				$core.data('end',true).data('endday',n_day);
				$core.find('.selected-end').removeClass('selected-end').removeAttr('aria-selected');
				$this.addClass('selected-end').attr('aria-selected', true);

				$core.addClass('date-ing-on');
				day_end = $this;
				writeInputDateValue(calendarEl, $this, true);
				datepickerClose(calendarEl);
			} else if (sam_day) {
				$core.data('start',false).data('day', undefined);
				$this.removeClass('selected-start').removeAttr('aria-selected', true);
			} else if (prev_day) {
				//초기화
				$core.find('.selected-end').removeClass('selected-end').removeAttr('aria-selected');
				$core.find('.hover-on').removeClass('hover-on');
				$core.find('.selected-start').removeClass('selected-start').removeAttr('aria-selected');
				$core.find('.selected').removeClass('selected').removeAttr('aria-selected');
				$core.data('day', n_day);
				
				//선택 및 반영
				$this.addClass('selected-start').attr('aria-selected', true);
				if (!!$this.closest('table').hasClass('type-multi')) {
					$this.closest('table').prev().find('tr').addClass('disabled').find('td').addClass('disabled').find('button');
				}
				$this.closest('td').addClass('on-start').prevAll().addClass('disabled').find('button');
				$this.closest('tr').addClass('on-start').prevAll().addClass('disabled').find('td').addClass('disabled').find('button');
				$this.closest('td').addClass('on-start').nextAll().removeClass('disabled').find('button');
				$this.closest('tr').addClass('on-start').nextAll().removeClass('disabled').find('td').removeClass('disabled').find('button');

				$('.on-start').find('tr.on-start').find('button').attr('disabled');

				day_start = $this;
				writeInputDateValue(calendarEl, $this);
			} 
		}

		//dropdown 설정
		$datepicker.each(function() {
			var $this = $(this),
				$btn = $this.find('.ui-datepicker-btn');
			
			callback = !!$this.data('callback') ? $this.data('callback') : callback;

			if ($ui.browser.mobile) {
				$ui.uiDropdown({ 
					id:$btn.attr('id'), 
					ps:'center', 
					dim:true,
					openback: openback,
					closeback: closeback
				});
				$('#' + $btn.data('inp')).prop('readonly', true).attr('aria-hidden', true);
			} else {
				$ui.uiDropdown({ 
					id:$btn.attr('id'), 
					auto:true,
					openback: openback,
					closeback: closeback
				});
			}
			datepickerReady($btn);
		});

		//event 
		$datepicker.find('.ui-datepicker-btn').off('click.uidatepicker').on('click.uidatepicker', function() {
			datepickerReady(this);
		});

		//datepicker ready
		function datepickerReady(v){
			var $this = $(v),
				dropid = $this.attr('id'),
				inputId = $this.data('inp'),
				regExp = /^([0-9]{4})-([0-9]{2})-([0-9]{2})/g,
				_val = $('#' + inputId).val();

			($ui.uiDatePicker.option.date_split === '.') ? regExp = /^([0-9]{4}).([0-9]{2}).([0-9]{2})/g : '';

			var	reset = regExp.test(_val),
				calspaceHTML = '';

			$this.data('sct', $(doc).scrollTop());
			!reset ? $('#' + inputId).val(''): '';
			$this.closest('.ui-datepicker').find('.datepicker-sec').remove();
			
			calVar = new calendarObject({ 
				calId: "calWrap_" + dropid, 
				inputId: inputId, 
				buttonId: "calBtn_" + dropid,
				shortDate: shortDate
			});

			calspaceHTML += '<div id="'+ calVar.calId +'" class="datepicker-sec">';
			calspaceHTML += '<div class="datepicker-wrap">';
			calspaceHTML += '</div>';
			calspaceHTML += '</div>';

			$this.closest('.ui-datepicker').find('.ui-datepicker-wrap').append(calspaceHTML);
			displayCalendar(calVar, 'generate');

			console.log($ui.uiDatePicker.option.dual);

			if (multi && dual) {
				$this.closest('.ui-datepicker').find('.ui-datepicker-wrap').addClass('multi');
			}
		}

		function dayMultiSelect(calendarEl){
			if (multi) {
				$datepicker.find('.tbl-datepicker button[data-day="' + $('#' + calendarEl.inputId).val() + '"]').addClass('selected-start').attr('aria-selected', true).closest('td').addClass('on-start').closest('tr').addClass('on-start').closest('table').addClass('on-start-tbl');
				$datepicker.find('.tbl-datepicker button[data-day="' + $('#' + calendarEl.inputId + '_end').val() + '"]').addClass('selected-end').attr('aria-selected', true).closest('td').addClass('on-end').closest('tr').addClass('on-end').closest('table').addClass('on-end-tbl');

				var s = $('#' + calendarEl.inputId).val().replace(/\-/g,'').substring(0,6),
					e = $('#' + calendarEl.inputId + '_end').val().replace(/\-/g,'').substring(0,6);

				if ($ui.uiDatePicker.option.date_split === '.') {
					s = $('#' + calendarEl.inputId).val().replace(/\./g,'').substring(0,6);
					e = $('#' + calendarEl.inputId + '_end').val().replace(/\./g,'').substring(0,6);
				}
				
				$datepicker.find('.tbl-datepicker').find('.on-start').prevAll().addClass('disabled').find('td').addClass('disabled');
				$datepicker.find('.tbl-datepicker').find('.on-start').nextAll().addClass('hover-on').find('td').addClass('hover-on');
				$datepicker.find('.tbl-datepicker').find('.on-end').prevAll().addClass('hover-on').find('td').addClass('hover-on');
				$datepicker.find('.tbl-datepicker').find('.on-end').nextAll().removeClass('hover-on').find('td').removeClass('hover-on');
				$datepicker.find('.tbl-datepicker').find('.on-start').prevAll().removeClass('hover-on').find('td').removeClass('hover-on');
				
				if (!$('#' + calendarEl.inputId + '_end').val()) {
					$datepicker.find('.hover-on').removeClass('hover-on');
				} else {
					$datepicker.find('.tbl-datepicker').each(function(){
						if (s < $(this).data('date') && $(this).data('date') < e) {
							$(this).find('td').addClass('hover-on');
						} 
					});
				}
			} else {
				$datepicker.find('.tbl-datepicker button[data-day="' + $('#' + calendarEl.inputId).val() + '"]').addClass('selected').attr('aria-selected', true);
			}
		}
		
	}



	/* ------------------------------------------------------------------------
	* name : modal layer popup
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiModal({ option });
	* - $plugins.uiModalClose({ option });
	* - $plugins.uiModalResize({ option });
	* - $plugins.uiCookieModal({ option });
	* - $plugins.uiCookieModalClose({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiModal: function (opt) {
			return createUiModal(opt);
		},
		uiModalClose: function (opt) {
			return createUiModalClose(opt);
		},
		uiModalResize: function (opt) {
			return createUiModalResize(opt);
		},
		uiCookieModal: function (opt) {
			return creaeteUiCookieModal(opt);
		},
		uiCookieModalClose: function (opt) {
			return creaeteUiCookieModalClose(opt);
		}
	});
	$ui.uiModal.option = {
		autofocus: true,
		endfocus: null,
		full: false,
		link: false,
		remove: false,
		ps: 'center',
		callback: false,
		openback: false,
		closeback: false,
		space: 10,
		ajax_type: 'GET',
		open: true,
		mpage: false,
		cutline: 31,

		system_words: false,
		system_btntxt1: false,
		system_btntxt2: false,
		system_class: false,

		terms_tit: false,
		terms_url: false,

		iname: false,
		ititle: '빈프레임',
		isrc: false,
		icallback: false,

		born: false,
		sctarray : []
	};
	function createUiModal(opt) {
		var opt = $.extend(true, {}, $ui.uiModal.option, opt);
		
		if ($('#' + opt.id + '[opened="true"]').length > 0) {
			return false;
		}

		//ifarme modal : 아이프레임주소와 아이디 필수
		if (!!opt.isrc && !$('#' + opt.id).length) {
			var iname = opt.iname,
				ititle = opt.ititle,
				isrc = opt.isrc,
				iwidth = opt.iwidth === undefined ? $ui.browser.mobile ? '100%' : 965 : opt.iwidth,
				iheight = opt.iheight === undefined ? $ui.browser.mobile ? '100%' : $(win).outerHeight() - 20 : opt.iheight,
				icallback = opt.icallback,
				remove = opt.remove,
				iclosecallback = opt.iclosecallback,
				modal_html = '',
				parasrc = opt.isrc;

			if (opt.isrc.split('?').length > 1) {
				parasrc = parasrc + '&uiType=F' 
			} else {
				parasrc = parasrc + '?uiType=F' 
			}

			if ($ui.browser.mobile) {
				iwidth = '100%';
				iheight = $(win).outerHeight();
			} 

			modal_html += '<section class="ui-modal iframe-modal" id="' + opt.id + '" aria-hidden="true">';
			modal_html += '<div class="ui-modal-wrap">';
			modal_html += '<div class="ui-modal-iframe" data-orgw="' + iwidth + '" data-orgh="' + iheight + '" style="height:' + iheight + 'px;">';
			modal_html += '<iframe id="' + iname + '" name="' + iname + '" src="' + parasrc + '" width="' + iwidth + '" height="' + iheight + '" title="' + ititle + '" orgw="' + iwidth + '" orgh="' + iheight + '"></iframe>';
			modal_html += '</div>';
			!$ui.browser.mobile ?
				modal_html += '<button type="button" class="btn-close ui-modal-closecallback" onclick="$plugins.uiModalClose({ id:\'' + opt.id + '\', remove: ' + remove + ' })"><span>닫기</span></button>' : '';
			modal_html += '</div>';
			modal_html += '</section>';

			if (!!opt.born) {
				var $local = typeof opt.born === 'string' ? $('#' + string) : opt.born;

				$local.append(modal_html);
			} else {
				!!$('#baseLayer').length ? $('#baseLayer').prepend(modal_html) : $('body').append(modal_html);
			}

			$('#' + opt.id).data('iccb', { callback: iclosecallback });

			$(doc).off('click.closecallback').on('click.closecallback', '.ui-modal-closecallback', function () {
				if (!!$(this).closest('.ui-modal').data('iccb')) {
					var cc = $(this).closest('.ui-modal').data('iccb');
					!!cc && !!cc.callback ? cc.callback() : '';
				}
			});

			if ($ui.browser.ie8) {
				$('#' + opt.id).data('iframeload', true);
			} 
			
			$('#' + iname).on('load', function(){
				$('#' + opt.id).data('iframeload', true);
				//$ui.callback !== undefined ? frames[iname].$ui.callback.modal(opt.id) : '';
				!!icallback ? icallback() : '';

				/* 2018-11-26 : IOS iframe fixed bug */
				// if ($ui.browser.mobile && $ui.browser.ios) {
				// 	frames[iname].find('#wrapIframe').css({ 
				// 		'max-height':$(win).outerHeight(),
				// 		'overflow' : 'scroll'
				// 	});
				// } 

			});
			// document.getElementById(iname).onload = function () {
			// 	$('#' + opt.id).data('iframeload', true);
			// 	$ui.callback !== undefined ? frames[iname].$plugins.callback.modal(opt.id) : '';
			// 	!!icallback ? icallback() : '';
			// };
			
			uiModalOpen(opt);
		}
		console.log(!opt.link)
		if (!opt.link) {
			//모달코드가 이미 페이지안에 있을 경우
			($('#' + opt.id).attr('aria-hidden') === 'true') ? uiModalOpen(opt) : '';
		} else {
			// Ajax 모달 
			!!$('#' + opt.id).length ?
				uiModalOpen(opt) :
				$ui.uiAjax({
					id: !!opt.born ? opt.born : !$('#baseLayer').length ? opt.born = $('body') : 'baseLayer',
					url: opt.link,
					page: true,
					prepend:true,
					type: opt.ajax_type,
					add: true,
					callback: function () {
						uiModalOpen(opt);
					}
				});
		}
	}
	function uiModalOpen(opt) {
		
		var $modal = $('#' + opt.id),
			$modalWrap = $modal.find('.ui-modal-wrap'),
			$modalTit = $modal.find('.ui-modal-header'),
			$modalCont = $modal.find('.ui-modal-cont'),
			$modalFoot = $modal.find('.ui-modal-footer'),

			autofocus = opt.autofocus,
			born = opt.born,
			endfocus = opt.endfocus === null ? document.activeElement : '#' + opt.endfocus,
			w = opt.width === undefined ? Math.ceil($modal.outerWidth()) : opt.width,
			h = opt.height === undefined ? Math.ceil($modal.outerHeight()) : opt.height,

			full = opt.full,
			mpage = opt.mpage,
			remove = opt.remove,
			ps = opt.ps, 
			callback = opt.callback,
			openback = opt.openback,
			closeback = opt.closeback,
			modalSpace = opt.space,
			open = opt.open,
			cutline = opt.cutline,

			win_h = $(win).outerHeight(),
			win_w = $(win).outerWidth(),
			overH = win_h <= h,
			overW = win_w <= w,
			h_h,
			f_h,

			timer,
			timer_resize,
			layN,
			re_num = 0,
			re_timer,

			//system
			system_words = opt.system_words,
			system_btntxt1 = opt.system_btntxt1,
			system_btntxt2 = opt.system_btntxt2,
			system_class = opt.system_class,

			//terms
			terms_tit = opt.terms_tit,
			terms_url = opt.terms_url,

			//iframe
			iname = opt.iname,
			ititle = opt.ititle,
			isrc = opt.isrc,
			iwidth = (opt.iwidth === undefined) ? $modal.find('iframe').attr('width') : opt.iwidth,
			iheight = (opt.iheight === undefined) ? $modal.find('iframe').attr('height') : opt.iheight,
			icallback = opt.icallback,
			
			//state
			is_mobile = $ui.browser.mobile,
			is_full_h,
			is_full_w,
			is_iframe,
			zidx,
			iw,
			ih,
			__h,
			laywrap_h,
			h_cont = 'auto';
		
		modalType();

		//MODAL TYPE -------------------------------------------------
		function modalType(){
			
			//type terms modal
			if (terms_url) {
				if (is_mobile) {
					full = true;
					modalSpace = 0;
					$modal.addClass('type-full');
				}	
				$ui.uiAjax({ id: opt.id + '_cont', url: terms_url, page: true });
				$modalTit.find('.tit-h1').text(terms_tit);
			}

			//type alert & comfirm modal
			if (system_words) {
				system_words && is_mobile ? opt.width = win_w > 400 ? 400 : win_w - (modalSpace * 2) : '';
				$modal.find('#modalSystemTxt').append(system_words);
				$modal.find('.ui-modal-cont').removeClass().addClass('ui-modal-cont').addClass(system_class);

				!!system_btntxt1 ? $modal.find('#modalSystemBtn1').text(system_btntxt1) : '';
				!!system_btntxt2 ? $modal.find('#modalSystemBtn2').text(system_btntxt2) : '';
			}

			//type full modal
			if (mpage & is_mobile) {
				// /full = true;
				modalSpace = 0;
				$modal.addClass('type-full');
			}
			
			$ui.uiModal.option.sctarray.push($(win).scrollTop());
			open ? modalReady() : '';
		}

		//MODAL READY -------------------------------------------------
		function modalReady(){
			$('body').removeClass('modal-full');
			$('body').addClass('modal-open');
			$('#baseWrap').attr('aria-hidden', true);
			$modal.attr('opened', true)
				.data('opt', opt)
				.data('endfocus', endfocus)
				.data('autofocus', autofocus)
				.data('scrolltop', $(win).scrollTop())
				.attr('aria-hidden', false)
				.find('.tit-h1').eq(0).attr('id', opt.id + '-tit');

			$modal.siblings('.ui-modal').attr('aria-hidden', true);
			
			switch(ps) {
				case 'top' : 
					$modal.addClass('ps-top');
					break;
				case 'bottom' : 
					$modal.addClass('ps-bottom');
					break;
			}

			//single or multi modal
			layN = $('.ui-modal[opened="true"]').length;
			opt.zindex !== undefined ? opt.zindex !== null ? zidx = opt.zindex : zidx = layN : zidx = layN;
			$modal.css({
				zIndex: born ? zidx + 20 : zidx,
				position: 'fixed'
			}).attr('n', zidx);

			//모달생성 설정 
			switch(ps) {
				case 'center':
					$modal.css({ 
						display: 'block', 
						top: is_mobile ? '100%' : '50%', 
						opacity: 0
					});
					break;
				case 'top':
					$modal.css({ 
						display: 'block', 
						opacity: 0
					});
					break;
				case 'bottom':
					$modal.css({ 
						display: 'block', 
						bottom: '-100%',
						opacity: 0
					});
					break;
			}
			
			modalApp({ resize: false });
		}

		//MODAL APPLICATION -------------------------------------------------
		//- resize: resize이벤트 일 경우 true, 아닌 경우 false
		function modalApp(v) {
			//초기화 및 세팅
			win_h = $(win).outerHeight();
			win_w = $(win).outerWidth();

			//resize modal 크기 변화가 없을 시
			if (win_w > $modal.outerWidth() && win_h > $modal.outerHeight() && v.resize && !is_mobile) {
				$('body').removeClass('modal-full');
				return false; 
			} 
			
			if (v.resize) {
				$('body').addClass('modal-full');
				return false;
			} 
			
			$modalCont.css({ 
				height: 'auto',
				maxHeight: 'none',
				minHeight: 'none'
			}).attr('tabindex', 0);

			$modal.css({ height: 'auto' });
			//!full ? $modal.css({ height: 'auto' }) : '';
			//modal height 100 작거나 iframeload 전 일때 재 실행, resize 옵션 false 일경우
			if ($modalCont.outerHeight() < cutline && $modal.data('iframeload') === undefined && !v.resize ) {
				if (re_num === 0) {
					$ui.uiLoading({ visible: true });
					re_num = re_num + 1;
				}

				re_timer = setTimeout(function () {
					modalApp({ resize: false  });
				}, 500);

				return false;
			} 

			//modal content load ok!! 
			h_h = !!$modalTit.length ? $modalTit.outerHeight() : 0;
			f_h = !!$modalFoot.outerHeight() ? $modalFoot.outerHeight() : 0;

			var h_type_a = !!h_h && !!f_h,//title, footer
				h_type_b = !!h_h && !f_h,//only title
				h_type_c = !h_h && !!f_h,//only footer
				h_type_d = !h_h && !f_h;//not title, footer

			//$modalCont height setup
			if (full) {
				h_type_a ? __h = Math.ceil(win_h - h_h - f_h - (modalSpace * 2)) : '';
				h_type_b ? __h = Math.ceil(win_h - h_h - (modalSpace * 2)) : '';
				h_type_c ? __h = Math.ceil(win_h - f_h - (modalSpace * 2)) : '';
				h_type_d ? __h = Math.ceil(win_h - (modalSpace * 2)) : '';
				h_cont = __h;

				if (!is_mobile) {
					$modalCont.css('max-height', __h);
					$modalCont.css('height', __h);
				}
			} else {
				if (!opt.height) {
					$modalCont.css('max-height', 'auto');
					laywrap_h = $modalWrap.outerHeight();

					laywrap_h > win_h ? laywrap_h = win_h : '';

					h_type_a ? __h = Math.ceil(laywrap_h - h_h) : '';//title, footer
					h_type_b ? __h = Math.ceil(laywrap_h - h_h) : '';//only title
					h_type_c ? __h = Math.ceil(laywrap_h) : '';//only footer
					h_type_d ? __h = Math.ceil(laywrap_h) : '';//not title, footer

					win_h < __h + (modalSpace * 2) + h_h + f_h ? __h =  win_h - f_h - h_h - (modalSpace * 2) : '';
					h_cont = __h;

					$modalCont.css('max-height', __h);
					$modalCont.css('height', __h);
				} else {
					$modalCont.css('max-height', Math.ceil(opt.height - h_h));
					$modalCont.css('height', Math.ceil(opt.height - h_h));
				}
			}

			h = (opt.height === undefined) ? Math.ceil($modal.outerHeight()) : opt.height;
			w = (opt.width === undefined) ? Math.ceil($modal.outerWidth() + 1) : opt.width;

			//resize일 경우 원래 크기로 돌아가기.
			// if (!!$modal.data('orgw') || !!$modal.data('orgh') && !is_mobile) {
			// 	h = Number($modal.data('orgh'));
			// 	w = Number($modal.data('orgw'));
			// }

			overH = win_h <= h;
			overW = win_w <= w;

			if (!is_mobile) {
				overW ? $('body').addClass('modal-full') : $('body').removeClass('modal-full');
			}

			is_full_h = overH || full || mpage;
			is_full_w = overW || full || mpage;
			is_iframe = !!$modal.find('.ui-modal-iframe').length;
			iw = $modal.find('.ui-modal-iframe').data('orgw');
			ih = $modal.find('.ui-modal-iframe').data('orgh');

			//full ? is_full_h = true : '';
			// if (is_full_h) {
			// 	//full
			// 	$modalCont.css({ height: Math.ceil(win_h - (h_h + f_h) - (modalSpace * 2)) + 'px' });
			// 	win_h < ih ?
			// 		$modal.find('.ui-modal-iframe iframe').attr('height', win_h - (modalSpace * 2)) :
			// 		$modal.find('.ui-modal-iframe iframe').attr('height', ih);

			// 	$modal.css('height', win_h - (modalSpace * 2));
			// } else {
			// 	!!words ? $modalCont.css({ hegiht: 'auto', maxHeight: 'none' }) : '';
			// 	h = !!f_h ? h + f_h : h;
			// 	$modal.css('height', h);
			// }

			!!system_words ? $modalCont.css({ maxHeight: 'none' }) : '';
				h = !!f_h ? h + f_h : h;
				$modal.css('height', h);

			if (!v.resize) {
				if (is_mobile) {
					//modal
					switch(ps) {
						case 'center':
							$modal.css({
								opacity: 0,
								width: is_full_w ? '100%' : w,
								height: is_full_h ? '100%' : h,
								left: is_full_w ? 0 : '50%',
								top: is_full_h ? '100%' : '50%',
								marginTop: is_full_h ? 0 : (h / 2) * -1,
								marginLeft: is_full_w ? 0 : (w / 2) * -1
							});
							break;
						case 'top':
							$modal.css({
								opacity: 0,
								width: '100%',
								height: is_full_h ? '100%' : h,
								left: 0,
								top: 0,
								marginTop: 0,
								marginLeft: 0
							});
							break;
						case 'bottom':
							$modal.css({
								opacity: 0,
								width: '100%',
								height: is_full_h ? '100%' : h,
								left: 0,
								bottom: 0,
								marginTop: 0,
								marginLeft: 0
							});
							break;
					}
				} else {
					//desktop
					$modal.css({
						opacity: v.resize ? 1 : 0,
						left: '50%',
						width: w,
						height: system_words ? 'auto' : h,
						marginLeft: is_iframe ? (iw / 2) * -1 : (w / 2) * -1
					});
					switch(ps) {
						case 'center':
							$modal.css({
								top: '50%',
								marginTop: (h / 2) * -1,
							});
							break;
						case 'top':
							$modal.css({
								top: 0,
								marginTop: modalSpace,
							});
							break;
						case 'top':
							$modal.css({
								bottom: 0,
								marginTop: modalSpace,
							});
							break;
					}
				}

				$ui.uiLoading({ visible: false });

				//modal backdrop setup
				if (layN === 1) {
					modalBackdrop('open', born);
				} else {
					$('body').removeClass('modal-full');
					$modal.attr('aria-hidden', false);
					//if (!words) { $modal.css({ top: 0 }); }
					if (!$modal.closest('#baseLayer').length || !!born) {
						$('#baseLayer').addClass('under').find('.modal-backdrop').css('opacity', 0);

						if (!!$('body > .modal-backdrop').length) {
							$('body > .modal-backdrop').css('z-index', zidx + 20 - 1).attr('n', layN + 20 - 1);
						} else {
							$('body').append('<div class="modal-backdrop out on" style="display:block; width:101%; height:101%; opacity:0.7; z-index:' + (zidx + 20 - 1) + '" n="'+ (layN + 20 - 1) +'" ></div>');
						}
					} else {
						$('.modal-backdrop').css('z-index', layN - 1).attr('n', layN);
					}
				}

				//$modalCont.css('height', h_cont - 1);

				//alert, confirm modal 제외
				if (!system_words) {
					if (window.mCustomScrollbar && !iname && isMscroll) {
						//pc모드, 아이프레임X,
						$modalCont.mCustomScrollbar({ scrollButtons: { enable: true } });
					}
				}
				$modal.addClass('view');

				if (is_mobile && mpage) {
					//모바일 전체모달레이어 show 모션 효과
					//$modal.find('.ui-floating').removeClass('.ui-fixed-top').find('.ui-floating-wrap').removeAttr('style');
					console.log(ps)
					if (ps !== 'bottom') {
						$modal.css({ 'min-height': $(win).outerHeight(), background: '#fff' })
							.animate({
								opacity: 1, 
								top: 0
							}, 365, 'easeInOutQuart', function () {
								$('body').addClass('modal-full');
								modalCompleted();
							});
					} else {
						$modal.css({ 'min-height': $(win).outerHeight(), background: '#fff' })
							.animate({
								opacity: 1, 
								bottom: 0
							}, 365, 'easeInOutQuart', function () {
								$('body').addClass('modal-full');
								modalCompleted();
							});
					}
					
				} else {
					//$modal.css('opacity', 1);
					$modal.stop().animate({
						opacity: 1
					}, 150, function(){
						modalCompleted();
					});
				}
			}
			function modalCompleted() {
				!!callback ? callback() : '';				

				$ui.uiFocusTab({
					selector: '#' + opt.id
				});
				$modal.data('orgw', w).data('orgh', h);
				
				window.mCustomScrollbar && isMscroll ?
					setTimeout(function () {
						$modalCont.mCustomScrollbar('update');
					}, 0) : '';

				if (is_iframe) {
					//$ui.browser.ie8 ? frames[opt.iname].$plugins.page.formReset() : '';
					if (!$ui.browser.ie8) {
						window.mCustomScrollbar && isMscroll ?
							frames[opt.iname].$('.wrap-iframe').mCustomScrollbar({ scrollButtons: { enable: true } }) : '';
						// $ui.callback !== undefined ? frames[opt.iname].$plugins.callback.modal(opt.id) : '';
					}
				}

				!!system_words ? '' : 
				$ui.callback !== undefined ? $plugins.callback.modal(opt.id) : '';
				!!openback ? openback() : '';

				//!words ? $ui.uiModalResize({ id: opt.id }) : '';
			}
		}

		//event 
		if (!is_mobile) {
			$(win).resize(function () {
				clearTimeout(timer_resize);
				timer_resize = setTimeout(function(){
					if ($('.ui-modal[aria-hidden="false"]').length) {
						//$('.ui-modal[aria-hidden="false"] .ui-modal-cont').removeAttr('style');
						modalApp({ resize: true });
					}
				},100);
			});
		}
		$modal.find('.ui-modal-close').off('click.uilayerpop').on('click.uilayerpop', function (e) {
			e.preventDefault();
			$ui.uiModalClose({ id: opt.id });
		});
	}
	function createUiModalResize(opt) {
		var opt = $.extend(true, {}, $('#' + opt.id).data('opt'), opt),
			$modal = $('#' + opt.id),
			_opt = $modal.data('opt'),
			$modalWrap = $modal.find('.ui-modal-wrap'),
			$modalTit = $modal.find('.ui-modal-tit'),
			$modalCont = $modal.find('.ui-modal-cont'),
			$modalFoot = $modal.find('.ui-modal-footer'),
			f_h,
			h_h,
			w = _opt.width === undefined ? Math.ceil($modal.outerWidth()) : _opt.width,
			h = _opt.height === undefined ? Math.ceil($modal.outerHeight()) : _opt.height,
			system_words = _opt.system_words === undefined ? false : _opt.system_words,
			terms_url = _opt.terms_url === undefined ? false : _opt.terms_url,
			modalSpace = 10,
			full = _opt.full === undefined ? false : _opt.full,
			win_h = $(win).outerHeight(),
			win_w = $(win).outerWidth(),
			overH = win_h <= h,
			overW = win_w <= w,
			iname = _opt.iname === undefined ? false : _opt.iname,
			h_cont,
			timer,
			is_full_w,
			is_full_h,
			layN,
			is_iframe,
			zidx,
			iw,
			ih,
			__h,
			laywrap_h,
			is_mobile = $ui.browser.mobile;

		if (is_mobile) {
			return false;
		}
		//초기화 및 세팅
		$modalCont.css({ height: 'auto', maxHeight: 'none' });
		$modal.css({ height: 'auto', width: 'auto' });
		$modal.find('.mCustomScrollBox').css({ maxHeight: 'none' });

		h_h = !!$modalTit.length ? $modalTit.outerHeight() : 0;
		f_h = !!$modalFoot.outerHeight() ? $modalFoot.outerHeight() : 0;
		
		setTimeout(function(){
			review();
		},100);

		function review(){
			
			if (full) {
				if (!opt.height) {
					!!h_h && !!f_h ? __h = Math.ceil(win_h - (h_h)) : '';
					!!h_h && !f_h ? __h = Math.ceil(win_h - h_h) : '';
					!h_h && !!f_h ? __h = Math.ceil(win_h) : '';
					!h_h && !f_h ? __h = Math.ceil(win_h) : '';
					$modalCont.css('max-height', __h);
					$modalCont.css('height', __h);
					h_cont = __h;
				} else {
					$modalCont.css('max-height', Math.ceil(opt.height - (h_h)));
					$modalCont.css('height',  Math.ceil(opt.height - (h_h)));
				}
			} else {
				if (!opt.height) {
					//$modalCont.css('max-height', 'none');
					laywrap_h = $modal.find('.ui-modal-wrap').outerHeight();
					if (laywrap_h > win_h) {
						laywrap_h = win_h;
						!!h_h && !!f_h ? __h = Math.ceil(laywrap_h - (h_h)) : '';
						!!h_h && !f_h ? __h = Math.ceil(laywrap_h - h_h) : '';
						!h_h && !!f_h ? __h = Math.ceil(laywrap_h) : '';
						!h_h && !f_h ? __h = Math.ceil($modalWrap.height()) : '';
						__h = __h;
						$modalCont.css('max-height', __h);
						$modalCont.css('height',  __h);
						h_cont = __h;
					} 
				} else {
					$modalCont.css('max-height', Math.ceil(opt.height - (h_h)));
					$modalCont.css('height', Math.ceil(opt.height - (h_h)));
				}
			}

			h = (opt.height === undefined) ? Math.ceil($modal.outerHeight()) : opt.height;
			w = (opt.width === undefined) ? Math.ceil($modal.outerWidth()) : opt.width;

			overH = win_h <= h;
			overW = win_w <= w;

			//|| !words
			if (!is_mobile || !system_words) {
				if (overW) {
					full = true;
					$modal.addClass('modal-full');
				} else {
					full = false;
					$modal.removeClass('modal-full');
				}
			}

			is_full_h = overH || full;
			is_full_w = overW || full;

			is_iframe = !!$modal.find('.ui-modal-iframe').length;
			iw = $modal.find('.ui-modal-iframe').data('orgw');
			ih = $modal.find('.ui-modal-iframe').data('orgh');
			
			//full ? is_full_h = true : '';
			if (is_full_h) {
				//full
				$modalCont.css({ height: Math.ceil(win_h - (h_h + f_h) - (modalSpace * 2)) + 'px' });
				win_h < ih ?
					$modal.find('.ui-modal-iframe iframe').attr('height', win_h - (modalSpace * 2)) :
					$modal.find('.ui-modal-iframe iframe').attr('height', ih);

				$modal.css('height', win_h - (modalSpace * 2));
			} else {
				!!system_words ? $modalCont.css('hegiht','auto') : '';
				h = !!f_h ? h + f_h : h;
				$modal.css('height', h);
			}

			$modal.animate({
				top: is_full_h ? modalSpace : '50%',
				left: is_full_w ? modalSpace : '50%',
				width: w,
				height: is_full_h ? win_h - (modalSpace * 2) : system_words ? 'auto' : h,
				marginTop: is_full_h ? 0 : (h / 2) * -1,
				marginLeft: is_full_w ? 0 : (w / 2) * -1
			},200);
		}
		// if (is_full_h) {
		// 	$modalCont.css({ height: Math.ceil(win_h - (h_h + f_h) - (modalSpace * 2)) + 'px' });
		// 	$modalWrap.css('overflow', 'hidden');
		// 	$modalCont.css({ height: Math.ceil(win_h - (h_h + f_h) - (modalSpace * 2)) + 'px' });
		// } else {
		// 	if (words) {
		// 		$modalCont.css({ height: 'auto' });
		// 	}
		// 	if (terms_url) {
		// 		$modalCont.css({ height: h_cont - 1 });
		// 	}
		// }

		// var is_iframe = !!$modal.find('.ui-modal-iframe').length,
		// 	iw = $modal.find('.ui-modal-iframe').data('orgw'),
		// 	ih = $modal.find('.ui-modal-iframe').data('orgh');

		// $modal.css({
		// 	top: is_full_h ? modalSpace : '50%',
		// 	left: is_full_w ? modalSpace : '50%',
		// 	width: is_full_w ? is_mobile ? '100%' : win_w - (modalSpace * 2) : is_iframe ? iw : w,
		// 	height: is_full_h ? is_iframe ? win_h : win_h - (modalSpace * 2) : h,
		// 	marginTop: is_full_h ? 0 : (h / 2) * -1,
		// 	marginLeft: is_full_w ? 0 : (w / 2) * -1
		// });
		// is_full_w ?
		// 	$modal.find('.ui-modal-iframe iframe').attr('width', win_w - (modalSpace * 2)).attr('height', win_h - (modalSpace * 2)) :
		// 	$modal.find('.ui-modal-iframe iframe').attr('width', $modal.find('.ui-modal-iframe').data('orgw')).attr('height', $modal.find('.ui-modal-iframe').data('orgh'));

	}
	function createUiModalScrollReset(v) {
		var $this = $('#' + v),
			c_h = $this.find('.mCSB_container').outerHeight(),
			w_h = $this.find('.ui-modal-cont').outerHeight();

		if (c_h < w_h) {
			//$this.find('.ui-modal-cont').css('height', 'auto');
			$ui.uiModalResize({ id: v });
		} else {
			if (!!$this.length) {
				if (Math.abs(w_h - c_h) < 10) {
					$this.addClass('hide-scroll');
					$this.find('.mCSB_2_scrollbar').attr('tabindex', '-1');
				} else {
					$this.removeClass('hide-scroll').removeClass('hide-scroll2');
					$this.find('.mCSB_2_scrollbar').removeAttr('tabindex');
				}
			} else {
				return false;
			}
		}
	}
	$plugins.uiModal.focusid = '';
	function createUiModalClose(opt) {
		var opt = $.extend(true, {}, $('#' + opt.id).data('opt'), opt),
			$modal = $('#' + opt.id),
			$modalshow = $('.ui-modal[opened="true"]'),
			layN = $modalshow.length,
			autofocus = opt.autofocus,
			closeback = opt.closeback,
			endfocus = opt.endfocus === null ? typeof $modal.data('endfocus') === 'string' ? '#' + $modal.data('endfocus') : $modal.data('endfocus') : '#' + opt.endfocus,
			layRemove = opt.remove,
			full = opt.full, 
			terms_tit = opt.terms_tit, 
			sct = $modal.data('scrolltop') === undefined ? 0 : $modal.data('scrolltop'),
			ps = opt.ps,
			wst = $(win).scrollTop(),
			win_h = $(win).outerHeight(),
			h = Math.ceil($modal.outerHeight()),
			fst;

		endfocus === '#' || endfocus === '' || endfocus === null || endfocus === undefined ? 
			endfocus = 'body' : '';

		opt.endfocus !== undefined && opt.endfocus !== null && !!endfocus ? 
		 	sct = $(endfocus).offset().top : '';

		$ui.browser.mobile ? !!terms_tit ? full = true : '' : '';

		$('#__modalCF_cont').css('display', 'none');
		
		if (!!$('#uiCfPlayer').length) {
			$ui.browser.ie8 ? 
			doc.getElementById('uiCfPlayer').stop() : doc.getElementById('uiCfPlayer').pause();
		}
		$modal.removeClass('view');
		if (layN < 2) {
			$modal.removeAttr('opened');
			if ($ui.browser.mobile && full) {
				$('body').removeClass('modal-full');
				$modal.attr('aria-hidden', true).stop().animate({
					top: '100%',
					marginTop:0
				}, 450, 'easeInOutQuart', closed);
			} else {
				switch(ps) {
					case 'top':
						$modal.css('top','-10%');
				}
				$modal.attr('aria-hidden', true).stop().animate({
					opacity: 0
				}, 200, 'easeOutQuart', closed);
			}

			if (opt.id !== '__modalAlert' && opt.id !== '__modalConfirm' && opt.id !== '__modalAction') {
				$('html, body').stop().animate({
					scrollTop: sct
				}, 0, function () {
					autofocus ? $(endfocus).attr('tabindex', 0).focus() : '';
				});
			}

			$ui.uiModal.option.sctarray.pop();
			$('#baseLayer').removeClass('under');
			modalBackdrop('close');
		} else {
			//multi
			var z = layN - 1;
			
			
			$modal.attr('aria-hidden', true).stop().animate({
				opacity: 0
			}, 200, function () {
				layRemove === true ? $modal.remove() : $modal.removeAttr('style').removeClass('scrollpop').removeAttr('opened');
				autofocus ? $(endfocus).attr('tabindex', 0).focus() : '';

				$('.ui-modal[n="' + z + '"]').attr('aria-hidden', false);
				
				$('html, body').stop().animate({
					scrollTop: Number($ui.uiModal.option.sctarray.slice(-1)[0])
				}, 0, function () {
					$ui.uiModal.option.sctarray.pop();
					//autofocus ? $(endfocus).attr('tabindex', 0).focus() : '';
				});

				closeback ? closeback({ id: opt.id }) : '';
				$ui.browser.mobile ? 
				$('body').addClass('modal-full') : '';
			});

			if (!!$modal.closest('#baseLayer').length) {
				$('#baseLayer').removeClass('under');
				$('.modal-backdrop').css('z-index', z - 1).attr('n', $('.modal-backdrop').attr('n') - 1);
			} else {
				if ($('body > .ui-modal[opened="true"]').length > 1) {
					var zz = $('body > .modal-backdrop').attr('n');

					$('body > .modal-backdrop').css('z-index', zz - 1).attr('n', zz - 1);
					
				} else {
					$('#baseLayer').removeClass('under');
					$('body > .modal-backdrop').remove();
					$('.modal-backdrop').css('opacity', '0.8');
				}
			}
		}

		function closed(v) {
			$('#baseWrap').removeAttr('aria-hidden');
			parent.$('body').removeClass('frame-modal-view');

			$('.ui-modal-close').off('click.uilayerpop');
			layRemove === true ? $modal.remove() : $modal.removeAttr('style').removeAttr('opened');

			!$(endfocus).length ? endfocus = 'body' : '';

			$modal.removeClass('modal-full');
			$('body').removeClass('modal-open modal-full modal-ria');
			$(doc).off('keyup.uilayerpop');

			closeback ? closeback({ id: opt.id }) : '';
		}
	}
	function modalBackdrop(value, born) {
		var $backdrop,
			timer,
			$wrap = !!$('#baseLayer').length ? $('#baseLayer') : $('body');

		born ? $wrap = $('body') : '';

		if (value === 'open' && !$('body').data('bgmodal')) {
			$('body').data('bgmodal', true);
			$wrap.find('.modal-backdrop').length ? '' : $wrap.append('<div class="modal-backdrop"></div>');
			$backdrop = $('.modal-backdrop');
			$backdrop.css('display', 'block');

			clearTimeout(timer);
			timer = setTimeout(function () {
				$backdrop.stop().animate({
					opacity: 0.8,
					width: '101%',
					height: '101%',
				}, 200).addClass('on');
			}, 0);
		} else {
			$('body').data('bgmodal', false);
			$('.modal-backdrop').stop().animate({
				opacity: 0
			}, 200, function () {
				$(this).remove();
			}).removeClass('on');
		}
	}
	function creaeteUiCookieModal(opt){
		$ui.uiCookieGet({ name:opt.cookiename }) ? '' : open();
		function open(){
			$ui.uiModal({ id:opt.id, full:opt.full === undefined ? false : opt.full, link: opt.link === undefined ? false : opt.link });
		}
	}
	function creaeteUiCookieModalClose(opt){
		$('#' + opt.cookiename).prop('checked') ?
			$ui.uiCookieSet({ name:opt.cookiename, value:true, term:365 }) : '';
		$ui.uiModalClose({ id:opt.modalid });
	}



	/* ------------------------------------------------------------------------
	* name : selection(radio & checkbox)
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiSelection({ option });
	* - $plugins.uiSelectionChange({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {	
		uiSelection: function (opt) {
			return createUiSelection(opt);
		},
		uiSelectionChange: function (opt) {
			return createUiSelectionChange(opt);
		}
	});
	$ui.uiSelection.option = {
		id: false,
		all: false,
		callback: false
	};
	function createUiSelection(opt){
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiSelection.option, opt),
			id = opt.id,
			is_id = id === false ? false : true,
			$inp = id === false ? $('input[type="checkbox"], input[type="radio"]') : typeof id === 'string' ? $('#' + id) : id,
			len = $inp.length,
			i = 0, 
			$inp_current,
			inp_current_id;
		
		//set
		for (i = 0, len; i < len; i++) {
			$inp_current = $inp.eq(i);
			opt.id = $inp_current;
			inp_current_id = $inp_current.attr('id');
			is_id ? $inp_current.data('exe', false) : '';

			if(!$inp_current.data('exe')) {
				$inp_current.data('exe', true);
				
				if (inp_current_id !== undefined) {
					$inp_current.data('opt', opt);
					$inp_current.attr('type') === 'checkbox' ?
						selectionCheck({ id:inp_current_id })://checkbox
						selectionApp({ id:inp_current_id });//radio
				} 
			}			
		}
		$('body').data('selection', true);

		//event
		$inp.off('click.ui focus.ui blur.ui')
			.on({
				'click.ui': evtFocus,
				'focus.ui': evtAdd,
				'blur.ui': evtRemove
			});

		function evtFocus(){
			labelState($(this).attr('id'), 'focus', $(this).attr('type'));
		}
		function evtAdd(){
			labelState($(this).attr('id'), 'add', $(this).attr('type'));
		}
		function evtRemove(){
			labelState($(this).attr('id'), 'remove', $(this).attr('type'));
		}
		function labelState(id, state, type){
			var $lable = $('label[for="'+ id +'"]');

			switch (state){
				case 'focus' : 
					type === 'checkbox' ?
						selectionCheck({ id:id, evt:true })://checkbox
						selectionApp({ id:id });//radio
					$lable.focus();
					break;

				case 'add' : 
					$lable.addClass('activated');
					break;

				case 'remove' : 
					$lable.removeClass('activated');
					break;
			}
		}
	}
	function selectionCheck(opt){ 
		//opt: id, evt 
		//only checkbox. 전체체크관련 체크단계
		var id = opt.id,
			evt = opt.evt === undefined ? false : opt.evt,
			$inp = $('#'+ id),
			checkgroup = $inp.attr('type') === 'radio' ? 
				$inp.attr('name') : //radio
				$inp.attr('checkgroup'), //checkbox
			$inps = $inp.attr('type') === 'radio' ? 
				$('input[name="' + checkgroup + '"]') : //radio
				$('input[checkgroup="' + checkgroup + '"]'), //checkbox, checkgroup으로 갈지 class 명으로 갈지 선택해야함. ie8에서 사용자속성을 인식못하는경우가 있음.
			$all = $('#'+ checkgroup), //전체체크 input
			i = 0, 
			n = 0, 
			m = 0, 
			len = $inps.length;
		
		//checkgroup이 있다면 실행하여 현재 그룹의 체크된 갯수 파악 
		if (checkgroup !== undefined) {
			for (i = 0; i < len; i++) {
				n = ($inps.eq(i).prop('checked')) ?  1 : 0;
				m = m + n;
			}

			m === len ? 
				act(true) : 
				m === len - 1 && $all.data('checked') === true ? act(false) : '';
		} 
		
		selectionApp({ id:id, evt:evt });
	
		//그룹의 체크된 갯수에 따라 전체체크 checked 선택
		function act(v){
			$all.data('checked', v ? true : false);
			$all.prop('checked') === false ? 
				$all.prop('checked', true) : 
				$all.prop('checked', false);
			selectionApp({ id:checkgroup, act:v ? false : true, evt:evt });
		}
	}
	function selectionApp(opt){
		//opt: id, act, evt
		//checkbox,radio check action
		var $inp = $('#' + opt.id),
			id = $inp.attr('id'),
			$label = $('label[for="'+ id +'"]'),
			inp_opt = $inp.data('opt'),
			allcheck = inp_opt.all,
			callback = inp_opt.callback,
			_opt,
			act = opt.act === undefined ? false : opt.act,
			evt = opt.evt === undefined ? false : opt.evt,
			$allItemNot,
			dataChecked,
			checkClass;
		
		//전체체크 
		if (!!allcheck === true && evt){
			//전체체크에 포함되어 있으면서 disabled가 아닌 input
			$allItemNot = $('input[checkgroup="' + id + '"]:not(:disabled)');
			//class로 처리 시
			//$allItemNot = $('input.' + id + ':not(:disabled)');
			
			//전체체크
			if ($inp.prop('checked') === true) {
				dataChecked = true;
				$allItemNot.prop('checked', true).each(function(i){
					_opt = $allItemNot.eq(i).data('opt');
					$('label[for=' + $allItemNot.eq(i).attr('id') + ']:not(.disabled)').addClass('checked');
					//전체체크시 이벤트 콜백 등 확인필요

					!!_opt.callback ? _opt.callback({ id: $allItemNot.eq(i).attr('id'), value: dataChecked }) : '';
				});
			}
			//전체미체크
			else if($inp.prop('checked') === false) {				
				dataChecked = false;
				if (act === false) {
					$allItemNot.prop('checked', false).each(function(i){
						_opt = $allItemNot.eq(i).data('opt');
						$('label[for=' + $allItemNot.eq(i).attr('id') + ']:not(.disabled)').removeClass('checked');

						!!_opt.callback ? _opt.callback({ id:$allItemNot.eq(i).attr('id'), value: dataChecked }) : '';
					});
				}
			}
		}
		//개별체크
		else {
			if ($inp.prop('checked') === true) {
				if ($inp.attr('type') === 'radio') {
					//radio button
					$('input[name="' + $inp.attr('name') + '"]').each(function(){
						$('label[for="'+ $(this).attr('id') +'"]').removeClass('checked');
					});
				} else {
					//checkbox button
					$label.addClass('checked');
				}
				dataChecked = true;
			} 
			else if ($inp.prop('checked') === false) {
				dataChecked = false;
			}
		}

		checkClass = (dataChecked === true) ? 'addClass' : 'removeClass';
		$inp.prop('disabled') === true ? $label.addClass('disabled') : $label.removeClass('disabled');
		$inp.data('checked', dataChecked);
		$label[checkClass]('checked');
		!!callback ? callback({ id: opt.id, value: dataChecked }) : '';
	}
	function createUiSelectionChange(opt){
		if (opt === undefined || opt.id === undefined) {
			return false;
		}

		var id = opt.id,
			$id = typeof id === 'string' ? $('#'+ id) : id,
			callback = opt.callback === undefined ? false : opt.callback;

		opt.checked !== undefined ? 
			$id.prop('checked', opt.checked) : 
			$id.prop('checked') ? 
				$id.prop('checked', true) : 
				$id.prop('checked', false);

		opt.disabled !== undefined ? 
			$id.prop('disabled', opt.disabled) : 
			$id.prop('disabled') ? 
				$id.prop('disabled', true) : 
				$id.prop('disabled', false);

		!!($id.attr('type') === 'radio' || $id.attr('type') === 'checkbox') ? 
			selectionCheck({ id:id, evt:false }) : '';

		!!callback ? callback() : '';
	}



	/* ------------------------------------------------------------------------
	* name : select(radio & checkbox)
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiSelect({ option });
	* - $plugins.uiSelectAct({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiSelect: function (opt) {
			return createUiSelect(opt);
		},
		uiSelectAct: function (opt) {
			return createUiSelectAct(opt);
		}
	});
	$ui.uiSelect.option = {
		id: false, //select id
		current: null,
		customscroll: true,
		vchecktype: false,
		callback:false
	};
	function createUiSelect(opt){
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiSelect.option, opt),
			current = opt.current, 
			callback = opt.callback,
			customscroll = opt.customscroll,
			vchecktype = opt.vchecktype,
			id = opt.id,
			is_id = id === false ? false : true,
			$ui_select = is_id ? typeof id === 'string' ? $('#' + opt.id).closest('.ui-select') : id.closest('.ui-select') : $('.ui-select'), 
			
			keys = $ui.option.keys,
			len = $ui_select.length, 
			i = 0,
			j = 0,

			_disabled = false,
			_selected = false,
			_val = '',
			_txt = '',
			
			$sel, 
			$sel_current, 
			$opt, 
			$opt_current, 

			sel_id,
			list_id,
			opt_id,
			opt_id_selected,
			sel_n,
			sel_tit, 
			sel_dis, 
			opt_len, 

			id_opt,
			id_optname,
			idx, 
			timer_opt,
			timer, 
			_option_wrap = '';
		
		//init
		$ui_select.find('.ui-select-btn').remove();
		$ui_select.find('.ui-select-wrap').remove();
		$ui_select.find('.dim').remove();
		
		//set
		for (i = 0; i < len; i++) {
			$sel_current = $ui_select.eq(i);
			$sel = $sel_current.find('select');
			$opt = $sel.find('option');
			$sel.data('callback', callback);

			sel_id = $sel.attr('id');
			list_id = sel_id +'_list';
			opt_id = sel_id +'_opt';
			sel_dis = $sel.prop('disabled');
			sel_tit = $sel.attr('title');
			opt_len = $opt.length;

			customscroll ?
			_option_wrap += '<div class="ui-select-wrap ui-scrollbar" id="'+ sel_id +'_scroll" style="min-width:'+ $sel_current.outerWidth() +'px">':
			_option_wrap += '<div class="ui-select-wrap" style="min-width:'+ $sel_current.outerWidth() +'px">';

			$ui.browser.mobile ?
			_option_wrap += '<div class="ui-select-opts" role="listbox" id="'+ list_id +'" aria-hidden="false">':
			customscroll ?
				_option_wrap += '<div class="ui-select-opts ui-scrollbar-item" role="listbox" id="'+ list_id +'" aria-hidden="false" tabindex="-1">':
				_option_wrap += '<div class="ui-select-opts" role="listbox" id="'+ list_id +'" aria-hidden="false" tabindex="-1">';

			for (j = 0; j < opt_len; j++) {
				$opt_current = $opt.eq(j);

				if (current !== null) {
					if (current === j) {
						_selected = true;
						$opt_current.prop('selected', true).attr('selected');
					} else {
						_selected = false;
						$opt_current.prop('selected', false).removeAttr('selected');
					}						
				} else {
					_selected = $opt_current.prop('selected');
				}
				
				_disabled = $opt_current.prop('disabled');
				_selected ? _val = $opt_current.val() : '';
				_selected ? _txt = $opt_current.text() : '';
				_selected ? opt_id_selected = opt_id + '_' + j : '';
				_selected ? sel_n = j : '';

				id_optname = $sel.attr('id') + '_opt';
				id_opt = id_optname + '_' + j;

				if ($ui.browser.mobile) {
					_disabled ?
						_selected ?
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt disabled selected" value="'+ $opt_current.val() +'" disabled tabindex="-1">':
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt disabled" value="'+ $opt_current.val() +'" disabled tabindex="-1">':
						_selected ?
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt selected" value="'+ $opt_current.val() +'">':
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt" value="'+ $opt_current.val() +'">';
				} else {
					_disabled ?
						_selected ?
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt disabled selected" value="'+ $opt_current.val() +'" disabled tabindex="-1">':
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt disabled" value="'+ $opt_current.val() +'" disabled tabindex="-1">':
						_selected ?
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt selected" value="'+ $opt_current.val() +'" tabindex="-1">':
						_option_wrap += '<button type="button" role="option" id="'+ opt_id + '_' + j +'" class="ui-select-opt" value="'+ $opt_current.val() +'" tabindex="-1">';

				}
				
				_option_wrap += '<span class="ui-select-txt">' + $opt_current.text() + '</span>';
				_option_wrap += '</button>'; 
			}

			_option_wrap += '</div>'; 
			
			$ui.browser.mobile ? _option_wrap += '<button type="button" class="btn-close"><span>닫기</span></button>': '';
			$ui.browser.mobile ? _option_wrap += '<div class="dim"></div>': '';
			_option_wrap += '</div>'; 

			var html_btn = '<input type="text" class="ui-select-btn" id="'+ sel_id +'_inp" role="combobox" aria-autocomplete="list" aria-owns="'+ list_id +'" aria-haspopup="true" aria-expanded="false" aria-activedescendant="'+ opt_id_selected +'" readonly value="'+ _txt +'" data-n="'+ sel_n +'" data-id="'+ sel_id +'" autocomplete="off"';
			
			!!vchecktype ?  html_btn += ' vchecktype='+ vchecktype +'>' : html_btn += '>';

			$sel_current.append(html_btn);
			$sel.addClass('off').attr('aria-hidden',true).attr('tabindex', -1);
			$sel_current.append(_option_wrap);
			sel_dis ? $sel_current.find('.ui-select-btn').prop('disabled', true).addClass('disabled') : '';
			_option_wrap = '';
		}

		//event
		$(doc).on('click', '.dim-dropdown',function(){
			if ($('body').data('select-open')) {
				optBlur();
			}
		});
		$('.ui-select-btn')
			.off('click.ui keydown.ui mouseover.ui focus.ui mouseleave.ui').on({
				'click.ui': selectClick,
				'keydown.ui': selectKey,
				'mouseover.ui': selectOver,
				'focus.ui': selectOver,
				'mouseleave.ui': selectLeave
			});
		$('.ui-select-opt')
			.off('click.ui mouseover.ui').on({
				'click.ui':optClick,
				'mouseover.ui':selectOver
			});
		$('.ui-select-wrap').off('mouseleave.ui').on({'mouseleave.ui': selectLeave });
		$('.ui-select select').off('change.ui').on({ 'change.ui':selectChange });
		$('.ui-select-label').off('click.ui').on('click.ui', function(){
				var idname = $(this).attr('for');

				setTimeout(function(){
					$('#'+ idname +'_inp').focus();
				},0);
			});
		
		function selectLeave() {
			$('body').data('select-open', true);
		}
		function selectChange(){
			//클릭으로 인한 실행과 change로 실행이 두번 실행됨... 한번 실행이 맞을 듯한데 그럼 select에 onchange일때는...
			//$ui.uiSelectAct({ id:$(this).attr('id'), current:$(this).find('option:selected').index(), callback:$(this).data('callback'), original:true });
		}
		function optBlur() {
			optClose();
		}
		function selectClick(){
			var $btn = $(this);

			$btn.data('sct', $(doc).scrollTop());
			optExpanded(this);
		}
		function optClick() {
			var t = this,
				sct = $(t).closest('.ui-select').find('.ui-select-btn').data('sct');

			$ui.uiSelectAct({ id:$(t).closest('.ui-select').find('.ui-select-btn').data('id'), current:$(t).index() })
			$(t).closest('.ui-select').find('.ui-select-btn').focus();
			optClose();
			$ui.uiScroll({ value:sct, speed:200 });
		}
		function selectOver(){
			$('body').data('select-open', false);
		}
		function selectKey(e){
			var t = this,
				$btn = $(this),
				id = $btn.data('id'),
				$opt = $('#' + id + '_list').find('.ui-select-opt'),
				$wrap = $('#' + id + '_list').closest('.ui-select-wrap'),
				n = Number($('#' + id + '_list').find('.selected').index()),
				nn,
				wrap_h = $wrap.outerHeight(),
				len = $opt.length,
				n_top = 0;
			
			if (e.altKey) {  
				if (e.keyCode === keys.up) {      
					optOpen(t);      
				}    
				e.keyCode === keys.down && optClose();   
				return;
			} 
			
			switch(e.keyCode){
				case keys.up:
					nn = n - 1 < 0 ? len - 1 : n - 1;
					n_top = $opt.eq(nn).position().top;
					optScroll($wrap, n_top, wrap_h, 'up');
					optPrev(e, id, n, len);
					break;

				case keys.left:
					nn = n - 1 < 0 ? len - 1 : n - 1;
					n_top = $opt.eq(nn).position().top;
					optScroll($wrap, n_top, wrap_h, 'up');
					optPrev(e, id, n, len);
					break;

				case keys.down:
					nn = n + 1 > len - 1 ? 0 : n + 1;
					n_top = $opt.eq(nn).position().top;
					optScroll($wrap, n_top, wrap_h, 'down');
					optNext(e, id, n, len);
					break;

				case keys.right:
					nn = n + 1 > len - 1 ? 0 : n + 1;
					n_top = $opt.eq(nn).position().top;
					optScroll($wrap, n_top, wrap_h, 'down');
					optNext(e, id, n, len);
					break;
			}

			if (e.keyCode === keys.enter || e.keyCode === keys.space) {   
				e.preventDefault();

				$btn.data('sct', $(doc).scrollTop());
				optExpanded(this);
			}    
		}
		function optExpanded(t){
			if ($ui.browser.mobile) {
				optOpen(t)
			} else {
				if ($(t).attr('aria-expanded') === 'false') {
					optClose();
					optOpen(t);
				} else {
					optClose();	
				}	
			} 
		}
		function optScroll($wrap, n_top, wrap_h, key){
			if (key === 'up') {
				n_top < 0 ? $wrap.stop().animate({ 'scrollTop': $wrap.scrollTop() - wrap_h }) : n_top > wrap_h ? $wrap.stop().animate({ 'scrollTop': n_top }) : '';
			} else {
				n_top >= wrap_h ? $wrap.stop().animate({ 'scrollTop': $wrap.scrollTop() + wrap_h }) : n_top < 0 ? $wrap.stop().animate({ 'scrollTop': 0 }): '';
			}
		}
		function optPrev(e, id, n, len){
			e.preventDefault();
			n === 0 ? n = len - 1 : n = n - 1;
			$ui.uiSelectAct({ id:id, current:n });
		}
		function optNext(e, id, n, len){
			e.preventDefault();
			n === len - 1 ? n = 0 : n = n + 1;
			$ui.uiSelectAct({ id:id, current:n });
		}
		function optOpen(t){
			var $body = $('body'),
				_$sel = $(t),
				_$uisel = _$sel.closest('.ui-select'),
				_$wrap = _$uisel.find('.ui-select-wrap'),
				_$opts = _$wrap.find('.ui-select-opts'),
				_$opt = _$opts.find('.ui-select-opt'),

				offtop = _$uisel.offset().top,
				scrtop = $(doc).scrollTop(),
				wraph = _$wrap.outerHeight(),
				btn_h = _$sel.outerHeight(),
				opt_h = _$opt.outerHeight(),
				win_h = $(win).outerHeight(),
				clsname = 'bottom';

			clsname = win_h - ((offtop - scrtop) + btn_h) > wraph ? 'bottom' : 'top' ;			

			$body.addClass('dim-dropdown');
			$body.data('scrolling') === 'yes' ? $ui.uiScrollingCancel(): '';

			if(!_$sel.data('expanded')){
				_$sel.data('expanded', true).attr('aria-expanded', true);
				_$uisel.addClass('on');
				_$wrap.addClass('on ' + clsname).attr('aria-hidden', false);
				_$opts.find('.ui-select-opt').eq(_$uisel.find(':checked').index());
	
				customscroll ? _$wrap.css('min-width', _$opts.outerWidth()) :
				$ui.uiScroll({ target:_$wrap, value:Number(opt_h * _$uisel.find(':checked').index()), speed:0 });
			}

			customscroll ? $ui.uiScrollBar({ id:_$wrap.attr('id'), top:_$wrap.find('.selected').index() * _$wrap.find('.ui-select-opt').outerHeight() }) : '';
		}
		function optClose(){
			var $body = $('body'),
				$select = $('.ui-select'),
				$btn = $('.ui-select-btn'),
				$wrap = $('.ui-select-wrap');
			
			$body.data('scrolling') === 'no' ? $ui.uiScrolling(): '';
			$body.removeClass('dim-dropdown');
			$btn.data('expanded', false).attr('aria-expanded', false);
			$select.removeClass('on');
			$wrap.removeClass('on top bottom').attr('aria-hidden', true);
		}
	}
	function createUiSelectAct(opt){
		var id = typeof opt.id === 'string' ? opt.id : opt.id.attr('id'),
			$uisel = typeof opt.id === 'string' ? $('#' + opt.id).closest('.ui-select') : opt.id.closest('.ui-select'),
			$sel = $('#' + id),
			$opt = $sel.find('option'),
			$opt_ = $uisel.find('.ui-select-opt'),
			callback = opt.callback === undefined ? false : opt.callback,
			current= opt.current,
			org= opt.original === undefined ? false : opt.original;

		!org ? $uisel.find('option').prop('selected', false).eq(current).prop('selected', true).change() : '';

		$uisel.find('.ui-select-btn').val($opt.eq(current).text());
		$opt_.removeClass('selected').eq(current).addClass('selected');
		
		if ($opt.eq(current).val() === 'direct') {
			$uisel.find('.ui-select-btn').prop('readonly', false).val('').focus();
		} else {
			$uisel.find('.ui-select-btn').prop('readonly', true).focus();;
		}

		callback ? callback({ id:id, current:current, val:$opt.eq(current).val() }) : '';
	}



	/* ------------------------------------------------------------------------
	* name : tab
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiTab({ option });
	* - $plugins.uiTabAct({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiTab: function (opt) {
			return createUiTab(opt);
		},
		uiTabAct: function (opt) {
			return createUiTabAct(opt);
		}
	});
	$ui.uiTab.option = {
		current: 0,
		unres: false,
		label: false,
		callback: false,
		align : 'center'
	};
	function createUiTab(opt) {
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiTab.option, opt),
			id = opt.id,
			current = isNaN(opt.current) ? 0 : opt.current,
			unres = opt.unres,
			callback = opt.callback,
			tabLabel = opt.label,
			align = opt.align,
			keys = $ui.option.keys,
			$tab = $('#' + id),
			$btns = $tab.children('.ui-tab-btns'),
			$btn = $btns.find('.ui-tab-btn'),
			$pnls = $tab.children('.ui-tab-pnls'),
			$pnl = $pnls.children('.ui-tab-pnl'),
			para = $ui.uiPara('tab'), // tab=idname-1
			len = $btn.length,
			fix = !!$tab.data('tabnum'),
			ps_l = [],
			i, 
			cls, 
			attrs, 
			is_current, 
			id_pnl, 
			id_btn, 
			_$btn, 
			_$pnl,
			para = $ui.uiPara('tab'),
			paras,
			paraname;
		
		
		//set up
		if (!!para) {
			if (para.split('+').length > 1) {
				//2개이상의 탭설정
				//tab=exeTab1-1+Tab_productBanner-3
				paras = para.split('+');

				for (var i = 0; i < paras.length; i++ ) {
					paraname = paras[i].split('*');
					opt.id === paraname[0] ? current = Number(paraname[1]) : '';
				}
			} else {
				//1개 탭 설정
				//tab=1
			 	if (para.split('*').length > 1) {
					paraname = para.split('*');
					opt.id === paraname[0] ? current = Number(paraname[1]) : '';
				} else {
					current = Number(para);
				}
			}
		}

		//set up
		$tab.data('opt', opt);
		tabLabel ? $btns.attr('aria-label', tabLabel) : '';
		$btns.attr('role','tablist');
		$btn.attr('role','tab');
		$pnl.attr('role','tabpanel');
		
		for (i = 0; i < len; i++) {
			var tabn = fix ? $btn.eq(i).data('tabnum') : i;

			is_current = current === tabn;
			cls = is_current ? 'addClass' : 'removeClass';
			attrs = is_current ? 'removeAttr' : 'attr';
			_$btn = $btn.eq(i);
			_$pnl = $pnl.eq(i);

			//id make
			_$btn.attr('id') === undefined ? _$btn.attr('id', id + 'Btn' + tabn) : '';
			_$pnl.attr('id') === undefined ? _$pnl.attr('id', id + 'Pnl' + tabn) : '';
			
			id_btn = _$btn.attr('id');
			id_pnl = _$pnl.attr('id');

			_$btn.attr('aria-controls', id_pnl)[attrs]('tabindex', -1)[cls]('selected');

			if (unres === false) {
				_$btn.attr('aria-controls', _$pnl.attr('id'));
				_$pnl.attr('aria-labelledby', id_btn).attr('aria-hidden', (current === tabn) ? false : true)[attrs]('tabindex', -1)[cls]('selected');
			} else {
				is_current ? $pnl.attr('aria-labelledby', id_btn).addClass('selected') : '';
			}

			if (is_current) {
				_$btn.attr('aria-selected', true).addClass('selected').append('<b class="hide">선택됨</b>');
			} else {
				_$btn.attr('aria-selected', false).removeClass('selected').find('b.hide').remove();
			}
				
			ps_l.push(Math.ceil(_$btn.position().left));

			i === 0 ? _$btn.attr('tab-first', true) : '';
			i === len - 1 ? _$btn.attr('tab-last', true) : ''
		}

		callback ? callback(opt) : '';

		$btn.data('psl', ps_l).data('len', len);
		$ui.uiScroll({ 
			value: ps_l[current], 
			target: $btns,
			speed: 0, 
			ps: align
		});

		//event
		$btn.off('click.uitab keydown.uitab')
			.on({
				'click.uitab': evtClick,
				'keydown.uitab': evtKeys
			});

		function evtClick() {
			$ui.uiTabAct({ id: id, current: $(this).index(), align:align }); 
		}
		function evtKeys(e) {
			var $this = $(this),
				n = $this.index(),
				m = Number($this.data('len'));

			switch(e.keyCode){
				case keys.up: upLeftKey(e);
				break;

				case keys.left: upLeftKey(e);
				break;

				case keys.down: downRightKey(e);
				break;

				case keys.right: downRightKey(e);
				break;

				case keys.end: endKey(e);
				break;

				case keys.home: homeKey(e);
				break;
			}

			function upLeftKey(e) {
				e.preventDefault();
				!$this.attr('tab-first') ? 
				$ui.uiTabAct({ id: id, current: n - 1, align:align }): 
				$ui.uiTabAct({ id: id, current: m - 1, align:align});
			}
			function downRightKey(e) {
				e.preventDefault();
				!$this.attr('tab-last') ? 
				$ui.uiTabAct({ id: id, current: n + 1, align:align }): 
				$ui.uiTabAct({ id: id, current: 0, align:align });
			}
			function endKey(e) {
				e.preventDefault();
				$ui.uiTabAct({ id: id, current: m - 1, align:align });
			}
			function homeKey(e) {
				e.preventDefault();
				$ui.uiTabAct({ id: id, current: 0, align:align });
			}
		}
	}
	function createUiTabAct(opt) {
		var id = opt.id,
			$tab = $('#' + id),
			$btns = $tab.children('.ui-tab-btns'),
			$btn = $btns.find('.ui-tab-btn'),
			$pnls = $tab.children('.ui-tab-pnls'),
			$pnl = $pnls.children('.ui-tab-pnl'),
			ps_l = $btn.data('psl'),
			align = opt.align,
			opt = $.extend(true, {}, $tab.data('opt'), opt),
			current = isNaN(opt.current) ? 0 : opt.current,
			unres = opt.unres,
			callback = opt.callback;

		$btn.find('b.hide').remove();
		$btn.eq(current).append('<b class="hide">선택됨</b>');
		$btn.removeClass('selected').eq(current).addClass('selected').focus();

		$plugins.uiScroll({ 
			value: ps_l[current], 
			btnwidth : $btn.outerWidth(),
			target: $btns, 
			speed: 300, 
			ps: align 
		});

		if (unres === false) {
			$pnl.attr('aria-hidden', true).removeClass('selected').attr('tabindex', '-1').eq(current).addClass('selected').attr('aria-hidden', false).removeAttr('tabindex');
		}

		!!callback ? callback(opt) : '';
	}



	/* ------------------------------------------------------------------------
	* name : tooltip
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiTooltip();
	* - $plugins.uiTooltip({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiTooltip: function (opt) {
			return createUiTooltip(opt);
		}
	});
	$ui.uiTooltip.option = {
		visible: null,
		id: false,
		ps: false
	};
	function createUiTooltip(opt){
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiTooltip.option, opt),
			$btn = $('.ui-tooltip-btn'),
			$tip = opt.id ? typeof opt.id === 'string' ? $('#' + opt.id) : opt.id : false,
			visible = opt.visible,
			id = opt.id ? $tip.attr('id') : '',
			
			sp = 10,
			ps = opt.ps,
			off_t, off_l, w, h, bw, bh, st, sl, timer,
			class_ps = 'ps-ct ps-cb ps-lt ps-lb ps-rt ps-rb';

		if (visible !== null) {
			visible ? tooltipSet(id) : tooltipHide();
		}

		// $btn
		// .on('click', function(e){
		// 	e.preventDefault();
		// 	tooltipSet($(this).attr('aria-describedby'));
		// });

		$btn
		.off('mouseover.ui focus.ui').on('mouseover.ui focus.ui', function(e){
			e.preventDefault();
			tooltipSet($(this).attr('aria-describedby'));
		})
		.off('mouseleave.ui ').on('mouseleave.ui', function(){
			tooltipHideDelay();

			$('.ui-tooltip')
				.on('mouseover.ui', function(){
					clearTimeout(timer);
				})
				.on('mouseleave.ui', function(e){
					tooltipHideDelay();
				});
		})

		$btn
		.off('touchstart.uitooltip').on('touchstart.uitooltip', function(e){
			e.preventDefault();
			if (!$(this).data('view')){
				$(this).data('view', true);
				tooltipHide();
				tooltipSet($(this).attr('aria-describedby'));
			} else {
				$(this).data('view', false);
				tooltipHide();
			}

			// $(doc).off('click.bdd').on('click.bdd', function(e){
			// 	//dropdown 영역 외에 클릭 시 판단
			// 	if (!!$('body').data('dropdownOpened')){
			// 		if ($('.ui-tooltip').has(e.target).length < 1) {
			// 			tooltipHide();
			// 		}
			// 	}
			// });
		});

		function tooltipSet(v) {
			var $t = $('[aria-describedby="'+ v +'"]');

			$('#' + v).removeClass(class_ps);

			id = v;
			off_t = $t.offset().top;
			off_l =$t.offset().left;
			w = $t.outerWidth();
			h = $t.outerHeight();
			bw = $(win).innerWidth();
			bh = $(win).innerHeight();
			st = $(doc).scrollTop();
			sl = $(doc).scrollLeft();
			
			tooltipShow(off_t, off_l, w, h, bw, bh, st, sl, id, false);
		}
		function tooltipHide() {
			$('.ui-tooltip').removeAttr('style').attr('aria-hidden', true).removeClass(class_ps);
		}
		function tooltipHideDelay(){
			timer = setTimeout(tooltipHide, 100);
		}

		function tooltipShow(off_t, off_l, w, h, bw, bh, st, sl, id) {
			var $id = $('#' + id),
				pst = (bh / 2 > (off_t - st) + (h / 2)) ? true : false,
				psl = (bw / 2 > (off_l - sl) + (w / 2)) ? true : false,
				tw = $id.outerWidth(),
				th = $id.outerHeight(),
				ps_l, ps_r, cursorCls = 'ps-';
				
			if (psl) {
				if (off_l - sl > tw / 2) {
					cursorCls += 'c';
					ps_l = off_l - (tw / 2) + (w / 2);
				} else {
					cursorCls += 'l';
					ps_l = off_l;
				}
			} else {
				if (bw - (off_l - sl + w) > tw / 2) {
					cursorCls += 'c';
					ps_r = Math.ceil(off_l) - (tw / 2) + (w / 2);
				} else {
					cursorCls += 'r';
					ps_r = off_l - tw + w;
				}
			}

			ps ? cursorCls = 'ps-l' : '';
			ps ? ps_l = off_l : '';
			ps ? psl = true : '';
			pst ? cursorCls += 'b' : cursorCls += 't';

			if (!!$id.attr('modal')) {
				if (!$ui.browser.oldie) {
					ps_l = ps_l;
					ps_r = ps_r;
				}

				$ui.browser.ie ? '' : off_t = off_t;
			}

			if (!!$id.closest('.type-fixed-bottom').length) {
				off_t = off_t - $('ui-modal-tit').outerHeight();
			}

			$id.addClass(cursorCls).attr('aria-hidden', false).css({ 
				display:'block'
			}).css({
				top : pst ? off_t + h + sp : off_t - th - sp,
				left : psl ? ps_l : ps_r
			});
		}
	}



	/* ------------------------------------------------------------------------
	* name : table scroll & caption
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiCaption();
	* - $plugins.uiTblSroll({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiTblScroll: function (opt) {
			return createUiTblScroll(opt);
		},
		uiCaption: function () {
			return createUiCaption();
		}
	});
	$ui.uiTblScroll.option = {
		selector: '.ui-tblscroll',
		customscroll: false,
		rown: 5
	}
	function createUiTblScroll(opt){
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiTblScroll.option, opt),
			$tbl = $(opt.selector),
			rown = opt.rown,
			customscroll = opt.customscroll,
			len = $tbl.length,
			$thead = '',
			$tbody = '',
			h = 0,
			i = 0,
			clone_colgroup,
			clone_thead,
			clone_tbl = '';

		for (i = 0; i < len; i++) {
			$tbl.eq(i).find('.tbl-scroll-thead').remove();
			$tbl.eq(i).find('.tbl-scroll-tbody').removeAttr('style');

			rown = !!$tbl.eq(i).data('row') ? $tbl.eq(i).data('row') : rown,
			$tbody = $tbl.eq(i).find('.tbl-scroll-tbody');
			clone_colgroup = $tbody.find('colgroup').clone();
			clone_thead = $tbody.find('thead tr').clone();
			h = 0;

			clone_tbl += '<div class="tbl-scroll-thead">';
			clone_tbl += '<table class="txt-c" aria-hidden="true" tabindex="-1">';
			clone_tbl += '</table>';
			clone_tbl += '</div>'

			$tbl.eq(i).prepend(clone_tbl);
			clone_tbl = '';
			$tbl.eq(i).find('.tbl-scroll-thead table').append(clone_colgroup);
			$tbl.eq(i).find('.tbl-scroll-thead table').append(clone_thead);
			$thead = $tbl.eq(i).find('.tbl-scroll-thead');
			$thead.find('th').each(function(){
				$(this).replaceWith('<td>'+ $(this).text() +'</td>');
			});

			if ($tbody.find('tbody tr').length > rown) {
				for (var j = 0; j < rown; j++) {
					h = h + $tbody.find('tbody tr').eq(j).outerHeight();
				}
				
				if (customscroll) {
					$tbl.eq(i).removeClass('is-scr');
					$tbody.addClass('ui-scrollbar').find('.tbl-base').addClass('ui-scrollbar-item');
				} else {
					$tbl.eq(i).addClass('is-scr');
					$tbody.removeClass('ui-scrollbar').find('.tbl-base').removeClass('ui-scrollbar-item');
				}
				$tbody.css('max-height', h + 'px');
			}
			customscroll ? $ui.uiScrollBar(): '';
		}
	}
	function createUiCaption(){
		var $cp = $('.ui-caption');

		$cp.text('');
		$cp.each(function(){
			var $table = $(this).closest('table'),
				isthead = !!$table.find('> thead').length,
				$th = $(this).closest('table').find('> tbody th'),
				th_len = $th.length,
				i = 0,
				cp_txt = '';
			if (isthead) {
				$th = $(this).closest('table').find('> thead th');
				th_len = $th.length
			}

			for (i = 0; i < th_len; i++) {
				if ($th.eq(i).text() !== '') {
					cp_txt += $th.eq(i).text();
				}
				if (i < th_len - 1) {
					cp_txt += ', ';
				}
			}
			$(this).text(cp_txt + ' 정보입니다.');
		})
	}


	/* ------------------------------------------------------------------------
	* name : object floating
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiFloating({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiFloating: function (opt) {
			return createUiFloating(opt);
		}
	});
	$ui.uiFloating.option = {
		ps: 'bottom',
		add: false,
		fix: true,
		callback: false
	};
	function createUiFloating(opt) {
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiFloating.option, opt),
			id = opt.id,
			ps = opt.ps,
			add = opt.add,
			fix = opt.fix,
			callback = opt.callback,
			$id = $('#' + id),
			$idwrap = $id.find('.ui-floating-wrap'),
			$add = $('#' + add),
			$addwrap = $add.find('.ui-floating-wrap').length ? $add.find('.ui-floating-wrap') : $add,
			c = 'ui-fixed-' + ps,
			timer;
		
		!!fix ? $id.addClass(c) : '';
		
		if ($id.length) {
			clearTimeout(timer);
			timer = setTimeout(act, 300);
		}
		
		$(win).off('scroll.'+ id ).on('scroll.'+ id, function(){
			if ($id.length) {
				act();
				clearTimeout(timer);
				timer = setTimeout(act, 500);
			}
		});
		
		function act(){
			var tt = Math.ceil($id.offset().top),
				th = Math.ceil($idwrap.outerHeight()),
				st = $(win).scrollTop(),
				wh = Math.ceil( $ui.browser.mobile ? window.screen.height : $(win).outerHeight() ),
				dh = Math.ceil($(doc).outerHeight()),
				lh = (!!add) ? $add.outerHeight() : 0 ,
				lt = (!!add) ? dh - ($add.offset().top).toFixed(0) : 0,
				lb = 0, 
				_lb;
			
			$idwrap.removeAttr('style');
			$id.data('fixbottom', th);

			if (!!add) {
				if ($add.data('fixbottom') === undefined) {
					$add.data('fixbottom', th + $addwrap.outerHeight());
				}
			}

			!!add ? lh = lh + Number($add.data('fixtop') === undefined ? 0 : $add.data('fixtop')) : '';
			!!callback ? callback({ id:id, scrolltop:st, boundaryline: tt - lh }) : '';
			$id.css('height', th);

			// 상단으로 고정
			if (ps === 'top') {
				// 고정 > 흐름
				if (fix === true) {
					if (tt - lh <= st) { 
						$id.removeClass(c).data('fixtop', false);
						$idwrap.removeAttr('style');
					} else { 
						$id.addClass(c).data('fixtop', lh);
						$idwrap.css('top', lh);
					}
				} 
				// 흐름 > 고정	
				else {
					if (tt - lh <= st) { 
						$id.addClass(c).data('fixtop', lh);
						$idwrap.css('top', lh);
					} else { 
						$id.removeClass(c).data('fixtop', false);
						$idwrap.removeAttr('style');
					}
				}
			} 
			// 하단으로 고정
			else if (ps === 'bottom') {
				if (!!add) { 
					lb = th + Number($add.data('fixbottom'));
					$id.data('fixbottom', lb);
				}
				_lb = (lb - th < 0) ? 0 : lb - th;
				// 고정 > 흐름
				if (fix === true) {
					if (tt + th + _lb - wh <= st) { 
						$id.removeClass(c);
						$idwrap.removeAttr('style');
					} else {
						$id.addClass(c)
						$idwrap.css('bottom', _lb);
					}
						
				// 흐름 > 고정		
				} else {
					if (tt + th + _lb - wh <= st) {
						$id.addClass(c);
						$idwrap.css('bottom', _lb);
					} else {
						$id.removeClass(c);
						$idwrap.removeAttr('style');
					}
				}
			}
		}
	}



	/* ------------------------------------------------------------------------
	* name : object floating Range
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiFloatingRange({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiFloatingRange: function (opt) {
			return createUiFloatingRange(opt);
		}
	});
	$ui.uiFloatingRange.option = {
		add: false,
		margin: 0
	};
	function createUiFloatingRange(opt) {
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiFloatingRange.option, opt),
			id = opt.id,
			add = opt.add,
			mg = opt.margin,
			$range = $('#' + id),
			$item = $range.find('.ui-floating-range-item'),
			$add = add ? $('#' + add) : null,
			item_h = $item.outerHeight(),
			range_t = $range.offset().top,
			range_h = $range.outerHeight(),
			win_scrt = $(win).scrollTop(),
			add_h = add ? $add.outerHeight() : 0,
			add_t = add ? $add.position().top : 0;
						
		$(win).off('scroll.'+ id ).on('scroll.'+ id, function(){
			act();
		});
		
		function act(){
			range_t = $range.offset().top;
			range_h = $range.outerHeight();
			win_scrt = $(win).scrollTop();
			add_h = $add.outerHeight();
			add_t = $add.position().top;
			
			if (range_t <= (win_scrt + add_h + add_t + mg)) {
				if ((range_t + range_h) - item_h < (win_scrt + add_h + add_t + mg)) {
					$item.css('top', range_h - item_h );
				} else {
					$item.css('top', (win_scrt + add_h + add_t + mg) - range_t );
				}
			} else {
				$item.css('top', 0);
			}
		}
	}



	/* ------------------------------------------------------------------------
	* name : Brick list
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uibricklist({ option });
	* - $plugins.uibricklistAdd({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiBrickList: function (opt) {
			return createUiBrickList(opt);
		},
		uiBrickListAdd: function (opt) {
			return createUiBrickListAdd(opt);
		}
	});
	$ui.uiBrickList.option = {
		margin: 0,
		actdelay: true,
		response: true
	}
	function createUiBrickList(opt){
		if (opt === undefined) { return false; }
		
		var opt = opt === undefined ? {} : opt,
			opt = $.extend(true, {}, $ui.uiBrickList.option, opt),
			$base = $('#' + opt.id), 
			$item = $base.find('.ui-bricklist-item').not('.disabled'),
			mg = opt.margin,
			re = opt.response,
			actdelay = opt.actdelay,
			wrap_w  = $base.outerWidth(),
			item_w  = $item.outerWidth(),
			item_sum = $item.length,
			item_col = Math.floor(wrap_w / item_w) ,
			item_row = (item_sum / item_col) + (item_sum % item_col) ? 1 : 0,
			item_top = [],
			delay_n = 0,
			i = 0,
			timer;

		$base.data('orgcol',item_col);

		for (i = 0; i < item_col; i++) {
			actdelay ? delay_n = i: delay_n = 0;
			$item.eq(i).attr('role','listitem').css({
				position: 'absolute',
				left : (item_w + mg) * i,
				top : 0
			}).stop().delay(50 * i).animate({
				top : 0
			}, 300, function(){
				$(this).addClass('on');
			});
			$(this).addClass('on');
			item_top[i] = $item.eq(i).outerHeight() + mg;
		}

		setTimeout(function(){
			for (i = 0; i < item_col; i++) {
				item_top[i] = $item.eq(i).outerHeight() + mg;
			}
			
			$base.data('opt', { 
					'wrap':wrap_w, 
					'width':item_w, 
					'top':item_top, 
					'row':item_row, 
					'col':item_col, 
					'actdelay':actdelay,
					'mg':mg
				});
			$ui.uiBrickListAdd({ id: opt.id, actdelay:actdelay });
		},200);
		
		if (re) {
			$(win).off('resize.win').on('resize.win', function(){
				var recol_n =  Math.floor($('#' + opt.id).outerWidth() / $('#' + opt.id).find('.ui-bricklist-item').outerWidth());
				if ($base.data('orgcol') === recol_n && recol_n > 1) {
					return false;
				}
				
				clearTimeout(timer);
				timer = setTimeout(function(){
					$ui.uiBrickList({ id : opt.id, margin: opt.margin, actdelay:false });
				},300);
				$base.find('.ui-bricklist-wrap').css('height', Math.max.apply(null, item_top));
			});
		}	
	}
	function createUiBrickListAdd(opt){
		if (opt === undefined) { return false; }
		
		var $base = $('#' + opt.id), 
			$item = $base.find('.ui-bricklist-item').not('.disabled'),
			dataOpt = $base.data('opt'),
			wrap_w = dataOpt.wrap,
			actdelay = dataOpt.actdelay,
			item_w = dataOpt.width,
			item_sum = $item.length,
			item_col = dataOpt.col,
			item_row = dataOpt.row,
			item_top = dataOpt.top,
			mg = dataOpt.mg,
			delay_n = 0,
			i = item_col,
			minH, nextN, item_h,timer;

		clearTimeout(timer);
		timer = setTimeout(function(){
			for (i; i < item_sum; i++) {
				actdelay ? delay_n = i: delay_n = 0;
				minH = Math.min.apply(null, item_top);
				nextN = item_top.indexOf(minH);
				item_h = Number($item.eq(i).outerHeight() + mg);
				$plugins.uiLoading({ visible:true });
				$item.eq(i).css({
					position: 'absolute',
					left : (item_w * nextN) + (mg * nextN),
					top : item_top[nextN]
				}).stop().delay(50 * i).animate({
					 top : item_top[nextN]
				},150, function(){
					$plugins.uiLoading({ visible:false });
					$(this).addClass('on');
				});
				item_top[nextN] = Number(minH + item_h);
			}
			$base.data('opt', { 'wrap':wrap_w, 'width':item_w, 'top':item_top, 'row':item_row, 'col':i, 'mg':mg })
			.find('.ui-bricklist-wrap').css('height', Math.max.apply(null, item_top));
		},300);
	}



	/* ------------------------------------------------------------------------
	* name : print
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiPrint({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiPrint: function (opt) {
			return createUiPrint(opt);
		}
	});
	function createUiPrint(opt) {
		var $print = $('#' + opt.id),
			clone = $print.clone(),
			html = '';

		html += '<div class="base-print" id="basePrint"></div>';
		
		function preview_print(){ 
			var webBrowser ='<OBJECT ID="previewWeb" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
			
			doc.body.insertAdjacentHTML('beforeEnd', webBrowser);
			previewWeb.ExecWB(7,1);
			previewWeb.outerHTML='';
		} 

		if (self !== top) {
			parent.$('body').append(html);
			parent.$('.base-print').append(clone);
			
			$ui.browser.ie ? preview_print() : win.parent.print();

			setTimeout(function () {
				parent.$('.base-print').remove();
			}, 0);
		} else {
			$('body').addClass('print-ing').append(html);
			$('.base-print').append(clone);
			
			$ui.browser.ie ? preview_print() : win.print();
			
			setTimeout(function () {
				$('body').removeClass('print-ing')
				$('.base-print').remove();
			}, 0);
		}
	}



	/* ------------------------------------------------------------------------
	 * slot machine v1.0 
	 * date : 2018-04-21
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiSlot: function (opt) {
			return createUiSlot(opt);
		},
		uiSlotStart: function (opt) {
			return createUiSlotStart(opt);
		},
		uiSlotStop: function (opt) {
			return createUiSlotStop(opt);
		}
	});
	$ui.uiSlot.play = {}
	function createUiSlot(opt){
		if (opt === undefined) {
			return false;
		}
		
		var $slot = $('#' + opt.id),
			current = opt.current === undefined ? 0 : opt.current,
			auto = opt.auto === undefined ? false : opt.auto,
			single = opt.single === undefined ? true : opt.single,
			$wrap = $slot.find('.ui-slot-wrap'),
			$item = $wrap.find('.ui-slot-item'),
			item_h = $item.outerHeight(),
			len = $item.length,
			cut, clone;
		
		//common set up
		$slot.data('n', len).data('single', single);
		$item.each(function(i){
			$(this).attr('n', i + 1).data('n', i + 1);
		});
		
		//single or multi set up
		if (single) {
			$wrap.css({ 
				marginTop: 0, 
				top: (current - 1) * item_h * -1
			});
			itemClone({ n: 0, append: true });
		} else {
			$wrap.css({ 
				marginTop: ((item_h/2) + item_h) * -1, 
				top: 0
			});
			if (current - 1 > 0) {
				for(var i = 0; i < current - 1; i++){
					// 2일경우
					if (current - 2 === i) {
						itemClone({ n: i - 1, append: false });
						itemClone({ n: i, append: true });
						itemClone({ n: i + 1, append: true });
						itemClone({ n: i + 2, append: true });
					} else {
						cut = $item.eq(i).detach();
						$wrap.append(cut);
					}
				}
			} else {
				itemClone({ n: - 1, append: false });
				itemClone({ n: - 2, append: false });
				itemClone({ n: current - 1, append: true });
				itemClone({ n: current, append: true });
			}
		}

		function itemClone(opt) {
			//var stickitem = opt.append ? 'append' : 'prepend';
			clone = $item.eq(opt.n).clone().addClass('clone').removeAttr('n');
			$wrap[opt.append ? 'append' : 'prepend'](clone);
		}
		auto ? $ui.uiSlotStart(opt) : '';
	}
	function createUiSlotStart(opt){
		//option guide
		if (opt === undefined) {
			return false;
		}
		var $slot = $('#' + opt.id),
			$wrap = $slot.find('.ui-slot-wrap'),
			$item = $wrap.find('.ui-slot-item'),
			single = $slot.data('single'),
			item_h = $item.outerHeight(),
			current = opt.current,
			len = $item.length,
			first_t = item_h * current * -1,
			wrap_h = len * item_h,
			h = 0;
		
		var s = Math.ceil((500 / len) * (len - current));
		
		if (!$slot.data('ing')) {
			$slot.data('ing', true);
			//$ui.uiSlot.play[opt.id] = win.setInterval(steplot, s);
			$wrap.css('top', first_t).stop().animate({
				top: single ? item_h * (len - 1) * -1 : Math.ceil(item_h * (len - 3) * -1)
			},s , 'linear', function(){
				s = 500;
				first_t = 0;
				steplot();
			}) ;
		}
		
		function steplot(){
			$wrap.css('top', 0).stop().animate({
				top: single ? item_h * (len - 1) * -1 : Math.ceil(item_h * (len - 3) * -1)
			},s , 'linear') ;
			
			
			win.clearInterval($ui.uiSlot.play[opt.id]);
			$ui.uiSlot.play[opt.id] = win.setInterval(steplot, s);
		}
	}
	function createUiSlotStop(opt){
		//option guide
		if (opt === undefined) {
			return false;
		}
		
		var $slot = $('#' + opt.id),
			$wrap = $slot.find('.ui-slot-wrap'),
			$item = $wrap.find('.ui-slot-item'),
			item_h = $item.outerHeight(),
			len = $item.length,
			
			callback = opt.callback,
			single = $slot.data('single'),
			n = $slot.data('n'),
			result = Math.floor(Math.random() * n) + 1,
			index =  $wrap.find('.ui-slot-item[n="' + result + '"]').index(),
			x = single ? index : index - 2,
			timer, t, s = 500;
		
		$slot.data('ing', false);
		$item.removeClass('selected');
		single ? $wrap.css('margin-top', 0): '';

		clearTimeout(timer);
		timer = setTimeout(function(){
			win.clearInterval($ui.uiSlot.play[opt.id]);
			t = item_h * x * -1;
			
			var ss = Math.ceil((5000 / len) * (len - x));
			$wrap.stop().animate({
				top: t
			}, s, 'easeOutQuad', function(){
				$wrap.find('.ui-slot-item').eq(index).addClass('selected');
				callback(result);
			});
		},10);
	}



	/* ------------------------------------------------------------------------
	* name : slider
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiSlider({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiSlider: function (opt) {
			return createUiSlider(opt);
		}
	});
	$ui.uiSlider.option = {
		vertical: false, //가로,세로형
		range: false, //범위슬라이더
		reverse : false, //역순
		acc: false, //select 연결
		stepname: false,
		callback: false,

		tooltip: false,
		unit: '',
		txt_s:'',
		txt_e:'',

		now: [0],
		step: 10,
		min: 0,
		max: 100,
	}
	function createUiSlider(opt) {
		var opt = $.extend(true, {}, $ui.uiSlider.option, opt),
			$slider = $('#' + opt.id),
			$wrap = $slider.find('.ui-slider-wrap'),
			$divwrap = $slider.find('.ui-slider-divwrap'),
			$bg = $wrap.find('.ui-slider-bg'),
			$btn = $wrap.find('button'),
			$btn_s = $wrap.find('.ui-slider-btn-s'),
			$btn_e = $wrap.find('.ui-slider-btn-e'),
			$bar = $bg.find('.ui-slider-bar'),
			vertical = opt.vertical,
			range = opt.range,
			rev = opt.reverse,
			stepname = opt.stepname,
			acc = opt.acc;//select 연결

		rev ? $slider.addClass('type-reverse') : $slider.removeClass('type-reverse');
		vertical ? $slider.addClass('type-vertical') : $slider.removeClass('type-vertical');

		var	step = opt.step,
			id = opt.id,
			min = opt.min,
			max = opt.max,
			tooltip = opt.tooltip,
			callback = opt.callback,
			unit = opt.unit,
			txt_e = opt.txt_e,
			txt_s = opt.txt_s,
			txt_e2 = '', 
			txt_s2 = '',

			slider_w = !vertical ? $bg.outerWidth() : $bg.outerHeight(),
			step_w = 100 / step,
			unit_sum = (max - min) / step,
			now_s = opt.now[0] < min ? min : opt.now[0],
			now_e = opt.now[1] > max ? max : opt.now[1],
			per_min = ((now_s - min) / (max - min)) * 100,
			per_max = ((now_e - min) / (max - min)) * 100,
			div_w = Math.ceil(slider_w / step),
			lmt_max,
			lmt_min,
			now_sum = [],
			sliderstep = [],
			p, keyCode, $sel_s, $sel_e, txt_val,
			dir = !vertical ? rev ? 'right' : 'left' : rev ? 'bottom' : 'top',
			siz = !vertical ? 'width' : 'height';

		//percent change
		per_min = perStep(per_min);
		range ? per_max = perStep(per_max) : '';

		//web accessibility : select 
		if (acc) {
			$sel_s = $('[data-sliderselect="' + opt.id + '"]').find('.ui-slider-min');
			range ? $sel_e = $('[data-sliderselect="' + opt.id + '"]').find('.ui-slider-max') : '';
		}
		
		//reset
		$wrap.find('.ui-slider-tooltip').remove();
		$divwrap.find('span').remove();
		
		//tooltip setting
		if (!!tooltip) {
			$wrap.append('<div class="ui-slider-tooltip"></div>');
			sliderTooltip({ unit:unit, now_1:opt.now[0], now_2:opt.now[1], per_min:per_min, per_max:per_max });
			sliderCallback({ callback:callback, now_1:opt.now[0], now_2:opt.now[1] });
		} 
		
		//button setting
		$btn_s.css(dir, per_min + '%').find('.ui-slider-txt').text(((per_min / step_w) * unit_sum) + min);
		range ? $btn_e.css(dir, per_max + '%').find('.ui-slider-txt').text(((per_max / step_w) * unit_sum) + min) : '';
		//range 타입 : 버튼이 겹치는 경우 우선 클릭될 버튼 설정
		if (per_min === per_max && per_min >= 50 && range) {
			$btn_s.addClass('on');
			$btn_e.removeClass('on');
		} else if (per_min === per_max && per_max < 50 && range){
			$btn_s.removeClass('on');
			$btn_e.addClass('on');
		}
		
		//graph bar setting
		!range ? $bar.css(siz,per_min + '%').css(dir,0) : $bar.css(siz,per_max - per_min + '%').css(dir,per_min + '%' );

		//graph step & select option setting
		for (var i = 0; i < step + 1; i++) {
			txt_e2 = (i === step) ? opt.txt_e : '';
			txt_s2 = (i === 0) ? opt.txt_s : '';
			txt_val = parseInt(min + (unit_sum * i));
			now_sum.push(txt_val);
			if (stepname) {
				$divwrap.append('<span class="ui-slider-div n'+ i +'" style="'+ dir +':' + step_w * i + '%; '+ siz +':' + div_w + 'px; margin-'+ dir +':' + (div_w / 2) * -1 + 'px"><em>' + stepname[i] + '</em></div>');
			} else {
				$divwrap.append('<span class="ui-slider-div n'+ i +'" style="'+ dir +':' + step_w * i + '%; '+ siz +':' + div_w + 'px; margin-'+ dir +':' + (div_w / 2) * -1 + 'px"><em>' + txt_val + ' ' + txt_e2 + '' + txt_s2 + '</em></div>');
			}
			
			sliderstep.push(parseInt(min + (unit_sum * i)));
			if (stepname) {
				if (acc) {
					if (now_s === txt_val) {
						$sel_s.append('<option value="' + txt_val + '" selected>' + stepname[i] + '</option>');
					} else if (now_e < txt_val) {
						$sel_s.append('<option value="' + txt_val + '" disabled>' + stepname[i] + '</option>');
					} else {
						$sel_s.append('<option value="' + txt_val + '">' + stepname[i] + '</option>');
					}
					
					if (now_e === txt_val && range) {
						$sel_e.append('<option value="' + txt_val + '" selected>' + stepname[i] + '</option>');
					} else if (now_s > txt_val && range) {
						$sel_e.append('<option value="' + txt_val + '" disabled>' + stepname[i] + '</option>');
					} else if (range){
						$sel_e.append('<option value="' + txt_val + '">' + stepname[i] + '</option>');
					}
				}
			} else {
				if (acc) {
					if (now_s === txt_val) {
						$sel_s.append('<option value="' + txt_val + '" selected>' + txt_val + '' + opt.unit + ' ' + txt_e2 +'' + txt_s2 + '</option>');
					} else if (now_e < txt_val) {
						$sel_s.append('<option value="' + txt_val + '" disabled>' + txt_val + '' + opt.unit + ' ' + txt_e2 +'' + txt_s2 + '</option>');
					} else {
						$sel_s.append('<option value="' + txt_val + '">' + txt_val + '' + opt.unit + ' ' + txt_e2 +'' + txt_s2 + '</option>');
					}
					
					if (now_e === txt_val && range) {
						$sel_e.append('<option value="' + txt_val + '" selected>' + txt_val + '' + opt.unit + ' ' + txt_e2 +'' + txt_s2 + '</option>');
					} else if (now_s > txt_val && range) {
						$sel_e.append('<option value="' + txt_val + '" disabled>' + txt_val + '' + opt.unit + ' ' + txt_e2 +'' + txt_s2 + '</option>');
					} else if (range){
						$sel_e.append('<option value="' + txt_val + '">' + txt_val + '' + opt.unit + ' ' + txt_e2 +'' + txt_s2 + '</option>');
					}
				}
			}
			
		}
		
		if (acc) {
			$('[data-sliderselect="' + opt.id + '"]').find('.ui-slider-min').on('change', function(){
				per_min = (($(this).val() - min) / (max - min)) * 100;
				per_min = perStep(per_min);
				actSel($(this).find('option:selected').index(), 'min');
				act($btn_s, 'min');
			});
			$('[data-sliderselect="' + opt.id + '"]').find('.ui-slider-max').on('change', function(){
				per_max = (($(this).val() - min) / (max - min)) * 100,
				per_max = perStep(per_max);
				actSel($(this).find('option:selected').index(), 'max');
				act($btn_e, 'max');
			});
		}

		$('body	.ui-slider-wrap button').on('touchmove.uislider', function(e){
			e.preventDefault()
		});

		$btn.off('mousedown.sliderstart touchstart.sliderstart').on('mousedown.sliderstart touchstart.sliderstart', function(e){
			e.preventDefault();
			var $this = $(this),
				minmax = $this.data('btn'),
				moving = false;

			$(doc).off('mousemove.slidermove touchmove.slidermove').on('mousemove.slidermove touchmove.slidermove', function(e){
				moving = true;
				($('html').is('.ui-m')) ? per($this, event, minmax) : per($this, e, minmax);
				sliderTooltip({ now_1:((per_min / step_w) * unit_sum) + min, now_2:((per_max / step_w) * unit_sum) + min, per_min:perStep(per_min), per_max:perStep(per_max) });
				
			}).off('mouseup.sliderend touchcancel.slidermove touchend.slidermove').on('mouseup.sliderend touchcancel.slidermove touchend.slidermove', function(e){
				$this.closest('.ui-slider').find('.ui-slider-wrap button').removeClass('on');
				moving ? act($this, minmax) : '';
				$(doc).off('mousemove.slidermove mouseup.sliderend touchmove.slidermove');
			});
		});
		
		/* 접근성 이슈 : 키보드와 스크리리더기의 키 중복 */
		$btn_s.off('keyup.' + opt.id).on('keyup.' + opt.id, function(e){
			e.preventDefault();
			keyCode = e.keyCode || e.which;
			p = per_min;
			
			var $btnthis = $(this),
				$barthis = $btnthis.closest('.ui-slider').find('.ui-slider-bar');

			if(keyCode == 39 || keyCode == 40) {
				per_min = per_min + step_w;
				if (per_min > per_max) {
					per_min = per_max;
					alert('최대값을 수정하세요');
				} else {
					$btnthis.css(dir, per_min + '%').find('.ui-slider-txt').text(((per_min / step_w) * unit_sum) + min);
					$barthis.css(dir,per_min + '%').css(siz,(per_max - per_min) + '%');
				}
			}
			
			if(keyCode == 37 || keyCode ==  38) {
				per_min = per_min - step_w;
				if (per_min < 0) {
					per_min = 0;
					alert('최소값입니다.');
				} else {
					$btnthis.css(dir, per_min + '%').find('.ui-slider-txt').text(((per_min / step_w) * unit_sum) + min);
					$barthis.css(dir,per_min + '%').css(siz,(per_max - per_min) + '%');
				}
			}
			
			sliderTooltip({ now_1:((per_min / step_w) * unit_sum) + min, now_2:((per_max / step_w) * unit_sum) + min, per_min:per_min, per_max:per_max });
			sliderCallback({ callback:callback, now_1:((per_min / step_w) * unit_sum) + min, now_2:((per_max / step_w) * unit_sum) + min });
		});
		
		$btn_e.off('keyup.' + opt.id).on('keyup.' + opt.id, function(e){
			e.preventDefault();
			keyCode = e.keyCode || e.which;
			p = per_max;
			
			var $btnthis = $(this),
				$barthis = $btnthis.closest('.ui-slider').find('.ui-slider-bar');
			
			if(keyCode == 39 || keyCode == 40) {
				per_max = per_max + step_w;
				if (per_max > 100) {
					per_max = 100;
					alert('최대값입니다');
				} else {
					$btnthis.css(dir, per_max + '%').find('.ui-slider-txt').text(((per_max / step_w) * unit_sum) + min);
					$barthis.css(dir,per_min + '%').css(siz, (per_max - per_min) + '%');
				}
			}
			
			if(keyCode == 37 || keyCode ==  38) {
				per_max = per_max - step_w;
				if (per_max < per_min) {
					per_max = per_min;
					alert('최소값을 수정하세요.');
				} else {
					$btnthis.css(dir, per_max + '%').find('.ui-slider-txt').text(((per_max / step_w) * unit_sum) + min);
					$barthis.css(dir,per_min + '%').css(siz, (per_max - per_min) + '%');
				}
			}
			
			sliderTooltip({ now_1:((per_min / step_w) * unit_sum) + min, now_2:((per_max / step_w) * unit_sum) + min, per_min:per_min, per_max:per_max });
			sliderCallback({ callback:callback, now_1:((per_min / step_w) * unit_sum) + min, now_2:((per_max / step_w) * unit_sum) + min });
		});
		
		function act($this, minmax){
			if (minmax === 'min') {
				per_min = perStep(per_min);
				!range ? $bar.css(siz, per_min + '%').css(dir, 0) : $bar.css(siz, per_max - per_min + '%').css(dir, per_min + '%');
				lmt_min = per_min;
				if (acc) {
					now_sum.forEach(function(v, i){
						(v === ((per_min / step_w) * unit_sum) + min) ? actSel(i, minmax) : '';
					});
				}

				$this.css(dir, per_min + '%').addClass('on').find('.ui-slider-txt').text(((per_min / step_w) * unit_sum) + min);
			} else {
				per_max = perStep(per_max);
				$bar.css(siz, (per_max - per_min) + '%').css(dir,per_min + '%');

				lmt_max = per_max;
				if (acc) {
					now_sum.forEach(function(v, i){
						(v === ((per_max / step_w) * unit_sum) + min) ? actSel(i, minmax): '';
					});
				}
				$this.css(dir, per_max + '%').addClass('on').find('.ui-slider-txt').text(((per_max / step_w) * unit_sum) + min);
			}

			sliderTooltip({ now_1: ((per_min / step_w) * unit_sum) + min, now_2: ((per_max / step_w) * unit_sum) + min, per_min: per_min, per_max: per_max });
			sliderCallback({ callback:callback, now_1:Number(((per_min / step_w) * unit_sum) + min), now_2:Number(((per_max / step_w) * unit_sum) + min) });
		}
		function actSel(n, minmax){
			if (minmax === 'min') {
				range ? $sel_e.find('option').removeAttr('disabled') : '';
				$sel_s.find('option').eq(n).prop('selected', 'selected');
				range ? $sel_e.find('option:lt('+ n +')').prop('disabled', 'disabled') : '';
			} else {
				$sel_s.find('option').removeAttr('disabled');
				$sel_e.find('option').eq(n).prop('selected', 'selected');
				$sel_s.find('option:gt('+ n +')').prop('disabled', 'disabled');
			}
		}
		function perStep(v){
			var n = ((v % step_w) >= step_w / 2) ? 1 : 0;
			return (Math.floor(v / step_w) + n) * step_w;
		}
		function per($this, e, minmax){
			var value_l;
			slider_w = !vertical ? $bg.outerWidth() : $bg.outerHeight();
			if (!vertical) {
				if (e.touches !== undefined) {
					value_l = e.touches[0].pageX - $bg.offset().left - 0;
				}
				if (e.touches === undefined) {
					if (e.pageX !== undefined) {
						value_l = e.pageX - $bg.offset().left - 0;
					}
					//ie
					if (e.pageX === undefined) {
						value_l = e.clientX - $bg.offset().left - 0;
					}
				}
			} else {
				if (e.touches !== undefined) {
					value_l = e.touches[0].pageY - $bg.offset().top - 0;
				}
				if (e.touches === undefined) {
					if (e.pageX !== undefined) {
						value_l = e.pageY - $bg.offset().top - 0;
					}
					//ie
					if (e.pageX === undefined) {
						value_l = e.clientY - $bg.offset().top - 0;
					}
				}
			}

			p = (value_l <= 0) ? 0 : (value_l >= slider_w) ? slider_w - 0 : value_l;
			p = (p / slider_w) * 100;
			rev ? p = 100 - p : ''; 
			p > 50 ? Math.floor(p/10) * 10 : Math.ceil(p/10) * 10;
			p = p.toFixed(0);
			p = p < 0 ? 0 : p > 100 ? 100 : p;


			if (minmax === 'min') {
				lmt_min = 0;
				isNaN(lmt_max) ? lmt_max = per_max : '';
				p * 1 >= lmt_max * 1 ? p = lmt_max: '';
				per_min = p; 
				!range ? $bar.css(siz, per_min + '%').css(dir, 0) : $bar.css(siz, lmt_max - per_min + '%').css(dir, per_min + '%');
			}  
			 
			if (minmax === 'max') {
				lmt_max = 100;
				isNaN(lmt_min) ? lmt_min = per_min : '';
				p * 1 <= lmt_min * 1 ? p = lmt_min: '';
				per_max = p;
				$bar.css(siz, per_max - per_min + '%');
			}
			$this.css(dir, p + '%');
		}

		function sliderCallback(opt){
			$(doc).off('mouseup.sliderend touchcancel.slidermove touchend.slidermove');
			opt.callback ? opt.callback({ id:id, per_min:per_min, per_max:per_max, min: opt.now_1, max: opt.now_2 }) : '';
		}

		function sliderTooltip(opt){
			var $tooltip = $('#' + id).find('.ui-slider-tooltip'),
				tooltip_w, 
				bar_w,
				timer, 
				per_min = opt.per_min,
				per_max = opt.per_max,
				n_min = opt.now_1,
				n_max = opt.now_2,
				in_s = (per_min === 0) ? txt_s : '',
				in_e = (per_max === 100) ? txt_e : '',
				in_se = (per_min === 0) ? txt_s : (per_max === 100) ? txt_e : '';

			!range ? in_e = (per_min === 100) ? txt_e : '' : '';

			if (per_min === 0 && per_max === 100) {
				$tooltip.text('전체');
			} else if (n_min === n_max) {
				$tooltip.text(n_min.toFixed(0) + '' + unit + ' ' + in_se);
			} else {
				if (!range) {
					$tooltip.text(n_min.toFixed(0) + '' + unit + '' + in_s + '' + in_e);
				} else {
					$tooltip.text(n_min.toFixed(0) + '' + unit + '' + in_s + ' ~ '+ n_max.toFixed(0) + '' + unit + '' + in_e);
				}
			}

			clearTimeout(timer);
			timer = setTimeout(function(){
				var tt_l, tt_ml;

				if (!vertical) {
					tooltip_w = $tooltip.outerWidth();
					bar_w = $('#' + id).find('.ui-slider-bar').outerWidth();
				} else {
					tooltip_w = $tooltip.outerHeight();
					bar_w = $('#' + id).find('.ui-slider-bar').outerHeight();
				}

				if (!range) {
					tt_l = per_min + '%';
					tt_ml = (per_min === 0) ? 0 : (per_min === 100) ? tooltip_w * -1 : (tooltip_w / 2) * -1;
				} else {
					if (per_min === 0 && tooltip_w > bar_w) {
						tt_l = '0%';
						tt_ml = 0;
					} else if (per_max === 100 && tooltip_w > bar_w) {
						tt_l = '100%';
						tt_ml = tooltip_w * -1;
					} else {
						tt_l = per_min + ((per_max - per_min)/ 2) + '%';
						tt_ml = (tooltip_w / 2) * -1;
					}
				}

				$tooltip.css(dir, tt_l).css('margin-' + dir, tt_ml);
			},0);
		}
	}
	


	/* ------------------------------------------------------------------------
	 * slide(carousel) v1.0 
	 * date : 2018-04-21
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiSlide: function (opt) {
			return createUiSlide(opt);
		},
		uiSlideFnEvt: function (opt) {
			return createUiSlideFnEvt(opt);
		},
		uiSlideFnAuto: function (opt) {
			return createUiSlideFnAuto(opt);
		}
	});
	$ui.uiSlide.options = {
		current:0,
		multi:false,
		loop:true,
		items:1,
		eff:'slide',
		dot:true,
		nav:true,
		auto:true,
		play:false,
		gauge:true,
		resize: true,
		speed:300,
		autoTime:3000,
		callback: false,
		/* multi use */
		margin:0,
		mouseDrag:true,
		touchDrag:true
	};
	function createUiSlide(opt) {
		//option guide
		if (opt === undefined) {
			return false;
		}
		
		$ui.uiSlide[opt.id] = {};
		var base = $ui.uiSlide[opt.id];

		//루트설정
		base.root = $('#' + opt.id);
		base.tit = base.root.find('.ui-slide-tit');
		base.wrap = base.root.find('.ui-slide-wrap');
		base.itemwrap = base.root.find('.ui-slide-itemwrap');
		base.item = base.root.find('.ui-slide-item');
		base.itemtit = base.root.find('.ui-slide-itemtit');

		//옵션저장
		base.opt = $.extend({}, $ui.uiSlide.options, opt);
		
		//중복실행 방지
		if (!base.root.is('.load')) {
			base.root.addClass('load');
			uiSlideSet(base);

			
		}
	}
	function uiSlideSet(base){
		var base = base;

		//기본필요값 설정
		base.opt.len = base.item.length;
		base.opt.w = base.item.eq(base.opt.current).outerWidth();
		base.opt.h = base.item.eq(base.opt.current).outerHeight();
		base.opt.win_w = $(win).outerWidth();
		base.opt.docw = $(doc).outerHeight();
		
		//multi
		base.multi = {};
		base.multi.is = base.opt.multi;
		if (base.multi.is) {
			base.multi.w = [0]; //items width array
			base.multi.h = [];
			base.multi.ww = 0; //itemwrap width
			base.multi.rw = base.root.outerWidth(); //slide width
			base.root.addClass('ui-slide-multi n' + base.opt.items);
			base.itemwrap.addClass('ui-slide-multiitem');
			
			for (var i = 0; i < base.opt.len; i++) {
				base.item.eq(i).css('margin-right', (i !== base.opt.len - 1) ? base.opt.margin: 0 );
				base.multi.h.push(base.item.eq(i).outerHeight());
				base.multi.ww = base.multi.ww + base.item.eq(i).outerWidth() + Number((i !== base.opt.len - 1) ? base.opt.margin : 0);
				base.multi.w.push(base.multi.ww);
			}
			base.itemwrap.css('width', base.multi.ww);
			base.itemwrap.data('left', 0) ;
		}
		
		//current item 설정
		//base.opt.eff !== 'slide' ? base.item.addClass('animated') : '';
		if (!base.multi.is) {
			base.item.attr('aria-hidden', true).css('left', base.opt.w).eq(base.opt.current).attr('aria-hidden', false).css('left',0);
		}
		
		//heigth 설정
		base.wrap.css('height', base.opt.h);
		base.itemwrap.css('height', base.opt.h);
		base.item.eq(base.opt.current).css('height', base.opt.h);

		//이벤트 관련 설정
		base.evt = {};
		base.evt.offsetX = 0;
		base.evt.offsetY = 0;
		base.evt.activate = false; //현재 모션 여부
		base.evt.swap = 'off'; //dragmove,cancel 이벤트 실행여부
		base.evt.cancel = false;
		base.evt.xaxis = false;
		base.evt.movX = 0;
		base.evt.movY = 0;

		//자동진행
		base.auto = {};
		base.timer = {};
		base.timers = {};
		
		//fade effect value
		base.fade = {};
		base.fade.opacity = 0;
		
		//control 
		(base.opt.dot) ? uiSlideDot(base) : ''; 
		(base.opt.nav) ? uiSlideNav(base) : '';
		(base.opt.auto) ? uiSlideAuto(base) : '';
		(base.opt.gauge) ? uiSlideGauge(base) : ''; 
		
		uiSlideReset(base);
		uiSlideEvtType(base);
		uiSlideEvt(base);

		$(win).resize(function(){
			base.itemwrap.find('.ui-slide-item[aria-hidden="true"]').css('left', base.itemwrap.outerWidth());
			uiSlideReset(base);
			uiSlideEvtType(base);
			uiSlideEvt(base);
		});
		base.root.data('base', base);
	}
	function uiSlideDot(base) {
		var base = base,
			i, dotwrap, dotdiv, selected;
		
		dotwrap = doc.createElement("div");
		dotdiv = doc.createElement("div");
		$(dotwrap).addClass('ui-slide-dotwrap');
		$(dotdiv).addClass('ui-slide-dotdiv').attr('role', 'tablist');

		for (i = 0; i < base.opt.len; i++) {
			selected = (base.opt.current === i) ? 'true' : 'false'; 
			$(dotdiv).append('<button class="ui-slide-dot" type="button" role="tab" aria-selected="' + selected + '"><span class="hide">' + base.item.eq(i).find(".ui-slide-itemtit").text() + '</span></button>');
		}
		base.root.prepend(dotwrap);
		base.dotwrap = base.root.find('.ui-slide-dotwrap');
		base.dotwrap.append(dotdiv);
		base.dotdiv = base.dotwrap.find('.ui-slide-dotdiv');
		base.dotbtn = base.dotdiv.find('.ui-slide-dot');
	}
	function uiSlideNav(base) {
		var base = base,
			navwrap, $navwrap, eqNext, eqPrev;
		
		eqNext = base.opt.current + 1 >= base.opt.len ? 0 : base.opt.current + 1;
		eqPrev = base.opt.current - 1 < 0 ? base.opt.len - 1 : base.opt.current - 1;
		
		navwrap = doc.createElement("div");
		$navwrap = $(navwrap);
		
		$navwrap.addClass('ui-slide-navwrap');
		$navwrap.append('<button type="button" class="ui-slide-prev">이전 : <span>' + base.item.eq(eqPrev).find(".ui-slide-itemtit").text() + '</span></button>');
		$navwrap.append('<button type="button" class="ui-slide-next">다음 : <span>' + base.item.eq(eqNext).find(".ui-slide-itemtit").text() + '</span></button>');
		base.root.append(navwrap);
		
		base.nav = base.root.find('.ui-slide-navwrap');
		base.nav.prev = base.nav.find('.ui-slide-prev');
		base.nav.next = base.nav.find('.ui-slide-next');
	}
	function uiSlideAuto(base) {
		var base = base,
				dotwrap, autobtn;

			if (!base.root.find('.ui-slide-dotwrap').length) {
				dotwrap = doc.createElement("div");
				$(dotwrap).addClass('ui-slide-dotwrap');
				base.root.prepend(dotwrap);
				base.dotwrap = base.root.find('.ui-slide-dotwrap');
			}
			if (!!base.opt.play) {
				autobtn = '<button type="button" class="ui-slide-auto" state="play"><span>정지</span></button>';
			} else {
				autobtn = '<button type="button" class="ui-slide-auto" state="stop"><span>자동 진행</span></button>';
			}
			base.dotwrap.prepend(autobtn);
			base.autobtn = base.dotwrap.find('.ui-slide-auto');
			(base.opt.play && base.opt.auto) ? uiSlideAutoEvt(base, true) : '';
	}
	function uiSlideGauge(base) {
		var base = base,
			gaugewrap = doc.createElement("div"),
			$gaugewrap = $(gaugewrap);
		
		$gaugewrap.addClass('ui-slide-gauge');
		$gaugewrap.append('<div class="ui-slide-gaugebar"></div>');
		base.root.append(gaugewrap);
		
		base.gauge =  base.root.find('.ui-slide-gauge');
		base.gauge.bar = base.gauge.find('.ui-slide-gaugebar');
	}
	function uiSlideReset(base) {
		var base = base;

		$(win).resize(function(){
			clearTimeout(base.timers);
			base.timers = setTimeout(function(){
				if (base.opt.win_w !== $(win).outerWidth()) {
					base.opt.len = base.item.length;
					base.opt.w = base.item.eq(base.opt.current).outerWidth();
					base.opt.h = base.item.eq(base.opt.current).outerHeight();
					base.opt.win_w = $(win).outerHeight();
					base.opt.docw = $(doc).outerHeight();
					base.evt.activate = false; //현재 모션 여부
					
					if (base.multi.is) {
						base.multi.w = [0]; //items width array
						base.multi.h = [];
						base.multi.ww = 0; //itemwrap width
						base.multi.rw = base.root.outerWidth(); //slide width
						base.root.addClass('ui-slide-multi n' + base.opt.items);
						base.itemwrap.addClass('ui-slide-multiitem');
						
						for (var i = 0; i < base.opt.len; i++) {
							base.item.eq(i).css('margin-right', (i !== base.opt.len - 1) ? base.opt.margin: 0 );
							base.multi.h.push(base.item.eq(i).outerHeight());
							base.multi.ww = base.multi.ww + base.item.eq(i).outerWidth() + Number((i !== base.opt.len - 1) ? base.opt.margin : 0);
							base.multi.w.push(base.multi.ww);
						}
						base.itemwrap.css({ width: base.multi.ww, left: 0 });
						base.itemwrap.data('left', 0) ;
					}
				}
			}, 200);
		});	
	}
	function uiSlideEvtType(base) {
		var base = base,
			types = ['as', 'ever', 'j', 'o'];

		if (base.opt.mouseDrag === true && base.opt.touchDrag === true) {
			types = ['touchstart.uiSlide mousedown.uiSlide', 'touchmove.uiSlide mousemove.uiSlide', 'touchend.uiSlide touchcancel.uiSlide mouseup.uiSlide', 'click.uiSlide'];
		}
		else if (base.opt.mouseDrag === false && base.opt.touchDrag === true) {
			types = ['touchstart.uiSlide', 'touchmove.uiSlide', 'touchend.uiSlide touchcancel.uiSlide', 'click.uiSlide'];
		}
		else if (base.opt.mouseDrag === true && base.opt.touchDrag === false) {
			types = ['mousedown.uiSlide', 'mousemove.uiSlide', 'mouseup.uiSlide', 'click.uiSlide'];
		}
		
		base.evt.start = types[0];
		base.evt.move = types[1];
		base.evt.end = types[2]; 
		base.evt.click = types[3]; 
	}
	function uiSlideEvtCurrent(base){
		var base = base;
		
		//이전 다음 번호생성
		base.evt.next = (base.opt.current + 1 >= base.opt.len) ? 0 : base.opt.current + 1;
		base.evt.prev = (base.opt.current - 1 < 0) ? base.opt.len - 1 : base.opt.current - 1;
	}
	function uiSlideEvt(base) {
		var base = base;

		base.opt.past = base.opt.current;
		
		//click event
		base.root.off(base.evt.click).on(base.evt.click, 'button', function(){
			var $this = $(this);
			
			if (!base.evt.activate) {
				uiSlideEvtCurrent(base);

				if ($this.hasClass('ui-slide-next')) {
					actfn(base.evt.next, 'next');
				} else if ($this.hasClass('ui-slide-prev')) {
					actfn(base.evt.prev, 'prev');
				} else if ($this.hasClass('ui-slide-dot')) {
					actfn($this.index(), base.opt.past < base.opt.current ? 'next' : 'prev');
				} else if ($this.hasClass('ui-slide-auto')) {
					$this.attr('state') === 'play' && base.opt.auto ? uiSlideAutoEvt(base, false) : uiSlideAutoEvt(base, true);
				}
			}
		});
		function actfn(c, d){
			base.opt.current = c;
			base.dir = d;
			uiSlideAct(base);
			base.opt.auto ? uiSlideAutoEvt(base, false) : '';
		}
		
		if (!base.multi.is) {
			base.item.off(base.evt.start).on(base.evt.start, function(event){
				if (!base.evt.activate) {
					uiSlideDragStart(base, event);
				}
			});
		} else {
			base.itemwrap.off(base.evt.start).on(base.evt.start, function(event){
				if (!base.evt.activate) {
					uiSlideDragStart(base, event);
				}
			});
		}
	}
	function uiSlideAutoEvt(base, v) {
		//자동실행 v값이 true이면 실행, false이면 정지
		var base = base;

		if (v === true) {
			base.opt.play = false;
			base.autobtn.attr('state', 'play').find('span').text('정지');
			base.timer = win.requestAFrame(autoRAF);
			//base.timer = window.requestAFrame(autoRAF);
		} else {
			base.opt.play = true;
			base.autobtn.attr('state', 'stop').find('span').text('자동 진행');
			win.cancelAFrame(base.timer);
			//window.cancelAFrame(base.timer);
		}

		function autoRAF(timestamp){
			var tstamp = !timestamp ? base.timer : timestamp.toFixed(0),
				limit = !timestamp ? base.opt.autoTime / 10 : base.opt.autoTime,
				progress;

			(!base.startA) ? base.startA = tstamp : '';
			progress = tstamp - base.startA;
			
			if (progress < limit) {
				base.gauge.bar.css('width', (progress / limit * 100).toFixed(0) + '%');
				base.timer = win.requestAFrame(autoRAF);
				/*base.timer = window.requestAFrame(autoRAF);*/
			} else {
				base.opt.current = (base.opt.current + 1 >= base.opt.len) ? 0 : base.opt.current + 1;
				base.dir = 'next';
				base.startA = null;
				base.gauge.bar.css('width', '100%');
				
				uiSlideAct(base, callbackAuto);
				
			}
		}
		function callbackAuto(){
			base.timer = win.requestAFrame(autoRAF);
			/*base.timer = window.requestAFrame(autoRAF);*/
		}
	}
	function uiSlideGetTouches(event) {
		//터치 이벤트가 undefined 가 아니라면
		if (event.touches !== undefined) {
			return { x : event.touches[0].pageX, y : event.touches[0].pageY };
		}
		if (event.touches === undefined) {
			if (event.pageX !== undefined) {
				return { x : event.pageX, y : event.pageY };
			}
			//ie
			if (event.pageX === undefined) {
				return { x : event.clientX, y : event.clientY };
			}
		}
	}
	function uiSlideEvtDrag(base) {
		var base = base;

		if (base.evt.swap === 'on') {
			$(doc).off(base.evt.move).on(base.evt.move, function(event){
				base.root.data('touch', 'move');
				uiSlideDragMove(base, event);
			});
			$(doc).off(base.evt.end).on(base.evt.end, function(event){
				base.root.data('touch', 'end');
				uiSlideDragEnd(base, event);
			});
		} else if (base.evt.swap === 'off') {
			$(doc).off(base.evt.move);
			$(doc).off(base.evt.end);
		}
	}
	function uiSlideDragStart(base, event) {
		var ev = event.originalEvent || event || win.event,
			base = base;
		
		base.evt.offsetX = uiSlideGetTouches(ev).x;
		base.evt.offsetY = uiSlideGetTouches(ev).y;
		base.evt.swap = 'on';
		base.evt.yaxis = false;

		uiSlideEvtCurrent(base);
		if (!base.multi.is) {
			switch(base.opt.eff){
			case 'slide': 
				startLeft(base.opt.w, base.opt.w * -1);
				break;
			case 'fade': 
				startLeft(0, 0);
				break;
			//The default value is 'slide'. So no default value is required.
			}
		}
		function startLeft(n,p){
			base.item.eq(base.evt.next).css('left', n);
			base.item.eq(base.evt.prev).css('left', p);
		}
		
		uiSlideEvtDrag(base);
		//$('body').on('touchstart.bodyscroll', uiSlideLockTouch);
		// /
	}
	function uiSlideDragEnd(base, event) {
		var ev = event.originalEvent || event || win.event,
			base = base;

		base.evt.swap = 'off';
		base.evt.xaxis = false;
		uiSlideEvtDrag(base);
		//$('body').off('touchstart.bodyscroll', NETIVE.uiSlide.lockTouch);
		if (!base.multi.is) {
			if (Math.abs(base.evt.movX) > base.opt.w / 5) {
				if (base.evt.movX < 0) {
					base.opt.current = base.evt.next;
					base.dir = 'next';
				} else if (base.evt.movX > 0) {
					base.opt.current = base.evt.prev;
					base.dir = 'prev';
				}
				base.evt.cancel = false;
				uiSlideAct(base);
			} else if(base.evt.movX !== 0) {
				base.evt.cancel = true;
				uiSlideAct(base);
			}
		} else {
			var n = 0;
			for (var i = 0; i < base.multi.w.length; i++) {
				if (Number(base.multi.w[i]) > Number(base.itemwrap.css('left').replace(/[^0-9]/g, ""))) {
					n = i;
					break;
				}
			}
			if (base.multi.p === 'prev') {
				n = n - 1 < 0 ? 0 : n - 1;
			}
			
			base.itemwrap.stop().animate({
				left:(base.multi.ww - base.multi.rw) < base.multi.w[n] ? (base.multi.ww - base.multi.rw) * -1 : base.multi.w[n] * -1
			},200 , function(){
				base.itemwrap.data('left', base.multi.w[n] * -1);
			});
		}
	}
	function uiSlideDragMove(base, event) {
		var ev = event.originalEvent || event || win.event,
			base = base;
		
		base.evt.movX = parseInt(base.evt.offsetX - uiSlideGetTouches(ev).x, 10) * -1;
		base.evt.movY = parseInt(base.evt.offsetY - uiSlideGetTouches(ev).y, 10) * -1;
		
		base.opt.auto ? uiSlideAutoEvt(base, false) : '';

		//single drag scope
		if (Math.abs(base.evt.movX) > base.opt.w && !base.multi.is) {
			base.evt.movX = (base.evt.movX < 0) ? base.opt.w * -1 : base.opt.w;
		} 
		if (base.multi.is) {
			base.multi.p = (base.evt.movX < 0) ? 'next' : 'prev';
		}

		//y축이 x축보다 이동이 크고 X축 이동이 5보다 작을때
		if (Math.abs(base.evt.movY) > 2 && Math.abs(base.evt.movX) < 2 && base.evt.xaxis === false) {
			base.evt.swap = 'off';
			base.evt.yaxis = true;
			uiSlideEvtDrag(base);
			//$('body').off('touchstart.bodyscroll', NETIVE.uiSlide.lockTouch);
			//$('html, body').off('touchstart.bodyscroll', NETIVE.uiSlide.lockTouch);
		}
		//X축이 y축보다 이동이 클때	
		else if(base.evt.yaxis === false){
			base.evt.xaxis = true;
			//멀티일때 좌우 끝에서 복원되는 모션 일때 중복실행 방지
			//base.multi.restore : 멀티일때 좌우 끝에서 복원되는 모션
			//if (!base.multi.restore) {
				
				//slide mode
				if (base.opt.eff === 'slide') {
					//single slide mode
					if (!base.multi.is) {
						base.item.eq(base.opt.current).css('left', base.evt.movX);
						base.item.eq(base.evt.next).css('left', base.opt.w + base.evt.movX);
						base.item.eq(base.evt.prev).css('left', (base.opt.w * -1) + base.evt.movX);
					} 
					//multi slide mode
					else if (base.multi.is) {
						// data left 값이 없다면 0으로 설정.
						//base.itemwrap.data('left') ? base.itemwrap.data('left', 0) : '';

						/*clearTimeout(base.multi.timer);
						if (base.evt.movX + Number(base.itemwrap.data('left')) > 0) {
							base.multi.timer = setTimeout(function(){
								NETIVE.uiSlide.restore(base, 0);
							},200);
							base.itemwrap.data('left', 0);
							base.evt.movX = 0;
						} 
						*/

						//multi drag scope 
						if (base.evt.movX + Number(base.itemwrap.data('left')) > 0) {
							//앞부분
							base.itemwrap.css('left', 0).data('left', 0);
						} else if(base.evt.movX + Number(base.itemwrap.data('left')) <  (base.multi.ww - base.multi.rw) * -1){
							//뒷부분
							base.itemwrap.css('left', (base.multi.ww - base.multi.rw) * -1).data('left', (base.multi.ww - base.multi.rw) * -1);
						} else {
							base.itemwrap.css('left', base.evt.movX + Number(base.itemwrap.data('left'))).data('movx', base.evt.movX + Number(base.itemwrap.data('left')));
						}
					}
				}
				
				//fade mode
				else if (base.opt.eff === 'fade') {
					base.fade.opacity = ((base.opt.w - Math.abs(base.evt.movX)) / base.opt.w).toFixed(2);
					base.item.css({ opacity: 0, zIndex: 0 }).eq(base.opt.current).css({ opacity: base.fade.opacity, zIndex: 1 });
					(base.evt.movX < 0) ?
						base.item.eq(base.evt.next).css({ opacity: 1 - base.fade.opacity, zIndex: 0 }) :
						base.item.eq(base.evt.prev).css({ opacity: 1 - base.fade.opacity, zIndex: 0 });
				}
			//}
		}
	}
	function uiSlideAct(base, callbackAuto) {
		var base = base,
			$current = base.item.eq(base.opt.current),
			$past = base.item.eq(base.opt.past),
			w = base.opt.w,
			h = base.opt.h;

		if (base.opt.past !== base.opt.current || base.evt.cancel) {
			if (base.dir === 'next' && base.evt.movX === 0) {
				$current.css('left', w);
			} else if(base.dir === 'prev' && base.evt.movX === 0) {
				$current.css('left', w * -1);
			} else {
				if (base.evt.cancel) {
					$current.css('left', base.evt.movX);
				} else {
					base.evt.movX < 0 ? $current.css('left', w + base.evt.movX) : $current.css('left', (w * -1) + base.evt.movX);
				}
			}
			
			base.item.removeClass('on').attr('aria-hidden', true);
			$current.addClass('on').attr('aria-hidden', false);
			base.start = null;
			uiSlideStep(base, callbackAuto);
		}
	}
	function uiSlideStep(base, callbackAuto) {
		//eff분기
		switch(base.opt.eff){
		case'slide':
			(!base.multi.is) ? uiSlideSteplide(base, callbackAuto) : uiSlideStepMulti(base, callbackAuto);
			break;
		case'fade':
			uiSlideStepFade(base, callbackAuto);
			break;
		}
		
		//heigth 재설정
		base.opt.w = base.item.eq(base.opt.current).outerWidth();
		base.opt.h = base.item.eq(base.opt.current).outerHeight();
		base.wrap.css('height', base.opt.h);
		base.itemwrap.css('height', base.opt.h);
		base.item.eq(base.opt.current).css('height', base.opt.h);
	}
	function uiSlideStepMulti(base, callbackAuto) {
		base.itemwrap.data('left', base.itemwrap.data('movx'));
	}
	function uiSlideStepFade(base, callbackAuto) {
		var base = base,
			step = (base.opt.speed / 16).toFixed(0),
			per = Math.ceil(100 / step),
			n = 0,
			opa = 0,
			tstamp, 
			progress;

			win.requestAFrame(stepRAF);
		base.evt.activate = true;

		function stepRAF(timestamp){
			if (!!timestamp) {
				tstamp = timestamp.toFixed(0);
				(!base.start) ? base.start = tstamp : '';
				progress = tstamp - base.start;
				opa = Number((per * n) / 100);

				base.fade.opacity !== 0 ? opa = opa + (1 - Number(base.fade.opacity)) : '';
				opa = opa.toFixed(2);
				n = n + 1;
				
				if (!base.evt.cancel) {
					base.item.eq(base.opt.past).css({ 
						left: 0,
						opacity: 1 - opa < 0 ? 0 : 1 - opa,
						zIndex: 0
					});
					base.item.eq(base.opt.current).css({
						left: 0,
						opacity: opa > 1 ? 1 : opa,
						zIndex: 1
					});
				} 
				//cancle step
				else {
					//next cancel
					if (base.evt.movX < 0) {
						base.item.eq(base.opt.current).css({ 
							left: 0,
							opacity: 1,
							zIndex: 1
						});
						base.item.eq(base.evt.next).css({ 
							left: 0,
							opacity: 0,
							zIndex: 0
						});
					} 
					//prev cancel
					else {
						base.item.eq(base.opt.current).css({ 
							left: 0,
							opacity: 1,
							zIndex: 1
						});
						base.item.eq(base.evt.prev).css({ 
							left: 0,
							opacity: 0,
							zIndex: 0
						});
					}
				}
				//ing or end
				(progress < base.opt.speed) ? win.requestAFrame(stepRAF) : uiSlideEnd(base, callbackAuto);
			}
			//animated
			else {
				base.item.eq(base.opt.current).stop().animate({
					left: 0,
					opacity: 1,
					zIndex: 1
				},300, function(){
					uiSlideEnd(base, callbackAuto)
				});

				if (!base.evt.cancel) {
					base.item.eq(base.opt.past).stop().animate({
						left: 0,
						opacity: 0,
						zIndex: 0
					}, 300);
				}
			}
		}
	}
	function uiSlideSteplide(base, callbackAuto){
		var base = base,
			tstamp, progress, m, n, 
			j = (base.dir === 'next') ? [-1, 1] : [1, -1],
			nn = 0,
			px_add = (base.opt.w / (base.opt.speed / 16)) - 16,
			px;

			win.requestAFrame(stepRAF);
		base.evt.activate = true;
		
		function stepRAF(timestamp){
			//requestAnimationFrame
			if (!!timestamp) {
				tstamp = timestamp.toFixed(0);
				(!base.start) ? base.start = tstamp : '';
				progress = tstamp - base.start;
				
				m = base.evt.movX < 0 ? base.evt.movX : base.evt.movX * -1; //X축으로 이동값 정수로 변경
				px = progress + (px_add * nn);
				n = Math.ceil(px - m); 
				nn = nn + 1;
				//next & prev step
				if (!base.evt.cancel) {
					base.item.eq(base.opt.past).css({ 
						left: Math.min(n , base.opt.w) * j[0] + 'px',
						zIndex: 1
					});
					base.item.eq(base.opt.current).css({
						left: Math.max(base.opt.w - n, 0) * j[1] + 'px',
						zIndex: 1
					});
				} 
				//cancle step
				else {
					//next cancel
					if (base.evt.movX < 0) {
						base.item.eq(base.opt.current).css({ 
							left: Math.min(base.evt.movX + px, 0),
							zIndex: 1
						});
						base.item.eq(base.evt.next).css({ 
							left: Math.min((base.opt.w + base.evt.movX) + px, base.opt.w),
							zIndex: 1
						});
					} 
					//prev cancel
					else {
						base.item.eq(base.opt.current).css({ 
							left: Math.max(base.evt.movX - px, 0),
							zIndex: 1
						});
						base.item.eq(base.evt.prev).css({ 
							left: Math.max( ((base.opt.w * -1) + base.evt.movX) - px, base.opt.w * -1 ),
							zIndex: 1
						});
					}
				}
				//ing or end
				(px < base.opt.w) ? win.requestAFrame(stepRAF) : uiSlideEnd(base, callbackAuto);
			}
			//animated
			else {
				base.item.eq(base.opt.current).stop().animate({
					left: 0,
					zIndex: 1
				},300, function(){
					uiSlideEnd(base, callbackAuto)
				});

				if (!base.evt.cancel) {
					base.item.eq(base.opt.past).stop().animate({
						left: base.opt.w * j[0] + 'px',
						zIndex: 1
					}, 300);
				}
			}
		}
	}
	function uiSlideEnd(base, callbackAuto) {
		var base = base;

		base.item.css('z-index', 0);
		base.item.eq(base.opt.current).css('z-index', 1);
		
		(!base.evt.cancel) ? base.opt.past = base.opt.current : '';
		
		//base.opt.eff !== 'slide' ? base.item.eq(base.opt.current).addClass(base.opt.eff) : '';
		base.evt.activate = false;
		base.evt.cancel = false;
		base.evt.movX = 0;
		base.evt.movY = 0;
		base.root.data('base', base);
		base.fade.opacity = 0;
		base.opt.gauge ? 
		base.gauge.bar.css('width', 0) : '';
		
		(base.opt.nav) ? uiSlideNavTxt(base) : '';
		(base.opt.dot) ? uiSlideDotChg(base) : ''; 
		!!callbackAuto ? callbackAuto() : '';
		!!base.opt.callback ?  uiSlideCallback(base) : '';
	}
	function uiSlideNavTxt(base){
		//이전다음 버튼 명 설정
		var base = base;
		
		base.nav.prev.find('span').text(base.item.eq(base.opt.current - 1 < 0 ? base.opt.len - 1 : base.opt.current - 1).find('.ui-slide-itemtit').text());
		base.nav.next.find('span').text(base.item.eq(base.opt.current + 1 >= base.opt.len ? 0 : base.opt.current + 1).find('.ui-slide-itemtit').text());
	}
	function uiSlideDotChg(base){
		//이전다음 버튼 명 설정
		var base = base;
		
		base.dotbtn.attr('aria-selected', false).eq(base.opt.current).attr('aria-selected', true)
	}
	function uiSlideCallback(base) {
		//callback
		var base = base,
			v = { 'id':base.opt.id, 'current':base.opt.current};
		base.opt.callback(v);		
	}
	function createUiSlideFnEvt(opt) {
		//함수실행
		var base = $('#' + opt.id).data('base');
			
		base.opt.current = opt.current;
		base.dir = base.opt.past < base.opt.current ? 'next' : 'prev';
		
		uiSlideAct(base);
	}
	function createUiSlideFnAuto(opt) {
		//함수실행
		var base = $('#' + opt.id).data('base');

		base.opt.auto ? uiSlideAutoEvt(base, opt.play) : '';

	}



	/* ------------------------------------------------------------------------
	* name : count number
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiCountStep({ option });
	* - $plugins.uiCountSlide({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {	
		uiCountStep: function (opt) {
			return createUiCountStep(opt);
		},
		uiCountSlide: function (opt) {
			return createUiCountSlide(opt);
		}
	});
	function createUiCountSlide(opt){
		var $base = $('#' + opt.id),
			countNum = !!opt.value === true ? opt.value : $base.text(),
			base_h = $base.outerHeight(),
			textNum = 0,
			len = countNum.toString().length,
			speed = !!opt.speed === true ? opt.speed + 's' : '1.0s',
			eff  = !!opt.eff === true ? opt.eff : 'easeOutQuart',
			transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
			i = 0,
			nn = 1,
			step, re, timer, r;
			
		if ($base.data('ing') !== true) {
			textNum = $ui.option.uiComma(countNum);
			base_h === 0 ? base_h = $base.text('0').outerHeight() : '';
			$base.data('ing',true).empty().css('height', base_h);
			len = textNum.length;
			step = len;
			re = Math.ceil(len / 9); 
			(step < 9) ? step = 9 - len : step = 1;	

			// 숫자 단위만큼 
			for (i; i < len; i++) {
				var n = Number(textNum.substr(i, 1)),
					$thisNum, $base_div;
				
				if (isNaN(n)) {
					// 숫자가 아닐때 ', . ' 
					$base.append('<div class="n' + i + '"><div class="ui-count-og" style="top:' + base_h + 'px">' + textNum.substr(i, 1) + '</div></div>');
					$base.find('.n' + i).append('<span>' + textNum.substr(i, 1) + '</span>');
				}
				else {
					// 숫자일때
					$base.append('<div class="n' + i + '"><div class="ui-count-og" style="top:' + base_h + 'px">' + n + '</div></div>');
					$base.find('.n' + i).append('<span>9<br>8<br>7<br>6<br>5<br>4<br>3<br>2<br>1<br>0<br>' + n + '</span>');
					step = step + 1;
				}
				
				$base_div = $base.children('.n' + i);
				$base_div.find('span').wrapAll('<div class="ui-count-num" style="top:' + base_h + 'px; transition:top '+ speed +' cubic-bezier(' + $ui.option.effect[eff] + ');"></div>');
				$thisNum = $base_div.find('.ui-count-num');
				$thisNum.data('height', $thisNum.height()); 
			}

			r = len;
			timer = setInterval(function() {
				count(r)
				r = r - 1; 
				(r < 0) ? clearInterval(timer) : '';
			},150);
			
			
		}
		function count(r){
			var $current_num = $base.children('.n' + r).find('.ui-count-num'),
				num_h = Number($current_num.data('height'));
			$current_num.css('top', (num_h - base_h) * -1); 
			
			if (r === 0) {
				$current_num.one(transitionEnd, function(){
					$base.text(textNum).data('ing', false);
				});
			}
		}
	}
	function createUiCountStep(opt) {
		var $base = $('#' + opt.id),
			countNum = !!opt.value === true ? opt.value : $base.text(),
			count = 0,
			timer, diff, counter;
		
		if ($base.data('ing') !== true) {
			counter = function(){
				diff = countNum - count;
				(diff > 0) ? count += Math.ceil(diff / 20, -2) : '';
				var n = $ui.option.uiComma(count);
				$base.text(n);
				if(count < countNum) {
					timer = setTimeout(function() { 
						counter(); 
					}, 1);
				} else {
					clearTimeout(timer);
				}
			}
			counter();
		}
	}



	/* ------------------------------------------------------------------------
	 * json menu v1.0 
	 * date : 2018-04-21
	 * 수정작업중
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiMenu: function (opt) {
			return createUiMenu(opt);
		},
		uiMenuSelected: function (opt) {
			return createUiMenuSelected(opt);
		}
	});
	$ui.uiMenu.map = {};
	$ui.uiMenu.json = {};
	function createUiMenu(opt){
		var dataExecel,
			menu_callback = opt.callback;

		$ui.uiAjax({ url:opt.url, page:false, callback:callback });

		function callback(v){
			dataExecel = v;
			$ui.uiMenu.json = dataExecel;

			var len = dataExecel.menu.length,
				i = 0,
				ctg_sel = opt.ctg === undefined ? '전체' : opt.ctg,
				current = opt.selected,

				use, usem, code, 
				ctg, n1, ol, d1, d2, d3, d4, 
				href, mhref, blank, 
				tit, mtit, 
				
				selected, current_split, code_split, 
				
				navig = [],
				code0, code1, code2, code3, code4,
				aria_sel_1, aria_sel_2, aria_sel_3, aria_sel_4, 
				cls_sel_1, cls_sel_2, cls_sel_3,
				first_d2 = true, first_d3 = true,
				
				current_num = [],
				n_d1 = 0, 
				_n_d1 = null,
				n_d2 = 0, 
				_n_d2 = null,
				n_d3 = 0,
				 _n_d3 = null,

				html_d1 = '<ul class="dep-1-wrap">',
				html_d2 = '',
				html_d3 = '',
				array_d2 = [],
				array_d3 = [],
				d2_n,
				d3_n;

			for (i = 0; i < len; i++) {
				use = dataExecel.menu[i].use;
				usem = dataExecel.menu[i].usem;
				code = dataExecel.menu[i].code;
				ctg = dataExecel.menu[i].ctg;
				ol = dataExecel.menu[i].ol;
				d1 = dataExecel.menu[i].d1;
				d2 = dataExecel.menu[i].d2;
				d3 = dataExecel.menu[i].d3;
				d4 = dataExecel.menu[i].d4;
				href = dataExecel.menu[i].href;
				mhref = dataExecel.menu[i].mhref;
				blank = dataExecel.menu[i].blank;
				tit = dataExecel.menu[i].tit
				mtit = dataExecel.menu[i].mtit

				selected = current === code;
				current_split = current.split('_');
				code_split = code.split('_');

				//G_00_00_00_00
				code0 = current_split[0] === code_split[0];
				code1 = current_split[1] === code_split[1];
				code2 = current_split[2] === code_split[2];
				code3 = current_split[3] === code_split[3];
				code4 = current_split[4] === code_split[4];

				aria_sel_1 = code0 && code1 ? true : false;
				aria_sel_2 = code0 && code1 && code2 ? true : false;
				aria_sel_3 = code0 && code1 && code2 && code3 ? true : false;
				aria_sel_4 = code0 && code1 && code2 && code3 && code4 ? true : false;

				cls_sel_1 = aria_sel_1 ? 'selected' : '';
				cls_sel_2 = aria_sel_2 ? 'selected' : '';
				cls_sel_3 = aria_sel_3 ? 'selected' : '';

				if (use === 'Y' && (ctg === ctg_sel || ctg_sel === '전체')) {
					//메뉴 1depth 
					if (d1 !== '') {
						n_d1 = n_d1 + 1;

						if (aria_sel_1) {
							current_num.push(n_d1 - 1);
							navig.push(tit);
						}
						html_d1 += '<li class="dep-1 '+ cls_sel_1 +'" data-n="'+ n_d1 +'">';
						html_d1 += href === '' ? 
							'<button type="button" class="dep-1-btn '+ cls_sel_1 +'"><span>' + tit + '</span></button>':
							'<a href="'+ href +'" class="dep-1-btn '+ cls_sel_1 +'"><span>' + tit + '</span></a>';
						html_d1 += '</li>';	
					} 

					//메뉴 2depth 
					if (d2 !== '') {
						_n_d1 === null ? _n_d1 = n_d1 : '';
						
						// 두번째 부터 depth1이 달라질떄 ul그룹 새로 생성
						if (_n_d1 !== n_d1) {
							n_d2 = 0;
							html_d2 += '</ul>';

							array_d2.push(html_d2);
							html_d2 = '';

							html_d2 += '<ul class="dep-2-wrap '+ cls_sel_2 +'" data-dep1="'+ n_d1 +'">';
						}
						
						n_d2 = n_d2 + 1;

						if (aria_sel_2) {
							current_num.push(n_d2 - 1);
							navig.push(tit);
						}

						// 처음 시작 한번만
						if (first_d2) {
							html_d2 += '<ul class="dep-2-wrap '+ cls_sel_2 +'" data-dep1="'+ n_d1 +'">';
							first_d2 = false;
						}

						ol ?
							html_d2 += '<li class="dep-2 '+ cls_sel_2 +'" data-n="'+ n_d2 +'" data-ol="'+ ol +'">' :
							html_d2 += '<li class="dep-2 '+ cls_sel_2 +'" data-n="'+ n_d2 +'">';

						html_d2 += '<div>';
						html_d2 += href === '' ? 
							'<button type="button" class="dep-2-btn '+ cls_sel_2 +'" aria-selected="' + aria_sel_2 + '"><span>' + tit + '</span></button>':
							'<a href="'+ href +'" class="dep-2-btn '+ cls_sel_2 +'" aria-selected="' + aria_sel_2 + '"><span>' + tit + '</span></a>';
						html_d2 += '</div>';
						html_d2 += '</li>';

						_n_d1 = n_d1;
					}

					//메뉴 3depth 
					if (d3 !== '') {
						_n_d2 === null ? _n_d2 = n_d2 : '';
						
						if (_n_d2 !== n_d2) {
							n_d3 = 0;
							html_d3 += '</ul>';

							array_d3.push(html_d3);
							html_d3 = '';

							html_d3 += '<ul class="dep-3-wrap '+ cls_sel_3 +'" data-dep1="'+ n_d1 +'" data-dep2="'+ n_d2 +'">';
						}
						n_d3 = n_d3 + 1;

						if (aria_sel_3) {
							current_num.push(n_d3 - 1);
							navig.push(tit);
						}

						if (first_d3) {
							html_d3 += '<ul class="dep-3-wrap '+ cls_sel_3 +'" data-dep1="'+ n_d1 +'"data-dep2="'+ n_d2 +'">';
							first_d3 = false;
						}

						html_d3 += '<li class="dep-3 '+ cls_sel_3 +'" data-n="'+ n_d3 +'">';
						html_d3 += href === '' ? 
							'<button type="button" code="'+ code +'" class="dep-3-btn '+ cls_sel_3 +'" aria-selected="' + aria_sel_3 + '"><span>' + tit + '</span></button>':
							'<a href="'+ href +'" code="'+ code +'" class="dep-3-btn '+ cls_sel_3 +'" aria-selected="' + aria_sel_3 + '"><span>' + tit + '</span></a>';
						html_d3 += '</li>';

						_n_d2 = n_d2;
						
					}
					if (d4 !== '') {
						aria_sel_4  === 'true' ? navig.push(tit) : '';
					}
				}
			}
			html_d1 += '</ul>';
			html_d2 += '</ul>';
			html_d3 += '</ul>';

			array_d2.push(html_d2);
			html_d2 = '';

			!!array_d3.length ? array_d3.push(html_d3) : '';
			html_d3 = '';

			menu_callback({ 
				d1: html_d1, 
				d2: array_d2, 
				d3: array_d3, 
				current: current_num, 
				navi: navig 
			});
		}
	}
	function createUiMenuSelected(opt){
		var $menu = $('#' + opt.id),
			code = opt.code.split('_'),
			d2 = Number(code[2]),
			d3 = Number(code[3]);

		$menu.find('*').removeClass('selected');
		$menu.find('.dep-2-btn').attr('aria-selected', false).attr('aria-expanded',false);
		$menu.find('.dep-3-btn').attr('aria-selected', false);
		$menu.find('.dep-3-wrap').attr('aria-hidden', true).css('display', 'none');
		
		for (var i = 0, len = $ui.uiMenu.json.menu.length; i < len; i++) {
			if ($ui.uiMenu.json.menu[i].code === opt.code) {
				opt.callback($ui.uiMenu.json.menu[i].tit);
			}
		}

		$menu
		.find('.dep-2').eq(d2 - 1).addClass('selected')
		.find('.dep-2-btn').addClass('selected').attr('aria-selected', true).attr('aria-expanded',true);
		$menu
		.find('.dep-2').eq(d2 - 1)
		.find('.dep-3-wrap').addClass('selected').attr('aria-hidden', false).css('display', 'block')
		.find('.dep-3').eq(d3 - 1).addClass('selected')
		.find('.dep-3-btn').addClass('selected').attr('aria-selected', true);
	}

	/* ------------------------------------------------------------------------
	 * json coding list v1.0 
	 * date : 2018-04-21
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiCodinglist: function (opt) {
			return createUiCodinglist(opt);
		}
	});
	function createUiCodinglist(opt) {
		var dataExecel;

		$ui.uiAjax({ 
			url: opt.url, 
			page: false, 
			callback: callback 
		});
		function callback(v) {
			dataExecel = v;

			var len = dataExecel.list.length,
				i = 0,
				state, date, enddate, pub, dev, id, idm, pop, tab, memo, overl, full, ifm,
				d1, d2, d3, d4, d5, d6, d7, d8,
				r1, r2, r3, r4,
				d1_, d2_, d3_, d4_, d5_, d6_, d7_, d8_,
				c1, c2, c3, c4, c5, c6, c7, c8,
				endsum = 0, delsum = 0, tstsum = 0, ingsum = 0, watsum = 0, chksum = 0, num = -1,
				ctg_state = [],
				ctg_pub = [],
				ctg_dev = [],
				ctg_date = [],
				ctg_enddate = [],
				ctg_mdate = [],
				ctg_menu = [],
				ctg_dev = [],
				cls2 = '',
				cls = '',
				root = '',
				depth = '',
				table = '';

			for (i = 0; i < len; i++) {
				state = dataExecel.list[i].state || '';
				date = dataExecel.list[i].date || '';
				enddate = dataExecel.list[i].enddate || '';
				pub = dataExecel.list[i].pub || '';
				dev = dataExecel.list[i].dev || '';
				id = dataExecel.list[i].id || '';
				idm = dataExecel.list[i].idm || '';
				full = dataExecel.list[i].full || '';
				pop = dataExecel.list[i].modal || '';
				ifm = dataExecel.list[i].ifm || '';
				tab = dataExecel.list[i].tab || '';
				memo = dataExecel.list[i].memo || '';
				d1 = dataExecel.list[i].d1 || '';
				d2 = dataExecel.list[i].d2 || '';
				d3 = dataExecel.list[i].d3 || '';
				d4 = dataExecel.list[i].d4 || '';
				d5 = dataExecel.list[i].d5 || '';
				d6 = dataExecel.list[i].d6 || '';
				d7 = dataExecel.list[i].d7 || '';
				d8 = dataExecel.list[i].d8 || '';
				r1 = dataExecel.list[i].r1 || '';
				r2 = dataExecel.list[i].r2 || '';
				r3 = dataExecel.list[i].r3 || '';
				r4 = dataExecel.list[i].r4 || '';
				overl = dataExecel.list[i].overlap || '';
				root = dataExecel.list[i].root || '';

				(d1 !== '') ? d1_ = dataExecel.list[i - 1 < 0 ? 0 : i].d1 : d1 = d1_;

				(dataExecel.list[i].d1 === '') ?
					(d2 !== '') ? d2_ = dataExecel.list[i - 1 < 0 ? 0 : i].d2 : d2 = d2_ :
					(!!dataExecel.list[i - 1 < 0 ? 0 : i].d2) ? d2_ = dataExecel.list[i - 1 < 0 ? 0 : i].d2 : d2_ = '';

				(dataExecel.list[i].d1 === '' && dataExecel.list[i].d2 === '') ?
					(d3 !== '') ? d3_ = dataExecel.list[i - 1 < 0 ? 0 : i].d3 : d3 = d3_ :
					(!!dataExecel.list[i - 1 < 0 ? 0 : i].d3) ? d3_ = dataExecel.list[i - 1 < 0 ? 0 : i].d3 : d3_ = '';

				(dataExecel.list[i].d1 === '' && dataExecel.list[i].d2 === '' && dataExecel.list[i].d3 === '') ?
					(d4 !== '') ? d4_ = dataExecel.list[i - 1 < 0 ? 0 : i].d4 : d4 = d4_ :
					(!!dataExecel.list[i - 1 < 0 ? 0 : i].d4) ? d4_ = dataExecel.list[i - 1 < 0 ? 0 : i].d4 : d4_ = '';

				(dataExecel.list[i].d1 === '' && dataExecel.list[i].d2 === '' && dataExecel.list[i].d3 === '' && dataExecel.list[i].d4 === '') ?
					(d5 !== '') ? d5_ = dataExecel.list[i - 1 < 0 ? 0 : i].d5 : d5 = d5_ :
					(!!dataExecel.list[i - 1 < 0 ? 0 : i].d5) ? d5_ = dataExecel.list[i - 1 < 0 ? 0 : i].d5 : d5_ = '';

				(dataExecel.list[i].d1 === '' && dataExecel.list[i].d2 === '' && dataExecel.list[i].d3 === '' && dataExecel.list[i].d4 === '' && dataExecel.list[i].d5 === '') ?
					(d6 !== '') ? d6_ = dataExecel.list[i - 1 < 0 ? 0 : i].d6 : d6 = d6_ :
					(!!dataExecel.list[i - 1 < 0 ? 0 : i].d6) ? d6_ = dataExecel.list[i - 1 < 0 ? 0 : i].d6 : d6_ = '';

				(dataExecel.list[i].d1 === '' && dataExecel.list[i].d2 === '' && dataExecel.list[i].d3 === '' && dataExecel.list[i].d4 === '' && dataExecel.list[i].d5 === '' && dataExecel.list[i].d6 === '') ?
					(d7 !== '') ? d7_ = dataExecel.list[i - 1 < 0 ? 0 : i].d7 : d7 = d7_ :
					(!!dataExecel.list[i - 1 < 0 ? 0 : i].d7) ? d7_ = dataExecel.list[i - 1 < 0 ? 0 : i].d7 : d7_ = '';

				!!dataExecel.list[i].d1 ? d1 = dataExecel.list[i].d1 : '';
				!!dataExecel.list[i].d2 ? d2 = dataExecel.list[i].d2 : '';
				!!dataExecel.list[i].d3 ? d3 = dataExecel.list[i].d3 : '';
				!!dataExecel.list[i].d4 ? d4 = dataExecel.list[i].d4 : '';
				!!dataExecel.list[i].d5 ? d5 = dataExecel.list[i].d5 : '';
				!!dataExecel.list[i].d6 ? d6 = dataExecel.list[i].d6 : '';
				!!dataExecel.list[i].d7 ? d7 = dataExecel.list[i].d7 : '';
				!!dataExecel.list[i].d8 ? d8 = dataExecel.list[i].d8 : '';

				endsum = (state === "완료") ? endsum + 1 : endsum;
				tstsum = (state === "검수") ? tstsum + 1 : tstsum;
				ingsum = (state === "진행") ? ingsum + 1 : ingsum;
				delsum = (state === "제외") ? delsum + 1 : delsum;
				watsum = (state === "대기") ? watsum + 1 : watsum;
				chksum = (state === "체크") ? chksum + 1 : chksum;

				var x = (i === 0) ? 0 : i - 1;

				c1 = (dataExecel.list[i].d1 !== dataExecel.list[x].d1) ? ' c1' : '';
				c2 = (dataExecel.list[i].d2 !== dataExecel.list[x].d2) ? ' c2' : '';
				c3 = (dataExecel.list[i].d3 !== dataExecel.list[x].d3) ? ' c3' : '';
				c4 = (dataExecel.list[i].d4 !== dataExecel.list[x].d4) ? ' c4' : '';
				c5 = (dataExecel.list[i].d5 !== dataExecel.list[x].d5) ? ' c5' : '';
				c6 = (dataExecel.list[i].d6 !== dataExecel.list[x].d6) ? ' c6' : '';
				c7 = (dataExecel.list[i].d7 !== dataExecel.list[x].d7) ? ' c7' : '';
				c8 = (dataExecel.list[i].d8 !== dataExecel.list[x].d8) ? ' c8' : '';

				cls2 = 
					state === '체크' ? 'chk' : 
					state === '진행' ? 'ing' : 
					state === '완료' ? 'end' : 
					state === '검수' ? 'tst' : 
					state === '제외' ? 'del' : 
					state === '약관' ? 'trm' : '';

				cls = cls2 + c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8;

				ctg_state.push(dataExecel.list[i].state);
				ctg_pub.push(dataExecel.list[i].pub);
				ctg_dev.push(dataExecel.list[i].dev);
				state !== '제외' ? ctg_date.push(dataExecel.list[i].date) : '';
				ctg_enddate.push(dataExecel.list[i].enddate);
				ctg_menu.push(dataExecel.list[i].d2);

				if (state !== '제외' && i === 0) {
					table += '<table>';
					table += '<caption>코딩리스트</caption>';
					table += '<colgroup>';
					table += '<col class="col-1">';
					table += '<col class="col-2">';
					table += '<col class="col-3">';
					table += '<col class="col-4">';
					//table += '<col class="col-5">';
					table += '<col class="col-6">';
					table += '<col class="col-7">';
					table += '<col class="col-8">';
					table += '</colgroup>';
					table += '<colgroup>';
					(dataExecel.list[i].d1 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d2 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d3 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d4 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d5 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d6 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d7 !== undefined) ? table += '<col class="col-9">' : '';
					(dataExecel.list[i].d8 !== undefined) ? table += '<col class="col-9">' : '';
					table += '</colgroup>';
					table += '<col class="col-10">';
					table += '<thead>';
					table += '<th scope="col">' + state + '</th>';
					table += '<th scope="col">' + date + '</th>';
					table += '<th scope="col">' + enddate + '</th>';
					table += '<th scope="col">' + pub + '</th>';
					//table += '<th scope="col">' + dev + '</th>';
					table += '<th scope="col">' + pop + '</th>';
					table += '<th scope="col">' + tab + '</th>';
					table += '<th scope="col">' + id + '</th>';
					(dataExecel.list[i].d1 !== undefined) ? table += '<th scope="col">' + d1 + '</th>' : '';
					(dataExecel.list[i].d2 !== undefined) ? table += '<th scope="col">' + d2 + '</th>' : '';
					(dataExecel.list[i].d3 !== undefined) ? table += '<th scope="col">' + d3 + '</th>' : '';
					(dataExecel.list[i].d4 !== undefined) ? table += '<th scope="col">' + d4 + '</th>' : '';
					(dataExecel.list[i].d5 !== undefined) ? table += '<th scope="col">' + d5 + '</th>' : '';
					(dataExecel.list[i].d6 !== undefined) ? table += '<th scope="col">' + d6 + '</th>' : '';
					(dataExecel.list[i].d7 !== undefined) ? table += '<th scope="col">' + d7 + '</th>' : '';
					(dataExecel.list[i].d8 !== undefined) ? table += '<th scope="col">' + d8 + '</th>' : '';
					table += '<th scope="col">' + memo + '</th>';
					table += '</thead>';
					table += '</tbody>';
				}
				else if (state !== '제외') {
					num = num + 1;
					$ui.browser.mobile ?
						table += '<tr class="' + cls + '" >' :
						table += '<tr class="' + cls + '">';
					table += '<td class="state"><span>' + state + '</span></td>';
					table += '<td class="date"><span>' + date + '</span></td>';
					table += '<td class="enddate"><span>' + enddate + '</span></td>';
					table += '<td class="name pub"><span>' + pub + '</span></td>';
					//table += '<td class="name dev"><span>' + dev + '</span></td>';

					var popIs = !!pop ? 'P' : '',
						tabIs = tab === 'S' ? 'S' : tab === '' ? '' : 'T',
						full = !!full ? true : false;

					table += '<td class="txt-c"><span>' + popIs + '</span></td>';
					table += '<td class="txt-c"><span>' + tabIs + '</span></td>';
					console.log(pop)
					//if (!pop) {
						table += id !== '' ? overl !== '' ? tabIs === 'T' ?
							'<td class="id ico_pg"><span><a href="' + root + '/' + overl + '.html?tab=' + (tab - 1) + '" target="coding">' + overl + '</a></span><span class="overl">' + id + '</span></td>' :
							'<td class="id ico_pg"><span><a href="' + root + '/' + overl + '.html" target="coding">' + overl + '</a></span><span class="overl">' + id + '</span></td>' :
							'<td class="id ico_pg"><span><a href="' + root + '/' + id + '.html" target="coding">' + id + '</a></span></td>' :
							'<td class="id "><span></span></td>';
					/*} else {
						table += id !== '' ? overl !== '' ? ifm === '' ? pop === '1' ? tabIs === 'T' ?
							'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ id:\'modal_' + overl + '\', full:' + full + ', link:\'' + root + '/' + overl + '.html?tab=' + (tab - 1) + '\'});">' + overl + '</button><span class="overl">' + id + '</span></td>' :
							'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ id:\'modal_' + overl + '\', full:' + full + ', link:\'' + root + '/' + overl + '.html\'});">' + overl + '</button><span class="overl">' + id + '</span></td>' :
							'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ id:\'__modalTerms\', link:\'/modal/modalTerms.html\', remove:true, terms_tit:\'약관제목\', terms_url:\'/terms/' + overl + '.html\' });">' + overl + '</button><span class="overl">' + id + '</span></td>' :
							'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ iframe:true, isrc:\'/modal/' + overl + '_iframe.html\', iname:\'name_' + overl + '\', id:\'modal_' + overl + '\', full:' + full + ' });">' + overl + '</button><span class="overl">' + id + '</span></td>' :
							(ifm === '') ?
								(pop === '1') ?
									tabIs === 'T' ?
										'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ id:\'modal_' + id + '\', full:' + full + ', link:\'' + root + '/' + id + '.html?tab=' + (tab - 1) + '\'});">' + id + '</button></td>' :
										'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ id:\'modal_' + id + '\', full:' + full + ', link:\'' + root + '/' + id + '.html\' });">' + id + '</button></td>' :
									'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ id:\'__modalTerms\', link:\'/modal/modalTerms.html\', remove:true, terms_tit:\'약관제목\', terms_url:\'/terms/' + id + '.html\' });">' + id + '</button></td>' :
								'<td class="id ico_pg"><span><button type="button" onclick="$plugins.uiModal({ iframe:true, isrc:\'/modal/' + id + '_iframe.html\', iname:\'name_' + id + '\', id:\'modal_' + id + '\', full:' + full + ' });">' + id + '</button></td>' :
							'<td class="id "><span></span></td>';
					}
					*/
					(dataExecel.list[i].d1 !== '') ? table += '<td class="d d1"><span>' + d1 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d2 !== '') ? table += '<td class="d d2"><span>' + d2 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d3 !== '') ? table += '<td class="d d3"><span>' + d3 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d4 !== '') ? table += '<td class="d d4"><span>' + d4 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d5 !== '') ? table += '<td class="d d5"><span>' + d5 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d6 !== '') ? table += '<td class="d d6"><span>' + d6 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d7 !== '') ? table += '<td class="d d7"><span>' + d7 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].d8 !== '') ? table += '<td class="d d8"><span>' + d8 + '</span></td>' : table += '<td class="d"></td>';
					(dataExecel.list[i].memo === '') ? table += '<td class="memo none"><span>' + memo + '</span></td>' : table += '<td class="memo"><span>' + memo + '</span></td>';
					table += '</tr>';
					(i === len - 1) ? table += '</tbody>' : '';
					(i === len - 1) ? table += '</table>' : '';
				}
				root = '';
			}
			$('#' + opt.id).html(table);
			table = '';

			var info = ''
			info += '<ul class="ui-codinglist-info">';
			info += '<li>진행율(완료+검수+체크) : <span class="n_all">0</span> / <span class="total">0</span> (<span class="per0">0</span>%)</li>';
			info += '<li>완료 : <span class="n_end">0</span> (<span class="per1">0</span>%)</li>';
			info += '<li>검수 : <span class="n_tst">0</span> (<span class="per2">0</span>%)</li>';
			info += '<li>체크 : <span class="n_chk">0</span> (<span class="per5">0</span>%)</li>';
			info += '<li>진행 : <span class="n_ing">0</span> (<span class="per3">0</span>%)</li>';
			info += '<li>대기 : <span class="n_wat">0</span> (<span class="per4">0</span>%)</li>';
			info += '</ul>';
			
			

			var sel = '';
			sel += '<div class="ui-codinglist-sel mgb-xxxs">';
			sel += '<button type="button" class="btn-base"><span>전체</span></button>';
			sel += '<select id="uiCLstate" data-ctg="state">';
			sel += '<option value="0">상태선택</option>';
			sel += '</select>';
			sel += '<select id="uiCLpub" data-ctg="pub">';
			sel += '<option value="0">퍼블선택</option>';
			sel += '</select>';
			sel += '<select id="uiCLdev" data-ctg="dev">';
			sel += '<option value="0">개발선택</option>';
			sel += '</select>';
			sel += '<select id="uiCLDate" data-ctg="date">';
			sel += '<option value="0">일정선택</option>';
			sel += '</select>';
			sel += '<select id="uiCLdepth" data-ctg="d2">';
			sel += '<option value="0">메뉴선택</option>';
			sel += '</select>';
			sel += '</div>';
			sel += '<div class="box-srch mgb-xxxs">';
			sel += '<div class="srch-area">';
			sel += '<input type="search" id="uiCodinglistSrchCode" class="inp-srch ui-inpcancel" value="" placeholder="검색어를 입력해주세요.">';
			sel += '</div>';
			sel += '</div>';
			
			$('#' + opt.id).prepend(sel);
			$('#' + opt.id).prepend(info);

			if (!$('.ui-codinglist-info .total').data('data')) {
				$('.ui-codinglist-info .total').data('data', true).text(len - delsum - 1);
				$('.ui-codinglist-info .n_all').text(endsum + tstsum + chksum);
				$('.ui-codinglist-info .per0').text(((endsum + tstsum + chksum) / (len - delsum - 1) * 100).toFixed(0));
				$('.ui-codinglist-info .n_end').text(endsum);
				$('.ui-codinglist-info .per1').text((endsum / (len - delsum - 1) * 100).toFixed(0));
				$('.ui-codinglist-info .n_tst').text(tstsum);
				$('.ui-codinglist-info .per2').text((tstsum / (len - delsum - 1) * 100).toFixed(0));
				$('.ui-codinglist-info .n_ing').text(ingsum);
				$('.ui-codinglist-info .per3').text((ingsum / (len - delsum - 1) * 100).toFixed(0));
				$('.ui-codinglist-info .n_wat').text(watsum);
				$('.ui-codinglist-info .per4').text((watsum / (len - delsum - 1) * 100).toFixed(0));
				$('.ui-codinglist-info .n_chk').text(chksum);
				$('.ui-codinglist-info .per5').text((chksum / (len - delsum - 1) * 100).toFixed(0));
			}

			selectoption('uiCLstate', ctg_state);
			selectoption('uiCLpub', ctg_pub);
			selectoption('uiCLDate', ctg_date, true);
			selectoption('uiCLdepth', ctg_menu);
			selectoption('uiCLdev', ctg_dev);
			selectAct();

			function selectoption(id, optarray, v) {
				var $sel = $('#' + id);
				var nn = 1,
					nnn = 1;
				if (!$sel.data('data')) {
					var optionArray = [],
						optionSum = [],
						j = 0,
						optionHtml = '';
					v ? optarray.push('일정') : '';
					optarray.splice(0, 1);

					// 숫자 .sort(function(a,b){return a-b}) , 문자 sort()
					optionArray = optarray.slice().sort().reduce(function (a, b) {
						if (a.slice(-1)[0] !== b && b !== '') {
							a.push(b);
							v ? optionSum.push(nn) : '';
							nn = 1;
						} else {
							nn = nn + 1;
						}
						return a;
					}, []);

					var alen = optionArray.length;
					for (j; j < alen; j++) {
						if (v) {
							if (j < alen - 1) {
								optionHtml += '<option value="' + optionArray[j] + '">' + optionArray[j] + ' [' + optionSum[j + 1] + ']</option>';
							}
						} else {
							optionHtml += '<option value="' + optionArray[j] + '">' + optionArray[j] + '</option>';
						}
					}
					$sel.data('data', true).append(optionHtml);
				}
			}

			function selectAct() {
				$('.ui-codinglist-sel select').on('change', function () {
					var $this = $(this),
						v = $this.val(),
						c = $this.data('ctg'),
						$sel = $('#' + opt.id + ' .' + c);

					if (v === '0') {
						$sel.closest('tr').removeClass('hidden');
					} else {
						$this.siblings().find('option:eq(0)').prop('selected', true);
						$sel.each(function (i) {
							v === 'all' ? $sel.closest('tr').removeClass('hidden') :
								v !== $sel.find('span').eq(i).text() ?
									$(this).closest('tr').addClass('hidden') : $(this).closest('tr').removeClass('hidden');
						});
					}
				});
			}

			$('.ui-codinglist-sel button').on('click', function (e) {
				$('#' + opt.id + ' tr').removeClass('hidden');
				$('.ui-codinglist-sel select').find('option:eq(0)').prop('selected', true);
			});

			$('.ui-codinglist table a, .ui-codinglist table button').off('click.uicoding').on('click.uicoding', function () {
				$(this).closest('tr').addClass('selected').siblings().removeClass('selected');
			});

			if ($('#uiCodinglistSrchCode').val() !== '') {
				var temp = $('.ui-codinglist tbody tr td *:contains('+ $('#uiCodinglistSrchCode').val() +')');

				$('.ui-codinglist tbody tr').hide();
				$(temp).closest('tr').show();
			}
			$.expr[":"].contains = $.expr.createPseudo(function(arg){
				return function(elem) {
					return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
				}
			});
			$('#uiCodinglistSrchCode').on('keyup', function(){
				var k = $(this).val(),
					temp = $('.ui-codinglist tbody tr td *:contains('+ k +')');
				$('.ui-codinglist tbody tr').hide();
				$(temp).closest('tr').show();
			});

			$ui.uiInputClear();

		}
	}


	/* ------------------------------------------------------------------------
	* name : screen capture
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiCapture({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiCapture: function (opt) {
			return createUiCapture(opt);
		}
	});
	function createUiCapture(opt){
		if (opt === undefined) {
			return false;
		}

		var canvas = "";

		html2canvas(document.getElementById(opt.id), { 
			onrendered : function(canvas) { 
				document.body.appendChild(canvas); 
				canvas.id ="uiCanvas"
				canvas.toBlob(function(blob){ saveAs(blob,"do.png"); }, "image/png");
				$('#uiCanvas').remove();
			}
		});
	}

	/* ------------------------------------------------------------------------
	 * input form
	 * input value clear button v1.0 
	 * $plugins.uiInputClear
	 * date : 2018-05-18
	 * input value 값 입력 시 clear버튼 생성
	 * 
	 * input placeholder v1.0 
	 * date : 2018-04-21
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiInputClear: function () {
			return createUiInputClear();
		},
		uiPlaceholder: function () {
			return createUiPlaceholder();
		}
	});
	function createUiInputClear(){
		var $inp = $('.ui-inpcancel');

		$inp.each(function(i){
			var $this = $(this);

			$this.val() === '' ?
				$this.next('.ui-btn-cancel').remove():
				$this.next('.ui-btn-cancel').length === 0 ?
				$this.after('<button type="button" class="ui-btn-cancel" data-id="'+ $this.attr('id') +'"><span>입력내용 지우기</span></button>') : '';

			//이벤트 부분 each함수 밖으로 거내보자.
			$inp.eq(i).off('keyup.inpcancel').on('keyup.inpcancel', function(){
				var _$this = $(this);

				if (_$this.val() === '') {
					_$this.next('.ui-btn-cancel').remove();
				} else {
					!!$('.ui-btn-cancel[data-id="'+ _$this.attr('id') +'"]').length ? '' :
					_$this.after('<button type="button" class="ui-btn-cancel" data-id="'+ _$this.attr('id') +'"><span>입력내용 지우기</span></button>');
				}
			});
		});

		//event
		$(doc).off('click.inpcancel').on('click.inpcancel', '.ui-btn-cancel', function(){
			$('#' + $(this).data('id')).val('').focus();
			$(this).remove();
		});
	}
	function createUiPlaceholder(){
		var $ph = $('[placeholder]'),
			phname = '';

		$('.ui-placeholder').remove();
		$ph.each(function(){
			phname = $(this).attr('placeholder');
			$(this).before('<span class="hide ui-placeholder">' + phname + '</span>')
		})
	}

	/* ------------------------------------------------------------------------
	* name : file upload
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiFileUpload({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiFileUpload: function (opt) {
			return createUiFileUpload(opt);
		}
	});
	function createUiFileUpload(opt){
		$(doc).on('change', '.ui-file-inp', function(){
				upload(this);
			})
			.on('click', '.ui-file-del', function(){
				fileDel(this);
			});
			
		//fn
		function upload(t){
			var $this = $(t),
				v = $this[0].files,
				id = $this.attr('id'),
				len = v.length,
				$list = $('.ui-file-list[aria-labelledby="'+ id +'"]');

			$list.find('.ui-file-item').remove();
			$list.find('.ui-file-del').remove();
			for (var i = 0; i < len; i++) {
				$list.append('<div class="ui-file-item n'+ i +'">'+ v[i].name +'</div>');
				
			}
			$list.append('<button type="button" class="ui-file-del btn-del">첨부파일 삭제</button>');
		}
		function fileDel(t){
			var $this = $(t),
				$list = $this.closest('.ui-file-list'),
				id = $list.attr('aria-labelledby'),
				$id = $('#' + id);

			$ui.browser.ie ?
				$id.replaceWith( $id.clone(true) ) : $id.val(''); 
			$list.find('.ui-file-item').remove();
			$this.remove();
		}
		
	}


	

	/* ------------------------------------------------------------------------
	 * textarea auto height v1.0 
	 * date : 2018-04-21
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiTextareaAutoHeight: function () {
			return createUiTextareaAutoHeight();
		}
	});
	function createUiTextareaAutoHeight() {
		$('.ui-autoheight').each(function(){
			var n = 1;

			$(this).off('keyup').on('keyup', function(){
				if (!!$plugins.uiHasScrollBar({ selector:$(this) })) {
					n = n + 1;
					$(this).addClass('n' + n);
				}
			});
		});
	}



	/* ------------------------------------------------------------------------
	* name : loading
	* Ver. : v1.0.0
	* date : 2018-12-21
	* EXEC statement
	* - $plugins.uiLoading({ option });
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiLoading: function (opt) {
			return createUiLoading(opt);
		}
	});
	$ui.uiLoading.timer = {};
	function createUiLoading(opt) {
		var loading = '',
			$selector = opt.id === undefined ? $('body') : opt.id === '' ? $('body') : typeof opt.id === 'string' ? $('#' + opt.id) : opt.id,
			txt = opt.txt === undefined ? 'Loading …' : opt.txt;

		opt.id === undefined ?
			loading += '<div class="ui-loading">':
			loading += '<div class="ui-loading" style="position:absolute">';
		loading += '<div class="ui-loading-wrap">';
		loading += '<strong class="ui-loading-txt"><span>'+ txt +'</span></strong>';
		loading += '</div>';
		loading += '<button type="button" class="btn-base" style="position:fixed; bottom:10%; right:10%; z-index:100;" onclick="$plugins.uiLoading({ visible:false });"><span>$plugins.uiLoading({ visible:false })</span></button>';
		loading += '</div>';

		clearTimeout($ui.uiLoading.timer);
		opt.visible === true && !$('body').data('loading') ? showLoading() : opt.visible === false ? hideLoading() : '';
		
		function showLoading(){
			clearTimeout($ui.uiLoading.timer);
			$('body').data('loading', true);
			$selector.prepend(loading);
			$selector.find('.ui-loading').stop().animate({ 'opacity':1 });
		}
		function hideLoading(){
			clearTimeout($ui.uiLoading.timer);
			$ui.uiLoading.timer = setTimeout(function(){
				$selector.find('.ui-loading').stop().animate({ 'opacity':0 }, function(){
					$('.ui-loading').remove();
					$('body').data('loading', false);
				});
			},100);
		}
	}	



	/* ------------------------------------------------------------------------
	 * time check
	 * date : 2018-07-28
	 * 출력부분 시간,분,초 세분화 전달필요.
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiTimer: function (opt) {
			return createUiTimer(opt)
		}
	});
	$ui.uiTimer.timerID = '';
	function createUiTimer(opt){
		var timer = '',
			$timer = $('#' + opt.id),
			time = opt.time,
			callback = opt.callback;

		clearInterval($ui.uiTimer.timeID);
		$ui.uiTimer.timeID = setInterval(decrementTime, 1000);

		function decrementTime(){
			$timer.text(toMinSec(time));

			if (time > 0) {
				time--;
			} else {
				clearInterval(win[global.uiTimer.TimerID]);
				callback();
			}
		}
		function toMinSec(t) {
			var hour, min, sec;

			hour = Math.floor(t / 3600);
			min = Math.floor((t - (hour * 3600)) / 60);
			sec = t - (hour * 3600) - (min * 60);
			min < 10 ? min = '0' + min : '';
			sec < 10 ? sec = '0' + sec : '';

			return(min + ':' + sec);
		}
	}

	/* ------------------------------------------------------------------------
	 * error message v1.0 
	 * $plugins.uiError
	 * date : 2018-05-18
	 * 에러 시 메시지 생성 및 스타일 변경
	 * option
	 * - opt.message : 'message text' / [string]
	 * - opt.error : true or false / [string]
	 * - opt.selector : 'id' or $(...) / [strong] or [object]
	 * - opt.wrapper : '...' / [strong]
	------------------------------------------------------------------------ */
	$ui = $ui.uiNameSpace(namespace, {
		uiError: function (opt) {
			return createUiError(opt);
		}
	});
	function createUiError(opt){
		var msg = opt.message, 
			err = opt.error, 
			$this = typeof opt.selector === 'string' ? $('#' + opt.selector) : opt.selector,
			$wrap = opt.wrapper === undefined ? $this.parent() : $this.closest(opt.wrapper),
			id = $this.attr('id'),
			err_html = '<em class="ui-error-msg" aria-hidden="true" id="'+ id +'-error">'+ msg +'</em>';

		//generate error message
		$this.attr('aria-labelledby', id + '-error');

		!$('#'+ id +'-error').length ? $wrap.append(err_html) : $wrap.find('.ui-error-msg').text(msg) ;
		
		//error 여부에 따른 설정
		if (err) {
			$('#'+ id +'-error').attr('aria-hidden', false);
			$wrap.addClass('ui-error-true');
			$this.addClass('ui-error-item');
			$this.closest('.ui-select').addClass('ui-error-select');
		} else {
			$('#'+ id +'-error').attr('aria-hidden', true).remove();
			$wrap.find('.ui-error-item').length === 1 ? $wrap.removeClass('ui-error-true') : '';
			$this.removeClass('ui-error-item');
			$this.closest('.ui-select').removeClass('ui-error-select');
		}
	}


	$ui = $ui.uiNameSpace(namespace, {
		uiBgScrollMove: function (opt) {
			return createUiBgScrollMove(opt);
		}
	});
	$ui.uiBgScrollMove.option = {
		zoomeff : false,
		zoomrate : 5
	}
	$ui.uiBgScrollMove.timer = {};
	function createUiBgScrollMove(opt){
		var opt = $.extend(true, {}, $ui.uiBgScrollMove.option, opt),
			$win = $(window),
			$vs = $('#' + opt.id),
			vs_t = $vs.offset().top,
			win_h = $win.outerHeight(),
			sct = $vs.scrollTop();

		bgposition($vs, sct);
		
		$(window).scroll(function(){
			var $this = $(this);

			bgposition($vs, $(this).scrollTop());
		});

		function bgposition(t, s){
			if (s + win_h > vs_t ) {
				var n = (vs_t  - s) / (win_h / 100);
				Math.abs(n) > 100 ? n = 100 : '';
				t.css('background-position-y', n.toFixed(4) + '%');
			}
		}
	}

	

	$ui = $ui.uiNameSpace(namespace, {
		uiScrolling: function (opt) {
			return createUiScrolling(opt);
		},
		uiScrollingAct: function (opt) {
			return createUiScrollingAct(opt);
		},
		uiScrollingGoto: function (opt) {
			return createUiScrollingGoto(opt);
		},
		uiScrollingCancel: function () {
			return createUiScrollingCancel();
		},
		uiScrollingSwitch: function () {
			return createUiScrollingSwitch();
		}
	});
	
	
	$ui.uiScrolling.option = {
		act:true,
		scrollpow: $(win).outerHeight() / 2,
		scrlltime: 400,
		dot_height: 50,
		current: 0,
		callback: false,
		dots: true
	};
	$ui.uiScrolling.ing = false;
	function createUiScrolling(opt) {
		var opt = $.extend(true, {}, $ui.uiScrolling.option, opt),
            $page = $('.ui-pagescroll'),
			$item = $page.find('.ui-pagescroll-item'),
            len = $item.length,
			act = opt.act,
			dots = opt.dots,
			_scrollPow = opt.scrollpow,
			w_h = $(win).outerHeight(),
			dot_h = opt.dot_height,
			current = opt.current,
			callback = opt.callback,
			mTime = opt.scrlltime,
			ing = false,
			nav_html = '';

		//$item.css('min-height', w_h);	
		for (var i = 0; i < len; i++) {
			if (dots) {
				nav_html += '<button type="button" class="ui-pagescroll-dot" aria-label="'+ $item.eq(i).data('title') +'"></button>';
			}

			$item.eq(i).data('minh') === true ? 
			$item.eq(i).css('min-height', w_h) : '';	
		}

		$('body').data('page', current).data('allpage', len);

		if (dots) {
			$('.ui-pagescroll-dot').remove();
			$('.ui-pagescroll-nav').append(nav_html);
			$('.ui-pagescroll-dot').eq(0).css('margin-top', (w_h - (dot_h * len)) / 2);
			$('.ui-pagescroll-dot').eq(current).addClass('selected');

			$('.ui-pagescroll-dot').on('click.dot', function(){
				$('body').data('page', $(this).index());
				$ui.uiScrollingGoto({
					goto: $(this).index() 
				});
			});
		}
		$('.type-mainvisual .item').css('height', w_h);
		
		if (act) {
			$ui.uiScrollingAct({
				goto: Math.round($(win).scrollTop() / w_h ),
				move_time: mTime,
				scrollPow: _scrollPow
			});
		}

		// !!$('body.sub').length && $ui.browser.mobile ? 
		// // $('.ui-pagescroll-item.n2').css('min-height', $(win).outerHeight() - ($('#baseFooter').outerHeight() + 75) ) : '';

		$(doc)
		.off('mousewheel.uiscrolling').on('mousewheel.uiscrolling', _onMouseWheel)
		.off('keydown.uiscrolling').on('keydown.uiscrolling', function(e){
			if (e.keyCode === 34) {
				$('body').data('page', $('body').data('page') + 1);
				$('body').data('page') >= $('body').data('allpage') ? $('body').data('page', $('body').data('allpage')) : '';

				$ui.uiScrollingGoto({
					goto: $('body').data('page')
				});
			} 
			if (e.keyCode === 33) {
				$('body').data('page', $('body').data('page') - 1);
				$('body').data('page') < 0 ? $('body').data('page', 0) : '';

				$ui.uiScrollingGoto({
					goto: $('body').data('page')
				});
			} 
		});
		
		var timer_scroll2,
			tcs = 0;
		
		// $('.ui-pagescroll-item.n1').on('touchstart', function(){
		// 	tcs = $(win).scrollTop();
		// });
		// $('.ui-pagescroll-item.n1').on('touchcancel touchend', function(e){
		// 	if ($ui.browser.mobile) {
		// 		if ($(win).scrollTop() < $(win).outerHeight() && tcs < $(win).scrollTop()) {
		// 			clearTimeout(timer_scroll2);
		// 			timer_scroll2 = setTimeout(function(){
		// 				if ($(win).scrollTop() <  $(win).outerHeight() + ($(win).outerHeight() / 2) ) {
		// 					$ui.uiScroll({ value:$(win).outerHeight(), speed:300  })
		// 				}
		// 			},0);
					
		// 		} else {
		// 			clearTimeout(timer_scroll2);
		// 		}
		// 	}
		// });
		// $(doc).on('click', function(){
		// 	clearTimeout(timer_scroll2);
		// });

		var timer_scroll;
		
		$(win).scroll(function(){
			clearTimeout(timer_scroll);
			timer_scroll = setTimeout(function(){
				$('body').data('page',Math.round($(win).scrollTop() / $(win).outerHeight()) );	
				$('.ui-pagescroll-nav button').removeClass('selected')
				.eq(Math.round($(win).scrollTop() / $(win).outerHeight()))
				.addClass('selected');

				!!callback ? callback($(win).scrollTop() ) : '';
			},30);
		});
		$('body').data('scrolling', 'yes');
		
		function _onMouseWheel (e){
			e.preventDefault();
			// len * w_h > $(window).scrollTop() ? 
			// _scrollPow = w_h : 
			_scrollPow = opt.scrollpow;
			!$ui.uiScrolling.ing ? _smoothScroll(e) : '';
		}
		function _smoothScroll (e) {
			var move_time = mTime,
				delta = -Math.max(-1, Math.min(1, e.originalEvent.wheelDelta));

			$ui.uiScrollingAct({
				delta: delta,
				move_time: move_time,
				scrollPow:_scrollPow,
				len : len
			});
		}
	}
	function createUiScrollingGoto(opt) {
		var n = opt.goto;

		$('.ui-pagescroll-dot').removeClass('selected').eq(n).addClass('selected');
		$('.ui-pagescroll-item').removeClass('selected').eq(n).addClass('selected');

		$("html, body").stop().animate({
			scrollTop: $('.ui-pagescroll-item').eq(n).position().top
		}, 400, 'easeOutQuad', function(){
			setTimeout(function(){
				$ui.uiScrolling.ing = false;
			},100);
		});
		$('body').attr('scrollpage', n);
	}
	function createUiScrollingAct(opt) {
		var _delta = opt.delta,
			_goto = opt.goto,
			_scrollPow = opt.scrollPow,
			_move_time = opt.move_time,
			_len = opt.len,
			w_h = $(win).outerHeight(),
			_tgScroll = $(win).scrollTop() + (_delta * _scrollPow),
			s,
			current;

		$ui.uiScrolling.ing = true;		
		s = Math.round( _tgScroll/ _scrollPow) * _scrollPow;
		s < 0 ? s = 0 : '';
		_goto !== undefined ? s = _scrollPow * _goto : '';

		current = Math.ceil(_tgScroll / w_h);
		_goto !== undefined ? current = _goto : '';
		current < 0 ? current = 0 : '';
		_len <= current ? current = _len - 1 : '';
		$('.ui-pagescroll-dot').removeClass('selected').eq(current).addClass('selected');
		$('.ui-pagescroll-item').removeClass('selected').eq(current).addClass('selected');

		$("html, body").stop().animate({
			scrollTop: s
		}, _move_time, 'easeOutQuad', function(){
			
			setTimeout(function(){
				$ui.uiScrolling.ing = false;
			},100);
		});

		$('body').attr('scrollpage', current);
	}
	function createUiScrollingCancel() {		
		$(document).off("mousewheel.uiscrolling");
		$('body').data('scrolling', 'no');
	}
	function createUiScrollingSwitch(){
		$('body').data('scrolling') === 'yes' ? $ui.uiScrollingCancel(): '';
		$('body').data('scrolling') === 'no' ? $ui.uiScrolling(): '';
	}

	/* 참고용
	* - 태그명 구하기
	* $(this)[0].nodeName.toLowerCase();
	*
	* - string을 function으로 변경하는 방법
	* fn = new Function($sel.data('change'));
	* fn();
	*
	*/

	/*
	$plugins.modal.system({
		type : 'confirm' or 'alert'
		btn_confirm_yes : '확인',
		btn_confirm_no : '취소'
		btn_alert : '확인',
		cont_text : '.....'
		width : 410,
		zindex : null,
		state : '알림' or '선택' or '확인' or '오류'

	})
	*/

	$ui.modalOption = {
		type : 'alert',
		btn_confirm_yes : null,
		btn_confirm_no : null,
		btn_alert : '확인',
		cont_text : '확인해주세요.',
		width : 'auto',
		zindex : null,
		state : '알림'
	}
	$ui.modal = {
		system: function (opt){
			var opt = $.extend(true, {}, $ui.modalOption, opt),
				btn_confirm_yes = opt.btn_confirm_yes,
				btn_confirm_no = opt.btn_confirm_no,
				btn_alert = opt.btn_alert,
				cont_text = opt.cont_text,
				w = opt.width,
				z = opt.zindex,
				type = opt.type,
				state = opt.state,
				is_alert = type === 'alert' ? true : false,
				class_name,
				system_url = is_alert ? '/netiveUI/html/modal/modalAlert.html' : '/netiveUI/html/modal/modalConfirm.html';

			switch (state) {
				case '알림': 
					class_name = 'system-type-a';
					break;

				case '선택': 
					class_name = 'system-type-b';
					break;
					
				case '오류':
					class_name = 'system-type-c';
					break;
			}
			$plugins.uiModal({
				id: 'modalSystem', 
				link: system_url, 
				autofocus: false, 
				width: w, 
				zindex: z ,
				system_words: cont_text, 
				system_btntxt1: is_alert ? btn_alert : btn_confirm_yes, 
				system_btntxt2: is_alert ? null : btn_confirm_no , 
				system_class: class_name
			});

			$('#modalSystemBtn1').off('click.confirm').on('click.confirm', function () {
				$plugins.uiModalClose({ 
					id: 'modalSystem',
					remove: true, 
					closeback: opt.confirmCallback
				});
			});
			$('#modalSystemBtn2, .btn-close').off('click.confirm').on('click.confirm', function () {
				$plugins.uiModalClose({ 
					id: 'modalSystem', 
					remove: true, 
					closeback: opt.cancelCallback 
				});
			});
		},
		
		terms: function (title, url) {
			//$plugins.modal.terms('개인정보 수집/이용 동의 (SKT)', '/terms/phone_skt_01.html');
			var title = title === undefined ? '약관' : title,
				url = url === undefined ? false : url;

			if (!!url) {
				$('body.type-iframe').length ?
					parent.$plugins.uiModal({
						id: '__modalTerms',
						link: '/modal/modalTerms.html',
						remove: true,
						termsTit: title,
						termsUrl: url
					}) :
					$plugins.uiModal({
						id: '__modalTerms',
						link: '/modal/modalTerms.html',
						remove: true,
						termsTit: title,
						termsUrl: url
					});
			}
		}
	}

})(jQuery, window, document);