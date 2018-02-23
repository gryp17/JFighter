function Plane(gameContexts, background, planeType) {
	var self = this;
	this.context = gameContexts["PLANE"].context;
	this.canvas = gameContexts["PLANE"].canvas;

	//background object that is used mostly for accessing the background vertical offset
	this.background = background;

	this.planeStats = PLANES_STATS[planeType];
	this.currentHealth = this.planeStats.HEALTH;
	this.planeImages = IMAGE_REPOSITORY.images.PLANES[planeType];
	this.disabled = false; //the plane is disabled and can't be controlled anymore
	this.crashed = false; //the plane has crashed to the ground

	//positioning and speed
	this.dx = 1;
	this.x = 200;
	this.dy = 0;
	this.y = 350;
	this.angle = 0;

	//sprite variables
	this.spriteIndex = 0;
	this.currentImage = this.planeImages.SPRITE[this.spriteIndex];
	this.frames = 0;
	this.limit = 2;
	
	//bullets
	this.shooting = false;
	this.bulletsCooldown = 5;
	this.bulletsTimer = 0;
	this.bullets = [];

	//bomb
	this.bombing = false;
	this.bombCooldown = 20;
	this.bombTimer = 0;
	this.bombs = [];

	/**
	 * Processes the keyboard inputs and responds to them
	 * @param {Object} inputs
	 */
	this.processInputs = function (inputs) {
		//up
		if (inputs.UP) {
			if (this.dy > -3) {
				this.dy = this.dy - 0.1;
			}
		}

		//down
		if (inputs.DOWN) {
			if (this.dy < 3) {
				this.dy = this.dy + 0.1;
			}
		}

		//left
		if (inputs.LEFT) {
			if (this.dx > -1) {
				this.dx = this.dx - 0.1;
			}
		}

		//right
		if (inputs.RIGHT) {
			if (this.dx < this.planeStats.MAX_SPEED) {
				this.dx = this.dx + 0.1;
			}
		}

		//shoot
		if (inputs.SHOOT) {
			this.shoot();
		}

		//bomb
		if (inputs.BOMB) {
			this.dropBomb();
		}
	};

	/**
	 * Draws the plane object and all it's bullets and bombs
	 */
	this.draw = function (inputs) {

		//respond to the controls only if the plane is not disabled
		if (self.disabled === false) {
			this.processInputs(inputs);
		}
		
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
				}

				this.currentImage = this.planeImages.SPRITE[this.spriteIndex];

				this.frames = 0;
			}
		}

		//if the plane is too damaged disable it and crash it (only do this if it hasn't crashed yet)
		if (this.currentHealth <= 0 && this.crashed === false) {
			this.disabled = true;
			this.dy = 2;
		}

		//bullets cooldown
		if (this.shooting === true) {
			this.bulletsTimer++;
			if (this.bulletsTimer > this.bulletsCooldown) {
				this.shooting = false;
				this.bulletsTimer = 0;
			}
		}

		//bombs cooldown
		if (this.bombing === true) {
			this.bombTimer++;
			if (this.bombTimer > this.bombCooldown) {
				this.bombing = false;
				this.bombTimer = 0;
			}
		}

		//destroy bullets that are outside of the canvas
		this.bullets = _.filter(this.bullets, function (bullet) {
			//check the distance instead of the X value because of the bullet rotation logic...
			return bullet.distance < self.canvas.width;
		});

		//destroy bombs that are outside of the canvas
		this.bombs = _.filter(this.bombs, function (bomb) {
			return bomb.x > IMAGE_REPOSITORY.images.EXPLOSION[0].width * -1;
		});

		//clear the entire canvas
		//this.context.clearRect(this.x - 5, this.y - 5, this.currentImage.width + 5, this.currentImage.height + 5);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.checkForCollisions();

		//if the plane is ascending or descending rotate it
		if (this.dy > 0) {
			this.angle = this.dy * this.planeStats.DESCEND_SPEED;
			this.rotatePlane(this.angle);
		} else if (this.dy < 0) {
			this.angle = this.dy * this.planeStats.CLIMB_SPEED;
			this.rotatePlane(this.angle);
		}
		//otherwise reset the angle and draw it in it's normal state
		else {
			this.angle = 0;
			this.context.drawImage(this.currentImage, this.x, this.y);
		}

		//draw all plane bullets
		this.bullets.forEach(function (bullet) {
			bullet.draw();
		});

		//draw all plane bombs
		this.bombs.forEach(function (bomb) {
			bomb.draw();
		});

	};

	/**
	 * Rotates the plane
	 * @param {Number} angle
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
		if (this.shooting === false) {
			var bulletX = this.x + this.currentImage.width - 10;
			var bulletY = this.y - this.background.offset + (this.currentImage.height / 2);
			var bulletDx = 25;
			var bulletDy = 0;
			var angle = this.angle;
			this.shooting = true;

			this.bullets.push(new PlaneBullet(gameContexts, background, bulletX, bulletY, bulletDx, bulletDy, angle));
		}
	};

	/**
	 * Makes the plane drop bombs
	 */
	this.dropBomb = function () {
		//drop bomb only if the bomb is not on cooldown
		if (this.bombing === false) {
			var bombX = this.x + (this.currentImage.width / 1.3);
			var bombY = this.y - this.background.offset + (this.currentImage.height / 2);
			var bombDx = this.dx - 2;
			var bombDy = (this.dy > 0 ? this.dy : 0) + 3;
			this.bombing = true;

			this.bombs.push(new PlaneBomb(gameContexts, this.background, bombX, bombY, bombDx, bombDy));
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

}
