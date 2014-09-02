var dbsPath = require('path').join(__dirname, '/dbs');
var dbs = module.exports = {};

require('./requires')(dbsPath, function (key, value) {
    dbs[key] = value;
});