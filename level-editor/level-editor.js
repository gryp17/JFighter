
$(window).resize(function (){
	showControlsContainer();
});

//move the level background on mouse wheel scroll
$(".background-container").on("mousewheel", function (e) {	
	var scrollLeft = $(document).scrollLeft();
	$(document).scrollLeft(scrollLeft + e.deltaY * 40);
	e.preventDefault();
});

function showControlsContainer(){
	//set the controls container to the same width of the document
	$(".controls-container").css("width", $(window).width());
	$(".controls-container").fadeIn(500);
}

showControlsContainer();