$(function(){
  /* Toggle Passowrd visibility */
  $(".toggle-password").click(function () {
    $(this).toggleClass("mdi-eye mdi-eye-off");
    
    var input = $(this).parent().parent().find(".pwd-visibility");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  });
});