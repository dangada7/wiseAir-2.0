angular.module("myApp")
.directive("newSupplySource", function(){
    return {
        templateUrl : "/directives/newSupplySourceDirective/newSupplySourceDirective.html",
        scope : {
            show           : "=",
            editData      : "=",
        }, controller : function ($scope, rootScope_service,serverAPI_service){

            init();

            // init 
            function init(){

                var runEveryOptions = rootScope_service.getRunEveryOptions();
                    
                $scope.data = {
                    elements : {
                        supplySource     : { selected : "" },
                        supplyPlatforms  : { options : [], selected : []},
                        campaignRadio    : { selected : "0" , label : "*campaign",  radioDataArr :[{val : "0", label: "existing"},{val : "1", label: "new"}]},
                        campaign         : { options : [], selected : [], selectedNew: ""},

                        supplyPartnersRadio    : { selected : "0" , label : "*Supply Partners",  radioDataArr :[{val : "0", label: "existing"},{val : "1", label: "new"}]},
                        supplyPartners         : { options : [], selected : [], selectedNew: ""},

                        externalId       : { label: "external id" ,selected : ""},
                        bid              : { label: "bid" ,selected : 0},

                        shutdownRadio    : { selected : "0" , label : "shutdown",  radioDataArr :[{val : "0", label: "Do Not Use Shutdown"},{val : "1", label: "Use Default Shutdown"},{val : "2", label: "Set Shutdown Parameters"}]},
                        runEvery         : { selected : runEveryOptions[0], options: runEveryOptions},
                        lastHourLoss     : { selected : 15, options: []},
                        dailyLoss        : { selected : 15, options: []},

                        RPM              : { selected : false},
                        automaticWaterfall: { selected : false},

                        notes            : { selected : ""},
                    }
                }

                $scope.showFilterLoader = true;
                // get supplySource
                serverAPI_service.getFiltersData("supply/supplySource/newSupplySource", function(res){
                    $scope.showFilterLoader = false;
                    $scope.data.elements.campaign.options                = res.data.campaigns ? res.data.campaigns : [];
                    $scope.data.elements.campaign.selected               = res.data.campaigns ? res.data.campaigns[0] : [];

                    $scope.data.elements.supplyPlatforms.options         = res.data.supply_platforms ? res.data.supply_platforms : [];
                    $scope.data.elements.supplyPlatforms.selected        = res.data.supply_platforms ? res.data.supply_platforms[0] : [];

                    $scope.data.elements.supplyPartners.options          = res.data.supply_partners ? res.data.supply_partners : [];
                    $scope.data.elements.supplyPartners.selected = res.data.supply_partners ? res.data.supply_partners[0] : [];
                });
            }

            // clear
            function clear(){

                $scope.data.elements.supplySource.selected         = "" ;
                $scope.data.elements.supplyPlatforms.selected      = $scope.data.elements.supplyPlatforms.options[0] ;
                $scope.data.elements.campaignRadio.selected        = "0";
                $scope.data.elements.campaign.selected             = $scope.data.elements.campaign.options[0] ;
                $scope.data.elements.campaign.selectedNew          = "" ;

                $scope.data.elements.supplyPartnersRadio.selected  = "0";
                $scope.data.elements.supplyPartners.selected       = $scope.data.elements.supplyPartners.options[0] ;
                $scope.data.elements.supplyPartners.selectedNew    = "" ;

                $scope.data.elements.externalId.selected           = "";
                $scope.data.elements.bid.selected                  = 0 ;

                $scope.data.elements.shutdownRadio.selected        = "0";
                $scope.data.elements.runEvery.selected             = $scope.data.elements.runEvery.options[0];
                $scope.data.elements.lastHourLoss.selected         = 15;
                $scope.data.elements.dailyLoss.selected            = 15;

                $scope.data.elements.RPM.selected                  = false;
                $scope.data.elements.automaticWaterfall.selected   = false;

                $scope.data.elements.notes.selected                = "";
            }

            // saved
            $scope.save = function(){

                rootScope_service.setPageLoader(true)
                serverAPI_service.postNewManageData("manage - new supply source" , "supply_source", $scope.data.elements, function(){
                    rootScope_service.setPageLoader(false)

                    rootScope_service.setAlertData("New Supply Source", "You have created a new supply source successfully" , 1, null);

                });

            }

            // clickOnClose
            $scope.clickOnClose = function(){

                rootScope_service.setAlertData("New Supply Source", "Are you sure you want to close this window? all your information will be lost." , 1, function(){
                    clear();
                    $scope.show=false;
                })

            }

            
            // $scope.$watch("editData",function(){
            //     console.log($scope.editData)   
            //     if(!$scope.editData)
            //         return;
                
            //     var campaignName = $scope.editData.campaign_name[0].label;
            //     var campaignObj = $scope.data.elements.campaign.options.filter(function(item){return item.name == campaignName})[0]
                
            //     // $scope.data.elements.supplySource.selected = 
            //     // $scope.data.elements.supplyPlatforms.selected = 
            //     if(campaignObj){
            //         $scope.data.elements.campaignRadio.selected = "0";
            //         $scope.data.elements.campaign.selected = campaignObj;
            //     }else {
            //         $scope.data.elements.campaignRadio.selected = "1";
            //         $scope.data.elements.campaign.selectedNew = campaignName;
            //     } 

            //     // $scope.data.elements.supplyPartnersRadio.selected = 
            //     // $scope.data.elements.supplyPartners.selected = 

            //     // $scope.data.elements.externalId.selected = 
            //     $scope.data.elements.bid.selected = $scope.editData.bid[0].label;

            //     // $scope.data.elements.shutdownRadio.selected = 
            //     // $scope.data.elements.runEvery.selected = 
            //     // $scope.data.elements.lastHourLoss.selected = 
            //     // $scope.data.elements.dailyLoss.selected = 

            //     // $scope.data.elements.RPM.selected = 
            //     // $scope.data.elements.automaticWaterfall.selected = 

            //     // $scope.data.elements.notes.selected = 



            //     //  $scope.data = {
            //     //     elements : {
            //     //         supplySource     : { selected : "" },
            //     //         supplyPlatforms  : { options : [], selected : []},
            //     //         campaignRadio    : { selected : "0" , label : "*campaign",  radioDataArr :[{val : "0", label: "existing"},{val : "1", label: "new"}]},
            //     //         campaign         : { options : [], selected : [], selectedNew: ""},

            //     //         supplyPartnersRadio    : { selected : "0" , label : "*Supply Partners",  radioDataArr :[{val : "0", label: "existing"},{val : "1", label: "new"}]},
            //     //         supplyPartners         : { options : [], selected : [], selectedNew: ""},

            //     //         externalId       : { label: "external id" ,selected : ""},
            //     //         bid              : { label: "bid" ,selected : 0},

            //     //         shutdownRadio    : { selected : "0" , label : "shutdown",  radioDataArr :[{val : "0", label: "Do Not Use Shutdown"},{val : "1", label: "Use Default Shutdown"},{val : "2", label: "Set Shutdown Parameters"}]},
            //     //         runEvery         : { selected : runEveryOptions[0], options: runEveryOptions},
            //     //         lastHourLoss     : { selected : 15, options: []},
            //     //         dailyLoss        : { selected : 15, options: []},

            //     //         RPM              : { selected : false},
            //     //         automaticWaterfall: { selected : false},

            //     //         notes            : { selected : ""},
            //     //     }
            //     // }

            // }, true)


        } // close controller 


    }
})