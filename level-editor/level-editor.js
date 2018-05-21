/**
 * Class that handles all level editor actions
 * @param {Object} container
 * @returns {LevelEditor}
 */
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
		this.backgroundContainer.on("mousewheel", self.scrollBackground);

		//on theme value change - update the level theme
		$(".theme").change(self.setLevelTheme);
		
		//mousedown handler only for the game objects inside the controls
		this.controls.find(".game-object").mousedown(self.addGameObject);
		
		//mousedown handler only for the game objects inside the background container
		$("body").on("mousedown", ".background-container .game-object", self.selectGameObject);
		
		//on mouse up drop the object at the cursor position
		$("body").mouseup(self.dropGameObject);
		
		//on mouse move - move the dragged object to the mouse cursor position
		this.container.mousemove(self.dragGameObject);
		
		//on load level select change load the selected level
		$(".load-level").change(self.loadLevel);
		
		//on save button click get all objects and normalize their X and Y coordinates
		$(".save-level-button").click(self.saveLevel);
		
		//generate a random level name when the level editor loads
		$(".level-name").val("level_"+new Date().getTime());

	};
	
	/**
	 * Changes the selected theme/background.
	 */
	this.setLevelTheme = function (){
		var theme = $(this).val();
		
		var imagesPath = "img/levels/";
		var extension = ".jpg";
		self.backgroundContainer.css({backgroundImage: "url("+imagesPath+theme+extension+")"});
	};
	
	/**
	 * Called when the mousewheel is scrolled. 
	 * It makes the background scroll left or right.
	 * @param {Object} e
	 */
	this.scrollBackground = function (e) {
		var scrollLeft = $(document).scrollLeft();
		$(document).scrollLeft(scrollLeft + e.deltaY * 40);
		e.preventDefault();
	};

	/**
	 * Called only when a game object is selected from the controls area
	 * @param {Object} e
	 */
	this.addGameObject = function (e) {
		//copy the egame object and move it to the mouse cursor position
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
	};
	
	/**
	 * Called when a game object is selected inside the background container area
	 * @param {Object} e
	 */
	this.selectGameObject = function (e) {
		self.draggedObject = $(this);
		self.dragging = true;
		e.preventDefault();
	};
	
	/**
	 * Called when the mouseup event is fired anywhere inside the body
	 * @param {Object} e
	 */
	this.dropGameObject = function (e) {
		if (self.dragging) {

			//if the object was dropped outside of the level - don't do anything
			if (e.pageY > self.backgroundContainer.height()) {
				return;
			}

			var top = e.pageY;
			var left = e.pageX;

			//if the object is a ground object - anchor it to the ground by setting the correct "top" parameter
			if (self.groundObjects[self.draggedObject.attr("data-object")]) {
				var groundData = self.groundObjects[self.draggedObject.attr("data-object")];
				top = self.backgroundImageHeight - groundData.groundDistance - self.draggedObject.height();
			}

			self.draggedObject.css({
				top: top,
				left: left
			});

			//if the object doesn't have a remove button - add it
			if (!self.draggedObject.has(".remove-btn").length) {

				var removeBtn = $("<img>", {
					class: "remove-btn",
					src: "img/level-editor/icon-remove.png",
					title: "Remove",
					click: function (e) {
						$(this).closest(".game-object").remove();
						self.draggedObject = null;
						self.dragging = false;
						e.stopPropagation();
					}
				});

				self.draggedObject.append(removeBtn);
			}

			//move the object from the "body" to the background container when it needs to be dropped
			self.draggedObject.appendTo(self.backgroundContainer);

			self.draggedObject = null;
			self.dragging = false;
		}
	};
	
	/**
	 * Called when the mouse move event is fired
	 * @param {Object} e
	 */
	this.dragGameObject = function (e) {
		if (self.dragging) {
			self.draggedObject.css({
				top: e.pageY,
				left: e.pageX
			});
		}
	};
		
	/**
	 * Loads the selected level from the cookies
	 */
	this.loadLevel = function () {
		var selectedLevel = $(this).val();
		console.log(selectedLevel);
		
		//TODO:
		//load the data from the cookies
		//set the correct weather and theme
		//set the "save as" name as the current level name
		
	};
	
	/**
	 * Get all games objects from the DOM and normalize their coordinates
	 */
	this.saveLevel = function () {
		var enemies = [];
		var objects = self.backgroundContainer.find(".game-object");

		objects.each(function () {
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
	};
	
}
