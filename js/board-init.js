/* globals $, Cookies, BOARD_ID, startBoardDrwaing, pin_modal */

$(function(){

  if(BOARD_ID){//クエリからIDが取得できている時
    firebase.database().ref("board/"+BOARD_ID).once("value").then(snapshot => {
      if(snapshot.val()){ //クエリから取得したIDに該当するボードが存在する時
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
        }else{
          welcome_modal.open();
        }
      }else{ //クエリから取得したIDに該当するボードが存在しない時
        alert('お探しのボードは見つかりませんでした。\nOKボタンを押すとホームへ遷移します。');
        location.href="index.html";
      }
    })
  }else{//クエリからIDが取得できていない時
    alert('お探しのボードは見つかりませんでした。\nOKボタンを押すとホームへ遷移します。');
    location.href="index.html";
  }
});
