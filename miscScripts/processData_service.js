
// TODO : change "processData" name to "middleMan"

angular.module("myApp")
.service("processData_service", function(rootScope_service, currentTime_service, textManipulation_service){

    // addCompareData 
    this.addChartCompareData = function(data, dataLabel, compareData, compareDataLabel, addOriginName){

        // enter CompareDataToHash
        var hashedData = hashChartDataByMeasureIdGranularityIdDate(compareData)

        data.data.forEach(function(dataByMeasures) {
            dataByMeasures.data.forEach(function(dataByGranularity) {
                dataByGranularity.data.forEach(function(dataByDataId) {
                    if(dataByDataId.dataId == 1){  
                        dataByDataId.name = addOriginName ? dataByMeasures.name + " " + dataLabel : dataLabel;
                        dataByDataId.mName = dataByMeasures.name;
                        var compareData = []
                        dataByDataId.data.forEach(function(dataByDate) { 

                            var cd = new Date(dataByDate[0]);

                            ["today","yesterday"].forEach(function(item){
                               if (dataLabel.toLowerCase().includes(item)){
                                    cd.setDate(cd.getDate() - 1);
                               }
                            });
                            ["this week","last week"].forEach(function(item){
                               if (dataLabel.toLowerCase().includes(item)){
                                    cd.setDate(cd.getDate() - 7);
                               }
                            });
                            ["this month","last month"].forEach(function(item){
                               if (dataLabel.toLowerCase().includes(item)){
                                    cd.setMonth(cd.getMonth() - 1);
                               }
                            });

                            var keyValue = getKeyValue( dataByMeasures.measureId, dataByGranularity.granularityId,
                                                        dataByDataId.dataId, cd);


                            if (hashedData[keyValue] != null)
                                compareData.push([dataByDate[0],hashedData[keyValue]]);
                        });
                        
                        var compareDataByDataId = { dataId : 2 ,
                                                    name : addOriginName ? dataByMeasures.name + " " + compareDataLabel : compareDataLabel,
                                                    mName : dataByMeasures.name,
                                                    data: compareData};
                        dataByGranularity.data.push(compareDataByDataId);
                    }
                });
               
            });
        });           
    }

    // addTableCompareData
    this.addTableCompareData = function(data, compareData){
        
        var hashCompareData = hashTableDataById(compareData.tableBody)
        var measures = data.tableFullMeasures;

        data.tableBody.forEach(function(rowData){
            measures.forEach(function(measure){
               if (hashCompareData[rowData.id] != null && rowData[measure] != null)
                    rowData[measure].push(hashCompareData[rowData.id][measure][0]);
            });
        })

    }

    // addKPICompareData
    this.addKPIsCompareData = function(KPIsData, kpiCompareData){

        KPIsCompareDataNameToVal = {}

        kpiCompareData.forEach(function(item){
            KPIsCompareDataNameToVal[item.name] = item.val;
        })

        KPIsData.forEach(function(item){
            item.compareVal = KPIsCompareDataNameToVal[item.name];
        })

        // result:
        // {title: "Margin", val: 55, compareVal:  56}
    }

    // -------------
    // RECEIVE DATA:
    // -------------

    // receiveData_tableReport
    this.receiveData_tableReport = function(receiveData, dimensions, type){

        var dimToServerAtt = {
            supply_sources  : "supply_source_id",
            supply_platforms: "supply_platform_id",
            supply_partners : "supply_partner_id",
            campaigns       : "campaign_id",

            domains         : "domain",
            demand_sources  : "demand_source_id",
            demand_platforms: "demand_platform_id",
            demand_partners : "demand_partner_id",
            creatives       : "creative_id",

            exchange        : "ad_exchange",
            date            : "date",

        }

        for(i in receiveData){
            for (j in receiveData[i]){
                receiveData[i][j] = [{label : receiveData[i][j]}];
            }
            receiveData[i].id = "";
            dimensions.forEach(function(dim){

                receiveData[i].id += receiveData[i][dimToServerAtt[dim]][0].label;
            })

        }

        var ans = {
            tableDimensions     : getTableDimensions(dimensions),
            tableFullMeasures   : rootScope_service.getTableFullMeasures(type),
            tableLiteMeasures   : rootScope_service.getTableLiteMeasures(type),
            tableTitles         : rootScope_service.getTableTitles(type),
            tableBody           : receiveData,
        };

        return ans;
    }

    // receiveData_FiltersData
    this.receiveData_filtersData = function (filtersData){
        for (filterNameAsKey in filtersData)
            for (objNumAsKey in filtersData[filterNameAsKey]){
                filtersData[filterNameAsKey][objNumAsKey].label = filtersData[filterNameAsKey][objNumAsKey].name;
                filtersData[filterNameAsKey][objNumAsKey].id = filtersData[filterNameAsKey][objNumAsKey].id

                if (["demand_platforms", "supply_platforms"].indexOf(filterNameAsKey) > -1)
                    filtersData[filterNameAsKey][objNumAsKey].id = parseInt(filtersData[filterNameAsKey][objNumAsKey].id)


            }



    }

    // receiveData_ChartData
    this.receiveData_chartData = function (receiveData, type){

            var processData = {
                granularityOptions : [],
                measuresOptions: getChartMeasures(type),
                data : [   ]

            }

            // set granularityOptions
             processData.granularityOptions= [{label:"15 Minutes", name:"15_minutes", id : 1}, {label:"Hour", name:"hour", id: 2}, {label:"Day", name:"day", id: 3}].filter(function(item){
                return receiveData.granularities.indexOf(item.name) > -1
             })


            // set data
            var arrDataByGranularityAndMeasure = {}
            processData.granularityOptions.forEach(function(granularity){
                processData.measuresOptions.forEach(function(measure){
                    var arrData = []

                    if(receiveData[granularity.name][measure.name] != null)
                        for (i=0 ; i < receiveData[granularity.name][measure.name].length; i++){

                            arrData.push([ Date.parse(receiveData[granularity.name].date[i]) ,
                                           receiveData[granularity.name][measure.name][i]])

                        }
                    arrDataByGranularityAndMeasure[granularity.name+measure.name] = arrData;
                })
            })


             processData.measuresOptions.forEach(function(measure){

                 var dataByMeasuresAndGranularity = {
                                 measureId   : measure.id,
                                 name        : measure.label,
                                 data        : [],
                 }

                processData.granularityOptions.forEach(function(granularity){

                    dataByMeasuresAndGranularity.data.push({
                            granularityId   : granularity.id,
                            data: [{dataId: 1 , data :arrDataByGranularityAndMeasure[granularity.name+measure.name]}]
                    })

                })
                processData.data.push(dataByMeasuresAndGranularity);
             })


             return processData;

    }

    // receiveData_KPIData
    this.receiveData_KPIData = function(receiveData){


        function getKpiTitle(name){

            switch(name){
                case  "fillrate":
                    return "Fill Rate"
                case "mid_points":
                    return "50% VTR"
                case "completes":
                    return "100% VTR"
                case "cpm":
                case "ctr":
                    return name.toUpperCase()
                default :
                    return name.replace(/_/g," ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            }
        }

        var ans = [];
        for (key in receiveData){

            ans.push({title : getKpiTitle(key), val:receiveData[key], name : key})
        }

        return ans;
    }

    // receiveData_getSavedReports
    this.receiveData_getSavedReports = function(rd) {

         var tableData = {
            tableDimensions     : ["name"],
            tableFullMeasures   : [ "type", "date", "granularity", "timezone"],
            tableLiteMeasures   : [ "type", "dim1", "dim2", "dim3", "dim4", "date", "granularity", "timezone"],
            tableTitles         : { type: "Type", name: "Report Name",  dim1: "Dimension 1",  dim2: "Dimension 2", dim3: "Dimension 3", dim4: "Dimension 4", date: "Date", granularity: "Granularity" , timezone: "Time Zone" },
            tableMeasureType    : { actions : "actions", filters: "hover"},
            tableBody           : [],
            tableTotals         : {},
        };

        rd.forEach(function(row){

            var filtersData = {};

            var newRow = {
                            id   : row.id,
                            user_id : row.user_id,
                            name : [{label : row.name}],
                            type : [{label : row.type}],

                            dim1 : [{label : row.dimension_1_name}],
                            dim2 : [{label : row.dimension_2_name}],
                            dim3 : [{label : row.dimension_3_name}],
                            dim4 : [{label : row.dimension_4_name}],

                            supply_platforms_ids : row.filters.supply_platform ? row.filters.supply_platform.map(function(item){ return parseInt(item)}) : [],
                            demand_platforms_ids : row.filters.demand_platform ? row.filters.demand_platform.map(function(item){ return parseInt(item)}) : [],

                            demand_partners_ids : row.filters.demand_partner ? row.filters.demand_partner : [],
                            supply_partners_ids : row.filters.supply_partner ? row.filters.supply_partner : [],

                            supply_sources_ids  : row.filters.supply_source ? row.filters.supply_source : [],
                            demand_sources_ids  : row.filters.demand_source ? row.filters.demand_source : [],
                            campaigns_ids       : row.filters.campaigns ? row.filters.campaigns : [],
                            domain              : row.filters.domain ? row.filters.domain : [],

                            device_make         : row.filters.device_make ? row.filters.device_make : [],
                            os                  : row.filters.os ? row.filters.os : [],
                            browser             : row.filters.browser ? row.filters.browser : [],
                            player_size         : row.filters.player_size ? row.filters.player_size : [],
                            country             : row.filters.country ? row.filters.country : [],

                            date          : [{label : row.report_date_choice}],
                            granularity   : [{label : row.granularity}],
                            timezone      : [{label : row.timezone}],
                          }

            tableData.tableBody.push(newRow);
        });

        return tableData;
    }

    // receiveData_getSystemNotification
    this.receiveData_getSystemNotification = function (rd){

        rd.forEach(function(row){
            for(key in row){
                if(key == "date_created")
                    row[key]= [{label : moment(row[key]).format("YYYY-MM-DD hh:mm:ss") }]
                else
                    row[key]= [{label : row[key] }]
            }
        })

       return  {
            tableDimensions : ["date_created", "message"],
            tableLiteMeasures  : [],
            tableTitles : {date_created :"Date Created", message :"Message"},
            tableBody : rd
        };
    }

    // receiveData_getAlertNotification
    this.receiveData_getAlertNotification = function (rd){

        rd.forEach(function(row){
            for(key in row){
                if(key == "date_created")
                    row[key]= [{label : moment(row[key]).format("YYYY-MM-DD hh:mm:ss") }]
                else
                    row[key]= [{label : row[key] }]
            }
        })

       return  {
            tableDimensions : ["date_created", "message"],
            tableLiteMeasures  : [],
            tableTitles : {date_created :"Date Created", message :"Message"},
            tableBody : rd
        };
    }

    // receiveData_getAlertsRulesList
    this.receiveData_getAlertsRulesList = function (rd){

        var ans = {
            tableDimensions  : ["alert_name"], // "date_created",  "des"
            tableLiteMeasures     : ["freq", "period", "dimensions_name", "as", "entityName", "conditions", "should_send_mail", "active"],
            tableTitles      : {date_created : "Date Created", alert_name :"Alert Name", des :"Description", freq : "Run Test Every", period : "Test Period",
                                dimensions_name : "Entity Type", as : "Any / Specific", entityName : "Entity Name / filters", conditions : "condition",
                                should_send_mail : "mail notification", active : "Active"},
            tableBody        : []
        }

        ans.tableBody = rd.map(function(row){

            var conditions = ""

            row.clauses.forEach(function(clause){
                conditions += "(" + clause.measure_name + " " + clause.operator_sign + " " + clause.measure_value + ")"
                conditions += row.logical_operator ? " AND " : " OR "
            })

            conditions = conditions.substring(0, conditions.length - (row.logical_operator ? 5 : 4))

//                 date_created    : [{label : row.date_created.substring(0,16)}],
//                              des             : [{label : row.des}],


            return {
                alert_name      : [{label : row.name}],
                freq            : [{label : row.freq_value + " " + row.freq_time_gran_name}],
                period          : [{label : row.window_value + " " + row.window_time_gran_name}],
                dimensions_name : [{label : row.dimension_name }],
                as              : [{label : row.dimension_choose_id == null ? "Any" : "Specific" }],
                entityName      : [{label : row.dimension_choose_id }],
                conditions      : [{label : conditions }],
                should_send_mail: [{label : row.should_send_mail }],
                active          : [{label : row.enabled }],
            }

        })

        return ans;

    }

    // receiveData_manageTable
    this.receiveData_manageTable = function(serverAns, manageType){

        serverAns.forEach(function(row){
            for(key in row){
                row[key] = [{label : row[key]}]
            }

        })

        var tableFullMeasures;
        var tableLiteMeasures;
        var tableTitles;
        var tableDimensions;

        switch(manageType){
            case "supply_source":
                tableDimensions     = ["supply_source_name"]
                tableFullMeasures   = ["status","supply_partner_name","campaign_name","supply_platform_name","line_item_id",
                                       "shutdown_status","max_last_hour_loss","max_daily_loss","tuner_status","notes", "date_created"]
                tableLiteMeasures   = ["status","supply_partner_name","campaign_name","supply_platform_name","line_item_id","bid"]
                tableTitles         = { supply_source_name : "supply source", status : "Active", supply_partner_name: "Supply Partner", campaign_name: "Campaign",
                                        supply_platform_name: "Supply Platform", line_item_id: "External Id", bid:"Bid", 

                                        shutdown_status:"Shutdown", run_every:"Run Every", max_last_hour_loss:"Hourly Loss", max_daily_loss: "Daily Loss",
                                        hourly_loss : "Hourly Loss", tuner_status : "Tuner status", notes : "Notes"}
                break;

            case "campaign":
                tableDimensions     = ["campaign_name"]
                tableLiteMeasures   = ["supply_platform_name"]
                tableFullMeasures   = []
                tableTitles = {campaign_name : "campaign", supply_platform_name : "supply platform"}
                break;

            case "supply_platform":
                tableDimensions     = ["supply_platform_name"]
                tableLiteMeasures   = ["status"]
                tableFullMeasures   = []
                tableTitles = {supply_platform_name : "supply platform", status: "active"}
                break;

            case "supply_partner":
                tableDimensions     = ["name"]
                tableLiteMeasures   = []
                tableFullMeasures   = []
                tableTitles = {name : "supply partner"}
                break;

            case "demand_source":
                tableDimensions     = ["name"]
                tableLiteMeasures   = ["demand_partner_name", "demand_platform_name", "env", "os", "external_id", "rate"]
                tableFullMeasures   = ["demand_partner_name", "demand_platform_name", "env", "os", "external_id", "rate", "notes", "actions"]
                tableTitles = {name : "demand source", demand_partner_name : "Demand Partner", demand_platform_name : "Demand Platform", external_id: "External Id", env : "environment", os : "OS", rate : "rate", notes: "notes", actions : "actions"}
                break;

//            "demand_source_name", "active", "demand_partner_name", "demand_platform_name", "external_id",
//            "env", "os", "url", "notes", "pixel_impression", "pixel_full_screen", "pixel_exit_full_screen",
//            "pixel_mute", "pixel_unmute", "pixel_pause", "pixel_resume", "pixel_skip", "pixel_request",
//            "pixel_first_quartiles", "pixel_mid_points", "pixel_third_quartiles", "pixel_full_screens",



            case "creative":
                tableDimensions     = ["name"]
                tableLiteMeasures   = ["supplier_name", "demand_platform","width", "height", "url_tag", "description", "attached_demand_source"]
                tableFullMeasures   = []
                tableTitles = {name : "creative name", supplier_name: "supplier_name", demand_platform : "demand_platform", width: "width", height: "height", url_tag : "url_tag", description : "description", attached_demand_source : "attached_demand_source"}
                break;

            case "demand_platform":
                tableDimensions     = ["name"]
                tableLiteMeasures   = ["connection_type", "description","active"]
                tableFullMeasures   = []
                tableTitles = {name : "demand platform name", connection_type : "connection type", description : "description", active: "active"}
                break;


            case "demand_partner":
                tableDimensions     = ["name"]
                tableLiteMeasures   = []
                tableFullMeasures   = []
                tableTitles = {name : "demand partner name"}
                break;
        }

        var processAns =  {
            tableDimensions     : tableDimensions,
            tableFullMeasures   : tableFullMeasures,
            tableLiteMeasures   : tableLiteMeasures,
            tableTitles         : tableTitles,
            tableBody           : serverAns,
            tableTotals         : {},
        };

        return processAns;
    }

   // dayPartData
    this.receiveData_dayPart = function (receiveData, sendData){



        var measures = []
        for (key in receiveData){
            measures.push({label : textManipulation_service.wiseTextFormant("day_part_measures", key), name : key});
        }

        var dayPartData = {
            measures    : measures,
            tableBody   : {},
            hoursTitles : [],
            daysTitles  : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            max         : {},
            min         : {},
            sortedArr   : {},
            selectedMeasureA : measures[0],
            selectedMeasureB : measures[1],
        }

        // hours title
        var i;
        for (i=0; i<24; i++){
            var time = i < 10 ?  "0" + i + ":00 - " +"0" + i + ":59" : i + ":00 - " + i + ":59";
            dayPartData.hoursTitles.push(time);
        }

        // table body
        for (key in receiveData){
            dayPartData.tableBody[key] = {};

            dayPartData.sortedArr[key] = receiveData[key].map(function(item){return item[2]}).sort(sortNumber);

            receiveData[key].forEach(function(item){
                // tableBody.measure.day/hour = value
                dayPartData.tableBody[key][((item[0]%7)+1) + "/" + item[1]] = item[2]

                if (dayPartData.max[key] == null && dayPartData.min[key] == null){
                    dayPartData.max[key] = item[2];
                    dayPartData.min[key] = item[2];
                }
                else if(dayPartData.max[key] < item[2]){
                    dayPartData.max[key] = item[2]
                }
                else if(dayPartData.min[key] > item[2]){
                    dayPartData.min[key] = item[2]
                }
            })
        }

        return dayPartData;
    }

    // ----------
    // SEND DATA:
    // ----------

    // sendData_postNewAlertRule
    this.sendData_postNewAlertRule = function(sendData){


        var filtersArr = []
        var filtersOpj = [
                            {dimName : "demandPartners",    attName : "demand_partner"},
                            {dimName : "supplyPartners",    attName : "supply_partner"},
                            {dimName : "supplySources",     attName : "supply_source"},
                            {dimName : "demandSources",     attName : "demand_source"},
                            {dimName : "supplyPlatforms",   attName : "supply_platform"},
                            {dimName : "demandPlatforms",   attName : "demand_platform"},
                            {dimName : "campaigns",   attName : "campaign"},
                            ]

        for (k in filtersOpj){

            if(sendData.selected[filtersOpj[k].dimName].length == sendData.options[filtersOpj[k].dimName].length)
                continue

            var temp = sendData.selected[filtersOpj[k].dimName].map(function(item) {return {dimension_name : filtersOpj[k].attName, id : item.id}} )
            filtersArr = filtersArr.concat(temp)
        }


        var ans = {
                    user_id                 : rootScope_service.getUserData().id,
                    name                    : sendData.selected.ruleName,
                    target_dimension_name   : sendData.selected.entity.name,

                    freq_time_gran_name     : sendData.selected.runTestEvery.unit.label,
                    freq_value              : sendData.selected.runTestEvery.val.label,

                    window_time_gran_name   : sendData.selected.window.unit.label,
                    window_value            : sendData.selected.window.val.label,

                    description             : sendData.selected.description,

                    filters                 : filtersArr,

                    should_send_mail        : sendData.selected.notification,

                    clauses                 : sendData.selected.clauses.map(function(clause) {return {measure_name : clause.measure.name, operator_sign : clause.operator.label, measure_value : clause.val}}),
                    logical_operator        : sendData.selected.clauseOperator == "and" ? 1 : 0,

                    actions_demand_sources  : sendData.selected.demandSourcesTable,
                    actions_supply_sources  : sendData.selected.supplySourcesTable,
        }

        return ans;
    }

    // sendData_tableReport
    this.sendData_report = function (dataToSend){

        var startAndEndDate = currentTime_service.getStartAndEndDate(dataToSend.date, dataToSend.timezone.selectedData.label, dataToSend.compare)

        var processDataToSend = {
            type                    : dataToSend.type,
            dimensions              : !dataToSend.dimensions ? null : dataToSend.dimensions.filter(function(dim) {return dim != "None"}),

            date_start              : getDateByFormant(startAndEndDate.date_start),
            date_end                : getDateByFormant(startAndEndDate.date_end),
            timezone                : dataToSend.timezone.selectedData.label,
            granularity             : !dataToSend.timeInterval ? null : dataToSend.timeInterval.label,

            domains                 : !dataToSend.domain || dataToSend.domain.selectedData.val == "" ? null : dataToSend.domain.selectedData.val,

            supply_sources_ids      : getFilterDataToSend(dataToSend.supplySources),
            demand_platforms_ids    : getFilterDataToSend(dataToSend.demandPlatforms),
            supply_platforms_ids    : getFilterDataToSend(dataToSend.supplyPlatforms),
            demand_sources_ids      : getFilterDataToSend(dataToSend.demandSources),

            campaigns_ids           : getFilterDataToSend(dataToSend.campaigns),
            supply_partners_ids     : getFilterDataToSend(dataToSend.supplyPartners),
            demand_partners_ids     : getFilterDataToSend(dataToSend.demandPartners),

            device_make             : !dataToSend.deviceMake || dataToSend.deviceMake.selectedData.label == "Any"  ? null: dataToSend.deviceMake.selectedData.label,
            os                      : !dataToSend.os || dataToSend.os.selectedData.label == "Any"          ? null: dataToSend.os.selectedData.label,
            browser                 : !dataToSend.browser || dataToSend.browser.selectedData.label == "Any"     ? null: dataToSend.browser.selectedData.label,
            player_size             : !dataToSend.playerSize || dataToSend.playerSize.selectedData.label == "Any"  ? null: dataToSend.playerSize.selectedData.label,
            tableTimeInterval       : !dataToSend.timeInterval ? null : dataToSend.timeInterval.selectedData.label.toLowerCase(),

        }

        return processDataToSend;
    };

    // sendData_tableReport
    this.sendData_reportFromSavedReport = function (dataToSend){

        var date = {
            selectedData : dataToSend.date[0],
            custom      :  null
        }

        var startAndEndDate = currentTime_service.getStartAndEndDate(date , dataToSend.timezone[0].label, dataToSend.compare)

        var processDataToSend = {
            type                    : "custom_" + dataToSend.type[0].label,
            dimensions              : [dataToSend.dim1[0].label, dataToSend.dim2[0].label, dataToSend.dim3[0].label, dataToSend.dim4[0].label].filter(function(dim) {return dim != "none"}),

            date_start              : getDateByFormant(startAndEndDate.date_start),
            date_end                : getDateByFormant(startAndEndDate.date_end),
            timezone                : dataToSend.timezone[0].label,
            granularity             : dataToSend.granularity[0].label,

            domains                 : dataToSend.domain== "" ? null : dataToSend.domain,

            supply_sources_ids      : dataToSend.supply_sources_ids.length == 0    ? null : dataToSend.supply_sources_ids,
            demand_platforms_ids    : dataToSend.demand_platforms_ids.length == 0  ? null : dataToSend.demand_platforms_ids,
            supply_platforms_ids    : dataToSend.supply_platforms_ids.length == 0 ? null : dataToSend.supply_platforms_ids,
            demand_sources_ids      : dataToSend.demand_sources_ids.length == 0   ? null : dataToSend.demand_sources_ids,

            campaigns_ids           : dataToSend.campaigns_ids.length == 0        ? null : dataToSend.campaigns_ids,
            supply_partners_ids     : dataToSend.supply_partners_ids.length == 0  ? null : dataToSend.supply_partners_ids,
            demand_partners_ids     : dataToSend.demand_partners_ids.length == 0  ? null : dataToSend.demand_partners_ids,

        }

        return processDataToSend;

    };

    // sendData_savedReport
    this.sendData_savedReport = function(fd, userId, savedReportName){

        var ans = {
            user_id                 : userId,
            name                    : savedReportName,
            type                    : fd.type,

            report_date_choice      : fd.date.selectedData.label,
            granularity             : fd.timeInterval.selectedData.label,
            timezone                : fd.timezone.selectedData.label,

            dimension_1_name        : fd.dim1.selectedData.name,
            dimension_2_name        : fd.dim2.selectedData.name,
            dimension_3_name        : fd.dim3.selectedData.name,
            dimension_4_name        : fd.dim4.selectedData.name,

            filters                 : {

            } ,

            // device_make             : fd.deviceMake.selectedData,
            // os                      : fd.os.selectedData,
            // browser                 : fd.browser.selectedData,
            // player_size             : fd.playerSize.selectedData,


        }

        //             geo                     : fd.geo.selectedData,


        if(!checkIfFullOrEmpty(fd.supplyPlatforms))
            ans.filters.supply_platform = fd.supplyPlatforms.selectedData.map(function(item){return item.id})
        if(!checkIfFullOrEmpty(fd.demandPlatforms))
            ans.filters.demand_platform = fd.demandPlatforms.selectedData.map(function(item){return item.id})
        if(!checkIfFullOrEmpty(fd.supplyPartners))
            ans.filters.supply_partner = fd.supplyPartners.selectedData.map(function(item){return item.id})
        if(!checkIfFullOrEmpty(fd.demandPartners))
            ans.filters.demand_partner = fd.demandPartners.selectedData.map(function(item){return item.id})

        if(!checkIfFullOrEmpty(fd.campaigns))
            ans.filters.campaigns = fd.campaigns.selectedData.map(function(item){return item.id})
        if(!checkIfFullOrEmpty(fd.supplySources))
            ans.filters.supply_source = fd.supplySources.selectedData.map(function(item){return item.id})
        if(!checkIfFullOrEmpty(fd.demandSources))
            ans.filters.demand_source = fd.demandSources.selectedData.map(function(item){return item.id})


        return ans;
    }

    // sendData_newManage
    this.sendData_newManage = function(manageType, dataToSend){

        var processedData = {};

        switch(manageType){

            case "supply_source":

                processedData = {
                    supply_source_name  : dataToSend.supplySource.selected,
                    supply_platform_id  : dataToSend.supplyPlatforms.selected.id,

                    campaign_flag       : dataToSend.campaignRadio.selected == "0",
                    campaign_id         : dataToSend.campaign.selected.id,
                    new_campaign_name   : dataToSend.campaign.selectedNew,

                    supply_partner_flag         : dataToSend.supplyPartnersRadio.selected == "0",
                    supply_partner_id           : dataToSend.supplyPartners.selected.id,
                    new_supply_partner_name     : dataToSend.supplyPartners.selectedNew,

                    external_id         : dataToSend.externalId.selected,
                    bid                 : dataToSend.bid.selected,

                    shut_down_flag        : dataToSend.shutdownRadio.selected ,
                    run_every             : dataToSend.runEvery.selected,
                    last_hour_loss        : dataToSend.lastHourLoss.selected,
                    daily_loss            : dataToSend.dailyLoss.selected,

                    rpm                   : dataToSend.RPM.selected,
                    automatic_Water_fall  : dataToSend.automaticWaterfall.selected,

                    notes                 : dataToSend.notes.selected,
                }

                break;

            case "campaign" :

                processedData = {
                                supply_platform_id      : dataToSend.nc[0].data[0].selectedData.id,
                                new_campaign_name       : dataToSend.nc[0].data[1].selectedData,
                                status                  : dataToSend.nc[1].data[0].status,
                                }
                break;

            case "supply_partner" :

                processedData = {
                                supply_partner_name : dataToSend.nsp[0].data[0].selectedData,
                                }
                break;

            case "demand_source" :

                processedData = {
                                demand_source_name : dataToSend.demandSource.selected,
                                demand_platform_id : dataToSend.demandPlatforms.selected.id,

                                demand_partner_flag : dataToSend.demandPartnersRadio.selected == "0",
                                demand_partner_name : dataToSend.demandPartners.selectedNew,
                                demand_partner_id   : dataToSend.demandPartners.selected.id,

                                external_id         : dataToSend.externalId.selected,
                                env                 : dataToSend.env.selected.label,

                                rate                : dataToSend.rate.selected,
                                os                  : dataToSend.os.selected.label,

                                url                 : dataToSend.url.selected,

                                notes               : dataToSend.notes.selected,

                                }
                break;

            case "demand_partner" :

                processedData = {
                                demand_partner_name : dataToSend.nsp[0].data[0].selectedData,
                                }
                break;
        }

        return processedData;
    }

    // sendData_postUserPreferences
    this.sendData_postUserPreferences = function(sendData){

        return {
                user_id     : rootScope_service.getUserData().id ,
                kpi_order   : sendData.kpi_order
            }

    }

    // ===========
    // FUNCTIONS :
    // ===========

    // getFilterDataToSend
    function getFilterDataToSend(filterData){

        if (!filterData ||
            filterData.selectedData.length == 0 ||
            filterData.options.length == filterData.selectedData.length)
            return null;

        return filterData.selectedData.map(function(item) {return item.id})

    }

    // getDateByFormant
    function getDateByFormant(d){
            d.getDate()  < 10       ? day = "0" + d.getDate()        : day = d.getDate();
            (d.getMonth()+1) < 10   ? month = "0" + (d.getMonth()+1) : month = (d.getMonth()+1);

            d.getHours()   < 10 ? hours = "0" + d.getHours() : hours = d.getHours();
            d.getMinutes() < 10 ? minutes = "0" + d.getMinutes() : minutes = d.getMinutes();
            d.getSeconds() < 10 ? seconds = "0" + d.getSeconds() : seconds = d.getSeconds();

            return  d.getFullYear() + '-' + month + '-' + day + "T" + hours + ":" + minutes + ":" + seconds;
    }

    // hashDataByMeasureIdGranularityIdDate
    function hashChartDataByMeasureIdGranularityIdDate(data){
        var returnHash = {};
        
        data.data.forEach(function(dataByMeasures) {
            dataByMeasures.data.forEach(function(dataByGranularity) {
                dataByGranularity.data.forEach(function(dataByDataId) {
                    dataByDataId.data.forEach(function(dataByDate) {
                        var keyValue = getKeyValue( dataByMeasures.measureId, dataByGranularity.granularityId,
                                                    dataByDataId.dataId, new Date(dataByDate[0]));
                        returnHash[keyValue] = dataByDate[1];
                    });
                });
            });
        });   

        return returnHash;
    }

    // getKeyValue
    function getKeyValue(measureId, granularityId, dataId, date){
        var keyValue = measureId + 
                        "/" + granularityId + 
                        "/" + dataId +
                        "/" + date;
        return keyValue;
    }

    // hashTableDataById
    function hashTableDataById(compareData) {
        var hash ={}

        compareData.forEach(function(item){
            hash[item.id] = item;
        })

        return hash;
    }

    // getDimensionsServerAttName
    function getTableDimensions(dimension){
        var dimensionServerAttName = []

        if (dimension.indexOf("date") > -1){
            dimensionServerAttName.push("date");
        }

        if (dimension.indexOf("supply_sources") > -1){
            dimensionServerAttName.push("supply_source_name");
        }
        if (dimension.indexOf("supply_platforms") > -1){
            dimensionServerAttName.push("supply_platform_name");
        }
        if (dimension.indexOf("supply_partners") > -1){
            dimensionServerAttName.push("supply_partner_name");
        }
        if (dimension.indexOf("campaigns") > -1){
            dimensionServerAttName.push("campaign_name");
        }
        if (dimension.indexOf("demand_platforms") > -1){
            dimensionServerAttName.push("demand_platform_name");
        }
        if (dimension.indexOf("demand_sources") > -1){
            dimensionServerAttName.push("demand_source_name");
        }
        if (dimension.indexOf("demand_partners") > -1){
            dimensionServerAttName.push("demand_partner_name");
        }
        if (dimension.indexOf("domains") > -1){
            dimensionServerAttName.push("domain");
        }

        if (dimension.indexOf("exchange") > -1){
            dimensionServerAttName.push("ad_exchange");
        }

        return dimensionServerAttName;
    }

    // getChartMeasures
    function getChartMeasures(type){

        var ans;
        if(type=="chart_data_demand"){
            ans =   [{label:"Fill Rate",            id: 8,  name : "demand_fill_rate"},
                    {label:"Demand Impressions",    id: 9,  name : "demand_impressions"},
                    {label:"Revenue",               id: 10, name : "revenue"},
                    {label:"Requests",              id: 12, name : "requests"},]
                    //                     {label:"RPM",                   id: 11, name : "demand_rpm"},

        }else if(type=="chart_data_supply"){
            ans = [
                    {label:"Margin",              id: 1, name : "margin"},
                    {label:"Revenue",             id: 2, name : "revenue"},
                    {label:"Profit",              id: 3, name : "profit"},
                    {label:"Fill Rate",           id: 4, name : "fill_rate"},
                    {label:"Supply Impressions",  id: 5, name : "supply_impressions"},
                    {label:"Demand Impressions",  id: 6, name : "demand_impressions"},
                    {label:"Spent" ,              id: 7, name : "spent"},
                    {label:"Unmutes",             id: 8, name : "unmutes"},
                    {label:"CTR",                 id: 9, name : "ctr"},
                    {label:"Clicks",                id: 10, name : "clicks"},
                    {label:"Pauses",                id: 11, name : "pauses"},
                    {label:"Mutes",                 id: 12, name : "mutes"},
                    {label:"CPM",                   id: 14, name : "bid_cpm"},
                    {label:"Resumes",               id: 15, name : "resumes"},
                    {label:"Skips",                 id: 16, name : "skips"},
                    {label:"25% VTR",       id: 29, name : "first_quartiles"},
                    {label:"50% VTR",     id: 17, name : "mid_points"},
                    {label:"75% VTR",     id: 13, name : "third_quartiles"},
                    {label:"100% VTR",    id: 18, name : "full_screens"},
                    {label:"Exit Full Screen",            id: 20, name : "exist_full_screens"},

            ]

        }


        return ans
    }

    // checkIfFullOrEmpty
    function checkIfFullOrEmpty(measureObj){
        return measureObj.options.length == measureObj.selectedData.length || measureObj.selectedData.length == 0;
    }

    // sortNumber
    function sortNumber(a,b) {
        return a - b;
    }


});
    