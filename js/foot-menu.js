/* globals mdc, state, MODE */

mdc.autoInit();

var lists = document.querySelectorAll('.mdc-bottom-navigation__list');
var activatedClass = 'mdc-bottom-navigation__list-item--activated';
for (var i = 0, list; list = lists[i]; i++) {
  list.addEventListener('click', function(event) {
    if(event.target.id === "EDIT"){
      state.mode = MODE.EDIT;
    }else if(event.target.id === "LINK"){
      state.mode = MODE.LINK;
    }else if(event.target.id === "DELETE"){
      state.mode = MODE.DELETE;
    }
    var el = event.target;
    while (!el.classList.contains('mdc-bottom-navigation__list-item') && el) {
      el = el.parentNode;
    }
    if (el) {
      var activatedItem = document.querySelector('.' + event.target.parentElement.parentElement.parentElement.className + ' .' + activatedClass);
      if (activatedItem) {
        activatedItem.classList.remove(activatedClass);
      }
      event.target.classList.add(activatedClass);
    }
  });
}
  
