function Obstacle(gameContexts, x, y) {	
	var self = this;
	this.context = gameContexts["ENEMIES"].context;
	this.canvas = gameContexts["ENEMIES"].canvas;
	this.planeImages = IMAGE_REPOSITORY.images.PLANES["STUKA"];
	this.spriteIndex = 0;
	this.currentImage = this.planeImages.SPRITE[0];
	this.dx = -1;
	this.x = x;
	this.dy = 0;
	this.y = y;

	this.frames = 0;
	this.limit = 2;

	/**
	 * Draws the plane object
	 */
	this.draw = function (backgroundObject) {
		this.frames++;

		//if the limit has been reached show the next sprite image
		if (this.frames > this.limit) {
			this.spriteIndex++;

			if (_.isUndefined(this.planeImages.SPRITE[this.spriteIndex])) {
				this.spriteIndex = 0;
			}

			this.currentImage = this.planeImages.SPRITE[this.spriteIndex];
			this.frames = 0;
		}
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		//clear the rectangle around the plane/obstacle
		this.context.clearRect(this.x - 5, this.y + backgroundObject.offset - 5, this.currentImage.width + 10, this.currentImage.height + 10);
		
		//draw the image
		this.context.drawImage(this.currentImage, this.x, this.y + backgroundObject.offset);
	};

}
