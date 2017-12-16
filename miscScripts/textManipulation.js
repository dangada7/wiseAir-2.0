angular.module("myApp")
.service("textManipulation_service", function(){

    // camelize
    this.camelize = function(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }


    // valueAndTextFormant
    this.wiseTextFormant = function (label, value){

        if(value == null || label == null)
            return "";

        var label = label.toLowerCase().replace(" ", "_");
        var ans;

        if(["table_title"].includes(label)){
//            var valueArr = value.replace(" ", "/n");
            return value;
        }

        if(["tablepk"].includes(label)){
            return value;
//            return splitString(value,24);
        }

        if(["supply_platform_name", "demand_partner_name", "external_id", "demand_partner_name", "os", "env", "rate", "demand_platform"].includes(label)){
            return value;
//            return splitString(value,14)
        }


        if (["fill_rate", "demand_fill_rate", "margin", "demand_rpm", "ctr"].includes(label)){
            return formantNumbers(value) + "%";
        }

        if (["profit", "spent", "revenue", "cpm", "bid_cpm"].includes(label)){
            return "$" + formantNumbers(Math.round(value*100)/100)
        }

        if (["supply_impressions", "demand_impressions", "pauses", "skips", "clicks",
             "third_quartiles", "full_screens", "mid_points", "first_quartiles", "unmutes", "resumes",
             "mutes", "requests", "impressions", "completes", "exit_full_screens"].includes(label)){
            return formantNumbers(value)
        }

        if (["dim1", "dim2", "dim3", "dim4", "type", "day_part_measures",
             "granularity", "timezone", "date"].includes(label)){
            return capitalize(value.replace(/_/g, " "));
        }

        if(["granularity_pk"].includes(label)){
            return moment(new Date(value)).format("YYYY-MM-DD:HH")  
        }

        if(["dateNotification"].includes(label)){
            return value.replace("T", " ");
        }


        if (["status"].includes(label)){
            return value ? "True" : "False";
        }

        if (["actions", "status"].includes(label)){
            return value
        }

        // manage 
        if(["supply_partner_name", "bid", "line_item_id", "campaign_name", "demand_platform_name", "shutdown_status", "tuner_status"].includes(label)){
            return value
        };
        
        // alert rule
        if(["conditions", "should_send_mail", "active", "freq", "period", "dimensions_name", "as", "entityname", "conditions", "should_send_mail"].includes(label)){
            return value
        };








        console.log(label,value);
        return value;

    }

    // splitLongString
    this.splitLongString = function(str, len){
        var l = str.length;
        var ans = "";
        var i ;
        for(i=0 ; (i+1)*len < l; i++){
            ans += str.substring(i*len,(i+1)*len) + " ";
        }

        ans += str.substring(i*len,l);

        return ans;
    }
    // ==========
    // functions:
    // ==========

    //splitString
    function splitString(str, length) {
        var words = str.split(" ");
        for (var j = 0; j < words.length; j++) {
            var l = words[j].length;
            if (l > length) {
                var result = [], i = 0;
                while (i < l) {
                    result.push(words[j].substr(i, length))
                    i += length;
                }
                words[j] = result.join(" ");
            }
        }
        return words.join(" ");
    }

    // formant numbers
    function formantNumbers(val){

        val = Math.round(val*100)/100

        if(val < 1000){
            return val.toString();
        }

        //  12345.13 => 12,345
        if (val < 1000000){
            return Math.floor(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // 1234567.8 => 1.23M
        return (val / 1000000).toFixed(2) + "M"

    }


    //capitalize
    function capitalize(str){
        return str.replace(/\b\w/g, l => l.toUpperCase())
    }




})