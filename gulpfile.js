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

//build task
gulp.task("build", function() {
	del([
		"./stylesheets/css/style.min.css"
	]);
	gulp.start("styles-min");
	gulp.start("scripts");
	gulp.start("watch");
});

//styles task
gulp.task("styles-min", function() {
	return gulp.src([
		"./stylesheets/scss/**/*.scss"
	]).pipe(sass({
		precision: 4,
		outputStyle: "compressed"
	})
	.on("error", notify.onError(function (e) {
		return e;
	})))
	.pipe(autoprefixer(AutoPrefixerOptions))
	.pipe(concat("./style.min.css"))
	.pipe(replace("\n", ""))
	.pipe(gulp.dest("./stylesheets/css"));
});

//scripts task
gulp.task("scripts", function() {
	return gulp.src([
		"./libs/jquery.js",
		"./libs/lodash.js",
		"./game/res/**/*.js",
		"./game/**/*.js"
	])
		.pipe(concat("game.js"))
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest("."));
});

//watch task
gulp.task("watch", function() {
	gulp.watch("./stylesheets/scss/**/*.scss", ["styles-min"]);
	gulp.watch("./game/**/*.js", ["scripts"]);
});
