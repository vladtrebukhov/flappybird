// load canvas and images
const canvas = document.getElementById('flappy');
const context = canvas.getContext('2d');


// load images
var background = new Image();
var foreground = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var bird = new Image();

background.src = 'images/bg.png';
foreground.src = 'images/fg.png';
pipeNorth.src = 'images/pipeNorth.png';
pipeSouth.src = 'images/pipeSouth.png';
bird.src = 'images/bird.png';

// load audio
var flySound = new Audio('sounds/fly.mp3');
var scoreSound = new Audio('sounds/score.mp3');


// define variables
const pipeWidth = 52;
const foregroundHeight = 118;
var score = 0;
var pipe = [];

pipe[0] = {
  x: canvas.width,
  y: 0

};

var gap = 85;
var constant = pipeNorth.height + gap; // pipe South starts after pipe north plus gap
var gravity = 1.25;
var birdX = 20;
var birdY = 150;

// on key down

var flyUp = () => {
  birdY = birdY - 25;
  flySound.currentTime = 0;
  flySound.play();
}
document.addEventListener('keydown', flyUp);


// draw function
var draw = () => {
  context.save();
  context.drawImage(background, 0, 0); // drawImage(imageName, x, y)

  for (let i = 0; i < pipe.length; i++) {
    context.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    context.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
    context.drawImage(foreground, 0, canvas.height - foreground.height);
    pipe[i].x--;

    if (pipe[i].x === canvas.width - 188) { // add new set of pipes to array pipe at X and Y once pipes get to about middle of canvas
      pipe.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height

      })
    }

    if (pipe[i].x === birdX + bird.width - 30) { // increase score once bird and pipes intersect
      score++
      scoreSound.play();
    }

    // collision detection
    if (birdX + bird.width >= pipe[i].x && birdX <= pipe[i].x + pipeNorth.width &&
    (birdY <= pipe[i].y + pipeNorth.height || birdY + bird.height >= pipe[i].y + constant) ||
  birdY + bird.height >= canvas.height - foreground.height) {
      location.reload()
    }
  }
  // load score text and style
  context.fillStyle = '#000';
  context.font = '25px Arial';
  context.fillText(`Score: ${score}`, 100, 450);



  context.drawImage(bird, birdX, birdY);
  birdY += gravity; // y increases by value of gravity each frame to make bird drop

  window.requestAnimationFrame(draw);
  context.restore();
}

window.onload = draw;
