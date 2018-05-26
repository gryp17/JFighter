/**
 * Class that represents the enemy soldiers
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Soldier}
 */
function Soldier(game, x, y) {
	var self = this;
	
	this.context = game.contexts.groundEnemies.context;
	this.canvas = game.contexts.groundEnemies.canvas;
			
	//random soldier skin
	this.images = game.images.ENEMIES.SOLDIER[_.random(0, game.images.ENEMIES.SOLDIER.length - 1)];
	
	//stats
	this.stats = game.enemyStats.SOLDIER;
	
	//state
	this.health = this.stats.HEALTH;
	this.dead = false;
	this.active = true; //draw the object as long as this is set to true
	
	//positioning and speed
	this.dx = game.background.dx - 0.3;;
	this.x = x;
	this.dy = 0;
	this.y = y;
	
	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE, 5, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.length - 1)); //start from a random sprite index
	
	//bullets
	this.reloading = false;
	this.bulletDamage = this.stats.DAMAGE;
	this.bulletCooldown = this.stats.BULLET_COOLDOWN;
	this.bulletCooldownTimer = 0;
	this.bullets = [];
	
	/**
	 * Draws the soldier object
	 */
	this.draw = function () {
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
		
		//if the civilian health reaches 0...
		if(this.health <= 0 && this.dead === false){
			this.die();
		}
		
		//if the soldier is alive and is inside the screen - engage the civilians
		if(this.dead === false && this.x < this.canvas.width){
			this.engageCivilians();
		}
		
		//updates the bullets cooldown/reload
		this.updateBulletsStatus();
		
		//draw the soldier
		this.context.drawImage(this.currentImage, this.x, this.y + game.background.offset);
		
		//draw the health bar
		if(this.dead === false){
			this.drawHealthBar();
		}
		
		//draw the soldier bullets
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
	 * Draws all soldier bullets that are inside the canvas and haven't hit anything
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
		if (this.dead === false) {
			this.currentImage = this.sprite.move();
		}
	};
	
	/**
	 * Shoots at all civilians that are close
	 */
	this.engageCivilians = function (){
		game.civilians.forEach(function (civilian){
			var distance = self.x - civilian.x + civilian.currentImage.width;
			
			if(civilian.dead === false && distance > 0 && distance < 600){
				self.shoot();
			}
		});
	};
	
	/**
	 * Updates the bullets cooldown/reload status
	 */
	this.updateBulletsStatus = function (){
		//bullet cooldown
		if (this.reloading === true) {
			this.bulletCooldownTimer++;
			
			//reset the bullet cooldown timer
			if (this.bulletCooldownTimer > this.bulletCooldown) {
				this.reloading = false;
				this.bulletCooldownTimer = 0;
			}
		}
	};
	
	/**
	 * Makes the soldier shoot a single bullet
	 */
	this.shoot = function () {
		//shoot only if the bullet is not on cooldown
		if (this.reloading === false) {
			var bulletX = this.x;
			var bulletY = this.y + (this.currentImage.height / 2) - 10;
			var angle = 3;
			var bulletDx = -20;
			var bulletDy = -1;
			this.reloading = true;

			this.bullets.push(new Bullet(game, bulletX, bulletY, bulletDx, bulletDy, angle, this));
		}
	};
	
	/**
	 * Makes the soldier die
	 */
	this.die = function (){		
		this.dead = true;
		this.y = 570;
		this.dx = game.background.dx;
		this.currentImage = this.images.DEAD;
	};
	
	/**
	 * Returns the soldier hitbox
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
