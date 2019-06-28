/* globals $ BOARD_ID */
//ボードの名前を捕捉
firebase.database().ref("board/"+BOARD_ID+"/name").on("value",function (snapshot) {
  $("#welcome-modal h5").text("Welcome to "+snapshot.val());
  $("#side-out .name").text(snapshot.val());
// }).then(function () {
//   // body...
// }).catch(function (error) {
//   console.log(error)
});