var express = require('express');
var routes = require('./routes');

var app = module.exports = express.createServer();


app.configure(function(){
    app.set('views', __dirname+'/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname+'/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});


app.get('/:name.:pdf', routes.doc);
app.get('/:name', routes.doc);
app.get('/', routes.index);
app.post('/', routes.create);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port %d in %s mode', app.address().port, app.settings.env);
