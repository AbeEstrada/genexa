$(function() {
    var question = 0;
    
    $('.new-question').removeAttr('style');
    
    $('header input, .questions input').live('keypress', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13)
            return false;
    });
    
    $('button.add-question').on('click', function() {
        var questions = $('.questions .question').length;
        question = questions + 1;
        var question_type = $('select.question-type').val();
        var new_question = $('div.templates div.question-'+question_type).clone();
        $(new_question).find('label').text(question+'. ');
        $(new_question).appendTo('div.questions');
        return false;
    });
    
    $('button.remove-question').live('click', function() {
        $(this).parents('.question').remove();
        var questions = $('.questions .question');
        for (var i=1; i <= questions.length; i++) {
            $('.questions .question:nth-child('+i+') label').text(i+'. ');
        };
        return false;
    });
    
    $('button.new-answer').live('click', function() {
        var new_answer = $(this).parent().clone();
        $(new_answer).find('input').val('').attr('name', 'answer[0]');
        $(new_answer).appendTo($(this).parent().parent());
        $(this).remove();
        return false;
    });
    
    $('button.create').on('click', function() {
        $.ajax({
            url: '/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: $('form').serialize(),
            success: function(data) {
                //console.log(data);
            }
        });
        return false;
    });
    
    $('input[name=logo]').on('change', function() {
        return false;
    });
    
    if (!Modernizr.input.placeholder) {
        $(this).find('[placeholder]').each(function() {
            $(this).val($(this).attr('placeholder')).addClass('placeholder');
        });
        
        $('[placeholder]').focus(function() {
            if ($(this).val() == $(this).attr('placeholder')) {
                $(this).val('');
                $(this).removeClass('placeholder');
            }
        }).blur(function() {
            if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
                $(this).val($(this).attr('placeholder'));
                $(this).addClass('placeholder');
            }
        });
        
        $('[placeholder]').closest('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                if ($(this).val() == $(this).attr('placeholder')) {
                    $(this).val('');
                }
            })
        });
    }
});