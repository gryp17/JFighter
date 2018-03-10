/**
 * Class that represents the civilians
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Civilian}
 */
function Civilian(game, x, y) {
	var self = this;
	this.context = game.contexts.enemies.context;
	this.canvas = game.contexts.enemies.canvas;
			
	this.images = game.images.CIVILIAN;
	
	//positioning and speed
	this.dx = -2.5;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 7, true);
	this.currentImage;

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
		if(this.x > 400){
			this.currentImage = this.sprite.move();
		}else{
			this.y = 580;
			this.dx = -2;
			this.currentImage = this.images.DEAD;
		}
	};

}
