// wish chart directive
// on chartSeries change the chart will be recreate

angular.module("myApp").directive("wiseCustomDate", function(){
    return {
        templateUrl : "/directives/wiseCustomDateDirective/wiseCustomDateDirective.html",
        scope :{
            selectedDate : "=",
            clear : "=",
        },
        controller : function($scope){
            
            intWiseSelects()
            init();
    
            // init 
            function init(){
                                    
                $scope.monthNames = ["January", "February", "March", "April", "May", "June",
                                    "July", "August", "September", "October", "November", "December" ];

                $scope.tablesColTitle = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
                
                $scope.selectedDate = {firstClick : null, SecondClick: null, status : "notHover" };      
            
                var date = new Date();
                setCurrentDisplayData(date.getMonth(), date.getFullYear());                          
            }

            // setWiseSelects 
            function intWiseSelects(){
                $scope.hourOptions = {"AM" : [], "PM" : []};
                $scope.minuteOptions = [];
                $scope.timeTypeOptions = [{label : "AM"} , {label : "PM"}];
                
                var i;
                for(i=0; i < 12; i++){
                    if(i < 10 ){   
                        $scope.hourOptions["AM"].push({label : "0" + i, val : i});
                        $scope.hourOptions["PM"].push({label : "0" + i, val : i});
                    }else {
                        $scope.hourOptions["AM"].push({label : i , val: i});
                        $scope.hourOptions["PM"].push({label : i , val: i});

                    }
                }
                for(i=0; i < 12; i++){
                    if(i*5 < 10 )   
                        $scope.minuteOptions.push({label : "0" + (i*5), val : i*5});
                    else 
                        $scope.minuteOptions.push({label : i*5, val:i*5});
                }
            }

            // setCurrentDisplayData
            function setCurrentDisplayData(mm, yyyy) {
                
                var currentDisplayData = {
                    firstMonth : {  date : new Date(yyyy, mm-1 ),
                                    days : [], 
                                    selectedTime : {hour: $scope.hourOptions["AM"][0], minute : $scope.minuteOptions[0], timeType : $scope.timeTypeOptions[0]}},
                    secondMonth : { date : new Date(yyyy, mm ),
                                    days : [], 
                                    selectedTime : {hour: $scope.hourOptions["AM"][0], minute : $scope.minuteOptions[0], timeType : $scope.timeTypeOptions[0]}},
                };

                for (i in currentDisplayData){ 
                  
                    var lastDay = new Date(currentDisplayData[i].date.getFullYear(), currentDisplayData[i].date.getMonth() + 1, 0);
                    var firstDay = new Date(currentDisplayData[i].date.getFullYear(), currentDisplayData[i].date.getMonth(), 1)
                    
                    var j;
                    for (j = 0 ; j < firstDay.getDay(); j++){
                        currentDisplayData[i].days.push(null);
                    }

                    for(j = 1; j <= lastDay.getDate(); j++){
                        currentDisplayData[i].days.push(new Date(currentDisplayData[i].date.getFullYear(), currentDisplayData[i].date.getMonth() , j));
                    }
                }

                // 
                while (Math.floor(currentDisplayData.firstMonth.days.length-1 / 7) >  Math.floor(currentDisplayData.secondMonth.days.length-1 / 7)){
                    currentDisplayData.secondMonth.days.push(null);
                }
                while (Math.floor(currentDisplayData.firstMonth.days.length-1 / 7) <  Math.floor(currentDisplayData.secondMonth.days.length-1 / 7)){
                    currentDisplayData.firstMonth.days.push(null);
                }



                $scope.currentDisplayData = currentDisplayData;
            }
            
            // equalDate
            function equalDate(date1, date2){
                return  date1.getDate() == date2.getDate() && 
                        date1.getMonth() == date2.getMonth() && 
                        date1.getFullYear() == date2.getFullYear();
            }

            //setDateTime
            function setDateTime(date, timeObj){
                var hours = timeObj.hour.val;
                if (timeObj.timeType.label == "PM"){
                    hours += 12;
                }
                var minutes = timeObj.minute.val;
                
                date.setHours(hours);
                date.setMinutes(minutes)
            }

            // ================
            // $scope function:
            // ================

            // checkHour
            $scope.checkHour = function(){
                console.log("checkHour");
            }

            // clickDay
            $scope.clickDay = function(currentMonth, dayData){
                
                if(dayData == null)
                    return

                if($scope.selectedDate.firstClick == null ){
                    $scope.selectedDate.firstClick = new Date(dayData);
                    setDateTime($scope.selectedDate.firstClick,currentMonth.selectedTime);
                    $scope.selectedDate.status = 'hover'
                }
                else if($scope.selectedDate.status == 'hover'){
                    $scope.selectedDate.status = 'notHover'
                }
                else if($scope.selectedDate.status == 'notHover'){
                    $scope.selectedDate = {firstClick : null, secondClick : null, status : 'notHover'}
                }
            }

            // hoverDay
            $scope.hoverDay = function(currentMonth, dayData){
                if($scope.selectedDate.status == 'hover' && dayData!=null){
                    $scope.selectedDate.secondClick = new Date(dayData);
                    setDateTime(dayData, currentMonth.selectedTime);
                }
            }

            // getDayClass
            $scope.getDayClass = function(currentMonth, dayData){
                if ($scope.selectedDate.firstClick == null || $scope.selectedDate.secondClick == null || dayData==null)
                    return;
                
                var startDate, endDate;
                if ($scope.selectedDate.firstClick < $scope.selectedDate.secondClick){
                    startDate = $scope.selectedDate.firstClick;
                    endDate   = $scope.selectedDate.secondClick;
                }else{
                    endDate   = $scope.selectedDate.firstClick;
                    startDate = $scope.selectedDate.secondClick; 
                }

                if (equalDate(startDate, dayData))
                    return "selectedStart"
                else if (equalDate(endDate ,dayData))
                    return "selectedEnd"
                else if (startDate <  dayData && dayData < endDate)
                    return "selectedMiddle"
            }
            
            // getFinalDateLabel
            $scope.getFinalDateLabel = function(index){
              
                if($scope.selectedDate.firstClick == null || $scope.selectedDate.secondClick == null)
                    return "";

                var startDate, endDate;
                if ($scope.selectedDate.firstClick < $scope.selectedDate.secondClick){
                    startDate = $scope.selectedDate.firstClick;
                    endDate   = $scope.selectedDate.secondClick;
                }else{
                    endDate   = $scope.selectedDate.firstClick;
                    startDate = $scope.selectedDate.secondClick; 
                }

                var dateArr = [startDate, endDate];

                return  dateArr[index].getDate() + "/" + 
                        (parseInt(dateArr[index].getMonth())+1) + "/" +
                        dateArr[index].getFullYear();        
            }
            
            // getDropDownLabels
            $scope.getDropDownLabel = function(){
                if($scope.selectedDate.firstClick == null || $scope.selectedDate.secondClick == null)
                    return " Please Select A Date ";
                
                var startDate, endDate;
                if ($scope.selectedDate.firstClick < $scope.selectedDate.secondClick){
                    startDate = $scope.selectedDate.firstClick;
                    endDate   = $scope.selectedDate.secondClick;
                }else{
                    endDate   = $scope.selectedDate.firstClick;
                    startDate = $scope.selectedDate.secondClick; 
                }

                return  startDate.getDate() + "/" + 
                        (parseInt(startDate.getMonth())+1) + "/" +
                        startDate.getFullYear() + " " + 
                        $scope.currentDisplayData.firstMonth.selectedTime.hour.label + ":" + 
                        $scope.currentDisplayData.firstMonth.selectedTime.minute.label + "" + 
                        $scope.currentDisplayData.firstMonth.selectedTime.timeType.label + " - " + 
                        endDate.getDate() + "/" +
                        (parseInt(endDate.getMonth())+1) + "/" +
                        endDate.getFullYear() + " " + 
                        $scope.currentDisplayData.secondMonth.selectedTime.hour.label + ":" + 
                        $scope.currentDisplayData.secondMonth.selectedTime.minute.label + "" + 
                        $scope.currentDisplayData.secondMonth.selectedTime.timeType.label + "" ;
            }

            // nextMonth 
            $scope.nextMonth = function(){
                var mm   = $scope.currentDisplayData.secondMonth.date.getMonth();
                var yyyy = $scope.currentDisplayData.secondMonth.date.getFullYear();
                
                if (mm == 11) {
                    yyyy = yyyy + 1
                    mm = -1;
                }

                setCurrentDisplayData(mm +1 , yyyy);
            }
            // nextMonth 
            $scope.prevMonth = function(){
                var mm   = $scope.currentDisplayData.secondMonth.date.getMonth();
                var yyyy = $scope.currentDisplayData.secondMonth.date.getFullYear();
                
                setCurrentDisplayData(mm -1 , yyyy);
            }
            
            // futureDate
            $scope.futureDate = function(date){
                
                var tomorrow = new Date();
                tomorrow.setHours(0);
                tomorrow.setMinutes(0);
                tomorrow.setSeconds(0);
                tomorrow.setDate(tomorrow.getDate() + 1)
                return Date.parse(date) >= Date.parse(tomorrow);
            }


            // =======
            // $watch:
            // =======
            // currentDisplayData.firstMonth.selectedTime
            $scope.$watch("currentDisplayData.firstMonth.selectedTime", function(){
                if($scope.selectedDate.firstClick == null || $scope.selectedDate.secondClick == null)
                    return "";
                
                var startDate;
                if ($scope.selectedDate.firstClick < $scope.selectedDate.secondClick){
                    startDate = $scope.selectedDate.firstClick;
                }else{
                    startDate = $scope.selectedDate.secondClick; 
                }

                setDateTime(startDate, $scope.currentDisplayData.firstMonth.selectedTime)
            }, true);
            
            // currentDisplayData.secondMonth.selectedTime
            $scope.$watch("currentDisplayData.secondMonth.selectedTime", function(){
                if($scope.selectedDate.firstClick == null || $scope.selectedDate.secondClick == null)
                    return "";
                
                var endDate ;
                if ($scope.selectedDate.firstClick < $scope.selectedDate.secondClick){
                    endDate = $scope.selectedDate.secondClick;
                }else{
                    endDate = $scope.selectedDate.firstClick; 
                }

                setDateTime(endDate, $scope.currentDisplayData.secondMonth.selectedTime)

            }, true);

            $scope.$watch("clear",function(){
                init();
            }, true)


        }// close controller
    }

})