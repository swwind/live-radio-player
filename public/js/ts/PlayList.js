'use strict';

const fs = require('fs');
const path = require('path');

class PlayList {
  constructor() {
    this.elem = $('.play-list');
    this.files = new Map();
    this.audioElement = $('audio');
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSrc.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = maxFftSize;
    this.analyser.smoothingTimeConstant = 0.1;
    this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
    this.startedTime = NaN;
    this.trackInfo = {};
    this.cssc = new CssController();
  }

  addTrackFromFile(file) {
    const token = randomToken(6);
    const item = { type: 'file', path: file.path, name: file.name };
    this.files.set(token, item);
    const elem = this._createItemElement(token, file.name);
    this.elem.appendChild(elem);
    return token;
  }

  addTrackFromUrl(url, name, id) {
    const token = randomToken(6);
    const item = { type: 'url', url, name, id };
    this.files.set(token, item);
    const elem = this._createItemElement(token, name);
    this.elem.appendChild(elem);
    return token;
  }

  importList(str) {
    const list = JSON.parse(str);
    list.forEach((item) => {
      if (item.type === 'file') {
        this.addTrackFromFile(item);
      }
      if (item.type === 'url') {
        this.addTrackFromUrl(item.url, item.name, item.id);
      }
    });
  }

  exportList() {
    return JSON.stringify(Array.from(this.files.values()));
  }

  _createItemElement(token, name) {
    const div = document.createElement('div');
    div.classList.add('list-item');
    div.setAttribute('id', token);
    div.appendChild(spanButton(name, name, (e) => {
      this.playTrackFrom(token);
    }, 'flex1'));
    div.appendChild(spanButton('^', 'move up', (e) => {
      moveUpElement(e.target.parentNode);
    }));
    div.appendChild(spanButton('v', 'move down', (e) => {
      moveDownElement(e.target.parentNode);
    }));
    div.appendChild(spanButton('x', 'remove', (e) => {
      this.removeTrack(token);
    }));
    return div;
  }

  loadTrackInfo(token) {
    const track = this.files.get(token);

    if (!token) {
      return new Promise((resolve, reject) => reject('Token not found'));
    }

    // load from file
    if (track.type === 'file') {

      return new Promise((resolve, reject) => {

        const url = 'file://' + track.path;
        const extension = path.extname(track.path);
        const defaultName = path.basename(track.path, extension);

        parseTrackInfo(track.path).then((data) => {
          data.title = data.title || defaultName;
          resolve({ data, token, url });
        }).catch((err) => {
          data = { title: defaultName };
          resolve({ data, token, url });
        });
      });

    }

    // load from url
    if (track.type === 'url') {

      return new Promise((resolve, reject) => {

        const url = track.url;
        const defaultName = decodeURIComponent(track.name.replace(/\.[^\.]+$/i, ''));

        parseTrackInfoFromNetEaseCloudMusic(track.id, defaultName).then((data) => {
          resolve({ data, token, url });
        }, reject);
      });

    }

    throw 'Unknow track type';
  }

  playTrackFrom(token) {
    this.loadTrackInfo(token)
      .then(this.playTrackByInfo.bind(this), console.error);
  }

  registerNextTrack(token) {
    this.loadTrackInfo(token).then((data) => {
      this.audioElement.onended = () => {
        this.playTrackByInfo(data);
      }
    }).catch((err) => {
      console.error(err);
      this.registerNextTrack(this.getNextTrackToken(token));
    });
  }

  getNextTrackToken(token) {
    const elem = $$(token);
    if (!elem || !elem.nextElementSibling) {
      return this.elem.firstChild.getAttribute('id');
    } else {
      return elem.nextElementSibling.getAttribute('id');
    }
  }

  playTrackByInfo({ data, buffer, token, url }) {
    $('.playing') && $('.playing').classList.remove('playing');
    $$(token).classList.add('playing');
    this.cssc.set('--album-cover', 'url(' + (data.cover || '/img/default-cover.svg') + ')');
    this.trackInfo = data;
    this.audioElement.src = url;
    this.registerNextTrack(this.getNextTrackToken(token));
  }

  removeTrack(token) {
    this.files.delete(token);
    $$(token) && $$(token).remove();
  }

  removeAll() {
    Array.from(this.files.keys()).forEach(this.removeTrack.bind(this));
  }

  getInfo() {
    this.analyser.getByteFrequencyData(this.frequency);
    const high = this.frequency.reduce((a, b) => a + b, 0) / (this.frequency.length * 255);
    return {
      frequency: this.frequency,
      trackInfo: this.trackInfo,
      duration: this.audioElement.duration,
      progress: this.audioElement.currentTime,
      high
    };
  }

  loadNetEaseCloudMusicPlayList(id) {
    backend.netease.playlist(id).then((res) => {
      res.playlist.tracks.map((track) => {
        this.addTrackFromUrl(
          `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`,
          track.name, track.id);
      });
    }, (err) => {
      alert('Error loading playlist\nPlease try again or send issues to us.');
    });
  }
}
