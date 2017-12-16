angular.module("myApp")
.controller('navigationBarController', function($scope, $interval, $timeout, $location, currentTime_service, serverAPI_service, processData_service, rootScope_service,$route){
   
    // set the clock
    var timeZoneIndex;
    var timeZoneOptions;
    initNavBar();
    // start running the clock;
    var stopTime = $interval(updateTime, 1000);

    var selectedDropDown_g = {}

    var currentLocation_g = $location.path();

    // ==========
    // functions:
    // ==========

    // initTimeZone
    function initNavBar() {

        $scope.userName = rootScope_service.getUserName();

        $scope.initNewRuleDirective = 0;

       // clock 
        timeZoneIndex = 0;
        timeZoneOptions = currentTime_service.getTimeZoneOptions();

        $scope.currentTime = {  timeZone :timeZoneOptions[0].label,
                                time : timeZoneOptions[timeZoneIndex].getTime()};

        // init notification and alert
        $scope.systemNotificationNum = 0;
        $scope.updateSystemNotificationTable = 0;

        $scope.alertNotificationNum = 0;
        $scope.updateAlertTable = 0;


        $scope.updateNotification = rootScope_service.getUpdateNotificationVar()

        
    }

    // updateTimeZone
    function updateTime(){

        $scope.currentTime.time = timeZoneOptions[timeZoneIndex].getTime();
    }

    // =================
    // $scope functions:
    // =================

    // changeTimeZone
    $scope.changeTimeZone = function() {
        timeZoneIndex = (timeZoneIndex + 1) % timeZoneOptions.length;
        
        $scope.currentTime.timeZone = timeZoneOptions[timeZoneIndex].label;
        $scope.currentTime.time = timeZoneOptions[timeZoneIndex].getTime();
    }
    
    // currentLocation 
    $scope.currentLocation = function (locationName){
        var ans ;
        var grayBackGround = false;

        // check user login
        if(rootScope_service.getUserData() == null && !$location.path().includes('forgotPassword') && !$location.path().includes('passwordReset') ){
            window.location.href = '/#!/userLogin';
        }

        if ($location.path().includes("reports") ){
            if(!$location.path().includes("reportsSaved"))
                grayBackGround = true;
            ans = locationName == 'reports';
        }else if ($location.path() == '/dashboard' || $location.path() == ''){
            grayBackGround=true;
            ans = locationName == 'dashboard';
        }else if ($location.path().includes('manage')){
            ans = locationName == 'manage';
        }else if ($location.path().includes('analysis')){
            ans = locationName == 'analysis';
            grayBackGround = true;
        }else if ($location.path().includes('Login') || $location.path() == '/' ){
            grayBackGround = true;
            ans  = locationName == 'login';
        }else if ($location.path().includes('forgotPassword') ){
            grayBackGround = true;
            ans  = locationName == 'forgotPassword';
        }else if ($location.path().includes('passwordReset') ){
            grayBackGround = true;
            ans  = locationName == 'passwordReset';
        }else {
            console.log("t2")
            window.location.href = '/#!/userLogin';
        }

        if(grayBackGround)
            document.getElementById("body").style.background="#555453";
        else
            document.getElementById("body").style.background="#333333";


        return ans;
    }

    // showTopBar
    $scope.showTopBar = function(){

        return !($scope.currentLocation('login') || $scope.currentLocation('forgotPassword') || $scope.currentLocation('passwordReset'))
    }
    
    // logout
    $scope.logout = function(){
        rootScope_service.setUserData(null);
        window.location.href = '/#!/userLogin';
    }

    // logout
    $scope.changePassword = function(){

        window.location.href = '/#!/passwordReset';
    }

    // notify row formant
    $scope.formantRowMessage = function(str){
        var l = str.length;
        var ans = "";
        var i ;
        for(i=0 ; (i+1)*50 < l; i++){
            ans += str.substring(i*50,(i+1)*50) + " ";
        }


        ans += str.substring(i*50,l);

        return ans;
    }

    // open rule
    $scope.openRule = function(){

        window.location.href = '/#!/analysisAlertRules';
    }

    // clickAlertNotificationMarkAsRead
    $scope.clickAlertNotificationMarkAsRead = function(){

        serverAPI_service.putAlertNotificationMarkAsRead("alert notification - mark as read", function(){
            $scope.updateNotification.val++;
        })

    }

    // moveTo
    $scope.moveTo = function(endUrl){

        if(endUrl.includes($location.path()))
            return;

        // $route.reload();
        // $scope.isExpanded_reports = false;
        rootScope_service.setPageLoader(true);
        // currentLocation_g = endUrl

        $timeout(function(){
            window.location.href = endUrl;
        }, 100)
    }   

    // $scope.checkTempLocation = function(location){
    //     return currentLocation_g.includes(location)
    // }

    // clickDropDown
    $scope.clickDropDown = function(dropDownName){
        if (selectedDropDown_g[dropDownName]){
            selectedDropDown_g[dropDownName] = false;

        }else {
            for(key in selectedDropDown_g)
                selectedDropDown_g[key]=false;
            selectedDropDown_g[dropDownName] = true;
        }
    }

    // checkDropDown
    $scope.checkDropDown = function(dropDownName){
        return selectedDropDown_g[dropDownName];
    }


    // =======
    // $watch:
    // =======
    
    // updateNotification.val
    $scope.$watch("updateNotification.val", function(){

        if ($location.path() == "" || $location.path() == "/" || $location.path().includes("userLogin") || $location.path().includes("forgotPassword") || $location.path().includes("passwordReset"))
            return;

        // system notification data
        $scope.systemNotificationData = null;
        $scope.systemNotificationLoader = true;
        serverAPI_service.getSystemNotification("Nav Bar system notification", function(res){
            $scope.systemNotificationData =  res;
            $scope.systemNotificationNum = res.tableBody.length;
            $scope.systemNotificationLoader = false;
            $scope.updateSystemNotificationTable++;
        });

        // alert notification Data
        $scope.alertNotificationData = null;
        $scope.systemNotificationLoader = true;
        serverAPI_service.getAlertNotification("Nav Bar alert notification", function(res){
            $scope.alertNotificationData =  res;
            $scope.alertNotificationNum = res.tableBody.length;
            $scope.updateAlertNotificationTable++;
            $scope.alertNotificationLoader = false;
        });
    });
})