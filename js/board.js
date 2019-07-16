/* globals $, LeaderLine, Set, Promise, Cookies */

// GlobalなEnum
const MODE = { EDIT: 1, LINK: 2, DELETE: 3 };

// モード状態に関するオブジェクト
const state = new Object();
state.mode = MODE.EDIT;

// リンクの状態に関するオブジェクト
const link = new Object();
link.data = new Object();
link.linkObject = null;
link.startNode = null;
link.hasStartNode = () => {
  return !(link.startNode === null);
};

// ドラッグの状態に関するオブジェクト
const drag = new Object();
drag.isDragging = false;
drag.target = null;
drag.start = {x: 0, y: 0};
drag.adjustX = 0;
drag.adjustY = 0;
drag.disable = false;

// スクリーンのロック
const screen = new Object();
screen.lock = function(){
  var divTag = $("<div />").attr("id", "screen_lock");
  divTag.css("z-index", "3")
    .css("position", "fixed")
    .css("top", "0px")
    .css("left", "0px")
    .css("right", "0px")
    .css("bottom", "0px");
  $('body').append(divTag);
};
screen.unlock = function(){
  $("#screen_lock").remove();
};

// クエリ取得
const getUrlVars = function(){
  const vars = [];
  let array = "";
  const url = window.location.search;
  const hash  = url.slice(1).split('&');
  hash.forEach(function(value){
    array = value.split('=');
    vars.push(array[0]);
    vars[array[0]] = array[1];
  });
  return vars;
};
const BOARD_ID = getUrlVars().id;

// Mapのメソッド追加
Map.prototype.hasSameKey = function(targetMap){
  let hasSameKey = false;
  this.forEach(function(value, key){
    if(targetMap.has(key)){
      hasSameKey = true;
      return null;
    }
  });
	return hasSameKey;
}

// 描画開始処理
const startBoardDrawing = function(){
  // ノードの取得とイベントハンドラ追加
  const nodeRef = firebase.database().ref(`board/${BOARD_ID}/node`);
  const linkRef = firebase.database().ref(`board/${BOARD_ID}/link`);
  nodeRef.off("child_added");
  nodeRef.on("child_added", function(childSnapshot, prevChildKey) {
    //  付箋の追加処理
    const id = childSnapshot.key;
    const position = childSnapshot.val().position;
    const text = childSnapshot.val().text;
    let divTag = $($("#template").html());
    divTag.attr('id', id);
    divTag.css({
      "position": "absolute",
      "top": position.y + "px",
      "left": position.x + "px"
    });
    divTag.find(".label_text").text(text);
    divTag.find(".label_textarea").val(text);
    $("body").append(divTag);
    attachEventListener("#" + id);
    link.data[id] = new Map();
  });
  // ノードの変更監視
  nodeRef.on("child_changed", function(childSnapshot, prevChildKey) {
    const id = childSnapshot.key;
    const position = childSnapshot.val().position;
    const text = childSnapshot.val().text;
    $(`#${id}`).css({
      "position": "absolute",
      "top": position.y + "px",
      "left": position.x + "px"
    });
    $(`#${id}`).find(".label_text").text(text);
    $(`#${id}`).find(".label_textarea").val(text);
    link.data[id].forEach( function(line){
      line.position();
    });
  });
  // リンクの追加監視
  window.setTimeout( () => {
    linkRef.on("child_added", function(childSnapshot, prevChildKey) {
      //  リンクの追加処理
      const id = childSnapshot.key;
      const startNode = childSnapshot.val().startNode;
      const endNode = childSnapshot.val().endNode;
      const line = new LeaderLine(
        $(`#${startNode}`)[0],
        $(`#${endNode}`)[0],
        {color: '#ff9800'}
      );
      link.data[startNode].set(id, line);
      link.data[endNode].set(id, line);
      const $arrow = $(`#leader-line-${line._id}-line-path`).parent().parent();
      $arrow.attr("id", id);
      $arrow.find(".leader-line-plugs-face").attr("pointer-events", "all");
      $arrow.on("click", onClickEvent);
    });
  }, 1500);
  // 付箋の削除
  nodeRef.on("child_removed", function(childSnapshot, prevChildKey) {
    const id = childSnapshot.key;
    delete link.data[id];
    $(`#${id}`).remove();
  });
  // リンクの削除
  linkRef.on("child_removed", function(childSnapshot, prevChildKey) {
    const id = childSnapshot.key;
    Object.keys(link.data).forEach( function(itr){
      link.data[itr].delete(id);
    });
    $(`#${id}`).remove();
  });
  // リンク後処理のためにマウスアップイベントをwindowで捕捉
  $(window).on("mouseup", catchMouseUpEvent);
  $(window).on("touchend", catchMouseUpEvent);
  // マウス移動時のイベントを登録
  $(window).on("mousemove", onMouseMoveEvent);
  //$(window).on("touchmove", onMouseMoveEvent);
  window.addEventListener('touchmove', onMouseMoveEvent, {passive: false});
};

const catchMouseUpEvent = function(e){
  if(state.mode === MODE.EDIT){
    if(drag.isDragging){
      // [EDIT]移動したか判定
      const cursor = getCursorPosition(e);
      if(drag.start.x === cursor.x && drag.start.y === cursor.y){
        // 移動していないのでテキスト編集状態にする
        $(drag.target).find(".label_text").hide();
        $(drag.target).find(".label_textarea").show();
        $(drag.target).find(".label_textarea").focus();
      }else{
        // 移動したので移動をFirebaseに反映
        screen.lock();
        const position = {x: cursor.x + drag.adjustX, y: Math.max(64, cursor.y + drag.adjustY)};
        firebase.database().ref().child(`board/${BOARD_ID}/node/${$(drag.target).attr("id")}/position`).set(position).then(function(){ screen.unlock(); });
      }
      drag.isDragging = false;
    }
  }else if(state.mode === MODE.LINK){
    // [LINK]リンク作成の後処理
    link.startNode = null;
    if(link.linkObject){
      link.linkObject.remove();
      link.linkObject = null;
    }
  }
};

const onMouseMoveEvent = function(e){
  // カーソル位置にダミー要素を追従
  const cursor = getCursorPosition(e);
  $("#cursor").css({
    "position": "absolute",
    "top": cursor.y + "px",
    "left": cursor.x + "px"
  });
  // 要素をドラッグ中であるなら、対象の要素をカーソル位置に移動
  if(drag.isDragging){
    $(drag.target).css({
      "position": "absolute",
      "top": (cursor.y + drag.adjustY) + "px",
      "left": (cursor.x + drag.adjustX) + "px"
    });
    // リンクの追従
    link.data[drag.target.id].forEach( function(line){
      line.position();
    });
    e.preventDefault();
  }
  // [LINK]ガイド矢印を移動
  if((state.mode === MODE.LINK) && link.linkObject){
    link.linkObject.position();
    e.preventDefault();
  }
};

// StickをFirebaseに登録
const addStick = function(){
  screen.lock();
  const stickPosition = new Object();
  stickPosition.x = window.pageXOffset + 100;
  stickPosition.y = window.pageYOffset + 150;
  const message = {
    position: {x: stickPosition.x, y: stickPosition.y},
    text: ""
  };
  firebase.database().ref().child(`board/${BOARD_ID}/node`).push(message).then(function(){ screen.unlock(); });
};

const attachEventListener = function(selector){
  // クリックのイベントハンドラ
  $(selector).on("click", onClickEvent);
  // フォーカスが離れた時のイベントハンドラ
  $(selector).focusout(onFocusOutEvent);
  // マウスが押された時のイベントハンドラ
  $(selector).on("mousedown", onMouseDownEvent);
  $(selector).bind("touchstart", onMouseDownEvent);
  // マウスが離された時のイベントハンドラ
  $(selector).on("mouseup", {isPCInterface: true}, onMouseUpEvent);
  $(selector).bind("touchend", {isPCInterface: false}, onMouseUpEvent);
};

const onClickEvent = function(){
  // [DELETE]ノードとリンクの削除処理
  if(state.mode === MODE.DELETE){
    if($(this).hasClass("stick")){
      // ノードに繋がるリンクを削除
      screen.lock();
      const id = $(this).attr("id");
      const promise = new Array();
      link.data[id].forEach(function(key, value){
        promise.push(new Promise(function(resolve, reject){
          firebase.database().ref().child(`board/${BOARD_ID}/link/${$(`#${value}`).attr("id")}`).remove().then(function(){ resolve(); });
        }));
      });
      Promise.all(promise).then(function(){
        // ノードを削除
        firebase.database().ref().child(`board/${BOARD_ID}/node/${id}`).remove().then(function(){ screen.unlock(); });
      });
    }else if($(this).hasClass("leader-line")){
      // リンクを削除
      screen.lock();
      firebase.database().ref().child(`board/${BOARD_ID}/link/${$(this).attr("id")}`).remove().then(function(){ screen.unlock(); });
    }
  }
};

const onFocusOutEvent = function(e){
  // Firebaseに変更を反映する
  screen.lock();
  firebase.database().ref().child(`board/${BOARD_ID}/node/${$(this).attr("id")}/text`)
    .set($(this).find(".label_textarea").val())
    .then(function(){ screen.unlock(); });
  $(this).find(".label_textarea").hide();
  $(this).find(".label_text").show();
  $(this).find(".label_text").text($(this).find(".label_textarea").val());
};

const onMouseDownEvent = function(e){
  if(state.mode === MODE.EDIT){
    // 編集モードならドラッグ処理の開始
    drag.isDragging = true;
    drag.target = this;
    const cursor = getCursorPosition(e);
    const rect = this.getBoundingClientRect();
    drag.adjustX = rect.left + window.pageXOffset - cursor.x;
    drag.adjustY = rect.top + window.pageYOffset - cursor.y;
    drag.start.x = cursor.x;
    drag.start.y = cursor.y;
  }else if(state.mode === MODE.LINK){
    // リンクモードならガイド矢印を表示
    link.startNode = this;
    link.linkObject = new LeaderLine(
      this,
      $("#cursor").get(0)
    );
  }
};

const onMouseUpEvent = function(e){
  if(state.mode === MODE.LINK){
    // [LINK]リンクが結べるか判定してFirebaseに反映
    // PCとMobileでthisが異なるので場合分けしてthisを揃える
    let thisEvent = this;
    if(!e.data.isPCInterface){
      const cursor = getCursorPosition(e);
      thisEvent = document.elementFromPoint(cursor.x - window.pageXOffset, cursor.y - window.pageYOffset);
      console.log(cursor.x+ "," + cursor.y);
      console.log(thisEvent);
      thisEvent = $(thisEvent).closest(".stick").get(0);
      console.log(thisEvent);
    }
    // thisがStickであり、かつ始点と終点が異なり、同じリンクが存在していない場合にリンクが作成できると判定
    const linkNode = { startNode: link.startNode.id, endNode: thisEvent.id };
    const isStick = $(thisEvent).hasClass("stick");
    const isSameNode = thisEvent === link.startNode;
    const existsSameLink = link.data[link.startNode.id].hasSameKey(link.data[thisEvent.id]);
    console.log(isStick);
    console.log(isSameNode);
    console.log(existsSameLink);
    if(isStick && !isSameNode && !existsSameLink){
      firebase.database().ref().child(`board/${BOARD_ID}/link`).push(linkNode);
    }
  }
};

const getCursorPosition = function(e){
  const result = new Object();
  if(!isFinite(e.pageX) || !isFinite(e.pageY)){
    result.x = e.changedTouches[0].pageX;
    result.y = e.changedTouches[0].pageY;
  }else{
    result.x = e.pageX;
    result.y = e.pageY;
  }
  return result;
};
