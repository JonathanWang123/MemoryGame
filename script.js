//Global Variables

// Constants for frequency
const baseFreq = 300;
const freqInc = 50;

// Constants for rhythm mode timers
const baseRhythm = 250;
const rhythmInc = 500;
const rhythmVariations = 3;
const mouseThreshold = 350;

// Constants for game mode enumeration
const modes = {
  NORMAL: 1,
  ENDLESS: 2,
  RHYTHM: 3,
};

// Constant for how long player gets to gues
const turnTimer = 3000;

// Game incrementer variables
var progress = 0;
var gamePlaying = false;
var guessCounter = 0;

// Sound variables
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0

// Current mode
var currMode = 1;

// Timer variables for displaying clues
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var cluePauseTime = 333; //how long to pause in between clues
var nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// Timer for guess countdown
var totalTime = 0;
var timer;

// Timer for mouse hold down (rhythm mode)
var mouseTime = 0;
var mouseTimer;

// Timer for speed increase
var currSpeed = 1;
var acceleration = 1;

// Timer for generating sequence
var pattern = [];
var rhythmPattern = [];

// Variables for determining game logic
var numButtons = 4;
var numRounds = 4;

// Number of wrong choices allowed
var strikes = 3;

// Variable to track rounds (endless mode)
var score = 0;


// Initialize certain elements on page load
function initialize() {
  setButtons(numButtons);
  setRounds(document.getElementById("numRounds").value);
  setSpeed(document.getElementById("speed").value);
  setStrikes(document.getElementById("lives").value);
}

// Initialize game elements and run game
function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;

  // Generate random sequence
  if(currMode != modes.ENDLESS){
    randomSequence();
  } else {
    pattern = [];
    let rand = Math.floor(Math.random()*numButtons)+1;
    pattern.push(rand);
    drawScore();
  }
  
  // Generate rhythm pattern (rhythm mode)
  if(currMode == modes.RHYTHM){
    rhythmPattern = [];
    for(let i = 0; i < pattern.length; i++){
      let rand = baseRhythm + rhythmInc*(Math.floor(Math.random()*rhythmVariations));
      rhythmPattern.push(rand);
    }
  }
  
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  // Set acceleration value
  setAcceleration();

  // Lock settings and run game
  lockSelectors();
  playClueSequence();
}

// Reset game values and end game
function stopGame() {
  // Clear all timers and stop sounds
  stopTone();
  clearInterval(timer);
  clearInterval(mouseTimer);
  
  // Reset score, buttons, lives, and speed
  score = 0;
  setButtons(numButtons);
  gamePlaying = false;
  setStrikes(document.getElementById("lives").value);
  setSpeed(document.getElementById("speed").value);
  
  // Unlock everything
  unlockSelectors();
  unlockGame();
  
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Play a single clue for specified amount of time
function playSingleClue(btn, time = clueHoldTime) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, time);
    setTimeout(clearButton, time, btn);
  }
}

// Play clues
function playClueSequence() {
  guessCounter = 0;
  setButtons(numButtons);
  let delay = nextClueWaitTime; //set delay to initial wait time
  
  lockGame();
  switch (parseInt(currMode)) {
    case modes.ENDLESS:
      // Same logic as normal but no timer
      // Main difference is in guess function
      for(let i = 0; i < pattern.length; i++){
        setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
        delay += clueHoldTime;
        delay += cluePauseTime;
      }
      
      if(document.getElementById("shuffle").checked){
        setTimeout(randomizeButtons, delay);
      }
      break;
    case modes.RHYTHM:
      // Same logic as normal but no timer
      // Instead of holding for constant time, hold based on generated rhythm
      for (let i = 0; i <= progress; i++) {
        // for each clue that is revealed so far
        setTimeout(playSingleClue, delay, pattern[i], rhythmPattern[i]); // set a timeout to play that clue
        delay += rhythmPattern[i];
        delay += cluePauseTime;
      }

      if(document.getElementById("shuffle").checked){
        setTimeout(randomizeButtons, delay);
      }
      break;
    default: // Normal mode
      
      // Set timer and do game logic
      clearInterval(timer);
      totalTime = 0;
      for (let i = 0; i <= progress; i++) {
        // for each clue that is revealed so far
        setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
        delay += clueHoldTime;
        delay += cluePauseTime;
      }

      // Shuffle elements if option checked
      if(document.getElementById("shuffle").checked){
        setTimeout(randomizeButtons, delay);
      }
      
      // Set guess timer
      totalTime += turnTimer + delay;
      if (gamePlaying) {
        timer = setInterval(initializeTimer, 10);
      }
      break;
  }
  
  setTimeout(unlockGame, delay);
}

// Function run on clicking a game button
function guess(btn) {
  if (!gamePlaying) {
    return;
  }
  
  switch(currMode){
    case modes.ENDLESS:
      // No win condition
      // If correctly guessed pattern, randomely generate next sequence and add to pattern
      if (pattern[guessCounter] == btn) {
        if (guessCounter == pattern.length-1) {
            let rand = Math.floor(Math.random()*numButtons)+1;
            pattern.push(rand);
            score++;
            drawScore();
            playClueSequence();
        } else {
          guessCounter++;
        }
      } else if (strikes > 1) {
        wrongAns();
        strikes--;
        setStrikes(strikes);
        playClueSequence();
      } else {
        wrongAns();
        loseGame();
      }
      break;
    case modes.RHYTHM:;
      console.log(rhythmPattern[guessCounter]);
      console.log(mouseTime);
      // Same logic as normal, but check that the mouse was held down as long as the generated rhythm
      if (pattern[guessCounter] == btn 
          && Math.abs(mouseTime - rhythmPattern[guessCounter]) < mouseThreshold) {
        if (guessCounter == progress) {
          if (progress == pattern.length - 1) {
            winGame();
            return;
          } else {
            progress++;
            playClueSequence();
          }
        } else {
          guessCounter++;
        }
      } else if (strikes > 1) {
        wrongAns();
        strikes--;
        setStrikes(strikes);
        playClueSequence();
      } else {
        wrongAns();
        loseGame();
      }
      break;
    default:
      // Default game logic
      // Guess is correct only if done within alloted time
      if (pattern[guessCounter] == btn && totalTime > 0) {
        if (guessCounter == progress) {
          if (progress == pattern.length - 1) {
            winGame();
            return;
          } else {
            progress++;
            playClueSequence();
          }
          // Accelerate game with each guess
          if (document.getElementById("accelerate").checked) {
            accelerateSpeed();
          }
        } else {
          guessCounter++;
        }
      } else if (strikes > 1) {
        wrongAns();
        strikes--;
        setStrikes(strikes);
        playClueSequence();
      } else {
        wrongAns();
        loseGame();
      }
      break;
  }

}

// Function run on game lose
function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

// Function run on game win
function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

// Function to generate random pattern
function randomSequence() {
  pattern = [];
  for (let i = 0; i < numRounds; i++) {
    var rand = Math.floor(Math.random() * numButtons) + 1;
    pattern.push(rand);
  }
}

// Lock all settings selectors
function lockSelectors() {
  var selectors = document.getElementsByClassName("controlPanel");
  for (let i = 0; i < selectors.length; i++) {
    selectors[i].disabled = true;
  }
}

// Unlock all settings selectors
function unlockSelectors() {
  var selectors = document.getElementsByClassName("controlPanel");
  for (let i = 0; i < selectors.length; i++) {
    selectors[i].disabled = false;
  }
}

// Lock all game buttons
function lockGame() {
  var selectors = document.getElementsByClassName("gameBtn");
  for (let i = 0; i < selectors.length; i++) {
    selectors[i].disabled = true;
  }
}

// Unlock all game buttons
function unlockGame() {
  var selectors = document.getElementsByClassName("gameBtn");
  for (let i = 0; i < selectors.length; i++) {
    selectors[i].disabled = false;
  }
}

// Set mode to selected mode
// Display corresponding settings for each mode
function setMode(num) {
  currMode = parseInt(num);
  if(currMode == modes.ENDLESS){
    document.getElementById("numRounds").classList.add("hidden");
    document.getElementById("accelerate").classList.add("hidden");
    document.getElementById("accelerate").checked = false;
    
    document.getElementById("speedLabel").classList.remove("hidden");
    document.getElementById("speed").classList.remove("hidden");
    
    document.getElementById("numRoundsLabel").classList.add("hidden");
    document.getElementById("accelerateLabel").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    
    document.getElementById("score").classList.remove("hidden");
    drawScore();
  } else if(currMode == modes.RHYTHM){
    document.getElementById("numRounds").classList.remove("hidden");
    document.getElementById("numRoundsLabel").classList.remove("hidden");
    
    document.getElementById("speedLabel").classList.add("hidden");
    document.getElementById("speed").classList.add("hidden");
    document.getElementById("speed").value = 1;
    
    document.getElementById("accelerateLabel").classList.add("hidden");
    document.getElementById("accelerate").classList.add("hidden");
    document.getElementById("accelerate").checked = false;
    
    document.getElementById("timer").classList.add("hidden");
    
    document.getElementById("score").classList.add("hidden");
  } else {
    document.getElementById("numRounds").classList.remove("hidden");
    document.getElementById("accelerate").classList.remove("hidden");
    document.getElementById("speedLabel").classList.remove("hidden");
    document.getElementById("speed").classList.remove("hidden");
    document.getElementById("numRoundsLabel").classList.remove("hidden");
    document.getElementById("accelerateLabel").classList.remove("hidden");
    document.getElementById("timer").classList.remove("hidden");
    
    document.getElementById("score").classList.add("hidden");
  }
}

// Draw score for endless mode
function drawScore(){
  document.getElementById("score").innerHTML = "";
  
  var scoreDisplay = document.createElement("h3");
  scoreDisplay.innerHTML = "Score: " + parseInt(score);
  document.getElementById("score").appendChild(scoreDisplay);
}

// Set the initial speed 
function setSpeed(num) {
  clueHoldTime = 1000 / num;
  cluePauseTime = 333 / num;
  nextClueWaitTime = 1000 / num;
}

// Set the acceleration factor
function setAcceleration() {
  acceleration =
    1 + 1 / numRounds / Math.pow(2, document.getElementById("speed").value);
}

// Decrease wait times according to acceleration factor
function accelerateSpeed() {
  clueHoldTime = clueHoldTime / acceleration;
  cluePauseTime = cluePauseTime / acceleration;
  nextClueWaitTime = nextClueWaitTime / acceleration;
}


// Set and display lives
function setStrikes(num) {
  strikes = num;
  var strikeBox = document.getElementById("strikes");
  strikeBox.innerHTML = "";

  // Create image and display
  for (let i = 0; i < strikes; i++) {
    var img = document.createElement("img");
    img.src =
      "https://cdn.glitch.com/048acf4c-8575-4416-a5ca-7a61bb4f3ffc%2Fheart.png?v=1616555182311";
    img.style.height = "5vh";
    img.style.width = "5vh";
    document.getElementById("strikes").appendChild(img);
  }
}

// Set number of rounds from selected value
function setRounds(num) {
  numRounds = num;
}

// Fisher-Yates algorithm for shuffling array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Randomely display buttons
function randomizeButtons() {
  if(gamePlaying){
    var arr = [];
    for (let i = 1; i <= numButtons; i++) {
      arr.push(i);
    }
    // Shuffle order of buttons
    shuffleArray(arr);

    var area = document.getElementById("gameButtonArea");

    // Redraw the buttons in order
    area.innerHTML = "";
    for (let i = 0; i < numButtons; i++) {
      var btn = document.createElement("BUTTON"); // Create a <button> element
      btn.classList.add("gameBtn");
      btn.id = "button" + arr[i];

      btn.onmousedown = function() {
        startTone(arr[i]);
        mouseTimer = setInterval(function(){
          mouseTime+=10;
        }, 10);
      };
      btn.onmouseup = function() {
        stopTone();
        guess(arr[i]);
        clearInterval(mouseTimer);
        mouseTime = 0;
      };
      area.appendChild(btn);
    }

    // Give buttons appropriate size
    var btns = area.getElementsByTagName("button");
    for(let i = 0; i < btns.length; i++){
      btns[i].style.width = (Math.floor(100/Math.sqrt(numButtons)) - 2) + "%";
      btns[i].style.height = (Math.floor(100/Math.sqrt(numButtons)) - 2) + "%";
    }
  }
}

// Create game buttons and dispaly them
function setButtons(num) {
  numButtons = num;
  var area = document.getElementById("gameButtonArea");

  area.innerHTML = "";
  for (let i = 0; i < numButtons; i++) {
    var btn = document.createElement("BUTTON");
    btn.classList.add("gameBtn");
    btn.id = "button" + (i + 1);
    
    // on mouse down start timer and tone
    btn.onmousedown = function() {
      startTone(i + 1);
      mouseTimer = setInterval(function(){
        mouseTime+=10;
      }, 10);
    };
    
    // on mouse up stop timer and tone
    // do guess function on release
    btn.onmouseup = function() {
      stopTone();
      guess(i + 1);
      clearInterval(mouseTimer);
      mouseTime = 0;
    };
    area.appendChild(btn);
  }
  
  // Give buttons the appropriate size
  var btns = area.getElementsByTagName("button");
  for(let i = 0; i < btns.length; i++){
    btns[i].style.width = (Math.floor(100/Math.sqrt(numButtons)) - 2) + "%";
    btns[i].style.height = (Math.floor(100/Math.sqrt(numButtons)) - 2) + "%";
  }
}

// Function for guess timer called in setInterval
// Decrement total time until it reaches 0
function initializeTimer() {
  totalTime -= 10;
  drawTimer();
  if (totalTime <= 0 && strikes > 1) {
    wrongAns();
    strikes = strikes - 1;
    setStrikes(strikes);
    playClueSequence();
  } else if (totalTime <= 0) {
    wrongAns();
    loseGame();
  }
}

// Draw the timer in html
function drawTimer() {
  var boxes;
  if (totalTime > 2970) {
    boxes = 100;
  } else if (totalTime > 0) {
    boxes = Math.ceil(totalTime / 30);
  } else {
    boxes = 0;
  }

  var timerDiv = document.getElementById("timer");
  timerDiv.innerHTML = "";
  for (let i = 0; i < boxes; i++) {
    var div = document.createElement("div");
    div.classList.add("timerElement");
    timerDiv.appendChild(div);
  }
}

// Light up a button
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

// Unlight a button
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

// Play sound on wrong guess
function wrongAns() {
  document.getElementById("wrongAns").play();
}

// Sound Synthesis Functions
function playTone(btn, len) {
  o.frequency.value = baseFreq + freqInc * btn;
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = baseFreq + freqInc * btn;
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
