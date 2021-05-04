import config from '@/config/config';
import keyCodesMap from '@/game/resources/key-codes';
import grassland from '@/game/resources/levels/grassland';
import desert from '@/game/resources/levels/desert';
import winter from '@/game/resources/levels/winter';

/**
 * Class used for handling the main menu
 */
export default class MainMenu {

	/**
	 * MainMenu constructor
	 * @param {Object} defaultControls 
	 */
	constructor(defaultControls) {
		this.defaultControls = defaultControls;

		this.loadingIndicator = $(".uil-ring-css");
		this.innerContainer = $("#inner-container");
		this.mainMenu = $("#main-menu");
		this.controlsPopup = this.mainMenu.find(".controls-popup");
		this.selectPlaneScreen = this.mainMenu.find(".select-plane");
		this.selectLevelScreen = this.mainMenu.find(".select-level");
		this.levelsList = this.selectLevelScreen.find(".levels-list");
		this.thumbnailContainer = this.levelsList.find(".thumbnail-container");
		
		//game controls
		this.controls;
		
		this.controlsMap = {
			LEFT: "BRAKES",
			RIGHT: "THROTTLE",
			UP: "ASCEND",
			DOWN: "DESCEND",
			SHOOT: "SHOOT",
			BOMB: "DROP BOMB"
		};
		
		//default game levels
		this.gameLevels = {
			GRASSLAND: grassland,
			DESERT: desert,
			WINTER: winter
		};
		
		this.levelIndex = 0;
		
		this.selectedPlane;
		this.selectedLevel;
	}

	/**
	 * Hides the loader and shows the game menu
	 * @param {Function} startGameCallback
	 */
	showMenu(startGameCallback) {
				
		//load all custom levels from the local storage
		this.loadCustomLevels();
		
		//display the first level by default
		this.setCurrentLevel(this.levelIndex);
		
		//open the controls popup
		this.mainMenu.find(".controls-button").click(this.openControlsPopup.bind(this));
		
		//load the game controls
		this.loadCustomControls();
		
		//close the controls popup
		this.controlsPopup.find(".close").click(this.closeControlsPopup.bind(this));
		
		//on popup (backdrop) click close the popup
		this.controlsPopup.click((e) => {
			if (e.target === this.controlsPopup[0]){
				this.closeControlsPopup();
			}
		});
		
		//reset all controls to default
		this.controlsPopup.find(".reset-controls").click(() => {
			this.resetControls();
			this.buildControlsList();
		});
		
		//save the controls
		this.controlsPopup.find(".save-controls").click(this.saveControls.bind(this));
		
		//key up/down handlers for the controls inputs
		$("body").on("keydown", ".controls-popup input", function (){
			return false;
		});
		$("body").on("keyup", ".controls-popup input", this.setInput.bind(this));
		
		//on plane selection
		this.mainMenu.find(".plane").click(this.selectPlane.bind(this));
		
		//levels list arrow handler
		this.levelsList.find(".arrow").click(this.changeLevel.bind(this));
		
		//on level selection
		this.levelsList.find(".thumbnail-container").click((e) => {
			const level = $(e.currentTarget).attr("data-level");
			//set the selected level
			this.selectedLevel = level;
		
			//start the game
			this.startGame(startGameCallback);
		});
		
		//on start game button... start the game!
		this.selectLevelScreen.find(".start-game-button").click(() => {
			//set the selected level
			var levelNames = Object.keys(this.gameLevels);
			this.selectedLevel = levelNames[this.levelIndex];
			
			//start the game
			this.startGame(startGameCallback);
		});
		
		//hide the loading indicator and show the main menu
		this.loadingIndicator.fadeOut(300, () => {
			this.innerContainer.fadeIn(300);
		});
		
	};
	
	/**
	 * Called when any of the planes is clicked.
	 * It hides the select plane screen and shows the select level screen
	 */
	selectPlane(e) {
		this.selectedPlane = $(e.currentTarget).attr("data-plane");

		this.selectPlaneScreen.fadeOut(100, () => {
			this.selectLevelScreen.fadeIn(100);
		});
	};
	
	/**
	 * Called when one of the arrows is clicked.
	 * It increments/decrements the level index and sets the current level
	 */
	changeLevel(e) {
		if ($(e.currentTarget).hasClass("previous")) {
			this.levelIndex--;
		} else {
			this.levelIndex++;
		}
		
		this.setCurrentLevel(this.levelIndex);
	};
	
	/**
	 * Sets the current level by updating the level thumbnail and title
	 * @param {Number} index
	 */
	setCurrentLevel(index) {
		var title = this.thumbnailContainer.find("h2");
		var thumbnail = this.thumbnailContainer.find("img");
		
		var levelNames = Object.keys(this.gameLevels);
		
		this.levelIndex = index;
		
		//reset the levelIndex if necessary
		if(this.levelIndex > levelNames.length - 1){
			this.levelIndex = 0;
		}else if(this.levelIndex < 0){
			this.levelIndex = levelNames.length - 1;
		}
		
		var levelName = levelNames[this.levelIndex];
		var currentLevel = this.gameLevels[levelName];
		
		title.html(levelName);
		thumbnail.attr("src", "img/levels/thumbnails/"+currentLevel.THEME.toLowerCase()+".jpg");
		this.thumbnailContainer.attr("data-level", levelName);
	};
		
	/**
	 * Loads all custom levels (if any) from the local storage and merges them with the default game levels
	 */
	loadCustomLevels() {
		var customLevels = localStorage.getItem(config.LOCAL_STORAGE.CUSTOM_LEVELS.NAME);

		if (customLevels) {
			customLevels = JSON.parse(customLevels);
			
			_.forOwn(customLevels, (levelData, levelName) => {
				this.gameLevels["[CUSTOM] " + levelName] = levelData;
			});
		}
	};
	
	/**
	 * Loads all custom controls if there are any
	 */
	loadCustomControls(){
		var customControls = localStorage.getItem(config.LOCAL_STORAGE.CUSTOM_CONTROLS.NAME);
		
		if(customControls){
			this.controls = JSON.parse(customControls);
		}else{
			this.controls = _.cloneDeep(this.defaultControls);
		}
	};
	
	/**
	 * Opens the controls popup window
	 */
	openControlsPopup(){
		this.loadCustomControls();
		this.buildControlsList();
		
		this.controlsPopup.fadeIn(300);
	};
	
	/**
	 * Close the controls popup window
	 */
	closeControlsPopup(){
		this.controlsPopup.fadeOut(300);
	};
	
	/**
	 * Resets the game controls to their default values
	 */
	resetControls(){
		this.controls = _.cloneDeep(this.defaultControls);
	};
	
	/**
	 * Updates the local storage with the new controls configuration and closes the popup
	 */
	saveControls(){
		localStorage.setItem(config.LOCAL_STORAGE.CUSTOM_CONTROLS.NAME, JSON.stringify(this.controls));
		this.closeControlsPopup();
	};
	
	/**
	 * Builds the controls list table
	 */
	buildControlsList(){
		var tbody = this.controlsPopup.find(".controls-list tbody");
		
		//rebuild the controls list
		tbody.empty();
		
		Object.keys(this.controls).forEach((controlName) => {
			
			var row = $("<tr>");
			
			var label = $("<td>", {
				text: this.controlsMap[controlName]
			});
			
			row.append(label);
			
			//generate both inputs (primary and secondary)
			for(var i = 0; i < 2; i++){
				var cell = $("<td>");
				
				var input = $("<input>", {
					class: controlName,
					"data-index": i,
					type: "text",
					value: keyCodesMap[this.controls[controlName].keys[i]] || ""
				});
				
				cell.append(input);
				row.append(cell);
			}
			
			tbody.append(row);
		});
	};
	
	/**
	 * Called when a key is pressed inside the controls inputs
	 * @param {Object} e
	 */
	setInput(e){
		var input = $(e.currentTarget);
		var inputName = input.attr("class");
		var inputIndex = input.attr("data-index");
		var keyCode = (e.which) ? e.which : e.keyCode;
		
		//check if this key was used already - and overwrite it
		_.forOwn(this.controls, function (data, name){
			data.keys = _.filter(data.keys, function (key){
				if(key === keyCode && name !== inputName){
					return false;
				}else{
					return true;
				}
			});
		});
		
		//escape and backspace keys clear the input
		if(keyCode === 27 || keyCode === 8){
			keyCode = "";
		}
		
		//update the key
		this.controls[inputName].keys[inputIndex] = keyCode;
		
		//rebuild the entire controls list in order to update any overwritten controls and the newly set control input
		this.buildControlsList();
	};
	
	/**
	 * Hides the main menu, shows the game canvas and calls the startGameCallback with the selected plane and level
	 * @param {Function} startGameCallback
	 */
	startGame(startGameCallback) {
		this.mainMenu.fadeOut(300, function () {
			$(".canvas").fadeIn(300);
		});

		//call the callback with the selected plane and level
		startGameCallback(this.gameLevels, this.controls, this.selectedPlane, this.selectedLevel);
	};
}