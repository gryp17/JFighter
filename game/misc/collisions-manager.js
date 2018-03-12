/**
 * Class used for handling all game object collisions
 * @param {Game} game
 * @returns {CollisionsManager}
 */
function CollisionsManager(game) {

	/**
	 * Handles the collisions for all game objects
	 */
	this.handleCollisions = function () {
		
		//separate the bombers from the list of enemies
		var bombers = _.filter(game.enemies, function (enemy) {
			return enemy.constructor === Bomber;
		});

		//handle the plane collisions
		this.handlePlane();

		//handle the bombers collisions
		this.handleBombers(bombers);
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
	};

	/**
	 * Handles all bombers collisions
	 * @param {Array} bombers
	 */
	this.handleBombers = function (bombers) {
		var planeHitbox = game.plane.getHitbox();

		//for each bomber...
		bombers.forEach(function (bomber) {
			var bomberHitboxes = bomber.getHitbox();

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

					//raise the impact flag that destroys the bullet and adds an impact animation
					bullet.impact = true;
				}

			});
			
		});

	};

}