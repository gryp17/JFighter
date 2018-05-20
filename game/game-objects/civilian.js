/**
 * Class that represents the civilians
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Civilian}
 */
function Civilian(game, x, y) {
	var self = this;
	this.context = game.contexts.civilians.context;
	this.canvas = game.contexts.civilians.canvas;
	
	//random civilian skin
	this.images = game.images.CIVILIANS[_.random(0, game.images.CIVILIANS.length - 1)];
	
	//positioning and speed
	this.dx = game.background.dx - 0.5;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//status
	this.active = true;
	this.dead = false;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 7, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.length - 1)); //start from a random sprite index

	/**
	 * Draws the civilian object
	 */
	this.draw = function () {
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
							
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
	

	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		if(this.dead === false){
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Makes the civilian die
	 */
	this.die = function (){
		//increment the global dead civilians counter
		game.deadCivilians++;
		
		this.dead = true;
		this.y = 580;
		this.dx = game.background.dx;
		this.currentImage = this.images.DEAD;
	};
	
	/**
	 * Returns the civilian hitbox
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
