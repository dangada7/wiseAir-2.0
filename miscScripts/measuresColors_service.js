angular.module("myApp")
.service("measuresColors_service", function(){

    // downloadCSV
    this.getMeasureColor = function(measure) {


        console.log(measure);

        var measure = measure.toLowerCase();

        switch(measure){

            case "margin":
                return "#3AFAFF"
            case "revenue":
                return "#45D881"
            case "impressions":
                return "#FFB900"
            case "fill rate":
                return "#ED7C23"
            case "cpm":
                return "#E95A4D"
            case "profit":
                return "#FF3F7C"
        }

    }


})