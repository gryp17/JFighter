/**
 * Class used for the game explosions
 * @param {Game} game
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Boolean} showBombHole
 * @returns {Explosion}
 */
function Explosion(game, x, y, dx, dy, showBombHole) {
	this.context = game.contexts.projectiles.context;
	this.canvas = game.contexts.projectiles.canvas;

	this.explosionImages = game.images.EXPLOSION;
	this.bombHoleImage = game.images.BOMB_HOLE;

	//positioning and speed
	this.dx = dx;
	this.x = x;
	this.dy = dy;
	this.y = y;

	//explosion state state
	this.active = true; //the explosion is still active and does damage
	this.showBombHole = showBombHole;
	
	//sprite variables
	this.spriteDelay = showBombHole ? 5 : 2;
	this.sprite = new Sprite(this.explosionImages, this.spriteDelay, false);
	this.currentImage;
	
	//bomb hole
	this.bombHole;

	/**
	 * Draws the explosion
	 */
	this.draw = function () {
		//update the "currentImage" with the correct sprite image
		this.updateSprite();

		if (this.active) {
			this.x = this.x + this.dx;
			this.y = this.y + this.dy;

			//check if the explosion has left the screen
			if (this.x + this.currentImage.width < 0) {
				this.active = false;
			}

			this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
		}
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		this.currentImage = this.sprite.move();

		//if we have reached the end of the sprite images
		if (this.currentImage === null) {
			//display the bomb hole if the option is enabled
			if(this.showBombHole){
				game.bombHoles.push(new BombHole(game, this.x, this.y - 120));
			}
			
			this.active = false;
		}
	};

}
