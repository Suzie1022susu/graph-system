$(function() { 
    $('.btn').click(()=> {
        if(!$('.text').val().trim()) {
            alert('Please enter a comment!');
            $('.text').val('');
            return false;
        }

        var obj = { content: $('.text').val().trim() };

        //send ajax request
        $.ajax({
            type: 'POST',
            url: '/data/write',
            dataType: 'json',  // Expected server return type
            data: obj, // Transferring comments sent by users as data
            success: function(data) {
                console.log(data);
                if(data.status == 1) {
                    alert('Post comment successfully！');
                    window.location.reload();  // 刷新页面
                } else if (data.status == 2) {
                    alert(data.info);
                    window.location.href = '/login';
                } else {
                    alert(data.info);
                }
            },
            error: function() {
                alert('Failed to post comment, please try again！');
            }
        }); 
        return false;
    });
});