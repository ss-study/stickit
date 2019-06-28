/* globals $, Cookies, BOARD_ID, startBoardDrwaing, pin_modal */

$(function(){
  
  const userId = Cookies.get("userId");
  if(userId != void(0)){
    firebase.database().ref(`users/${userId}/boards`).once("value").then(snapshot => {
      if(snapshot.hasChild(BOARD_ID)){
        startBoardDrwaing();
      } else {
        pin_modal.open();
      }
      $('#js-loader').delay(300).fadeOut(400);
    });
  }
});
