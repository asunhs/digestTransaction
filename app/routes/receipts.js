var express = require('express');
var router = express.Router();
var _ = require('underscore');
var async = require('async');
var db = require('../dbs');
var digest = require('../services/digest');


/* GET users listing. */
router.get('/', function(req, res) {
    
    db.receipts.find(null, function (err, receipts) {
        
        if (!!err) {
            return res.send(err);
        }

        return res.send(receipts);
    });
    
});

router.post('/save', function (req, res) {
    
    var receipts = _.chain(req.body).filter(function (receipt) {
            return !!receipt.temporary;
        }).map(function (receipt) {
            return _.extend(receipt, {
                type : 'receipt',
                status : 'yet',
                transactions : _.filter(receipt.transactions, function (transaction) {
                    return transaction.from && transaction.amount && transaction.amount > 0;
                })
            });
        }).value();
    
    db.receipts.save(receipts, function (err, receipts) {
        res.send(receipts);
    });
    
});

router.post('/digest', function (req, res) {
    
    async.waterfall([
        function (cb) {
            var receiptIds = _.chain(req.body).pluck('_id').compact().value();
            
            if (_.isEmpty(receiptIds)) {
                return cb(new Error('non seleted'));
            }
        
            db.receipts.findByIds(receiptIds, cb);
        },
        function (receipts, cb) {
        
            if (_.some(receipts, function (receipt) {
                return receipt.digestId;
            })) {
                return cb(new Error('already digested'));
            }
            
            var transactions = _.chain(receipts).map(function (receipt) {
                return _.map(receipt.transactions, function (transaction) {
                    return {
                        to : receipt.owner || transaction.to,
                        from : transaction.from,
                        amount : transaction.amount
                    };
                });
            }).flatten().value();
            
            
            db.receipts.save([{
                title : 'Digest "' + _.min(receipts, function (receipt) { return receipt.title.length; }).title + ((receipts.length > 1) ? '" and ' + (receipts.length - 1) + ' more' : ''),
                receipts : _.pluck(receipts, '_id'),
                transactions : digest.getMethods(digest.summarize(transactions))
            }], function (err, digests) {
                cb(null, receipts, digests);
            });
        },
        function (receipts, digests, cb) {
            
            var digest = digests[0];

            async.each(receipts, function (receipt, cb) {
                receipt.digestId = digest._id;
                receipt.save(cb);
            }, function (err) {
                cb(_.union(receipts, digests));
            });
        }
    ], function (err, results) {
        if (!!err) {
            res.send(err);
        } else {
            res.send(results);
        }
    });
    
});

router.post('/remove', function (req, res) {
    
    async.waterfall([
        function (cb) {
            var receipts = _.filter(req.body, function (receipt) {
                return !!receipt.temporary && !!receipt._id;
            });

            if (_.isEmpty(receipts)) {
                return cb(new Error('non seleted'));
            }
            
            db.receipts.findByIds(_.pluck(receipts, '_id'), cb);
        },
        function (receipts, cb) {
            
            async.series([
                function (cb) {
                   db.receipts.remove(receipts, cb); 
                },
                function (cb) {
                    var revokeds = _.flatten(_.pluck(receipts, 'receipts'));
                    
                    db.receipts.findByIds(revokeds, function (err, docs) {
                        
                        async.each(docs, function (doc, cb) {
                            doc.digestId = null;
                            doc.save(cb);
                        }, function (err) {
                            cb(null, docs);
                        });
                        
                    });
                }
            ], function (err, results) {
                if (err) {
                    return cb(err);
                }
                
                cb(null, _.flatten(results));
            });
            
        }
    ], function (err, receipts) {
        res.send(receipts);
    });
    
});

module.exports = router;
