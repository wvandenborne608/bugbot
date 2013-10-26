/***
   Determine body font size (em factor) based on available screensize) Default: 10px = 1em.
***/
function determineAndSetScaleFactor() {
  var appHeight = 505;
  var appWidth = 910;
  var height = $(window).innerHeight();
  var width = $(window).innerWidth();
  var scaleFactor = parseFloat(((height-appHeight)*100)/appHeight)
  var currentEmSize = parseFloat($("body").css("font-size"));
  $("body").css({'font-size': Math.floor(currentEmSize + (((currentEmSize) * (scaleFactor/100)))) + "px"})
  if (appWidth>width) {
    var scaleFactor = parseFloat(((width-appWidth)*100)/appWidth);
    $("body").css({'font-size': Math.floor( (currentEmSize + ((currentEmSize) * (scaleFactor/100))) ) + "px"})
  }
}

$.fn.rotate = function(deg) {
    this.css({'transform': 'rotate('+deg+'deg)'});
    this.css({'-ms-transform': 'rotate('+deg+'deg)'});
    this.css({'-moz-transform': 'rotate('+deg+'deg)'});
    this.css({'-o-transform': 'rotate('+deg+'deg)'}); 
    this.css({'-webkit-transform': 'rotate('+deg+'deg)'});
    return this; 
};

function processSheetsForPreLoad(sheets) {
	var tempArray = [];
	for (var i = 0; i < sheets.length; i++) {
		tempArray[i] = "preload!img/sheets/" + sheets[i];
	}
	return tempArray;
}

yepnope.addPrefix( 'preload', function ( resource ) {
    resource.noexec = true;
    return resource;
});

function px(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (input / emSize);
}
function em(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (emSize * input);
}
