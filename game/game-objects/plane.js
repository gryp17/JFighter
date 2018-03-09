/**
 * Class that represents the player's plane
 * @param {Game} game
 * @returns {Plane}
 */
function Plane(game) {
	var self = this;
	this.context = game.contexts.plane.context;
	this.canvas = game.contexts.plane.canvas;

	//stats
	this.stats = game.planeStats[game.selectedPlane];
	
	//images
	this.images = game.images.PLANES[game.selectedPlane];
	
	this.health = this.stats.HEALTH;
	this.disabled = false; //the plane is disabled and can't be controlled anymore
	this.crashed = false; //the plane has crashed to the ground

	//positioning and speed
	this.dx = 1;
	this.x = 200;
	this.dy = 0;
	this.y = 350;
	this.angle = 0;

	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 2, true);
	this.currentImage;
	
	//bullets
	this.shooting = false;
	this.overheat = false;
	this.bulletDelay = 5;
	this.bulletTimer = 0;
	this.machinegunHeat = 0;
	this.bullets = [];
	
	//bomb
	this.bombing = false;
	this.bombCooldown = 20;
	this.bombTimer = 0;
	this.bombs = [];

	/**
	 * Draws the plane object and all it's bullets and bombs
	 */
	this.draw = function () {

		//respond to the controls only if the plane is not disabled
		if (this.disabled === false) {
			this.processInputs(game.inputs);
		}
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		//if the plane is too damaged disable it and crash it (only do this if it hasn't crashed yet)
		if (this.health <= 0 && this.crashed === false) {
			this.disabled = true;
			this.dy = 2;
		}
		
		//checks/updates the machinegun/bullets cooldown and heat
		this.updateMachinegunStatus();
		
		//checks/updates the bombs cooldown
		this.updateBombsStatus();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//check if the plane has reached the top, bottom, left or right end of the screen
		this.checkForCollisions();

		//draw the plane
		this.drawPlane();

		//draw the plane bullets
		this.drawBullets();
				
		//draw the plane bombs
		this.drawBombs();
	};
	
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
			if (this.dx < this.stats.MAX_SPEED) {
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
	 * Draws the plane and rotates it based on the angle property
	 */
	this.drawPlane = function () {
		
		//if the plane is ascending or descending rotate it
		if (this.dy > 0) {
			this.angle = this.dy * this.stats.DESCEND_SPEED;
		} else if (this.dy < 0) {
			this.angle = this.dy * this.stats.CLIMB_SPEED;
		}
		//otherwise reset the angle and draw it in it's normal state
		else {
			this.angle = 0;
		}
		
		//clear the entire canvas
		//this.context.clearRect(this.x - 5, this.y - 5, this.currentImage.width + 5, this.currentImage.height + 5);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.context.save();

		//move to the middle of where we want to draw our image
		this.context.translate(this.x + this.currentImage.width / 2, this.y + this.currentImage.height / 2);

		//rotate around that point, converting our angle from degrees to radians 
		this.context.rotate(this.angle * Math.PI / 180);

		//draw it up and to the left by half the width and height of the image 
		this.context.drawImage(this.currentImage, -(this.currentImage.width / 2), -(this.currentImage.height / 2));
		
		//and restore the co-ords to how they were when we began
		this.context.restore();
	};
	
	/**
	 * Checks/updates the machinegun/bullet cooldown and heat status
	 */
	this.updateMachinegunStatus = function () {
		//overheat the machinegun if it reaches the max heat
		if (this.machinegunHeat === this.stats.MAX_MACHINEGUN_HEAT) {
			this.overheat = true;
		}

		//reduce the machinegun heat slowly
		if (this.machinegunHeat > 0) {
			this.machinegunHeat--;

			//if the machinegun is overheated and reaches 0 heat - it's ready for use again
			if (this.overheat && this.machinegunHeat === 0) {
				this.overheat = false;
			}
		}

		//bullets cooldown
		if (this.shooting === true) {
			this.bulletTimer++;
			
			//increase the machinegun heat with each shot
			this.machinegunHeat = this.machinegunHeat + this.stats.MACHINEGUN_HEATING;

			//don't let the heat value go over the maximum
			if (this.machinegunHeat > this.stats.MAX_MACHINEGUN_HEAT) {
				this.machinegunHeat = this.stats.MAX_MACHINEGUN_HEAT;
			}

			if (this.bulletTimer > this.bulletDelay) {
				this.shooting = false;
				this.bulletTimer = 0;
			}
		}
	};
	
	/**
	 * Checks/updates the bombs cooldown status
	 */
	this.updateBombsStatus = function () {
		//bombs cooldown
		if (this.bombing === true) {
			this.bombTimer++;
			if (this.bombTimer > this.bombCooldown) {
				this.bombing = false;
				this.bombTimer = 0;
			}
		}
	};
	
	/**
	 * Draws all plane bullets that are inside the canvas and haven't hit anything (ground, enemy...)
	 */
	this.drawBullets = function (){
		this.bullets = _.filter(this.bullets, function (bullet) {
			if (bullet.active === false) {
				return false;
			}else{
				bullet.draw();
				return true;
			}
		});
	};
		
	/**
	 * Draws all plane bombs that are inside the canvas
	 */
	this.drawBombs = function (){
		this.bombs = _.filter(this.bombs, function (bomb) {
			if(bomb.active){
				bomb.draw();
				return true;
			}else{
				return false;
			}
		});
	};

	/**
	 * Makes the plane shoot bullets
	 */
	this.shoot = function () {

		//shoot only if the bullets are not on cooldown and the machinegun is not overheated
		if (this.shooting === false && this.overheat === false) {
			//var bulletX = this.x + this.currentImage.width - 10;
			var bulletX = this.x + (this.currentImage.width / 2);
			var bulletY = this.y - game.background.offset + (this.currentImage.height / 2);
			var bulletDx = 25;
			var bulletDy = 0;
			var angle = this.angle;
			this.shooting = true;

			//calculate the speed and angle if the plane is moving down or up
			if (this.dy > 0) {
				angle = this.dy * this.stats.DESCEND_SPEED;
				bulletDy = this.dy * (angle / 4.5);
			} else if (this.dy < 0) {
				angle = this.dy * this.stats.CLIMB_SPEED;
				bulletDy = this.dy * (angle / 4.5) * -1;
			}
			
			//extreme angles adjustments
			/*
			if (angle <= -45) {
				bulletY = bulletY + 10;
				bulletX = bulletX - 25;
			} else if (angle >= 45) {
				bulletY = bulletY - 10;
				bulletX = bulletX - 20;
			}
			*/
			
			//additional fix for the KI84 at extreme climb angles
			if (game.selectedPlane === "KI84" && angle <= -20 && game.background.offset > 0) {				
				bulletX = bulletX - game.background.offset / 2.5;
				bulletY = bulletY - game.background.offset / 7;
			}
						
			this.bullets.push(new PlaneBullet(game, bulletX, bulletY, bulletDx, bulletDy, angle));
		}
	};

	/**
	 * Makes the plane drop bombs
	 */
	this.dropBomb = function () {
		//drop bomb only if the bomb is not on cooldown
		if (this.bombing === false) {
			var bombX = this.x + (this.currentImage.width / 1.3);
			var bombY = this.y - game.background.offset + (this.currentImage.height / 2);
			var bombDx = this.dx - 2;
			var bombDy = (this.dy > 0 ? this.dy : 0) + 3;
			this.bombing = true;

			this.bombs.push(new PlaneBomb(game, bombX, bombY, bombDx, bombDy));
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
		if (this.y + this.currentImage.height > this.canvas.height - 40) {
			this.y = this.canvas.height - this.currentImage.height - 40;
			this.dy = 0;
			this.dx = -2;
			this.disabled = true;
			this.crashed = true;
			this.health = 0;
		}
	};

}
