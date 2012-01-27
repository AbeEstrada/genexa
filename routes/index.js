
exports.index = function(req, res) {
    res.render('home');
};

exports.create = function(req, res) {
    var uniqueid = require('../helpers/id.js');
    var date = new Date();
    var params = req.body;
    
    //console.log(params);
    
    if (params.questions) {
        for (var i=0; i < params.questions.length; i++) {
            console.log(params.questions[i]);
        };
    }
    params.id = uniqueid.encode(date.getTime());
    
    var pdf_file = create_pdf(params);
    //console.log(pdf_file);
    
    res.contentType('json');
    res.send(JSON.stringify(params));
    
    //res.download('public/pdf/test.pdf');
};

var create_pdf = function(data) {
    console.log(data);
    
    var PDFDocument = require('pdfkit');
    var doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait'
    });
    var filename = 'out';
    doc.font('Times-Roman').fontSize(12);
    doc.fontSize(14).text('Hello', { align: 'center' });
    doc.fontSize(12).text('World');
    doc.write('./public/pdf/'+filename+'.pdf');
    
    return filename+'.pdf';
};
