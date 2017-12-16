angular.module("myApp")
.directive("newDemandSource", function(){
    return {
        templateUrl : "/directives/newDemandSourceDirective/newDemandSourceDirective.html",
        scope : {
            show           : "=",
        }, controller : function ($scope, rootScope_service,serverAPI_service){

            init();


            // init 
            function init(){

                var envOptions = rootScope_service.getEnvOptions();
                var osOptions  = rootScope_service.getOsOptions();

                $scope.data = {
                    elements : {
                        demandSource     : { selected : "" },
                        demandPlatforms  : { options : [], selected : []},

                        demandPartnersRadio    : { selected : "0" , radioDataArr :[{val : "0", label: "existing"},{val : "1", label: "new"}]},
                        demandPartners         : { options : [], selected : [], selectedNew: ""},

                        externalId       : { label: "External id" ,selected : "" },
                        env              : { label: "Environment" ,selected : envOptions[0]  , options : envOptions},

                        rate             : { label: "Rate" ,selected : "" },
                        os               : { label: "Operation System" ,selected : osOptions[0]  , options : osOptions},

                        url              : { label : "URL", selected : ""},

                        notes            : { selected : ""},
                    }
                }

                // get supplySource
                serverAPI_service.getFiltersData("supply/supplySource/newSupplySource", function(res){

                    $scope.data.elements.demandPlatforms.options    = res.data.demand_platforms ? res.data.demand_platforms : [];
                    $scope.data.elements.demandPlatforms.selected   = res.data.demand_platforms ? res.data.demand_platforms[0] : [];
                    $scope.data.elements.demandPartners.options     = res.data.demand_partners ? res.data.demand_partners : [];
                    $scope.data.elements.demandPartners.selected    = res.data.demand_partners ? res.data.demand_partners[0] : [];
                });

            }

            // saved
            $scope.save = function(){

                rootScope_service.setAlertData("new supply source", "Are you sure you want to create this new supply source?" , 1, function(){
                    serverAPI_service.postNewManageData("manage new supply source" , "demand_source", $scope.data.elements, function(){


                    });
                })
            }


        } // close controller 


    }
})