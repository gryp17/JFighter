/**
 * Image repository class that loads all provided images and calls the callback when done
 * @param {Object} images
 * @param {Function} callback
 * @returns {ImageRepository}
 */
function ImageRepository(images, callback){
	var self = this;
	this.images = images;
	this.loadedImages = 0;
	this.totalImages = Object.keys(this.images).length;
			
	_.forOwn(self.images, function (value, key){
		self.images[key] = new Image(); 
		self.images[key].src = value;
		
		self.images[key].onload = function() {
			self.loadedImages++;
			if (self.loadedImages === self.totalImages) {
				callback();
			}
		};
	});

};