activity.sheets = (function() {
  this.availableSheets = []
  this.sheetName = "";
  this.width     = 0;
  this.height    = 0;
  this.startPosX = 0;
  this.startPosY = 0;
  this.startDirection = 0;
  this.currentSheet = 0;


  /***
     Generate Sheet Selector
  ***/
  this.showSheetSelector = function() {
	for (var i = 0; i < activity.sheets.availableSheets.length; i++) {
		$( '<img src="img/sheets/' + activity.sheets.availableSheets[i] + '"  data-id="' + i + '" class="sheetSelectorThumb thumbnail">' ).appendTo("#sheetSelector");
	}		
  }

  /***
     Show current sheet. (Resize DOM object and replace CSS background image)
  ***/
  this.showSheet = function() {
    $( "#sheet").hide().fadeIn();
    $( "#sheet").css({		
      width : (this.width*100)/10 + 'em',
      height: (this.height*100)/10 + 'em'
    });
    $("#sheet").css("background-image", "url('img/sheets/"+this.sheetName+"_"+this.width+"x"+this.height+"x"+this.startPosX+"x"+this.startPosY+"x"+this.startDirection+".png')");
  }


  /***
     Set current sheet data
     split filename from array based on sheetID.
  ***/
  this.setSheet = function(sheetId) {
    var sheet = this.availableSheets[sheetId];
    var sheet_split0=sheet.split(".");
    var sheet_split1=sheet_split0[0].split("_");
    var sheet_split2=sheet_split1[1].split("x");
    this.width = parseInt(sheet_split2[0]);
    this.height = parseInt(sheet_split2[1]);
    this.startPosX = parseInt(sheet_split2[2]);
    this.startPosY = parseInt(sheet_split2[3]);
    this.startDirection = parseInt(sheet_split2[4]);
    this.sheetName = sheet_split1[0];
    this.showSheet();
  }



  /***
      Initialize levelSelector events 
  ***/
  this.initializeSheetSelectorClickEvent = function() {
    $( ".sheetSelectorThumb").bind( "click", function( event ) {
      $(".sheetSelectorThumb").css('background-color', "#fff"); //reset click styling
      $(".sheetSelectorThumb").removeClass('animated pulse shadow_select'); //reset click animation
      $(this).css('background-color', "#edebf1");
      $(this).addClass('animated pulse shadow_select');
      activity.sheets.currentSheet = $(this).attr('data-id');
      activity.sheets.setSheet(activity.sheets.currentSheet);
      activity.bugbot.setPositions(((activity.sheets.startPosX-1)*100),((activity.sheets.startPosY-1)*100));
      activity.bugbot.initStartRotation(activity.sheets.startDirection);
    });
  }


  /***
      Initialize levelSelector events 
  ***/
  this.initializeSheetRefreshClickEvent = function() {
    $( "#sheetRefresh").bind( "click", function( event ) {
       activity.sheets.setSheet(activity.sheets.currentSheet);
       activity.bugbot.resetActions();
       activity.bugbot.setPositions(((activity.sheets.startPosX-1)*100),((activity.sheets.startPosY-1)*100));
       activity.bugbot.initStartRotation(activity.sheets.startDirection);
    });
  }

  /***
     Run initialize methods
  ***/
  this.init = function() {
    showSheetSelector();
    this.setSheet(0);
    activity.bugbot.setPositions(((this.startPosX-1)*100),((this.startPosY-1)*100));
    activity.bugbot.initStartRotation(this.startDirection);
    this.initializeSheetSelectorClickEvent();
    this.initializeSheetRefreshClickEvent();
  };


  /***
     expose public methods and attributes
  ***/

  return {
	init : init,
	availableSheets : availableSheets,
	setSheet : setSheet,
	showSheet : showSheet,
	showSheetSelector : showSheetSelector,
        initializeSheetSelectorClickEvent : initializeSheetSelectorClickEvent,
        initializeSheetRefreshClickEvent : initializeSheetRefreshClickEvent,

	currentSheet : currentSheet,
	startPosX : startPosX,
	startPosY : startPosY,
        startDirection : startDirection
  };

})();
