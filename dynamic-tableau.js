
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function (stream) {
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });

//Tabitha says hello
responsiveVoice.speak("Hi. I am your Tableau Assistant. How may I help you?", "US English Female");
//Make Character selection


if (annyang) {
    // These are the voice commands in quotes followed by the function
    var commands = {
        'Select *column *ColType': function (column, ColType) { selectColumn(column, ColType); responsiveVoice.speak('selecting ' + column); },
        // 'Filter by :ColType *column': function (ColType,column) { alert(column); filterByColumn(ColType,column); responsiveVoice.speak('Showing data for ' + column); },
        'start over': function () { startover(); responsiveVoice.speak('starting over'); },
        'Filter by *ColType': function (ColType) { getColumnName(ColType) },
        'Value *columnName': function (column) { var ColType = localStorage.getItem("Column"); filterByColumn(ColType, column); responsiveVoice.speak('Showing data for ' + column); },
       // '(show me the) :measure *ColType':  function (measure, ColType) { calculations(measure, ColType) } 

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

function selectColumn(column, ColType) {
    var _colType = (sentenceCase(ColType));
    workbook.getActiveSheet().getWorksheets()[0].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[1].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[2].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[3].selectMarksAsync(_colType, column, tableau.SelectionUpdateType.REPLACE);
}


function filterByColumn(ColType, column) {
    var _colType = (sentenceCase(ColType));
    var _column = (sentenceCase(column));
    //alert(_colType);
    //alert(column);.
    var colNames = [];
    colNames = localStorage.getItem("Fields");
    var str_array = colNames.split(',');
    for (let index = 0; index < str_array.length; index++) {
        if (str_array[index].toLowerCase() === _colType.toLowerCase()) {
            _colType = str_array[index];
            break;
        }
    }

    var colData = [];
    colData = localStorage.getItem("FieldData");
    var data_array = colData.split(',');
    for (let index = 0; index < data_array.length; index++) {
        if (data_array[index].toLowerCase() === column.toLowerCase()) {
            column = data_array[index];
            break;
        }
    }
    // workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);
    // workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);
    // workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);
    // workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync("CONTAINS("+ColType+")", "CONTAINS("+column+")", tableau.FilterUpdateType.REPLACE);

    workbook.getActiveSheet().getWorksheets()[0].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[1].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[2].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
    workbook.getActiveSheet().getWorksheets()[3].applyFilterAsync(_colType, column, tableau.FilterUpdateType.REPLACE);
}

function queryDashboard() {
    workbook.activateSheetAsync("Geographical Sales Performance v3")
        .then(function (dashboard) {
            var worksheets = dashboard.getWorksheets();
            var text = getSheetsAlertText(worksheets);
            text = "Worksheets in the dashboard:\n" + text;
            alert(text);
            return text;
        });
}

function querySheets() {
    var sheets = workbook.getPublishedSheetsInfo().get("Sales Map");
    var text = workbook.getSheetsAlertText(sheets);
    text = "Sheets in the workbook:\n" + text;
    alert(text);
    return text;
}
//Start Viz Over
function startover() {

    viz.revertAllAsync();
}

function getData(measure, ColType) {
    var max, total = 0;
    console.log(measure, ColType);
    var newData = niceData.filter(function (salesData) {
        // console.log(salesData);
        return (salesData.Region == region && parseInt(salesData["Order Date"].toString()).toString() == year);
      });
      // console.log(newData);
      max = parseFloat(Math.min.apply(Math, newData.map(function (o) { return o.Sales; })));
      console.log(max);
    // for (var i = 0; i < vizData.length; i++) {
    //     console.log(Math.max.apply(Math, vizData.map(function (o) { return o.y; })));

    //     if (!max || parseInt(vizData[i][prop]) > parseInt(max[prop]))
    //         max = vizData[i];
    //     if (vizData[i]["State"] == "California")
    //         total += parseInt(vizData[i][prop]);
    // }
    return total;
}
