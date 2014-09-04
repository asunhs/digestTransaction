(function () {
    'use strict';
    
    angular.module('DutchPayApp', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: '/partials/welcome.html',
            controller: 'WelcomeCtrl'
        })
        .when('/receipt', {
            templateUrl: '/partials/receipt.html',
            controller: 'ReceiptCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    });
}());