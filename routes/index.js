
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
    //console.log(data);
    var filename = data.id;
    
    var PDFDocument = require('pdfkit');
    var doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait'
    });
    
    var header_posx = 180;
    
    doc.font('Times-Roman').fontSize(12);
    doc.rect(100, 72, 80, 40).stroke();
    doc.fontSize(14).text(data.institution, { align: 'center' });
    doc.fontSize(12).text(data.subject, { align: 'center' });
    doc.fontSize(12).text('Maestro: '+data.teacher, { align: 'center' });
    doc.fontSize(12).text(data.period, { align: 'center' });
    doc.fontSize(12).text('Nombre: ____________________________________'+'     '+data.date, { align: 'center' });
    doc.write('./public/pdf/'+filename+'.pdf');
    
    return filename+'.pdf';
};
