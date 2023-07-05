(function ($) {
    "use strict";

    /**
     *  Variables
     */
	var body = $('body');
    var windowW = $(window).width();
    var windowH = $(window).height();
    var clickEventType = ((document.ontouchstart !== null) ? 'click' : 'touchstart');    
	
	/**
     * Detect Device Type
     */
    var isMobile;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
        $('html').addClass('mobile');
    } else {
        isMobile = false;
        $('html').addClass('desktop');
    }
	

    /**
     * Functions
     */
    function setWindowScrollAppear() {
        var $animate = $('.animate-up, .animate-down, .animate-left, .animate-right');

        if (!isMobile) {
            $animate.appear();
            $animate.on('appear', function (event, affected) {
                for (var i = 0; i < affected.length; i++) {
                    $(affected[i]).addClass('animated');
                }
            });
            $.force_appear();
        }
    }

    function windowSmoothScrollOnLoad() {
		if(window.location.hash && body.hasClass('home')) {
			$('html, body').animate({scrollTop: ($(window.location.hash).offset().top)}, 0);
		}       
    }    

   
    function lockScroll() {
        var $html = $('html');
        var $body = $('body');

        var initWidth = $body.outerWidth();
        var initHeight = $body.outerHeight();

        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        ];
        $html.data('scroll-position', scrollPosition);
        $html.data('previous-overflow', $html.css('overflow'));
        $html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        var marginR = $body.outerWidth() - initWidth;
        var marginB = $body.outerHeight() - initHeight;
        $body.css({'margin-right': marginR, 'margin-bottom': marginB});
        $html.addClass('lock-scroll');
    }

    function unlockScroll() {
        var $html = $('html');
        var $body = $('body');

        $html.css('overflow', $html.data('previous-overflow'));
        var scrollPosition = $html.data('scroll-position');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        $body.css({'margin-right': 0, 'margin-bottom': 0});
        $html.removeClass('lock-scroll');
    }

    function openMobileNav() {
        $('body').addClass('mobile-nav-opened');
        lockScroll();
    }

    function closeMobileNav() {
        $('body').removeClass('mobile-nav-opened');
        unlockScroll();
    }

    function openSidebar() {
        $('body').addClass('sidebar-opened');
        lockScroll();
    }

    function closeSidebar() {
        $('body').removeClass('sidebar-opened');
        unlockScroll();
    }

    function arrayContains(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }
	
	/**
     * Window Resize
     */
    $(window).resize(function () {
        windowW = $(window).width();
        windowH = $(window).height();
    });
	

    /**
     * Document Ready
     */
    $(function() {
        setWindowScrollAppear();
		
		// Header Navigation
        $('#nav>ul').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 500,
            scrollThreshold: 0.5,
            easing: 'swing'
        });
		
		// Add header navigation hover lines
        if ($('.nav-wrap .nav').length > 0) {
            $('.nav-wrap .nav > ul > li > a').append('<span></span>');
        }
		
		// Sticky Navigation
		var header = $('.header');
		var stickyNav = $('.head-bar');
		var stickyNavHeight = 0;
		var stickyNavigationAppear = function() {							
			if(stickyNav.length > 0) {
				stickyNav.addClass('animated');				
				if ($(window).width() > 767 && !isMobile) {
					if (stickyNavHeight < stickyNav.outerHeight()) {
						stickyNavHeight = stickyNav.outerHeight();
						header.css('min-height', stickyNavHeight + 'px');
					}

					if ($(window).scrollTop() > stickyNav.outerHeight()) {
						stickyNav.addClass('head-sticky');
					} else {
						stickyNav.removeClass('head-sticky');
					}
				} else {
					stickyNav.removeClass('head-sticky');
					header.css('min-height', '0px');
				}
				
			}		        
		}
			
        stickyNavigationAppear();
		
		$(window).scroll(function () {
			stickyNavigationAppear();
		});
		
		$(window).scroll(function () {
			stickyNavigationAppear();
		});
		
		/** Mobile Navigation */
        // Mobile Navigation
        $('#mobile-nav>ul').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 500,
            scrollThreshold: 0.5,
            easing: 'swing',
            begin: function () {
                closeMobileNav();
            }
        });

        // open/close mobile navigation
        $(document).on(clickEventType, '.btn-mobile', function () {
            if ($('body').hasClass('mobile-nav-opened')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        // init mobile navigation custom scroll
        if ($('.mobile-nav').length > 0) {
            $(".mobile-nav-inner").mCustomScrollbar({
                theme: "dark"
            });
        }
		
		/** Material Inputs */
        var material_inputs = $('.input-field input, .input-field textarea');

        for (var i = 0; i < material_inputs.length; i++) {
            if ($(material_inputs[i]).val())
                $(material_inputs[i]).parent('.input-field').addClass('used');
            else
                $(material_inputs[i]).parent('.input-field').removeClass('used');
        }

        material_inputs.on('blur', function () {
            if ($(this).val())
                $(this).parent().addClass('used');
            else
                $(this).parent().removeClass('used');
        });

        material_inputs.on('focus', function () {
            $(this).parent().addClass('used');
        });
		
		/** Ripple:
         *  appears where clicked on the element */
        $(document).on(clickEventType, '.ripple', function (e) {
            ripple($(this), e.pageX, e.pageY);
        });


        /** Ripple Centered:
         *  appears from element center */
        $(document).on(clickEventType, '.ripple-centered', function () {
            var $rippleElement = $('<span class="ripple-effect" />'),
                $buttonElement = $(this),
                xPos = $buttonElement.width() / 2,
                yPos = $buttonElement.height() / 2,
                size = Math.floor(Math.min($buttonElement.height(), $buttonElement.width()) * 0.5),
                animateSize = Math.floor(Math.max($buttonElement.width(), $buttonElement.height()) * 1.5);
            $rippleElement
                .css({
                    top: yPos,
                    left: xPos,
                    width: size,
                    height: size,
                    backgroundColor: $buttonElement.data("ripple-color")
                })
                .appendTo($buttonElement)
                .animate({
                    width: animateSize,
                    height: animateSize,
                    opacity: 0
                }, 450, function () {
                    $(this).remove();
                });
        });
		
		/** Audio Player */
        var post_audio = $('.post-media audio');
        if (post_audio.length > 0) {
            post_audio.mediaelementplayer({
                loop: false,
                audioHeight: 40,
                startVolume: 0.7
            });
        }


        /** Video Player */
        var post_video = $('.post-media video');
        if (post_video.length > 0) {
            post_video.mediaelementplayer({
                loop: false,
                defaultVideoWidth: 723,
                defaultVideoHeight: 405,
                videoWidth: -1,
                videoHeight: -1,
                startVolume: 0.7,
                enableAutosize: true,
                alwaysShowControls: true
            });
        }
		
		/** Sidebar */

        // open/close sidebar
        $(document).on(clickEventType, '.btn-sidebar', function () {
            if ($('body').hasClass('sidebar-opened')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        // init sidebar custom scroll
        var sidebarFixed = $('.sidebar-fixed');
        if( sidebarFixed.length > 0 ) {
            var sidebarScrollArea = sidebarFixed.find('.widget-area');
            sidebarScrollArea.mCustomScrollbar({
                theme: "dark",
                updateOnContentResize: true,
                updateOnImageLoad: true
            });
        }

        /** Overlay:
         *  the same overlay is used for fixed sidebar and for mobile navigation */
        $(document).on(clickEventType, '#overlay', function () {
            if ($('body').hasClass('mobile-nav-opened')) closeMobileNav();

            if ($('body').hasClass('sidebar-opened')) closeSidebar();
        });


        /** Google Map Initialisation */
        if ($('#map').length > 0) {
            initialiseGoogleMap();
        }




        /** Window Scroll Top Button */
        var $btnScrollTop = $('.btn-scroll-top');
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $btnScrollTop.fadeIn();
            } else {
                $btnScrollTop.fadeOut();
            }
        });

        $btnScrollTop.on('click', function () {
            $('html, body').animate({scrollTop: 0}, 800);
            return false;
        });

        /** Contact Form */
        $('.rsFormSubmit').on('click', function (e) {
            var rsForm = $(this).closest('.rsForm');
			var rsFormErrors = false;
			var rsFormAction = rsForm.attr('action');
			var rsFormCaptcha = rsForm.data('captcha');		
			var rsFormFields = rsForm.find('.input-field');		           	
            var rsFormName = rsForm.find("[name='rsName']");						
            var rsFormEmail = rsForm.find("[name='rsEmail']");
            var rsFormMessage = rsForm.find("[name='rsMessage']");		
            var rsFormResponce = rsForm.find('.rsFormResponce');			
            var rsFormPrivacy = rsForm.find("[name='rsPivacyPolicy']");

			// Button ripple effect
			ripple($(this).parent(), e.pageX, e.pageY);
			
            // Reset form errors
            rsFormFields.removeClass('error');
            rsFormErrors = false;

			// Validate form fields	
            if(!rsFormName.val()) {
                rsFormErrors = true;
                rsFormName.parent().addClass('error');
            }
            if(!rsFormPrivacy.prop('checked')) {
                rsFormErrors = true;
                rsFormPrivacy.parent().addClass('error');
            }
			
			if(!rsFormEmail.val() || !isValidEmail(rsFormEmail.val())) {
                rsFormErrors = true;
                rsFormEmail.parent().addClass('error');
            }
			
			if(!rsFormMessage.val()) {
                rsFormErrors = true;
                rsFormMessage.parent().addClass('error');
            }
									
			if(rsFormErrors) {
				// if has errors - do nothing
				return false;
			} else {	
				if (rsFormCaptcha === true) {
					// if captcha - goto captcha page
					return true;
				} else {
					// if no captcha - make ajax request
					$.post( rsFormAction,
						rsForm.serialize(),
						function (response) {
							var data = jQuery.parseJSON( response );
							if(data){								
								rsForm.append('<div class="rsFormResponce"><strong>Congratulation!</strong><br>Your email was sent successfully!</div>');
							} else {
								rsForm.append('<div class="rsFormResponce"><strong>OOPS!</strong> Something went wrong.<br>Please try again.</div>');
							}							
						}
					);
					return false;
				}
			}					                         
        });

		
    });    


    /**
     * Window Load
     */
    $(window).load(function () {
		/** Blog */
        var blog_grid_selector = $('.blog-grid');
        if (blog_grid_selector.length > 0) {
            var blog_grid = blog_grid_selector.isotope({
                isOriginLeft: !rsOptions.rtl,
                itemSelector: '.blog-grid .grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });

            blog_grid.imagesLoaded().progress(function () {
                blog_grid.isotope('layout');
            });
        } 
        
        /** Portfolio */
        var grid_seector = $('.grid');
        if (grid_seector.length > 0) {

            // Isotope Initialization
            var $grid = grid_seector.isotope({
				isOriginLeft: !rsOptions.rtl,
                itemSelector: '.grid .grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });

            $grid.imagesLoaded().progress(function () {
                $grid.isotope('layout');
            });

            // Isotope Filter
            var filter = $('.filter');
            if (filter.length > 0) {
                var filter_btn = filter.find('button');
                var filter_btn_first = $('.filter-btn-group button:first-child');

                filterBarLinePositioning($grid, filter_btn_first);
                filter_btn_first.addClass('active');

                filter_btn.on('click', function () {
                    filter_btn.removeClass('active');
                    $(this).addClass('active');
                    $('.grid-box').addClass('animated');
                    filterBarLinePositioning($grid, $(this));
                });
            }

            // Isotope Append New Elements
            var $elemTotalCount = 0;
            var $elemLoadedCount = 0;
            var $elemCountPerLoad = 3;
            var $gridMore = $('.grid-more');
            var $gridMoreBtn = $gridMore.find('.btn');
            var $gridAjaxLoader = $gridMore.find('.ajax-loader');

            $gridMoreBtn.on('click', function () {
                $.ajax({
                    url: "ajax/portfolio.html",
                    dataType: "html",
                    beforeSend: function () {
                        // show ajax loader
                        $gridMoreBtn.css('display', 'none');
                        $gridAjaxLoader.css('display', 'inline-block');
                    },
                    success: function (data) {
                        $elemTotalCount = $.grep($.parseHTML(data), function (el, i) {
                            return $(el).hasClass("grid-item")
                        }).length;

                        if ($elemLoadedCount < $elemTotalCount) {
                            for (var i = 1; i <= $elemCountPerLoad; i++) {

                                var $item = $(data).filter('.grid-item:eq(' + $elemLoadedCount + ')'); // started from 0
                                grid_seector.append($item).isotope('appended', $item);

                                $elemLoadedCount++;
                            }
                        }

                        if ($elemLoadedCount >= $elemTotalCount) {
                            $gridMore.hide();
                        }

                        // hide ajax loader
                        $gridMoreBtn.css('display', 'inline-block');
                        $gridAjaxLoader.css('display', 'none');
                    }
                })
            });


            // Portfolio fancybox
            var _player;
            $('.portfolioFancybox').fancybox({
                padding: 0,
                wrapCSS: 'fancybox-portfolio',
                maxWidth: '795px',
                maxHeight: '85%',
                minWidth: '250px',
                mouseWheel: 'true',
                scrolling: "no",
                autoCenter: true,
                beforeShow: function () {
                    // Get current popup
                    var currentID = $(this.element).attr("href");
                    var currentPopup = $('.fancybox-portfolio ' + currentID);

                    // Append current popup embed
                    var currentEmbed = currentPopup.find('.inline-embed');
                    if (currentEmbed.length > 0) {
                        var currentEmbedType = currentEmbed.data('embed-type');
                        var curentEmbedUrl = currentEmbed.data('embed-url');

                        switch (currentEmbedType) {
                            case "image":
                                currentEmbed.empty();
                                currentEmbed.addClass('inline-embed-image');
                                currentEmbed.append('<img src="' + curentEmbedUrl + '" />');
                                break;
                            case "iframe":
                                currentEmbed.empty();
                                currentEmbed.addClass('inline-embed-iframe');
                                currentEmbed.append('<iframe src="' + curentEmbedUrl + '" allowfullscreen></iframe>');
                                break;
                            case "video":
                                _player = ''; // reset player
                                currentEmbed.addClass('inline-embed-video');
                                var currentVideo = $('' + currentID + '').find('video');
                                if (currentVideo.length > 0) {
                                    new MediaElementPlayer(currentID + ' video', { // initialize player
                                        loop: false,
                                        defaultVideoWidth: 723,
                                        defaultVideoHeight: 405,
                                        videoWidth: -1,
                                        videoHeight: -1,
                                        startVolume: 0.7,
                                        enableAutosize: true,
                                        alwaysShowControls: true,
                                        success: function (mediaElement, domObject) {
                                            _player = mediaElement;
                                            _player.load();
                                        }
                                    });
                                }
                                break;
                        }
                    }
                },
                afterShow: function () {
                    // Get current popup
                    var currentID = $(this.element).attr("href");
                    var currentPopup = $('.fancybox-portfolio ' + currentID);

                    // Make current popup visible with css
                    currentPopup.addClass('opened');
                },
                beforeClose: function () {
                    // reset player
                    _player = '';
                }
            });
        }
        
        /** Timeline:
         *  positioning timeline elements */
		if(rsOptions.rtl){ // switch timeline box classes for RTL
			var tLineLeft = $('.timeline-box-left');
			var tLineRight = $('.timeline-box-right');
			
			tLineLeft.removeClass('timeline-box-left').addClass('timeline-box-right');
			tLineRight.removeClass('timeline-box-right').addClass('timeline-box-left');
			tLineLeft.find('.animate-right').removeClass('animate-right').addClass('animate-left');			
			tLineRight.find('.animate-left').removeClass('animate-left').addClass('animate-right');
		} 
        positioningTimelineElements();        

        /** Reference Slider */
	    var ref_slider = $('.ref-slider');
        if (ref_slider.length > 0) {
            for (var i = 0; i < ref_slider.length; i++) {
                var ref_slider_prev = $(ref_slider[i]).closest('.section-box').find('.slider-prev');
                var ref_slider_next = $(ref_slider[i]).closest('.section-box').find('.slider-next');

                $(ref_slider[i]).bxSlider({                    
					pager: false,
					controls: true,
					auto: rsOptions.refSlider.auto,					
                    speed: rsOptions.refSlider.speed,
                    pause: rsOptions.refSlider.pause,
					autoHover: rsOptions.refSlider.autoHover,
                    adaptiveHeight: rsOptions.refSlider.adaptiveHeight,
					adaptiveHeightSpeed: rsOptions.refSlider.adaptiveHeightSpeed,
                    nextSelector: ref_slider_prev,
                    prevSelector: ref_slider_next,
                    nextText: '<i class="rsicon rsicon-chevron_right"></i>',
                    prevText: '<i class="rsicon rsicon-chevron_left"></i>'
                });
            }
        }

        /** Post Slider */
        var post_slider = $('.post-slider');
        if (post_slider.length > 0) {
            for (var i = 0; i < post_slider.length; i++) {
                var prevSelector = $(post_slider[i]).closest('.post-media').find('.slider-prev');
                var nextSelector = $(post_slider[i]).closest('.post-media').find('.slider-next');

                $(post_slider[i]).bxSlider({					
                    pager: false,
                    controls: true,
					speed: rsOptions.postSlider.speed,
					auto: rsOptions.postSlider.auto,
					pause: rsOptions.postSlider.pause,
					autoHover: rsOptions.postSlider.autoHover,
                    nextSelector: nextSelector,
                    prevSelector: prevSelector,
                    nextText: '<i class="rsicon rsicon-chevron_right"></i>',
                    prevText: '<i class="rsicon rsicon-chevron_left"></i>'
                });
            }
        }

        /** Clients Carousel */
        var clients_carousel = $(".clients-carousel");
        if (clients_carousel.length > 0) {
            for (var i = 0; i < clients_carousel.length; i++) {
                $(clients_carousel[i]).owlCarousel({                    
					lazyLoad: true,
                    responsive: true,
                    navigation: false,
                    pagination: false,
                    items: rsOptions.clientsSlider.items,
                    singleItem: rsOptions.clientsSlider.singleItem,
                    autoPlay: rsOptions.clientsSlider.autoPlay,
                    stopOnHover: rsOptions.clientsSlider.stopOnHover,
                    itemsDesktopSmall: rsOptions.clientsSlider.itemsDesktopSmall,
                    itemsTabletSmall: rsOptions.clientsSlider.itemsTabletSmall,
                    itemsMobile: rsOptions.clientsSlider.itemsMobile
                });
            }
        }
		
		/** Window smooth scroll to an anchor */
		windowSmoothScrollOnLoad();

        /** Preloader:
         *  site was successfully loaded, hide site pre-loader */
        hideSitePreloader();
    });

})(jQuery);