/* global ClipboardJS*/
new ClipboardJS('#copy2clipboard');

const previousPage = document.referrer;
if(previousPage){
  $('#url').attr('value',previousPage);
  $('#qrcode').qrcode(previousPage);
}

$(function(){
  $("#input-email1").on("focusout", function(){
    recAddingForm("input-email",
      "#email-block",
      "#email-area",
      emailAddressTag(),
      $(this).attr("id"));
  });
});

/**
 * フォームを増やす
 *
 * @param {string} strElement　追加する要素
 * @param {string} deleteElement　削除する要素
 * @param {string} targetArea　追加するDIVエリア
 * @param {string} addHtml　追加するHTML
 * @param {string} idNum　カウント
 * @return {void}
 */
function recAddingForm(strElement, deleteElement, targetArea, addHtml, idNum) {
  // idから番号をとる
  var countId = parseInt(idNum.replace(strElement, ''));
  if ($('#' + strElement + countId).val() == ''
      && $('#' + strElement + (countId + 1)).length > 0
      && $('#' + strElement + (countId + 1)).val() == '') {
    // 入力後削除したのでフォームを消す
    $(deleteElement + (countId + 1)).fadeOut('fast', function () {
      $(this).remove();
    });
    return;
  } else if ($('#' + strElement + countId).val() == '') {
    // 未入力
    return;
  } else if ($('#' + strElement + (countId + 1)).length > 0) {
    // 次のフォームがある
    return;
  }
  countId++;
  $(targetArea).append(addHtml.replace(/\?/g, countId.toString()));
  $('#' + strElement + countId).on('focusout', '', function () {
    recAddingForm(strElement, deleteElement, targetArea, addHtml, $(this).attr('id'));
  });
}

function emailAddressTag() {
  return '<div id="email-block?">' +
      '<div class="input-field">' +
      '<input type="email" class="form-control validate" id="input-email?" name="input-email?" maxlength="256">' +
      '<label class="sr-only" for="input-email?">Email address?</label>' +
      '</div>' +
      '</div>';
}