'use strict';

var audioContext, analyser, frequency, source, getByteFrequencyDataAverage, elPath;

window.AudioContext = window.AudioContext || window.webkitAudioContext;

document.querySelector('.vhf').innerHTML = '<div class="vh"></div>'.repeat(spectrumSize);
var hs = Array.prototype.slice.call(document.querySelectorAll('.vh'));

function draw() {
    analyser.getByteFrequencyData(frequency);
    const spectrum = getTransformedSpectrum(frequency);
    hs.forEach((elem, i) => {
      elem.style.height = spectrum[i] + 'px';
    });
    requestAnimationFrame(draw);
}

function loadSampleAudio() {

  audioContext = new window.AudioContext();

  source = audioContext.createBufferSource();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = maxFftSize;
  analyser.smoothingTimeConstant = 0.1;
  frequency = new Uint8Array(analyser.frequencyBinCount);

  // Connect audio processing graph
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  loadAudioBuffer('/千菅春香%20-%20Pray.mp3');
}

function loadAudioBuffer(url) {
  // Load asynchronously
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(
      request.response,
      function(buffer) {
        finishLoad(buffer);
      },
      function(e) {
        console.log(e);
      }
    );
  };
  request.send();
}

function finishLoad(buffer) {
  source.buffer = buffer;
  source.loop = true;
  source.start(0.0);
  draw();
}
loadSampleAudio();

