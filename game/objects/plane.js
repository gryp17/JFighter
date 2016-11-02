function Plane(planeContext, planeType, imageRepository) {
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

	this.draw = function () {		
		this.frames++;

		//if the limit has been reached show the next sprite image
		if(this.frames > this.limit){
			this.spriteIndex++;
			
			if(_.isUndefined(this.planeImages.SPRITE[this.spriteIndex])){
				this.spriteIndex = 0;;
			}

			this.currentImage = this.planeImages.SPRITE[this.spriteIndex];

			this.frames = 0;
		}
		
		//clear the rectangle around the plane
		this.context.clearRect(this.x - 5, this.y - 5, this.currentImage.width + 5, this.currentImage.height + 5);

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		this.context.drawImage(this.currentImage, this.x, this.y);

	};
}
