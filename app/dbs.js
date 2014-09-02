var path = require('path');
var fs = require('fs');
var dbsPath = path.join(__dirname, '/dbs');
var dbs = module.exports = [];

// dbs
fs.readdirSync(dbsPath).forEach(function (file) {
    var matched = file.match(/(.*)\.(js$)/);
    if (matched) {
        dbs[matched[1]] = require(dbsPath + '/' + file);
    }
});