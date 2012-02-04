var mongoq = require('mongoq');
var db = mongoq('genexa');

var now = new Date();
var date = now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

var render = function(res, params) {
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
}

exports.index = function(req, res) {
    render(res);
};

exports.doc = function(req, res) {
    var docs = db.collection('docs');
    var cursor = docs.findOne({ name: req.params.name });
    cursor.next(function(doc) {
        if (doc) {
            if (req.params.pdf === 'pdf') {
                res.writeHead(200, {'Content-Type': 'application/pdf'});
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
        res.send(err.message, 500);
        console.log(err);
    });
};

exports.create = function(req, res) {
    var uniqueid = require('../helpers/id.js');
    var params = req.body;

    params.name = uniqueid.encode(now.getTime());
    params.file = params.name+'.pdf';

    var docs = db.collection('docs');
    docs.insert(params);

    res.contentType('json');
    res.send(JSON.stringify(params));
};

var create_pdf = function(data) {
    //console.log(data);
    var filename = data.name;

    var PDFDocument = require('pdfkit');
    var doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        info: {
            'Creator': 'http://genexa.info/'
        }
    });

    doc.font('Times-Roman').fontSize(12);
    doc.rect(80, 72, 80, 52).stroke();
    doc.fontSize(14).text(data.school, { align: 'center' });
    doc.fontSize(12).text(data.subject, { align: 'center' });
    doc.fontSize(12).text(data.teacher, { align: 'center' });
    doc.fontSize(12).text(data.period, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Nombre: ____________________________________   Grupo:__________'+'     '+data.date, { align: 'center' });

    return doc.output();
};
