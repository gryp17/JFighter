/**
 * Class used for the player's plane bullets
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} angle
 * @returns {PlaneBullet}
 */
function PlaneBullet(game, x, y, dx, dy, angle) {
	this.context = game.contexts.plane.context;
	this.canvas = game.contexts.plane.canvas;
		
	this.currentImage = game.images.PROJECTILES.BULLET;
		
	//flag that indicates that the bullet is still active/flying/inside the screen
	this.active = true;
	
	//stats
	this.damage = game.plane.stats.DAMAGE;
	
	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;
	this.angle = angle;

	/**
	 * Draws the plane bullet
	 */
	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width / 2, this.y + this.currentImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(this.angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width / 2), -(this.currentImage.height / 2) + game.background.offset);

		//and restore the co-ords to how they were when we began
		this.context.restore();
	};

	/**
	 * Returns the bullet hitbox
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
