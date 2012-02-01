$(function() {
    var question = 0;

    var d = new Date();
    $('input[name=date]').val(d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear());
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
        }
        return false;
    });

    $('button.add-answer').live('click', function() {
        var new_answer = $(this).parent().parent().clone();
        $(new_answer).find('input').val('');
        $(new_answer).appendTo($(this).parent().parent().parent());
        $(this).remove();
        return false;
    });

    $('button.create').on('click', function() {
        var error = false;
        $(this).hide().siblings('img').show();

        var data = {
            //'logo': $.trim($('input[name=logo]').val()),
            'school': $.trim($('input[name=school]').val()),
            'date': $.trim($('input[name=date]').val()),
            'subject': $.trim($('input[name=subject]').val()),
            'teacher': $.trim($('input[name=teacher]').val()),
            'period': $.trim($('input[name=period]').val()),
            'questions': []
        };

        if (data.school === '') {
            $('input[name=school]').addClass('error');
            error = true;
        }
        if (data.subject === '') {
            $('input[name=subject]').addClass('error');
            error = true;
        }
        if (data.teacher === '') {
            $('input[name=teacher]').addClass('error');
            error = true;
        }
        if (data.period === '') {
            $('input[name=period]').addClass('error');
            error = true;
        }

        if (error) {
            $('button.create').show().siblings('img').hide();
            return false;
        }

        var questions = $('.questions .question');
        for (var i=0; i < questions.length; i++) {
            var q = $(questions[i]);
            var type = q.attr('class').replace(/question ?-?/g, '');
            var question = q.find('input').val();
            if ($.trim(question) !== '') {
                switch(type) {
                    case 'options':
                        var answers = [];
                        q.find('input[name=answer]').each(function(i) {
                            var answer = $(this).val();
                            answers.push(answer);
                        });
                        data.questions.push({
                            'type': type,
                            'question': question,
                            'answers': answers
                        });
                        break;
                    default:
                        data.questions.push({
                            'type': type,
                            'question': question
                        });
                        break;
                }
            }
        }
        $.ajax({
            url: '/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function(xhr) {
                $('input').removeClass('error');
            }, success: function(data) {
                $('button.create').show().siblings('img').hide();
                //window.location = '/docs/'+data.file;
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
            if ($(this).val() === '' || $(this).val() == $(this).attr('placeholder')) {
                $(this).val($(this).attr('placeholder'));
                $(this).addClass('placeholder');
            }
        });

        $('[placeholder]').closest('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                if ($(this).val() == $(this).attr('placeholder')) {
                    $(this).val('');
                }
            });
        });
    }
});