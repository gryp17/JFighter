/**
 * Class that handles the game background
 * @param {Game} game
 * @returns {Background}
 */
function Background(game) {
	this.context = game.contexts.background.context;
	this.canvas = game.contexts.background.canvas;
	
	this.backgroundImage = game.images.LEVELS[game.levelsData[game.selectedLevel].THEME];
	this.dx = -2;
	this.x = 0;
	this.dy = 0;
		
	//the point where the ground begins (used mostly to check if any of the game objects has collided with the ground)
	this.groundHeight = game.levelsData[game.selectedLevel].GROUND_HEIGHT;
	
	//calculate the difference between the image height and the canvas height and pin the background to the bottom
	this.y = this.canvas.height - this.backgroundImage.height;
	this.offset = 0;

	/**
	 * Draws the background
	 */
	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//reset the background horizontal position and start over again
		if (this.x < this.backgroundImage.width * -1) {
			this.x = 0;
		}
		
		//move the background up or down (vertically) depending on the plane movement
		this.moveBackgroundVertically(game.plane);

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
	 * @param {Plane} plane
	 */
	this.moveBackgroundVertically = function (plane) {
		//if the plane is moving up or down
		if (plane.dy !== 0) {
			//var difference = plane.y - (this.canvas.height / 2);
			var middle = this.canvas.height / 2;

			//if the plane is moving up - move the background up
			if ((plane.y < middle) && plane.dy < 0) {
				this.dy = plane.dy * -1.3;
			}
			//if the plane is moving down - move the background down
			else if (plane.dy > 0) {
				this.dy = plane.dy * -1.3;
			}
		}
		//otherwise stop moving the background
		else {
			this.dy = 0;
		}
	};

}
