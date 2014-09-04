(function () {
    'use strict';
    
    angular.module('DutchPayApp')
    .service('UserSvc', function ($http, User) {
        
        var svc = this;
        
        function request(url, user, success, fail) {
            $http.post(url, user).success(function (user) {
                _.extend(User, user);
                success();
            }).error(fail);
        }
        
        this.login = function (user, success, fail) {
            request('/users/login', user, success, fail);
        };
        
        this.signUp = function (user, success, fail) {
            request('/users/signUp', user, success, fail);
        };
    });
}());