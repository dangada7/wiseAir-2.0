// wish chart directive
// on chartSeries change the chart will be recreate

angular.module("myApp").directive("wiseChart", function(){
    return {
        templateUrl : "/directives/wiseChartDirective/wiseChartDirective.html",

        scope :{
            chartTitle : '=',
            chartData: '=', 
            chartClassId : '@', // unique class name
            showMeasure1 : "=",     
            showMeasure2 : "=",
            showCompareSwitch : "=",

            showGranularity : "=",

            recreateChart : "=",

            defaultSelectMeasuresId : '=',

            showLoader : "=",

            initCompareSwitchStatus : "=",

            onClickCompareCallBack : "&",

            showCompareLoader : "=",

            chartWithOutMeasureLabel : "@"
            
        },
        controller : function($scope, $timeout, textManipulation_service, currentTime_service){

            var chart;
            var chartConfig;
            var chartConfigYAxisNames_g = [];

            initChartConfig();

            if($scope.initCompareSwitchStatus != null)
                $scope.compareSwitchStatus = $scope.initCompareSwitchStatus

            // =========
            // functions:
            // =========

            // formantToolTipValue
            function formantToolTipValue(value, name){
                if($scope.chartWithOutMeasureLabel || $scope.compareSwitchStatus)
                    name = $scope.selectedMeasure1.name;
                return textManipulation_service.wiseTextFormant(name, value)
            }

            // initChartConfig
            function initChartConfig() {

                var legendsStatus = {};

                chartConfig = { 
                        title:{
                            text:''
                        },
                        noData :{
                            style : { "fontSize": "18px", "fontWeight": "bold", "color": "#FFB900" , "fontFamily" : "'futura-pt-bold'", "font-weight" : "700"}
                        },
                        exporting: { enabled: false },
                        xAxis:{
                            labels: {
                                style: {
                                    color: 'white',
                                   fontFamily : "proxima-nova",
                                   fontWeight : 400,
                                }
                            },
                            type: 'datetime',
     
                        },
                        yAxis : [],
                        legend :{
                            useHTML: true,
                            symbolWidth: 0,
                            labelFormatter: function () {
                                         return '<div>' +
                                                    '<div style="border-radius: 50%; width: 10px; height: 10px; background-color: ' + this.color +'; display: inline-block; margin-right:5px"> </div>' +
                                                    '<span style="color:' + this.color + '    " class="proximaNova700"> ' + this.name +  " </span>" +
                                                '</div>'
                                     }

                        },

                        credits: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    enabled: false
                                },
                                events : {
                                    legendItemClick : function(){

                                        legendsStatus[this.name] = this.visible;

                                        this.chart.legend.update( {
                                            useHTML: true,
                                            symbolWidth: 0,
                                            labelFormatter: function () {

                                                        // legend status = visible
                                                        if (!legendsStatus[this.name])
                                                             return '<div>' +
                                                                        '<div style="border-radius: 50%; width: 10px; height: 10px; background-color: ' + this.color +'; display: inline-block; margin-right:5px"> </div>' +
                                                                        "<span style='color:" + this.color + "' class='proximaNova700'> " + this.name +  " </span>" +
                                                                   '</div>'

                                                        // legend status = invisible
                                                        return '<div>' +
                                                                   '<div style="border-radius: 50%; width: 10px; height: 10px; background-color: #cccccc; display: inline-block; margin-right:5px"> </div>' +
                                                                   "<span style='color: #cccccc;' class='proximaNova700'> " + this.name +  " </span>" +
                                                              '</div>'
                                                     }
                                        });


                                    }
                                }
                            }

                        },
                        tooltip: {
                            crosshairs: {
                                color: 'white',
                                dashStyle: 'solid',
                            },
                            shared: true,
                            useHTML: true,
                            backgroundColor : "var(--black)",
                            borderColor : "var(--black)",
                            style : { color : 'white' , fontFamily: 'proxima-nova', fontWeight: 400, border : 'none'},

                            headerFormat: "<div style='margin-bottom:4px;' class='wiseProximaNovaBold' >{point.key}</div>",

                            pointFormatter: function (){
                                            return '<div style="min-width:220px"> ' +
                                                        '<div style="border-radius: 50%; width: 8px; height: 8px; background-color:' + this.series.color + '; display: inline-block; margin-right:5px"> </div>' +
                                                        '<span style="color:' + this.series.color + '">'  + this.series.name +'</span>' +
                                                        '<span style="float: right">' + formantToolTipValue(this.y, this.series.name) + '</span> <br>' +
                                                    '</div>'
                                            },
                        },
                        chart : {
                            height : 250,
                            type : 'spline',
                            backgroundColor:'#555453',

                        },
                        // function to trigger reflow in bootstrap containers
                        // see: http://jsfiddle.net/pgbc988d/ and https://github.com/pablojim/highcharts-ng/issues/211
                        func: function(chart) {
                            $scope.$evalAsync(function() {
                                chart.reflow();
                                //The below is an event that will trigger all instances of charts to reflow
                                //$scope.$broadcast('highchartsng.reflow');
                            });
                        }
                    };
                
            }

            // getColorName
            function getColorName(measureName, dataTypeId){

                var colors = {
                    blue        : ["#439AFF", "#4B76A9", "#50647E"],
                    liteBlue    : ["#3AFAFF", "#42A6AA", "#4B7D7E"],
                    green       : ["#45D881", "#4A9669", "#4F745D"],
                    darkGreen   : ["#43B09B", "#4C8177", "#516661"],
                    gold        : ["#A79438", "#7E7442", "#65614C"],
                    yellow      : ["#FFB900", "#AB871B", "#806D3B"],
                    orange      : ["#ED7C23", "#A26736", "#7B5D45"],
                    darkPink    : ["#E95A4D", "#A0564E", "#7A5550"],
                    pink        : ["#FF3F7C", "#AA4867", "#804D5D"],
                    purple      : ["#D400FF", "#9520AB", "#823291"],

                }

                switch(measureName){
                    case "Fill Rate":
                    case "CTR":
                        if(dataTypeId == 2)
                            return colors.blue[1]
                        return colors.blue[0]

                    case "Supply Impressions":
                    case "Full Screens":
                    case "RPM":
                        if(dataTypeId == 2)
                            return colors.liteBlue[1]
                        return colors.liteBlue[0]

                    case "Revenue":
                    case "Resumes":
                        if(dataTypeId == 2)
                            return colors.green[1]
                        return colors.green[0]

                    case "Requests":
                    case "CPM":
                    case "Unmutes":
                        if(dataTypeId == 2)
                            return colors.darkGreen[1]
                        return colors.darkGreen[0]

                    case "Profit":
                    case "25% VTR":
                    case "Mutes":
                        if(dataTypeId == 2)
                            return colors.gold[1]
                        return colors.gold[0]

                    case "Profit Fill Rate":
                    case "Skips":
                        if(dataTypeId == 2)
                            return colors.yellow[1]
                        return colors.yellow[0]

                    case "Margin":
                    case "Clicks":
                    case "50% VTR":
                        if(dataTypeId == 2)
                            return colors.orange[1]
                        return colors.orange[0]

                    case "Demand Fill Rate":
                    case "Bid":
                    case "Pauses":
                        if(dataTypeId == 2)
                            return colors.darkPink[1]
                        return colors.darkPink[0]

                    case "Demand Impressions":
                    case "Spent":
                    case "100% VTR":
                        if(dataTypeId == 2)
                            return colors.pink[1]
                        return colors.pink[0]

                    case "Daily Spent":
                    case "Exit Full Screens":
                    case "75% VTR":
                        if(dataTypeId == 2)
                            return colors.purple[1]
                        return colors.purple[0]
                    default :
                        return "white";
                }
            }

            // getYAxisIdNum
            function getYAxisIdNum(measureName){

                for(i in chartConfigYAxisNames_g){
                    if (chartConfigYAxisNames_g[i].includes(getYAxisMeasureType(measureName)))
                        return Number.parseInt(i) //YAxis id
                }
                 if(getYAxisMeasureType(measureName))
                    chartConfigYAxisNames_g.push(getYAxisMeasureType(measureName));
                 return chartConfigYAxisNames_g.length - 1;// YAxis id

            }

            // getYAxisArray
            function resetChartConfigYAxisArray(){
                chartConfig.yAxis = [];

                chartConfigYAxisNames_g.forEach(function(yAxisName){

                     var newYAxis = getYAxisObject(yAxisName);

                     if (chartConfig.yAxis.length > 0 ){
                        newYAxis.opposite = true;
                     }

                     chartConfig.yAxis.push(newYAxis)
                })

                // reset this variable
                chartConfigYAxisNames_g = [];

            }

            // getYAxisMeasureType
            function getYAxisMeasureType(measure){

                switch(measure.toLowerCase().replace(/ /g, "_")){
                    case "fill_rate":
                    case "demand_fill_rate":
                    case "margin":
                    case "demand_rpm":
                    case "ctr":
                        return "percentage";
                    case "profit":
                    case "spent":
                    case "revenue":
                        return 'money'
                    case "cpm":
                        return 'currency'
                    case "supply_impressions":
                    case "demand_impressions":
                    case "pauses":
                    case "skips":
                    case "clicks":
                    case "third_quartiles":
                    case "full_screens":
                    case "mid_points":
                    case "first_quartiles":
                    case "unmutes":
                    case "resumes":
                    case "mutes":
                    case "requests":
                    case "impressions":
                    case "completes":
                    case "exit_full_screen":
                    case "100%_vtr":
                    case "75%_vtr":
                    case "50%_vtr":
                    case "25%_vtr":
                        return "number"
                    default:
                        console.log(measure.toLowerCase().replace(" ", "_"));
                }
            }

            // getYAxisObject
            function getYAxisObject(name){

                var ans = {
                          title :  {
                               text: '',
                               style: {
                                   color: 'white',
                                   fontFamily : "proxima-nova",
                                   fontWeight : 400,
                               }
                          },
                          labels: {
                              style: {
                                  color: 'white',
                                  fontFamily : "proxima-nova",
                                  fontWeight : 400,
                              }
                          },
                       };

                switch(name){
                    case "number":
                        ans.labels.formatter = function () {return this.axis.defaultLabelFormatter.call(this);}
                        break;
                    case "money":
                        ans.labels.formatter =  function () {return "$" + this.axis.defaultLabelFormatter.call(this);}
                        break;
                    case "percentage":
                        ans.labels.formatter =  function () {return this.axis.defaultLabelFormatter.call(this) + "%";}
                        break;
                    case "currency":
                        ans.labels.formatter =  function () {return "$" + this.axis.defaultLabelFormatter.call(this);}
                        break;
                }

                return ans;


            }

            // =================
            // $scope functions:
            // =================

            // updateChart
            $scope.updateChart = function(){
                
                 // empty chart
                if($scope.chartData == null){
                    return;
                }

                var newSeriesArray = [];

                // set chart data
                $scope.chartData.data.forEach(function(dataByMeasures) {
                    // get data by selected measures
                    if (dataByMeasures.measureId == $scope.selectedMeasure1.id || 
                        dataByMeasures.measureId == $scope.selectedMeasure2.id || 
                        ($scope.defaultSelectMeasuresId != null && $scope.defaultSelectMeasuresId.indexOf(dataByMeasures.measureId) > -1)){
                        dataByMeasures.data.forEach(function(dataByGranularity) {
                        // get data by selected granularity
                        if (dataByGranularity.granularityId == $scope.selectedGranularity.id){
                            
                                dataByGranularity.data.forEach(function(dataByDataType) {
                                    if ($scope.compareSwitchStatus || dataByDataType.dataId == 1){

                                        var newSeries = {data : dataByDataType.data.map(function(item){ return [currentTime_service.getDateByCurrentTimeZone(item[0]), item[1]]})};
                                        newSeries.lineWidth = 3;
                                        newSeries.marker = {symbol : 'circle'};
                                        if ($scope.compareSwitchStatus){
                                            newSeries.name = dataByDataType.name;
                                        }else{
                                            newSeries.name = dataByMeasures.name;
                                        }

                                        newSeries.color = getColorName(dataByMeasures.name,dataByDataType.dataId);

                                        newSeries.yAxis = getYAxisIdNum(dataByMeasures.name);

                                        newSeriesArray.push(newSeries);
                                    }
                                }, this);
                            
                            }
                        }, this);
                    } // close if
                }, this);

                // set chartConfig xAxis
                switch($scope.selectedGranularity.id){
                case 1:
                        chartConfig.xAxis.tickInterval = 3600 * 1000 / 4; // 15 MINUTE
                        break;
                case 2:
                        chartConfig.xAxis.tickInterval = 3600 * 1000;   // HOUR
                        break;
                case 3:
                        chartConfig.xAxis.tickInterval = 24 * 3600 * 1000; // DAY
                        break;
                }

                
                // Create chart
                chartConfig.series = newSeriesArray;
                resetChartConfigYAxisArray();

                $timeout(function(){
                    chart = Highcharts.chart($scope.chartClassId, chartConfig);
                }, 100)
            }

            // onClickCompare
            $scope.onClickCompare = function (){
                $scope.onClickCompareCallBack();
            }

            // =======
            // $watch:
            // ======= 
            $scope.$watch('recreateChart',function(newVal, oldVal){

                if(newVal < oldVal){
                    $scope.showCompareLoader = false;
                    if ($scope.initCompareSwitchStatus)
                        $scope.compareSwitchStatus = $scope.initCompareSwitchStatus
                    else 
                        $scope.compareSwitchStatus = false;
                
                }

                
                  // empty chart
                if($scope.chartData == null){
                    return;
                }

                // initialize measures
                if(!$scope.showMeasure1){
                    $scope.selectedMeasure1 = {id : -1};
                }else {
                    $scope.selectedMeasure1 = $scope.chartData.measuresOptions[0];
                }
                if(!$scope.showMeasure2){
                    $scope.selectedMeasure2 = {id : -1};
                }else {
                    $scope.selectedMeasure2 = $scope.chartData.measuresOptions[1];
                }

                // initialize granularity
                $scope.selectedGranularity = $scope.chartData.granularityOptions[$scope.chartData.granularityOptions.length-1]

                $scope.updateChart();
            });

            $scope.$watch('selectedGranularity',$scope.updateChart);
            $scope.$watch('selectedMeasure1',$scope.updateChart);
            $scope.$watch('selectedMeasure2',$scope.updateChart);

        }// close controller
    }

})