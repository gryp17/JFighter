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
	
	//stats
	this.health = game.enemyStats["B17"].HEALTH;
	
	this.disabled = false; //the plane is disabled and can't be controlled anymore
	this.crashed = false; //the plane has crashed to the ground
	
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
		
		//check if the bomber has crashed into the ground
		this.checkForGroundCollision();
		
		if(this.disabled === false){
			//always fly higher than the fighter plane
			this.avoidFighters();
		}
		
		if(this.checkForFighterCollisions()){
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
		this.context.clearRect(this.x - 10, this.y + game.background.offset - 10, this.currentImage.width + 20, this.currentImage.height + 20);
		
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
		//if the plane has crashed show the crashed image
		if (this.crashed === true) {
			this.currentImage = this.images.CRASHED;
		}else{
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Checks if the bomber has crashed into the ground
	 */
	this.checkForGroundCollision = function (){
		//when the bomber touches the ground raise the disabled and crashed flags and "anchor" it to the ground
		if (this.y + this.currentImage.height > this.canvas.height - 40) {
			this.y = this.canvas.height - this.currentImage.height - 40;
			this.dy = 0;
			this.dx = -2;
			this.disabled = true;
			this.crashed = true;
		}
	};
	
	/**
	 * Checks if the plane has collided with the bomber
	 * @returns {Boolean}
	 */
	this.checkForFighterCollisions = function (){
		
		var planeHitbox = {
			x: game.plane.x,
			y: game.plane.y,
			width: game.plane.currentImage.width,
			height: game.plane.currentImage.height,
			offset: 0
		};
		
		//the bomber has 2 hitboxes - body and tail
		var bomberBody = {
			x: this.x,
			y: this.y + this.currentImage.height / 2,
			width: this.currentImage.width,
			height: this.currentImage.height / 2,
			offset: game.background.offset
		};
		
		var bomberTail = {
			x: this.x + 270,
			y: this.y,
			width: 55,
			height: this.currentImage.height / 2,
			offset: game.background.offset
		};
		
		return Utils.intersect(planeHitbox, bomberBody) || Utils.intersect(planeHitbox, bomberTail);
	};

	
	/**
	 * Checks if the plane bullets have hit the bomber
	 */
	this.checkForBulletsDamage = function (){
		
		//the bomber has 2 hitboxes - body and tail
		var bomberBody = {
			x: this.x,
			y: this.y + this.currentImage.height / 2,
			width: this.currentImage.width,
			height: this.currentImage.height / 2,
			offset: game.background.offset
		};
		
		var bomberTail = {
			x: this.x + 270,
			y: this.y,
			width: 55,
			height: this.currentImage.height / 2,
			offset: game.background.offset
		};
		
		//if a bullet hit's the bomber - filter it out
		game.plane.bullets = _.filter(game.plane.bullets, function (bullet){
			var miss = true;
			
			var bulletHitbox = {
				x: bullet.x,
				y: bullet.y,
				width: bullet.currentImage.width,
				height: bullet.currentImage.height,
				offset: game.background.offset
			};
			
			//check if the bullet hits the body
			if(Utils.intersect(bulletHitbox, bomberBody)){
				self.health = self.health - bullet.damage;
				miss = false;
			}
			//check if the bullet hits the bomber tail (in this case it does double damage!)
			else if(Utils.intersect(bulletHitbox, bomberTail)){
				self.health = self.health - bullet.damage * 2;
				miss = false;
			}
			
			//if the plane is too damaged disable it and crash it (only do this if it hasn't crashed yet)
			if (self.health <= 0 && self.crashed === false) {
				self.disabled = true;
				self.dy = 2;
			}
			
			return miss;
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
