/**
 * Main game class that initializes the game and all the game objects
 * @param {Object} images
 * @param {Object} planeStats
 * @param {Object} enemyStats
 * @param {Object} civilianStats
 * @param {Object} levelsData
 * @returns {Game}
 */
function Game(images, planeStats, enemyStats, civilianStats, levelsData) {
	var self = this;

	this.frameId;
	this.status;
	this.images = images;
	this.planeStats = planeStats;
	this.enemyStats = enemyStats;
	this.civilianStats = civilianStats;
	this.levelsData = levelsData;
	this.selectedPlane;
	this.selectedLevel;
	this.inputs;
	this.deadCivilians;
		
	//initialize the keyboard controls
	this.keyboard = new Keyboard();
	
	//initialize the collisions manager
	this.collisionsManager = new CollisionsManager(this);
	
	//initialize the HUD object
	this.HUD = new HUD(this, "#HUD");
	
	//initialize the HARPP (get it?) object
	this.HARPP = new HARPP(this);
	
	//initialize the (game) menu
	this.menu = new GameMenu(this);

	//canvas/context objects
	this.contexts = {
		background: new Context("background-canvas"),
		plane: new Context("plane-canvas"),
		civilians: new Context("civilians-canvas"),
		airEnemies: new Context("air-enemies-canvas"),
		groundEnemies: new Context("ground-enemies-canvas"),
		projectiles: new Context("projectiles-canvas"),
		weather: new Context("weather-canvas")
	};
	
	/**
	 * Starts the game
	 * @param {String} selectedPlane
	 * @param {String} selectedLevel
	 */
	this.start = function (selectedPlane, selectedLevel) {
		//clear the frame id before starting the game in case there is another timer running already
		this.clearFrameId();
				
		this.status = CONSTANTS.GAME_STATE.ACTIVE;
		this.selectedPlane = selectedPlane;
		this.selectedLevel = selectedLevel;
		this.deadCivilians = 0;
				
		this.contexts.background.canvas.focus();
		
		//game objects
		this.background = new Background(this);
		this.plane = new Plane(this);
		this.bulletImpacts = [];
		this.explosions = [];
		this.bombHoles = [];
		this.weatherEffects = this.HARPP.generateWeather(this.levelsData[selectedLevel]);
				
		this.enemies = this.levelsData[selectedLevel].ENEMIES.map(function (enemy) {

			//default arguments for each object type
			var arguments = [null, self];

			//additional arguments (x, y...)
			var objectArguments = Object.values(enemy.arguments);

			//merge all arguments
			arguments = arguments.concat(objectArguments);

			//create new dynamic Object (this[enemy.objectType]) passing the arguments
			return new (Function.prototype.bind.apply(this[enemy.objectType], arguments));
		});
		
		this.civilians = this.levelsData[selectedLevel].CIVILIANS.map(function (civilian) {

			//default arguments for each object type
			var arguments = [null, self];

			//additional arguments (x, y...)
			var objectArguments = Object.values(civilian.arguments);

			//merge all arguments
			arguments = arguments.concat(objectArguments);

			//create new dynamic Object (this[civilian.objectType]) passing the arguments
			return new (Function.prototype.bind.apply(this[civilian.objectType], arguments));
		});
		
		//listen for the keyboard events
		this.keyboard.listen();
		
		//show the HUD
		this.HUD.show();

		//start the game loop
		this.animate();
	};
	
	/**
	 * Clears the frame id of the animation loop
	 */
	this.clearFrameId = function () {
		if(this.frameId){
			clearTimeout(this.frameId);
			window.cancelAnimationFrame(this.frameId);
			this.frameId = undefined;
		}
	};

	/**
	 * Starts the animation loop
	 */
	this.animate = function () {
		//save the frameId and use it when stopping/restarting the game
		self.frameId = requestAnimFrame(self.animate);

		//if the game is paused don't draw anything
		if(self.status === CONSTANTS.GAME_STATE.PAUSED){
			return;
		}

		//get the current inputs status 
		self.inputs = self.keyboard.getInputs();

		//handle all game collisions
		self.collisionsManager.handleCollisions();

		//draw the background
		self.background.draw();

		//clear the entire projectiles context before drawing any of the projectiles/explosions
		self.contexts.projectiles.context.clearRect(0, 0, self.contexts.projectiles.canvas.width, self.contexts.projectiles.canvas.height);

		//draw the plane
		self.plane.draw();

		//clear the entire enemies contexts before drawing any of the enemies
		self.contexts.airEnemies.context.clearRect(0, 0, self.contexts.airEnemies.canvas.width, self.contexts.airEnemies.canvas.height);
		self.contexts.groundEnemies.context.clearRect(0, 0, self.contexts.groundEnemies.canvas.width, self.contexts.groundEnemies.canvas.height);

		//draw all enemies that are still on the screen
		self.enemies = _.filter(self.enemies, function (enemy){
			if(enemy.active){
				enemy.draw();
				return true;
			}else{
				return false;
			}
		});
		
		//show the level completed screen if all enemies are dead
		if(self.enemies.length === 0 && self.status === CONSTANTS.GAME_STATE.ACTIVE){
			self.menu.levelCompleted();
		}
		
		//clear the entire civilians context before drawing any of the civilians
		self.contexts.civilians.context.clearRect(0, 0, self.contexts.civilians.canvas.width, self.contexts.civilians.canvas.height);
				
		//draw all civilians that are still active
		self.civilians = _.filter(self.civilians, function (civilian){
			if(civilian.active){
				civilian.draw();
				return true;
			}else{
				return false;
			}
		});
						
		//draw all bullet impacts that are still active
		self.bulletImpacts = _.filter(self.bulletImpacts, function (bulletImpact){
			if(bulletImpact.active){
				bulletImpact.draw();
				return true;
			}else{
				return false;
			}
		});
		
		//draw all explosions that are still active
		self.explosions = _.filter(self.explosions, function (explosion){
			if(explosion.active){
				explosion.draw();
				return true;
			}else{
				return false;
			}
		});
		
		//draw all bomb holes that are still active
		self.bombHoles = _.filter(self.bombHoles, function (bombHole){
			if(bombHole.active){
				bombHole.draw();
				return true;
			}else{
				return false;
			}
		});
		
		//clear the entire weather context before drawing any of the weather effects
		self.contexts.weather.context.clearRect(0, 0, self.contexts.weather.canvas.width, self.contexts.weather.canvas.height);

		//updates the weather status
		self.HARPP.updateWeatherStatus();
		
		//draw all weather effects
		self.weatherEffects.forEach(function (weatherEffect){
			//if the showWeatherEffects flag is raised OR if the weather effect is still inside the canvas (vertically)
			if(self.HARPP.showWeatherEffects || weatherEffect.y >= 0){
				weatherEffect.draw();
			}
		});
		
		//draw the HUD
		self.HUD.draw();
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