var async = require('async');

/* api */
function fileload(callback) {
    var file = 'file';
    
    'find file..';
    
    if (callback) callback(file);
}


function fileHandler(file, callback) {
    var handling = file + ' handling';
    
    if (callback) callback(handling);
}
/* api */


async.waterfall([
    function container(callback) {
        var var1, var2;

        'something do';

        fileload(callback);
    },
    function afterload (file, callback) {
        'after loading file';

        fileHandler(file, callback);

    },
    function afterHandling(result, callback) {
        'after handling';

        if (callback) callback(result);
    }
], function (err, result) {
    console.log(result);
})