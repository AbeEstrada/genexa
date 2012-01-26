
exports.index = function(req, res) {
    res.render('home');
};

exports.create = function(req, res) {
    console.log('YEAH!');
    console.log(req.body);
    var data = {
        'test': true
    };
    res.contentType('json');
    res.send(JSON.stringify(data));
    //res.download('public/pdf/test.pdf');
};
