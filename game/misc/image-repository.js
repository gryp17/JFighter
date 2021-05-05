/**
 * Image repository class that loads all provided images and calls the callback when done
 * @param {Object} images
 * @param {Function} callback
 * @returns {ImageRepository}
 */
export default function ImageRepository(images, callback) {
	var self = this;
	this.images = images;
	this.loadedImages = 0;
	this.totalImages = 0;

	countImages(this.images);
	loadImages(this.images);


	/**
	 * Recursive function that is used to count all images in the provided object
	 * @param {Object} object
	 */
	function countImages(object) {
		_.forOwn(object, function (value, key) {
			if (typeof value === 'string') {
				self.totalImages++;
			} else {
				countImages(value);
			}
		});
	}


	/**
	 * Recursive function that is used to preload all images in the provided object
	 * @param {type} object
	 */
	function loadImages(object) {
		_.forOwn(object, function (value, key) {
			//if the value is an image path preload it
			if (typeof value === 'string') {
				object[key] = new Image();
				object[key].src = value;

				object[key].onload = function () {
					self.loadedImages++;
					//call the callback once all images have been preloaded
					if (self.loadedImages === self.totalImages) {
						callback();
					}
				};
			} 
			//otherwise dig deeper into the object
			else {
				loadImages(value);
			}
		});

	}

};