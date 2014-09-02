var settings = require('./settings.json').database;
var mongoose = require('mongoose');
var dbsPath = require('path').join(__dirname, '/dbs');
var dbs = module.exports = {};


mongoose.connect(settings.host + '/' + settings.db, {
    user : settings.user,
    pass : settings.password
});


require('./requires')(dbsPath, function (key, value) {
    dbs[key] = value;
});