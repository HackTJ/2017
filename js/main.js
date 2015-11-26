// Helpers
function hasClass(el, className) {
  if (!el) return false;
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}
function addClass(el, className) {
  if (!el) return false;
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}
function removeClass(el, className) {
  if (!el) return false;
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

// FAQ Section
var faqContainer = document.querySelector('.faq-container');
var pageGroup = document.querySelector('ul.page-group');
var faqNav = document.querySelector('.faq-nav')
var pages = Array.prototype.slice.call(document.querySelectorAll('.faq-container .page'));
var tabs = document.querySelectorAll('.faq-nav .nav-item');
var underline = document.querySelector('.underline');
var tabWidth = tabs.item(0).clientWidth
underline.style.width = tabWidth+"px"

var tabClick = function(e){
	var old = document.querySelector('.nav-item.current');
	var t = e.target;
	if(!hasClass(t, 'faq-nav')) {
		while(!hasClass(t.parentElement, 'faq-nav')) {
			t = t.parentElement;
		}
		var num = parseInt(t.getAttribute('num'));
		
		pageGroup.style.left = '-'+num+'00%';
		underline.style.left = num*tabWidth+'px';


		removeClass(old, 'current');
		addClass(t, 'current');
	}
	return false;
}
faqNav.addEventListener("click", tabClick);

mapboxgl.accessToken = 'pk.eyJ1IjoicGFuZHJpbmdhIiwiYSI6InVNam1fUG8ifQ.kTHtHlioueaoXLCEqpNZlQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/pandringa/cihfovl3k00nhrom4u9pjte7x', //stylesheet location
    center: [-77.179, 38.819], // starting position
    zoom: 13 // starting zoom
});