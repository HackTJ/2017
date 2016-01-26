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
function getChildWithClass(el, className) {
  var children = el.childNodes;
  for(var i=0; i<children.length; i++)
    if(children[i].classList && children[i].classList.contains(className)) return children[i];
}
function queryParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var HOST = "https://api.hacktj.org";
var mainBox = document.querySelector('.centered-box');
var eccItem = document.querySelector('li.ecc');
var fieldtripItem = document.querySelector('li.fieldtrip');
var statusMessage = document.querySelector('.status-container');
var userId = queryParam("id") || "null";
var userStatus = {};

function updateClasses(){
  if(userStatus.ecc){
    addClass(eccItem, "completed");
    document.querySelector('.filename.ecc').textContent = userStatus.ecc.filename;
    document.querySelector('.preview.ecc').href = userStatus.ecc.url;
  }else{
    removeClass(eccItem, "completed");
  }
  if(userStatus.fieldtrip){
    addClass(fieldtripItem, "completed");
    document.querySelector('.filename.fieldtrip').textContent = userStatus.fieldtrip.filename;
        document.querySelector('.preview.fieldtrip').href = userStatus.fieldtrip.url;

  }else{
    removeClass(fieldtripItem, "completed");
  }
  if(userStatus.ecc && userStatus.fieldtrip){
    addClass(statusMessage, "completed");
  }else{
    removeClass(statusMessage, "completed");
  }
}
filepicker.setKey("AcFwfLxwuTgOlZqJ5bWGez");
function upload(form_type){
  filepicker.pickAndStore({
      mimetypes: ['image/', 'application/pdf'],
      maxsize: 20*1024*1024,
      services: ['COMPUTER', 'GOOGLE_DRIVE', 'DROPBOX', 'EVERNOTE', 'SKYDRIVE', 'CLOUDDRIVE', 'GMAIL', 'FTP', 'CLOUDAPP', 'BOX'],
    },{
      location: 'S3',
      storeContainer: 'hacktj-forms',
      path: '/students/'+userId+'/',
      access: 'private'
    },
    function(results){
      userStatus[form_type] = {
        filename: results[0].filename,
        url: results[0].url
      }
      
      var request = new XMLHttpRequest();
      request.open('POST', HOST+'/forms/'+userId, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send(JSON.stringify(userStatus));
      updateClasses();
  });
}

// Get initial status
var request = new XMLHttpRequest();
request.open('GET', HOST+'/forms/'+userId, true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    userStatus = JSON.parse(request.responseText);
    updateClasses();
  } else {
    if(request.status == 404){
      addClass(mainBox, "not-found")
    }
  }
};
request.send();
