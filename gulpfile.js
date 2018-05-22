"use strict";
var gulp = require("gulp");
var del = require("del");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var replace = require("gulp-replace");
var debug = require("gulp-debug");
var notify = require("gulp-notify");
var uglify = require("gulp-uglify");

var AutoPrefixerOptions = {
	browsers: ["> 10%", "last 3 versions"],
	cascade: false
};

var cssGameSource = "./stylesheets/game/**/*.scss";
var cssLevelEditorSource = "./stylesheets/level-editor/**/*.scss";
var cssDestination = "./min/css";
var jsGameSource = ["./game/resources/**/*.js", "./game/**/*.js"];
var jsLevelEditorSource = "./level-editor/**/*.js";
var jsDestination = "./min/js";
var jsLibsDestination = "./min/js";

//build task
gulp.task("build", function() {
	del([
		cssDestination
	]);
	gulp.start("game-styles");
	gulp.start("level-editor-styles");
	gulp.start("js-libs");
	gulp.start("game-scripts");
	gulp.start("level-editor-scripts");
	gulp.start("watch");
});

//game styles task
gulp.task("game-styles", function() {
	return gulp.src([
		cssGameSource
	]).pipe(sass({
		precision: 4,
		outputStyle: "compressed"
	})
	.on("error", notify.onError(function (e) {
		return e;
	})))
	.pipe(autoprefixer(AutoPrefixerOptions))
	.pipe(concat("./game.css"))
	.pipe(replace("\n", ""))
	.pipe(gulp.dest(cssDestination));
});

//level editor styles task
gulp.task("level-editor-styles", function() {
	return gulp.src([
		cssLevelEditorSource
	]).pipe(sass({
		precision: 4,
		outputStyle: "compressed"
	})
	.on("error", notify.onError(function (e) {
		return e;
	})))
	.pipe(autoprefixer(AutoPrefixerOptions))
	.pipe(concat("./level-editor.css"))
	.pipe(replace("\n", ""))
	.pipe(gulp.dest(cssDestination));
});

//js-libs task
gulp.task("js-libs", function () {
	return gulp.src([
		"./libs/jquery.js",
		"./libs/lodash.js",
		"./libs/jquery.mousewheel.js",
		"./libs/js-cookie.js"
	])
	.pipe(concat("lib.js"))
	.pipe(gulp.dest(jsLibsDestination));
});

//game scripts task
gulp.task("game-scripts", function() {
	return gulp.src(jsGameSource)
		.pipe(concat("game.js"))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest(jsDestination));
});

//level editor scripts task
gulp.task("level-editor-scripts", function() {
	return gulp.src(jsLevelEditorSource)
		.pipe(concat("level-editor.js"))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest(jsDestination));
});

//watch task
gulp.task("watch", function() {
	gulp.watch(cssGameSource, ["game-styles"]);
	gulp.watch(cssLevelEditorSource, ["level-editor-styles"]);
	gulp.watch(jsGameSource, ["game-scripts"]);
	gulp.watch(jsLevelEditorSource, ["level-editor-scripts"]);
});
