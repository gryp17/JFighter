import BulletImpact from '@/game/game-objects/misc/bullet/bullet-impact';

/**
 * Class used for the game bullets
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} angle
 * @param {Plane|Fighter|Sherman} source
 * @returns {Bullet}
 */
export default function Bullet(game, x, y, dx, dy, angle, source) {
	this.context = game.contexts.projectiles.context;
	this.canvas = game.contexts.projectiles.canvas;
		
	this.currentImage = game.images.PROJECTILES.BULLET;
		
	//flag that indicates that the bullet is still active/flying/inside the screen
	this.active = true;
	
	//stats
	this.damage = source.stats.DAMAGE;
	
	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;
	this.angle = angle;

	/**
	 * Draws the bullet
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

	/**
	 * Sets the bullet as inactive and adds a bullet impact object in it's place
	 */
	this.explode = function (){
		this.active = false;
		game.bulletImpacts.push(new BulletImpact(game, this.x + this.currentImage.width, this.y));
	};

	/**
	 * Returns the bullet hitbox
	 * @returns {Object}
	 */
	this.getHitbox = function () {
		return {
			x: this.x,
			y: this.y,
			width: this.currentImage.width,
			height: this.currentImage.height,
			offset: game.background.offset
		};
	};

}
