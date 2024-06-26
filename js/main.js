class Snake {
    constructor() {
        this.width = 9.5;
        this.height = 13.5;
        this.positionX = 35 - this.width / 2;
        this.positionY = 30 - this.height / 2;
        this.snakeElm = document.getElementById("snake");
        this.snakeElm.style.width = this.width + "vw";
        this.snakeElm.style.height = this.height + "vh";
        this.snakeElm.style.left = this.positionX + "vw";
        this.snakeElm.style.bottom = this.positionY + "vh";
        this.direction = "right"; 
        this.speed = 2; 
        this.collisionScore = 0;
        this.collisionSound = new Audio("./sound/gulp.mp3");
        this.eatSound = new Audio("./sound/eat.mp3");
        this.directionSound = new Audio("./sound/direction.mp3");
        this.gameOver = false;
        this.originalWidth = 10; // Store the original width
        //this.scoreToIncreaseLength = 500; // Score threshold to increase length
        //this.lengthMultiplier = 1; // Multiplier for length increase
        this.scoreDisplay = document.getElementById("currentScore");
        this.originalSpeed = 2; // Store the original speed
        this.scoreToIncreaseSpeed = 500; // Score threshold to increase speed
        this.speedIncrement = 0.5; // Speed increment
        this.fixedRatio = 16 / 9;
        this.adjustedSpeed = this.originalSpeed * this.fixedRatio;
    }

    move() {
        switch (this.direction) {
            case "left":
                if (this.positionX > 0) {
                    this.positionX -= this.speed;
                    this.snakeElm.style.left = this.positionX + "vw";
                    this.playDirectionSound();
                }
                break;
            case "right":
                if (this.positionX < 100 - this.width) {
                    this.positionX += this.speed;
                    this.snakeElm.style.left = this.positionX + "vw";
                    this.playDirectionSound();
                }
                break;
            case "up":
                if (this.positionY < 100 - this.height) {
                    this.positionY += this.speed;
                    this.snakeElm.style.bottom = this.positionY + "vh";
                    this.playDirectionSound();
                }
                break;
            case "down":
                if (this.positionY > 0) {
                    this.positionY -= this.speed;
                    this.snakeElm.style.bottom = this.positionY + "vh";
                    this.playDirectionSound();
                }
                break;
        }
    }


    checkBoundary() {
        if (this.positionX < 0 || this.positionX > 100 - this.width ||
            this.positionY < 0 || this.positionY > 100 - this.height) {
            this.gameOver = true;
            this.stopMoving();
            console.log("Collision detected! Playing collision sound...");
            this.collisionSound.play();
            document.getElementById('finalScore').innerText = 'Your Score: ' + this.collisionScore;
            document.getElementById('gameOverScreen').style.display = 'flex';

        }
    }


    startMoving() {
        this.intervalId = setInterval(() => {
            this.move();
            this.checkBoundary();
        }, 100); 
    }

    stopMoving() {
        clearInterval(this.intervalId);
    }

    playEatSound() {
        this.eatSound.play();
    }

    playDirectionSound() {
        // Play the direction sound
        this.directionSound.play();
    }

   /* updateLength() {
        const increaseFactor = Math.floor(this.collisionScore / this.scoreToIncreaseLength);
        // Calculate the new width based on original width and multiplier
        const newWidth = this.originalWidth * Math.pow(this.lengthMultiplier, increaseFactor);
        // Set the new width
        this.snakeElm.style.width = newWidth + "vw";
        // Update the position to keep the snake centered
        this.positionX += (this.width - newWidth) / 2;
        this.width = newWidth;
        // Update the position of the snake element
        this.snakeElm.style.left = this.positionX + "vw";
    }*/

    updateScoreDisplay() {
        this.scoreDisplay.textContent = this.collisionScore;
    }

    updateSpeed() {
        const increaseFactor = Math.floor(this.collisionScore / this.scoreToIncreaseSpeed);
        const newSpeed = this.originalSpeed + increaseFactor * this.speedIncrement;
        this.speed = newSpeed;
        console.log("New speed:", this.speed);
    }

}

class Food {
    constructor(){
        this.width = 6;
        this.height = 10;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1)); // random number between 0 and (100-width)
        this.positionY = Math.floor(Math.random() * (90 - this.height + 1)); // random number between 0 and (90-height)
        this.foodElm = null;

        this.createDomElement();
        console.log("Food created at X:", this.positionX, "Y:", this.positionY); 
    }
    createDomElement(){
        // step1: create the element
        this.foodElm = document.createElement("div");

        // step2: add content or modify (ex. innerHTML, innerText, setAttribute...)
        this.foodElm.className = "food";
        this.foodElm.style.width = this.width + "vw";
        this.foodElm.style.height = this.height + "vh";
        this.foodElm.style.left = this.positionX + "vw";
        this.foodElm.style.bottom = this.positionY + "vh";

        //step3: append to the dom: `parentElm.appendChild()`
        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.foodElm);
    }

}


const snake = new Snake();
snake.startMoving(); 

let food = new Food(); 

// Update game
setInterval(() => {
    console.log("Inside setInterval");
    // Detect collision
    if (food && (
        snake.positionX < food.positionX + food.width &&
        snake.positionX + snake.width > food.positionX &&
        snake.positionY < food.positionY + food.height &&
        snake.positionY + snake.height > food.positionY
    )) {
        console.log("Snake ate the food!");
        snake.collisionScore += 100; // Increase collision score by 100
        console.log("Collision score:", snake.collisionScore);
        //snake.updateLength();     
        snake.updateSpeed();
        snake.playEatSound(); // Play eat sound
        // Remove the existing food
        const parentElm = document.getElementById("board");
        parentElm.removeChild(food.foodElm);

        // Reset food to null
        food = null;
        
        // Generate a new food
        food = new Food();
        snake.updateScoreDisplay();
    }
}, 30);


document.addEventListener("keydown", (e) => {
    if (!snake.gameOver) { 
        switch (e.code) {
            case "ArrowLeft":
                snake.direction = "left";
                break;
            case "ArrowRight":
                snake.direction = "right";
                break;
            case "ArrowUp":
                snake.direction = "up";
                break;
            case "ArrowDown":
                snake.direction = "down";
                break;
        }
    }
});

function restartGame() {
    // Reset snake position, direction, etc.
    snake.positionX = 35;
    snake.positionY = 30;
    snake.direction = 'right';
    snake.collisionScore = 0;
    snake.gameOver = false;
    snake.startMoving(); // Restart snake movement

    // Remove food and create new food
    if (food) {
        const parentElm = document.getElementById('board');
        parentElm.removeChild(food.foodElm);
        food = new Food();
    }

    // Hide game over
    document.getElementById('gameOverScreen').style.display = 'none';
}