
angular.module("myApp")
.controller('userLoginController', function($scope, serverAPI_service, rootScope_service){

    // login
    $scope.login = function(){
        rootScope_service.setPageLoader(true);

        serverAPI_service.login($scope.username, $scope.password, function(ans){
            rootScope_service.setPageLoader(false);
            rootScope_service.setUserData(ans);
            window.location.href = '/#!/dashboard';
            rootScope_service.updateNotification()

        });
    }


    // forgotPass
    $scope.forgotPass = function(){
        console.log("t");
        window.location.href = '/#!/forgotPassword';
    }


    //  showText
    $scope.showText = function(){
        return window.innerWidth > 1300
    }

    // key press
    $scope.keyPress = function($event){
        if($event.code == "Enter"){
            $scope.login();
        }
    }
}); 