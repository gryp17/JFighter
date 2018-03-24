/**
 * HARPP class used for generating weather effects
 * @param {Game} game
 * @returns {HARPP}
 */
function HARPP (game) {
	
	/**
	 * Generates weather effects for the specified weather type
	 * @param {String} weatherType
	 * @returns {Array}
	 */
	this.generateWeather = function (weatherType){
		var weatherEffects = [];
		
		switch(weatherType){
			case "snow":
				weatherEffects = this.generateSnow();
				break;
		}
		
		return weatherEffects;
	};
	
	/**
	 * Generates snowflakes
	 * @returns {Array}
	 */
	this.generateSnow = function (){
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
};
