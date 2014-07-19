'use strict';

angular.module('phriApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'd3',
  'c3',
  'ui.bootstrap',
  'leaflet-directive',
  'ngTable'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login',{
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
      .when('/taxpayer',{
        templateUrl: 'views/taxpayer.html',
        controller: 'TaxpayerCtrl'
      })
      .when('/transHotel',{
        templateUrl: 'views/transHotel.html',
        controller: 'MainCtrl'
      })
	  .when('/transParking',{
        templateUrl: 'views/transParking.html',
        controller: 'MainCtrl'
      })
	  .when('/transRestaurant',{
        templateUrl: 'views/transRestaurant.html',
        controller: 'TransRestaurantCtrl'
      })
	  .when('/analytic',{
        templateUrl: 'views/analytic.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
//setup dependency injection
angular.module('d3',[]);
angular.module('c3',['d3']);
