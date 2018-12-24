$('button.remove-doc').on('click', function() {
     let id = $(this).attr('data-id');
     $.ajax({
        method: "POST",
        url: "/delete",
        data: {"userId": id},
        success: function(result) {
            location.reload();
        }
     })
  });
