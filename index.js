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
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
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

  draw(context) {
    this.x += velocityX;
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

let boardWidth = 360;
let boardHeight = 640;
let velocityX = -2;
let bird = new Bird();
let pipeArr = [];

window.onload = function () {
  let board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  let context = board.getContext("2d");

  requestAnimationFrame(update);
  setInterval(placePipes, 2000);
};

function update() {
  requestAnimationFrame(update);

  let context = board.getContext("2d");
  context.clearRect(0, 0, board.width, board.height);

  bird.draw(context);

  for (let pipe of pipeArr) {
    pipe.draw(context);
  }
}

function placePipes() {
  let pipeY = 0;
  let pipeHeight = 512;
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = new Pipe(boardWidth, randomPipeY, "./toppipe.png");
  pipeArr.push(topPipe);

  let bottomPipe = new Pipe(
    boardWidth,
    randomPipeY + pipeHeight + openingSpace,
    "./bottompipe.png"
  );
  pipeArr.push(bottomPipe);
}
