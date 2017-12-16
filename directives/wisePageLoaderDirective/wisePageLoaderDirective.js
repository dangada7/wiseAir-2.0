angular.module("myApp")
.directive("wisePageLoader", function(){
    return {
        templateUrl : "/directives/wisePageLoaderDirective/wisePageLoaderDirective.html",
        controller : function ($scope, rootScope_service){

            init();

            
            // init
            function init(){
                $scope.getPageLoader = rootScope_service.getPageLoader();
            }

            // $scope.$watch('pageLoaderCounter', function(){
            //     console.log("watch")
            //     var showPageLoader = rootScope_service.getPageLoader().val;

            // },true);


        } // close controller 


    }
})