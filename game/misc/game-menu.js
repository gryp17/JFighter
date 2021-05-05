import constants from '@/game/constants';

/**
 * Class used for handling the game menu
 * @param {Game} game
 * @returns {GameMenu}
 */
export default function GameMenu(game) {
	var self = this;

	$('body').keyup(function (e) {
		//escape
		if(e.which === 27) {
			//toggle between the paused/active states
			if(game.status === constants.GAME_STATE.ACTIVE) {
				self.pauseGame();
			}else if(game.status === constants.GAME_STATE.PAUSED) {
				self.hideMenu();
			}
		}
	});

	//game menu options click handlers
	$('#game-menu .option').each(function () {
		var option = $(this);

		option.click(function () {
			//restart
			if(option.hasClass('restart')) {
				self.hideMenu();
				game.start(game.selectedPlane, game.selectedLevel);
			}

			//main menu
			if(option.hasClass('main-menu')) {
				location.reload();
			}
		});
	});

	/**
	 * Shows the game paused menu
	 */
	this.pauseGame = function () {
		this.showMenu(constants.GAME_STATE.PAUSED, 'GAME PAUSED');
	};

	/**
	 * Shows the game over menu
	 */
	this.gameOver = function () {
		this.showMenu(constants.GAME_STATE.GAME_OVER, 'GAME OVER');
	};

	/**
	 * Shows the level completed menu
	 */
	this.levelCompleted = function () {
		this.showMenu(constants.GAME_STATE.LEVEL_COMPLETED, 'LEVEL COMPLETED');
	};

	/**
	 * Shows the game pause/game over/level completed menu
	 */
	this.showMenu = function (status, title) {
		game.status = status;

		$('#game-menu h4').html(title);
		$('#game-menu').fadeIn(100);
	};

	/**
	 * Hides the game menu
	 */
	this.hideMenu = function () {
		game.status = constants.GAME_STATE.ACTIVE;
		$('#game-menu').fadeOut(100);
	};
}
