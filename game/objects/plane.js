function Plane(planeContext, planeType) {
	var self = this;
	this.context = planeContext.context;
	this.canvas = planeContext.canvas;
	this.planeStats = PLANES_STATS[planeType];
	this.planeImages = IMAGE_REPOSITORY.images.PLANES[planeType];
	this.spriteIndex = 0;
	this.currentImage = this.planeImages.SPRITE[0];
	this.dx = 1;
	this.x = 300;
	this.dy = 0;
	this.y = 350;

	this.frames = 0;
	this.limit = 2;

	/**
	 * Draws the plane object
	 */
	this.draw = function () {
		this.frames++;

		//if the limit has been reached show the next sprite image
		if (this.frames > this.limit) {
			this.spriteIndex++;

			if (_.isUndefined(this.planeImages.SPRITE[this.spriteIndex])) {
				this.spriteIndex = 0;
				;
			}

			this.currentImage = this.planeImages.SPRITE[this.spriteIndex];

			this.frames = 0;
		}

		//clear the rectangle around the plane
		//this.context.clearRect(this.x - 5, this.y - 5, this.currentImage.width + 5, this.currentImage.height + 5);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.checkForCollisions();
		
		//if the plane is ascending or descending rotate it
		if(this.dy > 0){
			this.rotatePlane(this.dy * this.planeStats.DESCEND_SPEED);
		} else if(this.dy < 0){
			this.rotatePlane(this.dy * this.planeStats.CLIMB_SPEED);
		}
		//otherwise draw it in it's normal state
		else{
			this.context.drawImage(this.currentImage, this.x, this.y);
		}
		
	};
	
	/**
	 * Rotates the plane
	 * @param {int} angle
	 */
	this.rotatePlane = function (angle){
		this.context.save(); 

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width/2, this.y + this.currentImage.height/2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(angle * Math.PI/180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width/2), -(this.currentImage.height/2));

		//and restore the co-ords to how they were when we began
		this.context.restore(); 
	};
	

	/**
	 * Checks if the plane has reached the top, bottom, left or right end of the screen
	 */
	this.checkForCollisions = function () {
		//top end of screen
		if (this.y < 0) {
			this.y = 0;
			this.dy = 0;
		}

		//left end of screen
		if (this.x < 0) {
			this.x = 0;
			this.dx = 0;
		}

		//right end of screen
		if (this.x + this.currentImage.width > this.canvas.width) {
			this.x = this.canvas.width - this.currentImage.width;
			this.dx = -1;
		}

		//bottom end of screen
		if (this.y + this.currentImage.height > this.canvas.height - 50) {
			this.y = this.canvas.height - this.currentImage.height - 50;
			this.dy = 0;
		}
	};

	//keyboard controls
	$("body").keydown(function (e) {

		//left
		if (e.which === 37 || e.which === 65) {
			if (self.dx > -1) {
				self.dx = self.dx - 1;
			}
		}

		//right
		if (e.which === 39 || e.which === 68) {
			if (self.dx < self.planeStats.MAX_SPEED) {
				self.dx = self.dx + 1;
			}
		}

		//top
		if (e.which === 38 || e.which === 87) {
			if (self.dy > -3) {
				self.dy = self.dy - 1;
			}
		}

		//bottom
		if (e.which === 40 || e.which === 83) {
			if (self.dy < 3) {
				self.dy = self.dy + 1;
			}
		}

	});

}
