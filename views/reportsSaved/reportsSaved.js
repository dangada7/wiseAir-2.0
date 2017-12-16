
angular.module("myApp")
.controller('reportsSavedController', function($scope, serverAPI_service, rootScope_service, processData_service, exportFile_service){

    initTable();
    // var savedReportName_g;
    
    // updateFilterBtnCallBack
    function initTable(){

        $scope.tableShowLoader = true;
        $scope.updateTable = 0;

        // get table data
        serverAPI_service.getSavedReportsData("Saved Reports / table ", function(data){

            $scope.tableShowLoader = false;
            $scope.tableData = data;
            addActionColumn();
            $scope.updateTable++;
        });
    }

    // addActionColumn
    function addActionColumn(){

        if($scope.tableData.tableLiteMeasures.indexOf("actions") != -1)
            return

        var actionsData=[
                    {func: deleteReport, class:"deleteReport", title : "Delete" , src : "/resources/images/delete.svg", srcHover : "/resources/images/delete_hover.svg"},
                    {func: exportReport, class: "exportBtn2" , title : "Export" , src : "/resources/images/export.svg", srcHover : "/resources/images/export_hover.svg"},
                    {func: runReport,    class:"runReport"   , title : "Run"    , src : "/resources/images/run.svg", srcHover : "/resources/images/run_hover.svg"},
                    {func: editReport,   class:"editReport"  , title : "Edit"   , src : "/resources/images/edit.svg", srcHover : "/resources/images/edit_hover.svg"},
                    ];

        $scope.tableData.tableLiteMeasures.push("actions");
        $scope.tableData.tableTitles["actions"] = "Actions";
        $scope.tableData.tableBody.forEach(function(tableRowData){
            tableRowData["actions"] = JSON.parse(JSON.stringify(actionsData));
             tableRowData["actions"][0].func = deleteReport
             tableRowData["actions"][1].func = exportReport
             tableRowData["actions"][2].func = runReport
             tableRowData["actions"][3].func = editReport
        });
    }

    //  runReport
    function runReport(savedReportData){

        var runReport = true;
        rootScope_service.setSavedReportData(savedReportData, runReport)
        window.location.href="#!/reportsCustom";
    }

    // downloadReport
    function exportReport(savedReportData){

        var receive = { data : null, compareData : null};

        rootScope_service.setPageLoader(true);
        // savedReportName_g = savedReportData.name[0].label

        var sendData = {
            fromSavedReport : true,
            compare : false
        }
        Object.assign(sendData, savedReportData)

        // get table data
        serverAPI_service.getTableReport("saved report / supply sources table", sendData, function(data){
            receive.data = data
            if(receive.compareData != null){
                rootScope_service.setPageLoader(false);
                processData_service.addTableCompareData(receive.data,receive.compareData);
                var keys = receive.data.tableDimensions.concat(receive.data.tableFullMeasures)
                exportFile_service.downloadCSV(receive.data.tableBody, keys, savedReportData.name[0].label + ".csv", receive.data.tableTitles);
            }
        });

        var sendData = {
            fromSavedReport : true,
            compare : true
        }
        Object.assign(sendData, savedReportData)
        // get compare table data
        serverAPI_service.getTableReport("saved report / supply sources table", sendData, function(data){
            receive.compareData = data
            if(receive.data != null){
                rootScope_service.setPageLoader(false);
                processData_service.addTableCompareData(receive.data,receive.compareData);
                var keys = receive.data.tableDimensions.concat(receive.data.tableFullMeasures)
                exportFile_service.downloadCSV(receive.data.tableBody, keys, savedReportData.name[0].label + ".csv", receive.data.tableTitles);
            }
        });

    }

    // deleteReport
    function deleteReport(savedReportData){

        rootScope_service.setAlertData("Do you want to delete: " +  savedReportData.name[0].label, "", 0
        , function(){
            rootScope_service.setPageLoader(true);

            serverAPI_service.deleteSavedReport("SAVED REPORT / DELETE", savedReportData.id, savedReportData.user_id, function(){
                rootScope_service.setPageLoader(false);

                $scope.tableData.tableBody = $scope.tableData.tableBody.filter(function(rowData){
                    return rowData.id != savedReportData.id;
                });

                $scope.updateTable++;

            });

        });

    }

    // editReport
    function editReport(savedReportData){
        var runReport = false;
        rootScope_service.setSavedReportData(savedReportData, runReport)
        window.location.href="#!/reportsCustom";
    }

});
