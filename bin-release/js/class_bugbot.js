activity.bugbot = (function() {
  this.actions = [];         // array for storing the programmed actions.
  this.mode="idle";          // "idle", "paused", "moving"
  this.timerIntervalId = 0;  // id for setInterval and clearTimeout.
  this.speed=1200;           // milliseconds. Must be higher then the css transition interval
  this.direction=0;          // 0,1,2,3 = north, east, south, west
  this.rotation=0;           // degrees for (css) rotation 
  this.distance=100;          // ems to move per action


  /***
    Set rotation of bugbot. 
    Add 90 degrees when LeftOrRight="right". 
    Subtract 90 degrees when leftOrRight="left"
  ***/
  this.setDirection = function(leftOrRight) {
    switch ( leftOrRight ) {
      case "right"   : 
        this.direction++
        this.rotation+=90;
        if (this.direction > 3) this.direction=0;
      break;
      case "left"   : 
        this.direction--
        this.rotation-=90;
        if (this.direction < 0) this.direction=3;
      break;
    }
  }

  /***
    set rotation (used for initialization). 
    0 = 0 degrees, 1 = 90 degrees, 2 = 180 degrees, 3 = 270 degrees
  ***/
  this.initStartRotation = function(direction) {
     activity.bugbot.direction = direction;
     activity.bugbot.rotation=direction*90;
     $("#bot").rotate( activity.bugbot.rotation );
  }


  /***
    Add action to action array. 
    action: "forward", "backward", "left", "right"
  ***/
  this.addAction = function(action) {
    this.actions.push(action);
    switch ( action ) {
      case "forward"   : $( '<div class="actionList_upward actionItemInList"></div>' ).appendTo("#actionsList").css({'opacity':0}).animate({'opacity':1}); break;
      case "backward"   : $( '<div class="actionList_backward actionItemInList"></div>' ).appendTo("#actionsList").css({'opacity':0}).animate({'opacity':1}); break;
      case "left"   : $( '<div class="actionList_left actionItemInList"></div>' ).appendTo("#actionsList").css({'opacity':0}).animate({'opacity':1}); break;
      case "right"   : $( '<div class="actionList_right actionItemInList"></div>' ).appendTo("#actionsList").css({'opacity':0}).animate({'opacity':1}); break;
    }
  }


  /***
    Empty the actions array. 
  ***/
  this.resetActions = function() {
    activity.bugbot.actions = [];
    $("#actionsList").empty();
    activity.bugbot.mode="idle";
  }


  /***
    Set (CSS) coordinates of bugbot
  ***/
  this.setPositions = function(leftPos, topPos) {
    $( "#bot").css({		
      top : (topPos/10) + 'em',
      left: (leftPos/10) + 'em'
    });
  }


  /***
    Move bugbot forward or backward (depending on rotation). 
  ***/
  this.moveForwardOrBackward = function(forwardOrBackward) {
    var currentTop  = px($("#bot").position().top);
    var currentLeft = px($("#bot").position().left);
    switch (forwardOrBackward) {
      case "forward" : 
        switch ( activity.bugbot.direction ) {
          case 0 : $( "#bot").css('top', currentTop - (activity.bugbot.distance/10) + "em"); break;
          case 1 : $( "#bot").css('left', currentLeft + (activity.bugbot.distance/10) + "em"); break;
          case 2 : $( "#bot").css('top', currentTop + (activity.bugbot.distance/10) + "em" ); break;
          case 3 : $( "#bot").css('left', currentLeft - (activity.bugbot.distance/10) + "em"); break;
        }
      break;
      case "backward" : 
        switch ( activity.bugbot.direction ) {
          case 0 : $( "#bot").css('top', currentTop + (activity.bugbot.distance/10) + "em" ); break;
          case 1 : $( "#bot").css('left', currentLeft - (activity.bugbot.distance/10) + "em"); break;
          case 2 : $( "#bot").css('top', currentTop - (activity.bugbot.distance/10) + "em" ); break;
          case 3 : $( "#bot").css('left', currentLeft + (activity.bugbot.distance/10) + "em"); break;				
        }
      break;
    }
  }


  /***
     Get next action from actions array.
     If array is empty, then end the "setInterval" loop with clearTimeout
  ***/
  this.playActions = function() {
    if (activity.bugbot.actions.length==0) {
      clearTimeout(activity.bugbot.timerIntervalId);
    } else {
      temp=activity.bugbot.actions.shift(); 
      switch (temp) {
          case "forward" : activity.bugbot.moveForwardOrBackward("forward"); break;
          case "backward": activity.bugbot.moveForwardOrBackward("backward"); break;
          case "left"    : activity.bugbot.setDirection("left"); $("#bot").rotate( activity.bugbot.rotation ); break;
          case "right"   : activity.bugbot.setDirection("right"); $("#bot").rotate( activity.bugbot.rotation ); break;
      }
      $("#actionsList div").last().remove();
    }
  }


  /***
     Initialize Controller on click event.
  ***/
  this.initializeControllerClickEvent = function() {
    $( "#bot").find( ".action" ).bind( "click", function( event ) {
      switch ( $(this).attr('data-action') ) {
        case "forward"   : activity.bugbot.addAction ( "forward" ); break;
        case "backward"  : activity.bugbot.addAction ( "backward" ); break;
        case "left"      : activity.bugbot.addAction ( "left"  ); break;
        case "right"     : activity.bugbot.addAction ( "right" ); break;
	case "pause":
          if (activity.bugbot.mode=="moving") {
            activity.bugbot.mode="paused";
            clearTimeout(activity.bugbot.timerIntervalId);
          } else {
            activity.bugbot.mode="moving";
            activity.bugbot.timerIntervalId = setInterval( function(){activity.bugbot.playActions()}, activity.bugbot.speed);
          }
        break;
        case "clear": 
          clearTimeout(activity.bugbot.timerIntervalId);
          activity.bugbot.mode="idle";
          activity.bugbot.resetActions (); 
        break;
        case "go"   : 
          activity.bugbot.mode="moving";
          activity.bugbot.timerIntervalId = setInterval( function(){activity.bugbot.playActions()}, activity.bugbot.speed);  
	break;
      }
    });
  }


  /***
     Initialize Controller on drag event.
     Must remove transition effect while dragging and restore animation when ready.
     (To work around an issue, I introduced 2 "invisible" divs similar to the button controls for dragging. The result is quite a messy code, but it works...)
  ***/
  this.initializeControllerDragEvent = function() {
    $( "#bot").find( ".drag" ).draggable({
      start: function(event,ui) {
        $( ".bot").css({		
          WebkitTransition : 'none',
          MozTransition    : 'none',
          MsTransition     : 'none',
          OTransition      : 'none',
          transition       : 'none'
        });
	$( "#bot").animate({ opacity: 0 })
	$( "#botGhost").css({"display":"block", "opacity": 0.75 });
	$("#botGhost").rotate( activity.bugbot.rotation );
	var posX_bot   = px($( "#bot").offset().left),
            posY_bot   = px($("#bot").offset().top),
	    posX_sheet = px($( "#sheet").offset().left),
            posY_sheet = px($("#sheet").offset().top);
	if ($(this).attr('data-action')=="left") $("#botGhost").css({top: (posY_bot - posY_sheet) - 0.7 + "em", left: (posX_bot - posX_sheet) - 0.4 + "em"});
	if ($(this).attr('data-action')=="right") $("#botGhost").css({top: (posY_bot - posY_sheet) - 0.7 + "em", left: (posX_bot - posX_sheet) - 6.6 + "em"});
      },
      drag: function() {
	var posX_drag = px($(this).position().left),
            posY_drag = px($(this).position().top),
	    posX_bot = px($( "#bot").offset().left),
            posY_bot = px($("#bot").offset().top),
	    posX_sheet = px($( "#sheet").offset().left),
            posY_sheet = px($("#sheet").offset().top);

        switch ( activity.bugbot.direction ) {
          case 0 : 
		if ($(this).attr('data-action')=="left") $("#botGhost").css({top: (posY_bot - posY_sheet + posY_drag) - 0.7 + "em", left: (posX_bot - posX_sheet + posX_drag) - 0.4 + "em"});
		if ($(this).attr('data-action')=="right") $("#botGhost").css({top: (posY_bot - posY_sheet + posY_drag) - 0.7 + "em", left: (posX_bot - posX_sheet + posX_drag) - 6.6 + "em"});
		break;
          case 1 : 
		if ($(this).attr('data-action')=="left") $("#botGhost").css({top: (posY_bot - posY_sheet - posX_drag) -3.8 + "em", left: (posX_bot - posX_sheet + posY_drag) +3.8 + "em" });
		if ($(this).attr('data-action')=="right") $("#botGhost").css({top: (posY_bot - posY_sheet - posX_drag) -10.4 + "em", left: (posX_bot - posX_sheet + posY_drag) +3.8 + "em"});
		break;
          case 2 : 
		if ($(this).attr('data-action')=="left") $("#botGhost").css({top: (posY_bot - posY_sheet - posY_drag) + 0.7 + "em", left: (posX_bot - posX_sheet - posX_drag) + 0.4 + "em"});
		if ($(this).attr('data-action')=="right") $("#botGhost").css({top: (posY_bot - posY_sheet - posY_drag) + 0.7 + "em", left: (posX_bot - posX_sheet - posX_drag) + 6.6 + "em"});
		break;
          case 3 : 
		if ($(this).attr('data-action')=="left") $("#botGhost").css({top: (posY_bot - posY_sheet + posX_drag) -6.6 + "em", left: (posX_bot - posX_sheet - posY_drag) +6.6 + "em"});
		if ($(this).attr('data-action')=="right") $("#botGhost").css({top: (posY_bot - posY_sheet + posX_drag) + "em", left: (posX_bot - posX_sheet - posY_drag) +6.6 + "em"});
		break;
        }

      },
      stop: function() {
	var posX_drag = px($(this).position().left),
            posY_drag = px($(this).position().top),
	    posX_bot = px($( "#bot").offset().left),
            posY_bot = px($("#bot").offset().top),
	    posX_sheet = px($( "#sheet").offset().left),
            posY_sheet = px($("#sheet").offset().top);
        switch ( activity.bugbot.direction ) {
          case 0 : 
		if ($(this).attr('data-action')=="left") {
			$(this).css({top: "0.7em", left: "0.4em"});
			$("#bot").css({top: (posY_bot - posY_sheet + posY_drag) - 0.7 + "em", left: (posX_bot - posX_sheet + posX_drag) - 0.4 + "em"});
		}
	 	if ($(this).attr('data-action')=="right") {
			$(this).css({top: "0.7em", left: "6.6em"});
			$("#bot").css({top: (posY_bot - posY_sheet + posY_drag) - 0.7 + "em", left: (posX_bot - posX_sheet + posX_drag) - 6.6 + "em"});
		}
		break;
          case 1 : 
		if ($(this).attr('data-action')=="left") {
			$(this).css({top: 0.7 + "em", left: 0.4 + "em"});
			$("#bot").css({top: (posY_bot - posY_sheet - posX_drag) -3.8 + "em", left: (posX_bot - posX_sheet + posY_drag) +3.8 + "em" });
		}
	 	if ($(this).attr('data-action')=="right") {
			$(this).css({top: 0.7 + "em", left: 6.6 + "em"});
			$("#bot").css({top: (posY_bot - posY_sheet - posX_drag) -10.4 + "em", left: (posX_bot - posX_sheet + posY_drag) +3.8 + "em"});
		}
		break;
          case 2 : 
		if ($(this).attr('data-action')=="left") {
			$(this).css({top: 0.7 + "em", left: 0.4 + "em"});
			$("#bot").css({top: (posY_bot - posY_sheet - posY_drag) + 0.7 + "em", left: (posX_bot - posX_sheet - posX_drag) + 0.4 + "em"});
		}
	 	if ($(this).attr('data-action')=="right") {
			$(this).css({top: 0.7 + "em", left: 6.6 + "em"});
			$("#bot").css({top: (posY_bot - posY_sheet - posY_drag) + 0.7 + "em", left: (posX_bot - posX_sheet - posX_drag) + 6.6 + "em"});
		}
		break;
          case 3 : 
		if ($(this).attr('data-action')=="left") {
			$(this).css({top: 0.7 + "em", left: 0.4 + "em"});
			$("#bot").css({top: (posY_bot - posY_sheet + posX_drag) -6.6 + "em", left: (posX_bot - posX_sheet - posY_drag) +6.6 + "em"});
		}
	 	if ($(this).attr('data-action')=="right") {
			$(this).css({top: 0.7 + "em", left: 6.6 + "em"});
			$("#bot").css({top: (posY_bot - posY_sheet + posX_drag) + "em", left: (posX_bot - posX_sheet - posY_drag) +6.6 + "em"});
		}
		break;
        }
        $("#bot").css({
          WebkitTransition : 'all 1s ease-in-out',
          MozTransition    : 'all 1s ease-in-out',
          MsTransition     : 'all 1s ease-in-out',
          OTransition      : 'all 1s ease-in-out',
          transition       : 'all 1s ease-in-out'
        });
	$( "#bot").animate({ opacity: 100 })
	$( "#botGhost").fadeOut();
      }	
    });
  }


  /***
     Run initialize methods
  ***/
  this.init = function() {
    activity.bugbot.initializeControllerClickEvent();
    activity.bugbot.initializeControllerDragEvent();
  };


  /***
     expose public methods and attributes
  ***/
  return {
    init : init,
    setPositions : setPositions,
    playActions : playActions,
    moveForwardOrBackward : moveForwardOrBackward,
    setDirection : setDirection,
    playActions : playActions,
    addAction : addAction,
    resetActions : resetActions,
    initStartRotation : initStartRotation,
    initializeControllerClickEvent : initializeControllerClickEvent,
    initializeControllerDragEvent : initializeControllerDragEvent,

    actions : actions,
    direction : direction,
    rotation : rotation,
    distance : distance,
    timerIntervalId : timerIntervalId,
    mode : mode,
    speed : speed
  };
})();

