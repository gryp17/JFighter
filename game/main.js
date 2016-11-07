var IMAGE_REPOSITORY = new ImageRepository(GAME_IMAGES, function () {
	var menu = new Menu();
	menu.showMenu(function (selectedPlane, selectedLevel){
		init(selectedPlane, selectedLevel);
	});
});


/**
 * Main function that is called when all images have been loaded
 * @param {String} selectedPlane
 * @param {String} selectedLevel
 */
function init(selectedPlane, selectedLevel) {
	var GAME_STATE = CONSTANTS.GAME_STATE.MAIN_MENU;

	//canvas/context objects
	var BACKGROUND = new Context("background-canvas");
	var PLANE = new Context("plane-canvas");

	BACKGROUND.canvas.focus();

	//game objects
	var background = new Background(BACKGROUND, selectedLevel);
	var plane = new Plane(PLANE, selectedPlane);
	var obstacle = new Obstacle(PLANE);

	function animate() {
		requestAnimFrame(animate);
		background.draw(plane);
		plane.draw();
		obstacle.draw(background);
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
