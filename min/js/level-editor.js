function showControlsContainer(){$(".controls-container").css("width",$(window).width()),$(".controls-container").fadeIn(500)}$(window).resize(function(){showControlsContainer()}),$(".background-container").on("mousewheel",function(n){var o=$(document).scrollLeft();$(document).scrollLeft(o+40*n.deltaY),n.preventDefault()}),showControlsContainer();