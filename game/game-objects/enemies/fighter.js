/**
 * Class that represents the enemy fighters
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Fighter}
 */
function Fighter(game, x, y) {
	this.context = game.contexts.airEnemies.context;
	this.canvas = game.contexts.airEnemies.canvas;

	this.models = ["MUSTANG", "SPITFIRE"];
	this.model = this.models[_.random(0, this.models.length - 1)]; //pick one of the fighter models

	this.images = game.images.ENEMIES[this.model];

	//stats
	this.stats = game.enemyStats[this.model];

	//state
	this.health = this.stats.HEALTH;
	this.damaged = false; //the fighter has received damage (50% health missing)
	this.disabled = false; //the fighter is disabled and can't be controlled anymore
	this.crashed = false; //the fighter has crashed to the ground
	this.active = true; //draw the object as long as this is set to true
	
	//positioning and speed
	this.dx = game.background.dx - 2;
	this.x = x;
	this.dy = 0;
	this.y = y;
	this.angle = 0;

	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE.DEFAULT, 2, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.DEFAULT.length - 1)); //start from a random sprite index

	//bullets
	this.shooting = false;
	this.burstSize = this.stats.BULLET_BURST_SIZE;
	this.bulletDelay = this.stats.BULLET_DELAY;
	this.burstCooldown = this.stats.BULLET_BURST_COOLDOWN;
	this.delayTimer = 0;
	this.burstTimer = 0;
	this.bulletsShot = 0;
	this.bullets = [];

	/**
	 * Draws the fighter object
	 */
	this.draw = function () {

		//if the fighter is too damaged disable it and crash it (only do this if it hasn't crashed yet)
		if (this.health <= 0 && this.crashed === false && this.disabled === false) {
			this.disable();
		}

		//if the fighter has received 50% damage - raise the damaged flag and change the sprite images
		if (this.damaged === false && this.health < this.stats.HEALTH / 2) {
			this.damaged = true;
			this.sprite = new Sprite(this.images.SPRITE.DAMAGED, 2, true);
		}

		//update the "currentImage" with the correct sprite image
		this.updateSprite();

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		//if the fighter is not disabled follow the player (fighter) and shoot at him
		if(this.disabled === false){
			this.engagePlayer();
		}
		//slowly descend the fighter until it crashes
		else if(this.crashed === false){
			this.freeFall();
		}
		
		//updates the bullets delay/cooldown/burst values
		this.updateBulletsStatus();

		//draw the fighter
		this.drawFighter();
		
		//draw the health bar
		if(this.disabled === false){
			this.drawHealthBar();
		}
		
		//draw the fighter bullets
		this.drawBullets();
	};
	
	/**
	 * Draws a health bar on top of the object
	 */
	this.drawHealthBar = function () {
		var healthBar = Utils.generateHealthBar(this.getHitbox(), this.stats.HEALTH, this.health);
		
		//border
		this.context.strokeStyle = healthBar.strokeRect.style;
		this.context.strokeRect(healthBar.x, healthBar.y, healthBar.strokeRect.width, healthBar.strokeRect.height);
		
		//fill
		this.context.fillStyle = healthBar.fillRect.style;
		this.context.fillRect(healthBar.x, healthBar.y, healthBar.fillRect.width, healthBar.fillRect.height);
	};

	/**
	 * Disables the bomber
	 */
	this.disable = function () {
		this.disabled = true;
		this.health = 0;
	};
		
	/**
	 * Try to follow and shoot the fighter (player) plane by staying on the same altitude
	 */
	this.engagePlayer = function (){
		var horizontalDistance = this.x - game.plane.x + game.plane.currentImage.width;
		var verticalDistance = (this.y + game.background.offset + this.currentImage.height) - game.plane.y;
		
		//if the player plane is close horizontally
		if(horizontalDistance > 0 && horizontalDistance < this.canvas.width / 1.1){
			
			//if the player plane is flying on lower altitude - descend
			if(verticalDistance < 0){
				this.descend();
			}
			//if the player plane is flying on highter altitude - climb
			else if(verticalDistance > 50){
				this.climb();
			}
			//the player plane is flying on similar altitude and the fighter can shoot
			else{
				this.level();
			}
			
			//if the player plane within shooting range - shoot
			if (verticalDistance > -100 && verticalDistance < 100) {
				this.shoot();
			}
			
		}else{
			this.level();
		}
	};
		
	/**
	 * Makes the fighter climb until it reaches it's max climb speed
	 */
	this.climb = function (){
		if(this.dy > (this.stats.CLIMB_SPEED * -1)){
			this.dy = this.dy - 0.1;
		}
	};
	
	/**
	 * Makes the fighter descend until it reaches it's max descend speed
	 */
	this.descend = function (){
		if(this.dy < this.stats.DESCEND_SPEED){
			this.dy = this.dy + 0.1;
		}
	};
	
	/**
	 * Ascends/Descends the plane slowly until it starts flying in straight line (dy = 0)
	 */
	this.level = function (){
		if(this.dy < 0){
			this.descend();
		}else if(this.dy > 0){
			this.climb();
		}
	};

	/**
	 * Slowly descend the fighter until it crashes to the ground
	 */
	this.freeFall = function () {
		this.dy = this.dy + 0.05;
	};

	/**
	 * Crashes the fighter to the ground
	 */
	this.crash = function () {
		this.y = this.canvas.height - this.currentImage.height - game.background.groundHeight;
		this.dy = 0;
		this.dx = game.background.dx;
		this.disabled = true;
		this.crashed = true;
		
		//calculate the explosion coordinates		
		var explosionX = this.x - 50;
		var explosionY = this.y - 10;

		//add an explosion
		game.explosions.push(new Explosion(game, explosionX, explosionY, game.background.dx, 0, false));
	};

	/**
	 * Helper function that draws the fighter and rotates it depending on the angle property
	 */
	this.drawFighter = function () {

		//rotate the fighter if it's ascending or descending
		if (this.dy > 0) {
			this.angle = this.dy * -1;
		} else if (this.dy < 0) {
			this.angle = this.dy * -1;
		} else {
			this.angle = 0;
		}

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
	 * Draws all fighter bullets that are inside the canvas and haven't hit anything (ground, enemy...)
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
	 * Updates the "currentImage" with the correct sprite image
	 */
	this.updateSprite = function () {
		//if the plane has crashed show the crashed image
		if (this.crashed === true) {
			this.currentImage = this.images.CRASHED;
		} else {
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Updates the bullets burst cooldown/delay parameters
	 */
	this.updateBulletsStatus = function (){
		
		//bullet delay
		if (this.shooting === true) {
			this.delayTimer++;
			
			//reset the bullet delay timer
			if (this.delayTimer > this.bulletDelay) {
				this.shooting = false;
				this.delayTimer = 0;
			}
			
		}
		
		//burst cooldown (start the cooldown timer only if all burst bullets have been shot)
		if(this.bulletsShot === this.burstSize){
			this.burstTimer++;

			//reset the burst timer
			if (this.burstTimer > this.burstCooldown) {
				this.bulletsShot = 0;
				this.burstTimer = 0;
			}
		}
		
	};
	
	/**
	 * Makes the fighter shoot a single bullet
	 */
	this.shoot = function () {
		
		//if the fighter is inside the screen and is not disabled
		if(this.x < this.canvas.width && this.disabled === false){
						
			//shoot only if the bullet is not on cooldown and if the number of bullets per burst doesn't exceed the burst size
			if (this.shooting === false && this.bulletsShot < this.burstSize) {
				var bulletX = this.x + (this.currentImage.width / 2);
				var bulletY = this.y + (this.currentImage.height / 2);
				var bulletDx = -25;
				var bulletDy = 0;
				var angle = this.angle;
				this.shooting = true;

				//calculate the speed and angle if the plane is moving down or up
				if (this.dy > 0) {
					angle = this.dy;
					bulletDy = this.dy * (angle / 1.5);
				} else if (this.dy < 0) {
					angle = this.dy;
					bulletDy = this.dy * (angle / 1.5) * -1;
				}

				this.bulletsShot++;

				this.bullets.push(new Bullet(game, bulletX, bulletY, bulletDx, bulletDy, angle, this));
			}
			
		}
		
	};

	/**
	 * Returns the fighter hitbox
	 * @returns {Object}
	 */
	this.getHitbox = function () {
		return {
			x: this.x,
			y: this.y,
			width: this.currentImage.width,
			height: this.currentImage.height,
			offset: game.background.offset
		};
	};

}
