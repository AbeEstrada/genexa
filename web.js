var express = require('express');
var routes = require('./routes');

var fs = require('fs');
var util = require('util');
var is = fs.createReadStream('./node_modules/pdfkit/node_modules/flate/build/Release/zlib_bindings.node')
var os = fs.createWriteStream('./node_modules/pdfkit/node_modules/flate/lib/zlib_bindings.node');
util.pump(is, os);

var app = module.exports = express.createServer();

app.configure(function() {
    app.set('views', __dirname+'/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname+'/public'));
    app.use(express.bodyParser());
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});


app.post('/feedback', routes.feedback);
app.get('/ayuda', routes.help);
app.get('/upload', routes.upload_get);
app.post('/upload', routes.upload_post);

app.get('/:name.:pdf', routes.doc);
app.get('/:name', routes.doc);

app.get('/', routes.index);
app.post('/', routes.create);

app.listen(process.env.PORT || 3000);
console.log('Listening on port %d in %s mode', app.address().port, app.settings.env);
