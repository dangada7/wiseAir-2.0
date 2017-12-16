angular.module('myApp')
.controller('manageDemandController', function($scope, serverAPI_service, rootScope_service){
    

    $scope.updateTable = 0;
    $scope.currentTab = "demandSourcesTab";


    $scope.pageData = {
        demandSourcesTab   : {tableData : null , tableShowLoader : true, popupData : {}, showPopup: false,  btnText : "NEW DEMAND SOURCE", showFiltersRow : true},
        demandPartnersTab  : {tableData : null , tableShowLoader : true, popupData : {}, showPopup: false},
        demandPlatformsTab : {tableData : null , tableShowLoader : true, popupData : {}, showPopup: false,  btnText : null},
    }

    //  creativesTab       : {tableData : null , tableShowLoader : true, popupData : {}, showPopup: false, btnText : "New creatives"},

    setDemandSourcesTable();
//    setDemandSourcePopup();

//    setCreativesTable();
//    setCreativePopup();

    setDemandPartners();

    setDemandPlatforms();
    setDemandPartnerPopup();
//    setCreativePopup();


    // ================
    // $scope functions
    // ================

    // saveNewSupplyPartner
    $scope.saveNewDemandPartner = function(data){

    }

    // clearNewDemandPartnerPopUp
    $scope.clearNewDemandPartnerPopUp = function(){
        $scope.pageData.demandPartnersTab.popupData.body.ndp.data.selectedData = [];

    }

    // ==========
    // Functions:
    // ==========

    // setSupplySourcesTable
    function setDemandSourcesTable(){

        $scope.pageData.demandSourcesTab.showFullSwitchTable = true;

        // get table Data 
        serverAPI_service.getManageTableData("MANAGE / DEMAND ", 'demand_source', function(data){
            $scope.pageData.demandSourcesTab.tableData = data;
            $scope.pageData.demandSourcesTab.tableShowLoader = false;
            $scope.updateTable++;
        });

    }

    // setCampaignsTable
    function setCreativesTable(){

        // get table Data 
        serverAPI_service.getManageTableData("MANAGE / DEMAND ", 'creative', function(data){
            $scope.pageData.creativesTab.tableData = data;
            $scope.pageData.creativesTab.tableShowLoader = false;
            $scope.updateTable++;

        });
    }

    // setSupplyPlatforms
    function setDemandPlatforms(){
        // get table Data 
        serverAPI_service.getManageTableData("MANAGE / DEMAND ", 'demand_platform', function(data){
            $scope.pageData.demandPlatformsTab.tableData = data;
            $scope.pageData.demandPlatformsTab.tableShowLoader = false;
            $scope.updateTable++;
        });
    }

    // setDemandPartners
    function setDemandPartners(){
        // get table Data
        serverAPI_service.getManageTableData("MANAGE / DEMAND ", 'demand_partner', function(data){
            $scope.pageData.demandPartnersTab.tableData = data;
            $scope.pageData.demandPartnersTab.tableShowLoader = false;
            $scope.updateTable++;
        });
    }

    // setDemandSourcePopup
    function setDemandSourcePopup(){

//        var demandPlatformOptions = rootScope_service.getDemandPlatformsOptions();
        var envOptions = rootScope_service.getEnvOptions();
        var osOptions = rootScope_service.getOsOptions();

        $scope.pageData.demandSourcesTab.popupData =
            {  currentTabName : "b",
                tabs : [ {label: "BASIC", name: "b"} , {label : "DEMAND EVENT PIXELS", name : "dep"} , {label : "CONTAINING CREATIVES", name : "cc"} ],
                body : {    
                        b : [
                            {   type: "form", // section type
                                data : {        
                                    demandPlatform    : {type: "select",      label: "Demand Platforms", selectedData : []   , selectType : "multiple" , options: [],  width : "170px", },
                                    demandSourceName  : {type: "input",       label: "Demand Source Name" , selectedData : null , inputType  : "text"},
                                    externalId        : {type: "input",       label: "External Id"        , selectedData : null , inputType  : "text"},
                                    dpr : {type: "radioSelect", label: "Demand Partner Name"        , selectedData : "0"  , radiosData : [{label:"Existing" , val : "0"}, {label:"New", val : "1"}], }, 
                                    empty : null,
                                    dps : {type: "select",      label: "", selectedData : []   , selectType : "multiple" , options: [],  width : "170px", showData: {att: "dpr", val : "0"}},
                                    dpi : {type: "input",       label: ""     , selectedData : null , inputType  : "text" , showData: {att: "dpr", val : "1"}},

                                }},
                            {   type: "form", 
                                data : {  
                                    environment : {type: "select", label: "environment", selectedData : []   , selectType : "multiple" , options: envOptions,  width : "170px", },
                                    empty1 : null,
                                    os : {type: "select",      label: "Operating System", selectedData : []   , selectType : "multiple" , options: osOptions,  width : "170px", },
                                    empty2 : null,
                                    rate : {type: "input",       label : "rate" ,           selectedData: [], inputType:"text"},}},
                            {   type : "textArea", 
                                data : [
                                    {type: "textArea",    label : "Notes" },]},
                                    ],
                        dep : [
                            {   type: "table", 
                                data : [     
                                    {type: "table" , tableData: null, showLoader : true, updateTable: 0, rowClickable : false} ]}
                                    ],
                        cc : [
                            {   type: "form", 
                                data : [     
                                       
                                    {type: "select",    label: "Creatives" , selectType: "multiple" ,options: [{label:"bla", pixel: "blabla"},{label:"bla"},{label:"bla"}], selectedData: []} ]}
                                    ]
                        }
            };

        // get demand event pixels table 
        serverAPI_service.getManageTableData("MANAGE / DEMAND", "demandEventPixels", function(data){
            $scope.pageData.demandSourcesTab.popupData.body.dep[0].data[0].tableData = data;
            $scope.pageData.demandSourcesTab.popupData.body.dep[0].data[0].showLoader = false;
            $scope.pageData.demandSourcesTab.popupData.body.dep[0].data[0].updateTable ++;
            // addActionColumn
            var actionsData=[{func: tempFunc, class: "runReport"},];

            $scope.pageData.demandSourcesTab.popupData.body.dep[0].data[0].tableData.tableLiteMeasures.push("actions");
            $scope.pageData.demandSourcesTab.popupData.body.dep[0].data[0].tableData.tableTitles["actions"] = "Actions";
            $scope.pageData.demandSourcesTab.popupData.body.dep[0].data[0].tableData.tableBody.forEach(function(tableRowData){
                tableRowData["actions"] = actionsData;
            });
        });

    }

    // setDemandSourcePopup
    function setDemandPartnerPopup(){

        $scope.pageData.demandPartnersTab.popupData =
                {
                    currentTabName : "ndp",
                    tabs : [ {label: "New Demand Partner", name: "ndp"}],
                    body : {

                            ndp : [
                                {   type: "form",
                                    data : [
                                        {type: "input",       label : "Campaign Name" ,   selectedData: [], inputType:"text"},]},
                                        ]
                            }
                };


    }



//
//    // setDemandSourcePopup
//    function setCreativePopup(){
//        var demandPlatformOptions = rootScope_service.getDemandPlatformsOptions();
//        var supplyPlatformOptions = rootScope_service.getSupplyPlatformsOptions();
//
//        $scope.pageData.creativesTab.popupData =
//            {  currentTabName : "nc",
//                tabs : [ {label: "NEW CREATIVE", name: "nc"}],
//                body : {
//                        nc : [
//                            {   type: "form", // section type
//                                data : {
//                                    demandPlatform    : {type: "select",      label: "Demand Platforms", selectedData : []   , selectType : "multiple" , options: demandPlatformOptions,  width : "170px", },
//                                    creativeName      : {type: "input",       label: "Creative Name" , selectedData : null , inputType  : "text"},
//                                    externalId        : {type: "input",       label: "External Id"        , selectedData : null , inputType  : "text"},
//                                    spr : {type: "radioSelect", label: "Supply Partner Name"        , selectedData : "0"  , radiosData : [{label:"Existing" , val : "0"}, {label:"New", val : "1"}], },
//                                    supplyPlatform    : {type: "select",      label: "Supply Platforms", selectedData : []   , selectType : "multiple" , options: supplyPlatformOptions,  width : "170px", },
//                                    sps : {type: "select",      label: ""      , selectedData : []   , selectType : "multiple" , options: [],  width : "170px", showData: {att: "spr", val : "0"}},
//                                    spi : {type: "input",       label: ""     , selectedData : null , inputType  : "text" , showData: {att: "spr", val : "1"}},
//
//                                }},
//                            {   type: "form",
//                                data : {
//                                    width         : {type: "input",       label: "Width"        , selectedData : null , inputType  : "text"},
//                                    height        : {type: "input",       label: "Height"       , selectedData : null , inputType  : "text"},
//                                    }},
//                                ],}
//            };
//
//            //  get Partner from server
//
//
//
//    }


})