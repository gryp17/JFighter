//load all the game images
var IMAGE_REPOSITORY = new ImageRepository(GAME_IMAGES, function () {
	var mainMenu = new MainMenu();
	
	//build the levels data object
	var LEVELS_DATA = {
		GRASSLAND: GRASSLAND,
		DESERT: DESERT,
		WINTER: WINTER
	};
	
	//display the main menu and start the game once a plane and level have been chosen
	mainMenu.showMenu(function (selectedPlane, selectedLevel){
		var game = new Game(IMAGE_REPOSITORY.images, PLANE_STATS, ENEMY_STATS, LEVELS_DATA);
		game.start(selectedPlane, selectedLevel);
	});
});
