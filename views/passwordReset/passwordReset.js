
angular.module("myApp")
.controller('passwordResetController', function($scope, serverAPI_service, rootScope_service, $routeParams){
    
    $scope.submit = function(){

        if($scope.newPassword1 != $scope.newPassword2){
            rootScope_service.setAlertData("Error", "Passwords are not identical" , 1, null);
            return
        }

        // alert("In development");
        // return;

        rootScope_service.setPageLoader(true);
        serverAPI_service.passwordRest($scope.newPassword1, rootScope_service.getUserName().val, "Bearer " + $routeParams.token, function(ans){
            rootScope_service.setPageLoader(false);
            rootScope_service.setAlertData("CHANGE PASSWORD", "Your password has been changed successfully! Thank you." , 1, null);
            $scope.backToLogin();
        })
    }

    $scope.backToLogin = function(){
         window.location.href = '/#!/userLogin';
    }

    // key press
    $scope.keyPress = function($event){
        if($event.code == "Enter"){
            $scope.submit();
        }
    }

}); 
