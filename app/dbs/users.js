var mongoose = require('mongoose');
var User = mongoose.model('User');
var _ = require('underscore');
var async = require('async');



module.exports.findByEmails = function (emails, cb) {
    
    return User.find({ 'email' : { $in : emails }}, function (err, users) {
        if (!!err) {
            return cb(err, null);
        }
        
        return cb(null, users);
    });
};


module.exports.findByIds = function (ids, cb) {
    return User.find({ '_id': { $in: ids }}, function(err, users) {
        if (!!err) {
            return cb(err, null);
        }
        
        return cb(null, users);
    });
};


module.exports.save = function (users, callback) {
    
    var docs = [];
    
    async.each(users, function (user, cb) {
        
        if (!user._id) {
            // Do create
            user.createdTimestamp = Date.now();
            
            return new User(user).save(function (err, doc) {
                docs.push(doc);
                cb();
            });
        } else {
            // Do update
            user.modifiedTimestamp = Date.now();
            
            return User.update({ '_id' : user._id }, user, function (err, doc) {
                docs.push(doc);
                cb();
            });
        }
        
    }, function (err) {
        callback(err, docs);
    });
    
    
};


module.exports.remove = function (users, callback) {
    
    var docs = [];
    
    async.each(users, function (user, cb) {
        
        if (!!user._id) {
            // Do remove
            user.removedTimestamp = Date.now();
            
            User.findById(user._id, function (err, doc) {
                if (!!doc.digestId) {
                    return cb(new Error('already digested'));
                }
                
                doc.removedTimestamp = Date.now();
                doc.save(function (err, doc) {
                    docs.push(doc);
                    cb();
                });
            });
        }
        
    }, function (err) {
        callback(err, docs);
    });
    
};