﻿// Generated by CoffeeScript 1.6.3
angular.module('admin-board', ['resource.messages']).config([
  "$routeProvider", function($routeProvider) {
    return $routeProvider.when("/admin/board", {
      templateUrl: "/content/app-admin/board/board.tpl.html",
      controller: 'BoardCtrl'
    });
  }
]).controller('BoardCtrl', ["$scope", "$routeParams", "$location", "Message", function($scope, $routeParams, $location, Message) {}]);
