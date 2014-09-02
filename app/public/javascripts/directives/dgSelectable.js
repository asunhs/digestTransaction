(function () {
    'use strict';
    
    angular.module('DutchPayApp').directive('dgSelectable', function (ModeSvc) {
        
        return {
            restrict : 'A',
            link : function (scope, element, attrs) {
                
                element.on('click', function () {
                        
                    var receipt = scope.receipt;
                    
                    if (ModeSvc.getMode() != ModeSvc.modes.DIGEST) {
                        return;
                    }

                    if (receipt.digestId) {
                        return;
                    }
                    
                    scope.$apply(function() {
                    
                        if (receipt.isSelected) {
                            delete receipt.isSelected;
                        } else {
                            receipt.isSelected = true;
                        }
                        
                    });
                    
                });
            }
        };
    });
}());