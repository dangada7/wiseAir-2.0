angular.module("myApp")
.controller("dashboardController", function($scope, serverAPI_service, processData_service, rootScope_service, exportFile_service, currentTime_service, textManipulation_service){

    var chosenElement = null;
    $scope.kpiOrderStatus = false;



    initFilters();
    updateBtn();

    // ==========
    // Functions:
    // ==========
    // initFilters
    function initFilters() {

        var timezoneOptions = rootScope_service.getTimezoneOptions();
        var dateOptions     = rootScope_service.getDateDashboardOptions();

        $scope.filtersData = {
                            supplyPlatforms : { options : [],   selectedData: [], type : 'multiple'},
                            demandPlatforms : { options : [],   selectedData: [], type : 'multiple'},
                            date            : { options : dateOptions ,     selectedData: dateOptions[0]},
                            timezone        : { options : timezoneOptions,  selectedData: timezoneOptions[0]},
                            };

        $scope.showFilterLoader = true;

        // get filters data
        serverAPI_service.getFiltersData("SupplyReport / initFilters", function(res){
            $scope.showFilterLoader = false;

            $scope.filtersData.supplyPlatforms.options      = res.data.supply_platforms ? res.data.supply_platforms          : [];
            $scope.filtersData.supplyPlatforms.selectedData = [];

            $scope.filtersData.demandPlatforms.options      = res.data.demand_platforms ? res.data.demand_platforms          : [];
            $scope.filtersData.demandPlatforms.selectedData = [];
        });


    }

    // updateDateText
    function updateDateText(){
        $scope.dateText = $scope.filtersData.date.selectedData.label;
        $scope.dateCompareText = $scope.filtersData.date.selectedData.compareLabel;
    }

    // getKPIsData
    function getKPIsData(){
        $scope.showKPIsLoader = true;
        $scope.KPIsCompareData = null;
        $scope.KPIsData = [];
        $scope.KPICompareStatus = false;
        $scope.showKPIsCompareLoader = false;

        var dataToSend = {
            compare : false,
        }
        Object.assign(dataToSend, $scope.filtersData);

        serverAPI_service.getKPIsData("Dashboard / KPI / data",  dataToSend, function(data){
            var kpiOrder = rootScope_service.getUserData().kpi_order;

            var dataByName= {}
            data.forEach(function(item){
                dataByName[item.name] = item;
            })

            for (var key in kpiOrder){
                if(!dataByName[kpiOrder[key]]){
                    console.log(kpiOrder[key])
                    continue;
                }
                $scope.KPIsData.push(dataByName[kpiOrder[key]]);
            }
            $scope.showKPIsLoader = false;
        });
    }

    // getChartsData
    function updateCharts(){

        var chart = {
            data : null,
            compareData : null,
        }

        $scope.showChartsLoader = true;

        // (0) performance chart
        $scope.performanceChartData = null;
        $scope.performanceChartShowLoader = true;
        $scope.reCreatePerformanceChart = 0;

        // (1) today performance chart
        $scope.todayPerformanceChartData = null;
        $scope.todayPerformanceChartShowLoader = true;
        $scope.reCreateTodayPerformanceChart = 0;

        // (2) today finance chart
        $scope.todayFinanceChartData = null;
        $scope.todayFinanceChartShowLoader = true;
        $scope.reCreateTodayFinanceChart = 0;

        var sendData = {
            type : "chart_data_supply",
        }
        Object.assign(sendData, $scope.filtersData)

        serverAPI_service.getChartReport("Dashboard / Performance / Today", sendData , function(data){

            // (1) today performance chart
            $scope.todayPerformanceChartData = JSON.parse(JSON.stringify(data));
            $scope.todayPerformanceChartShowLoader = false
            $scope.reCreateTodayPerformanceChart ++;

            // (2) today finance chart
            $scope.todayFinanceChartData = JSON.parse(JSON.stringify(data));
            $scope.todayFinanceChartShowLoader = false;
            $scope.reCreateTodayFinanceChart ++;

            chart.data = data;

            if(chart.compareData){
                $scope.showChartsLoader = false;
                updatePerformanceChart();
            }
        });

        var sendData = {
            type : "chart_data_supply",
            compare : true,
        }
        Object.assign(sendData, $scope.filtersData)

        // (0) performance chart
        serverAPI_service.getChartReport("Dashboard / Performance / Yesterday", sendData, function(compareData){

            chart.compareData = compareData;

            if(chart.data){
                $scope.showChartsLoader = false;
                updatePerformanceChart();
            }

        });

        function updatePerformanceChart(){
            var chartEndLabels = getPerformanceChartLabel()

            var label        = sendData.date.selectedData.label + " " + chartEndLabels.label
            var compareLabel = sendData.date.selectedData.compareLabel + " " +  chartEndLabels.compareLabel

            processData_service.addChartCompareData(chart.data, label ,chart.compareData, compareLabel)
            $scope.performanceChartData=JSON.parse(JSON.stringify(chart.data));
            $scope.reCreatePerformanceChart ++;
            $scope.performanceChartShowLoader = false;
        }

    }

    // updateBtn
    function updateBtn(){
        updateDateText();
        getKPIsData();
        updateCharts();
        updateCompareTooltip();
    }

    // getCompareTooltip
    function updateCompareTooltip() {

        var date = currentTime_service.getStartAndEndDate($scope.filtersData.date, $scope.filtersData.timezone.selectedData.label, false)
        var compareDate = currentTime_service.getStartAndEndDate($scope.filtersData.date, $scope.filtersData.timezone.selectedData.label, true)

        var daysNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        switch ($scope.filtersData.date.selectedData.name){
            case 'today':
                $scope.compareTooltip = "Compares Today's Data to Yesterday's Data";
                break;
            case 'yesterday':
                $scope.compareTooltip = "Compares Yesterday's Data to Day-before's Data";
                break;
            case 'this_week':
                $scope.compareTooltip = "Compares This Week's Data to Last Week's Data (" + daysNames[compareDate.date_start.getDay()] + " to " + daysNames[compareDate.date_end.getDay()] + ")";
                break;
            case 'last_week':
                $scope.compareTooltip = "Compares This Week's Data to Last Week's Data (" + daysNames[compareDate.date_start.getDay()] + " to " + daysNames[compareDate.date_end.getDay()] + ")";
                break;
            case 'this_month':
                $scope.compareTooltip = "Compares This Month's Data to Last Month's Data (" + monthNames[compareDate.date_start.getMonth()] + " " + compareDate.date_start.getDate() + "st to " + compareDate.date_end.getDate() + "st" + ")";
                break;
            case 'last_month':
                $scope.compareTooltip = "Compares This Month's Data to Last Month's Data (" + monthNames[compareDate.date_start.getMonth()] + " " + compareDate.date_start.getDate() + "st to " + compareDate.date_end.getDate() + "st" + ")";
                break;
        }
    }

    // getPerformanceChartLabel
    function getPerformanceChartLabel(){

        var ans = {
            label : "",
            compareLabel : ""
        }

        var date = currentTime_service.getStartAndEndDate($scope.filtersData.date, $scope.filtersData.timezone.selectedData.label, false)
        var compareDate = currentTime_service.getStartAndEndDate($scope.filtersData.date, $scope.filtersData.timezone.selectedData.label, true)

        var daysNames = ["Sunday", "Monday", "Tuesday", "wednesday", "Thursday", "Friday", "Saturday"]
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        switch ($scope.filtersData.date.selectedData.name){
            case 'today':
            case 'yesterday':
                break;
            case 'this_week':
            case 'last_week':
                ans.label = "(" + daysNames[date.date_start.getDay()] + " to " + daysNames[date.date_end.getDay()] + ")";
                ans.compareLabel = "(" + daysNames[compareDate.date_start.getDay()] + " to " + daysNames[compareDate.date_end.getDay()] + ")";
                break;
            case 'this_month':
            case 'last_month':
                ans.label           = "(" + monthNames[date.date_start.getMonth()]        + " " + date.date_start.getDate()        + "st to " + date.date_end.getDate() + "st" + ")";
                ans.compareLabel    = "(" + monthNames[compareDate.date_start.getMonth()] + " " + compareDate.date_start.getDate() + "st to " + compareDate.date_end.getDate() + "st" + ")";
                break;
        }

        return ans;

    }


    // ================
    // $scope function:
    // ================

    // getKPIsCompareData:
    $scope.getKPIsCompareData = function(){

        if($scope.KPIsCompareData)
            return;

        $scope.showKPIsCompareLoader = true;


        var dataToSend = {
            compare : true
        }
        Object.assign(dataToSend, $scope.filtersData);

        serverAPI_service.getKPIsData("Dashboard / KPI / compareData", dataToSend, function(compareData){
            $scope.KPIsCompareData = compareData;
            processData_service.addKPIsCompareData($scope.KPIsData ,$scope.KPIsCompareData);
            $scope.showKPIsCompareLoader = false;
         });
    }

    // updateBtn
    $scope.updateBtn = updateBtn;

    // downloadCSV
    $scope.downloadCSV = function(){

        var exportData = {}
        var titles = {};

        $scope.KPIsData.forEach(function(item){ 
            exportData[item.name] = item.val;
            titles[item.name] =  item.title
        })


        exportFile_service.downloadCSV([exportData], rootScope_service.getUserData().kpi_order ,"KPIs.csv", titles);
    }

    // KPIMouseDown
    $scope.KPIMousedown = function (index){
        
        if (chosenElement == null)
            chosenElement = $scope.KPIsData[index];
        
    }

    // KPIMouseup
    $scope.KPIMouseup = function (index){
        
        if (chosenElement != null)
            chosenElement = null;
        
    }

    // KPIMouseover
    $scope.KPIMouseover = function(index){

        if (chosenElement != null){
            var indexChosenElement = $scope.KPIsData.indexOf(chosenElement);
            $scope.KPIsData.splice(indexChosenElement, 1);

            $scope.KPIsData.splice(index, 0,chosenElement);
        }

    }

    // kpiClick
    $scope.kpiClick = function(event){
        $scope.location = event
        console.log("kpiClick", event);
    }

    // kpiMouseMove
    $scope.kpiMouseMove = function(event){

        $scope.mouseLocation = {x : event.screenX, y : event.screenY} 
    }

    // formantCellData
    $scope.formatKPI = function(data, measure){
        return textManipulation_service.wiseTextFormant(measure,data);
    }

    $scope.saveKpiReorder = function(){


        var sendData = {kpi_order : $scope.KPIsData.map(function(item) {return item.name})}

        serverAPI_service.postUserPreferences("dashboard save kpi order", sendData, function(){
            rootScope_service.updateKpiOrder(sendData.kpi_order);
        })

    }



});