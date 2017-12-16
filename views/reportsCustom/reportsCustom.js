
angular.module("myApp")
.controller('reportsCustomController', function($scope, rootScope_service, serverAPI_service, processData_service){


    var selectedFilters_g ={}

    initFilters();
    initBodySection();

    // ==========
    // Functions:
    // ==========

    // initFilters
    function initFilters(){

        $scope.clearCustom = 0;

        $scope.showFiltersLoader = true;

        // Dimensions:
        var dimensionOptions = rootScope_service.getDimensionsOptions();

        $scope.dimensionsData = 
                {dim1: {title: "Dimension 1", options:dimensionOptions.slice(), selectedData: dimensionOptions[0].options[0] , placeholder : "" },
                 dim2: {title: "Dimension 2", options:dimensionOptions.slice(), selectedData: dimensionOptions[0].options[0] , placeholder : "" },
                 dim3: {title: "Dimension 3", options:dimensionOptions.slice(), selectedData: dimensionOptions[0].options[0] , placeholder : "" },
                 dim4: {title: "Dimension 4", options:dimensionOptions.slice(), selectedData: dimensionOptions[0].options[0] , placeholder : "" }};

        // Date 
        var dateOptions = rootScope_service.getDateOptions();
        var timezoneOptions = rootScope_service.getTimezoneOptions();
        var timeIntervalOptions = rootScope_service.getTimeIntervalOptions();

        var deviceMakeOptions = rootScope_service.getDeviceMakeOptions();
        var osOptions = rootScope_service.getOsOptions();
        var browserOptions = rootScope_service.getBrowserOptions();
        var playerSizeOptions = rootScope_service.getPlayerSizesOptions();

        $scope.filtersDateData = {
            timezone       : {options: timezoneOptions,     selectedData : timezoneOptions[0]    , placeholder : "" , objectKey:"label"},
            date           : {options: dateOptions,         selectedData : dateOptions[0]        , placeholder : "" , objectKey:"regLabel"},
            timeInterval   : {options: timeIntervalOptions, selectedData : timeIntervalOptions[0], placeHolder : "" , objectKey:"label"}
        }

        $scope.filtersData = {
            supplyPlatforms : {options: [], selectedData : [] , placeholder : "Supply Platform" , objectKey: "label", type:"multiple"},
            supplyPartners  : {options: [], selectedData : [] , placeholder : "Supply Partners" , objectKey: "label", type:"multiple_autocomplete"},
            supplySources   : {options: [], selectedData : [] , placeholder : "Supply Source"   , objectKey: "label", type:"multiple_autocomplete", lazyLoad:true},
            campaigns       : {options: [], selectedData : [] , placeholder : "Campaign"        , objectKey: "label", type:"multiple_autocomplete"},

            demandPlatforms : {options: [], selectedData : [] , placeholder : "Demand Platform" , objectKey: "label", type:"multiple"},
            demandPartners  : {options: [], selectedData : [] , placeholder : "Demand Partners" , objectKey: "label", type:"multiple_autocomplete"},
            demandSources   : {options: [], selectedData : [] , placeholder : "Demand Source"   , objectKey: "label", type:"multiple_autocomplete", lazyLoad:true},
            domain          : {selectedData : {val : ""}, type:"input", placeholder: "Domains"},

            // deviceMake      : {options: deviceMakeOptions, selectedData: deviceMakeOptions[0], placeholder: "Device Make",  objectKey: "label", type:"regular_title"},
            // os              : {options: osOptions, selectedData: osOptions[0], placeholder: "Operation System",  objectKey: "label", type:"regular_title"},
            // browser         : {options: browserOptions, selectedData: browserOptions[0], placeholder: "Browser",  objectKey: "label", type:"regular_title"},
            // playerSize      : {options: playerSizeOptions, selectedData: playerSizeOptions[0], placeholder: "Player Size",  objectKey: "label", type:'regular_title'},
//            geo             : {selectedData : {}, type:"input", placeholder: "Geo"},
        }



        // get supplyPartners
        serverAPI_service.getFiltersData("SupplyReport / initFilters", function(res){

            $scope.filtersData.supplyPartners.options      = res.data.supply_partners ? res.data.supply_partners         : [];
            $scope.filtersData.supplyPartners.selectedData      = [];
//            $scope.filtersData.supplyPartners.selectedData = res.data.supply_partners ? res.data.supply_partners.slice() : [];

            $scope.filtersData.demandPartners.options      = res.data.demand_partners ? res.data.demand_partners         : [];
            $scope.filtersData.demandPartners.selectedData      = [];
//            $scope.filtersData.demandPartners.selectedData = res.data.demand_partners ? res.data.demand_partners.slice() : [];

            $scope.filtersData.campaigns.options           = res.data.campaigns ? res.data.campaigns          : [];
            $scope.filtersData.campaigns.selectedData      = [];
//            $scope.filtersData.campaigns.selectedData      = res.data.campaigns ? res.data.campaigns.slice()  : [];

            $scope.filtersData.supplySources.options       = res.data.players ? res.data.players         : [];
            $scope.filtersData.supplySources.selectedData      = [];
//            $scope.filtersData.supplySources.selectedData  = res.data.players ? res.data.players.slice() : [];

            $scope.filtersData.demandSources.options       = res.data.demand_sources ? res.data.demand_sources         : [];
            $scope.filtersData.demandSources.selectedData      = [];
//            $scope.filtersData.demandSources.selectedData  = res.data.demand_sources ? res.data.demand_sources.slice() : [];

            $scope.filtersData.supplyPlatforms.options      = res.data.supply_platforms ? res.data.supply_platforms          : [];
            $scope.filtersData.supplyPlatforms.selectedData      = [];
//            $scope.filtersData.supplyPlatforms.selectedData = res.data.supply_platforms ? res.data.supply_platforms.slice()  : [];

            $scope.filtersData.demandPlatforms.options      = res.data.demand_platforms ? res.data.demand_platforms          : [];
            $scope.filtersData.demandPlatforms.selectedData      = [];
//            $scope.filtersData.demandPlatforms.selectedData = res.data.demand_platforms ? res.data.demand_platforms.slice()  : [];

            $scope.showFiltersLoader = false;

            setSavedReportData();

        });


    }

    // todo: move to processData_service
    // setSavedReportDat
    function setSavedReportData(){

        var savedReportData = rootScope_service.getSavedReportData();
        rootScope_service.setSavedReportData(null);
        if(savedReportData == null)
            return null;

        $scope.reportType = savedReportData.type[0].label;

        // dimensions 
        $scope.dimensionsData.dim1.selectedData = getDimensionsByLabel(savedReportData.dim1[0].label);
        $scope.dimensionsData.dim2.selectedData = getDimensionsByLabel(savedReportData.dim2[0].label);
        $scope.dimensionsData.dim3.selectedData = getDimensionsByLabel(savedReportData.dim3[0].label);
        $scope.dimensionsData.dim4.selectedData = getDimensionsByLabel(savedReportData.dim4[0].label);

        // date filters
        $scope.filtersDateData.timezone.selectedData = filterArrBy($scope.filtersDateData.timezone.options, savedReportData.timezone[0].label, "label" )
        $scope.filtersDateData.date.selectedData = filterArrBy($scope.filtersDateData.date.options, savedReportData.date[0].label, "label" )
        $scope.filtersDateData.timeInterval.selectedData = filterArrBy($scope.filtersDateData.timeInterval.options, savedReportData.granularity[0].label, "label" )

        // filters 
        $scope.filtersData.supplyPlatforms.selectedData = $scope.filtersData.supplyPlatforms.options.filter(function(item){return savedReportData.supply_platforms_ids.indexOf(item.id) > -1})
        $scope.filtersData.demandPlatforms.selectedData = $scope.filtersData.demandPlatforms.options.filter(function(item){return savedReportData.demand_platforms_ids.indexOf(item.id) > -1})
        $scope.filtersData.supplyPartners.selectedData = $scope.filtersData.supplyPartners.options.filter(function(item){return savedReportData.supply_partners_ids.indexOf(item.id) > -1})
        $scope.filtersData.demandPartners.selectedData = $scope.filtersData.demandPartners.options.filter(function(item){return savedReportData.demand_partners_ids.indexOf(item.id) > -1})

        $scope.filtersData.supplySources.selectedData = $scope.filtersData.supplySources.options.filter(function(item){return savedReportData.supply_sources_ids.indexOf(item.id) > -1})
        $scope.filtersData.demandSources.selectedData = $scope.filtersData.demandSources.options.filter(function(item){return savedReportData.demand_sources_ids.indexOf(item.id) > -1})
        $scope.filtersData.campaigns.selectedData = $scope.filtersData.campaigns.options.filter(function(item){return savedReportData.campaigns_ids.indexOf(item.id) > -1})

            // $scope.filtersData.deviceMake.selectedData = $scope.filtersData.deviceMake.options.filter(function(item){return savedReportData.device_make.indexOf(item.id) > -1})
            // $scope.filtersData.os.selectedData = $scope.filtersData.os.options.filter(function(item){return savedReportData.os.indexOf(item.id) > -1})
            // $scope.filtersData.browser.selectedData = $scope.filtersData.browser.options.filter(function(item){return savedReportData.browser.indexOf(item.id) > -1})
            // $scope.filtersData.playerSize.selectedData = $scope.filtersData.playerSize.options.filter(function(item){return savedReportData.player_size.indexOf(item.id) > -1})

        $scope.currentReportName = savedReportData.name[0].label;

        $scope.currentReportId = savedReportData.id;

        if(savedReportData.runReport)
            updateClick();

    }

    // filterArrByLabel
    function filterArrBy(arr, filterByItem, att){
        var ans = null;
        arr.forEach(function(item){
            if (item[att] == filterByItem)
                ans = item;
        });
        return ans;
    }

    // filterArrByArr
    function filterArrByArr(arr1, att1, arr2, att2){

        if(!arr2)
            return arr1.slice();

        return arr1.filter(function(item1){
            var ans = false
            arr2.forEach(function(item2){
                if (item1[att1] == item2[att2])
                  ans = true
            })
            return ans;
        })
    }

    // getDimensionsByLabel
    function getDimensionsByLabel(dimLabel){

        var none = $scope.dimensionsData.dim1.options[0].options[0];
        var supplyOptions = $scope.dimensionsData.dim1.options[1].options;
        var demandOptions = $scope.dimensionsData.dim1.options[2].options;

        // supply
        for (key in supplyOptions)
            if(supplyOptions[key].name == dimLabel)
                return supplyOptions[key];
        // supply
        for (key in demandOptions)
            if(demandOptions[key].name == dimLabel)
                return demandOptions[key];

        return none;
    }

    //  initBodySection
    function initBodySection(){
        $scope.updateTable = 0;
        $scope.updateChart = 0;
        // $scope.tableTitle = "REPORT TABLE";
        $scope.reportType = "demand";
    }

    // updateTableTitle
    function updateTableTitle(){
        
        if($scope.reportType == "demand"){
            $scope.tableTitle = "DEMAND REPORT";
        }else if($scope.reportType == "supply"){
            $scope.tableTitle = "SUPPLY REPORT";
        }
        
    }


    // checkChosenFilters
    function checkChosenFilters() {
        if ($scope.filtersDateData.date.selectedData.label == "Custom" &&
            ($scope.filtersDateData.date.custom.firstClick == null || 
            $scope.filtersDateData.date.custom.secondClick == null)){
            rootScope_service.setAlertData("Error", "Please select a date" , 1, function(){
            });
            
            return true;
        
        }
        return false;

    }

    // updateClick
    function updateClick(){

        // check filters
        if (checkUserInput())
            return;

        $scope.showTableCompareSwitch = $scope.filtersDateData.date.selectedData.label != "Custom";

        $scope.firstUpdateClick = true;

        // init table compare
        $scope.tableCompareShowLoader = false;

        selectedFilters_g = {}
        Object.assign(selectedFilters_g, $scope.filtersData);
        Object.assign(selectedFilters_g, $scope.filtersDateData);
        Object.assign(selectedFilters_g, $scope.dimensionsData);
        selectedFilters_g.reportType = $scope.reportType;
        $scope.showTableFullSwitch = $scope.reportType != 'demand'

        updateTableTitle();

        // get table data
        $scope.tableData = null;
        $scope.tableCompareData = null;
        $scope.tableShowLoader = true;

        var dataToSend = {
            type        : "custom_" + selectedFilters_g.reportType,
            dimensions  : [selectedFilters_g.dim1, selectedFilters_g.dim2, selectedFilters_g.dim3, selectedFilters_g.dim4].map(function(item){return item.selectedData.name}).filter(function(item){return item != "none"}),
            compare     : false,
        }
        Object.assign(dataToSend, selectedFilters_g)


        // add time interval toTable as dimension
        if(selectedFilters_g.timeInterval.selectedData.label.toLowerCase() != "overall"){
            dataToSend.dimensions.push("date");
        }

        serverAPI_service.getTableReport("supply summary / supply sources table", dataToSend, function(data){
            $scope.tableShowLoader = false;
            $scope.tableData = data;
            $scope.updateTable--;
        });


        // get chart data
        $scope.chartData = null;
        $scope.chartCompareData = null;
        $scope.chartShowLoader = true;

        var dataToSend = {
                type        : "chart_data_" + selectedFilters_g.reportType,
                compare     : false,
        }
        Object.assign(dataToSend, selectedFilters_g)

        serverAPI_service.getChartReport("supply summary / performance chart",dataToSend, function(chartData){

            $scope.chartShowLoader = false;
            $scope.chartData = chartData;
            $scope.updateChart--;

        });
    }

    // getDimensions
    function getDimensions(){
        var ans = [];
        for (key in $scope.dimensionsData){
            if($scope.dimensionsData[key].selectedData.label.toLowerCase() != 'none')
                ans.push($scope.dimensionsData[key].selectedData.name)
        }

        return ans;
    }

    // checkDimensionsSelection
    function checkDimensionsSelection(dimArr){

        var dimArr = getDimensions();

        if (dimArr.length == 0){
            rootScope_service.setAlertData("Error:", "Please select at least one dimension ", 0, null);
            return -1
        }
        if($scope.reportType == "supply" && (dimArr.indexOf("demand_sources") > -1 || dimArr.indexOf("demand_partners") > -1)){
            rootScope_service.setAlertData("Error:", "Can't choose Demand Source and/or Demand Partner in a supply report", 0, null);
            return -1

        }

        return 0

    }

    // saveReport
    function saveReport(){
        var filtersDataLocal = {}
        Object.assign(filtersDataLocal, $scope.filtersData);
        Object.assign(filtersDataLocal, $scope.filtersDateData);
        Object.assign(filtersDataLocal, $scope.dimensionsData);
        filtersDataLocal.type = $scope.reportType

        $scope.showSavedReportPopup = false;
        rootScope_service.setPageLoader(true);
        // saved report
        serverAPI_service.savedReportData("Saved Report" , filtersDataLocal, $scope.newSavedReportName,  function(){
             rootScope_service.setPageLoader(false);
            
            rootScope_service.setAlertData("Saved Report - " + $scope.newSavedReportName, "You have saved new report successfully." , 1, function(){
            })

             
        })

    }

    // editSavedReport
    function editSavedReport(){

        if (checkUserInput())
            return;

        var filtersDataLocal = {}
        Object.assign(filtersDataLocal, $scope.filtersData);
        Object.assign(filtersDataLocal, $scope.filtersDateData);
        Object.assign(filtersDataLocal, $scope.dimensionsData);
        filtersDataLocal.type = $scope.reportType

        rootScope_service.setPageLoader(true);
        // saved report
        serverAPI_service.editSavedReport("Saved Report" ,$scope.currentReportId, filtersDataLocal, $scope.currentReportName, function(){
             rootScope_service.setPageLoader(false);

            rootScope_service.setAlertData("Edit Saved Report - " + $scope.currentReportName, "You have edit saved report successfully." , 1, function(){
            })
        })

    }

    function arrangeDimensions(){

        var i,j;
        for(i=1; i<4; i++){

            if($scope.dimensionsData[("dim" + i)].selectedData.label == "None"){
                for(j=i+1; j<=4; j++){
                     if($scope.dimensionsData[("dim" + j)].selectedData.label != "None"){
                         // swap
                            var temp = $scope.dimensionsData[("dim" + i)].selectedData;
                            $scope.dimensionsData[("dim" + i)].selectedData = $scope.dimensionsData[("dim" + j)].selectedData;
                            $scope.dimensionsData[("dim" + j)].selectedData = temp;
                     }
                }
            }
        }



        $scope.dimensionsData.dim1.selectedData
    }


    // checkUserInput
    function checkUserInput(){
        
        if (checkDimensionsSelection() == -1 )
            return true;

        if (checkChosenFilters()){
            return true;
        }
        
        arrangeDimensions();

        return false;
    }

    // ===============
    // $scope function
    // ===============

    $scope.disableDimension = function(label){


        return label !="None" && [$scope.dimensionsData.dim1.selectedData.label,
                $scope.dimensionsData.dim2.selectedData.label,
                $scope.dimensionsData.dim3.selectedData.label,
                $scope.dimensionsData.dim4.selectedData.label].indexOf(label) > -1;

    }


    // savedReportPopup
    $scope.savedReportPopup = function(){

        
        if(checkUserInput()){
            return;
        }


        $scope.showSavedReportPopup = true;

    }

    // updateClick
    $scope.updateClick = updateClick;

    // savedReport
    $scope.saveReport = function(){
        saveReport();
    }

    // updateCurrentReport
    $scope.updateCurrentReport = function(){
        editSavedReport();
    }

    // clear
    $scope.clear = function(){


        for(key in $scope.dimensionsData)
            $scope.dimensionsData[key].selectedData = $scope.dimensionsData[key].options[0].options[0];

        $scope.filtersData.supplyPartners.selectedData      = [];
        $scope.filtersData.demandPartners.selectedData      = [];
        $scope.filtersData.campaigns.selectedData           = [];
        $scope.filtersData.supplySources.selectedData       = [];
        $scope.filtersData.demandSources.selectedData       = [];
        $scope.filtersData.supplyPlatforms.selectedData     = [];
        $scope.filtersData.demandPlatforms.selectedData     = [];
        $scope.filtersData.domain.selectedData     = {val : ""};

`        // $scope.filtersData.deviceMake.selectedData = $scope.filtersData.deviceMake.options[0];
        // $scope.filtersData.os.selectedData = $scope.filtersData.os.options[0];
        // $scope.filtersData.browser.selectedData = $scope.filtersData.browser.options[0];
        // $scope.filtersData.playerSize.selectedData = $scope.filtersData.playerSize.options[0];`

        for(key in $scope.filtersDateData)
            $scope.filtersDateData[key].selectedData = $scope.filtersDateData[key].options[0];
        
        $scope.clearCustom ++;

    }

    // showCustomDate
    $scope.showCustomDate = function(){

        return $scope.filtersDateData.date.selectedData.label == "Custom"
    }

    // onClickCompareTable
    $scope.onClickCompareTable = function(){
        if (selectedFilters_g.date.selectedData.label.toLowerCase() == "custom" ||
             $scope.tableCompareData != null){
             $scope.updateTable ++;
              return;
            }

         // dataToSend table
        var dataToSend = {
            type        : "custom_" +  selectedFilters_g.reportType,
            dimensions  : [selectedFilters_g.dim1, selectedFilters_g.dim2, selectedFilters_g.dim3, selectedFilters_g.dim4].map(function(item){return item.selectedData.name}).filter(function(item){return item != "none"}),
            compare    : true,
        }

        // add time interval toTable as dimension
        if(selectedFilters_g.timeInterval.selectedData.label.toLowerCase() != "overall"){
            dataToSend.dimensions.push("date");
        }

        Object.assign(dataToSend, selectedFilters_g);

        $scope.tableCompareShowLoader = true;
        serverAPI_service.getTableReport("supply summary / supply sources table / compare", dataToSend, function(compareData){
            $scope.tableCompareData = compareData
            processData_service.addTableCompareData($scope.tableData,compareData);
            $scope.updateTable++;
            $scope.tableCompareShowLoader = false;
        });
    }

    // clickCompareSupplySourcesTable
    $scope.onClickCompareChart = function(){

        if (selectedFilters_g.date.selectedData.label.toLowerCase() == "custom" ||
            $scope.chartCompareData != null){
            $scope.updateChart ++;

            return;
        }

        // dataToSend chart
        var dataToSend = {
            type       : "chart_data_" + selectedFilters_g.reportType,
            compare: true,
        }
        Object.assign(dataToSend, selectedFilters_g);


        $scope.chartShowCompareLoader = true;
        serverAPI_service.getChartReport("supply summary / performance chart / compare", dataToSend, function(compareChartData){
            $scope.chartCompareData = compareChartData;

            processData_service.addChartCompareData($scope.chartData, dataToSend.date.selectedData.label ,compareChartData, dataToSend.date.selectedData.compareLabel, true)
            $scope.updateChart ++;

            $scope.chartShowCompareLoader = false;
        });
    }

    // addNewLine
    $scope.addNewLine = function(index){

        return [3, 7].indexOf(index) != -1
//
//        if(window.innerWidth*56/100 > 180*4)
//            return [3, 7].indexOf(index) != -1
//        else
//            return [1,3,5, 7, 9].indexOf(index) != -1

    }

    // inputSavedReportNameKeyPress
    $scope.inputSavedReportNameKeyPress = function($event){
        if($event.code == "ESC")
            $scope.showSavedReportPopup = false
    }

     // filtersAddBr
    $scope.filtersAddBr = function(index){
        console.log(window.innerWidth*48/100, 180*4)
        if(window.innerWidth*48/100 > 180*4)
            return [1].indexOf(index) > -1
        else
            return [1,3].indexOf(index) > -1
    }



});

