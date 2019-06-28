/* global Cookies */

const userId = Cookies.get("userId");
if(Cookies.get("userId") === void(0)) {
  location.href="login.html";
}

console.log(userId);

$(function(){
  
});