$( document ).ready(function() {
      activity.sheets.availableSheets = sheets;
      determineAndSetScaleFactor();
      activity.sheets.init();
      activity.bugbot.init();
      $( "#loader").hide();
      $( "#container").fadeIn(1000);
});
