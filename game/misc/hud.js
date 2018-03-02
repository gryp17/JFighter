/**
 * Class used for displaying the HUD elements of the game
 * @param {Game} game
 * @param {Object} element
 * @returns {HUD}
 */
function HUD(game, element) {	
	this.visible = false;
	
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
		var health = healthBar.find(".current-health");

		//calculate the pixels per HP
		var pixelsPerHP = healthBar.width() / maxHealth;
		
		//calculate the hue per HP
		var huePerHP = maxHealth / 130;

		health.css({
			backgroundColor: "hsl("+huePerHP*currentHealth+", 70%, 50%)",
			width: currentHealth * pixelsPerHP
		});
		
	};
}