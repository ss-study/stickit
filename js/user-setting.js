/* globals $, Promise, userId, M */

// TODO: メールとパスワードの変更がエラーになる

// ボード設定の送信処理
const submitBoardSetting = function(){
  const userName  = $("#new_username").val();
  const email = $("#new_email").val();
  const password  = $("#new_password").val();
  const promise = new Array();
  // userIDの取得
  firebase.auth().onAuthStateChanged(function(user) {
    // ユーザー名の更新
    if(userName !== ""){
      promise.push(new Promise(function(resolve, reject){
        firebase.database().ref().child(`users/${userId}/name`).set(userName).then(function(){
          resolve();
        }).catch(function(error) {
          throw new Error("Failure to change your user name.");
        });
      }));
    }
    // emailの更新
    if(email !== ""){
      promise.push(new Promise(function(resolve, reject){
        user.updateEmail(email).then(function(){
          resolve();
        }).catch(function(error) {
          console.log(error);
          throw new Error("Failure to change your E-mail.");
        });
      }));
    }
    // passwordの更新
    if(password !== ""){
      promise.push(new Promise(function(resolve, reject){
        user.updatePassword(password).then(function(){
          resolve();
        }).catch(function(error) {
          throw new Error("Failure to change your password.");
        });
      }));
    }
    // 全て更新した後の処理
    Promise.all(promise).then(function(){
      console.log("Done all promise");
      // write code after renew
      M.toast({html: 'User setting has been changed successfully',
         classes: 'white green-text',
         displayLength: 2000});
    });
  });
};

// 設定モーダルの初期化
const setting_modal = M.Modal.init(document.querySelector("#user_setting"));