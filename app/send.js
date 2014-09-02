var async = require('async')


var queue = async.queue(function (name, cb) {
    setTimeout(function () {
        console.log(name);
        cb(name);
    }, 100);
});

queue.drain = function () {
    console.log('drain');
};

function test() {
    var i;
    
    for (i=0; i<10; i++) {
        queue.push(i);
    }
}

//test()

//setTimeout(test, 2000);

async.each([1,2,3,4,5], function (i, cb) {
    setTimeout(function () {
        console.log(i);
        cb(null, i, 'name');
    }, i*1000)
}, function (err, results) {
    console.log(err, results);
});