var sheets = ["maze-1_6x5x2x5x0.png",
              "maze-2_6x5x6x1x2.png", 
              "letters_6x5x1x1x1.png", 
              "money1_6x5x6x5x3.png",
              "numbers1_6x5x1x1x1.png",
              "shapes_5x5x3x3x0.png"];

var bugBotGraphics = [  
      'preload!img/bug1body.png',  
      'preload!img/control_backward.png',  
      'preload!img/control_clear.png',  
      'preload!img/control_go.png',  
      'preload!img/control_left.png',  
      'preload!img/control_pause.png',  
      'preload!img/control_right.png',  
      'preload!img/control_upward.png'
    ];

var activity = {
};


Modernizr.load(
  {
    load: processSheetsForPreLoad(sheets).concat(bugBotGraphics),
    load: [
      'js/class_bugbot.js',  
      'js/class_sheet.js'  
    ],
    complete : function () {
      activity.sheets.availableSheets = sheets;
      determineAndSetScaleFactor();
      activity.sheets.init();
      activity.bugbot.init();
      $( "#loader").hide();
      $( "#container").fadeIn(1000);
    }
  }
);









