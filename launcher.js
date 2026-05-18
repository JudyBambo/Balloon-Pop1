
//function to collect values
function getValues(){

    let playerName = document.getElementById("playerName").value;
    let difficultyOption = document.getElementById("difficulty").value;
    let gameLength = document.getElementById("gameLength").value;;
    let gameTheme = document.querySelector('input[name="theme"]:checked').value;

    let popSound = document.getElementById("soundEnabled").checked;
    let doublePoints = document.getElementById("doublePoints").checked;
    let bonusBalloons = document.getElementById("bonusBalloons").checked;

    return {playerName, difficultyOption, gameLength, gameTheme, popSound, doublePoints, bonusBalloons};
}

//creating a funtion to store the values in local storage
function saveSettings(){
    let variablesValues = getValues();

    localStorage.setItem("PlayerName", variablesValues.playerName);
    localStorage.setItem("DifficultyOption", variablesValues.difficultyOption);
    localStorage.setItem("GameLength", variablesValues.gameLength);
    localStorage.setItem("GameTheme", variablesValues.gameTheme);
    localStorage.setItem("PopSound", variablesValues.popSound);
    localStorage.setItem("DoublePoints", variablesValues.doublePoints);
    localStorage.setItem("BonusBalloons", variablesValues.bonusBalloons);

    alert("Settings saved successfully");
}

//function to open the game window
function openGame(){

    let values = getValues();

    if(values.playerName.trim() === ""){
        alert("Please enter your name!");
        return;
    }

    saveSettings();
    window.open("game.html");
}

//function to load the saved settings
function loadSettings(){
    
    // retrieving values from local storage and assigning them to their input fields
    let playerNameValue = localStorage.getItem("PlayerName");
    document.getElementById("playerName").value = playerNameValue;
    let difficultyOptionValue = localStorage.getItem("DifficultyOption");
    document.getElementById("difficulty").value = difficultyOptionValue;
    let gameLengthValue = localStorage.getItem("GameLength");
    document.getElementById("gameLength").value = gameLengthValue;

    //Theme value retrival
    let gameThemeValue = localStorage.getItem("GameTheme");
    let radios = document.getElementsByName("Theme");
    
    for (let i = 0; i < radios.length; i++){
        if (radios[i].value === gameThemeValue){
            radios[i].checked = true;
        }
    }

    //Options retrival
    let popSoundValue = localStorage.getItem("PopSound") === "true";
    document.getElementById("soundEnabled").checked = popSoundValue;
    let doublePointsValue = localStorage.getItem("DoublePoints") === "true";
    document.getElementById("doublePoints").checked = doublePointsValue;
    let bonusaBalloonsValue = localStorage.getItem("BonusBalloons") === "true";
    document.getElementById("bonusBalloons").checked = bonusaBalloonsValue;

    livePreview();
}

//Settings Reset function
function resetSettings(){
    localStorage.clear()
    document.getElementById("playerName").value = "";
    document.getElementById("difficulty").value = "Easy";
    document.getElementById("gameLength").value = "20";
    document.getElementsByName("theme")[0].checked = true;
    document.getElementById("soundEnabled").checked = false;
    document.getElementById("doublePoints").checked = false;
    document.getElementById("bonusBalloons").checked = false;

    alert("Settings have been reset.");
}

//Live preview function
function livePreview(){
    let values = getValues();

    let previewText = `Player: ${values.playerName} | Difficulty: ${values.difficultyOption} 
    | Game Length: ${values.gameLength}seconds | Theme: ${values.gameTheme} 
    | Pop Sound: ${values.popSound ? "ON" : "OFF"} | Double Points: ${values.doublePoints ? "ON" : "OFF"} 
    | Bonus Balloons: ${values.bonusBalloons ? "ON" : "OFF"}`;

    document.getElementById("previewText").textContent = previewText;
}





