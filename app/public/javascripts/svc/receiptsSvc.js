(function () {
    'use strict';
    
    angular.module('DutchPayApp')
    .service('ReceiptsSvc', function ($http, Temporary, Pool, Receipts) {
        
        var svc = this;
        
        this.newReceipt = function (receipt) {
            return receipt || {};
        };
        
        this.adjustReceipt = function (receipt) {
            
            if (!receipt._id) {
                return;
            }
            
            if (receipt.temporary) {
                var temp = Temporary.pop(receipt.temporary);
                
                if (!temp._id) {
                    receipt = _.extend(temp, receipt);
                }
            }
            
            // Update
            var stocked = Pool.set(receipt);
            
            if (!_.contains(Receipts, stocked)) {
                Receipts.push(stocked);
            }
        };
        
        
        this.adjustReceipts = function (receipts) {
            _.each(receipts, svc.adjustReceipt);
        };
        
        
        this.saveReceipts = function (receipts) {
            
            _.each(receipts, Temporary.set);
            
            $http.post('/receipts/save', receipts).success(svc.adjustReceipts);
            
        };
        
        
        this.removeReceipts = function (receipts) {
            
            _.each(receipts, Temporary.set);
            
            $http.post('/receipts/remove', receipts).success(svc.adjustReceipts);
            
        };
        
        
        this.pullReceipts = function () {
            $http.get('/receipts').success(svc.adjustReceipts);
        };
    });
}());