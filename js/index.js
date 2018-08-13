'use strict';

const $ = (name) => document.querySelector(name);
const $$ = (name) => document.getElementById(name);
const cssc = new CssController();

const dashboard = $('.dashboard');
const playList = new Map();
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
      analyser.fftSize = maxFftSize;
      analyser.smoothingTimeConstant = 0.1;
const frequency = new Uint8Array(analyser.frequencyBinCount);
analyser.connect(audioContext.destination);

let source = null;
let playingToken;
let trackInfo = {};
let duration;
let startedTime;
let stoped = true;

const playTrack = (token) => {
  const file = playList.get(token);
  if (!file) {
    throw 'Track not found';
  }
  openFile(file, (buffer) => {
    source && stop();
    stoped = false;
    source = audioContext.createBufferSource();
    source.connect(analyser);
    source.buffer = buffer;
    source.start(0);
    playingToken = token;
    $$(token).classList.add('playing');
    duration = buffer.duration;
    startedTime = new Date();
  });
}

const playNext = (token) => {
  stoped = true;
  const elem = $$(token);
  const nextNode = (elem && elem.nextElementSibling) ? elem.nextElementSibling : $('.playlist').firstChild;
  return playTrack(nextNode.getAttribute('id'));
}

const addTrack = (file) => {
  const token = md5(`${Math.random()}`).slice(0, 8);
  playList.set(token, file);
  const div = document.createElement('div');
  div.classList.add('list-item');
  div.setAttribute('id', token);
  const span1 = document.createElement('span');
  span1.innerText = file.name;
  div.appendChild(span1);
  const span2 = document.createElement('span');
  span2.classList.add('remove');
  span2.innerHTML = 'x';
  span2.addEventListener('click', (e) => {
    removeTrack(token);
  });
  div.appendChild(span2);
  const span3 = document.createElement('span');
  span3.classList.add('play');
  span3.innerHTML = '+';
  span3.addEventListener('click', (e) => {
    playTrack(token);
  });
  div.appendChild(span3);
  $('.playlist').appendChild(div);
}
const removeTrack = (token) => {
  playList.delete(token);
  $$(token).remove();
}

const openFile = (file, callback) => {
  var reader = new FileReader();
  var reader2 = new FileReader();
  reader.onload = (e) => {
    audioContext.decodeAudioData(e.target.result, callback, console.error);
  };
  reader2.onload = (e) => {
    const res = parseTrackInfo(e.target.result);
    cssc.set('--album-cover', 'url(' + res.cover + ')');
    trackInfo = res;
  }
  reader.readAsArrayBuffer(file);
  reader2.readAsBinaryString(file);
}

const stop = () => {
  stoped = true;
  if (source) {
    source.stop(0);
    source = null;
    if ($$(playingToken)) {
      $$(playingToken).classList.remove('playing');
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'KeyE') {
    e.preventDefault();
    dashboard.classList.toggle('hide');
  }
});
$('#add-music-btn').addEventListener('click', (e) => {
  Array.from($('#add-music').files).forEach(addTrack);
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
});
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.items) {
    for (var i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === 'file') {
        addTrack(e.dataTransfer.items[i].getAsFile());
      }
    }
  } else {
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      addTrack(e.dataTransfer.files[i]);
    }
  } 
});
$('#skip-play').addEventListener('click', () => playNext(playingToken));
$('#stop-play').addEventListener('click', stop);
$('#add-effect').addEventListener('click', (e) => {
  viewer.addComp(eval(`new ${$('#effect-type').selectedOptions[0].value}()`));
})

const viewer = new Viewer(document.body);

const draw = (time) => {
  analyser.getByteFrequencyData(frequency);
  const progress = (new Date() - startedTime) / 1000;
  viewer.render({ frequency, trackInfo, duration, progress });
  if (!stoped && progress > duration) {
    playNext(playingToken);
  }
  requestAnimationFrame(draw);
}
draw();

if (localStorage.getItem('viewer cache')) {
  viewer.importConfig(localStorage.getItem('viewer cache'));
}

setInterval(() => {
  localStorage.setItem('viewer cache', viewer.exportConfig());
}, 1000);


