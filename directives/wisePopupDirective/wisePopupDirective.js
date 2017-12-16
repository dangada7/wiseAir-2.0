angular.module("myApp")
.directive("wisePopup", function(){
    return {
        templateUrl : "/directives/wisePopupDirective/wisePopupDirective.html",
        scope : {
            showLastSection     : "=",
            showPopup           : "=",
            showTabs            : "=",
            data                : "=",
            clickSaveCallBack   : "&",
            clear               : "&",
        }, controller : function ($scope, rootScope_service){


            // clickTab
            $scope.clickTab = function(tab){
                $scope.data.currentTabName = tab.name;
            }

            // clickSave
            $scope.clickSave = function(){
                $scope.clickSaveCallBack();
            }

            // clickOnClose
            $scope.clickOnClose = function(){

                rootScope_service.setAlertData("New Campaign", "Are you sure you want to close this window? all your information will be lost." , 1, function(){
                    $scope.showPopup=false;
                    $scope.clear();
                })

            }


        } // close controller 


    }
})