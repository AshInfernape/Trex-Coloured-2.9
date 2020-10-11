var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImage;
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;

function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  backgroundImage = loadImage("assets/backgroundImg.png")
 // sun_Animation = loadAnimation("assets/sun.png");
  
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
  
  groundImage = loadImage("assets/ground.png");
  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  
  gameOverImage = loadImage("assets/gameOver.png");
  restartImage = loadImage("assets/restart.png");
}

function setup(){
  createCanvas(windowWidth , windowHeight);
  
  sun = createSprite(width-50,100,10,10);
 // sun.addAnimation("sun", sun_Animation);
  sun.scale = 0.1;

  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  trex = createSprite(50,height-70,50,50);
  trex.addAnimation("running" , trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.08;

  restart = createSprite(width/2 , height/2+110 , 20,20);
  restart.addImage(restartImage);
  restart.scale = 0.25;

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw(){
  background(backgroundImage);
  textSize(20);
  fill("black")
  text("Score:"+ score,50,50);

  if(gameState === PLAY){
   score = score + Math.round(getFrameRate()/60);
   ground.velocityX = -(6 +3 *score/100)

   if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
    jumpSound.play( )
    trex.velocityY = -10;
     touches = [];
  }
  trex.velocityY = trex.velocityY + 0.8;
  if(ground.x < 0 ){
    ground.x = ground.width/2.5;
  }

  trex.collide(invisibleGround)
  spawnObstacles();
  spawnClouds();
  if(trex.isTouching(obstaclesGroup)){
    collidedSound.play();
    gameState = END;
  }
  }

  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0)

    trex.changeAnimation("collided" , trex_collided);

    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    if(touches.length > 0 || keyDown("space")){
      reset();
      touches = [];
    }
  }
  drawSprites();
}

function spawnObstacles(){
if(frameCount % 60 === 0){
  var obstacle = createSprite(1400 , height-95 , 20,20);
  obstacle.setCollider("circle" , 0,0,45);

  obstacle.velocityX = -10;

  var rand = Math.round(random(1,2));
  switch(rand){
   case 1 : obstacle.addImage(obstacle1);
   break;
   case 2 : obstacle.addImage(obstacle2);
   break;
   case 3 : obstacle.addImage(obstacle3);
   break;
   case 4 : obstacle.addImage(obstacle4);
   default : break;
  }

  obstacle.scale = 0.3;
  obstacle.lifetime = 300;
  obstacle.depth = trex.depth;
  trex.depth += 1;
  obstaclesGroup.add(obstacle);
}
}

function spawnClouds(){
if(frameCount % 60 === 0){
  var cloud = createSprite(width+20,height-30,40,30);
  cloud.y = Math.round(random(100,220));
  cloud.addImage(cloudImage);
  cloud.velocityX = -12;
  cloud.lifetime = 300;
  cloud.depth = trex.depth;
  trex.depth +=1;
  cloudsGroup.add(cloud);
}
}
function reset(){
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible  = false;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running" , trex_running);

  score = 0;
}