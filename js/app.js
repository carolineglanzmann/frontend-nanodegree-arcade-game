 // Enemies our player must avoid
var water = false; // set initial player to the grass point

var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * x + y); // set a random speed value for enemy object
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < 505){
        this.x = this.x + this.speed * dt;
    }

    else {
        this.x = 0;
    }
      
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // initial position set up for player
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.lives = 5;

};

// Reset Game function
var resetGame = function(){
    player.x = 200;
    player.y = 400;

};

// Update the status of player throughout the gameplay
Player.prototype.update = function(dt) {
    this.reachingWater(); 
    this.enemyCollision(); // call the enemy collision
    this.showText(); // show scores and lives text on the screen 

    // when player reaches water (game win)
    if (player.y === 0) {
      this.gameWon();
    }
};

// Show text on screen for user lives and score
Player.prototype.showText = function() {
    ctx.clearRect(0,0,80,200);
    ctx.clearRect(400,0,80,200); 

    ctx.font = " 20px Impact";
    ctx.fillStyle = "orange";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;

    ctx.fillText("Score: " + this.score, 10, 35);
    ctx.strokeText("Score: " + this.score, 10, 35);
    ctx.fillText("Lives: " + this.lives, 420, 35);
    ctx.strokeText("Lives: " + this.lives, 420, 35);

};


// Draw the player on the screen
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Added the function that handles the user input to control the player
Player.prototype.handleInput = function(inputKeys){
    switch(inputKeys) {
        case 'left' :
        if(this.x - 101 < 0) {
            this.x = 0;
        }

        else{
            this.x -= 101;
        }
        break;

        case 'right' :
        if(this.x + 101 >= 404) {
            this.x = 404;
        }

        else{
            this.x += 101;
        }
        break;

        case 'up' :
        if(this.y - 90 < 0) {
            this.y = 0;
            water = true;
        }
        else{
            this.y -= 90;
        }

        break;

        case 'down':
        if(this.y + 90 >= 404){
            this.y = 404;
        }

        else{
            this.y += 90;
        }
        break;
       

    }
};


// Added text feedback when the game is over
// And player lost all his lives
Player.prototype.gameOver = function () {
    
    ctx.fillStyle = 'red';
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.fillText("GAME OVER", 210, 35);
    ctx.strokeText("GAME OVER", 210, 35);

};

// Added user feedback when the game is won
Player.prototype.gameWon = function(){
  
    ctx.fillStyle = 'green';
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.fillText("YOU WON", 210, 35);
    ctx.strokeText("YOU WON", 210, 35);
};

// Set up collision when player interact with ladybug, thus reseting the game
Player.prototype.enemyCollision = function (){
    var ladyBug = checkCollisions(allEnemies);

    if(ladyBug){
        if(this.lives !== 0){
            this.lives--;
            resetGame(); // reset game and lose a life 
        }

        else {
            this.gameOver(); // gameover text appears on screen
        }
        
    }

};

// Added the function that brings player back to grass once reached the water
Player.prototype.reachingWater = function(){
    if(water){
        setTimeout(resetGame, 700);
        water = false; // meaning player back to the grass (original state)
    }
};

// Create a function that returns the enemyArray/ starsArray to check 
// for collisions/collection when the function is called on the 
// Enemy and Star instances respectivelly
var checkCollisions = function(someArray){
    for (var i = 0; i < someArray.length; i++ ){
        if(player.x < someArray[i].x + 50 &&
            player.x + 50 > someArray[i].x &&
            player.y < someArray[i].y + 40 &&
            player.y + 40 > someArray[i].y){
                return someArray[i];
        }
    }
};

// Stars - object for player to collect during game
var Star = function(){   
    this.sprite = 'images/Star.png';
    this.x = Math.floor(Math.random() * (7 - 1) + 1) * 101;
    this.y = Math.floor(Math.random () * ( 3 - 1) + 1) * 80;

};

// Draw the stars on the screen
Star.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Update of Star collection 
Star.prototype.update = function(){
    this.collectStars();

};

// Set up for Collecting Stars/Points 
Star.prototype.collectStars = function(){
    var collectables = checkCollisions(allStars);
    var index = allStars.indexOf(collectables);

    if(index > -1) {
        allStars.splice(index, 1);
        player.score += 5; // Add 5 points for every star collected
    }


};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(90,50), new Enemy(75,224), new Enemy(154,139)];

// Place the player object in a variable called player
var player = new Player();


// Instanciate the Star array object for player to collect
var allStars = [];
for (var i = 0; i < 4; i++){
    var star =  new Star();
    allStars.push(star);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
