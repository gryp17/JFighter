/**
 * Class used for displaying the HUD elements of the game
 * @param {Game} game
 * @param {Object} element
 * @returns {HUD}
 */
function HUD(game, element) {	
	this.visible = false;
	
	//the max hue value 
	this.maxHue = 130;
	
	/**
	 * Shows the HUD
	 */
	this.show = function (){
		this.visible = true;
	};
	
	/**
	 * Hides the HUD
	 */
	this.hide = function (){
		this.visible = false;
	};
	
	/**
	 * Draws the HUD using the Game parameters
	 */
	this.draw = function (){
		element.css("display", this.visible ? "block": "none");
		
		if(this.visible){
			this.drawHealth();
			this.drawThrottle();
		}
	};
	
	/**
	 * Draws the health indicator
	 */
	this.drawHealth = function () {
		//get the current plane health and the max plane health
		var currentHealth = game.plane.health;
		var maxHealth = game.planeStats[game.selectedPlane].HEALTH;

		var healthBar = element.find(".health-bar");
		var health = healthBar.find(".current");

		//calculate the pixels per HP
		var pixelsPerHP = healthBar.width() / maxHealth;
		
		//calculate the hue per HP
		var huePerHP = this.maxHue / maxHealth;

		health.css({
			backgroundColor: "hsl("+huePerHP*currentHealth+", 70%, 50%)",
			width: currentHealth * pixelsPerHP
		});
		
	};
	
	/**
	 * Draws the engine/power/throttle indicator
	 */
	this.drawThrottle = function () {
		//increment the current throttle and the max speed with + 1 because the neutral speed is -1 instead of 0
		var currentThrottle = game.plane.dx + 1;
		var maxSpeed = game.planeStats[game.selectedPlane].MAX_SPEED + 1;
		
		var throttleBar = element.find(".throttle-bar");
		var throttle = throttleBar.find(".current");
		
		//calculate the pixels per throttle
		var pixelsPerThrottle = throttleBar.width() / maxSpeed;
		
		//calculate the hue per throttle
		var huePerThrottle = (this.maxHue / maxSpeed);
		
		//calculate the hue (green for low power and red for high power)
		var hue = this.maxHue - (huePerThrottle*currentThrottle);
		
		throttle.css({
			backgroundColor: "hsl("+hue+", 70%, 50%)",
			width: currentThrottle * pixelsPerThrottle
		});
	};
}