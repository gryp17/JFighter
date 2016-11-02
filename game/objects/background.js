function Background(backgroundContext, imageRepository) {
	this.context = backgroundContext.context;
	this.canvas = backgroundContext.canvas;
	this.dx = -2;
	this.x = 0;
	this.dy = 0;
	this.y = -145;

	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		this.context.drawImage(imageRepository.images.BACKGROUND, this.x, this.y);
		this.context.drawImage(imageRepository.images.BACKGROUND, this.x + imageRepository.images.BACKGROUND.width, this.y);

		//reset the background position and start over again
		if (this.x < imageRepository.images.BACKGROUND.width * -1) {
			this.x = 0;
		}

		//top end of canvas
		if (this.y > 0) {
			this.dy = 0;
			this.y = 0;
		}

		//bottom end of canvas
		if (this.y < (imageRepository.images.BACKGROUND.height - this.canvas.height) * -1) {
			this.dy = 0;
			this.y = (imageRepository.images.BACKGROUND.height - this.canvas.height) * -1;
		}


	};
}
