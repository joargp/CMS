﻿
angular.module('admin-article-edit', []).factory("TranslateService", [
  "$http", function($http) {
    return {
      events: function(key) {
        return $http({
          method: "JSONP",
          url: "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=JSON_CALLBACK&appId=A4D660A48A6A97CCA791C34935E4C02BBB1BEC1C&from=zh-cn&to=en&text=" + key
        });
      }
    };
  }
]).config([
  "$routeProvider", function($routeProvider) {
    return $routeProvider.when("/admin/article(':id')", {
      templateUrl: "/content/app/admin/article/edit/article-edit.tpl.html",
      controller: 'ArticleEditCtrl'
    }).when("/admin/article/new", {
      templateUrl: "/content/app/admin/article/edit/article-edit.tpl.html",
      controller: 'ArticleEditCtrl'
    });
  }
]).controller('ArticleEditCtrl', [
  "$scope", "$routeParams", "$window", "$rootScope", "uploadManager", "Article", "Channel", "$timeout", "TranslateService", function($scope, $routeParams, $window, $rootScope, uploadManager, Article, Channel, $timeout, TranslateService) {
    var save, timeout;
    $scope.channels = Channel.query({
      $expand: 'Groups'
    }, function() {
      if ($routeParams.id) {
        $scope.loading = "Loading";
        return Article.get({
          $filter: "PostId eq (guid'" + $routeParams.id + "')"
        }, function(data) {
          var item, _i, _len, _ref;
          $scope.entity = data.value[0];
          $scope.channelId = $scope.entity.Group.Channel.ChannelId;
          $scope.groupId = $scope.entity.Group.GroupId;
          if ($scope.entity.Tags) {
            $scope.tags = '';
            _ref = $scope.entity.Tags;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              $scope.tags += ',' + item.Name;
            }
            $scope.tags = $scope.tags.substring(1);
          }
          return $scope.loading = "";
        });
      } else {
        return $scope.entity = {};
      }
    });
    $scope.getGroups = function() {
      var item, _i, _len, _ref;
      if ($scope.channels.value === void 0) {
        return void 0;
      }
      _ref = $scope.channels.value;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.ChannelId === $scope.channelId) {
          return item.Groups;
        }
      }
    };
    $scope.submit = function() {
      $scope.isSubmit = true;
      if ($scope.form.$invalid) {
        return;
      }
      if (!$scope.channelValid()) {
        return;
      }
      if (!$scope.groupValid()) {
        return;
      }
      $scope.loading = "Saving";
      if ($scope.files.length) {
        return uploadManager.upload();
      } else {
        return save();
      }
    };
    $scope.channelValid = function() {
      return $scope.channels.value;
    };
    $scope.groupValid = function() {
      return $scope.groupId;
    };
    save = function() {
      var entity, item, _i, _len, _ref;
      entity = $scope.entity;
      entity.Group = {};
      entity.Group.GroupId = ((function() {
        var _i, _len, _ref, _results;
        _ref = $scope.getGroups();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.GroupId === $scope.groupId) {
            _results.push(item);
          }
        }
        return _results;
      })())[0].GroupId;
      entity.Tags = [];
      if ($scope.tags) {
        _ref = $scope.tags.split(",");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          entity.Tags.push({
            TagId: UUID.generate(),
            Name: item
          });
        }
      }
      if (!$routeParams.id) {
        entity.PostId = UUID.generate();
        return Article.save(entity, function(data) {
          return $window.location.href = "/post/" + data.Url;
        }, function(error) {
          return $scope.loading = "";
        });
      } else {
        return Article.update({
          id: "(guid'" + entity.PostId + "')"
        }, entity, function(data) {
          return $window.location.href = "/post/" + data.Url;
        }, function(error) {
          return $scope.loading = "";
        });
      }
    };
    $scope.remove = function() {
      return message.confirm(function() {
        var entity;
        $scope.loading = "Deleting";
        entity = $scope.entity;
        entity.IsDeleted = true;
        return Article.update({
          id: "(guid'" + entity.PostId + "')"
        }, entity, function(data) {
          message.success("Delete post successfully.");
          return $window.location.href = "/admin/article";
        });
      });
    };
    $scope.files = [];
    $scope.removeImg = function(file) {
      var deleteFile, f, _i, _len, _ref;
      _ref = $scope.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        if (f.name === file.name) {
          deleteFile = f;
        }
      }
      $scope.files.splice($scope.files.indexOf(deleteFile), 1);
      return uploadManager.cancel(file);
    };
    $scope.removeServerImg = function() {
      return $scope.entity.Thumbnail = null;
    };
    $rootScope.$on("fileAdded", function(e, call) {
      $scope.files.push(call);
      return $scope.$apply();
    });
    $rootScope.$on("fileUploaded", function(e, call) {
      $scope.entity.Thumbnail = call.result;
      return save();
    });
    timeout = void 0;
    return $scope.translateTitle = function() {
      if ($scope.entity.Title) {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        return timeout = $timeout(function() {
          $scope.Translating = true;
          return TranslateService.events($scope.entity.Title).success(function(data, status) {
            data = $.trim(data);
            data = data.toLowerCase();
            data = data.replace(/[^_a-zA-Z\d\s]/g, '');
            data = data.replace(/[\s]/g, "-");
            $scope.entity.Url = data;
            return $scope.Translating = false;
          });
        }, 500);
      }
    };
  }
]);
