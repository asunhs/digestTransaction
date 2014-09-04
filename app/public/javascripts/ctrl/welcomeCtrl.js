(function () {
    'use strict';
    
    angular.module('DutchPayApp')
    .controller('WelcomeCtrl', function ($scope, $location, UserSvc) {
        
        $scope.user = {};
        
        $scope.isSignUp = false;
        
        $scope.error = false;
        
        $scope.login = function () {
            
            if (!$scope.user.email || !$scope.user.password) {
                return $scope.error = true;
            }
            
            $scope.error = false;
            
            UserSvc.login($scope.user, function () {
                $location.path('receipt');
            }, function () {
                $scope.error = true;
            });
        };
        
        $scope.signUp = function () {
            
            if ($scope.isSignUp) {
            
                if (!$scope.user.password
                    || ($scope.user.password !== $scope.user.confirmed)) {
                    return $scope.error = true;
                }
                
                UserSvc.signUp($scope.user, function () {
                    $location.path('receipt');
                }, function () {
                    $scope.error = true;
                });
            } else {
                $scope.isSignUp = true;
            }
        };
        
        $scope.cancel = function () {
            $scope.isSignUp = false;
        };
    });
}());