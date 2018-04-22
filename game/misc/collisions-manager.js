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
				
		//handle the bomb holes canvas collisions
		this.handleBombHoles();
		
		//handle all shermans collisions
		this.handleShermans();
		
		//handles all fighters collisions
		this.handleFighters();
		
		//handle all civilians collisions
		this.handleCivilians();
		
		//handle all weather collisions
		this.handleWeatherEffects();
	};

	/**
	 * Handles all plane collisions
	 */
	this.handlePlane = function () {
		var plane = game.plane;
		var planeHitbox = plane.getHitbox();
		
		//separate the bombers from the list of enemies
		var bombers = _.filter(game.enemies, function (enemy) {
			return enemy.constructor === Bomber;
		});

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
		if (plane.y + plane.currentImage.height > plane.canvas.height - game.background.groundHeight) {
			plane.crash();
		}
		
		//check if the plane has been hit by any of the bombers bombs
		bombers.forEach(function (bomber) {
			bomber.bombs.forEach(function (bomb){
				if (Utils.collidesWith(planeHitbox, bomb.getHitbox())) {
					bomb.explode(false);
					plane.disable();
				}
			});
		});
		
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
				bomb.explode(true);
			}
		});
	};

	/**
	 * Handles the bomber bombs ground, canvas and plane bullets collisions
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
				bomb.explode(true);
			}
			
			//check if the bomb has been hit by any of the plane's bullets
			game.plane.bullets.forEach(function (bullet){
				if(Utils.collidesWith(bomb.getHitbox(), bullet.getHitbox())){
					bullet.explode();
					bomb.explode(false);
				}
			});
			
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

			//check if the bomber has left the screen
			if (bomber.x < -800) {
				bomber.active = false;
			}

			//when the bomber touches the ground raise the disabled and crashed flags and "anchor" it to the ground
			if (bomber.y + bomber.currentImage.height > bomber.canvas.height - game.background.groundHeight) {
				bomber.crash();
			}

			//check if the bomber has collided with the plane
			if (Utils.collidesWith(bomberHitboxes, planeHitbox)) {
				bomber.health--;
				game.plane.health = game.plane.health - 2;
			}

			//check if any of the plane bullets have hit the bomber
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
			
			//check if any of the plane bombs have hit the bomber
			game.plane.bombs.forEach(function (bomb) {
				if(Utils.collidesWith(bomberHitboxes, bomb.getHitbox())){
					bomb.explode(false);
					bomber.disable();
				}
			});
		});

	};
		
	/**
	 * Handles the bomb holes collisions with the canvas
	 */
	this.handleBombHoles = function (){
		//for each bomb hole...
		game.bombHoles.forEach(function (bombHole){
			//check if the bomb hole has left the screen
			if (bombHole.x + bombHole.currentImage.width < 0) {
				bombHole.active = false;
			}
		});
	};
	
	/**
	 * Handles all shermans collisions
	 */
	this.handleShermans = function (){
		
		//separate the shermans from the list of enemies
		var shermans = _.filter(game.enemies, function (enemy) {
			return enemy.constructor === Sherman;
		});
		
		//for each sherman...
		shermans.forEach(function (sherman) {
			var shermanHitbox = sherman.getHitbox();
			
			//check if the sherman has left the screen
			if (sherman.x + sherman.currentImage.width < 0) {
				sherman.active = false;
			}
			
			//check if any of the plane bullets have hit the sherman
			game.plane.bullets.forEach(function (bullet) {
				if(Utils.collidesWith(shermanHitbox, bullet.getHitbox())){
					sherman.health = sherman.health - bullet.damage;
					
					//make the bullet explode
					bullet.explode();
				}
			});
			
			//check if any of the plane bombs have hit the sherman
			game.plane.bombs.forEach(function (bomb) {
				if(bomb.active === false && Utils.collidesWith(shermanHitbox, bomb.getExplosionHitbox())){
					bomb.explode(false);
					sherman.destroy();
				}
			});
			
		});
		
	};
	
	/**
	 * Handles all fighters collisions
	 */
	this.handleFighters = function () {
		
		//separate the fighters from the list of enemies
		var fighters = _.filter(game.enemies, function (enemy) {
			return enemy.constructor === Fighter;
		});
		
		var planeHitbox = game.plane.getHitbox();

		//for each fighter...
		fighters.forEach(function (fighter) {
			var fighterHitbox = fighter.getHitbox();

			//check if the fighter has left the screen
			if (fighter.x < -800) {
				fighter.active = false;
			}

			//when the fighter touches the ground raise the disabled and crashed flags and "anchor" it to the ground
			if (fighter.y + fighter.currentImage.height > fighter.canvas.height - game.background.groundHeight) {
				fighter.crash();
			}

			//check if the fighter has collided with the plane
			if (Utils.collidesWith(fighterHitbox, planeHitbox)) {
				fighter.health = fighter.health - 3;
				game.plane.health = game.plane.health - 2;
			}

			//check if any of the plane bullets have hit the fighter
			game.plane.bullets.forEach(function (bullet) {
				if(Utils.collidesWith(fighterHitbox, bullet.getHitbox())){
					fighter.health = fighter.health - bullet.damage;
					
					//make the bullet explode
					bullet.explode();
				}
			});
			
			//check if any of the plane bombs have hit the fighter
			game.plane.bombs.forEach(function (bomb) {
				if(Utils.collidesWith(fighterHitbox, bomb.getHitbox())){
					bomb.explode(false);
					fighter.disable();
				}
			});
		});

	};
	
	/**
	 * Handles all civilians collisions
	 */
	this.handleCivilians = function (){
		
		//separate the enemies by type
		var bombers = [];
		var shermans = [];
						
		game.enemies.forEach(function (enemy){
			switch(enemy.constructor){
				case Bomber:
					bombers.push(enemy);
					break;
				case Sherman:
					shermans.push(enemy);
			}
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
				if(bomb.active === false && Utils.collidesWith(civilianHitbox, bomb.getExplosionHitbox())){
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
			
			//check if the civilian has been hit/ran over by an enemy tank (sherman)
			shermans.forEach(function (sherman){
				if(Utils.collidesWith(civilianHitbox, sherman.getHullHitbox())){
					civilian.die();
				}
			});
						
		});
	};
	
	/**
	 * Handles all weather effects collisions
	 */
	this.handleWeatherEffects = function (){
		
		//for each weather effect (snowflake...)
		game.weatherEffects.forEach(function (weatherEffect){
			//when the weather effect touches the ground - reset it
			if(weatherEffect.y > weatherEffect.canvas.height - game.background.groundHeight){
				weatherEffect.reset();
			}
		});
		
	};

}