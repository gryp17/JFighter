function Background(backgroundContext, imageRepository) {
	this.context = backgroundContext.context;
	this.canvas = backgroundContext.canvas;
	this.dx = -2;
	this.x = 0;
	this.dy = 0;
	this.y = -145;

	this.draw = function (planeObject) {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//reset the background horizontal position and start over again
		if (this.x < imageRepository.images.BACKGROUND.width * -1) {
			this.x = 0;
		}
		
		//move the background up or down (vertically) depending on the plane movement
		this.moveBackgroundVertically(planeObject);

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


		this.context.drawImage(imageRepository.images.BACKGROUND, this.x, this.y);
		this.context.drawImage(imageRepository.images.BACKGROUND, this.x + imageRepository.images.BACKGROUND.width, this.y);

	};

	/**
	 * Moves the background up or down depending on the plane movement/direction
	 * @param {Object} planeObject
	 */
	this.moveBackgroundVertically = function (planeObject) {
		//if the plane is moving up or down
		if (planeObject.dy !== 0) {
			//var difference = planeObject.y - (this.canvas.height / 2);
			var middle = this.canvas.height / 2;

			//if the plane is moving up - move the background up
			if ((planeObject.y < middle) && planeObject.dy < 0) {
				this.dy = planeObject.dy * -1.3;
			}
			//if the plane is moving down - - move the background down
			else if (planeObject.dy > 0) {
				this.dy = planeObject.dy * -1.3;
			}
		}
		//otherwise stop moving the background
		else {
			this.dy = 0;
		}
	};

}
