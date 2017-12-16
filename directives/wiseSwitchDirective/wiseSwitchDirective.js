angular.module("myApp")
.directive("wiseSwitch", function(){
    return {
        templateUrl : "/directives/wiseSwitchDirective/wiseSwitchDirective.html",
        scope : {
            label : "@",
            status : "=",
            onChangeCallBack : "&",
            showLoader : "=",
            width   : "@",
        },
        controller : function($scope) {

            if(!$scope.status)
                $scope.status == false;

            $scope.onChangeCallBackWrapper = function(){
                status = !status;
                $scope.onChangeCallBack()
            }
        }
    }
});