function Background(t){this.context=t.contexts.background.context,this.canvas=t.contexts.background.canvas,this.backgroundImage=t.images.LEVELS[t.selectedLevel],this.dx=-2,this.x=0,this.dy=0,this.y=this.canvas.height-this.backgroundImage.height,this.offset=0,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.x<-1*this.backgroundImage.width&&(this.x=0),this.moveBackgroundVertically(t.plane),this.y>0&&(this.dy=0,this.y=0),this.y<-1*(this.backgroundImage.height-this.canvas.height)&&(this.dy=0,this.y=-1*(this.backgroundImage.height-this.canvas.height));var i=this.canvas.height-this.backgroundImage.height;this.offset=this.y-i,this.context.drawImage(this.backgroundImage,this.x,this.y),this.context.drawImage(this.backgroundImage,this.x+this.backgroundImage.width,this.y)},this.moveBackgroundVertically=function(t){if(0!==t.dy){var i=this.canvas.height/2;t.y<i&&t.dy<0?this.dy=-1.3*t.dy:t.dy>0&&(this.dy=-1.3*t.dy)}else this.dy=0}}function BulletImpact(t,i,s){this.context=t.contexts.plane.context,this.canvas=t.contexts.plane.canvas,this.impactImages=t.images.BULLET_IMPACT,this.active=!0,this.dx=0,this.x=i,this.dy=0,this.y=s,this.impactSprite=new Sprite(this.impactImages,5,!1),this.currentImage,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.updateSprite(),this.active&&this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.updateSprite=function(){this.currentImage=this.impactSprite.move(),null===this.currentImage&&(this.active=!1)}}function Explosion(t,i,s,e,h,n){this.context=t.contexts.plane.context,this.canvas=t.contexts.plane.canvas,this.explosionImages=t.images.EXPLOSION,this.bombHole=t.images.BOMB_HOLE,this.dx=e,this.x=i,this.dy=h,this.y=s,this.sprite=new Sprite(this.explosionImages,5,!1),this.currentImage,this.active=!0,this.showBombHole=n,this.draw=function(){this.updateSprite(),this.active&&(this.x=this.x+this.dx,this.y=this.y+this.dy,this.x+this.currentImage.width<0&&(this.active=!1),this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset))},this.updateSprite=function(){this.currentImage=this.sprite.move(),null===this.currentImage&&(this.showBombHole?this.currentImage=this.bombHole:this.active=!1)}}function PlaneBomb(t,i,s,e,h){this.context=t.contexts.plane.context,this.canvas=t.contexts.plane.canvas,this.bombImages=t.images.PROJECTILES.PLANE_BOMB,this.explosionImages=t.images.EXPLOSION,this.dx=e,this.x=i,this.dy=h,this.y=s,this.sprite=new Sprite(this.bombImages,10,!0),this.currentImage,this.active=!0,this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.x+this.currentImage.width<0&&(this.active=!1),this.y>this.canvas.height-30&&this.explode(),this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.explode=function(){this.active=!1;var i=this.x-this.explosionImages[0].width/3,s=this.y-this.explosionImages[0].height+10;t.explosions.push(new Explosion(t,i,s,-2,0,!0))},this.updateSprite=function(){this.currentImage=this.sprite.move()}}function PlaneBullet(t,i,s,e,h,n){this.context=t.contexts.plane.context,this.canvas=t.contexts.plane.canvas,this.currentImage=t.images.PROJECTILES.BULLET,this.impact=!1,this.active=!0,this.damage=t.plane.stats.DAMAGE,this.dx=e,this.x=i,this.dy=h,this.y=s,this.angle=n,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.y>=this.canvas.height-30&&(this.impact=!0,this.active=!1),this.x>this.canvas.width&&(this.active=!1),this.impact&&(t.bulletImpacts.push(new BulletImpact(t,this.x+this.currentImage.width,this.y)),this.active=!1),0!==this.angle?this.rotateBullet(this.angle):this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.rotateBullet=function(i){this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+this.currentImage.height/2),this.context.rotate(i*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)+t.background.offset),this.context.restore()}}function Plane(t){this.context=t.contexts.plane.context,this.canvas=t.contexts.plane.canvas,this.stats=t.planeStats[t.selectedPlane],this.images=t.images.PLANES[t.selectedPlane],this.health=this.stats.HEALTH,this.disabled=!1,this.crashed=!1,this.dx=1,this.x=200,this.dy=0,this.y=350,this.angle=0,this.sprite=new Sprite(this.images.SPRITE,2,!0),this.currentImage,this.shooting=!1,this.overheat=!1,this.bulletDelay=5,this.bulletTimer=0,this.machinegunHeat=0,this.bullets=[],this.bombing=!1,this.bombCooldown=20,this.bombTimer=0,this.bombs=[],this.draw=function(){this.disabled===!1&&this.processInputs(t.inputs),this.updateSprite(),this.health<=0&&this.crashed===!1&&(this.disabled=!0,this.dy=2),this.updateMachinegunStatus(),this.updateBombsStatus(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.checkForCollisions(),this.drawPlane(),this.drawBullets(),this.drawBombs()},this.processInputs=function(t){t.UP&&this.dy>-3&&(this.dy=this.dy-.1),t.DOWN&&this.dy<3&&(this.dy=this.dy+.1),t.LEFT&&this.dx>-1&&(this.dx=this.dx-.1),t.RIGHT&&this.dx<this.stats.MAX_SPEED&&(this.dx=this.dx+.1),t.SHOOT&&this.shoot(),t.BOMB&&this.dropBomb()},this.updateSprite=function(){this.crashed===!0?this.currentImage=this.images.CRASHED:this.currentImage=this.sprite.move()},this.drawPlane=function(){this.dy>0?this.angle=this.dy*this.stats.DESCEND_SPEED:this.dy<0?this.angle=this.dy*this.stats.CLIMB_SPEED:this.angle=0,this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+this.currentImage.height/2),this.context.rotate(this.angle*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)),this.context.restore()},this.updateMachinegunStatus=function(){this.machinegunHeat===this.stats.MAX_MACHINEGUN_HEAT&&(this.overheat=!0),this.machinegunHeat>0&&(this.machinegunHeat--,this.overheat&&0===this.machinegunHeat&&(this.overheat=!1)),this.shooting===!0&&(this.bulletTimer++,this.machinegunHeat=this.machinegunHeat+this.stats.MACHINEGUN_HEATING,this.machinegunHeat>this.stats.MAX_MACHINEGUN_HEAT&&(this.machinegunHeat=this.stats.MAX_MACHINEGUN_HEAT),this.bulletTimer>this.bulletDelay&&(this.shooting=!1,this.bulletTimer=0))},this.updateBombsStatus=function(){this.bombing===!0&&(this.bombTimer++,this.bombTimer>this.bombCooldown&&(this.bombing=!1,this.bombTimer=0))},this.drawBullets=function(){this.bullets=_.filter(this.bullets,function(t){return t.active===!1?!1:(t.draw(),!0)})},this.drawBombs=function(){this.bombs=_.filter(this.bombs,function(t){return t.active?(t.draw(),!0):!1})},this.shoot=function(){if(this.shooting===!1&&this.overheat===!1){var i=this.x+this.currentImage.width/2,s=this.y-t.background.offset+this.currentImage.height/2,e=25,h=0,n=this.angle;this.shooting=!0,this.dy>0?(n=this.dy*this.stats.DESCEND_SPEED,h=this.dy*(n/4.5)):this.dy<0&&(n=this.dy*this.stats.CLIMB_SPEED,h=this.dy*(n/4.5)*-1),"KI84"===t.selectedPlane&&-20>=n&&t.background.offset>0&&(i-=t.background.offset/2.5,s-=t.background.offset/7),this.bullets.push(new PlaneBullet(t,i,s,e,h,n))}},this.dropBomb=function(){if(this.bombing===!1){var i=this.x+this.currentImage.width/1.3,s=this.y-t.background.offset+this.currentImage.height/2,e=this.dx-2,h=(this.dy>0?this.dy:0)+3;this.bombing=!0,this.bombs.push(new PlaneBomb(t,i,s,e,h))}},this.checkForCollisions=function(){this.y<0&&(this.y=0,this.dy=0),this.x<0&&this.crashed===!1&&(this.x=0,this.dx=0),this.x+this.currentImage.width>this.canvas.width&&(this.x=this.canvas.width-this.currentImage.width,this.dx=-1),this.y+this.currentImage.height>this.canvas.height-40&&(this.y=this.canvas.height-this.currentImage.height-40,this.dy=0,this.dx=-2,this.disabled=!0,this.crashed=!0,this.health=0)}}function Context(t){this.canvas=document.getElementById(t),this.context=this.canvas.getContext("2d")}function HUD(t,i){this.visible=!1,this.maxHue=130,this.maxPitchHue=200,this.show=function(){this.visible=!0},this.hide=function(){this.visible=!1},this.draw=function(){i.css("display",this.visible?"block":"none"),this.visible&&(this.drawHealth(),this.drawThrottle(),this.drawPitch(),this.drawHeat())},this.drawHealth=function(){var s=t.plane.health,e=t.planeStats[t.selectedPlane].HEALTH,h=i.find(".health-bar"),n=h.find(".current"),a=h.width()/e,o=this.maxHue/e;n.css({backgroundColor:"hsl("+o*s+", 70%, 50%)",width:s*a})},this.drawThrottle=function(){var s=t.plane.dx+1,e=t.planeStats[t.selectedPlane].MAX_SPEED+1,h=i.find(".throttle-bar"),n=h.find(".current"),a=h.width()/e,o=this.maxHue/e,r=this.maxHue-o*s;n.css({backgroundColor:"hsl("+r+", 70%, 50%)",width:s*a})},this.drawPitch=function(){var s,e=t.plane.dy+3,h=6,n=i.find(".pitch-bar"),a=n.find(".current"),o=n.height()/h,r=this.maxPitchHue/h;s=e>=h/2?this.maxPitchHue-r*e:r*e,a.css({backgroundColor:"hsl("+s+", 70%, 50%)",height:n.height()-e*o})},this.drawHeat=function(){var s=t.plane.machinegunHeat,e=t.planeStats[t.selectedPlane].MAX_MACHINEGUN_HEAT,h=i.find(".heat-bar"),n=h.find("span"),a=h.find(".current"),o=t.plane.overheat?"OVERHEAT":"MACHINEGUN HEAT",r=h.width()/e,c=this.maxHue/e,g=this.maxHue-c*s;a.css({backgroundColor:"hsl("+g+", 70%, 50%)",width:s*r}),n.html(o)}}function ImageRepository(t,i){function s(t){_.forOwn(t,function(t,i){"string"==typeof t?h.totalImages++:s(t)})}function e(t){_.forOwn(t,function(s,n){"string"==typeof s?(t[n]=new Image,t[n].src=s,t[n].onload=function(){h.loadedImages++,h.loadedImages===h.totalImages&&i()}):e(s)})}var h=this;this.images=t,this.loadedImages=0,this.totalImages=0,s(this.images),e(this.images)}function Keyboard(t){var i=this;t?this.inputs=t:this.inputs={LEFT:{status:!1,keys:[37,65]},RIGHT:{status:!1,keys:[39,68]},UP:{status:!1,keys:[38,87]},DOWN:{status:!1,keys:[40,83]},SHOOT:{status:!1,keys:[32]},BOMB:{status:!1,keys:[16]}},this.getInputs=function(){var t={};return _.forOwn(i.inputs,function(i,s){t[s]=i.status}),t},this.listen=function(){$("body").keydown(function(t){_.forOwn(i.inputs,function(i,s){_.includes(i.keys,t.which)&&(i.status=!0)})}),$("body").keyup(function(t){_.forOwn(i.inputs,function(i,s){_.includes(i.keys,t.which)&&(i.status=!1)})})}}function Menu(){var t=this;this.selectedPlane=null,this.selectedLevel=null,this.showMenu=function(i){$(".uil-ring-css").fadeOut(300,function(){$("#main-menu").fadeIn(300)}),$("#main-menu .plane").click(function(){t.selectedPlane=$(this).attr("data-plane"),$("#main-menu .select-plane").fadeOut(100,function(){$("#main-menu .select-level").fadeIn(100)})}),$("#main-menu .level").click(function(){t.selectedLevel=$(this).attr("data-level"),$("#main-menu").fadeOut(300,function(){$(".canvas").fadeIn(300)}),i(t.selectedPlane,t.selectedLevel)})}}function Sprite(t,i,s){this.images=t,this.delay=i,this.loop=s,this.index=0,this.frames=0,this.currentImage=this.images[this.index],this.move=function(){return this.loop||this.index!==this.images.length-1?(this.frames++,this.frames>this.delay&&(this.index++,_.isUndefined(this.images[this.index])&&(this.index=0),this.currentImage=this.images[this.index],this.frames=0),this.currentImage):(this.currentImage=null,this.currentImage)}}function BomberBomb(t,i,s,e,h){this.context=t.contexts.enemies.context,this.canvas=t.contexts.enemies.canvas,this.bombImages=t.images.PROJECTILES.BOMBER_BOMB,this.explosionImages=t.images.EXPLOSION,this.dx=e,this.x=i,this.dy=h,this.y=s,this.sprite=new Sprite(this.bombImages,10,!0),this.currentImage,this.active=!0,this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.x+this.currentImage.width<0&&(this.active=!1),this.y>this.canvas.height-30&&this.explode(),this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.explode=function(){this.active=!1;var i=this.x-this.explosionImages[0].width/3,s=this.y-this.explosionImages[0].height+10;t.explosions.push(new Explosion(t,i,s,-2,0,!0))},this.updateSprite=function(){this.currentImage=this.sprite.move()}}function Bomber(t,i,s){var e=this;this.context=t.contexts.enemies.context,this.canvas=t.contexts.enemies.canvas,this.images=t.images.ENEMIES.B17,this.stats=t.enemyStats.B17,this.health=this.stats.HEALTH,this.disabled=!1,this.crashed=!1,this.dx=-3,this.x=i,this.dy=0,this.y=s,this.angle=0,this.bombing=!1,this.bombCarpetSize=this.stats.BOMB_CARPET_SIZE,this.bombCooldown=this.stats.BOMB_COOLDOWN,this.bombTimer=0,this.bombs=[],this.sprite=new Sprite(this.images.SPRITE,2,!0),this.currentImage,this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.checkForGroundCollision(),this.disabled===!1&&this.avoidFighters(),this.checkForFighterCollisions(),this.checkForBulletsDamage(),this.dropBombs(),this.drawBomber(),this.drawBombs()},this.drawBomber=function(){this.dy>0?this.angle=-1*this.dy:this.dy<0?this.angle=-1*this.dy:this.angle=0,this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+t.background.offset+this.currentImage.height/2),this.context.rotate(this.angle*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)),this.context.restore()},this.drawBombs=function(){this.bombs=_.filter(this.bombs,function(t){return t.active?(t.draw(),!0):!1})},this.updateSprite=function(){this.crashed===!0?this.currentImage=this.images.CRASHED:this.currentImage=this.sprite.move()},this.checkForGroundCollision=function(){this.y+this.currentImage.height>this.canvas.height-40&&(this.y=this.canvas.height-this.currentImage.height-40,this.dy=0,this.dx=-2,this.disabled=!0,this.crashed=!0)},this.checkForFighterCollisions=function(){var i={x:t.plane.x,y:t.plane.y,width:t.plane.currentImage.width,height:t.plane.currentImage.height,offset:0},s={x:this.x,y:this.y+this.currentImage.height/2,width:this.currentImage.width,height:this.currentImage.height/2,offset:t.background.offset},e={x:this.x+270,y:this.y,width:55,height:this.currentImage.height/2,offset:t.background.offset};(Utils.intersect(i,s)||Utils.intersect(i,e))&&(this.health--,t.plane.health=t.plane.health-2)},this.checkForBulletsDamage=function(){var i={x:this.x,y:this.y+this.currentImage.height/2,width:this.currentImage.width,height:this.currentImage.height/2,offset:t.background.offset},s={x:this.x+270,y:this.y,width:55,height:this.currentImage.height/2,offset:t.background.offset};t.plane.bullets.forEach(function(h){var n={x:h.x,y:h.y,width:h.currentImage.width,height:h.currentImage.height,offset:t.background.offset},a=Utils.intersect(n,i),o=Utils.intersect(n,s);if(a||o){var r=o?2*h.damage:h.damage;e.health=e.health-r,h.impact=!0}e.health<=0&&e.crashed===!1&&(e.disabled=!0,e.dy=2)})},this.avoidFighters=function(){var i=this.x-t.plane.x+t.plane.currentImage.width,s=this.y+t.background.offset+this.currentImage.height-t.plane.y;i>0&&i<this.canvas.width-300&&s>-100?this.dy=-1:this.dy=0},this.dropBombs=function(){if(this.bombing===!0&&(this.bombTimer++,this.bombTimer>this.bombCooldown&&(this.bombing=!1,this.bombTimer=0)),this.x<this.canvas.width&&this.disabled===!1){var i=_.filter(this.bombs,{active:!0});if(this.bombing===!1&&i.length<this.bombCarpetSize){var s=this.x+this.currentImage.width/1.5,e=this.y+this.currentImage.height-25,h=this.dx+1,n=2;this.bombing=!0,this.bombs.push(new BomberBomb(t,s,e,h,n))}}}}function Game(t,i,s,e){var h=this;this.images=t,this.planeStats=i,this.enemyStats=s,this.levelsData=e,this.selectedPlane,this.selectedLevel,this.inputs,this.keyboard=new Keyboard,this.HUD=new HUD(this,$("#HUD")),this.contexts={background:new Context("background-canvas"),plane:new Context("plane-canvas"),enemies:new Context("enemies-canvas")},this.start=function(t,i){this.selectedPlane=t,this.selectedLevel=i,this.contexts.background.canvas.focus(),this.background=new Background(this),this.plane=new Plane(this),this.enemies=this.levelsData[i].ENEMIES.map(function(t){var arguments=[null,h],i=Object.values(t.arguments);return arguments=arguments.concat(i),new(Function.prototype.bind.apply(this[t.objectType],arguments))}),this.bulletImpacts=[],this.explosions=[],this.keyboard.listen(),this.HUD.show(),this.animate()},this.animate=function(){requestAnimFrame(h.animate),h.inputs=h.keyboard.getInputs(),h.background.draw(),h.plane.draw(),h.contexts.enemies.context.clearRect(0,0,h.contexts.enemies.canvas.width,h.contexts.enemies.canvas.height),h.enemies=_.filter(h.enemies,function(t){return t.x>-800?(t.draw(),!0):!1}),h.bulletImpacts=_.filter(h.bulletImpacts,function(t){return t.active?(t.draw(),!0):!1}),h.explosions=_.filter(h.explosions,function(t){return t.active?(t.draw(),!0):!1}),h.HUD.draw()},window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,i){window.setTimeout(t,1e3/60)}}()}var ENEMY_STATS={B17:{HEALTH:1e3,BOMB_CARPET_SIZE:5,BOMB_COOLDOWN:25}},GAME_IMAGES={MAIN_MENU:"img/menu/menu.png",PLANES:{BF109:{SPRITE:["img/planes/bf109/1.png","img/planes/bf109/2.png"],CRASHED:"img/planes/bf109/3.png"},STUKA:{SPRITE:["img/planes/stuka/1.png","img/planes/stuka/2.png"],CRASHED:"img/planes/stuka/3.png"},KI84:{SPRITE:["img/planes/ki84/1.png","img/planes/ki84/2.png"],CRASHED:"img/planes/ki84/3.png"}},LEVELS:{GRASSLAND:"img/levels/grassland.jpg",DESERT:"img/levels/desert.jpg",WINTER:"img/levels/winter.jpg"},PROJECTILES:{BULLET:"img/projectiles/bullet.png",PLANE_BOMB:["img/projectiles/plane-bomb/1.png","img/projectiles/plane-bomb/2.png"],BOMBER_BOMB:["img/projectiles/bomber-bomb/1.png","img/projectiles/bomber-bomb/2.png"]},BULLET_IMPACT:["img/projectiles/bullet-impact/1.png","img/projectiles/bullet-impact/2.png","img/projectiles/bullet-impact/3.png"],EXPLOSION:["img/explosion/1.png","img/explosion/2.png","img/explosion/3.png","img/explosion/4.png","img/explosion/5.png","img/explosion/6.png","img/explosion/7.png","img/explosion/7.png","img/explosion/7.png","img/explosion/7.png","img/explosion/7.png","img/explosion/6.png","img/explosion/6.png","img/explosion/6.png","img/explosion/5.png","img/explosion/5.png","img/explosion/5.png","img/explosion/4.png","img/explosion/4.png","img/explosion/4.png","img/explosion/3.png","img/explosion/3.png","img/explosion/3.png","img/explosion/2.png","img/explosion/2.png","img/explosion/2.png","img/explosion/1.png","img/explosion/1.png","img/explosion/1.png"],BOMB_HOLE:"img/bomb_hole.png",ENEMIES:{B17:{SPRITE:["img/enemies/b17/1.png","img/enemies/b17/2.png"],CRASHED:"img/enemies/b17/3.png"}}},LEVELS_DATA={GRASSLAND:{WEATHER:"normal",ENEMIES:[{objectType:"Bomber",arguments:{x:1100,y:0}},{objectType:"Bomber",arguments:{x:1800,y:100}},{objectType:"Bomber",arguments:{x:2500,y:150}}]},DESERT:{WEATHER:"normal",ENEMIES:[{objectType:"Bomber",arguments:{x:700,y:300}},{objectType:"Bomber",arguments:{x:1200,y:400}}]},WINTER:{WEATHER:"snow",ENEMIES:[{objectType:"Bomber",arguments:{x:700,y:300}},{objectType:"Bomber",arguments:{x:1200,y:400}}]}},PLANE_STATS={BF109:{DAMAGE:60,HEALTH:120,MAX_SPEED:3,CLIMB_SPEED:7,DESCEND_SPEED:7,MACHINEGUN_HEATING:2,MAX_MACHINEGUN_HEAT:100},STUKA:{DAMAGE:90,HEALTH:200,MAX_SPEED:2,CLIMB_SPEED:5,DESCEND_SPEED:15,MACHINEGUN_HEATING:3,MAX_MACHINEGUN_HEAT:250},KI84:{DAMAGE:120,HEALTH:80,MAX_SPEED:4,CLIMB_SPEED:15,DESCEND_SPEED:5,MACHINEGUN_HEATING:2,MAX_MACHINEGUN_HEAT:80}},Utils=new function(){function t(t){return t.left=t.x,t.top=t.y+t.offset,t.right=t.left+t.width,t.bottom=t.top+t.height,t}this.intersect=function(i,s){var e=!1;i=t(i),s=t(s);var h=Math.max(0,Math.min(i.right,s.right)-Math.max(i.left,s.left)),n=Math.max(0,Math.min(i.bottom,s.bottom)-Math.max(i.top,s.top));return 0!==h&&0!==n&&(e=!0),e}},CONSTANTS={GAME_STATE:{MAIN_MENU:0,PLAYING:1,GAME_OVER:2,PAUSED:3}},IMAGE_REPOSITORY=new ImageRepository(GAME_IMAGES,function(){var t=new Menu;t.showMenu(function(t,i){var s=new Game(IMAGE_REPOSITORY.images,PLANE_STATS,ENEMY_STATS,LEVELS_DATA);s.start(t,i)})});