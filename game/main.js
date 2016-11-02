var imageRepository = new ImageRepository(GAME_IMAGES, function () {
	$(".uil-ring-css").fadeOut(300, function () {
		$("#main-menu").fadeIn(300);
	});
	
	$(".plane").click(function (){
		var selectedPlane = $(this).attr("data-plane");
		$("#main-menu").fadeOut(300, function (){
			$(".canvas").fadeIn(300);
		});
		init(selectedPlane);
	});
	
});


/**
 * Main function that is called when all images have been loaded
 * @param {String} selectedPlane
 */
function init(selectedPlane) {
	var GAME_STATE = CONSTANTS.GAME_STATE.MAIN_MENU;

	//canvas/context objects
	var BACKGROUND = new Context("background-canvas");
	var PLANE = new Context("plane-canvas");

	BACKGROUND.canvas.focus();

	//game objects
	var background = new Background(BACKGROUND, imageRepository);
	var plane = new Plane(PLANE, selectedPlane, background, imageRepository);

	function animate() {
		requestAnimFrame(animate);
		background.draw();
		plane.draw();
	}

	/**
	 * requestAnim shim layer by Paul Irish
	 * Finds the first API that works to optimize the animation loop,
	 * otherwise defaults to setTimeout().
	 */
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback, element) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	animate();
}
