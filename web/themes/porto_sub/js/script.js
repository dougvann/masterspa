(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.behaviors.porto_sub = {
    attach: function (context, settings) {
      var removedLogo = false;
      var landedHowToBuy = false;

      // test to see if the link is a anchor link, if not the length will have no value, this is done to avoid js errors on non anchor links



      setInterval(function(){
      	if (!removedLogo && $('.jcbx-glry-classic').length) {
					console.log('test');
          $('.jcbx-glry-classic>div:eq( 3 )').hide();
					$('.jcbx-glry-classic>div:eq( 4 )').hide();
					removedLogo = true;
      	}

      }, 500);

      $('.jb-splash-view-glry').click(function() {
        removedLogo = false;
      })


      setInterval(function(){
        var anchorLink = jQuery(window.location.hash);
        if ( anchorLink.length && !landedHowToBuy ) {
          jQuery("html, body").animate({scrollTop: jQuery('.michael-phelps-signature').offset().top + jQuery('.michael-phelps-signature').height()}, 500);
          landedHowToBuy = true;
        }
      }, 1000);

      $('.btn_para', context).once('btn_para').each(function(){
        if ($(this).hasClass('white')) {
          $(this).wrap( "<div class='btn para white'></div>" );
          $(this).removeClass('white');
        } else if ($(this).hasClass('transparent')) {
          $(this).wrap( "<div class='btn para outlineBlue'></div>" );
          $(this).removeClass('blue');
        } else if ($(this).hasClass('blue')) {
          $(this).wrap( "<div class='btn para blue'></div>" );
        }
      })

      var imagePath = '';
      var imagePathMobile = '';

      var bannerMobile = $('.mobile-hero-banner').find('.field--type-image').find('img');
      if (bannerMobile) {
        imagePathMobile = bannerMobile.attr('src');
        if (typeof imagePathMobile != 'undefined') {
          $('#hometron-mobile').css({"background-image" : "url("+ imagePathMobile +")"});
        }

      }


      $('.view-dynamic-banner-image', context).once().each(function(){
        var banner = $(this).find('.views-row').find('img');
        if (banner) {
          var imagePath = banner.attr('src');
          $('#hometron').css({"background-image" : "url("+ imagePath +")"});
          $('#hero').css({"background-image" : "url("+ imagePath +")"});
          /*if (typeof imagePathMobile == 'undefined') {
            $('#hometron-mobile').css({"background-image" : "url("+ imagePath +")"});

          }*/
        }
      });

      /*$('.no-frontpage .view-dynamic-banner-image', context).once().each(function(){
        var banner = $(this).find('.views-row').find('img');
        if (banner) {
          var imagePath = banner.attr('src');
          $('#hero').css({"background-image" : "url("+ imagePath +")"});

        }
      });*/





      $('#mainNav', context).once().each(function(){
        $('#mainNav > li.dropdown > span').append('<i class="fa fa-caret-down"></i>');

        $('#mainNav > li.dropdown > span .fa-caret-down, #mainNav > li.dropdown > span, #mainNav > li.dropdown > a').on('click', function (e) {
          e.preventDefault();
            if ($(window).width() < 992) {
                $(this).closest('li').toggleClass('opened');
            }
        });

        $('#mainNav > li.dropdown > ul.dropdown-menu > li > a').on('click', function (e) {
            if ($(window).width() < 992) {
                if ($(this).attr('href') == '/#howToBuy' && $(this).hasClass('is-active')) {

                  $('.header-nav-main').removeClass('in');

                  //e.preventDefault();
                }
            }
        });



      })


    }
  };

})(jQuery, Drupal, drupalSettings);