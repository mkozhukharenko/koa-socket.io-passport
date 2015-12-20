
jQuery(document).ready(function($) {

  $(document.forms['login-form']).on('submit', function() {

    var form = $(this);

    $('.alert', form).addClass('hide');
    $(":submit", form).addClass("disabled");

    $.ajax({
      url: "/login",
      method: "POST",
      data: form.serialize(),
      complete: function() {
        $(":submit", form).removeClass("disabled");
      },
      statusCode: {
        200: function() {
          form.html("Вы вошли в сайт").addClass('alert-success');
          // window.location.href = "/main";
        },
        403: function() {
          $('.alert', form).removeClass('hide');
        }
      }
    });
    return false;
  });
});

