var mongoq = require('mongoq');
var db = mongoq(process.env.MONGOLAB_URI || 'genexa');

exports.help = function(req, res) {
    res.render('help');
};

exports.upload_get = function(req, res) {
    var data = { image: 'http://dummyimage.com/210x112/000/fff' };
    res.render('upload', { layout: false, data: data });
};

exports.upload_post = function(req, res) {
    var fs = require('fs');
    var crypto = require('crypto');
    var knox = require('knox');
    var data = {};
    var file = req.files.logo;
    if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
        var knox_settings = {};
        if (process.env.AWS_KEY && process.env.AWS_SECRET && process.env.AWS_S3_BUCKET) {
            knox_settings.key = process.env.AWS_KEY;
            knox_settings.secret = process.env.AWS_SECRET;
            knox_settings.bucket = process.env.AWS_S3_BUCKET;
        } else {
            knox_settings = require('../knox_settings.js').settings;
        }
        var client = knox.createClient(knox_settings);
        fs.readFile(file.path, function(err, buf) {
            var filename = crypto.createHash('md5').update((new Date()).getTime()+file.name).digest('hex')+'.'+(file.name.substring(file.name.length, file.name.length-3));
            var req = client.put('/logos/'+filename, {
                'Content-Length': buf.length,
                'Content-Type': file.type
            });
            req.on('response', function(res3) {
                if (res3.statusCode === 200) {
                    //console.log('saved to %s', req.url);
                    data.image = req.url;
                    res.render('upload', { layout: false, data: data });
                }
            });
            req.end(buf);
        });

    } else {
        fs.unlink(file.path);
        data.image = 'http://dummyimage.com/210x112/000/fff&text=Error';
        res.render('upload', { layout: false, data: data });
    }
};

var render = function(res, params) {
    var now = new Date();
    var date = now.getDate()+'/'+(now.getMonth()+1)+'/'+now.getFullYear();

    if (params) {
        res.render('home', params);
    } else {
        res.render('home', {
            logo: '',
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
        //console.dir(err);
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
        //console.log(params);
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
