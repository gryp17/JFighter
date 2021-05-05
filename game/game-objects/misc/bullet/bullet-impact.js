import Sprite from '@/game/misc/sprite';

/**
 * Bullet impact class that displays the bullet impact effect after a bullet hits anything
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @returns {BulletImpact}
 */
export default function BulletImpact(game, x, y) {
	this.context = game.contexts.projectiles.context;
	this.canvas = game.contexts.projectiles.canvas;
	
	this.impactImages = game.images.BULLET_IMPACT;
	
	this.active = true;
	
	//positioning and speed
	this.dx = 0;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//sprite variables
	this.impactSprite = new Sprite(this.impactImages, 5, false);
	this.currentImage;

	/**
	 * Draws the bullet impact
	 */
	this.draw = function () {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//update the "currentImage" with the correct sprite image
		this.updateSprite();

		if(this.active) {
			this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
		}
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		this.currentImage = this.impactSprite.move();
		
		//if the final image in the sprite has been reached - set the impact as inactive
		if(this.currentImage === null) {
			this.active = false;
		}
	};

}
