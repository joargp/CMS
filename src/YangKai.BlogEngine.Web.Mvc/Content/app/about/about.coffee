﻿angular.module('about',[])

.config(["$routeProvider", ($routeProvider) ->
  $routeProvider
    .when "/about",
      templateUrl: "/Content/app/about/about-newegg-bts.tpl.html"
      controller: 'AboutCtrl'
      title: 'About'
      resolve:
        members: ['$q','$http',($q,$http)->
          deferred = $q.defer()
          $http.get('/Content/data/about-newegg-bts.js').success (data)->
            deferred.resolve data
          deferred.promise
        ]
])

.controller('AboutCtrl',
["$scope","members", ($scope,members) ->
  viewMembers=[]
  for item,i in members
    rowId=Math.floor(i/4)
    viewMembers[rowId]=[] if !viewMembers[rowId]
    viewMembers[rowId].push item
  $scope.members=viewMembers
])