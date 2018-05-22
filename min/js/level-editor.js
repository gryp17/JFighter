function LevelEditor(e){var i=this;this.container=e,this.backgroundContainer=this.container.find(".background-container"),this.controlsContainer=this.container.find(".controls-container"),this.controls=this.container.find(".controls"),this.themeDropdown=this.controls.find(".theme-dropdown"),this.weatherDropdown=this.controls.find(".weather-dropdown"),this.loadLevelDropdown=this.controls.find(".load-level-dropdown"),this.saveLevelButton=this.controls.find(".save-level-button"),this.levelName=this.controls.find(".level-name"),this.canvasHeight=620,this.backgroundImageHeight=this.backgroundContainer.height(),this.heightOffset=this.backgroundImageHeight-this.canvasHeight,this.dragging=!1,this.draggedObject,this.customLevels={},this.weatherInterval=4096,this.groundObjects={Sherman:{groundDistance:10},Civilian:{groundDistance:24}},this.groundHeight=40,this.init=function(){this.loadCustomLevels(),this.updateCustomLevelsDropdown(),this.backgroundContainer.on("mousewheel",i.scrollBackground),this.themeDropdown.change(i.setLevelTheme),this.controls.find(".game-object").mousedown(i.addGameObject),$("body").on("mousedown",".background-container .game-object",i.selectGameObject),$("body").mouseup(i.dropGameObject),this.container.mousemove(i.dragGameObject),this.loadLevelDropdown.change(i.loadLevel),this.saveLevelButton.click(i.saveLevel),this.levelName.keypress(function(e){13===e.which&&i.saveLevel()}),this.levelName.val("level_"+(new Date).getTime())},this.loadCustomLevels=function(){var e=Cookies.get(CONFIG.COOKIE.CUSTOM_LEVELS.NAME);e?this.customLevels=JSON.parse(e):this.customLevels={}},this.updateCustomLevelsDropdown=function(){this.loadLevelDropdown.find("option[disabled!=disabled]").remove(),_.forOwn(this.customLevels,function(e,n){var g=$("<option>",{value:n,text:n});i.loadLevelDropdown.append(g)})},this.setLevelTheme=function(){var e=$(this).val(),n="img/levels/",g=".jpg";i.backgroundContainer.css({backgroundImage:"url("+n+e+g+")"})},this.scrollBackground=function(e){var i=$(document).scrollLeft();$(document).scrollLeft(i+40*e.deltaY),e.preventDefault()},this.addGameObject=function(e){i.draggedObject=$(this).clone(),i.draggedObject.css({position:"absolute"}),i.draggedObject.css({top:e.pageY,left:e.pageX}),$("body").append(i.draggedObject),i.dragging=!0,e.preventDefault()},this.selectGameObject=function(e){i.draggedObject=$(this),i.dragging=!0,e.preventDefault()},this.dropGameObject=function(e){if(i.dragging){if(e.pageY>i.backgroundContainer.height())return;var n=e.pageY,g=e.pageX;if(i.groundObjects[i.draggedObject.attr("data-object")]){var t=i.groundObjects[i.draggedObject.attr("data-object")];n=i.backgroundImageHeight-t.groundDistance-i.draggedObject.height()}if(i.draggedObject.css({top:n,left:g}),!i.draggedObject.has(".remove-btn").length){var a=i.generateGameObjectRemoveButton();i.draggedObject.append(a)}i.draggedObject.appendTo(i.backgroundContainer),i.draggedObject=null,i.dragging=!1}},this.dragGameObject=function(e){i.dragging&&i.draggedObject.css({top:e.pageY,left:e.pageX})},this.clearGameObjects=function(){this.backgroundContainer.find(".game-object").remove()},this.generateGameObjectRemoveButton=function(){return $("<img>",{"class":"remove-btn",src:"img/level-editor/icon-remove.png",title:"Remove",click:function(e){$(this).closest(".game-object").remove(),i.draggedObject=null,i.dragging=!1,e.stopPropagation()}})},this.loadLevel=function(){var e=$(this).val(),n=i.customLevels[e];switch(n||alert("Level Not Found"),i.clearGameObjects(),i.levelName.val(e),i.themeDropdown.val(n.THEME),i.themeDropdown.change(),n.WEATHER.TYPE){case"rain":n.WEATHER.INTERVAL?i.weatherDropdown.val("rain"):i.weatherDropdown.val("heavy-rain");break;case"snow":i.weatherDropdown.val("snow");break;default:i.weatherDropdown.val("default")}var g=n.ENEMIES.concat(n.CIVILIANS);g.forEach(function(e){var n=$("<div>",{"class":"game-object","data-object":e.objectType,title:e.objectType}),g=$("<img>");switch(e.objectType){case"Fighter":g.attr("src",GAME_IMAGES.ENEMIES.MUSTANG.SPRITE.DEFAULT[0]);break;case"Bomber":g.attr("src",GAME_IMAGES.ENEMIES.B17.SPRITE.DEFAULT[0]);break;case"Sherman":g.attr("src",GAME_IMAGES.ENEMIES.SHERMAN.SPRITE[0]);break;case"Civilian":g.attr("src",GAME_IMAGES.CIVILIANS[2].SPRITE[0])}var t=i.generateGameObjectRemoveButton();n.append(g),n.append(t),n.css({left:e.arguments.x,top:e.arguments.y+i.heightOffset}),i.backgroundContainer.append(n)})},this.saveLevel=function(){var e=[],n=[],g=i.backgroundContainer.find(".game-object"),t=i.levelName.val(),a=i.themeDropdown.val(),o=i.weatherDropdown.val();if(!t||""===t.trim())return void alert("Invalid Level Name");g.each(function(){var g=$(this),t=g.offset(),a=t.left,o=t.top;o-=i.heightOffset;var s={objectType:g.attr("data-object"),arguments:{x:a,y:o}};"Civilian"===g.attr("data-object")?n.push(s):e.push(s)});var s={};switch(o){case"heavy-rain":s.TYPE="rain";break;case"rain":s.TYPE="rain",s.INTERVAL=i.weatherInterval;break;case"snow":s.TYPE="snow";break;default:s.TYPE="normal"}var l={THEME:a,WEATHER:s,GROUND_HEIGHT:i.groundHeight,CIVILIANS:n,ENEMIES:e};i.customLevels[t]=l,Cookies.set(CONFIG.COOKIE.CUSTOM_LEVELS.NAME,i.customLevels,{expires:CONFIG.COOKIE.CUSTOM_LEVELS.EXPIRES}),i.updateCustomLevelsDropdown(),alert("Level Saved")}}var CONFIG={COOKIE:{CUSTOM_LEVELS:{NAME:"jfighter-levels",EXPIRES:90}}},GAME_IMAGES={MAIN_MENU:"img/menu/menu.png",PLANES:{BF109:{SPRITE:{DEFAULT:["img/planes/bf109/default/1.png","img/planes/bf109/default/2.png"],DAMAGED:["img/planes/bf109/damaged/1.png","img/planes/bf109/damaged/2.png"]},CRASHED:"img/planes/bf109/crashed.png"},STUKA:{SPRITE:{DEFAULT:["img/planes/stuka/default/1.png","img/planes/stuka/default/2.png"],DAMAGED:["img/planes/stuka/damaged/1.png","img/planes/stuka/damaged/2.png"]},CRASHED:"img/planes/stuka/crashed.png"},KI84:{SPRITE:{DEFAULT:["img/planes/ki84/default/1.png","img/planes/ki84/default/2.png"],DAMAGED:["img/planes/ki84/damaged/1.png","img/planes/ki84/damaged/2.png"]},CRASHED:"img/planes/ki84/crashed.png"}},LEVELS:{GRASSLAND:"img/levels/grassland.jpg",DESERT:"img/levels/desert.jpg",WINTER:"img/levels/winter.jpg"},PROJECTILES:{BULLET:"img/projectiles/bullet.png",PLANE_BOMB:["img/projectiles/plane-bomb/1.png","img/projectiles/plane-bomb/2.png"],BOMBER_BOMB:["img/projectiles/bomber-bomb/1.png","img/projectiles/bomber-bomb/2.png"]},BULLET_IMPACT:["img/projectiles/bullet-impact/1.png","img/projectiles/bullet-impact/2.png","img/projectiles/bullet-impact/3.png"],EXPLOSION:["img/explosion/1.png","img/explosion/2.png","img/explosion/3.png","img/explosion/4.png","img/explosion/5.png","img/explosion/6.png","img/explosion/7.png","img/explosion/8.png","img/explosion/9.png","img/explosion/10.png","img/explosion/11.png","img/explosion/12.png","img/explosion/13.png","img/explosion/14.png","img/explosion/15.png","img/explosion/16.png","img/explosion/17.png","img/explosion/18.png","img/explosion/19.png","img/explosion/20.png","img/explosion/21.png","img/explosion/22.png","img/explosion/23.png","img/explosion/24.png","img/explosion/25.png","img/explosion/26.png","img/explosion/27.png","img/explosion/28.png","img/explosion/29.png","img/explosion/30.png","img/explosion/31.png","img/explosion/32.png","img/explosion/33.png","img/explosion/34.png","img/explosion/35.png","img/explosion/36.png","img/explosion/37.png"],BOMB_HOLE:"img/bomb_hole.png",ENEMIES:{B17:{SPRITE:{DEFAULT:["img/enemies/b17/default/1.png","img/enemies/b17/default/2.png"],DAMAGED:["img/enemies/b17/damaged/1.png","img/enemies/b17/damaged/2.png"]},CRASHED:"img/enemies/b17/crashed.png"},SHERMAN:{SPRITE:["img/enemies/sherman/1.png","img/enemies/sherman/2.png"],DESTROYED:"img/enemies/sherman/destroyed.png"},MUSTANG:{SPRITE:{DEFAULT:["img/enemies/mustang/default/1.png","img/enemies/mustang/default/2.png"],DAMAGED:["img/enemies/mustang/damaged/1.png","img/enemies/mustang/damaged/2.png"]},CRASHED:"img/enemies/mustang/crashed.png"},SPITFIRE:{SPRITE:{DEFAULT:["img/enemies/spitfire/default/1.png","img/enemies/spitfire/default/2.png"],DAMAGED:["img/enemies/spitfire/damaged/1.png","img/enemies/spitfire/damaged/2.png"]},CRASHED:"img/enemies/spitfire/crashed.png"}},CIVILIANS:[{SPRITE:["img/civilian/green/1.png","img/civilian/green/2.png","img/civilian/green/3.png","img/civilian/green/4.png","img/civilian/green/5.png","img/civilian/green/6.png","img/civilian/green/7.png","img/civilian/green/8.png"],DEAD:"img/civilian/green/9.png"},{SPRITE:["img/civilian/blue/1.png","img/civilian/blue/2.png","img/civilian/blue/3.png","img/civilian/blue/4.png","img/civilian/blue/5.png","img/civilian/blue/6.png","img/civilian/blue/7.png","img/civilian/blue/8.png"],DEAD:"img/civilian/blue/9.png"},{SPRITE:["img/civilian/red/1.png","img/civilian/red/2.png","img/civilian/red/4.png","img/civilian/red/5.png","img/civilian/red/6.png","img/civilian/red/7.png","img/civilian/red/8.png"],DEAD:"img/civilian/red/9.png"}],HUD:{BOMB_ICON:"img/hud/bomb_icon.png"}},editor=new LevelEditor($("#container"));editor.init();