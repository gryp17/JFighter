/**
 * Keyboard class that handles all keyboard inputs
 * @param {Object} inputs
 * @returns {Keyboard}
 */
export default function Keyboard (inputs){
	var self = this;
	
	this.inputs = inputs;
	
	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	this.getInputs = function () {
		var result = {};
		
		_.forOwn(self.inputs, function (data, key){
			result[key] = data.status || false;
		});
		
		return result;
	};
	
	/**
	 * Initializes the keyboard controls
	 */
	this.listen = function () {
		
		//key down
		$("body").keydown(function (e) {
			_.forOwn(self.inputs, function (data, key){
				if(_.includes(data.keys, e.which)){
					data.status = true;
				}
			});
		});

		//key up
		$("body").keyup(function (e) {
			_.forOwn(self.inputs, function (data, key){
				if(_.includes(data.keys, e.which)){
					data.status = false;
				}
			});
		});
		
	};
	
}