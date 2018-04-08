/**
 * Class used for the plane bombs
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @returns {PlaneBomb}
 */
function PlaneBomb(game, x, y, dx, dy) {
	this.context = game.contexts.projectiles.context;
	this.canvas = game.contexts.projectiles.canvas;

	this.bombImages = game.images.PROJECTILES.PLANE_BOMB;
	this.explosionImages = game.images.EXPLOSION;

	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;
	
	//stats
	this.explosionRadius = game.plane.stats.BOMB_EXPLOSION_RADIUS;

	//sprite variables
	this.sprite = new Sprite(this.bombImages, 10, true);
	this.currentImage;

	//bomb state
	this.active = true;

	/**
	 * Draws the plane bomb
	 */
	this.draw = function () {
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
	
	/**
	 * Sets the bomb as inactive and adds an explosion object
	 * @param {Boolean} showBombHole
	 */
	this.explode = function (showBombHole) {
		this.active = false;

		//calculate the explosion coordinates
		var explosionX = this.x - this.explosionImages[0].width / 3;
		var explosionY = this.y - this.explosionImages[0].height / 2;

		game.explosions.push(new Explosion(game, explosionX, explosionY, -2, 0, showBombHole));
		
		//add the bomb hole object
		if(showBombHole){
			game.bombHoles.push(new BombHole(game, explosionX, explosionY));
		}
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		this.currentImage = this.sprite.move();
	};
	
	/**
	 * Returns the plane bomb hitbox
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
	 * Returns the plane bomb explosion hitbox
	 * @returns {Object}
	 */
	this.getExplosionHitbox = function (){
		var hitbox = this.getHitbox();
		hitbox.x = hitbox.x - this.explosionRadius;
		hitbox.width = hitbox.width + this.explosionRadius;
		return hitbox;
	};

}
