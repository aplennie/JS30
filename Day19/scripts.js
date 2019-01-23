const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

/* Webcam is gonna feed into out video element, and every few seconds, it will take a snapshot for the photo element/canvas for editing */

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }) // accessing user camera
    .then(localMediaStream => {

      video.srcObject = localMediaStream; // linking video object to the incoming stream
      video.play(); // play video so that it refreshes
    })
    .catch(err => {
      console.error(`OH NO!!!`, err);
    });
}

function paintToCanvas() { // fitting video dimensions to canvas
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height); // draws video on canvas, fits within canvas borders
    let pixels = ctx.getImageData(0, 0, width, height); // take pixels out
    // pixels = redEffect(pixels);
    pixels =  rgbSplit(pixels); // mess with them
    ctx.putImageData(pixels, 0, 0); // put them back
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play(); // play the shutter sound

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg'); // set image type as jpeg
  const link = document.createElement('a');
  link.href = data; // takes image data in the form of very long string of letters and numbers
  link.setAttribute('download', 'ugly'); // allows download when clicking thumbnails and has default image name
  link.innerHTML = `<img src="${data}" alt="u ugly" />`; // creating thumbnails of images
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas); //once the video is playing, it gives a canplay signal, we listen for this so we can update the canvas
