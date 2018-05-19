function LevelEditor(container) {
	var self = this;
	
	//selectors
	this.container = container;
	this.backgroundContainer = this.container.find(".background-container");
	this.controlsContainer = this.container.find(".controls-container");
	this.controls = this.container.find(".controls");
	
	//mouse status
	this.dragging = false;
	this.draggedObject;

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
		
		//mousedown handler only for the game objects inside the controls
		this.controls.find(".game-object").mousedown(function (e){
			
			//copy th egame object and move it to the mouse cursor position
			self.draggedObject = $(this).clone();
			self.draggedObject.css({position: "absolute"});
			self.draggedObject.css({
				top: e.pageY,
				left: e.pageX
			});
			
			//append it to the body temporarily
			$("body").append(self.draggedObject);
			
			self.dragging = true;
			e.preventDefault();
		});

		//on mouse up drop the object at the cursor position
		$("body").mouseup(function (e) {

			if (self.dragging) {
				
				//if the object was dropped outside of the level - don't do anything
				if(e.pageY > self.backgroundContainer.height()){
					return;
				}
				
				self.draggedObject.css({
					top: e.pageY,
					left: e.pageX
				});

				//move the object from the "body" to the background container when it needs to be dropped
				self.draggedObject.appendTo(self.backgroundContainer);

				self.draggedObject = null;
				self.dragging = false;

				console.log(e.pageX + " --- " + e.pageY);
			}

		});
		
		//on mouse move - move the dragged object to the mouse cursor position
		this.container.mousemove(function (e){
			if(self.dragging){
				self.draggedObject.css({
					top: e.pageY,
					left: e.pageX
				});				
			}
		});
		
		//on save button click get all objects and normalize their X and Y coordinates
		$(".save-level-button").click(function (){
			var enemies = [];
			var objects = self.backgroundContainer.find(".game-object");
			
			objects.each(function (){
				var enemy = $(this);
				
				var x = parseInt(enemy.css("left").replace("px", ""));
				var y = parseInt(enemy.css("top").replace("px", ""));
				
				//x = x + (x * 24.56/100); 
				x = x + (x * 30/100); 
				
				//TODO: adjust Y as well
				
				enemies.push({
					objectType: enemy.attr("data-object"),
					arguments: {
						x: x,
						y: y
					}
				});
			});
			
			console.log(enemies);
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
