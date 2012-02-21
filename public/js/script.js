$(function() {
    var question = 0;

    if (image_logo !== '') {
        $('img.logo', frames['upload'].document).attr('src', image_logo);
    }
    if (typeof questions !== 'undefined' && questions.length > 0) {
        for (var i = 0; i < questions.length; i++) {
            question = i+1;
            var new_question = $('div.templates div.question-'+questions[i].type).clone();
            $(new_question).find('input[name='+questions[i].type+']').val(questions[i].question);
            switch(questions[i].type) {
                case 'options':
                    for (var j = 0; j < questions[i].answers.length; j++) {
                        var answer = $(new_question).find('.answer-wrapper').clone();
                        $(answer).removeClass('answer-wrapper').find('input[name=answer]').val(questions[i].answers[j]);
                        if ((j+1) !== questions[i].answers.length) {
                            $(answer).find('.add-answer').remove();
                        }
                        $(new_question).append(answer);
                    }
                    $(new_question).find('.answer-wrapper').remove();
                    break;
            }
            $(new_question).find('label').text(question+'. ');
            $(new_question).appendTo('div.questions');
        }
    }

    $('.questions, .new-question').removeAttr('style');

    $('header input, .questions input').live('keypress', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            return false;
        }
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
        var inputs = $(this).parent().parent().parent().find('input').length;
        if (inputs <= 4) {
            var new_answer = $(this).parent().parent().clone();
            $(new_answer).find('input').val('');
            if (inputs === 4) {
                $(new_answer).find('button.add-answer').remove();
            }
            $(new_answer).appendTo($(this).parent().parent().parent());
            $(this).remove();
        }
        return false;
    });

    $('button.create').on('click', function() {
        var error = false;
        $(this).hide().siblings('img').show();

        var data = {
            'school': $.trim($('input[name=school]').val()),
            'date': $.trim($('input[name=date]').val()),
            'subject': $.trim($('input[name=subject]').val()),
            'teacher': $.trim($('input[name=teacher]').val()),
            'period': $.trim($('input[name=period]').val()),
            'questions': []
        };
        if (logo.image) {
            data.logo = logo.image;
        }

        if (data.school === '') { $('input[name=school]').addClass('error'); error = true; }
        if (data.subject === '') { $('input[name=subject]').addClass('error'); error = true; }
        if (data.teacher === '') { $('input[name=teacher]').addClass('error'); error = true; }
        if (data.period === '') { $('input[name=period]').addClass('error'); error = true; }

        if (error) {
            $('button.create').show().siblings('img').hide();
            $('div.error .modal-body p').text('Todos los campos del encabezado son requeridos.');
            $('div.error').modal({
                backdrop: true
            });
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
                if (data.file) {
                    $('div.newdoc input[name=doc]').val(data.name);
                    $('div.newdoc input.link').val('http://'+data.url+'/'+data.name);
                    $('div.newdoc a.btn-primary').attr('href', 'http://'+data.url+'/'+data.file);
                    $('div.newdoc').modal({
                        keyboard: false,
                        backdrop: true
                    });
                }
            }
        });
        return false;
    });

    $('.newdoc a.feedback').on('click', function() {
        $('form.feedback select').removeClass('error');
        $('div.newdoc a.feedback').hide();
        $('div.newdoc img.loader').show();
        var error = false;
        var data = {
            'doc': $.trim($('form.feedback input[name=doc]').val()),
            'age': $.trim($('form.feedback select[name=age]').val()),
            'gender': $.trim($('form.feedback select[name=gender]').val()),
            'level': $.trim($('form.feedback select[name=level]').val()),
            'activity': $.trim($('form.feedback select[name=activity]').val()),
            'needs': $.trim($('form.feedback select[name=needs]').val()),
            'frequency': $.trim($('form.feedback select[name=frequency]').val()),
            'use': $.trim($('form.feedback select[name=use]').val()),
            'easy': $.trim($('form.feedback select[name=easy]').val())
        };
        if (data.age === '') { $('form.feedback select[name=age]').addClass('error'); error = true; }
        if (data.gender === '') { $('form.feedback select[name=gender]').addClass('error'); error = true; }
        if (data.level === '') { $('form.feedback select[name=level]').addClass('error'); error = true; }
        if (data.activity === '') { $('form.feedback select[name=activity]').addClass('error'); error = true; }
        if (data.needs === '') { $('form.feedback select[name=needs]').addClass('error'); error = true; }
        if (data.frequency === '') { $('form.feedback select[name=frequency]').addClass('error'); error = true; }
        if (data.use === '') { $('form.feedback select[name=use]').addClass('error'); error = true; }
        if (data.easy === '') { $('form.feedback select[name=easy]').addClass('error'); error = true; }

        if (error) {
            $('div.newdoc a.feedback').show();
            $('div.newdoc img.loader').hide();
            return false;
        }
        $.ajax({
            url: '/feedback',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            success: function(data) {
                if (data.success) {
                    $('form.feedback select').removeClass('error').addClass('disabled').attr('disabled', 'disabled');
                    $('.newdoc a.btn-primary').removeClass('disabled');
                    $('.newdoc img.loader').hide();
                } else {
                    $('.newdoc a.feedback').show();
                    $('.newdoc img.loader').hide();
                }
            }
        });
        return false;
    });

    $('div.newdoc a.btn-primary').on('click', function() {
        if (!$(this).hasClass('disabled')) {
            return true;
        }
        return false;
    });

    $('div.newdoc a.close-modal').click(function() {
        $('form.feedback select').removeClass('error').removeClass('disabled').removeAttr('disabled');
        $('div.newdoc a.btn-primary').addClass('disabled');
        $('div.newdoc a.feedback').show();
        $('div.newdoc img.loader').hide();
        $('div.newdoc').modal('hide');
        return false;
    });

    $('div.newdoc').on('hidden', function () {
        $('div.newdoc input.link').val('');
        $('div.newdoc a.btn-primary').attr('href', '#');
    });

    $('div.error a.close-modal').click(function() {
        $('div.error').modal('hide');
        return false;
    });

    var logo = {};
    $('iframe.upload').load(function() {
        var data = $('iframe.upload').get(0).contentWindow.data;
        if (data) {
            if (data.image) logo.image = data.image;
            if ($('img.logo', frames['upload'].document).attr('src') !== '/img/logo.jpg') {
                $('img.logo', frames['upload'].document).attr('src', data.url);
            }
        }

        $('input[name=logo]', frames['upload'].document).on('change', function() {
            $(this).hide();
            $('img.loader', frames['upload'].document).show();
            $('form', frames['upload'].document).submit();
        });
    });

    if (!Modernizr.input.placeholder) {
        $(this).find('[placeholder]').each(function() {
            if ($(this).val() === '') {
                $(this).val($(this).attr('placeholder')).addClass('placeholder');
            }
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