(function($) {
	$(function() {
		var $win = $(window);
    
//전체메뉴보기
    $('.tnb-group').each(function() {
      //전체메뉴 보이기
      var $group = $(this),
          $btn = $group.find('.btn-tnb'),
          $tnb = $group.find('.tnb'),
          $lines = $tnb.find('li'),
          i = $lines.index(),
          currentIndex = 0,
          $allA = $lines.find('a');
      /*$tnb.on('click', function() {
        $group.removeClass('full');
      });*/
      $btn.on('click', function() {
        if ($group.hasClass('full')) {
          $group.removeClass('full');
          $lines.css({
            paddingLeft: '50px',
            opacity: 0
          });
        } else {
          // 메뉴열기
          $group.addClass('full');
          // 메뉴글씨 들어오기
          $lines.each(function(i) {
            $(this).delay(i*200).animate({
              paddingLeft: 0,
              opacity: 1
            }, 1000);
          });
        }
      });
    });

//gnb hover 할 때 보여지기
    $('.gnb').each(function() {
      var $gnb = $(this),
          $gnbUl = $gnb.children('ul'),
          $gnbMenu = $gnbUl.children('li'),
          $bg = $gnb.find('.gnb-bg'),
          $menu = $gnb.find('.gnb-menu'),
          $lnb = $menu.find('.lnb');
      $menu.on('mouseenter', function() {
        $(this).children('.lnb').stop().slideDown('fast').css('opacity', 1);
        $bg.addClass('on');
      });
      $menu.on('mouseleave', function() {
        $(this).children('.lnb').stop().slideUp('fast').css('opacity', 0);
        $bg.removeClass('on');
      });
    });
    
//section 스르륵 효과
    $win.on('scroll', function() {
      var scrolled = $win.scrollTop(),
          winH = $win.height(),
          winHeight = scrolled + winH/2;
      
      $('.section').each(function(i) {
        var $section = $(this),
            sectH = $section.height(),
            sectOffsetTop = $section.offset().top,
            sectHeight = sectOffsetTop + sectH/5, 
            $title = $section.find('.sect-tit'),
            $text = $section.find('.text'),
						$tabTit = $section.find('.tab-menu > li'),
						$sns = $section.find('.sns-content > li');
      
        if (winHeight >= sectOffsetTop && scrolled < sectHeight) {
            $title.add($text).add($tabTit).add($sns).addClass('srr');
          } else {
            $title.add($text).add($tabTit).add($sns).removeClass('srr');
          }
      });
    });
    

		
//section3 tab
		$('.section3').each(function() {
			var $section3 = $(this),
					$tabMenu = $section3.find('.tab-menu'),
					$title = $tabMenu.find('li'),
					$a = $title.find('a'),
					$descs = $section3.find('.discs');
      //앨범 스와이퍼
      var swiper = new Swiper('.swiper-discs', {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });
			$a.on('click', function(e) {
				e.preventDefault();
				var $current = $(this),
						$currentTitle = $current.parent(),
						name = $current.attr('href'),
						$content = $(name);
				if ($title.hasClass('on')) {
					return;
				}
				$a.removeClass('on');
				$(this).addClass('on');
				$descs.removeClass('on');
				$content.addClass('on');
        //앨범 스와이퍼
        var swiper = new Swiper('.swiper-discs', {
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        });
			});
		});
//가로값에 따른 반응형
    if ($win.width() > 1600) {
      //poster swiper(section2)
      $('.pics-slide').each(function() {
        var $section = $(this),
            $pics = $(this).find('.pics'),
            $picsWrap = $pics.find('.pic-wrap'),
            $item = $picsWrap.find('a'),
            $indicator = $section.find('.indicator'),
            $btn = $section.find('.btn'),
            sp = 1000,
            currentIndex = 0,
            count = $item.length,//이미지 총개수
            interval = 3000,
            timer,
            indicatorHtml = '';
        //picture 배치
        $item.each(function(i) {
          $(this).css({
            left: ((25.4 * i) + 4) + '%'
          });
          //indicator 공간만들기
          indicatorHtml += "<a href='#'></a>"
        });
        //indicator 집어넣기
        $indicator.html(indicatorHtml);
        //슬라이드 함수
        function slideShow(i) {
          $picsWrap.stop().animate({
            left: -25.4 * i + '%'
          }, sp);
          $item.eq(i).addClass('front', sp);
          $item.eq(i).siblings().removeClass('front');
          currentIndex = i;
          update();
        }
        //버튼 흐리게
        function update() {
          //indicator 변하기
          $indicator.children('a').removeClass('on');
          $indicator.find('a').eq(currentIndex).addClass('on');
          //첫번째 -> prev 흐리게
          if (currentIndex == 0) {
              $btn.find('.prev').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.prev').css({opacity: 1, cursor: 'pointer'});
            }
          //마지막 -> next 흐리게
          if (currentIndex == (count - 1)) {
              $btn.find('.next').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.next').css({opacity: 1, cursor: 'pointer'});
            }
        }
        //3초에 한번씩 실행
        function startTimer() {
          timer = setInterval(function() {
            var nextIndex = (currentIndex + 1) % count;
            slideShow(nextIndex);
          }, interval);
        }
        //일시정지
        function stopTimer() {
          clearInterval(timer);
        }
        //마우스 올리면 일시정지
        $pics.add($indicator).on({
          mouseenter: stopTimer,
          mouseleave: startTimer
        });
        //button 클릭하면 정지
        $btn.on({click: stopTimer});
        //button클릭하면 이전/다음으로 이동
        $btn.on('click', 'button', function() {
          if ($(this).hasClass('next')) {
              slideShow(currentIndex+1);
              } else {
                slideShow(currentIndex-1);
              }
        });
        //indicator 클릭하면 이동
        $indicator.on('click', 'a', function(e) {
          e.preventDefault();
          //클릭된 앵커의 인덱스 저장
          var i = $(this).index();
          //저장된 인덱스 값을 변경해서 이동시키기
          slideShow(i);
        });
        //함수실행
        slideShow(currentIndex);
        startTimer();
      });
      
      // parallex
      /*
      1.섹션의 높이 정하기
      2.resize될 때 높이값 재선언
      3.인디케이터 클릭할 때 넘어가는 함수
      4.마우스휠로 넘어가는 함수
      5.스크롤이 됐을 때 인디케이터 바꿔주는 함수
      6.스크롤 됐을 때 인디케이터 바꿔주는 함수 강제실행 
      */
      var winH = $win.height(),
          scrolled = $win.scrollTop(),
          docH = $(document).height(),
          $snb = $('.snb'),
					$anchor = $snb.find('span'),
          $section = $('section'),
					$sectCon = $('.section'),
          sp = 1000,
					easing = 'easeOutExpo';
      
			//높이값
      /*$sectCon.height(winH);
      $win.on('resize', function() {
        $sectCon.height(winH);
      });*/
			//인디케이터 클릭시 이동
			$anchor.on('click', function() {
				var i = $(this).index(),
						posT = winH * i;
				
				$('html, body').stop().animate({
          scrollTop: posT
				}, sp, easing);
			});
			//스크롤로 움직일 때 인디케이터 변하기
			$win.on('scroll', function(e) {
				e.preventDefault();
        
				var num = $section.length,
						last = num - 1,
						scrollTop = $win.scrollTop() + winH/8;
        
				//인디케이터 snb
				for (var i = 0; i < num; i++) {
					if (scrollTop >= winH * i && scrollTop < winH * (i + 1)) {
            $snb.show();
						$anchor.removeClass('on');
						$anchor.eq(i).addClass('on');
					} else if (scrollTop >= docH - winH) {
            $snb.hide();
          }
				}
			});
			//섹션으로 한번에 이동하기
			$section.on('mousewheel', function(e, delta) {
				e.preventDefault();

				var scrolled = $win.scrollTop(),
				    currentIndex = $(this).index(),
            first = 0,//첫번째 section의 인덱스값
            last = $section.length - 2,//마지막 .section
						foot = $section.length - 1;//footer

				if (delta > 0 && currentIndex != first && currentIndex != foot) {
						//위로 올렸을 때
					var prevTop = $(this).prev().offset().top;				
					$('html, body').stop().animate({
						scrollTop: prevTop
					}, sp, easing);
				} else if (delta > 0 && currentIndex == foot) {
          var lastTop = winH * 3;
					$('html, body').stop().animate({
						scrollTop: lastTop
					}, sp, easing);
        } else if (delta < 0 && currentIndex < last) {
					//아래로 내렸을 때
					var nextTop = $(this).next().offset().top;
					$('html, body').stop().animate({
						scrollTop: nextTop
					}, sp, easing);
				} else if (delta < 0 && currentIndex == last) {
					var lastTop = $(this).offset().top + $('#footer').height();
					$('html, body').stop().animate({
						scrollTop: lastTop
					}, sp, easing);
				}
			});
			//실행
      $win.trigger('scroll');
//패럴렉스 끝
    } else if ($win.width() >= 1280) {
			//poster swiper(section2)
      $('.pics-slide').each(function() {
        var $section = $(this),
            $pics = $(this).find('.pics'),
            $picsWrap = $pics.find('.pic-wrap'),
            $item = $picsWrap.find('a'),
            $indicator = $section.find('.indicator'),
            $btn = $section.find('.btn'),
            sp = 1000,
            currentIndex = 0,
            count = $item.length,//이미지 총개수
            interval = 3000,
            timer,
            indicatorHtml = '';
        //picture 배치
        $item.each(function(i) {
          $(this).css({
            left: ((25.4 * i) + 4) + '%'
          });
          //indicator 공간만들기
          indicatorHtml += "<a href='#'></a>"
        });
        //indicator 집어넣기
        $indicator.html(indicatorHtml);
        //슬라이드 함수
        function slideShow(i) {
          $picsWrap.stop().animate({
            left: -25.4 * i + '%'
          }, sp);
          $item.eq(i).addClass('front', sp);
          $item.eq(i).siblings().removeClass('front');
          currentIndex = i;
          update();
        }
        //버튼 흐리게
        function update() {
          //indicator 변하기
          $indicator.children('a').removeClass('on');
          $indicator.find('a').eq(currentIndex).addClass('on');
          //첫번째 -> prev 흐리게
          if (currentIndex == 0) {
              $btn.find('.prev').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.prev').css({opacity: 1, cursor: 'pointer'});
            }
          //마지막 -> next 흐리게
          if (currentIndex == (count - 1)) {
              $btn.find('.next').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.next').css({opacity: 1, cursor: 'pointer'});
            }
        }
        //3초에 한번씩 실행
        function startTimer() {
          timer = setInterval(function() {
            var nextIndex = (currentIndex + 1) % count;
            slideShow(nextIndex);
          }, interval);
        }
        //일시정지
        function stopTimer() {
          clearInterval(timer);
        }
        //마우스 올리면 일시정지
        $pics.add($indicator).on({
          mouseenter: stopTimer,
          mouseleave: startTimer
        });
        //button 클릭하면 정지
        $btn.on({click: stopTimer});
        //button클릭하면 이전/다음으로 이동
        $btn.on('click', 'button', function() {
          if ($(this).hasClass('next')) {
              slideShow(currentIndex+1);
              } else {
                slideShow(currentIndex-1);
              }
        });
        //indicator 클릭하면 이동
        $indicator.on('click', 'a', function(e) {
          e.preventDefault();
          //클릭된 앵커의 인덱스 저장
          var i = $(this).index();
          //저장된 인덱스 값을 변경해서 이동시키기
          slideShow(i);
        });
        //함수실행
        slideShow(currentIndex);
        startTimer();
      });
		} else if ($win.width() < 1280 && $win.width() >= 1025) {
      //poster swiper(section2)
      $('.pics-slide').each(function() {
        var $section = $(this),
            $pics = $(this).find('.pics'),
            $picsWrap = $pics.find('.pic-wrap'),
            $item = $picsWrap.find('a'),
            $indicator = $section.find('.indicator'),
            $btn = $section.find('.btn'),
            sp = 1000,
            currentIndex = 0,
            count = $item.length,//이미지 총개수
            interval = 3000,
            timer,
            indicatorHtml = '';
        //picture 배치
        $item.each(function(i) {
          $(this).css({
            left: ((33 * i) + 4) + '%'
          });
          //indicator 공간만들기
          indicatorHtml += "<a href='#'></a>"
        });
        //indicator 집어넣기
        $indicator.html(indicatorHtml);
        //슬라이드 함수
        function slideShow(i) {
          $picsWrap.stop().animate({
            left: -33 * i + '%'
          }, sp);
          $item.eq(i).addClass('front', sp);
          $item.eq(i).siblings().removeClass('front');
          currentIndex = i;
          update();
        }
        //버튼 흐리게
        function update() {
          //indicator 변하기
          $indicator.children('a').removeClass('on');
          $indicator.find('a').eq(currentIndex).addClass('on');
          //첫번째 -> prev 흐리게
          if (currentIndex == 0) {
              $btn.find('.prev').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.prev').css({opacity: 1, cursor: 'pointer'});
            }
          //마지막 -> next 흐리게
          if (currentIndex == (count - 1)) {
              $btn.find('.next').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.next').css({opacity: 1, cursor: 'pointer'});
            }
        }
        //3초에 한번씩 실행
        function startTimer() {
          timer = setInterval(function() {
            var nextIndex = (currentIndex + 1) % count;
            slideShow(nextIndex);
          }, interval);
        }
        //일시정지
        function stopTimer() {
          clearInterval(timer);
        }
        //마우스 올리면 일시정지
        $pics.add($indicator).on({
          mouseenter: stopTimer,
          mouseleave: startTimer
        });
        //button 클릭하면 정지
        $btn.on({click: stopTimer});
        //button클릭하면 이전/다음으로 이동
        $btn.on('click', 'button', function() {
          if ($(this).hasClass('next')) {
              slideShow(currentIndex+1);
              } else {
                slideShow(currentIndex-1);
              }
        });
        //indicator 클릭하면 이동
        $indicator.on('click', 'a', function(e) {
          e.preventDefault();
          //클릭된 앵커의 인덱스 저장
          var i = $(this).index();
          //저장된 인덱스 값을 변경해서 이동시키기
          slideShow(i);
        });
        //함수실행
        slideShow(currentIndex);
        startTimer();
      });
      
      //section4 sns 스와이퍼
      var swiper = new Swiper('.swiper-sns', {
        slidesPerView: 3,
        spaceBetween: 30,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        
      });
    } else if ($win.width() < 1025 && $win.width() > 769) {
      //poster swiper(section2)
      $('.pics-slide').each(function() {
        var $section = $(this),
            $pics = $(this).find('.pics'),
            $picsWrap = $pics.find('.pic-wrap'),
            $item = $picsWrap.find('a'),
            $indicator = $section.find('.indicator'),
            $btn = $section.find('.btn'),
            sp = 1000,
            currentIndex = 0,
            count = $item.length,//이미지 총개수
            interval = 3000,
            timer,
            indicatorHtml = '';
        //picture 배치
        $item.each(function(i) {
          $(this).css({
            left: ((50 * i) + 10) + '%'
          });
          //indicator 공간만들기
          indicatorHtml += "<a href='#'></a>"
        });
        //indicator 집어넣기
        $indicator.html(indicatorHtml);
        //슬라이드 함수
        function slideShow(i) {
          $picsWrap.stop().animate({
            left: -50 * i + '%'
          }, sp);
          $item.eq(i).addClass('front', sp);
          $item.eq(i).siblings().removeClass('front');
          currentIndex = i;
          update();
        }
        //버튼 흐리게
        function update() {
          //indicator 변하기
          $indicator.children('a').removeClass('on');
          $indicator.find('a').eq(currentIndex).addClass('on');
          //첫번째 -> prev 흐리게
          if (currentIndex == 0) {
              $btn.find('.prev').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.prev').css({opacity: 1, cursor: 'pointer'});
            }
          //마지막 -> next 흐리게
          if (currentIndex == (count - 1)) {
              $btn.find('.next').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.next').css({opacity: 1, cursor: 'pointer'});
            }
        }
        //3초에 한번씩 실행
        function startTimer() {
          timer = setInterval(function() {
            var nextIndex = (currentIndex + 1) % count;
            slideShow(nextIndex);
          }, interval);
        }
        //일시정지
        function stopTimer() {
          clearInterval(timer);
        }
        //마우스 올리면 일시정지
        $pics.add($indicator).on({
          mouseenter: stopTimer,
          mouseleave: startTimer
        });
        //button 클릭하면 정지
        $btn.on({click: stopTimer});
        //button클릭하면 이전/다음으로 이동
        $btn.on('click', 'button', function() {
          if ($(this).hasClass('next')) {
              slideShow(currentIndex+1);
              } else {
                slideShow(currentIndex-1);
              }
        });
        //indicator 클릭하면 이동
        $indicator.on('click', 'a', function(e) {
          e.preventDefault();
          //클릭된 앵커의 인덱스 저장
          var i = $(this).index();
          //저장된 인덱스 값을 변경해서 이동시키기
          slideShow(i);
        });
        //함수실행
        slideShow(currentIndex);
        startTimer();
      });
      
      //section4 sns 스와이퍼
      var swiper = new Swiper('.swiper-sns', {
        slidesPerView: 2,
        spaceBetween: 30,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
      });
    }else if ($win.width() <= 768) {
      //poster swiper(section2)
      $('.pics-slide').each(function() {
        var $section = $(this),
            $pics = $(this).find('.pics'),
            $picsWrap = $pics.find('.pic-wrap'),
            $item = $picsWrap.find('a'),
            $indicator = $section.find('.indicator'),
            $btn = $section.find('.btn'),
            sp = 1000,
            currentIndex = 0,
            count = $item.length,//이미지 총개수
            interval = 3000,
            timer,
            indicatorHtml = '';
        //picture 배치
        $item.each(function(i) {
          $(this).css({
            left: ((100 * i) + 30) + '%'
          });
          //indicator 공간만들기
          indicatorHtml += "<a href='#'></a>"
        });
        //indicator 집어넣기
        $indicator.html(indicatorHtml);
        //슬라이드 함수
        function slideShow(i) {
          $picsWrap.stop().animate({
            left: -100 * i + '%'
          }, sp);
          $item.eq(i).addClass('front', sp);
          $item.eq(i).siblings().removeClass('front');
          currentIndex = i;
          update();
        }
        //버튼 흐리게
        function update() {
          //indicator 변하기
          $indicator.children('a').removeClass('on');
          $indicator.find('a').eq(currentIndex).addClass('on');
          //첫번째 -> prev 흐리게
          if (currentIndex == 0) {
              $btn.find('.prev').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.prev').css({opacity: 1, cursor: 'pointer'});
            }
          //마지막 -> next 흐리게
          if (currentIndex == (count - 1)) {
              $btn.find('.next').css({opacity: 0.5, cursor: 'default'});
            } else {
                $btn.find('.next').css({opacity: 1, cursor: 'pointer'});
            }
        }
        //3초에 한번씩 실행
        function startTimer() {
          timer = setInterval(function() {
            var nextIndex = (currentIndex + 1) % count;
            slideShow(nextIndex);
          }, interval);
        }
        //일시정지
        function stopTimer() {
          clearInterval(timer);
        }
        //마우스 올리면 일시정지
        $pics.add($indicator).on({
          mouseenter: stopTimer,
          mouseleave: startTimer
        });
        //button 클릭하면 정지
        $btn.on({click: stopTimer});
        //button클릭하면 이전/다음으로 이동
        $btn.on('click', 'button', function() {
          if ($(this).hasClass('next')) {
              slideShow(currentIndex+1);
              } else {
                slideShow(currentIndex-1);
              }
        });
        //indicator 클릭하면 이동
        $indicator.on('click', 'a', function(e) {
          e.preventDefault();
          //클릭된 앵커의 인덱스 저장
          var i = $(this).index();
          //저장된 인덱스 값을 변경해서 이동시키기
          slideShow(i);
        });
        //함수실행
        slideShow(currentIndex);
        startTimer();
      });
      
      //section4 sns 스와이퍼
      var swiper = new Swiper('.swiper-sns', {
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
      });
    }
	});
})(jQuery);