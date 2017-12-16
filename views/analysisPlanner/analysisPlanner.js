angular.module('myApp')
.controller('analysisPlannerController', function($scope, serverAPI_service){

    
    initCharts();

    function initCharts(){

        Highcharts.chart('container', {

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy',
                backgroundColor:"#333333"
            },
            exporting: { enabled: false },

            title: {
                text: ''
            },

            xAxis: {
                gridLineWidth: 1,
                labels: {
                    style: {
                        color: 'white',
                        font-family : "proxima-nova"
                        font-weight : 400,
                    }
                },
            },


            yAxis: {
                startOnTick: false,
                endOnTick: false,
                labels: {
                    style: {
                        color: 'white',
                        font-family : "proxima-nova";
                        font-weight : 400;
                    }
                },
            },

            series: [{
                data: [
                    { x : 9, y : 81, z: "20px"},
                    
                ],
                marker: {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                data: [
                    { x : 42, y : 38, z: "64px"},
                ],
                marker: {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                data: [
                    { x : 20, y : 20, z: "120px"},

                ],
                marker: {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }]

        });
    }



})