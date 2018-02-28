/**
 * Utils class containing static functions
 */
var Utils = new function () {
	
	/**
	 * Checks if the two rectangles intersect
	 * @param {Object} objectA
	 * @param {Object} objectB
	 * @returns {Boolean}
	 */
	this.intersect = function (objectA, objectB){
		var result = false;
		
		//calculate the margins for both objects
		objectA = calculateMargins(objectA);
		objectB = calculateMargins(objectB);
		
		//calculate the horizontal and vertical overlap
		var horizontalOverlap = Math.max(0, Math.min(objectA.right, objectB.right) - Math.max(objectA.left, objectB.left));
        var verticalOverlap = Math.max(0, Math.min(objectA.bottom, objectB.bottom) - Math.max(objectA.top, objectB.top));
		
		if(horizontalOverlap !== 0 && verticalOverlap !== 0){
			result = true;
		}
		
		return result;
	};
	
	/**
	 * Private function that calculates the top, right, bottom and left margins of the object
	 * @param {Object} object
	 * @returns {Object}
	 */
	function calculateMargins (object){
		object.left = object.x;
		object.top = object.y + object.offset;
		object.right = object.left + object.width;
		object.bottom = object.top + object.height;
		return object;
	};
	
};
