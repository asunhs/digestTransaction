(function () {
    'use strict';
    
    angular.module('DutchPayApp').filter('receipt', function (Pool) {
        return function (receiptId) {

            var receipt = Pool.get(receiptId);
            
            return receipt && receipt.title;
        };
    });
}())