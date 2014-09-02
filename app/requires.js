var fs = require('fs');


module.exports = function requires(pathname, cb) {
    fs.readdirSync(pathname).forEach(function (file) {
        var matched = file.match(/(.*)\.(js$)/);
        if (matched) {
            if (cb) {
                cb(matched[1], require(pathname + '/' + file));
            } else {
                require(pathname + '/' + file);
            }
        }
    });
}