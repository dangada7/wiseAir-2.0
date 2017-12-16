angular.module("myApp")
.directive("wiseAlertPopup", function(){
    return {
        templateUrl : "/directives/wiseAlertPopupDirective/wiseAlertPopupDirective.html",
        controller : function ($scope, rootScope_service){

            init();

            function init(){
                $scope.data = rootScope_service.getAlertData();
            }

            $scope.ok = function(){
                $scope.data.show = false;

                if($scope.data.okFunc)
                    $scope.data.okFunc();
            }

        } // close controller 


    }
})