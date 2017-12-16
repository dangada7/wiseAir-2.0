
angular.module("myApp")
.service("mock_service", function(textManipulation_service, rootScope_service, mockData_service){

    // getMockLogin
    this.getMockLogin = function(){

        return mockData_service.getLogin();
    }

    // getMockFiltersData
    this.getMockFiltersData = function(compare){

        return mockData_service.getFilters();
    };

    // getMockTableReport
    this.getMockTableReport = function(type, compare, dimensions, filters){


        if(type == "custom_supply"){

                if(dimensions[0] == "supply_sources" && dimensions[1] == "domains" && dimensions[2] == "exchange")
                    return compare ? mockData_service.getTableSupplySourceAndDomainAndExchangeCompare() : mockData_service.getTableSupplySourceAndDomainAndExchange();

                if(dimensions[0] == "supply_sources")
                    return compare ? mockData_service.getTableSupplySourceCompare() : mockData_service.getTableSupplySource();

                if(dimensions[0] == "domains")
                    return mockData_service.getTableDomains_filterBySupplySource();

        }
        if(type == "custom_demand"){

            if( dimensions[0] == "demand_sources"){

                if(filters.supply_sources_ids)
                    return mockData_service.getTableDemandSource_filterBySupplySource();
                if(filters.domains)
                    return mockData_service.getTableDemandSource_filterByDomain();

                return compare ? mockData_service.getTableDemandSourceCompare() : mockData_service.getTableDemandSource();
            }

            if(dimensions[0] == "domains")
                return compare ?  mockData_service.getTableDomainCompare_filterByDemandSource() : mockData_service.getTableDomain_filterByDemandSource();



        }


    };

    // getMockChartReport
    this.getMockChartReport = function(type, compare, filters){

        // chart_data_supply
        if (type == "chart_data_supply"){

            if(filters.supply_sources_ids)
                return compare ? mockData_service.getChartSupplyCompare() : mockData_service.getChartSupply_filterBySupplySource();

            return compare ? mockData_service.getChartSupplyCompare() : mockData_service.getChartSupply();
        }

        // chart_data_demand
        if (type == "chart_data_demand"){
            if(filters.supply_sources_ids)
                return compare ? mockData_service.getChartDemandCompare_filterByDemandSource() : mockData_service.getChartDemand_filterByDemandSource();

            return compare ? mockData_service.getChartDemandCompare() : mockData_service.getChartDemand();

       }


    };

    // getMockNotificationData
    this.getMockSystemNotificationData = function(){

        return mockData_service.getSystemNotification();
    };

    // getMockNotificationData
    this.getMockAlertData = function(){
       
        return mockData_service.getAlertNotification();

    };

    // getMockAlertNotification
    this.getMockAlertRules = function(){
        return {status: true, data:[]};
    }

    // getMockKPIData
    this.getMockKPIsData = function(compare){

        if (compare)
            return mockData_service.getKPIsCompare();

        return mockData_service.getKPIs();
    }

    // getMockSavedReportsData
    this.getMockSavedReportsData = function(){

        return mockData_service.getTableSavedReport();
    }

    // getMockManageTableData
    this.getMockManageTableData = function (manageTableName){

        switch(manageTableName){

            case "supply_source":
                return mockData_service.getManageTableSupplySource();
            case "campaign":
                return mockData_service.getManageTableCampaign();
            case "supply_partner":
                return mockData_service.getManageTableSupplyPartner();
            case "supply_platform":
                return mockData_service.getManageTableSupplyPlatform();

            case "demand_source":
                return mockData_service.getManageTableDemandSource();
            case "demand_partner":
                return mockData_service.getManageTableDemandPartner();
            case "demand_platform":
                return mockData_service.getManageTableDemandPlatform();


        }

    }

    // getDayPartData
    this.getMockDayPartLastWeek = function (){

        return mockData_service.getDayPartLastWeek2();

    }

});