angular.module("myApp")
.directive("newAlertRule", function(){
    return {
        templateUrl : "/directives/newAlertRule/newAlertRule.html",
        scope : {
            show                : "=",
            clickSaveCallBack : "&"
        }, controller : function ($scope, rootScope_service, serverAPI_service){

            var supplySources_g = [];
            var demandSources_g;
            var initNewAlertRule_g = false

            // init
            function init(){

                var runEveryOptions = rootScope_service.getRunEveryOptions();

                var timeData = {
                                    Days    : {end : 7, add : 1, start:1},
                                    Hours   : {end : 24, add : 1, start:1},
                                    Minutes : {end : 60, add : 15, start:15},
                                 }

                for(k in timeData){
                    var i;
                    timeData[k].values = []

                    for (i=timeData[k].start; i<=timeData[k].end ;  i+=timeData[k].add){
                        timeData[k].values.push({label : i})
                    }
                }

                // Dimensions:
                var dimensionOptions = rootScope_service.getDimensionsOptions();

                var dimensionOptions = [
                            {title: "Supply", options : [   { label : "Supply Source",    name: "player"},
                                                            { label : "Supply Platform",  name: "supply_platform"},
                                                            { label : "Supply Partner",   name: "supply_partner"},
                                                            { label : "Campaign",         name: "campaign"},]},

                            {title: "Demand", options : [   { label : "Demand Source",    name: "demand_source"},
                                                            { label : "Demand Platform",  name: "demand_platform"},
                                                            { label : "Demand Partner",   name: "demand_partner"},
                                                            { label : "Domain",           name: "domain"}]},
                            ]

                var measuresOptions = [
                                        {label : "Demand impression"    , name : "demand_impressions"},
                                        {label : "Fill Rate"            , name : "fill_rate"},
                                        {label : "Total Spend"          , name : "total_spend"},
                                        {label : "Bid"                  , name : "bid"},
                                        {label : "Supply Impressions"   , name : "supply_impressions"},
                                        {label : "Revenue"              , name : "revenue"},
                                        {label : "Profit"               , name : "profit"},]

                var operatorsOptions = [
                                        {label : "<"},
                                        {label : ">"},
                                        {label : "<="},
                                        {label : ">="},
                                        {label : "="},
                                        {label : "!="},
                                        {label : "Upward Trend"},
                                        {label : "Downward Trend"},]

                $scope.localData = {
                    selected : {
                        runTestEvery    : {unit : {label : "Hours"}, val : {label : 1}},
                        window          : {unit : {label : "Hours"}, val : {label : 1}},
                        ruleName        : "",
                        description     : "",
                        supplyPartners  : [],
                        demandPartners  : [],
                        campaigns       : [],
                        supplyPartners  : [],
                        supplySources   : [],
                        demandSources   : [],
                        supplyPlatforms : [],
                        demandPlatforms : [],
                        entity          : dimensionOptions[0].options[0],
                        clauses         : [{measures: null, operators : null, val : null}],
                        clauseOperator  : "and",
                        notification    : "0",
                    },
                    options : {
                        timeVales : timeData,
                        timeUnit  : [{label : "Minutes"}, {label : "Hours"}, {label : "Days"}],
                        supplyPartners  : [],
                        demandPartners  : [],
                        campaigns       : [],
                        supplyPartners  : [],
                        supplySources   : [],
                        demandSources   : [],
                        supplyPlatforms : [],
                        demandPlatforms : [],
                        entity          : dimensionOptions,
                        measures        : measuresOptions,
                        operators       : operatorsOptions,
                    }

                }

            $scope.showLoader = true;
            var numOfHttpCalls = 3;

            // get supplyPartners
            serverAPI_service.getFiltersData("new alert rule / initFilters", function(res){

                $scope.localData.options.supplyPartners  = res.data.supply_partners ? res.data.supply_partners         : [];
                $scope.localData.selected.supplyPartners = [];

                $scope.localData.options.demandPartners  = res.data.demand_partners ? res.data.demand_partners         : [];
                $scope.localData.selected.demandPartners = [];

                $scope.localData.options.campaigns       = res.data.campaigns ? res.data.campaigns          : [];
                $scope.localData.selected.campaigns      = [];

                $scope.localData.options.supplySources   = res.data.players ? res.data.players         : [];
                $scope.localData.selected.supplySources  = [];

                $scope.localData.options.demandSources   = res.data.demand_sources ? res.data.demand_sources         : [];
                $scope.localData.selected.demandSources  = [];

                $scope.localData.options.supplyPlatforms  = res.data.supply_platforms ? res.data.supply_platforms          : [];
                $scope.localData.selected.supplyPlatforms = [];

                $scope.localData.options.demandPlatforms  = res.data.demand_platforms ? res.data.demand_platforms          : [];
                $scope.localData.selected.demandPlatforms = [];

                if(--numOfHttpCalls == 0){
                    $scope.showLoader = false;
                    $scope.arrangeTables()
                    initNewAlertRule_g = true;
                }


            });

            $scope.updateSupplySourceTable = 0


            serverAPI_service.getManageTableData("new alert rule", 'supply_source', function(res){

//            serverAPI_service.getSupplySources("new alert rule", function(res){
                supplySources_g = res;

                if(--numOfHttpCalls == 0){
                    $scope.showLoader = false;
                    $scope.arrangeTables()
                    initNewAlertRule_g = true;
                }
            })

            $scope.updateDemandSourceTable = 0


//            serverAPI_service.get("new alert rule", function(res){
            serverAPI_service.getManageTableData("new alert rule", 'demand_source', function(res){

                demandSources_g = res;

                if(--numOfHttpCalls == 0){
                    $scope.showLoader = false;
                    $scope.arrangeTables()
                    initNewAlertRule_g = true;
                }

            })


            }

            // initWindowAndGranularityVal
            function initWindowAndGranularityVal(type){

                switch($scope.localData.selected[type].unit.label.toLowerCase()){
                    case "days":
                    case "hours":
                        $scope.localData.selected[type].val.label = 1;
                        break;
                    case "minutes":
                        $scope.localData.selected[type].val.label = 15;
                        break;
                }
            }

            // arrangeSupplySourceTable
            function arrangeSupplySourceTable(){

                // TODO : move to processData_service

                var selectedSupplySourcesByName = {}
                $scope.localData.selected.supplySources.forEach(function(item) {
                    selectedSupplySourcesByName[item.name] = item
                })

               var selectedSupplyPartnersByName = {}
               $scope.localData.selected.supplyPartners.forEach(function(item) {
                   selectedSupplyPartnersByName[item.name] = item
               })

                var selectedCampaignByName = {}
                $scope.localData.selected.campaigns.forEach(function(item) {
                    selectedCampaignByName[item.name] = item
                })

                var selectedSupplyPlatformsByName = {}
                $scope.localData.selected.supplyPlatforms.forEach(function(item) {
                    selectedSupplyPlatformsByName[item.name] = item
                })

                
                
               supplySourcesTableBody = supplySources_g.tableBody.filter(function(row){
                    return  (objectIsEmpty(selectedSupplySourcesByName) || selectedSupplySourcesByName[row.supply_source_name[0].label]) &&
                            (objectIsEmpty(selectedCampaignByName) || selectedCampaignByName[row.campaign_name[0].label] ) &&
                            (objectIsEmpty(selectedSupplyPartnersByName) || selectedSupplyPartnersByName[row.supply_partner_name[0].label] ) &&
                            (objectIsEmpty(selectedSupplyPlatformsByName) || selectedSupplyPlatformsByName[row.supply_platform_name[0].label] )
               })


               var tableBody = supplySourcesTableBody.map(function(item){
                    //                                         supply_source_name  : [{label : item.supply_source_name}],

                            return {
                                        supply_source_name  : item.supply_source_name,
                                        bid                 : null,
                                        budget              : null,
                                        strategy            : {val : 0, buttons: ["EVEN", "ASAP"]},
                                        status              : {val : 0, buttons: ["Active", "Inactive"]},

                                    }
                            })

                $scope.supplySourceTableData = {
                    tableDimensions     : ["supply_source_name"],
                    tableLiteMeasures   : ["bid", "budget", "strategy", "status"],
                    tableBody           : tableBody,
                    tableTitles         : { supply_source_name : "Name" , bid : "bid", budget : "budget", status : "status", strategy : "strategy"},
                    tableMeasureType    : {strategy : "radio", status : "radio", bid : "input", budget :"input"}
                }
                $scope.updateSupplySourceTable++;



            }

            // arrangeDemandSourceTable
            function arrangeDemandSourceTable(){

                 // TODO : move to processData_service

                var selectedDemandSourcesByName = {}
                $scope.localData.selected.demandSources.forEach(function(item) {
                    selectedDemandSourcesByName[item.name] = item
                })

                var selectedDemandPartnersByName = {}
                $scope.localData.selected.demandPartners.forEach(function(item) {
                    selectedDemandPartnersByName[item.name] = item
                })

//                var selectedCampaignByName = {}
//                $scope.localData.selected.campaigns.forEach(function(item) {
//                    selectedCampaignByName[item.name] = item
//                })

                var selectedDemandPlatformsByName = {}
                $scope.localData.selected.demandPlatforms.forEach(function(item) {
                    selectedDemandPlatformsByName[item.name] = item
                })

               demandSourcesTableBody = demandSources_g.tableBody.filter(function(row){
                    return  (objectIsEmpty(selectedDemandSourcesByName) || selectedDemandSourcesByName[row.name[0].label]) &&
                            (objectIsEmpty(selectedDemandPartnersByName) || selectedDemandPartnersByName[row.demand_partner_name[0].label]) &&
                            (objectIsEmpty(selectedDemandPlatformsByName) || selectedDemandPlatformsByName[row.demand_platform_name[0].label] )
               })

                var tableBody = demandSourcesTableBody.map(function(item){
                    // [{ label   : item.name}],
                            return {
                                        demand_source_name  : item.name,
                                        status              : {val : 0, buttons: ["Active", "Inactive"]},
                                    }
                            })

                $scope.demandSourceTableData = {
                    tableDimensions     : ["demand_source_name"],
                    tableLiteMeasures   : ["status"],
                    tableBody           : tableBody,
                    tableTitles         : { demand_source_name : "Name", status : "Status"},
                    tableMeasureType    : { status : "radio"}
                }
                $scope.updateDemandSourceTable++;


            }


            // clear
            function clear(){

                var dimensionOptions = rootScope_service.getDimensionsOptions();

                $scope.localData.selected = {
                        runTestEvery    : {unit : {label : "Hours"}, val : {label : 1}},
                        window          : {unit : {label : "Hours"}, val : {label : 1}},
                        ruleName        : "",
                        description     : "",
                        supplyPartners  : [],
                        demandPartners  : [],
                        campaigns       : [],
                        supplyPartners  : [],
                        supplySources   : [],
                        demandSources   : [],
                        supplyPlatforms : [],
                        demandPlatforms : [],
                        entity          : dimensionOptions[0].options[0],
                        clauses         : [{measures: null, operators : null, val : null}],
                        clauseOperator  : "and",
                        notification    : "0",
                    }
            }

            // objectIsEmpty
            function objectIsEmpty(obj){
                return Object.keys(obj).length === 0 && obj.constructor === Object;
            }



            // =================
            // $scope functions:
            // =================

            // save
            $scope.save = function(){

                alert("Under Development");
                return;


                // todo : check argument

                rootScope_service.setAlertData("New Alert Rule", "Are you sure you want to create this new alert rule?" , 1, function(){

                    rootScope_service.setPageLoader(true)

                    var sendData = JSON.parse(JSON.stringify($scope.localData))
                    sendData.demandSourcesTable = $scope.demandSourceTableData.tableBody;
                    sendData.supplySourcesTable = $scope.supplySourceTableData.tableBody;

                    serverAPI_service.postNewAlertRule("analysis" , sendData, function(){

                        $scope.show=false;
                        rootScope_service.setPageLoader(false)
                        $scope.clickSaveCallBack();


                    });
                })
            }

            // addClause
            $scope.addClause = function (){
                $scope.localData.selected.clauses.push({operators : null, measures : null})

            }

            // deleteClause
            $scope.deleteClause = function (index){
                $scope.localData.selected.clauses.splice(index, 1);

            }

            // arrangeTables
            $scope.arrangeTables = function(){


                if($scope.showLoader )
                    return

                arrangeSupplySourceTable()
                arrangeDemandSourceTable()

            }

            // clickOnClose
            $scope.clickOnClose = function(){

                rootScope_service.setAlertData("New Alert Rule", "Are you sure you want to close this window, all your information will be lost." , 1, function(){
                    clear();
                    $scope.show=false;
                })

            }

            // =================
            // $watch functions:
            // =================
            
            $scope.$watch('localData.selected.window.unit', function() {
                if(!$scope.localData)
                    return
                initWindowAndGranularityVal('window')},true)
            $scope.$watch('localData.selected.runTestEvery.unit', function() {
                if(!$scope.localData)
                    return
                initWindowAndGranularityVal('runTestEvery')},true)
            $scope.$watch('show', function(){
                if (!$scope.show )
                    return;

                if (initNewAlertRule_g){
                    clear();
                    return;
                }

                init();
            },true)

        } // close controller


    }
})