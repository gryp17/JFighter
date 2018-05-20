function LevelEditor(container) {
	var self = this;
	
	//selectors
	this.container = container;
	this.backgroundContainer = this.container.find(".background-container");
	this.controlsContainer = this.container.find(".controls-container");
	this.controls = this.container.find(".controls");
	
	//heights
	this.canvasHeight = 620;
	this.backgroundImageHeight = this.backgroundContainer.height();
	this.heightOffset = this.backgroundImageHeight - this.canvasHeight;
	
	//mouse status
	this.dragging = false;
	this.draggedObject;
	
	//objects that need to be placed on the ground
	this.groundObjects = {
		Sherman: {
			groundDistance: 10
		},
		Civilian: {
			groundDistance: 24
		}
	};
	this.groundHeight = 40;

	/**
	 * Initialize the level editor by setting all event listeners
	 */
	this.init = function () {

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
				
				var top = e.pageY;
				var left = e.pageX;
				
				//if the object is a ground object - anchor it to the ground by setting the correct "top" parameter
				if(self.groundObjects[self.draggedObject.attr("data-object")]){
					var groundData = self.groundObjects[self.draggedObject.attr("data-object")];
					top = self.backgroundImageHeight - groundData.groundDistance - self.draggedObject.height();
				}
								
				self.draggedObject.css({
					top: top,
					left: left
				});

				//move the object from the "body" to the background container when it needs to be dropped
				self.draggedObject.appendTo(self.backgroundContainer);

				self.draggedObject = null;
				self.dragging = false;
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
				var offset = enemy.offset();
				
				var x = offset.left;
				var y = offset.top;
				
				//normalize the Y coordinate
				y = y - self.heightOffset;
				
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
