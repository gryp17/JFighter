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
		
		if(this.checkForBulletsDamage()){
			console.log("######## BULLET HIT ####### "+new Date().getTime());
		}
		
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
	 * Checks if the plane has collided with the obstacle
	 * @returns {Boolean}
	 */
	this.checkForCollisions = function (){
		var result = false;
		
		var planeLeft = game.plane.x;
		var planeTop = game.plane.y;
		var planeRight = planeLeft + game.plane.currentImage.width;
		var planeBottom = game.plane.y + game.plane.currentImage.height;
		
		var obsLeft = this.x;
		var obsTop = this.y + game.background.offset;
		var obsRight = obsLeft + this.currentImage.width;
		var obsBottom = this.y + game.background.offset + this.currentImage.height;
		
		var horizontalOverlap = Math.max(0, Math.min(planeRight, obsRight) - Math.max(planeLeft, obsLeft));
        var verticalOverlap = Math.max(0, Math.min(planeBottom, obsBottom) - Math.max(planeTop, obsTop));
		
		if(horizontalOverlap !== 0 && verticalOverlap !== 0){
			result = true;
		}
		
		return result;
	};

	
	/**
	 * Checks if the plane bullets have hit the obstacle
	 * @returns {Boolean}
	 */
	this.checkForBulletsDamage = function (){
		var result = false;
		
		game.plane.bullets.forEach(function (bullet){
			
			var bulletLeft = bullet.x;
			var bulletTop = bullet.y + game.background.offset;
			var bulletRight = bulletLeft + bullet.bulletImage.width;
			var bulletBottom = bullet.y + game.background.offset + bullet.bulletImage.height;

			var obsLeft = self.x;
			var obsTop = self.y + game.background.offset;
			var obsRight = obsLeft + self.currentImage.width;
			var obsBottom = self.y + game.background.offset + self.currentImage.height;

			var horizontalOverlap = Math.max(0, Math.min(bulletRight, obsRight) - Math.max(bulletLeft, obsLeft));
			var verticalOverlap = Math.max(0, Math.min(bulletBottom, obsBottom) - Math.max(bulletTop, obsTop));

			if(horizontalOverlap !== 0 && verticalOverlap !== 0){
				result = true;
			}
			
		});
		
		return result;
	};

}