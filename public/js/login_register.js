$(function() {
    $('.login').click(function() {
        if(!$('#username').val().trim() || !$('#psw').val().trim()) {
            alert('Username and password cannot be empty！');
            return false;
        }
        var obj = {
            name: $('#username').val().trim(),
            psw: $('#psw').val().trim()
        };
        $.ajax({ // default: GET
            // type: POST,
            url: '/data/login',
            data: obj,
            dataType: 'json',  // Expected server return type
            success: function(data) {
                if(data.status){
                    window.location.href = '/';
                    
                }else{
                    alert(data.info);
                }
            },
            error: function() {
                alert('Incorrect username or password！');
            }
        });
    });

    // $('.register').click(function() {
    //     if(!$('#username').val().trim() || !$('#psw').val().trim()) {
    //         alert('Username and password cannot be empty！');
    //         return false;
    //     }
    //     var obj = {
    //         name: $('#username').val().trim(),
    //         psw: $('#psw').val().trim()
    //     };
    //     $.ajax({ 
    //         type: 'POST',
    //         url: '/data/register',
    //         data: obj,
    //         dataType: 'json',  
    //         success: function(data) {
    //             if(data.status){
    //                 alert('Register successfully！');
    //                 window.location.href = '/login';
    //             }else{
    //                 alert(data.info);
    //             }
    //         },
    //         error: function() {
    //             alert('Registration failed, please try again!！');
    //         }
    //     });
    // });
});