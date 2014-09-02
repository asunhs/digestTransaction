(function () {
    'use strict';
    
    
    
    function Distributer(precision) {
        
        if (!(this instanceof Distributer)) {
            return new Distributer(precision);
        }
        
        this.precision = precision || 1;
    }
    
    Distributer.prototype.evenly = function (total, n) {

        var rest = total % n,
            amount = (total - rest) / n;

        return _.times(n, function () {
            return amount + ((rest-- > 0 ) ? 1 : 0);
        });
    };
    
    Distributer.prototype.distribute = function (total, n) {
        
        if (n == 0) {
            return;
        }

        var rest = total % this.precision,
            dist = _.map(this.evenly((total - rest) / this.precision, n), function (amount) {
                return amount * this.precision;
            }, this);

        dist[0] += rest;
        
        return dist;
    };


    angular.module('DutchPayApp')
    .directive('dgReceipt', function () {
        
        return {
            restrict : 'A',
            link : function (scope, element, attrs) {
                
                var dist = new Distributer();
                
                dist.precision = 100;
                
                scope.$watch('receipt.total', function (newValue, oldValue) {
                    
                    if (scope.receipt.trigger === 'transaction') {
                        delete scope.receipt.trigger;
                        return;
                    }
                    
                    if (!scope.receipt.transactions) {
                        return;
                    }
                    
                    _.each(scope.receipt.transactions, function(transaction, index) {
                        transaction.amount = this[index];
                    }, dist.distribute(scope.receipt.total, scope.receipt.transactions.length));
                });
                
            }
        };
        
    })
    .directive('dgTransaction', function () {
        
        return {
            restrict : 'A',
            link : function (scope, element, attrs) {
                
                scope.transaction.amount = _.chain(scope.receipt.transactions).pluck('amount').initial().last().value();
                
                scope.$watch('transaction.amount', function (newValue, oldValue) {
                    var total = _.chain(scope.receipt.transactions).pluck('amount').compact().reduce(function (sum, amount) {
                        return sum + amount;
                    }, 0).value();
                    
                    if (scope.receipt.total != total) {
                        scope.receipt.trigger = 'transaction';
                        scope.receipt.total = total;
                    }
                });
                
            }
        };
    });
}());