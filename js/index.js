'use strict';

const $ = (name) => document.querySelector(name);
const $$ = (name) => document.getElementById(name);

const dashboard = $('.dashboard');

const playList = new PlayList();

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'KeyE') {
    e.preventDefault();
    dashboard.classList.toggle('hide');
    document.body.classList.toggle('hide-cursor');
  }
});
$('#add-music-btn').addEventListener('click', (e) => {
  Array.from($('#add-music').files)
    .forEach(playList.addTrack.bind(playList));
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
});
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.items) {
    for (var i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === 'file') {
        playList.addTrack(e.dataTransfer.items[i].getAsFile());
      }
    }
  } else {
    for (var i = 0; i < e.dataTransfer.files.length; i++) {
      playList.addTrack(e.dataTransfer.files[i]);
    }
  } 
});
$('#add-effect').addEventListener('click', (e) => {
  const effectType = $('#effect-type').selectedOptions[0].value;
  viewer.addComp(new (getClassByName(effectType)));
});

const viewer = new Viewer();

const draw = (time) => {
  viewer.render(playList.getInfo());
  requestAnimationFrame(draw);
}
draw();

if (localStorage.getItem('viewer cache')) {
  viewer.importConfig(localStorage.getItem('viewer cache'));
}

// save changes to local
setInterval(() => {
  localStorage.setItem('viewer cache', viewer.exportConfig());
}, 1000);



