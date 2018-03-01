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
	this.bombHole = game.images.BOMB_HOLE;

	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;

	//sprite variables
	this.bombSprite = new Sprite(this.bombImages, 10, true);
	this.explosionSprite = new Sprite(this.explosionImages, 5, false);
	this.currentImage;

	//bomb state
	this.exploded = false; //the bomb has reached the floor and has exploded
	this.explosionActive = false; //the explosion is still active and does damage

	/**
	 * Draws the plane bomb
	 */
	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//make the bomb explode when it reaches the ground
		if (this.y > this.canvas.height - 30 || this.explosionActive === true) {
			this.dx = -2;
			this.dy = 0;

			//if the bomb hasn't exploded yet - adjust the explosion coordinates based on the bomb coordinates
			if (this.exploded === false) {
				this.x = this.x - this.explosionImages[0].width / 3;
				this.y = this.y - this.explosionImages[0].height + 10;

				this.exploded = true;
				this.explosionActive = true;
			}
		}
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();

		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {

		if(this.exploded === false){
			this.currentImage = this.bombSprite.move();
		}else{
			this.currentImage = this.explosionSprite.move();
		}

		//if we have reached the end of the sprite images - display the bomb hole
		if (this.currentImage === null) {
			this.explosionActive = false;
			this.currentImage = this.bombHole;
		}
	};

}
