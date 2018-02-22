function PlaneBullet(gameContexts, background, x, y, dx, dy, angle) {
	this.context = gameContexts["PLANE"].context;
	this.canvas = gameContexts["PLANE"].canvas;
	
	//background object that is used mostly for accessing the background vertical offset
	this.background = background;
	
	this.bulletImage = IMAGE_REPOSITORY.images.PROJECTILES.BULLET;
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;
	this.angle = angle;
	this.distance = 0;

	this.draw = function () {
		
		//increments the distance between the plane and the bullet (we are not using this.x because of the weird rotation...)
		this.distance = this.distance + this.dx;

		//rotate the canvas in order to rotate the bullet... converting our angle from degrees to radians
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle * Math.PI / 180);
        
		//clear the area around the bullet
        this.context.clearRect(this.distance - this.dx, -10, 50, 50);
        //this.context.rect(this.distance - this.dx, -10, 10 + 50, 2 + 50);
        //this.context.stroke();
        
		this.context.drawImage(this.bulletImage, this.distance, background.offset);
		
        //and restore the co-ords to how they were when we began
        this.context.restore();

	};

}
