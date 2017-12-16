angular.module("myApp")
.directive("wiseSelect", function(){
    return {
        templateUrl : "/directives/wiseSelectDirective/wiseSelectDirective.html",
        scope : {
            type          : "@",
            options       : '=',
            selectedData  : "=",
            width         : "@",
            placeholder   : "@",
            disabledInput : "=",
            lazyLoad      : "=",
            showFilterDropDown   : "=",
            disableDimension : "&",
        },
        controller : function($scope, textManipulation_service) {
            $scope.input = {};
            $scope.t = {};

            $scope.isExpanded = {val :false};

            // getPlaceholder 
            $scope.getTitle = function(){


                 if($scope.checkType(['multiple_dashboard'])){

                    if(!$scope.selectedData || $scope.selectedData.length == 0 )
                        return $scope.placeholder + " - Any";

                    if ($scope.selectedData.length == $scope.options.length)
                        return $scope.placeholder + " - Any";
                    if ($scope.selectedData.length == 1)
                        return $scope.placeholder + " - " + $scope.selectedData[0].label;


                    return $scope.placeholder + " - " +  $scope.selectedData.length + " Selected";
                }


                if($scope.checkType(['regular', "sections"]) && $scope.selectedData){
                    return $scope.selectedData.label;
                }

                return $scope.placeholder

            }

            // getSecondLinePlaceholder
            $scope.getSecondTitle = function(){

                if($scope.checkType(["regular_title"]))
                    return $scope.selectedData.label

                if(!$scope.selectedData ||  $scope.selectedData == "")
                    return "Any";

                if ($scope.selectedData.length == $scope.options.length)
                    return "Any";
                if ($scope.selectedData.length == 1)
                    return $scope.selectedData[0].label;

                return $scope.selectedData.length + " Selected";
            }

            // divHover
            $scope.divHover = function(){

                $scope.isHover = true;
            }
            
            // divLeave
            $scope.divLeave = function(){
                 $scope.isHover = false;
                 if(!$scope.isFocus){
                     $scope.input = {};
                 }
            }
           
//            // inputFocus
//            $scope.inputFocus = function(){
//
//                $scope.isFocus = true;
//            }
//
//            // inputFocus
//            $scope.inputBlur = function(){
//                $scope.isFocus = false;
//                if(!$scope.isHover){
//                    $scope.input = {};
//                }
//            }

            // removeSelectedOption
            $scope.removeSelectedOption = function(option){
                var index = $scope.selectedData.indexOf(option);
                if (index > -1) {
                    $scope.selectedData.splice(index, 1);
                }
            }

            // addSelectedOption
            $scope.selectOption = function(option){ 

                if($scope.checkType(['multiple','multiple_autocomplete', 'multiple_dashboard'])){
                    var index = $scope.selectedData.indexOf(option)
                    if (index > -1)
                        $scope.selectedData.splice(index, 1);
                    else
                        $scope.selectedData.push(option)
                }else{
                    
                    if($scope.checkType(['sections']) && $scope.disableDimension({att : option.label}))
                        return;

                    $scope.isExpanded = {val : false};
                    $scope.selectedData = option;
                }
            }

            $scope.checkSectionRowDisable = function(option){
                return $scope.checkType(['sections']) && $scope.disableDimension({att : option.label});
            }

            // selectAll
            $scope.selectAll = function(){


                // no input
                if (!$scope.input.val){

                    if($scope.lazyLoad){
                        return;
                    }

                    if ($scope.selectedData.length == $scope.options.length)
                        $scope.selectedData = [];
                    else
                        $scope.selectedData = $scope.options.slice();

                // input != null
                }else{
                    var filtersSelectedData = $scope.selectedData.filter(function(item){ return item.label.toLowerCase().includes($scope.input.val.toLowerCase())})
                    var filtersOptions = $scope.options.filter(function(item){ return item.label.toLowerCase().includes($scope.input.val.toLowerCase())})

                    // remove all selected options
                    if(filtersSelectedData.length == filtersOptions.length){
                        filtersOptions.forEach(function(item){
                            $scope.removeSelectedOption(item);
                        })
                    // add all selected options
                    }else{
                         filtersOptions.forEach(function(item){
                            if ($scope.selectedData.indexOf(item) < 0)
                                $scope.selectedData.push(item)
                         })

                    }
                }

            }

            // disableDimensionWrapper
            $scope.disableDimensionWrapper = function(label){
                
                $scope.disableDimension(label);
            }

            // type
            $scope.checkType = function(strArr){

                return strArr.indexOf( $scope.type) > -1;
            }

            // getSelectedData
            $scope.getSelectedData = function(){

                if(!($scope.selectedData instanceof Array))
                    return [];

                return $scope.selectedData.filter(function(item){

                    return $scope.input.val==null || item.label.toLowerCase().includes($scope.input.val.toLowerCase())
                });


            }

            // notify row formant
            $scope.formantRow = function(str){
                return str;
//                return textManipulation_service.splitLongString(str, 23);

            }

            // showScroller
            $scope.showScroller = function(){

                if($scope.checkType('sections'))
                    return true;
                if(!$scope.options)
                    return false;
                return $scope.options.length > 6;
            }
//
//            // watch blurCounter
//            $scope.$watch("blurCounter", function(){
//                console.log("blurCounter")
//                $scope.clickSelect = false;
//            })
        }

    }// close object
});