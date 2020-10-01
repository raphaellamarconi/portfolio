
(function($) {
"use strict";
	
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

	/* Preloader */
	var win = $(window);
	win.on('load',function() {
		$('.tw-loader').delay(100).fadeOut('slow');
		$(".none-block").removeClass("display-none").addClass("display-block");
		barfiller_progress();
	});
	
	/*Home Background*/
	if(home_page == 'video_background'){
		$('.jarallax').jarallax({
			speed: 0.2
		});		
	}else if(home_page == 'water_fade_background') {
		if (typeof $.fn.ripples == 'function') {
			try {
				$('.ripple').ripples({
					resolution: 512,
					dropRadius: 20,
					perturbance: 0.04			
				});
			} catch (e) {
				$('.error').show().text(e);
			}
		}
	}
	
	/* Portfolio */
	$('#tp_portfolio').imagesLoaded( function() {
		$('.grid-items').isotope({
			itemSelector: '.grid-item',
			percentPosition: true
		});
	});
	
	/* Blog */
	$('#tp_blog').imagesLoaded( function() {
		$('.grid-blogs').isotope({
			itemSelector: '.grid-blog',
			percentPosition: true
		});
	});

	/* animatedheadline */
	$('.clip').animatedHeadline({
		animationType: 'clip'
	});

	/* animatedModal */	
	$('.navbar-nav .nav-link[href^="#"]').each(function() {
		$(this).animatedModal({
			animatedIn:'slideInUp',
			animatedOut:'slideOutDown',
			animationDuration:'0.5s',
			color:animatedColor,
			// Callbacks
			beforeOpen: function() {
				$("#" + this.modalTarget).css({
					animationDelay: "0.5s",
					animationFillMode: "both"
				});
				$('.grid-items').isotope('destroy');
				$('.grid-blogs').isotope('destroy');
				$('.grid-items').isotope(); // re-initialize
				$('.grid-blogs').isotope(); // re-initialize
			},
			afterOpen: function() {
				$("#" + this.modalTarget).css({
					animationFillMode: "none",
					animationDelay: "0.5s"
				});				
			},
			beforeClose: function() {
				$("#" + this.modalTarget).css({
					animationDelay: "0.5s",
					animationFillMode: "both"
				});			
			},
			afterClose: function() {
				$("#" + this.modalTarget).css({
					animationFillMode: "none",
					animationDelay: "0.5s"
				});				
			}
		});
	});
	
	resetForm("contact-form");
	$("#sent_message").html('');
	
	//Form Submit
    $('.submit-form-class').on('click', function () {
        $("#contact-form").submit();
    });

})(jQuery);

//Reset Form
function resetForm(id) {
    $('#' + id).each(function () {
        this.reset();
    });
}

function barfiller_progress(){
	"use strict";
	
	var duration = 1000;
 	$.each(skillsdata, function (key, obj) {
		var sdata = JSON.parse(obj.post_content);
		$('.'+sdata.alias).barfiller({
			barColor: skill_barColor,
			duration: duration
		});
		
		duration = duration+1000;
	});
}

//Sent Contact Form Message
function onSentContactFormMessage() {
	"use strict";
	
	$("#sent_message").html('');
    $.ajax({
        "type": "POST",
        "url": $("#sentContactFormMessageId").val(),
        "dataType": "json",
        "data": $('#contact-form').serialize(),
        async: true,
        cache: false,
        timeout: 30000,
        error: function () {
            return true;
        },
        "success": function (response) {
            var msgType = response.msgType;
            var msg = response.msg;

            if (msgType == "success") {
				grecaptcha.reset();
				resetForm("contact-form");
				var sent_message = '<div class="alert alert-success alert-dismissible fade show" role="alert">'+msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				
				$("#sent_message").html(sent_message);
            } else {
				var sent_message = '<div class="alert alert-danger alert-dismissible fade show" role="alert">'+msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$("#sent_message").html(sent_message);
            }
        }
    });
}

//Error Show
function showPerslyError() {
    $('.parsley-error-list').show();
}

//Form Submit
jQuery('#contact-form').parsley({
    listeners: {
        onFieldValidate: function (elem) {
            if (!$(elem).is(':visible')) {
                return true;
            }else {
                showPerslyError();
                return false;
            }
        },
        onFormSubmit: function (isFormValid, event) {
            if (isFormValid) {
                onSentContactFormMessage();
                return false;
            }
        }
    }
});
