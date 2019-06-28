/* globals Cookies */

$(function(){
  //ログアウト
  const logout=function() {
    firebase.auth().signOut().then(function() {
      console.log("ログアウトしました");
      Cookies.remove('userId');
      location.href = 'login.html'
    }).catch(function(error) {
      console.error("ログアウトエラー:", error);
    });
    return false;
  };
  
  //ログアウト
  $("#logout-button").click(logout);
  
});