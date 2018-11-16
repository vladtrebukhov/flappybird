// load canvas and images
const canvas = document.getElementById('flappy');
const context = canvas.getContext('2d');

// load images
let background = new Image();
let backgroundnight = new Image();
let foreground = new Image();
let pipeNorth = new Image();
let pipeSouth = new Image();
let bird = new Image();

// score numbers
let zero = new Image();
let one = new Image();
let two = new Image();
let three = new Image();
let four = new Image();
let five = new Image();
let six = new Image();
let seven = new Image();
let eight = new Image();
let nine = new Image();

zero.src = './images/scores/0.png';
one.src = './images/scores/1.png';
two.src = './images/scores/2.png';
three.src = './images/scores/3.png';
four.src = './images/scores/4.png';
five.src = './images/scores/5.png';
six.src = './images/scores/6.png';
seven.src = './images/scores/7.png';
eight.src = './images/scores/8.png';
nine.src = './images/scores/9.png';

background.src = 'images/bg.png';
backgroundnight.src = 'images/bg-night.png';
foreground.src = 'images/fg.png';
pipeNorth.src = 'images/pipeNorth.png';
pipeSouth.src = 'images/pipeSouth.png';
bird.src = 'images/upflap.png';

// load audio
let flySound = new Audio('sounds/fly.mp3');
let scoreSound = new Audio('sounds/score.mp3');
let theme = new Audio('./sounds/theme.mp3');
theme.loop = true;

// define variables
let numbers = [zero, one, two, three, four, five, six, seven, eight, nine];

let score = 0;
let index = 0;
let pipe = [];

pipe[0] = {
  x: canvas.width,
  y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
};

let gapConstant = 85;
let gravity = 1.5;
let birdX = 20;
let birdY = 150;

// on key down
let flyUp = () => {
  bird.src = 'images/downflap.png';
  birdY = birdY - 25;
  flySound.currentTime = 0;
  flySound.play();
};

const resetCanvas = () => {
  index = 0;
  score = 0;
  pipe = [];
  pipe[0] = {
    x: canvas.width,
    y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
  };
  gapConstant = 85;
  gravity = 1.5;
  birdX = 20;
  birdY = 150;
  background.src = './images/bg.png';
};

// for animating the bird
const eventListeners = () => {
  document.addEventListener('keydown', flyUp);
  document.addEventListener('keyup', function () {
    bird.src = 'images/upflap.png';
  });
  document.addEventListener('mousedown', flyUp);
  document.addEventListener('mouseup', function () {
    bird.src = 'images/upflap.png';
  });
};

//* * still need to fix score > 9 NOT FINISHED */
const countScore = () => {
  context.drawImage(numbers[index], 130, 450);

  for (let i = 0; i <= numbers.length; i++) {
    if (score === numbers.indexOf(numbers[i])) {
      context.drawImage(numbers[i], 155, 450);
      if (score > 9) {
        score = 0;
        countScore();
      }
    }
  }
};

// draw function
let draw = () => {
  let gap = pipeNorth.height + gapConstant; // pipe South starts after pipe north plus gap
  context.save();
  context.drawImage(background, 0, 0); // drawImage(imageName, x, y)

  for (let i = 0; i < pipe.length; i++) {
    context.drawImage(pipeNorth, pipe[i].x, pipe[i].y);

    context.drawImage(pipeSouth, pipe[i].x, pipe[i].y + gap);

    context.drawImage(foreground, 0, canvas.height - foreground.height);
    pipe[i].x--;

    if (pipe[i].x === canvas.width - 188) {
      // add new set of pipes to array pipe at X and Y once pipes get to about middle of canvas
      pipe.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
      });
    }

    if (pipe[i].x === birdX + bird.width - 30) {
      // increase score once bird and pipes intersect
      score++;
      console.log(pipe.length);
      if (score > 9) {
        score = 0;
        index++;
      }
      scoreSound.play();
    }

    // collision detection
    if (
      (birdX + bird.width >= pipe[i].x &&
        birdX <= pipe[i].x + pipeNorth.width &&
        (birdY <= pipe[i].y + pipeNorth.height ||
          birdY + bird.height >= pipe[i].y + gap)) ||
      birdY + bird.height >= canvas.height - foreground.height
    ) {
      resetCanvas();
    }
  }

  countScore();

  // change background from day/night

  if ((pipe.length - 1) % 5 === 0) {
    background.src = './images/bg-night.png';
  }
  if ((pipe.length - 1) % 7 === 0) {
    background.src = './images/bg.png';
  }

  context.drawImage(bird, birdX, birdY);

  birdY += gravity; // y increases by value of gravity each frame to make bird drop

  window.requestAnimationFrame(draw);
  context.restore();
};

eventListeners();

window.onload = function () {
  draw();
  theme.play();
};
