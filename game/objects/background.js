function Background(backgroundContext, imageRepository) {
	this.context = backgroundContext.context;
	this.canvas = backgroundContext.canvas;
	this.speed = 2;
	this.x = 0;
	this.y = 0;

	this.draw = function () {
		this.x = this.x - this.speed;
		this.context.drawImage(imageRepository.images.BACKGROUND, this.x, this.y);
		this.context.drawImage(imageRepository.images.BACKGROUND, this.x + this.canvas.width, this.y);

		if (this.x < this.canvas.width * -1) {
			this.x = 0;
		}
	};

}