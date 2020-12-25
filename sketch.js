var db;
var gs;
var borders=[];
var scores=[0,0];
var playerScores;
var tossValue = 0;
var setTeam1=0;
var setTeam2=0;
var displayText1="Use Arrow Keys: Right, Left, Up, Down";
var displayText2="Use Keys: u for up, d for down";
var localT=0;

function preload(){
  redAnimation = loadAnimation("assests/player1a.png","assests/player1b.png");
  yellowAnimation = loadAnimation("assests/player2a.png","assests/player2b.png");
}

function setup(){
   createCanvas(800,500);   //As we want to create a game utilizing the entire size ofr the display device.
   //createCanvas(displayWidth-20,displayHeight-30);

   db = firebase.database();

  gameStateRef = db.ref('gState')
  gameStateRef.on("value",getState,showError);

  //console.log(gs);

  btnReset=createButton("Reset Data");
  btnReset.position(700,485);
  btnReset.mousePressed(resetData);

  redPlayer = createSprite(125,250,15,15);
  redPlayer.shapeColor="red";
  /*redPlayer.addAnimation("redPAnimation",redAnimation);
  redAnimation.frameDelay =2000; 
  redPlayer.scale = 0.5;
  redPlayer.setCollider("circle",0,0,60);
  redPlayer.debug = true;*/

  var redPositionRef = db.ref('playerTeam1');
  var rPos = redPositionRef.on('value',redPosition,showError);

  yellowPlayer = createSprite(375,250,15,15);
  yellowPlayer.shapeColor="yellow";
 /* yellowPlayer.addAnimation("yellowPAnimation",yellowAnimation);
  yellowAnimation.frameDelay =2000;
  yellowPlayer.scale = -0.5;
  yellowPlayer.setCollider("circle",0,0,60);
  yellowPlayer.debug = true;*/

  var yellowPositionRef = db.ref('playerTeam2');
  var yPos = yellowPositionRef.on('value',yellowPosition,showError);

  var playerSetRef = db.ref('playerTeam2');
  var tName = playerSetRef.on('value',yellowPosition,showError);

  getScores();
}

function draw(){
  background(255)
  //text("Game State : "+gs,500,100);
  if (gs === 0){
    text("press space key to start",185,250)
 
  if (keyCode === 32){
    tossValue = Math.round(random(1,2));
    if(tossValue === 1){
      alert("Red Ride");
      db.ref('playerTeam1/set').update({ 
        set:1
       })	; 
      db.ref('playerTeam2/set').update({ 
        set:0
       })	;
      updateState(tossValue);
   } 

   if (tossValue === 2){
    alert("Yellow Ride");
    db.ref('playerTeam1/set').update({ 
      set:0
     })	; 
    db.ref('playerTeam2/set').update({ 
      set:1
     })	;

      // database.ref('/').update({gameState:2});	
      updateState(tossValue);
   }
  }

  getTeam();
}
  drawLine();
  if (gs === 1 || gs === 2){ 
    noStroke();
    if (gs === 1 ){
      fill("Red");
      text("Red Ride =>",510,30); 
      fill(0);
      text("Red Player\n"+displayText1,510,400);  
      text("Yellow Player\n"+displayText2,510,450); 
    }
    else if (gs === 2)
    {
      fill("Yellow");
      text("Yellow Ride =>",510,60);
      fill(0);
      text("Red Player\n"+displayText2,510,400);  
      text("Yellow Player\n"+displayText1,510,450);     
    }
        toss(tossValue);
  }

  if (redPlayer.isTouching(yellowPlayer)&& gs !==3){
     if (yellowPlayer.x < 250){
      scores[0] += 5;
      scores[1] -= 5;
     }
     if (redPlayer.x > 250){
      scores[0] -= 5;
      scores[1] += 5;
    }
    gs =3;
    updateState(gs)
  }

  if (redPlayer.isTouching(borders[5])&& gs !==3){
    if (redPlayer.x >=375){
        // update red score by 5 and yellow score by -5
        scores[0] += 5;
        scores[1] -= 5;
        gs = 3;
        updateState(gs)
    }
  }

  if (yellowPlayer.isTouching(borders[6])&& gs !==3){
        // update yellow score and red score by -5
        if (yellowPlayer.x <=125){
        scores[0] -= 5;
        scores[1] += 5;
        gs = 3;
        updateState(gs)
        }
  }

  if (gs === 3){

    updateScores();
    textSize(18);
    text("press r to restart",185,250)
  }

  if (gs === 3 && keyDown("r")){
    resetGame();
  }

  drawSprites();
  getScores();
    fill("black");
    noStroke();
    textSize(18);
    text("Red Team: "+scores[0],600,30)
    text("Yellow Team: "+scores[1],600,60);

}

function getState(data){
  gs = data.val();
}

function updateState(nState){
 console.log("state:"+nState);
  var gStateRef = db.ref('/').update({
    gState:nState
  });

}

function showError(err){
  console.log("Error: "+err);
  }

function resetData(){

  db.ref('playerTeam1').update({
    set:0,    
      x:125,
      y:250
  });

  db.ref('playerTeam2').update({
    set:0,
    x:375,
    y:250
  });
  
  db.ref('/').update({
    gState:0,
    scoreTeam1:0,
    scoreTeam2:0
  });

  //db.ref('/players').remove();
  //player.updateCount(0);
}

function redPosition(data){
  position = data.val();
 // console.log(data);
 // console.log(position.x+"  "+position.y);
  redPlayer.x = position.x;
  redPlayer.y = position.y; 
  tname = position.name
}

function yellowPosition(data){
  position = data.val();
 //console.log(data);
 // console.log(position.x+"  "+position.y);
  yellowPlayer.x = position.x;
  yellowPlayer.y = position.y; 
  tName = position.name;  
}


function drawLine(){

  borders[0] = createSprite(1,250,3,500); 
  borders[0].shapeColor = "black";
//  borders[0].debug = true;
  borders[1] = createSprite(250,1,500,3);
  borders[1].shapeColor = "black";      
//  borders[1].debug = true;
  borders[2] = createSprite(500,250,3,500);
  borders[2].shapeColor = "black";      
//  borders[2].debug = true;      
  borders[3] = createSprite(250,500,500,3);
  borders[3].shapeColor = "black";      
//  borders[3].debug = true;
borders[4] = createSprite(250,250,3,500); // center line
//borders[4].debug = true;

borders[5] = createSprite(375,250,3,500); // right line
//borders[5].shapeColor ="black"
// borders[5].debug = true;

borders[6] = createSprite(125,250,3,500); // left line
//borders[6].debug = true;

for(var i = 0; i <=500;i+=20){
  strokeWeight(3);
  stroke('black');      
  line(250,i,250,i+10)
}
for(var j = 0; j <=500;j+=20){
  strokeWeight(3);
  stroke('red');
  line(375,j,375,j+10)
}
for(var k = 0; k <=500;k+=20){
  strokeWeight(3);      
  stroke('yellow');      
  line(125,k,125,k+10)
}

for(var bor = 0; bor< borders.length;bor++){
 if(bor === 4 || bor === 5 || bor === 6){
  borders[bor].visible = false;
 }
}

}

function toss(varToss){
  console.log("Inside toss");
  if (varToss === 1){
    //alert("RED RIDE");
    if(keyDown('RIGHT_ARROW')){
      redPlayer.x += 5;
       UpdatePosition();}
    if(keyDown('LEFT_ARROW')){
      redPlayer.x -= 5; 
      UpdatePosition();   }
    if(keyDown('UP_ARROW')){
      redPlayer.y -= 5;
      UpdatePosition();}
    if(keyDown('DOWN_ARROW')){
      redPlayer.y += 5;   
      UpdatePosition();   }   
    if (keyDown("u")){
      yellowPlayer.y -= 5;
      UpdatePosition(); 
    }  
    if (keyDown("d")){
      yellowPlayer.y += 5;
      UpdatePosition(); 
    }       
  }
  else
  {
    //alert("YELLOW RIDE");
    if(keyDown('RIGHT_ARROW')){
      yellowPlayer.x += 5
      UpdatePosition();}
    if(keyDown('LEFT_ARROW')){
      yellowPlayer.x -= 5 
      UpdatePosition();   }  
    if(keyDown('UP_ARROW')){
      yellowPlayer.y -= 5;
      UpdatePosition();}
    if(keyDown('DOWN_ARROW')){
      yellowPlayer.y += 5;
      UpdatePosition();  }
    if (keyDown("u")){
      redPlayer.y -= 5; 
        UpdatePosition(); 
      }  
    if (keyDown("d")){
      redPlayer.y += 5;
        UpdatePosition(); 
      } 
  }
}

function getTeam(){
  var teamInfoRef1 = db.ref('playerTeam1/set');
  // setTeam1 to be declare globally
  teamInfoRef1.on("value",getTeam1,showError);

  var teamInfoRef2 = db.ref('playerTeam2/set');
  teamInfoRef2.on("value",getTeam2,showError); // setTeam1 to be declare globally

}

function getTeam1(data){
  setTeam1 = set;
  console.log(setTeam1);

}

function getTeam2(data){
  setTeam2 = set;
  console.log(setTeam2);
}

function getScores(){
  var scoreRef1 = db.ref('scoreTeam1');
  scoreRef1.on("value",(data)=>{
      scores[0] = data.val();  // playerScores to be declare globally
  });
  console.log("scores"+scores[0]);
  var scoreRef2 = db.ref('scoreTeam2');
  scoreRef2.on("value",(data)=>{
      scores[1] = data.val();  // playerScores to be declare globally
  });
  console.log("scores"+scores[1]);
}

function updateScores(){
    db.ref('/').update({
      scoreTeam1:scores[0],
      scoreTeam2:scores[1]
    });
  }

function UpdatePosition(){
 // if (keyCode === 38 || keyCode === 40 || keyCode === 39 || keyCode === 37){
           // call database update
           db.ref('/playerTeam1').update({
            x:redPlayer.x,
            y:redPlayer.y
        });

        db.ref('/playerTeam2').update({
          x:yellowPlayer.x,
          y:yellowPlayer.y
        });
 // }
  
}

function resetGame(){

  db.ref('playerTeam1').update({
      set:0,
      x:125,
      y:250
  });

  db.ref('playerTeam2').update({
    set:0,
    x:375,
    y:250
  });
  
  db.ref('/').update({
    gState:0
  });
}
