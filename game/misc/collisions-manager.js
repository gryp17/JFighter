import Utils from '@/game/misc/utils';
import Fighter from '@/game/game-objects/enemies/fighter';
import Sherman from '@/game/game-objects/enemies/sherman';
import Soldier from '@/game/game-objects/enemies/soldier';
import Bomber from '@/game/game-objects/enemies/bomber/bomber';

/**
 * Class used for handling all game object collisions
 */
export default class CollisionsManager {

	/**
	 * CollisionsManager constructor
	 * @param {Game} game
	 */
	constructor(game) {
		this.game = game;
	}

	/**
	 * Handles the collisions for all game objects
	 */
	handleCollisions() {
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
		
		//handles all soldiers collisions
		this.handleSoldiers();
		
		//handle all civilians collisions
		this.handleCivilians();
		
		//handle all weather collisions
		this.handleWeatherEffects();
	};

	/**
	 * Handles all plane collisions
	 */
	handlePlane() {
		var plane = this.game.plane;
		var planeHitbox = plane.getHitbox();
		
		//separate the enemies by type
		var bombers = [];
		var fighters = [];
		var shermans = [];
						
		this.game.enemies.forEach(function (enemy){
			switch(enemy.constructor){
				case Bomber:
					bombers.push(enemy);
					break;
				case Fighter:
					fighters.push(enemy);
					break;
				case Sherman:
					shermans.push(enemy);
					break;
			}
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
		if (plane.y + plane.currentImage.height > plane.canvas.height - this.game.background.groundHeight) {
			if(plane.crashed === false){
				plane.crash();
			}
		}
		
		//check if the plane has been hit by any of the bombers bombs
		bombers.forEach(function (bomber) {
			bomber.bombs.forEach(function (bomb){
				if (Utils.collidesWith(planeHitbox, bomb.getHitbox())) {
					//damage the plane
					plane.health = plane.health - bomb.damage;
					
					bomb.explode(false);
				}
			});
		});
		
		//check if the plane has been hit by any of the fighters or shermans bullets
		var shooters = fighters.concat(shermans);
		
		shooters.forEach(function (shooter){
			shooter.bullets.forEach(function (bullet){
				if (Utils.collidesWith(planeHitbox, bullet.getHitbox())) {	
					//damage the plane
					plane.health = plane.health - bullet.damage;

					//make the bullet explode
					bullet.explode();
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
	handlePlaneBullets() {

		//for each plane bullet...
		this.game.plane.bullets.forEach((bullet) => {

			//check if the bullet has hit the ground
			if (bullet.y >= bullet.canvas.height - this.game.background.groundHeight) {
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
	handlePlaneBombs() {
		//for each plane bomb...
		this.game.plane.bombs.forEach(function (bomb) {
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
	handleBomberBombs(bomber) {
		bomber.bombs.forEach((bomb) => {
			//check if the bomb has left the screen
			if (bomb.x + bomb.currentImage.width < 0) {
				bomb.active = false;
			}

			//make the bomb explode when it reaches the ground
			if (bomb.y + bomb.currentImage.height > bomb.canvas.height - 15) {
				bomb.explode(true);
			}
			
			//check if the bomb has been hit by any of the plane's bullets
			this.game.plane.bullets.forEach(function (bullet){
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
	handleBombers() {
		
		//separate the bombers from the list of enemies
		var bombers = _.filter(this.game.enemies, function (enemy) {
			return enemy.constructor === Bomber;
		});
		
		var planeHitbox = this.game.plane.getHitbox();

		//for each bomber...
		bombers.forEach((bomber) => {
			var bomberHitboxes = bomber.getHitbox();

			//handle all bombs ground and canvas collisions
			this.handleBomberBombs(bomber);

			//check if the bomber has left the screen
			if (bomber.x < -800) {
				bomber.active = false;
			}

			//when the bomber touches the ground raise the disabled and crashed flags and "anchor" it to the ground
			if (bomber.y + bomber.currentImage.height > bomber.canvas.height - this.game.background.groundHeight) {
				if(bomber.crashed === false){
					bomber.crash();
				}
			}

			//check if the bomber has collided with the plane
			if (Utils.collidesWith(bomberHitboxes, planeHitbox)) {
				bomber.health--;
				this.game.plane.health = this.game.plane.health - 2;
			}

			//check if any of the plane bullets have hit the bomber
			this.game.plane.bullets.forEach(function (bullet) {

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
			this.game.plane.bombs.forEach(function (bomb) {
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
	handleBombHoles(){
		//for each bomb hole...
		this.game.bombHoles.forEach(function (bombHole){
			//check if the bomb hole has left the screen
			if (bombHole.x + bombHole.currentImage.width < 0) {
				bombHole.active = false;
			}
		});
	};
	
	/**
	 * Handles all shermans collisions
	 */
	handleShermans(){
		
		//separate the shermans from the list of enemies
		var shermans = _.filter(this.game.enemies, function (enemy) {
			return enemy.constructor === Sherman;
		});
		
		//for each sherman...
		shermans.forEach((sherman) => {
			var shermanHitbox = sherman.getHitbox();
			
			//check if the sherman has left the screen
			if (sherman.x + sherman.currentImage.width < 0) {
				sherman.active = false;
			}
			
			//check if any of the plane bullets have hit the sherman
			this.game.plane.bullets.forEach(function (bullet) {
				if(Utils.collidesWith(shermanHitbox, bullet.getHitbox())){
					sherman.health = sherman.health - bullet.damage;
					
					//make the bullet explode
					bullet.explode();
				}
			});
			
			//check if any of the plane bombs have hit the sherman
			this.game.plane.bombs.forEach(function (bomb) {
				if(bomb.active === false && Utils.collidesWith(shermanHitbox, bomb.getExplosionHitbox())){
					sherman.health = sherman.health - bomb.damage;
					bomb.explode(false);
				}
			});
			
			//handle the fighter bullets ground and canvas collisions
			this.handleShermanBullets(sherman);
		});
		
	};
	
	/**
	 * Handles all sherman bullets ground and canvas collisions
	 * @param {Sherman} sherman
	 */
	handleShermanBullets(sherman) {
		//for each sherman bullet...
		sherman.bullets.forEach(function (bullet) {
			//check if the bullet has left the canvas
			if (bullet.x + bullet.currentImage.width < 0) {
				bullet.active = false;
			}
		});
	};
	
	/**
	 * Handles all fighters collisions
	 */
	handleFighters() {		
		//separate the fighters from the list of enemies
		var fighters = _.filter(this.game.enemies, function (enemy) {
			return enemy.constructor === Fighter;
		});
		
		var planeHitbox = this.game.plane.getHitbox();

		//for each fighter...
		fighters.forEach((fighter) => {
			var fighterHitbox = fighter.getHitbox();

			//check if the fighter has left the screen
			if (fighter.x < -800) {
				fighter.active = false;
			}

			//when the fighter touches the ground raise the disabled and crashed flags and "anchor" it to the ground
			if (fighter.y + fighter.currentImage.height > fighter.canvas.height - this.game.background.groundHeight) {
				if(fighter.crashed === false){
					fighter.crash();
				}
			}

			//check if the fighter has collided with the plane
			if (Utils.collidesWith(fighterHitbox, planeHitbox)) {
				fighter.health = fighter.health - 3;
				this.game.plane.health = this.game.plane.health - 2;
			}

			//check if any of the plane bullets have hit the fighter
			this.game.plane.bullets.forEach(function (bullet) {
				if(Utils.collidesWith(fighterHitbox, bullet.getHitbox())){
					fighter.health = fighter.health - bullet.damage;
					
					//make the bullet explode
					bullet.explode();
				}
			});
			
			//check if any of the plane bombs have hit the fighter
			this.game.plane.bombs.forEach(function (bomb) {
				if(Utils.collidesWith(fighterHitbox, bomb.getHitbox())){
					bomb.explode(false);
					fighter.disable();
				}
			});
			
			//handle the fighter bullets ground and canvas collisions
			this.handleFighterBullets(fighter);
		});
		
	};
	
	/**
	 * Handles all fighter bullets ground and canvas collisions
	 * @param {Fighter} fighter
	 */
	handleFighterBullets(fighter) {

		//for each fighter bullet...
		fighter.bullets.forEach((bullet) => {

			//check if the bullet has hit the ground
			if (bullet.y >= bullet.canvas.height - this.game.background.groundHeight) {
				//make the bullet explode
				bullet.explode();
			}

			//check if the bullet has left the canvas
			if (bullet.x + bullet.currentImage.width < 0) {
				bullet.active = false;
			}
		});

	};
	
	/**
	 * Handles all soldiers collisions
	 */
	handleSoldiers(){
		
		//separate the soldiers from the list of enemies
		var soldiers = _.filter(this.game.enemies, function (enemy) {
			return enemy.constructor === Soldier;
		});
		
		//for each soldier...
		soldiers.forEach((soldier) => {
			var soldierHitbox = soldier.getHitbox();
			
			//check if the soldier has left the screen
			if (soldier.x + soldier.currentImage.width < 0) {
				soldier.active = false;
			}
			
			//check if any of the plane bullets have hit the soldier
			this.game.plane.bullets.forEach(function (bullet) {
				if(Utils.collidesWith(soldierHitbox, bullet.getHitbox())){
					soldier.health = soldier.health - bullet.damage;
					
					//make the bullet explode
					bullet.explode();
				}
			});
			
			//check if any of the plane bombs have hit the soldier
			this.game.plane.bombs.forEach(function (bomb) {
				if(bomb.active === false && Utils.collidesWith(soldierHitbox, bomb.getExplosionHitbox())){
					soldier.health = soldier.health - bomb.damage;
					bomb.explode(true);
				}
			});
			
			//handle the soldiers bullets ground and canvas collisions
			this.handleSoldierBullets(soldier);
		});
		
	};
	
	/**
	 * Handles all soldier bullets ground and canvas collisions
	 * @param {Soldier} soldier
	 */
	handleSoldierBullets(soldier) {
		//for each soldier bullet...
		soldier.bullets.forEach(function (bullet) {
			//check if the bullet has left the canvas
			if (bullet.x + bullet.currentImage.width < 0) {
				bullet.active = false;
			}
		});
	};
	
	/**
	 * Handles all civilians collisions
	 */
	handleCivilians(){
		
		//separate the enemies by type
		var bombers = [];
		var shermans = [];
		var soldiers = [];
						
		this.game.enemies.forEach(function (enemy){
			switch(enemy.constructor){
				case Bomber:
					bombers.push(enemy);
					break;
				case Sherman:
					shermans.push(enemy);
					break;
				case Soldier:
					soldiers.push(enemy);
					break;
			}
		});
		
		//for each civilian...
		this.game.civilians.forEach((civilian) => {
			var civilianHitbox = civilian.getHitbox();
			
			//check if the civilian has left the screen
			if(civilian.x + civilian.currentImage.width < 0){
				civilian.active = false;
			}
			
			//check if the civilian has been hit by an enemy (or friendly bomb)
			var bombs = this.game.plane.bombs;
			bombers.forEach(function (bomber){
				bombs = bombs.concat(bomber.bombs);
			});
			
			bombs.forEach(function (bomb){
				//kill the civilian right when the bomb touches the ground (active === false)
				if(civilian.dead === false && bomb.active === false && Utils.collidesWith(civilianHitbox, bomb.getExplosionHitbox())){
					civilian.health = civilian.health - bomb.damage;
				}
			});
			
			//check if the civilian has been hit by an enemy (or friendly bullet)
			var bullets = this.game.plane.bullets;
			soldiers.forEach(function (soldier){
				bullets = bullets.concat(soldier.bullets);
			});
			
			bullets.forEach(function (bullet){
				if(civilian.dead === false && Utils.collidesWith(civilianHitbox, bullet.getHitbox())){
					bullet.explode();
					civilian.health = civilian.health - bullet.damage;
				}
			});
			
			//check if the civilian has been hit/ran over by an enemy tank (sherman)
			shermans.forEach(function (sherman){
				if(civilian.dead === false && Utils.collidesWith(civilianHitbox, sherman.getHullHitbox())){
					civilian.die();
				}
			});
						
		});
	};
	
	/**
	 * Handles all weather effects collisions
	 */
	handleWeatherEffects(){
		
		//for each weather effect (snowflake...)
		this.game.weatherEffects.forEach((weatherEffect) => {
			//when the weather effect touches the ground - reset it
			if(weatherEffect.y > weatherEffect.canvas.height - this.game.background.groundHeight){
				weatherEffect.reset();
			}
		});
		
	};

}