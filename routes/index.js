var mongoq = require('mongoq');
var db = mongoq(process.env.MONGOLAB_URI || 'genexa');

exports.help = function(req, res) {
    res.render('help');
};

var render = function(res, params) {
    var now = new Date();
    var date = now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

    if (params) {
        res.render('home', params);
    } else {
        res.render('home', {
            name: '',
            school: '',
            date: date,
            subject: '',
            teacher: '',
            period: '',
            file: '',
            questions: {}
        });
    }
};

exports.index = function(req, res) {
    render(res);
};

exports.doc = function(req, res) {
    var docs = db.collection('docs');
    var cursor = docs.findOne({ name: req.params.name });
    cursor.next(function(doc) {
        if (doc) {
            if (req.params.pdf === 'pdf') {
                res.contentType('application/pdf');
                res.end(create_pdf(doc),'binary');
            } else {
                if (!doc.questions) {
                    doc.questions = {};
                }
                render(res, doc);
            }
        } else {
            render(res);
        }
    }).fail(function(err) {
        res.contentType('text/html');
        res.send(err.message);
        console.dir(err);
    });
};

exports.create = function(req, res) {
    var uniqueid = require('../helpers/id.js');
    var params = req.body;
    var now = new Date();

    params.name = uniqueid.encode(now.getTime());
    params.file = params.name+'.pdf';
    params.url = req.headers.host;

    var docs = db.collection('docs');
    docs.insert(params).fail(function(err) {
        delete params.file;
        console.log(params);
    });

    res.json(params);
};

var create_pdf = function(data) {
    var filename = data.name;
    var fontSize = 12;

    var PDFDocument = require('pdfkit');
    var doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        info: {
            'Creator': 'http://genexa.info/'
        }
    });

    doc.font('./public/fonts/Times-New-Roman.ttf').fontSize(12);
    doc.image('./public/img/watermark.png', 90, 50);
    doc.rect(80, 72, 80, 52).stroke();
    doc.fontSize(14).text(data.school, { align: 'center' });
    doc.fontSize(fontSize).text(data.subject, { align: 'center' });
    doc.fontSize(fontSize).text(data.teacher, { align: 'center' });
    doc.fontSize(fontSize).text(data.period, { align: 'center' });
    doc.moveDown();
    doc.fontSize(fontSize).text('Nombre: ____________________________________   Grupo:__________'+'     '+data.date, { align: 'center' });
    doc.moveDown();
    if (data.questions) {
        for (var i = 0 ; i < data.questions.length; i++) {
            var q = data.questions[i];
            doc.moveDown();
            doc.fontSize(fontSize).text((i+1)+'. '+q.question);
            switch(q.type) {
                case 'open':
                    doc.moveDown(2);
                    break;

                case 'options':
                    if (q.answers) {
                        var answers = '';
                        for (var j = 0; j < q.answers.length; j++) {
                            answers += String.fromCharCode(65+j).toLowerCase()+') '+q.answers[j]+'  ';
                        }
                        doc.fontSize(fontSize).text(answers);
                    }
                    break;

                case 'truefalse':
                    doc.fontSize(fontSize).text('a) Verdadero  b) Falso');
                    break;
            }
        }
    }

    return doc.output();
};
