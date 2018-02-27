function Context(t){this.canvas=document.getElementById(t),this.context=this.canvas.getContext("2d")}function ImageRepository(t,i){function s(t){_.forOwn(t,function(t,i){"string"==typeof t?h.totalImages++:s(t)})}function e(t){_.forOwn(t,function(s,n){"string"==typeof s?(t[n]=new Image,t[n].src=s,t[n].onload=function(){h.loadedImages++,h.loadedImages===h.totalImages&&i()}):e(s)})}var h=this;this.images=t,this.loadedImages=0,this.totalImages=0,s(this.images),e(this.images)}function Keyboard(t){var i=this;t?this.inputs=t:this.inputs={LEFT:{status:!1,keys:[37,65]},RIGHT:{status:!1,keys:[39,68]},UP:{status:!1,keys:[38,87]},DOWN:{status:!1,keys:[40,83]},SHOOT:{status:!1,keys:[32]},BOMB:{status:!1,keys:[16]}},this.getInputs=function(){var t={};return _.forOwn(i.inputs,function(i,s){t[s]=i.status}),t},this.listen=function(){$("body").keydown(function(t){_.forOwn(i.inputs,function(i,s){_.includes(i.keys,t.which)&&(i.status=!0)})}),$("body").keyup(function(t){_.forOwn(i.inputs,function(i,s){_.includes(i.keys,t.which)&&(i.status=!1)})})}}function Menu(){var t=this;this.selectedPlane=null,this.selectedLevel=null,this.showMenu=function(i){$(".uil-ring-css").fadeOut(300,function(){$("#main-menu").fadeIn(300)}),$("#main-menu .plane").click(function(){t.selectedPlane=$(this).attr("data-plane"),$("#main-menu .select-plane").fadeOut(100,function(){$("#main-menu .select-level").fadeIn(100)})}),$("#main-menu .level").click(function(){t.selectedLevel=$(this).attr("data-level"),$("#main-menu").fadeOut(300,function(){$(".canvas").fadeIn(300)}),i(t.selectedPlane,t.selectedLevel)})}}function Sprite(t,i,s){this.images=t,this.delay=i,this.loop=s,this.index=0,this.frames=0,this.currentImage=this.images[this.index],this.move=function(){return this.loop||this.index!==this.images.length-1?(this.frames++,this.frames>this.delay&&(this.index++,_.isUndefined(this.images[this.index])&&(this.index=0),this.currentImage=this.images[this.index],this.frames=0),this.currentImage):(this.currentImage=null,this.currentImage)}}function Background(t,i){this.context=t.BACKGROUND.context,this.canvas=t.BACKGROUND.canvas,this.backgroundImage=IMAGE_REPOSITORY.images.LEVELS[i],this.dx=-2,this.x=0,this.dy=0,this.y=this.canvas.height-this.backgroundImage.height,this.offset=0,this.draw=function(t){this.x=this.x+this.dx,this.y=this.y+this.dy,this.x<-1*this.backgroundImage.width&&(this.x=0),this.moveBackgroundVertically(t),this.y>0&&(this.dy=0,this.y=0),this.y<-1*(this.backgroundImage.height-this.canvas.height)&&(this.dy=0,this.y=-1*(this.backgroundImage.height-this.canvas.height));var i=this.canvas.height-this.backgroundImage.height;this.offset=this.y-i,this.context.drawImage(this.backgroundImage,this.x,this.y),this.context.drawImage(this.backgroundImage,this.x+this.backgroundImage.width,this.y)},this.moveBackgroundVertically=function(t){if(0!==t.dy){var i=this.canvas.height/2;t.y<i&&t.dy<0?this.dy=-1.3*t.dy:t.dy>0&&(this.dy=-1.3*t.dy)}else this.dy=0}}function PlaneBomb(t,i,s,e,h,n){this.context=t.PLANE.context,this.canvas=t.PLANE.canvas,this.background=i,this.explosionImages=IMAGE_REPOSITORY.images.EXPLOSION,this.dx=h,this.x=s,this.dy=n,this.y=e,this.sprite=new Sprite(this.explosionImages,5,!1),this.spriteIndex=0,this.currentImage=IMAGE_REPOSITORY.images.PROJECTILES.PLANE_BOMB,this.frames=5,this.limit=5,this.reverseOrder=!1,this.exploded=!1,this.explosionActive=!1,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,(this.y>this.canvas.height-30||this.explosionActive===!0)&&(this.dx=-2,this.dy=0,this.exploded===!1&&(this.x=this.x-this.explosionImages[0].width/3,this.y=this.y-this.explosionImages[0].height+10,this.exploded=!0,this.explosionActive=!0),this.updateSprite()),this.context.drawImage(this.currentImage,this.x,this.y+i.offset)},this.updateSprite=function(){this.currentImage=this.sprite.move(),null===this.currentImage&&(this.explosionActive=!1,this.currentImage=IMAGE_REPOSITORY.images.BOMB_HOLE)}}function PlaneBullet(t,i,s,e,h,n,a){this.context=t.PLANE.context,this.canvas=t.PLANE.canvas,this.background=i,this.bulletImage=IMAGE_REPOSITORY.images.PROJECTILES.BULLET,this.dx=h,this.x=s,this.dy=n,this.y=e,this.angle=a,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,0!==this.angle?this.rotateBullet(this.angle):this.context.drawImage(this.bulletImage,this.x,this.y+i.offset)},this.rotateBullet=function(t){this.context.save(),this.context.translate(this.x+this.bulletImage.width/2,this.y+this.bulletImage.height/2),this.context.rotate(t*Math.PI/180),this.context.drawImage(this.bulletImage,-(this.bulletImage.width/2),-(this.bulletImage.height/2)+i.offset),this.context.restore()}}function Plane(t,i,s){var e=this;this.context=t.PLANE.context,this.canvas=t.PLANE.canvas,this.background=i,this.planeStats=PLANES_STATS[s],this.currentHealth=this.planeStats.HEALTH,this.images=IMAGE_REPOSITORY.images.PLANES[s],this.disabled=!1,this.crashed=!1,this.dx=1,this.x=200,this.dy=0,this.y=350,this.angle=0,this.sprite=new Sprite(this.images.SPRITE,2,!0),this.currentImage,this.shooting=!1,this.bulletsCooldown=5,this.bulletsTimer=0,this.bullets=[],this.bombing=!1,this.bombCooldown=20,this.bombTimer=0,this.bombs=[],this.draw=function(t){e.disabled===!1&&this.processInputs(t),this.updateSprite(),this.currentHealth<=0&&this.crashed===!1&&(this.disabled=!0,this.dy=2),this.shooting===!0&&(this.bulletsTimer++,this.bulletsTimer>this.bulletsCooldown&&(this.shooting=!1,this.bulletsTimer=0)),this.bombing===!0&&(this.bombTimer++,this.bombTimer>this.bombCooldown&&(this.bombing=!1,this.bombTimer=0)),this.bullets=_.filter(this.bullets,function(t){return t.x<e.canvas.width&&t.y<e.canvas.height-30}),this.bombs=_.filter(this.bombs,function(t){return t.x>-1*IMAGE_REPOSITORY.images.EXPLOSION[0].width}),this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.x=this.x+this.dx,this.y=this.y+this.dy,this.checkForCollisions(),this.dy>0?(this.angle=this.dy*this.planeStats.DESCEND_SPEED,this.rotatePlane(this.angle)):this.dy<0?(this.angle=this.dy*this.planeStats.CLIMB_SPEED,this.rotatePlane(this.angle)):(this.angle=0,this.context.drawImage(this.currentImage,this.x,this.y)),this.bullets.forEach(function(t){t.draw()}),this.bombs.forEach(function(t){t.draw()})},this.processInputs=function(t){t.UP&&this.dy>-3&&(this.dy=this.dy-.1),t.DOWN&&this.dy<3&&(this.dy=this.dy+.1),t.LEFT&&this.dx>-1&&(this.dx=this.dx-.1),t.RIGHT&&this.dx<this.planeStats.MAX_SPEED&&(this.dx=this.dx+.1),t.SHOOT&&this.shoot(),t.BOMB&&this.dropBomb()},this.updateSprite=function(){this.crashed===!0?this.currentImage=this.images.CRASHED:this.currentImage=this.sprite.move()},this.rotatePlane=function(t){this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+this.currentImage.height/2),this.context.rotate(t*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)),this.context.restore()},this.shoot=function(){if(this.shooting===!1){var e=this.x+this.currentImage.width/2,h=this.y-this.background.offset+this.currentImage.height/2,n=25,a=0,o=this.angle;this.shooting=!0,this.dy>0?(o=this.dy*this.planeStats.DESCEND_SPEED,a=this.dy*(o/4.5)):this.dy<0&&(o=this.dy*this.planeStats.CLIMB_SPEED,a=this.dy*(o/4.5)*-1),"KI84"===s&&-20>=o&&i.offset>0&&(e-=i.offset/2.5,h-=i.offset/7),this.bullets.push(new PlaneBullet(t,i,e,h,n,a,o))}},this.dropBomb=function(){if(this.bombing===!1){var i=this.x+this.currentImage.width/1.3,s=this.y-this.background.offset+this.currentImage.height/2,e=this.dx-2,h=(this.dy>0?this.dy:0)+3;this.bombing=!0,this.bombs.push(new PlaneBomb(t,this.background,i,s,e,h))}},this.checkForCollisions=function(){this.y<0&&(this.y=0,this.dy=0),this.x<0&&this.crashed===!1&&(this.x=0,this.dx=0),this.x+this.currentImage.width>this.canvas.width&&(this.x=this.canvas.width-this.currentImage.width,this.dx=-1),this.y+this.currentImage.height>this.canvas.height-40&&(this.y=this.canvas.height-this.currentImage.height-40,this.dy=0,this.dx=-2,this.disabled=!0,this.crashed=!0)}}function Bomber(t,i,s,e,h){var n=this;this.context=t.ENEMIES.context,this.canvas=t.ENEMIES.canvas,this.background=i,this.plane=s,this.images=IMAGE_REPOSITORY.images.ENEMIES.B17,this.dx=-3,this.x=e,this.dy=0,this.y=h,this.angle=0,this.sprite=new Sprite(this.images.SPRITE,2,!0),this.currentImage,this.draw=function(){this.updateSprite(),this.checkForCollisions()&&console.log("######## COLLISION ####### "+(new Date).getTime()),this.checkForBulletsDamage()&&console.log("######## BULLET HIT ####### "+(new Date).getTime()),this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.clearRect(this.x-5,this.y+i.offset-5,this.currentImage.width+10,this.currentImage.height+10),this.context.drawImage(this.currentImage,this.x,this.y+i.offset)},this.updateSprite=function(){this.currentImage=this.sprite.move()},this.checkForCollisions=function(){var t=!1,s=this.plane.x,e=this.plane.y,h=s+this.plane.currentImage.width,n=this.plane.y+this.plane.currentImage.height,a=this.x,o=this.y+i.offset,r=a+this.currentImage.width,g=this.y+i.offset+this.currentImage.height,m=Math.max(0,Math.min(h,r)-Math.max(s,a)),c=Math.max(0,Math.min(n,g)-Math.max(e,o));return 0!==m&&0!==c&&(t=!0),t},this.checkForBulletsDamage=function(){var t=!1;return this.plane.bullets.forEach(function(s){var e=s.x,h=s.y+i.offset,a=e+s.bulletImage.width,o=s.y+i.offset+s.bulletImage.height,r=n.x,g=n.y+i.offset,m=r+n.currentImage.width,c=n.y+i.offset+n.currentImage.height,l=Math.max(0,Math.min(a,m)-Math.max(e,r)),u=Math.max(0,Math.min(o,c)-Math.max(h,g));0!==l&&0!==u&&(t=!0)}),t}}function Obstacle(t,i,s,e,h){var n=this;this.context=t.ENEMIES.context,this.canvas=t.ENEMIES.canvas,this.background=i,this.plane=s,this.planeImages=IMAGE_REPOSITORY.images.PLANES.STUKA,this.spriteIndex=0,this.currentImage=this.planeImages.SPRITE[0],this.dx=-1,this.x=e,this.dy=0,this.y=h,this.frames=0,this.limit=2,this.draw=function(){this.checkForCollisions()&&console.log("######## COLLISION ####### "+(new Date).getTime()),this.checkForBulletsDamage()&&console.log("######## BULLET HIT ####### "+(new Date).getTime()),this.frames++,this.frames>this.limit&&(this.spriteIndex++,_.isUndefined(this.planeImages.SPRITE[this.spriteIndex])&&(this.spriteIndex=0),this.currentImage=this.planeImages.SPRITE[this.spriteIndex],this.frames=0),this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.clearRect(this.x-5,this.y+i.offset-5,this.currentImage.width+10,this.currentImage.height+10),this.context.drawImage(this.currentImage,this.x,this.y+i.offset)},this.checkForCollisions=function(){var t=!1,s=this.plane.x,e=this.plane.y,h=s+this.plane.currentImage.width,n=this.plane.y+this.plane.currentImage.height,a=this.x,o=this.y+i.offset,r=a+this.currentImage.width,g=this.y+i.offset+this.currentImage.height,m=Math.max(0,Math.min(h,r)-Math.max(s,a)),c=Math.max(0,Math.min(n,g)-Math.max(e,o));return 0!==m&&0!==c&&(t=!0),t},this.checkForBulletsDamage=function(){var t=!1;return this.plane.bullets.forEach(function(s){var e=s.x,h=s.y+i.offset,a=e+s.bulletImage.width,o=s.y+i.offset+s.bulletImage.height,r=n.x,g=n.y+i.offset,m=r+n.currentImage.width,c=n.y+i.offset+n.currentImage.height,l=Math.max(0,Math.min(a,m)-Math.max(e,r)),u=Math.max(0,Math.min(o,c)-Math.max(h,g));0!==l&&0!==u&&(t=!0)}),t}}function init(t,i){function s(){requestAnimFrame(s);var t=o.getInputs();h.draw(n),n.draw(t),a.forEach(function(t){t.draw(h)})}var e=(CONSTANTS.GAME_STATE.MAIN_MENU,{BACKGROUND:new Context("background-canvas"),PLANE:new Context("plane-canvas"),ENEMIES:new Context("enemies-canvas")});e.BACKGROUND.canvas.focus();var h=new Background(e,i),n=new Plane(e,h,t),a=LEVELS_DATA[i].ENEMIES.map(function(t){var arguments=[null,e,h,n],i=Object.values(t.arguments);return arguments=arguments.concat(i),new(Function.prototype.bind.apply(this[t.objectType],arguments))}),o=new Keyboard;o.listen(),window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,i){window.setTimeout(t,1e3/60)}}(),s()}var GAME_IMAGES={MAIN_MENU:"img/menu/menu.png",PLANES:{BF109:{SPRITE:["img/planes/bf109/1.png","img/planes/bf109/2.png"],CRASHED:"img/planes/bf109/3.png"},STUKA:{SPRITE:["img/planes/stuka/1.png","img/planes/stuka/2.png"],CRASHED:"img/planes/stuka/3.png"},KI84:{SPRITE:["img/planes/ki84/1.png","img/planes/ki84/2.png"],CRASHED:"img/planes/ki84/3.png"}},LEVELS:{GRASSLAND:"img/levels/grassland.jpg",DESERT:"img/levels/desert.jpg",WINTER:"img/levels/winter.jpg"},PROJECTILES:{BULLET:"img/projectiles/bullet.png",PLANE_BOMB:"img/projectiles/bomb.png"},EXPLOSION:["img/explosion/1.png","img/explosion/2.png","img/explosion/3.png","img/explosion/4.png","img/explosion/5.png","img/explosion/6.png","img/explosion/7.png","img/explosion/7.png","img/explosion/7.png","img/explosion/7.png","img/explosion/7.png","img/explosion/6.png","img/explosion/6.png","img/explosion/6.png","img/explosion/5.png","img/explosion/5.png","img/explosion/5.png","img/explosion/4.png","img/explosion/4.png","img/explosion/4.png","img/explosion/3.png","img/explosion/3.png","img/explosion/3.png","img/explosion/2.png","img/explosion/2.png","img/explosion/2.png","img/explosion/1.png","img/explosion/1.png","img/explosion/1.png"],BOMB_HOLE:"img/bomb_hole.png",ENEMIES:{B17:{SPRITE:["img/enemies/b17/1.png","img/enemies/b17/2.png"],CRASHED:"img/enemies/b17/3.png"}}},LEVELS_DATA={GRASSLAND:{WEATHER:"normal",ENEMIES:[{objectType:"Bomber",arguments:{x:1100,y:0}},{objectType:"Bomber",arguments:{x:1800,y:100}},{objectType:"Bomber",arguments:{x:2500,y:150}}]},DESERT:{WEATHER:"normal",ENEMIES:[{objectType:"Bomber",arguments:{x:700,y:300}},{objectType:"Bomber",arguments:{x:1200,y:400}}]},WINTER:{WEATHER:"snow",ENEMIES:[{objectType:"Bomber",arguments:{x:700,y:300}},{objectType:"Bomber",arguments:{x:1200,y:400}}]}},PLANES_STATS={BF109:{DAMAGE:60,HEALTH:120,MAX_SPEED:3,CLIMB_SPEED:7,DESCEND_SPEED:7},STUKA:{DAMAGE:90,HEALTH:200,MAX_SPEED:2,CLIMB_SPEED:5,DESCEND_SPEED:15},KI84:{DAMAGE:120,HEALTH:80,MAX_SPEED:4,CLIMB_SPEED:15,DESCEND_SPEED:5}},CONSTANTS={GAME_STATE:{MAIN_MENU:0,PLAYING:1,GAME_OVER:2,PAUSED:3}},IMAGE_REPOSITORY=new ImageRepository(GAME_IMAGES,function(){var t=new Menu;t.showMenu(init)});