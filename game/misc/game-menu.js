import constants from '@/game/constants';

/**
 * Class used for handling the game menu
 */
export default class GameMenu {

	/**
	 * GameMenu constructor
	 * @param {Game} game
	 */
	constructor(game) {
		this.game = game;

		$("body").keyup((e) => {
			//escape
			if(e.which === 27){
				//toggle between the paused/active states
				if(this.game.status === constants.GAME_STATE.ACTIVE){
					this.pauseGame();
				}else if(this.game.status === constants.GAME_STATE.PAUSED){
					this.hideMenu();
				}
			}
		});
		
		//game menu options click handlers
		$("#game-menu .option").each((index, item) => {	
			const option = $(item);
			
			option.click(() => {
				//restart
				if(option.hasClass("restart")){
					this.hideMenu();
					this.game.start(this.game.selectedPlane, this.game.selectedLevel);
				}
				
				//main menu
				if(option.hasClass("main-menu")){
					location.reload();
				}
			});
		});
	}
		
	
	/**
	 * Shows the game paused menu
	 */
	pauseGame(){
		this.showMenu(constants.GAME_STATE.PAUSED, "GAME PAUSED");
	};
	
	/**
	 * Shows the game over menu
	 */
	gameOver(){
		this.showMenu(constants.GAME_STATE.GAME_OVER, "GAME OVER");
	};
	
	/**
	 * Shows the level completed menu
	 */
	levelCompleted(){
		this.showMenu(constants.GAME_STATE.LEVEL_COMPLETED, "LEVEL COMPLETED");
	};
	
	/**
	 * Shows the game pause/game over/level completed menu
	 */
	showMenu(status, title){
		this.game.status = status;

		$("#game-menu h4").html(title);
		$("#game-menu").fadeIn(100);
	};
	
	/**
	 * Hides the game menu
	 */
	hideMenu = function (){
		this.game.status = constants.GAME_STATE.ACTIVE;
		$("#game-menu").fadeOut(100);
	};
}