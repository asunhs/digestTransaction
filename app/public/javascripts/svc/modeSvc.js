(function () {
    'use strict';
    
    
    angular.module('DutchPayApp')
    .service('ModeSvc', function ($http, Receipts, ReceiptsSvc) {
        
        var svc = this,
            DIGEST = 'Digest',
            BOOK = 'Book',
            mode = BOOK;
        
        this.modes = {
            DIGEST : DIGEST,
            BOOK : BOOK
        };
        
        this.getMode = function () {
            return mode;
        };
        
        function cleanNotRegistedReceipts() {
            
            // clean
            _.chain(Receipts).filter(function (receipt) {
                return !receipt._id;
            }).each(function (receipt) {
                Receipts.splice(Receipts.indexOf(receipt), 1);
            });
            
            // clear
            _.each(Receipts, function (receipt) {
                delete receipt.isSelected;
            });
        }
        
        function digestMode () {
            mode = DIGEST;
            
            cleanNotRegistedReceipts();
        }
        
        function bookMode () {
            mode = BOOK;
            
            cleanNotRegistedReceipts();
        }
        
        this.mode = function (mode) {
            switch (mode) {
                case DIGEST: digestMode(); break;
                case BOOK: bookMode(); break;
                default: bookMode(); break;
            }
        };
        
        this.toggle = function () {
            switch (mode) {
                case DIGEST: bookMode(); break;
                case BOOK: digestMode(); break;
                default: bookMode(); break;
            }
        };
        
        this.digest = function () {
            
            var targets = _.filter(Receipts, function (receipt) {
                return receipt.isSelected;
            });
            
            cleanNotRegistedReceipts();
            
            $http.post('/receipts/digest', targets).success(function (receipts) {
                ReceiptsSvc.adjustReceipts(receipts);
            });
        };
        
    });
    
}())