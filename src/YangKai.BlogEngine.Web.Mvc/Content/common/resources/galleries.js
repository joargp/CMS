﻿
angular.module("resource.galleries", ["ngResource"]).factory("Gallery", [
  '$resource', function($resource) {
    return $resource("/odata/Gallery:id/:action", {
      id: '@id',
      action: '@action'
    }, {
      query: {
        method: "GET",
        params: {
          $orderby: 'CreateDate desc'
        }
      },
      queryOnce: {
        cache: true,
        method: "GET",
        params: {
          $orderby: 'CreateDate desc'
        }
      },
      update: {
        method: "PUT"
      }
    });
  }
]);
