function PlaneBullet(planeContext, x, y, dx, dy) {
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

		this.context.drawImage(this.bulletImage, this.x, this.y);
	};

}
