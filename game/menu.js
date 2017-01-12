function Menu() {
	var self = this;
	this.selectedPlane = null;
	this.selectedLevel = null;

	/**
	 * Hides the loader and shows the game menu
	 * @param {Function} startGameCallback
	 */
	this.showMenu = function (startGameCallback) {
		$(".uil-ring-css").fadeOut(300, function () {
			$("#main-menu").fadeIn(300);
		});

		//on plane selection
		$("#main-menu .plane").click(function () {
			self.selectedPlane = $(this).attr("data-plane");

			$("#main-menu .select-plane").fadeOut(100, function (){
				$("#main-menu .select-level").fadeIn(100);
			});
		});
		
		//on level selection
		$("#main-menu .level").click(function (){
			self.selectedLevel = $(this).attr("data-level");
			
			$("#main-menu").fadeOut(300, function () {
				$(".canvas").fadeIn(300);
			});
			
			//call the callback with the selected plane and level
			startGameCallback(self.selectedPlane, self.selectedLevel);
		});
	};

}