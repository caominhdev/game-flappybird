class Bird {
  constructor() {
    this.width = 34;
    this.height = 24;
    this.x = boardWidth / 8;
    this.y = boardHeight / 2;
    this.img = new Image();
    this.img.src = "./flappybird.png";
  }

  draw(context) {
    velocityY += gravity;
    this.y = Math.max(this.y + velocityY, 0);
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // Move the bird
  moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
      velocityY = -6;
    }
  }
}

class Pipe {
  constructor(x, y, imgSrc) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 512;
    this.img = new Image();
    this.img.src = imgSrc;
    this.passed = false;
  }

  // Draw the pipe
  draw(context) {
    this.x += velocityX;
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

let boardWidth = 360;
let boardHeight = 640;
let velocityX = -2;
let velocityY = 0;
let gravity = 0.3;
let gameOver = false;
let bird = new Bird();
let pipeArr = [];
let score = 0;
let count = 3;

// Start the game
window.onload = function () {
  // Countdown
  let countdown = setInterval(() => {
    let board = document.getElementById("board");
    let context = board.getContext("2d");
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "black";
    context.font = "100px Fira Code sans-serif";
    context.fillText(count, board.width / 2 - 20, board.height / 2);
    count--;
    if (count < 0) {
      clearInterval(countdown);
    }
  }, 1000);

  // Get the board
  let board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;

  requestAnimationFrame(update);

  // Place the pipes
  setInterval(placePipes, 2000);

  // Move the bird
  document.addEventListener("keydown", bird.moveBird);
};

function update() {
  requestAnimationFrame(update);

  // Clear the board
  if (gameOver) {
    return;
  }

  // Draw the bird
  let context = board.getContext("2d");

  // Clear the board
  context.clearRect(0, 0, board.width, board.height);

  // Draw the bird
  bird.draw(context);

  // Check if the bird is out of bounds
  if (bird.y >= board.height) {
    gameOver = true;
  }

  // Draw the pipes
  for (let pipe of pipeArr) {
    pipe.draw(context);

    // Check if the pipe is out of bounds
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score += 0.5; // Increment the score by 0.5 for each pipe passed through successfully
      pipe.passed = true;
    }

    // Check for collision
    if (checkCollision(bird, pipe)) {
      gameOver = true;
    }
  }
  // clear the pipes that are out of bounds
  pipeArr = pipeArr.filter((pipe) => pipe.x + pipe.width > 0);

  // Draw the score
  context.fillStyle = "black";
  context.font = "24px Fira Code sans-serif";
  context.fillText("Score: " + score, 10, 30);

  // Draw the game over message
  if (gameOver) {
    context.fillStyle = "black";
    context.font = "48px Fira Code sans-serif";

    // Display the game over message
    context.fillText("Game Over", board.width / 2 - 100, board.height / 2);
    // Reload the game
    setTimeout(() => {
      location.reload();
    }, 3000); // Reload the game after 3 seconds
  }
}

// Place pipes
function placePipes() {
  let pipeY = 0;
  let pipeHeight = 512;

  // Randomize the pipe height
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

  // Opening space between the pipes
  let openingSpace = board.height / 4;

  // Create the top and bottom pipes
  let topPipe = new Pipe(boardWidth, randomPipeY, "./toppipe.png");
  pipeArr.push(topPipe);

  // Create the bottom pipe
  let bottomPipe = new Pipe(
    boardWidth,
    randomPipeY + pipeHeight + openingSpace,
    "./bottompipe.png"
  );

  // Add the bottom pipe to the pipe array
  pipeArr.push(bottomPipe);
}

// Check for collision
function checkCollision(bird, pipe) {
  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    bird.y < pipe.y + pipe.height &&
    bird.y + bird.height > pipe.y
  );
}
