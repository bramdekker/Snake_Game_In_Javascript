const GAME_SPEED = 50;
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = 'white';
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'black';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'black';

let snake = [
    {x: 280, y: 240},
    {x: 260, y: 240},
    {x: 240, y: 240},
    {x: 220, y: 240},
    {x: 200, y: 240},
];

let changingDirection = false;
let foodX;
let foodY;
let score = 0;
let dx = 20;
let dy = 0;

var gameCan = document.getElementById("gameCan");
gameCan.height = gameCan.width;
var ctx = gameCan.getContext("2d");
ctx.linewidth = 5;

main();
createFood();
document.addEventListener("keydown", changeDirection)

function main() {
    if (didGameEnd()) {
        drawGameOver();
        return;
    }

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        main();
    }, 
    
    GAME_SPEED)
}

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokestyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCan.width, gameCan.height);
    ctx.strokeRect(0, 0, gameCan.width, gameCan.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    ctx.lineWidth = 3;

    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function drawGameOver() {
    ctx.font = "bold 80px Arial";
    ctx.weight
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("Game over!", gameCan.width/2, gameCan.height/2)
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    const hitLeftWall = head.x < 0;
    const hitRightWall = head.x > gameCan.width - 20;
    const hitToptWall = head.y < 0;
    const hitBottomWall = head.y > gameCan.height - 20;

    if (hitLeftWall) {
        head.x = gameCan.width - 20;
    } else if (hitRightWall) {
        head.x = 0;
    } else if (hitToptWall) {
        head.y = gameCan.height - 20;
    } else if (hitBottomWall) {
        head.y = 0;
    }

    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = "Score: " + score;
        createFood();
    } else {
        snake.pop();
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 20) * 20;
}

function createFood() {
    foodX = randomTen(0, gameCan.width - 10);
    foodY = randomTen(0, gameCan.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if (foodIsOnSnake)
            createFood();
        }
    );
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokestyle = FOOD_BORDER_COLOUR;
    ctx.linewidth = 3;

    ctx.fillRect(foodX, foodY, 20, 20);
    ctx.strokeRect(foodX, foodY, 20, 20);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x &&
        snake[i].y === snake[0].y

        if (didCollide) return true
    }

    return false;
}