/**
 * Class that represents the enemy tanks (Shermans)
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Bomber}
 */
function Sherman(game, x, y) {
	this.context = game.contexts.groundEnemies.context;
	this.canvas = game.contexts.groundEnemies.canvas;
			
	this.images = game.images.ENEMIES.SHERMAN;
	
	//stats
	this.stats = game.enemyStats.SHERMAN;
	
	//state
	this.health = this.stats.HEALTH;
	this.destroyed = false;
	this.active = true; //draw the object as long as this is set to true
	
	//positioning and speed
	this.dx = game.background.dx - 0.8;;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 2, true);
	this.currentImage = this.images.SPRITE[0];

	/**
	 * Draws the plane object
	 */
	this.draw = function () {
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		//draw the sherman
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
		
		
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		//if the sherman has been destroyed show the destroyed image
		if (this.destroyed === true) {
			this.currentImage = this.images.DESTROYED;
		}else{
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Destroys the sherman
	 */
	this.destroy = function (){
		this.health = 0;
		this.destroyed = true;
		this.dx = game.background.dx;
	};
	
	/**
	 * Returns the sherman hitbox
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
	
	/**
	 * Returns the sherman hull hitbox (the hitbox without the turret)
	 * @returns {Object}
	 */
	this.getHullHitbox = function () {
		var turretWidth = this.currentImage.width / 4;
		var hitbox = this.getHitbox();
		
		//modify the hitbox
		hitbox.x = hitbox.x + turretWidth;
		hitbox.width = hitbox.width - turretWidth;
		
		return hitbox;
	};
}
