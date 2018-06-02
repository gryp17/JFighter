//load all the game images
var IMAGE_REPOSITORY = new ImageRepository(GAME_IMAGES, function () {
	var mainMenu = new MainMenu(CONTROLS);
	
	//display the main menu and start the game once a plane and level have been chosen
	mainMenu.showMenu(function (levelsData, selectedPlane, selectedLevel){
		var game = new Game(IMAGE_REPOSITORY.images, PLANE_STATS, ENEMY_STATS, CIVILIAN_STATS, levelsData);
		game.start(selectedPlane, selectedLevel);
	});
});
