
angular.module("myApp")
.service("serverAPI_service", function($http, $timeout, mock_service, processData_service, rootScope_service, $q){

    var canceler_g = {};
    var localData_g = {
        filters : null,
        manage  : {},
        chart   : {},
        getSavedReports : null,
    }


    var deployed = "";
    var dev = "http://ec2-54-145-128-111.compute-1.amazonaws.com";
    var localHost = "http://127.0.0.1:8000";

    // for development change preURL
    var preUrl = deployed;

    // login
    this.login = function(userNameAtt, passwordAtt, callBackFunc){

        // MOCK
        if(isMockLogin(userNameAtt, passwordAtt)){
            var res = mock_service.getMockLogin();
            rootScope_service.setAccessToken(res.token_type + ' ' + res.access_token);
            $timeout(function(){callBackFunc(res)}, getRandomTime());
            return;
        }

        // SERVER
        httpCall({  requestId   : "login",
                    method      : "POST",
                    url         : '/api/general/authenticate',
                    body        : {password : passwordAtt, username : userNameAtt},
                    failedMessage : "login",
                    successFunc : function(res){
                        rootScope_service.setAccessToken(res.token_type + ' ' + res.access_token)
                        callBackFunc(res)
                    }
        });
    }

    // forgotPassword
    this.forgotPassword = function(username, callBackFunc){

      httpCall({    requestId   : "password_reset",
                    method      : "POST",
                    url         : '/api/general/password_reset',
                    body        : {username : username},
                    failedMessage : "forgotPassword",
                    successFunc : function(res){
                        callBackFunc(res.data)
                    }
        });

    }

    // passwordRest
    this.passwordRest = function(newPassword, userName, accessToken, callBackFunc){


        // SERVER
        httpCall({  requestId   : "login",
                    method      : "POST",
                    url         : '/api/general/change_password',
                    body        : {username : userName, new_password : newPassword},
                    access_token : accessToken,
                    failedMessage : "change password",
                    successFunc : function(res){
                        callBackFunc(res)
                    }
        });
    }

    // GET FILTERS DATA
    this.getFiltersData = function (logMessage, callBackFunc, callId) {

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }

        // LOCAL
        if(localData_g.filters != null){
            callBackFunc(localData_g.filters);
            return;
        }

        // MOCK
        if(isMockUser()){
            res = mock_service.getMockFiltersData();
            processData_service.receiveData_filtersData(res.data);
            localData_g.filters = res;
            $timeout(function(){callBackFunc(res)}, getRandomTime());
            return;
        }

        // SERVER
        httpCall({  requestId   : callId == null ? "getFiltersData" : callId,
                    method      : "GET",
                    url         : '/api/manage/filters_data',
                    failedMessage : logMessage,
                    successFunc : function(res){
                        processData_service.receiveData_filtersData(res.data)
                        localData_g.filters = res;
                        callBackFunc(res)
                    }
                })

    }

    // GET KPIs DATA
    this.getKPIsData = function (logMessage, dataToSend, callBackFunc) {

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }

        // MOCK
        if(isMockUser()){
            res = mock_service.getMockKPIsData(dataToSend.compare);
            var processedData = processData_service.receiveData_KPIData(res.data);
            $timeout(function(){callBackFunc(processedData)}, getRandomTime());
            return;
        }

        // SERVER
        httpCall({  requestId   : "getKPIData",
                    method      : "post",
                    url         : '/api/manage/summary_stats',
                    body        : processData_service.sendData_report(dataToSend),
                    failedMessage : logMessage,
                    successFunc : function(res){
                        processedData = processData_service.receiveData_KPIData(res.data);
                        callBackFunc(processedData);
                    }
                })
    }

    // GET TABLE REPORTS
    this.getTableReport = function (logMessage, dataToSend, callBackFunc) {

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }


        var processDataToSend;
        if(dataToSend.fromSavedReport)
            processDataToSend = processData_service.sendData_reportFromSavedReport(dataToSend);
        else
            processDataToSend = processData_service.sendData_report(dataToSend);

        // MOCK
        if(isMockUser()){
            res = mock_service.getMockTableReport(processDataToSend.type, dataToSend.compare, processDataToSend.dimensions, processDataToSend);
            var processRes = processData_service.receiveData_tableReport(res.data, processDataToSend.dimensions, processDataToSend.type)
            $timeout(function(){callBackFunc(processRes)}, getRandomTime());
            return;
        }

        // SERVER
        httpCall({  requestId   : "getTableReport" + processDataToSend.type + dataToSend.compare + processDataToSend.dimensions.toString(),
                    method      : "POST",
                    url         : '/api/reporting/summary_report',
                    body        : processDataToSend,
                    failedMessage : logMessage,
                    successFunc : function(res){
                        processRes = {}
                        if(res.data)
                            processRes = processData_service.receiveData_tableReport(res.data, processDataToSend.dimensions, processDataToSend.type)
                        callBackFunc(processRes);
                    }
                })

    }

    // GET CHART REPORT
    this.getChartReport = function(logMessage, dataToSend, callBackFunc) {

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }

        processData = processData_service.sendData_report(dataToSend);

        // MOCK
        if(isMockUser()){
            var res = mock_service.getMockChartReport(dataToSend.type, dataToSend.compare, processData);
            var processedData = processData_service.receiveData_chartData(res.data, dataToSend.type);
            $timeout(function(){callBackFunc(processedData)}, getRandomTime());
            return;
        }

        // SERVER
        httpCall({  requestId   : "getChartReport" + dataToSend.type + dataToSend.compare,
                    method      : "POST",
                    url         : '/api/reporting/summary_report',
                    body        : processData,
                    failedMessage : logMessage,
                    successFunc : function(res){
                        processChartData = processData_service.receiveData_chartData(res.data, dataToSend.type)
                        callBackFunc(processChartData)
                    }
                });
    }

    // GET NOTIFICATION DATA
    this.getSystemNotification = function(logMessage, callBackFunc){

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }

        if(isMockUser()){
            res = mock_service.getMockSystemNotificationData();
            processedData = processData_service.receiveData_getSystemNotification(res.event_notifications);
            callBackFunc(processedData);
            return;
        }


        httpCall({  requestId     : "systemNotification",
                    method        : "GET",
                    url           : '/api/manage/event_notification',
                    failedMessage : logMessage,
                    successFunc   : function(res){
                        pd = processData_service.receiveData_getSystemNotification(res.event_notifications)
                        callBackFunc(pd)                    }
                });
    }

    // GET ALERT DATA
    this.getAlertNotification = function(logMessage, callBackFunc){

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }


        if(isMockUser()){
            res = mock_service.getMockAlertData();
            processedData = processData_service.receiveData_getAlertNotification(res.alert_notifications);
            callBackFunc(processedData);
            return;
        }


        httpCall({  requestId     : "alertNotification",
                    method        : "GET",
                    url           : '/api/manage/alert_notification',
                    params        : { user_id : rootScope_service.getUserData().id},
                    failedMessage : logMessage,
                    successFunc   : function(res){
                        pd = processData_service.receiveData_getAlertNotification(res.alert_notifications)
                        callBackFunc(pd)
                    }
                });
    }

    // putAlertNotificationMarkAsRead
    this.putAlertNotificationMarkAsRead = function (logMessage, callBackFunc){
        httpCall({  requestId     : "alertNotification",
                    method        : "PUT",
                    url           : '/api/manage/alert_notification',
                    body        : { user_id : rootScope_service.getUserData().id},
                    failedMessage : logMessage,
                    successFunc   : function(res){
                        callBackFunc()
                    }
        });
    }

    // GET ALERT DATA
    this.getAlertsRulesList = function(logMessage, callBackFunc){

        // check user login
        if(rootScope_service.getUserData() == null){
            window.location.href = '/#!/dashboard';
        }


        // mock
        if(isMockUser()){
            res = mock_service.getMockAlertRules();
            pd = processData_service.receiveData_getAlertsRulesList(res.data)
            callBackFunc(pd)
            return;
        }

        // server
        httpCall({  requestId     : "getAlertRuleList",
                    method        : "GET",
                    url           : '/api/manage/alert_rule',
                    params        : { user_id : rootScope_service.getUserData().id},
                    failedMessage : logMessage,
                    successFunc   : function(res){
                        pd = processData_service.receiveData_getAlertsRulesList(res.data)
                        callBackFunc(pd)
                    }
                });
    }

    // postNewAlertRule
    this.postNewAlertRule = function(logMessage, sendData, callBackFunc){

        var proSendData = processData_service.sendData_postNewAlertRule(sendData);

        httpCall({  requestId     : "postNewAlertRule",
                    method        : "POST",
                    url           : '/api/manage/alert_rule',
                    body          : proSendData,
                    failedMessage : logMessage,
                    successFunc   : function(res){
                        callBackFunc()
                    }
                });
    }

    // SAVED REPORT DATA
    this.savedReportData = function(logMessage, filtersData, savedReportName, callBackFunc){

        // clean local saved report list
        localData_g.getSavedReports = null;

        var userId = rootScope_service.getUserData().id
        var bodyData = processData_service.sendData_savedReport(filtersData, userId, savedReportName);

        httpCall({  requestId   : "savedReportData",
                    method      : "POST",
                    url         : '/api/manage/saved_report',
                    body        : bodyData,
                    failedMessage : logMessage,
                    successFunc : function(res){
                        callBackFunc()
                    }
                });

    }

    // GET SAVED REPORT DATA
    this.getSavedReportsData = function(logMessage, callBackFunc)   {

        // LOCAL
         if (localData_g.getSavedReports){
             callBackFunc(localData_g.getSavedReports);
             return;
         }

        // MOCK
        if(isMockUser()){
            res = mock_service.getMockSavedReportsData();
            processedData = processData_service.receiveData_getSavedReports(res.data);
            localData_g.getSavedReports = processedData;
            callBackFunc(processedData);
            return;
        }

        // SERVER
          httpCall({
                requestId   : "savedReportData",
                method      : "GET",
                url         : '/api/manage/saved_report',
                params      : { user_id : rootScope_service.getUserData().id},
                failedMessage : logMessage,
                successFunc : function(res){
                    processedData = processData_service.receiveData_getSavedReports(res.data)
                    localData_g.getSavedReports = processedData;
                    callBackFunc(processedData)
                }
            });
    }  

    // DELETE SAVED REPORT
    this.deleteSavedReport = function (logMessage, savedReportId, userId, callBackFunc){
        httpCall({
                requestId   : "deleteSavedReport",
                method      : "DELETE",
                url         : '/api/manage/saved_report/' + savedReportId,
                failedMessage : logMessage,
                successFunc : function(res){
                    callBackFunc()
                }
        });
    }

    // edit saved reprot
    this.editSavedReport = function (logMessage, savedReportId, filtersData, savedReportName, callBackFunc){
        
        localData_g.getSavedReports = null;


        var userId = rootScope_service.getUserData().id
        var bodyData = processData_service.sendData_savedReport(filtersData, userId, savedReportName);

        httpCall({
                requestId   : "deleteSavedReport",
                method      : "put",
                url         : '/api/manage/saved_report/' + savedReportId,
                body        : bodyData,
                failedMessage : logMessage,
                successFunc : function(res){
                    callBackFunc();
                }
        });
    }

    // GET TABLE MANAGE DATA
    this.getManageTableData = function(logMessage, endOfUrl, callBackFunc){

        if(isMockUser()){
            var res = mock_service.getMockManageTableData(endOfUrl);
            var processRes = processData_service.receiveData_manageTable(res.data, endOfUrl)
            $timeout(function(){callBackFunc(processRes)}, getRandomTime());
            return;
        }


        if(localData_g.manage[endOfUrl] != null)
            callBackFunc(localData_g.manage[endOfUrl]);


        httpCall({
                requestId   : "getManageTableData" + endOfUrl,
                method      : "GET",
                url         : '/api/manage/' + endOfUrl,
                failedMessage : logMessage,
                successFunc : function(res){
                    var processRes = processData_service.receiveData_manageTable(res.data, endOfUrl)
                    localData_g.manage[endOfUrl] = processRes
                    callBackFunc(processRes);
                }
        });

    }

    // GET TABLE MANAGE DATA
    this.postNewManageData = function(logMessage, endOfUrl, dataToSend, callBackFunc){  

        processDataToSend = processData_service.sendData_newManage(endOfUrl, dataToSend);

        httpCall({
                requestId   : "postNewManageData" + endOfUrl,
                method      : "POST",
                url         : '/api/manage/' + endOfUrl,
                body        : processDataToSend,
                failedMessage : logMessage,
                successFunc : function(res){
                    var processRes = processData_service.sendData_newManage(res.data, endOfUrl)
                    callBackFunc(processRes);
                }
        });

    }

    // GET DAY PART DATA
    this.getDayPartData = function(logMessage, sendData, callBackFunc){

        if(isMockUser()){
            res = mock_service.getMockDayPartLastWeek();
            processedData = processData_service.receiveData_dayPart(res.data);
            $timeout(function(){callBackFunc(processedData)}, getRandomTime());
            return;
        }

       var proSendData = processData_service.sendData_report(sendData)

       httpCall({
                    requestId       : "getDayPartData" + sendData.type,
                    method          : "GET",
                    url             : '/api/reporting/' + sendData.type + '_daypart_report',
                    params          : proSendData,
                    failedMessage   : logMessage,
                    successFunc     : function(res){
                        var proDayPart = processData_service.receiveData_dayPart(res.data, sendData)
                        callBackFunc(proDayPart)
                    }
                });
    }

   // GET DAY PART DATA
    this.getDemandSources = function(logMessage, callBackFunc){

       httpCall({
                    requestId       : "getDemandSources",
                    method          : "GET",
                    url             : '/api/manage/demand_source',
                    failedMessage   : logMessage,
                    successFunc     : function(res){
                        callBackFunc(res.data)
                    }
                });
    }

    // GET DAY PART DATA
    this.getSupplySources = function(logMessage, callBackFunc){

       httpCall({
                    requestId       : "getSupplySources",
                    method          : "GET",
                    url             : '/api/manage/supply_source',
                    failedMessage   : logMessage,
                    successFunc     : function(res){
                        callBackFunc(res.data)
                    }
                });
    }

    // postUserKpiOrder
    this.postUserPreferences = function(logMessage, sendData ,callBackFunc){

       var processSendData = processData_service.sendData_postUserPreferences(sendData);

       // MOCK
       if(isMockUser()){
            return;
       }

       httpCall({
            requestId       : "getSupplySources",
            method          : "POST",
            url             : '/api/general/update_user_preferences',
            body            : processSendData,
            failedMessage   : logMessage,
            successFunc     : function(res){
                callBackFunc(res.data)
            }
        });

    }

    // ==========
    // FUNCTIONS:
    // ==========

    // isMockUser
    function isMockUser(){

        return rootScope_service.getUserData().username == "demo" ;
    }

    // isMockLogin
    function isMockLogin(userNameAtt, passwordAtt){

        return userNameAtt == "demo" && passwordAtt == "demo1!"
    }

    // httpCall
    function httpCall(attData){
        cancelRequestByRequestId(attData.requestId)

        $http({
            method: attData.method,
            url: preUrl + attData.url,
            headers: {
               'authorization'  : attData.access_token ? attData.access_token : rootScope_service.getAccessToken(),
               'content-type'   : 'application/json'
            },
            params : attData.params,
            data   : attData.body,
            timeout : canceler_g[attData.requestId].val.promise,
        })
        .then(function mySuccess(res) {
            if (res.data.status){
                attData.successFunc(res.data)
            }

        }, function myError(res) {
            console.log(attData.failedMessage);
            handleServerError(res, attData.requestId);
        });

    }

    // handleServerError
    function handleServerError(res, funcName){

        rootScope_service.setPageLoader(false);

        switch (res.status){

           case 400:
                rootScope_service.setAlertData("ERROR",  res.data.message, 0, null );
                console.log(res)

           case 401:
                rootScope_service.setAlertData("FAILED TO LOGIN",  "Wrong user or password", 0, null );
                console.log(res)

                break;
            case 403:
                rootScope_service.setAlertData("YOUR SESSION HAS TIMED OUT:", "Please login again", 0
                    , function(){
                        window.location.href = '/';
                    });
                console.log(res)

                break;
            case 500:
                 rootScope_service.setAlertData("Internal Server Error:", "Please contact the admin", 0, null);
                 console.log(res)

                 break;
            default:
                console.log(res, funcName)
        }
    }

    // cancelRequestByRequestId
    var cancelRequestByRequestId = function (id){

        if(canceler_g[id] != null && canceler_g[id].inProgress)
            canceler_g[id].val.resolve("http call aborted");

        canceler_g[id] = {val : $q.defer(), inProgress: true}
    }

    // getRandomTime
    function getRandomTime(){

        var min = 500;
        var max = 1000;

        return Math.random() * (max - min) + min;
    }

});

