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
	
	//stats
	this.damage = game.plane.planeStats.DAMAGE;
	
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

		if (this.angle !== 0) {
			this.rotateBullet(this.angle);
		}
		//otherwise draw it in it's normal state
		else {
			this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
		}

	};

	/**
	 * Rotates the bullet by the specified angle/degrees
	 * @param {Number} angle
	 */
	this.rotateBullet = function (angle) {
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width / 2, this.y + this.currentImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width / 2), -(this.currentImage.height / 2) + game.background.offset);

		//and restore the co-ords to how they were when we began
		this.context.restore();
	};

}
