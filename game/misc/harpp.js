import Raindrop from '@/game/game-objects/weather/raindrop';
import Snowflake from '@/game/game-objects/weather/snowflake';

/**
 * HARPP class used for generating weather effects
 */
export default class HARPP {

	/**
	 * HARPP constructor
	 * @param {Game} game 
	 */
	constructor(game) {
		this.game = game;
		this.weather;
		this.showWeatherEffects = false;
		this.clock = 0;
	}
		
	/**
	 * Generates weather effects for the specified weather type
	 * @param {Object} levelData
	 * @returns {Array}
	 */
	generateWeather(levelData){
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
	updateWeatherStatus(){
		
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
	generateSnow(levelData){
		var snowflakes = [];
		
		var canvas = this.game.contexts.weather.canvas;
		
		//generate X snowflakes with random properties
		for(var i = 0; i < 600; i++){
			var x = _.random(0, canvas.width * 2);
			var y = _.random(canvas.height * -1, 0);
			var dx = _.random(-4, -2.5, true);
			var dy = _.random(1, 2, true);
			var radius = _.random(0.5, 2.5, true);
			
			snowflakes.push(new Snowflake(this.game, x, y, dx, dy, radius));
		}
			
		return snowflakes;
	};
	
	/**
	 * Generates raindrops
	 * @param {Object} levelData
	 * @returns {Array}
	 */
	generateRain(levelData){
		var raindrops = [];
		
		var canvas = this.game.contexts.weather.canvas;
		
		//generate X raindrops with random properties
		for(var i = 0; i < 300; i++){
			var x = _.random(0, canvas.width * 2);
			var y = _.random(canvas.height * -1, 0);
			var dx = _.random(-4, -2.5, true);
			var dy = _.random(8, 10, true);
			var width = 1;
			var height = _.random(5, 10);
			
			raindrops.push(new Raindrop(this.game, x, y, dx, dy, width, height));
		}
		
		return raindrops;
	};
};
