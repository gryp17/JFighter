/**
 * Class that represents the enemy bombers
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Bomber}
 */
function Bomber(game, x, y) {
	var self = this;
	this.context = game.contexts["ENEMIES"].context;
	this.canvas = game.contexts["ENEMIES"].canvas;
			
	this.images = game.images.ENEMIES["B17"];
	
	//positioning and speed
	this.dx = -3;
	this.x = x;
	this.dy = 0;
	this.y = y;
	this.angle = 0;

	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 2, true);
	this.currentImage;

	/**
	 * Draws the plane object
	 */
	this.draw = function () {
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		if(this.checkForCollisions()){
			console.log("######## COLLISION ####### "+new Date().getTime());
		}
		
		this.checkForBulletsDamage();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		//clear the rectangle around the plane/obstacle
		this.context.clearRect(this.x - 5, this.y + game.background.offset - 5, this.currentImage.width + 10, this.currentImage.height + 10);
		
		//draw the image
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
	};
	
	/**
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		this.currentImage = this.sprite.move();
	};
	
	/**
	 * Checks if the plane has collided with the bomber
	 * @returns {Boolean}
	 */
	this.checkForCollisions = function (){		
		return Utils.intersect({
			x: game.plane.x,
			y: game.plane.y,
			width: game.plane.currentImage.width,
			height: game.plane.currentImage.height,
			offset: 0
		}, {
			x: this.x,
			y: this.y,
			width: this.currentImage.width,
			height: this.currentImage.height,
			offset: game.background.offset
		});
	};

	
	/**
	 * Checks if the plane bullets have hit the bomber
	 */
	this.checkForBulletsDamage = function (){
		
		game.plane.bullets.forEach(function (bullet){
			
			if(Utils.intersect({
				x: bullet.x,
				y: bullet.y,
				width: bullet.currentImage.width,
				height: bullet.currentImage.height,
				offset: game.background.offset
			}, {
				x: self.x,
				y: self.y,
				width: self.currentImage.width,
				height: self.currentImage.height,
				offset: game.background.offset
			})){
				console.log("######## BULLET HIT ####### "+new Date().getTime());
			}
			
		});
		
	};

}
