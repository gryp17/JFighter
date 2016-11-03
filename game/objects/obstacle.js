function Obstacle(context) {
	var self = this;
	this.context = context.context;
	this.canvas = context.canvas;
	this.planeImages = IMAGE_REPOSITORY.images.PLANES["STUKA"];
	this.spriteIndex = 0;
	this.currentImage = this.planeImages.SPRITE[0];
	this.dx = -1;
	this.x = 1000;
	this.dy = 0;
	this.y = 400;

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
				;
			}

			this.currentImage = this.planeImages.SPRITE[this.spriteIndex];
			this.frames = 0;
		}
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		this.context.drawImage(this.currentImage, this.x, this.y + backgroundObject.offset);
	};

}
