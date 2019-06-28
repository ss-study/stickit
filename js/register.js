
$(function(){
  
    
  $("#register-form").submit(function() {
    //TODO: アカウント登録処理
    const email = $("#register-email").val();
    const name = $("#register-username").val();
    const password = $("#register-password").val();
    
    createUserAccount(email, name, password).then(user => {
      console.log(user);
      location.href="index.html";
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        $("#register-form .help-block").text("The E-mail you typed is already in use.");
        console.error('入力されたメールアドレスは既に使用されています。');
        $("#login-password").val("");
      }else {
        console.error("アカウント登録エラー:", error);
      }
    });
    return false;
  });
  
  // //ゲストアカウントの作成
  // const CreateGuestAccount = function () {
  //   return function(){
      
  //     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  //       .then(function(user) {          
  //         firebase.auth().signInAnonymously()   
  //           .then(function(user) {                
  //             console.log("ゲストアカウントを作成しました:",user);
  //             const userId = firebase.auth().currentUser.uid;
  //             Cookies.set('userId', userId, { expires: 7 });
  //             //location.href = 'myBoard.html'
  //           })
  //           .catch(function(error) {              
  //             console.error("アカウント作成エラー:", error);
  //           });
  //       })  
  //       .catch(function(error) {
  //         console.error("永続性変更エラー:", error);
  //       });
  //   };
  // }
  
  // //ユーザーアカウントの作成
  // const createUserAccount= function() {
  //   return function () {
      
  //     const email = $("#email").val();
  //     const name = $("#username").val();
  //     const password = $("#password").val();
      
  //     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function(user) {  
  //       firebase.auth().createUserWithEmailAndPassword(email, password).then(function() { // 作成成功
  //         firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
  //           name: name,
  //         });
  //         console.log("ユーザーアカウントを作成しました:");
  //         const userId = firebase.auth().currentUser.uid;
  //         Cookies.set('userId', userId, { expires: 7 });
  //         location.href = 'index.html'
  //       }).catch(function(error) { // 作成失敗
  //         console.error("アカウント作成エラー:", error);
  //       });
  //     }).catch(function(error) {
  //       console.error("永続性変更エラー:", error);
  //     });
  //     return false;
  //   };
  // };
  
  // //ゲストアカウントを永久アカウントに変換
  // const upgradeToUserAccount = function() {
  //   return function () {
      
  //     const email = $("#user-email").val();
  //     const name = $("#username").val();
  //     const password = $("#user-password").val();
  //     const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      
  //     firebase.auth().currentUser.linkWithCredential(credential).then(function(usercred) {
  //       const user = usercred.user;
  //       //location.href = 'myBoard.html'
  //       firebase.database().ref("users/" + firebase.auth().currentUser.uid).set({
  //         name: name,
  //       });
  //       console.log("ユーザーアカウントに更新しました", user);
  //     }, function(error) {
  //       console.error("アカウント更新エラー:", error);
  //     });
  //     return false;
  //   }
  // };
 
  // $("#guest-register").click(CreateGuestAccount());
  
  // $("#register-form").submit(function () {
  //   createUserAccount()
  // });
  

  
  // $("#upgrade-button").submit(upgradeToUserAccount());
 
  // //ゲストアカウントの削除 
  // function deleteGuestAccount() {  
  //   const guestUser = firebase.auth().currentUser;
  //   guestUser.delete()   
  //     .then(function() {                
  //       console.log("ゲストアカウントを削除しました");
  //     })
  //     .catch(function(error) {              
  //       console.error("アカウント削除エラー:", error.code);
  //     });
  // }
    
});