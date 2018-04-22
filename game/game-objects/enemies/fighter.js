/**
 * Class that represents the enemy fighters
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Fighter}
 */
function Fighter(game, x, y) {
	this.context = game.contexts.enemies.context;
	this.canvas = game.contexts.enemies.canvas;

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
	this.currentImage = this.images.SPRITE.DEFAULT[0];

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

		//slowly descend the fighter until it crashes
		if (this.disabled) {
			this.freeFall();
		}

		//draw the bomber
		this.drawFighter();
	};

	/**
	 * Disables the bomber
	 */
	this.disable = function () {
		this.disabled = true;
		this.health = 0;
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
