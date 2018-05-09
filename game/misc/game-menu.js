/**
 * Class used for handling the game menu
 * @param {Game} game
 * @returns {GameMenu}
 */
function GameMenu(game) {
	var self = this;
		
	$("body").keyup(function (e) {
		//escape
		if(e.which === 27){
			//toggle between the paused/active states
			if(game.status === CONSTANTS.GAME_STATE.ACTIVE){
				self.showMenu();
			}else if(game.status === CONSTANTS.GAME_STATE.PAUSED){
				self.hideMenu();
			}
		}
	});
	
	//game menu options click handlers
	$("#game-menu .option").each(function (){
		var option = $(this);
		
		option.click(function (){
			//restart
			if(option.hasClass("restart")){
				self.hideMenu();
				game.start(game.selectedPlane, game.selectedLevel);
			}
			
			//main menu
			if(option.hasClass("main-menu")){
				location.reload();
			}
		});
	});
	
	/**
	 * Shows the game pause/game over menu
	 */
	this.showMenu = function (gameOver){
		var title;
		
		if(gameOver){
			game.status = CONSTANTS.GAME_STATE.GAME_OVER;
			title = "GAME OVER";
		}else{
			game.status = CONSTANTS.GAME_STATE.PAUSED;
			title = "GAME PAUSED";
		}
		
		$("#game-menu h4").html(title);
		$("#game-menu").fadeIn(100);
	};
	
	/**
	 * Hides the game menu
	 */
	this.hideMenu = function (){
		game.status = CONSTANTS.GAME_STATE.ACTIVE;
		$("#game-menu").fadeOut(100);
	};
}