
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function (stream) {
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });

//const ut = new SpeechSynthesisUtterance('No warning should arise');
//speechSynthesis.speak(ut);
//Tabitha says hello
//Make Character selection


if (annyang) {
    // These are the voice commands in quotes followed by the function
    var commands = {
        //'Select *ColType': function (ColType) { getSelectionValue(ColType);},
        //'Show *column': function (column) { var ColType = localStorage.getItem("Column");; selectColumn(column, ColType); responsiveVoice.speak('Showing data for ' + column); },
        'start over': function () { startover(); responsiveVoice.speak('starting over'); },
        'Filter by *ColType': function (ColType) { getColumnName(ColType); },
        'Value *columnName': function (column) { var ColType = localStorage.getItem("Column"); filterByColumn(ColType, column); responsiveVoice.speak('Showing data for ' + column); }

        //'calculate :quarter stats': {'regexp': /^Filter by (January|April|July|October) ColType$/, 'callback': calculateFunction}
    };
    // Add commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start();

}
else if (!annyang) {
    console.log("Speech Recognition is not supported");
}

function getSelectionValue(ColType) {
    localStorage.setItem("Column", ColType);
    responsiveVoice.speak('Choose any value to select ' + ColType);
}

function getColumnName(ColType) {
    localStorage.setItem("Column", ColType);
    responsiveVoice.speak('Choose any value to filter ' + ColType);
}

function sentenceCase(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function showActiveSheet() {
    var worksheet1;

    worksheet1 = viz.getWorkbook().getActiveSheet().getWorksheets();
    for (var i = 0; i < worksheet1.length; i++) {
        sheet = worksheet1[i];
        var sheetName = sheet.getName();
        alert(sheetName);
    }
}

function convertColumnsObject(sheetDataObj) {
    var col_obj = sheetDataObj.getColumns();
    var col_array = new Array();
    var col_type = new Array();
    for (var k = 0; k < col_obj.length; k++) {
        col_array[k] = col_obj[k].getFieldName();
        // col_type[k] = col_obj[k].getDataType();
    }
    //console.log(col_array);
    return col_array;
}


function selectColumn(column, ColType) {
    getFilters();
    var colArr = [];
    var _colType;
    for (var i = 0; i < worksheetArray.length; i++) {
        sheet = worksheetArray[i];


        if (sheet.getSheetType() === 'worksheet' && sheet.getName() === $("#menu").val()) {
            var sheetName = sheet.getName();
            // console.log(sheetName);
            sheet.getUnderlyingDataAsync(options).then(function (t) {
                colArr = convertColumnsObjectToArrayOfNames(t);
            });
        }

    }
    for (var j = 0; j < colArr.length; j++) {
        if (_.contains(ColType, colArr[j])) {
            _colType = colArr[j];
        }
        alert(_colType);
        alert(colArr[j]);

    }
    _colType = (sentenceCase(ColType));
    // alert(column, ColType);
    workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
}


function filterByColumn(ColType, column) {
    //getFilters();
    var _colType = sentenceCase(ColType.replace(/[_\s]/g, ''));
    var _column = sentenceCase(column.replace(/[_\s]/g, ''));

    var colNames = [];
    colNames = localStorage.getItem("Fields");

    var str_array = colNames.split('","');
   
    for (let index = 0; index < str_array.length; index++) {
        var d = str_array[index].replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
        //d = d.replace(/[\[\]"]+/g, "");
        if (d === _colType.toLowerCase()) {
            _colType = str_array[index].replace(/[\[\]"]+/g, "");
            break;
        }
        else if (_.contains(" ", _colType)) {
            if (d.contains(_colType.toLowerCase)) {
                _colType = str_array[index].replace(/[\[\]"]+/g, "");
                break;
            }
        }
    }

    var colData = [];
    colData = localStorage.getItem("FilterData");
    var data_array = colData.split('","');
    
   // data_array = JSON.parse(data_array);
    for (let index = 0; index < data_array.length; index++) {
       // for (var innerValue = 0; innerValue < length; innerValue++) {

       // console.log(data_array);
       var sd = data_array[index].replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
      
        if (sd === _column.toLowerCase()) {
            _column = data_array[index].replace(/[\[\]"]+/g, "");
                break;
            }
            else if (_.contains(" ", _column)) {
                if (sd.contains(_column.toLowerCase)) {
                    _column = data_array[index].replace(/[\[\]"]+/g, "");
                    break;
                }
            }
        //}
    }
    //workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("CONTAINS(" + _colType + ")", "CONTAINS(" + column + ")", tableau.FilterUpdateType.REPLACE);
    //workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("CONTAINS(" + _colType + ")", "CONTAINS(" + column + ")", tableau.FilterUpdateType.REPLACE);
    //workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("CONTAINS(" + _colType + ")", "CONTAINS(" + column + ")", tableau.FilterUpdateType.REPLACE);
    //workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("CONTAINS(" + _colType + ")", "CONTAINS(" + column + ")", tableau.FilterUpdateType.REPLACE);

    workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync(_colType, _column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync(_colType, _column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync(_colType, _column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync(_colType, _column, tableau.FilterUpdateType.REPLACE);
}

//Start Viz Over
function startover() {

    viz.revertAllAsync();
}


function onMarksSelection(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks);
}

function getFilters() {
    var liList = $('#filterOptions li');
    console.log(liList);
    var f_arr = [];
    $(liList).each(function () {
        var text = $(this).text();
        f_arr.push(text);
    });

   // localStorage.setItem("Fields", JSON.stringify(f_arr).replace(/[\[\]"]+/g, ""));
    console.log(JSON.stringify(f_arr).replace(/[\[\]"]+/g, ""));
}

//function reportSelectedMarks(marks) {
//    var html = [];
//    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
//        var pairs = marks[markIndex].getPairs();
//        html.push("<b>Mark " + markIndex + ":</b><ul>");
//        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
//            var pair = pairs[pairIndex];
//            html.push("<li><b>fieldName:</b> " + pair.fieldName);
//            html.push("<br/><b>formattedValue:</b> " + pair.formattedValue + "</li>");
//        }
//        html.push("</ul>");
//    }

//    var dialog = $("#dialog");
//    dialog.html(html.join(""));
//    dialog.dialog("open");
//}

function reportSelectedMarks(marks) {
    var html = "";

    for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        html += "<b>Mark " + markIndex + ":</b><ul>";

        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
            var pair = pairs[pairIndex];
            html += "<li><b>Field Name:</b> " + pair.fieldName;
            html += "<br/><b>Value:</b> " + pair.formattedValue + "</li>";

            // var result = pair.fieldName.match("");
            if (pair.fieldName.match("SUM*")) {

                var _name = pair.fieldName.replace("SUM", "");
                responsiveVoice.speak("The sum of " + _name + " is " + pair.formattedValue);

            }
            else if (pair.fieldName.match("AVG*")) {

                var _data = pair.fieldName.replace("AVG", "");
                var val = pair.formattedValue.replace("AVG", "");
                responsiveVoice.speak("average " + _data + " is " + val);
            }
            else if (pair.fieldName.match("AGG*")) {

                var _d = pair.fieldName.replace("AGG", "");
                responsiveVoice.speak("The aggregate of  " + _d + " is " + pair.formattedValue);
            }
            //else if (pair.fieldName.match("WEEK*")) {

            //    var _week = pair.fieldName.replace("DATE CLOSED", "");
            //    responsiveVoice.speak("For week ending  " + _d + "revenue is " + pair.formattedValue);
            //}

        }

        html += "</ul>";
    }

    var infoDiv = document.getElementById('markDetails');
    infoDiv.innerHTML = html;


}


