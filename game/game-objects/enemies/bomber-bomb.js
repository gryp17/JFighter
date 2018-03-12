/**
 * Class used for the bomber bombs
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @returns {BomberBomb}
 */
function BomberBomb(game, x, y, dx, dy) {
	this.context = game.contexts.enemies.context;
	this.canvas = game.contexts.enemies.canvas;

	this.bombImages = game.images.PROJECTILES.BOMBER_BOMB;
	this.explosionImages = game.images.EXPLOSION;

	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;

	//sprite variables
	this.sprite = new Sprite(this.bombImages, 10, true);
	this.currentImage;

	//bomb state
	this.active = true;

	/**
	 * Draws the bomber bomb
	 */
	this.draw = function () {
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//check if the bomb has left the screen
		if(this.x + this.currentImage.width < 0){
			this.active = false;
		}

		//make the bomb explode when it reaches the ground
		if (this.y + this.currentImage.height > this.canvas.height - 15) {
			this.explode();
		}
		
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
	
	/**
	 * Sets the bomb as inactive and adds an explosion object
	 */
	this.explode = function () {
		this.active = false;

		//calculate the explosion coordinates
		var explosionX = this.x - this.explosionImages[0].width / 3;
		var explosionY = this.y + this.currentImage.height - this.explosionImages[0].height;

		game.explosions.push(new Explosion(game, explosionX, explosionY, -2, 0, true));
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		this.currentImage = this.sprite.move();
	};

}
