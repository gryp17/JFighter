/**
 * Class used for handling all game object collisions
 * @param {Game} game
 * @returns {CollisionsManager}
 */
function CollisionsManager(game) {
	var self = this;

	/**
	 * Handles the collisions for all game objects
	 */
	this.handleCollisions = function () {
		//handle the plane ground and canvas collisions
		this.handlePlane();

		//handle all bombers collisions
		this.handleBombers();
		
		//handle all civilians collisions
		this.handleCivilians();
	};

	/**
	 * Handles all plane collisions
	 */
	this.handlePlane = function () {
		var plane = game.plane;

		//top end of screen
		if (plane.y < 0) {
			plane.y = 0;
			plane.dy = 0;
		}

		//left end of screen
		if (plane.x < 0 && plane.crashed === false) {
			plane.x = 0;
			plane.dx = 0;
		}

		//right end of screen
		if (plane.x + plane.currentImage.width > plane.canvas.width) {
			plane.x = plane.canvas.width - plane.currentImage.width;
			plane.dx = -1;
		}

		//bottom end of screen
		if (plane.y + plane.currentImage.height > plane.canvas.height - 40) {
			plane.y = plane.canvas.height - plane.currentImage.height - 40;
			plane.dy = 0;
			plane.dx = -2;
			plane.disabled = true;
			plane.crashed = true;
			plane.health = 0;
		}
		
		//handle the plane bullets ground and canvas collisions
		this.handlePlaneBullets();

		//handle the plane bombs ground and canvas collisions
		this.handlePlaneBombs();
	};

	/**
	 * Handles all plane bullets ground and canvas collisions
	 */
	this.handlePlaneBullets = function () {

		//for each plane bullet...
		game.plane.bullets.forEach(function (bullet) {

			//check if the bullet has hit the ground
			if (bullet.y >= bullet.canvas.height - 30) {
				//make the bullet explode
				bullet.explode();
			}

			//check if the bullet has left the canvas
			if (bullet.x > bullet.canvas.width) {
				bullet.active = false;
			}
		});

	};

	/**
	 * Handles all plane bombs ground and canvas collisions
	 */
	this.handlePlaneBombs = function () {
		//for each plane bomb...
		game.plane.bombs.forEach(function (bomb) {
			//check if the bomb has left the screen
			if (bomb.x + bomb.currentImage.width < 0) {
				bomb.active = false;
			}

			//make the bomb explode when it reaches the ground
			if (bomb.y + bomb.currentImage.height > bomb.canvas.height - 15) {
				bomb.explode();
			}
		});
	};

	/**
	 * Handles all bomber bombs ground and canvas collisions
	 * @param {Bomber} bomber
	 */
	this.handleBomberBombs = function (bomber) {
		bomber.bombs.forEach(function (bomb) {
			//check if the bomb has left the screen
			if (bomb.x + bomb.currentImage.width < 0) {
				bomb.active = false;
			}

			//make the bomb explode when it reaches the ground
			if (bomb.y + bomb.currentImage.height > bomb.canvas.height - 15) {
				bomb.explode();
			}
		});
	};

	/**
	 * Handles all bombers collisions
	 */
	this.handleBombers = function () {
		
		//separate the bombers from the list of enemies
		var bombers = _.filter(game.enemies, function (enemy) {
			return enemy.constructor === Bomber;
		});
		
		var planeHitbox = game.plane.getHitbox();

		//for each bomber...
		bombers.forEach(function (bomber) {
			var bomberHitboxes = bomber.getHitbox();

			//handle all bombs ground and canvas collisions
			self.handleBomberBombs(bomber);

			//when the bomber touches the ground raise the disabled and crashed flags and "anchor" it to the ground
			if (bomber.y + bomber.currentImage.height > bomber.canvas.height - 40) {
				bomber.y = bomber.canvas.height - bomber.currentImage.height - 40;
				bomber.dy = 0;
				bomber.dx = -2;
				bomber.disabled = true;
				bomber.crashed = true;
			}

			//check if the bomber has collided with the plane
			if (Utils.collidesWith(bomberHitboxes, planeHitbox)) {
				bomber.health--;
				game.plane.health = game.plane.health - 2;
			}

			//check if any of the plane bullets has hit the bomber
			game.plane.bullets.forEach(function (bullet) {

				var bodyHit = Utils.collidesWith(bomberHitboxes[0], bullet.getHitbox());
				var tailHit = Utils.collidesWith(bomberHitboxes[1], bullet.getHitbox());

				//check if the bullet has hit the body or the tail of the bomber
				if (bodyHit || tailHit) {
					//tail hits do double damage
					var damage = tailHit ? bullet.damage * 2 : bullet.damage;
					bomber.health = bomber.health - damage;

					//make the bullet explode
					bullet.explode();
				}

			});

		});

	};
	
	/**
	 * Handles all civilians collisions
	 */
	this.handleCivilians = function (){
		
		//separate the bombers from the list of enemies
		var bombers = _.filter(game.enemies, function (enemy) {
			return enemy.constructor === Bomber;
		});
		
		//for each civilian...
		game.civilians.forEach(function (civilian){
			var civilianHitbox = civilian.getHitbox();
			
			//check if the civilian has left the screen
			if(civilian.x + civilian.currentImage.width < 0){
				civilian.active = false;
			}
			
			//check if the civilian has been hit by an enemy (or friendly bomb)
			var bombs = game.plane.bombs;
			bombers.forEach(function (bomber){
				bombs = bombs.concat(bomber.bombs);
			});
			
			bombs.forEach(function (bomb){
				//kill the civilian right when the bomb touches the ground (active === false)
				if(Utils.collidesWith(civilianHitbox, bomb.getExplosionHitbox()) && bomb.active === false){
					civilian.die();
				}
			});
			
			//check if the civilian has been hit by the plane bullets
			game.plane.bullets.forEach(function (bullet){
				if(Utils.collidesWith(civilianHitbox, bullet.getHitbox())){
					bullet.explode();
					civilian.die();
				}
			});
						
		});
	};

}