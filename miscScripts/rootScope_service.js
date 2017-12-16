angular.module("myApp")
.service("rootScope_service", function($timeout){
    
    var savedReportData = null;
    var alertData = {show : false, text : "", status : 0, title : ""}
    var showPageLoader = {val : false}
    var updateNotification = {val : 0}
    var userName = {val : ""};
    
    // var pageLoaderCounter = {val :0};

    // -----------
    // Alert Data:
    // -----------
    this.setAlertData = function(title, text, status, okFunc){
        alertData.show   = true;
        alertData.text   = text;
        alertData.status = status;
        alertData.title  = title;
        alertData.okFunc = okFunc;
        alertData.focus = true;
        $timeout(function(){
            document.getElementById("okButton").focus();
        }, 100)
    }
    this.getAlertData = function(){

        return alertData;
    }

    // ------------
    // PAGE LOADER:
    // ------------
    this.setPageLoader = function(status){

        showPageLoader.val   = status;
    }
    this.getPageLoader = function(){

        return showPageLoader;
    }

    // this.getPageLoaderCounter = function(){

    //     return pageLoaderCounter;
    // }

    // this.updatePageLoaderCounter = function(){

    //     return pageLoaderCounter.val++;
    // }

    // -------------
    // access token:
    // -------------
    this.setAccessToken = function(accessToken){

        localStorage.setItem('accessToken', accessToken);
    }
    this.getAccessToken = function(){

        return localStorage.getItem('accessToken');
    }

    // ----------
    // User Data:
    // ----------
    this.setUserData = function(userData){

        if(userData == null){
            localStorage.setItem('userData', JSON.stringify(userData));
            return;
        }

        if(userData.kpi_order == null)
            userData.kpi_order = getDefaultKpiOrder();

        userName.val = userData.username

        localStorage.setItem('userData', JSON.stringify(userData));
    }
    this.getUserData = function(){

        return JSON.parse(localStorage.getItem('userData'));
    }

    this.getUserName = function(){
        var userData = JSON.parse(localStorage.getItem('userData'));
        if(userData)
            userName.val = userData.username

        return userName;
    }

    this.updateKpiOrder = function(newKpiOrder){
         var userData = JSON.parse(localStorage.getItem('userData'));
         userData.kpi_order = newKpiOrder
         localStorage.setItem('userData', JSON.stringify(userData));
    }

    // -------------------------
    // Saved Report Filter Data:
    // -------------------------
    this.setSavedReportData = function (savedReportDataArg, runReport){        
        savedReportData = savedReportDataArg;
        if( savedReportDataArg != null )
            savedReportData.runReport = runReport;
    }
    this.getSavedReportData = function (){

        return savedReportData;
    }

    // ---------------
    // navigation bar:
    // ---------------
    this.updateNotification = function (){

        updateNotification.val++;
    }
    this.getUpdateNotificationVar = function (){

        return updateNotification;
    }

    // ----------------
    // TABLE AND CHART:
    // ----------------

    // getTableFullMeasures
    this.getTableFullMeasures = function(type){
        if(type == "custom_supply")
            return [ "supply_impressions",
                    "demand_impressions",
                    "revenue",
                    "spent",
                    "profit",
                    "margin",
                    "fill_rate",
                    "bid_cpm",
                     "pauses",
                     "resumes",
                     "skips",
                     "clicks",
                    "third_quartiles",
                     "full_screens",
                     "mid_points",
                     "first_quartiles",
                     "mutes",
                     "unmutes"];

        else if(type == "custom_demand"){
             return ["demand_impressions",
                     "demand_fill_rate",
                     "revenue",
                     "requests"]
                    //                       "demand_rpm",

        }
    }

    // getTableLiteMeasures
    this.getTableLiteMeasures = function (type){
       if(type == "custom_supply")
           return [ "supply_impressions", "demand_impressions", "fill_rate", "profit", "margin", "revenue"];
       else if(type == "custom_demand"){
           return ["demand_impressions", "demand_fill_rate", "revenue", "requests"] // "demand_rpm"
       }
    }

    // getTableTitles
    this.getTableTitles = function (type){

        var ans;

        if(type == "custom_supply")
           ans= {   
                    bid_cpm : "Bid",
                    demand_impressions : "Demand Impressions",
                    fill_rate : "Fill Rate",
                    margin : "Margin",
                    profit: "Profit",
                    revenue: "Revenue",
                    supply_impressions : "Supply Impressions",
                    spent : "spent",
                     demand_platform_name : "Demand Platform Name",
                    unmutes : "Unmutes",
                    mutes : "Mutes",
                    clicks: "Clicks",
                    skips : "Skips",
                    resumes : "Resumes" ,
                    pauses : "Pauses",
                    full_screens : "100% VTR",
                    third_quartiles : "75% VTR",
                    mid_points : "50% VTR",
                    first_quartiles: "25% VTR"}
        else if(type == "custom_demand"){
               ans = {
                    demand_impressions  : "Demand Impressions",
                    demand_fill_rate    : "Fill Rate",
                    revenue             : "Revenue",
                    demand_rpm          : "RPM",
                    requests            : "Requests",
               }
        }
        ans.date                    = "Date";
        ans.supply_source_name      = "Supply Source";
        ans.domain                  = "Domains";
        ans.supply_platform_name    = "Supply Platform";
        ans.supply_partner_name     = "Supply Partner";
        ans.campaign_name           = "Campaign";
        ans.demand_source_name      = "Demand Source";
        ans.demand_platform_name    = "Demand Platform";
        ans.demand_partner_name     = "Demand Partner";
        ans.creative_name           = "Creative";
        ans.ad_exchange             = "Exchange";

        return ans;
    }

    // getDimensionsOptions
    this.getDimensionsOptions= function (){

        return [
            {title:"", options : [{ label : "None", name : "none"}]},
            {title: "Supply", options : [   { label : "Supply Source",    name: "supply_sources"},
                                            { label : "Supply Platform",  name: "supply_platforms"},
                                            { label : "Supply Partner",   name: "supply_partners"},
                                            { label : "Campaign",         name: "campaigns"},]},

            {title: "Demand", options : [   { label : "Demand Source",    name: "demand_sources"},
                                            { label : "Demand Platform",  name: "demand_platforms"},
                                            { label : "Demand Partner",   name: "demand_partners"},
                                            ]},
            {title: "Extra", options : [   { label : "Domain", name : "domains"},
                                            { label : "Device Make",    name: "device_make"},
                                            { label : "Operation System",  name: "os"},
                                            { label : "Browser",   name: "browser"},
                                            { label : "Player Size",   name: "player_size"},
                                            { label : "Country",   name: "country"},
                                            { label : "Placement",   name: "placement"},
                                            { label : "Exchange",   name: "exchange"},
                                            ]},
            ]
    }

    // --------
    // FILTERS:
    // --------

    // getDateOptions
    this.getDateOptions= function (){
        return [{label:"Today",       compareLabel:"Yesterday", name:"today", compareName: "yesterday"},
                {label:"Yesterday",   compareLabel:"Day Before", name:"yesterday", compareName: "day_before"},
                {label:"This Week",   compareLabel:"Last Week", name : "this_week", compareName:"last_week"},
                {label:"Last Week",   compareLabel:"Week Before", name : "last_week", compareName:"week_before"},
                {label:"This Month",  compareLabel:"Last Month", name : "this_month", compareName:"last_month"},
                {label:"Last Month",  compareLabel:"Month Before", name : "last_month", compareName:"month_before"},
                {label:"Custom",      compareLabel:"None"},];
    }

    // getDateDashboardOptions
    this.getDateDashboardOptions= function (){
        return [{label:"Today",       compareLabel:"Yesterday", name:"today", compareName: "yesterday"},
                {label:"Yesterday",   compareLabel:"Day Before", name:"yesterday", compareName: "day_before"},
                {label:"This Week",   compareLabel:"Last Week", name : "this_week", compareName:"last_week"},
                {label:"Last Week",   compareLabel:"Week Before", name : "last_week", compareName:"week_before"},
                {label:"This Month",  compareLabel:"Last Month", name : "this_month", compareName:"last_month"},
                {label:"Last Month",  compareLabel:"Month Before", name : "last_month", compareName:"month_before"},
                ];
    }

    // getTimezoneOptions
    this.getTimezoneOptions= function (){
        return [{label:"UTC", id:1},
                {label:"EST", id:2},]
    }
    
    // getTimeIntervalOptions
    this.getTimeIntervalOptions = function (){
        return [{id:1, label:"Overall"}, 
                {id:2, label:"Hour"},
                {id:3, label:"Day"},
                {id:4, label:"Week"},
                {id:4, label:"Month"},];
    }
    
//    // getSupplyPlatformsOptions
//    this.getSupplyPlatformsOptions = function (){
//        return [{id:1, label:"Beeswax"},
//                {id:2, label:"GetIntent"},
//                {id:3, label:"MediaMath"},
//                {id:4, label:"PocketMath"},
//                {id:5, label:"Turn"},
//                {id:6, label:"Unknown"},];
//    }

    // getSupplyPlatformsOptions
    this.getRunEveryOptions = function (){
        return [{id:1, label:"15 Minutes"}, 
                {id:2, label:"30 Minutes"},
                {id:3, label:"1 Hour"},
                {id:4, label:"2 Hours"},
                {id:5, label:"1 Day"},];
    }
//
//    // getDemandPlatformsOptions
//    this.getDemandPlatformsOptions = function (){
//        return [{id:1, label:"LKQD"},
//                {id:2, label:"SPOT X"},
//                {id:3, label:"Third Presence"},
//                {id:4, label:"Vidible"},];
//    }

    // getTypeOptions
    this.getTypeOptions = function(){

        return [{label : "banner"}, {label : "video"}];
    }

    // getEnvOptions
    this.getEnvOptions = function (){

        return [{label : "Desktop"}, {label : "Mobile App"}, {label : "In App"} ]
    }

    // getOsOptions
    this.getOsOptions = function (){

        return [{label : "Any"}, {label : "Windows"}, {label : "Linux"}, {label : "IOS"}, {label : "Android"}, {label : "Mac"}]
    }

    // getDeviceMakeOptions
    this.getDeviceMakeOptions = function(){

        return [{label : "Any"}, {label : "Apple"}, {label : "Samsung"} ];
    }

    // getDeviceMakeOptions
    this.getBrowserOptions = function(){

        return [{label : "Any"}, {label : "Chrome"}, {label : "Safari"}, {label : "IE"}, {label : "Firefox"} ];
    }

    // getDeviceMakeOptions
    this.getPlayerSizesOptions = function(){

        return [{label : "Any"}, {label : "Small"}, {label : "Medium"}, {label : "Large"}, {label : "Custom"} ];
    }


    // ==========
    // FUNCTIONS:
    // ==========

    // kpiDefaultOrder
    function getDefaultKpiOrder(){

        // "third_quartiles", "first_quartiles"
        return  ["margin", "revenue", "impressions", "fillrate", "cpm", "profit",
                 "clicks", "skips", "mid_points",  "completes", "requests", "ctr",
                 "pauses", "resumes", "fullscreens", "exit_fullscreens", "mutes", "unmutes"];

    }


})
