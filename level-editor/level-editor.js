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
	this.themeDropdown = this.controls.find(".theme-dropdown");
	this.weatherDropdown = this.controls.find(".weather-dropdown");
	this.loadLevelDropdown = this.controls.find(".load-level-dropdown");
	this.saveLevelButton = this.controls.find(".save-level-button");
	this.levelName = this.controls.find(".level-name");

	//heights
	this.canvasHeight = 620;
	this.backgroundImageHeight = this.backgroundContainer.height();
	this.heightOffset = this.backgroundImageHeight - this.canvasHeight;

	//mouse status
	this.dragging = false;
	this.draggedObject;

	//custom levels
	this.customLevels = {};
	this.weatherInterval = 4096;

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
	 * Initialize the level editor by setting all event listeners and loading all custom levels
	 */
	this.init = function () {

		//load all custom levels from the cookies (if any)
		this.loadCustomLevels();

		//fill the "load level" dropdown with the levels data
		this.updateCustomLevelsDropdown();

		//move the level background on mouse wheel scroll
		this.backgroundContainer.on("mousewheel", self.scrollBackground);

		//on theme value change - update the level theme
		this.themeDropdown.change(self.setLevelTheme);

		//mousedown handler only for the game objects inside the controls
		this.controls.find(".game-object").mousedown(self.addGameObject);

		//mousedown handler only for the game objects inside the background container
		$("body").on("mousedown", ".background-container .game-object", self.selectGameObject);

		//on mouse up drop the object at the cursor position
		$("body").mouseup(self.dropGameObject);

		//on mouse move - move the dragged object to the mouse cursor position
		this.container.mousemove(self.dragGameObject);

		//on load level select change load the selected level
		this.loadLevelDropdown.change(self.loadLevel);

		//on save button click get all objects and normalize their X and Y coordinates
		this.saveLevelButton.click(self.saveLevel);
		
		//on "enter" keypress on the level name input - save the level
		this.levelName.keypress(function (e) {
			if (e.which === 13) {
				self.saveLevel();
			}
		});

		//generate a random level name when the level editor loads
		this.levelName.val("level_" + new Date().getTime());

	};

	/**
	 * Loads all custom levels data from the cookies
	 */
	this.loadCustomLevels = function () {
		var data = Cookies.get(CONFIG.COOKIE.CUSTOM_LEVELS.NAME);

		if (data) {
			this.customLevels = JSON.parse(data);
		} else {
			this.customLevels = {};
		}
	};
	
	/**
	 * Fills the "load level" dropdown options
	 */
	this.updateCustomLevelsDropdown = function () {
		this.loadLevelDropdown.find("option[disabled!=disabled]").remove();
		
		_.forOwn(this.customLevels, function (levelData, levelName){
			var option = $("<option>", {
				value: levelName,
				text: levelName
			});
			
			self.loadLevelDropdown.append(option);
		});
	};
	
	/**
	 * Changes the selected theme/background.
	 */
	this.setLevelTheme = function () {
		var theme = $(this).val();

		var levelsPath = "img/levels/";
		var extension = ".jpg";
		self.backgroundContainer.css({backgroundImage: "url(" + levelsPath + theme + extension + ")"});
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
				var removeBtn = self.generateGameObjectRemoveButton();
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
	 * Removes all game objects from the editor
	 */
	this.clearGameObjects = function (){
		this.backgroundContainer.find(".game-object").remove();
	};
	
	/**
	 * Generates the remove button that is attached to each game object inside the editor
	 * @returns {Object}
	 */
	this.generateGameObjectRemoveButton = function (){
		return $("<img>", {
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
	};

	/**
	 * Loads the selected level into the editor
	 */
	this.loadLevel = function () {
		var selectedLevel = $(this).val();
		
		var levelData = self.customLevels[selectedLevel];
		
		if(!levelData){
			alert("Level Not Found");
		}
		
		//remove all game objects from the editor
		self.clearGameObjects();
		
		//set the level name
		self.levelName.val(selectedLevel);
		
		//set the level theme and trigger the dropdown change event
		self.themeDropdown.val(levelData.THEME);
		self.themeDropdown.change();
		
		//set the level weather
		switch(levelData.WEATHER.TYPE){
			case "rain":
				if(levelData.WEATHER.INTERVAL){
					self.weatherDropdown.val("rain");
				}else{
					self.weatherDropdown.val("heavy-rain");
				}
				break;
			case "snow":
				self.weatherDropdown.val("snow");
				break;
			default:
				self.weatherDropdown.val("default");
		}
		
		var gameObjects = levelData.ENEMIES.concat(levelData.CIVILIANS);
		
		//add all enemies and civilians to the editor
		gameObjects.forEach(function (object){
			
			//generate the game object
			var gameObject = $("<div>", {
				class: "game-object",
				"data-object": object.objectType,
				title: object.objectType
			});
			
			//generate the correct image
			var image = $("<img>");
			switch(object.objectType){
				case "Fighter": 
					image.attr("src", "img/enemies/mustang/default/1.png");
					break;
				case "Bomber":
					image.attr("src", "img/enemies/b17/default/1.png");
					break;
				case "Sherman":
					image.attr("src", "img/enemies/sherman/1.png");
					break;
				case "Civilian":
					image.attr("src", "img/civilian/red/2.png");
					break;
			}
			
			//generate the remove button
			var removeBtn = self.generateGameObjectRemoveButton();
			
			gameObject.append(image);
			gameObject.append(removeBtn);
			
			//position the object using the provided arguments (and normalizing the Y coordinate)
			gameObject.css({
				left: object.arguments.x,
				top: object.arguments.y + self.heightOffset
			});
			
			//add the game object to the editor
			self.backgroundContainer.append(gameObject);
		});
		
	};

	/**
	 * Get all games objects from the DOM and normalize their coordinates
	 */
	this.saveLevel = function () {
		var enemies = [];
		var civilians = [];
		var objects = self.backgroundContainer.find(".game-object");
		var levelName = self.levelName.val();
		var selectedTheme = self.themeDropdown.val();
		var selectedWeather = self.weatherDropdown.val();
		
		//check if the level name is set
		if(!levelName || levelName.trim() === ""){
			alert("Invalid Level Name");
			return;
		}

		//separate the objects into enemies and civilians and normalize the Y coordinate
		objects.each(function () {
			var object = $(this);
			var offset = object.offset();

			var x = offset.left;
			var y = offset.top;

			//normalize the Y coordinate
			y = y - self.heightOffset;

			var item = {
				objectType: object.attr("data-object"),
				arguments: {
					x: x,
					y: y
				}
			};
			
			if(object.attr("data-object") === "Civilian"){
				civilians.push(item);
			}else{
				enemies.push(item);
			}
		});

		//generate the weather object
		var weather = {};
		
		switch(selectedWeather){
			case "heavy-rain":
				weather.TYPE = "rain";
				break;
			case "rain":
				weather.TYPE = "rain";
				weather.INTERVAL = self.weatherInterval;
				break;
			case "snow":
				weather.TYPE = "snow";
				break;
			default:
				weather.TYPE = "normal";
		}

		//assemble the level data
		var level = {
			THEME: selectedTheme,
			WEATHER: weather,
			GROUND_HEIGHT: self.groundHeight,
			CIVILIANS: civilians,
			ENEMIES: enemies
		};

		//insert/overwrite the level data
		self.customLevels[levelName] = level;
		
		//update the cookies
		Cookies.set(CONFIG.COOKIE.CUSTOM_LEVELS.NAME, self.customLevels, {expires: CONFIG.COOKIE.CUSTOM_LEVELS.EXPIRES});
		
		//update the custom levels dropdown options
		self.updateCustomLevelsDropdown();
		
		alert("Level Saved");
	};

}
