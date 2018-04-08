/**
 * Class used for the bomb holes
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @returns {BombHole}
 */
function BombHole(game, x, y) {
	this.context = game.contexts.background.context;
	this.canvas = game.contexts.background.canvas;

	this.currentImage = game.images.BOMB_HOLE;

	//positioning and speed
	this.dx = game.background.dx;
	this.x = x;
	this.dy = 0;
	this.y = y;
	this.angle = _.random(-30, 30);
	
	//status
	this.active = true;

	/**
	 * Draws the bomb hole
	 */
	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width / 2, this.y + this.currentImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(this.angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width / 2), -(this.currentImage.height / 2) + game.background.offset);

		//and restore the co-ords to how they were when we began
		this.context.restore();
	};

}
