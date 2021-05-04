import ImageRepository from '@/game/misc/image-repository';
import MainMenu from '@/game/misc/main-menu';
import Game from '@/game/game';
import gameImages from '@/game/resources/images';
import controls from '@/game/resources/controls';
import planeStats from '@/game/resources/stats/plane-stats';
import enemyStats from '@/game/resources/stats/enemy-stats';
import civilianStats from '@/game/resources/stats/civilian-stats';

import '@/stylesheets/game/main.scss';

//load all the game images
var imageRepository = new ImageRepository(gameImages, () => {
	var mainMenu = new MainMenu(controls);
	
	//display the main menu and start the game once a plane and level have been chosen
	mainMenu.showMenu(function (levelsData, gameControls, selectedPlane, selectedLevel){
		var game = new Game(imageRepository.images, planeStats, enemyStats, civilianStats, levelsData, gameControls);
		game.start(selectedPlane, selectedLevel);
	});
});
