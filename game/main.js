//load all the game images
var IMAGE_REPOSITORY = new ImageRepository(GAME_IMAGES, function () {
	var menu = new Menu();
	
	//display the menu and start the game once a plane and level have been chosen
	menu.showMenu(function (selectedPlane, selectedLevel){
		var game = new Game(IMAGE_REPOSITORY.images, PLANE_STATS, LEVELS_DATA);
		game.start(selectedPlane, selectedLevel);
	});
});
