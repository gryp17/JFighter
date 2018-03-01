/**
 * Main game class that initializes the game and all the game objects
 * @param {Object} images
 * @param {Object} planeStats
 * @param {Object} enemyStats
 * @param {Object} levelsData
 * @returns {Game}
 */
function Game(images, planeStats, enemyStats, levelsData) {
	var self = this;

	this.images = images;
	this.planeStats = planeStats;
	this.enemyStats = enemyStats;
	this.levelsData = levelsData;
	this.selectedPlane;
	this.selectedLevel;
	this.inputs;

	this.GAME_STATE = CONSTANTS.GAME_STATE.MAIN_MENU;

	//canvas/context objects
	this.contexts = {
		background: new Context("background-canvas"),
		plane: new Context("plane-canvas"),
		enemies: new Context("enemies-canvas")
	};

	//initialize the keyboard controls
	this.keyboard = new Keyboard();

	/**
	 * Starts the game
	 * @param {String} selectedPlane
	 * @param {String} selectedLevel
	 */
	this.start = function (selectedPlane, selectedLevel) {
		this.selectedPlane = selectedPlane;
		this.selectedLevel = selectedLevel;
		
		this.contexts.background.canvas.focus();
		
		//game objects
		this.background = new Background(this);
		this.plane = new Plane(this);
		this.enemies = this.levelsData[selectedLevel].ENEMIES.map(function (enemy) {

			//default arguments for each enemy object type
			var arguments = [null, self];

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
		self.inputs = self.keyboard.getInputs();

		//draw the background
		self.background.draw();

		//draw the plane
		self.plane.draw();

		//clear the entire enemies context before drawing any of the enemies
		self.contexts.enemies.context.clearRect(0, 0, self.contexts.enemies.canvas.width, self.contexts.enemies.canvas.height);

		//draw all enemies that are still on the screen
		self.enemies = _.filter(self.enemies, function (enemy){
			if(enemy.x > -800){
				enemy.draw();
				return true;
			}else{
				return false;
			}
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