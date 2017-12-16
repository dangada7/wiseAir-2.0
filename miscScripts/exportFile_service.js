angular.module("myApp")
.service("exportFile_service", function(){
    
    // convertArrayOfObjectsToCSV
    function convertArrayOfObjectsToCSV(data, keys, titles) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = data.columnDelimiter || ',';
        lineDelimiter = data.lineDelimiter || '\n';

//        keys = Object.keys(data[0]).filter(function(item){
//            return item != "$$hashKey" && item != "name"
//        });

        result = '';
        // result += keys.map(function(item){return item.replace(/_/g," ").toUpperCase()}).join(columnDelimiter);
        result += keys.map(function(item){return titles[item]}).join(columnDelimiter);
        // result += titles.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                
                if ( key == "$$hashKey")
                    return;

                if (ctr > 0) result += columnDelimiter;
                
                if (typeof item[key] === 'object')
                    result += item[key][0].label;
                else 
                    result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    // downloadCSV
    this.downloadCSV = function(data, keys, filename, titles) {
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV(data, keys, titles);
        if (csv == null) return;

        filename = filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }


})