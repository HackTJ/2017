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
  return true;
}
function removeClass(el, className) {
  if (!el) return false;
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
  return false;
}
function toggleClass(el, className) {
  if ( hasClass(el, className) )
    return removeClass(el, className);
  else 
    return addClass(el, className);
}
function getParentWithClass(el, className) {
  var parent = el.parentElement;
  while(parent != null && !parent.classList.contains(className))
    parent = parent.parentElement;
  return parent;
}
function getSiblingWithClass(el, className) {
  var sibling = el.nextElementSibling;
  while(sibling != null && !sibling.classList.contains(className))
    sibling = sibling.nextElementSibling;
  return sibling;
}


var isMobile = (window.innerWidth < 640);

// FAQ Section
// var faqContainer = document.querySelector('.faq-container');
// var pageGroup = document.querySelector('ul.page-group');
// var faqNav = document.querySelector('.faq-nav')
// var pages = Array.prototype.slice.call(document.querySelectorAll('.faq-container .page'));
// var tabs = document.querySelectorAll('.faq-nav .nav-item');
// var underline = document.querySelector('.underline');
// var tabWidth = tabs.item(0).clientWidth
// underline.style.width = tabWidth+"px"

// var tabClick = function(e){
// 	var old = document.querySelector('.nav-item.current');
// 	var t = e.target;
// 	if(!hasClass(t, 'faq-nav')) {
// 		while(!hasClass(t.parentElement, 'faq-nav')) {
// 			t = t.parentElement;
// 		}
// 		var num = parseInt(t.getAttribute('num'));
		
// 		pageGroup.style.left = '-'+num+'00%';
// 		underline.style.left = num*tabWidth+'px';


// 		removeClass(old, 'current');
// 		addClass(t, 'current');
// 	}
// 	return false;
// }
// faqNav.addEventListener("click", tabClick);
var openQuestion = function(group, question, answer){
  return function(e){
    var isOpen = toggleClass(group, 'is-open');
    var transitions = {};
    if(isOpen){
      transitions.height = answer.getAttribute('data-height');
      transitions.ease = Power2.easeOut;
    } else {
      transitions.height = 0;
      transitions.ease = Power2.easeOut;
    }
    console.log('tween', TweenMax.to);
    TweenMax.to(answer, 0.5, transitions);
  }
}
var questions = document.querySelectorAll('.question-group .question');
for(var i=0; i<questions.length; i++){
  var group = getParentWithClass(questions[i], 'question-group');
  var answer = getSiblingWithClass(questions[i], 'answer')
  answer.setAttribute("data-height", answer.clientHeight);
  answer.style.height = "0";
  group.addEventListener("click", openQuestion(group, questions[i], answer))
}

function initializeMap() {
  var hacktjStyle = new google.maps.StyledMapType(window.hacktjMapStyles, {name: "HackTJ Website"});
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: isMobile ? {lat: 38.819, lng: -77.189} : {lat: 38.819, lng: -77.209},
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
  });
  map.mapTypes.set('hacktj', hacktjStyle);
  map.setMapTypeId('hacktj');

  var marker = new google.maps.Marker({
    position: {lat: 38.818086, lng: -77.168323},
    map: map
  });
}
google.maps.event.addDomListener(window, 'load', initializeMap);

// ScrollMagic Code
if(!isMobile){
  var scrollController = new ScrollMagic.Controller();
  var segments = document.querySelectorAll('.animation-container');
  var scrollDistance = 0;
  var animations = [];
  for (i = 0; i < segments.length; ++i) {
    if(hasClass(segments[i], 'vertical')){
      scrollDistance += segments[i].clientHeight;
    } else if(hasClass(segments[i], 'horizontal')){
      scrollDistance += segments[i].clientWidth;
    }
    animations.push(segments[i]);
  }
  var totalHeight = ((document.height !== undefined) ? document.height : document.body.offsetHeight) - window.innerHeight;
  var scrollFactor = totalHeight / scrollDistance;

  var y = window.innerHeight/2.5;
  animations.forEach(function(segment){
    if( segment.childNodes[0] && !hasClass(segment, 'line-schedule')) {
      var child = segment.childNodes[0];
      var animateDuration = 0;
      var animations = {ease: Linear.easeNone};
      if(hasClass(segment, 'vertical')){ 
        animations.height = "100%"; 
        animateDuration = segment.clientHeight * 1.2;
      }
      if(hasClass(segment, 'horizontal')){ 
        animations.width = "100%"; 
        animateDuration = segment.clientWidth / 3.0;
      }
      animateDuration = animateDuration * scrollFactor;
      
      var scene = new ScrollMagic.Scene({offset: y, duration: animateDuration})
        .setTween(segment.childNodes[0], animations)
        .addTo(scrollController);

      y = y + animateDuration;
    } else if(hasClass(segment, 'line-schedule')) {
      var scene = new ScrollMagic.Scene({triggerElement: segment, offset: -segment.clientWidth/2, duration: segment.clientWidth})
        .setTween(segment.childNodes[0], {width: "100%"})
        // .addIndicators({name: "Y: "+segment.offsetY+" Duration: "+segment.clientWidth})
        .addTo(scrollController);

    }
  });
  var scene = new ScrollMagic.Scene({offset: y, duration: totalHeight-y})
        .setTween('#map-info', {transform: "scale(1)"})
        .addTo(scrollController)
        .on('end', function(){
          scrollController.destroy();
        });
}
