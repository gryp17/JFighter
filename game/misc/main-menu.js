/**
 * Class used for handling the main menu
 * @param {Object} defaultControls
 * @returns {MainMenu}
 */
function MainMenu(defaultControls) {
	var self = this;
	
	this.loadingIndicator = $(".uil-ring-css");
	this.mainMenu = $("#main-menu");
	this.controlsPopup = this.mainMenu.find(".controls-popup");
	this.selectPlaneScreen = this.mainMenu.find(".select-plane");
	this.selectLevelScreen = this.mainMenu.find(".select-level");
	this.levelsList = this.selectLevelScreen.find(".levels-list");
	this.thumbnailContainer = this.levelsList.find(".thumbnail-container");
	
	//game controls
	this.controls;
	
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
				
		//load all custom levels from the local storage
		this.loadCustomLevels();
		
		//display the first level by default
		this.setCurrentLevel(this.levelIndex);
		
		//open the controls popup
		this.mainMenu.find(".controls-button").click(this.openControlsPopup);
		
		//load the game controls
		this.loadCustomControls();
		
		//close the controls popup
		this.controlsPopup.find(".close").click(this.closeControlsPopup);
		
		//on popup (backdrop) click close the popup
		this.controlsPopup.click(function (e){
			if (e.target === this){
				self.closeControlsPopup();
			}
		});
		
		//reset all controls to default
		this.controlsPopup.find(".reset-controls").click(function (){
			self.resetControls();
			self.buildControlsList();
		});
		
		//save the controls
		this.controlsPopup.find(".save-controls").click(this.saveControls);
		
		//key up/down handlers for the controls inputs
		$("body").on("keydown", ".controls-popup input", function (){
			return false;
		});
		$("body").on("keyup", ".controls-popup input", this.setInput);
		
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
		
		//on start game button... start the game!
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
	 * Loads all custom levels (if any) from the local storage and merges them with the default game levels
	 */
	this.loadCustomLevels = function () {
		var customLevels = localStorage.getItem(CONFIG.LOCAL_STORAGE.CUSTOM_LEVELS.NAME);

		if (customLevels) {
			customLevels = JSON.parse(customLevels);
			
			_.forOwn(customLevels, function (levelData, levelName) {
				self.gameLevels["[CUSTOM] " + levelName] = levelData;
			});
		}
	};
	
	/**
	 * Loads all custom controls if there are any
	 */
	this.loadCustomControls = function (){
		var customControls = localStorage.getItem(CONFIG.LOCAL_STORAGE.CUSTOM_CONTROLS.NAME);
		
		if(customControls){
			self.controls = JSON.parse(customControls);
		}else{
			self.controls = _.cloneDeep(defaultControls);
		}
	};
	
	/**
	 * Opens the controls popup window
	 */
	this.openControlsPopup = function (){
		self.loadCustomControls();
		self.buildControlsList();
		
		self.controlsPopup.fadeIn(300);
	};
	
	/**
	 * Close the controls popup window
	 */
	this.closeControlsPopup = function (){
		self.controlsPopup.fadeOut(300);
	};
	
	/**
	 * Resets the game controls to their default values
	 */
	this.resetControls = function (){
		self.controls = _.cloneDeep(defaultControls);
	};
	
	/**
	 * Updates the local storage with the new controls configuration and closes the popup
	 */
	this.saveControls = function (){
		localStorage.setItem(CONFIG.LOCAL_STORAGE.CUSTOM_CONTROLS.NAME, JSON.stringify(self.controls));
		self.closeControlsPopup();
	};
	
	/**
	 * Builds the controls list table
	 */
	this.buildControlsList = function (){
		var tbody = self.controlsPopup.find(".controls-list tbody");
		
		//rebuild the controls list
		tbody.empty();
		
		Object.keys(self.controls).forEach(function (controlName){
			
			var row = $("<tr>");
			
			var label = $("<td>", {
				text: controlName
			});
			
			row.append(label);
			
			//generate both inputs (primary and secondary)
			for(var i = 0; i < 2; i++){
				var cell = $("<td>");
				
				var input = $("<input>", {
					class: controlName,
					"data-index": i,
					type: "text",
					value: self.keyCodesMap[self.controls[controlName].keys[i]] || ""
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
	this.setInput = function (e){
		var input = $(this);
		var inputName = input.attr("class");
		var inputIndex = input.attr("data-index");
		var keyCode = (e.which) ? e.which : e.keyCode;
		
		//check if this key was used already - and overwrite it
		_.forOwn(self.controls, function (data, name){
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
		self.controls[inputName].keys[inputIndex] = keyCode;
		
		//rebuild the entire controls list in order to update any overwritten controls and the newly set control input
		self.buildControlsList();
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
		startGameCallback(self.gameLevels, self.controls, self.selectedPlane, self.selectedLevel);
	};
	
	//list of key codes and their corresponding key names
	this.keyCodesMap = {
		0: "no keycode",
		3: "break",
		8: "backspace / delete",
		9: "tab",
		12: "clear",
		13: "enter",
		16: "shift",
		17: "ctrl",
		18: "alt",
		19: "pause/break",
		20: "caps lock",
		21: "hangul",
		25: "hanja",
		27: "escape",
		28: "conversion",
		29: "non-conversion",
		32: "spacebar",
		33: "page up",
		34: "page down",
		35: "end",
		36: "home",
		37: "left arrow",
		38: "up arrow",
		39: "right arrow",
		40: "down arrow",
		41: "select",
		42: "print",
		43: "execute",
		44: "Print Screen",
		45: "insert",
		46: "delete",
		47: "help",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		58: ":",
		59: "semicolon, equals",
		60: "<",
		61: "=",
		63: "ß",
		64: "@",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
		91: "Windows Key / Left ⌘ / Chromebook Search key",
		92: "right window key",
		93: "Windows Menu / Right ⌘",
		95: "sleep",
		96: "numpad 0",
		97: "numpad 1",
		98: "numpad 2",
		99: "numpad 3",
		100: "numpad 4",
		101: "numpad 5",
		102: "numpad 6",
		103: "numpad 7",
		104: "numpad 8",
		105: "numpad 9",
		106: "multiply",
		107: "add",
		108: "numpad period",
		109: "subtract",
		110: "decimal point",
		111: "divide",
		112: "f1",
		113: "f2",
		114: "f3",
		115: "f4",
		116: "f5",
		117: "f6",
		118: "f7",
		119: "f8",
		120: "f9",
		121: "f10",
		122: "f11",
		123: "f12",
		124: "f13",
		125: "f14",
		126: "f15",
		127: "f16",
		128: "f17",
		129: "f18",
		130: "f19",
		131: "f20",
		132: "f21",
		133: "f22",
		134: "f23",
		135: "f24",
		144: "num lock",
		145: "scroll lock",
		160: "^",
		161: "!",
		163: "#",
		164: "$",
		165: "ù",
		166: "page backward",
		167: "page forward",
		168: "refresh",
		169: "closing paren (AZERTY)",
		170: "*",
		171: "~ + * key",
		172: "home key",
		173: "minus, mute/unmute",
		174: "decrease volume level",
		175: "increase volume level",
		176: "next",
		177: "previous",
		178: "stop",
		179: "play/pause",
		180: "e-mail",
		181: "mute/unmute",
		182: "decrease volume level",
		183: "increase volume level",
		186: "semi-colon / ñ",
		187: "equal sign",
		188: "comma",
		189: "dash",
		190: "period",
		191: "forward slash / ç",
		192: "grave accent / ñ / æ / ö",
		193: "?, / or °",
		194: "numpad period (chrome)",
		219: "open bracket",
		220: "back slash",
		221: "close bracket / å",
		222: "single quote / ø / ä",
		223: "`",
		224: "left or right ⌘ key",
		225: "altgr",
		226: "< /git >, left back slash",
		230: "GNOME Compose Key",
		231: "ç",
		233: "XF86Forward",
		234: "XF86Back",
		235: "non-conversion",
		240: "alphanumeric",
		242: "hiragana/katakana",
		243: "half-width/full-width",
		244: "kanji",
		255: "toggle touchpad"
	};

}