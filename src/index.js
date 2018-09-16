'use strict';

const $ = (name) => document.querySelector(name);
const $$ = (name) => document.getElementById(name);

const PlayList = require('./components/PlayList.js');
const Viewer = require('./components/Viewer.js');

const dashboard = $('.dashboard');

const playList = PlayList();

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'Enter') {
    e.preventDefault();
    dashboard.classList.toggle('hide');
    document.body.classList.toggle('hide-cursor');
  }
});

const viewer = Viewer();

// viewer cache
if (localStorage.getItem('viewer cache')) {
  viewer.importConfig(localStorage.getItem('viewer cache'));
}
if (localStorage.getItem('player cache')) {
  playList.importList(localStorage.getItem('player cache'));
}

// save configurations to local
setInterval(() => {
  localStorage.setItem('viewer cache', viewer.exportConfig());
  localStorage.setItem('player cache', playList.exportList());
}, 1000);

// render interval
const draw = (time) => {
  viewer.render(playList.getInfo());
  requestAnimationFrame(draw);
}
draw();
