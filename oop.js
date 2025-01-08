let winds = []; // Empty array
let walls = []; // Empty array
let barrels = []; // Array to hold Barrel objects
let fires = []; // empty array
let port;
const BAUDRATE = 115200; // BAUDRATE of 115200 to read serial port
let sensorValue = 0; // Global variable with serial port
let timer = 3; // timer or countdown voordat de game start
var gameState; //scene van de game
let score = 0; // globaal score van je game

// De preload functie wordt gebruikt om afbeeldingen en geluiden te laden
function preload() {
  // Laadt hier eventuele geluiden en afbeeldingen
  wallhit = loadSound('sound/explosion-91872.mp3');
  fireballsound = loadSound('sound/fireball-whoosh-1-179125.mp3');
  deathsound = loadSound('sound/orchestra-hit-240475.mp3');
  jumpsound = loadSound('sound/retro-jump-3-236683.mp3');
}
var playerX = 0;
var playerY = 450;

// Variabelen voor springen
let isJumping = false; // Controleert of de speler springt
let jumpSpeed = -15; // Sprongsnelheid omhoog
let gravity = 0.8; // Zwaartekracht (soepeler dan voorheen)
let velocity = 0; // Snelheid in de Y-richting

function setup() {
  createCanvas(600, 540);

  gameState = 0;

  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUDRATE);
  } else {
    let button = createButton("Connect to Controller");
    button.mousePressed(() => {
      port.open(BAUDRATE);
    });
  }

  for (let i = 0; i < 100; i++) {
    winds[i] = new Wind(random(width), random(height));
  }

  for (let i = 0; i < 1; i++) {
    walls[i] = new Wall(5700, 0);
  }

  for (let i = 0; i < 1; i++) {
    barrels[i] = new Barrel(6700, 505);
  }

  for (let i = 0; i < fires.length; i++) {
    fires[i] = new Fire(x, y, r);
  }
}

function draw() {
  background(90);

  if (port.available() > 0) {
    let data = port.readUntil("\n");
    if (data !== null) {
      sensorValue = Number(data);
    }
  }

  if (gameState == 0) {
    textSize(35);
    fill("white");
    text("WIZARD RUNNER!\nPress THE LEFT BUTTON to Start!", 0, 250);

    for (let i = 0; i < walls.length; i++) {
      walls[i].reset(); // Reset walls to their original positions
    }
    for (let i = 0; i < barrels.length; i++) {
      barrels[i].reset(); // Reset barrels to their original positions
    }

    if (sensorValue === 2) {
      gameState = 5;
    }
  } else if (gameState == 5) {
    textSize(25);
    fill("white");
    text(
      "Push the left button to play.\n\n-Press RIGHT button to shoot a fireball\n-Make shadow to jump\n-Press THE LEFT button to Pauze IN the Game\n\n\n\n",
      0,
      50
    );

    if (sensorValue === 2) {
      gameState = 1;
    }
  } else if (gameState == 2) {
    textSize(20);
    fill("white");
    text(
      "make shadow TO CONTINUE\npress the left button TO GET CONTROLLER INSTRUCTIONS  ",
      0,
      250
    );
    fill("white");
    text("score:" + score, 30, 30);

    if (sensorValue === 2) {
      gameState = 4;
    }

    if (sensorValue === 1) {
      gameState = 1;
    }
  } else if (gameState == 4) {
    textSize(18);
    fill("white");
    text(
      "Create a shadow on your light sensor to jump over the barrels.\nPress the RIGHT BUTTON on your controller to shoot a fireball at the walls",
      0,
      150
    );
    text(
      "PRESS THE LEFT BUTTON TO RETURN TO PAUZE SCREEN\nMAKE SHADOW TO PLAY GAME",
      0,
      225
    );

    if (sensorValue === 1) {
      gameState = 1;
    }

    if (sensorValue === 2) {
      gameState = 2;
    }
  } else if (gameState == 1) {
    if (sensorValue === 1 && !isJumping) {
      isJumping = true;
      velocity = jumpSpeed;
      jumpsound.play();
    }
    }

    if (sensorValue === 0) {
      let r = 20;
      let f = new Fire(playerX + 25, playerY - 25, r);
      fires.push(f);
      fireballsound.play();
    }

    fill("white");
    for (let i = 0; i < winds.length; i++) {
      winds[i].body();
      winds[i].move();
    }

    fill("red");
    for (let i = 0; i < walls.length; i++) {
      walls[i].body();
      walls[i].move();

      // Fireball collision with walls
      for (let j = 0; j < fires.length; j++) {
        let wallLeft = walls[i].x;
        let wallRight = walls[i].x + 20; // Wall width
        let wallTop = walls[i].y;
        let wallBottom = walls[i].y + 600; // Wall height

        let fireLeft = fires[j].x - fires[j].r; // Fireball left edge
        let fireRight = fires[j].x + fires[j].r; // Fireball right edge
        let fireTop = fires[j].y - fires[j].r; // Fireball top edge
        let fireBottom = fires[j].y + fires[j].r; // Fireball bottom edge

        // Check for collision between the fireball and the wall
        if (
          fireRight > wallLeft &&
          fireLeft < wallRight &&
          fireBottom > wallTop &&
          fireTop < wallBottom
        ) {
          walls[i].reset(); // Reset wall when hit by fireball
          fires.splice(j, 1); // Remove fireball after collision
          wallhit.play();
          break;
        } else {
          wallhit.stop();
        }
      }

      // Player collision with walls
      if (
        playerX < walls[i].x + 20 &&
        playerX + 10 > walls[i].x &&
        playerY < walls[i].y + 600 &&
        playerY + 90 > walls[i].y
      ) {
        gameState = 6; // Game over if player hits the wall
      }
    }

    fill("brown");
    for (let i = 0; i < barrels.length; i++) {
      barrels[i].body();
      barrels[i].move();

      if (
        playerX < barrels[i].x + 37.5 &&
        playerX + 10 > barrels[i].x - 37.5 &&
        playerY < barrels[i].y + 37.5 &&
        playerY + 90 > barrels[i].y - 37.5
      ) {
        gameState = 6;
      }
    }

    fill("orange");
    for (let i = 0; i < fires.length; i++) {
      fires[i].move();
      fires[i].show();
    }

    jumpMechanism();

    fill("yellow");
    rect(playerX, playerY, 10, 90);

    fill("black");
    textSize(20);
    text("Score:", 10, 20);
    currentTime = floor(millis());
    text(currentTime, 10, 50);
    score = currentTime + 0;

    if (sensorValue === 2) {
      gameState = 2;
    }

    fill("blue");
    textSize(16);
    text(
      "Press the left button to pauze the game or for controller instructions",
      100,
      18
    );
  } else if (gameState == 6) {
    textSize(50);
    fill("white");
    text("Game Over\nScore:" + score, 0, 225);
    deathsound.play();
  }
}

function jumpMechanism() {
  if (isJumping) {
    playerY += velocity;
    velocity += gravity;

    if (velocity > 10) {
      velocity = 10;
    }

    if (playerY >= 450) {
      playerY = 450;
      isJumping = false;
    }
  }
}
