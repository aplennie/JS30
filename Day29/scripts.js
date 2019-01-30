let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time')
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds) {
  // clear existing timers
  clearInterval(countdown);

  const now = Date.now(); // get current time
  const then = now + seconds * 1000; // add current time to time you want to run timer for
  displayTimeLeft(seconds);
  displayEndTime(then);

  setInterval(() => { // to display how much time is left
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we need to stop, so it doesnt go to neg nums
    if(secondsLeft < 0) {
      clearInterval(countdown); // if less than 0, reset seconds
      return;
    }
    displayTimeLeft(secondsLeft); // displays result
  }, 1000);
}


function displayTimeLeft(seconds) { // shows timer on screen
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`; // accounts for padded 0
  document.title = display; // display timer in tab
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) { // shows time when timer will finish
  const end = new Date(timestamp);
  const hour = end.getHours(); // get hour value from timestamp
  const minutes = end.getMinutes(); // get minute value from timestamp
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time); // uses timer value from selected data-time element
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) { // set custom timer value
  e.preventDefault() // prevent page form reloading on submit
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
})
