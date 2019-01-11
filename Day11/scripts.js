// get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressFilled = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]'); // needs querySelectorAll because there are 2 items, using data-skip because the play button uses the player__button class
const ranges = player.querySelectorAll('.player__slider');

// build functions
function togglePlay() {
  if(video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
// or use const method = video.paused ? 'play' : 'pause';
// video[method]()
function updateButton() {
  if(video.paused) { // can also use the ? X : Y; format here
    toggle.innerHTML = '►'
  } else {
    toggle.innerHTML = '▌▌';
  }
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip); // gets value from data property skip, data-skip
}

function handleRangeUpdate() {
  video[this.name] = this.value; // this HTML element already contains playbackRate and volume properties, we are just updating the html elements with those property values.
}

function handleProgress() {
  const percent = (video.currentTime/video.duration) * 100; // calculate percent of video left
  progressFilled.style.flexBasis = `${percent}%`  // update length of progress bar element according to percentage
}

function scrubadubdub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; // finding at what percent the user clicked, then converting that to what time the player should scrub to
  video.currentTime = scrubTime;
}

// hook up event listeners
toggle.addEventListener('click', togglePlay); // play/pause when clicked
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton); // these change the button when the video is paused/played
video.addEventListener('timeupdate', handleProgress); // updates progress bar as video is playing (or time is updating)
video.addEventListener('pause', updateButton);

skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrubadubdub);
progress.addEventListener('mousemove', (e) => mousedown && scrubadubdub(e)); // checks if mouse is clicked down, then starts scrubbing
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
