navigator.mediaDevices.getUserMedia({ audio: true, video: false })
.then(function(stream) {
//   var video = document.querySelector('video');
//   // Older browsers may not have srcObject
//   if ("srcObject" in video) {
//     video.srcObject = stream;
//   } else {
//     // Avoid using this in new browsers, as it is going away.
//     video.src = window.URL.createObjectURL(stream);
//   }
//   video.onloadedmetadata = function(e) {
//     video.play();
//   };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

if (annyang) {
    // These are the voice commands in quotes followed by the function
    var commands = {
      'Select :region Region': function (region) { selectRegion(region); responsiveVoice.speak('selecting ' + region); },
      'Select :state State': function (state) { selectState(state); responsiveVoice.speak('selecting  ' + state); },
      'Filter by year :year': function (year) { filterByYear(year); responsiveVoice.speak('Showing data for ' + year); },
      'Filter by :state state': function (state) { filterByState(state); responsiveVoice.speak('Showing data for ' + state); },
      'Filter by :region region': function (region) { filterByRegion(region); responsiveVoice.speak('Showing data for ' + region); },

      //attr - maximum, minimum, highest, lowest, least, most, total
      '(Show) :attr :sales (by) :state state': function (attr, prop, state) { salesData(attr, prop, state, null, null); responsiveVoice.speak('Showing data'); },
      //attr - maximum, minimum, highest, lowest, least, most, total
      '(Show) :attr :sales by :region region': function (attr, prop, region) { salesData(attr, prop, null, region, null); responsiveVoice.speak('Showing data'); },
      //attr - maximum, minimum, highest, lowest, least, most, total
      '(Show) :attr :sales by :region region in (year) :year': function (attr, prop, region, year) { salesData(attr, prop, null, region, year); responsiveVoice.speak('Showing data'); },
      //attr - maximum, minimum, highest, lowest, least, most, total
      '(Show) :attr :sales by :state state in (year) :year': function (attr, prop, state, year) { salesData(attr, prop, state, null, year); responsiveVoice.speak('Showing data'); },

        //attr - maximum, minimum, highest, lowest, least, most, total
        '(What is the) :attr :sales (by) :state state': function (attr, prop, state) { salesData(attr, prop, state, null, null); responsiveVoice.speak('Showing data'); },
        //attr - maximum, minimum, highest, lowest, least, most, total
        '(What is the) :attr :sales by :region region': function (attr, prop, region) { salesData(attr, prop, null, region, null); responsiveVoice.speak('Showing data'); },
        //attr - maximum, minimum, highest, lowest, least, most, total
        '(What is the) :attr :sales by :region region in (year) :year': function (attr, prop, region, year) { salesData(attr, prop, null, region, year); responsiveVoice.speak('Showing data'); },
        //attr - maximum, minimum, highest, lowest, least, most, total
        '(What is the) :attr :sales by :state state in (year) :year': function (attr, prop, state, year) { salesData(attr, prop, state, null, year); responsiveVoice.speak('Showing data'); },
      //attr - maximum, minimum, highest, lowest, least, most   prop - region, state,year
      //    'Which :prop has :attr sales?': function (attr, prop, region) { salesData(attr, prop, null, null, null); responsiveVoice.speak('Showing data '); },
      //attr - maximum, minimum, highest, lowest, least, most   prop - region, state
      //    'Which :prop has :attr sales in year :year?': function (attr, prop, region) { salesData(attr, prop, null, null, year); responsiveVoice.speak('Showing data '); },

      'Show Worksheets': function () { querySheets(); responsiveVoice.speak(text); },
      'start over': function () { startover(); responsiveVoice.speak('starting over'); }
    };

    // Add commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start();
  }
  else if (!annyang) {
    console.log("Speech Recognition is not supported");
  }