if(typeof jQuery=='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
    jqTag.onload = myJQueryCode;
    headTag.appendChild(jqTag);
} else {
     myJQueryCode();
}


var fileref=document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");
fileref.setAttribute("href", "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
document.getElementsByTagName("head")[0].appendChild(fileref);

var fileref1=document.createElement("link");
fileref1.setAttribute("rel", "stylesheet");
fileref1.setAttribute("type", "text/css");
fileref1.setAttribute("href", "https://raw.githubusercontent.com/pianbjtech/test_cdn/master/webwidget.css");
document.getElementsByTagName("head")[0].appendChild(fileref1);


var emailuser = document.querySelector('script[id-widget="balesin"]').getAttribute('username-widget');

var image_bot_msg = "";

var bodyTag = document.getElementsByTagName("body")[0];
var mybo = document.createElement('mybot');
bodyTag.appendChild(mybo);

function myJQueryCode() {

	$(document).ready(function() {
		// ------------------------------------------ Toggle chatbot -----------------------------------------------

		imageFn(emailuser);
		welcomeMessageFn(emailuser);

		$('.profile_div').click(function() {
			$('.profile_div').fadeToggle();
			$('.chatCont').fadeToggle();
			$('.bot_profile').fadeToggle();
			$('.chatForm').fadeToggle();
			document.getElementById('chat-input').focus();
		});

		$('.closebox').click(function() {
			$('.profile_div').fadeToggle();
			$('.chatCont').fadeToggle();
			$('.bot_profile').fadeToggle();
			$('.chatForm').fadeToggle();
		});

	});



	// Credentials
	var baseUrl = "http://94d38c48.ngrok.io";

	//---------------------------------- Add dynamic html bot content(Widget style) ----------------------------
	// You can also add the html content in html page and still it will work!
	var mybot = '<div class="chatCont" id="chatCont">'+
								'<div class="bot_profile">'+
									'<div class="bot_name">'+
										'<img src="" class="bot_p_img">'+
										'<h4>'+emailuser+'</h4>'+
										'<div class="closebox close">'+
											'<i class="fa fa-times" aria-hidden="true"></i>'+
										'</div>'+
									'</div>'+
								'</div><!--bot_profile end-->'+
								'<div id="result_div" class="resultDiv">'+
								'</div>'+
								'<div class="chatForm" id="chat-div">'+
								'<div class="powered-widget"><img src="https://raw.githubusercontent.com/pianbjtech/test_cdn/master/powered-widget.png"></div>'+
									'<div class="spinner">'+
										'<div class="bounce1"></div>'+
										'<div class="bounce2"></div>'+
										'<div class="bounce3"></div>'+
									'</div>'+
									'<div class="msger-inputarea">'+
										'<input type="text" id="chat-input" autocomplete="off" placeholder="Type your message here..."'+ 'class="form-control bot-txt"/>'+
										'<button type="button" class="msger-send-btn"><img src="https://i.ibb.co/xCKV6t2/send.png"></button>'+
									'</div>'+
								'</div>'+
							'</div><!--chatCont end-->'+

							'<div class="profile_div">'+
								'<div class="row">'+
									'<div class="col-hgt">'+
										'<img src="https://raw.githubusercontent.com/pianbjtech/test_cdn/master/balesin-logo-widget.png" style="width: 85px;">'+
									'</div><!--col-hgt end-->'+
									// '<div class="col-hgt">'+
									// 	'<div class="chat-txt">'+
									// 		'Chat with us now!'+
									// 	'</div>'+
									// '</div><!--col-hgt end-->'+
								'</div><!--row end-->'+
							'</div><!--profile_div end-->';

	$("mybot").html(mybot);

	// Here, do whatever you want


	// Session Init (is important so that each user interaction is unique)--------------------------------------
	var session = function() {
		// Retrieve the object from storage
		if(sessionStorage.getItem('session')) {
			var retrievedSession = sessionStorage.getItem('session');
		} else {
			// Random Number Generator
			var randomNo = Math.floor((Math.random() * 1000) + 1);
			// get Timestamp
			var timestamp = Date.now();
			// get Day
			var date = new Date();
			var weekday = new Array(7);
			weekday[0] = "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			var day = weekday[date.getDay()];
			// Join random number+day+timestamp
			var session_id = randomNo+day+timestamp;
			// Put the object into storage
			sessionStorage.setItem('session', session_id);
			var retrievedSession = sessionStorage.getItem('session');
		}
		return retrievedSession;
		// console.log('session: ', retrievedSession);
	}

	// Call Session init
	var mysession = session();


	// on input/text enter--------------------------------------------------------------------------------------
	$('#chat-input').on('keyup keypress', function(e) {
		var keyCode = e.keyCode || e.which;
		var text = $("#chat-input").val();
		var email = emailuser; //$('#email-hidden').val();
		if (keyCode === 13) {
			if(text == "" ||  $.trim(text) == '') {
				e.preventDefault();
				return false;
			} else {
				$("#chat-input").blur();
				setUserResponse(text);
				// send(text);
				send2(text, email);
				e.preventDefault();
				return false;
			}
		}
	});

	$(".msger-send-btn").on("click", function(){
		var text = $("#chat-input").val();
		var email = emailuser; //$('#email-hidden').val();
		if(text == "" ||  $.trim(text) == '') {
			e.preventDefault();
			return false;
		} else {
			$("#chat-input").blur();
			setUserResponse(text);
			send2(text, email);
			return false;
		}
	});

	//------------------------------------------- Send request to API.AI ---------------------------------------


	//------------------------------------------- Main function ------------------------------------------------
	function main(data) {
		var action = data.result.action;
		var speech = data.result.fulfillment.speech;
		// use incomplete if u use required in api.ai questions in intent
		// check if actionIncomplete = false
		var incomplete = data.result.actionIncomplete;
		if(data.result.fulfillment.messages) { // check if messages are there
			if(data.result.fulfillment.messages.length > 0) { //check if quick replies are there
				var suggestions = data.result.fulfillment.messages[1];
			}
		}
		switch(action) {
			// case 'your.action': // set in api.ai
			// Perform operation/json api call based on action
			// Also check if (incomplete = false) if there are many required parameters in an intent
			// if(suggestions) { // check if quick replies are there in api.ai
			//   addSuggestion(suggestions);
			// }
			// break;
			default:
				setBotResponse(speech);
				if(suggestions) { // check if quick replies are there in api.ai
					addSuggestion(suggestions);
				}
				break;
		}
	}


	//------------------------------------ Set bot response in result_div -------------------------------------
	function setBotResponse(val) {
		console.log("HASIL RETURN DARI FLASK: " +val);
		setTimeout(function(){
			var BotResponse = '';

			BotResponse += '<div class="botResponses"> \
							<div class="botImg" style="background-image: url('+image_bot_msg+')"> \
							</div> \
							<div class="botResult"> \
								<div class="msg-info"> \
									<div class="msg-info-name">'+emailuser+'</div> \
									<div class="msg-info-time">' + formatDate(new Date()) + '</div> \
								</div> \
								<div class="msg-text">'+val+'</div> \
							</div> \
							</div> \
							<div class="clearfix"></div>';
			$(BotResponse).appendTo('#result_div');

			scrollToBottomOfResults();
			hideSpinner();
		}, 500);
	}


	//---------------------------------- Scroll to the bottom of the results div -------------------------------
	function scrollToBottomOfResults() {
		var terminalResultsDiv = document.getElementById('result_div');
		terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
	}


	//---------------------------------------- Ascii Spinner ---------------------------------------------------
	function showSpinner() {
		$('.spinner').show();
	}
	function hideSpinner() {
		$('.spinner').hide();
	}


	//------------------------------------------- Suggestions --------------------------------------------------
	function addSuggestion(textToAdd) {
		setTimeout(function() {
			var suggestions = textToAdd.replies;
			var suggLength = textToAdd.replies.length;
			$('<p class="suggestion"></p>').appendTo('#result_div');
			$('<div class="sugg-title">Suggestions: </div>').appendTo('.suggestion');
			// Loop through suggestions
			for(i=0;i<suggLength;i++) {
				$('<span class="sugg-options">'+suggestions[i]+'</span>').appendTo('.suggestion');
			}
			scrollToBottomOfResults();
		}, 1000);
	}

	// on click of suggestions get value and send to API.AI
	$(document).on("click", ".suggestion span", function() {
		var text = this.innerText;
		setUserResponse(text);
		send(text);
		$('.suggestion').remove();
	});
	// Suggestions end -----------------------------------------------------------------------------------------
// });

//------------------------------------ POSTBACK value from button in result_div -------------------------------------
	
	function PopupCenter(url, title, w, h, resize) {
		// Fixes dual-screen position                         Most browsers      Firefox
		var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
		var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var systemZoom = width / window.screen.availWidth;
		var left = (width - w) / 2 / systemZoom + dualScreenLeft
		var top = (height - h) / 2 / systemZoom + dualScreenTop
		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left +', resizable=' + resize);

		if (window.focus) newWindow.focus();
	}

	function postBack(val){
		var text = val
		var email = emailuser; //$('#email-hidden').val();
		
		if(text == "" ||  $.trim(text) == '') {
			return false;
		} else {
			$("#chat-input").blur();
			setUserResponse(text);
			// send(text);
			send2(text, email);
			return false;
		}
	}

	//------------------------------------------- Send request to bjtech.io ---------------------------------------
	function send2(text, email) {
		console.log("masuk post to send message to bot")
		//http://21791617.ngrok.io/chat/rahadhianirvangmailcom
		$.post(baseUrl + "/chat/" +email,
				{
					//csrfmiddlewaretoken:csrf,
					text:text,
				},
				function(jsondata, status){
					if(jsondata["status"]=="success"){
						response=jsondata["response"];
						if(response){setBotResponse(response);}
					}
				});
	}

	//------------------------------------- Set user response in result_div ------------------------------------
	function setUserResponse(val) {

		//var UserResponse = '<p class="userEnteredText">'+val+'</p><span>' + formatDate(new Date()) + '</span><div class="clearfix"></div>';

		var UserResponse = '<div class="msg right-msg"> \
								<div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"></div> \
								<div class="msg-bubble"> \
								<div class="msg-info"> \
									<div class="msg-info-name">You</div> \
									<div class="msg-info-time">' + formatDate(new Date()) + '</div> \
								</div> \
								<div class="msg-text">'+val+'</div> \
								</div> \
							</div>';

		$(UserResponse).appendTo('#result_div');
		$("#chat-input").val('');
		scrollToBottomOfResults();
		showSpinner();
		$('.suggestion').remove();
	}

	function HandlePopupResult(result) {
		var email = emailuser;
		var store_name = $('#store-name-hidden').val();
		var return_from_popup_order_id = result;
		console.log("RETURN FROM POPUP: " + return_from_popup_order_id);
		showSpinner();
		var responThanks = '';
		setTimeout(function(){
			responThanks += '<p class="botResult"> \
			Terima kasih sudah berbelanja di toko '+store_name+' Untuk mempercepat proses orderan kamu, \ jangan lupa kirim bukti pembayaran dengan mengetik \'Konfirmasi pembayaran\' \
			</p><div class="clearfix"></div>';
			responThanks += '<p class="botResult"> Berikut adalah Order ID kamu : ' +return_from_popup_order_id +'</p><div class="clearfix"></div>';
			$(responThanks).appendTo('#result_div');
			$("#chat-input").val('');
			scrollToBottomOfResults();
			hideSpinner();
		}, 500);
	}

	function HandlePopupConfirm(result) {
		var return_from_popup_name = result;
		console.log("RETURN FROM POPUP CONFIRM: " + return_from_popup_name);
		showSpinner();
		var responThanks = '';
		setTimeout(function(){
			responThanks += '<p class="botResult"> \
			'+return_from_popup_name+', terima kasih sudah melakukan pembayaran! Pembayaran kamu akan segera divalidasi, dan jangan lupa cek terus email kamu untuk pantau proses pengiriman barang. \
			</p><div class="clearfix"></div>';
			$(responThanks).appendTo('#result_div');
			$("#chat-input").val('');
			scrollToBottomOfResults();
			hideSpinner();
		}, 500);
	}

	function welcomeMessageFn(email){
		url = baseUrl + "/welcome_msg/" + email;
		$.post(url,
			function(jsondata, status){
				if(jsondata["status"]=="success"){
					response=jsondata["response"];
					if(response){setBotResponse(response);}
				}
			});
	}

	function imageFn(email) {
		// Code to run when the document is ready.
		// var location = new URL(window.location.href)
		// var locArray = location.pathname.split('/');
		// window.bot_id = locArray[2];
	
		url = baseUrl + "/img_bot/" + email;
		$.post(url,
			function(jsondata, status){
				if(jsondata["status"]=="success"){
					response=jsondata["response"];
	
					if(response){
						$("img.bot_p_img").attr("src", response);
						//$(".profile_div>.row>.col-hgt>img").attr("src", response);
						console.log(response)
						image_bot_msg = response;
					}
				}
			});
	}



	function formatDate(date) {
		const h = "0" + date.getHours();
		const m = "0" + date.getMinutes();
		
		return `${h.slice(-2)}:${m.slice(-2)}`;
	}

}