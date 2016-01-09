var Game = function(){
    this.score = 0;
    this.life = 3;
    this.stop = false;
    this.allEnemies = [];
    this.player = new Player();
    this.MagicItem = new MagicItem();
    this.ininEnemies();
    this.MagicItem.refresh();//set the magic item refresh function enable
    var that = this;
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };//pre-defined a var for key input and then call handleInput for updating the position information.
        that.player.handleInput(allowedKeys[e.keyCode]);
    });
};
/**
* @return {void}
*/
Game.prototype.ininEnemies = function() {
    for(var i = 0; i < 4; ++i){
        var enemy = new Enemy();
        enemy.reset();
        this.allEnemies.push(enemy);
    }
};
Game.prototype.checkCollision = function() {
    for(var i = 0; i < this.allEnemies.length; ++i){
        if(Math.abs(this.allEnemies[i].x-this.player.x) < 50 && Math.abs(this.allEnemies[i].y-this.player.y) < 50){
            this.dead();
            break;
        }
    }
};
Game.prototype.checkMagicItem = function() {
    if(!this.MagicItem.isUsed && Math.abs(this.MagicItem.x-this.player.x) < 50 && Math.abs(this.MagicItem.y-this.player.y) < 50){//Player collsition
        this.MagicItem.setUse();//Not shown in the current period
        switch(this.MagicItem.sprite) {
            case "images/Gem Green.png":
                this.allEnemies.forEach(function(enemy){
                    enemy.reset();
                });
                break;
            case "images/Gem Orange.png":
                this.score+=40;
                document.getElementById('score').childNodes[0].nodeValue = "score: "+this.score;
                break;
            case "images/Gem Blue.png":
                this.score+=10;
                document.getElementById('score').childNodes[0].nodeValue = "score: "+this.score;
                break;
            case "images/Heart.png":
                this.life+=1;
                document.getElementById('life').childNodes[0].nodeValue = "Life: "+this.life;
                break;
            case "images/Rock.png":
                this.dead();
                return true;
                break;
            default: break;
        }
        return false;
    }
    return false;
};
Game.prototype.dead = function() {
    if(this.life === 1) this.stop = true;
    else{
        this.player.reset();
    }
    this.life--;
    document.getElementById('life').childNodes[0].nodeValue = "Life: "+this.life;
}
Game.prototype.runGame = function() {
    if(this.checkCollision()) return;
    if(this.checkMagicItem()) return;
    if(this.player.isOnTop()){
        if(this.player.isOnEnd()){
            this.score+=30;
            document.getElementById('score').childNodes[0].nodeValue = "score: "+this.score;
            this.player.reset();
        }
        else this.dead();
    }
}
// Enemies our player must avoid
// Constructor function used for creating a new enemy
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.bugMinSpeed = 100;
    this.bugSpeedRange = 250;
    //this.enemyRow = [40,130,220,310];
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y;
    this.speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if(this.x >= 505) this.reset();
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Enemy.prototype.reset = function() {
    var enemyRow = [60,143,226];
    this.x = -101;
    this.y = enemyRow[Math.round(Math.random()*(enemyRow.length-1))];
    this.speed = Math.floor(Math.random()*this.bugSpeedRange + this.bugMinSpeed);
}
/**
* Constructor
* @return {void}
*/
var Player = function(){
    this.x = 202;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    return;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/**
* function used to handle player position
* Width of game board is 505, make single horizional movement 101
* Height of game board is 606, make vertical movement 83
* @para {string} key
* @return {void}
*/
Player.prototype.handleInput = function(key) {
    switch(key) {
    case 'left':
      if (this.x > 0)
        this.x -= 101;
      break;
    case 'up':
      if (this.y > 0)
        this.y -= 83;
      break;
    case 'right':
      if (this.x < 404)
        this.x += 101;
      break;
    case 'down':
      if (this.y < 375)
        this.y += 83;
      break;
    default: break;
    }
};
Player.prototype.isOnTop = function() {
    return this.y < 0;
}
Player.prototype.isOnEnd = function() {
    return this.x === 200;
}
/**
* function used to reset player to original starting point
* @return {void}
*/
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};
/**
* Constructor
* @return {void}
*/
var MagicItem = function() {
    this.x;
    this.y;
    this.sprite;
    this.isUsed;
    this.reset();
};
MagicItem.prototype.update = function() {
    return;
};
MagicItem.prototype.render = function() {
    if(!this.isUsed) ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

MagicItem.prototype.reset = function() {
    var row = [83,166,249,332];
    var col = [0,101,202,303,404];
    var candidate = ["images/Gem Green.png", "images/Gem Orange.png", "images/Gem Blue.png", "images/Heart.png", "images/Rock.png"];
    this.x = col[Math.round(Math.random()*(col.length-1))];
    this.y = row[Math.round(Math.random()*(row.length-1))];
    this.sprite = candidate[Math.round(Math.random()*(candidate.length-1))];
    this.isUsed = false;
};
MagicItem.prototype.refresh = function() {
    var that = this;
    setInterval(function(){
        //console.log(this);
        MagicItem.prototype.reset.call(that);
    }, 4000);
}
MagicItem.prototype.setUse = function() {
    this.isUsed = true;
};
MagicItem.prototype.comparePos = function(Item) {
    return (Item.sprite === this.sprite) || ((Item.x === this.x) && (Item.y === this.y));
};