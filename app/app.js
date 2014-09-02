var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('static-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

mongoose.connect('mongodb://localhost/digest');

// models
var modelsPath = path.join(__dirname, '/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});


// routes
var routesPath = path.join(__dirname, '/routes');
fs.readdirSync(routesPath).forEach(function (file) {
    var matched = file.match(/(.*)\.(js$)/);
    if (matched) {
        app.use('/' + matched[1], require(routesPath + '/' + file));
    }
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.sendfile('views/error.html');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.sendfile('views/error.html');
});


module.exports = app;
