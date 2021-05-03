import gameImages from '@/game/resources/images';
import ImageRepository from '@/game/misc/image-repository';
import LevelEditor from '@/level-editor/level-editor';

import '@/stylesheets/level-editor/level-editor.scss';

//load all the game images
var imageRepository = new ImageRepository(gameImages, function () {
	var editor = new LevelEditor($("#container"), imageRepository.images);
	editor.init();
});