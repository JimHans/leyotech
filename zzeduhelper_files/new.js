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
		window._currentPlatform = _asActivePlatform; // 由于后面需要setTimeout延时来设置，所以这里用一个全局变量来标识当前处于哪个tab，防止快速切换tab时出现bug
		var timeAnimationDone = 300; //动画时长，与css中的transition保持一致
		
		$(platforms).each(function(index, platform){

			// 切换nav
			platform.navElement[_asActivePlatform === platform.platformName ? "addClass" : "removeClass"]("nav_active");

			// 动画开始时显示所有内容
			_oMain.removeClass(platform.mainShowOnlyClassName);

			// 开始切换
			_oMain[_asActivePlatform === platform.platformName ? "addClass" : "removeClass"](platform.mainDisplayClassName);

			/* 动画结束时隐藏其他tab的内容 */
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
	版本号膊扇〈胧迪值南喙卮耄菔备橹�
	//for app_version
	ie678 = '\v' == 'v';
	var ie9 = document.documentMode && document.documentMode === 9;
	if(ie678||ie9){
		$(".app_version").css("font-family","Arial");
	}*/

	// 三个特性随滚动事件的响应
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

	/* 更新日志的事件 */
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
	// 屏蔽日志详情的点击响应
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
			$(this).html("收起");
		}else{
			/*Array.prototype.reverse.call(nodes)*/nodes.each(function(i,item){
				setTimeout(function(){
					$(item).slideUp(30);
				},i*30);
			});
			$(this).html("显示所有版本");
		}
	});

	/* 视频 */

	/**
	 * 切换视频显示
	 * @param isShowVideo 是否显示视频
	 */
	function setVideoShow(isShowVideo) {
		var isWindowSizeSmall = $("#video_container").is(":hidden");
		if(isShowVideo && !isWindowSizeSmall) {
			createVideo();
		} else {
			removeVideo();
		}
	}

	/* 创建视频并开始播放 */
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
			modId:"video", /* 容器id */
			autoplay:true, /* 自动播放 */
			"flashWmode": "opaque", /* IE下flash不能被盖住的问题 */
			isVodFlashShowSearchBar:false, /* 去掉搜索 */
			onallended:function() { /* 播放完毕关闭视频 */
				setVideoShow(false);
			}
		});
	}

	/* 去掉播放器 */
	function removeVideo() {
		$("#video").empty().removeClass("hasVideo");
		$("#close_video").fadeOut(100);
		$("#video_mask").fadeOut(400);
		$("#video_area").fadeOut(400);
	}

	// 点击图片播放视频
	$("#play_video_link").click(function() {
		setVideoShow(true);
	});
	// 点击叉叉关闭视频
	$("#close_video").click(function() {
		setVideoShow(false);
	});
});
