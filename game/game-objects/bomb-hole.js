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
	this.dx = -2;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//status
	this.active = true;

	/**
	 * Draws the bomb hole
	 */
	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};

}
