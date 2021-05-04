/**
 * Context class that creates a new Context object that contains the canvas and context object for the specified canvas id
 */
export default class Context {

	/**
	 * Context constructor
	 * @param {String} id 
	 */
	constructor(id) {
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext("2d");
	}
}