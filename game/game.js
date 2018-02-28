/**
 * Main game class that initializes the game and all the game objects
 * @param {Object} gameImages
 * @returns {Game}
 */
function Game(gameImages) {
	var self = this;

	this.gameImages = gameImages;

	this.GAME_STATE = CONSTANTS.GAME_STATE.MAIN_MENU;

	//canvas/context objects
	this.CONTEXTS = {
		BACKGROUND: new Context("background-canvas"),
		PLANE: new Context("plane-canvas"),
		ENEMIES: new Context("enemies-canvas")
	};

	//initialize the keyboard controls
	this.keyboard = new Keyboard();

	/**
	 * Starts the game
	 * @param {String} selectedPlane
	 * @param {String} selectedLevel
	 */
	this.start = function (selectedPlane, selectedLevel) {
		this.CONTEXTS["BACKGROUND"].canvas.focus();

		//game objects
		this.background = new Background(this.CONTEXTS, selectedLevel);
		this.plane = new Plane(this.CONTEXTS, this.background, selectedPlane);
		this.enemies = LEVELS_DATA[selectedLevel].ENEMIES.map(function (enemy) {

			//default arguments for each enemy object type
			var arguments = [null, self.CONTEXTS, self.background, self.plane];

			//additional arguments (x, y...)
			var objectArguments = Object.values(enemy.arguments);

			//merge all arguments
			arguments = arguments.concat(objectArguments);

			//create new dynamic Object (this[enemy.objectType]) passing the arguments
			return new (Function.prototype.bind.apply(this[enemy.objectType], arguments));
		});

		//listen for the keyboard events
		this.keyboard.listen();

		//start the game loop
		this.animate();
	};

	/**
	 * Starts the animation loop
	 */
	this.animate = function () {
		requestAnimFrame(self.animate);

		//get the current inputs status 
		var inputs = self.keyboard.getInputs();

		//draw the background
		self.background.draw(self.plane);

		//draw the plane
		self.plane.draw(inputs);

		//draw all enemies
		self.enemies.forEach(function (enemy) {
			enemy.draw(self.background);
		});
	};

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
}