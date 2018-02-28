/**
 * Keyboard class that handles all keyboard inputs
 * @param {Object} inputs - optional inputs object that overwrites the default inputs
 * @returns {Keyboard}
 */
function Keyboard (inputs){
	var self = this;
	
	//custom inputs
	if (inputs) {
		this.inputs = inputs;
	} 
	//default inputs
	else {
		this.inputs = {
			LEFT: {
				status: false,
				keys: [37, 65] //left arrow, A
			},
			RIGHT: {
				status: false,
				keys: [39, 68] //right arrow, D
			},
			UP: {
				status: false,
				keys: [38, 87] //arrow up, W
			},
			DOWN: {
				status: false,
				keys: [40, 83] //arrow down, S
			},
			SHOOT: {
				status: false,
				keys: [32] //space
			},
			BOMB: {
				status: false,
				keys: [16] //shift
			}
		};
	}
	
	/**
	 * Returns all input statuses
	 * @returns {Object}
	 */
	this.getInputs = function () {
		var result = {};
		
		_.forOwn(self.inputs, function (data, key){
			result[key] = data.status;
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