function LevelEditor(container) {
	var self = this;
	
	this.container = container;
	this.backgroundContainer = this.container.find(".background-container");
	this.controlsContainer = this.container.find(".controls-container");
	this.controls = this.container.find(".controls");

	/**
	 * Initialize the level editor by setting all event listeners
	 */
	this.init = function () {

		//resize the controls container if the page resizes
		$(window).resize(function () {
			self.showControlsContainer();
		});

		//move the level background on mouse wheel scroll
		this.backgroundContainer.on("mousewheel", function (e) {
			var scrollLeft = $(document).scrollLeft();
			$(document).scrollLeft(scrollLeft + e.deltaY * 40);
			e.preventDefault();
		});

		//on theme value change - update the level theme
		$(".theme").change(function () {
			self.setLevelTheme($(this).val());
		});


		//show the controls
		this.showControlsContainer();
	};

	/**
	 * Sets the controls container to the same width as the document and shows it
	 */
	this.showControlsContainer = function () {
		this.controlsContainer.css("width", $(window).width());
		this.controlsContainer.fadeIn(500);
	};
	
	/**
	 * Changed the selected theme/background
	 * @param {String} theme
	 */
	this.setLevelTheme = function (theme){
		var imagesPath = "img/levels/";
		var extension = ".jpg";
		this.backgroundContainer.css({backgroundImage: "url("+imagesPath+theme+extension+")"});
	};
	
}
