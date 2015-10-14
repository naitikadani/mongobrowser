/**
 * Created by vishant on 21/2/15.
 */
'use strict';

var app = angular.module('abcTodo', ['ngRoute','angular-json-tree']);

var options = {};
options.api = {};
options.api.base_url = "https://murmuring-island-4056.herokuapp.com";


app.config(function($routeProvider){
    $routeProvider.when('/', {
            templateUrl : 'desktopui/mongoapp/views/main.html',
            controller : 'mainController'
        }).
       /* when('/material', {
            templateUrl: 'desktopui/todoapp/views/material.html',
            controller: 'MaterialCtrl'
        }).*/
        otherwise({
            redirectTo: '/'
        });
});



angular.element(document).ready(function() {

    this.boot = function () {
        angular.bootstrap(document, ['abcTodo']);
    };

    this.boot();
});

app.controller('AnimationController', function($scope, $timeout){
    $timeout(function(){
        $scope.getTimes=function(n){
            return new Array(n);
        };
    }, 100);
});
