
angular.module("myApp", ["ngRoute", 'oc.lazyLoad', 'dndLists', 'mp.deepBlur'])
.config(function($routeProvider) {

    var version = '?v=3.526'

    $routeProvider
    .when("/dashboard", {
       templateUrl : "views/dashboard/dashboard.html",
       controller  : "dashboardController",
       resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/dashboard/dashboard.js' + version,
                       'views/dashboard/dashboard.css' + version
               ]});
        }]}
    })
    // supply summary reports 
    .when("/reportsSupplySummary", {
        templateUrl : "views/reportsSupplySummary/reportsSupplySummary.html",
        controller  : "reportsSupplySummaryController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/reportsSupplySummary/reportsSupplySummary.js' + version,
                       'views/reportsSupplySummary/reportsSupplySummary.css' + version
               ]});
        }]}
    })

    // demand summary reports 
    .when("/reportsDemandSummary", {
        templateUrl : "views/reportsDemandSummary/reportsDemandSummary.html",
        controller  : "reportsDemandSummaryController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/reportsDemandSummary/reportsDemandSummary.js' + version,
                       'views/reportsDemandSummary/reportsDemandSummary.css' + version
               ]});
        }]}
    })

    // custom reports 
    .when("/reportsCustom", {
        templateUrl : "views/reportsCustom/reportsCustom.html",
        controller  : "reportsCustomController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/reportsCustom/reportsCustom.js' + version,
                       'views/reportsCustom/reportsCustom.css' + version
               ]});
        }]}
    })

    // saved reports
    .when("/reportsSaved", {
        templateUrl : "views/reportsSaved/reportsSaved.html",
        controller  : "reportsSavedController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/reportsSaved/reportsSaved.js' + version,
                       'views/reportsSaved/reportsSaved.css' + version
               ]});
        }]}
    })

    // manage supply
    .when("/manageSupply", {
        templateUrl : "views/manageSupply/manageSupply.html",
        controller  : "manageSupplyController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/manageSupply/manageSupply.js' + version,
                       'views/manageSupply/manageSupply.css' + version,
                       'directives/newSupplySourceDirective/newSupplySourceDirective.css' + version,
                       'directives/newSupplySourceDirective/newSupplySourceDirective.js' + version,
               ]});
        }]}
    })
    // manage demand
    .when("/manageDemand", {
        templateUrl : "views/manageDemand/manageDemand.html",
        controller  : "manageDemandController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/manageDemand/manageDemand.js' + version,
                       'views/manageDemand/manageDemand.css' + version,
                       'directives/newDemandSourceDirective/newDemandSourceDirective.css' + version,
                       'directives/newDemandSourceDirective/newDemandSourceDirective.js' + version,
               ]});
        }]}
    })
    .when("/analysisDayPart", {
        templateUrl : "views/analysisDayPart/analysisDayPart.html",
        controller  : "analysisDayPartController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/analysisDayPart/analysisDayPart.js' + version,
                       'views/analysisDayPart/analysisDayPart.css' + version
               ]});
        }]}
    })
    .when("/analysisAlertRules", {
        templateUrl : "views/analysisAlertRules/analysisAlertRules.html",
        controller  : "analysisAlertRulesController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/analysisAlertRules/analysisAlertRules.js' + version,
                       'views/analysisAlertRules/analysisAlertRules.css' + version
               ]});
        }]}
    })
    .when("/analysisPlanner", {
        templateUrl : "views/analysisPlanner/analysisPlanner.html",
        controller  : "analysisPlannerController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/analysisPlanner/analysisPlanner.js' + version,
                       'views/analysisPlanner/analysisPlanner.css' + version
               ]});
        }]}
    })
    .when("/userLogin", {
        templateUrl : "views/userLogin/userLogin.html",
        controller  : "userLoginController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/userLogin/userLogin.js' + version,
                       'views/userLogin/userLogin.css' + version
               ]});
        }]}
    })
    .when("/", {
        templateUrl : "views/userLogin/userLogin.html",
        controller  : "userLoginController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/userLogin/userLogin.js' + version,
                       'views/userLogin/userLogin.css' + version
               ]});
        }]}
    })
    .when("/forgotPassword", {
        templateUrl : "views/forgotPassword/forgotPassword.html",
        controller  : "forgotPasswordController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/forgotPassword/forgotPassword.js' + version,
                       'views/forgotPassword/forgotPassword.css' + version
               ]});
        }]}
    })
    .when("/passwordReset", {
        templateUrl : "views/passwordReset/passwordReset.html",
        controller  : "passwordResetController",
        resolve: {
           lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
               return $ocLazyLoad.load({
                   name : 'myApp',
                   files: [
                       'views/passwordReset/passwordReset.js' + version,
                       'views/passwordReset/passwordReset.css' + version
               ]});
        }]}
    })
    ;




})

function runConfig($rootScope, rootScope_service, $timeout) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next && next['$$route']) {
            var route = next['$$route']['originalPath'];
            //route is 'url', 'url1' or 'urlX'
            rootScope_service.setPageLoader(true);
            // $rootScope.showPageLoaderTest = true;
        }
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, prev) {
            if (current && current['$$route']) {
                var route = current['$$route']['originalPath'];
                //route is 'url', 'url1' or 'urlX'

                rootScope_service.setPageLoader(false);

            }
    });
}

angular
        .module('myApp')
        .run(runConfig);

