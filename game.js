
document.getElementById("displayPlayer").textContent = localStorage.getItem("PlayerName");
document.getElementById("displayTimeLeft").textContent = localStorage.getItem("GameLength") + " s";
document.getElementById("displayDifficulty").textContent = localStorage.getItem("DifficultyOption");
document.getElementById("displayGameLength").textContent = localStorage.getItem("GameLength") + " s";
document.getElementById("displayTheme").textContent = localStorage.getItem("GameTheme");

let displayScore = document.getElementById("displayScore");
let displayTime = document.getElementById("displayTimeLeft");
let poppedBalloonsDisplay = document.getElementById("displayPopped");
let escapedBalloonsDisplay = document.getElementById("displayEscaped");
let bestScoreDisplay = document.getElementById("displayBestScore");
let gameMessageArea = document.getElementById("messageArea");
let skyArea = document.getElementById("skyArea");
let gameLogArea = document.getElementById("logArea");

let savedBestScore = parseInt(localStorage.getItem("BestScore") || "0");
bestScoreDisplay.textContent = savedBestScore;
let gameInterval;
let difficulty = localStorage.getItem("DifficultyOption");
let timeInterval;
let timeLeft = parseInt(localStorage.getItem("GameLength"));
let score = 0;
let escapedBalloonCount = 0;
let poppedBalloonCount = 0;
let activeIntervals = new Set();
let pauseBtn = document.getElementById("pauseBtn");
let isPaused = false;
let gameRunning = false;


//Function to create balloons
function createBalloons(){
    //Exits if the game is not running
    if (!gameRunning) return;

    //Create a balloon element
    let balloon = document.createElement("div");
    balloon.classList.add("balloon");
    
    //Apply the theme
    let theme = localStorage.getItem("GameTheme");
    balloon.classList.add(theme);

    //Apply bonus balloons
    let isBonus = localStorage.getItem("BonusBalloons") === "true" && Math.random() < 0.3; 
    if (isBonus) {
        balloon.classList.add("bonus");
        balloon.textContent = "+20";
    }

    //Balloons position
    balloon.style.left = Math.random() * (skyArea.clientWidth - 50) + "px"; // Random horizontal position within the sky area
    balloon.style.bottom = "0px"; //Start at the bottom (0px)
    
    //Balloons movement
    let position = 0;
    //
    let moveInterval = setInterval(() => {
        //Pause logic for balloon movement
        if (isPaused) return;

        //difficulty levels(speed) logic
        if (difficulty === "easy"){
            position +=1;
        }else if (difficulty === "medium"){
            position +=3;
        }else {
            position += 5; 
        }
        balloon.style.bottom = position + "px"; // incrementing the positon of the balloon by Xpx from the bottom of the the skyArea
        
        //Missed balloons logic
        if (position > skyArea.clientHeight){
            escapedBalloonCount++;
            escapedBalloonsDisplay.textContent = escapedBalloonCount; //updates the dislay of escaped balloons

            //Game log for missed balloons
            updateGameLog("A balloon escaped! -1 point", "escape-log");

            balloon.remove();
            clearInterval(moveInterval); //stops balloon movement once reaches the skyArea
            activeIntervals.delete(moveInterval);
        }
    },20);
    activeIntervals.add(moveInterval);

    //Balloon popping logic
    balloon.addEventListener("click", function(){

        //Change 8: Added a check to prevent the balloon from being popped while the game is paused.
        if (isPaused) return;

        //bonus ballons score logic
        if (isBonus){
            score += 20;
            updateGameLog("Bonus Balloon Popped! +20 points", "bonus-log");
        }
        else {
            score += 10;
            updateGameLog("Balloon Popped! +10 points", "pop-log");
        }

        //Logic for balloon sound
        let isSoundOn = localStorage.getItem("PopSound") === "true";
        if (isSoundOn) {
            let popSound = new Audio("Ballon_pop.mp3");
            popSound.play();
        }
        
        poppedBalloonCount++;
        poppedBalloonsDisplay.textContent = poppedBalloonCount; //updates display for pooped balloons
        displayScore.textContent = score;
        balloon.remove();
        clearInterval(moveInterval); //stops the balloon from moving once popped
    });

    skyArea.append(balloon);
}

//CHANGE 1
// Old  timer function without proper pause logic
// function startTimer(){
//     return setInterval(() => { // this function will run every 1000ms(1s)
//         if(isPaused) return;

//         timeLeft--; // decrements time left by 1s
//         displayTime.textContent = timeLeft + " s" //updates the display for time lef

//         //stops game when time left is 0 or less
//         if(timeLeft <= 0){
//             displayTime.textContent = "0 s";
//             endGame();
//         }
//     }, 1000); 
// }

//Replaced with new timer f
function startTimer(){
    return setInterval(() => {  { 
            timeLeft--;
            displayTime.textContent = timeLeft + " s"; // update the display for time left

            //stops the game when time left is 0 or less
            if(timeLeft <= 0){ 
                timeLeft = 0;
                displayTime.textContent = "0 s";
                endGame();
            }
        }
    }, 1000);// this function will run every 1000ms(1s)
}
// - END OF CHANGE 1

//Start Game Function
//CHANGE 2:
//Old start game function
// function startGame(){
//     if (gameRunning) return;
    
//     gameRunning = true;
//     isPaused = false;
//     displayTime.textContent = timeLeft + " s";

//     //The balloon creation 
//     // Changed the balloon creation interval from 2s to 0.5s to increase the balloons on screen
//     gameInterval = setInterval(createBalloons, 2000); //creates a balloon every 2s
//     timeInterval = startTimer();
// }

//replaced with new start game function that properly resets the game state for a fresh round, and also allows the
// "Start" button to act as an unpause mechanism if the game is currently paused
function startGame() {
    // If the game is already running and not paused, do nothing
    if (gameRunning && !isPaused) return;

    // If the game is paused, clicking "Start" can act as an unpause mechanism
    if (isPaused) {
        pauseResume();
        return;
    }

    // Reset game state for a new round
    gameRunning = true;
    isPaused = false;
    score = 0;
    poppedBalloonCount = 0;
    escapedBalloonCount = 0;
    
    // Fetch the original game length setup from settings
    timeLeft = parseInt(localStorage.getItem("GameLength") || "60");

    // Update UI Displays back to default positions
    displayScore.textContent = "0";
    displayTime.textContent = timeLeft + " s";
    poppedBalloonsDisplay.textContent = "0";
    escapedBalloonsDisplay.textContent = "0";
    pauseBtn.textContent = "Pause";

    // Clear the canvas of old balloons, "GAME OVER" text, and old CSS classes
    skyArea.innerHTML = "";
    //skyArea.className = ""; 
    gameLogArea.innerHTML = ""; // Clear log for the new session

    gameInterval = setInterval(createBalloons, 700); // Start balloon spawner (every 0.7s)
    timeInterval = startTimer();                     // Start the countdown clock
    
    updateGameLog("Game Started!", "start-log");
}
// - END OF CHANGE 2

//CHANGE 3
//old end game function without best score logic and game log updates
// function endGame(){
//     gameRunning = false; //stops the game loop
//     clearInterval(gameInterval); //stops ballons creation
//     clearInterval(timeInterval); //stops the timer

//     //double points logic
//     let isDoublePoints = localStorage.getItem("DoublePoints") === "true";
//     let finalScore;

//     if(isDoublePoints){
//         finalScore = score * 2;
//     }else{
//         finalScore = score;
//     }
//     displayScore.textContent = finalScore;

//     skyArea.textContent = "GAME OVER!!!";
//     skyArea.classList.add("game-over");
//     //update best score
// }
// let startBtn = document.getElementById("startBtn");
// startBtn.addEventListener("click", startGame);


//replaced with the new end game function that includes best score logic and game log updates
function endGame(){
    gameRunning = false; //stops the game loop
    clearInterval(gameInterval); //stops ballons creation
    clearInterval(timeInterval); //stops the timer

    //double points logic
    let isDoublePoints = localStorage.getItem("DoublePoints") === "true";
    let finalScore;

    if(isDoublePoints){
        finalScore = score * 2;
    }else{
        finalScore = score;
    }
    displayScore.textContent = finalScore;

    //get the current best score
    let bestScore = parseInt(localStorage.getItem("BestScore") || "0");

    //update best score if current score is higher
    if (finalScore > bestScore) {
        localStorage.setItem("BestScore", finalScore.toString());
        bestScoreDisplay.textContent = finalScore;
        updateGameLog("NEW BEST SCORE!", "best-score-log");

        //update the game screen with the new best score
        skyArea.textContent = "NEW BEST SCORE!!! Score: " + finalScore;
        skyArea.classList.remove("game-over");
        skyArea.classList.add("new-best-score");
    }else {
        skyArea.textContent = "GAME OVER!!! Score: " + finalScore;
        skyArea.classList.remove("new-best-score");
        skyArea.classList.add("game-over");
    }
}
let startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", startGame);
// - END OF CHANGE 3


// CHANGE 4
/* Old function 
function pauseResume(){
    
    gameRunning = !gameRunning;
    isPaused = !gameRunning;

    if (!gameRunning){
        //Pause game 
        clearInterval(gameInterval);
        clearInterval(timeInterval);
        timeInterval = null;

        for (let interval of activeIntervals) {
            clearInterval(interval);
        }
        activeIntervals.clear();

        skyArea.classList.add("paused")
        pauseBtn.textContent = "Resume";

    }else {
        //Resume game
        gameInterval = setInterval(createBalloons,2000);
        if (!timeInterval) {
            timeInterval = startTimer();
        }
        
        skyArea.classList.remove("paused");
        pauseBtn.textContent = "Pause";
    }
}*/

//Replaced with new function that properly handles the pause/resume logic for both 
//the balloon and the timer. when resumed, the balloons continue moving from their current position
function pauseResume(){
    
    if (!gameRunning && !isPaused) return;
    isPaused = !isPaused;

    if (isPaused){
        //Pause game 
        clearInterval(gameInterval); //stops creating new balloons.
        skyArea.classList.add("paused")
        pauseBtn.textContent = "Resume";

    }else {
        //Resume game
        gameInterval = setInterval(createBalloons,700); 
        skyArea.classList.remove("paused");
        pauseBtn.textContent = "Pause";
    }
}
// - END OF CHANGE 4

//helper function to recreate balloons from saved data
//CHANGE 5: Added a helper function to recreate the balloons on the screen based on their saved position and type
function recreateSavedBalloon(left, bottom, isBonus){
    
    let balloon = document.createElement("div");
    balloon.classList.add("balloon");
    //Apply theme
    balloon.classList.add(localStorage.getItem("GameTheme"));
    skyArea.classList.add(localStorage.getItem("GameTheme"));

    //Appy bonus balloon if applicable
    if (isBonus) {
        balloon.classList.add("bonus");
        balloon.textContent = "+20";
    }

    //Apply the saved position
    balloon.style.left = left;
    balloon.style.bottom = bottom;

    //balloon movement logic
    let position = parseInt(bottom);
    let moveInterval = setInterval(() => {
        if(isPaused) return;

        //difficulty levels(speed) logic
        if (difficulty === "easy") {
                position +=1;
            } else if (difficulty === "medium") {
                position += 3;
            } else {
                position += 5;
            }

        balloon.style.bottom = position + "px";
        
        if (position > skyArea.clientHeight) {
            escapedBalloonCount++;
            escapedBalloonsDisplay.textContent = escapedBalloonCount;
            balloon.remove();
            clearInterval(moveInterval);
            activeIntervals.delete(moveInterval);
        }
    }, 20);

    activeIntervals.add(moveInterval);

    //balloon popping logic
    balloon.addEventListener("click", function() {

        if (isPaused) return;

        score += isBonus ? 20 : 10;

        //balloon popping sound logic
        if (localStorage.getItem("PopSound") === "true") {
            new Audio("Ballon_pop.mp3").play();
        }

        poppedBalloonCount++;
        poppedBalloonsDisplay.textContent = poppedBalloonCount;
        displayScore.textContent = score;
        balloon.remove();
        clearInterval(moveInterval);
    });

    skyArea.append(balloon);
}
// - END OF CHANGE 5

//Change 9: implemented the save and load session logic to the buttons
//Save Session Function
function saveSession(){
// saving the basic stats
   localStorage.setItem("savedScore", score.toString());
   localStorage.setItem("savedTimeLeft", timeLeft.toString());
   localStorage.setItem("savedPoppedBalloons", poppedBalloonCount.toString());
   localStorage.setItem("savedEscapedBalloons", escapedBalloonCount.toString());

// saving the balloon positions   
    let currentBalloons = document.querySelectorAll(".balloon");
    localStorage.setItem("balloonCount", currentBalloons.length);

    for (let i = 0; i < currentBalloons.length; i++){
        let balloon = currentBalloons[i];

        //saving the balloon position with i as the key
        localStorage.setItem(`balloon_${i}_left`, balloon.style.left);
        localStorage.setItem(`balloon_${i}_bottom`, balloon.style.bottom);

        //saving the ballons as regular or bonus
        let isBonus = balloon.classList.contains("bonus") ? "true" : "false";
        localStorage.setItem(`balloon_${i}_isBonus`, isBonus);

    }
 
   alert("Game session has been saved!");
}

//Load Session Function
function loadSession(){

    let savedScore = localStorage.getItem("savedScore");
    let savedTimeLeft = localStorage.getItem("savedTimeLeft");
    let savedPoppedBalloons = localStorage.getItem("savedPoppedBalloons");
    let savedEscapedBalloons = localStorage.getItem("savedEscapedBalloons");

    if (savedScore !== null && savedTimeLeft !== null && savedPoppedBalloons !== null && savedEscapedBalloons !== null) {
        //Update game stats
        score = parseInt(savedScore);
        timeLeft = parseInt(savedTimeLeft);
        poppedBalloonCount = parseInt(savedPoppedBalloons);
        escapedBalloonCount = parseInt(savedEscapedBalloons);

        //Update displays
        displayScore.textContent = score;
        displayTime.textContent = timeLeft + " s";
        poppedBalloonsDisplay.textContent = poppedBalloonCount;
        escapedBalloonsDisplay.textContent = escapedBalloonCount;

        //clear existing balloons
        skyArea.innerHTML = ""; 

        //load balloons position
        let balloonCount = parseInt(localStorage.getItem("balloonCount") || "0");
        for (let i = 0; i < balloonCount; i++){
            let left = localStorage.getItem(`balloon_${i}_left`);
            let bottom = localStorage.getItem(`balloon_${i}_bottom`);
            let isBonus = localStorage.getItem(`balloon_${i}_isBonus`) === "true";

            //Helper function to bring back the balloons on the screen
            recreateSavedBalloon(left, bottom, isBonus);
        }

        clearInterval(timeInterval);
        clearInterval(gameInterval);

        //restart the timer
        timeInterval = startTimer();

        //set the game to paused
        gameRunning = false;
        isPaused = true;
        skyArea.classList.add("paused");
        pauseBtn.textContent = "Resume";

        alert("Your game session has been restored! Press Resume to start playing.");
    }
    else{
        alert("No saved game session data found.");
    }
}
// - END OF CHANGE 9

//Reset Game Function
function resetGame(){

    if (!confirm("Are you sure you want to reset the game?")) {
        return;
    }

    //stops the game and clears intervals
    clearInterval(gameInterval);
    clearInterval(timeInterval);

    activeIntervals.forEach((interval) => {
        clearInterval(interval);
    });
    activeIntervals.clear();

    //reset the game stats
    score = 0;
    gameRunning = false;
    isPaused = false;
    poppedBalloonCount = 0;
    escapedBalloonCount = 0;
    timeLeft = parseInt(localStorage.getItem("GameLength")) || 60;//fetch game length from settings

    //update displays
    displayScore.textContent = "0";
    displayTime.textContent = timeLeft + " s";
    poppedBalloonsDisplay.textContent = "0";
    escapedBalloonsDisplay.textContent = "0";
    pauseBtn.textContent = "Pause";

    //Clear the sky & gamelog

    skyArea.innerHTML = "";
    gameLogArea.innerHTML = "";
    skyArea.classList.remove("paused", "game-over");

    alert("Game has been reset! Press start to play again.");

}

//Back to settings button function
function backButton(){
    window.location.href = "index.html";
}

//Game log function
function updateGameLog(message, type){
    //Create a log entry
    let logEntry = document.createElement("p");
    logEntry.textContent = `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] ${message}`;

    //apply styling
    if(type){
        logEntry.classList.add(type);
    }

    //Add log entry to the log area
    gameLogArea.appendChild(logEntry);

    //Auto scroll to the latest log entry
    gameLogArea.scrollTop = gameLogArea.scrollHeight;
}

// Change 7: Added a function to apply selected theme to the game area as well
//function to change the background theme of the game area based on the user's selection in the settings
function gameTheme(){
    let theme = localStorage.getItem("GameTheme");
    skyArea.className = "sky-area"; // Reset to default class
    if (theme) {
        skyArea.classList.add(theme); // Add the selected theme class
    }
}
gameTheme(); //apply the theme when game loads
// - END OF CHANGE 7

