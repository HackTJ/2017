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

// Event Listeners
var validate = function(e){
	if ( hasClass(button, 'is-disabled') && input.value ) {
		removeClass(button, 'is-disabled');
	} else if( !hasClass(button, 'is-disabled') && !input.value && !hasClass(button, 'is-done') ) {
		addClass(button, 'is-disabled');
	}
	if ( hasClass(button, 'is-done') ) {
		removeClass(button, 'is-done');
	}
}

input.addEventListener('keyup', validate);
input.addEventListener('focus', validate);
input.addEventListener('blur', validate);

var submit = function(e){
	addClass(button, 'is-done');

	var type = "invalid";

	if(type !== "email" && type !== "phone"){
		confirmation.innerHTML = "Uh oh - that doesn't look like a phone number or email address.";
		addClass(confirmation, 'is-shown');

		addClass(icon, 'icon-close-circle');
	} else {
		addClass(icon, 'icon-spin');
		addClass(icon, 'icon-config');
		setTimeout(function(){
			removeClass(icon, 'icon-spin');
			removeClass(icon, 'icon-config');
			
			addClass(icon, 'icon-check');
			addClass(input, 'is-done');

			confirmation.innerHTML = "We'll send you " + (type == "phone" ? "a text message" : "an email") + ".";
			addClass(confirmation, 'is-shown');
		}, 1000);
	}
}
button.addEventListener('click', submit);