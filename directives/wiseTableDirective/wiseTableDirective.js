angular.module("myApp")
.directive("wiseTable", function(){
    return {
        templateUrl : "/directives/wiseTableDirective/wiseTableDirective.html",
        
        scope :{

            tableTitle : '=',
            tableData: '=',
            showLoader: '=',
            updateTable: "=",
            
            infoText : "@",

            showCompareSwitch : "=",
            showFullSwitch : "=",
            showTotal : "=",

            onRowClick : "&",
            rowClickable : "=",
            showExportBtn : "=",

            showFiltersRow : "=",

            onClickCompareCallBack : "&",

            defaultRowNumIndex : "@",
            tableStyle : "@",

            showCompareSwitchLoader : "=",

            hideNumOfRowSelect : "="

        },
        controller : function($scope, exportFile_service, textManipulation_service){

            initWiseTable();

            $scope.filterArr = ["active", "status", "supply_partner_name","campaign_name","supply_platform_name", 
            "demand_partner_name", "demand_platform_name", "env", "os", "external_id", "line_item_id"]

            $scope.currentSelectedArrangeMeasure = {measure: null, status: "up"};

            // ==========
            // FUNCTIONS:
            // ==========

            // initWiseTable
            function initWiseTable(){
                // rows Per page
                $scope.rowsNumOption = [{label : "5"  , value: 5}, 
                                        {label : "10" , value: 10}, 
                                        {label : "20" , value: 20},
                                        {label : "50" , value: 50},];

                $scope.selectedNumOfRows = $scope.rowsNumOption[0];

                if ($scope.defaultRowNumIndex)
                    $scope.selectedNumOfRows = $scope.rowsNumOption[$scope.defaultRowNumIndex];


                $scope.pagesOptions = [];
                $scope.filterTableBody = [];

                $scope.chosenRowId = -1;
                $scope.rowFilters = {};

                $scope.searchInput = {};

            }

            // setTableBody
            function setCurrentTableBody(){
                if ($scope.selectedPage == null){
                    $scope.currentTableBody = [];
                    return;
                }
                var startAt = ($scope.selectedPage.label- 1) * $scope.selectedNumOfRows.value;
                var endAt   = $scope.selectedPage.label * $scope.selectedNumOfRows.value;
        
                $scope.currentTableBody = $scope.filterTableBody.slice(startAt, endAt);
                

            }

            //  setFilterTableBody
            function setFilterTableBody(){
                if($scope.tableData != null && $scope.tableData.tableBody.length > 0){
                    $scope.filterTableBody = $scope.tableData.tableBody.filter(function(rowData){

                        var ans;
                        if ($scope.showFiltersRow){
                            ans = true;
                            var allInputEmpty = true;
                            $scope.tableData.tableDimensions.forEach(function(dim){
                                if($scope.rowFilters[dim] != null && rowData[dim]){
                                    allInputEmpty = false;
                                    ans = ans && rowData[dim][0].label.toLowerCase().includes($scope.rowFilters[dim].toLowerCase());
                                }
                            });

                            $scope.selectedMeasures.forEach(function(dim){
                                if($scope.rowFilters[dim] != null && rowData[dim] != null){
                                    allInputEmpty = false;

                                    if(dim == "status"){
                                        var label = rowData[dim][0].label ? "True" : "False";
                                        ans = ans && label.toLowerCase().includes($scope.rowFilters[dim].toLowerCase());
                                    }else if(rowData[dim][0].label){
                                        ans = ans && rowData[dim][0].label.toLowerCase().includes($scope.rowFilters[dim].toLowerCase());
                                    }
                                }
                            });
                            
                            if (allInputEmpty){
                                return true;
                            }

                        }else{
                            ans = false;
                            if($scope.searchInput.val == null)
                                return true;
                        
                            $scope.tableData.tableDimensions.forEach(function(dim){
                                ans = ans || rowData[dim][0].label.toLowerCase().includes($scope.searchInput.val.toLowerCase())
                            });
                        }
                        
                        return ans;
                    });
                }
            }

            // setSelectedMeasures
            function setSelectedMeasures(){
               
                if( $scope.tableData == null)
                    return;

                if (!$scope.fullSwitchValue){
                    $scope.selectedMeasures = $scope.tableData.tableLiteMeasures;
                } else {
                    $scope.selectedMeasures = $scope.tableData.tableFullMeasures;
                }
            }
            
            // setPagesOptions
            function setPagesOptions(){
                var lastPage =  Math.ceil($scope.filterTableBody.length / $scope.selectedNumOfRows.value);
                $scope.pagesOptions = [];
                var i;
                for (i= 1; i<= lastPage; i++){
                    $scope.pagesOptions.push({label : i});
                }
                $scope.selectedPage = $scope.pagesOptions[0];
            }

            // setTableLocationText
            function setTableLocationText(){
                if ($scope.selectedPage == null)
                    return;

                var startAt = ($scope.selectedPage.label - 1) * $scope.selectedNumOfRows.value;
                var endAt   = $scope.selectedPage.label * $scope.selectedNumOfRows.value;

                if (endAt > $scope.filterTableBody.length)
                    endAt = $scope.filterTableBody.length;
                $scope.tableNavText = "Showing " + startAt + "-" + endAt + " of " + $scope.filterTableBody.length;
            }

            // cleanTable
            function cleanTable(){
                $scope.currentTableBody = [];
                $scope.tableData = null; 
            }

            // sum
            function sum(measure, compareData_Flag) {
                var sum = 0;
                for( var i = 0; i < $scope.filterTableBody.length; i++ ){
                    if(!$scope.filterTableBody[i][measure])
                        continue;
                    if (compareData_Flag){
                        if($scope.filterTableBody[i][measure][1])
                            sum += parseFloat($scope.filterTableBody[i][measure][1].label);
                    }else
                        sum += parseFloat($scope.filterTableBody[i][measure][0].label);
                 }
                return sum;
            }

            // avg
            function avg(measure, compareData_Flag){
                var avg = sum(measure, compareData_Flag)/$scope.filterTableBody.length;

                return Math.floor(avg);
            }

            // =================
            // $scope functions:
            // =================
            
            // changeToPage
            $scope.changeToPage = function (page){
                var lastPage =  Math.ceil($scope.filterTableBody.length / $scope.selectedNumOfRows.value);
                switch(page){
                    case "next":
                        if ($scope.selectedPage.label != lastPage)
                            $scope.selectedPage.label++;
                        break;
                    case "prev":
                        if ($scope.selectedPage.label != 1)
                            $scope.selectedPage.label--;
                        break;
                    case "last":
                        $scope.selectedPage.label = lastPage
                        break;
                    case "first":
                        $scope.selectedPage.label = 1;
                        break;
                }
                setCurrentTableBody();
                setTableLocationText();
            }

            // compareData
            $scope.compareData = function (data, compareData){
                
                var ans;
                if (compareData == null)
                    ans = 0
                else if (data > compareData)
                    ans = 1
                else if (data < compareData)
                    ans = 2
                else if (data == compareData)
                    ans = 3
                return ans;
            }

            // searchChange
            $scope.searchChange = function (test){
                setFilterTableBody();
                setPagesOptions();
                setCurrentTableBody();
                setTableLocationText()
            }

            // getTableStatus
            $scope.tableStatus = function(status){
                var ans;                
                if($scope.showLoader){
                    ans = status == "loader";
                } else if($scope.tableData == null || $scope.tableData.tableBody.length == 0 ){
                    ans = status == "noData";
                } else {
                    ans = status == "data";
                }
                return ans;
            }

            // onRowClickWrapper
            $scope.onRowClickWrapper = function(rowData, index){
                if(rowData.id)
                    $scope.chosenRowId = rowData.id;
                $scope.onRowClick({att:rowData});
            }

            // exportTable
            $scope.exportTable = function(){
                var keys = $scope.tableData.tableDimensions.concat($scope.tableData.tableFullMeasures)
                exportFile_service.downloadCSV($scope.tableData.tableBody, keys, $scope.tableTitle + ".csv", $scope.tableData.tableTitles);
            }

            // rearrangeTable
            $scope.rearrangeTable = function (measure){
                var tempArrangeTable = $scope.filterTableBody;

                tempArrangeTable.sort(function(a, b){
                    if (a[measure][0].label > b[measure][0].label)
                        return -1;
                    if (a[measure][0].label < b[measure][0].label)
                        return 1;
                    return 0;
                })
                
                // arrange measure status
                if ($scope.currentSelectedArrangeMeasure.measure == measure){
                    if ($scope.currentSelectedArrangeMeasure.status == "up"){
                        $scope.currentSelectedArrangeMeasure.status = "down"
                        tempArrangeTable.reverse();
                    }else {
                        $scope.currentSelectedArrangeMeasure.status = "up"
                    }
                }else{
                    $scope.currentSelectedArrangeMeasure = {measure : measure, status : "up"}
                }
                
                $scope.filterTableBody = tempArrangeTable;
                setCurrentTableBody();

            }
            
            // showArrow
            $scope.showArrow = function (measure, status){

                return $scope.currentSelectedArrangeMeasure.measure == measure &&  $scope.currentSelectedArrangeMeasure.status == status;
            }
                
            // firstDim
            $scope.firstDim = function (index){
                if (index == 0)
                    return "TOTAL"
            }

            // getTotal
            $scope.getTotal = function(measure, compareData_Flag) {
                var ans;
                switch(measure){
                    case "fill_rate":
                        ans = sum("demand_impressions", compareData_Flag) / sum("supply_impressions", compareData_Flag) * 100
                        break;
                    case "demand_fill_rate":
                    case "margin":
                    case "demand_rpm":
                    case "bid_cpm":
                        ans = avg(measure, compareData_Flag);
                        break;
                    case "supply_impressions":
                    case "profit":
                    case "spent":
                    case "revenue":

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
                        ans = sum(measure, compareData_Flag);
                        break;
                    default:
                        ans = "---";
                }
                if (isNaN(ans))
                    ans = null;

                return ans


            }

            // formantCellData
            $scope.formantCellData = function(data, measure){

                return textManipulation_service.wiseTextFormant(measure, data );

            }

            // formantPKMeasures
            $scope.formantPKMeasures = function(str){
                return textManipulation_service.splitLongString(str, 20);

            }

            // onClickCompare
            $scope.onClickCompare = function(){
                $scope.onClickCompareCallBack();
            }

            // =======
            // $watch:
            // =======
            
            // updateTable var
            $scope.$watch("updateTable", function(newVal, oldVal){

                if(newVal < oldVal){
                    $scope.compareSwitchValue = false;
                    $scope.showCompareSwitchLoader = false;
                }

                if( $scope.tableData != null){
                    setSelectedMeasures();

                    initWiseTable();
                    setFilterTableBody();
                    setPagesOptions();

                    setCurrentTableBody();

                    setTableLocationText()
                }else {
                    cleanTable();
                }
                
            });

            // fullSwitchValue var
            $scope.$watch('fullSwitchValue', setSelectedMeasures);

            // fullSwitchValue var
            $scope.$watch('selectedPage', function(){
                setCurrentTableBody();
                setTableLocationText();
            });

            // fullSwitchValue var
            $scope.$watch('selectedNumOfRows',  function(){
                setPagesOptions();
                setCurrentTableBody();
                setTableLocationText()
            });


        }// close controller 
    }

})