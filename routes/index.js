var mongoq = require('mongoq');
var db = mongoq('genexa');

var now = new Date();
var date = now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

exports.index = function(req, res) {
    res.render('home', {
        name: '',
        school: '',
        date: date,
        subject: '',
        teacher: '',
        period: '',
        file: ''
    });
};

exports.doc = function(req, res) {
    var docs = db.collection('docs');
    var cursor = docs.findOne({ name: req.params.name });
    cursor.next(function(doc) {
        if (doc) {
            res.render('home', doc);
        } else {
            res.render('home', {
                name: '',
                school: '',
                date: date,
                subject: '',
                teacher: '',
                period: '',
                file: ''
            });
        }
    }).fail(function(err) {
    });
};

exports.create = function(req, res) {
    var uniqueid = require('../helpers/id.js');
    var date = new Date();
    var params = req.body;

    /*if (params.questions) {
        for (var i=0; i < params.questions.length; i++) {
            console.log(params.questions[i]);
        };
    }*/
    params.name = uniqueid.encode(date.getTime());

    var file = create_pdf(params);
    if (file) {
        params.file = file;
        var docs = db.collection('docs');
        docs.insert(params);
    }
    //res.download('./public/docs/'+file);

    res.contentType('json');
    res.send(JSON.stringify(params));
};

var create_pdf = function(data) {
    //console.log(data);
    var filename = data.name;

    var PDFDocument = require('pdfkit');
    var doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait'
    });
    //doc.registerFont('./public/fonts/Times_New_Roman.ttf', 'Times-New-Roman');
    doc.font('Times-Roman').fontSize(12);
    doc.rect(80, 72, 80, 52).stroke();
    doc.fontSize(14).text(data.school, { align: 'center' });
    doc.fontSize(12).text(data.subject, { align: 'center' });
    doc.fontSize(12).text('Maestro: '+data.teacher, { align: 'center' });
    doc.fontSize(12).text(data.period, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Nombre: ____________________________________   Grupo:__________'+'     '+data.date, { align: 'center' });
    doc.write('./public/docs/'+filename+'.pdf');

    return filename+'.pdf';
};
