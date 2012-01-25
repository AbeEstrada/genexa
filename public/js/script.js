$(function() {
    var question = 0;
    
    $('.new-question').removeAttr('style');
    
    $('header input, .questions input').live('keypress', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13)
            return false;
    });
    
    $('button.add-question').on('click', function() {
        question += 1;
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
            $('.questions .question:nth-child('+i+') label').text(i);
        };
        return false;
    });
    
    $('button.new-answer').live('click', function() {
        return false;
    });
    
    $('button.create').on('click', function() {
        return false;
    });
    
    $('input[name=logo]').on('change', function() {
        var img = $(this).val();
        console.log('New Logo');
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