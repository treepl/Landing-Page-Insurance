if(!window.__TreeplPaymentIsSet)
{
    //window.docReady
    !function(t,e){"use strict";t=t||"docReady";var n=[],o=!1,d=!1;function a(){if(!o){o=!0;for(var t=0;t<n.length;t++)n[t].fn.call(window,n[t].ctx);n=[]}}function c(){"complete"===document.readyState&&a()}(e=e||window)[t]=function(t,e){if("function"!=typeof t)throw new TypeError("callback for docReady(fn) must be a function");o?setTimeout(function(){t(e)},1):(n.push({fn:t,ctx:e}),"complete"===document.readyState||!document.attachEvent&&"interactive"===document.readyState?setTimeout(a,1):d||(document.addEventListener?(document.addEventListener("DOMContentLoaded",a,!1),window.addEventListener("load",a,!1)):(document.attachEvent("onreadystatechange",c),window.attachEvent("onload",a)),d=!0))}}("docReady",window);
    
    window.docReady(function()
    {
        initPayment();
    });
    
    function treeplPaymentIsSet()
    {
        window.__TreeplPaymentIsSet = true;
    }
    
    function getPaymentType(formEl)
    {
        var paymentTypeEl = formEl.querySelector('[name="paymentType"]');
        var paymentType = paymentTypeEl ? paymentTypeEl.value : null;
        return paymentType;
    }
    
    function initPayment()
    {
        var initedMethods = {};
        var paymentMethods = {
            STRIPE : "stripe",
            PAYPAL: "paypal"
        };
        var paymentForms = document.getElementsByTagName("form");
        
        for(var i = 0;i<paymentForms.length;i++)
        {
            var formEl = paymentForms[i];
            var amountFieldEl = formEl.querySelector('[name="Amount"]');
            if(amountFieldEl)
            {
                var paymentTypeEl = formEl.querySelector('[name="paymentType"]');
                paymentTypeEl.addEventListener('change', function (e) 
                {
                    paymentMethodChange(formEl);
                });     
                paymentMethodChange(formEl);
                
                initQuantityJS(formEl);
            }
        }  
        
        function paymentMethodChange(formEl)
        {
            var paymentType = getPaymentType(formEl);
            initPaymentType(formEl, paymentType);
        }
    
        function initPaymentType(formEl, paymentType)
        {
            switch(paymentType)
            {
                case paymentMethods.STRIPE: 
                {
                    initStripe(formEl);
                }
                break;
                default :
                {
                }
            }        
        }
        
        function initQuantityJS(formEl)
        {
            var quantityField = formEl.querySelector('[data-trp_quantity]');
            if(quantityField)
            {
                quantityField.addEventListener('change', function (e) 
                {
                    var price = getPrice(formEl);
                    var quantity = getQuantity(formEl);
                    
                    var priceTotal = price * quantity;
                    setAmount(formEl, priceTotal);
                });
            }
        }
    
        function initStripe(formEl)
        {
            if(!initedMethods[paymentMethods.STRIPE])
            {
                var zeroBasedCurrencies = {"BIF" : 1,"CLP" : 1,"DJF" : 1,"GNF" : 1,"JPY" : 1,"KMF" : 1,"KRW" : 1,"MGA" : 1,"PYG" : 1,"RWF" : 1,"UGX" : 1,"VND" : 1,"VUV" : 1,"XAF" : 1,"XOF" : 1,"XPF" : 1};
                var amountFieldEl = formEl.querySelector('[name="Amount"]');
                var paymentTypeEl = formEl.querySelector('[name="paymentType"]');
                var stripeDataEl = paymentTypeEl.querySelector('option[value="' + paymentMethods.STRIPE + '"]');
                if(stripeDataEl)
                {
                    var stripeData = stripeDataEl.dataset;
                    setupStripeProcess(stripeData);
                    initedMethods[paymentMethods.STRIPE] = true;
                }  
            }
    
            function setupStripeProcess(stripeData)
            {      
                var confObject = {};
                for(key in stripeData)
                {
                    confObject[key] = stripeData[key];
                }
            
                confObject.locale = confObject.locale ? confObject.locale : 'auto';
                confObject.token = function (token) 
                {
                    formEl.querySelector('[name="paymentData"]').value = token.id;
                    formEl.submit();
                    // You can access the token ID with `token.id`.
                    // Get the token ID to your server-side code for use.
                };
               
                var handler = StripeCheckout.configure(confObject);
    
                formEl.addEventListener('submit', function (e) 
                {
                    var paymentType = getPaymentType(formEl);
                    if(paymentType == paymentMethods.STRIPE)
                    {
                        var paymentDataEl = formEl.querySelector('[name="paymentData"]');
                        if(paymentDataEl && paymentDataEl.value == "")
                        {                    
                            var orderName = getOrderName(formEl);
                            var orderDescription = getOrderDescription(formEl);
                            
                            var price = getPrice(formEl);
                            var quantity = getQuantity(formEl);
                            
                            var priceTotal = price * quantity;
                            setAmount(formEl, priceTotal);
                            
                            var multiplier = 1;
                            
                            if(!zeroBasedCurrencies[stripeData.currency.toUpperCase()])
                            {
                                multiplier = 100;
                            }                                           
                            
                            // Open Checkout with further options:
                            handler.open({
                                name: orderName,
                                description: orderDescription,
                                currency: stripeData.currency,
                                amount: (priceTotal * multiplier)
                            });
                            e.preventDefault();
                        }
                    }
                });
    
                // Close Checkout on page navigation:
                window.addEventListener('popstate', function() {
                    handler.close();
                });            
            }
        }
        
        function getOrderName(formEl)
        {
            var order_name = formEl.name;
            var formData = formEl.dataset;
            if(formData && formData.trp_order_name)
            {
                order_name = formData.trp_order_name;
            }
           
            return order_name;
        }
        
        function getOrderDescription(formEl)
        {
            var order_description = "";
            var formData = formEl.dataset;
            if(formData && formData.trp_order_description)
            {
                order_description = formData.trp_order_description;
            }
            
            return order_description;
        }
        
        function setAmount(formEl, value)
        {
            var amount = 0;
            var amountFieldEl = formEl.querySelector('[name="Amount"]');          
            
            if(amountFieldEl)
            {
                amountFieldEl.value = value;
            }
            
            return amount;
        }
        
        function getPrice(formEl)
        {
            var amount = 0;
        
            var amountFieldEl = formEl.querySelector('[name="Amount"]');               
            if(amountFieldEl)
            {
                var amountData = amountFieldEl.dataset;
                amount = amountData && amountData.trp_price ? amountData.trp_price : amount;
            }
            
            var eventIdEl = formEl.querySelector('[name="eventId"]');
            if(eventIdEl)
            {
                var eventData = eventIdEl.dataset;
                amount = eventData && eventData.trp_price ? eventData.trp_price : amount;
            }
            
            return amount;
        }
        
        function getQuantity(formEl)
        {
            var quantity = 1;
            var quantityEl = formEl.querySelector('[data-trp_quantity]');
    
            if(quantityEl && quantityEl.value)
            {
                quantity = quantityEl.value;
            }
            
            return quantity;
        }
    }
    
    
    treeplPaymentIsSet();
}