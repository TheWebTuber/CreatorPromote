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
}
var playerX = 0;
var playerY = 450;

// Variabelen voor springen
let isJumping = false; // Controleert of de speler springt
let jumpSpeed = -15; // Sprongsnelheid omhoog
let gravity = 0.8; // Zwaartekracht (soepeler dan voorheen)
let velocity = 0; // Snelheid in de Y-richting

class Wind {
  // Wind particles

  constructor(x, y) {
    // Create wind objects at random bec of the wind (random(width), random(height))
    this.x = x;
    this.y = y;
    this.depth = random(50, 150);
    this.vx = this.depth / 100;
  }

  body() {
    noStroke();
    fill(this.depth);
    rect(this.x, this.y, 50, 10); // Draw the rectangle
  }

  move() {
    this.x = this.x - this.vx; // Increment the x position

    if (this.x < -50) {
      // Wrap around if it goes off the canvas
      this.x = 610;
      this.y = random(height); // Assign a new random y position
    }
  }
}
//package list for wind

class Wall {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  body() {
    rect(this.x, this.y, 20, 600); // Draw the rectangle
  }

  move() {
    this.x = this.x - 1 * random(4.5, 10); // Move left

    if (this.x < -50) {
      // Wrap around if it goes off the canvas
      this.x = 610;
    }
  }
}
//package list for wall
class Barrel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  body() {
    circle(this.x, this.y, 75); // Draw the barrel as a circle
  }

  move() {
    // Move left by a random speed between 5 and 15
    this.x = this.x - random(5, 15);

    if (this.x < -80) {
      // Reset to the right edge if it goes off the left
      this.x = 700;
    }
  }
}
//package list for barrel

class Fire {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.move = function () {
      this.x = this.x + 2;
    };

    this.show = function () {
      strokeWeight(1);
      ellipse(this.x, this.y, this.r * 2);
    };
  }
}
//package list for fireball

// De setup functie wordt eenmaal uitgevoerd wanneer het programma start
function setup() {
  createCanvas(600, 540);

  gameState = 0;

  port = createSerial();

  // fetch the list of serial ports that were previously approved
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUDRATE);
  } else {
    // if no ports have been approved yet
    // add a button to open the serial port
    let button = createButton("Connect to Controller");
    button.mousePressed(() => {
      // open the port
      port.open(BAUDRATE); // this will show a popup window asking the user to select a serial port
    });
  }

  for (let i = 0; i < 100; i++) {
    winds[i] = new Wind(random(width), random(height)); // Create wind objects at random positions 7 times
  }

  for (let i = 0; i < 1; i++) {
    walls[i] = new Wall(5700, 0); // Create Wall objects at random positions
  }

  for (let i = 0; i < 1; i++) {
    barrels[i] = new Barrel(6700, 505); // Create Barrel objects at specific positions
  }

  console.log(barrels); //log for barrel objects
  console.log(winds); // Log the array of wind objects
  console.log(walls); // Log the array of Wall objects

  for (let i = 0; i < fires.length; i++) {
    // here to determine the number of the balls
    fires[i] = new Fire(x, y, r);
  }
}

function draw() {
  background(90);

  // Read serial data and update sensorValue
  if (port.available() > 0) {
    let data = port.readUntil("\n");
    if (data !== null) {
      sensorValue = Number(data); // Update global sensorValue
    }
  }

  if (gameState == 0) {
    //startup screen
    textSize(40);
    fill("white");
    text("WIZARD RUNNER!\nPress THE BUTTON to Start!", 0, 250);

    if (sensorValue === 2) {
      gameState = 5;
    }
  } else if (gameState == 5) {
    //keuze voor game controller

    textSize(30);
    fill("white");
    text(
      "Push the button to play controller setting 1.\n\n-Blow to shoot a fireball\n-Make shadow to jump\n-Press button to Pauze the Game\n\n\n\nMake a shadow to play controller setting 2.\n\n-Press button to shoot a fireball\n-Make a shadow to jump\n-Blow to PAUZE the game",
      0,
      50
    );

    if (sensorValue === 2) {
      //knop met game versie 1
      gameState = 3;
    }

    if (sensorValue === 1) {
      //light sensor met game versie 2
      gameState = 6;
    }
  } else if (gameState == 3) {
    // countdown screen
    fill("white");
    textSize(100);
    countdown = text(timer, 250, 270);

    if (frameCount % 60 == 0 && timer > 0) {
      // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer--;
    }
    if (timer == 0) {
      gameState = 1;
    }

    fill("blue");
    textSize(20);
    text(
      "Create a shadow on your light sensor to jump over the barrels.\nBlow on your controller to shoot a fireball at the walls",
      0,
      150
    );
  } else if (gameState == 2) {
    //break screen
    textSize(20);
    fill("white");
    text(
      "make shadow TO CONTINUE\npress button TO GET CONTROLLER INSTRUCTIONS  ",
      0,
      250
    );
    fill("white");
    text("score:" + score, 30, 30);

    if (sensorValue === 2) {
      // knop
      gameState = 4;
    }

    if (sensorValue === 1) {
      // light sensor
      gameState = 1;
    }
  } else if (gameState == 4) {
    // instruction screen
    textSize(20);
    fill("white");
    text(
      "Create a shadow on your light sensor to jump over the barrels.\nBlow on your controller to shoot a fireball at the walls",
      0,
      150
    );
    text(
      "PRESS BUTTON TO RETURN TO PAUZE SCREEN\nMAKE SHADOW TO PLAY GAME",
      0,
      225
    );

    if (sensorValue === 1) {
      // light sensor
      gameState = 1;
    }

    if (sensorValue === 2) {
      // knop
      gameState = 2;
    }
  } else if (gameState == 1) {
    // gaming screen

    score = 0;

    // Trigger jump based on sensor value usb controller via serial port with sensorvalue
    if (sensorValue === 1 && !isJumping) {
      // light sensor shaduw
      isJumping = true;
      velocity = jumpSpeed;
      console.log("Springen gestart! velocity =", velocity);
    }

    if (sensorValue === 0) {
      let r = 20;
      let f = new Fire(playerX + 25, playerY - 25, r);
      fires.push(f);
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
    }

    fill("brown");
    for (let i = 0; i < barrels.length; i++) {
      barrels[i].body();
      barrels[i].move();

      fill("orange");
      for (let i = 0; i < fires.length; i++) {
        fires[i].move();
        fires[i].show();
      }

      // Update jump mechanism
      jumpMechanism();

      fill("yellow");
      rect(playerX, playerY, 10, 90);

      fill("black");
      //get the current time in seconds, floor rounds down
      //draw this in the upper left corner of the screen
      textSize(20);
      text("Score:", 10, 20);
      currentTime = floor(millis());
      text(currentTime, 10, 50);
      score = currentTime + 0;
    }

    if (sensorValue === 2) {
      //KNOP
      gameState = 2;
    }

    fill("blue");
    textSize(16);
    text(
      "Press the button to pauze the game or for controller instructions",
      100,
      18
    );
  } else if (gameState == 6) {
    // countdown screen

    textSize(100);
    countdown = text(timer, 250, 270);

    if (frameCount % 60 == 0 && timer > 0) {
      // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer--;
    }
    if (timer == 0) {
      gameState = 7;
    }

    fill("blue");
    textSize(18);
    text(
      "Create a shadow on your light sensor to jump over the barrels.\nPRESS THE BUTTON on your controller to shoot a fireball at the walls",
      0,
      150
    );
  } else if (gameState == 7) {
    // gaming screen version 2

    score = 0;

    // Trigger jump based on sensor value usb controller via serial port with sensorvalue
    if (sensorValue === 1 && !isJumping) {
      // light sensor shaduw
      isJumping = true;
      velocity = jumpSpeed;
      console.log("Springen gestart! velocity =", velocity);
    }

    if (sensorValue === 2) {
      // knop voor vuurbal
      let r = 20;
      let f = new Fire(playerX + 25, playerY - 25, r);
      fires.push(f);
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
    }

    fill("brown");
    for (let i = 0; i < barrels.length; i++) {
      barrels[i].body();
      barrels[i].move();

      fill("orange");
      for (let i = 0; i < fires.length; i++) {
        fires[i].move();
        fires[i].show();
      }

      // Update jump mechanism
      jumpMechanism();

      fill("yellow");
      rect(playerX, playerY, 10, 90);

      fill("black");
      //get the current time in seconds, floor rounds down
      //draw this in the upper left corner of the screen
      textSize(20);
      text("Score:", 10, 20);
      currentTime = floor(millis());
      text(currentTime, 10, 50);
      score = currentTime + 0;
    }

    if (sensorValue === 0) {
      //KNOP
      gameState = 8;
    }

    fill("blue");
    textSize(16);
    text(
      "Blow on the controller to pauze the game or for controller instructions",
      100,
      18
    );
  } else if (gameState == 8) {
    //break screen
    textSize(18);
    fill("white");
    text(
      "make shadow TO CONTINUE\npress button TO GET CONTROLLER INSTRUCTIONS  ",
      0,
      250
    );
    text("score:" + score, 30, 30);

    if (sensorValue === 2) {
      // knop
      gameState = 9;
    }

    if (sensorValue === 1) {
      // light sensor
      gameState = 7;
    }
  } else if (gameState == 9) {
    // instruction screen version 2
    textSize(18);
    fill("white");
    text(
      "Create a shadow on your light sensor to jump over the barrels.\nPRESS THE BUTTON on your controller to shoot a fireball at the walls",
      0,
      150
    );
    text(
      "PRESS BUTTON TO RETURN TO PAUZE SCREEN\nMAKE SHADOW TO PLAY GAME",
      0,
      225
    );

    if (sensorValue === 1) {
      // light sensor
      gameState = 7;
    }

    if (sensorValue === 2) {
      // knop
      gameState = 8;
    }
  } else if (gameState == 10) {
    // DEATH or game over when collision

    textSize(20);
    fill("white");
    text("Game Over\nScore:" + score + "\npress button to play again", 0, 225);
    if (sensorValue === 2) {
      // knop
      gameState = 0;
    }
  }
}

// Functie voor springmechanisme
function jumpMechanism() {
  if (isJumping) {
    playerY += velocity; // Verander Y-positie
    velocity += gravity; // Voeg zwaartekracht toe

    // Zorg ervoor dat de sprong vloeiender verloopt door de snelheid aan te passen
    if (velocity > 10) {
      // Max snelheid naar beneden
      velocity = 10;
    }

    console.log("Speler springt: playerY =", playerY, "velocity =", velocity);

    // Controleer of de speler op de grond is
    if (playerY >= 450) {
      playerY = 450; // Reset positie
      isJumping = false; // Stop springen
      console.log("Speler landt op de grond.");
    }
  }
}
