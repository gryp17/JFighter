function Plane(gameContexts, planeType) {
	var self = this;
	this.context = gameContexts["PLANE"].context;
	this.canvas = gameContexts["PLANE"].canvas;
	
	this.planeStats = PLANES_STATS[planeType];
	this.currentHealth = this.planeStats.HEALTH;
	this.planeImages = IMAGE_REPOSITORY.images.PLANES[planeType];
	this.disabled = false; //the plane is disabled and can't be controlled anymore
	this.crashed = false; //the plane has crashed to the ground
	
	//positioning
	this.dx = 1;
	this.x = 200;
	this.dy = 0;
	this.y = 350;

	//sprite variables
	this.spriteIndex = 0;
	this.currentImage = this.planeImages.SPRITE[this.spriteIndex];
	this.frames = 0;
	this.limit = 2;
	
	//bullets
	this.shooting = false;
	this.bulletsCooldown = 3;
	this.bulletsTimer = 0;
	this.bullets = [];

	/**
	 * Draws the plane object
	 */
	this.draw = function () {

		//if the plane has crashed show the crashed image
		if (this.crashed === true) {
			this.currentImage = this.planeImages.CRASHED;
		} 
		//otherwise loop thru the sprite images
		else {
			this.frames++;

			//if the limit has been reached show the next sprite image
			if (this.frames > this.limit) {
				this.spriteIndex++;

				if (_.isUndefined(this.planeImages.SPRITE[this.spriteIndex])) {
					this.spriteIndex = 0;
					;
				}

				this.currentImage = this.planeImages.SPRITE[this.spriteIndex];

				this.frames = 0;
			}
		}

		//if the plane is too damaged disable it and crash it (only do this if it hasn't crashed yet)
		if(this.currentHealth <= 0 && this.crashed === false){
			this.disabled = true;
			this.dy = 2;
		}
		
		//bullets cooldown
		if(this.shooting === true){
			this.bulletsTimer++;
			if(this.bulletsTimer > this.bulletsCooldown){
				this.shooting = false;
				this.bulletsTimer = 0;
			}
		}
		
		//destroy bullets that are outside of the canvas
		this.bullets = _.filter(this.bullets, function (bullet){
			return bullet.x < self.canvas.width;
		});
		
		//clear the rectangle around the plane
		//this.context.clearRect(this.x - 5, this.y - 5, this.currentImage.width + 5, this.currentImage.height + 5);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.checkForCollisions();
				
		//if the plane is ascending or descending rotate it
		if (this.dy > 0) {
			this.rotatePlane(this.dy * this.planeStats.DESCEND_SPEED);
		} else if (this.dy < 0) {
			this.rotatePlane(this.dy * this.planeStats.CLIMB_SPEED);
		}
		//otherwise draw it in it's normal state
		else {
			this.context.drawImage(this.currentImage, this.x, this.y);
		}

	};

	/**
	 * Rotates the plane
	 * @param {int} angle
	 */
	this.rotatePlane = function (angle) {
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width / 2, this.y + this.currentImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width / 2), -(this.currentImage.height / 2));

		//and restore the co-ords to how they were when we began
		this.context.restore();
	};
	
	/**
	 * Makes the plane shoot bullets
	 */
	this.shoot = function () {
		
		//shoot only if the bullets are not on cooldown
		if(this.shooting === false){
			var bulletX = this.x + this.currentImage.width - 10;
			var bulletY = this.y + (this.currentImage.height / 2);
			var bulletDx = 25;
			var bulletDy = 0;
			var angle = 0;
			this.shooting = true;
						
			//calculate the speed and angle if the plane is moving down or up
			if (this.dy > 0) {
				angle = this.dy * this.planeStats.DESCEND_SPEED;
				bulletY = bulletY + angle * 1;
				bulletDy = this.dy * (angle / 2);
			} else if (this.dy < 0) {
				angle = this.dy * this.planeStats.CLIMB_SPEED;
				bulletY = bulletY + angle * 1;
				bulletDy = this.dy * (angle / 2) * -1;
			}
			
			//extreme angles adjustments
			if(angle === -45){
				bulletY = bulletY + 10;
				bulletX = bulletX - 25;
			}else if(angle === 45){
				bulletY = bulletY - 10;
				bulletX = bulletX - 20;
			}
			
			this.bullets.push(new PlaneBullet(gameContexts["PLANE"], bulletX, bulletY, bulletDx, bulletDy, angle));
		}
	};

	/**
	 * Checks if the plane has reached the top, bottom, left or right end of the screen
	 */
	this.checkForCollisions = function () {
		//top end of screen
		if (this.y < 0) {
			this.y = 0;
			this.dy = 0;
		}

		//left end of screen
		if (this.x < 0 && this.crashed === false) {
			this.x = 0;
			this.dx = 0;
		}

		//right end of screen
		if (this.x + this.currentImage.width > this.canvas.width) {
			this.x = this.canvas.width - this.currentImage.width;
			this.dx = -1;
		}

		//bottom end of screen
		if (this.y + this.currentImage.height > this.canvas.height - 50) {
			this.y = this.canvas.height - this.currentImage.height - 50;
			this.dy = 0;
			this.dx = -2;
			this.disabled = true;
			this.crashed = true;
		}
	};

	//keyboard controls
	$("body").keydown(function (e) {

		//respond to the controls only if the plane is not disabled
		if (self.disabled === false) {

			//left
			if (e.which === 37 || e.which === 65) {
				if (self.dx > -1) {
					self.dx = self.dx - 1;
				}
			}

			//right
			if (e.which === 39 || e.which === 68) {
				if (self.dx < self.planeStats.MAX_SPEED) {
					self.dx = self.dx + 1;
				}
			}

			//top
			if (e.which === 38 || e.which === 87) {
				if (self.dy > -3) {
					self.dy = self.dy - 1;
				}
			}

			//bottom
			if (e.which === 40 || e.which === 83) {
				if (self.dy < 3) {
					self.dy = self.dy + 1;
				}
			}
			
			//shoot (space)
			if(e.which === 32){
				self.shoot();
			}

		}

	});

}
