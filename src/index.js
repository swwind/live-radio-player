'use strict';

const fs = require('fs');

require.extensions['.vue'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const $ = (name) => document.querySelector(name);
const $$ = (name) => document.getElementById(name);

const playlist = require('./components/playlist');
const viewer = require('./components/viewer');

const _player = playlist('#play-list');
const _viewer = viewer('#effect-list');

if (localStorage.getItem('viewer cache')) {
  _viewer.importConfig(localStorage.getItem('viewer cache'));
}
if (localStorage.getItem('player cache')) {
  _player.importList(localStorage.getItem('player cache'));
}

const rtmp = require('./components/rtmp');
const _rtmp = rtmp('#rtmp', _viewer.stage, _player.destination.stream);

window._player = _player;

// save configurations to local
setInterval(() => {
  localStorage.setItem('viewer cache', _viewer.exportConfig());
  localStorage.setItem('player cache', _player.exportList());
}, 1000);

// render interval
const draw = (time) => {
  _viewer.render(_player.getInfo());
  requestAnimationFrame(draw);
}
draw();

// bind key
const dashboard = $('.dashboard');
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'Enter') {
    e.preventDefault();
    dashboard.classList.toggle('hide');
    document.body.classList.toggle('hide-cursor');
  }
});

