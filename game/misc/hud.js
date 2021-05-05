/**
 * Class used for displaying the HUD elements of the game
 * @param {Game} game
 * @param {String} selector
 * @returns {HUD}
 */
export default function HUD(game, selector) {
	this.element = $(selector);
	this.visible = false;
	
	//color constants 
	this.maxHue = 130;
	this.maxPitchHue = 200;
	
	/**
	 * Shows the HUD
	 */
	this.show = function () {
		this.visible = true;
	};
	
	/**
	 * Hides the HUD
	 */
	this.hide = function () {
		this.visible = false;
	};
	
	/**
	 * Draws the HUD using the Game parameters
	 */
	this.draw = function () {
		this.element.css('display', this.visible ? 'block': 'none');
		
		if(this.visible) {
			this.drawHealth();
			this.drawThrottle();
			this.drawPitch();
			this.drawHeat();
			this.drawLoadedBombs();
			this.drawCiviliansStatus();
		}
	};
	
	/**
	 * Draws the health indicator
	 */
	this.drawHealth = function () {
		//get the current plane health and the max plane health
		var currentHealth = game.plane.health;
		var maxHealth = game.planeStats[game.selectedPlane].HEALTH;

		var healthBar = this.element.find('.health-bar');
		var health = healthBar.find('.current');

		//calculate the pixels per HP
		var pixelsPerHP = healthBar.width() / maxHealth;
		
		//calculate the hue per HP
		var huePerHP = this.maxHue / maxHealth;

		health.css({
			backgroundColor: 'hsl('+huePerHP*currentHealth+', 70%, 50%)',
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
		
		var throttleBar = this.element.find('.throttle-bar');
		var throttle = throttleBar.find('.current');
		
		//calculate the pixels per throttle
		var pixelsPerThrottle = throttleBar.width() / maxSpeed;
		
		//calculate the hue per throttle
		var huePerThrottle = this.maxHue / maxSpeed;
		
		//calculate the hue (green for low power and red for high power)
		var hue = this.maxHue - (huePerThrottle * currentThrottle);
		
		throttle.css({
			backgroundColor: 'hsl('+hue+', 70%, 50%)',
			width: currentThrottle * pixelsPerThrottle
		});
	};
	
	/**
	 * Draws the plane pitch indicator
	 */
	this.drawPitch = function () {
		//increment the current pitch and the max pitch with + 3 because there can be negative (-3) pitch when climbing
		var currentPitch = game.plane.dy + 3;
		var maxPitch = 6; //3 + 3
		
		var pitchBar = this.element.find('.pitch-bar');
		var pitch = pitchBar.find('.current');
		
		//calculate the pixels per pitch
		var pixelsPerPitch = pitchBar.height() / maxPitch;
		
		//calculate the hue per pitch
		var huePerPitch = this.maxPitchHue / maxPitch;
		
		//calculate the hue (greenish for regular pitch and red for extremely high or low pitch)
		var hue;
		if(currentPitch >= maxPitch / 2) {
			hue = this.maxPitchHue - (huePerPitch*currentPitch);
		}else{
			hue = huePerPitch*currentPitch;
		}
		
		pitch.css({
			backgroundColor: 'hsl('+hue+', 70%, 50%)',
			height: pitchBar.height() - (currentPitch * pixelsPerPitch)
		});
	};
	
	/**
	 * Draws the plane machine gun heat indicator
	 */
	this.drawHeat = function () {
		//get the current plane heat and the max plane heat
		var currentHeat = game.plane.machinegunHeat;
		var maxHeat = game.planeStats[game.selectedPlane].MAX_MACHINEGUN_HEAT;

		var heatBar = this.element.find('.heat-bar');
		var span = heatBar.find('span');
		var heat = heatBar.find('.current');

		//show the correct text inside the bar
		var text= game.plane.overheat ? 'OVERHEAT' : 'MACHINEGUN HEAT';

		//calculate the pixels per heat
		var pixelsPerHeat = heatBar.width() / maxHeat;
		
		//calculate the hue per heat
		var huePerHeat = this.maxHue / maxHeat;
		
		///calculate the hue (green for low heat and red for high heat)
		var hue = this.maxHue - (huePerHeat * currentHeat);

		heat.css({
			backgroundColor: 'hsl('+hue+', 70%, 50%)',
			width: currentHeat * pixelsPerHeat
		});
		
		span.html(text);
	};
	
	/**
	 * Draws the loaded bombs indicator
	 */
	this.drawLoadedBombs = function () {		
		var currentBombs = game.plane.loadedBombs;
		var maxLoadedBombs = game.plane.stats.MAX_BOMBS;
		
		var loadedBombsIndicator = this.element.find('.loaded-bombs');
		
		//generate the correct number of bombs with their classes
		loadedBombsIndicator.empty();
		for(var i = 0; i < maxLoadedBombs; i++) {
			var bomb = $('<img>', {
				src: 'img/hud/bomb_icon.png',
				class: i + 1 <= currentBombs ? 'loaded' : ''
			});
			
			loadedBombsIndicator.append(bomb);
		}
	};
	
	/**
	 * Draws the civilians status indicator
	 */
	this.drawCiviliansStatus = function () {
		var totalCivilians = game.levelsData[game.selectedLevel].CIVILIANS.length;
		var deadCivilians = game.deadCivilians;
		
		var civiliansStatus = this.element.find('.civilians-status');
				
		//generate the correct number of dead/alive civilians
		civiliansStatus.empty();
		for(var i = 0; i < totalCivilians; i++) {
			var civilian = $('<img>', {
				src: 'img/hud/running_civilian_icon.png',
				class: i + 1 <= deadCivilians ? 'dead' : ''
			});
			
			civiliansStatus.append(civilian);
		}
	};
}