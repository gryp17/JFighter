function Background(backgroundContext, selectedLevel) {
	this.context = backgroundContext.context;
	this.canvas = backgroundContext.canvas;
	this.backgroundImage = IMAGE_REPOSITORY.images.LEVELS[selectedLevel];
	this.dx = -2;
	this.x = 0;
	this.dy = 0;
	//calculate the difference between the image height and the canvas height and pin the background to the bottom
	this.y = this.canvas.height - this.backgroundImage.height;
	this.offset = 0;

	this.draw = function (planeObject) {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//reset the background horizontal position and start over again
		if (this.x < this.backgroundImage.width * -1) {
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
		if (this.y < (this.backgroundImage.height - this.canvas.height) * -1) {
			this.dy = 0;
			this.y = (this.backgroundImage.height - this.canvas.height) * -1;
		}
		
		//calculate the difference between the canvas height and the backgroundImage height and the necessary offset in order to "not move" the rest of the objects
		var heightDifference = this.canvas.height - this.backgroundImage.height;
		this.offset = this.y - heightDifference;

		this.context.drawImage(this.backgroundImage, this.x, this.y);
		this.context.drawImage(this.backgroundImage, this.x + this.backgroundImage.width, this.y);

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
