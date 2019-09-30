$(document).ready(function(){
    
    $( "#animal" ).keypress(function( event ) {
        
        if ( event.which == 13 ) {
            var searchVal = $('#animal').val();
            console.log(searchVal);
            if(typeof searchVal === "undefined") return;
            $.ajax({
                type: 'GET',
                url: 'image-search/getFlickr.php',
                data: 'search=' + searchVal,
                dataType: 'html',
                beforeSend: function() {
                    if(searchVal == "") {
                        $('#result').html('<p>Please enter a keyword as search value.</p>');   
                        return false;
                    }else{
                        $('#result').html('<img src="image-search/loading.gif" style="width:20px; padding-top:10px;" alt="loading..." />');
                    }
                },
                success: function(response) {
                     $('#result').html(response);                
                }
            });
        }
      });

      $('.eraseText').click(function(){
          $('#animal').val('');
      })


   });