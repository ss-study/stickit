/* globals Promise Cookies logout userId */

/*未ログインユーザをログインページにリダイレクト */

firebase.database().ref("users/"+userId+"/name/").on("value", function (snapshot) {
  $("#username").text(snapshot.val());
});

$(function () {
  
  

  //ログアウト処理
  $("#logout-button").on("click", logout);

  //新規ボードの作成
  $("#create-board").submit(function () {
    const boardName = $("#board_name").val();
    const pin = $("#pin").val();
    const board = {
      name: boardName,
      pin: pin,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };
    const promise1 = new Promise(function (resolve, reject) {
      const board_id = firebase.database().ref("board/").push(board).key;
      resolve(board_id);
    });
        
    promise1.then(function (value) {
      firebase.database().ref("users/"+Cookies.get('userId')+"/boards/"+value).set(firebase.database.ServerValue.TIMESTAMP).then(function () {
        location.href="board.html?id="+value; 
      }).catch(function (error) {
        console.log(error);
      })
    });
    
    return false;
  })  
  
  // ボードの取得とイベントハンドラ追加
  const boardRef = firebase.database().ref("users/"+ Cookies.get("userId") +"/boards/").orderByValue();
  boardRef.off("child_added");
  boardRef.on("child_added", function(childSnapshot, prevChildKey) {
    //  カードの追加処理
    let divTag = $($("#template").html());
    const id = childSnapshot.key;
    divTag.attr('id', id);
    firebase.database().ref("board/"+id+"/name/").once("value").then(function (snapshot) {
      divTag.find("#board-name").text(snapshot.val());
    })
    
    const createdDate = new Date(parseInt(childSnapshot.val()));
    const year = createdDate.getFullYear();
    const month = parseInt(createdDate.getMonth())+1;
    const date = createdDate.getDate();
    divTag.find("#created-date").text(year+"/"+month+"/"+date);
    
    // firebase.database().ref("board/"+id+"/createdAt/").once("value").then(function (snapshot) {
    //   const createdDate = new Date(parseInt(snapshot.val()));
    //   const year = createdDate.getFullYear();
    //   const month = parseInt(createdDate.getMonth())+1;
    //   const date = createdDate.getDate();
    //   divTag.find("#created-date").text(year+"/"+month+"/"+date);
    // })
    divTag.children("a").attr("href", "board.html?id="+id);
    $("#board-cards").prepend(divTag);
    
    return false;
  });
  
});