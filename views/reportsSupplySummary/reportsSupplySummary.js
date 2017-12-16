
angular.module("myApp")
.controller('reportsSupplySummaryController', function($scope, serverAPI_service, processData_service, rootScope_service){
    
    initFilters();
    initBodySection();

    var selectedFilters_g = {};
    $scope.firstClickOnUpdate = false;

    // =========
    // function:
    // =========

    // initFilters
    function initFilters(){
        $scope.clearCustom = 0;

       $scope.showFiltersLoader = true;
       var dateOptions = rootScope_service.getDateOptions();
       var timezoneOptions = rootScope_service.getTimezoneOptions();

       $scope.filtersDateData = {
            timezone       : {options: timezoneOptions,     selectedData : timezoneOptions[0]    , placeholder : "" , objectKey:"label"},
            date           : {options: dateOptions,         selectedData : dateOptions[0]        , placeholder : "" , objectKey:"regLabel"},
            }

        $scope.filtersData = {
            supplyPlatforms : {options: [], selectedData : [] , placeholder : "Supply Platform" , inputDisabled:true, type : "multiple"},
            supplyPartners : {options: [], selectedData : [] , placeholder : "Supply Partners" , objectKey: "label",  type : "multiple_autocomplete"},
            campaigns      : {options: [], selectedData : [] , placeholder : "Campaign"        , objectKey: "label",  type : "multiple_autocomplete"},

            demandPlatforms : {options: [], selectedData : [] , placeholder : "Demand Platform" , inputDisabled:true, type : "multiple"},
            

            }

//                        demandPartners : {options: [], selectedData : [] , placeholder : "Demand Partners" , objectKey: "label" },


        // get filters data
        serverAPI_service.getFiltersData("SupplyReport / initFilters", function(res){

            $scope.filtersData.supplyPartners.options      = res.data.supply_partners ? res.data.supply_partners          : [];
            $scope.filtersData.supplyPartners.selectedData = [];
//            $scope.filtersData.supplyPartners.selectedData = res.data.supply_partners ? res.data.supply_partners.slice()  : [];

//            $scope.filtersData.demandPartners.options      = res.data.demand_partners ? res.data.demand_partners          : [];
//            $scope.filtersData.demandPartners.selectedData = res.data.demand_partners ? res.data.demand_partners.slice()  : [];

            $scope.filtersData.campaigns.options           = res.data.campaigns ? res.data.campaigns                      : [];
            $scope.filtersData.campaigns.selectedData      = [];
//            $scope.filtersData.campaigns.selectedData      = res.data.campaigns ? res.data.campaigns.slice()              : [];

            $scope.filtersData.supplyPlatforms.options      = res.data.supply_platforms ? res.data.supply_platforms          : [];
            $scope.filtersData.supplyPlatforms.selectedData = [];
//            $scope.filtersData.supplyPlatforms.selectedData = res.data.supply_platforms ? res.data.supply_platforms.slice()  : [];

            $scope.filtersData.demandPlatforms.options      = res.data.demand_platforms ? res.data.demand_platforms          : [];
            $scope.filtersData.demandPlatforms.selectedData = [];
//            $scope.filtersData.demandPlatforms.selectedData = res.data.demand_platforms ? res.data.demand_platforms.slice()  : [];


            $scope.showFiltersLoader = false;

        });

        
    }

    // initBodySection
    function initBodySection(){
        $scope.updateSupplySourceTable = 0;
        $scope.updateChart = 0;
        $scope.updateDomainsTable = 0;
        $scope.updateDemandSourcesTable = 0;
        
        $scope.showDomainsAndDemandSources = false;
        $scope.domainsTableTitle = "DOMAINS";
        $scope.demandSourcesTableTitle = "DEMAND SOURCES"
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
        $scope.showTableCompare = $scope.filtersDateData.date.selectedData.label != "Custom";


        selectedFilters_g = {};
        $scope.firstClickOnUpdate = true;


        // save global selected filters
        Object.assign(selectedFilters_g, $scope.filtersData);
        Object.assign(selectedFilters_g, $scope.filtersDateData);

        // dataToSend table
        var dataToSend = {
            dimensions : ["supply_sources"],
            type       : "custom_supply",
        }
        Object.assign(dataToSend, selectedFilters_g);

        // SUPPLY SOURCE TABLE
        $scope.supplySourceShowLoader = true;
        $scope.supplySourceTableData = null;
        $scope.supplySourceTableCompareData = null;
        $scope.updateSupplySourceTable++;

        serverAPI_service.getTableReport("supply summary / supply sources table", dataToSend, function(data){
            $scope.supplySourceShowLoader = false;
            $scope.supplySourceTableData = data;
            $scope.updateSupplySourceTable --;
        });


        // dataToSend chart
        var dataToSend = {
            type       : "chart_data_supply",
        }
        Object.assign(dataToSend, selectedFilters_g);

        // CHART DATA
        $scope.chartShowLoader = true;
        $scope.chartData = null;
        $scope.chartCompareData = null;
        serverAPI_service.getChartReport("supply summary / performance chart", dataToSend, function(chartData){

            $scope.chartShowLoader = false;
            $scope.updateChart --;
            $scope.chartData = chartData;

        });

        // DOMAIN AND DEMAND SOURCE TABLES
        $scope.domainsTableTitle = "DOMAINS";
        $scope.demandSourcesTableTitle = "DEMAND SOURCES"
        $scope.showDomainsAndDemandSources = false;
    }

    // rowClickSupplySourceCallBack
    $scope.onSupplySourceRowClickCallBack = function (rowData){
        $scope.showDomainsAndDemandSources = true;

        selectedFilters_g.supplySources = {selectedData : [rowData], options : [1,2]};
        selectedFilters_g.domains = null;

        $scope.supplySourceTableData.tableDimensions.forEach(function(measure){
            $scope.domainsTableTitle = "DOMAINS for " + rowData[measure][0].label;
            $scope.demandSourcesTableTitle = "DEMAND SOURCES for " + rowData[measure][0].label;
        });

        // (0) CHART DATA
        $scope.chartShowLoader = true;
        $scope.chartData = null;
        $scope.chartCompareData = null;
        var dataToSend = {
            type : "chart_data_supply",
        }
        Object.assign(dataToSend, selectedFilters_g)

        serverAPI_service.getChartReport("supply summary / performance chart", dataToSend, function(chartData){

            $scope.chartShowLoader = false;
            $scope.chartData = chartData;
            $scope.updateChart --;

        });

        // (1) GET DOMAINS TABLE DATA 
        $scope.domainsTableData = null;
        $scope.domainsTableCompareData = null;
        $scope.domainsShowLoader = true;

        var dataToSend = {
            type : "custom_supply",
            dimensions : ["domains"]
        }
        Object.assign(dataToSend, selectedFilters_g)

        serverAPI_service.getTableReport("supply summary / domains table", dataToSend, function(data){
            $scope.domainsShowLoader = false;
            $scope.domainsTableData = data;
            $scope.updateDomainsTable--;
        });


        // (2) GET DEMAND SOURCES TABLE DATA
        $scope.demandSourcesTableData = null;
        $scope.demandSourcesTableCompareData = null;
        $scope.demandSourcesShowLoader = true;

        var dataToSend = {
            type : "custom_demand",
            dimensions : ["demand_sources"]
        }
        Object.assign(dataToSend, selectedFilters_g)
        
        serverAPI_service.getTableReport("supply summary / demand sources table", dataToSend, function(data){
            $scope.demandSourcesShowLoader = false;
            $scope.demandSourcesTableData = data;
            $scope.updateDemandSourcesTable--;

        });


    }

    // rowClickDomainsCallBack
    $scope.rowClickDomainsCallBack = function (rowData){

        //set selectedFilters
        selectedFilters_g.domains      = {selectedData : [rowData], options : [1,2]};

        // set table title
        $scope.domainsTableData.tableDimensions.forEach(function(measure){
            $scope.demandSourcesTableTitle = "DEMAND SOURCES for " + rowData[measure][0].label;
        });

        // (1) GET DEMAND SOURCES TABLE DATA
        $scope.demandSourcesTableData = null;
        $scope.demandSourcesTableCompareData = null;
        $scope.demandSourcesShowLoader = true;

         var dataToSend = {
            type : "custom_demand",
            dimensions : ["demand_sources"]
        }
        Object.assign(dataToSend, selectedFilters_g)

        serverAPI_service.getTableReport("supply summary / demand sources table", dataToSend, function(data){
            $scope.demandSourcesShowLoader = false;
            $scope.demandSourcesTableData = data;
            $scope.updateDemandSourcesTable--;

        });
    }

    // clear
    $scope.clear = function(){
        
        $scope.filtersDateData.timezone.selectedData = $scope.filtersDateData.timezone.options[0];
        $scope.filtersDateData.date.selectedData = $scope.filtersDateData.date.options[0];
        $scope.clearCustom ++;
        // $scope.filtersDateData.date.custom =  {firstClick : null, SecondClick: null, status : "notHover" };

        $scope.filtersData.supplyPlatforms.selectedData = $scope.filtersData.supplyPlatforms.options.slice();
        $scope.filtersData.demandPlatforms.selectedData = $scope.filtersData.demandPlatforms.options.slice();
        $scope.filtersData.supplyPartners.selectedData = $scope.filtersData.supplyPartners.options.slice();
        $scope.filtersData.campaigns.selectedData = $scope.filtersData.campaigns.options.slice();
        //        $scope.filtersData.demandPartners.selectedData = $scope.filtersData.demandPartners.options.slice();

    }

    // showCustomDate
    $scope.showCustomDate = function(){

        return $scope.filtersDateData.date.selectedData.label == "Custom"
    }

    // clickCompareSupplySourcesTable
    $scope.onClickCompareSupplySourcesTable = function(){

        if (selectedFilters_g.date.selectedData.label.toLowerCase() == "custom" || $scope.supplySourceTableCompareData != null){
            return;
        }

         // dataToSend table
        var dataToSend = {
            dimensions : ["supply_sources"],
            type       : "custom_supply",
            compare    : true,
        }
        Object.assign(dataToSend, selectedFilters_g);

        $scope.showSupplySourceCompareSwitchLoader = true;
        serverAPI_service.getTableReport("supply summary / supply sources table / compare", dataToSend, function(compareData){
            $scope.supplySourceTableCompareData = compareData
            processData_service.addTableCompareData($scope.supplySourceTableData,compareData);
            $scope.updateSupplySourceTable++;
            $scope.showSupplySourceCompareSwitchLoader = false;
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
            type       : "chart_data_supply",
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

    // onClickCompareDomainsTable
    $scope.onClickCompareDomainsTable = function(){
        if (selectedFilters_g.date.selectedData.label.toLowerCase() == "custom" ||
             $scope.domainsTableCompareData != null)
            return;

         // dataToSend table
        var dataToSend = {
            dimensions : ["domains"],
            type       : "custom_supply",
            compare    : true,
        }
        Object.assign(dataToSend, selectedFilters_g);

        $scope.domainsShowLoaderCompareSwitchLoader = true;
        serverAPI_service.getTableReport("supply summary / supply sources table / compare", dataToSend, function(compareData){
            $scope.domainsTableCompareData = compareData
            processData_service.addTableCompareData($scope.domainsTableData,compareData);
            $scope.updateDomainsTable++;
            $scope.domainsShowLoaderCompareSwitchLoader = false;
        });
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

        $scope.demandSourcesCompareShowLoader = true;
        serverAPI_service.getTableReport("supply summary / supply sources table / compare", dataToSend, function(compareData){
            $scope.demandSourcesTableCompareData = compareData
            processData_service.addTableCompareData($scope.demandSourcesTableData,compareData);
            $scope.updateDemandSourcesTable++;
            $scope.demandSourcesCompareShowLoader = false;
        });

    }

});
