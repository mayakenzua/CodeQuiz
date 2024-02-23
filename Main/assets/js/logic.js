// add variables that keep track of the quiz "state"
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// add variables to reference DOM elements
// example is below
var questionsEl = document.getElementById("questions");
var questionTitleEl = document.getElementById("question-title");
var choicesEl = document.getElementById("choices");
var feedbackEl = document.getElementById("feedback");
var timeEl = document.getElementById("time");
var startBtn = document.getElementById("start");
var submitBtn = document.getElementById("submit");
var initialsEl = document.getElementById("initials");
var startScrnEL = document.getElementById("start-screen");

// reference the sound effects
var sfxRight = new Audio('assets/sfx/correct.wav');
var sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  startScrnEL.style.visibility = "hidden";

  // un-hide questions section
  questionsEl.style.display = "block";

  // start timer
  timerId = setInterval(clockTick, 1000);
  timeEl.textContent = time;

  // show starting time

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  var currentQuestion = questionsEl[currentQuestionIndex];
  // update title with current question
  questionTitleEl.textContent = currentQuestion.title;
  // clear out any old question choices
  choicesEl.innerHTML = '';
  // loop over the choices for each question
    // create a new button for each choice, setting the label and value for the button
  currentQuestion.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.value = choice; // Add value for checking answers
    choicesEl.appendChild(button);
  });
    // display the choice button on the page

  }

function questionClick(event) {
  // identify the targeted button that was clicked on
  var clickedButton = event.target;
  // if the clicked element is not a choice button, do nothing.
  if (clickedButton.tagName !== 'BUTTON') {
    return;
  }
  // check if user guessed wrong
  // if () {
  // if they got the answer wrong, penalize time by subtracting 15 seconds from the timer
  // recall the timer is the score they get at the end
  // if they run out of time (i.e., time is less than zero) set time to zero so we can end quiz
  // display new time on page
  // play "wrong" sound effect
  // display "wrong" feedback on page
  if (clickedButton.value !== questions[currentQuestionIndex].answer) {
    // Wrong answer
    time -= 15;
    timeEl.textContent = time;
    sfxWrong.play();
    feedbackEl.textContent = 'Incorrect!';
  } else {
  // play "right" sound effect
  // display "right" feedback on page by displaying the text "Correct!" in the feedback element
    // Correct answer
    sfxRight.play();
    feedbackEl.textContent = 'Correct!';
  }

  // Flash feedback
  feedbackEl.classList.add('show');
  setTimeout(() => {
    feedbackEl.classList.remove('show');
  }, 500);

  // Move to next question or end quiz
  currentQuestionIndex++;
  if (time <= 0 || currentQuestionIndex >= questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
// flash right/wrong feedback on page for half a second
// set the feedback element to have the class of "feedback"
feedbackEl.classList.add('show');
setTimeout(() => {
  feedbackEl.classList.remove('show');
}, 500);
// after one second, remove the "feedback" class from the feedback element
// move to next question
currentQuestionIndex++;
if (time <= 0 || currentQuestionIndex >= questions.length) {
  quizEnd();
} else {
  getQuestion();
}
// check if we've run out of questions
// if the time is less than zero and we have reached the end of the questions array,
// call a function that ends the quiz (quizEnd function)
// or else get the next question
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  // stop the timer
  clearInterval(timerId);
  // show end screen
  document.getElementById("end-screen").style.visibility = "visible";
  // show final score
  document.getElementById("final-score").textContent = time;
  // hide the "questions" section
  document.getElementById("questions").style.visibility = "hidden";
}

// add the code in this function to update the time, it should be called every second
function clockTick() {
  // right here - update time
  time--;
  // update the element to display the new time value
  timeEl.textContent = time;
  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

// complete the steps to save the high score
function saveHighScore() {
  // get the value of the initials input box
  const initials = initialsEl.value.trim();
  // make sure the value of the initials input box wasn't empty
  if (initials) {
    // Check for existing high scores. if none, set to empty array
    var highScores = JSON.parse(window.localStorage.getItem('highscores')) || [];
  // add the new initials and high score to the array
  // convert the array to a piece of text
  // store the high score in local storage
    var newScore = {
      initials: initials,
      score: time
    };
    // save to localstorage
    highscores.push(newScore);

    // Sort by score in descending order
    highScores.sort((a, b) => b.score - a.score);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));
  // otherwise, if there are high scores stored in local storage,
  // retrieve the local storage value that has the high scores,
  // convert it back to an array,
  // add the new initials and high score to the array,
  // then convert the array back to a piece of text,
  // then store the new array (converted to text) back in local storage

  // finally, redirect the user to the high scores page.
  window.location.href = 'highscores.html';
  }
}

// use this function when the user presses the "enter" key when submitting high score initials
function checkForEnter(event) {
  // if the user presses the enter key, then call the saveHighscore function
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;
initialsEl.onkeyup = checkForEnter;
