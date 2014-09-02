(function () {
    'use strict';
    
    angular.module('DutchPayApp')
    .controller('MainCtrl', function ($scope, ModeSvc, ReceiptsSvc, Receipts) {
        
        ReceiptsSvc.pullReceipts();
        
        $scope.welcome = "Welcome!";
        
        $scope.receipts = Receipts;
        
        $scope.modes = ModeSvc.modes;
        
        $scope.getMode = ModeSvc.getMode;
        
        $scope.digest = ModeSvc.digest;
        
        $scope.saveReceipts = ReceiptsSvc.saveReceipts;
        
        $scope.removeReceipts = ReceiptsSvc.removeReceipts;
        
        $scope.getTotal = function (receipt) {
            return _.chain(receipt.transactions).pluck('amount').compact().reduce(function (sum, amount) {
                return sum + amount;
            }, 0).value();
        };
        
        
        
        
        $scope.addReceipt = function (receipts) {
            
            if (!receipts) {
                return;
            }
            
            receipts.push(ReceiptsSvc.newReceipt());
        };
        
        $scope.toggleDigestMode = function () {
            ModeSvc.toggle();
        };
        
        $scope.confirmMode = function (mode) {
            return ModeSvc.getMode() === mode;
        };
        
        
        
        
        
        $scope.addTransaction = function (receipt) {
            
            if (!!receipt.createdTimestamp) {
                return;
            }
            
            if (!receipt.transactions) {
                receipt.transactions = [];
            }
            
            receipt.transactions.push({});
        };
        
        $scope.addReceipt = function (receipts) {
            
            if (!receipts) {
                return;
            }
            
            receipts.push(ReceiptsSvc.newReceipt());
        };
    });
}());