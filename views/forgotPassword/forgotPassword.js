
angular.module("myApp")
.controller('forgotPasswordController', function($scope, serverAPI_service, rootScope_service){
    
    $scope.passwordRest = function(){

        rootScope_service.setPageLoader(true);

        serverAPI_service.forgotPassword($scope.username, function(ans){
            rootScope_service.setPageLoader(false);
            rootScope_service.setUserData({username : $scope.username});
            rootScope_service.setAlertData("RESET PASSWORD", "An e-mail has been sent to your e-mail address" , 1, null);
        })
    }

    $scope.backToLogin = function(){
         window.location.href = '/#!/userLogin';
    }

    // key press
    $scope.keyPress = function($event){
        if($event.code == "Enter"){
            $scope.passwordRest();
        }
    }

}); 
