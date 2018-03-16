/**
 * Class that represents the enemy bombers
 * @param {Object} game
 * @param {Number} x
 * @param {Number} y
 * @returns {Bomber}
 */
function Bomber(game, x, y) {
	this.context = game.contexts.enemies.context;
	this.canvas = game.contexts.enemies.canvas;
			
	this.images = game.images.ENEMIES.B17;
	
	//stats
	this.stats = game.enemyStats.B17;
	
	//state
	this.health = this.stats.HEALTH;
	this.disabled = false; //the plane is disabled and can't be controlled anymore
	this.crashed = false; //the plane has crashed to the ground
	
	//positioning and speed
	this.dx = -3;
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
	this.sprite = new Sprite(this.images.SPRITE, 2, true);
	this.currentImage = this.images.SPRITE[0];

	/**
	 * Draws the plane object
	 */
	this.draw = function () {
		
		//if the bomber is too damaged disable it and crash it (only do this if it hasn't crashed yet)
		if (this.health <= 0 && this.crashed === false && this.disabled === false) {
			this.disable();
		}
		
		//update the "currentImage" with the correct sprite image
		this.updateSprite();
		
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
				
		if(this.disabled === false){
			//always fly higher than the fighter plane
			this.avoidFighters();
		}
		//slowly descend the bomber until it crashes
		else{
			this.freeFall();
		}
		
		//updates the bombs delay/cooldown values
		this.updateBombsStatus();
				
		//drop bombs periodically
		this.dropBombs();
								
		//draw the bomber
		this.drawBomber();
		
		//draw the bombs that are still active
		this.drawBombs();
	};
	
	/**
	 * Disables the bomber
	 */
	this.disable = function (){
		this.disabled = true;
	};
	
	/**
	 * Slowly descend the bomber until it crashes to the ground
	 */
	this.freeFall = function (){
		if(this.dy < 3){
			this.dy = this.dy + 0.05;
		}
	};
	
	/**
	 * Crashes the bomber to the ground
	 */
	this.crash = function () {
		this.y = this.canvas.height - this.currentImage.height - 40;
		this.dy = 0;
		this.dx = -2;
		this.disabled = true;
		this.crashed = true;
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
			if(bomb.active){
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
	this.getHitbox = function (){
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
	
	/**
	 * Updates the bomb cooldown/delay parameters
	 */
	this.updateBombsStatus = function (){
		
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
		if(this.droppedBombs === this.bombCarpetSize){
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
	this.dropBombs = function (){
		
		//if the bomber is inside the screen and is not disabled
		if(this.x < this.canvas.width && this.disabled === false){
						
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
