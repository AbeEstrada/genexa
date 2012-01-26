
exports.index = function(req, res) {
    res.render('home');
};

exports.create = function(req, res) {
    var d = new Date();
    console.log(d);
    //console.log(req.body);
    if (req.body.questions) {
        for (var i=0; i < req.body.questions.length; i++) {
            console.log(req.body.questions[i]);
        };
    }
    var data = {
        'test': true
    };
    
    
    var PDFDocument = require('pdfkit');
    var doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait'
    });
    doc.font('Times-Roman').fontSize(12);
    doc.fontSize(14).text('Hello');
    doc.fontSize(12).text('World');
    doc.write('./public/pdf/out.pdf');
    
    
    res.contentType('json');
    res.send(JSON.stringify(data));
    
    //res.download('public/pdf/test.pdf');
};
