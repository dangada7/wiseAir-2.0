angular.module('myApp')
.controller('analysisAlertRulesController', function($scope, serverAPI_service, processData_service){
    
    initAlert();
  


    // initAlert
    function initAlert(){
    }

    // updateAlertsRulesTable
    $scope.getAlertTable = function(){
        $scope.showTableLoader = true;
        $scope.alertData = null;

        serverAPI_service.getAlertsRulesList("analysis alerts rules", function(res){
            $scope.alertData =  res;
            $scope.updateAlertTable++;
            $scope.showTableLoader = false;
        });
    }


    // clickNewAlertRuleButton
    $scope.clickNewAlertRuleButton = function(){
        $scope.showPopup = true
    }


    $scope.getAlertTable();






})