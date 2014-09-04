var express = require('express');
var router = express.Router();
var _ = require('underscore');
var async = require('async');
var db = require('../dbs');
var crypto = require('crypto');
var settings = require('../settings');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/login', function (req, res) {
    
    console.log('login :', req.body.email);
    
    var user = req.body;
    
    async.waterfall([
        function (cb) {
            
            return db.users.findByEmails([user.email], cb);
        },
        function (users, cb) {
            if (!users || (users.length < 1)) {
                return cb(new Error('not existed user'));
            }
            
            if (users[0].password !== crypto.createHmac('sha1', settings.hashKey).update(user.password).digest('hex')) {
                return cb(new Error('incorrect login information'));
            }
        
            req.session.user = users[0];
            
            return cb(null, user);
        },
        function (user, cb) {
            // TODO session 처리
            
            return cb(null, user);
        }
    ], function (err, user) {
        
        if (!!err) {
            return res.status(400).send(err.message);
        }
        
        return res.send(_.pick(req.session.user, 'email', 'nick'));
    });
    
    
});

router.post('/signUp', function (req, res) {
    
    console.log('signUp :', req.body.email);
    
    var user = req.body;
    
    async.waterfall([
        function (cb) {
            
            if (!user.email
                || !user.nick
                || !user.password) {
                return cb(new Error('incorrect sign up information'));
            }
            
            return db.users.findByEmails([user.email], cb);
        },
        function (users, cb) {
            if (users && (users.length > 0)) {
                return cb(new Error('already registed email'));
            }
            
            user.password = crypto.createHmac('sha1', settings.hashkey).update(user.password).digest('hex');
            
            return db.users.save([user], cb);
        }
    ], function (err, user) {
        
        if (!!err) {
            return res.status(400).send(err.message);
        }
        
        return res.redirect(307, '/users/login');
    });
    
});

module.exports = router;
