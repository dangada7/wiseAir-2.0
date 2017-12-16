angular.module('myApp')
.controller('analysisDayPartController', function($scope, serverAPI_service, rootScope_service, processData_service, textManipulation_service){

    initFilters();
    initTable();
    $scope.currentLocation = {x : -1, y: -1};

    // ==========
    // Functions:
    // ==========

    // initFilters()
    function initFilters(){
        $scope.clearCustom = 0;
        $scope.selectedReportType = "demand";
        $scope.SelectedDomain = "";

        $scope.showFiltersLoader = true;
        var dateOptions = rootScope_service.getDateOptions();
        var timezoneOptions = rootScope_service.getTimezoneOptions();

       $scope.filtersDateData = {
            timezone       : {options: timezoneOptions,     selectedData : timezoneOptions[0]    , placeholder : "" , objectKey:"label"},
            date           : {options: dateOptions,         selectedData : dateOptions[0]        , placeholder : "" , objectKey:"regLabel"},
            }


         $scope.filtersData = {
            supplyPlatforms : {options: [], selectedData : [] , placeholder : "Supply Platform" , objectKey: "label", type:"multiple"},
            supplyPartners  : {options: [], selectedData : [] , placeholder : "Supply Partners" , objectKey: "label", type:"multiple_autocomplete"},
            supplySources   : {options: [], selectedData : [] , placeholder : "Supply Source"   , objectKey: "label", type:"multiple_autocomplete", lazyLoad:true},
            campaigns       : {options: [], selectedData : [] , placeholder : "Campaign"        , objectKey: "label", type:"multiple_autocomplete"},

            demandPlatforms : {options: [], selectedData : [] , placeholder : "Demand Platform" , objectKey: "label", type:"multiple"},
            demandPartners  : {options: [], selectedData : [] , placeholder : "Demand Partners" , objectKey: "label", type:"multiple_autocomplete"},
            demandSources   : {options: [], selectedData : [] , placeholder : "Demand Source"   , objectKey: "label", type:"multiple_autocomplete", lazyLoad:true},
            domain          : {selectedData : {}, type:"input", placeholder: "Domains"},

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

        });
    }

    // initTable
    function initTable(){
        $scope.showTableLoader = false;
        $scope.hourTableData = [];

        $scope.tableData = null;


    }

    // objectIsEmpty
    function objectIsEmpty(obj){
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }


    // ===============
    // scope function:
    // ===============

    // update button
    $scope.updateBtn = function(){
        $scope.tableData = null;
        $scope.showTableLoader = true;
        $scope.firstUpdateClick = true;

        var dataToSend = {
            type : $scope.selectedReportType,
            domains : $scope.selectedDomain,
        }

        Object.assign(dataToSend, $scope.filtersData)
        Object.assign(dataToSend, $scope.filtersDateData)

        serverAPI_service.getDayPartData("dayPart", dataToSend, function(res){
            $scope.tableData = res;

            $scope.noData = objectIsEmpty(res.tableBody);

            $scope.showTableLoader = false;
        });
    }

    //  clear button 
    $scope.clearBtn = function(){
         //reset filtersData selectedData
         $scope.filtersData.supplyPlatforms.selectedData =[]
         $scope.filtersData.supplyPartners.selectedData = []
         $scope.filtersData.campaigns.selectedData = []
         $scope.filtersData.supplySources.selectedData = []

         $scope.filtersData.demandPlatforms.selectedData = []
         $scope.filtersData.demandPartners.selectedData =[]
         $scope.filtersData.demandSources.selectedData = []
         $scope.filtersData.domain.selectedData = {}

         //reset filtersDateData selectedData
         $scope.filtersDateData.timezone.selectedData =  $scope.filtersDateData.timezone.options[0];
         $scope.filtersDateData.date.selectedData =  $scope.filtersDateData.date.options[0];
         $scope.clearCustom++;
    }
    
    // returnClusterClass
    $scope.getClusterClass = function(key, selectedMeasure){

        if(!$scope.tableData.tableBody[selectedMeasure])
            return;

        var val = $scope.tableData.tableBody[selectedMeasure][key]
        var clusterSize = $scope.tableData.sortedArr[selectedMeasure].length;
        var numOfCluster = 5;

        var clusterClasses = [{class : "val1"}, {class : "val2"}, {class : "val3"}, {class : "val4"} ,{class : "val5"}]

        if(val == null)
            return

        for(i=1; i<5; i++){
            if(val < $scope.tableData.sortedArr[selectedMeasure][Math.round((clusterSize*i)/numOfCluster)])
                return clusterClasses[i-1];
        }
        return clusterClasses[i-1];


//        var diff = $scope.tableData.max[selectedMeasure] - $scope.tableData.min[selectedMeasure];
//        var tempValue = diff* (1 / $scope.colorsData.length);
//
//        var currentMin = $scope.tableData.min[selectedMeasure];
//        var currentMax = $scope.tableData.min[selectedMeasure] + tempValue;
//
//        var i;
//        for(i=0 ; i<$scope.colorsData.length; i++){
//            if (currentMin <= val &&  val <= currentMax){
//                return $scope.colorsData[$scope.colorsData.length-i-1];
//            }
//            currentMin = currentMin + tempValue;
//            currentMax = currentMax + tempValue;
//        }
    }

    // updateLocation
    $scope.updateLocation = function(x ,y){

        $scope.currentLocation = {x : x, y : y };
    }

    // checkLocation
    $scope.checkLocationY = function(y){

        return $scope.currentLocation.y == y ;
    }

    // checkLocation
    $scope.checkLocationX = function(x){

        return $scope.currentLocation.x == x ;
    }

    // checkLocation
    $scope.checkLocationXY = function(x, y){

        return $scope.currentLocation.x == x && $scope.currentLocation.y == y;
    }

    // showCustomDate
    $scope.showCustomDate = function(){

        return $scope.filtersDateData.date.selectedData.label == "Custom"
    }

    // formatTableValue
    $scope.formatTableValue = function(value, type){
        return textManipulation_service.wiseTextFormant(type, value);
    }

})