var IMAGE_REPOSITORY = new ImageRepository(GAME_IMAGES, function () {
	var menu = new Menu();
	menu.showMenu(function (selectedPlane, selectedLevel) {
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
	var CONTEXTS = {
		BACKGROUND: new Context("background-canvas"),
		PLANE: new Context("plane-canvas"),
		ENEMIES: new Context("enemies-canvas")
	};

	CONTEXTS["BACKGROUND"].canvas.focus();

	//game objects
	var background = new Background(CONTEXTS, selectedLevel);
	var plane = new Plane(CONTEXTS, background, selectedPlane);
	var enemies = LEVELS_DATA[selectedLevel].ENEMIES.map(function (enemy) {
		
		//default arguments for each enemy object type
		var arguments = [null, CONTEXTS, background];

		//additional arguments (x, y...)
		var objectArguments = Object.values(enemy.arguments);

		//merge all arguments
		arguments = arguments.concat(objectArguments);

		//create new dynamic Object (this[enemy.objectType]) passing the arguments
		return new (Function.prototype.bind.apply(this[enemy.objectType], arguments));
	});


	function animate() {
		requestAnimFrame(animate);

		background.draw(plane);
		plane.draw();

		//draw all enemies
		enemies.forEach(function (enemy) {
			enemy.draw(background);
		});
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
