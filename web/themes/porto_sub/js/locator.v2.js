(function ($, Drupal) {

    'use strict';

    var locatorServiceResponse = null;

    $('document').ready(
        function() {
            v2locatorConfig.version = 1;
            v2locatorConfig.url += v2locatorConfig.version + '/';
            if (v2locatorConfig.validate === 'zip') {
                v2locatorConfig.url += v2locatorConfig.validate + '_check.php';
                $("#locatorSubmit").click(postToLocator);
            } else if ($('#locatorSubmit').length) {
                v2locatorConfig.url += 'locate.php';
                $("#locatorSubmit").click(postToLocator);
            } else if ($('#locatorResults').length) {
                v2locatorConfig.url += 'my_dealer.php';
                loadResultsFromLID();
            } else {
                alert('locator.v2.js: this page is not coded correctly. Open javascript console for more details.');
                console.log('This page is not coded correctly.');
                console.log('You must have an element with id="locatorSubmit" to use the input form, ');
                console.log(' id="locatorResults" to display results, ');
                console.log(' or one of each to display the results on the same page as the input form.  ');
            }
        }
    );

    var loadResultsFromLID = function() {
        var lid = getParameterByName('lid');
        if ((! lid) || (lid.length != 32)) {
            setOutputMessage("The query string parameter lid does not contain proper input", true, true);
            return;
        }
        var requestObject = new Object();
        requestObject.lid = lid;

        var url = v2locatorConfig.url;
        $.ajax({
            type: "POST",
            url: url,
            data: requestObject,
            dataType: 'json',
            success: function(response) {
                locatorServiceResponse = response;
                $("#locatorMessage").hide();        // hide the message div
                $("#locatorResults").show();        // show the response div
                locatorPopulateDealer(response);    // populate dealer information text output
                locatorPopulateLead(response);
                locatorEnableGmap(response);        // populate google maps
            },
            error: function(resonse) {
                setOutputMessage("We are encountering a technical difficulty.", true, true);
            }
        });
    };

    var postToLocator = function() {
        $("#locatorSubmit").prop("disabled", true);
        $("#locatorMessage").hide();        // hide the message div

        var url = v2locatorConfig.url;
        if (! locatorValidateInput()) {
            $("#locatorSubmit").prop("disabled", false);
            return false;
        }
        var errorHtml = 'Please <a href=".">retry submitting your information</a>. You must fill in all the fields and click the "I am not a robot" box.';

        $.ajax({
            type: "POST",
            url: url,
            data: $("#contactForm").serialize(),
            dataType: 'json',
            success: function(response) {
                if (response.redirect && response.redirect.startsWith('/')) {
                    window.location.assign(response.redirect);
                } else {
                    locatorServiceResponse = response;
                    $("#locatorMessage").hide();        // hide the message div
                    $("#locatorForm").hide();           // hide the form div
                    $("#locatorResults").show();        // show the response div
                    locatorSetMainHeader();             // set the page heading to thank you message
                    locatorPopulateDealer(response);    // populate dealer information text output
                    $('html, body').animate({scrollTop: $("#locatorResults").offset().top}, 2000);
                    locatorEnableGmap(response);        // populate google maps
                }
            },
            error: function(response) {
                var enableSubmitButton = true;
                if (response.responseJSON) {
                    data = response.responseJSON;
                    if (data.user_error_message) {
                        errorHtml = data.user_error_message;
                    }
                    if (data.error && data.error == 'ip_abuse') {
                        errorHtml = "We have received too many requests from your network location. Please try again later. If you feel that we are mistaken about this, please email or call our customer service.";
                        enableSubmitButton = false;
                    }
                }
                $("#locatorSubmit").prop("disabled", ! enableSubmitButton);
                setOutputMessage(errorHtml, true, false);
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
                console.log('An error occurred: ');
                console.log(response);
            }
        });
        return false;
    };

    function locatorSetMainHeader() {
        var pageHeaderElementId = "innerjumbo";
        var pageHeaderHtml = "<h1>Thank You!</h1>";
        if (v2locatorConfig.headerElement) {
            pageHeaderElementId = v2locatorConfig.headerElement;
        }
        if (v2locatorConfig.headerHtml) {
            pageHeaderHtml = v2locatorConfig.headerHtml;
        }
        $("#" + pageHeaderElementId).empty();
        $("#" + pageHeaderElementId).append(pageHeaderHtml);
                        
    }

    function locatorEnableGmap(serviceResponse) {
        if (v2locatorConfig.enableMap) {
            $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBaeqF24glircv34F4TD4MvKqBTkrYX084&callback=initMap", 
                        function(data, textStatus, jqxhr) {
                            // console.log(data); // Data returned
                            // console.log(textStatus); // Success
                            // console.log(jqxhr.status); // 200
                            console.log("google maps script loaded.");
                        });
        } else {
            $('#map').hide();
        }
    }

    function initMap() {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10
      });
      var geocoder = new google.maps.Geocoder();

      geocodeAddress(geocoder, map);
    }

    function geocodeAddress(geocoder, resultsMap) {
      var locatorGmapsStoreAddress = locatorServiceResponse.dealer.full_address;
      var locatorDealerName = locatorServiceResponse.dealer.name;
      geocoder.geocode({'address': locatorGmapsStoreAddress}, function(results, status) {
        if (status === 'OK') {
          resultsMap.setCenter(results[0].geometry.location);
          resultsMap.setZoom(15);
          var marker = new google.maps.Marker({
            map: resultsMap,
            position: results[0].geometry.location,
            title: locatorDealerName,
            icon: {url: 'https://masterspasdealer.com/assets/img/masterspas_marker.png',
                        size: {width: 55, height: 55}
                  }
          });
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    function locatorRound(value, decimals) {
          return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function setRedemptionCode(data) {
        if (data.lead.code && data.lead.lead_for) {
            var tmpVal = data.lead.code + " " + data.lead.lead_for;
            appendDataToOutput("locatorLeadRedemptionCode", tmpVal.toUpperCase());
        }
    }

    function appendDataToOutput(pageElementId, fieldValue) {
        var pageElement = $("#" + pageElementId);
        if (pageElement.length) {
            if (fieldValue) {
                pageElement.append(fieldValue);
            } else {
                pageElement.hide();
            }
        }
    }

    function locatorPopulateLead(data) {
        appendDataToOutput("locatorLeadFirstName", data.lead.first_name);
        appendDataToOutput("locatorLeadLastName", data.lead.last_name);
        appendDataToOutput("locatorLeadStreet", data.lead.street);
        appendDataToOutput("locatorLeadCity", data.lead.city);
        appendDataToOutput("locatorLeadState", data.lead.state);
        appendDataToOutput("locatorLeadZip", data.lead.zip);
        appendDataToOutput("locatorLeadPhone", data.lead.phone);
        appendDataToOutput("locatorLeadEmail", data.lead.email);
        appendDataToOutput("locatorLeadCode", data.lead.code);
        appendDataToOutput("locatorLeadFor", data.lead.lead_for);
        setRedemptionCode(data);
    }

    function locatorPopulateDealer(data) {
        var newElement = null;
        if (typeof dealer_edit_url !== 'undefined') {
            newElement = "<a href=\"" + dealer_edit_url + data.dealer.id + "\">" + data.dealer.id + "</a>";
        }
        appendDataToOutput("locatorDealerId", newElement);
        $("#locatorDealerName").append(data.dealer.name);
        $("#locatorDealerAddress").append(data.dealer.full_address);
        $("#locatorDealerPhone").append(data.dealer.phone);
        if (data.dealer.fax) {
            $("#locatorDealerFax").append("Fax:" + data.dealer.fax);
        }
        // email: text and link
        $("#locatorDealerEmail").append(data.dealer.email);
        $("#locatorDealerEmail").attr("href", "mailto:" + data.dealer.email);
        // url:  text and link
        $("#locatorDealerUrl").append(data.dealer.url);
        $("#locatorDealerUrl").attr("href", "http://" + data.dealer.url);
        // distance: value and units NOTE: distance may be negative, only display if >= 0
        var distToDealer = -1;
        if (data.distance && data.distance.units && data.distance.dealer_address_present) {
            var tdistance = data.distance[data.distance.units];
            if ($.isNumeric(tdistance)) {
                distToDealer = locatorRound(tdistance, 1);
            }
        }
        if ((distToDealer >= 0.0) && (distToDealer < v2locatorConfig.maxDistanceToDisplay)) {
            $("#locatorDistance").append(distToDealer + " " + data.distance.units);
        } else {
            v2locatorConfig.enableMap = false;
            $("#locatorDistance").parent().hide();
        }

        appendDataToOutput("locatorDealerAssignmentMethod", getAssignmentMethod(data));
        
        // logo: set src attribute and show()
        if (data.dealer.logo) {
            $("#locatorDealerLogo").attr("src", data.dealer.logo); 
            $("#locatorDealerLogo").show();
        }
        // photos: set src attribute and show()
        var photoToShow = v2locatorConfig.photoDefault;
        if (data.dealer.photos && data.dealer.photos[0]) {
            photoToShow = data.dealer.photos[0];
        }
        if (photoToShow) {
            $("#locatorDealerPhoto").attr("src", photoToShow); 
            $("#locatorDealerPhoto").show();
        }
    }

    function getAssignmentMethod(data) {
        var rv = "";
        if (data.assignment_method) {
            var pieces = data.assignment_method.split('.');
            rv = pieces[pieces.length - 1];
        }
        return rv;
    }

    function cleanPhone() {
        if ($('#phone').length) {
            var stringvalue = $('#phone').val().trim();
            stringvalue = stringvalue.replace(/^1/, '');
            stringvalue = stringvalue.replace(/^\+1/, '');
            stringvalue = stringvalue.replace(/[^0-9]/g, '');
            $('#phone').val(stringvalue);
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function validatePhone() {
        cleanPhone();
        var phoneNumber = $("#phone").val().trim();
        if (phoneNumber.length < 6) {
            return false;
        }
        var country = $("#country").val();
        if (country === 'US' || country === 'CA') {
            return phoneNumber.match(/^\d{10}$/);
        }
        return true;
    }

    function validateAll() {
        if (! validateZip()) {
            setOutputMessage('We need a valid zip/postal code', true, true)
            return false;
        }
        let lastName = $("#last_name").val().trim();
        let firstName = $("#first_name").val().trim();
        let phone = $("#phone").val().trim();
        if (! validatePhone()) {
            setOutputMessage('We need a valid phone number', true, true);
            return false;
        }
        let email = $("#email").val().trim();
        if (! validateEmail(email)) {
            setOutputMessage('We need a valid email address', true, true)
            return false;
        }
        if (lastName && firstName && phone && email) {
            // we're good
        } else {
            // no good
            setOutputMessage('Please fill in all required information on the form', true, true)
            return false;
        }
        return true;
    }

    function validateZip() {
        let zip = $("#zip").val().trim();
        let country = $("#country").val().trim();
        if (zip.length < 1) {
            return false;
        }
        if (country === 'US') {
            return  zip.match(/^\d{5}$/);
        }
        if (country === 'CA') {
            var isMatch = false;
            zip = zip.toUpperCase(zip);
            zip = zip.replace(/\s/g, '');
            var myregex = /([A-Z][0-9][A-Z])([0-9][A-Z][0-9])/;
            var mymatch = myregex.exec(zip);
            if (mymatch) {
                zip = mymatch[1] + " " + mymatch[2];
                isMatch =  zip.match(/^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]/);
                $("#zip").val(zip);
            }
            return isMatch;
        }
        return true;
    }

    function locatorValidateInput() {
        if (v2locatorConfig.validate == 'all') {
            return validateAll();
        } else if (! validateZip()) {
            setOutputMessage('We need a valid zip/postal code', true, true)
            return false;
        }
        return true;
    }

    var setOutputMessage = function(message, isError, isClientMsg) {
        let classToRemove = "error";
        let classToAdd = "noerror";
        let logLevel = "INFO";
        let messageSource = 'service';

        if (isError) {
            classToRemove = "noerror";
            classToAdd = "error";
            logLevel = "ERROR";
        }
        if (isClientMsg) {
            messageSource = 'client';
        }

        console.log(logLevel + '[' + messageSource + ']: ' + message);
        $("#locatorMessage").empty();
        $("#locatorMessage").removeClass(classToRemove);
        $("#locatorMessage").addClass(classToAdd);
        $("#locatorMessage").append('<p>' + message + '</p>');
        $("#locatorMessage").show();        // show the message div
    };

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


})(jQuery, Drupal);