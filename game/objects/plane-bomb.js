/**
 * Class used for the plane bombs
 * @param {Object} gameContexts
 * @param {Background} background
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @returns {PlaneBomb}
 */
function PlaneBomb(gameContexts, background, x, y, dx, dy) {
	this.context = gameContexts["PLANE"].context;
	this.canvas = gameContexts["PLANE"].canvas;

	//background object that is used mostly for accessing the background vertical offset
	this.background = background;

	this.explosionImages = IMAGE_REPOSITORY.images.EXPLOSION;

	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;

	//sprite variables
	//this.sprite = new Sprite(this.explosionImages.SPRITE, 2);
	//this.currentImage;

	//sprite variables
	this.spriteIndex = 0;
	this.currentImage = IMAGE_REPOSITORY.images.PROJECTILES.PLANE_BOMB;
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

			this.frames++;

			//if the limit has been reached show the next sprite image
			if (this.frames > this.limit) {

				//increment/decrement the sprite index
				if (this.reverseOrder) {
					this.spriteIndex--;
				} else {
					this.spriteIndex++;
				}

				//if all sprites have been looped thru
				if (_.isUndefined(this.explosionImages[this.spriteIndex])) {

					//if the sprites have been looped thru in reverse order as well - disable the explosion and show the bomb hole
					if (this.reverseOrder) {
						this.explosionActive = false;
						this.currentImage = IMAGE_REPOSITORY.images.BOMB_HOLE;
					}
					//otherwise reverse the order and make the explosion smaller slowly
					else {
						this.reverseOrder = true;
						this.limit = 10;
					}

				} else {
					this.currentImage = this.explosionImages[this.spriteIndex];
				}

				this.frames = 0;
			}
		}

		this.context.drawImage(this.currentImage, this.x, this.y + background.offset);
	};

}
