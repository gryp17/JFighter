function Obstacle(gameContexts, background, plane, x, y) {	
	var self = this;
	this.context = gameContexts["ENEMIES"].context;
	this.canvas = gameContexts["ENEMIES"].canvas;
	
	//background object that is used mostly for accessing the background vertical offset
	this.background = background;
	
	//reference to the player's plane
	this.plane = plane;
	
	this.planeImages = IMAGE_REPOSITORY.images.PLANES["STUKA"];
	this.spriteIndex = 0;
	this.currentImage = this.planeImages.SPRITE[0];
	this.dx = -1;
	this.x = x;
	this.dy = 0;
	this.y = y;

	this.frames = 0;
	this.limit = 2;

	/**
	 * Draws the plane object
	 */
	this.draw = function () {
		
		if(this.checkForCollisions()){
			console.log("######## COLLISION ####### "+new Date().getTime());
		}
		
		if(this.checkForBulletsDamage()){
			console.log("######## BULLET HIT ####### "+new Date().getTime());
		}

		this.frames++;

		//if the limit has been reached show the next sprite image
		if (this.frames > this.limit) {
			this.spriteIndex++;

			if (_.isUndefined(this.planeImages.SPRITE[this.spriteIndex])) {
				this.spriteIndex = 0;
			}

			this.currentImage = this.planeImages.SPRITE[this.spriteIndex];
			this.frames = 0;
		}
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		//clear the rectangle around the plane/obstacle
		this.context.clearRect(this.x - 5, this.y + background.offset - 5, this.currentImage.width + 10, this.currentImage.height + 10);
		
		//draw the image
		this.context.drawImage(this.currentImage, this.x, this.y + background.offset);
	};
	
	/**
	 * Checks if the plane has collided with the obstacle
	 * @returns {Boolean}
	 */
	this.checkForCollisions = function (){
		var result = false;
		
		var planeLeft = this.plane.x;
		var planeTop = this.plane.y;
		var planeRight = planeLeft + this.plane.currentImage.width;
		var planeBottom = this.plane.y + this.plane.currentImage.height;
		
		var obsLeft = this.x;
		var obsTop = this.y + background.offset;
		var obsRight = obsLeft + this.currentImage.width;
		var obsBottom = this.y + background.offset + this.currentImage.height;
		
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
		
		this.plane.bullets.forEach(function (bullet){
			
			var bulletLeft = bullet.x;
			var bulletTop = bullet.y + background.offset;
			var bulletRight = bulletLeft + bullet.bulletImage.width;
			var bulletBottom = bullet.y + background.offset + bullet.bulletImage.height;

			var obsLeft = self.x;
			var obsTop = self.y + background.offset;
			var obsRight = obsLeft + self.currentImage.width;
			var obsBottom = self.y + background.offset + self.currentImage.height;

			var horizontalOverlap = Math.max(0, Math.min(bulletRight, obsRight) - Math.max(bulletLeft, obsLeft));
			var verticalOverlap = Math.max(0, Math.min(bulletBottom, obsBottom) - Math.max(bulletTop, obsTop));

			if(horizontalOverlap !== 0 && verticalOverlap !== 0){
				result = true;
			}
			
		});
		
		return result;
	};

}