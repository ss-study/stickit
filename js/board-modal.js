/* global M, $, BOARD_ID, Cookies, createUserAccount, createGuestAccount, login, logout, Promise, comvertGuest2Permanent, startBoardDrawing*/

/* init modals*/
// Initialize modals
const welcome_modal = M.Modal.init(document.querySelector("#welcome-modal"), {dismissible: false, onOpenStart: function() { $('#js-loader').delay(300).fadeOut(400); }});
const login_modal = M.Modal.init(document.querySelector("#login-modal"), {dismissible: false});
const register_modal = M.Modal.init(document.querySelector("#register-modal"), {dismissible: false});
const pin_modal = M.Modal.init(document.querySelector("#PIN-modal"), {dismissible: false, onCloseEnd: function() { startBoardDrawing(); }});
const setting_modal = M.Modal.init(document.querySelector("#board_setting"));

/**
 *  hoge_modal.open() : モーダルウィンドウを開く
 *  hoge_modal.close() : モーダルウィンドウを閉じる
 */

const DB = firebase.database();

const pinAuth = function(pin, boardId) {
  return new Promise(function(resolve, reject) {
    DB.ref(`board/${boardId}`).once('value').then(snapshot =>{
      const boardPin = snapshot.val().pin;
      if((pin === boardPin) || (pin === "" && boardPin === void(0))) {
        resolve(boardId);
      }else {
        reject(new Error("PINが間違っています"));
      }
    }).catch(error =>{
      reject(error);
    });
  });
};

const register = function(doRegister) {
  //TODO: [done]アカウント登録処理
  $('#js-loader').fadeIn(600);
  const email = $("#register-email").val();
  const name = $("#register-username").val();
  const password = $("#register-password").val();
  
  if(doRegister === "true") { 
    createUserAccount(email, name, password).then(user => {
      register_modal.close();
      pin_modal.open();
      $(".hide-to-anony").show();
      $(".show-to-anony").hide();
      $('#js-loader').delay(300).fadeOut(400);
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        $("#register-modal .help-block").text("The E-mail you typed is already in use.");
        console.error('入力されたメールアドレスは既に使用されています。');
        $("#login-password").val("");
      }else {
        console.error("アカウント登録エラー:", error);
      }
      $('#js-loader').delay(300).fadeOut(400);
    });
  } else {
    comvertGuest2Permanent(email, name, password).then(user => {
      register_modal.close();
      $(".hide-to-anony").show();
      $(".show-to-anony").hide();
      $('#js-loader').delay(300).fadeOut(400);
    }).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        $("#register-modal .help-block").text("The E-mail you typed is already in use.");
        console.error('入力されたメールアドレスは既に使用されています。');
        $("#login-password").val("");
      }else {
        console.error("アカウント登録エラー:", error);
      }
      $('#js-loader').delay(300).fadeOut(400);
    });
  };
  return false;
};

$(function(){

  $("#join-w-login").on("click", function() {
    welcome_modal.close();
    login_modal.open();
  });
  
  $(".join-w-guest").on("click", function() {
    // TODO: [done]ゲストログイン処理
    createGuestAccount().then(user => {
      if(welcome_modal.isOpen){
        welcome_modal.close();
      }
      if(login_modal.isOpen){
        login_modal.close();
      }
      if(register_modal.isOpen){
        register_modal.close();
      }
      pin_modal.open();
      $(".hide-to-anony").hide();
      $(".show-to-anony").show();
    }).catch(error => {
      console.error("ゲストアカウント作成に失敗：", error);
      return false;
    });
  });
  
  $("#login-btn").on("click", function() {
    // TODO: [done]ログイン処理
    $('#js-loader').fadeIn(600);
    const email = $("#login-email").val();
    const password = $("#login-password").val();
    
    login(email, password).then(_ => {
      login_modal.close();
      pin_modal.open();
      $('#js-loader').delay(300).fadeOut(400);
    }).catch(error => {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        $("#login-modal .help-block").text("E-mail or password is incorrect.");
        console.error('メールアドレスかパスワードが間違っています');
        $("#login-password").val("");
      }else {
        console.error("ログインエラー:", error);
      }
      $('#js-loader').delay(300).fadeOut(400);
    });
    return false;
  });
  
  $("#register-btn").on("click", function() {
    const $doRegister = $("#do_register").val();
    register($doRegister);
  });
  
  $("#to-register").on("click", function() {
    login_modal.close();
    register_modal.open();
  });
  
  $("#to-login").on("click", function() {
    register_modal.close();
    login_modal.open();
  });
  
  $("#logout-button").on("click", function() {
    logout();
    $(".hide-to-anony").hide();
    $(".show-to-anony").show();
  });

  $("#pin-btn").on("click", function(){
    $("#PIN-modal__form").submit();
  })

  $("#PIN-modal__form").submit(function() {
    //TODO: [done]PIN認証処理
    const pin = $("#pin").val();
    pinAuth(pin, BOARD_ID).then(value => {
      pin_modal.close();
      const userId = firebase.auth().currentUser.uid;
      console.log("userID:"+userId);
      DB.ref("users/"+userId+"/boards/"+BOARD_ID).set(firebase.database.ServerValue.TIMESTAMP);
    }).catch(error => {
      $("#PIN-modal .help-block").text("PIN code is not correct.");
      console.error(error);
    });
    return false;
  });
  
  $("#conv2perm").on("click", function() {
    $("#do_register").val(false);
    register_modal.open();
  });

  $(".hide-to-anony").show();
  $(".show-to-anony").hide();

  
});