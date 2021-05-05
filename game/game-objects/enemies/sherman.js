import Utils from '@/game/misc/utils';
import Sprite from '@/game/misc/sprite';
import Bullet from '@/game/game-objects/misc/bullet/bullet';

/**
 * Class that represents the enemy tanks (Shermans)
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Bomber}
 */
export default function Sherman(game, x, y) {
	this.context = game.contexts.groundEnemies.context;
	this.canvas = game.contexts.groundEnemies.canvas;
			
	this.images = game.images.ENEMIES.SHERMAN;
	
	//stats
	this.stats = game.enemyStats.SHERMAN;
	
	//state
	this.health = this.stats.HEALTH;
	this.destroyed = false;
	this.active = true; //draw the object as long as this is set to true
	
	//positioning and speed
	this.dx = game.background.dx - 0.8;;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 2, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.length - 1)); //start from a random sprite index
	
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
	 * Draws the sherman object
	 */
	this.draw = function () {
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		//if the sherman tank health reaches 0...
		if(this.health <= 0 && this.destroyed === false) {
			this.destroy();
		}
		
		//if the tank is not destroyed - engage the player
		if(this.destroyed === false) {
			this.engagePlayer();
		}
		
		//updates the bullets delay/cooldown/burst values
		this.updateBulletsStatus();
		
		//draw the sherman
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
		
		//draw the health bar
		if(this.destroyed === false) {
			this.drawHealthBar();
		}
		
		//draw the sherman bullets
		this.drawBullets();
	};
	
	/**
	 * Draws a health bar on top of the object
	 */
	this.drawHealthBar = function () {
		var healthBar = Utils.generateHealthBar(this.getHullHitbox(), this.stats.HEALTH, this.health);
		
		//border
		this.context.strokeStyle = healthBar.strokeRect.style;
		this.context.strokeRect(healthBar.x, healthBar.y, healthBar.strokeRect.width, healthBar.strokeRect.height);
		
		//fill
		this.context.fillStyle = healthBar.fillRect.style;
		this.context.fillRect(healthBar.x, healthBar.y, healthBar.fillRect.width, healthBar.fillRect.height);
	};
		
	/**
	 * Draws all sherman bullets that are inside the canvas and haven't hit anything
	 */
	this.drawBullets = function () {
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
		//if the sherman has been destroyed show the destroyed image
		if (this.destroyed === true) {
			this.currentImage = this.images.DESTROYED;
		}else{
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Shoot at the players plane when he flies over
	 */
	this.engagePlayer = function () {
		var horizontalDistance = this.x - game.plane.x + game.plane.currentImage.width;
		var verticalDistance = (this.y + game.background.offset + this.currentImage.height) - game.plane.y;
		
		//if the player plane is close horizontally
		if(horizontalDistance > 0 && horizontalDistance < this.canvas.width / 1.1) {
						
			//if the player plane is within shooting range - shoot
			if (verticalDistance > 200 && verticalDistance < 500) {
				this.shoot();
			}
			
		}
	};
	
	/**
	 * Updates the bullets burst cooldown/delay parameters
	 */
	this.updateBulletsStatus = function () {
		
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
		if(this.bulletsShot === this.burstSize) {
			this.burstTimer++;

			//reset the burst timer
			if (this.burstTimer > this.burstCooldown) {
				this.bulletsShot = 0;
				this.burstTimer = 0;
			}
		}
		
	};
	
	/**
	 * Makes the sherman shoot a single bullet
	 */
	this.shoot = function () {
		//if the sherman is inside the screen and is not destroyed
		if (this.x < this.canvas.width && this.destroyed === false) {

			//shoot only if the bullet is not on cooldown and if the number of bullets per burst doesn't exceed the burst size
			if (this.shooting === false && this.bulletsShot < this.burstSize) {
				var angle = 30;
				var bulletX = this.x + (this.currentImage.width) - 90;
				var bulletY = this.y;
				var bulletDx = -15;
				var bulletDy = -7;
				this.shooting = true;

				this.bulletsShot++;

				this.bullets.push(new Bullet(game, bulletX, bulletY, bulletDx, bulletDy, angle, this));
			}

		}
	};
	
	/**
	 * Destroys the sherman
	 */
	this.destroy = function () {
		this.health = 0;
		this.destroyed = true;
		this.dx = game.background.dx;
	};
	
	/**
	 * Returns the sherman hitbox
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
	
	/**
	 * Returns the sherman hull hitbox (the hitbox without the turret)
	 * @returns {Object}
	 */
	this.getHullHitbox = function () {
		var turretWidth = this.currentImage.width / 4;
		var hitbox = this.getHitbox();
		
		//modify the hitbox
		hitbox.x = hitbox.x + turretWidth;
		hitbox.width = hitbox.width - turretWidth;
		
		return hitbox;
	};
}
