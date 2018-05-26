/**
 * Class that represents the enemy soldiers
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Soldier}
 */
function Soldier(game, x, y) {
	this.context = game.contexts.groundEnemies.context;
	this.canvas = game.contexts.groundEnemies.canvas;
			
	//random soldier skin
	this.images = game.images.ENEMIES.SOLDIER[_.random(0, game.images.ENEMIES.SOLDIER.length - 1)];
	
	//stats
	this.stats = game.enemyStats.SOLDIER;
	
	//state
	this.health = this.stats.HEALTH;
	this.dead = false;
	this.active = true; //draw the object as long as this is set to true
	
	//positioning and speed
	this.dx = game.background.dx - 0.3;;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 5, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.length - 1)); //start from a random sprite index
	
	/**
	 * Draws the soldier object
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
	 * Returns the soldier hitbox
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
