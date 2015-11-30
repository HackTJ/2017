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

var isMobile = (window.innerWidth < 640);

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
    center: isMobile ? [-77.189, 38.819] : [-77.209, 38.819], // starting position
    zoom: 12 // starting zoom
  })
  map.on('style.load', function () {
    map.addSource("markers", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-77.168323, 38.818086]
                },
                "properties": {
                    "marker-symbol": "marker"
                }
            }]
        }
    });

    map.addLayer({
        "id": "markers",
        "type": "symbol",
        "source": "markers",
        "layout": {
            "icon-image": "{marker-symbol}-15",
            "icon-size": 1.5
        },
        "paint": {
            "text-size": 12
        }
    });
});


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
