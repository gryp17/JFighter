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

var cssAppSource = "./stylesheets/**/*.scss";
var cssDestination = "./min/css";
var jsAppSource = ["./game/res/**/*.js", "./game/**/*.js"];
var jsDestination = "./min/js";
var jsLibsDestination = "./min/js";

//build task
gulp.task("build", function() {
	del([
		cssDestination
	]);
	gulp.start("styles-min");
	gulp.start("js-libs");
	gulp.start("scripts");
	gulp.start("watch");
});

//styles task
gulp.task("styles-min", function() {
	return gulp.src([
		cssAppSource
	]).pipe(sass({
		precision: 4,
		outputStyle: "compressed"
	})
	.on("error", notify.onError(function (e) {
		return e;
	})))
	.pipe(autoprefixer(AutoPrefixerOptions))
	.pipe(concat("./style.css"))
	.pipe(replace("\n", ""))
	.pipe(gulp.dest(cssDestination));
});

//js-libs task
gulp.task("js-libs", function () {
	return gulp.src([
		"./libs/jquery.js",
		"./libs/lodash.js"
	])
	.pipe(concat("lib.js"))
	.pipe(gulp.dest(jsLibsDestination));
});

//scripts task
gulp.task("scripts", function() {
	return gulp.src(jsAppSource)
		.pipe(concat("game.js"))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest(jsDestination));
});

//watch task
gulp.task("watch", function() {
	gulp.watch(cssAppSource, ["styles-min"]);
	gulp.watch(jsAppSource, ["scripts"]);
});
