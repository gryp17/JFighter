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
	this.context = game.contexts["PLANE"].context;
	this.canvas = game.contexts["PLANE"].canvas;

	this.explosionImages = game.images.EXPLOSION;

	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;

	//sprite variables
	this.sprite = new Sprite(this.explosionImages, 5, false);

	//sprite variables
	this.spriteIndex = 0;
	this.currentImage = game.images.PROJECTILES.PLANE_BOMB;
	this.frames = 5;
	this.limit = 5;
	this.reverseOrder = false;

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

			//update the "currentImage" with the correct sprite image
			this.updateSprite();
		}

		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		this.currentImage = this.sprite.move();

		//if we have reached the end of the sprite images - display the bomb hole
		if (this.currentImage === null) {
			this.explosionActive = false;
			this.currentImage = game.images.BOMB_HOLE;
		}
	};

}
