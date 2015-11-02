// Helpers
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}
function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

// Elements
var input = document.querySelector('input.contact');
var button = document.querySelector('button.submit');
var icon = document.querySelector('button.submit .icon');
var confirmation = document.querySelector('.confirmation-text');

// Regular Expressions
var phoneNumber = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
var emailAddress = /^[^@]*@[a-z\-._]{1,}\.[a-z]{2,}$/i;

// Event Listeners
var validate = function(e){
	if ( hasClass(button, 'is-disabled') && input.value ) {
		removeClass(button, 'is-disabled');
	} else if( !hasClass(button, 'is-disabled') && !input.value && !hasClass(button, 'is-done') ) {
		addClass(button, 'is-disabled');
	}

	if ( hasClass(button, 'is-done') ) {
		removeClass(button, 'is-done');
		removeClass(icon, 'icon-check');
	}
	if ( hasClass(confirmation, 'is-shown') ) {
		removeClass(confirmation, 'is-shown');
	}

	// Do nothing if the user presses 
	if(event.keyCode === 13){
		submit({});
	}
}

input.addEventListener('keyup', validate);
input.addEventListener('focus', validate);
input.addEventListener('blur', validate);

var submit = function(e){
	console.log('submit');
	addClass(button, 'is-done');

	var type = "invalid";

	var value = input.value.trim();


	if( value.match(phoneNumber) ) {
		type = "phone"
	}else if( value.match(emailAddress) ) {
		type = "email";
	}

	if(type !== "email" && type !== "phone"){
		confirmation.innerHTML = "Uh oh - that doesn't look like a phone number or email address.";
		addClass(confirmation, 'is-shown');

		addClass(icon, 'icon-close-circle');
	} else {
		addClass(icon, 'icon-config');
		addClass(icon, 'icon-spin');
		
		// Universal Callback
		var cb = function(err, message) {
			removeClass(icon, 'icon-spin');
			removeClass(icon, 'icon-config');
			
			if(err) {
				addClass(icon, 'icon-close-circle');
			} else {
				addClass(icon, 'icon-check');
			}

			confirmation.innerHTML = message;
			addClass(confirmation, 'is-shown');
		}
		apiRequest(value, type, cb);
	}
	return false;
}

function apiRequest(value, type, callback){
	var request = new XMLHttpRequest();
	request.open("POST", "https://api.hacktj.org/interest/"+type);
	request.onreadystatechange = function() {
    if (this.readyState == 4) {
    	return callback(this.status!==200, this.responseText);
    }
	}
	var data = {};
	data[type] = value;
	request.setRequestHeader("Content-Type", "application/json");
	request.send(JSON.stringify(data));
}

button.addEventListener('click', submit);
