'use strict';

jQuery(document).ready(function($) {

  $(document.forms['RegisterForm']).on('submit', function() {

    var form = $(this);

    $.ajax({
      url: "/register",
      method: "POST",
      data: form.serialize(),
      success: function() {
        form.html("Вы успешно зарегистрировались!").addClass('alert-success');
        // window.location.href = "/main";
      },
      error: function() {
        $('.alert', form).removeClass('hide');
      }
    });
    return false;
  });
});

