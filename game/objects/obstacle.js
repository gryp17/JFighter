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
		
		/* doesn't work...
		if(this.checkForBulletsDamage()){
			console.log("######## BULLET HIT ####### "+new Date().getTime());
		}
		*/

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


	//doesn't work....
	this.checkForBulletsDamage = function (){
		var result = false;
		
		this.plane.bullets.forEach(function (bullet){
			
			self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
			
			//rotate the canvas in order to rotate the bullet... converting our angle from degrees to radians
			self.context.save();

			//if the plane is moving upwards apply manual horizontal adjustment to the bullets
			var xAdjustment = 0;
			if(bullet.angle < 0 && background.offset > 0){
				xAdjustment = (background.offset / Math.PI) * -1;
			}
			
			//manually adjust the bullet Y depending on the angle in order to match the plane direction
			var yAdjustment = background.offset + (bullet.angle * 1.2);

			self.context.translate(bullet.x + xAdjustment, bullet.y);
			self.context.rotate(bullet.angle * Math.PI / 180);
			
			//manually adjust the bullet Y depending on the angle in order to match the plane direction
			//var yAdjustment = background.offset + (bullet.angle * 1.2);
			//this.context.drawImage(bullet.bulletImage, bullet.distance, yAdjustment);
			
			var bulletLeft = bullet.x + bullet.distance;
			//var bulletTop = bullet.y + background.offset;
			var bulletTop = yAdjustment;
			var bulletRight = bulletLeft + bullet.bulletImage.width;
			//var bulletBottom = bullet.y + background.offset + bullet.bulletImage.height;
			var bulletBottom = yAdjustment + bullet.bulletImage.height;

			var obsLeft = self.x;
			var obsTop = self.y + background.offset;
			var obsRight = obsLeft + self.currentImage.width;
			var obsBottom = self.y + background.offset + self.currentImage.height;

			var horizontalOverlap = Math.max(0, Math.min(bulletRight, obsRight) - Math.max(bulletLeft, obsLeft));
			var verticalOverlap = Math.max(0, Math.min(bulletBottom, obsBottom) - Math.max(bulletTop, obsTop));

			if(horizontalOverlap !== 0 && verticalOverlap !== 0){
				result = true;
			}
						
			self.context.rect(bullet.x + bullet.distance, yAdjustment, bullet.bulletImage.width, bullet.bulletImage.height + 5);
			//self.context.rect(self.x, self.y + background.offset, self.currentImage.width, self.currentImage.height);
			
			self.context.stroke();
			
			//and restore the co-ords to how they were when we began
			self.context.restore();
			
		});
		
		return result;
	};

}
