//load all the game images
var IMAGE_REPOSITORY = new ImageRepository(GAME_IMAGES, function () {
	var editor = new LevelEditor($("#container"), IMAGE_REPOSITORY.images);
	editor.init();
});