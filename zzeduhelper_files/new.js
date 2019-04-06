$(function() {
	var userAgent = navigator.userAgent.toLowerCase();
	var browser = {
		ie7: /msie 7/.test(userAgent),
		ie6: /msie 6/.test(userAgent)
	};

	var platforms = [
		{
			platformName : "iphone",
			navElement : $("#nav_iphone"),
			containerElement : $(".ma_ios"),
			mainShowOnlyClassName : "show_only_ios",
			mainDisplayClassName : "disp_ios"
		},
		{
			platformName : "ipad",
			navElement: $("#nav_ipad"),
			containerElement : $(".ma_ipad"),
			mainShowOnlyClassName : "show_only_ipad",
			mainDisplayClassName : "disp_ipad"
		},
		{
			platformName : "android",
			navElement: $("#nav_android"),
			containerElement : $(".ma_android"),
			mainShowOnlyClassName : "show_only_android",
			mainDisplayClassName : "disp_android"
		},
		{
			platformName : "other",
			navElement: $("#nav_other"),
			containerElement : $(".ma_other"),
			mainShowOnlyClassName : "show_only_other",
			mainDisplayClassName : "disp_other"
		}
	];

	var _oMain = $("#ma_main");

	var isMiniNavOpen = false;

	function closeMiniNav() {
		if(isMiniNavOpen){
			$(".ma_nav").addClass("hide_nav").removeClass("show_nav");
			isMiniNavOpen = false;
		}
	}

	function showMiniNav() {
		if(!isMiniNavOpen){
			$(".ma_nav").addClass("show_nav").removeClass("hide_nav");
			isMiniNavOpen = true;
		}
	}
	
	function switchMain(_asActivePlatform) {
		window._currentPlatform = _asActivePlatform; // ÓÉÓÚºóÃæĞèÒªsetTimeoutÑÓÊ±À´ÉèÖÃ£¬ËùÒÔÕâÀïÓÃÒ»¸öÈ«¾Ö±äÁ¿À´±êÊ¶µ±Ç°´¦ÓÚÄÄ¸ötab£¬·ÀÖ¹¿ìËÙÇĞ»»tabÊ±³öÏÖbug
		var timeAnimationDone = 300; //¶¯»­Ê±³¤£¬ÓëcssÖĞµÄtransition±£³ÖÒ»ÖÂ
		
		$(platforms).each(function(index, platform){

			// ÇĞ»»nav
			platform.navElement[_asActivePlatform === platform.platformName ? "addClass" : "removeClass"]("nav_active");

			// ¶¯»­¿ªÊ¼Ê±ÏÔÊ¾ËùÓĞÄÚÈİ
			_oMain.removeClass(platform.mainShowOnlyClassName);

			// ¿ªÊ¼ÇĞ»»
			_oMain[_asActivePlatform === platform.platformName ? "addClass" : "removeClass"](platform.mainDisplayClassName);

			/* ¶¯»­½áÊøÊ±Òş²ØÆäËûtabµÄÄÚÈİ */
			setTimeout(function showOnlyOne(){
				if(window._currentPlatform === platform.platformName) {
					_oMain.addClass(platform.mainShowOnlyClassName);
				}
			}, timeAnimationDone);
		});
	}

	// nav click event
	$(platforms).each(function(index, platform){
		platform.navElement.click(function(){
			closeMiniNav();
			switchMain(platform.platformName);
			return false;
		});
	});

	// for mobile
	$("#mini_nav").click(function(){
		if(isMiniNavOpen){
			closeMiniNav();
		}else{
			showMiniNav();
		}
		return false;
	});

	/*
	°æ±¾ºÅ²²ÉÈ¡´úÂëÊµÏÖµÄÏà¹Ø´úÂë£¬ÔİÊ±¸éÖÃ
	//for app_version
	ie678 = '\v' == 'v';
	var ie9 = document.documentMode && document.documentMode === 9;
	if(ie678||ie9){
		$(".app_version").css("font-family","Arial");
	}*/

	// Èı¸öÌØĞÔËæ¹ö¶¯ÊÂ¼şµÄÏìÓ¦
	(function(){

		var addDetailAnimation = function(fixPageY){
			var $iosDetailLists = $("#ma_ios .detail_content"),
				$ipadDetailLists = $("#ma_ipad .detail_content"),
				$androidDetailLists = $("#ma_android .detail_content"),
				$window = $(window),
				viewHeight = $window.height(),
				scrollTop = $window.scrollTop();

			if(fixPageY){
				scrollTop += fixPageY;
			}

			$([$iosDetailLists, $ipadDetailLists, $androidDetailLists]).each(function(){
				this.each(function(index){
					var self = $(this),
						itemIndex = index + 1,
						parentObj = self.parents(".detail_box" + itemIndex);

					if(self.height() + self.offset().top < viewHeight + scrollTop){
						parentObj.addClass("detail_animation" + itemIndex);
					}else{
						parentObj.removeClass("detail_animation" + itemIndex);
					}
				});
			});
		};

		$(document).scroll(function(){
			addDetailAnimation();
		});
		
	})();

	/* ¸üĞÂÈÕÖ¾µÄÊÂ¼ş */
	$(".journal_item").click(function() {
		var _oThis = $(this),
			_oDetails = _oThis.find(".journal_detail"),
			_bIsFold = _oThis.hasClass("journal_fold"), 
			_nAnimationTime = 200;
		if(browser.ie7 || browser.ie6) {
			_oDetails.toggle();
			_oThis[_bIsFold ? "removeClass" : "addClass"]("journal_fold");
		} else {
			_oDetails.slideToggle(_nAnimationTime, function() {
				_oThis[_bIsFold ? "removeClass" : "addClass"]("journal_fold");
			});
		}
	});
	// ÆÁ±ÎÈÕÖ¾ÏêÇéµÄµã»÷ÏìÓ¦
	$(".journal_detail").click(function(e) {
		e.stopPropagation();
	});
	
	$(".journal_more").click(function(e){
		var nodes = $(this).parent().find(".journal_item").not(".journal_item_expand");
		if(nodes.css("display")=="none"){
			nodes.each(function(i,item){
				setTimeout(function(){
					$(item).slideDown(80);
				},i*60);
			});
			$(this).html("ÊÕÆğ");
		}else{
			/*Array.prototype.reverse.call(nodes)*/nodes.each(function(i,item){
				setTimeout(function(){
					$(item).slideUp(30);
				},i*30);
			});
			$(this).html("ÏÔÊ¾ËùÓĞ°æ±¾");
		}
	});

	/* ÊÓÆµ */

	/**
	 * ÇĞ»»ÊÓÆµÏÔÊ¾
	 * @param isShowVideo ÊÇ·ñÏÔÊ¾ÊÓÆµ
	 */
	function setVideoShow(isShowVideo) {
		var isWindowSizeSmall = $("#video_container").is(":hidden");
		if(isShowVideo && !isWindowSizeSmall) {
			createVideo();
		} else {
			removeVideo();
		}
	}

	/* ´´½¨ÊÓÆµ²¢¿ªÊ¼²¥·Å */
	function createVideo() {
		if($("#video").hasClass("hasVideo")){
			return;
		}
		$("#video").addClass("hasVideo");
		$("#close_video").fadeIn(400);
		$("#video_mask").fadeIn(400);
		$("#video_area").fadeIn(400);

		var video = new tvp.VideoInfo();
		video.setVid("m0140fim4l6");
		var player = new tvp.Player();
		player.create({
			width:"100%",
			height:"100%",
			video:video,
			modId:"video", /* ÈİÆ÷id */
			autoplay:true, /* ×Ô¶¯²¥·Å */
			"flashWmode": "opaque", /* IEÏÂflash²»ÄÜ±»¸Ç×¡µÄÎÊÌâ */
			isVodFlashShowSearchBar:false, /* È¥µôËÑË÷ */
			onallended:function() { /* ²¥·ÅÍê±Ï¹Ø±ÕÊÓÆµ */
				setVideoShow(false);
			}
		});
	}

	/* È¥µô²¥·ÅÆ÷ */
	function removeVideo() {
		$("#video").empty().removeClass("hasVideo");
		$("#close_video").fadeOut(100);
		$("#video_mask").fadeOut(400);
		$("#video_area").fadeOut(400);
	}

	// µã»÷Í¼Æ¬²¥·ÅÊÓÆµ
	$("#play_video_link").click(function() {
		setVideoShow(true);
	});
	// µã»÷²æ²æ¹Ø±ÕÊÓÆµ
	$("#close_video").click(function() {
		setVideoShow(false);
	});
});
