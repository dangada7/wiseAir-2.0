

// todo change name to time_service

angular.module("myApp")
.service("currentTime_service", function(){

    // getTimeZoneOptions
    this.getTimeZoneOptions = function (){

        return [ {label:"UTC" , getTime : getUTCTime}, {label:"EST" , getTime : getESTTime}];
    }

    // getDateByTimeZone
    this.getCurrentDateByTimeZone = function(timezone){
        // TODO handel diff timezone
        return new Date;
    }

    this.getDateByCurrentTimeZone = function(dateId){

//            return moment(new Date(dateId)).format('YYYY-MM-DDTHH:mm:ss')

            t = new Date(dateId);
            return Date.UTC(t.getFullYear(), t.getMonth() ,t.getDate(), t.getHours(), t.getMinutes())

//        return new Date(dateId)

//            moment.tz.setDefault("UTC");
//            moment.locale('en');


    }

    // getStartAndEndDate
    this.getStartAndEndDate = function(date, timezone, compare){
        var date_end   = this.getCurrentDateByTimeZone(timezone)

        subtractTime = 0;

        if (compare){
            subtractTime = 1;
        }

        switch(date.selectedData.label.toLowerCase()) {

              case "today":
                    date_end.setDate(date_end.getDate() - subtractTime)

                    date_start = new Date(date_end);
                    date_start.setHours(0);
                    date_start.setMinutes(0);
                    date_start.setSeconds(0);

                    break;

              case "yesterday":
                    date_end.setDate(date_end.getDate() - subtractTime)
                    date_end.setHours(0);
                    date_end.setMinutes(0);
                    date_end.setSeconds(0);

                    date_start = new Date(date_end);
                    date_start.setDate(date_start.getDate() - 1)
                    break;

              case "this week":
                    // (Sunday to Current day of week)

                    date_end.setDate(date_end.getDate() - subtractTime*7)

                    date_start = new Date(date_end);
                    date_start.setDate(date_start.getDate() - date_start.getDay())
                    date_start.setHours(0);
                    date_start.setMinutes(0);
                    date_start.setSeconds(0);

                    break;

                case "last week":

                    date_end.setDate(date_end.getDate() - date_end.getDay())
                    date_end.setHours(0);
                    date_end.setMinutes(0);
                    date_end.setSeconds(0);
                    date_end.setDate(date_end.getDate() - subtractTime*7)

                    date_start = new Date(date_end);
                    date_start.setDate(date_start.getDate() - 7)
                    break;
              case "this month":
                    // (First of last month to current day of month)

                    date_end.setMonth(date_end.getMonth() - subtractTime)

                    date_start = new Date(date_end);
                    date_start.setDate(1); // set to the first day of the month
                    date_start.setHours(0);
                    date_start.setMinutes(0);
                    date_start.setSeconds(0);

                    break;

              case "last month":

                    date_end.setDate(1); // set to the first day of the month
                    date_end.setHours(0);
                    date_end.setMinutes(0);
                    date_end.setSeconds(0);
                    date_end.setMonth(date_end.getMonth() - subtractTime)

                    date_start = new Date(date_end);
                    date_start.setMonth(date_start.getMonth() - 1)

                    break;
              case "custom":
                    if (date.custom.firstClick < date.custom.secondClick){
                        date_start = date.custom.firstClick
                        date_end = date.custom.secondClick;
                    }else {
                        date_start = date.custom.secondClick
                        date_end = date.custom.firstClick;
                    }
                    break;
        } // close switch case

        return {date_start  : date_start, date_end    : date_end}
    }

    // ==========
    // Functions:
    // ==========
    
    // getUTCTime;
    function getUTCTime (){
//        var date = new Date();

        return moment(new Date()).tz('UTC').format('HH:mm:ss')
        
//        var hours = date.getUTCHours();
//        if ( hours < 10 ){
//            hours = "0" + hours;
//        }
//        var minutes = date.getUTCMinutes();
//        if ( minutes < 10 ){
//            minutes = "0" + minutes;
//        }
//        var seconds = date.getUTCSeconds();
//        if ( seconds < 10 ){
//            seconds = "0" + seconds;
//        }
//
//        return hours + ":" + minutes + ":" + seconds;
    }

    // getUTCTime;
    function getESTTime (){
        return moment(new Date()).tz('America/New_York').format('HH:mm:ss')

//        // est or edt
//        // TODO : check offset
//        var offsetHour = -5;
//
//        var hours = date.getUTCHours() + offsetHour % 24;
//        if ( hours < 10 ){
//            hours = "0" + hours;
//        }
//        var minutes = date.getUTCMinutes();
//        if ( minutes < 10 ){
//            minutes = "0" + minutes;
//        }
//        var seconds = date.getUTCSeconds();
//        if ( seconds < 10 ){
//            seconds = "0" + seconds;
//        }
//
//        return hours + ":" + minutes + ":" + seconds;
    }




});