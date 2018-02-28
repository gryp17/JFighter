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
		
		//always fly higher than the fighter plane
		this.avoidFighters();
		
		if(this.checkForCollisions()){
			console.log("######## COLLISION ####### "+new Date().getTime());
		}
		
		this.checkForBulletsDamage();
		
		//rotate the bomber if it's ascending or descending
		if (this.dy > 0) {
			this.angle = this.dy * -1;
		} else if (this.dy < 0) {
			this.angle = this.dy * -1;
		}else{
			this.angle = 0;
		}
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		this.drawBomber();
	};
	
	/**
	 * Helper function that draws the bomber and rotates it depending on the angle property
	 */
	this.drawBomber = function () {
		//clear the rectangle around the plane/obstacle
		this.context.clearRect(this.x - 5, this.y + game.background.offset - 5, this.currentImage.width + 10, this.currentImage.height + 10);
		
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width / 2, this.y + game.background.offset + this.currentImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(this.angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width / 2), -(this.currentImage.height / 2));
		
		//and restore the co-ords to how they were when we began
		this.context.restore();
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
	
	/**
	 * Try to avoid the fighter plane by always flying higher
	 */
	this.avoidFighters = function (){
		var horizontalDistance = this.x - game.plane.x + game.plane.currentImage.width;
		var verticalDistance = (this.y + game.background.offset + this.currentImage.height) - game.plane.y;
		
		//if the fighter gets too close - fly up
		if(horizontalDistance > 0 && horizontalDistance < this.canvas.width - 300 && verticalDistance > -100){
			this.dy = -1;
		}else{
			this.dy = 0;
		}
	};

}
