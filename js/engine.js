/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        success = false,
        time,
        lastTime;
    var game = new Game();

    canvas.width = 505;
    canvas.height = 606;
    doc.getElementById("game_area").appendChild(canvas);//add the canvas to the webpage html dom

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;//The time that is passed

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);//should update all content including enemy and player
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if(!game.stop){
            win.requestAnimationFrame(main);
        }
        else{
            console.log("fuck");
            var gameArea = document.getElementById("game_area");
            gameArea.parentNode.removeChild(gameArea);
            var gameOver = document.getElementById("gameOver");
            if(success){
                console.log("Game not fail");
                gameOver.appendChild(document.createTextNode("You survive and get point: "+game.score));
            }
            else{
                gameOver.appendChild(document.createTextNode("You failed, score in the last challenge is: "+game.score));
            }
            doc.getElementById('gameOver').style.display = 'inline-block';
            doc.getElementById('try-again').style.display = 'inline-block';
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        //reset();
        lastTime = Date.now();//set the initial time.
        doc.getElementById('start').onclick = function() {
           main();
           reset();
           initTimer(120);
       };
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        //It is assumed that player is alive and not back to start point at this time
        //game.checkCollision();
        //game.checkMagicItem();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        game.allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        game.MagicItem.update();
        game.player.update();
        game.runGame();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                if(row === 0){
                    if(col === 2) ctx.drawImage(Resources.get(rowImages[1]), col * 101, row * 83);
                    else ctx.drawImage(Resources.get(rowImages[0]), col * 101, row * 83);
                }
                else ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }
    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        game.allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        game.MagicItem.render();
        game.player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        doc.getElementById('timer').appendChild(document.createTextNode(showTimer(60)));
        doc.getElementById('score').appendChild(document.createTextNode('Score: ' + game.score));
        doc.getElementById('life').appendChild(document.createTextNode("Life: "+game.life));
        doc.getElementById('timer').style.display = 'inline-block';
        doc.getElementById('life').style.display = 'inline-block';
        doc.getElementById('score').style.display = 'inline-block';
        //doc.getElementById('try-again').style.display = 'inline-block';
        doc.getElementById('game_area').style.display = 'inline-block';
        var instruction = doc.getElementById('description');
        instruction.parentNode.removeChild(instruction);
        var startButton = doc.getElementById('start');
        startButton.parentNode.removeChild(startButton);
        var heading = doc.getElementById('Game name');
        heading.parentNode.removeChild(heading);
    }
    /**
    *Function used to display game over screen
    * @return {void}
    */
    function gameOver() {
        console.log("Game over");
    }
    /**
    *Function used to Set a  timer in the screen.
    * @para {number} time
    */
    function initTimer(seconds) {
        console.log("Time: "+seconds);
        document.getElementById('timer').childNodes[0].nodeValue = showTimer(seconds);
        if(seconds === 0){
            game.stop = true;
            gameOver();
            console.log("For game over check");
            success = true;
        }
        else{
            if(!game.stop){
                setTimeout(function(){
                    initTimer(seconds-1);
                }, 1000);
            }
        }
    }
    function showTimer(time) {
        var minutes = parseInt(time / 60);
        var seconds = time-minutes*60;
        if(seconds < 10) seconds = "0"+seconds;
        if(minutes < 10) minutes = "0"+minutes;
        return minutes + ":" +seconds;
    }


    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Gem Blue.png',
        'images/Heart.png',
        'images/Rock.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
