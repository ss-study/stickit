/* globals Cookies */

$(function(){

  $("#login-button").on("click", function() {
    // TODO: [done]ログイン処理
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    
    login(email, password).then(_ => {
      location.href="index.html";
    }).catch(error => {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        $("#login-form .help-block").text("E-mail or password is incorrect.");
        console.error('メールアドレスかパスワードが間違っています');
        $("#login-password").val("");
      }else {
        console.error("ログインエラー:", error);
      }
    });
    return false;
  });
  

});

// //ログイン
// const login = function() {
//   return function () {
    
//     const email = $("#email").val();
//     const password = $("#password").val();
    
//     firebase.auth().signInWithEmailAndPassword(email, password).then(function() { // 作成成功
//       console.log("ログインしました");
//       const userId = firebase.auth().currentUser.uid;
//       Cookies.set('userId', userId, { expires: 7 });
//       location.href = 'index.html'
//     }).catch(function(error) { 
//       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//         $("#login-form .help-block").text("メールアドレスかパスワードが間違っています。");
//         console.error('メールアドレスかパスワードが間違っています');
//         $("#password").val("");
//       }else {
//         console.error("ログインエラー:", error);
//       }
//     });
//     return false;
//   };
// };


// $("#login-form").submit(login());
  


// $("#login-form").submit(function() {
//   const email = $("#email").val();
//   const password = $("#password").val();
  
//   login(email, password).then(user => {
//     location.href = 'index.html';
//   }).catch(error => {
//     if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//       $("#login-form .help-block").text("メールアドレスかパスワードが間違っています。");
//       console.error('メールアドレスかパスワードが間違っています');
//       $("#password").val("");
//     }else {
//       console.error("ログインエラー:", error);
//     }
//   });
//   return false;
// });