/**
 * Utils class containing helper functions
 */
export default new function Utils() {
	var self = this;
	
	/**
	 * Checks if the two rectangles intersect
	 * @param {Object} objectA
	 * @param {Object} objectB
	 * @returns {Boolean}
	 */
	this.intersect = function (objectA, objectB) {
		var result = false;
		
		//calculate the margins for both objects
		objectA = calculateMargins(objectA);
		objectB = calculateMargins(objectB);
		
		//calculate the horizontal and vertical overlap
		var horizontalOverlap = Math.max(0, Math.min(objectA.right, objectB.right) - Math.max(objectA.left, objectB.left));
		var verticalOverlap = Math.max(0, Math.min(objectA.bottom, objectB.bottom) - Math.max(objectA.top, objectB.top));
		
		if(horizontalOverlap !== 0 && verticalOverlap !== 0) {
			result = true;
		}
		
		return result;
	};
	
	/**
	 * Checks if the provided hitboxes collide
	 * @param {Object|Array} hitboxA
	 * @param {Object|Array} hitboxB
	 * @returns {Boolean}
	 */
	this.collidesWith = function (hitboxA, hitboxB) {
		var result = false;
		
		//convert both hitboxes to arrays in case they are not arrays (some game objects might have more than 1 hitbox!)
		if(hitboxA.constructor !== Array) {
			hitboxA = [hitboxA];
		}
		
		if(hitboxB.constructor !== Array) {
			hitboxB = [hitboxB];
		}
		
		//check if the hitboxes collide
		hitboxA.forEach(function (a) {
			hitboxB.forEach(function (b) {
				if(self.intersect(a, b)) {
					result = true;
				}
			});
		});
		
		return result;
	};
		
	/**
	 * Private function that calculates the top, right, bottom and left margins of the object
	 * @param {Object} object
	 * @returns {Object}
	 */
	function calculateMargins (object) {
		object.left = object.x;
		object.top = object.y + object.offset;
		object.right = object.left + object.width;
		object.bottom = object.top + object.height;
		return object;
	};
	
	/**
	 * Generates all health bar parameters
	 * @param {Object} hitbox
	 * @param {Number} maxHealth
	 * @param {Number} currentHealth
	 * @returns {Object}
	 */
	this.generateHealthBar = function (hitbox, maxHealth, currentHealth) {
		var barWidth = 50;
		var barHeight = 5;
		var barBorder = 'black';
		var barBackground = 'red';
		var horizontalDistance = 0; //used to center the health bar
		var verticalDistance = 5;
		
		if(barWidth > hitbox.width) {
			barWidth = hitbox.width;
		}else{
			horizontalDistance = (hitbox.width - barWidth) / 2;
		}
		
		var pixelsPerHP = barWidth / maxHealth;
		
		return {
			x: hitbox.x + horizontalDistance,
			y: hitbox.y + hitbox.offset - verticalDistance,
			strokeRect: {
				style: barBorder, 
				width: barWidth,
				height: barHeight
			},
			fillRect: {
				style: barBackground,
				width: pixelsPerHP * currentHealth,
				height: barHeight
			}
		};		
	};
	
	
};
