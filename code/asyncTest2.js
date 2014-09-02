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


function afterHandling(result) {
    'after handling';
    
    // callback ??
    // if (callback) callback(result);
    someRealFunction(result);
}


function afterload (file) {
    'after loading file';

    fileHandler(file, afterHandling);

}


function container(callback) {
    var var1, var2;
    
    'something do';
    
    fileload(afterload);
}