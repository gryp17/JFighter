function Background(t){this.context=t.contexts.background.context,this.canvas=t.contexts.background.canvas,this.backgroundImage=t.images.LEVELS[t.selectedLevel],this.dx=-2,this.x=0,this.dy=0,this.groundHeight=t.levelsData[t.selectedLevel].GROUND_HEIGHT,this.y=this.canvas.height-this.backgroundImage.height,this.offset=0,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.x<-1*this.backgroundImage.width&&(this.x=0),this.moveBackgroundVertically(t.plane),this.y>0&&(this.dy=0,this.y=0),this.y<-1*(this.backgroundImage.height-this.canvas.height)&&(this.dy=0,this.y=-1*(this.backgroundImage.height-this.canvas.height));var i=this.canvas.height-this.backgroundImage.height;this.offset=this.y-i,this.context.drawImage(this.backgroundImage,this.x,this.y),this.context.drawImage(this.backgroundImage,this.x+this.backgroundImage.width,this.y)},this.moveBackgroundVertically=function(t){if(0!==t.dy){var i=this.canvas.height/2;t.y<i&&t.dy<0?this.dy=-1.3*t.dy:t.dy>0&&(this.dy=-1.3*t.dy)}else this.dy=0}}function BombHole(t,i,e){this.context=t.contexts.background.context,this.canvas=t.contexts.background.canvas,this.currentImage=t.images.BOMB_HOLE,this.dx=t.background.dx,this.x=i,this.dy=0,this.y=e,this.angle=_.random(-30,30),this.active=!0,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+this.currentImage.height/2),this.context.rotate(this.angle*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)+t.background.offset),this.context.restore()}}function BulletImpact(t,i,e){this.context=t.contexts.projectiles.context,this.canvas=t.contexts.projectiles.canvas,this.impactImages=t.images.BULLET_IMPACT,this.active=!0,this.dx=0,this.x=i,this.dy=0,this.y=e,this.impactSprite=new Sprite(this.impactImages,5,!1),this.currentImage,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.updateSprite(),this.active&&this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.updateSprite=function(){this.currentImage=this.impactSprite.move(),null===this.currentImage&&(this.active=!1)}}function Civilian(t,i,e){this.context=t.contexts.civilians.context,this.canvas=t.contexts.civilians.canvas,this.images=t.images.CIVILIANS[_.random(0,t.images.CIVILIANS.length-1)],this.dx=-2.5,this.x=i,this.dy=0,this.y=e,this.active=!0,this.dead=!1,this.sprite=new Sprite(this.images.SPRITE,7,!0),this.currentImage=this.images.SPRITE[0],this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.updateSprite=function(){this.dead===!1&&(this.currentImage=this.sprite.move())},this.die=function(){this.dead=!0,this.y=580,this.dx=-2,this.currentImage=this.images.DEAD},this.getHitbox=function(){return{x:this.x,y:this.y,width:this.currentImage.width,height:this.currentImage.height,offset:t.background.offset}}}function Explosion(t,i,e,s,h,n){this.context=t.contexts.projectiles.context,this.canvas=t.contexts.projectiles.canvas,this.explosionImages=t.images.EXPLOSION,this.dx=s,this.x=i,this.dy=h,this.y=e,this.active=!0,this.spriteDelay=n?5:2,this.sprite=new Sprite(this.explosionImages,this.spriteDelay,!1),this.currentImage,this.draw=function(){this.updateSprite(),this.active&&(this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset))},this.updateSprite=function(){this.currentImage=this.sprite.move(),null===this.currentImage&&(this.active=!1)}}function PlaneBomb(t,i,e,s,h){this.context=t.contexts.projectiles.context,this.canvas=t.contexts.projectiles.canvas,this.bombImages=t.images.PROJECTILES.PLANE_BOMB,this.explosionImages=t.images.EXPLOSION,this.dx=s,this.x=i,this.dy=h,this.y=e,this.explosionRadius=t.plane.stats.BOMB_EXPLOSION_RADIUS,this.sprite=new Sprite(this.bombImages,10,!0),this.currentImage,this.active=!0,this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.explode=function(i){this.active=!1;var e=this.x-this.explosionImages[0].width/3,s=this.y-this.explosionImages[0].height/2;t.explosions.push(new Explosion(t,e,s,-2,0,i)),i&&t.bombHoles.push(new BombHole(t,e,s))},this.updateSprite=function(){this.currentImage=this.sprite.move()},this.getHitbox=function(){return{x:this.x,y:this.y,width:this.currentImage.width,height:this.currentImage.height,offset:t.background.offset}},this.getExplosionHitbox=function(){var t=this.getHitbox();return t.x=t.x-this.explosionRadius,t.width=t.width+this.explosionRadius,t}}function PlaneBullet(t,i,e,s,h,n){this.context=t.contexts.projectiles.context,this.canvas=t.contexts.projectiles.canvas,this.currentImage=t.images.PROJECTILES.BULLET,this.active=!0,this.damage=t.plane.stats.DAMAGE,this.dx=s,this.x=i,this.dy=h,this.y=e,this.angle=n,this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+this.currentImage.height/2),this.context.rotate(this.angle*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)+t.background.offset),this.context.restore()},this.explode=function(){this.active=!1,t.bulletImpacts.push(new BulletImpact(t,this.x+this.currentImage.width,this.y))},this.getHitbox=function(){return{x:this.x,y:this.y,width:this.currentImage.width,height:this.currentImage.height,offset:t.background.offset}}}function Plane(t){this.context=t.contexts.plane.context,this.canvas=t.contexts.plane.canvas,this.stats=t.planeStats[t.selectedPlane],this.images=t.images.PLANES[t.selectedPlane],this.health=this.stats.HEALTH,this.damaged=!1,this.disabled=!1,this.crashed=!1,this.dx=1,this.x=200,this.dy=0,this.y=350,this.angle=0,this.sprite=new Sprite(this.images.SPRITE.DEFAULT,2,!0),this.currentImage=this.images.SPRITE.DEFAULT[0],this.shooting=!1,this.overheat=!1,this.bulletDelay=5,this.bulletTimer=0,this.machinegunHeat=0,this.bullets=[],this.bombing=!1,this.bombCooldown=this.stats.BOMB_COOLDOWN,this.bombDelay=this.stats.BOMB_DELAY,this.loadedBombs=this.stats.MAX_BOMBS,this.bombTimer=0,this.delayTimer=0,this.bombs=[],this.draw=function(){this.health<=0&&this.crashed===!1&&this.disabled===!1&&this.disable(),this.damaged===!1&&this.health<this.stats.HEALTH/2&&(this.damaged=!0,this.sprite=new Sprite(this.images.SPRITE.DAMAGED,2,!0)),this.disabled===!1?this.processInputs(t.inputs):this.freeFall(),this.updateSprite(),this.updateMachinegunStatus(),this.updateBombsStatus(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.drawPlane(),this.drawBullets(),this.drawBombs()},this.disable=function(){this.disabled=!0,this.health=0},this.freeFall=function(){this.dy=this.dy+.05},this.crash=function(){this.y=this.canvas.height-this.currentImage.height-t.background.groundHeight,this.dy=0,this.dx=-2,this.disabled=!0,this.crashed=!0,this.health=0},this.processInputs=function(t){t.UP&&this.dy>-3&&(this.dy=this.dy-.1),t.DOWN&&this.dy<3&&(this.dy=this.dy+.1),t.LEFT&&this.dx>-1&&(this.dx=this.dx-.1),t.RIGHT&&this.dx<this.stats.MAX_SPEED&&(this.dx=this.dx+.1),t.SHOOT&&this.shoot(),t.BOMB&&this.dropBomb()},this.updateSprite=function(){this.crashed===!0?this.currentImage=this.images.CRASHED:this.currentImage=this.sprite.move()},this.drawPlane=function(){this.dy>0?this.angle=this.dy*this.stats.DESCEND_SPEED:this.dy<0?this.angle=this.dy*this.stats.CLIMB_SPEED:this.angle=0,this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+this.currentImage.height/2),this.context.rotate(this.angle*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)),this.context.restore()},this.updateMachinegunStatus=function(){this.machinegunHeat===this.stats.MAX_MACHINEGUN_HEAT&&(this.overheat=!0),this.machinegunHeat>0&&(this.machinegunHeat--,this.overheat&&0===this.machinegunHeat&&(this.overheat=!1)),this.shooting===!0&&(this.bulletTimer++,this.machinegunHeat=this.machinegunHeat+this.stats.MACHINEGUN_HEATING,this.machinegunHeat>this.stats.MAX_MACHINEGUN_HEAT&&(this.machinegunHeat=this.stats.MAX_MACHINEGUN_HEAT),this.bulletTimer>this.bulletDelay&&(this.shooting=!1,this.bulletTimer=0))},this.updateBombsStatus=function(){this.loadedBombs<this.stats.MAX_BOMBS&&(this.bombTimer++,this.delayTimer++,this.delayTimer>this.bombDelay&&(this.bombing=!1,this.delayTimer=0),this.bombTimer>this.bombCooldown&&(this.loadedBombs++,this.bombTimer=0))},this.drawBullets=function(){this.bullets=_.filter(this.bullets,function(t){return t.active===!1?!1:(t.draw(),!0)})},this.drawBombs=function(){this.bombs=_.filter(this.bombs,function(t){return t.active?(t.draw(),!0):!1})},this.shoot=function(){if(this.shooting===!1&&this.overheat===!1){var i=this.x+this.currentImage.width/2,e=this.y-t.background.offset+this.currentImage.height/2,s=25,h=0,n=this.angle;this.shooting=!0,this.dy>0?(n=this.dy*this.stats.DESCEND_SPEED,h=this.dy*(n/4.5)):this.dy<0&&(n=this.dy*this.stats.CLIMB_SPEED,h=this.dy*(n/4.5)*-1),"KI84"===t.selectedPlane&&-20>=n&&t.background.offset>0&&(i-=t.background.offset/2.5,e-=t.background.offset/7),this.bullets.push(new PlaneBullet(t,i,e,s,h,n))}},this.dropBomb=function(){if(this.loadedBombs>0&&this.bombing===!1){this.bombing=!0,this.loadedBombs--;var i=this.x+this.currentImage.width/1.3,e=this.y-t.background.offset+this.currentImage.height/2,s=this.dx-2,h=(this.dy>0?this.dy:0)+3;this.bombs.push(new PlaneBomb(t,i,e,s,h))}},this.getHitbox=function(){return{x:this.x,y:this.y,width:this.currentImage.width,height:this.currentImage.height,offset:0}}}function CollisionsManager(t){var i=this;this.handleCollisions=function(){this.handlePlane(),this.handleBombers(),this.handleBombHoles(),this.handleShermans(),this.handleCivilians(),this.handleWeatherEffects()},this.handlePlane=function(){var i=t.plane,e=i.getHitbox(),s=_.filter(t.enemies,function(t){return t.constructor===Bomber});i.y<0&&(i.y=0,i.dy=0),i.x<0&&i.crashed===!1&&(i.x=0,i.dx=0),i.x+i.currentImage.width>i.canvas.width&&(i.x=i.canvas.width-i.currentImage.width,i.dx=-1),i.y+i.currentImage.height>i.canvas.height-t.background.groundHeight&&i.crash(),s.forEach(function(t){t.bombs.forEach(function(t){Utils.collidesWith(e,t.getHitbox())&&(t.explode(!1),i.disable())})}),this.handlePlaneBullets(),this.handlePlaneBombs()},this.handlePlaneBullets=function(){t.plane.bullets.forEach(function(t){t.y>=t.canvas.height-30&&t.explode(),t.x>t.canvas.width&&(t.active=!1)})},this.handlePlaneBombs=function(){t.plane.bombs.forEach(function(t){t.x+t.currentImage.width<0&&(t.active=!1),t.y+t.currentImage.height>t.canvas.height-15&&t.explode(!0)})},this.handleBomberBombs=function(i){i.bombs.forEach(function(i){i.x+i.currentImage.width<0&&(i.active=!1),i.y+i.currentImage.height>i.canvas.height-15&&i.explode(!0),t.plane.bullets.forEach(function(t){Utils.collidesWith(i.getHitbox(),t.getHitbox())&&(t.explode(),i.explode(!1))})})},this.handleBombers=function(){var e=_.filter(t.enemies,function(t){return t.constructor===Bomber}),s=t.plane.getHitbox();e.forEach(function(e){var h=e.getHitbox();i.handleBomberBombs(e),e.x<-800&&(e.active=!1),e.y+e.currentImage.height>e.canvas.height-t.background.groundHeight&&e.crash(),Utils.collidesWith(h,s)&&(e.health--,t.plane.health=t.plane.health-2),t.plane.bullets.forEach(function(t){var i=Utils.collidesWith(h[0],t.getHitbox()),s=Utils.collidesWith(h[1],t.getHitbox());if(i||s){var n=s?2*t.damage:t.damage;e.health=e.health-n,t.explode()}}),t.plane.bombs.forEach(function(t){Utils.collidesWith(h,t.getHitbox())&&(t.explode(!1),e.disable())})})},this.handleBombHoles=function(){t.bombHoles.forEach(function(t){t.x+t.currentImage.width<0&&(t.active=!1)})},this.handleShermans=function(){var i=_.filter(t.enemies,function(t){return t.constructor===Sherman});i.forEach(function(i){var e=i.getHitbox();i.x+i.currentImage.width<0&&(i.active=!1),t.plane.bullets.forEach(function(t){Utils.collidesWith(e,t.getHitbox())&&(i.health=i.health-t.damage,t.explode())}),t.plane.bombs.forEach(function(t){t.active===!1&&Utils.collidesWith(e,t.getExplosionHitbox())&&(t.explode(!1),i.destroy())})})},this.handleCivilians=function(){var i=[],e=[];t.enemies.forEach(function(t){switch(t.constructor){case Bomber:i.push(t);break;case Sherman:e.push(t)}}),t.civilians.forEach(function(s){var h=s.getHitbox();s.x+s.currentImage.width<0&&(s.active=!1);var n=t.plane.bombs;i.forEach(function(t){n=n.concat(t.bombs)}),n.forEach(function(t){t.active===!1&&Utils.collidesWith(h,t.getExplosionHitbox())&&s.die()}),t.plane.bullets.forEach(function(t){Utils.collidesWith(h,t.getHitbox())&&(t.explode(),s.die())}),e.forEach(function(t){Utils.collidesWith(h,t.getHullHitbox())&&s.die()})})},this.handleWeatherEffects=function(){t.weatherEffects.forEach(function(i){i.y>i.canvas.height-t.background.groundHeight&&i.reset()})}}function Context(t){this.canvas=document.getElementById(t),this.context=this.canvas.getContext("2d")}function HARPP(t){this.weather,this.showWeatherEffects=!1,this.clock=0,this.generateWeather=function(t){this.weather=t.WEATHER;var i=[];switch(t.WEATHER.TYPE){case"snow":i=this.generateSnow(t);break;case"rain":i=this.generateRain(t)}return i},this.updateWeatherStatus=function(){this.weather.INTERVAL?(this.clock++,this.clock===this.weather.INTERVAL&&(this.clock=0,this.showWeatherEffects=!this.showWeatherEffects)):this.showWeatherEffects=!0},this.generateSnow=function(i){for(var e=[],s=t.contexts.weather.canvas,h=0;600>h;h++){var n=_.random(0,2*s.width),a=_.random(-1*s.height,0),o=_.random(-4,-2.5,!0),r=_.random(1,2,!0),c=_.random(.5,2.5,!0);e.push(new Snowflake(t,n,a,o,r,c))}return e},this.generateRain=function(i){for(var e=[],s=t.contexts.weather.canvas,h=0;300>h;h++){var n=_.random(0,2*s.width),a=_.random(-1*s.height,0),o=_.random(-4,-2.5,!0),r=_.random(8,10,!0),c=1,g=_.random(5,10);e.push(new Raindrop(t,n,a,o,r,c,g))}return e}}function HUD(t,i){this.visible=!1,this.maxHue=130,this.maxPitchHue=200,this.show=function(){this.visible=!0},this.hide=function(){this.visible=!1},this.draw=function(){i.css("display",this.visible?"block":"none"),this.visible&&(this.drawHealth(),this.drawThrottle(),this.drawPitch(),this.drawHeat(),this.drawLoadedBombs())},this.drawHealth=function(){var e=t.plane.health,s=t.planeStats[t.selectedPlane].HEALTH,h=i.find(".health-bar"),n=h.find(".current"),a=h.width()/s,o=this.maxHue/s;n.css({backgroundColor:"hsl("+o*e+", 70%, 50%)",width:e*a})},this.drawThrottle=function(){var e=t.plane.dx+1,s=t.planeStats[t.selectedPlane].MAX_SPEED+1,h=i.find(".throttle-bar"),n=h.find(".current"),a=h.width()/s,o=this.maxHue/s,r=this.maxHue-o*e;n.css({backgroundColor:"hsl("+r+", 70%, 50%)",width:e*a})},this.drawPitch=function(){var e,s=t.plane.dy+3,h=6,n=i.find(".pitch-bar"),a=n.find(".current"),o=n.height()/h,r=this.maxPitchHue/h;e=s>=h/2?this.maxPitchHue-r*s:r*s,a.css({backgroundColor:"hsl("+e+", 70%, 50%)",height:n.height()-s*o})},this.drawHeat=function(){var e=t.plane.machinegunHeat,s=t.planeStats[t.selectedPlane].MAX_MACHINEGUN_HEAT,h=i.find(".heat-bar"),n=h.find("span"),a=h.find(".current"),o=t.plane.overheat?"OVERHEAT":"MACHINEGUN HEAT",r=h.width()/s,c=this.maxHue/s,g=this.maxHue-c*e;a.css({backgroundColor:"hsl("+g+", 70%, 50%)",width:e*r}),n.html(o)},this.drawLoadedBombs=function(){var e=t.plane.loadedBombs,s=t.plane.stats.MAX_BOMBS,h=i.find(".loaded-bombs");h.empty();for(var n=0;s>n;n++){var a=$("<img>",{src:"img/hud/bomb_icon.png","class":e>=n+1?"loaded":""});h.append(a)}}}function ImageRepository(t,i){function e(t){_.forOwn(t,function(t,i){"string"==typeof t?h.totalImages++:e(t)})}function s(t){_.forOwn(t,function(e,n){"string"==typeof e?(t[n]=new Image,t[n].src=e,t[n].onload=function(){h.loadedImages++,h.loadedImages===h.totalImages&&i()}):s(e)})}var h=this;this.images=t,this.loadedImages=0,this.totalImages=0,e(this.images),s(this.images)}function Keyboard(t){var i=this;t?this.inputs=t:this.inputs={LEFT:{status:!1,keys:[37,65]},RIGHT:{status:!1,keys:[39,68]},UP:{status:!1,keys:[38,87]},DOWN:{status:!1,keys:[40,83]},SHOOT:{status:!1,keys:[32]},BOMB:{status:!1,keys:[16]}},this.getInputs=function(){var t={};return _.forOwn(i.inputs,function(i,e){t[e]=i.status}),t},this.listen=function(){$("body").keydown(function(t){_.forOwn(i.inputs,function(i,e){_.includes(i.keys,t.which)&&(i.status=!0)})}),$("body").keyup(function(t){_.forOwn(i.inputs,function(i,e){_.includes(i.keys,t.which)&&(i.status=!1)})})}}function Menu(){var t=this;this.selectedPlane=null,this.selectedLevel=null,this.showMenu=function(i){$(".uil-ring-css").fadeOut(300,function(){$("#main-menu").fadeIn(300)}),$("#main-menu .plane").click(function(){t.selectedPlane=$(this).attr("data-plane"),$("#main-menu .select-plane").fadeOut(100,function(){$("#main-menu .select-level").fadeIn(100)})}),$("#main-menu .level").click(function(){t.selectedLevel=$(this).attr("data-level"),$("#main-menu").fadeOut(300,function(){$(".canvas").fadeIn(300)}),i(t.selectedPlane,t.selectedLevel)})}}function Sprite(t,i,e){this.images=t,this.delay=i,this.loop=e,this.index=0,this.frames=0,this.currentImage=this.images[this.index],this.move=function(){return this.loop||this.index!==this.images.length-1?(this.frames++,this.frames>this.delay&&(this.index++,_.isUndefined(this.images[this.index])&&(this.index=0),this.currentImage=this.images[this.index],this.frames=0),this.currentImage):(this.currentImage=null,this.currentImage)}}function BomberBomb(t,i,e,s,h){this.context=t.contexts.projectiles.context,this.canvas=t.contexts.projectiles.canvas,this.bombImages=t.images.PROJECTILES.BOMBER_BOMB,this.explosionImages=t.images.EXPLOSION,this.dx=s,this.x=i,this.dy=h,this.y=e,this.explosionRadius=t.enemyStats.B17.BOMB_EXPLOSION_RADIUS,this.sprite=new Sprite(this.bombImages,10,!0),this.currentImage,this.active=!0,this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.explode=function(i){this.active=!1;var e=this.x-this.explosionImages[0].width/3,s=this.y-this.explosionImages[0].height/2;t.explosions.push(new Explosion(t,e,s,-2,0,i)),i&&t.bombHoles.push(new BombHole(t,e,s))},this.updateSprite=function(){this.currentImage=this.sprite.move()},this.getHitbox=function(){return{x:this.x,y:this.y,width:this.currentImage.width,height:this.currentImage.height,offset:t.background.offset}},this.getExplosionHitbox=function(){var t=this.getHitbox();return t.x=t.x-this.explosionRadius,t.width=t.width+this.explosionRadius,t}}function Bomber(t,i,e){this.context=t.contexts.enemies.context,this.canvas=t.contexts.enemies.canvas,this.images=t.images.ENEMIES.B17,this.stats=t.enemyStats.B17,this.health=this.stats.HEALTH,this.damaged=!1,this.disabled=!1,this.crashed=!1,this.active=!0,this.dx=-3,this.x=i,this.dy=0,this.y=e,this.angle=0,this.bombing=!1,this.bombCarpetSize=this.stats.BOMB_CARPET_SIZE,this.bombDelay=this.stats.BOMB_DELAY,this.carpetCooldown=this.stats.BOMB_CARPET_COOLDOWN,this.delayTimer=0,this.carpetTimer=0,this.droppedBombs=0,this.bombs=[],this.sprite=new Sprite(this.images.SPRITE.DEFAULT,2,!0),this.currentImage=this.images.SPRITE.DEFAULT[0],this.draw=function(){this.health<=0&&this.crashed===!1&&this.disabled===!1&&this.disable(),this.damaged===!1&&this.health<this.stats.HEALTH/2&&(this.damaged=!0,this.sprite=new Sprite(this.images.SPRITE.DAMAGED,2,!0)),this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.disabled===!1?this.avoidFighters():this.freeFall(),this.updateBombsStatus(),this.dropBombs(),this.drawBomber(),this.drawBombs()},this.disable=function(){this.disabled=!0,this.health=0},this.freeFall=function(){this.dy<3&&(this.dy=this.dy+.05)},this.crash=function(){this.y=this.canvas.height-this.currentImage.height-t.background.groundHeight,this.dy=0,this.dx=-2,this.disabled=!0,this.crashed=!0},this.drawBomber=function(){this.dy>0?this.angle=-1*this.dy:this.dy<0?this.angle=-1*this.dy:this.angle=0,this.context.save(),this.context.translate(this.x+this.currentImage.width/2,this.y+t.background.offset+this.currentImage.height/2),this.context.rotate(this.angle*Math.PI/180),this.context.drawImage(this.currentImage,-(this.currentImage.width/2),-(this.currentImage.height/2)),this.context.restore()},this.drawBombs=function(){this.bombs=_.filter(this.bombs,function(t){return t.active?(t.draw(),!0):!1})},this.updateSprite=function(){this.crashed===!0?this.currentImage=this.images.CRASHED:this.currentImage=this.sprite.move()},this.getHitbox=function(){var i={x:this.x,y:this.y+this.currentImage.height/2,width:this.currentImage.width,height:this.currentImage.height/2,offset:t.background.offset},e={x:this.x+270,y:this.y,width:55,height:this.currentImage.height/2,offset:t.background.offset};return[i,e]},this.avoidFighters=function(){var i=this.x-t.plane.x+t.plane.currentImage.width,e=this.y+t.background.offset+this.currentImage.height-t.plane.y;i>0&&i<this.canvas.width-300&&e>-100?this.dy=-1:this.dy=0},this.updateBombsStatus=function(){this.bombing===!0&&(this.delayTimer++,this.delayTimer>this.bombDelay&&(this.bombing=!1,this.delayTimer=0)),this.droppedBombs===this.bombCarpetSize&&(this.carpetTimer++,this.carpetTimer>this.carpetCooldown&&(this.droppedBombs=0,this.carpetTimer=0))},this.dropBombs=function(){if(this.x<this.canvas.width&&this.disabled===!1&&this.bombing===!1&&this.droppedBombs<this.bombCarpetSize){var i=this.x+this.currentImage.width/1.5,e=this.y+this.currentImage.height-25,s=this.dx+1,h=2;this.bombing=!0,this.droppedBombs++,this.bombs.push(new BomberBomb(t,i,e,s,h))}}}function Sherman(t,i,e){this.context=t.contexts.enemies.context,this.canvas=t.contexts.enemies.canvas,this.images=t.images.ENEMIES.SHERMAN,this.stats=t.enemyStats.SHERMAN,this.health=this.stats.HEALTH,this.destroyed=!1,this.active=!0,this.dx=-2.8,this.x=i,this.dy=0,this.y=e,this.sprite=new Sprite(this.images.SPRITE,2,!0),this.currentImage=this.images.SPRITE[0],this.draw=function(){this.updateSprite(),this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.drawImage(this.currentImage,this.x,this.y+t.background.offset)},this.updateSprite=function(){this.destroyed===!0?this.currentImage=this.images.DESTROYED:this.currentImage=this.sprite.move()},this.destroy=function(){this.health=0,this.destroyed=!0,this.dx=-2},this.getHitbox=function(){return{x:this.x,y:this.y,width:this.currentImage.width,height:this.currentImage.height,offset:t.background.offset}},this.getHullHitbox=function(){var t=this.currentImage.width/4,i=this.getHitbox();return i.x=i.x+t,i.width=i.width-t,i}}function Raindrop(t,i,e,s,h,n,a){this.context=t.contexts.weather.context,this.canvas=t.contexts.weather.canvas,this.x=i,this.y=e,this.dx=s,this.dy=h,this.width=n,this.height=a,this.color="rgba(174, 194, 224, 0.5)",this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.lineWidth=this.width,this.context.lineCap="round",this.context.strokeStyle=this.color,this.context.beginPath(),this.context.moveTo(this.x,this.y),this.context.lineTo(this.x,this.y+this.height),this.context.stroke()},this.reset=function(){this.x=i,this.y=e,this.dx=s,this.dy=h,this.width=n,this.height=a}}function Snowflake(t,i,e,s,h,n){this.context=t.contexts.weather.context,this.canvas=t.contexts.weather.canvas,this.x=i,this.y=e,this.dx=s,this.dy=h,this.radius=n,this.color="rgba(255, 255, 255, 0.8)",this.draw=function(){this.x=this.x+this.dx,this.y=this.y+this.dy,this.context.fillStyle=this.color,this.context.beginPath(),this.context.arc(this.x,this.y+t.background.offset,this.radius,0,2*Math.PI),this.context.fill()},this.reset=function(){this.x=i,this.y=e,this.dx=s,this.dy=h,this.radius=n}}function Game(t,i,e,s){var h=this;this.images=t,this.planeStats=i,this.enemyStats=e,this.levelsData=s,this.selectedPlane,this.selectedLevel,this.inputs,this.keyboard=new Keyboard,this.collisionsManager=new CollisionsManager(this),this.HUD=new HUD(this,$("#HUD")),this.HARPP=new HARPP(this),this.contexts={background:new Context("background-canvas"),plane:new Context("plane-canvas"),civilians:new Context("civilians-canvas"),enemies:new Context("enemies-canvas"),projectiles:new Context("projectiles-canvas"),weather:new Context("weather-canvas")},this.start=function(t,i){this.selectedPlane=t,this.selectedLevel=i,this.contexts.background.canvas.focus(),this.background=new Background(this),this.plane=new Plane(this),this.bulletImpacts=[],this.explosions=[],this.bombHoles=[],this.weatherEffects=this.HARPP.generateWeather(this.levelsData[i]),this.enemies=this.levelsData[i].ENEMIES.map(function(t){var arguments=[null,h],i=Object.values(t.arguments);return arguments=arguments.concat(i),new(Function.prototype.bind.apply(this[t.objectType],arguments))}),this.civilians=this.levelsData[i].CIVILIANS.map(function(t){var arguments=[null,h],i=Object.values(t.arguments);return arguments=arguments.concat(i),new(Function.prototype.bind.apply(this[t.objectType],arguments))}),this.keyboard.listen(),this.HUD.show(),this.animate()},this.animate=function(){requestAnimFrame(h.animate),h.inputs=h.keyboard.getInputs(),h.collisionsManager.handleCollisions(),h.background.draw(),h.contexts.projectiles.context.clearRect(0,0,h.contexts.projectiles.canvas.width,h.contexts.projectiles.canvas.height),h.plane.draw(),h.contexts.enemies.context.clearRect(0,0,h.contexts.enemies.canvas.width,h.contexts.enemies.canvas.height),h.enemies=_.filter(h.enemies,function(t){return t.active?(t.draw(),!0):!1}),h.contexts.civilians.context.clearRect(0,0,h.contexts.civilians.canvas.width,h.contexts.civilians.canvas.height),h.civilians=_.filter(h.civilians,function(t){return t.active?(t.draw(),!0):!1}),h.bulletImpacts=_.filter(h.bulletImpacts,function(t){return t.active?(t.draw(),!0):!1}),h.explosions=_.filter(h.explosions,function(t){return t.active?(t.draw(),!0):!1}),h.bombHoles=_.filter(h.bombHoles,function(t){return t.active?(t.draw(),!0):!1}),h.contexts.weather.context.clearRect(0,0,h.contexts.weather.canvas.width,h.contexts.weather.canvas.height),h.HARPP.updateWeatherStatus(),h.weatherEffects.forEach(function(t){(h.HARPP.showWeatherEffects||t.y>=0)&&t.draw()}),h.HUD.draw()},window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,i){window.setTimeout(t,1e3/60)}}()}var ENEMY_STATS={B17:{HEALTH:1e3,BOMB_CARPET_SIZE:5,BOMB_DELAY:25,BOMB_CARPET_COOLDOWN:200,BOMB_EXPLOSION_RADIUS:100},SHERMAN:{HEALTH:3e3,DAMAGE:20,MACHINEGUN_DELAY:15,MACHINEGUN_COOLDOWN:150}},GAME_IMAGES={MAIN_MENU:"img/menu/menu.png",PLANES:{BF109:{SPRITE:{DEFAULT:["img/planes/bf109/default/1.png","img/planes/bf109/default/2.png"],DAMAGED:["img/planes/bf109/damaged/1.png","img/planes/bf109/damaged/2.png"]},CRASHED:"img/planes/bf109/crashed.png"},STUKA:{SPRITE:{DEFAULT:["img/planes/stuka/default/1.png","img/planes/stuka/default/2.png"],DAMAGED:["img/planes/stuka/damaged/1.png","img/planes/stuka/damaged/2.png"]},CRASHED:"img/planes/stuka/crashed.png"},KI84:{SPRITE:{DEFAULT:["img/planes/ki84/default/1.png","img/planes/ki84/default/2.png"],DAMAGED:["img/planes/ki84/damaged/1.png","img/planes/ki84/damaged/2.png"]},CRASHED:"img/planes/ki84/crashed.png"}},LEVELS:{GRASSLAND:"img/levels/grassland.jpg",DESERT:"img/levels/desert.jpg",WINTER:"img/levels/winter.jpg"},PROJECTILES:{BULLET:"img/projectiles/bullet.png",PLANE_BOMB:["img/projectiles/plane-bomb/1.png","img/projectiles/plane-bomb/2.png"],BOMBER_BOMB:["img/projectiles/bomber-bomb/1.png","img/projectiles/bomber-bomb/2.png"]},BULLET_IMPACT:["img/projectiles/bullet-impact/1.png","img/projectiles/bullet-impact/2.png","img/projectiles/bullet-impact/3.png"],EXPLOSION:["img/explosion/1.png","img/explosion/2.png","img/explosion/3.png","img/explosion/4.png","img/explosion/5.png","img/explosion/6.png","img/explosion/7.png","img/explosion/8.png","img/explosion/9.png","img/explosion/10.png","img/explosion/11.png","img/explosion/12.png","img/explosion/13.png","img/explosion/14.png","img/explosion/15.png","img/explosion/16.png","img/explosion/17.png","img/explosion/18.png","img/explosion/19.png","img/explosion/20.png","img/explosion/21.png","img/explosion/22.png","img/explosion/23.png","img/explosion/24.png","img/explosion/25.png","img/explosion/26.png","img/explosion/27.png","img/explosion/28.png","img/explosion/29.png","img/explosion/30.png","img/explosion/31.png","img/explosion/32.png","img/explosion/33.png","img/explosion/34.png","img/explosion/35.png","img/explosion/36.png","img/explosion/37.png"],BOMB_HOLE:"img/bomb_hole.png",ENEMIES:{B17:{SPRITE:{DEFAULT:["img/enemies/b17/default/1.png","img/enemies/b17/default/2.png"],DAMAGED:["img/enemies/b17/damaged/1.png","img/enemies/b17/damaged/2.png"]},CRASHED:"img/enemies/b17/crashed.png"},SHERMAN:{SPRITE:["img/enemies/sherman/1.png","img/enemies/sherman/2.png"],DESTROYED:"img/enemies/sherman/3.png"}},CIVILIANS:[{SPRITE:["img/civilian/green/1.png","img/civilian/green/2.png","img/civilian/green/3.png","img/civilian/green/4.png","img/civilian/green/5.png","img/civilian/green/6.png","img/civilian/green/7.png","img/civilian/green/8.png"],DEAD:"img/civilian/green/9.png"},{SPRITE:["img/civilian/blue/1.png","img/civilian/blue/2.png","img/civilian/blue/3.png","img/civilian/blue/4.png","img/civilian/blue/5.png","img/civilian/blue/6.png","img/civilian/blue/7.png","img/civilian/blue/8.png"],DEAD:"img/civilian/blue/9.png"},{SPRITE:["img/civilian/red/1.png","img/civilian/red/2.png","img/civilian/red/4.png","img/civilian/red/5.png","img/civilian/red/6.png","img/civilian/red/7.png","img/civilian/red/8.png"],DEAD:"img/civilian/red/9.png"}],HUD:{BOMB_ICON:"img/hud/bomb_icon.png"}},LEVELS_DATA={GRASSLAND:{WEATHER:{TYPE:"rain",INTERVAL:4096},GROUND_HEIGHT:40,CIVILIANS:[{objectType:"Civilian",arguments:{x:1300,y:550}},{objectType:"Civilian",arguments:{x:1350,y:550}},{objectType:"Civilian",arguments:{x:1410,y:550}},{objectType:"Civilian",arguments:{x:1510,y:550}},{objectType:"Civilian",arguments:{x:1540,y:550}},{objectType:"Civilian",arguments:{x:1590,y:550}}],ENEMIES:[{objectType:"Bomber",arguments:{x:1100,y:0}},{objectType:"Bomber",arguments:{x:1800,y:100}},{objectType:"Bomber",arguments:{x:2500,y:150}},{objectType:"Sherman",arguments:{x:1100,y:540}},{objectType:"Sherman",arguments:{x:1700,y:540}}]},DESERT:{WEATHER:{TYPE:"normal"},GROUND_HEIGHT:40,CIVILIANS:[],ENEMIES:[{objectType:"Bomber",arguments:{x:700,y:300}},{objectType:"Bomber",arguments:{x:1200,y:400}}]},WINTER:{WEATHER:{TYPE:"snow"},GROUND_HEIGHT:40,CIVILIANS:[],ENEMIES:[{objectType:"Bomber",arguments:{x:700,y:300}},{objectType:"Bomber",arguments:{x:1200,y:400}}]}},PLANE_STATS={BF109:{DAMAGE:60,HEALTH:120,MAX_SPEED:3,CLIMB_SPEED:7,DESCEND_SPEED:7,MACHINEGUN_HEATING:2,MAX_MACHINEGUN_HEAT:100,BOMB_COOLDOWN:200,BOMB_DELAY:20,MAX_BOMBS:2,BOMB_EXPLOSION_RADIUS:50},STUKA:{DAMAGE:90,HEALTH:200,MAX_SPEED:2,CLIMB_SPEED:5,DESCEND_SPEED:15,MACHINEGUN_HEATING:3,MAX_MACHINEGUN_HEAT:250,BOMB_COOLDOWN:100,BOMB_DELAY:10,MAX_BOMBS:4,BOMB_EXPLOSION_RADIUS:70},KI84:{DAMAGE:120,HEALTH:80,MAX_SPEED:4,CLIMB_SPEED:15,DESCEND_SPEED:5,MACHINEGUN_HEATING:2,MAX_MACHINEGUN_HEAT:80,BOMB_COOLDOWN:250,BOMB_DELAY:20,MAX_BOMBS:1,BOMB_EXPLOSION_RADIUS:60}},Utils=new function(){function t(t){return t.left=t.x,t.top=t.y+t.offset,t.right=t.left+t.width,t.bottom=t.top+t.height,t}var i=this;this.intersect=function(i,e){var s=!1;i=t(i),e=t(e);var h=Math.max(0,Math.min(i.right,e.right)-Math.max(i.left,e.left)),n=Math.max(0,Math.min(i.bottom,e.bottom)-Math.max(i.top,e.top));return 0!==h&&0!==n&&(s=!0),s},this.collidesWith=function(t,e){var s=!1;return t.constructor!==Array&&(t=[t]),e.constructor!==Array&&(e=[e]),t.forEach(function(t){e.forEach(function(e){i.intersect(t,e)&&(s=!0)})}),s}},CONSTANTS={GAME_STATE:{MAIN_MENU:0,PLAYING:1,GAME_OVER:2,PAUSED:3}},IMAGE_REPOSITORY=new ImageRepository(GAME_IMAGES,function(){var t=new Menu;
t.showMenu(function(t,i){var e=new Game(IMAGE_REPOSITORY.images,PLANE_STATS,ENEMY_STATS,LEVELS_DATA);e.start(t,i)})});