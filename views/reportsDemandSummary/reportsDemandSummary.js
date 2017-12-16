
angular.module("myApp")
.controller('reportsDemandSummaryController', function($scope, serverAPI_service, processData_service,rootScope_service){

    initFilters();
    initBodySection();
    var selectedFilters_g = {};
    $scope.firstClickOnUpdate = false;

    // ==========
    // functions:
    // ==========
    
    // initFilters
    function initFilters(){

        $scope.clearCustomDate = 0;

        $scope.showFiltersLoader = true;
        var dateOptions = rootScope_service.getDateOptions();
        var timezoneOptions = rootScope_service.getTimezoneOptions();


       $scope.filtersDateData = {
            timezone       : {options: timezoneOptions,     selectedData : timezoneOptions[0]    , placeholder : "" , multiple : false , objectKey:"label"},
            date           : {options: dateOptions,         selectedData : dateOptions[0]        , placeholder : "" , multiple : false , objectKey:"regLabel"},
            }


        $scope.filtersData = {
            demandPlatforms : {options: [], selectedData : [] , placeholder : "Demand Platform" , multiple : true , objectKey: "label", type : "multiple"},
            demandPartners  : {options: [], selectedData : [] , placeholder : "Demand Partners" , multiple : true , objectKey: "label", type : "multiple_autocomplete"},
            supplyPlatforms : {options: [], selectedData : [] , placeholder : "Supply Platform" , multiple : true , objectKey: "label", type : "multiple"},
            supplyPartners : {options: [], selectedData : [] , placeholder : "Supply Partners" , multiple : true , objectKey: "label" , type : "multiple_autocomplete"},
            campaigns      : {options: [], selectedData : [] , placeholder : "Campaign"        , multiple : true , objectKey: "label", type : "multiple_autocomplete"},
            SupplySource   : {options: [], selectedData : [] , placeholder : "Supply Source"    , multiple : true , objectKey: "label", lazyLoad:true, type : "multiple_autocomplete"},
    
            }

        // get supplyPartners 
        serverAPI_service.getFiltersData("SupplyReport / initFilters" , function(res){
            // failed to retrieve filters data from the server

            $scope.filtersData.supplyPartners.options      = res.data.supply_partners ? res.data.supply_partners         : [];
            $scope.filtersData.supplyPartners.selectedData = [];
//            $scope.filtersData.supplyPartners.selectedData = res.data.supply_partners ? res.data.supply_partners.slice() : [];

            $scope.filtersData.demandPartners.options      = res.data.demand_partners ? res.data.demand_partners         : [];
            $scope.filtersData.demandPartners.selectedData = [];
//            $scope.filtersData.demandPartners.selectedData = res.data.demand_partners ? res.data.demand_partners.slice() : [];

            $scope.filtersData.campaigns.options           = res.data.campaigns ? res.data.campaigns          : [];
            $scope.filtersData.campaigns.selectedData = [];
//            $scope.filtersData.campaigns.selectedData      = res.data.campaigns ? res.data.campaigns.slice()  : [];

            $scope.filtersData.SupplySource.options        = res.data.players ? res.data.players         : [];
            $scope.filtersData.SupplySource.selectedData = [];
//            $scope.filtersData.SupplySource.selectedData   = res.data.players ? res.data.players.slice() : [];

            $scope.filtersData.supplyPlatforms.options      = res.data.supply_platforms ? res.data.supply_platforms          : [];
            $scope.filtersData.supplyPlatforms.selectedData = [];
//            $scope.filtersData.supplyPlatforms.selectedData = res.data.supply_platforms ? res.data.supply_platforms.slice()  : [];

            $scope.filtersData.demandPlatforms.options      = res.data.demand_platforms ? res.data.demand_platforms          : [];
            $scope.filtersData.demandPlatforms.selectedData = [];
//            $scope.filtersData.demandPlatforms.selectedData = res.data.demand_platforms ? res.data.demand_platforms.slice()  : [];


            $scope.showFiltersLoader = false;
        });

    }
    
    //  initBodySection
    function initBodySection(){
        $scope.updateDemandSourceTable = 0;
        $scope.updateChart = 0;
        $scope.updateDomainsTable = 0;
        $scope.updateDemandSourcesTable = 0;
        $scope.showDomains = false;
        $scope.domainsTableTitle = "DOMAINS";
    }


    // checkChosenFilters
    function checkChosenFilters() {
        if ($scope.filtersDateData.date.selectedData.label == "Custom" &&
            ($scope.filtersDateData.date.custom.firstClick == null || 
            $scope.filtersDateData.date.custom.secondClick == null)){
            rootScope_service.setAlertData("Error", "Please select a date" , 1, function(){
            });
            return false;
        
        }
        return true;

    }

    // ===============
    // $scope function
    // ===============
    
    // updateFilterBtnCallBack
    $scope.updateClick = function(){

        if(!checkChosenFilters()){
            return;
        }
        $scope.showTableCompareSwitch = $scope.filtersDateData.date.selectedData.label != "Custom";

        selectedFilters_g = {}
        $scope.firstClickOnUpdate = true;

        Object.assign(selectedFilters_g, $scope.filtersData);
        Object.assign(selectedFilters_g, $scope.filtersDateData);

        $scope.showDomains = false;

        // demand source
        $scope.demandSourcesShowLoader = true;
        $scope.demandSourcesTableData = null;
        $scope.demandSourcesTableCompareData = null;

        var dataToSend = {
            type : "custom_demand",
            dimensions :  ["demand_sources"],
        }
        Object.assign(dataToSend, selectedFilters_g);

        serverAPI_service.getTableReport("supply summary / supply sources table", dataToSend, function(data){
            $scope.demandSourcesShowLoader = false;
            $scope.demandSourcesTableData = data;
            $scope.updateDemandSourcesTable--;

        });

        // get chart data
        $scope.chartData = null;
        $scope.chartCompareData = null;
        $scope.chartShowLoader = true;

        var dataToSend = {
            type : "chart_data_demand",
        }
        Object.assign(dataToSend, selectedFilters_g);

        serverAPI_service.getChartReport("supply summary / performance chart", dataToSend, function(chartData){

            $scope.chartShowLoader = false;
            $scope.chartData = chartData;
            $scope.updateChart --;

        });

    }

    // rowClickSupplySourceCallBack
    $scope.onDemandSourceRowClickCallBack = function (rowData){
        $scope.showDomains = true;
        selectedFilters_g.demandSources = {selectedData : [rowData], options : [1,2]};

        $scope.demandSourcesTableData.tableDimensions.forEach(function(measure){
            $scope.domainsTableTitle = "DOMAINS for " + rowData[measure][0].label;
        });



        // (0) GET CHART DATA
        $scope.chartData = null;
        $scope.chartCompareData = null;
        $scope.chartShowLoader = true;

        var dataToSend = {
            type : "chart_data_demand",
        }
        Object.assign(dataToSend, selectedFilters_g);

        serverAPI_service.getChartReport("supply summary / performance chart", dataToSend, function(chartData){
            $scope.chartShowLoader = false;
            $scope.chartData = chartData;
            $scope.updateChart --;
        });

        // (1) GET DOMAINS TABLE DATA
        $scope.domainsTableData = null;
        $scope.domainsTableCompareData = null;
        $scope.domainsShowLoader = true;
        $scope.updateDomainsTable++;

        var dataToSend = {
            type : "custom_demand",
            dimensions : ["domains"]
        }
        Object.assign(dataToSend, selectedFilters_g);

        serverAPI_service.getTableReport("supply summary / domains table", dataToSend, function(data){
            $scope.domainsShowLoader = false;
            $scope.domainsTableData = data;

            $scope.updateDomainsTable--;

        });
    }

    // clear
    $scope.clear = function(){
        
        $scope.filtersDateData.timezone.selectedData = $scope.filtersDateData.timezone.options[0];
        $scope.filtersDateData.date.selectedData = $scope.filtersDateData.date.options[0];
        // $scope.filtersDateData.date.custom =  {firstClick : null, SecondClick: null, status : "notHover" };;

        $scope.filtersData.supplyPlatforms.selectedData =[];
        $scope.filtersData.demandPlatforms.selectedData = [];
        $scope.filtersData.supplyPartners.selectedData = [];
        $scope.filtersData.demandPartners.selectedData = [];
        $scope.filtersData.campaigns.selectedData = [];
        $scope.filtersData.SupplySource.selectedData = [];

        $scope.clearCustomDate++;


    };
    
    // showCustomDate
    $scope.showCustomDate = function(){

        return $scope.filtersDateData.date.selectedData.label == "Custom"
    }

    // onClickCompareDemandSourcesTable
    $scope.onClickCompareDemandSourcesTable = function(){
        if (selectedFilters_g.date.selectedData.label.toLowerCase() == "custom" ||
             $scope.demandSourcesTableCompareData != null)
            return;

         // dataToSend table
        var dataToSend = {
            dimensions : ["demand_sources"],
            type       : "custom_demand",
            compare    : true,
        }
        Object.assign(dataToSend, selectedFilters_g);

        $scope.showDemandSourceCompareSwitchLoader = true;
        serverAPI_service.getTableReport("supply summary / supply sources table / compare", dataToSend, function(compareData){
            $scope.demandSourcesTableCompareData = compareData
            processData_service.addTableCompareData($scope.demandSourcesTableData,compareData);
            $scope.updateDemandSourcesTable++;
            $scope.showDemandSourceCompareSwitchLoader = false;
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
             type       : "chart_data_demand",
             compare: true,
         }
         Object.assign(dataToSend, selectedFilters_g);


         $scope.showChartCompareLoader = true;
         serverAPI_service.getChartReport("supply summary / performance chart / compare", dataToSend, function(compareChartData){
             $scope.chartCompareData = compareChartData;

             processData_service.addChartCompareData($scope.chartData, dataToSend.date.selectedData.label ,compareChartData, dataToSend.date.selectedData.compareLabel, true)
             $scope.updateChart ++;

             $scope.showChartCompareLoader = false;
         });
     }

    // onClickCompareDomainsTable
    $scope.onClickCompareDomainsTable = function(){
        if (selectedFilters_g.date.selectedData.label.toLowerCase() == "custom" ||
             $scope.domainsTableCompareData != null)
            return;

         // dataToSend table
        var dataToSend = {
            dimensions : ["domains"],
            type       : "custom_demand",
            compare    : true,
        }
        Object.assign(dataToSend, selectedFilters_g);


        $scope.showDomainsCompareSwitchLoader = true;
        serverAPI_service.getTableReport("supply summary / supply sources table / compare", dataToSend, function(compareData){
            $scope.domainsTableCompareData = compareData
            processData_service.addTableCompareData($scope.domainsTableData,compareData);
            $scope.updateDomainsTable++;
            $scope.showDomainsCompareSwitchLoader = false;
        });
    }

    // filtersAddBr
    $scope.filtersAddBr = function(index){

        return [1].indexOf(index) > -1;

//        if(window.innerWidth*40/100 > 180*4)
//            return [1].indexOf(index) > -1
//        else
//            return [1,3].indexOf(index) > -1
    }



});
