/**
 * HARPP class used for generating weather effects
 * @param {Game} game
 * @returns {HARPP}
 */
function HARPP (game) {
	this.weather;
	this.showWeatherEffects = false;
	this.clock = 0;
		
	/**
	 * Generates weather effects for the specified weather type
	 * @param {Object} levelData
	 * @returns {Array}
	 */
	this.generateWeather = function (levelData){
		this.weather = levelData.WEATHER;
		
		var weatherEffects = [];
		
		switch(levelData.WEATHER.TYPE){
			case "snow":
				weatherEffects = this.generateSnow(levelData);
				break;
			case "rain":
				weatherEffects = this.generateRain(levelData);
		}
		
		return weatherEffects;
	};
	
	/**
	 * Updates the weather status
	 */
	this.updateWeatherStatus = function (){
		
		//if there is no weather interval
		if(!this.weather.INTERVAL){
			this.showWeatherEffects = true;
		}
		//otherwise enable/disable the weather periodically using the clock counter
		else{
			this.clock++;
			
			//reset the clock and toggle the weather
			if(this.clock === this.weather.INTERVAL){
				this.clock = 0;
				this.showWeatherEffects = !this.showWeatherEffects;
			}
		}
		
	};
	
	/**
	 * Generates snowflakes
	 * @param {Object} levelData
	 * @returns {Array}
	 */
	this.generateSnow = function (levelData){
		var snowflakes = [];
		
		var canvas = game.contexts.weather.canvas;
		
		//generate X snowflakes with random properties
		for(var i = 0; i < 600; i++){
			var x = _.random(0, canvas.width * 2);
			var y = _.random(canvas.height * -1, 0);
			var dx = _.random(-4, -2.5, true);
			var dy = _.random(1, 2, true);
			var radius = _.random(0.5, 2.5, true);
			
			snowflakes.push(new Snowflake(game, x, y, dx, dy, radius));
		}
			
		return snowflakes;
	};
	
	/**
	 * Generates raindrops
	 * @param {Object} levelData
	 * @returns {Array}
	 */
	this.generateRain = function (levelData){
		var raindrops = [];
		
		var canvas = game.contexts.weather.canvas;
		
		//generate X raindrops with random properties
		for(var i = 0; i < 300; i++){
			var x = _.random(0, canvas.width * 2);
			var y = _.random(canvas.height * -1, 0);
			var dx = _.random(-4, -2.5, true);
			var dy = _.random(8, 10, true);
			var width = 1;
			var height = _.random(5, 10);
			
			raindrops.push(new Raindrop(game, x, y, dx, dy, width, height));
		}
		
		return raindrops;
	};
};
