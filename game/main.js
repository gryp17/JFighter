var imageRepository = new ImageRepository({
	"BACKGROUND": "img/grass.jpg",
	"PLANE_1": "img/plane1.png",
	"PLANE_2": "img/plane2.png"
}, function (){
	init();
});


/**
 * Main function that is called when all images have been loaded
 */
function init() {
	//canvas/context objects
	var BACKGROUND = new Context("background-canvas");
	var PLANE = new Context("plane-canvas");
	BACKGROUND.canvas.focus();

	//game objects
	var background = new Background(BACKGROUND, imageRepository);

	function animate() {
		requestAnimFrame(animate);
		background.draw();
	}

	/** 
	* requestAnim shim layer by Paul Irish 
	* Finds the first API that works to optimize the animation loop, 
	* otherwise defaults to setTimeout(). 
	*/
	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback, element) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();


	animate();
}
