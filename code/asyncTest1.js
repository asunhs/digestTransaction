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



function container(callback) {
    var var1, var2;
    
    'something do';
    
    fileload(function(file) {
        'after loading file';
        
        fileHandler(file, function (result) {
            'after handling';
            
            if (callback) callback(result);
        });
        
    });
}