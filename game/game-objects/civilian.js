import Utils from '@/game/misc/utils';
import Sprite from '@/game/misc/sprite';

/**
 * Class that represents the civilians
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Civilian}
 */
export default function Civilian(game, x, y) {
	var self = this;
	this.context = game.contexts.civilians.context;
	this.canvas = game.contexts.civilians.canvas;
	
	//random civilian skin
	this.images = game.images.CIVILIANS[_.random(0, game.images.CIVILIANS.length - 1)];
	
	this.healthBarColor = '#00D40E';
	
	//positioning and speed
	this.dx = game.background.dx - 0.5;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//stats
	this.stats = game.civilianStats.CIVILIAN;
	
	//status
	this.active = true;
	this.health = this.stats.HEALTH;
	this.dead = false;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 7, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.length - 1)); //start from a random sprite index

	/**
	 * Draws the civilian object
	 */
	this.draw = function () {
		
		//if the civilian health reaches 0...
		if(this.health <= 0 && this.dead === false) {
			this.die();
		}
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
							
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
		
		//draw the health bar
		if(this.dead === false) {
			this.drawHealthBar();
		}
	};
	
	/**
	 * Draws a health bar on top of the object
	 */
	this.drawHealthBar = function () {
		var healthBar = Utils.generateHealthBar(this.getHitbox(), this.stats.HEALTH, this.health);
		
		//border
		this.context.strokeStyle = healthBar.strokeRect.style;
		this.context.strokeRect(healthBar.x, healthBar.y, healthBar.strokeRect.width, healthBar.strokeRect.height);
		
		//fill
		this.context.fillStyle = this.healthBarColor;
		this.context.fillRect(healthBar.x, healthBar.y, healthBar.fillRect.width, healthBar.fillRect.height);
	};

	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		if(this.dead === false) {
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Makes the civilian die
	 */
	this.die = function () {
		//increment the global dead civilians counter
		game.deadCivilians++;
		
		this.dead = true;
		this.y = 580;
		this.dx = game.background.dx;
		this.currentImage = this.images.DEAD;
		
		//check if all civilians are dead and display the game over menu
		var totalCivilians = game.levelsData[game.selectedLevel].CIVILIANS.length;
		var deadCivilians = game.deadCivilians;
		
		if(deadCivilians === totalCivilians) {
			game.plane.disable();
			game.menu.gameOver();
		}
	};
	
	/**
	 * Returns the civilian hitbox
	 * @returns {Object}
	 */
	this.getHitbox = function () {
		return {
			x: this.x,
			y: this.y,
			width: this.currentImage.width,
			height: this.currentImage.height,
			offset: game.background.offset
		};
	};

}
