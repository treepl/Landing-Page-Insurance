jQuery(function () {
   $(document).foundation();
   initAnimate();
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

         

       }
   }
}

 //= plugins.js

