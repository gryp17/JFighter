/**
 * Class used for generating snowflakes
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} radius
 * @returns {Snowflake}
 */
export default function Snowflake(game, x, y, dx, dy, radius) {
	this.context = game.contexts.weather.context;
	this.canvas = game.contexts.weather.canvas;

	//positioning and speed
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	
	//snowflake parameters
	this.radius = radius;
	this.color = 'rgba(255, 255, 255, 0.8)';

	/**
	 * Draws the snowflake
	 */
	this.draw = function () {
				
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.context.fillStyle = this.color;

		this.context.beginPath();
		this.context.arc(this.x, this.y + game.background.offset, this.radius, 0, 2 * Math.PI);
		this.context.fill();
	};
	
	/**
	 * Resets the snowflake parameters in order to make the snowflake appear in the sky again
	 */
	this.reset = function () {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
	};
}