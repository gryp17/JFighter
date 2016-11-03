function Plane(planeContext, planeType, imageRepository) {
	var self = this;
	this.context = planeContext.context;
	this.canvas = planeContext.canvas;
	this.planeImages = imageRepository.images.PLANES[planeType];
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
		this.context.clearRect(this.x - 5, this.y - 5, this.currentImage.width + 5, this.currentImage.height + 5);

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.checkForCollisions();

		this.context.drawImage(this.currentImage, this.x, this.y);

	};


	/**
	 * Checks if the plane has reached the top, bottom, left or right end of the screen
	 */
	this.checkForCollisions = function () {
		//top end of screen
		if (this.y < 0) {
			this.y = 0;
		}

		//left end of screen
		if (this.x < 0) {
			this.x = 0;
		}

		//right end of screen
		if (this.x + this.currentImage.width > this.canvas.width) {
			this.x = this.canvas.width - this.currentImage.width;
			this.dx = -1;
		}

		//bottom end of screen
		if (this.y + this.currentImage.height > this.canvas.height - 50) {
			this.y = this.canvas.height - this.currentImage.height - 50;
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
			if (self.dx < 3) {
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
