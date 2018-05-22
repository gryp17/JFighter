function LevelEditor(e){var t=this;this.container=e,this.backgroundContainer=this.container.find(".background-container"),this.controlsContainer=this.container.find(".controls-container"),this.controls=this.container.find(".controls"),this.themeDropdown=this.controls.find(".theme-dropdown"),this.weatherDropdown=this.controls.find(".weather-dropdown"),this.loadLevelDropdown=this.controls.find(".load-level-dropdown"),this.saveLevelButton=this.controls.find(".save-level-button"),this.levelName=this.controls.find(".level-name"),this.canvasHeight=620,this.backgroundImageHeight=this.backgroundContainer.height(),this.heightOffset=this.backgroundImageHeight-this.canvasHeight,this.dragging=!1,this.draggedObject,this.cookieConfig={name:"jfighter-levels",expires:90},this.customLevels={},this.groundObjects={Sherman:{groundDistance:10},Civilian:{groundDistance:24}},this.groundHeight=40,this.init=function(){this.loadCustomLevels(),this.updateCustomLevelsDropdown(),this.backgroundContainer.on("mousewheel",t.scrollBackground),this.themeDropdown.change(t.setLevelTheme),this.controls.find(".game-object").mousedown(t.addGameObject),$("body").on("mousedown",".background-container .game-object",t.selectGameObject),$("body").mouseup(t.dropGameObject),this.container.mousemove(t.dragGameObject),this.loadLevelDropdown.change(t.loadLevel),this.saveLevelButton.click(t.saveLevel),this.levelName.keypress(function(e){13===e.which&&t.saveLevel()}),this.levelName.val("level_"+(new Date).getTime())},this.loadCustomLevels=function(){var e=Cookies.get(this.cookieConfig.name);e?this.customLevels=JSON.parse(e):this.customLevels={},console.log(this.customLevels)},this.updateCustomLevelsDropdown=function(){this.loadLevelDropdown.find("option[disabled!=disabled]").remove(),_.forOwn(this.customLevels,function(e,o){var a=$("<option>",{value:o,text:o});t.loadLevelDropdown.append(a)})},this.setLevelTheme=function(){var e=$(this).val(),o="img/levels/",a=".jpg";t.backgroundContainer.css({backgroundImage:"url("+o+e+a+")"})},this.scrollBackground=function(e){var t=$(document).scrollLeft();$(document).scrollLeft(t+40*e.deltaY),e.preventDefault()},this.addGameObject=function(e){t.draggedObject=$(this).clone(),t.draggedObject.css({position:"absolute"}),t.draggedObject.css({top:e.pageY,left:e.pageX}),$("body").append(t.draggedObject),t.dragging=!0,e.preventDefault()},this.selectGameObject=function(e){t.draggedObject=$(this),t.dragging=!0,e.preventDefault()},this.dropGameObject=function(e){if(t.dragging){if(e.pageY>t.backgroundContainer.height())return;var o=e.pageY,a=e.pageX;if(t.groundObjects[t.draggedObject.attr("data-object")]){var n=t.groundObjects[t.draggedObject.attr("data-object")];o=t.backgroundImageHeight-n.groundDistance-t.draggedObject.height()}if(t.draggedObject.css({top:o,left:a}),!t.draggedObject.has(".remove-btn").length){var i=$("<img>",{"class":"remove-btn",src:"img/level-editor/icon-remove.png",title:"Remove",click:function(e){$(this).closest(".game-object").remove(),t.draggedObject=null,t.dragging=!1,e.stopPropagation()}});t.draggedObject.append(i)}t.draggedObject.appendTo(t.backgroundContainer),t.draggedObject=null,t.dragging=!1}},this.dragGameObject=function(e){t.dragging&&t.draggedObject.css({top:e.pageY,left:e.pageX})},this.loadLevel=function(){var e=$(this).val();console.log(e),t.levelName.val(e)},this.saveLevel=function(){var e=[],o=[],a=t.backgroundContainer.find(".game-object"),n=t.levelName.val(),i=t.themeDropdown.val(),s=t.weatherDropdown.val();if(!n||""===n.trim())return void alert("Invalid Level Name");a.each(function(){var a=$(this),n=a.offset(),i=n.left,s=n.top;s-=t.heightOffset;var r={objectType:a.attr("data-object"),arguments:{x:i,y:s}};"Civilian"===a.attr("data-object")?o.push(r):e.push(r)});var r={};switch(s){case"heavy-rain":r.TYPE="rain";break;case"rain":r.TYPE="rain",r.INTERVAL=4096;break;case"snow":r.TYPE="snow";break;default:r.TYPE="normal"}var d={THEME:i,WEATHER:r,GROUND_HEIGHT:t.groundHeight,CIVILIANS:o,ENEMIES:e};t.customLevels[n]=d,Cookies.set(t.cookieConfig.name,t.customLevels,{expires:t.cookieConfig.expires}),t.updateCustomLevelsDropdown(),alert("Level Saved")}}var editor=new LevelEditor($("#container"));editor.init();