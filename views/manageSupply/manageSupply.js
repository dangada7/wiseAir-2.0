angular.module('myApp')
.controller('manageSupplyController', function($scope, serverAPI_service, rootScope_service){

    initSupply();  


    // initSupply
    function initSupply(){

        // supplySources tab
        setSupplySourcesTable();

        // Campaign tab
        setCampaignsTable();
        setCampaignsPopup();

        // supply platforms tab
        setSupplyPartnersTable();
        setSupplyPartnerPopup();

        // supply platforms tab
        setSupplyPlatformsTable();
    }

    // setSupplySourcesTable
    function setSupplySourcesTable(){
        
        $scope.supplySourcesTableShowLoader = true;
        // get table Data 
        serverAPI_service.getManageTableData("MANAGE / SUPPLY / SUPPLY SOURCES ", 'supply_source', function(data){
            $scope.supplySourcesTableData = data;
            $scope.supplySourcesTableShowLoader = false;
            $scope.supplySourcesUpdateTable++;
        });

    }

    // setCampaignsTable
    function setCampaignsTable(){

        $scope.campaignTableShowLoader = true;
        $scope.campaignTableData = null;
        $scope.campaignUpdateTable = 0;

        // get table Data 
        serverAPI_service.getManageTableData("MANAGE / SUPPLY / CAMPAIGNS ", 'campaign', function(data){
            $scope.campaignTableData = data;

            $scope.campaignTableShowLoader = false;
            $scope.campaignUpdateTable++;

        });
    }
    
    // setCampaignsTable
    function setCampaignsPopup(){
        $scope.campaignPopupData = 
            {
                currentTabName : "nc",
                tabs : [ {label: "NEW CAMPAIGN", name: "nc"}],
                body : {    
                        
                        nc : [
                            {   type: "form", 
                                data : [        
                                    {type: "select",      label : "Supply Platform" , selectType: "regular", options: [], selectedData: [], width : "170px", inputDisabled: false},
                                    {type: "input",       label : "Campaign Name" ,   selectedData: "",  inputType:"text"},]},
                            {   type: "form", 
                                data : [        
                                    {type: "switch",      label : "Active" ,   status:true},]},
                                    ],
                        }
            };



        serverAPI_service.getFiltersData("supply platform create new campaign", function(res){
            $scope.campaignPopupData.body.nc[0].data[0].options = res.data.supply_platforms ? res.data.supply_platforms : [];
            $scope.campaignPopupData.body.nc[0].data[0].selectedData = $scope.campaignPopupData.body.nc[0].data[0].options[0];
        }, "getFilters2_id")

    }
    
    // setSupplyPlatforms
    function setSupplyPlatformsTable(){
        $scope.supplyPlatformsTableShowLoader = true;
        $scope.supplyPlatformsTableData = null;
        $scope.supplyPlatformsUpdateTable = 0;;

        // get table Data 
        serverAPI_service.getManageTableData("MANAGE / SUPPLY / SUPPLY PLATFORMS ", 'supply_platform', function(data){
            $scope.supplyPlatformsTableData = data;
            
            $scope.supplyPlatformsTableShowLoader = false;
            $scope.supplyPlatformsUpdateTable++;

        });
    }

    // setSupplyPartnersTable
    function setSupplyPartnersTable(){
        $scope.supplyPartnersTableShowLoader = true;
        $scope.supplyPartnersTableData = null;
        $scope.supplyPartnersUpdateTable = 0;;

        // get table Data
        serverAPI_service.getManageTableData("MANAGE / SUPPLY / SUPPLY partners ", 'supply_partner', function(data){
            $scope.supplyPartnersTableData = data;

            $scope.supplyPartnersTableShowLoader = false;
            $scope.supplyPartnersUpdateTable++;

        });
    }

    // setCampaignsTable
    function setSupplyPartnerPopup(){
        $scope.supplyPartnerPopupData =
            {
                currentTabName : "nsp",
                tabs : [ {label: "NEW SUPPLY PARTNER", name: "nsp"}],
                body : {

                        nsp : [
                            {   type: "form",
                                data : [
                                    {type: "input",       label : "Supply Partner Name" ,   selectedData: "",  inputType:"text"},]}],
                        }
            };

    }

    // =================
    // $scope FUNCTIONS:
    // =================

    // clearNewCampaignPopUp
    $scope.clearNewCampaignPopUp = function(){
        setCampaignsPopup();
    }

    // clearSupplyPartnerPopUp
    $scope.clearSupplyPartnerPopUp = function(){
        setSupplyPartnerPopup();
    }

    // saveNewCampaign
    $scope.saveNewCampaign = function(){

        rootScope_service.setPageLoader(true)
            serverAPI_service.postNewManageData("manage - new campaign" , "campaign", $scope.campaignPopupData.body, function(){
                rootScope_service.setPageLoader(false)

                rootScope_service.setAlertData("New Campaign Source", "You have created a new campaign successfully" , 1, null);

        });

    }

    // saveNewCampaign
    $scope.saveNewSupplyPartner = function(){

        rootScope_service.setPageLoader(true)
            serverAPI_service.postNewManageData("manage new supply partner" , "supply_partner", $scope.supplyPartnerPopupData.body , function(){
                rootScope_service.setPageLoader(false)

                rootScope_service.setAlertData("New Supply Partner", "You have created a new supply partner successfully" , 1, null);

        });

    }

    // editSupplySource
    $scope.editSupplySource = function(rowData){
        $scope.showSupplySourcesPopUp = true;
        $scope.supplySourceEditRowData = rowData
        
    }


})