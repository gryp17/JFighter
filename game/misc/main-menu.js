/**
 * Class used for handling the main menu
 * @returns {MainMenu}
 */
function MainMenu() {
	var self = this;
	
	this.loadingIndicator = $(".uil-ring-css");
	this.mainMenu = $("#main-menu");
	this.selectPlaneScreen = this.mainMenu.find(".select-plane");
	this.selectLevelScreen = this.mainMenu.find(".select-level");
	this.levelsList = this.selectLevelScreen.find(".levels-list");
	this.thumbnailContainer = this.levelsList.find(".thumbnail-container");
	
	//default game levels
	this.gameLevels = {
		GRASSLAND: GRASSLAND,
		DESERT: DESERT,
		WINTER: WINTER
	};
	
	this.levelIndex = 0;;
	
	this.selectedPlane;
	this.selectedLevel;

	/**
	 * Hides the loader and shows the game menu
	 * @param {Function} startGameCallback
	 */
	this.showMenu = function (startGameCallback) {
		
		//load all custom levels from the cookies
		this.loadCustomLevels();
		
		//display the first level by default
		this.setCurrentLevel(this.levelIndex);
		
		//on plane selection
		this.mainMenu.find(".plane").click(this.selectPlane);
		
		//levels list arrow handler
		this.levelsList.find(".arrow").click(this.changeLevel);
		
		//on level selection
		this.levelsList.find(".thumbnail-container").click(function (){
			//set the selected level
			self.selectedLevel = $(this).attr("data-level");
		
			//start the game
			self.startGame(startGameCallback);
		});
		
		this.selectLevelScreen.find(".start-game-button").click(function (){
			//set the selected level
			var levelNames = Object.keys(self.gameLevels);
			self.selectedLevel = levelNames[self.levelIndex];
			
			//start the game
			self.startGame(startGameCallback);
		});
		
		//hide the loading indicator and show the main menu
		this.loadingIndicator.fadeOut(300, function () {
			self.mainMenu.fadeIn(300);
		});
		
	};
	
	/**
	 * Called when any of the planes is clicked.
	 * It hides the select plane screen and shows the select level screen
	 */
	this.selectPlane = function () {
		self.selectedPlane = $(this).attr("data-plane");

		self.selectPlaneScreen.fadeOut(100, function () {
			self.selectLevelScreen.fadeIn(100);
		});
	};
	
	/**
	 * Called when one of the arrows is clicked.
	 * It increments/decrements the level index and sets the current level
	 */
	this.changeLevel = function () {
		
		if ($(this).hasClass("previous")) {
			self.levelIndex--;
		} else {
			self.levelIndex++;
		}
		
		self.setCurrentLevel(self.levelIndex);
	};
	
	/**
	 * Sets the current level by updating the level thumbnail and title
	 * @param {Number} index
	 */
	this.setCurrentLevel = function (index) {
		var title = self.thumbnailContainer.find("h2");
		var thumbnail = self.thumbnailContainer.find("img");
		
		var levelNames = Object.keys(self.gameLevels);
		
		self.levelIndex = index;
		
		//reset the levelIndex if necessary
		if(self.levelIndex > levelNames.length - 1){
			self.levelIndex = 0;
		}else if(self.levelIndex < 0){
			self.levelIndex = levelNames.length - 1;
		}
		
		var levelName = levelNames[self.levelIndex];
		var currentLevel = self.gameLevels[levelName];
		
		title.html(levelName);
		thumbnail.attr("src", "img/levels/thumbnails/"+currentLevel.THEME.toLowerCase()+".jpg");
		self.thumbnailContainer.attr("data-level", levelName);
	};
		
	/**
	 * Loads all custom levels (if any) from the cookies and merges them with the default game levels
	 */
	this.loadCustomLevels = function () {
		var customLevels = Cookies.get(CONFIG.COOKIE.CUSTOM_LEVELS.NAME);

		if (customLevels) {
			customLevels = JSON.parse(customLevels);

			_.forOwn(customLevels, function (levelData, levelName) {
				self.gameLevels["CUSTOM_" + levelName] = levelData;
			});
		}
	};
	
	/**
	 * Hides the main menu, shows the game canvas and calls the startGameCallback with the selected plane and level
	 * @param {Function} startGameCallback
	 */
	this.startGame = function (startGameCallback) {
		self.mainMenu.fadeOut(300, function () {
			$(".canvas").fadeIn(300);
		});

		//call the callback with the selected plane and level
		startGameCallback(self.gameLevels, self.selectedPlane, self.selectedLevel);
	};

}