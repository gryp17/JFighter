function PlaneBullet(planeContext, x, y, dx, dy, angle) {
	this.context = planeContext.context;
	this.canvas = planeContext.canvas;
	this.bulletImage = IMAGE_REPOSITORY.images.PROJECTILES.BULLET;
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;
	this.offset = 0;

	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		if(angle !== 0){
			this.rotateBullet(angle);
		}
		//otherwise draw it in it's normal state
		else {
			this.context.drawImage(this.bulletImage, this.x, this.y);
		}

	};
	
	/**
	 * Rotates the bullet by the specified angle/degrees
	 * @param {int} angle
	 */
	this.rotateBullet = function (angle) {
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.bulletImage.width / 2, this.y + this.bulletImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.bulletImage, -(this.bulletImage.width / 2), -(this.bulletImage.height / 2));

		//and restore the co-ords to how they were when we began
		this.context.restore();
	};

}
