/* globals $, Promise, BOARD_ID */

// TODO: BOARD_IDはボードに合わせて適切な値に設定する必要がある
//const BOARD_ID = "-LiAxhiriSDzlYr9V3Ci";

$(function(){
  initBoardSettingForm();
});

// ボード設定フォームの初期化
const initBoardSettingForm = function(){
  // ボード名の取得
  const boardNamePromise = new Promise(function(resolve, reject){
    firebase.database().ref().child(`board/${BOARD_ID}/name`).once("value").then(function(snapshot){ resolve(snapshot.val()); });
  });
  // PINの取得
  const pinPromise = new Promise(function(resolve, reject){
    firebase.database().ref().child(`board/${BOARD_ID}/pin`).once("value").then(function(snapshot){ resolve(snapshot.val()); });
  });
  // 両方取得したらフォームに反映して編集可能にする
  Promise.all([boardNamePromise, pinPromise]).then(function(data){
    $("#new_boardname").val(data[0]);
    $("#new_pin").val(data[1]);
    $("#new_boardname").attr("readonly", false);
    $("#new_pin").attr("readonly", false);
    M.updateTextFields();
  });
};

// ボード設定の送信処理
const submitBoardSetting = function(){
  const boardName = $("#new_boardname").val();
  const pin  = $("#new_pin").val();
  // ボード名の更新
  const boardNamePromise = new Promise(function(resolve, reject){
    firebase.database().ref().child(`board/${BOARD_ID}/name`).set(boardName).then(function(){ resolve(); });
  });
  // PINの更新
  const pinPromise = new Promise(function(resolve, reject){
    firebase.database().ref().child(`board/${BOARD_ID}/pin`).set(pin).then(function(){ resolve(); });
  });
  // 両方更新した後の処理
  Promise.all([boardNamePromise, pinPromise]).then(function(){
    // write code after renew
  });
};

$("#board_setting_form").submit(_ => {
  submitBoardSetting();
  return false;
});