/**
 * Class used for generating raindrops
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} width
 * @param {Number} height
 * @returns {Raindrop}
 */
export default function Raindrop(game, x, y, dx, dy, width, height) {
	this.context = game.contexts.weather.context;
	this.canvas = game.contexts.weather.canvas;

	//positioning and speed
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	
	//raindrop parameters
	this.width = width;
	this.height = height;
	this.color = "rgba(174, 194, 224, 0.5)";

	/**
	 * Draws the raindrop
	 */
	this.draw = function () {
				
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.context.lineWidth = this.width;
		this.context.lineCap = "round";

		this.context.strokeStyle = this.color;
	   
		this.context.beginPath();
		this.context.moveTo(this.x, this.y);
		this.context.lineTo(this.x, this.y + this.height);
		this.context.stroke();
	};
	
	/**
	 * Resets the raindrop parameters in order to make the raindrop appear in the sky again
	 */
	this.reset = function () {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.width = width;
		this.height = height;
	};
}