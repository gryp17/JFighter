/**
 * Sprite helper class used for handling object sprites
 * @param {Array} images
 * @param {Number} delay - the interval between each sprite image
 * @returns {Sprite}
 */
function Sprite(images, delay) {
	this.images = images;
	this.delay = delay;
	
	this.index = 0;
	this.frames = 0;
	this.currentImage = this.images[this.index];
	
	/**
	 * Called in order to get the current/next sprite image
	 * @returns {String}
	 */
	this.move = function (){
		this.frames++;
		
		//if the limit has been reached show the next sprite image
		if (this.frames > this.delay) {
			this.index++;

			if (_.isUndefined(this.images[this.index])) {
				this.index = 0;
			}

			this.currentImage = this.images[this.index];
			this.frames = 0;
		}
		
		return this.currentImage;
	};
	
}