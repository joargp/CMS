﻿// Generated by CoffeeScript 1.6.3
angular.module('article-list', ['resource.articles', "ChannelServices"]).config([
  "$routeProvider", function($routeProvider) {
    return $routeProvider.when("/", {
      templateUrl: "/Content/app/article/list/article-list.tpl.html",
      controller: 'ArticleListCtrl',
      resolve: {
        articles: [
          '$rootScope', '$route', '$q', 'Article', 'channel', function($rootScope, $route, $q, Article, channel) {
            var deferred;
            deferred = $q.defer();
            channel.getdefault().then(function(channel) {
              var _ref;
              return Article.queryOnce({
                $filter: "IsDeleted eq false \nand Group/Channel/Url eq '" + channel.Url + "' ",
                $skip: ((_ref = $route.current.params.p) != null ? _ref : 1) * 10 - 10
              }, function(data) {
                return deferred.resolve(data);
              });
            });
            return deferred.promise;
          }
        ]
      }
    }).when("/list/:channel/:group/tag/:tag", {
      templateUrl: "/Content/app/article/list/article-list.tpl.html",
      controller: 'ArticleListCtrl',
      resolve: {
        articles: [
          '$route', '$q', 'Article', function($route, $q, Article) {
            var deferred, _ref;
            deferred = $q.defer();
            Article.queryOnce({
              $filter: "IsDeleted eq false \nand Group/Channel/Url eq '" + $route.current.params.channel + "' \nand Tags/any(tag:tag/Name eq '" + $route.current.params.tag + "')",
              $skip: ((_ref = $route.current.params.p) != null ? _ref : 1) * 10 - 10
            }, function(data) {
              return deferred.resolve(data);
            });
            return deferred.promise;
          }
        ]
      }
    }).when("/list/:channel/:group", {
      templateUrl: "/Content/app/article/list/article-list.tpl.html",
      controller: 'ArticleListCtrl',
      resolve: {
        articles: [
          '$route', '$q', 'Article', function($route, $q, Article) {
            var deferred, _ref;
            deferred = $q.defer();
            Article.queryOnce({
              $filter: "IsDeleted eq false \nand Group/Channel/Url eq '" + $route.current.params.channel + "' \nand Group/Url eq '" + $route.current.params.group + "'",
              $skip: ((_ref = $route.current.params.p) != null ? _ref : 1) * 10 - 10
            }, function(data) {
              return deferred.resolve(data);
            });
            return deferred.promise;
          }
        ]
      }
    }).when("/list/:channel", {
      templateUrl: "/Content/app/article/list/article-list.tpl.html",
      controller: 'ArticleListCtrl',
      resolve: {
        articles: [
          '$route', '$q', 'Article', function($route, $q, Article) {
            var deferred, _ref;
            deferred = $q.defer();
            Article.queryOnce({
              $filter: "IsDeleted eq false \nand Group/Channel/Url eq '" + $route.current.params.channel + "'",
              $skip: ((_ref = $route.current.params.p) != null ? _ref : 1) * 10 - 10
            }, function(data) {
              return deferred.resolve(data);
            });
            return deferred.promise;
          }
        ]
      }
    }).when("/search/:key", {
      templateUrl: "/Content/app/article/list/article-list.tpl.html",
      controller: 'ArticleListCtrl',
      resolve: {
        articles: [
          '$route', '$q', 'Article', function($route, $q, Article) {
            var deferred, _ref;
            deferred = $q.defer();
            Article.queryOnce({
              $filter: "IsDeleted eq false \nand indexof(Title, '" + $route.current.params.key + "') gt -1",
              $skip: ((_ref = $route.current.params.p) != null ? _ref : 1) * 10 - 10
            }, function(data) {
              return deferred.resolve(data);
            });
            return deferred.promise;
          }
        ]
      }
    });
  }
]).controller('ArticleListCtrl', [
  "$scope", "$rootScope", "$window", "$routeParams", "$location", "articles", "channel", function($scope, $rootScope, $window, $routeParams, $location, articles, channel) {
    var _ref, _ref1, _ref2;
    $window.scroll(0, 0);
    $rootScope.title = (_ref = (_ref1 = $routeParams.tag) != null ? _ref1 : $routeParams.group) != null ? _ref : $routeParams.channel;
    if (!$rootScope.title) {
      if ($scope.key) {
        $rootScope.title = "Search Result: '" + $scope.key + "'";
      } else {
        channel.getdefault().then(function(data) {
          return $rootScope.title = data.Name;
        });
      }
    }
    $scope.list = articles;
    $scope.currentPage = (_ref2 = $routeParams.p) != null ? _ref2 : 1;
    $scope.params = $routeParams;
    $scope.setPage = function(pageNo) {
      return $location.search({
        p: pageNo
      });
    };
    return $scope.edit = function(item) {
      return $window.location.href = "/admin/article('" + item.PostId + "')";
    };
  }
]);
