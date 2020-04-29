jQuery(function () {
   $(document).foundation();
   initAnimate();
   initFaqsAccordion();
   initTestimonialCarousel();
});


function initAnimate() {
   var condition = $('.animateBlock').size()
   // && false
   ;
   init(condition);

   function init(condition) {
       if (condition || condition == null) {
           $('.animateBlock').viewportChecker({
               classToAdd: 'animate_start',
               offset: '10%'
           });
       }
   }
}

function initFaqsAccordion() {
   var condition = $('.faqAccordion').size()
   // && false
   ;
   init(condition);

   function init(condition) {
       if (condition || condition == null) {
        jQuery('.faqAccordion .faqs-open-close').openClose({
            activeClass: 'active',
            opener: '.opener',
            slider: '.slide',
            animSpeed: 400,
            effect: 'slide'
        });
         

       }
   }
}

function initTestimonialCarousel() {

    var condition = $('.testimonialSliderHolder').size()
    // && false
    ;
    init(condition);
  
    function init(condition) {
        if (condition || condition == null) {
  
            $('.testimonialSliderHolder').slick({
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button" tabindex="0"><i class="icon icon-left-arrow"></i> </button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button" tabindex="0"><i class="icon icon-right-arrow"></i></button>',
                centerMode: true,
                slidesToShow: 3,
                responsive: [
                    {
                      breakpoint: 860,
                      settings: {
                        slidesToShow: 1,
                      }
                    }
                  ]
            });
            
        }   
    }
}

 //= plugins.js

