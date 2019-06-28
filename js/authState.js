
// function getUID (){
//   let currentUID;

//   // ログイン状態の変化を監視
//   firebase.auth().onAuthStateChanged(function(user) {
//     //トークンリフレッシュのイベントは無視
//     if ((user && currentUID === user.uid) || (!user && currentUID === null)) {
//       return;
//     }
//     if (user) { 
//       currentUID = user.uid;
//       console.log("状態：ログイン",user);
      
//     } else {  
//       currentUID = null;
//       console.log("状態：ログアウト");
//       // if(document.referrer != "" &&  document.referrer != location.href ){
//       //   location.href = "login.html";
//       // }
//     }
//   })
// }
