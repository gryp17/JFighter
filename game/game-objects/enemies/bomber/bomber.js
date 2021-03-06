import Utils from '@/game/misc/utils';
import Sprite from '@/game/misc/sprite';
import BomberBomb from '@/game/game-objects/enemies/bomber/bomber-bomb';
import Explosion from '@/game/game-objects/misc/explosion';

/**
 * Class that represents the enemy bombers
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Bomber}
 */
export default function Bomber(game, x, y) {
	this.context = game.contexts.airEnemies.context;
	this.canvas = game.contexts.airEnemies.canvas;
			
	this.images = game.images.ENEMIES.B17;
	
	//stats
	this.stats = game.enemyStats.B17;
	
	//state
	this.health = this.stats.HEALTH;
	this.damaged = false; //the bomber has received damage (50% health missing)
	this.disabled = false; //the bomber is disabled and can't be controlled anymore
	this.crashed = false; //the bomber has crashed to the ground
	this.active = true; //draw the object as long as this is set to true
	
	//positioning and speed
	this.dx = game.background.dx - 1;
	this.x = x;
	this.dy = 0;
	this.y = y;
	this.angle = 0;
	
	//bombs
	this.bombing = false;
	this.bombCarpetSize = this.stats.BOMB_CARPET_SIZE;
	this.bombDelay = this.stats.BOMB_DELAY;
	this.carpetCooldown = this.stats.BOMB_CARPET_COOLDOWN;
	this.delayTimer = 0;
	this.carpetTimer = 0;
	this.droppedBombs = 0;
	this.bombs = [];

	//sprite variables
	this.sprite = new Sprite(this.images.SPRITE.DEFAULT, 2, true);
	this.currentImage = this.sprite.moveTo(_.random(0, this.images.SPRITE.DEFAULT.length - 1)); //start from a random sprite index

	/**
	 * Draws the bomber object
	 */
	this.draw = function () {
		
		//if the bomber is too damaged disable it and crash it (only do this if it hasn't crashed yet)
		if (this.health <= 0 && this.crashed === false && this.disabled === false) {
			this.disable();
		}
		
		//if the bomber has received 50% damage - raise the damaged flag and change the sprite images
		if (this.damaged === false && this.health < this.stats.HEALTH / 2) {
			this.damaged = true;
			this.sprite = new Sprite(this.images.SPRITE.DAMAGED, 2, true);
		}
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
				
		if(this.disabled === false) {
			//always fly higher than the fighter plane
			this.avoidPlayer();
		}
		//slowly descend the bomber until it crashes
		else if(this.crashed === false) {
			this.freeFall();
		}
		
		//updates the bombs delay/cooldown values
		this.updateBombsStatus();
				
		//drop bombs periodically
		this.dropBombs();
								
		//draw the bomber
		this.drawBomber();
		
		//draw the health bar
		if(this.disabled === false) {
			this.drawHealthBar();
		}
		
		//draw the bombs that are still active
		this.drawBombs();
	};
	
	/**
	 * Draws a health bar on top of the object
	 */
	this.drawHealthBar = function () {
		var healthBar = Utils.generateHealthBar(this.getHitbox()[0], this.stats.HEALTH, this.health);
		
		//custom vertical offset for the bomber
		var verticalOffset = 20;
		
		//border
		this.context.strokeStyle = healthBar.strokeRect.style;
		this.context.strokeRect(healthBar.x, healthBar.y - verticalOffset, healthBar.strokeRect.width, healthBar.strokeRect.height);
		
		//fill
		this.context.fillStyle = healthBar.fillRect.style;
		this.context.fillRect(healthBar.x, healthBar.y - verticalOffset, healthBar.fillRect.width, healthBar.fillRect.height);
	};
	
	/**
	 * Disables the bomber
	 */
	this.disable = function () {
		this.disabled = true;
		this.health = 0;
	};
	
	/**
	 * Slowly descend the bomber until it crashes to the ground
	 */
	this.freeFall = function () {
		if(this.dy < 3) {
			this.dy = this.dy + 0.05;
		}
	};
	
	/**
	 * Crashes the bomber to the ground
	 */
	this.crash = function () {
		this.y = this.canvas.height - this.currentImage.height - game.background.groundHeight;
		this.dy = 0;
		this.dx = game.background.dx;
		this.disabled = true;
		this.crashed = true;
		
		//calculate the explosion coordinates		
		var explosionX = this.x;
		var explosionY = this.y + 50;

		//add an explosion
		game.explosions.push(new Explosion(game, explosionX, explosionY, game.background.dx, 0, false));
	};
	
	/**
	 * Helper function that draws the bomber and rotates it depending on the angle property
	 */
	this.drawBomber = function () {
		
		//rotate the bomber if it's ascending or descending
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
	 * Draws the bombs that are still active
	 */
	this.drawBombs = function () {
		this.bombs = _.filter(this.bombs, function (bomb) {
			if(bomb.active) {
				bomb.draw();
				return true;
			}else{
				return false;
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
		}else{
			this.currentImage = this.sprite.move();
		}
	};
		
	/**
	 * Returns the bomber hitboxes
	 * @returns {Array}
	 */
	this.getHitbox = function () {
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
		
		return [
			bomberBody,
			bomberTail
		];
	};
	
	/**
	 * Try to avoid the fighter (player) plane by always flying higher
	 */
	this.avoidPlayer = function () {
		var horizontalDistance = this.x - game.plane.x + game.plane.currentImage.width;
		var verticalDistance = (this.y + game.background.offset + this.currentImage.height) - game.plane.y;
		
		//if the fighter gets too close - fly up
		if(horizontalDistance > 0 && horizontalDistance < this.canvas.width - 300 && verticalDistance > -100) {
			this.climb();
		}
		//otherwise level the bomber
		else{
			this.level();
		}
	};
	
	/**
	 * Makes the bomber climb until it reaches it's max climb speed
	 */
	this.climb = function () {
		if(this.dy > (this.stats.CLIMB_SPEED * -1)) {
			this.dy = this.dy - 0.1;
		}
	};
	
	/**
	 * Makes the bomber descend until it reaches it's max descend speed
	 */
	this.descend = function () {
		if(this.dy < this.stats.DESCEND_SPEED) {
			this.dy = this.dy + 0.1;
		}
	};
	
	/**
	 * Ascends/Descends the bomber slowly until it starts flying in straight line (dy = 0)
	 */
	this.level = function () {
		if(this.dy < 0) {
			this.descend();
		}else if(this.dy > 0) {
			this.climb();
		}
	};
	
	/**
	 * Updates the bomb cooldown/delay parameters
	 */
	this.updateBombsStatus = function () {
		
		//bombs delay
		if (this.bombing === true) {
			this.delayTimer++;
			
			//reset the bomb delay timer
			if (this.delayTimer > this.bombDelay) {
				this.bombing = false;
				this.delayTimer = 0;
			}
			
		}
		
		//carpet cooldown (start the cooldown timer only if all bombs have been dropped)
		if(this.droppedBombs === this.bombCarpetSize) {
			this.carpetTimer++;

			//reset the carpet timer
			if (this.carpetTimer > this.carpetCooldown) {
				this.droppedBombs = 0;
				this.carpetTimer = 0;
			}
		}
		
	};

	/**
	 * Makes the bomber drop bombs if the correct parameter are set
	 */
	this.dropBombs = function () {
		
		//if the bomber is inside the screen and is not disabled
		if(this.x < this.canvas.width && this.disabled === false) {
						
			//drop bomb only if the bomb is not on cooldown and if the number of dropped bombs doesn't exceed the max carpet size
			if (this.bombing === false && this.droppedBombs < this.bombCarpetSize) {
				var bombX = this.x + (this.currentImage.width / 1.5);
				var bombY = this.y + this.currentImage.height - 25;
				var bombDx = this.dx + 1;
				var bombDy = 2;
				this.bombing = true;

				this.droppedBombs++;

				this.bombs.push(new BomberBomb(game, bombX, bombY, bombDx, bombDy));
			}
			
		}
	};

}
