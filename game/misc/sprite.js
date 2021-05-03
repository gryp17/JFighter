/**
 * Sprite helper class used for handling object sprites
 * @param {Array} images
 * @param {Number} delay - the interval between each sprite image
 * @param {Boolean} loop
 * @returns {Sprite}
 */
export default function Sprite(images, delay, loop) {
	this.images = images;
	this.delay = delay;
	this.loop = loop;
	
	this.index = 0;
	this.frames = 0;
	this.currentImage = this.images[this.index];
	
	/**
	 * Called in order to get the current/next sprite image
	 * @returns {String}
	 */
	this.move = function (){
		
		//if the loop flag is not raised and we have already looped thought all images - return null
		if(!this.loop && this.index === this.images.length - 1){
			this.currentImage = null;
			return this.currentImage;
		}
		
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
	
	/**
	 * Lets you start the sprite animation from a specified index
	 * @param {Number} index
	 * @returns {String}
	 */
	this.moveTo = function (index){
		this.index = index;
		this.currentImage = this.images[this.index];
		return this.move();
	};
	
}